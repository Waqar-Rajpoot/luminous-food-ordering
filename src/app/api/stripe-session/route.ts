import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { v4 as uuidv4 } from 'uuid';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order.model';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from 'mongoose';
import { checkoutDataSchema } from "@/schemas/checkoutDataSchema";

const key = process.env.STRIPE_SECRET_KEY || "";
const stripe = new Stripe(key, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(request: NextRequest) {
  const idempotencyKey = request.headers.get("X-Idempotency-Key") || uuidv4();
  
  try {
    await dbConnect();
    const body = await request.json();
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user._id) {
      return NextResponse.json({ message: 'Authentication required to place an order.' }, { status: 401 });
    }

    const { cartItems, shippingAddress, finalAmount, originalTotal } = checkoutDataSchema.parse(body);

    if (cartItems.length === 0) {
      return NextResponse.json({ message: "No cart data provided." }, { status: 400 });
    }
    
    // --- 1. GENERATE OTP LOGIC ---
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date();
    otpExpiry.setHours(otpExpiry.getHours() + 48); // Valid for 48 hours
    // ----------------------------

    const orderId = `ORDER-${uuidv4()}`;
    const userIdObjectId = new mongoose.Types.ObjectId(session.user._id);
    const customerEmail = session.user.email || shippingAddress.fullName.toLowerCase().replace(/\s/g, '') + '@guest.com';
    const customerName = session.user.name || shippingAddress.fullName;
    
    const newOrder = new Order({
      orderId,
      userId: userIdObjectId,
      customerEmail,
      customerName,
      totalAmount: originalTotal,
      discountAmount: originalTotal - finalAmount,
      finalAmount: finalAmount,
      currency: 'pkr',
      orderStatus: 'pending',
      items: cartItems,
      shippingAddress: shippingAddress,
      // --- 2. SAVE OTP TO ORDER ---
      deliveryOTP: generatedOTP,
      deliveryOTPExpiry: otpExpiry,
      isOTPVerified: false
      // ----------------------------
    });

    await newOrder.save();

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [{
      price_data: {
        currency: "pkr",
        product_data: {
          name: "Total Order",
          description: `Order ID: ${newOrder.orderId}`,
        },
        unit_amount: Math.round(finalAmount * 100),
      },
      quantity: 1,
    }];
    
    const sessionStripe = await stripe.checkout.sessions.create({
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      shipping_options: [
        { shipping_rate: process.env.STRIPE_SHIPPING_RATE_ID1! },
        { shipping_rate: process.env.STRIPE_SHIPPING_RATE_ID2! },
      ],
      line_items,
      allow_promotion_codes: true,
      phone_number_collection: {
        enabled: true,
      },
      metadata: {
        orderId: newOrder.orderId,
        userId: session.user._id,
      },
      success_url: `${request.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}&order_id=${newOrder.orderId}`,
      cancel_url: `${request.headers.get("origin")}/payment-cancel`,
    }, {
      idempotencyKey: idempotencyKey,
    });

    await Order.findByIdAndUpdate(newOrder._id, { stripeSessionId: sessionStripe.id });

    return NextResponse.json({ sessionId: sessionStripe.id, success: true });

  } catch (err: any) {
    console.error("Stripe Checkout Session creation failed:", err);
    // Error handling logic...
    return NextResponse.json({
      message: err.message || "An unexpected error occurred.",
      success: false,
    }, { status: 500 });
  }
}