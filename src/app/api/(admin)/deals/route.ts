import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Deal from "@/models/HotDeal.model";
import { dealSchema } from "@/schemas/hotDealFormSchema";


export async function GET() {
  try {
    await dbConnect();
    const deals = await Deal.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: deals });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const validation = dealSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation Failed",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Prepare data for Mongoose
    const dealData = {
      ...validation.data,
      // Ensure empty strings are treated as undefined so Mongoose 
      // doesn't try to save an invalid date string
      startDate: validation.data.startDate || undefined,
      endDate: validation.data.endDate || undefined,
    };

    const newDeal = await Deal.create(dealData);

    return NextResponse.json(
      { 
        success: true, 
        message: "Deal published successfully!", 
        data: newDeal 
      }, 
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Deal API Error:", error);
    return NextResponse.json(
      { 
        success: false,
        message: error.message || "Internal Server Error" 
      }, 
      { status: 500 }
    );
  }
}