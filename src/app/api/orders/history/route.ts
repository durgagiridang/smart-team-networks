import { NextResponse } from "next/server";
// यो लाइनलाई @/lib बाट बदलेर ../../../../lib/dbConnect बनाउनुहोस्
import dbConnect from "@/lib/mongodb"; 
import Order from "../../../../models/Order"; 

export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find({ status: "Ready" }).sort({ updatedAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("History API Error:", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}