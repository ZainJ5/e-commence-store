import { NextResponse } from 'next/server';
import connectToDatabase from '../../lib/mongodb';
import Product from '../../models/product';
import Category from '../../models/SiteStatus'; // Import Category model
import Type from '../../models/type'; // Import Type model
import cloudinary from '../../lib/cloudinary';
import jwt from 'jsonwebtoken';

const verifyToken = async (request) => {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.split(' ')[1];
    const secretKey = process.env.JWT_SECRET || "bcfce0c01316be944450bebe732cb858";
    
    if (!secretKey) {
      console.error('JWT_SECRET not found in environment variables');
      return null;
    }
    
    const decoded = jwt.verify(token, secretKey);
    return decoded;
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

export async function GET(request) {
  try {
    await connectToDatabase();
    const products = await Product.find({})
      .populate('category')
      .populate('type')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error('GET products error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const data = await request.formData();
    
    const images = data.getAll('images');
    let imageUrls = [];
    
    if (images && images.length > 0) {
      const validImages = images.filter(img => img.size > 0);
      
      if (validImages.length > 10) {
        return NextResponse.json({ error: 'Cannot upload more than 10 images' }, { status: 400 });
      }
      
      if (validImages.length > 0) {
        imageUrls = await uploadImages(validImages);
      }
    }
    
    const sizes = data.get('size') ? JSON.parse(data.get('size')) : [];
    const colors = data.get('color') ? JSON.parse(data.get('color')) : [];
    const productTags = data.get('productTags') ? JSON.parse(data.get('productTags')) : [];
    
    const name = data.get('name');
    const originalPrice = data.get('originalPrice');
    const category = data.get('category');
    const type = data.get('type');
    const stock = data.get('stock');
    
    if (!name || !originalPrice || !category || !type || stock === null) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, originalPrice, category, type, and stock are required' 
      }, { status: 400 });
    }
    
    const productData = {
      name,
      description: data.get('description') || '',
      originalPrice: parseFloat(originalPrice),
      discountedPrice: data.get('discountedPrice') ? parseFloat(data.get('discountedPrice')) : null,
      category: category,
      type: type,
      size: sizes,
      color: colors,
      gender: data.get('gender') || 'unisex',
      stock: parseInt(stock),
      images: imageUrls,
      isActive: data.get('isActive') === 'true',
      productTags
    };
    
    if (productData.discountedPrice && productData.discountedPrice >= productData.originalPrice) {
      return NextResponse.json({ 
        error: 'Discounted price must be less than original price' 
      }, { status: 400 });
    }
    
    const product = await Product.create(productData);
    
    // Return the created product without additional population to avoid issues
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("POST API Error:", error);
    
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({ error: errorMessages.join(', ') }, { status: 400 });
    }
    
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const data = await request.formData();
    
    const productId = data.get('id');
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }
    
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    let imageUrls = [];
    
    const existingImages = data.get('existingImages') ? JSON.parse(data.get('existingImages')) : [];
    imageUrls = [...existingImages];
    
    const newImages = data.getAll('images');
    if (newImages && newImages.length > 0) {
      const validImages = newImages.filter(img => img.size > 0);
      
      if (imageUrls.length + validImages.length > 10) {
        return NextResponse.json({ error: 'Cannot have more than 10 images total' }, { status: 400 });
      }
      
      if (validImages.length > 0) {
        const newImageUrls = await uploadImages(validImages);
        imageUrls = [...imageUrls, ...newImageUrls];
      }
    }
    
    const sizes = data.get('size') ? JSON.parse(data.get('size')) : [];
    const colors = data.get('color') ? JSON.parse(data.get('color')) : [];
    const productTags = data.get('productTags') ? JSON.parse(data.get('productTags')) : [];
    
    const name = data.get('name');
    const originalPrice = data.get('originalPrice');
    const category = data.get('category');
    const type = data.get('type');
    const stock = data.get('stock');
    
    if (!name || !originalPrice || !category || !type || stock === null) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, originalPrice, category, type, and stock are required' 
      }, { status: 400 });
    }
    
    const updateData = {
      name,
      description: data.get('description') || '',
      originalPrice: parseFloat(originalPrice),
      discountedPrice: data.get('discountedPrice') ? parseFloat(data.get('discountedPrice')) : null,
      category: category,
      type: type,
      size: sizes,
      color: colors,
      gender: data.get('gender') || 'unisex',
      stock: parseInt(stock),
      images: imageUrls,
      isActive: data.get('isActive') === 'true',
      productTags
    };
    
    if (updateData.discountedPrice && updateData.discountedPrice >= updateData.originalPrice) {
      return NextResponse.json({ 
        error: 'Discounted price must be less than original price' 
      }, { status: 400 });
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );
    
    return NextResponse.json({ product: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error("PUT API Error:", error);
    
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({ error: errorMessages.join(', ') }, { status: 400 });
    }
    
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }
    
    await connectToDatabase();
    
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map(imageUrl => {
        const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
        return cloudinary.uploader.destroy(`ecommerce-products/${publicId}`);
      });
      
      await Promise.all(deletePromises);
    }
    
    await Product.findByIdAndDelete(productId);
    
    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error("DELETE API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}