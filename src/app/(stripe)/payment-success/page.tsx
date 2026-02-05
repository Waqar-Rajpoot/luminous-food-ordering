// import { Suspense } from 'react';
// import { redirect } from 'next/navigation';
// import Stripe from 'stripe';
// import { Loader2, Check, ArrowRight, ShoppingBag } from 'lucide-react';
// import dbConnect from '@/lib/dbConnect'; 
// import Order from '@/models/Order.model';
// import Product from '@/models/Product.model';
// import mongoose from 'mongoose';
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2024-12-18.acacia" as any, 
// });

// interface PageProps {
//   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
// }

// async function PaymentDetailsProcessor({ sessionId, orderId }: { sessionId: string; orderId: string }) {
//   await dbConnect();

//   try {
//     const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

//     if (!stripeSession || stripeSession.payment_status !== 'paid') {
//       await Order.findOneAndUpdate({ orderId: orderId }, { orderStatus: 'canceled', stripeSessionId: sessionId });
//       redirect(`/payment-cancel`);
//     }

//     const order = await Order.findOne({ orderId: orderId });

//     if (!order) {
//       redirect(`/order-details/${orderId}?status=error`);
//     }

//     if (order.orderStatus === 'pending') {
//       order.orderStatus = 'paid';
//       order.stripeSessionId = sessionId;

//       const updateSalesPromises = order.items.map((item: any) => {
//         return Product.updateOne(
//           { _id: new mongoose.Types.ObjectId(item.id as string) },
//           { $inc: { salesCount: Number(item.quantity) } } 
//         );
//       });

//       await Promise.all([order.save(), ...updateSalesPromises]);
//     }
//   } catch (error: any) {
//     if (error && typeof error === 'object' && error.digest && error.digest.startsWith('NEXT_REDIRECT')) {
//       throw error;
//     }
//     await Order.findOneAndUpdate({ orderId: orderId }, { orderStatus: 'canceled', stripeSessionId: sessionId });
//     redirect(`/payment-cancel`);
//   }

//   return (
//     <div className="relative flex flex-col justify-center items-center min-h-screen bg-[#141F2D] p-6 overflow-hidden">
//       {/* Premium Background Ambient Glow */}
//       <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#EFA765] opacity-[0.05] blur-[120px] rounded-full" />
//       <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#EFA765] opacity-[0.05] blur-[120px] rounded-full" />

//       <Card className="relative z-10 bg-[#1D2B3F]/50 backdrop-blur-xl border border-[#EFA765]/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-lg w-full rounded-[2.5rem] overflow-hidden">
//         <CardContent className="pt-12 pb-10 px-8 text-center">
//           {/* Animated Success Icon Ring */}
//           <div className="flex items-center justify-center mb-8">
//             <div className="relative">
//               <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
//               <div className="relative bg-green-500 h-20 w-20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)]">
//                 <Check className="h-10 w-10 text-[#141F2D] stroke-[3px]" />
//               </div>
//             </div>
//           </div>

//           <h1 className="text-4xl md:text-5xl font-black text-[#EFA765] mb-4 tracking-tight font-[Yeseve One]">
//             Order Confirmed
//           </h1>
          
//           <div className="inline-block px-4 py-1.5 rounded-full bg-[#EFA765]/10 border border-[#EFA765]/20 mb-6">
//             <p className="text-[#EFA765] text-sm font-bold uppercase tracking-widest">
//               ID: {orderId}
//             </p>
//           </div>

//           <p className="text-gray-300 text-lg leading-relaxed max-w-xs mx-auto mb-10">
//             Your payment was processed successfully. We&apos;re getting your order ready!
//           </p>

//           <div className="grid grid-cols-1 gap-4">
//             <Link href={`/order-details/${orderId}`} className="w-full">
//               <Button className="w-full bg-[#EFA765] text-[#141F2D] hover:bg-white transition-all duration-500 rounded-2xl h-14 text-lg font-bold group shadow-lg shadow-[#EFA765]/10">
//                 Track Your Order
//                 <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
//               </Button>
//             </Link>

//             <Link href="/" className="w-full">
//               <Button variant="ghost" className="w-full text-gray-400 hover:text-[#EFA765] hover:bg-transparent transition-colors h-12">
//                 <ShoppingBag className="mr-2 h-4 w-4" />
//                 Return to Shop
//               </Button>
//             </Link>
//           </div>
//         </CardContent>
//       </Card>
      
