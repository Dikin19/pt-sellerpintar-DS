import { z } from "zod";

// Common validation schemas
export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be less than 20 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores"
  );

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(100, "Password must be less than 100 characters");

export const roleSchema = z.enum(["Admin", "User"], {
  message: "Please select a valid role",
});

// Validation utilities
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
) => {
  return password === confirmPassword;
};

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Form validation schemas
export const loginFormSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

export const registerFormSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  role: roleSchema,
});

// Type inference
export type LoginFormData = z.infer<typeof loginFormSchema>;
export type RegisterFormData = z.infer<typeof registerFormSchema>;
