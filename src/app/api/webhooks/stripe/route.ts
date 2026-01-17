import { NextResponse, NextRequest } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order.model';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-08-27.basil", 
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
      return NextResponse.json({ message: "Order ID not found." }, { status: 400 });
    }

    try {
      const order = await Order.findOne({ orderId });

      if (order && order.orderStatus === 'pending') {
        order.orderStatus = 'paid';
        order.finalAmount = session.amount_total ? session.amount_total / 100 : order.finalAmount;
        await order.save();
        console.log(`WEBHOOK: Order ${orderId} marked as paid.`);
      }

      return NextResponse.json({ received: true });
    } catch (err: any) {
      console.error("Webhook processing error:", err);
      return NextResponse.json({ message: "Internal server error." }, { status: 500 });
    }
  }

  return NextResponse.json({ message: `Acknowledged: ${event.type}` }, { status: 200 });
}