//       {/* Footer Branding */}
//       <p className="mt-8 text-gray-500 text-sm font-medium tracking-tighter uppercase opacity-50 italic">
//         Secured by Stripe Intelligence
//       </p>
//     </div>
//   );
// }

// export default async function PaymentSuccessPage({ searchParams }: PageProps) {
//   const resolvedSearchParams = await searchParams;
//   const sessionId = resolvedSearchParams.session_id;
//   const orderId = resolvedSearchParams.order_id;

//   if (typeof sessionId !== 'string' || typeof orderId !== 'string') {
//     redirect('/');
//   }

//   return (
//     <Suspense
//       fallback={
//         <div className="flex flex-col justify-center items-center min-h-screen bg-[#141F2D] text-[#EFA765]">
//           <div className="flex flex-col items-center gap-4">
//             <Loader2 className="h-12 w-12 animate-spin text-[#EFA765] opacity-50" />
//             <p className="font-bold tracking-widest uppercase text-sm animate-pulse">
//               Authenticating Transaction...
//             </p>
//           </div>
//         </div>
//       }
//     >
//       <PaymentDetailsProcessor sessionId={sessionId} orderId={orderId} />
//     </Suspense>
//   );
// }







// import { Suspense } from 'react';
// import { redirect } from 'next/navigation';
// import Stripe from 'stripe';
// import { Loader2, Check, ArrowRight, ShoppingBag } from 'lucide-react';
// import dbConnect from '@/lib/dbConnect'; 
// import Order from '@/models/Order.model';
// import Product from '@/models/Product.model';
// import mongoose from 'mongoose';
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';

// // Ensure Stripe is initialized
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2025-12-15.clover" as any, 
// });

// interface PageProps {
//   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
// }

// async function PaymentDetailsProcessor({ sessionId, orderId }: { sessionId: string; orderId: string }) {
//   await dbConnect();

//   try {
//     // 1. Retrieve the session from Stripe to get the REAL amount paid
//     const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

//     if (!stripeSession || stripeSession.payment_status !== 'paid') {
//       await Order.findOneAndUpdate({ orderId: orderId }, { orderStatus: 'canceled', stripeSessionId: sessionId });
//       redirect(`/payment-cancel`);
//     }

//     const order = await Order.findOne({ orderId: orderId });

//     if (!order) {
//       redirect(`/order-details/${orderId}?status=error`);
//     }

//     // 2. Extract the actual total and shipping from Stripe
//     // Stripe amounts are in cents, so we divide by 100
//     const realTotalPaid = stripeSession.amount_total ? stripeSession.amount_total / 100 : order.finalAmount;
//     const realShippingPaid = stripeSession.total_details?.amount_shipping 
//       ? stripeSession.total_details.amount_shipping / 100 
//       : 0;

//     // 3. Update the order only if it's still 'pending'
//     if (order.orderStatus === 'pending') {
//       order.orderStatus = 'paid';
//       order.stripeSessionId = sessionId;
      
//       // FIX: Overwrite the 600 with the 650 (total including shipping)
//       order.finalAmount = realTotalPaid;
//       order.totalAmount = realTotalPaid; 
//       order.shippingCost = realShippingPaid;

//       const updateSalesPromises = order.items.map((item: any) => {
//         return Product.updateOne(
//           { _id: new mongoose.Types.ObjectId(item.id as string) },
//           { $inc: { salesCount: Number(item.quantity) } } 
//         );
//       });

//       // Save everything to MongoDB
//       await Promise.all([order.save(), ...updateSalesPromises]);
//       console.log(`Order ${orderId} updated on Success Page. Total: ${realTotalPaid}`);
//     }
//   } catch (error: any) {
//     if (error && typeof error === 'object' && error.digest && error.digest.startsWith('NEXT_REDIRECT')) {
//       throw error;
//     }
//     await Order.findOneAndUpdate({ orderId: orderId }, { orderStatus: 'canceled', stripeSessionId: sessionId });
//     redirect(`/payment-cancel`);
//   }

