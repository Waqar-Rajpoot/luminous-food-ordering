import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import UserProfile from '@/components/user-dashboard/UserProfile';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react'

const ManagerDashboard = async ({
  params,
}: any
) => {
  const { userId } = params;

  console.log("Manager Dashboard UserID:", userId);

  
    
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/sign-in");
  }
  
  // const user: any = session.user;
    try {
      // const userId = session.user._id;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard/${userId}`
      );
      console.log("Fetch response status:", res);
      const dashboardData = await res.json();
  
      if (!res.ok) {
        throw new Error(
          dashboardData.message || "Failed to fetch dashboard data"
        );
      }
  
      const {
        user,
        // latestOrders,
        // recentOrders,
        // latestBookings,
        // recentBookings,
        // reviews,
        // messages,
      } = dashboardData;
  
  return (
    <div className="min-h-screen p-8 bg-slate-900 text-white font-sans">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        <section>
          <UserProfile user={user} />
        </section>
      <div className='second-heading'>Manager dashboard features are under construction</div>
      </div>
    </div>
  )
} catch (error: any) {
    console.error("Error fetching staff dashboard data:", error.message);
    return (
      <div className="min-h-screen p-8 bg-slate-900 text-white font-sans">
        <div className="w-full max-w-7xl mx-auto space-y-8">
          <section>
            <p>Error fetching Manager dashboard data: {error.message}</p>
          </section>
        </div>
      </div>
    );
  }
}

export default ManagerDashboard