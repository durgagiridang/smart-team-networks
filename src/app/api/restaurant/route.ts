import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";

// 1. Booking Schema Define garne (Model initialize garna)
const BookingSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  restaurantName: { type: String, default: "Smart Nepali Khaja" },
  service: { type: String, default: "Restaurant" },
  tableNo: String,
  guestCount: Number,
  status: { type: String, default: "Confirmed" },
  date: { type: Date, default: Date.now },
});

// Model lai initialize garne (Existing bhetiyena bhane naya banaune)
const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);

// 2. GET: User ko email ko adhar ma bookings khojne (Profile ra History ko lagi)
export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ success: false, message: "Email required" }, { status: 400 });
    }

    // User ko email ko adhar ma bookings khojne ra naya date anusar sort garne
    const userBookings = await Booking.find({ userEmail: email }).sort({ date: -1 });
    return NextResponse.json({ success: true, data: userBookings });
  } catch (error) {
    console.error("Detailed MongoDB Error:", error);
    return NextResponse.json({ success: false, error: "Fetch failed" }, { status: 500 });
  }
}

// 3. POST: Naya booking save garna (Modal bata confirm garda)
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    // Data validation
    if (!body.userEmail || !body.tableNo) {
      return NextResponse.json({ success: false, error: "Missing required data" }, { status: 400 });
    }

    const newBooking = await Booking.create({
      ...body,
      date: new Date(), // Booking gareko real time save garna
    });

    return NextResponse.json({ success: true, data: newBooking });
  } catch (error) {
    console.error("Booking POST Error:", error);
    return NextResponse.json({ success: false, error: "Booking Failed" }, { status: 500 });
  }
}