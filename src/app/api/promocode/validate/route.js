import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import PromoCode from '../../../models/PromoCode';

export async function POST(request) {
  try {
    await connectToDatabase();

    const { code, orderAmount } = await request.json();
    
    if (!code) {
      return NextResponse.json({
        success: false,
        message: 'Promo code is required',
      }, { status: 400 });
    }

    const promoCode = await PromoCode.findOne({ 
      code: new RegExp(`^${code}$`, 'i'),
      isActive: true 
    });

    if (!promoCode) {
      return NextResponse.json({
        success: false,
        message: 'Invalid or expired promo code',
      }, { status: 400 });
    }

    if (orderAmount < promoCode.minOrderAmount) {
      return NextResponse.json({
        success: false,
        message: `This promo code requires a minimum order of Rs ${promoCode.minOrderAmount}`,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Promo code applied successfully',
      promoCode: {
        _id: promoCode._id,
        code: promoCode.code,
        discountPercentage: promoCode.discountPercentage,
        minOrderAmount: promoCode.minOrderAmount
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Validate promo code error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Error validating promo code',
      error: error.message
    }, { status: 500 });
  }
}