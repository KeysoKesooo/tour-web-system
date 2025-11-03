import { z } from "zod";

export const CreateTripDTO = z.object({
  title: z.string().min(1),
  description: z.string(),
  location: z.string().min(1),
  price: z.coerce.number().min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  capacity: z.coerce.number().min(1),
  imageUrl: z.string().optional(),
});

export const UpdateTripDTO = CreateTripDTO.partial();

export type CreateTripInput = z.infer<typeof CreateTripDTO>;
export type UpdateTripInput = z.infer<typeof UpdateTripDTO>;
