import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import MatricsCards from "@/components/user-dashboard/MatricsCards";
import {
  PastOrdersTable,
} from "@/components/user-dashboard/PastData";

import { UserMessages } from "@/components/user-dashboard/UserMessages";
import { UserOrders } from "@/components/user-dashboard/UserOrders";
import { UserProfile } from "@/components/user-dashboard/UserProfile";
import { UserReviews } from "@/components/user-dashboard/UserReviews";
import ChatInterface from "@/components/user-dashboard/ChatInterface"
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export default async function DashboardPage({
  params,
}: any) {
  const { userId } = await params;


  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/sign-in");
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard/${userId}`
    );
    const dashboardData = await res.json();

    if (!res.ok) {
      throw new Error(
        dashboardData.message || "Failed to fetch dashboard data"
      );
    }

    const {
      user,
      allOrders,
      recentOrders,
      reviews,
      messages,
    } = dashboardData;

    return (
      <div className="min-h-screen p-8 bg-slate-900 text-white font-sans">
        <div className="w-full max-w-7xl mx-auto space-y-8">
          <section>
            <UserProfile user={user} />
          </section>
          <section>
            <div className="mb-8">
              <MatricsCards
                allOrders={allOrders}
                reviews={reviews}
                messages={messages}
              />
            </div>
          </section>
          <section>
            <hr className="border-slate-700 my-8" />
          </section>
          <section>
            <h2 className="font-bold text-[#EFA765] mb-4 third-heading">
              Recent Activity
            </h2>
            <p className="text-gray-400 mb-6">
              Here is a summary of your most recent orders, bookings, reviews,
              and messages.
            </p>
          </section>
          <section className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            <UserOrders recentOrders={recentOrders} />
          </section>
          <hr className="border-slate-700 my-8" />
          <section>
            <h2 className="font-bold text-[#EFA765] mb-4 third-heading">
              All Activities
            </h2>
            <p className="text-gray-400 mb-6">
              Here are your past orders and bookings for your reference.
            </p>
          </section>
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PastOrdersTable allOrders={allOrders} />
          </section>
          <section>
            <hr className="border-slate-700 my-8" />
          </section>
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <UserReviews reviews={reviews} />
            <UserMessages messages={messages} />
          </section>
          
          <section className="mt-8">
            <h2 className="font-bold text-[#EFA765] mb-4 third-heading">
              Need Help? Contact Support
            </h2>
            <p className="text-gray-400 mb-6">
              Chat instantly with our support team for any issues regarding your orders or bookings.
            </p>
            
            <div className="mt-8 max-w-4xl">
              <ChatInterface />
            </div>
          </section>
        </div>
      </div>
    );
  } catch (error: any) {
    console.error("Server-side data fetching error:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-xl text-red-500">{error.message}</div>
      </div>
    );
  }
}
