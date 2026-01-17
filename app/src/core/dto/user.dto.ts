import { z } from "zod";

// CreateUserDTO - Used by ADMINS
export const CreateUserDTO = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "STAFF"]).default("STAFF"),
});

export const UpdateUserDTO = CreateUserDTO.partial();

export type CreateUserInput = z.infer<typeof CreateUserDTO>;
export type UpdateUserInput = z.infer<typeof UpdateUserDTO>;
