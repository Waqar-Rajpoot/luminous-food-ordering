import { z } from "zod";

export const settingsSchema = z.object({
  isStoreOpen: z.boolean(),
  maintenanceMode: z.boolean(),
  adminNotifications: z.boolean(),
  
  // Logistics
  estimatedDeliveryTime: z.string().min(1, "Delivery time is required"),
  deliveryRadius: z.number().min(0, "Radius cannot be negative"), // Changed from min(1) to min(0) to allow 0
  
  // Thresholds & Limits
  minOrderValue: z.number().min(0, "Cannot be negative"),
  featuredLimit: z.number().int().min(1, "At least 1 item").max(50, "Limit exceeded"),
  
  // Financials
  staffCommission: z.number().min(0, "Commission cannot be negative"),
  taxPercentage: z.number().min(0).max(100, "Tax must be between 0 and 100"),
  globalDiscount: z.number().min(0).max(100, "Discount must be between 0 and 100"),
  
  // Nested Objects
  operatingHours: z.object({
    open: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid open time format (HH:MM)"),
    close: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid close time format (HH:MM)"),
  }),
  
  paymentMethods: z.object({
    stripe: z.boolean(),
    cod: z.boolean(),
  }),
});

// Optional: Export a type based on the schema for your frontend/backend
export type SettingsInput = z.infer<typeof settingsSchema>;