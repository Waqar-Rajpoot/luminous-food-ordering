import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function PATCH(req: NextRequest) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const { orderId, staffId } = await req.json();

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { 
        assignedStaffId: staffId,
        deliveryStatus: "assigned",
        assignmentDate: new Date()
      },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Assigned" });
  } catch (error) {
    console.error("Order Assignment Error:", error);
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
}