//   return (
//     <div className="relative flex flex-col justify-center items-center min-h-screen bg-[#141F2D] p-6 overflow-hidden">
//       {/* Premium Background Ambient Glow */}
//       <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#EFA765] opacity-[0.05] blur-[120px] rounded-full" />
//       <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#EFA765] opacity-[0.05] blur-[120px] rounded-full" />

//       <Card className="relative z-10 bg-[#1D2B3F]/50 backdrop-blur-xl border border-[#EFA765]/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-lg w-full rounded-[2.5rem] overflow-hidden">
//         <CardContent className="pt-12 pb-10 px-8 text-center">
//           <div className="flex items-center justify-center mb-8">
//             <div className="relative">
//               <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
//               <div className="relative bg-green-500 h-20 w-20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)]">
//                 <Check className="h-10 w-10 text-[#141F2D] stroke-[3px]" />
//               </div>
//             </div>
//           </div>

//           <h1 className="text-4xl md:text-5xl font-black text-[#EFA765] mb-4 tracking-tight font-[Yeseve One]">
//             Order Confirmed
//           </h1>
          
//           <div className="inline-block px-4 py-1.5 rounded-full bg-[#EFA765]/10 border border-[#EFA765]/20 mb-6">
//             <p className="text-[#EFA765] text-sm font-bold uppercase tracking-widest">
//               ID: {orderId}
//             </p>
//           </div>

//           <p className="text-gray-300 text-lg leading-relaxed max-w-xs mx-auto mb-10">
//             Your payment was processed successfully. We&apos;re getting your order ready!
//           </p>

//           <div className="grid grid-cols-1 gap-4">
//             <Link href={`/order-details/${orderId}`} className="w-full">
//               <Button className="w-full bg-[#EFA765] text-[#141F2D] hover:bg-white transition-all duration-500 rounded-2xl h-14 text-lg font-bold group shadow-lg shadow-[#EFA765]/10">
//                 Track Your Order
//                 <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
//               </Button>
//             </Link>

//             <Link href="/" className="w-full">
//               <Button variant="ghost" className="w-full text-gray-400 hover:text-[#EFA765] hover:bg-transparent transition-colors h-12">
//                 <ShoppingBag className="mr-2 h-4 w-4" />
//                 Return to Shop
//               </Button>
//             </Link>
//           </div>
//         </CardContent>
//       </Card>
      
//       <p className="mt-8 text-gray-500 text-sm font-medium tracking-tighter uppercase opacity-50 italic">
//         Secured by Stripe Intelligence
//       </p>
//     </div>
//   );
// }

// export default async function PaymentSuccessPage({ searchParams }: PageProps) {
//   const resolvedSearchParams = await searchParams;
//   const sessionId = resolvedSearchParams.session_id;
//   const orderId = resolvedSearchParams.order_id;

//   if (typeof sessionId !== 'string' || typeof orderId !== 'string') {
//     redirect('/');
//   }

//   return (
//     <Suspense
//       fallback={
//         <div className="flex flex-col justify-center items-center min-h-screen bg-[#141F2D] text-[#EFA765]">
//           <div className="flex flex-col items-center gap-4">
//             <Loader2 className="h-12 w-12 animate-spin text-[#EFA765] opacity-50" />
//             <p className="font-bold tracking-widest uppercase text-sm animate-pulse">
//               Authenticating Transaction...
//             </p>
//           </div>
//         </div>
//       }
//     >
//       <PaymentDetailsProcessor sessionId={sessionId} orderId={orderId} />
//     </Suspense>
//   );
// }










