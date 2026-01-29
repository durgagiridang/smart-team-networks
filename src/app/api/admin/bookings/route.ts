import { NextResponse } from 'next/server';
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";

// सबै युजरको बुकिङ तान्न (Admin को लागि)
export async function GET() {
  try {
    await dbConnect();
    const allBookings = await Booking.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: allBookings });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Fetch failed" }, { status: 500 });
  }
}

// स्टेटस 'Pending' बाट 'Confirmed' बनाउन
export async function PATCH(request: Request) {
  try {
    await dbConnect();
    const { id, status } = await request.json();
    const updated = await Booking.findByIdAndUpdate(id, { status }, { new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Update failed" }, { status: 500 });
  }
}