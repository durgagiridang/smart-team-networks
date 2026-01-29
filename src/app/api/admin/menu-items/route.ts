import { NextResponse } from 'next/server';
import dbConnect from "@/lib/mongodb";
import Menu from "@/models/menu";

// १. सबै मेनु आइटमहरू तान्न (GET)
export async function GET() {
  try {
    await dbConnect();
    const menuItems = await Menu.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: menuItems });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Fetch failed" }, { status: 500 });
  }
}

// २. नयाँ खानाको परिकार थप्न (POST)
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const newItem = await Menu.create(body);
    return NextResponse.json({ success: true, data: newItem });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to add item" }, { status: 500 });
  }
}