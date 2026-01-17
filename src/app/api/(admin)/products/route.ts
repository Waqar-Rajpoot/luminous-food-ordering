// // app/api/products/route.js
// import { NextRequest, NextResponse } from "next/server";
// import dbConnect from "@/lib/dbConnect";
// import Product from "@/models/Product.model";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../../auth/[...nextauth]/options";

// // GET all products
// export async function GET() {
//   await dbConnect();

//    const session = await getServerSession(authOptions);
//     if (!session || session.user?.role !== 'admin') {
//       return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
//     }

//   try {
//     const products = await Product.find({});
//     return NextResponse.json(
//       { success: true, data: products },
//       { status: 200 }
//     );
//   } catch (error:any) {
//     console.error("Error fetching products:", error);
//     return NextResponse.json(
//       { success: false, message: error.message || "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// // POST a new product
// export async function POST(req: NextRequest) {
//   await dbConnect();
//    const session = await getServerSession(authOptions);
//     if (!session || session.user?.role !== 'admin') {
//       return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
//     }

//   try {
//     const body = await req.json();


//     console.log("Request body:", body);

//     const product = await Product.create(body);
//     return NextResponse.json({ success: true, data: product }, { status: 201 });
//   } catch (error) {
//     if (error.name === "ValidationError") {
//       const messages = Object.values(error.errors).map((val) => val.message);
//       return NextResponse.json(
//         { success: false, message: messages.join(", ") },
//         { status: 400 }
//       );
//     }
//     console.error("Error saving product:", error);
//     return NextResponse.json(
//       { success: false, message: error.message || "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }







// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

// GET all products
export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const products = await Product.find({});
    return NextResponse.json(
      { success: true, data: products },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST a new product
export async function POST(req: NextRequest) {
  await dbConnect();
  
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body: any = await req.json();

    console.log("Creating product with body:", body);

    const product = await Product.create(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return NextResponse.json(
        { success: false, message: messages.join(", ") },
        { status: 400 }
      );
    }

    // Handle MongoDB Duplicate Key Errors (e.g., duplicate product name)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return NextResponse.json(
        { success: false, message: `Product with this ${field} already exists.` },
        { status: 409 }
      );
    }

    console.error("Error saving product:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}