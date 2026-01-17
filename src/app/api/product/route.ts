import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/Product.model";
import { NextResponse } from "next/server";

// Main API route handler for GET requests
export async function GET() {
  try {
    await dbConnect();

    const products = await ProductModel.find({isAvailable: true}).lean();

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error },
      { status: 500 }
    );
  }
}