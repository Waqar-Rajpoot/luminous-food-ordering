"use client";
import React, { useEffect, useState } from "react";
import { Users, Package, LayoutDashboard, Zap, ShoppingBag, MapPin, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"; 
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AssignOrderModal from "@/components/admin/AssignOrderModel";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  city: string;
  state: string;
  phoneNumber: string;
}

interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  finalAmount: number;
  orderStatus: string;
  shippingProgress: string;
  deliveryOTP: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
}

interface StaffMember {
  _id: string;
  name: string;
  email: string;
  activeWorkload?: number;
}

export default function StaffManagementPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [unassignedOrders, setUnassignedOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Refactored state: Track the actual order object for the single modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchData = async () => {
    try {
      const [staffRes, ordersRes] = await Promise.all([
        fetch("/api/staff"),
        fetch("/api/staff/orders?assigned=false")
      ]);
      const staffData = await staffRes.json();
      const ordersData = await ordersRes.json();
      
      if (staffData.success) setStaff(staffData.staffMembers || []);
      if (ordersData.success) setUnassignedOrders(ordersData.orders || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to sync with dispatch server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const onAssignmentSuccess = () => {
    setSelectedOrder(null); // Close the single modal
    fetchData();
  };

  const handleResetEarnings = async (staffId: string) => {
    try {
      const res = await fetch("/api/staff/reset-earnings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        fetchData(); 
      }
    } catch (err) {
      console.error(err);
      toast.error("Process failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#141F2D] p-4 sm:p-6 md:p-10 text-[#EFA765] font-sans selection:bg-[#EFA765]/20">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="bg-[#1D2B3F] p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl border border-[#EFA765]/20 mb-6 sm:mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <Zap size={16} className="text-[#EFA765] fill-[#EFA765]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Terminal Matrix</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter text-[#EFA765] flex items-center flex-wrap">
                <ShoppingBag className="mr-3 sm:mr-4 h-8 w-8 sm:h-10 sm:w-10" /> DISPATCH <span className="text-white ml-2 sm:ml-3">CENTER</span>
              </h1>
              <p className="text-gray-100 opacity-60 text-xs sm:text-sm font-medium">Monitoring active fleet performance and settlement records.</p>
            </div>
            
            <div className="bg-[#141F2D] border border-[#EFA765]/30 px-6 py-4 sm:px-8 sm:py-5 rounded-2xl sm:rounded-3xl flex items-center justify-between sm:justify-start gap-4 sm:gap-6 shadow-inner">
              <div className="text-center sm:text-left">
                <p className="text-[9px] font-black uppercase text-[#EFA765] tracking-widest mb-1">Total Personnel</p>
                <p className="text-2xl sm:text-3xl font-black text-white">{staff.length}</p>
              </div>
              <Separator orientation="vertical" className="h-10 sm:h-12 bg-[#EFA765]/20 hidden sm:block" />
              <Users className="text-[#EFA765] h-6 w-6 sm:h-8 sm:w-8" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          
          {/* ORDERS SECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-widest text-white/50 flex items-center gap-2">
                <Package size={16} className="text-[#EFA765]" /> Pending Pipeline
              </h2>
              <span className="text-[9px] sm:text-[10px] font-black text-white bg-red-500/80 px-2 sm:px-3 py-1 rounded-full animate-pulse">
                {unassignedOrders.length} UNASSIGNED
              </span>
            </div>

            {/* DESKTOP TABLE VIEW */}
            <div className="hidden md:block bg-[#1D2B3F] border border-[#EFA765]/20 rounded-[2rem] overflow-hidden shadow-2xl">
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                <Table>
                  <TableHeader className="bg-[#141F2D] sticky top-0 z-10">
                    <TableRow className="border-b border-[#EFA765]/10 hover:bg-transparent">
                      <TableHead className="text-[#EFA765] font-black uppercase text-[10px] tracking-widest py-5">Order ID</TableHead>
                      <TableHead className="text-[#EFA765] font-black uppercase text-[10px] tracking-widest">Customer</TableHead>
                      <TableHead className="text-[#EFA765] font-black uppercase text-[10px] tracking-widest">Location</TableHead>
                      <TableHead className="text-[#EFA765] font-black uppercase text-[10px] tracking-widest">Amount</TableHead>
                      <TableHead className="text-right text-[#EFA765] font-black uppercase text-[10px] tracking-widest pr-10">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unassignedOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center text-white/20 font-bold uppercase tracking-widest text-xs">
                          No orders in queue
                        </TableCell>
                      </TableRow>
                    ) : unassignedOrders.map((order) => (
                      <TableRow key={order._id} className="border-b border-[#EFA765]/5 hover:bg-[#EFA765]/5 transition-colors group">
                        <TableCell className="py-4">
                          <Badge variant="outline" className="border-[#EFA765]/30 text-[#EFA765] font-mono text-[10px]">
                            {order?.orderId.slice(-8) || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-white font-bold text-sm">{order.customerName}</span>
                            <span className="text-[10px] text-white/40 italic">{order.customerEmail}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-white/60 text-xs">
                            <MapPin size={12} className="text-[#EFA765]" />
                            {order?.shippingAddress?.city}
                          </div>
                        </TableCell>
                        <TableCell className="text-white font-black">
                          <span className="text-[10px] text-[#EFA765] mr-1">PKR</span>
                          {order.finalAmount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <Button 
                            onClick={() => setSelectedOrder(order)}
                            className="bg-[#EFA765] text-[#141F2D] hover:bg-white rounded-xl font-black uppercase text-[10px] h-9 px-6 transition-all"
                          >
                            Assign
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* MOBILE CARD VIEW */}
            <div className="md:hidden space-y-4">
              {unassignedOrders.map((order) => (
                <div key={order._id} className="bg-[#1D2B3F] border border-[#EFA765]/20 p-5 rounded-[1.5rem] shadow-lg">
                  <div className="flex justify-between items-center mb-3">
                    <Badge className="bg-[#EFA765]/10 text-[#EFA765] border-none text-[9px]">{order.orderId.slice(-8)}</Badge>
                    <p className="text-white font-black text-lg">PKR {order.finalAmount.toLocaleString()}</p>
                  </div>
                  <h3 className="text-white font-bold">{order.customerName}</h3>
                  <div className="flex items-center gap-2 text-white/50 text-[10px] mt-2">
                    <MapPin size={12} /> {order?.shippingAddress?.city}
                    <Separator orientation="vertical" className="h-3 bg-white/10" />
                    <Hash size={12} /> {order.items.length} Items
                  </div>
                  <Button 
                    onClick={() => setSelectedOrder(order)}
                    className="w-full mt-4 bg-[#EFA765] text-[#141F2D] rounded-xl font-black text-[10px] uppercase h-10"
                  >
                    Assign Now
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* STAFF SECTION */}
          <div className="space-y-6">
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-widest text-white/50 px-2 flex items-center gap-2">
              <LayoutDashboard size={16} className="text-[#EFA765]" /> Delivery Force
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {loading ? (
                 Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-44 bg-[#1D2B3F] animate-pulse rounded-[2.5rem] border border-[#EFA765]/10" />
                ))
              ) : staff.map((member) => (
                <div key={member._id} className="bg-[#1D2B3F] border border-[#EFA765]/20 rounded-[2rem] p-6 hover:shadow-2xl hover:shadow-[#EFA765]/5 transition-all relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4">
                    <div className="h-10 w-10 rounded-2xl bg-[#141F2D] border border-[#EFA765]/30 flex items-center justify-center font-black text-[#EFA765] shadow-lg">
                      {member.activeWorkload || 0}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-[#2a3b52] flex items-center justify-center text-[#EFA765]">
                      <Users size={24} />
                    </div>
                    <div className="min-w-0 pr-10">
                      <h3 className="text-base font-black text-white truncate">{member.name}</h3>
                      <p className="text-[9px] font-bold text-[#EFA765]/60 uppercase truncate">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-4 border-t border-[#EFA765]/10">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="flex-[1.5] h-9 text-[9px] bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500 hover:text-black font-black uppercase rounded-xl">Reset Today&apos;s earning</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-[#141F2D] border-[#EFA765]/30 rounded-[2.5rem] text-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-xl font-black uppercase italic">Settle Account</AlertDialogTitle>
                          <AlertDialogDescription className="text-white/40 text-xs">Finalize payments for {member.name}?</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-white/5 border-none text-white rounded-xl">Back</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleResetEarnings(member._id)} className="bg-green-500 text-black font-black rounded-xl">Confirm</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SINGLE GLOBAL ASSIGNMENT MODAL */}
        <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
          <DialogContent className="bg-[#1D2B3F] border-[#EFA765]/30 p-8 max-w-md rounded-[2.5rem] text-white">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black uppercase italic text-[#EFA765]">
                Fleet <span className="text-white">Deployment</span>
              </DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <>
                <div className="mt-4 flex flex-col gap-1">
                  <p className="text-[10px] text-[#EFA765] font-black uppercase tracking-widest">Active Target:</p>
                  <p className="text-sm font-bold text-white">Order #{selectedOrder.orderId.slice(-8)}</p>
                  <p className="text-xs text-white/50">{selectedOrder.customerName} — {selectedOrder.shippingAddress?.city}</p>
                </div>
                <Separator className="bg-[#EFA765]/20 my-6" />
                <AssignOrderModal 
                  orderId={selectedOrder._id} 
                  staffList={staff} 
                  onSuccess={onAssignmentSuccess} 
                />
              </>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}