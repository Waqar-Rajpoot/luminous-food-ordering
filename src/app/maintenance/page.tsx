"use client";
import { Hammer, Zap, ShieldCheck, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#141F2D] flex flex-col items-center justify-center p-6 text-white overflow-hidden relative">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#EFA765]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="max-w-xl w-full text-center space-y-8 relative z-10">
        
        {/* Brand Logo */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <ShieldCheck size={40} className="text-[#EFA765]" />
          <h1 className="text-xl font-black uppercase tracking-[0.3em]">
            Admin<span className="text-[#EFA765]">Core</span>
          </h1>
        </div>

        {/* Animated Icon Container */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-[#EFA765]/20 blur-2xl rounded-full animate-pulse" />
          <div className="relative bg-[#1D2B3F] border border-[#EFA765]/30 p-8 rounded-[3rem] shadow-2xl">
            <Hammer size={60} className="text-[#EFA765] animate-bounce" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap size={16} className="text-[#EFA765] fill-[#EFA765]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">
              System Optimization
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase">
            Scheduled <span className="text-[#EFA765]">Refueling.</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed max-w-md mx-auto">
            We&rsquo;re currently upgrading the terminal matrix to improve your
            ordering experience. Our chefs and servers are standing by.
          </p>
        </div>

        {/* Progress Indicator (Faux) - UPDATED WITH CUSTOM ANIMATION CLASS */}
        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
          <div className="bg-[#EFA765] h-full w-2/3 animate-loading" />
        </div>

        {/* Action / Back Link */}
        <div className="pt-8 flex flex-col items-center gap-4">
          <Link href="/">
            <Button
              variant="ghost"
              className="text-sm px-4 py-2 border border-[#EFA765]/30 hover:bg-[#EFA765]/10 transition-colors duration-300 flex items-center gap-1 hover:text-[#EFA765]"
            >
              Check Status Again <ChevronRight size={14} />
            </Button>
          </Link>

          <p className="text-[9px] text-white/20 font-bold uppercase tracking-[0.2em]">
            Estimated uptime: {new Date().toLocaleDateString()} @ 2:00 PM
          </p>
        </div>
      </div>
    </div>
  );
}