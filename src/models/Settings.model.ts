// import mongoose, { Schema } from "mongoose";

// const SettingsSchema = new Schema(
//   {
//     // 1. Store Operations
//     isStoreOpen: { type: Boolean, default: true },
//     operatingHours: {
//       open: { type: String, default: "09:00" },
//       close: { type: String, default: "23:00" },
//     },
//     estimatedDeliveryTime: { type: String, default: "30-45 mins" },
//     minOrderValue: { type: Number, default: 500 },

//     // 2. Logistics
//     deliveryRadius: { type: Number, default: 10 },
//     staffCommission: { type: Number, default: 50 },

//     // 3. Financials
//     paymentMethods: {
//       stripe: { type: Boolean, default: true },
//       cod: { type: Boolean, default: true },
//     },
//     taxPercentage: { type: Number, default: 5 },

//     // 4. Inventory
//     featuredLimit: { type: Number, default: 6 },
//     globalDiscount: { type: Number, default: 0 },

//     // 5. System
//     adminNotifications: { type: Boolean, default: true },
//     maintenanceMode: { type: Boolean, default: false },
//   },
//   { timestamps: true },
// );

// export default mongoose.models.Settings ||
//   mongoose.model("Settings", SettingsSchema);






import mongoose, { Schema } from "mongoose";

const SettingsSchema = new Schema(
  {
    // 1. Store Operations
    isStoreOpen: { type: Boolean, default: true },
    operatingHours: {
      open: { type: String, default: "09:00" },
      close: { type: String, default: "23:00" },
    },
    estimatedDeliveryTime: { type: String, default: "30-45 mins" },
    minOrderValue: { type: Number, default: 500 },

    // 2. Logistics
    deliveryRadius: { type: Number, default: 10 },
    staffCommission: { type: Number, default: 50 },

    // 3. Financials (Matching your JSON exactly)
    paymentMethods: {
      stripe: { type: Boolean, default: true },
      cod: { type: Boolean, default: true },
    },
    taxPercentage: { type: Number, default: 0 },
    globalDiscount: { type: Number, default: 0 },

    // 4. Inventory/Display
    featuredLimit: { type: Number, default: 6 },

    // 5. System & Security
    adminNotifications: { type: Boolean, default: true },
    maintenanceMode: { type: Boolean, default: false },
  },
  { 
    timestamps: true,
    // This ensures that if you add new fields later, they aren't stripped by Mongoose
    strict: true 
  },
);

// Prevent re-compilation of the model during Next.js Hot Reloads
const Settings = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);

export default Settings;