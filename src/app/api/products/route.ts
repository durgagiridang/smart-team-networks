import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb"; // तपाईँको मङ्गोडिबी कनेक्सन फाइल
import Product from "@/models/Product"; // प्रोडक्ट मोडेल

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // डेटाबेसमा नयाँ सामान सेभ गर्ने
    const newProduct = await Product.create({
      name: body.name,
      price: body.price,
      img: body.img, // Cloudinary को secure_url यहाँ बस्छ
      category: body.category || "General"
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save product" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}