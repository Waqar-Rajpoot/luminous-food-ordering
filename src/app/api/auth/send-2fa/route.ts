import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { identifier, password } = await req.json();

        // Find user by username or email
        const user = await UserModel.findOne({
            $or: [{ username: identifier }, { email: identifier }]
        });

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // 1. Verify Password first
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
        }

        // 2. If 2FA is not enabled, tell frontend to proceed with normal login
        if (!user.twoFactorEnabled) {
            return NextResponse.json({ success: true, requires2FA: false });
        }

        // 3. Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        // Matching your signup expiry logic (5 minutes)
        const expiryDate = new Date(Date.now() + 5 * 60000); 

        // 4. Save to Database (Ensure these field names match your User model)
        user.verifyCode = otpCode;
        user.verifyCodeExpire = expiryDate; 
        await user.save();

        // 5. Send Email using your specific helper format
        const emailType = "2FA"; // Differentiating from "VERIFY"
        
        const emailResponse = await sendVerificationEmail(
            user.email,
            emailType,
            user.username,
            otpCode
        );

        if (!emailResponse.success) {
            return NextResponse.json(
                { success: false, message: emailResponse.message || "Failed to send 2FA code" }, 
                { status: 500 }
            );
        }

        return NextResponse.json({ 
            success: true, 
            requires2FA: true, 
            message: "2FA code sent to your email" 
        });

    } catch (error: any) {
        console.error("Error in send-2fa route:", error);
        return NextResponse.json({ success: false, message: "Error sending 2FA code" }, { status: 500 });
    }
}