"use client";
import { ShoppingBag, Star, MessageSquare, Wallet } from "lucide-react";

export default function MetricCards({ allOrders, reviews, messages }: any) {
  const totalSpent = allOrders?.reduce((acc: number, curr: any) => acc + (curr.finalAmount || 0), 0) || 0;

  const stats = [
    { label: "Orders", val: allOrders?.length || 0, icon: ShoppingBag, color: "text-blue-400" },
    { label: "Spent", val: `PKR ${totalSpent.toLocaleString()}`, icon: Wallet, color: "text-[#EFA765]" },
    { label: "Reviews", val: reviews?.length || 0, icon: Star, color: "text-amber-400" },
    { label: "Messages", val: messages?.length || 0, icon: MessageSquare, color: "text-emerald-400" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((item, idx) => (
        <div key={idx} className="bg-[#1E293B]/40 backdrop-blur-md border border-white/5 p-6 rounded-[2rem] hover:border-[#EFA765]/40 transition-all group">
          <item.icon className={`${item.color} mb-4 group-hover:scale-110 transition-transform`} size={28} />
          <h2 className="text-2xl md:text-3xl font-black text-white leading-none">{item.val}</h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-2">{item.label}</p>
        </div>
      ))}
    </div>
  );
}