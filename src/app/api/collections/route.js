import { NextResponse } from 'next/server';
import connectToDatabase from '../../lib/mongodb';
import Product from '../../models/product';

export async function GET(request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;
    
    const totalProducts = await Product.countDocuments({ isActive: true });
    
    const products = await Product.find({ isActive: true })
      .populate('category')
      .populate('type')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    return NextResponse.json({
      products,
      pagination: {
        total: totalProducts,
        page,
        limit,
        pages: Math.ceil(totalProducts / limit)
      }
    }, { status: 200 });
  } catch (error) {
    console.error('GET collections error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}