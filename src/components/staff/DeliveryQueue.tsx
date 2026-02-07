"use client";
import React from "react";
import { MapPin, Phone, Package, ChevronRight, User, ShoppingBag, Banknote, CreditCard, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  deliveryStatus: string;
  paymentMethod: 'stripe' | 'cod'; // Added to track payment type
  items: any[];
  shippingAddress: {
    addressLine1: string;
    city: string;
    phoneNumber: string;
  };
  finalAmount: number;
  deliveryEarning?: number;
}

export default function DeliveryQueue({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="py-20 text-center bg-[#1E293B]/20 rounded-[3rem] border border-dashed border-white/10">
        <div className="bg-[#1E293B] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="text-slate-600" size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-400">Queue is empty</h3>
        <p className="text-slate-500 text-sm">Take a break! No new orders assigned to you yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 pl-2">Active Assignments</h2>
      <div className="grid grid-cols-1 gap-5">
        {orders.map((order) => (
          <div 
            key={order._id} 
            className="group relative bg-[#1E293B]/40 hover:bg-[#1E293B]/60 backdrop-blur-xl border border-white/5 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-7 transition-all duration-300"
          >
            {/* Delivery Earning Badge */}
            <div className="absolute -top-2 -right-2 bg-green-500 text-[#0F172A] px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter flex items-center gap-1.5 shadow-lg shadow-green-500/20 z-10">
              <Banknote size={12} />
              You Earn: PKR {order.deliveryEarning || 0}
            </div>

            <div className="flex flex-col lg:flex-row justify-between gap-6">
              
              {/* Left Section: Core Info */}
              <div className="space-y-4 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-[#EFA765] text-[#0F172A] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    {order.deliveryStatus.replace("-", " ")}
                  </span>
                  
                  {/* Payment Method Badge */}
                  {order.paymentMethod === 'cod' ? (
                    <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-bold px-3 py-1 rounded-full uppercase flex items-center gap-1">
                      <Coins size={12} /> Cash on Delivery
                    </span>
                  ) : (
                    <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold px-3 py-1 rounded-full uppercase flex items-center gap-1">
                      <CreditCard size={12} /> Paid Online
                    </span>
                  )}
                  
                  <span className="text-slate-500 font-mono text-xs">{order.orderId}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <User size={18} className="text-[#EFA765]" /> {order.customerName}
                    </h3>
                    <p className="text-slate-400 mt-2 flex items-start gap-2 text-sm leading-snug">
                      <MapPin size={16} className="text-slate-500 mt-0.5 shrink-0" />
                      {order.shippingAddress.addressLine1}, {order.shippingAddress.city}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 justify-center border-t border-white/5 pt-4 md:border-t-0 md:pt-0">
                    <p className="text-slate-400 flex items-center gap-2 text-sm">
                      <Phone size={14} className="text-slate-500" /> {order.shippingAddress.phoneNumber}
                    </p>
                    <p className="text-slate-400 flex items-center gap-2 text-sm">
                      <ShoppingBag size={14} className="text-slate-500" /> {order.items?.length || 0} Items ordered
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Section: Action Area */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between lg:justify-center gap-5 border-t lg:border-t-0 lg:border-l border-white/5 pt-5 lg:pt-0 lg:pl-8">
                
                <div className="text-left sm:text-left lg:text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                    {order.paymentMethod === 'cod' ? "Cash to Collect" : "Already Paid"}
                  </p>
                  <p className={`text-2xl font-black ${order.paymentMethod === 'cod' ? 'text-[#EFA765]' : 'text-green-400'}`}>
                    PKR {order.paymentMethod === 'cod' ? order.finalAmount.toLocaleString() : "0"}
                  </p>
                  {order.paymentMethod === 'stripe' && (
                    <p className="text-[9px] text-slate-500 font-bold uppercase mt-1 italic">Do not collect cash</p>
                  )}
                </div>

                <Link href={`/user-dashboard/order/${order.orderId}/deliver`} className="w-full sm:flex-1 lg:w-auto">
                  <Button className="w-full bg-white text-[#0F172A] hover:bg-[#EFA765] hover:text-[#0F172A] rounded-2xl font-black uppercase text-[11px] tracking-widest h-14 lg:h-12 px-8 group transition-all shadow-lg shadow-black/20">
                    Process Delivery
                    <ChevronRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}