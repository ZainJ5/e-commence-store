// app/api/type/[id]/route.js

import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Type from '../../../models/type';
import jwt from 'jsonwebtoken';

const verifyToken = async (request) => {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

    const token = authHeader.split(' ')[1];
    const secretKey = process.env.JWT_SECRET || "bcfce0c01316be944450bebe732cb858";

    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

export async function DELETE(request, { params }) {
  const user = await verifyToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();

  try {
    const deletedType = await Type.findByIdAndDelete(params.id);

    if (!deletedType) {
      return NextResponse.json({ error: 'Type not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Type deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting type:', error);
    return NextResponse.json({ error: 'Server error', detail: error.message }, { status: 500 });
  }
}
