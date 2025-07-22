import { NextResponse } from 'next/server';
import connectToDatabase from '../../lib/mongodb';
import Order from '../../models/Order';
import PromoCode from '../../models/PromoCode'; 
import cloudinary from '../../lib/cloudinary';

const uploadReceipt = async (base64Image) => {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: 'receipts',
      resource_type: 'image',
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('Error uploading receipt to Cloudinary:', error);
    throw new Error('Failed to upload receipt image');
  }
};

export async function POST(request) {
  try {
    await connectToDatabase();

    const orderData = await request.json();

    if (!orderData.orderId) {
      const prefix = 'ORD';
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      const timestamp = new Date().getTime().toString().slice(-4);
      orderData.orderId = `${prefix}-${randomNum}-${timestamp}`;
    }

    if (['easypaisa', 'jazzcash'].includes(orderData.payment.method) && orderData.payment.receiptImage) {
      try {
        const { url, publicId } = await uploadReceipt(orderData.payment.receiptImage);
        orderData.payment.receiptImage = url;
        orderData.payment.receiptPublicId = publicId;
      } catch (error) {
        return NextResponse.json({
          success: false,
          message: 'Error uploading receipt image',
          error: error.message
        }, { status: 500 });
      }
    }

    if (orderData.payment.promoCode && orderData.payment.promoCode.code) {
      try {
        const promoCode = await PromoCode.findOne({ 
          code: orderData.payment.promoCode.code.toUpperCase(),
          isActive: true 
        });

        if (!promoCode) {
          return NextResponse.json({
            success: false,
            message: 'Invalid or inactive promo code',
          }, { status: 400 });
        }

        if (orderData.payment.subtotal < promoCode.minOrderAmount) {
          return NextResponse.json({
            success: false,
            message: `This promo code requires a minimum order of ${promoCode.minOrderAmount}`,
          }, { status: 400 });
        }

        orderData.payment.promoCode = {
          code: promoCode.code,
          discountPercentage: promoCode.discountPercentage,
          promoCodeId: promoCode._id
        };

        if (!orderData.payment.discount || orderData.payment.discount === 0) {
          orderData.payment.discount = (orderData.payment.subtotal * promoCode.discountPercentage / 100).toFixed(2);
          orderData.payment.total = (
            orderData.payment.subtotal + 
            orderData.payment.shipping + 
            orderData.payment.tax - 
            orderData.payment.discount
          ).toFixed(2);
        }
      } catch (error) {
        console.error('Promo code validation error:', error);
        return NextResponse.json({
          success: false,
          message: 'Error validating promo code',
          error: error.message
        }, { status: 500 });
      }
    }

    const order = new Order(orderData);
    const savedOrder = await order.save();

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: savedOrder
    }, { status: 201 });

  } catch (error) {
    console.error('Create order error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      
      return NextResponse.json({
        success: false,
        message: 'Validation error',
        errors: validationErrors
      }, { status: 400 });
    }
    
    if (error.code === 11000) {
      return NextResponse.json({
        success: false,
        message: 'Order ID already exists',
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      message: 'Error creating order',
      error: error.message
    }, { status: 500 });
  }
}