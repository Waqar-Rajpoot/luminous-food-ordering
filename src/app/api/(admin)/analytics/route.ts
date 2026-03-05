import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/Order.model";
import User from "@/models/User.model";
import dbConnect from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  
  // New: Get specific date from query params
  const selectedDate = searchParams.get("date"); 
  const range = searchParams.get("range") || "monthly";

  try {
    let startDate: Date;
    let endDate: Date = new Date(); // Default end is now

    if (selectedDate) {
      // Logic for Specific Day Selection
      startDate = new Date(selectedDate);
      startDate.setHours(0, 0, 0, 0);
      
      endDate = new Date(selectedDate);
      endDate.setHours(23, 59, 59, 999);
    } else {
      // Fallback to Range Logic
      startDate = new Date();
      if (range === "daily") startDate.setHours(0, 0, 0, 0);
      else if (range === "weekly") startDate.setDate(startDate.getDate() - 7);
      else if (range === "monthly") startDate.setMonth(startDate.getMonth() - 1);
      else if (range === "yearly") startDate.setFullYear(startDate.getFullYear() - 1);
    }

    // Common Match Filter
    const dateMatch = { createdAt: { $gte: startDate, $lte: endDate } };

    // 1. GRAPH & STATS (Synced)
    const salesAggregation = await Order.aggregate([
      { $match: { ...dateMatch, orderStatus: "paid" } },
      {
        $facet: {
          graphData: [
            {
              $group: {
                _id: {
                  $dateToString: { 
                    // If viewing a single day, group by hour for the graph
                    format: selectedDate || range === "daily" ? "%H:00" : "%Y-%m-%d", 
                    date: "$createdAt" 
                  }
                },
                revenue: { $sum: "$finalAmount" },
                orders: { $sum: 1 }
              }
            },
            { $sort: { "_id": 1 } }
          ],
          totalStats: [
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: "$finalAmount" },
                totalOrders: { $sum: 1 }
              }
            }
          ]
        }
      }
    ]);

    const salesData = salesAggregation[0].graphData;
    const periodTotals = salesAggregation[0].totalStats[0] || { totalRevenue: 0, totalOrders: 0 };

    // 2. TOP PRODUCTS
    const topProducts = await Order.aggregate([
      { $match: { ...dateMatch, orderStatus: "paid" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.id",
          name: { $first: "$items.name" },
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    // 3. CATEGORY STATS
    const categoryStats = await Order.aggregate([
      { $match: { ...dateMatch, orderStatus: "paid" } },
      { $unwind: "$items" },
      { $addFields: { "productObjId": { $toObjectId: "$items.id" } } },
      {
        $lookup: { from: "products", localField: "productObjId", foreignField: "_id", as: "productDetails" }
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$productDetails.category",
          value: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      }
    ]);

    const stats = {
      totalRevenue: periodTotals.totalRevenue,
      totalOrders: periodTotals.totalOrders,
      newUsers: await User.countDocuments({ role: "user", ...dateMatch }),
      pendingOrders: await Order.countDocuments({ ...dateMatch, orderStatus: "pending" }),
    };

    return NextResponse.json({ salesData, stats, topProducts, categoryStats }, { status: 200 });
  } catch (error) {
    console.error("Analytics Error:", error);
    return NextResponse.json({ error: "Analytics Failed" }, { status: 500 });
  }
}