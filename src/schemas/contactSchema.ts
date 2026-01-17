import z from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Invalid email address."),
  subject: z
    .string()
    .min(5, "Subject is required and must be at least 5 characters."),
  message: z
    .string()
    .min(10, "Message is required and must be at least 10 characters.")
    .max(500, "Message limited to 500 characters."),
  isRead: z
    .boolean().default(false).optional(),
  userId: z.string().optional(),
});
