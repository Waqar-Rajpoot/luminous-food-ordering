import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const {name, username, email, password } = await request.json();

    if (!name || !username || !email || !password) {
      return Response.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        { success: false, message: "Username already taken" },
        { status: 400 }
      );
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const existingUserByEmail = await UserModel.findOne({ email });

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: "Email already taken" },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpire = new Date(Date.now() + 5 * 60000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date(Date.now() + 5 * 60000);

      const newUser = new UserModel({
        name,
        username,
        email,
        password: hashedPassword,
        isVerified: false,
        verifyCode,
        verifyCodeExpire: expiryDate,
      });

      await newUser.save();
    }
    const emailType = "VERIFY";

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
        success: true, message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error while registering user", error);
    return Response.json(
      { success: false, message: "Error while registering user" },
      { status: 500 }
    );
  }
}
