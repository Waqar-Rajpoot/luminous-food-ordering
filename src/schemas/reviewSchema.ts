// import z from "zod";

// export const reviewSchema = z.object({
//   name: z.string().min(2, "Your Name is required."),
//   email: z.string().email("Invalid email address."),
//   rating: z.number().min(1, "Rating must be at least 1.").max(5, "Rating cannot exceed 5."),
//   review: z.string().min(20, "Review must be at least 20 characters.").max(500, "Review limited to 500 characters."),
//   isApproved: z.boolean().default(false).optional(),
//   userId: z.string().optional(),
// });




import z from "zod";

export const reviewSchema = z.object({
  name: z.string().min(2, "Your Name is required."),
  email: z.string().email("Invalid email address."),
  rating: z.number().min(1, "Rating must be at least 1.").max(5, "Rating cannot exceed 5."),
  review: z.string().min(20, "Review must be at least 20 characters.").max(500, "Review limited to 500 characters."),
  isApproved: z.boolean().default(false).optional(),
  userId: z.string().min(1, "User ID is required."),
  productId: z.string().min(1, "Product ID is required."),
  orderId: z.string().min(1, "Order ID is required."),
});