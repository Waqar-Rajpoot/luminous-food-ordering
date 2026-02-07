import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order.model";
import Settings from "@/models/Settings.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import { checkoutDataSchema } from "@/schemas/checkoutDataSchema";

const key = process.env.STRIPE_SECRET_KEY || "";
const stripe = new Stripe(key, {
  apiVersion: "2025-12-15.clover" as any,
});

export async function POST(request: NextRequest) {
  const idempotencyKey = request.headers.get("X-Idempotency-Key") || uuidv4();

  try {
    await dbConnect();
    const body = await request.json();
    const session = await getServerSession(authOptions);

    // 1. AUTHENTICATION CHECK
    if (!session || !session.user || !session.user._id) {
      return NextResponse.json(
        { message: "Authentication required to place an order." },
        { status: 401 },
      );
    }

    // 2. FETCH CORE SETTINGS
    const settings = await Settings.findOne().lean();

    // 3. GLOBAL MAINTENANCE CHECK
    if (settings?.maintenanceMode) {
      return NextResponse.json(
        { message: "System is undergoing scheduled maintenance." },
        { status: 503 },
      );
    }

    const parsedData = checkoutDataSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { message: "Invalid data format." },
        { status: 400 },
      );
    }

    const { cartItems, shippingAddress, shippingRate, paymentMethod } = parsedData.data as any;

    // --- NEW FINANCIAL CALCULATION LOGIC ---
    
    // A. Calculate Raw Total (Subtotal)
    const totalAmount = cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    // B. Calculate Discount (Global)
    const discountPercent = settings?.globalDiscount || 0;
    const discountAmount = (totalAmount * discountPercent) / 100;
    
    // C. Calculate Final Amount (Before Shipping)
    const finalAmountAfterDiscount = totalAmount - discountAmount;

    // D. Calculate Rider Bounty (deliveryEarning)
    const deliveryEarning = settings?.staffCommission || 0;

    // E. Add Shipping Fee
    const shippingFee = Number(shippingRate) || 0;
    const finalBillableAmount = finalAmountAfterDiscount + shippingFee;

    // --- VALIDATIONS ---

    // Min Order Value check (using total before discount to be fair to user)
    if (settings && totalAmount < settings.minOrderValue) {
      return NextResponse.json(
        { message: `Minimum order requirement is PKR ${settings.minOrderValue}.` },
        { status: 400 },
      );
    }

    if (paymentMethod === "stripe" && !settings?.paymentMethods?.stripe) {
      return NextResponse.json({ message: "Stripe payments disabled." }, { status: 403 });
    }

    if (paymentMethod === "cod" && !settings?.paymentMethods?.cod) {
      return NextResponse.json({ message: "COD unavailable." }, { status: 403 });
    }

    // --- PREPARE ORDER ---

    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date();
    otpExpiry.setHours(otpExpiry.getHours() + 48);

    const orderId = `ORDER-${uuidv4().split("-")[0].toUpperCase()}`;
    const userIdObjectId = new mongoose.Types.ObjectId(session.user._id);

    const newOrder = new Order({
      orderId,
      userId: userIdObjectId,
      customerEmail: session.user.email || "guest@example.com",
      customerName: session.user.name || shippingAddress.fullName,
      totalAmount: totalAmount + shippingFee, // Original total + shipping
      discountAmount: discountAmount,        // Calculated discount
      finalAmount: finalBillableAmount,      // Amount user actually pays
      deliveryEarning: deliveryEarning,      // Locked rider bounty
      isEarningsPaid: false,
      shippingCost: shippingFee,
      currency: "pkr",
      orderStatus: "pending",
      items: cartItems,
      shippingAddress: shippingAddress,
      deliveryOTP: generatedOTP,
      deliveryOTPExpiry: otpExpiry,
      isOTPVerified: false,
      paymentMethod: paymentMethod || "stripe",
    });

    await newOrder.save();

    // --- PAYMENT GATEWAY LOGIC ---

    if (paymentMethod === "cod") {
      return NextResponse.json({
        success: true,
        orderId: newOrder.orderId,
        message: "Order placed successfully via Cash on Delivery",
      });
    }

    // Stripe Line Items (Pro-rated for global discount)
    // Note: Stripe doesn't easily support a "total discount" field on sessions without Coupons, 
    // so we apply a discount factor to each item's price for accuracy.
    const discountFactor = (100 - discountPercent) / 100;

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = cartItems.map((item: any) => ({
      price_data: {
        currency: "pkr",
        product_data: { name: item.name, images: [item.image] },
        unit_amount: Math.round((item.price * discountFactor) * 100), // Item price minus global discount
      },
      quantity: item.quantity,
    }));

    // Add Shipping as a line item if exists
    if (shippingFee > 0) {
      line_items.push({
        price_data: {
          currency: "pkr",
          product_data: { name: "Shipping Fee" },
          unit_amount: shippingFee * 100,
        },
        quantity: 1,
      });
    }

    const sessionStripe = await stripe.checkout.sessions.create(
      {
        submit_type: "pay",
        mode: "payment",
        payment_method_types: ["card"],
        line_items,
        metadata: { orderId: newOrder.orderId },
        success_url: `${request.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}&order_id=${newOrder.orderId}`,
        cancel_url: `${request.headers.get("origin")}/payment-cancel`,
      },
      { idempotencyKey },
    );

    await Order.findByIdAndUpdate(newOrder._id, {
      stripeSessionId: sessionStripe.id,
    });

    return NextResponse.json({
      sessionId: sessionStripe.id,
      url: sessionStripe.url,
      success: true,
    });

  } catch (err: any) {
    console.error("Checkout Error:", err.message);
    return NextResponse.json(
      { message: err.message, success: false },
      { status: 500 },
    );
  }
}