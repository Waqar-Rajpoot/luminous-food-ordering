import { z } from "zod";

export const dealSchema = z.object({
  title: z.string().min(5, "Title is too short"),
  description: z.string().min(10, "Description is too short"),
  originalPrice: z.number().positive(),
  dealPrice: z.number().positive(),
  image: z.string().min(1, "Image is required"),
  items: z.array(z.object({
    name: z.string().min(1),
    quantity: z.number().min(1),
  })).min(1),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  // USE .default() to ensure these are never undefined
  category: z.string().default("Deals"), 
  isAvailable: z.boolean().default(true),
  availableDays: z.array(z.string()).default([]),
});

export type DealFormValues = z.infer<typeof dealSchema>;