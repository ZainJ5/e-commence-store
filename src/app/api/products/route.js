import { NextResponse } from 'next/server';
import connectToDatabase from '../../lib/mongodb';
import Product from '../../models/product';
import cloudinary from '../../lib/cloudinary';
import jwt from 'jsonwebtoken';

// Middleware to verify JWT token
const verifyToken = async (request) => {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.split(' ')[1];
    const secretKey = process.env.JWT_SECRET;
    
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

export async function GET(request) {
  try {
    // You can enable this in production
    // const user = await verifyToken(request);
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    await connectToDatabase();
    const products = await Product.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error('GET products error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // You can enable this in production
    // const user = await verifyToken(request);
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    await connectToDatabase();
    const data = await request.formData();
    
    const image = data.get('image');
    
    let imageUrl = '';
    
    if (image) {
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
    const sizes = data.get('size') ? JSON.parse(data.get('size')) : [];
    const colors = data.get('color') ? JSON.parse(data.get('color')) : [];
    
    const product = await Product.create({
      name: data.get('name'),
      description: data.get('description'),
      originalPrice: data.get('originalPrice'),
      discountedPrice: data.get('discountedPrice') || null,
      category: data.get('category') || null,
      gender: data.get('gender') || 'unisex',
      size: sizes,
      color: colors,
      stock: data.get('stock') || 0,
      image: imageUrl,
      isActive: data.get('isActive') === 'true'
    });
    
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}