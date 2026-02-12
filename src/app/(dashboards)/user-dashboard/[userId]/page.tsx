import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link"; // Added for routing
import { Truck, ChevronRight } from "lucide-react"; // Added for UI
import { Button } from "@/components/ui/button";

import UserProfile from "@/components/user-dashboard/UserProfile";
import MetricCards from "@/components/user-dashboard/MatricsCards";
import { UserOrders } from "@/components/user-dashboard/UserOrders";
import { PastOrdersTable } from "@/components/user-dashboard/PastData";
import { UserReviews } from "@/components/user-dashboard/UserReviews";
import { UserMessages } from "@/components/user-dashboard/UserMessages";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import OrderModel from "@/models/Order.model";
import ReviewModel from "@/models/Review.model";
import MessageModel from "@/models/ContactMessage.model";

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default async function DashboardPage({ params }: PageProps) {
  const { userId } = await params;
  
  const session = await getServerSession(authOptions);
  if (!session) redirect("/sign-in");

  let data;
  try {
    await dbConnect();

    // Fetch primary data
    const [user, allOrders, reviews, messages] = await Promise.all([
      UserModel.findById(userId).select("-password").lean(),
      OrderModel.find({ userId }).sort({ createdAt: -1 }).lean(),
      ReviewModel.find({ userId }).sort({ createdAt: -1 }).lean(),
      MessageModel.find({ 
        $or: [{ userId: userId }, { email: session.user?.email }] 
      }).sort({ createdAt: -1 }).lean()
    ]);

    if (!user) return notFound();

    // STAFF SPECIFIC: Fetch active workload only if the user is staff
    let activeTaskCount = 0;
    if (user.role === "staff") {
      activeTaskCount = await OrderModel.countDocuments({
        assignedStaffId: userId,
        deliveryStatus: { $in: ["assigned", "picked-up", "out-for-delivery"] }
      });
    }

    data = JSON.parse(JSON.stringify({
      user,
      allOrders,
      recentOrders: allOrders.slice(0, 5),
      reviews,
      messages,
      activeTaskCount
    }));

  } catch (error) {
    console.error("Database Error:", error);
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-center p-6">
         {/* Error UI remains same */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans -mt-5">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#EFA765]/5 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* --- STAFF SWITCHER BANNER --- */}
        {data.user.role === 'staff' && (
          <section className="animate-in fade-in zoom-in duration-500">
            <div className="relative group overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#EFA765] to-[#f39c12] p-[1px]">
              <div className="bg-[#0F172A]/90 backdrop-blur-xl rounded-[calc(2rem-1px)] p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="bg-[#EFA765]/20 p-4 rounded-2xl border border-[#EFA765]/30">
                    <Truck className="text-[#EFA765] w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tight italic">
                      Staff <span className="text-[#EFA765]">Work Mode</span>
                    </h2>
                    <p className="text-slate-400 text-sm">
                      You have <span className="text-white font-bold">{data.activeTaskCount}</span> pending deliveries assigned to you.
                    </p>
                  </div>
                </div>
                
                <Link href={`/user-dashboard/${userId}/staff-console`} className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-[#EFA765] hover:bg-[#EFA765]/90 text-[#0F172A] font-black uppercase tracking-widest px-8 h-14 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#EFA765]/20">
                    Switch to Console
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}
        {/* ------------------------------ */}

        <section className="animate-in fade-in slide-in-from-top-4 duration-700">
          <UserProfile user={data.user} />
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <MetricCards 
            allOrders={data.allOrders} 
            reviews={data.reviews} 
            messages={data.messages} 
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            <div className="rounded-[2.5rem] bg-[#1E293B]/40 backdrop-blur-xl border border-white/5 shadow-2xl overflow-hidden">
                <UserOrders recentOrders={data.recentOrders} />
            </div>
            
            <div className="rounded-[2.5rem] bg-[#1E293B]/40 backdrop-blur-xl border border-white/5 shadow-2xl overflow-hidden">
                <PastOrdersTable allOrders={data.allOrders} />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="lg:sticky lg:top-24 space-y-8">
              <UserReviews reviews={data.reviews} />
              <UserMessages messages={data.messages} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}