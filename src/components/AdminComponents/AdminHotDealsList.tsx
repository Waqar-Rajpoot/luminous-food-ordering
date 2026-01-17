// "use client";

// import React, { useState, useEffect } from 'react';
// import { toast } from 'sonner';
// import { Loader2, Calendar, Tags, Tag, TrendingDown } from 'lucide-react';

// // Assuming you have an interface for the HotDeal data structure
// import { IHotDeal } from '@/models/HotDeal.model'; // Use the interface we defined
// import { Product } from '@/models/Product.model'; // Assuming you can access product names from the list

// // UI Components (Update paths as needed)
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import Image from 'next/image';

// interface AdminHotDealsListProps {
//   // Pass the full product list to resolve product names in the client
//   allProducts: Product[];
//   onDealUpdated: () => void; // Function to refresh data, potentially after a delete action
// }

// export default function AdminHotDealsList({ allProducts, onDealUpdated }: AdminHotDealsListProps) {
//   const [deals, setDeals] = useState<IHotDeal[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchDeals = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch('/api/deals');

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to fetch hot deals.');
//       }

//       const data = await response.json();
//       setDeals(data.data || []);

//     } catch (err: any) {
//       console.error("Fetch Deals Error:", err);
//       setError(err.message || 'An unexpected error occurred while fetching deals.');
//       toast.error(err.message || "Could not load hot deals.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDeals();
//   }, [onDealUpdated]); // Refetch when parent signals an update

//   // Helper function to get product name from ID
//   const getProductName = (id: string) => {
//     const product = allProducts.find(p => p._id === id);
//     return product ? product.name : 'Unknown Product';
//   };

//   // Format Date for display
//   const formatDate = (dateString: Date | string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//     });
//   };

//   if (loading) {
//     return (
//       <Card className="w-full">
//         <CardContent className="flex items-center justify-center p-6 text-gray-500">
//           <Loader2 className="animate-spin h-6 w-6 mr-2" /> Loading Hot Deals...
//         </CardContent>
//       </Card>
//     );
//   }

//   if (error) {
//     return (
//       <Card className="w-full">
//         <CardContent className="p-6 text-red-600">
//           <p className="font-semibold">Error Loading Deals:</p>
//           <p>{error}</p>
//           <Button variant="outline" className="mt-4" onClick={fetchDeals}>Retry</Button>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       <h2 className="text-2xl font-bold flex items-center">
//         <TrendingDown className="h-6 w-6 mr-2 text-red-600" /> Active & Scheduled Hot Deals ({deals.length})
//       </h2>

