import { getUploadAuthParams } from "@imagekit/next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    
    const session = await getServerSession(authOptions);
    console.log("User Session is: ",session)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized to upload image login first" }, { status: 401 });
    }
    const { token, expire, signature} = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
    });
    
    return Response.json({
       token, expire, signature,
    });
  } catch (error) {
    console.error("Error generating authentication parameters:", error);
    return Response.json(
      { error: "Failed to generate authentication parameters" },
      { status: 500 }
    );
  }
}