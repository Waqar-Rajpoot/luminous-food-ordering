import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import ReviewModel, { IReview } from "@/models/Review.model";
import { ErrorResponse } from "@/utils/ErrorResponse";

interface SuccessResponse {
  success: boolean;
  message: string;
  review?: IReview; // Use IReview for specific review
  reviews?: IReview[]; // For multiple reviews
}


export async function GET() {
  await dbConnect();

  try {
    const reviews = await ReviewModel.find({isApproved:true}).sort({ createdAt: -1 }); 
    return NextResponse.json<SuccessResponse>({
      success: true,
      message: 'Reviews fetched successfully.',
      reviews,
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json<ErrorResponse>({
      success: false,
      message: 'Internal server error. Could not fetch reviews.',
    }, { status: 500 });
  }
}