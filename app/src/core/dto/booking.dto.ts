import { z } from "zod";
import { BookingStatus } from "@/types/BookingStatus";

export const CreateBookingDTO = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.email("Invalid email format"),
  phone: z.string().min(12, "Phone number must be at least 12 characters"),
  numPersons: z.number().min(1, "At least 1 person required"),
  message: z.string().optional(),
  tripId: z.string(),
  amountPaid: z.number().optional(),
  status: z.enum(BookingStatus).optional(),
});

export const UpdateBookingDTO = CreateBookingDTO.partial();

export type CreateBookingInput = z.infer<typeof CreateBookingDTO>;
export type UpdateBookingInput = z.infer<typeof UpdateBookingDTO>;
