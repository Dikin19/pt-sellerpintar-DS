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
  const res = await api.post("/articles", data);
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
        console.log(`Raw category ${index}:`, cat);
        console.log(`Raw category ${index} keys:`, Object.keys(cat));

        // Check if ID field exists and is valid
        if (!cat.id && !cat._id && !cat.categoryId) {
          console.warn(`Category ${index} is missing ID field!`, cat);
        }
      });

      // Filter out empty objects and invalid categories
      const validCategories = categories.filter((cat: any) => {
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

      // Normalize categories to ensure they have an id field
      const normalizedCategories = validCategories.map((cat: any) => {
        // If category doesn't have id but has other ID fields, use them
        if (!cat.id) {
          if (cat._id) {
            return { ...cat, id: cat._id };
          } else if (cat.categoryId) {
            return { ...cat, id: cat.categoryId };
          } else {
            console.warn(
              "Category missing all possible ID fields, generating temporary ID:",
              cat
            );
            // Generate a temporary ID as fallback (this shouldn't happen in production)
            return { ...cat, id: `temp_${Date.now()}_${Math.random()}` };
          }
        }
        return cat;
      });

      return {
        data: normalizedCategories,
        page: filters?.page || 1,
        totalPages: 1,
        total: normalizedCategories.length,
        pagination: {
          page: filters?.page || 1,
          limit: filters?.limit || 10,
          total: normalizedCategories.length,
          totalPages: Math.ceil(
            normalizedCategories.length / (filters?.limit || 10)
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

    if (!id || id.trim() === "") {
      throw new Error("Category ID is required and cannot be empty");
    }

    const res = await api.put(`/categories/${id}`, data);
    console.log("updateCategory response:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("updateCategory error:", error);
    console.error("Error response:", error.response);
    console.error("Error status:", error.response?.status);
    console.error("Error data:", error.response?.data);

    if (error.response?.status === 404) {
      throw new Error(`Category with ID ${id} not found`);
    }

    if (error.response?.status === 500) {
      throw new Error("Server error occurred while updating category");
    }

    throw error;
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    await api.delete(`/categories/${id}`);
  } catch (error: any) {
    console.error("deleteCategory error:", error);

    if (error.response?.status === 404) {
      throw new Error(`Category with ID ${id} not found`);
    }

    if (error.response?.status === 500) {
      throw new Error("Server error occurred while deleting category");
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

  // Use the local API route that handles the backend call with proper headers
  const res = await fetch("/api/auth/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
  }

  const data = await res.json();
  return data;
}

export async function refreshToken() {
  const res = await api.post("/auth/refresh");
  return res.data;
}
