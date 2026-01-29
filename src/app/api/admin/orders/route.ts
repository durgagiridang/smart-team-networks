import { NextResponse } from 'next/server';
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";

// सबै अर्डरहरू तान्न
export async function GET() {
  await dbConnect();
  const orders = await Order.find({}).sort({ createdAt: -1 });
  return NextResponse.json({ success: true, data: orders });
}

// अर्डरको स्टेटस (Status) बदल्न
export async function PATCH(request: Request) {
  await dbConnect();
  const { id, status } = await request.json();
  const updated = await Order.findByIdAndUpdate(id, { status }, { new: true });
  return NextResponse.json({ success: true, data: updated });
}