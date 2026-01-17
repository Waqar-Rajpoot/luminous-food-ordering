// File: app/api/settings/route.ts

import dbConnect from "@/lib/dbConnect"; // Your database connection utility
import SettingsModel from "@/models/Settings.model";
import { UpdateSettingsSchema } from "@/schemas/updateSettingsSchema";
import { NextResponse, NextRequest } from "next/server";

// Zod schema for validating incoming PATCH data


/**
 * @method GET
 * @route /api/settings
 * @description Retrieves the single, global restaurant settings document.
 */
export async function GET() {
  await dbConnect();

  try {
    // Find the single settings document, or create it if none exists
    let settings = await SettingsModel.findOne({});

    if (!settings) {
      // Create a default settings document if it doesn't exist
      settings = await SettingsModel.create({});
    }

    return NextResponse.json(settings, { status: 200 });

  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { message: "Error fetching restaurant settings.", success: false },
      { status: 500 }
    );
  }
}

/**
 * @method PATCH
 * @route /api/settings
 * @description Updates the single, global restaurant settings document.
 */
export async function PATCH(request: NextRequest) {
  await dbConnect();

  try {
    const body = await request.json();

    // 1. Validate the incoming data
    const validationResult = UpdateSettingsSchema.safeParse(body);
    if (!validationResult.success) {
        console.error("Validation Error:", validationResult.error.issues);
      return NextResponse.json(
        { 
            message: "Invalid data provided for settings update.", 
            errors: validationResult.error.issues 
        },
        { status: 400 }
      );
    }

    const updatePayload = validationResult.data;

    // 2. Find and update the single settings document (upsert: true creates it if it doesn't exist)
    const updatedSettings = await SettingsModel.findOneAndUpdate(
      {}, // Match any document (since there should only be one)
      { $set: updatePayload }, // Apply all validated changes
      { new: true, upsert: true, runValidators: true } // Return new document, create if missing, run schema checks
    );

    if (!updatedSettings) {
        // This should not happen with upsert:true, but acts as a safeguard
        return NextResponse.json(
            { message: "Failed to update settings.", success: false },
            { status: 500 }
        );
    }


    return NextResponse.json(
      {
        message: "Settings updated successfully.",
        success: true,
        settings: updatedSettings,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { message: "An internal server error occurred during update.", success: false },
      { status: 500 }
    );
  }
}