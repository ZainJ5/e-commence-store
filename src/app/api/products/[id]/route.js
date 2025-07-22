import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Product from '../../../models/product';
import Category from '../../../models/categories'; 
import Type from '../../../models/type'; 
import cloudinary from '../../../lib/cloudinary';
import jwt from 'jsonwebtoken';

const verifyToken = async (request) => {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    const token = authHeader.split(' ')[1];
    const secretKey = process.env.JWT_SECRET || "bcfce0c01316be944450bebe732cb858";
    if (!secretKey) return null;
    return jwt.verify(token, secretKey);
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

const uploadImages = async (images) => {
  const uploadPromises = images.map(async (image) => {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: 'ecommerce-products',
          resource_type: 'image',
          transformation: [
            { width: 1000, height: 1000, crop: 'limit' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        }
      );
      uploadStream.write(buffer);
      uploadStream.end();
    });
  });
  return Promise.all(uploadPromises);
};

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const product = await Product.findById(id).populate('category').populate('type');
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error('GET product error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await verifyToken(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const { id } = params;
    const data = await request.formData();
    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    let imageUrls = [...(product.images || [])];
    const existingImages = data.get('existingImages') ? JSON.parse(data.get('existingImages')) : null;
    if (existingImages !== null) imageUrls = [...existingImages];

    const newImages = data.getAll('images');
    if (newImages && newImages.length > 0) {
      const validImages = newImages.filter(img => img.size > 0);
      if (imageUrls.length + validImages.length > 10)
        return NextResponse.json({ error: 'Cannot have more than 10 images total' }, { status: 400 });
      if (validImages.length > 0) {
        const newImageUrls = await uploadImages(validImages);
        imageUrls = [...imageUrls, ...newImageUrls];
      }
    }

    const sizes = data.get('size') ? JSON.parse(data.get('size')) : product.size;
    const colors = data.get('color') ? JSON.parse(data.get('color')) : product.color;
    const productTags = data.get('productTags') ? JSON.parse(data.get('productTags')) : product.productTags;
    const fabric = data.get('fabric') || product.fabric;
    const customizable = data.get('customizable') === 'true';

    const name = data.get('name') || product.name;
    const originalPrice = data.get('originalPrice') || product.originalPrice;
    const category = data.get('category') || product.category;
    const type = data.get('type') || product.type;
    const stock = data.get('stock') !== null ? data.get('stock') : product.stock;

    if (!name || !originalPrice || !category || !type || stock === null) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, originalPrice, category, type, and stock are required' 
      }, { status: 400 });
    }

    const discountedPrice = data.get('discountedPrice') ? parseFloat(data.get('discountedPrice')) : null;
    if (discountedPrice && discountedPrice >= parseFloat(originalPrice)) {
      return NextResponse.json({ error: 'Discounted price must be less than original price' }, { status: 400 });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description: data.get('description') || product.description,
        originalPrice: parseFloat(originalPrice),
        discountedPrice,
        category,
        type,
        gender: data.get('gender') || product.gender,
        size: sizes,
        color: colors,
        fabric,
        customizable,
        stock: parseInt(stock),
        images: imageUrls,
        isActive: data.get('isActive') === 'true',
        productTags
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ product: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error('PUT product error:', error);
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({ error: errorMessages.join(', ') }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const user = await verifyToken(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const { id } = params;
    const data = await request.json();
    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    if (data.discountedPrice && data.originalPrice && data.discountedPrice >= data.originalPrice) {
      return NextResponse.json({ error: 'Discounted price must be less than original price' }, { status: 400 });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ product: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error('PATCH product error:', error);
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({ error: errorMessages.join(', ') }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await verifyToken(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();
    const { id } = params;
    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map(imageUrl => {
        if (imageUrl.includes('cloudinary.com')) {
          const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
          return cloudinary.uploader.destroy(`ecommerce-products/${publicId}`);
        }
        return Promise.resolve();
      });
      await Promise.all(deletePromises);
    }

    await Product.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('DELETE product error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
