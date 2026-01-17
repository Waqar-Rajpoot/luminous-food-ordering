import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order.model";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { orderId, otp } = await req.json();

    // Clean the data: Trim spaces and handle potential formatting issues
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
      return NextResponse.json({ message: "Order not found in database" }, { status: 404 });
    }

    if (order.isOTPVerified) {
      return NextResponse.json(
        { message: "Order is already verified and delivered" },
        { status: 400 }
      );
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

    // 4. Update Order Status
    order.isOTPVerified = true;
    order.shippingProgress = "delivered";
    await order.save();

    return NextResponse.json(
      {
        success: true,
        message: "Order delivered and verified successfully!",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Verification Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}