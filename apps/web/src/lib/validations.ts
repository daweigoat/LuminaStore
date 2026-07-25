import { z } from "zod";

export const addressSchema = z.object({
  recipient_name: z.string().min(2, "Name is too short"),
  phone: z.string().min(10, "Phone number is too short"),
  street: z.string().min(10, "Street address must be detailed"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postal_code: z.string().min(3, "Postal code is required"),
  is_default: z.boolean().default(false),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
