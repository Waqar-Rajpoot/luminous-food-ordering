import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import UserProfile from "@/components/user-dashboard/UserProfile";
import MetricCards from "@/components/user-dashboard/MatricsCards";
import { UserOrders } from "@/components/user-dashboard/UserOrders";
import { PastOrdersTable } from "@/components/user-dashboard/PastData";
import { UserReviews } from "@/components/user-dashboard/UserReviews";
import { UserMessages } from "@/components/user-dashboard/UserMessages";

// Import your Database connection and Models directly
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
  
  // 1. Auth Guard
  const session = await getServerSession(authOptions);
  if (!session) redirect("/sign-in");

  // 2. Direct Database Fetching (Replaces the broken fetch logic)
  let data;
  try {
    await dbConnect();

    // Fetch all required data in parallel for maximum speed
    const [user, allOrders, reviews, messages] = await Promise.all([
      UserModel.findById(userId).select("-password").lean(),
      OrderModel.find({ userId }).sort({ createdAt: -1 }).lean(),
      ReviewModel.find({ userId }).sort({ createdAt: -1 }).lean(),
      MessageModel.find({ 
        $or: [{ userId: userId }, { email: session.user?.email }] 
      }).sort({ createdAt: -1 }).lean()
    ]);

    if (!user) return notFound();

    // Serialize data for the client (removes MongoDB ObjectIDs that cause hydration errors)
    data = JSON.parse(JSON.stringify({
      user,
      allOrders,
      recentOrders: allOrders.slice(0, 5),
      reviews,
      messages
    }));

  } catch (error) {
    console.error("Database Error:", error);
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-center p-6">
        <div className="space-y-4">
          <h2 className="text-[#EFA765] text-2xl font-bold">Database Error</h2>
          <p className="text-slate-400">We encountered an issue connecting to the database. Please try again later.</p>
        </div>
      </div>
    );
  }

  // 3. Render UI (Remains largely the same, but now 100% reliable)
  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#EFA765]/5 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
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