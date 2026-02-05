import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    
    // Security Guard: Only admins can access the dispatch pipeline
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(req.url);
    const assigned = searchParams.get("assigned");

    let query: any = {};
    
    if (assigned === "false") {
      query = { 
        assignedStaffId: null, 
        // We include 'pending' (COD) and 'paid' (Stripe)
        // We exclude 'canceled' to prevent accidental delivery of voided orders
        orderStatus: { $in: ["pending", "paid"] } 
      };
    }

    const orders = await Order.find(query)
      .select(
        // Included paymentMethod so the frontend icons work
        // Included orderStatus for UI feedback
        "orderId customerName customerEmail finalAmount assignedStaffId shippingAddress items deliveryOTP paymentMethod orderStatus",
      )
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Order Fetch Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 },
    );
  }
}