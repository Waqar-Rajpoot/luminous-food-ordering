import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Deal from "@/models/HotDeal.model";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Type defined as Promise
) {
  try {
    await dbConnect();
    
    // Awaiting the params promise
    const { id } = await params;

    const deletedDeal = await Deal.findByIdAndDelete(id);

    if (!deletedDeal) {
      return NextResponse.json(
        { success: false, message: "Deal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Deal deleted successfully" 
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Type defined as Promise
) {
  try {
    await dbConnect();
    
    // Awaiting the params promise
    const { id } = await params;
    const body = await req.json();

    // Handling savings calculation if prices are updated
    if (body.originalPrice || body.dealPrice) {
      const deal = await Deal.findById(id);
      const original = body.originalPrice ?? deal.originalPrice;
      const current = body.dealPrice ?? deal.dealPrice;
      body.savings = original - current;
    }

    const updatedDeal = await Deal.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedDeal) {
      return NextResponse.json(
        { success: false, message: "Deal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedDeal,
      message: "Deal updated successfully" 
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}