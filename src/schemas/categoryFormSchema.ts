import * as z from "zod";

// Zod schema for Category Form (Add/Edit)

export const categoryFormSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, { message: "Category name is required." }).max(50, { message: "Category name too long." }),
});