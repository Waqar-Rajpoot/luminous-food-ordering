"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, Loader2, Send } from "lucide-react";
import toast from "react-hot-toast";

interface Staff {
  _id: string;
  name: string;
}

export default function AssignOrderModal({ 
  orderId, 
  staffList, 
  onSuccess 
}: { 
  orderId: string; 
  staffList: Staff[]; 
  onSuccess: () => void; 
}) {
  const [selectedStaff, setSelectedStaff] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAssign = async () => {
    if (!selectedStaff) return toast.error("Please select a staff member");

    setLoading(true);
    try {
      const response = await fetch("/api/orders/assign", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        // Removed earningAmount: functionality is now automated on the server
        body: JSON.stringify({
          orderId,
          staffId: selectedStaff,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Order assigned successfully!");
        onSuccess(); // Close modal or refresh list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error assigning order:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-[#0F172A] border border-white/10 rounded-[2rem] space-y-6 text-white">
      <div className="space-y-2">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Send size={20} className="text-[#EFA765]" /> Assign Delivery
        </h2>
        <p className="text-sm text-slate-400">
          Select a staff member. Earnings will be calculated automatically based on system settings.
        </p>
      </div>

      <div className="space-y-4">
        {/* Staff Selection */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-widest text-slate-500 font-bold">
            Select Delivery Staff
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-slate-500" size={18} />
            <select 
              className="w-full bg-[#1E293B] border border-white/5 rounded-xl h-12 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#EFA765] outline-none appearance-none cursor-pointer"
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
            >
              <option value="">Choose Staff...</option>
              {staffList.map((staff) => (
                <option key={staff._id} value={staff._id}>
                  {staff.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <Button 
        onClick={handleAssign}
        disabled={loading}
        className="w-full bg-[#EFA765] hover:bg-[#d99658] text-[#0F172A] font-black uppercase tracking-widest h-12 rounded-xl transition-all shadow-lg shadow-[#EFA765]/10"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="animate-spin" size={18} />
            <span>Processing...</span>
          </div>
        ) : (
          "Confirm Assignment"
        )}
      </Button>
    </div>
  );
}