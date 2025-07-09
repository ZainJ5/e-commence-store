import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || "bcfce0c01316be944450bebe732cb858";

if (!secretKey) {
  throw new Error('JWT_SECRET environment variable is not set. Please configure it.');
}

export async function POST(request) {
  try {
    const body = await request.json(); 
    const { username, password } = body;

    if (username === 'admin' && password === 'admin123') {
      const token = jwt.sign(
        {
          userId: 'admin-user-id',
          username,
          isAdmin: true,
        },
        secretKey,
        { expiresIn: '30d' } // Token expiry set to 30 days
      );

      return NextResponse.json({
        success: true,
        token,
        user: { username, isAdmin: true },
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth API error:', error);

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}