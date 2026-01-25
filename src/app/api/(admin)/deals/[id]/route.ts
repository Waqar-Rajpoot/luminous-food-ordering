import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Deal from "@/models/HotDeal.model";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const deletedDeal = await Deal.findByIdAndDelete(id);

    if (!deletedDeal) {
      return NextResponse.json({ success: false, message: "Deal not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Deal deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    // 1. Logic for Price & Savings
    if (body.originalPrice !== undefined || body.dealPrice !== undefined) {
      const existingDeal = await Deal.findById(id);
      if (!existingDeal) {
        return NextResponse.json({ success: false, message: "Deal not found" }, { status: 404 });
      }
      const original = body.originalPrice ?? existingDeal.originalPrice;
      const current = body.dealPrice ?? existingDeal.dealPrice;
      body.savings = original - current;
    }

    // 2. Update the deal
    const updatedDeal = await Deal.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ 
      success: true, 
      data: updatedDeal,
      message: "Deal updated successfully" 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}