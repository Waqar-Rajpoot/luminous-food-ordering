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

// Distance Helper (Haversine Formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Result in km rounded to 1 decimal
}

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

    if (!session || !session.user || !session.user._id) {
      return NextResponse.json({ message: "Authentication required." }, { status: 401 });
    }

    const settings = await Settings.findOne().lean();

    if (settings?.maintenanceMode) {
      return NextResponse.json({ message: "System under maintenance." }, { status: 503 });
    }

    const parsedData = checkoutDataSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json({ message: "Invalid data format." }, { status: 400 });
    }

    const { cartItems, shippingAddress, shippingRate, paymentMethod } = parsedData.data as any;

    console.log("Checkout Data:", { shippingAddress });

    // --- NEW ADDRESS & RADIUS VALIDATION ---
    if (!shippingAddress.lat || !shippingAddress.lng) {
      return NextResponse.json({ message: "GPS coordinates are required for delivery." }, { status: 400 });
    }

    if (settings?.restaurantLocation?.lat && settings?.restaurantLocation?.lng) {
      const distance = calculateDistance(
        settings.restaurantLocation.lat,
        settings.restaurantLocation.lng,
        shippingAddress.lat,
        shippingAddress.lng
      );

      if (distance > (settings.deliveryRadius || 10)) {
        return NextResponse.json({ 
          message: `Delivery failed. Your location is ${distance}km away, which exceeds our ${settings.deliveryRadius}km limit.` 
        }, { status: 400 });
      }
    }

    // --- FINANCIAL CALCULATIONS ---
    const totalAmount = cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const discountPercent = settings?.globalDiscount || 0;
    const discountAmount = (totalAmount * discountPercent) / 100;
    const finalAmountAfterDiscount = totalAmount - discountAmount;
    const deliveryEarning = settings?.staffCommission || 0;
    const shippingFee = Number(shippingRate) || 0;
    const finalBillableAmount = finalAmountAfterDiscount + shippingFee;

    if (settings && totalAmount < settings.minOrderValue) {
      return NextResponse.json({ message: `Minimum order is PKR ${settings.minOrderValue}.` }, { status: 400 });
    }

    if (paymentMethod === "stripe" && !settings?.paymentMethods?.stripe) {
      return NextResponse.json({ message: "Stripe payments disabled." }, { status: 403 });
    }

    if (paymentMethod === "cod" && !settings?.paymentMethods?.cod) {
      return NextResponse.json({ message: "COD unavailable." }, { status: 403 });
    }

    // --- ORDER PREPARATION ---
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
      totalAmount: totalAmount + shippingFee,
      discountAmount: discountAmount,
      finalAmount: finalBillableAmount,
      deliveryEarning: deliveryEarning,
      isEarningsPaid: false,
      shippingCost: shippingFee,
      currency: "pkr",
      orderStatus: "pending",
      items: cartItems,
      shippingAddress: shippingAddress, // Now includes lat/lng
      deliveryOTP: generatedOTP,
      deliveryOTPExpiry: otpExpiry,
      isOTPVerified: false,
      paymentMethod: paymentMethod || "stripe",
    });

    await newOrder.save();

    // --- GATEWAY LOGIC ---
    if (paymentMethod === "cod") {
      return NextResponse.json({
        success: true,
        orderId: newOrder.orderId,
        message: "Order placed successfully via COD",
      });
    }

    const discountFactor = (100 - discountPercent) / 100;
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = cartItems.map((item: any) => ({
      price_data: {
        currency: "pkr",
        product_data: { name: item.name, images: [item.image] },
        unit_amount: Math.round((item.price * discountFactor) * 100),
      },
      quantity: item.quantity,
    }));

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

    await Order.findByIdAndUpdate(newOrder._id, { stripeSessionId: sessionStripe.id });

    return NextResponse.json({
      sessionId: sessionStripe.id,
      url: sessionStripe.url,
      success: true,
    });

  } catch (err: any) {
    console.error("Checkout Error:", err.message);
    return NextResponse.json({ message: err.message, success: false }, { status: 500 });
  }
}