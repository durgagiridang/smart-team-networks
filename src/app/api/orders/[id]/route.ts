import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb"; 
import Order from "@/models/Order"; 

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // यहाँ Promise थप्नुहोस्
) {
  try {
    await dbConnect();

    // १. params लाई await गरेर id निकाल्ने (Next.js 15 को लागि अनिवार्य)
    const { id } = await params; 
    
    // २. Body बाट स्टेटस लिने
    const { status } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (error: any) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}