// import { Suspense } from 'react';
// import { redirect } from 'next/navigation';
// import Stripe from 'stripe';
// import { Loader2, CheckCircle } from 'lucide-react';
// import dbConnect from '@/lib/dbConnect'; 
// import Order from '@/models/Order.model';
// import Product from '@/models/Product.model';
// import mongoose from 'mongoose';
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2025-07-30.basil", 
// });

// async function PaymentDetailsProcessor({ sessionId, orderId }: { sessionId: string; orderId: string }) {
//   await dbConnect();

//   try {
//     // 1. Verify session with Stripe
//     const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

//     if (!stripeSession || stripeSession.payment_status !== 'paid') {
//       console.warn(`SERVER: Payment for session ${sessionId} was not successful.`);
//       await Order.findOneAndUpdate({ orderId: orderId }, { orderStatus: 'canceled', stripeSessionId: sessionId });
//       redirect(`/payment-cancel`);
//     }

//     // 2. Find the order in our database
//     const order = await Order.findOne({ orderId: orderId });

//     if (!order) {
//       console.error(`SERVER: Order ${orderId} not found in DB.`);
//       redirect(`/order-details/${orderId}?status=error`);
//     }

//     if (order.orderStatus === 'pending') {
//       order.orderStatus = 'paid';
//       order.stripeSessionId = sessionId;

//       const updateSalesPromises = order.items.map((item: any) => {
//         console.log(`SERVER: Increasing salesCount for ${item.name} (ID: ${item.id}) by ${item.quantity}`);
        
//         return Product.updateOne(
//           { _id: new mongoose.Types.ObjectId(item.id as string) },
//           { $inc: { salesCount: Number(item.quantity) } } 
//         );
//       });

//       await Promise.all([
//         order.save(),
//         ...updateSalesPromises
//       ]);
//     }
//     return (
//       <div className="flex flex-col justify-center items-center min-h-screen bg-[#141F2D] p-6 text-[#EFA765] font-[Varela Round]">
//         <Card className="bg-[#1D2B3F] p-10 rounded-3xl shadow-2xl max-w-md mx-auto text-center border border-[#EFA765]/20">
//           <CardHeader>
//             <div className="flex items-center justify-center mb-6">
//               <CheckCircle className="h-20 w-20 text-green-500 animate-pulse" />
//             </div>
//             <CardTitle className="text-4xl font-extrabold text-[#EFA765] font-[Yeseve One]">
//               Payment Successful!
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-white text-opacity-80 mt-3 text-lg">Thank you for your purchase. Your order has been placed.</p>
//             <p className="text-white text-opacity-80 mt-1 text-md">Order ID: #{orderId}</p>
//             <Link href={`/order-details/${orderId}`} passHref>
//               <Button className="mt-8 w-full bg-[#EFA765] text-[#141F2D] hover:bg-[#EFA765]/80 transition-colors duration-300 rounded-full">
//                 View Order Details
//               </Button>
//             </Link>
//           </CardContent>
//         </Card>
//       </div>
//     );

//   } catch (error: any) {
//     if (error && typeof error === 'object' && error.digest && error.digest.startsWith('NEXT_REDIRECT')) {
//       throw error;
//     }
//     await Order.findOneAndUpdate({ orderId: orderId }, { orderStatus: 'canceled', stripeSessionId: sessionId });
//     redirect(`/payment-cancel`);
//   }
// }

// export default async function PaymentSuccessPage({
//   searchParams,
// }: {
//   searchParams: Record<string, string | string[] | undefined> | Promise<Record<string, string | string[] | undefined>>;
// }) {
//   const resolvedSearchParams = await searchParams;
//   const sessionId = resolvedSearchParams.session_id;
//   const orderId = resolvedSearchParams.order_id;

//   if (typeof sessionId !== 'string' || typeof orderId !== 'string') {
//     redirect('/');
//   }

//   return (
//     <Suspense
//       fallback={
//         <div className="flex flex-col justify-center items-center min-h-screen bg-[#141F2D] p-6 text-[#EFA765] font-[Varela Round]">
//           <div className="bg-[#1D2B3F] p-10 rounded-3xl shadow-2xl max-w-md mx-auto text-center border border-[#EFA765]/20">
//             <div className="text-7xl mb-6 text-[#EFA765] animate-pulse">
//               <Loader2 className="h-20 w-20 animate-spin mx-auto" />
//             </div>
//             <h1 className="text-4xl font-extrabold text-white font-[Yeseve One]">Verifying Payment...</h1>
//             <p className="text-white text-opacity-80 mt-3 text-lg">Please do not close this window.</p>
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
import { Loader2, CheckCircle } from 'lucide-react';
import dbConnect from '@/lib/dbConnect'; 
import Order from '@/models/Order.model';
import Product from '@/models/Product.model';
import mongoose from 'mongoose';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.basil" as any, // Updated to a stable version string or your preferred version
});

