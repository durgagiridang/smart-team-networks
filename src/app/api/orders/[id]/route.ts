import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb"; 
import Order from "@/models/Order"; 

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    await dbConnect();

    // १. params लाई await गर्ने (Next.js 15+ को नियम)
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    // २. Request body बाट डेटा लिने
    const { status } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    // ३. डेटाबेस अपडेट गर्ने
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: status },
      { new: true } // यसले अपडेट भइसकेपछिको नयाँ डेटा दिन्छ
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