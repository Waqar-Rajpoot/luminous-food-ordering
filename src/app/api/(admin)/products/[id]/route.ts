// // app/api/products/[id]/route.js
// import { NextRequest, NextResponse } from "next/server";
// import dbConnect from "@/lib/dbConnect";
// import Product from "@/models/Product.model";

// // GET a single product by ID
// export async function GET( { params }: { params: { id: string } }) {
//   await dbConnect();
//   const { id } = await params;

//   try {
//     const product = await Product.findById(id);
//     if (!product) {
//       return NextResponse.json(
//         { success: false, message: "Product not found." },
//         { status: 404 }
//       );
//     }
//     return NextResponse.json({ success: true, data: product }, { status: 200 });
//   } catch (error: any) {
//     console.error("Error fetching product:", error);
//     return NextResponse.json(
//       { success: false, message: error.message || "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// // UPDATE a product by ID
// export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
//   await dbConnect();
//   const { id } = await params;

//   try {
//     const body = await req.json();
//     const product = await Product.findByIdAndUpdate(id, body, {
//       new: true, // Return the updated document
//       runValidators: true, // Run schema validators on update
//     });

//     if (!product) {
//       return NextResponse.json(
//         { success: false, message: "Product not found." },
//         { status: 404 }
//       );
//     }
//     return NextResponse.json({ success: true, data: product }, { status: 200 });
//   } catch (error) {
//     if (error.name === "ValidationError") {
//       const messages = Object.values(error.errors).map((val) => val.message);
//       return NextResponse.json(
//         { success: false, message: messages.join(", ") },
//         { status: 400 }
//       );
//     }
//     console.error("Error updating product:", error);
//     return NextResponse.json(
//       { success: false, message: error.message || "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// // DELETE a product by ID
// export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
//   await dbConnect();
//   const { id } = await params;

//   try {
//     const deletedProduct = await Product.deleteOne({ _id: id });

//     if (deletedProduct.deletedCount === 0) {
//       return NextResponse.json(
//         { success: false, message: "Product not found." },
//         { status: 404 }
//       );
//     }
//     return NextResponse.json({ success: true, data: {} }, { status: 200 });
//   } catch (error) {
//     console.error("Error deleting product:", error);
//     return NextResponse.json(
//       { success: false, message: error.message || "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }







// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product.model";

// Define the context interface for Next.js 15
interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET a single product by ID
export async function GET(req: NextRequest, { params }: RouteContext) {
  await dbConnect();
  
  // Await params before accessing id
  const { id } = await params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// UPDATE a product by ID
export async function PUT(req: NextRequest, { params }: RouteContext) {
  await dbConnect();
  
  const { id } = await params;

  try {
    const body: any = await req.json();

    // Ensure we don't accidentally update the _id field
    if (body._id) delete body._id;

    const product = await Product.findByIdAndUpdate(id, body, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators on update
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return NextResponse.json(
        { success: false, message: messages.join(", ") },
        { status: 400 }
      );
    }
    console.error("Error updating product:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE a product by ID
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  await dbConnect();
  
  const { id } = await params;

  try {
    const deletedProduct = await Product.deleteOne({ _id: id });

    if (deletedProduct.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}