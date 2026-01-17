// // src/app/api/contact/[messageId]/route.ts
// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/dbConnect';
// import ContactMessageModel, { IContactMessage } from '@/models/ContactMessage.model';
// import { z } from 'zod';

// // Interfaces for consistent responses
// interface SuccessResponse {
//   success: boolean;
//   message: string;
//   contactMessage?: IContactMessage;
// }

// interface ErrorResponse {
//   message?: string;
//   success?: boolean;
// }

// // --- PATCH (Mark a message as read/unread) ---
// export async function PATCH(request: Request, { params }: { params: { messageId: string } }) {
//   await dbConnect();
//   const { messageId } = await params;

//   // Implement authentication/authorization check here (e.g., admin session)

//   try {
//     const body = await request.json();
//     const { isRead } = z.object({ isRead: z.boolean() }).parse(body); // Validate incoming status

//     const updatedMessage = await ContactMessageModel.findByIdAndUpdate(
//       messageId,
//       { isRead },
//       { new: true, runValidators: true } // Return the updated document, run schema validators
//     );

//     if (!updatedMessage) {
//       return NextResponse.json<ErrorResponse>({
//         success: false,
//         message: 'Contact message not found.',
//       }, { status: 404 });
//     }

//     return NextResponse.json<SuccessResponse>({
//       success: true,
//       message: `Message marked as ${isRead ? 'read' : 'unread'}.`,
//       contactMessage: updatedMessage,
//     }, { status: 200 });

//   } catch (error: any) {
//     if (error instanceof z.ZodError) {
//       return NextResponse.json<ErrorResponse>({
//         success: false,
//         message: `Validation error: ${error}`,
//       }, { status: 400 });
//     }
//     console.error("Error updating contact message status:", error);
//     return NextResponse.json<ErrorResponse>({
//       success: false,
//       message: 'Internal server error. Could not update message status.',
//     }, { status: 500 });
//   }
// }

// // --- DELETE (Delete a message) ---
// export async function DELETE(request: Request, { params }: { params: { messageId: string } }) {
//   await dbConnect();
//   const { messageId } = await params;

//   // Implement authentication/authorization check here (e.g., admin session)

//   try {
//     const deletedMessage = await ContactMessageModel.findByIdAndDelete(messageId);

//     if (!deletedMessage) {
//       return NextResponse.json<ErrorResponse>({
//         success: false,
//         message: 'Contact message not found.',
//       }, { status: 404 });
//     }

//     return NextResponse.json<SuccessResponse>({
//       success: true,
//       message: 'Contact message deleted successfully.',
//     }, { status: 200 });

//   } catch (error) {
//     console.error("Error deleting contact message:", error);
//     return NextResponse.json<ErrorResponse>({
//       success: false,
//       message: 'Internal server error. Could not delete message.',
//     }, { status: 500 });
//   }
// }







// src/app/api/contact/[messageId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ContactMessageModel, { IContactMessage } from '@/models/ContactMessage.model';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

// Interfaces for consistent responses
interface SuccessResponse {
  success: boolean;
  message: string;
  contactMessage?: IContactMessage;
}

interface ErrorResponse {
  message?: string;
  success?: boolean;
}

// Define the context interface for Next.js 15
interface RouteContext {
  params: Promise<{ messageId: string }>;
}

// --- PATCH (Mark a message as read/unread) ---
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  await dbConnect();
  
  // Security Check
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  // Next.js 15: Await the params to get messageId
  const { messageId } = await params;

  try {
    const body = await request.json();
    const { isRead } = z.object({ isRead: z.boolean() }).parse(body);

    const updatedMessage = await ContactMessageModel.findByIdAndUpdate(
      messageId,
      { isRead },
      { new: true, runValidators: true }
    );

    if (!updatedMessage) {
      return NextResponse.json<ErrorResponse>({
        success: false,
        message: 'Contact message not found.',
      }, { status: 404 });
    }

    return NextResponse.json<SuccessResponse>({
      success: true,
      message: `Message marked as ${isRead ? 'read' : 'unread'}.`,
      contactMessage: updatedMessage as IContactMessage,
    }, { status: 200 });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json<ErrorResponse>({
        success: false,
        message: `Validation error: ${error}`,
      }, { status: 400 });
    }
    console.error("Error updating contact message status:", error);
    return NextResponse.json<ErrorResponse>({
      success: false,
      message: 'Internal server error. Could not update message status.',
    }, { status: 500 });
  }
}

// --- DELETE (Delete a message) ---
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  await dbConnect();

  // Security Check
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  // Next.js 15: Await the params to get messageId
  const { messageId } = await params;

  try {
    const deletedMessage = await ContactMessageModel.findByIdAndDelete(messageId);

    if (!deletedMessage) {
      return NextResponse.json<ErrorResponse>({
        success: false,
        message: 'Contact message not found.',
      }, { status: 404 });
    }

    return NextResponse.json<SuccessResponse>({
      success: true,
      message: 'Contact message deleted successfully.',
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error deleting contact message:", error);
    return NextResponse.json<ErrorResponse>({
      success: false,
      message: 'Internal server error. Could not delete message.',
    }, { status: 500 });
  }
}