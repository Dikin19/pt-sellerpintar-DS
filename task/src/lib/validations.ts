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

export const articleExcerptSchema = z
  .string()
  .min(1, "Excerpt is required")
  .min(10, "Excerpt must be at least 10 characters")
  .max(500, "Excerpt must be less than 500 characters");

export const articleThumbnailSchema = z
  .string()
  .url("Please enter a valid URL")
  .optional()
  .or(z.literal(""));

// Article validation schemas
export const articleTitleSchema = z
  .string()
  .min(1, "Title is required")
  .min(5, "Title must be at least 5 characters")
  .max(200, "Title must be less than 200 characters");

export const articleContentSchema = z
  .string()
  .min(1, "Content is required")
  .min(50, "Content must be at least 50 characters")
  .max(10000, "Content must be less than 10,000 characters");

export const categoryIdSchema = z.string().min(1, "Category is required");

// Category validation schemas
export const categoryNameSchema = z
  .string()
  .min(1, "Category name is required")
  .min(2, "Category name must be at least 2 characters")
  .max(50, "Category name must be less than 50 characters")
  .regex(
    /^[a-zA-Z0-9\s-_]+$/,
    "Category name can only contain letters, numbers, spaces, hyphens, and underscores"
  );

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

<<<<<<< HEAD
export const articleFormSchema = z.object({
  title: articleTitleSchema,
  excerpt: articleExcerptSchema,
  content: articleContentSchema,
  categoryId: categoryIdSchema,
  thumbnail: articleThumbnailSchema,
});

export const articleSchema = articleFormSchema;

// Simplified article schema for update (only 3 fields as requested)
export const articleUpdateSchema = z.object({
  title: articleTitleSchema,
  content: articleContentSchema,
  categoryId: categoryIdSchema,
});

export const categoryFormSchema = z.object({
  name: categoryNameSchema,
});

// Search and filter schemas
export const searchSchema = z
  .string()
  .max(100, "Search term must be less than 100 characters")
  .optional();

export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

=======
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
>>>>>>> 217b6e120a965a6d984dee0f3222aea329e90b60
// Type inference
export type LoginFormData = z.infer<typeof loginFormSchema>;
export type RegisterFormData = z.infer<typeof registerFormSchema>;
export type ArticleFormData = z.infer<typeof articleFormSchema>;
<<<<<<< HEAD
export type ArticleUpdateData = z.infer<typeof articleUpdateSchema>;
export type CategoryFormData = z.infer<typeof categoryFormSchema>;
export type PaginationData = z.infer<typeof paginationSchema>;
=======
export type CategoryFormData = z.infer<typeof categoryFormSchema>;
>>>>>>> 217b6e120a965a6d984dee0f3222aea329e90b60
