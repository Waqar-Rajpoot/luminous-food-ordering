"use client";

import { useEffect, useState } from "react";
import { 
  Star, Users, Utensils, Box, 
  Loader2, DollarSign, TrendingUp,
  AlertCircle, Zap,
  ListOrdered, Tag, 
  MessageSquare, Settings
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { useSession } from "next-auth/react";
import UserProfile from "@/components/user-dashboard/UserProfile";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  const adminPages = [
    { href: '/admin/product-management', label: 'Products', desc: `Manage ${stats?.counts?.products || 0} items`, icon: <Box size={24}/> },
    { href: '/admin/orders', label: 'Orders', desc: 'Track live status & OTPs', icon: <ListOrdered size={24}/> },
    { href: '/admin/deals', label: 'Deals', desc: 'Manage bundle offers', icon: <Tag size={24}/> },
    { href: '/admin/reviews', label: 'Reviews', desc: 'Moderate feedback', icon: <Star size={24}/> },
    { href: '/admin/users', label: 'Users', desc: 'Manage customer accounts', icon: <Users size={24}/> },
    { href: '/admin/messages', label: 'Messages', desc: 'Read support inquiries', icon: <MessageSquare size={24}/> },
    { href: '/delivery/verify', label: 'Categories', desc: 'Organize menu structure', icon: <Utensils size={24}/> },
    { href: '/admin/settings', label: 'Settings', desc: 'App configurations', icon: <Settings size={24}/> },
  ];

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
    <div className="min-h-screen text-slate-100 p-4 sm:p-6 lg:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Branding & Profile - Responsive flex and text sizes */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 border-b border-white/10 pb-6 md:pb-8 gap-6">
          <div className="w-full md:w-auto flex flex-col justify-center md:justify-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold yeseva-one tracking-tight">
              Admin <span className="text-[#efa765]">Summary</span>
            </h1>
            <p className="text-slate-400 mt-1 sm:mt-2 varela-round text-sm sm:text-base lg:text-lg">
              Store performance insights and management.
            </p>
          </div>
          <div className="w-full md:w-auto flex justify-center md:justify-center">
             <UserProfile user={session?.user as any} />
          </div>
        </header>

        {/* Financial Stats - 1 col on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 md:mb-12">
          <StatCard title="Total Revenue" value={`Rs. ${stats?.financials?.totalRevenue}`} icon={<DollarSign className="text-emerald-400"/>} desc="From paid orders" />
          <StatCard title="Avg Rating" value={`${stats?.highlights?.storeRating} / 5`} icon={<Star className="text-yellow-400"/>} desc={`Across ${stats?.counts?.reviews} reviews`} />
          <StatCard title="Total Sales" value={stats?.highlights?.totalSales} icon={<TrendingUp className="text-blue-400"/>} desc={`Best: ${stats?.highlights?.topProduct}`} />
          <StatCard title="Active Deals" value={stats?.counts?.deals} icon={<Zap className="text-[#efa765]"/>} desc="Live on store" />
        </div>

        {/* Action Required Section - Stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 md:mb-12">
           <AlertBox count={stats?.status?.pending} label="Pending Orders" color="text-orange-400" />
           <AlertBox count={stats?.status?.pendingReviews} label="New Reviews" color="text-blue-400" />
           <AlertBox count={stats?.status?.canceled} label="Canceled Orders" color="text-red-400" />
        </div>

        {/* Management Links Section */}
        <h2 className="text-xl sm:text-2xl font-bold yeseva-one text-[#efa765] mb-6 md:mb-8">Management Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {adminPages.map((page, index) => (
            <AdminPageCard 
              key={index}
              href={page.href} 
              title={page.label} 
              desc={page.desc} 
              icon={page.icon} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// UI Helper Components
function StatCard({ title, value, icon, desc }: any) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 sm:p-6 rounded-2xl shadow-xl hover:bg-white/10 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 sm:p-3 bg-white/5 rounded-xl border border-white/10 shadow-inner">{icon}</div>
      </div>
      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1 tracking-tight">{value}</h3>
      <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest">{title}</p>
      <p className="text-[#efa765] text-[9px] sm:text-[10px] mt-2 font-medium italic">{desc}</p>
    </div>
  );
}

function AlertBox({ count, label, color }: any) {
  return (
    <div className="bg-white/5 border border-white/10 p-4 sm:p-5 rounded-xl flex items-center justify-between hover:bg-white/10 transition-all">
      <div className="flex items-center gap-3">
        <AlertCircle size={16} className={color} />
        <span className="text-xs sm:text-sm font-semibold text-slate-200">{label}</span>
      </div>
      <span className={`text-xl sm:text-2xl font-black ${color}`}>{count}</span>
    </div>
  );
}

function AdminPageCard({ href, title, desc, icon }: any) {
  return (
    <Link href={href}>
      <Card className="bg-white/5 border-white/10 hover:border-[#efa765]/50 hover:bg-white/10 transition-all group cursor-pointer overflow-hidden h-full">
        <CardContent className="p-4 sm:p-6 flex flex-row sm:flex-col items-center sm:items-start gap-4">
          <div className="text-[#efa765] group-hover:scale-110 transition-transform p-2 sm:p-3 bg-white/5 rounded-xl sm:rounded-2xl shrink-0">
            {icon}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-[#efa765] transition-colors truncate">{title}</h4>
            <p className="text-slate-400 text-[10px] sm:text-xs mt-0.5 sm:mt-1 leading-snug sm:leading-relaxed line-clamp-2">{desc}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col justify-center items-center h-[80vh]">
      <Loader2 className="h-10 w-10 animate-spin text-[#efa765]" />
      <p className="mt-4 text-slate-400 font-medium tracking-widest uppercase text-[10px]">Syncing Admin Data...</p>
    </div>
  );
}