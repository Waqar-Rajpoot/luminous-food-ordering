import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import OrderModel from "@/models/Order.model";
import ReviewModel from "@/models/Review.model";
import MessageModel from "@/models/ContactMessage.model";

export async function GET(
  request: NextRequest,
  // Next.js 15 requires params to be a Promise
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await dbConnect();
    
    // 1. Await the params
    const { userId } = await params;

    console.log("Fetching dashboard for User ID:", userId);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID not provided" },
        { status: 400 }
      );
    }

    // 2. Fetch User Profile first to get the email (needed for message search)
    const user: any = await UserModel.findById(userId).select("-password").lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // 3. Parallel fetching for optimized performance
    // This executes all queries at once rather than one after another
    const [allOrders, reviews, messages] = await Promise.all([
      OrderModel.find({ userId }).sort({ createdAt: -1 }).lean(),
      ReviewModel.find({ userId }).sort({ createdAt: -1 }).lean(),
      MessageModel.find({ 
        $or: [{ userId: userId }, { email: user.email }] 
      }).sort({ createdAt: -1 }).lean()
    ]);

    // 4. Construct Data Summary
    const dashboardSummary = {
      user: {
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        memberSince: user.createdAt,
      },
      metrics: {
        totalOrders: allOrders.length,
        totalSpent: allOrders.reduce((sum: number, order: any) => sum + (order.finalAmount || 0), 0),
        activeOrders: allOrders.filter((o: any) => o.shippingProgress !== "delivered" && o.shippingProgress !== "canceled").length,
        totalReviews: reviews.length,
        totalMessages: messages.length,
      },
      allOrders,
      recentOrders: allOrders.slice(0, 5),
      reviews,
      messages,
    };

    return NextResponse.json(dashboardSummary, { status: 200 });

  } catch (error: any) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}