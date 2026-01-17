// src/app/actions.ts
"use server";

import ImageKit from "imagekit";
import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/dbConnect"; // Import your MongoDB connection utility
import UploadedMedia from "@/models/UploadedMedia"; // Import your Mongoose model

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

interface UploadResult {
  success: boolean;
  message: string;
  url?: string;
  fileType?: string;
  fileName?: string;
}

export async function uploadFile(formData: FormData): Promise<UploadResult> {
  const file = formData.get("file") as File | null;
  const originalFileName = formData.get("fileName") as string | null;
  const folder = (formData.get("folder") as string) || "/nextjs-uploads";

  if (!file) {
    return { success: false, message: "No file provided." };
  }
  if (!originalFileName) {
    return { success: false, message: "File name is required." };
  }

  const allowedFileTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "video/mp4",
    "video/webm",
    "video/ogg",
  ];
  if (!allowedFileTypes.includes(file.type)) {
    return {
      success: false,
      message:
        "Unsupported file type. Only images (jpeg, png, gif, webp) and videos (mp4, webm, ogg) are allowed.",
    };
  }

  try {
    // 1. Upload to ImageKit
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const imageKitResult = await imagekit.upload({
      file: buffer,
      fileName: originalFileName,
      folder: folder,
      tags: ["nextjs-upload", file.type.split("/")[0]],
    });

    console.log("File uploaded to ImageKit:", imageKitResult);

    // 2. Store metadata in MongoDB using Mongoose
    await dbConnect(); // Ensure MongoDB connection is established

    await UploadedMedia.create({
      url: imageKitResult.url,
      fileType: imageKitResult.fileType, // ImageKit result has 'fileType' (e.g., "image", "video")
      fileName: imageKitResult.name, // ImageKit result has 'name' (e.g., "my-image.jpg")
      uploadedAt: new Date(),
    });
    console.log("File metadata stored in MongoDB.");

    revalidatePath("/uploaded-media"); // Revalidate the page displaying media

    return {
      success: true,
      url: imageKitResult.url,
      fileType: imageKitResult.fileType,
      fileName: imageKitResult.name,
      message: "File uploaded successfully!",
    };
  } catch (error: any) {
    console.error("Error during file upload or MongoDB storage:", error);
    return {
      success: false,
      message: `Upload failed: ${error.message || "Unknown error"}`,
    };
  }
}
