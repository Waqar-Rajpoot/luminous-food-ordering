import { z } from 'zod';

export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Full name is required").max(100, "Full name too long"),
  addressLine1: z.string().min(5, "Address line 1 is required").max(200, "Address too long"),
  city: z.string().min(2, "City is required").max(100, "City too long"),
  state: z.string().min(2, "Please select a province").max(100),
  phoneNumber: z.string().regex(
    /^((\+92)|(92)|(0))?[3][0-9]{9}$/, 
    "Please enter a valid Pakistani phone number (e.g., 03001234567)"
  ),
  lat: z.number().refine((val) => val !== 0, "Please pin your location on the map"),
  lng: z.number().refine((val) => val !== 0, "Please pin your location on the map"),
});

export type ShippingAddressInputs = z.infer<typeof shippingAddressSchema>;