import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";


export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, code, emailType } = await request.json();
            console.log("username, code, emailType in verify code route", username, code, emailType);

        if (!username || !code) {
            return Response.json(
                { success: false, message: "All fields are required" },
                { status: 400 }
            );
        }
        if (!emailType) {
            return Response.json(
                { success: false, message: "Email type is not received" },
                { status: 401 }
            );
        }

        if (!/^[0-9]+$/.test(code)) {
            return Response.json(
                { success: false, message: "Invalid verification code" },
                { status: 400 }
            );
        }
        const decodedUsername = decodeURIComponent(username)

        const user = await UserModel.findOne({ username: decodedUsername });
        if (!user) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }
        

        if (emailType === "RESET") {
            if (user.resetPasswordToken !== code) {
                return Response.json(
                    { success: false, message: "Invalid verification code.." },
                    { status: 400 }
                );
            }
            const isCodeNotExpired = user.resetPasswordExpire && user.resetPasswordExpire > new Date();
            
            if (!isCodeNotExpired) {
                return Response.json(
                    { success: false, message: "Verification code has expired" },
                    { status: 400 }
                );
            }
        }else if (emailType !== "VERIFY") {
            if (user.verifyCode !== code) {
            return Response.json(
                { success: false, message: "Invalid verification code" },
                { status: 400 }
            );
        }

        const isCodeNotExpired = new Date(user.verifyCodeExpire) > new Date();
        if (!isCodeNotExpired) {
            return Response.json(
                { success: false, message: "Verification code has expired" },
                { status: 400 }
            );
        }
    }
    
    user.isVerified = true;

        await user.save();

        return Response.json({ success: true, message: "Verification successful" }, {status: 200});
    } catch (error: any) {
        console.log("Error verifying user", error);
        return Response.json({ success: false, message: "Error verifying user" }, { status: 500 });
    }
}
