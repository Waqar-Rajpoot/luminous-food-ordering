import mongoose, { Schema } from "mongoose";

const SettingsSchema = new Schema(
  {
    // 1. Store Operations
    isStoreOpen: { type: Boolean, default: true },
    operatingHours: {
      open: { type: String, default: "09:00" },
      close: { type: String, default: "23:00" },
    },
    minOrderValue: { type: Number, default: 500 },
    estimatedDeliveryTime: { type: String, default: "30-45 mins" },

    // 2. Logistics & Delivery Radius
    deliveryRadius: { type: Number, default: 10 },
    restaurantLocation: {
      address: { type: String, default: "123 Bistro Street, Food City" },
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    staffCommission: { type: Number, default: 50 },

    // 3. Financials
    paymentMethods: {
      stripe: { type: Boolean, default: true },
      cod: { type: Boolean, default: true },
    },
    globalDiscount: { type: Number, default: 0 },

    // 4. Inventory/Display
    featuredLimit: { type: Number, default: 6 },

    // 5. System & Security
    maintenanceMode: { type: Boolean, default: false },
  },
  { 
    timestamps: true,
    strict: true 
  },
);

const Settings = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);

export default Settings;