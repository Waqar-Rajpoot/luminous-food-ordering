import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order.model";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { orderId, otp } = await request.json();

    const cleanOrderId = orderId?.trim();
    const cleanOtp = otp?.trim();

    if (!cleanOrderId || !cleanOtp) {
      return NextResponse.json(
        { message: "Order ID and OTP are required" },
        { status: 400 }
      );
    }

    const order = await Order.findOne({ 
      orderId: { $regex: new RegExp(`^${cleanOrderId}$`, "i") }
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    if (order.isOTPVerified || order.deliveryStatus === "delivered") {
      return NextResponse.json({ message: "Order already verified/delivered" }, { status: 400 });
    }

    if (order.deliveryOTP.toString() !== cleanOtp.toString()) {
      return NextResponse.json(
        { message: "Invalid Verification Code" },
        { status: 401 }
      );
    }

    if (order.deliveryOTPExpiry && new Date() > new Date(order.deliveryOTPExpiry)) {
      return NextResponse.json(
        { message: "OTP has expired. Please ask customer to refresh." },
        { status: 410 }
      );
    }

    // --- SUCCESS UPDATES ---
    
    order.isOTPVerified = true;
    order.deliveryStatus = "delivered";
    order.shippingProgress = "delivered";
    order.isEarningsPaid = false; 
    order.deliveredAt = new Date(); // Good for records/history

    await order.save();

    return NextResponse.json({ 
      success: true, 
      message: "Order verified and delivered successfully!" 
    });

  } catch (error: any) {
    console.error("OTP Verification Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}