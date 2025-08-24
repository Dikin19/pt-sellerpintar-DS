import api from "./axios";
import {
  LoginFormData,
  RegisterFormData,
  ArticleFormData,
  CategoryFormData,
} from "./validations";
import {
  Article,
  Category,
  PaginatedResponse,
  ArticleFilters,
  CategoryFilters,
} from "./type";
import {
  filterValidCategories,
  sanitizeCategoryId,
  isProtectedCategory,
  logCategoryDebugInfo,
} from "./category-utils";

// Articles API functions
export async function getArticles(
  filters?: ArticleFilters
): Promise<PaginatedResponse<Article>> {
  try {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    // Simple search handling - only add if really has content
    if (filters?.search && filters.search.trim().length > 0) {
      params.append("search", filters.search.trim());
    }

    if (filters?.categoryId && filters.categoryId.trim().length > 0) {
      params.append("categoryId", filters.categoryId.trim());
    }

    const url = `/articles${params.toString() ? `?${params.toString()}` : ""}`;
    console.log("Making API call to:", url);

    const res = await api.get(url);

    // Simple validation
    if (!res.data) {
      throw new Error("No data received from API");
    }

    return res.data;
  } catch (error) {
    console.error("getArticles error:", error);
    throw error;
  }
}

export async function getArticle(id: string): Promise<Article> {
  const res = await api.get(`/articles/${id}`);
  return res.data;
}

export async function createArticle(data: ArticleFormData): Promise<Article> {
  // Only send the fields that backend accepts
  const createData = {
    title: data.title,
    content: data.content,
    categoryId: data.categoryId,
  };
  const res = await api.post("/articles", createData);
  return res.data;
}

export async function updateArticle(
  id: string,
  data: ArticleFormData
): Promise<Article> {
  // Only send the required fields
  const updateData = {
    title: data.title,
    content: data.content,
    categoryId: data.categoryId,
  };
  const res = await api.put(`/articles/${id}`, updateData);
  return res.data;
}

export async function deleteArticle(id: string): Promise<void> {
  await api.delete(`/articles/${id}`);
}

// Categories API functions
export async function getCategories(
  filters?: CategoryFilters
): Promise<PaginatedResponse<Category>> {
  const params = new URLSearchParams();

  if (filters?.page) params.append("page", filters.page.toString());
  if (filters?.limit) params.append("limit", filters.limit.toString());
  if (filters?.search) params.append("search", filters.search);

  try {
    const res = await api.get(`/categories?${params.toString()}`);

    console.log("Raw categories API response:", res.data);

    // If the API returns a simple array, wrap it in pagination format
    if (Array.isArray(res.data)) {
      console.log("API returned array format, wrapping in pagination");
      const categories = res.data;

      // Log each category to check structure
      categories.forEach((cat, index) => {
        logCategoryDebugInfo(cat, `Raw category ${index}`);
      });

      // Use utility function to filter and validate categories
      const validCategories = filterValidCategories(categories);

      console.log("Valid categories after filtering:", validCategories);

      // Categories are already validated and normalized by filterValidCategories
      return {
        data: validCategories,
        page: filters?.page || 1,
        totalPages: 1,
        total: validCategories.length,
        pagination: {
          page: filters?.page || 1,
          limit: filters?.limit || 10,
          total: validCategories.length,
          totalPages: Math.ceil(
            validCategories.length / (filters?.limit || 10)
          ),
        },
      };
    }

    console.log("API returned paginated format");

    // Check if the paginated response also needs normalization
    if (res.data && res.data.data && Array.isArray(res.data.data)) {
      console.log("Normalizing paginated categories data");
      console.log("Raw paginated data:", res.data.data);

      // Filter out empty objects and invalid categories
      const validCategories = res.data.data.filter((cat: any) => {
        // Check if category has any meaningful content
        if (!cat || typeof cat !== "object" || Object.keys(cat).length === 0) {
          console.warn("Filtering out empty or invalid category:", cat);
          return false;
        }

        // Check if category has at least a name field
        if (!cat.name && !cat.title) {
          console.warn("Filtering out category without name:", cat);
          return false;
        }

        return true;
      });

      console.log("Valid categories after filtering:", validCategories);

      const normalizedCategories = validCategories.map((cat: any) => {
        if (!cat.id) {
          if (cat._id) {
            return { ...cat, id: cat._id };
          } else if (cat.categoryId) {
            return { ...cat, id: cat.categoryId };
          } else {
            console.warn(
              "Category missing ID field, generating temporary ID:",
              cat
            );
            return { ...cat, id: `temp_${Date.now()}_${Math.random()}` };
          }
        }
        return cat;
      });

      return {
        ...res.data,
        data: normalizedCategories,
      };
    }

    // If the API already returns paginated format, return as is
    return res.data;
  } catch (error: any) {
    console.error("getCategories error:", error);
    // Return empty paginated response on error
    return {
      data: [],
      page: 1,
      totalPages: 1,
      total: 0,
      pagination: {
        page: 1,
        limit: filters?.limit || 10,
        total: 0,
        totalPages: 1,
      },
    };
  }
}

