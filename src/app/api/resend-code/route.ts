import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(req: Request) {
    await dbConnect();
    try {
        const { username, emailType } = await req.json();
        const user = await UserModel.findOne({ username });

        if (!user) return Response.json({ success: false, message: "User not found" }, { status: 404 });

        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        // Reset count if the last window has passed
        if (user.firstResendAt && user.firstResendAt < twentyFourHoursAgo) {
            user.resendCount = 0;
            user.firstResendAt = null;
        }

        // Check limit
        if (user.resendCount >= 5) {
            return Response.json({ 
                success: false, 
                message: "Daily limit reached. Try again in 24 hours." 
            }, { status: 429 });
        }

        // Generate new code
        const newVerifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.verifyCode = newVerifyCode;
        user.verifyCodeExpire = new Date(Date.now() + 5 * 60000);
        
        // Update tracking
        user.resendCount += 1;
        if (!user.firstResendAt) user.firstResendAt = now;
        
        await user.save();

        await sendVerificationEmail(user.email, emailType, user.username, newVerifyCode);

        return Response.json({ 
            success: true, 
            message: "Code resent successfully", 
            remainingTries: 5 - user.resendCount 
        });
    } catch (error) {
        console.error("Error resending code:", error);
        return Response.json({ success: false, message: "Error resending code" }, { status: 500 });
    }
}