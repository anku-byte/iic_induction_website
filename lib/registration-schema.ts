import { z } from "zod";

export const BRANCHES = [
  "Computer Science",
  "Electronics",
  "Mechanical",
  "Chemical",
  "Civil",
  "Electrical",
  "Information Technology",
] as const;

export const registrationSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian phone number"),
  branch: z.enum(BRANCHES, {
    errorMap: () => ({ message: "Please select your branch" }),
  }),
  registrationNumber: z
    .string()
    .min(3, "Registration number must be at least 3 characters")
    .max(20, "Registration number must be less than 20 characters"),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;
