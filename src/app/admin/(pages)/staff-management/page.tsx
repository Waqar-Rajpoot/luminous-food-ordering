"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Package, LayoutDashboard, Zap, ShoppingBag, MapPin, Hash, CreditCard, Coins, Phone, ExternalLink, Wallet, Loader2 } from "lucide-react";
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

interface OrderItem { id: string; name: string; price: number; quantity: number; image: string; }
interface ShippingAddress { fullName: string; addressLine1: string; city: string; state: string; phoneNumber: string; }
interface Order { _id: string; orderId: string; customerName: string; customerEmail: string; paymentMethod: 'stripe' | 'cod'; finalAmount: number; orderStatus: string; shippingProgress: string; deliveryOTP: string; items: OrderItem[]; shippingAddress: ShippingAddress; }

// Updated Interface: Added totalEarnings for clarity
interface StaffMember { 
  _id: string; 
  name: string; 
  email: string; 
  activeWorkload?: number; 
  totalEarnings?: number; // Added to display current balance
}

export default function StaffManagementPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [unassignedOrders, setUnassignedOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
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
    setSelectedOrder(null);
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

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[80vh]">
        <Loader2 className="h-10 w-10 animate-spin text-[#efa765]" />
        <p className="mt-4 text-slate-400 font-medium tracking-widest uppercase text-[10px]">Syncing staff & orders data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141F2D] p-4 sm:p-6 md:p-8 text-[#EFA765] font-sans selection:bg-[#EFA765]/20">
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

            <div className="hidden md:block bg-[#1D2B3F] border border-[#EFA765]/20 rounded-[2rem] overflow-hidden shadow-2xl">
              <div className="max-h-125 overflow-y-auto custom-scrollbar">
                <Table>
                  <TableHeader className="bg-[#141F2D] sticky top-0 z-10">
                    <TableRow className="border-b border-[#EFA765]/10 hover:bg-transparent">
                      <TableHead className="text-[#EFA765] font-black uppercase text-[10px] tracking-widest py-5">Order Detail</TableHead>
                      <TableHead className="text-[#EFA765] font-black uppercase text-[10px] tracking-widest">Customer & Phone</TableHead>
                      <TableHead className="text-[#EFA765] font-black uppercase text-[10px] tracking-widest">Full Address</TableHead>
                      <TableHead className="text-[#EFA765] font-black uppercase text-[10px] tracking-widest">Payment</TableHead>
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
                          <div className="flex flex-col gap-1">
                            <Link href={`/order-details/${order.orderId}`}>
                              <Badge variant="outline" className="w-fit border-[#EFA765]/30 text-[#EFA765] font-mono text-[10px] hover:bg-[#EFA765] hover:text-black cursor-pointer transition-all flex items-center gap-1">
                                #{order?.orderId.slice(-8) || "N/A"} <ExternalLink size={8} />
                              </Badge>
                            </Link>
                            <span className="text-[10px] text-white/40 flex items-center gap-1">
                              <Hash size={10} /> {order.items.length} Items
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-white font-bold text-sm">{order.customerName}</span>
                            <span className="text-[10px] text-[#EFA765]/80 flex items-center gap-1 font-mono">
                              <Phone size={10} /> {order.shippingAddress?.phoneNumber}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-62.5">
                          <div className="flex items-start gap-2 text-white/60 text-xs">
                            <MapPin size={12} className="text-[#EFA765] mt-0.5 shrink-0" />
                            <span className="leading-tight">
                              {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="text-white font-black text-sm">
                              <span className="text-[10px] text-[#EFA765] mr-0.5 font-normal">PKR</span>
                              {order.finalAmount.toLocaleString()}
                            </span>
                            {order.paymentMethod === 'cod' ? (
                              <span className="text-[9px] font-bold text-amber-500 flex items-center gap-1 uppercase">
                                <Coins size={10} /> COD
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold text-blue-400 flex items-center gap-1 uppercase">
                                <CreditCard size={10} /> Paid
                              </span>
                            )}
                          </div>
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

            {/* Mobile Cards (Omitted for brevity, logic remains identical to desktop) */}
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
                  <div className="absolute top-0 right-0 p-4 flex flex-col items-end gap-2">
                    {/* Active Workload Badge */}
                    <div className="h-10 w-10 rounded-2xl bg-[#141F2D] border border-[#EFA765]/30 flex items-center justify-center font-black text-[#EFA765] shadow-lg" title="Active Orders">
                      {member.activeWorkload || 0}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-[#2a3b52] flex items-center justify-center text-[#EFA765]">
                      <Users size={24} />
                    </div>
                    <div className="min-w-0 pr-10">
                      <h3 className="text-base font-black text-white truncate">{member.name}</h3>
                      <p className="text-[9px] font-bold text-[#EFA765]/60 uppercase truncate">{member.email}</p>
                    </div>
                  </div>

                  {/* Display Automated Earnings Balance */}
                  <div className="bg-[#141F2D]/50 rounded-2xl p-4 mb-4 border border-[#EFA765]/5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1">
                        <Wallet size={12} className="text-[#EFA765]" /> Balance
                      </span>
                      <span className="text-lg font-black text-white">
                        <span className="text-[10px] text-[#EFA765] mr-1">PKR</span>
                        {(member.totalEarnings || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          disabled={!member.totalEarnings}
                          className="w-full h-10 text-[10px] bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500 hover:text-black font-black uppercase rounded-xl transition-all"
                        >
                          Clear Settlement
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-[#141F2D] border-[#EFA765]/30 rounded-[2.5rem] text-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-xl font-black uppercase italic">Finalize Payment</AlertDialogTitle>
                          <AlertDialogDescription className="text-white/40 text-xs">
                            This will reset <strong>{member.name}&lsquo;s</strong> earnings balance to zero. Ensure you have paid them <strong>PKR {member.totalEarnings?.toLocaleString()}</strong> via your manual method.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-white/5 border-none text-white rounded-xl">Back</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleResetEarnings(member._id)} className="bg-green-500 text-black font-black rounded-xl">Confirm Payment</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Deployment Modal */}
        <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
          <DialogContent className="bg-[#1D2B3F] border-[#EFA765]/30 p-8 max-w-md rounded-[2.5rem] text-white">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black uppercase italic text-[#EFA765]">
                Fleet <span className="text-white">Deployment</span>
              </DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <>
                <div className="mt-4 flex flex-col gap-2">
                  <p className="text-[10px] text-[#EFA765] font-black uppercase tracking-widest">Active Target:</p>
                  <div className="bg-[#141F2D] p-4 rounded-2xl border border-[#EFA765]/10">
                    <p className="text-sm font-bold text-white mb-1">Order #{selectedOrder.orderId.slice(-8)}</p>
                    <p className="text-xs text-white/70">{selectedOrder.customerName}</p>
                    <p className="text-[10px] text-white/40 italic mt-1">{selectedOrder.shippingAddress?.addressLine1}, {selectedOrder.shippingAddress?.city}</p>
                  </div>
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