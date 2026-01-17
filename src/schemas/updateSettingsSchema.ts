import * as z from "zod";

export const UpdateSettingsSchema = z.object({
  openingTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
  closingTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
  isClosedToday: z.boolean(),
  lastOrderTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
  maxPartySize: z.number().int().min(1).max(20), // Example max
  reservationEnabled: z.boolean(),
  phoneNumber: z.string().min(5),
  publicEmail: z.string().email(),
  address: z.string().min(10),
});
