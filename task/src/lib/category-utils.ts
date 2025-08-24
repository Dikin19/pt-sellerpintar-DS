/**
 * Utility functions for category management
 */

import type { Category } from "./type";

/**
 * Validates if a category object has a valid ID
 */
export function isValidCategoryId(id: any): boolean {
  return (
    id !== null &&
    id !== undefined &&
    id !== "" &&
    typeof id === "string" &&
    id.trim() !== "" &&
    !id.includes("temp_") &&
    !id.includes("undefined") &&
    !id.includes("null")
  );
}

/**
 * Validates if a category object is valid
 */
export function isValidCategory(category: any): category is Category {
  if (!category || typeof category !== "object") {
    return false;
  }

  // Must have a valid ID
  if (!isValidCategoryId(category.id)) {
    console.warn("Category has invalid ID:", { category, id: category.id });
    return false;
  }

  // Must have a name
  if (
    !category.name ||
    typeof category.name !== "string" ||
    category.name.trim() === ""
  ) {
    console.warn("Category has invalid name:", {
      category,
      name: category.name,
    });
    return false;
  }

  return true;
}

/**
 * Filters an array of categories to only include valid ones
 */
export function filterValidCategories(categories: any[]): Category[] {
  if (!Array.isArray(categories)) {
    console.warn("Expected array of categories, got:", typeof categories);
    return [];
  }

  const validCategories = categories.filter(isValidCategory);

  if (validCategories.length !== categories.length) {
    console.warn(
      `Filtered out ${
        categories.length - validCategories.length
      } invalid categories`
    );
  }

  return validCategories;
}

/**
 * Sanitizes a category ID for API requests
 */
export function sanitizeCategoryId(id: any): string {
  if (!isValidCategoryId(id)) {
    throw new Error(`Invalid category ID: ${id}`);
  }

  return id.toString().trim();
}

/**
 * Checks if a category name suggests it might be a system/protected category
 */
export function isProtectedCategory(categoryName: string): boolean {
  const protectedNames = ["management", "system", "admin", "default"];
  return protectedNames.includes(categoryName.toLowerCase());
}

/**
 * Logs detailed category information for debugging
 */
export function logCategoryDebugInfo(
  category: any,
  context: string = ""
): void {
  console.log(`${context ? `[${context}] ` : ""}Category debug info:`, {
    raw: category,
    id: category?.id,
    idType: typeof category?.id,
    name: category?.name,
    nameType: typeof category?.name,
    isValid: isValidCategory(category),
    isValidId: isValidCategoryId(category?.id),
    keys: category ? Object.keys(category) : null,
  });
}
