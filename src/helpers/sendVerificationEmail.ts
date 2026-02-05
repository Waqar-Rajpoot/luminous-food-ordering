import nodemailer from "nodemailer";
import { render } from "@react-email/render";
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
        // 1. Prepare Database Updates
        let updateField = {};
        if(emailType === "VERIFY"){
            updateField = {
                verifyCode: verifyCode,
                verifyCodeExpire: new Date(Date.now() + 5 * 60000), // 5 minutes
            };
        } else if(emailType === "RESET"){
            updateField = {
                resetPasswordToken: verifyCode,
                resetPasswordExpire: new Date(Date.now() + 5 * 60000),
            };
        }

        // 2. Update the User in Database
        await UserModel.findOneAndUpdate({email}, updateField);

        // 3. Setup Nodemailer Transporter (Gmail)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, // Your Gmail address
                pass: process.env.EMAIL_PASS, // Your 16-character App Password
            },
        });

        // 4. Convert React Template to HTML String
        const emailHtml = await render(
            VerificationEmail({ username, otp: verifyCode, emailType })
        );

        // 5. Send the Mail
        const mailOptions = {
            from: `"Luminous Food" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email address" : "Reset your password",
            html: emailHtml,
        };

        await transporter.sendMail(mailOptions);

        return { success: true, message: "Verification email sent successfully" };
        
    } catch (error) {
        console.error("Error sending verification email:", error);
        return { success: false, message: "Error sending verification email" };
    }
}