import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/models/Order.model";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { staffId } = await req.json();

    if (!staffId) {
      return NextResponse.json({ success: false, message: "Staff ID required" }, { status: 400 });
    }

    // Mark all delivered orders for this staff as paid
    const result = await OrderModel.updateMany(
      { 
        assignedStaffId: staffId, 
        deliveryStatus: "delivered", 
        isEarningsPaid: { $ne: true } 
      },
      { 
        $set: { 
          isEarningsPaid: true, 
          earningsPaidAt: new Date() 
        } 
      }
    );

    return NextResponse.json({ 
      success: true, 
      message: `Balance settled for ${result.modifiedCount} orders.` 
    });
  } catch (error) {
    console.error("Reset Earnings Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}