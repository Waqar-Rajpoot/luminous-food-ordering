// lib/schemas/orderSchema.js
import * as z from "zod";

export const orderItemSchema = z.object({
  name: z
    .string({
      error: "Item name is required",
    })
    .min(1, "Item name cannot be empty"),
  price: z
    .number({
      error: "Price is required",
    })
    .positive("Price must be a positive number"),
  quantity: z
    .number({
      error: "Quantity is required",
    })
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1"),
});

export const orderSchema = z
  .array(orderItemSchema)
  .nonempty("The order cannot be empty");
