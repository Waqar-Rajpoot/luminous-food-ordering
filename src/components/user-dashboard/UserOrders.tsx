"use client";
import { ChevronRight, Package, XCircle, Loader2, CreditCard, Clock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const UserOrders = ({ recentOrders }: any) => {
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const router = useRouter();

  const handleCancelOrder = async (id: string) => {
    if (cancellingId) return;
    
    const confirmCancel = confirm("Are you sure you want to cancel this order?");
    if (!confirmCancel) return;

    setCancellingId(id);

    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shippingProgress: 'canceled' }),
      });

      if (response.ok) {
        router.refresh(); // Refreshes Server Component data
      } else {
        alert("Failed to cancel order. Please contact support.");
      }
    } catch (error) {
      console.error("Cancellation error:", error);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#EFA765]/10 rounded-lg">
            <Package className="text-[#EFA765]" size={24} />
          </div>
          <h3 className="text-xl font-black text-white">Recent Activity</h3>
        </div>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">
          {recentOrders?.length || 0} Orders
        </span>
      </div>

      <div className="space-y-4">
        {!recentOrders || recentOrders.length === 0 ? (
          <div className="text-center py-10 bg-white/5 rounded-[1.5rem] border border-dashed border-white/10">
            <p className="text-slate-500 text-sm">No recent culinary journeys found.</p>
          </div>
        ) : (
          recentOrders.map((order: any) => {
            const isCancellable = order.shippingProgress === "processing";
            const isDelivered = order.shippingProgress === "delivered";
            const isCanceled = order.shippingProgress === "canceled";

            return (
              <div key={order._id} className="relative group bg-[#1e293b]/40 rounded-[1.5rem] p-5 border border-white/5 hover:border-[#EFA765]/30 transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  
                  {/* Left: Primary Info */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black text-[#EFA765] bg-[#EFA765]/10 px-2 py-1 rounded-md border border-[#EFA765]/20">
                        {order.orderId}
                      </span>
                      <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase border ${
                        isDelivered ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 
                        isCanceled ? 'border-red-500/30 text-red-400 bg-red-500/10' :
                        'border-amber-500/30 text-amber-400 bg-amber-500/10'
                      }`}>
                        {order.shippingProgress}
                      </span>
                    </div>
                    
                    <div>
                      <h4 className="text-xl font-black text-white">PKR {order.finalAmount.toLocaleString()}</h4>
                      <div className="flex items-center gap-4 mt-1 text-slate-400">
                        <div className="flex items-center gap-1 text-[11px] font-medium">
                          <Clock size={12} />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-medium">
                          <CreditCard size={12} />
                          {order.orderStatus}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Center: OTP Visualization (Only for non-finished orders) */}
                  {!isDelivered && !isCanceled && (
                    <div className="bg-linear-to-b from-[#EFA765]/10 to-transparent border border-[#EFA765]/20 p-3 rounded-2xl min-w-[120px] text-center">
                      <p className="text-[9px] uppercase text-[#EFA765] font-black tracking-tighter mb-1">Security Token</p>
                      <p className="text-xl font-black tracking-[0.2em] text-[#EFA765] drop-shadow-[0_0_10px_rgba(239,167,101,0.3)]">
                        {order.deliveryOTP || '----'}
                      </p>
                    </div>
                  )}

                  {/* Right: Actions */}
                  <div className="flex items-center gap-3">
                    <Link 
                      href={`/order-details/${order.orderId}`} 
                      className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white/5 rounded-xl text-white hover:bg-[#EFA765] hover:text-black transition-all font-bold text-xs"
                    >
                      DETAILS <ChevronRight size={16} />
                    </Link>
                    
                    {isCancellable && (
                      <button 
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={cancellingId === order._id}
                        className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                      >
                        {cancellingId === order._id ? (
                          <Loader2 size={20} className="animate-spin" />
                        ) : (
                          <XCircle size={20} />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};