import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ReviewModel from "@/models/Review.model";
import ProductModel from "@/models/Product.model";
import Order from "@/models/Order.model";


export async function GET() {
    try {
        const session = await getServerSession(authOptions);
            if (!session || session.user?.role !== 'admin') {
              return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
            }

            await dbConnect()

            const reviews = await ReviewModel.countDocuments();
            const products = await ProductModel.countDocuments();
            const orders = await Order.countDocuments();

            // console.log("Reviews:", reviews,"Products: ", products,"Bookings:", bookings,"Orders:", orders)

            return NextResponse.json({success: true, data: {reviews, products, orders}}, {status: 200});

    } catch (error: any) {
        return NextResponse.json({success: false, message: error.message}, {status: 500})
    }
}