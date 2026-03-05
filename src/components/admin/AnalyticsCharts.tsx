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
  Calendar
} from "lucide-react";

interface SalesData {
  _id: string;
  revenue: number;
  orders: number;
}

interface TopProduct {
  _id: string;
  name: string;
  totalSold: number;
  totalRevenue: number;
}

interface CategoryStat {
  _id: string;
  value: number;
}

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  newUsers: number;
  pendingOrders: number;
}

interface AnalyticsResponse {
  salesData: SalesData[];
  stats: Stats;
  topProducts: TopProduct[];
  categoryStats: CategoryStat[];
}

const COLORS = ["#ea580c", "#f97316", "#fb923c", "#fdba74", "#fed7aa"];

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [selectedDate, setSelectedDate] = useState(""); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const queryParam = selectedDate ? `date=${selectedDate}` : `range=monthly`;
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
  }, [selectedDate]);

  if (loading || !data) {
    return <div className="p-6 text-white animate-pulse">Loading analytics...</div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-6 text-white max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Executive Dashboard</h1>
          <p className="text-zinc-400 text-sm">Insights for {selectedDate || "the current month"}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex flex-1 md:flex-none items-center gap-2 border border-zinc-700 p-2 rounded-lg bg-zinc-950/50">
            <Calendar size={16} className="text-zinc-500" />
            <input 
              type="date" 
              className="bg-transparent text-white outline-none text-sm cursor-pointer w-full"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            {selectedDate && (
              <button 
                onClick={() => setSelectedDate("")}
                className="text-[10px] text-gray-400 hover:text-white ml-2 uppercase font-bold"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Revenue" value={`Rs. ${data.stats.totalRevenue.toLocaleString()}`} icon={<DollarSign className="text-orange-500" />} />
          <StatCard title="Orders" value={data.stats.totalOrders} icon={<Package className="text-blue-500" />} />
          <StatCard title="New Users" value={data.stats.newUsers} icon={<Users className="text-emerald-500" />} />
          <StatCard title="Pending" value={data.stats.pendingOrders} icon={<Star className="text-yellow-500" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Revenue Chart */}
          <div className="lg:col-span-2 border border-zinc-700 p-4 md:p-6 rounded-2xl bg-zinc-950/20">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
              <TrendingUp size={20} className="text-orange-500" /> 
              {selectedDate ? "Hourly Performance" : "Revenue Trend"}
            </h2>
            <div className="h-[250px] md:h-[350px] w-full">
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
                  <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `Rs.${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#000", border: "1px solid #3f3f46", borderRadius: "8px" }}
                    itemStyle={{ color: "#ea580c" }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#ea580c" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="border border-zinc-700 p-4 md:p-6 rounded-2xl bg-zinc-950/20">
            <h2 className="text-lg font-semibold mb-6">Sales by Category</h2>
            <div className="h-[250px] md:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.categoryStats}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="_id"
                  >
                    {data.categoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 gap-2 mt-4">
              {data.categoryStats.map((cat, i) => (
                <div key={cat._id} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-zinc-400 truncate max-w-[100px]">{cat._id}</span>
                  </div>
                  <span className="font-medium">Rs. {cat.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products Table */}
        <div className="border border-zinc-700 p-4 md:p-6 rounded-2xl bg-zinc-950/20">
          <h2 className="text-lg font-semibold mb-4">Top Performing Products</h2>
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <div className="inline-block min-w-full align-middle px-4 md:px-0">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-zinc-500 border-b border-zinc-700 text-xs md:text-sm">
                    <th className="pb-3 font-medium">Product Name</th>
                    <th className="pb-3 font-medium text-center">Units</th>
                    <th className="pb-3 font-medium text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700">
                  {data.topProducts.map((product) => (
                    <tr key={product._id} className="text-xs md:text-sm group">
                      <td className="py-4 font-medium truncate max-w-[120px] md:max-w-none">{product.name}</td>
                      <td className="py-4 text-center">{product.totalSold}</td>
                      <td className="py-4 text-right text-orange-500 font-bold whitespace-nowrap">Rs. {product.totalRevenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="border border-zinc-700 p-4 md:p-5 rounded-2xl bg-zinc-950/30">
      <div className="flex justify-between items-start mb-2">
        <span className="text-zinc-400 text-xs md:text-sm font-medium">{title}</span>
        {icon}
      </div>
      <div className="text-xl md:text-2xl font-bold">{value}</div>
    </div>
  );
}