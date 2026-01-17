import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return Response.json(
        {
          success: true,
          message:
            "If a user with that email exists, a password reset code has been sent.",
        },
        { status: 200 }
      );
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date(Date.now() + 5 * 60000);

    user.resetPasswordToken = verifyCode;
    user.resetPasswordExpire = expiryDate;
    await user.save();
    const emailType = "RESET";
    const username = user.username;

    const emailResponse = await sendVerificationEmail(
      email,
      emailType,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return Response.json(
      {
        emailType,
        username,
        success: true,
        message:
          "If a user with that email exists, a password reset code has been sent.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while processing forgot password request", error);
    return Response.json(
      {
        success: false,
        message: "Error while processing forgot password request",
      },
      { status: 500 }
    );
  }
}
