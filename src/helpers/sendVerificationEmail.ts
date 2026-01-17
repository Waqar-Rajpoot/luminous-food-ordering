import { resend } from "@/lib/resend";
import VerificationEmail from "../../emailTemplates/VerificationEmail";
import UserModel from "@/models/User.model";


export const sendVerificationEmail = async (
    email: string, 
    emailType: "VERIFY" | "RESET",
    username: string, 
    verifyCode: string
) => {
     console.log("username in email helper", username);
    try {

        let updateField = {};

        if(emailType === "VERIFY"){
            updateField = {
                verifyCode: verifyCode,
                verifyCodeExpire: new Date(Date.now() + 5 * 60000),
            };
        } else if(emailType === "RESET"){
            updateField = {
                resetPasswordToken: verifyCode,
                resetPasswordExpire: new Date(Date.now() + 5 * 60000),
            };
        }

        await UserModel.findOneAndUpdate({email}, updateField);

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email address" : "Reset your password",
            react: VerificationEmail({username, otp:verifyCode, emailType}),
        })
        return {success: true, message: "Verification email sent successfully"}
    } catch (error) {
        console.log("Error sending verification email", error);
        return {success: false, message: "Error sending verification email"}
    }
}