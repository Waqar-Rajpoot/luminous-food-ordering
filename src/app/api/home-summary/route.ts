import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product.model";
import HotDeal from "@/models/HotDeal.model";
import Settings from "@/models/Settings.model"; 

export async function GET() {
  await dbConnect();

  try {
    // 1. Fetch the system settings
    const settings = await Settings.findOne().lean();
    
    const featuredLimit = settings?.featuredLimit || 8;

    // 3. Fetch Best Sellers limited by featuredLimit
    const bestSellers = await Product.find({ 
      isAvailable: true 
    })
    .sort({ salesCount: -1 })
    .limit(featuredLimit)
    .select("name price category imageSrc averageRating reviewCount salesCount description")
    .lean();

    // 4. Fetch Active Deals limited by featuredLimit
    const activeDeals = await HotDeal.find({
      isAvailable: true,
      endDate: { $gte: new Date() }
    })
    .limit(featuredLimit)
    .lean();

    if (!bestSellers.length && !activeDeals.length) {
      return NextResponse.json({
        success: false,
        message: "No products or deals found at the moment."
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        bestSellers: bestSellers.map(product => ({
          ...product,
          averageRating: product.averageRating || 0,
          reviewCount: product.reviewCount || 0
        })),
        activeDeals: activeDeals.map(deal => ({
          _id: deal._id,
          title: deal.title,
          description: deal.description,
          dealPrice: deal.dealPrice,
          originalPrice: deal.originalPrice,
          savings: (deal.originalPrice || 0) - (deal.dealPrice || 0),
          image: deal.image,
          items: deal.items,
          isAvailable: deal.isAvailable
        }))
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("Home Summary API Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "An error occurred while loading the home page data.",
      error: error.message 
    }, { status: 500 });
  }
}