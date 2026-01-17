// // File: app/api/users/[id]/route.ts

// import dbConnect from "@/lib/dbConnect"; // Your database connection utility
// import UserModel from "@/models/User.model";    // Your Mongoose User model
// import { NextRequest, NextResponse } from "next/server";
// import { z } from "zod";

// // Zod schema for validating the incoming role update request
// const RoleUpdateSchema = z.object({
//   role: z.enum(["admin", "manager", "staff", "user"]),
// });


// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const userId = await params.id;
//   await dbConnect();

//   try {
//     const body = await request.json();

//     // Validate the incoming role using Zod
//     const validationResult = RoleUpdateSchema.safeParse(body);
//     if (!validationResult.success) {
//       return NextResponse.json(
//         { message: "Invalid role provided. Must be one of: admin, manager, staff, user.", success: false },
//         { status: 400 }
//       );
//     }

//     const { role } = validationResult.data;

//     // Find the user by ID and update their role
//     const updatedUser = await UserModel.findByIdAndUpdate(
//       userId,
//       { role }, // The field to update
//       { new: true } // Option to return the document after the update
//     );

//     if (!updatedUser) {
//       return NextResponse.json(
//         { message: "User not found.", success: false },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       {
//         message: "User role updated successfully.",
//         success: true,
//         user: updatedUser,
//       },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error("Error updating user role:", error);
//     return NextResponse.json(
//       { message: "An internal server error occurred.", success: false },
//       { status: 500 }
//     );
//   }
// }


// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const userId = await params.id;
//   await dbConnect();

//   try {
//     // Find the user by ID and delete them
//     const deletedUser = await UserModel.findByIdAndDelete(userId);

//     if (!deletedUser) {
//       // If no user was found with that ID
//       return NextResponse.json(
//         { message: "User not found.", success: false },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { message: "User deleted successfully.", success: true },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error("Error deleting user:", error);
//     return NextResponse.json(
//       { message: "An internal server error occurred.", success: false },
//       { status: 500 }
//     );
//   }
// }





// File: app/api/users/[id]/route.ts

import dbConnect from "@/lib/dbConnect"; 
import UserModel from "@/models/User.model"; 
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Zod schema for validating the incoming role update request
const RoleUpdateSchema = z.object({
  role: z.enum(["admin", "manager", "staff", "user"]),
});

// Define the context interface for Next.js 15
interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  // Await the params promise to extract the id
  const { id: userId } = await params;
  await dbConnect();

  try {
    const body = await request.json();

    // Validate the incoming role using Zod
    const validationResult = RoleUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Invalid role provided. Must be one of: admin, manager, staff, user.", success: false },
        { status: 400 }
      );
    }

    const { role } = validationResult.data;

    // Find the user by ID and update their role
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { role }, 
      { new: true } 
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found.", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "User role updated successfully.",
        success: true,
        user: updatedUser,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { message: error.message || "An internal server error occurred.", success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  // Await the params promise to extract the id
  const { id: userId } = await params;
  await dbConnect();

  try {
    // Find the user by ID and delete them
    const deletedUser = await UserModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json(
        { message: "User not found.", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "User deleted successfully.", success: true },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: error.message || "An internal server error occurred.", success: false },
      { status: 500 }
    );
  }
}