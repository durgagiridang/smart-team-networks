import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

// यो थप्नाले Next.js ले डेटा क्यास (cache) गर्दैन र रियल-टाइम अपडेट दिन्छ
export const dynamic = 'force-dynamic';

/* ----------  POST (नयाँ अर्डर बनाउने)  ---------- */
export async function POST(request: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email || 'walk-in@customer.com';

    const body = await request.json();

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

/* ----------  GET (सबै अर्डरहरू तान्ने - हिस्ट्री र किचन दुवैका लागि)  ---------- */
export async function GET() {
  try {
    await dbConnect();

    // यहाँ status: 'Pending' हटाइएको छ ताकि 'Ready' अर्डर पनि हिस्ट्रीमा आओस्
    const orders = await Order.find({}) 
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: orders });
  } catch (err: any) {
    console.error('GET /api/orders error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}