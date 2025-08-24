/**
 * Enhanced category management with validation and recovery utilities
 */

import { getCategories, getCategory } from "@/lib/api";
import { filterValidCategories, logCategoryDebugInfo } from "./category-utils";
import type { Category } from "./type";

/**
 * Validates all categories and provides a health report
 */
export async function validateCategoriesHealth(): Promise<{
  totalCategories: number;
  validCategories: number;
  invalidCategories: number;
  issues: Array<{
    categoryIndex: number;
    categoryId: string;
    categoryName: string;
    issue: string;
  }>;
}> {
  try {
    console.log("=== Starting Categories Health Check ===");

    const response = await getCategories({ limit: 1000 }); // Get all categories
    const rawCategories = response.data;

    console.log(`Found ${rawCategories.length} raw categories`);

    const validCategories = filterValidCategories(rawCategories);
    const issues: any[] = [];

    // Check each category for issues
    rawCategories.forEach((cat, index) => {
      const categoryId = cat?.id || "MISSING_ID";
      const categoryName = cat?.name || "MISSING_NAME";

      logCategoryDebugInfo(cat, `Health check category ${index}`);

      if (!cat.id) {
        issues.push({
          categoryIndex: index,
          categoryId,
          categoryName,
          issue: "Missing ID field",
        });
      } else if (typeof cat.id !== "string") {
        issues.push({
          categoryIndex: index,
          categoryId,
          categoryName,
          issue: `Invalid ID type: ${typeof cat.id}`,
        });
      } else if (cat.id.trim() === "") {
        issues.push({
          categoryIndex: index,
          categoryId,
          categoryName,
          issue: "Empty ID field",
        });
      } else if (cat.id.includes("temp_")) {
        issues.push({
          categoryIndex: index,
          categoryId,
          categoryName,
          issue: "Temporary ID detected",
        });
      }

      if (!cat.name) {
        issues.push({
          categoryIndex: index,
          categoryId,
          categoryName,
          issue: "Missing name field",
        });
      }
    });

    const healthReport = {
      totalCategories: rawCategories.length,
      validCategories: validCategories.length,
      invalidCategories: rawCategories.length - validCategories.length,
      issues,
    };

    console.log("=== Categories Health Report ===", healthReport);

    return healthReport;
  } catch (error) {
    console.error("Failed to perform categories health check:", error);
    throw error;
  }
}

/**
 * Attempts to verify a specific category exists and is accessible
 */
export async function verifyCategoryAccess(categoryId: string): Promise<{
  exists: boolean;
  accessible: boolean;
  category?: Category;
  error?: string;
}> {
  try {
    console.log(`=== Verifying category access for ID: ${categoryId} ===`);

    if (!categoryId) {
      return {
        exists: false,
        accessible: false,
        error: "No category ID provided",
      };
    }

    const category = await getCategory(categoryId);

    logCategoryDebugInfo(category, "Retrieved category");

    return {
      exists: true,
      accessible: true,
      category,
    };
  } catch (error: any) {
    console.error(`Category verification failed for ID: ${categoryId}`, error);

    return {
      exists: false,
      accessible: false,
      error: error.message || "Unknown error",
    };
  }
}

/**
 * Gets category management recommendations based on current state
 */
export function getCategoryManagementRecommendations(
  healthReport: any
): string[] {
  const recommendations: string[] = [];

  if (healthReport.invalidCategories > 0) {
    recommendations.push(
      `Found ${healthReport.invalidCategories} invalid categories that should be cleaned up`
    );
  }

  const tempIdIssues = healthReport.issues.filter((issue: any) =>
    issue.issue.includes("Temporary ID")
  );

  if (tempIdIssues.length > 0) {
    recommendations.push(
      `Found ${tempIdIssues.length} categories with temporary IDs - these should be recreated`
    );
  }

  const missingIdIssues = healthReport.issues.filter((issue: any) =>
    issue.issue.includes("Missing ID")
  );

  if (missingIdIssues.length > 0) {
    recommendations.push(
      `Found ${missingIdIssues.length} categories without IDs - these are corrupted and should be removed`
    );
  }

  if (recommendations.length === 0) {
    recommendations.push("All categories appear to be healthy!");
  }

  return recommendations;
}