import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';
import { Loader2, Check, ArrowRight, ShoppingBag } from 'lucide-react';
import dbConnect from '@/lib/dbConnect'; 
import Order from '@/models/Order.model';
import Product from '@/models/Product.model';
import mongoose from 'mongoose';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover" as any, 
});

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function PaymentDetailsProcessor({ sessionId, orderId }: { sessionId?: string; orderId: string }) {
  await dbConnect();

  try {
    const order = await Order.findOne({ orderId: orderId });

    if (!order) {
      redirect(`/order-details/${orderId}?status=error`);
    }

    // --- LOGIC FOR STRIPE ORDERS ---
    if (sessionId && order.paymentMethod !== 'cod') {
      const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

      if (!stripeSession || stripeSession.payment_status !== 'paid') {
        await Order.findOneAndUpdate({ orderId: orderId }, { orderStatus: 'canceled', stripeSessionId: sessionId });
        redirect(`/payment-cancel`);
      }

      // Sync the real total from Stripe
      const realTotalPaid = stripeSession.amount_total ? stripeSession.amount_total / 100 : order.finalAmount;
      const realShippingPaid = stripeSession.total_details?.amount_shipping 
        ? stripeSession.total_details.amount_shipping / 100 
        : 0;

      if (order.orderStatus === 'pending') {
        order.orderStatus = 'paid';
        order.stripeSessionId = sessionId;
        order.finalAmount = realTotalPaid;
        order.totalAmount = realTotalPaid; 
        order.shippingCost = realShippingPaid;

        // Update sales count
        const updateSalesPromises = order.items.map((item: any) => {
          return Product.updateOne(
            { _id: new mongoose.Types.ObjectId(item.id as string) },
            { $inc: { salesCount: Number(item.quantity) } } 
          );
        });

        await Promise.all([order.save(), ...updateSalesPromises]);
      }
    } 
    
    // --- LOGIC FOR COD ORDERS ---
    else if (order.paymentMethod === 'cod') {
      // For COD, we just ensure sales count is updated if it was just placed
      // We keep orderStatus as 'pending' because it's not paid yet
      if (order.items.length > 0) {
          const updateSalesPromises = order.items.map((item: any) => {
            return Product.updateOne(
              { _id: new mongoose.Types.ObjectId(item.id as string) },
              { $inc: { salesCount: Number(item.quantity) } } 
            );
          });
          // We don't mark as 'paid' here for COD
          await Promise.all(updateSalesPromises);
      }
    }

  } catch (error: any) {
    if (error && typeof error === 'object' && error.digest && error.digest.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    redirect(`/payment-cancel`);
  }

  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen bg-[#141F2D] p-6 overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#EFA765] opacity-[0.05] blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#EFA765] opacity-[0.05] blur-[120px] rounded-full" />

      <Card className="relative z-10 bg-[#1D2B3F]/50 backdrop-blur-xl border border-[#EFA765]/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-lg w-full rounded-[2.5rem] overflow-hidden">
        <CardContent className="pt-12 pb-10 px-8 text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
              <div className="relative bg-green-500 h-20 w-20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                <Check className="h-10 w-10 text-[#141F2D] stroke-[3px]" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-[#EFA765] mb-4 tracking-tight font-[Yeseve One]">
            Order Confirmed
          </h1>
          
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#EFA765]/10 border border-[#EFA765]/20 mb-6">
            <p className="text-[#EFA765] text-sm font-bold uppercase tracking-widest">
              ID: {orderId}
            </p>
          </div>

          <p className="text-gray-300 text-lg leading-relaxed max-w-xs mx-auto mb-10">
            {sessionId ? "Your payment was processed successfully." : "Your order has been placed successfully."} We&apos;re getting your items ready!
          </p>

          <div className="grid grid-cols-1 gap-4">
            <Link href={`/order-details/${orderId}`} className="w-full">
              <Button className="w-full bg-[#EFA765] text-[#141F2D] hover:bg-white transition-all duration-500 rounded-2xl h-14 text-lg font-bold group shadow-lg shadow-[#EFA765]/10">
                Track Your Order
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link href="/" className="w-full">
              <Button variant="ghost" className="w-full text-gray-400 hover:text-[#EFA765] hover:bg-transparent transition-colors h-12">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Return to Shop
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      
      <p className="mt-8 text-gray-500 text-sm font-medium tracking-tighter uppercase opacity-50 italic">
        Secured by Order Intelligence
      </p>
    </div>
  );
}

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const sessionId = resolvedSearchParams.session_id as string | undefined;
  const orderId = resolvedSearchParams.order_id as string;

  if (!orderId) {
    redirect('/');
  }

  return (
    <Suspense
      fallback={
        <div className="flex flex-col justify-center items-center min-h-screen bg-[#141F2D] text-[#EFA765]">
          <Loader2 className="h-12 w-12 animate-spin mb-4" />
          <p className="font-bold uppercase tracking-widest text-sm">Processing Order...</p>
        </div>
      }
    >
      <PaymentDetailsProcessor sessionId={sessionId} orderId={orderId} />
    </Suspense>
  );
}