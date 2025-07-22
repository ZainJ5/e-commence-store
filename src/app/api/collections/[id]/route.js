import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Product from '../../../models/product';


export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    
    const collectionId = params.id;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;
    
    let query = { isActive: true };
    let validCollection = true;
    
    if (collectionId === 'men') {
      query.gender = { $in: ['men', 'unisex'] };
    } else if (collectionId === 'women') {
      query.gender = { $in: ['women', 'unisex'] };
    } else if (collectionId === 'kids') {
      query.gender = 'kids';
    } else if (collectionId === 'customizable') {
      query.customizable = true;
    } else if (collectionId === 'sale') {
      query.discountedPrice = { $ne: null, $gt: 0 };
    } else if (['new-arrival', 'featured', 'mr-shah-collection'].includes(collectionId)) {
      query.productTags = collectionId;
    } else {
      if (mongoose.Types.ObjectId.isValid(collectionId)) {
        query.category = new mongoose.Types.ObjectId(collectionId);
      } else {
        validCollection = false;
      }
    }
    
    if (!validCollection) {
      return NextResponse.json({
        products: [],
        collection: collectionId,
        error: "Invalid collection identifier",
        pagination: {
          total: 0,
          page,
          limit,
          pages: 0
        }
      }, { status: 404 });
    }
    
    const totalProducts = await Product.countDocuments(query);
    
    if (totalProducts === 0) {
      return NextResponse.json({
        products: [],
        collection: collectionId,
        pagination: {
          total: 0,
          page,
          limit,
          pages: 0
        }
      }, { status: 200 });
    }
    
    const products = await Product.find(query)
      .populate('category')
      .populate('type')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    return NextResponse.json({
      products,
      collection: collectionId,
      pagination: {
        total: totalProducts,
        page,
        limit,
        pages: Math.ceil(totalProducts / limit)
      }
    }, { status: 200 });
  } catch (error) {
    console.error(`GET collection ${params.id} error:`, error);
    return NextResponse.json({ 
      error: error.message,
      products: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 0,
        pages: 0
      }
    }, { status: 500 });
  }
}