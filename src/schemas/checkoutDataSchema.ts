import * as z from "zod";

export const checkoutDataSchema = z.object({
  cartItems: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number().positive(),
    quantity: z.number().int().min(1),
    image: z.string().url(),
  })).nonempty("Cart cannot be empty."),
  
  shippingAddress: z.object({
    fullName: z.string(),
    addressLine1: z.string(),
    addressLine2: z.string().optional().or(z.literal("")),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string(),
    phoneNumber: z.string(),
  }),

  finalAmount: z.number().min(0),
  originalTotal: z.number().min(0),

  shippingRate: z.number().min(0).default(0),
  paymentMethod: z.enum(['stripe', 'cod']).optional().default('stripe')
});

export type CheckoutData = z.infer<typeof checkoutDataSchema>;