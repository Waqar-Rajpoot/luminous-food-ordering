import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { usernameValidation } from "@/schemas/SignUpSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };

    const result = UsernameQuerySchema.safeParse(queryParams);
    // console.log("parsedQuery", parsedQuery);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          // message: "Invalid query parameters",
          message: usernameErrors?.length > 0 ? usernameErrors.join(", ") : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingUser = await UserModel.findOne({ username, isVerified: true });

    if (existingUser) {
      return Response.json({ success: false, message: "Username already taken" }, { status: 400 });
    }

    return Response.json({ success: true, message: "Username is available" }, { status: 200 });

  } catch (error) {
    console.log("Error checking username uniqueness", error);
    return Response.json(
      { success: false, message: "Error checking username uniqueness" },
      { status: 500 }
    );
  }
}
