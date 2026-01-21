"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Banknote, Loader2 } from "lucide-react";
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
  const [amount, setAmount] = useState<number>(150); // Default common rate
  const [loading, setLoading] = useState(false);

  const handleAssign = async () => {
    if (!selectedStaff) return toast.error("Please select a staff member");
    if (amount < 0) return toast.error("Earning cannot be negative");

    setLoading(true);
    try {
      const response = await fetch("/api/orders/assign", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          staffId: selectedStaff,
          earningAmount: Number(amount),
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
        <h2 className="text-xl font-bold">Assign Delivery</h2>
        <p className="text-sm text-slate-400">Set the staff member and their commission for this order.</p>
      </div>

      <div className="space-y-4">
        {/* Staff Selection */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-widest text-slate-500 font-bold">Select Delivery Staff</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-slate-500" size={18} />
            <select 
              className="w-full bg-[#1E293B] border border-white/5 rounded-xl h-12 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#EFA765] outline-none appearance-none"
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
            >
              <option value="">Choose Staff...</option>
              {staffList.map((staff) => (
                <option key={staff._id} value={staff._id}>{staff.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-widest text-slate-500 font-bold">Delivery Earning (PKR)</Label>
          <div className="relative">
            <Banknote className="absolute left-3 top-3 text-[#EFA765]" size={18} />
            <Input 
              type="number" 
              placeholder="e.g. 150"
              className="bg-[#1E293B] border border-white/5 rounded-xl h-12 pl-10 focus:ring-2 focus:ring-[#EFA765]"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      <Button 
        onClick={handleAssign}
        disabled={loading}
        className="w-full bg-[#EFA765] hover:bg-[#d99658] text-[#0F172A] font-black uppercase tracking-widest h-12 rounded-xl transition-all"
      >
        {loading ? <Loader2 className="animate-spin" /> : "Confirm Assignment"}
      </Button>
    </div>
  );
}