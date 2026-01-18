// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "sonner";
// import {
//   Trash2,
//   Calendar,
//   Loader2,
//   Package,
//   CheckCircle2,
//   XCircle,
//   TrendingDown,
//   Power,
//   PowerOff,
// } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import Image from "next/image";

// interface Deal {
//   _id: string;
//   title: string;
//   description: string;
//   originalPrice: number;
//   dealPrice: number;
//   savings: number;
//   image: string;
//   category: string;
//   isAvailable: boolean;
//   items: Array<{ name: string; quantity: number; _id: any }>;
//   startDate: { $date: string } | string;
//   endDate: { $date: string } | string;
// }

// export default function AdminDealList() {
//   const [deals, setDeals] = useState<Deal[]>([]);
//   const [loading, setLoading] = useState(true);

//   const formatDate = (dateObj: any) => {
//     const dateStr = dateObj?.$date || dateObj;
//     if (!dateStr) return "N/A";
//     return new Date(dateStr).toLocaleDateString("en-PK", {
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   const fetchDeals = async () => {
//     try {
//       const { data } = await axios.get("/api/deals");
//       if (data.success) setDeals(data.data);
//     } catch (error) {
//       toast.error("Failed to load deals", error as any);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleStatus = async (id: string, currentStatus: boolean) => {
//     try {
//       const { data } = await axios.patch(`/api/deals/${id}`, {
//         isAvailable: !currentStatus,
//       });
//       if (data.success) {
//         setDeals(
//           deals.map((d) =>
//             d._id === id ? { ...d, isAvailable: !currentStatus } : d
//           )
//         );
//         toast.success(`Deal is now ${!currentStatus ? "Live" : "Hidden"}`);
//       }
//     } catch (error) {
//       toast.error("Failed to update status", error as any);
//     }
//   };

//   const deleteDeal = async (id: string) => {
//     try {
//       await axios.delete(`/api/deals/${id}`);
//       toast.success("Deal deleted successfully");
//       setDeals(deals.filter((deal) => deal._id !== id));
//     } catch (error) {
//       toast.error("Failed to delete deal", error as any);
//     }
//   };

//   useEffect(() => {
//     fetchDeals();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex h-96 items-center justify-center text-[#EFA765]">
//         <Loader2 className="animate-spin h-10 w-10" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#141F2D] p-8 text-white">
//       <div className="max-w-6xl mx-auto space-y-6">
//         <div className="flex justify-between items-end border-b border-white/10 pb-6">
//           <div>
//             <h1 className="text-4xl font-black text-[#EFA765] uppercase tracking-tighter">
//               Deal Management
//             </h1>
//             <p className="text-white/50 text-sm mt-1">
//               Review and manage your live restaurant offers
//             </p>
//           </div>
//           <Badge className="bg-[#EFA765] text-[#141F2D] hover:bg-[#EFA765] px-4 py-1 text-lg font-bold">
//             {deals.length} Total
//           </Badge>
//         </div>

//         <div className="grid grid-cols-1 gap-6">
//           {deals.map((deal) => (
//             <Card
//               key={deal._id}
//               className={`bg-[#1D2B3F] border-[#EFA765]/10 overflow-hidden hover:border-[#EFA765]/40 transition-all shadow-xl ${!deal.isAvailable && "opacity-60"}`}
//             >
//               <CardContent className="p-0 flex flex-col lg:flex-row">
//                 {/* Visual Sidebar */}
//                 <div className="relative h-64 lg:h-auto lg:w-72 flex-shrink-0">
//                   <Image
//                     src={deal.image}
//                     alt={deal.title}
//                     fill
//                     className="object-cover"
//                   />
//                   <div className="absolute top-4 left-4 flex flex-col gap-2">
//                     <Badge
//                       className={`${deal.isAvailable ? "bg-green-500" : "bg-red-500"} text-white border-none shadow-lg`}
//                     >
//                       {deal.isAvailable ? (
//                         <CheckCircle2 className="w-3 h-3 mr-1" />
//                       ) : (
//                         <XCircle className="w-3 h-3 mr-1" />
//                       )}
//                       {deal.isAvailable ? "Live" : "Inactive"}
//                     </Badge>
//                   </div>
//                 </div>

//                 {/* Main Content */}
//                 <div className="p-6 flex-grow flex flex-col justify-between">
//                   <div>
//                     <div className="flex justify-between items-start mb-2">
//                       <div>
//                         <span className="text-[#EFA765] text-xs font-bold uppercase tracking-widest">
//                           {deal.category}
//                         </span>
//                         <h3 className="text-2xl font-bold text-gray-300">{deal.title}</h3>
//                       </div>
//                       <div className="text-right">
//                         <div className="flex items-center text-green-400 font-bold text-sm justify-end">
//                           <TrendingDown className="w-4 h-4 mr-1" /> Save Rs.{" "}
//                           {deal.savings}
//                         </div>
//                         <p className="text-2xl font-black text-[#EFA765]">
//                           Rs. {deal.dealPrice}
//                         </p>
//                         <p className="text-white/30 text-sm line-through">
//                           Original: Rs. {deal.originalPrice}
//                         </p>
//                       </div>
//                     </div>

//                     <p className="text-white/80 text-sm line-clamp-2 mb-4 bg-white/5 p-3 rounded-lg border border-white/5 italic">
//                       {deal.description}
//                     </p>

//                     <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
//                       {deal.items.map((item, idx) => (
//                         <div
//                           key={idx}
//                           className="flex items-center gap-2 bg-[#141F2D] p-2 rounded-md border border-white/5"
//                         >
//                           <Package className="w-3 h-3 text-[#EFA765]" />
//                           <span className="text-xs text-white/80 font-medium">
//                             {item.quantity}x {item.name}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Footer Stats & Actions */}
//                   <div className="flex flex-wrap items-center justify-between pt-4 border-t border-white/5">
//                     <div className="flex items-center gap-2 text-[11px] uppercase font-bold tracking-wider text-white/40">
//                       <Calendar className="w-4 h-4 text-[#EFA765]" />
//                       <span>
//                         {formatDate(deal.startDate)} —{" "}
//                         {formatDate(deal.endDate)}
//                       </span>
//                     </div>

//                     <div className="flex gap-2 mt-4 md:mt-0">
//                       {/* TOGGLE STATUS */}
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => toggleStatus(deal._id, deal.isAvailable)}
//                         className={`border-white/10 ${deal.isAvailable ? "text-amber-400 hover:text-amber-500" : "text-green-400 hover:text-green-500"} bg-white/5 hover:bg-white/10`}
//                       >
//                         {deal.isAvailable ? (
//                           <>
//                             <PowerOff className="w-4 h-4 mr-2" /> Deactivate
//                           </>
//                         ) : (
//                           <>
//                             <Power className="w-4 h-4 mr-2" /> Activate
//                           </>
//                         )}
//                       </Button>

