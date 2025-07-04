import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Product from '../../../models/product';
import cloudinary from '../../../lib/cloudinary';

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error('GET product error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const data = await request.formData();
    
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Handle image upload if there's a new image
    const image = data.get('image');
    let imageUrl = product.image; // Keep existing image by default
    
    if (image && image instanceof File) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'ecommerce-products' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.write(buffer);
        uploadStream.end();
      });
      
      imageUrl = uploadResult.secure_url;
    }
    
    // Parse arrays that were stringified for FormData
    const sizes = data.get('size') ? JSON.parse(data.get('size')) : product.size;
    const colors = data.get('color') ? JSON.parse(data.get('color')) : product.color;
    
    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: data.get('name') || product.name,
        description: data.get('description') || product.description,
        originalPrice: data.get('originalPrice') || product.originalPrice,
        discountedPrice: data.get('discountedPrice') || null,
        category: data.get('category') || product.category,
        gender: data.get('gender') || product.gender,
        size: sizes,
        color: colors,
        stock: data.get('stock') || product.stock,
        image: imageUrl,
        isActive: data.get('isActive') === 'true'
      },
      { new: true }
    );
    
    return NextResponse.json({ product: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error('PUT product error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const data = await request.json();
    
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Update only the fields provided in the request
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
    
    return NextResponse.json({ product: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error('PATCH product error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Delete image from Cloudinary if exists
    if (product.image && product.image.includes('cloudinary.com')) {
      const publicId = product.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`ecommerce-products/${publicId}`);
    }
    
    await Product.findByIdAndDelete(id);
    
    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('DELETE product error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}