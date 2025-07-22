import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import Order from '../../../../models/Order';
import jwt from 'jsonwebtoken';
import cloudinary from '../../../../lib/cloudinary';

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

const deleteReceipt = async (publicId) => {
  if (!publicId) return;
  
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting receipt from Cloudinary:', error);
  }
};

export async function GET(request, context) {
  try {
    const decodedToken = await verifyToken(request);
    if (!decodedToken || !decodedToken.isAdmin) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized access',
      }, { status: 401 });
    }
    
    await connectToDatabase();
    
    const id = context.params.id;
    const order = await Order.findOne({ orderId: id });
    
    if (!order) {
      return NextResponse.json({
        success: false,
        message: 'Order not found',
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error retrieving order',
      error: error.message
    }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const decodedToken = await verifyToken(request);
    if (!decodedToken || !decodedToken.isAdmin) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized access',
      }, { status: 401 });
    }
    
    await connectToDatabase();
    
    const id = context.params.id;
    const order = await Order.findOne({ orderId: id });
    
    if (!order) {
      return NextResponse.json({
        success: false,
        message: 'Order not found',
      }, { status: 404 });
    }
    
    if (order.payment.receiptPublicId) {
      await deleteReceipt(order.payment.receiptPublicId);
    }
    
    await Order.findOneAndDelete({ orderId: id });
    
    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    console.error('Delete order error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error deleting order',
      error: error.message
    }, { status: 500 });
  }
}

export async function PATCH(request, context) {
  try {
    const decodedToken = await verifyToken(request);
    if (!decodedToken || !decodedToken.isAdmin) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized access',
      }, { status: 401 });
    }
    
    await connectToDatabase();
    
    const id = context.params.id;
    const updateData = await request.json();
    
    const allowedUpdates = ['status'];
    const updates = {};
    
    for (const key of allowedUpdates) {
      if (updateData[key] !== undefined) {
        updates[key] = updateData[key];
      }
    }
    
    const order = await Order.findOneAndUpdate(
      { orderId: id },
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    if (!order) {
      return NextResponse.json({
        success: false,
        message: 'Order not found',
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order error:', error);
    
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
    
    return NextResponse.json({
      success: false,
      message: 'Error updating order',
      error: error.message
    }, { status: 500 });
  }
}