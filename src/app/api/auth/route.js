import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Use a consistent secret key
const secretKey = process.env.JWT_SECRET || 'fallback-secret-key-for-development';

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Simple username/password validation
    if (username === 'admin' && password === 'admin123') {
      // Create JWT token
      const token = jwt.sign(
        { 
          userId: 'admin-user-id',
          username,
          isAdmin: true 
        },
        secretKey,
        { expiresIn: '30d' }
      );

      // Return success response with token
      return NextResponse.json({ 
        success: true, 
        token,
        user: { username, isAdmin: true } 
      });
    } else {
      // Return error for invalid credentials
      return NextResponse.json(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth API error:', error);
    
    // Return error response
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}