import { z } from "zod";
import { BookingStatus } from "@/types/BookingStatus";
import { m } from "framer-motion";

export const CreateBookingDTO = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.email("Invalid email format"),
  phone: z.string().min(11, "Phone number must be 12 characters"),
  numPersons: z.number().min(1, "At least 1 person required"),
  message: z.string().optional(),
  tripId: z.string(),
  amountPaid: z.number().optional(),
  status: z.enum(BookingStatus).optional(),
});

// 2. Public DTO (Customer View - No internal fields required)
export const PublicCreateBookingDTO = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.email("Invalid email format"),
  phone: z.string().min(11, "Phone number must be 12 characters"),
  // Zod's .coerce is crucial if using type="number" in the form
  numPersons: z.coerce.number().int().min(1, "At least 1 person required"),
  message: z.string().optional(),
  tripId: z.string(),
});

// Infer the TypeScript type from the schema for use in the service layer
export type PublicCreateBookingInput = z.infer<typeof PublicCreateBookingDTO>;

export const UpdateBookingDTO = CreateBookingDTO.partial();

export type CreateBookingInput = z.infer<typeof CreateBookingDTO>;
export type UpdateBookingInput = z.infer<typeof UpdateBookingDTO>;