//       {deals.length === 0 ? (
//         <Card className="w-full">
//           <CardContent className="p-6 text-gray-500">
//             No hot deals are currently scheduled.
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {deals.map((deal) => (
//             <Card key={deal._id.toString()} className={deal.isExpired ? "opacity-60 border-gray-300" : "border-red-500 shadow-lg"}>
//               <CardHeader>
//                 <CardTitle className="text-xl text-red-700">
//                     Deal Price: **PKR {deal.dealPrice.toFixed(2)}**
//                 </CardTitle>
//                 <div className="flex justify-between items-center text-sm text-gray-500">
//                     <p className="flex items-center">
//                         <Calendar className="h-4 w-4 mr-1"/> {formatDate(deal.startDate)} - {formatDate(deal.endDate)}
//                     </p>
//                     <Badge variant={deal.isExpired ? "secondary" : "default"}
//                            className={deal.isExpired ? "bg-gray-400 text-white" : "bg-red-600 hover:bg-red-700"}>
//                         {deal.isExpired ? "EXPIRED" : "ACTIVE"}
//                     </Badge>
//                 </div>
//               </CardHeader>
//               <CardContent className="pt-2">
//                 <p className="font-semibold mb-2 flex items-center">
//                     <Tags className="h-4 w-4 mr-1 text-red-500"/> Target Products ({deal.productIds.length}):
//                 </p>
//                 <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto pr-1">
//                   {deal.productIds.map((id) => (
//                     <Badge key={id.toString()} variant="outline" className="border-red-300 text-gray-700">
//                         <Tag className="h-3 w-3 mr-1"/> {getProductName(id.toString())}
//                     </Badge>
//                   ))}
//                 </div>

//                 <img
//                     src={deal.imageSrc}
//                     alt="Deal Promotion"
//                     className="w-full h-32 object-cover mt-4 rounded-md border"
//                 />
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// src/components/AdminComponents/AdminHotDealsList.tsx (Update this file)

// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import { toast } from "sonner";
// import {
//   Loader2,
//   Calendar,
//   Tags,
//   Tag,
//   TrendingDown,
//   Edit,
//   Trash2,
//   MoreHorizontal,
//   X,
// } from "lucide-react";

// // Assuming you have these models/interfaces
// import { IHotDeal } from "@/models/HotDeal.model";
// import { Product } from "@/models/Product.model";

// // UI Components
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";

// // Import the Deal Form component (we'll update its props later)
// import CreateHotDealForm from "@/components/AdminComponents/CreateHoteDealsPage"; // Assuming this is the path

// interface AdminHotDealsListProps {
//   allProducts: Product[];
//   onDealUpdated: () => void;
//   onDealDeleted: () => void;
//   dealRefreshKey: number;
// }

// export default function AdminHotDealsList({
//   allProducts,
//   onDealUpdated,
//   dealRefreshKey,
// }: AdminHotDealsListProps) {
//   const [deals, setDeals] = useState<IHotDeal[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // States for Edit/Delete actions
//   const [isEditFormOpen, setIsEditFormOpen] = useState(false);
//   const [editingDeal, setEditingDeal] = useState<IHotDeal | null>(null);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [dealToDelete, setDealToDelete] = useState<IHotDeal | null>(null);

//   const fetchDeals = async () => {
//     // ... (fetchDeals function remains the same) ...
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch("/api/deals");

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to fetch hot deals.");
//       }

//       const data = await response.json();
//       setDeals(data.data || []);
//     } catch (err: any) {
//       console.error("Fetch Deals Error:", err);
//       setError(
//         err.message || "An unexpected error occurred while fetching deals."
//       );
//       toast.error(err.message || "Could not load hot deals.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDeals();
//   }, [onDealUpdated]);

//   const getProductName = (id: string) => {
//     const product = allProducts.find((p) => p._id === id);
//     return product ? product.name : "Unknown Product";
//   };

//   const formatDate = (dateString: Date | string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   // --- HANDLERS FOR EDIT/DELETE ---

//   const handleEditClick = (deal: IHotDeal) => {
//     setEditingDeal(deal);
//     setIsEditFormOpen(true);
//   };

//   const confirmDelete = (deal: IHotDeal) => {
//     setDealToDelete(deal);
//     setShowDeleteConfirm(true);
//   };

//   const executeDeleteDeal = async () => {
//     if (!dealToDelete) return;

//     try {
//       const response = await fetch(`/api/deals/${dealToDelete._id}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to delete deal.");
//       }

//       toast.success(
//         `Deal for PKR ${dealToDelete.dealPrice.toFixed(2)} deleted successfully!`
//       );
//       // Signal parent/self to refresh the list
//       onDealUpdated();
//       fetchDeals();
//     } catch (error: any) {
//       toast.error(error.message || "Failed to delete deal.");
//       console.error("Error deleting deal:", error);
//     } finally {
//       setDealToDelete(null);
//       setShowDeleteConfirm(false);
//     }
//   };

//   // --- RENDER LOGIC ---

//   if (loading) {
//     // ... loading state remains the same ...
//     return (
//       <Card className="w-full">
//         <CardContent className="flex items-center justify-center p-6 text-gray-500">
//           <Loader2 className="animate-spin h-6 w-6 mr-2" /> Loading Hot Deals...
//         </CardContent>
//       </Card>
//     );
//   }

//   if (error) {
//     // ... error state remains the same ...
//     return (
//       <Card className="w-full">
//         <CardContent className="p-6 text-red-600">
//           <p className="font-semibold">Error Loading Deals:</p>
//           <p>{error}</p>
//           <Button variant="outline" className="mt-4" onClick={fetchDeals}>
//             Retry
//           </Button>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <>
//       {/* Main List Display */}
//       <div className="space-y-4">
//         <h2 className="text-2xl font-bold flex items-center">
//           <TrendingDown className="h-6 w-6 mr-2 text-[#EFA765]" /> <span className="text-[#EFA765]"> Active &
//           Scheduled Hot Deals ({deals.length})</span>
//         </h2>

//         {deals.length === 0 ? (
//           // ... (No deals state remains the same) ...
//           <Card className="w-full bg-[#141f2d] border border-[#efa765]">
//             <CardContent className="p-6 text-gray-500">
//               No hot deals are currently scheduled.
//             </CardContent>
//           </Card>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {deals.map((deal) => (
//               <Card
//                 key={deal._id.toString()}
//                 className={
//                   deal.isExpired
//                     ? "opacity-60 border-gray-300 bg-[#141f2d]"
//                     : "border-gray-600 shadow-lg bg-[#243142]"
//                 }
//               >
//                 <CardHeader>
//                   <div className="flex justify-between items-start">
//                     <CardTitle className="text-xl font-bold text-gray-100">
//                       Deal Price: PKR {deal.dealPrice.toFixed(2)}
//                     </CardTitle>

//                     {/* --- Dropdown Menu for Actions --- */}
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button
//                           variant="ghost"
//                           className="h-8 w-8 p-0 text-white hover:bg-gray-500"
//                         >
//                           <MoreHorizontal className="h-4 w-4" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent
//                         align="end"
//                         className="bg-gray-800 border-gray-700 text-white"
//                       >
//                         <DropdownMenuItem
//                           onClick={() => handleEditClick(deal)}
//                           className="text-blue-400 hover:bg-gray-700 cursor-pointer"
//                         >
//                           <Edit className="mr-2 h-4 w-4" /> Edit Deal
//                         </DropdownMenuItem>
//                         <DropdownMenuSeparator className="bg-gray-700" />
//                         <DropdownMenuItem
//                           onClick={() => confirmDelete(deal)}
//                           className="text-red-500 hover:bg-red-900 hover:text-red-100 cursor-pointer"
//                         >
//                           <Trash2 className="mr-2 h-4 w-4" /> Delete Deal
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </div>

//                   <div className="flex justify-between items-center text-sm text-gray-500">
//                     <p className="flex items-center">
//                       <Calendar className="h-4 w-4 mr-1 text-gray-300" />
//                       <span className="text-gray-300">{formatDate(deal.startDate)} - {formatDate(deal.endDate)}</span>
//                     </p>
//                     <Badge
//                       variant={deal.isExpired ? "secondary" : "default"}
//                       className={
//                         deal.isExpired
//                           ? "bg-gray-400 text-white"
//                           : "bg-red-600 hover:bg-red-700"
//                       }
//                     >
//                       {deal.isExpired ? "EXPIRED" : "ACTIVE"}
//                     </Badge>
//                   </div>
//                 </CardHeader>
//                 <CardContent className="pt-2">
//                   <p className="font-semibold mb-2 flex items-center">
//                     <Tags className="h-4 w-4 mr-1 text-gray-300" /> <span className="text-gray-300"> Target
//                     Products ({deal.productIds.length}):</span>
//                   </p>
//                   <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto pr-1">
//                     {deal.productIds.map((id) => (
//                       <Badge
//                         key={id.toString()}
//                         variant="outline"
//                         className="border-gray-100 text-gray-700"
//                       >
//                         <Tag className="h-3 w-3 mr-1 text-gray-300" />
//                         <span className="text-gray-300">{getProductName(id.toString())}</span>
//                       </Badge>
//                     ))}
//                   </div>

//                   <img
//                     src={deal.imageSrc}
//                     alt="Deal Promotion"
//                     className="w-full h-32 object-cover mt-4 rounded-md border"
//                   />
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* --- Edit Dialog (Reuses CreateHotDealForm) --- */}
//       <CreateHotDealForm
//         products={allProducts}
//         isOpen={isEditFormOpen}
//         onOpenChange={setIsEditFormOpen}
//         onDealCreated={onDealUpdated} // This will refresh the list upon update
//         editingDeal={editingDeal} // Pass the deal data for editing
//       />

//       {/* --- Delete Confirmation Dialog --- */}
//       <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
//         <AlertDialogContent className="bg-gray-800 border-red-500 text-white">
//           <AlertDialogHeader>
//             <AlertDialogTitle className="text-red-500 flex items-center">
//               <X className="h-6 w-6 mr-2" /> Confirm Deletion
//             </AlertDialogTitle>
//             <AlertDialogDescription className="text-gray-300">
//               Are you sure you want to delete the deal for **PKR{" "}
//               {dealToDelete?.dealPrice.toFixed(2)}**? This action cannot be
//               undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-white border-none">
//               Cancel
//             </AlertDialogCancel>
//             <AlertDialogAction
//               onClick={executeDeleteDeal}
//               className="bg-red-600 hover:bg-red-700 text-white"
//             >
//               Yes, Delete Deal
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </>
//   );
// }








// "use client";

// import React, { useState, useEffect, useCallback } from "react";
// import { toast } from "sonner";
// import {
//   Loader2,
//   Calendar,
//   Tags,
//   Tag,
//   TrendingDown,
//   Edit,
//   Trash2,
//   MoreHorizontal,
//   X,
// } from "lucide-react";

// // Assuming you have these models/interfaces
// // import { IHotDeal } from "@/models/HotDeal.model";
// import { Product } from "@/models/Product.model";

// // UI Components
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";

// // Import the Deal Form component
// // import CreateHotDealForm from "@/components/AdminComponents/CreateHoteDealsPage";

// interface AdminHotDealsListProps {
//   allProducts: Product[];
//   onDealUpdated: () => void;
//   onDealDeleted: () => void; // Defined but primarily handled by onDealUpdated logic
//   dealRefreshKey: number; // 🔑 The key used to force data refresh
// }

// export default function AdminHotDealsList({
//   allProducts,
//   onDealUpdated,
//   dealRefreshKey, // 🔑 Destructure the key
// }: AdminHotDealsListProps) {
//   const [deals, setDeals] = useState<any>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // States for Edit/Delete actions
//   const [isEditFormOpen, setIsEditFormOpen] = useState(false);
//   const [editingDeal, setEditingDeal] = useState<any>(null);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [dealToDelete, setDealToDelete] = useState<any>(null);

//   // 💡 UPDATE #1: Wrap fetchDeals in useCallback for stable function reference
//   const fetchDeals = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch("/api/deals");

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to fetch hot deals.");
//       }

//       const data = await response.json();
//       setDeals(data.data || []);
//     } catch (err: any) {
//       console.error("Fetch Deals Error:", err);
//       setError(
//         err.message || "An unexpected error occurred while fetching deals."
//       );
//       toast.error(err.message || "Could not load hot deals.");
//     } finally {
//       setLoading(false);
//     }
//   }, []); // Empty dependency array means the function is stable

//   // 🔁 UPDATE #2: Use fetchDeals and dealRefreshKey as dependencies
//   useEffect(() => {
//     // This runs on mount and every time dealRefreshKey changes
//     fetchDeals();
//   }, [fetchDeals, dealRefreshKey]); // 🎯 CRITICAL: This is the trigger for refetching

//   const getProductName = (id: string) => {
//     const product = allProducts.find((p) => p._id === id);
//     return product ? product.name : "Unknown Product";
//   };

//   const formatDate = (dateString: Date | string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   // --- HANDLERS FOR EDIT/DELETE ---

//   const handleEditClick = (deal: any) => {
//     setEditingDeal(deal);
//     setIsEditFormOpen(true);
//   };

//   const confirmDelete = (deal: any) => {
//     setDealToDelete(deal);
//     setShowDeleteConfirm(true);
//   };

//   const executeDeleteDeal = async () => {
//     if (!dealToDelete) return;

//     try {
//       const response = await fetch(`/api/deals/${dealToDelete._id}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to delete deal.");
//       }

//       toast.success(
//         `Deal for PKR ${dealToDelete.dealPrice.toFixed(2)} deleted successfully!`
//       );
      
//       // 🚀 Signal parent to refresh (which increments the dealRefreshKey)
//       onDealUpdated(); 
//       // The useEffect hook handles the actual refetching (no need for fetchDeals() here)
//     } catch (error: any) {
//       toast.error(error.message || "Failed to delete deal.");
//       console.error("Error deleting deal:", error);
//     } finally {
//       setDealToDelete(null);
//       setShowDeleteConfirm(false);
//     }
//   };

//   // --- RENDER LOGIC ---

//   if (loading) {
//     return (
//       <Card className="w-full">
//         <CardContent className="flex items-center justify-center p-6 text-gray-500">
//           <Loader2 className="animate-spin h-6 w-6 mr-2" /> Loading Hot Deals...
//         </CardContent>
//       </Card>
//     );
//   }

//   if (error) {
//     return (
//       <Card className="w-full">
//         <CardContent className="p-6 text-red-600">
//           <p className="font-semibold">Error Loading Deals:</p>
//           <p>{error}</p>
//           <Button variant="outline" className="mt-4" onClick={fetchDeals}>
//             Retry
//           </Button>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <>
//       {/* Main List Display */}
//       <div className="space-y-4">
//         <h2 className="text-2xl font-bold flex items-center">
//           <TrendingDown className="h-6 w-6 mr-2 text-[#EFA765]" /> <span className="text-[#EFA765]"> Active &
//           Scheduled Hot Deals ({deals.length})</span>
//         </h2>

//         {deals.length === 0 ? (
//           <Card className="w-full bg-[#141f2d] border border-[#efa765]">
//             <CardContent className="p-6 text-gray-500">
//               No hot deals are currently scheduled.
//             </CardContent>
//           </Card>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {deals.map((deal: any) => (
//               <Card
//                 key={deal._id.toString()}
//                 className={
//                   deal.isExpired
//                     ? "opacity-60 border-gray-300 bg-[#141f2d]"
//                     : "border-gray-600 shadow-lg bg-[#243142]"
//                 }
//               >
//                 <CardHeader>
//                   <div className="flex justify-between items-start">
//                     <CardTitle className="text-xl font-bold text-gray-100">
//                       Deal Price: PKR {deal.dealPrice.toFixed(2)}
//                     </CardTitle>

//                     {/* --- Dropdown Menu for Actions --- */}
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button
//                           variant="ghost"
//                           className="h-8 w-8 p-0 text-white hover:bg-gray-500"
//                         >
//                           <MoreHorizontal className="h-4 w-4" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent
//                         align="end"
//                         className="bg-gray-800 border-gray-700 text-white"
//                       >
//                         <DropdownMenuItem
//                           onClick={() => handleEditClick(deal)}
//                           className="text-blue-400 hover:bg-gray-700 cursor-pointer"
//                         >
//                           <Edit className="mr-2 h-4 w-4" /> Edit Deal
//                         </DropdownMenuItem>
//                         <DropdownMenuSeparator className="bg-gray-700" />
//                         <DropdownMenuItem
//                           onClick={() => confirmDelete(deal)}
//                           className="text-red-500 hover:bg-red-900 hover:text-red-100 cursor-pointer"
//                         >
//                           <Trash2 className="mr-2 h-4 w-4" /> Delete Deal
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </div>

//                   <div className="flex justify-between items-center text-sm text-gray-500">
//                     <p className="flex items-center">
//                       <Calendar className="h-4 w-4 mr-1 text-gray-300" />
//                       <span className="text-gray-300">{formatDate(deal.startDate)} - {formatDate(deal.endDate)}</span>
//                     </p>
//                     <Badge
//                       variant={deal.isExpired ? "secondary" : "default"}
//                       className={
//                         deal.isExpired
//                           ? "bg-gray-400 text-white"
//                           : "bg-red-600 hover:bg-red-700"
//                       }
//                     >
//                       {deal.isExpired ? "EXPIRED" : "ACTIVE"}
//                     </Badge>
//                   </div>
//                 </CardHeader>
//                 <CardContent className="pt-2">
//                   <p className="font-semibold mb-2 flex items-center">
//                     <Tags className="h-4 w-4 mr-1 text-gray-300" /> <span className="text-gray-300"> Target
//                     Products ({deal.productIds.length}):</span>
//                   </p>
//                   <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto pr-1">
//                     {deal.productIds.map((id:any) => (
//                       <Badge
//                         key={id.toString()}
//                         variant="outline"
//                         className="border-gray-100 text-gray-700"
//                       >
//                         <Tag className="h-3 w-3 mr-1 text-gray-300" />
//                         <span className="text-gray-300">{getProductName(id.toString())}</span>
//                       </Badge>
//                     ))}
//                   </div>

//                   <img
//                     src={deal.imageSrc}
//                     alt="Deal Promotion"
//                     className="w-full h-32 object-cover mt-4 rounded-md border"
//                   />
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* --- Edit Dialog (Reuses CreateHotDealForm) --- */}
//       {/* <CreateHotDealForm
//         products={allProducts}
//         isOpen={isEditFormOpen}
//         onOpenChange={setIsEditFormOpen}
//         onDealCreated={onDealUpdated} // This will refresh the list upon update/creation
//         editingDeal={editingDeal} // Pass the deal data for editing
//       /> */}

//       {/* --- Delete Confirmation Dialog --- */}
//       <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
//         <AlertDialogContent className="bg-gray-800 border-red-500 text-white">
//           <AlertDialogHeader>
//             <AlertDialogTitle className="text-red-500 flex items-center">
//               <X className="h-6 w-6 mr-2" /> Confirm Deletion
//             </AlertDialogTitle>
//             <AlertDialogDescription className="text-gray-300">
//               Are you sure you want to delete the deal for **PKR{" "}
//               {dealToDelete?.dealPrice.toFixed(2)}**? This action cannot be
//               undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-white border-none">
//               Cancel
//             </AlertDialogCancel>
//             <AlertDialogAction
//               onClick={executeDeleteDeal}
//               className="bg-red-600 hover:bg-red-700 text-white"
//             >
//               Yes, Delete Deal
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </>
//   );
// }








"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image"; // Optimization for LCP
import { toast } from "sonner";
import {
  Loader2,
  Calendar,
  Tags,
  Tag,
  TrendingDown,
  Trash2,
  MoreHorizontal,
  X,
} from "lucide-react";

import { Product } from "@/models/Product.model";

// UI Components
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AdminHotDealsListProps {
  allProducts: Product[];
  onDealUpdated: () => void;
  onDealDeleted?: () => void; 
  dealRefreshKey: number; 
}

export default function AdminHotDealsList({
  allProducts,
  onDealUpdated,
  dealRefreshKey,
}: AdminHotDealsListProps) {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States for actions
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [dealToDelete, setDealToDelete] = useState<any>(null);

  const fetchDeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/deals");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch hot deals.");
      }

      const data = await response.json();
      setDeals(data.data || []);
    } catch (err: any) {
      console.error("Fetch Deals Error:", err);
      setError(err.message || "An unexpected error occurred.");
      toast.error(err.message || "Could not load hot deals.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals, dealRefreshKey]);

  const getProductName = (id: string) => {
    const product = allProducts.find((p) => p._id === id);
    return product ? product.name : "Unknown Product";
  };

  const formatDate = (dateString: Date | string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const confirmDelete = (deal: any) => {
    setDealToDelete(deal);
    setShowDeleteConfirm(true);
  };

  const executeDeleteDeal = async () => {
    if (!dealToDelete) return;

    try {
      const response = await fetch(`/api/deals/${dealToDelete._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete deal.");
      }

      toast.success(
        `Deal for PKR ${dealToDelete.dealPrice.toFixed(2)} deleted successfully!`
      );
      
      onDealUpdated(); 
    } catch (error: any) {
      toast.error(error.message || "Failed to delete deal.");
    } finally {
      setDealToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center p-6 text-gray-500">
          <Loader2 className="animate-spin h-6 w-6 mr-2" /> Loading Hot Deals...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-red-600">
          <p className="font-semibold">Error Loading Deals:</p>
          <p>{error}</p>
          <Button variant="outline" className="mt-4" onClick={fetchDeals}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center">
          <TrendingDown className="h-6 w-6 mr-2 text-[#EFA765]" /> 
          <span className="text-[#EFA765]"> Active & Scheduled Hot Deals ({deals.length})</span>
        </h2>

        {deals.length === 0 ? (
          <Card className="w-full bg-[#141f2d] border border-[#efa765]">
            <CardContent className="p-6 text-gray-500">
              No hot deals are currently scheduled.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deals.map((deal: any) => (
              <Card
                key={deal._id.toString()}
                className={
                  deal.isExpired
                    ? "opacity-60 border-gray-300 bg-[#141f2d]"
                    : "border-gray-600 shadow-lg bg-[#243142]"
                }
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold text-gray-100">
                      PKR {deal.dealPrice.toFixed(2)}
                    </CardTitle>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 text-white hover:bg-gray-500"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-gray-800 border-gray-700 text-white"
                      >
                        <DropdownMenuItem
                          onClick={() => confirmDelete(deal)}
                          className="text-red-500 hover:bg-red-900 hover:text-red-100 cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Deal
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-300" />
                      <span className="text-gray-300">{formatDate(deal.startDate)} - {formatDate(deal.endDate)}</span>
                    </div>
                    <Badge
                      variant={deal.isExpired ? "secondary" : "default"}
                      className={
                        deal.isExpired
                          ? "bg-gray-400 text-white"
                          : "bg-red-600 hover:bg-red-700"
                      }
                    >
                      {deal.isExpired ? "EXPIRED" : "ACTIVE"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="font-semibold mb-2 flex items-center">
                    <Tags className="h-4 w-4 mr-1 text-gray-300" /> 
                    <span className="text-gray-300"> Products ({deal.productIds.length}):</span>
                  </div>
                  <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto pr-1">
                    {deal.productIds.map((id: any) => (
                      <Badge
                        key={id.toString()}
                        variant="outline"
                        className="border-gray-100 text-gray-400"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        <span>{getProductName(id.toString())}</span>
                      </Badge>
                    ))}
                  </div>

                  {/* Optimized Next.js Image */}
                  <div className="relative w-full h-32 mt-4 rounded-md overflow-hidden border">
                    <Image
                      src={deal.imageSrc}
                      alt="Deal Promotion"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="bg-gray-800 border-red-500 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-500 flex items-center">
              <X className="h-6 w-6 mr-2" /> Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Are you sure you want to delete this deal? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-white border-none">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDeleteDeal}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Yes, Delete Deal
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}