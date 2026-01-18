// import { getServerSession } from "next-auth";
// import { authOptions } from "../../auth/[...nextauth]/options";
// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/dbConnect";
// import ReviewModel from "@/models/Review.model";
// import ProductModel from "@/models/Product.model";
// import Order from "@/models/Order.model";



// export async function GET() {
//     try {
//         const session = await getServerSession(authOptions);
//             if (!session || session.user?.role !== 'admin') {
//               return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
//             }

//             await dbConnect()

//             const reviews = await ReviewModel.countDocuments();
//             const products = await ProductModel.countDocuments();
//             const orders = await Order.countDocuments();

//             // console.log("Reviews:", reviews,"Products: ", products,"Bookings:", bookings,"Orders:", orders)

//             return NextResponse.json({success: true, data: {reviews, products, orders}}, {status: 200});

//     } catch (error: any) {
//         return NextResponse.json({success: false, message: error.message}, {status: 500})
//     }
// }




import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product.model";
import Order from "@/models/Order.model";
import User from "@/models/User.model";
import Review from "@/models/Review.model";
import Deal from "@/models/HotDeal.model";

export async function GET() {
  try {
    await dbConnect();

    // Parallel execution for high performance
    const [products, orders, users, reviews, deals] = await Promise.all([
      Product.find({}),
      Order.find({}),
      User.find({}),
      Review.find({}),
      Deal.find({ isAvailable: true })
    ]);

    // 1. Calculate Revenue (Only 'paid' orders)
    const totalRevenue = orders
      .filter(o => o.orderStatus === "paid")
      .reduce((acc, o) => acc + (o.finalAmount || 0), 0);

    // 2. Order Breakdown
    const canceledOrders = orders.filter(o => o.shippingProgress === "canceled").length;
    const pendingOrders = orders.filter(o => o.orderStatus === "pending").length;

    // 3. Product Stats
    const totalSalesCount = products.reduce((acc, p) => acc + (p.salesCount || 0), 0);
    const topPerformingProduct = products.sort((a, b) => b.salesCount - a.salesCount)[0]?.name || "N/A";

    // 4. Review Stats
    const avgStoreRating = reviews.length > 0 
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0";
    const pendingReviews = reviews.filter(r => !r.isApproved).length;

    // 5. Deal Stats
    const activeDeals = deals.length;

    return NextResponse.json({
      success: true,
      data: {
        counts: {
          users: users.length,
          products: products.length,
          orders: orders.length,
          reviews: reviews.length,
          deals: activeDeals
        },
        financials: {
          totalRevenue: totalRevenue.toFixed(2),
          avgOrderValue: orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : "0.00"
        },
        status: {
          canceled: canceledOrders,
          pending: pendingOrders,
          pendingReviews: pendingReviews
        },
        highlights: {
          topProduct: topPerformingProduct,
          storeRating: avgStoreRating,
          totalSales: totalSalesCount
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}