//                       {/* SHADCN ALERT DIALOG FOR DELETE */}
//                       <AlertDialog>
//                         <AlertDialogTrigger asChild>
//                           <Button
//                             variant="destructive"
//                             size="sm"
//                             className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
//                           >
//                             <Trash2 className="w-4 h-4 mr-2" /> Delete
//                           </Button>
//                         </AlertDialogTrigger>
//                         <AlertDialogContent className="bg-[#1D2B3F] border-white/10 text-white">
//                           <AlertDialogHeader>
//                             <AlertDialogTitle className="text-[#EFA765]">
//                               Are you absolutely sure?
//                             </AlertDialogTitle>
//                             <AlertDialogDescription className="text-white/60">
//                               This action cannot be undone. This will
//                               permanently delete the
//                               <strong> {deal.title}</strong> deal from the
//                               server.
//                             </AlertDialogDescription>
//                           </AlertDialogHeader>
//                           <AlertDialogFooter>
//                             <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/20">
//                               Cancel
//                             </AlertDialogCancel>
//                             <AlertDialogAction
//                               onClick={() => deleteDeal(deal._id)}
//                               className="bg-red-600 hover:bg-red-700 text-white border-none"
//                             >
//                               Confirm Delete
//                             </AlertDialogAction>
//                           </AlertDialogFooter>
//                         </AlertDialogContent>
//                       </AlertDialog>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }






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

