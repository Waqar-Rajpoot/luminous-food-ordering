// // app/api/categories/route.js
// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/dbConnect";
// import Category from "@/models/Category.model";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../../auth/[...nextauth]/options";

// // GET all categories
// export async function GET() {
//   await dbConnect();
//   const session = await getServerSession(authOptions);
//     if (!session || session.user?.role !== 'admin') {
//       return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
//     }

//   try {
//     const categories = await Category.find({});
//     return NextResponse.json(
//       { success: true, data: categories },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//     return NextResponse.json(
//       { success: false, message: error.message || "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// // POST a new category
// export async function POST(req) {
//   await dbConnect();

//   const session = await getServerSession(authOptions);
//     if (!session || session.user?.role !== 'admin') {
//       return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
//     }

//   try {
//     const body = await req.json();
//     console.log("Request body:", body);
//     const category = await Category.create(body);
//     return NextResponse.json(
//       { success: true, data: category },
//       { status: 201 }
//     );
//   } catch (error) {
//     if (error.code === 11000) {
//     console.log("Full Duplicate Error Details:", error.keyValue); // This shows the exact field/value causing the clash
    
//     // Get the field name that caused the error
//     const field = Object.keys(error.keyValue)[0];
//     return NextResponse.json(
//       { success: false, message: `The ${field} "${error.keyValue[field]}" is already in use.` },
//       { status: 409 }
//     );
//   }
//     if (error.name === "ValidationError") {
//       const messages = Object.values(error.errors).map((val) => val.message);
//       return NextResponse.json(
//         { success: false, message: messages.join(", ") },
//         { status: 400 }
//       );
//     }
//     console.error("Error saving category:", error);
//     return NextResponse.json(
//       { success: false, message: error.message || "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }







// app/api/categories/route.ts
import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

// GET all categories
export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const categories = await Category.find({});
    return NextResponse.json(
      { success: true, data: categories },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST a new category
export async function POST(req: NextRequest) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body: any = await req.json();
    
    // FIX: Remove the clashing _id from the body to let MongoDB generate a new one
    if (body._id) {
      delete body._id;
    }

    console.log("Request body after cleanup:", body);
    
    const category = await Category.create(body);
    return NextResponse.json(
      { success: true, data: category },
      { status: 201 }
    );
  } catch (error: any) {
    // Handle MongoDB Duplicate Key Error
    if (error.code === 11000) {
      console.log("Full Duplicate Error Details:", error.keyValue);
      
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];
      
      return NextResponse.json(
        { success: false, message: `The ${field} "${value}" is already in use.` },
        { status: 409 }
      );
    }

    // Handle Mongoose Validation Error
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return NextResponse.json(
        { success: false, message: messages.join(", ") },
        { status: 400 }
      );
    }

    console.error("Error saving category:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}