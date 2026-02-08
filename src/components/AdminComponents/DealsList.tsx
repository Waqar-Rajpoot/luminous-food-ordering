"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Trash2,
  Calendar,
  Loader2,
  Package,
  Power,
  PowerOff,
  Pencil,
  Search,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  const [searchTerm, setSearchTerm] = useState("");

  const formatDate = (dateObj: any) => {
    const dateStr = dateObj?.$date || dateObj;
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
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
            d._id === id ? { ...d, isAvailable: !currentStatus } : d,
          ),
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

  const filteredDeals = deals.filter((deal) =>
    deal.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex h-[600px] items-center justify-center text-[#EFA765]">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[90vh] lg:max-h-[1100px]">
      {/* Internal Header */}
      <div className="p-6 border-b border-[#EFA765]/10 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-black text-white tracking-tighter uppercase italic">
            Live <span className="text-[#EFA765]">Inventory</span>
          </h2>
          <Badge className="bg-[#EFA765] text-[#141F2D] font-black rounded-md">
            {deals.length}
          </Badge>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <Input
            placeholder="Search deals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#141F2D] border-white/5 pl-10 h-10 text-xs focus:border-[#EFA765]/50 transition-all rounded-lg"
          />
        </div>
      </div>

      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {filteredDeals.length === 0 ? (
          <div className="text-center py-20 opacity-20">
            <Package className="mx-auto h-12 w-12 mb-2" />
            <p className="text-xs uppercase font-bold tracking-widest">
              No Deals Found
            </p>
          </div>
        ) : (
          filteredDeals.map((deal) => (
            <Card
              key={deal._id}
              className={`bg-[#141F2D]/50 border-white/5 overflow-hidden transition-all duration-300 group hover:border-[#EFA765]/30 ${!deal.isAvailable && "opacity-60 grayscale-[0.5]"}`}
            >
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  {/* Compact Image */}
                  <div className="relative h-32 sm:h-auto sm:w-28 shrink-0 overflow-hidden">
                    <Image
                      src={deal.image}
                      alt={deal.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-2 left-2">
                      <div
                        className={`h-2 w-2 rounded-full ${deal.isAvailable ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500"}`}
                      />
                    </div>
                  </div>

                  <div className="p-4 grow flex flex-col justify-between min-w-0">
                    <div className="mb-3">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h3 className="text-sm font-bold text-white truncate uppercase tracking-tight leading-none">
                          {deal.title}
                        </h3>
                        <span className="text-[#EFA765] font-black text-sm shrink-0">
                          Rs.{deal.dealPrice}
                        </span>
                      </div>
                      <p className="text-[10px] text-white/40 line-clamp-1 italic mb-2">
                        {deal.description}
                      </p>

                      {/* Compact items list */}
                      <div className="flex flex-wrap gap-1">
                        {deal.items.slice(0, 3).map((item, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] bg-white/5 px-2 py-0.5 rounded border border-white/5 text-white/60"
                          >
                            {item.quantity}x {item.name}
                          </span>
                        ))}
                        {deal.items.length > 3 && (
                          <span className="text-[9px] text-white/30">
                            +{deal.items.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <div className="flex items-center gap-1.5 text-[9px] font-bold text-white/30 uppercase">
                        <Calendar className="h-3 w-3 text-[#EFA765]" />
                        {formatDate(deal.startDate)} -{" "}
                        {formatDate(deal.endDate)}
                      </div>

                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(deal)}
                          className="h-7 w-7 rounded-md hover:bg-[#EFA765] hover:text-[#141F2D] transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            toggleStatus(deal._id, deal.isAvailable)
                          }
                          className={`h-7 w-7 rounded-md hover:bg-white/10 transition-colors ${deal.isAvailable ? "text-amber-500" : "text-green-500"}`}
                        >
                          {deal.isAvailable ? (
                            <PowerOff className="h-3.5 w-3.5" />
                          ) : (
                            <Power className="h-3.5 w-3.5" />
                          )}
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-md text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-[#1D2B3F] border-[#EFA765]/20 text-white rounded-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Deal?</AlertDialogTitle>
                              <AlertDialogDescription className="text-white/50 text-xs">
                                This action cannot be undone. This will
                                permanently delete the deal from the system.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-white/5 border-white/10 h-9 text-xs">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteDeal(deal._id)}
                                className="bg-red-600 h-9 text-xs"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
