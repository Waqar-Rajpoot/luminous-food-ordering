// // app/api/reviews/route.ts
// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/dbConnect';
// import ReviewModel, { IReview } from '@/models/Review.model'; // Import IReview
// import { reviewSchema } from '@/schemas/reviewSchema';
// import { z } from 'zod';
// interface SuccessResponse {
//   success: boolean;
//   message: string;
//   review?: IReview; // Use IReview for specific review
//   reviews?: IReview[]; // For multiple reviews
// }

// interface ErrorResponse {
//   message?: string;
//   success?: boolean;
// }

// export async function POST(request: Request) {
//   await dbConnect();

//   try {
//     const body = await request.json();

//     const validatedData = reviewSchema.parse(body);

//     const newReview = await ReviewModel.create(validatedData);

//     return NextResponse.json<SuccessResponse>({
//       success: true,
//       message: 'Thank you for your review! It will be published after moderation.',
//       review: newReview,
//     }, { status: 201 });

//   } catch (error: any) {
//     if (error instanceof z.ZodError) {
//       const errorMessage = error.errors.map(err => err.message).join(', ');
//       return NextResponse.json<ErrorResponse>({
//         success: false,
//         message: `Validation error: ${errorMessage}`,
//       }, { status: 400 });
//     }

//     console.error("Error submitting review:", error);
//     return NextResponse.json<ErrorResponse>({
//       success: false,
//       message: 'Internal server error. Could not submit review.',
//     }, { status: 500 });
//   }
// }

// // --- GET (Fetch all reviews for admin panel) ---
// export async function GET() {
//   await dbConnect();

//   try {
//     const reviews = await ReviewModel.find({}).sort({ createdAt: -1 }); // Sort by newest first
//     return NextResponse.json<SuccessResponse>({
//       success: true,
//       message: 'Reviews fetched successfully.',
//       reviews,
//     }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching reviews:", error);
//     return NextResponse.json<ErrorResponse>({
//       success: false,
//       message: 'Internal server error. Could not fetch reviews.',
//     }, { status: 500 });
//   }
// }





// import { NextRequest, NextResponse } from "next/server";
// import dbConnect from "@/lib/dbConnect";
// import ReviewModel from "@/models/Review.model";
// import Product from "@/models/Product.model";
// import mongoose from "mongoose";
// import { reviewSchema } from "@/schemas/reviewSchema";
// import { z } from "zod";

// // --- POST: Customer submits a review ---
// export async function POST(request: NextRequest) {
//   await dbConnect();

//   try {
//     const body = await request.json();
//     const validatedData = reviewSchema.parse(body);

//     const newReview = await ReviewModel.create(validatedData);

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Thank you! Your review will be published after moderation.",
//         review: newReview,
//       },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     if (error.code === 11000) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "You already reviewed this item for this order.",
//         },
//         { status: 400 }
//       );
//     }
//     if (error instanceof z.ZodError) {
//       const errorMessage = error.issues.map((err) => err.message).join(", ");

//       return NextResponse.json(
//         {
//           success: false,
//           message: `Validation error: ${errorMessage}`,
//         },
//         { status: 400 }
//       );
//     }
//     return NextResponse.json(
//       { success: false, message: "Internal server error." },
//       { status: 500 }
//     );
//   }
// }

// // --- GET: Admin fetches all reviews ---
// export async function GET() {
//   await dbConnect();
//   try {
//     const reviews = await ReviewModel.find({}).sort({ createdAt: -1 });
//     return NextResponse.json({ success: true, reviews }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching reviews:", error);
//     return NextResponse.json(
//       { success: false, message: "Could not fetch reviews." },
//       { status: 500 }
//     );
//   }
// }

// // --- PATCH: Admin Approves a Review & Updates Product Stats ---
// export async function PATCH(request: NextRequest) {
//   await dbConnect();

//   try {
//     const { reviewId, isApproved } = await request.json();

//     // 1. Update the review approval status
//     const updatedReview = await ReviewModel.findByIdAndUpdate(
//       reviewId,
//       { isApproved },
//       { new: true }
//     );

//     if (!updatedReview) {
//       return NextResponse.json(
//         { success: false, message: "Review not found" },
//         { status: 404 }
//       );
//     }

//     // 2. If approved, recalculate Product averageRating and reviewCount
//     if (isApproved) {
//       const productId = updatedReview.productId;

//       const stats = await ReviewModel.aggregate([
//         {
//           $match: {
//             productId: new mongoose.Types.ObjectId(productId as any),
//             isApproved: true,
//           },
//         },
//         {
//           $group: {
//             _id: "$productId",
//             avgRating: { $avg: "$rating" },
//             totalReviews: { $sum: 1 },
//           },
//         },
//       ]);

