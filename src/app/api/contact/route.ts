import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ContactMessageModel, { IContactMessage } from '@/models/ContactMessage.model';
import { contactSchema } from '@/schemas/contactSchema';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

// Define localized interfaces for the response structure
interface SuccessResponse {
  success: boolean;
  message: string;
  contactMessage?: IContactMessage;
  contactMessages?: IContactMessage[];
}

interface ErrorResponse {
  success: boolean;
  message: string;
}

// --- POST (Public: Send a message) ---
export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const body = await request.json();
    
    // Safety: Remove _id if it was passed from the frontend
    if (body._id) delete body._id;

    // Validate incoming data with Zod
    const validatedData = contactSchema.parse(body);

    const newContactMessage = await ContactMessageModel.create({
      ...validatedData,
      isRead: false, // Ensure it's unread by default
    });

    return NextResponse.json<SuccessResponse>({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.',
      contactMessage: newContactMessage,
    }, { status: 201 });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.issues.map((err) => err.message).join(', ');
      return NextResponse.json<ErrorResponse>({
        success: false,
        message: `Validation error: ${errorMessage}`,
      }, { status: 400 });
    }

    console.error("Error sending contact message:", error);
    return NextResponse.json<ErrorResponse>({
      success: false,
      message: 'Internal server error. Could not send message.',
    }, { status: 500 });
  }
}

// --- GET (Protected: Fetch all messages for admin panel) ---
export async function GET() {
  await dbConnect();

  // Check for admin session
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const contactMessages = await ContactMessageModel.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json<SuccessResponse>({
      success: true,
      message: 'Contact messages fetched successfully.',
      contactMessages,
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching contact messages:", error);
    return NextResponse.json<ErrorResponse>({
      success: false,
      message: 'Internal server error. Could not fetch contact messages.',
    }, { status: 500 });
  }
}