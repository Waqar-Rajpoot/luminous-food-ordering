import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import UserProfile from "@/components/user-dashboard/UserProfile";
import MetricCards from "@/components/user-dashboard/MatricsCards";
import { UserOrders } from "@/components/user-dashboard/UserOrders";
import { PastOrdersTable } from "@/components/user-dashboard/PastData";
import { UserReviews } from "@/components/user-dashboard/UserReviews";
import { UserMessages } from "@/components/user-dashboard/UserMessages";

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default async function DashboardPage({ params }: PageProps) {
  // 1. Await params (Next.js 15 requirement)
  const { userId } = await params;
  
  // 2. Auth Guard
  const session = await getServerSession(authOptions);
  if (!session) redirect("/sign-in");

  // 3. Absolute URL construction
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const apiUrl = `${baseUrl}/api/dashboard/${userId}`;

  let data;
  try {
    const res = await fetch(apiUrl, {
      cache: 'no-store', // Ensures fresh data on every visit
      headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) {
      if (res.status === 404) return notFound();
      throw new Error(`Failed to fetch: ${res.status}`);
    }

    data = await res.json();
  } catch (error) {
    console.error("Fetch Error:", error);
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-center p-6">
        <div className="space-y-4">
          <h2 className="text-[#EFA765] text-2xl font-bold">Server Connection Lost</h2>
          <p className="text-slate-400">We couldn&apos;t reach the Luminous API. Please ensure the server is running.</p>
        </div>
      </div>
    );
  }

  // 4. Render UI
  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans">
      {/* Background Aesthetic Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#EFA765]/5 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Profile Header */}
        <section className="animate-in fade-in slide-in-from-top-4 duration-700">
          <UserProfile user={data.user} />
        </section>

        {/* Stats Section */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <MetricCards 
            allOrders={data.allOrders} 
            reviews={data.reviews} 
            messages={data.messages} 
          />
        </section>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Activity Column */}
          <div className="lg:col-span-8 space-y-8">
            <div className="rounded-4xl bg-[#1E293B]/40 backdrop-blur-xl border border-white/5 shadow-2xl overflow-hidden">
               <UserOrders recentOrders={data.recentOrders} />
            </div>
            
            <div className="rounded-4xl bg-[#1E293B]/40 backdrop-blur-xl border border-white/5 shadow-2xl overflow-hidden">
               <PastOrdersTable allOrders={data.allOrders} />
            </div>
          </div>

          {/* Sidebar Column */}
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