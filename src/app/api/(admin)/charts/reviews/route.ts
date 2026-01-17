// src/app/api/charts/reviews/route.ts

import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options"; // Adjust path as needed
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ReviewModel from "@/models/Review.model"; // Assuming ReviewModel for reviews
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

    // 1. Aggregation for Monthly Reviews
    const monthlyReviewsResult = await ReviewModel.aggregate([
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

    // Format monthly data to include all months, even with zero reviews
    const monthlyReviewsMap = new Map(
      monthlyReviewsResult.map((item) => [item.monthNumber, item.count])
    );

    const formattedMonthlyReviews = months.map((monthName, index) => ({
      month: monthName,
      reviews: monthlyReviewsMap.get(index + 1) || 0,
    }));

    // 2. Aggregation for Review Rating Breakdown
    const ratingBreakdownResult = await ReviewModel.aggregate([
      {
        $group: {
          _id: "$rating", // Group by the 'rating' field
          value: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: { $concat: [{ $toString: "$_id" }, " Stars"] }, // Rename _id to name (e.g., "5 Stars")
          value: 1,
        },
      },
      { $sort: { name: -1 } }, // Sort by rating descending (5 stars first)
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          monthlyReviews: formattedMonthlyReviews,
          ratingBreakdown: ratingBreakdownResult,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching review chart data:", error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching review chart data' },
      { status: 500 }
    );
  }
}