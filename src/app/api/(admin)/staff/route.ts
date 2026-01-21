import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET() {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    // Using aggregation to get staff details + their active order count
    const staffMembers = await User.aggregate([
      // 1. Filter only staff members
      { $match: { role: "staff" } },
      
      // 2. Left Join with Orders collection
      {
        $lookup: {
          from: "orders", // This should match your MongoDB collection name (usually lowercase plural)
          localField: "_id",
          foreignField: "assignedStaffId",
          as: "assignedOrders",
        },
      },

      // 3. Add a field for 'activeWorkload'
      // We only count orders that are NOT delivered and NOT canceled
      {
        $addFields: {
          activeWorkload: {
            $size: {
              $filter: {
                input: "$assignedOrders",
                as: "order",
                cond: { 
                  $and: [
                    { $ne: ["$$order.deliveryStatus", "delivered"] },
                    { $ne: ["$$order.deliveryStatus", "canceled"] }
                  ]
                },
              },
            },
          },
        },
      },

      // 4. Clean up the output
      {
        $project: {
          name: 1,
          email: 1,
          _id: 1,
          createdAt: 1,
          activeWorkload: 1,
        },
      },

      // 5. Sort by newest staff
      { $sort: { createdAt: -1 } },
    ]);

    return NextResponse.json({ success: true, staffMembers });
  } catch (error) {
    console.error("Staff Fetch Error:", error);
    return NextResponse.json({ success: false, message: "Error fetching staff" }, { status: 500 });
  }
}