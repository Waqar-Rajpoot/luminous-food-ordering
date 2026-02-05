import { z } from 'zod';

export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Full name is required").max(100, "Full name too long"),
  addressLine1: z.string().min(5, "Address line 1 is required").max(200, "Address too long"),
  addressLine2: z.string().max(200, "Address line 2 too long").optional().or(z.literal("")),
  city: z.string().min(2, "City is required").max(100, "City too long"),
  state: z.string().min(2, "Please select a province").max(100),
  postalCode: z.string().min(4, "Postal Code is required").max(20, "Postal Code too long"),
  country: z.string().min(2, "Country is required").max(100),  
  phoneNumber: z.string().regex(/^((\+92)|(92)|(0))?[3][0-9]{9}$/, "Please enter a valid Pakistani phone number (e.g., 03001234567)"),
});

export type ShippingAddressInputs = z.infer<typeof shippingAddressSchema>;