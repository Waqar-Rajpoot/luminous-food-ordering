import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect"; // Placeholder for your database connection
import UserModel from "@/models/User.model"; // Placeholder for your user model
import { hash } from "bcryptjs";

// Assume you have a separate model for storing verification codes
// or that the code is stored directly on the user model with an expiry timestamp.
// For demonstration, let's assume the user model has a `verifyCode` and `verifyCodeExpiry`.

export async function POST(request: Request) {
  await connectDB(); // Connect to your database

  try {
    const { username, code, newPassword } = await request.json();

    console.log("username, code, newPassword", username, code, newPassword);

    // 1. Find the user based on username and verification code
    const user = await UserModel.findOne({
      username,
    });

    console.log("user found for password reset", user);

    // 2. Validate the user and code
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid username or verification code.",
        },
        { status: 400 }
      );
    }

    // 3. Check if the code has expired (e.g., 10 minutes)
    // Here we're using a hypothetical `verifyCodeExpiry` field.
    const now: Date = new Date();
    if (!user.resetPasswordExpire || user.resetPasswordExpire < now) {
      return NextResponse.json(
        {
          success: false,
          message: "Verification code has expired. Please request a new one.",
        },
        { status: 400 }
      );
    }

    // 4. Hash the new password before saving it
    const hashedPassword = await hash(newPassword, 10);

    // 5. Update the user's password and clear the verification code fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // 6. Return a success response
    return NextResponse.json(
      {
        success: true,
        message: "Password has been successfully reset.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}
