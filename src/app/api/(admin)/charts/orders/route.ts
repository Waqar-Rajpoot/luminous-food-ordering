// src/app/api/charts/orders/route.ts

import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options"; // Adjust path as needed
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/models/Order.model"; // Assuming OrderModel for orders
import { getAllMonths } from "@/utils/monthNames";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const currentYear = new Date().getFullYear();
    const months = getAllMonths();

    // 1. Aggregation for Monthly Orders
    const monthlyOrdersResult = await OrderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            $lte: new Date(`${currentYear}-12-31T23:59:59.999Z`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          monthNumber: "$_id.month",
          count: 1,
        },
      },
    ]);

    // Format monthly data to include all months, even with zero orders
    const monthlyOrdersMap = new Map(
      monthlyOrdersResult.map((item) => [item.monthNumber, item.count])
    );

    const formattedMonthlyOrders = months.map((monthName, index) => ({
      month: monthName,
      orders: monthlyOrdersMap.get(index + 1) || 0,
    }));


    // 2. Aggregation for Order Status Breakdown
    const orderStatusResult = await OrderModel.aggregate([
      {
        $group: {
          _id: "$status", // Group by the 'status' field
          value: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id", // Rename _id to name
          value: 1,
        },
      },
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          monthlyOrders: formattedMonthlyOrders,
          orderStatus: orderStatusResult,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching order chart data:", error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching order chart data' },
      { status: 500 }
    );
  }
}