// import dbConnect from "@/lib/dbConnect";
// import SettingsModel from "@/models/Settings.model";
// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { settingsSchema } from "@/schemas/settingsSchema";
// import { authOptions } from "../../auth/[...nextauth]/options";

// export const dynamic = 'force-dynamic';

// export async function GET() {
//   try {
//     await dbConnect();
//     const settings = await SettingsModel.findOne().lean();
    
//     if (!settings) {
//       return NextResponse.json({ success: false, message: "No settings found" }, { status: 404 });
//     }

//     return NextResponse.json({ success: true, settings });
//   } catch (error) {
//     console.error("Settings Fetch Error:", error);
//     return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
//   }
// }

// export async function PUT(req: Request) {
//   try {
//     await dbConnect();
    
//     const session = await getServerSession(authOptions);
//     if (!session || session.user.role !== "admin") {
//       return NextResponse.json({ 
//         success: false, 
//         message: "Unauthorized. Admin access required." 
//       }, { status: 401 });
//     }

//     const body = await req.json();

//     const { 
//       _id: _unusedId, 
//       __v: _unusedV, 
//       createdAt: _unusedCA, 
//       updatedAt: _unusedUA, 
//       ...cleanData 
//     } = body;

//     // 3. Data Validation
//     const validation = settingsSchema.safeParse(cleanData);
//     if (!validation.success) {
//       return NextResponse.json({ 
//         success: false, 
//         errors: validation.error.flatten().fieldErrors 
//       }, { status: 400 });
//     }

//     // 4. Update Database
//     const updatedSettings = await SettingsModel.findOneAndUpdate(
//       {}, 
//       validation.data, 
//       { 
//         upsert: true, 
//         new: true, 
//         runValidators: true 
//       }
//     );

//     return NextResponse.json({ 
//       success: true, 
//       message: "Configuration Synced Successfully", 
//       settings: updatedSettings 
//     });

//   } catch (error) {
//     console.error("Settings Update Error:", error);
//     return NextResponse.json({ 
//       success: false, 
//       error: "Critical Database Error." 
//     }, { status: 500 });
//   }
// }






import dbConnect from "@/lib/dbConnect";
import SettingsModel from "@/models/Settings.model";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { settingsSchema } from "@/schemas/settingsSchema";
import { authOptions } from "../../auth/[...nextauth]/options";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const settings = await SettingsModel.findOne().lean();
    
    if (!settings) {
      return NextResponse.json({ success: false, message: "No settings found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Settings Fetch Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ 
        success: false, 
        message: "Unauthorized. Admin access required." 
      }, { status: 401 });
    }

    const body = await req.json();

    const validation = settingsSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ 
        success: false, 
        errors: validation.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    // 2. Update Database using ONLY validated data
    const updatedSettings = await SettingsModel.findOneAndUpdate(
      {}, 
      validation.data,
      { 
        upsert: true, 
        new: true, 
        runValidators: true 
      }
    );

    return NextResponse.json({ 
      success: true, 
      message: "Configuration Synced Successfully", 
      settings: updatedSettings 
    });

  } catch (error) {
    console.error("Settings Update Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Critical Database Error." 
    }, { status: 500 });
  }
}