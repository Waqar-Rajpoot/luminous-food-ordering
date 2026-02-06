import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link"; // Added for navigation
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/models/Order.model";
import DeliveryQueue from "@/components/staff/DeliveryQueue";
import StaffWorkHeader from "@/components/staff/StaffWorkHeader";
import { ChevronLeft } from "lucide-react"; // Added icons
import { Button } from "@/components/ui/button"; // Assuming you use shadcn

export default async function StaffConsolePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const session = await getServerSession(authOptions);

  if (!session) redirect("/sign-in");
  
  const isAdmin = session.user.role === "admin";
  const isOwner = session.user.role === "staff" && session.user._id === userId;

  if (!isAdmin && !isOwner) {
    return notFound();
  }

  await dbConnect();

  // 1. Fetch Active Assignments
  const activeOrders = await OrderModel.find({
    assignedStaffId: userId,
    deliveryStatus: { $in: ["assigned", "picked-up", "out-for-delivery"] }
  }).sort({ updatedAt: -1 }).lean();

  // 2. Fetch Delivered but UNPAID orders
  const unpaidDeliveredOrders = await OrderModel.find({
    assignedStaffId: userId,
    deliveryStatus: "delivered",
    isEarningsPaid: { $ne: true }
  }).select("deliveryEarning").lean();

  // 3. Calculate Sum
  const totalBalance = unpaidDeliveredOrders.reduce((acc, order) => {
    return acc + (Number(order.deliveryEarning) || 0);
  }, 0);

  const activeOrdersData = JSON.parse(JSON.stringify(activeOrders));

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation Button Row */}
        <div className="flex justify-between items-center">
          <Link href={`/user-dashboard/${userId}`}>
            <Button 
              variant="ghost" 
              className="text-slate-400 hover:text-[#efa765] hover:bg-[#efa765]/10 flex items-center gap-2 px-0"
            >
              <ChevronLeft size={18} />
              <span>Back to Personal Dashboard</span>
            </Button>
          </Link>
          
          {isAdmin && (
            <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-1 rounded border border-red-500/30 uppercase font-bold">
              Admin View Mode
            </span>
          )}
        </div>

        {/* Header Section */}
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