// // lib/schemas/shippingSchema.js
// import { z } from 'zod';

// export const shippingAddressSchema = z.object({
//   fullName: z.string().min(3, "Full name is required").max(100, "Full name too long"),
//   addressLine1: z.string().min(5, "Address line 1 is required").max(200, "Address too long"),
//   addressLine2: z.string().max(200, "Address line 2 too long").optional().or(z.literal("")),
//   city: z.string().min(2, "City is required").max(100, "City too long"),
//   state: z.string().min(2, "State/Province is required").max(100, "State/Province too long"),
//   postalCode: z.string().min(4, "Postal Code is required").max(20, "Postal Code too long"),
//   country: z.string().min(2, "Country is required").max(100, "Country too long").default('Pakistan'),
//   phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
// });

// export type ShippingAddressInputs = z.infer<typeof shippingAddressSchema>;





import { z } from 'zod';

export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Full name is required").max(100, "Full name too long"),
  addressLine1: z.string().min(5, "Address line 1 is required").max(200, "Address too long"),
  addressLine2: z.string().max(200, "Address line 2 too long").optional().or(z.literal("")),
  city: z.string().min(2, "City is required").max(100, "City too long"),
  state: z.string().min(2, "State/Province is required").max(100, "State/Province too long"),
  postalCode: z.string().min(4, "Postal Code is required").max(20, "Postal Code too long"),
  // Use a required string here because defaultValues in the form will provide 'Pakistan'
  country: z.string().min(2, "Country is required").max(100, "Country too long"),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format (e.g. +923001234567)"),
});

// This line ensures the type used in the form matches the schema exactly
export type ShippingAddressInputs = z.infer<typeof shippingAddressSchema>;