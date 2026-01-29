// app/api/api/orders/route.ts  ← path according to your folder
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

/* ----------  POST  (new order)  ---------- */
export async function POST(request: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email || 'walk-in@customer.com';

    const body = await request.json();

    // validation
    if (!body.items || !Array.isArray(body.items) || !body.totalAmount)
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });

    const newOrder = await Order.create({
      userEmail,
      items: body.items,
      totalAmount: body.totalAmount,
      status: 'Pending',
      orderType: body.orderType || 'Dine-In',
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/orders error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/* ----------  GET  (Pending orders only for kitchen)  ---------- */
export async function GET() {
  try {
    await dbConnect();

    const orders = await Order.find({ status: 'Pending' })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: orders });
  } catch (err: any) {
    console.error('GET /api/orders error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}