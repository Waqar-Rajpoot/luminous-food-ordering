// // src/app/api/reviews/[reviewId]/route.ts
// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/dbConnect';
// import ReviewModel, { IReview } from '@/models/Review.model';
// import { z } from 'zod'; // Import z for ZodError handling
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/options';

// // Interfaces for consistent responses
// interface SuccessResponse {
//   success: boolean;
//   message: string;
//   review?: IReview;
// }

// interface ErrorResponse {
//   message?: string;
//   success?: boolean;
// }

// // --- PATCH (Approve/Reject a review) ---
// export async function PATCH(request: Request, { params }: { params: { reviewId: string } }) {
//   await dbConnect();
//    const session = await getServerSession(authOptions);
//     if (!session || session.user?.role !== 'admin') {
//       return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
//     }
//   const { reviewId } = await params;

//   // Implement authentication/authorization check here (e.g., admin session)

//   try {
//     const body = await request.json();
//     const { isApproved } = z.object({ isApproved: z.boolean() }).parse(body); // Validate incoming status

//     const updatedReview = await ReviewModel.findByIdAndUpdate(
//       reviewId,
//       { isApproved },
//       { new: true, runValidators: true } // Return the updated document, run schema validators
//     );

//     if (!updatedReview) {
//       return NextResponse.json<ErrorResponse>({
//         success: false,
//         message: 'Review not found.',
//       }, { status: 404 });
//     }

//     return NextResponse.json<SuccessResponse>({
//       success: true,
//       message: `Review ${isApproved ? 'approved' : 'unapproved'} successfully.`,
//       review: updatedReview,
//     }, { status: 200 });

//   } catch (error: any) {
//     if (error instanceof z.ZodError) {
//       return NextResponse.json<ErrorResponse>({
//         success: false,
//         message: `Validation error: ${error.errors[0].message}`,
//       }, { status: 400 });
//     }
//     console.error("Error updating review:", error);
//     return NextResponse.json<ErrorResponse>({
//       success: false,
//       message: 'Internal server error. Could not update review.',
//     }, { status: 500 });
//   }
// }

// // --- DELETE (Delete a review) ---
// export async function DELETE(request: Request, { params }: { params: { reviewId: string } }) {
//   await dbConnect();

//    const session = await getServerSession(authOptions);
//     if (!session || session.user?.role !== 'admin') {
//       return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
//     }

//   const { reviewId } = await params;

//   // Implement authentication/authorization check here (e.g., admin session)

//   try {
//     const deletedReview = await ReviewModel.findByIdAndDelete(reviewId);

//     if (!deletedReview) {
//       return NextResponse.json<ErrorResponse>({
//         success: false,
//         message: 'Review not found.',
//       }, { status: 404 });
//     }

//     return NextResponse.json<SuccessResponse>({
//       success: true,
//       message: 'Review deleted successfully.',
//     }, { status: 200 });

//   } catch (error) {
//     console.error("Error deleting review:", error);
//     return NextResponse.json<ErrorResponse>({
//       success: false,
//       message: 'Internal server error. Could not delete review.',
//     }, { status: 500 });
//   }
// }




// src/app/api/reviews/[reviewId]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ReviewModel, { IReview } from '@/models/Review.model';
import { z } from 'zod'; 
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

// Interfaces for consistent responses
interface SuccessResponse {
  success: boolean;
  message: string;
  review?: IReview;
}

interface ErrorResponse {
  message?: string;
  success?: boolean;
}

// Define the context interface for Next.js 15
interface RouteContext {
  params: Promise<{ reviewId: string }>;
}

// --- PATCH (Approve/Reject a review) ---
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  await dbConnect();
  
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  // Await the params promise in Next.js 15
  const { reviewId } = await params;

  try {
    const body = await request.json();
    const { isApproved } = z.object({ isApproved: z.boolean() }).parse(body);

    const updatedReview = await ReviewModel.findByIdAndUpdate(
      reviewId,
      { isApproved },
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return NextResponse.json<ErrorResponse>({
        success: false,
        message: 'Review not found.',
      }, { status: 404 });
    }

    return NextResponse.json<SuccessResponse>({
      success: true,
      message: `Review ${isApproved ? 'approved' : 'unapproved'} successfully.`,
      review: updatedReview as IReview, // Explicit cast to help TS
    }, { status: 200 });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json<ErrorResponse>({
        success: false,
        message: `Validation error: ${error}`,
      }, { status: 400 });
    }
    console.error("Error updating review:", error);
    return NextResponse.json<ErrorResponse>({
      success: false,
      message: 'Internal server error. Could not update review.',
    }, { status: 500 });
  }
}

// --- DELETE (Delete a review) ---
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  // Await the params promise
  const { reviewId } = await params;

  try {
    const deletedReview = await ReviewModel.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return NextResponse.json<ErrorResponse>({
        success: false,
        message: 'Review not found.',
      }, { status: 404 });
    }

    return NextResponse.json<SuccessResponse>({
      success: true,
      message: 'Review deleted successfully.',
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error deleting review:", error);
    return NextResponse.json<ErrorResponse>({
      success: false,
      message: 'Internal server error. Could not delete review.',
    }, { status: 500 });
  }
}