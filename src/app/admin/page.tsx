"use client";

import { useEffect, useState } from "react";
import {
  Star,
  Loader2,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Zap,
} from "lucide-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import UserProfile from "@/components/user-dashboard/UserProfile";
import AnalyticsDashboard from "@/components/admin/AnalyticsCharts"; 

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get("/api/admin-summary");
        if (data.success) setStats(data.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen text-slate-100 p-4 sm:p-6 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
        {/* Profile Section - Full Width & Simplified Alignment */}
        <section className="w-full border-b border-white/10 pb-6 md:pb-8">
          <UserProfile user={session?.user as any} />
        </section>

        {/* Top Level Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Total Revenue"
            value={`Rs. ${stats?.financials?.totalRevenue?.toLocaleString()}`}
            icon={<DollarSign className="text-emerald-400" />}
            desc="From paid orders"
          />
          <StatCard
            title="Avg Rating"
            value={`${stats?.highlights?.storeRating} / 5`}
            icon={<Star className="text-yellow-400" />}
            desc={`Across ${stats?.counts?.reviews} reviews`}
          />
          <StatCard
            title="Total Sales"
            value={stats?.highlights?.totalSales}
            icon={<TrendingUp className="text-blue-400" />}
            desc={`Best: ${stats?.highlights?.topProduct}`}
          />
          <StatCard
            title="Active Deals"
            value={stats?.counts?.deals}
            icon={<Zap className="text-[#efa765]" />}
            desc="Live on store"
          />
        </div>

        {/* Actionable Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AlertBox
            count={stats?.status?.pending}
            label="Pending Orders"
            color="text-orange-400"
          />
          <AlertBox
            count={stats?.status?.pendingReviews}
            label="New Reviews"
            color="text-blue-400"
          />
          <AlertBox
            count={stats?.status?.canceled}
            label="Canceled Orders"
            color="text-red-400"
          />
        </div>

        {/* Analytics Section */}
        <section className="border-t border-white/5 pt-12">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold yeseva-one">
              Deep <span className="text-[#efa765]">Analytics</span>
            </h2>
            <p className="text-zinc-500 varela-round text-sm mt-2">
              Visualize trends and category performance for the current business cycle.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-zinc-700 rounded-3xl overflow-hidden shadow-2xl">
            <AnalyticsDashboard />
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, desc }: any) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 sm:p-6 rounded-2xl shadow-xl hover:bg-white/10 transition-colors group">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 sm:p-3 bg-white/5 rounded-xl border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1 tracking-tight">
        {value}
      </h3>
      <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
        {title}
      </p>
      <p className="text-[#efa765] text-[9px] sm:text-[10px] mt-2 font-medium italic">
        {desc}
      </p>
    </div>
  );
}

function AlertBox({ count, label, color }: any) {
  return (
    <div className="bg-white/5 border border-white/10 p-4 sm:p-5 rounded-xl flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer">
      <div className="flex items-center gap-3">
        <AlertCircle size={16} className={color} />
        <span className="text-xs sm:text-sm font-semibold text-slate-200">
          {label}
        </span>
      </div>
      <span className={`text-xl sm:text-2xl font-black ${color}`}>{count}</span>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col justify-center items-center h-[80vh]">
      <Loader2 className="h-10 w-10 animate-spin text-[#efa765]" />
      <p className="mt-4 text-zinc-500 font-medium tracking-widest uppercase text-[10px]">
        Syncing Admin Data...
      </p>
    </div>
  );
}