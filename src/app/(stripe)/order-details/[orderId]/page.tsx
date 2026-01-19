import { notFound } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order.model";
import ReviewModel from "@/models/Review.model";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { QRCodeSVG } from 'qrcode.react'; // New Import
import {
  ShoppingBag,
  Receipt,
  Mail,
  Star,
  CheckCircle,
  ShieldCheck,
  MapPin,
  QrCode,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

// ... (getBadgeStyles and getOrderData remain the same)
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
  const orderDoc: any = await Order.findOne({ orderId }).lean();
  if (!orderDoc) return null;

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

  return { order, reviewedProductIds };
}

export default async function OrderDetailsPage({ params }: any) {
  const { orderId } = await params;
  const data = await getOrderData(orderId);
  if (!data) notFound();

  const { order, reviewedProductIds } = data;
  const addr = order.shippingAddress;

  // Data for the QR Code
  const qrData = JSON.stringify({
    id: order.orderId,
    otp: order.deliveryOTP
  });

  return (
    <div className="min-h-screen bg-[#141F2D] p-4 md:p-8 text-[#EFA765] font-sans">
      <Card className="bg-[#1D2B3F] p-6 rounded-3xl shadow-xl border border-[#EFA765]/20 max-w-4xl mx-auto">
        <CardHeader className="text-center text-[#EFA765]">
          <CardTitle className="text-4xl font-extrabold flex items-center justify-center">
            <ShoppingBag className="mr-4 h-10 w-10" /> Order Details
          </CardTitle>
          <p className="text-sm text-gray-100 opacity-70 mt-2">#{order.orderId}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <Separator className="bg-[#EFA765]/30 my-4" />

          {/* OTP & QR VERIFICATION SECTION */}
          {order.orderStatus === "paid" && (
            <div className="bg-[#EFA765]/5 border-2 border-dashed border-[#EFA765]/30 rounded-3xl p-6 mb-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="flex items-center gap-2 text-[#EFA765] font-bold uppercase tracking-widest text-sm">
                  <ShieldCheck className="h-5 w-5" />
                  Delivery Verification
                </div>

                {order.isOTPVerified ? (
                  <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500 py-6">
                    <CheckCircle className="h-16 w-16 text-green-400 mb-2" />
                    <h2 className="text-4xl font-black text-green-400">VERIFIED</h2>
                    <p className="text-white/40 text-xs mt-1 italic">Order successfully confirmed</p>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full py-4">
                    {/* Visual QR Code */}
                    <div className="bg-white p-3 rounded-2xl shadow-lg border-4 border-[#EFA765]/20">
                      <QRCodeSVG 
                        value={qrData} 
                        size={150} 
                        level="H"
                        includeMargin={false}
                        imageSettings={{
                            src: "/logo.png", // Optional: put your logo path here
                            x: undefined,
                            y: undefined,
                            height: 24,
                            width: 24,
                            excavate: true,
                          }}
                      />
                    </div>

                    <div className="flex flex-col items-center md:items-start">
                      <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                        <QrCode className="h-3 w-3" /> Scan or Enter Code
                      </div>
                      <h2 className="text-5xl font-mono font-black text-[#EFA765] tracking-[0.2em]">
                        {order.deliveryOTP}
                      </h2>
                      <p className="text-white/60 text-sm mt-3 max-w-[250px] md:text-left">
                        Show this QR code or the 6-digit number to the delivery partner upon arrival.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ... (Summary, Customer, and Items sections remain unchanged) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* Summary */}
             <div className="space-y-2">
               <h3 className="text-xl font-bold flex items-center text-[#EFA765]"><Receipt className="mr-2 h-5 w-5" /> Summary</h3>
               <div className="text-white/60 space-y-1 text-sm">
                 <p><strong>Status:</strong> <Badge className={getBadgeStyles(order.orderStatus)}>{order.orderStatus}</Badge></p>
                 <p><strong>Shipping:</strong> <Badge className={getBadgeStyles(order.shippingProgress)}>{order.shippingProgress}</Badge></p>
                 <p><strong>Date:</strong> {format(new Date(order.createdAt), "PPP")}</p>
               </div>
             </div>

             {/* Customer */}
             <div className="space-y-2">
               <h3 className="text-xl font-bold flex items-center text-[#EFA765]"><Mail className="mr-2 h-5 w-5" /> Customer</h3>
               <div className="text-white/60 space-y-1 text-sm">
                 <p><strong>Name:</strong> {order.customerName}</p>
                 <p className="truncate"><strong>Email:</strong> {order.customerEmail}</p>
                 <p><strong>Phone:</strong> {addr.phoneNumber}</p>
               </div>
             </div>

             {/* Address */}
             <div className="space-y-2">
               <h3 className="text-xl font-bold flex items-center text-[#EFA765]"><MapPin className="mr-2 h-5 w-5" /> Address</h3>
               <div className="text-white/60 space-y-1 text-sm">
                 <p className="font-semibold text-gray-200">{addr.fullName}</p>
                 <p>{addr.addressLine1}</p>
                 {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                 <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                 <p>{addr.country}</p>
               </div>
             </div>
           </div>

           <Separator className="bg-[#EFA765]/30" />

           <div>
             <h3 className="text-2xl font-bold mb-4 flex items-center text-[#EFA765]"><ShoppingBag className="mr-2 h-6 w-6" /> Items</h3>
             <div className="space-y-4">
               {order.items.map((item: any) => {
                 const hasBeenReviewed = reviewedProductIds.includes(item.id);
                 return (
                   <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-[#EFA765]/10 rounded-lg bg-[#2a3b52] gap-4">
                     <div className="flex items-center space-x-4">
                       <Image src={item.image} alt={item.name} width={80} height={80} className="w-20 h-20 object-cover rounded-md" />
                       <div>
                         <h4 className="text-lg font-bold text-gray-200">{item.name}</h4>
                         <p className="text-white/60">Qty: {item.quantity} | PKR {item.price.toFixed(2)}</p>
                       </div>
                     </div>

                     <div>
                       {order.orderStatus === "paid" && (
                         hasBeenReviewed ? (
                           <div className="flex items-center text-green-400 gap-2 px-4 py-2 bg-green-400/10 rounded-full border border-green-400/20">
                             <CheckCircle className="h-4 w-4" /> <span className="text-sm font-semibold">Reviewed</span>
                           </div>
                         ) : (
                           <Link href={`/reviews?orderId=${order.orderId}&productId=${item.id}`}>
                             <Button variant="outline" className="border-[#EFA765] text-[#EFA765] bg-[#141F2D] hover:bg-[#141F2D]/80 hover:text-[#EFA765] rounded-full">
                               <Star className="mr-2 h-4 w-4" /> Review Item
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

           <div className="text-right text-2xl text-[#EFA765] font-bold border-t border-[#EFA765]/30 pt-4 mt-4">
             Total: PKR {order.totalAmount.toFixed(2)}
           </div>

           <div className="mt-8 text-center">
             <Link href="/">
               <Button variant="outline" className="border-[#EFA765] text-[#EFA765] bg-[#141F2D] hover:bg-[#EFA765] hover:text-[#141F2D] rounded-full px-10 w-full md:w-auto transition-colors">
                 Back to Home
               </Button>
             </Link>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}