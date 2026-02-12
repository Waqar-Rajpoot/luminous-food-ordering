import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import OrderModel from "@/models/Order.model";
import ContactModel from "@/models/ContactMessage.model"; 
import ReviewModel from "@/models/Review.model"; 
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { action, payload } = await req.json();
    const userEmail = session.user.email;

    switch (action) {
        case "UPDATE_PROFILE": {
        const { name, username } = payload;

        // Backend Validation: Ensure username is at least 3 chars
        if (!username || username.length < 3) {
          return NextResponse.json(
            { success: false, message: "Username must be at least 3 characters" },
            { status: 400 }
          );
        }

        // Backend Validation: Check if username is taken by ANOTHER user
        const existingUser = await UserModel.findOne({ 
          username, 
          email: { $ne: userEmail } // Exclude current user from the search
        });

        if (existingUser) {
          return NextResponse.json(
            { success: false, message: "Username already taken" },
            { status: 400 }
          );
        }

        const updatedUser = await UserModel.findOneAndUpdate(
          { email: userEmail },
          { $set: { name, username } },
          { new: true }
        );

        if (!updatedUser) {
          return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ 
          success: true, 
          message: "Profile updated successfully",
          user: { name: updatedUser.name, username: updatedUser.username }
        });
      }
      // 1. Password Update with Validation
      case "CHANGE_PASSWORD": {
        const user = await UserModel.findOne({ email: userEmail });
        if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

        const isMatch = await bcrypt.compare(payload.currentPassword, user.password);
        if (!isMatch) {
          return NextResponse.json({ success: false, message: "Current password is incorrect" }, { status: 400 });
        }

        user.password = await bcrypt.hash(payload.newPassword, 10);
        await user.save();
        return NextResponse.json({ success: true, message: "Password updated successfully" });
      }

      // 2. Toggle 2FA
      case "TOGGLE_2FA": {
        await UserModel.findOneAndUpdate(
          { email: userEmail },
          { $set: { twoFactorEnabled: payload.enabled } }
        );
        return NextResponse.json({ 
          success: true, 
          message: `2FA has been ${payload.enabled ? "enabled" : "disabled"}` 
        });
      }

      default:
        return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// 3. Account Deletion (Danger Zone)
export async function DELETE() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const userId = user._id;

    await OrderModel.updateMany(
      { userId: userId },
      { $set: { userDeleted: true } }
    );

    await ContactModel.updateMany(
      { userId: userId },
      { $set: { userId: null } }
    );

    await ReviewModel.updateMany(
      { userId: userId },
      { $set: { userId: null, name: "Deleted User" } }
    );

    await UserModel.findByIdAndDelete(userId);

    return NextResponse.json({ 
      success: true, 
      message: "Account deleted. Your activity history has been anonymized for records." 
    });

  } catch (error: any) {
    console.error("Deletion Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// 4. Billing History (Data Retrieval)
export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = await UserModel.findOne({ email: session.user.email });
    
    // Fetch only the orders belonging to this user
    const orders = await OrderModel.find({ userId: user?._id })
      .sort({ createdAt: -1 }) // Newest orders first
      .select("orderId finalAmount status items createdAt");

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}