import { NextResponse } from 'next/server';
import connectToDatabase from '../../lib/mongodb';
import PromoCode from '../../models/PromoCode';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

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

export async function GET(request) {
  try {
    const decodedToken = await verifyToken(request);
    if (!decodedToken || !decodedToken.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    await connectToDatabase();
    const promoCodes = await PromoCode.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, promoCodes });
  } catch (error) {
    console.error('Error getting promo codes:', error);
    return NextResponse.json({ error: 'Failed to retrieve promo codes' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const decodedToken = await verifyToken(request);
    if (!decodedToken || !decodedToken.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    await connectToDatabase();
    
    const body = await request.json();
    const { code, discountPercentage, minOrderAmount } = body;
    
    if (!code) {
      return NextResponse.json({ error: "Promo code is required" }, { status: 400 });
    }
    
    const existingCode = await PromoCode.findOne({ code: code.toUpperCase() });
    if (existingCode) {
      return NextResponse.json({ error: "Promo code already exists" }, { status: 400 });
    }

    const discountValue = Number(discountPercentage);
    if (isNaN(discountValue) || discountValue <= 0 || discountValue > 100) {
      return NextResponse.json({ 
        error: "Discount percentage must be between 1 and 100" 
      }, { status: 400 });
    }

    const promoCode = await PromoCode.create({
      code: code.toUpperCase(),
      discountPercentage: discountValue,
      minOrderAmount: Number(minOrderAmount) || 0,
    });

    return NextResponse.json({ success: true, promoCode }, { status: 201 });
  } catch (error) {
    console.error('Error creating promo code:', error);
    return NextResponse.json({ error: 'Failed to create promo code' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const decodedToken = await verifyToken(request);
    if (!decodedToken || !decodedToken.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Promo code ID is required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid promo code ID format" }, { status: 400 });
    }

    const deletedPromoCode = await PromoCode.findByIdAndDelete(id);

    if (!deletedPromoCode) {
      return NextResponse.json({ error: "Promo code not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Promo code deleted successfully" });
  } catch (error) {
    console.error('Error deleting promo code:', error);
    return NextResponse.json({ error: 'Failed to delete promo code' }, { status: 500 });
  }
}