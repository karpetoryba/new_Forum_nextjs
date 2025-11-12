import { object, string } from "zod"

export const signInSchema = object({
  email: string({ message: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ message: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const createUserSchema = signInSchema.extend({
  name: string({ message: "Name must be a string" })
    .trim()
    .min(1, "Name must be at least 1 character")
    .max(50, "Name must be at most 50 characters")
    .optional(),
});