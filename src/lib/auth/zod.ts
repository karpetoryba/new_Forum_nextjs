import { object, string } from "zod"

const emailSchema = string({ message: "Email is required" })
  .min(1, "Email is required")
  .email("Invalid email")

const passwordSchema = string({ message: "Password is required" })
  .min(8, "Password must be at least 8 characters")
  .max(32, "Password must be at most 32 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")

export const signInSchema = object({
  email: emailSchema,
  password: passwordSchema,
})

export const createUserSchema = signInSchema.extend({
  name: string({ message: "Name must be a string" })
    .trim()
    .min(1, "Name must be at least 1 character")
    .max(50, "Name must be at most 50 characters")
    .optional(),
})

export const updateProfileSchema = object({
  name: string()
    .trim()
    .min(1, "Name must be at least 1 character")
    .max(50, "Name must be at most 50 characters")
    .optional(),
  avatar: string()
    .optional()
    .refine(
      (val) => !val || val === "" || /^https?:\/\/.+/.test(val),
      "Avatar must be a valid URL"
    )
    .transform((val) => (val === "" ? undefined : val)),
  bio: string()
    .trim()
    .max(500, "Bio must be at most 500 characters")
    .optional(),
}).partial()