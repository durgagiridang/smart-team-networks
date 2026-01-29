import { NextResponse } from 'next/server';
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";

// --- GET: हिस्ट्री देखाउनका लागि ---
export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ success: false, data: [] });
    }

    // तपाईँको डेटाबेसमा 'userEmail' फिल्ड छ, त्यसैले यहाँ userEmail प्रयोग गरौँ
    const realBookings = await Booking.find({ userEmail: email }).sort({ date: -1 });
    
    return NextResponse.json({ success: true, data: realBookings });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ success: false, data: [] });
  }
}

// --- POST: नयाँ बुकिङ थप्नका लागि ---
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // तपाईँको MongoDB स्क्रिनसटमा भएका फिल्डहरूसँग मिल्दो नयाँ बुकिङ बनाउने
    const newBooking = await Booking.create({
      userName: body.userName || "Guest User",
      userEmail: body.userEmail, // यो लगइन भएको युजरको इमेल हुनुपर्छ
      restaurantName: body.restaurantName || "Smart Nepali Khaja",
      service: "Restaurant",
      tableNo: body.tableNo,
      guestCount: Number(body.guestCount),
      status: "Pending",
      date: new Date()
    });

    return NextResponse.json({ success: true, data: newBooking });
  } catch (error) {
    console.error("POST Error:", error);
    // एरर मेसेज पठाउने जसले गर्दा फ्रन्टइन्डमा 'Server connection error' नआओस्
    return NextResponse.json(
      { success: false, message: "Database creation failed" }, 
      { status: 500 }
    );
  }
}

// --- DELETE: बुकिङ क्यान्सल गर्नका लागि ---
export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID missing" }, { status: 400 });
    }

    await Booking.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Booking cancelled" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Delete failed" }, { status: 500 });
  }
}