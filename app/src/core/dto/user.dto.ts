import { z } from "zod";

// CreateUserDTO - Used by ADMINS to create users with specific roles
export const CreateUserDTO = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email({ message: "Invalid email format" }), 
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "STAFF"]).default("STAFF"),
});

// UpdateUserDTO - Partial update (admins can change roles)
export const UpdateUserDTO = CreateUserDTO.partial();

export type CreateUserInput = z.infer<typeof CreateUserDTO>;
export type UpdateUserInput = z.infer<typeof UpdateUserDTO>;