//       if (stats.length > 0) {
//         await Product.findByIdAndUpdate(productId, {
//           averageRating: parseFloat(stats[0].avgRating.toFixed(1)),
//           reviewCount: stats[0].totalReviews,
//         });
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       message: isApproved
//         ? "Review approved and product stats updated!"
//         : "Review hidden.",
//     });
//   } catch (error: any) {
//     console.error("Error updating review:", error);
//     return NextResponse.json(
//       { success: false, message: "Internal server error." },
//       { status: 500 }
//     );
//   }
// }





import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ReviewModel from "@/models/Review.model";
import Product from "@/models/Product.model";
import { reviewSchema } from "@/schemas/reviewSchema";
import { z } from "zod";

// // --- POST: Customer submits a review ---
// export async function POST(request: NextRequest) {
  
//   await dbConnect();

//   try {
//     const body = await request.json();
//     const validatedData = reviewSchema.parse(body);

//     // 1. Create the new review in the database
//     const newReview = await ReviewModel.create(validatedData);

//     // 2. IMMEDIATE UPDATE: Update Product Stats (Count and Average)
//     const { productId, rating } = validatedData;
//     const cleanProductId = productId.toString();

//     console.log("Updating stats for product:", productId, "with new rating:", rating);

//     const reviewProduct = await Product.findByIdAndUpdate(cleanProductId, [
//       {
//         $set: {
//           averageRating: {
//             $round: [
//               {
//                 $divide: [
//                   {
//                     $add: [
//                       { $multiply: ["$averageRating", "$reviewCount"] },
//                       rating
//                     ]
//                   },
//                   { $add: ["$reviewCount", 1] }
//                 ]
//               },
//               1 // Rounding to 1 decimal place (e.g., 4.7)
//             ]
//           },
//           reviewCount: { $add: ["$reviewCount", 1] }
//         }
//       }
//     ]);

//     console.log("Product stats updated for product:", reviewProduct);

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Thank you! Your review has been submitted and stats updated.",
//         review: newReview,
//       },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     if (error.code === 11000) {
//       return NextResponse.json(
//         { success: false, message: "You already reviewed this item." },
//         { status: 400 }
//       );
//     }
//     if (error instanceof z.ZodError) {
//       const errorMessage = error.issues.map((err) => err.message).join(", ");
//       return NextResponse.json(
//         { success: false, message: `Validation error: ${errorMessage}` },
//         { status: 400 }
//       );
//     }
//     return NextResponse.json(
//       { success: false, message: "Internal server error." },
//       { status: 500 }
//     );
//   }
// }






export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const body = await request.json();
    const validatedData = reviewSchema.parse(body);

    // 1. Create the new review
    const newReview = await ReviewModel.create(validatedData);

    // 2. Update Product Stats
    const { productId, rating } = validatedData;
    
    // Fetch the current product first to get current stats
    const product = await Product.findById(productId);
    
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    // Calculate new stats in JavaScript (Safer than complex pipelines)
    const currentCount = product.reviewCount || 0;
    const currentAvg = product.averageRating || 0;
    
    const newCount = currentCount + 1;
    // Formula: ((OldAvg * OldCount) + NewRating) / NewCount
    const newAvg = parseFloat(((currentAvg * currentCount + rating) / newCount).toFixed(1));

    // Update the product using standard Mongoose update
    await Product.findByIdAndUpdate(productId, {
      $set: { 
        averageRating: newAvg,
        reviewCount: newCount 
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: "Review submitted successfully.",
        review: newReview,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("FINAL ERROR LOG:", error);
    
    if (error.code === 11000) {
      return NextResponse.json({ success: false, message: "Already reviewed." }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}


// --- GET: Admin fetches all reviews ---
export async function GET() {
  await dbConnect();
  try {
    const reviews = await ReviewModel.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, reviews }, { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ success: false, message: "Could not fetch reviews." }, { status: 500 });
  }
}

// --- PATCH: Admin Approves a Review ---
// (Note: Stats are already updated in POST, so this just handles visibility/moderation)
export async function PATCH(request: NextRequest) {
  await dbConnect();
  try {
    const { reviewId, isApproved } = await request.json();

    const updatedReview = await ReviewModel.findByIdAndUpdate(
      reviewId,
      { isApproved },
      { new: true }
    );

    if (!updatedReview) {
      return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: isApproved ? "Review published!" : "Review hidden.",
    });
  } catch (error: any) {
    console.error("Error updating review:", error);
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 });
  }
}