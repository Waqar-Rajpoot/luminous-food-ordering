// // app/api/categories/[id]/route.js
// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/dbConnect";
// import Category from "@/models/Category.model";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/options";

// // GET a single category by ID (less common but good for completeness)
// export async function GET(req, { params }) {
//   await dbConnect();
//   const session = await getServerSession(authOptions);
//     if (!session || session.user?.role !== 'admin') {
//       return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
//     }
//   const { id } = await params;

//   try {
//     const category = await Category.findById(id);
//     if (!category) {
//       return NextResponse.json(
//         { success: false, message: "Category not found." },
//         { status: 404 }
//       );
//     }
//     return NextResponse.json(
//       { success: true, data: category },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error fetching category:", error);
//     return NextResponse.json(
//       { success: false, message: error.message || "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// // UPDATE a category by ID
// export async function PUT(req, { params }) {
//   await dbConnect();
//   const session = await getServerSession(authOptions);
//     if (!session || session.user?.role !== 'admin') {
//       return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
//     }
//   const { id } = await params;

//   try {
//     const body = await req.json();
//     const category = await Category.findByIdAndUpdate(id, body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!category) {
//       return NextResponse.json(
//         { success: false, message: "Category not found." },
//         { status: 404 }
//       );
//     }
//     return NextResponse.json(
//       { success: true, data: category },
//       { status: 200 }
//     );
//   } catch (error) {
//     if (error.code === 11000) {
//       return NextResponse.json(
//         { success: false, message: "Category with this name already exists." },
//         { status: 409 }
//       );
//     }
//     if (error.name === "ValidationError") {
//       const messages = Object.values(error.errors).map((val) => val.message);
//       return NextResponse.json(
//         { success: false, message: messages.join(", ") },
//         { status: 400 }
//       );
//     }
//     console.error("Error updating category:", error);
//     return NextResponse.json(
//       { success: false, message: error.message || "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// // DELETE a category by ID
// export async function DELETE(req, { params }) {
//   await dbConnect();
//   const session = await getServerSession(authOptions);
//     if (!session || session.user?.role !== 'admin') {
//       return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
//     }
//   const { id } = await params;

//   try {
//     const deletedCategory = await Category.deleteOne({ _id: id });

//     if (deletedCategory.deletedCount === 0) {
//       return NextResponse.json(
//         { success: false, message: "Category not found." },
//         { status: 404 }
//       );
//     }
//     return NextResponse.json({ success: true, data: {} }, { status: 200 });
//   } catch (error) {
//     console.error("Error deleting category:", error);
//     return NextResponse.json(
//       { success: false, message: error.message || "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }





// app/api/categories/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET a single category by ID
export async function GET(req: NextRequest, { params }: RouteParams) {
  await dbConnect();
  
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  // Await the params to get the id
  const { id } = await params;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, data: category },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// UPDATE a category by ID
export async function PUT(req: NextRequest, { params }: RouteParams) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body: any = await req.json();
    
    // Prevent accidental ID modification in the body
    if (body._id) delete body._id;

    const category = await Category.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, data: category },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Category with this name already exists." },
        { status: 409 }
      );
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val: any) => val.message);
      return NextResponse.json(
        { success: false, message: messages.join(", ") },
        { status: 400 }
      );
    }
    console.error("Error updating category:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE a category by ID
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const deletedCategory = await Category.deleteOne({ _id: id });

    if (deletedCategory.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Category not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}