export default function AdminDealList() {
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
    <div className="min-h-screen bg-[#141F2D] p-4 sm:p-8 text-white">
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
          <Badge className="bg-[#EFA765] text-[#141F2D] hover:bg-[#EFA765] px-3 sm:px-4 py-1 text-sm sm:text-lg font-bold">
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
                <div className="relative h-48 sm:h-64 lg:h-auto lg:w-72 flex-shrink-0">
                  <Image
                    src={deal.image}
                    alt={deal.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <Badge
                      className={`${deal.isAvailable ? "bg-green-500" : "bg-red-500"} text-white border-none shadow-lg text-[10px] sm:text-xs`}
                    >
                      {deal.isAvailable ? (
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {deal.isAvailable ? "Live" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                {/* Main Content */}
                <div className="p-4 sm:p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                      <div>
                        <span className="text-[#EFA765] text-[10px] font-bold uppercase tracking-widest">
                          {deal.category}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-300 line-clamp-1">{deal.title}</h3>
                      </div>
                      <div className="text-left sm:text-right w-full sm:w-auto">
                        <div className="flex items-center text-green-400 font-bold text-xs sm:text-sm sm:justify-end">
                          <TrendingDown className="w-4 h-4 mr-1" /> Save Rs. {deal.savings}
                        </div>
                        <p className="text-xl sm:text-2xl font-black text-[#EFA765]">
                          Rs. {deal.dealPrice}
                        </p>
                        <p className="text-white/30 text-xs sm:text-sm line-through">
                          Original: Rs. {deal.originalPrice}
                        </p>
                      </div>
                    </div>

                    <p className="text-white/80 text-xs sm:text-sm line-clamp-2 mb-4 bg-white/5 p-3 rounded-lg border border-white/5 italic">
                      {deal.description}
                    </p>

                    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                      {deal.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 bg-[#141F2D] p-2 rounded-md border border-white/5"
                        >
                          <Package className="w-3 h-3 text-[#EFA765]" />
                          <span className="text-[10px] sm:text-xs text-white/80 font-medium truncate">
                            {item.quantity}x {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Stats & Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-white/5 gap-4">
                    <div className="flex items-center gap-2 text-[10px] sm:text-[11px] uppercase font-bold tracking-wider text-white/40">
                      <Calendar className="w-4 h-4 text-[#EFA765]" />
                      <span>
                        {formatDate(deal.startDate)} — {formatDate(deal.endDate)}
                      </span>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatus(deal._id, deal.isAvailable)}
                        className={`flex-1 sm:flex-none border-white/10 text-xs ${deal.isAvailable ? "text-amber-400 hover:text-amber-500" : "text-green-400 hover:text-green-500"} bg-white/5 hover:bg-white/10`}
                      >
                        {deal.isAvailable ? (
                          <>
                            <PowerOff className="w-4 h-4 mr-2" /> Deactivate
                          </>
                        ) : (
                          <>
                            <Power className="w-4 h-4 mr-2" /> Activate
                          </>
                        )}
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex-1 sm:flex-none bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 text-xs"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-[#1D2B3F] border-white/10 text-white w-[90vw] max-w-md rounded-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-[#EFA765]">
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-white/60">
                              This action cannot be undone. This will
                              permanently delete the
                              <strong> {deal.title}</strong> deal.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/20 mt-0">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteDeal(deal._id)}
                              className="bg-red-600 hover:bg-red-700 text-white border-none"
                            >
                              Confirm Delete
                            </AlertDialogAction>
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