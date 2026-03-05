"use client";
import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  Package, 
  Star, 
  DollarSign,
  Calendar,
} from "lucide-react";

interface AnalyticsResponse {
  salesData: any[];
  stats: {
    totalRevenue: number;
    totalOrders: number;
    newUsers: number;
    pendingOrders: number;
  };
  topProducts: any[];
  categoryStats: any[];
}

const COLORS = ["#ea580c", "#f97316", "#fb923c", "#fdba74", "#fed7aa"];

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [selectedDate, setSelectedDate] = useState(""); 
  const [range, setRange] = useState("monthly"); // Added range state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        // Build query based on whether a specific date is picked or a range is active
        const queryParam = selectedDate 
          ? `date=${selectedDate}` 
          : `range=${range}`;
        
        const response = await fetch(`/api/analytics?${queryParam}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error loading analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [selectedDate, range]);

  if (loading || !data) {
    return <div className="p-6 text-white animate-pulse">Loading analytics...</div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-6 text-white">
      {/* Header & Controls */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h2 className="text-xl font-bold">Performance Overview</h2>
          <p className="text-zinc-500 text-sm">Showing data for {selectedDate || range}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          {/* Range Toggles - Hits your API's range logic */}
          <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-700">
            {["weekly", "monthly", "yearly"].map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRange(r);
                  setSelectedDate(""); // Clear date if range is clicked
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${
                  range === r && !selectedDate 
                    ? "bg-zinc-700 text-white" 
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Date Picker - Hits your API's selectedDate logic */}
          <div className="flex items-center gap-2 border border-zinc-700 p-2 rounded-lg bg-zinc-950/50">
            <Calendar size={14} className="text-zinc-500" />
            <input 
              type="date" 
              className="bg-transparent text-white outline-none text-xs cursor-pointer"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setRange(""); // Clear range if specific date is picked
              }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Revenue" value={`Rs. ${data.stats.totalRevenue.toLocaleString()}`} icon={<DollarSign size={18} className="text-orange-500" />} />
        <StatCard title="Orders" value={data.stats.totalOrders} icon={<Package size={18} className="text-blue-500" />} />
        <StatCard title="New Users" value={data.stats.newUsers} icon={<Users size={18} className="text-emerald-500" />} />
        <StatCard title="Pending" value={data.stats.pendingOrders} icon={<Star size={18} className="text-yellow-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 border border-zinc-700 p-4 rounded-2xl bg-zinc-950/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold flex items-center gap-2">
              <TrendingUp size={18} className="text-orange-500" /> Revenue Flow
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.salesData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="_id" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#000", border: "1px solid #3f3f46", borderRadius: "8px" }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#ea580c" strokeWidth={2} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories */}
        <div className="border border-zinc-700 p-4 rounded-2xl bg-zinc-950/20">
          <h3 className="font-semibold mb-6">Category Share</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.categoryStats}
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="_id"
                >
                  {data.categoryStats.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {data.categoryStats.map((cat, i) => (
              <div key={cat._id} className="flex justify-between text-xs">
                <span className="text-zinc-400 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  {cat._id}
                </span>
                <span className="font-bold">Rs. {cat.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="border border-zinc-700 p-4 rounded-2xl bg-zinc-950/20 overflow-hidden">
        <h3 className="font-semibold mb-4">Top 5 Products</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-zinc-500 border-b border-zinc-700">
                <th className="pb-3 px-2">Item</th>
                <th className="pb-3 text-center">Sold</th>
                <th className="pb-3 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {data.topProducts.map((p) => (
                <tr key={p._id}>
                  <td className="py-3 px-2 font-medium">{p.name}</td>
                  <td className="py-3 text-center">{p.totalSold}</td>
                  <td className="py-3 text-right text-orange-500 font-bold">Rs. {p.totalRevenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: any, icon: any }) {
  return (
    <div className="border border-zinc-700 p-4 rounded-xl bg-zinc-950/40 hover:border-zinc-500 transition-colors">
      <div className="flex justify-between items-center mb-2">
        <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">{title}</span>
        {icon}
      </div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}