"use client";
import { useState } from "react";
import { Phone, MapPin } from "lucide-react";
// 1. Fixed: Import the Button component
import { Button } from "@/components/ui/button"; 
import { toast } from "sonner";

export default function DeliveryActionCard({ order }: { order: any }) {
  const [status, setStatus] = useState(order.deliveryStatus);
  // 2. Fixed: Added missing state for the OTP Modal
  const [isUpdating, setIsUpdating] = useState(false);

  const updateStatus = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/staff/orders/${order._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setStatus(newStatus);
        toast.success(`Order marked as ${newStatus}`);
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
        console.error("Error updating status:", error);
      toast.error("An error occurred while updating status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-[#1E293B]/40 border border-white/5 rounded-[2rem] p-6 space-y-4">
      <div className="flex justify-between items-start">
        <span className="bg-[#EFA765]/10 text-[#EFA765] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
          {status.replace("-", " ")}
        </span>
        <p className="text-xs text-slate-500 font-mono">{order.orderId}</p>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white">{order.shippingAddress.fullName}</h3>
        <p className="text-slate-400 text-sm flex items-center gap-2 mt-1">
          <MapPin size={14} className="text-[#EFA765]" /> 
          {order.shippingAddress.city}, {order.shippingAddress.addressLine1}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <a href={`tel:${order.shippingAddress.phoneNumber}`} className="flex-1">
          <Button 
            variant="outline" 
            className="w-full border-white/10 rounded-2xl gap-2 hover:bg-white/5 text-slate-300"
          >
            <Phone size={16} /> Call Customer
          </Button>
        </a>
        
        {status === "assigned" && (
          <Button 
            disabled={isUpdating}
            onClick={() => updateStatus("out-for-delivery")} 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold"
          >
            {isUpdating ? "Updating..." : "Start Delivery"}
          </Button>
        )}
        
        {status === "out-for-delivery" && (
          <Button 
            className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold"
            onClick={() => {
              // This will trigger the OTP modal you'll build next
              toast.info("Opening OTP Verification...");
            }}
          >
            Verify OTP & Complete
          </Button>
        )}
      </div>
    </div>
  );
}