import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.model";

// Import your Mongoose models
import Order from "@/models/Order.model";
import Review from "@/models/Review.model";
import Message from "@/models/ContactMessage.model";

// Update the function signature to accept 'params' from the dynamic route
export async function GET(request:NextRequest, { params }: any) {
  
  // Destructure userId from the route parameters
  const { userId } = await params;

  console.log("User ID:", userId);

  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [user, allOrders, reviews, messages, recentOrders] = await Promise.all([
      User.findOne({ _id: userId }).lean(),
      Order.find({ userId: userId }).sort({ createdAt: -1 }).limit(10).lean(),
      Review.find({ userId: userId }).sort({ createdAt: -1 }).limit(10).lean(),
      Message.find({ userId: userId }).sort({ createdAt: -1 }).limit(10).lean(),
      Order.find({
        userId: userId,
        createdAt: { $gte: twentyFourHoursAgo } 
      }).sort({ createdAt: -1 }).lean(),
    ]);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user,
      allOrders, 
      recentOrders,
      reviews,
      messages,
    }, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Server error fetching dashboard data." },
      { status: 500 }
    );
  }
}