// Articles management API (for admin)
export const articlesManagementApi = {
  deleteArticle: deleteArticle,
  createArticle: createArticle,
  updateArticle: updateArticle,
};

// Backwards compatibility
export const articlesApi = {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  getCategories,
};

export async function getCategoryById(id: string): Promise<Category> {
  const res = await api.get(`/categories/${id}`);
  return res.data;
}

export async function getCategory(id: string): Promise<Category> {
  try {
    console.log("getCategory called with ID:", id);

    // Use utility function to validate and sanitize ID
    const sanitizedId = sanitizeCategoryId(id);

    const res = await api.get(`/categories/${sanitizedId}`);
    console.log("getCategory response:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("getCategory error:", error);

    if (error.response?.status === 404) {
      throw new Error(`Category with ID "${id}" not found`);
    }

    if (error.response?.status === 403) {
      throw new Error("You don't have permission to view this category");
    }

    throw new Error(
      `Failed to fetch category: ${
        error.response?.data?.message || error.message
      }`
    );
  }
}

export async function createCategory(
  data: CategoryFormData
): Promise<Category> {
  try {
    const res = await api.post("/categories", data);
    return res.data;
  } catch (error: any) {
    console.error("createCategory error:", error);

    if (error.response?.status === 400) {
      throw new Error("Invalid category data provided");
    }

    if (error.response?.status === 500) {
      throw new Error("Server error occurred while creating category");
    }

    throw error;
  }
}

export async function updateCategory(
  id: string,
  data: CategoryFormData
): Promise<Category> {
  try {
    console.log("updateCategory called with:", { id, data });

    // Use utility function to validate and sanitize ID
    const sanitizedId = sanitizeCategoryId(id);

    // Check if this is a protected category
    if (isProtectedCategory(data.name)) {
      console.warn("Attempting to update protected category:", {
        id: sanitizedId,
        name: data.name,
      });
    }

    console.log("Making PUT request to:", `/categories/${sanitizedId}`);
    const res = await api.put(`/categories/${sanitizedId}`, data);
    console.log("updateCategory response:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("updateCategory error:", error);
    console.error("Error response:", error.response);
    console.error("Error status:", error.response?.status);
    console.error("Error data:", error.response?.data);

    // Handle specific error cases
    if (error.response?.status === 400) {
      const errorMessage =
        error.response?.data?.error || error.response?.data?.message || "";

      if (
        errorMessage.includes("Record to update not found") ||
        errorMessage.includes("not found")
      ) {
        throw new Error(
          `Category with ID "${id}" was not found. It may have been deleted by another user or the ID is invalid.`
        );
      }

      if (
        errorMessage.includes("validation") ||
        errorMessage.includes("required")
      ) {
        throw new Error(`Invalid data provided: ${errorMessage}`);
      }

      if (
        errorMessage.includes("duplicate") ||
        errorMessage.includes("already exists")
      ) {
        throw new Error(
          `A category with this name already exists. Please choose a different name.`
        );
      }

      throw new Error(`Update failed: ${errorMessage || "Invalid request"}`);
    }

    if (error.response?.status === 404) {
      throw new Error(
        `Category with ID "${id}" not found. It may have been deleted.`
      );
    }

    if (error.response?.status === 403) {
      throw new Error("You don't have permission to update this category");
    }

    if (error.response?.status === 500) {
      throw new Error(
        "Server error occurred while updating category. Please try again later."
      );
    }

    // If it's a network error or other unexpected error
    if (!error.response) {
      throw new Error(
        "Network error. Please check your connection and try again."
      );
    }

    throw error;
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    console.log("deleteCategory called with ID:", id);

    // Use utility function to validate and sanitize ID
    const sanitizedId = sanitizeCategoryId(id);

    console.log("Making DELETE request to:", `/categories/${sanitizedId}`);
    await api.delete(`/categories/${sanitizedId}`);
    console.log("Category deleted successfully");
  } catch (error: any) {
    console.error("deleteCategory error:", error);
    console.error("Error response:", error.response);
    console.error("Error status:", error.response?.status);
    console.error("Error data:", error.response?.data);

    // Handle specific error cases
    if (error.response?.status === 400) {
      const errorMessage =
        error.response?.data?.error || error.response?.data?.message || "";

      if (
        errorMessage.includes("Record to update not found") ||
        errorMessage.includes("not found")
      ) {
        throw new Error(
          `Category with ID "${id}" was not found. It may have already been deleted.`
        );
      }

      if (
        errorMessage.includes("constraint") ||
        errorMessage.includes("foreign key")
      ) {
        throw new Error(
          "Cannot delete this category because it's being used by existing articles. Please move the articles to another category first."
        );
      }

      if (
        errorMessage.includes("protected") ||
        errorMessage.includes("system")
      ) {
        throw new Error("This category is protected and cannot be deleted.");
      }

      throw new Error(`Delete failed: ${errorMessage || "Invalid request"}`);
    }

    if (error.response?.status === 404) {
      throw new Error(
        `Category with ID "${id}" not found. It may have already been deleted.`
      );
    }

    if (error.response?.status === 403) {
      throw new Error("You don't have permission to delete this category");
    }

    if (error.response?.status === 409) {
      throw new Error(
        "Cannot delete this category because it's being used by existing articles"
      );
    }

    if (error.response?.status === 500) {
      throw new Error(
        "Server error occurred while deleting category. Please try again later."
      );
    }

    // If it's a network error or other unexpected error
    if (!error.response) {
      throw new Error(
        "Network error. Please check your connection and try again."
      );
    }

    throw error;
  }
}

// Authentication API functions
export async function login(credentials: LoginFormData) {
  const res = await api.post("/auth/login", credentials);
  return res.data;
}

export async function register(userData: RegisterFormData) {
  const res = await api.post("/auth/register", userData);
  return res.data;
}

export async function logout() {
  const res = await api.post("/auth/logout");
  return res.data;
}

// User profile API functions
export async function getCurrentUser() {
  // Check if we're in browser environment
  if (typeof window === "undefined") {
    throw new Error("getCurrentUser can only be called in browser environment");
  }

  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("No authentication token found");
  }

  // Get user data from localStorage instead of API call
  const savedUser = localStorage.getItem("user");
  if (!savedUser) {
    throw new Error("No user data found in localStorage");
  }

  try {
    const userData = JSON.parse(savedUser);
    return userData;
  } catch (error) {
    throw new Error("Invalid user data in localStorage");
  }
}

export async function refreshToken() {
  const res = await api.post("/auth/refresh");
  return res.data;
}
