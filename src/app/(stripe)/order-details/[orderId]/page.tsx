import { notFound } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order.model";
import ReviewModel from "@/models/Review.model";
import Setting from "@/models/Settings.model";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { QRCodeSVG } from 'qrcode.react'; 
import {
  ShoppingBag,
  Receipt,
  Mail,
  Star,
  CheckCircle,
  ShieldCheck,
  MapPin,
  QrCode,
  Tag,
  Navigation,
  ExternalLink,
  Store,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const getBadgeStyles = (status: string) => {
  switch (status) {
    case "paid":
    case "delivered":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "canceled":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "shipped":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    default:
      return "bg-[#EFA765]/20 text-[#EFA765] border-[#EFA765]/30";
  }
};

async function getOrderData(orderId: string) {
  await dbConnect();
  
  // 1. Fetch Order
  const orderDoc: any = await Order.findOne({ orderId }).lean();
  if (!orderDoc) return null;

  // 2. Fetch Restaurant Settings for coordinates and Estimated Time
  const settingsDoc: any = await Setting.findOne({}).lean();

  const order = {
    ...orderDoc,
    _id: orderDoc._id.toString(),
    userId: orderDoc.userId.toString(),
    createdAt: orderDoc.createdAt.toISOString(),
    items: orderDoc.items.map((item: any) => ({
      ...item,
      id: item.id?.toString() || item._id?.toString(),
    })),
  };

  const existingReviews = await ReviewModel.find({ orderId: order.orderId })
    .select("productId")
    .lean();
  const reviewedProductIds = existingReviews.map((rev: any) =>
    rev.productId.toString()
  );

  return { 
    order, 
    reviewedProductIds,
    estimatedDeliveryTime: settingsDoc?.estimatedDeliveryTime || "30-45 mins",
    restaurantLocation: {
        lat: settingsDoc?.restaurantLocation?.lat || 30.6622,
        lng: settingsDoc?.restaurantLocation?.lng || 73.1087,
        name: settingsDoc?.restaurantLocation?.address || "Our Restaurant"
    }
  };
}

export default async function OrderDetailsPage({ params }: any) {
  const { orderId } = await params;
  const data = await getOrderData(orderId);
  if (!data) notFound();

  const { order, reviewedProductIds, restaurantLocation, estimatedDeliveryTime } = data;
  const addr = order.shippingAddress;

  const isEligibleForVerification = order.orderStatus === "paid" || order.paymentMethod === "cod";

  const qrData = JSON.stringify({
    id: order.orderId,
    otp: order.deliveryOTP
  });

  const directionsUrl = (addr.lat && addr.lng) 
    ? `https://www.google.com/maps/dir/?api=1&origin=${restaurantLocation.lat},${restaurantLocation.lng}&destination=${addr.lat},${addr.lng}&travelmode=driving`
    : null;

  return (
    <div className="min-h-screen bg-[#141F2D] p-3 md:p-8 text-[#EFA765] font-sans">
      <Card className="bg-[#1D2B3F] p-4 md:p-6 rounded-[2rem] md:rounded-3xl shadow-xl border border-[#EFA765]/20 max-w-4xl mx-auto">
        <CardHeader className="text-center text-[#EFA765] px-0">
          <CardTitle className="text-2xl md:text-4xl font-extrabold flex items-center justify-center gap-2">
            <ShoppingBag className="h-8 w-8 md:h-10 md:w-10" /> Order Details
          </CardTitle>
          <p className="text-xs md:text-sm text-gray-100 opacity-70 mt-2 font-mono">#{order.orderId}</p>
        </CardHeader>

        <CardContent className="space-y-6 px-0 md:px-6">
          <Separator className="bg-[#EFA765]/30 my-2 md:my-4" />

          {/* OTP & QR VERIFICATION SECTION */}
          {isEligibleForVerification && (
            <div className="bg-[#EFA765]/5 border-2 border-dashed border-[#EFA765]/30 rounded-2xl md:rounded-3xl p-4 md:p-6 mb-4 md:mb-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="flex items-center gap-2 text-[#EFA765] font-bold uppercase tracking-widest text-[10px] md:text-sm">
                  <ShieldCheck className="h-4 w-4 md:h-5 md:w-5" />
                  Delivery Verification
                </div>

                {order.isOTPVerified ? (
                  <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500 py-4 md:py-6">
                    <CheckCircle className="h-12 w-12 md:h-16 md:w-16 text-green-400 mb-2" />
                    <h2 className="text-3xl md:text-4xl font-black text-green-400">VERIFIED</h2>
                    <p className="text-white/40 text-[10px] md:text-xs mt-1 italic">Order successfully confirmed</p>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 w-full py-2 md:py-4">
                    <div className="bg-white p-2 md:p-3 rounded-xl md:rounded-2xl shadow-lg border-2 md:border-4 border-[#EFA765]/20">
                      <QRCodeSVG 
                        value={qrData} 
                        size={120} 
                        level="H"
                        className="md:w-37.5 md:h-37.5"
                      />
                    </div>

                    <div className="flex flex-col items-center md:items-start">
                      <div className="flex items-center gap-2 text-white/40 text-[10px] mb-1">
                        <QrCode className="h-3 w-3" /> Scan or Enter Code
                      </div>
                      <h2 className="text-4xl md:text-5xl font-mono font-black text-[#EFA765] tracking-[0.15em] md:tracking-[0.2em]">
                        {order.deliveryOTP}
                      </h2>
                      <p className="text-white/60 text-xs md:text-sm mt-3 max-w-70 text-center md:text-left leading-relaxed">
                        Show this QR code or the 6-digit number to the delivery partner upon arrival.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
             <div className="space-y-2 bg-[#141F2D]/30 p-4 rounded-xl md:p-0 md:bg-transparent">
               <h3 className="text-lg md:text-xl font-bold flex items-center text-[#EFA765]"><Receipt className="mr-2 h-5 w-5" /> Summary</h3>
               <div className="text-white/60 space-y-2 text-sm">
                 <p className="flex justify-between md:block"><strong>Status:</strong> <Badge className={getBadgeStyles(order.orderStatus)}>{order.orderStatus}</Badge></p>
                 <p className="flex justify-between md:block"><strong>Shipping:</strong> <Badge className={getBadgeStyles(order.shippingProgress)}>{order.shippingProgress}</Badge></p>
                 <p className="flex justify-between md:block"><strong>Method:</strong> <span className="uppercase font-bold text-[#EFA765]">{order.paymentMethod}</span></p>
                 <p className="flex justify-between md:block"><strong>Date:</strong> {format(new Date(order.createdAt), "PP")}</p>
               </div>
             </div>

             <div className="space-y-2 bg-[#141F2D]/30 p-4 rounded-xl md:p-0 md:bg-transparent">
               <h3 className="text-lg md:text-xl font-bold flex items-center text-[#EFA765]"><Mail className="mr-2 h-5 w-5" /> Customer</h3>
               <div className="text-white/60 space-y-1 text-sm">
                 <p><strong>Name:</strong> {order.customerName}</p>
                 <p className="truncate"><strong>Email:</strong> {order.customerEmail}</p>
                 <p><strong>Phone:</strong> {addr.phoneNumber}</p>
                 <p><strong>Est. Time:</strong> <span><span className="text-[#EFA765]">~ {estimatedDeliveryTime} </span>minutes</span></p>
               </div>
             </div>

             <div className="space-y-3 bg-[#141F2D]/30 p-4 rounded-xl md:p-0 md:bg-transparent sm:col-span-2 md:col-span-1">
               <h3 className="text-lg md:text-xl font-bold flex items-center text-[#EFA765]"><MapPin className="mr-2 h-5 w-5" /> Delivery Address</h3>
               <div className="text-white/60 space-y-1 text-sm mb-4">
                 <p className="font-semibold text-gray-200">{addr.fullName}</p>
                 <p className="leading-tight">{addr.addressLine1}, {addr.city}</p>
                 <p className="text-[10px] text-[#EFA765]/50 flex items-center gap-1 uppercase">
                    <Store size={10} /> From: {restaurantLocation.name}
                 </p>
               </div>
               
               {directionsUrl && (
                 <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
                   <Button className="w-full bg-[#EFA765] hover:bg-[#EFA765]/90 text-[#141F2D] rounded-xl py-7 transition-all group shadow-lg shadow-[#EFA765]/10">
                     <div className="flex flex-col items-center">
                        <span className="flex items-center gap-2 font-black uppercase text-xs italic">
                          <Navigation className="h-4 w-4 fill-current group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          Track Order Route
                        </span>
                        <span className="text-[9px] font-bold opacity-70 mt-1 uppercase tracking-widest flex items-center gap-1">
                          Restaurant <Separator className="w-4 bg-[#141F2D]/30" /> Customer <ExternalLink size={8} />
                        </span>
                     </div>
                   </Button>
                 </a>
               )}
             </div>
          </div>

          <Separator className="bg-[#EFA765]/30" />

          {/* Items Section */}
          <div>
            <h3 className="text-xl md:text-2xl font-bold mb-4 flex items-center text-[#EFA765]"><ShoppingBag className="mr-2 h-5 w-5 md:h-6 md:w-6" /> Items</h3>
            <div className="space-y-3">
              {order.items.map((item: any) => {
                const hasBeenReviewed = reviewedProductIds.includes(item.id);
                const canReview = order.orderStatus === "paid" || order.paymentMethod === "cod";
                
                return (
                  <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border border-[#EFA765]/10 rounded-xl bg-[#2a3b52] gap-4">
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <div className="relative h-16 w-16 md:h-20 md:w-20 shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover rounded-lg" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm md:text-lg font-bold text-gray-200 truncate">{item.name}</h4>
                        <p className="text-white/60 text-xs md:text-sm">Qty: {item.quantity} | PKR {item.price.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="w-full sm:w-auto">
                      {canReview && (
                        hasBeenReviewed ? (
                          <div className="flex items-center justify-center text-green-400 gap-2 px-4 py-2 bg-green-400/10 rounded-full border border-green-400/20 w-full sm:w-auto">
                            <CheckCircle className="h-4 w-4" /> <span className="text-xs md:text-sm font-semibold">Reviewed</span>
                          </div>
                        ) : (
                          <Link href={`/reviews?orderId=${order.orderId}&productId=${item.id}`} className="block w-full">
                            <Button variant="outline" className="w-full sm:w-auto border-[#EFA765] text-[#EFA765] bg-[#141F2D] hover:bg-[#EFA765] hover:text-[#141F2D] rounded-full text-xs md:text-sm h-9 md:h-10 transition-all">
                              <Star className="mr-2 h-3 w-3 md:h-4 md:w-4" /> Review Item
                            </Button>
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Financial Section */}
          <div className="space-y-3 pt-6 border-t border-[#EFA765]/30">
            <div className="flex justify-between items-center text-sm md:text-base">
              <span className="text-white/50 uppercase font-bold tracking-tighter">Subtotal</span>
              <span className="text-white font-mono">PKR {order.totalAmount.toLocaleString()}</span>
            </div>

            {order.discountAmount > 0 && (
              <div className="flex justify-between items-center text-sm md:text-base text-emerald-400 italic">
                <span className="flex items-center gap-2 font-bold uppercase tracking-tighter">
                  <Tag size={14} /> Global Discount
                </span>
                <span className="font-mono">- PKR {order.discountAmount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 text-2xl md:text-3xl font-black italic">
              <span className="text-xs md:text-sm not-italic uppercase tracking-widest text-white/40">Grand Total</span>
              <span className="text-[#EFA765]">PKR {order.finalAmount.toLocaleString()}</span>
            </div>

            <div className="text-center pt-8">
              <Link href="/">
                <Button variant="outline" className="border-[#EFA765] text-[#EFA765] bg-[#141F2D] hover:bg-[#EFA765] hover:text-[#141F2D] rounded-full px-8 md:px-12 w-full md:w-auto transition-all font-bold h-12 uppercase italic tracking-wider">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="h-8 md:hidden" />
    </div>
  );
}