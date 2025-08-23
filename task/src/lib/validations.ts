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

// Article validation schemas
export const articleFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(10000, "Content must be less than 10000 characters"),
  categoryId: z
    .string()
    .min(1, "Category is required"),
});

// Category validation schemas
export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Category name must be less than 100 characters")
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      "Category name can only contain letters, numbers, spaces, hyphens, and underscores"
    ),
});
// Type inference
export type LoginFormData = z.infer<typeof loginFormSchema>;
export type RegisterFormData = z.infer<typeof registerFormSchema>;
export type ArticleFormData = z.infer<typeof articleFormSchema>;
export type CategoryFormData = z.infer<typeof categoryFormSchema>;
