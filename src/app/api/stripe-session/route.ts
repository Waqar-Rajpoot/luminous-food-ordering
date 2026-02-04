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
  apiVersion: "2025-12-15.clover" as any, // Cast to any if version string causes type conflict
});

export async function POST(request: NextRequest) {
  // Use the key sent from frontend or generate a fallback
  const idempotencyKey = request.headers.get("X-Idempotency-Key") || uuidv4();
  
  try {
    await dbConnect();
    const body = await request.json();
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user._id) {
      return NextResponse.json({ message: 'Authentication required to place an order.' }, { status: 401 });
    }

    // 1. Validate data with Zod
    const parsedData = checkoutDataSchema.safeParse(body);
    
    if (!parsedData.success) {
      console.error("Zod Validation Error:", parsedData.error.format());
      return NextResponse.json({ 
        message: "Invalid data format.", 
        details: parsedData.error.format() 
      }, { status: 400 });
    }

    const { cartItems, shippingAddress, finalAmount, originalTotal } = parsedData.data;

    if (cartItems.length === 0) {
      return NextResponse.json({ message: "No cart data provided." }, { status: 400 });
    }
    
    // --- GENERATE OTP LOGIC ---
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date();
    otpExpiry.setHours(otpExpiry.getHours() + 48); // Valid for 48 hours

    // Create a unique Order ID
    const orderId = `ORDER-${uuidv4().split('-')[0].toUpperCase()}`;
    const userIdObjectId = new mongoose.Types.ObjectId(session.user._id);
    const customerEmail = session.user.email || shippingAddress.fullName.toLowerCase().replace(/\s/g, '') + '@guest.com';
    const customerName = session.user.name || shippingAddress.fullName;
    
    // 2. Prepare the Order document
    const newOrder = new Order({
      orderId,
      userId: userIdObjectId,
      customerEmail,
      customerName,
      totalAmount: originalTotal,
      discountAmount: Math.max(0, originalTotal - finalAmount),
      finalAmount: finalAmount,
      currency: 'pkr',
      orderStatus: 'pending',
      items: cartItems,
      shippingAddress: shippingAddress,
      deliveryOTP: generatedOTP,
      deliveryOTPExpiry: otpExpiry,
      isOTPVerified: false
    });

    await newOrder.save();
    console.log("Order saved to DB. Creating Stripe Session...");

    // 3. Prepare Stripe Line Items
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [{
      price_data: {
        currency: "pkr",
        product_data: {
          name: "Total Order Payment",
          description: `Order ID: ${newOrder.orderId}`,
        },
        unit_amount: Math.round(finalAmount * 100), // Stripe expects amounts in cents/paisa
      },
      quantity: 1,
    }];

    // 4. Safely handle shipping options
    const shippingOptions = [];
    if (process.env.STRIPE_SHIPPING_RATE_ID1) {
      shippingOptions.push({ shipping_rate: process.env.STRIPE_SHIPPING_RATE_ID1 });
    }
    if (process.env.STRIPE_SHIPPING_RATE_ID2) {
      shippingOptions.push({ shipping_rate: process.env.STRIPE_SHIPPING_RATE_ID2 });
    }

    
    // 5. Create Stripe Session
    const sessionStripe = await stripe.checkout.sessions.create({
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      // Only add shipping_options if we actually have IDs to avoid Stripe error
      ...(shippingOptions.length > 0 && { shipping_options: shippingOptions }),
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
      idempotencyKey: idempotencyKey, // This key is now unique per click from frontend
    });

    // 6. Update order with Stripe Session ID
    await Order.findByIdAndUpdate(newOrder._id, { stripeSessionId: sessionStripe.id });

    // ✅ SUCCESS: Return BOTH sessionId and url
    return NextResponse.json({ 
      sessionId: sessionStripe.id, 
      url: sessionStripe.url, 
      success: true 
    });

  } catch (err: any) {
    console.error("Stripe Checkout Session creation failed:", err);
    
    // Special handling for Stripe Idempotency Errors to provide clearer feedback
    const errorMessage = err.type === 'StripeIdempotencyError' 
      ? "This transaction attempt is already in progress. Please wait or refresh."
      : err.message || "An unexpected error occurred.";

    return NextResponse.json({
      message: errorMessage,
      success: false,
    }, { status: 500 });
  }
}