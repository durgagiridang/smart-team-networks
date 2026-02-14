import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

/* ----------  POST (नयाँ अर्डर बनाउने)  ---------- */
export async function POST(request: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email || 'walk-in@customer.com';

    const body = await request.json();

    // STN Channel बाट आएको सरल अर्डरको लागि लजिक
    const orderData = {
      userEmail,
      customerName: body.customerName || "Anonymous",
      phone: body.phone || "",
      productName: body.productName || "General Product",
      // पुराना Restaurant अर्डरहरूका लागि
      items: body.items || [], 
      totalAmount: body.totalAmount || 0,
      orderType: body.orderType || 'Live-Order',
      status: 'Pending',
      createdAt: new Date(),
    };

    const newOrder = await Order.create(orderData);

    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/orders error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/* ----------  GET (सबै अर्डरहरू तान्ने)  ---------- */
export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: orders });
  } catch (err: any) {
    console.error('GET /api/orders error:', err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}