import * as z from "zod";

// Zod schema for Product Form (Add/Edit)
export const productFormSchema = z.object({
  // _id: z.string().optional(),
  name: z.string().min(1, { message: "Product name is required." }),
  price: z.number().min(1, "Price must be greater than 0.").max(1000000, "Price too high."),
  category: z.string().min(1, { message: "Category is required." }),
  // description: z.string().min(1, { message: "Description is required." }).max(200, { message: "Description cannot exceed 200 characters." }),
  imageSrc: z.string().url({ message: "A valid image URL is required." }).min(1, { message: "Product image is required." }),
  isAvailable: z.boolean().default(true),
});