// Define the correct Next.js 15 Page Props interface
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function PaymentDetailsProcessor({ sessionId, orderId }: { sessionId: string; orderId: string }) {
  await dbConnect();

  try {
    // 1. Verify session with Stripe
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (!stripeSession || stripeSession.payment_status !== 'paid') {
      console.warn(`SERVER: Payment for session ${sessionId} was not successful.`);
      await Order.findOneAndUpdate({ orderId: orderId }, { orderStatus: 'canceled', stripeSessionId: sessionId });
      redirect(`/payment-cancel`);
    }

    // 2. Find the order in our database
    const order = await Order.findOne({ orderId: orderId });

    if (!order) {
      console.error(`SERVER: Order ${orderId} not found in DB.`);
      redirect(`/order-details/${orderId}?status=error`);
    }

    // 3. Update status only if it's currently pending
    if (order.orderStatus === 'pending') {
      order.orderStatus = 'paid';
      order.stripeSessionId = sessionId;

      const updateSalesPromises = order.items.map((item: any) => {
        console.log(`SERVER: Increasing salesCount for ${item.name} by ${item.quantity}`);
        
        return Product.updateOne(
          { _id: new mongoose.Types.ObjectId(item.id as string) },
          { $inc: { salesCount: Number(item.quantity) } } 
        );
      });

      await Promise.all([
        order.save(),
        ...updateSalesPromises
      ]);
    }

    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#141F2D] p-6 text-[#EFA765] font-[Varela Round]">
        <Card className="bg-[#1D2B3F] p-10 rounded-3xl shadow-2xl max-w-md mx-auto text-center border border-[#EFA765]/20">
          <CardHeader>
            <div className="flex items-center justify-center mb-6">
              <CheckCircle className="h-20 w-20 text-green-500 animate-pulse" />
            </div>
            <CardTitle className="text-4xl font-extrabold text-[#EFA765] font-[Yeseve One]">
              Payment Successful!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white text-opacity-80 mt-3 text-lg">Thank you for your purchase. Your order has been placed.</p>
            <p className="text-white text-opacity-80 mt-1 text-md">Order ID: #{orderId}</p>
            <Link href={`/order-details/${orderId}`} passHref>
              <Button className="mt-8 w-full bg-[#EFA765] text-[#141F2D] hover:bg-[#EFA765]/80 transition-colors duration-300 rounded-full">
                View Order Details
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );

  } catch (error: any) {
    // Crucial: Next.js redirect() throws a specific error that must be re-thrown
    if (error && typeof error === 'object' && error.digest && error.digest.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    console.error("Payment Success Processor Error:", error);
    await Order.findOneAndUpdate({ orderId: orderId }, { orderStatus: 'canceled', stripeSessionId: sessionId });
    redirect(`/payment-cancel`);
  }
}

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
  // Next.js 15 requires awaiting searchParams
  const resolvedSearchParams = await searchParams;
  const sessionId = resolvedSearchParams.session_id;
  const orderId = resolvedSearchParams.order_id;

  if (typeof sessionId !== 'string' || typeof orderId !== 'string') {
    redirect('/');
  }

  return (
    <Suspense
      fallback={
        <div className="flex flex-col justify-center items-center min-h-screen bg-[#141F2D] p-6 text-[#EFA765] font-[Varela Round]">
          <div className="bg-[#1D2B3F] p-10 rounded-3xl shadow-2xl max-w-md mx-auto text-center border border-[#EFA765]/20">
            <div className="text-7xl mb-6 text-[#EFA765] animate-pulse">
              <Loader2 className="h-20 w-20 animate-spin mx-auto" />
            </div>
            <h1 className="text-4xl font-extrabold text-white font-[Yeseve One]">Verifying Payment...</h1>
            <p className="text-white text-opacity-80 mt-3 text-lg">Please do not close this window.</p>
          </div>
        </div>
      }
    >
      <PaymentDetailsProcessor sessionId={sessionId} orderId={orderId} />
    </Suspense>
  );
}