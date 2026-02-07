import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order.model";
import Settings from "@/models/Settings.model"; // Ensure you import your Settings model
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function PATCH(request: NextRequest) {
  await dbConnect();

  try {
    // 1. Check Authentication & Authorization
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    // Removed earningAmount from request body
    const { orderId, staffId } = body;

    // 2. Validate Input
    if (!orderId || !staffId) {
      return NextResponse.json(
        { success: false, message: "Order ID and Staff ID are required." },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(staffId)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID format." },
        { status: 400 }
      );
    }

    // 3. Fetch Delivery Earning from Settings
    // Assuming your settings document contains a 'deliveryFee' or 'staffCommission' field
    const settings = await Settings.findOne({});
    const globalEarningAmount = settings?.staffCommission || 50; // Fallback to 150 if not set

    // 4. Update the Order
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          assignedStaffId: staffId,
          deliveryStatus: "assigned",
          assignmentDate: new Date(),
          deliveryEarning: globalEarningAmount, // Pulling from global settings
          isEarningsPaid: false,
        },
      },
      { new: true } 
    ).populate("assignedStaffId", "name email");

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Order successfully assigned. Earning of PKR ${globalEarningAmount} applied from settings.`,
        order: updatedOrder,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Order Assignment Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}