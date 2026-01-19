import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import OrderModel from "@/models/Order.model";
import ReviewModel from "@/models/Review.model";
import MessageModel from "@/models/ContactMessage.model";

export async function getDashboardData(userId: string) {
  try {
    await dbConnect();

    const user = await UserModel.findById(userId).select("-password").lean();
    if (!user) return null;

    const [allOrders, reviews, messages] = await Promise.all([
      OrderModel.find({ userId }).sort({ createdAt: -1 }).lean(),
      ReviewModel.find({ userId }).sort({ createdAt: -1 }).lean(),
      MessageModel.find({
        $or: [{ userId: userId }, { email: (user as any).email }],
      })
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    return {
      user,
      allOrders,
      recentOrders: allOrders.slice(0, 5),
      reviews,
      messages,
      metrics: {
        totalOrders: allOrders.length,
        totalSpent: allOrders.reduce(
          (sum: number, o: any) => sum + (o.finalAmount || 0),
          0,
        ),
        activeOrders: allOrders.filter(
          (o: any) => o.shippingProgress !== "delivered",
        ).length,
      },
    };
  } catch (error) {
    console.error("Database Fetch Error:", error);
    return null;
  }
}
