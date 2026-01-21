"use client";
import { Truck, Clock, Banknote } from "lucide-react";

interface HeaderProps {
  count: number;          // Total pending orders
  currentBalance?: number; // Sum of delivered but unpaid orders
}

// Added default values to props to prevent "undefined" errors
export default function StaffWorkHeader({ count = 0, currentBalance = 0 }: HeaderProps) {
  const today = new Date().toLocaleDateString('en-PK', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });

  return (
    <div className="space-y-6">
      {/* Header Top Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
            Staff <span className="text-[#EFA765]">Console</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
            <Clock size={14} className="text-[#EFA765]" /> {today}
          </p>
        </div>
        
        {/* Status Indicator */}
        <div className="bg-[#1E293B]/60 backdrop-blur-md border border-white/5 rounded-2xl px-5 py-3 flex items-center gap-4 w-fit">
          <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-none">Status</p>
            <p className="text-sm font-bold text-white uppercase tracking-tighter">On Duty</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Pending Card */}
        <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-6 rounded-[2rem] border border-white/5 shadow-xl transition-all hover:border-[#EFA765]/20">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#EFA765]/10 rounded-2xl text-[#EFA765]">
              <Truck size={24} />
            </div>
          </div>
          <h3 className="text-3xl font-black text-white">{count}</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Pending Deliveries</p>
        </div>

        {/* Dynamic Earnings Card */}
        <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-6 rounded-[2rem] border border-white/5 shadow-xl transition-all hover:border-green-500/20">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-500/10 rounded-2xl text-green-500">
              <Banknote size={24} />
            </div>
            {(currentBalance ?? 0) > 0 && (
              <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 rounded-lg font-bold">
                Unpaid
              </span>
            )}
          </div>
          
          <h3 className="text-3xl font-black text-white">
            {/* Added fallback to 0 before calling toLocaleString */}
            PKR {(currentBalance ?? 0).toLocaleString()}
          </h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Current Balance</p>
        </div>
      </div>
    </div>
  );
}