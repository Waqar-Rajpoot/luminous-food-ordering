

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order.model";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { orderId, otp } = await request.json();

    const cleanOrderId = orderId?.trim();
    const cleanOtp = otp?.trim();

    console.log("Verifying OTP for Order ID:", cleanOrderId);
    console.log("Provided OTP:", cleanOtp);

    if (!cleanOrderId || !cleanOtp) {
      return NextResponse.json(
        { message: "Order ID and OTP are required" },
        { status: 400 }
      );
    }

    const order = await Order.findOne({ orderId: { $regex: new RegExp(`^${cleanOrderId}$`, "i") }});

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    if (order.isOTPVerified) {
      return NextResponse.json({ message: "Order already verified" }, { status: 400 });
    }

        // 2. Validate OTP (Ensure both are compared as strings)
    if (order.deliveryOTP.toString() !== cleanOtp.toString()) {
      return NextResponse.json(
        { message: "Invalid Verification Code" },
        { status: 401 }
      );
    }

    // 3. Check Expiry
    if (
      order.deliveryOTPExpiry &&
      new Date() > new Date(order.deliveryOTPExpiry)
    ) {
      return NextResponse.json(
        { message: "OTP has expired. Please ask customer to refresh." },
        { status: 410 }
      );
    }

    // Success: Update Order
    order.isOTPVerified = true;
    order.shippingProgress = "delivered";
    await order.save();

    return NextResponse.json({ 
      success: true, 
      message: "Order verified and delivered successfully!" 
    });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

