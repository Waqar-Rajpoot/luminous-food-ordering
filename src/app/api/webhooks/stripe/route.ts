// import { NextResponse, NextRequest } from 'next/server';
// import Stripe from 'stripe';
// import dbConnect from '@/lib/dbConnect';
// import Order from '@/models/Order.model';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
//   apiVersion: "2025-12-15.clover", 
// });

// const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

// export async function POST(req: NextRequest) {
//   const buf = await req.text();
//   const signature = req.headers.get('stripe-signature');

//   let event: Stripe.Event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       buf,
//       signature || "",
//       stripeWebhookSecret
//     );
//   } catch (err: any) {
//     console.error(`Webhook signature verification failed:`, err.message);
//     return NextResponse.json({ message: 'Webhook signature verification failed.' }, { status: 400 });
//   }

//   await dbConnect();

//   if (event.type === 'checkout.session.completed') {
//     const session = event.data.object as Stripe.Checkout.Session;
//     const orderId = session.metadata?.orderId;
    
//     if (!orderId) {
//       return NextResponse.json({ message: "Order ID not found." }, { status: 400 });
//     }

//     try {
//       const order = await Order.findOne({ orderId });

//       if (order && order.orderStatus === 'pending') {
//         order.orderStatus = 'paid';
//         order.finalAmount = session.amount_total ? session.amount_total / 100 : order.finalAmount;
//         await order.save();
//         console.log(`WEBHOOK: Order ${orderId} marked as paid.`);
//       }

//       return NextResponse.json({ received: true });
//     } catch (err: any) {
//       console.error("Webhook processing error:", err);
//       return NextResponse.json({ message: "Internal server error." }, { status: 500 });
//     }
//   }

//   return NextResponse.json({ message: `Acknowledged: ${event.type}` }, { status: 200 });
// }






import { NextResponse, NextRequest } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order.model';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover" as any, 
});

const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  const buf = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      signature || "",
      stripeWebhookSecret
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed:`, err.message);
    return NextResponse.json({ message: 'Webhook signature verification failed.' }, { status: 400 });
  }

  await dbConnect();

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    
    if (!orderId) {
      return NextResponse.json({ message: "Order ID not found in metadata." }, { status: 400 });
    }

    try {
      // 1. Get the actual amount paid (in PKR)
      const amountPaid = session.amount_total ? session.amount_total / 100 : 0;
      
      // 2. Get the specific shipping amount chosen (0 or 50)
      const shippingAmount = session.total_details?.amount_shipping 
        ? session.total_details.amount_shipping / 100 
        : 0;

      // 3. Update the order using findOneAndUpdate to be more robust
      const updatedOrder = await Order.findOneAndUpdate(
        { orderId: orderId },
        { 
          $set: {
            orderStatus: 'paid',
            finalAmount: amountPaid,      // This will now be 650 (600 + 50)
            totalAmount: amountPaid,      // Reflects total paid in DB
            shippingCost: shippingAmount, // Save the 50 separately if your model has this field
            paidAt: new Date()
          }
        },
        { new: true } // Returns the updated document
      );

      if (updatedOrder) {
        console.log(`WEBHOOK SUCCESS: Order ${orderId} updated. Total: ${amountPaid}, Shipping: ${shippingAmount}`);
      } else {
        console.warn(`WEBHOOK WARNING: Order ${orderId} not found in database.`);
      }

      return NextResponse.json({ received: true });
    } catch (err: any) {
      console.error("Webhook processing error:", err);
      return NextResponse.json({ message: "Internal server error." }, { status: 500 });
    }
  }

  return NextResponse.json({ message: `Acknowledged: ${event.type}` }, { status: 200 });
}