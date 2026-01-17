import { NextResponse } from 'next/server';
import Order from '@/models/Order.model';
import dbConnect from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function GET() {
  try {
    // Connect to the database
    await dbConnect();
     const session = await getServerSession(authOptions);
      if (!session || session.user?.role !== 'admin') {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
      }
    
    // Fetch all orders, sorted by creation date in descending order
    const orders = await Order.find().sort({ createdAt: -1 });

    // Return the orders as a JSON response
    return NextResponse.json(orders);
  } catch (error) {
    console.error("API GET error:", error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
