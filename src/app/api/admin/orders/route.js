import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Order from '../../../models/Order';
import jwt from 'jsonwebtoken';

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
      return NextResponse.json({
        success: false,
        message: 'Unauthorized access',
      }, { status: 401 });
    }
    
    await connectToDatabase();

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 10;
    const status = url.searchParams.get('status') || null;
    
    const query = {};
    if (status) query.status = status;

    const totalOrders = await Order.countDocuments(query);
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 }) 
      .skip((page - 1) * limit)
      .limit(limit);

    const currentDate = new Date();
    const formattedTimestamp = `${currentDate.getUTCFullYear()}-${String(currentDate.getUTCMonth() + 1).padStart(2, '0')}-${String(currentDate.getUTCDate()).padStart(2, '0')} ${String(currentDate.getUTCHours()).padStart(2, '0')}:${String(currentDate.getUTCMinutes()).padStart(2, '0')}:${String(currentDate.getUTCSeconds()).padStart(2, '0')}`;

    return NextResponse.json({
      success: true,
      count: orders.length,
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
      timestamp: formattedTimestamp,
      orders
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    return NextResponse.json({
      success: false,
      message: 'Error retrieving orders',
      error: error.message
    }, { status: 500 });
  }
}