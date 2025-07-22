import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import Review from '../../../../models/Reviews';


export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    const reviews = await Review.find({ productId: id, isApproved: true }).sort({ createdAt: -1 });
    
    let totalRating = 0;
    reviews.forEach(review => {
      totalRating += review.rating;
    });
    const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;
    
    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      ratingCounts[review.rating]++;
    });
    
    const ratingPercentages = {};
    if (reviews.length > 0) {
      for (const rating in ratingCounts) {
        ratingPercentages[rating] = ((ratingCounts[rating] / reviews.length) * 100).toFixed(0);
      }
    } else {
      for (const rating in ratingCounts) {
        ratingPercentages[rating] = '0';
      }
    }
    
    return NextResponse.json({
      success: true,
      data: {
        reviews,
        averageRating,
        ratingCounts,
        ratingPercentages,
        totalReviews: reviews.length
      }
    });
  } catch (error) {
    console.error('Error in GET /api/reviews/product/[id]:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}