"use client";
import { History, CreditCard, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";

// Helper to handle hydration safely without cascading renders
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export const PastOrdersTable = ({ allOrders }: any) => {
  const isMounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!isMounted) return <div className="min-h-[400px] animate-pulse bg-white/5 rounded-[2rem]" />;

  return (
    <div className="flex flex-col h-full max-h-[600px]">
      {/* Header - Fixed */}
      <div className="p-6 sm:p-8 border-b border-white/5 flex items-center justify-between bg-[#1E293B]/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#EFA765]/10 rounded-lg">
            <History className="text-[#EFA765]" size={22} />
          </div>
          <h3 className="text-xl font-black font-[var(--font-yeseva-one)] text-white">Order History</h3>
        </div>
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full border border-white/5">
          {allOrders?.length || 0} Records
        </div>
      </div>

      {/* Table Content - Scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#EFA765]/20 hover:scrollbar-thumb-[#EFA765]/40">
        
        {/* Desktop Table View */}
        <div className="hidden md:block px-8 pb-8">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead className="sticky top-0 bg-[#0F172A] z-10">
              <tr className="text-[10px] uppercase tracking-widest text-slate-500">
                <th className="pb-4 font-bold pl-2">Ref ID</th>
                <th className="pb-4 font-bold">Items</th>
                <th className="pb-4 font-bold">Date</th>
                <th className="pb-4 font-bold">Payment</th>
                <th className="pb-4 font-bold">Amount</th>
                <th className="pb-4 font-bold text-right pr-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {allOrders?.map((order: any) => (
                <tr key={order._id} className="group hover:bg-white/[0.04] transition-all rounded-xl">
                  <td className="py-4 pl-4 text-xs font-mono text-[#EFA765] bg-white/5 rounded-l-xl">
                    #{order.orderId || order._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="py-4 text-xs text-slate-300 bg-white/5">
                    <div className="flex items-center gap-2">
                      <ShoppingBag size={14} className="opacity-50" />
                      {order.items?.length || 1} Items
                    </div>
                  </td>
                  <td className="py-4 text-xs text-slate-400 bg-white/5">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 text-[10px] font-bold text-slate-400 uppercase bg-white/5">
                    <div className="flex items-center gap-1">
                      <CreditCard size={12} className="text-[#EFA765]" />
                      {order.paymentMethod || 'Online'}
                    </div>
                  </td>
                  <td className="py-4 text-sm font-black text-white bg-white/5">
                    PKR {order.finalAmount?.toLocaleString()}
                  </td>
                  <td className="py-4 pr-4 text-right bg-white/5 rounded-r-xl">
                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md border ${
                      order.orderStatus === 'paid' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' : 'border-slate-500/20 text-slate-400 bg-white/5'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile List View */}
        <div className="md:hidden p-4 space-y-3">
          {allOrders?.map((order: any) => (
            <Link 
              href={`/order-details/${order.orderId}`}
              key={order._id} 
              className="block p-4 bg-white/5 rounded-2xl border border-white/5 active:scale-95 transition-transform"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono text-[#EFA765]">{order.orderId || order._id.slice(-8).toUpperCase()}</span>
                <span className="text-sm font-black text-white">PKR {order.finalAmount}</span>
              </div>
              <div className="flex justify-between items-end">
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tight space-y-1">
                  <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="text-slate-400">{order.items?.length || 1} Items • {order.paymentMethod || 'Online'}</p>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[9px] font-black uppercase text-slate-400 bg-white/10 px-2 py-1 rounded">
                    {order.orderStatus}
                  </span>
                  <ArrowRight size={14} className="text-[#EFA765]" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/5 bg-white/[0.02] text-center">
        <p className="text-[9px] text-slate-600 uppercase font-black tracking-[0.3em]">
          Scroll to view full history
        </p>
      </div>
    </div>
  );
};