import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/models/Order.model";
import DeliveryQueue from "@/components/staff/DeliveryQueue";
import StaffWorkHeader from "@/components/staff/StaffWorkHeader";

export default async function StaffConsolePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const session = await getServerSession(authOptions);

  if (!session) redirect("/sign-in");
  if (session.user.role !== "staff" || session.user._id !== userId) {
    return notFound();
  }

  await dbConnect();

  // 1. Fetch Active Assignments (for the Queue)
  const activeOrders = await OrderModel.find({
    assignedStaffId: userId,
    deliveryStatus: { $in: ["assigned", "picked-up", "out-for-delivery"] }
  }).sort({ updatedAt: -1 }).lean();

  // 2. Fetch Delivered but UNPAID orders (for the Balance)
  const unpaidDeliveredOrders = await OrderModel.find({
    assignedStaffId: userId,
    deliveryStatus: "delivered",
    isEarningsPaid: { $ne: true } // Finds false or undefined
  }).select("deliveryEarning").lean();

  // 3. Calculate the Sum
  const totalBalance = unpaidDeliveredOrders.reduce((acc, order) => {
    return acc + (Number(order.deliveryEarning) || 0);
  }, 0);

  const activeOrdersData = JSON.parse(JSON.stringify(activeOrders));

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Pass BOTH count and the calculated balance */}
        <StaffWorkHeader 
          count={activeOrdersData.length} 
          currentBalance={totalBalance} 
        />
        
        <div className="grid grid-cols-1 gap-6">
          <DeliveryQueue orders={activeOrdersData} />
        </div>
      </div>
    </div>
  );
}
