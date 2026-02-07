"use client";
import { useEffect, useState } from "react";
import { Moon, Clock, Calendar, ChevronLeft, Utensils } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function StoreClosedPage() {
  const [openingTime, setOpeningTime] = useState({ open: "09:00", close: "23:00" });

  useEffect(() => {
    async function fetchHours() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.success) setOpeningTime(data.settings.operatingHours);
      } catch (err) {
        console.error(err);
        console.error("Failed to load hours");
      }
    }
    fetchHours();
  }, []);

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-6 text-white overflow-hidden relative">
      
      {/* Soft Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full text-center space-y-10 relative z-10">
        
        {/* Animated Icon */}
        <div className="relative inline-block">
          <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
          <div className="relative bg-[#1D2B3F] border border-blue-400/20 p-10 rounded-full shadow-2xl">
            <Moon size={50} className="text-blue-400" />
            <div className="absolute -top-1 -right-1">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-[#1D2B3F]"></span>
              </span>
            </div>
          </div>
        </div>

        {/* Messaging */}
        <div className="space-y-4">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            Kitchen is <span className="text-blue-400">Resting.</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            Even the best chefs need sleep. Our ovens are off right now, but we’ll be back to serve you fresh flavors soon!
          </p>
        </div>

        {/* Operational Hours Card with NEW Animation */}
        <div className="relative bg-[#1D2B3F]/50 backdrop-blur-md border border-white/5 rounded-3xl p-6 space-y-4 overflow-hidden">
          
          {/* --- NEW ANIMATION CLASS APPLIED HERE --- */}
          <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-blue-400 to-transparent opacity-50 animate-loading" />
          
          <div className="flex items-center justify-center gap-2 text-[#EFA765] mb-2">
            <Clock size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Operating Schedule</span>
          </div>
          
          <div className="flex justify-between items-center px-4">
            <div className="text-left">
              <p className="text-[9px] uppercase font-bold text-slate-500">Opens at</p>
              <p className="text-xl font-black text-white">{openingTime.open} AM</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-right">
              <p className="text-[9px] uppercase font-bold text-slate-500">Closes at</p>
              <p className="text-xl font-black text-white">{openingTime.close} PM</p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-center gap-4 text-[10px] font-bold text-slate-400">
            <span className="flex items-center gap-1"><Calendar size={12}/> Mon - Sun</span>
            <span className="flex items-center gap-1"><Utensils size={12}/> Delivery & Pickup</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="pt-6">
          <Link href="/">
            <Button className="bg-white text-[#0F172A] hover:bg-[#EFA765] hover:text-white rounded-2xl font-black uppercase text-[11px] h-12 px-8 transition-all group shadow-lg shadow-blue-500/10">
              <ChevronLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Explore Menu
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}