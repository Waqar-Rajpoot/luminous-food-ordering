"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Trash2,
  Calendar,
  Loader2,
  Package,
  CheckCircle2,
  XCircle,
  TrendingDown,
  Power,
  PowerOff,
  Pencil,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import Image from "next/image";

interface Deal {
  _id: string;
  title: string;
  description: string;
  originalPrice: number;
  dealPrice: number;
  savings: number;
  image: string;
  category: string;
  isAvailable: boolean;
  items: Array<{ name: string; quantity: number; _id: any }>;
  startDate: { $date: string } | string;
  endDate: { $date: string } | string;
}

interface AdminDealListProps {
  onEdit: (deal: Deal) => void;
}

export default function AdminDealList({ onEdit }: AdminDealListProps) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateObj: any) => {
    const dateStr = dateObj?.$date || dateObj;
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const fetchDeals = async () => {
    try {
      const { data } = await axios.get("/api/deals");
      if (data.success) setDeals(data.data);
    } catch (error) {
      toast.error("Failed to load deals");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { data } = await axios.patch(`/api/deals/${id}`, {
        isAvailable: !currentStatus,
      });
      if (data.success) {
        setDeals(
          deals.map((d) =>
            d._id === id ? { ...d, isAvailable: !currentStatus } : d
          )
        );
        toast.success(`Deal is now ${!currentStatus ? "Live" : "Hidden"}`);
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const deleteDeal = async (id: string) => {
    try {
      await axios.delete(`/api/deals/${id}`);
      toast.success("Deal deleted successfully");
      setDeals(deals.filter((deal) => deal._id !== id));
    } catch (error) {
      toast.error("Failed to delete deal");
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-[#EFA765]">
        <Loader2 className="animate-spin h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141F2D] p-3 sm:p-8 text-white">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-white/10 pb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#EFA765] uppercase tracking-tighter">
              Deal Management
            </h1>
            <p className="text-white/50 text-xs sm:text-sm mt-1">
              Review and manage your live restaurant offers
            </p>
          </div>
          <Badge className="bg-[#EFA765] text-[#141F2D] hover:bg-[#EFA765] px-3 py-1 text-sm font-bold">
            {deals.length} Total
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {deals.map((deal) => (
            <Card
              key={deal._id}
              className={`bg-[#1D2B3F] border-[#EFA765]/10 overflow-hidden hover:border-[#EFA765]/40 transition-all shadow-xl ${!deal.isAvailable && "opacity-70"}`}
            >
              <CardContent className="p-0 flex flex-col lg:flex-row">
                {/* Visual Sidebar */}
                <div className="relative h-52 sm:h-64 lg:h-auto lg:w-72 shrink-0">
                  <Image
                    src={deal.image}
                    alt={deal.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <Badge
                      className={`${deal.isAvailable ? "bg-green-500" : "bg-red-500"} text-white border-none shadow-lg text-[10px]`}
                    >
                      {deal.isAvailable ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                      {deal.isAvailable ? "Live" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                {/* Main Content */}
                <div className="p-4 sm:p-6 grow flex flex-col justify-between min-w-0">
                  <div className="min-w-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                      <div className="min-w-0 flex-1">
                        <span className="text-[#EFA765] text-[10px] font-bold uppercase tracking-widest">
                          {deal.category}
                        </span>
                        <h3 className="text-lg sm:text-2xl font-bold text-gray-300 truncate">{deal.title}</h3>
                      </div>
                      <div className="text-left sm:text-right w-full sm:w-auto shrink-0">
                        <div className="flex items-center text-green-400 font-bold text-xs sm:justify-end">
                          <TrendingDown className="w-4 h-4 mr-1" /> Save Rs. {deal.savings}
                        </div>
                        <p className="text-xl font-black text-[#EFA765]">
                          Rs. {deal.dealPrice}
                        </p>
                      </div>
                    </div>

                    <p className="text-white/80 text-xs line-clamp-2 mb-4 bg-white/5 p-3 rounded-lg border border-white/5 italic">
                      {deal.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                      {deal.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 bg-[#141F2D] p-2 rounded-md border border-white/5"
                        >
                          <Package className="w-3 h-3 text-[#EFA765] shrink-0" />
                          <span className="text-[10px] text-white/80 font-medium truncate">
                            {item.quantity}x {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Stats & Actions */}
                  <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider text-white/40">
                      <Calendar className="w-4 h-4 text-[#EFA765]" />
                      <span>
                        {formatDate(deal.startDate)} — {formatDate(deal.endDate)}
                      </span>
                    </div>

                    {/* Action Buttons - Fixed for Mobile */}
                    <div className="flex flex-wrap gap-2 w-full">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          onEdit(deal);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex-1 min-w-[80px] text-[#EFA765] hover:text-[#EFA765]/80 text-xs bg-white/5 border-white/10"
                      >
                        <Pencil className="w-3 h-3 mr-1" /> Edit
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatus(deal._id, deal.isAvailable)}
                        className={`flex-1 min-w-[100px] border-white/10 text-xs ${deal.isAvailable ? "text-amber-400" : "text-green-400"} bg-white/5`}
                      >
                        {deal.isAvailable ? (
                          <><PowerOff className="w-3 h-3 mr-1" /> Off</>
                        ) : (
                          <><Power className="w-3 h-3 mr-1" /> Live</>
                        )}
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex-1 min-w-[80px] bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 text-xs"
                          >
                            <Trash2 className="w-3 h-3 mr-1" /> Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-[#1D2B3F] border-white/10 text-white w-[95vw] max-w-md rounded-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-[#EFA765]">Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription className="text-white/60">
                              Permanently delete <strong>{deal.title}</strong>?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="gap-2">
                            <AlertDialogCancel className="bg-white/5 border-white/10 text-white mt-0">Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteDeal(deal._id)} className="bg-red-600">Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}