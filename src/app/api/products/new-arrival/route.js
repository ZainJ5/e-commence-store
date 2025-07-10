import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Product from '../../../models/product';
import Category from '../../../models/categories'; 
import Type from '../../../models/type';         

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const products = await Product.find({
      productTags: 'new-arrival',
      isActive: true
    })
      .populate('category')
      .populate('type')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Product.countDocuments({
      productTags: 'new-arrival',
      isActive: true
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }, { status: 200 });
  } catch (error) {
    console.error('GET new arrival products error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
