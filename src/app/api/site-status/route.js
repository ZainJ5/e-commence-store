import { NextResponse } from 'next/server';
import connectToDatabase from '../../lib/mongodb';
import SiteStatus from "../../models/SiteStatus";
import jwt from 'jsonwebtoken';

const verifyToken = async (request) => {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    const secretKey = process.env.JWT_SECRET || "bcfce0c01316be944450bebe732cb858";

    if (!secretKey) {
      console.error('JWT_SECRET not found');
      return null;
    }

    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};


export async function GET() {
  try {
    await connectToDatabase();

    let status = await SiteStatus.findOne();
    if (!status) {
      status = await SiteStatus.create({ isSiteActive: true });
    }

    return NextResponse.json({ isSiteActive: status.isSiteActive }, { status: 200 });
  } catch (error) {
    console.error('Error fetching site status:', error);
    return NextResponse.json({ isSiteActive: true }, { status: 200 });
  }
}

export async function POST(request) {
  try {
    const user = await verifyToken(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectToDatabase();

    const body = await request.json();
    const { isSiteActive } = body;

    if (typeof isSiteActive !== 'boolean') {
      return NextResponse.json({ error: 'Invalid payload: isSiteActive must be boolean' }, { status: 400 });
    }

    let status = await SiteStatus.findOne();
    if (!status) {
      status = await SiteStatus.create({ isSiteActive });
    } else {
      status.isSiteActive = isSiteActive;
      await status.save();
    }

    return NextResponse.json({ message: 'Site status updated', isSiteActive }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update status', detail: error.message }, { status: 500 });
  }
}
