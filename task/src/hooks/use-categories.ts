import { useState, useEffect } from "react";
import { getCategories, deleteCategory } from "@/lib/api";
import { Category} from "@/lib/type";
import { useDebounce } from "./use-debounce";
import { sanitizeCategoryId} from "@/lib/category-utils";

interface UseCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export function useCategories(params: UseCategoriesParams = {}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
  });

  const debouncedSearch = useDebounce(params.search || "", 400);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("fetchCategories called with params:", {
        page: params.page || 1,
        limit: params.limit || 10,
        search: debouncedSearch,
      });

      const response = await getCategories({
        page: params.page || 1,
        limit: params.limit || 10,
        search: debouncedSearch,
      });

      console.log("fetchCategories response:", {
        dataLength: response.data?.length,
        pagination: response.pagination,
        sampleCategory: response.data?.[0]
          ? {
              id: response.data[0].id,
              name: response.data[0].name,
              idType: typeof response.data[0].id,
            }
          : null,
      });

      // Validate that all categories have valid IDs
      const invalidCategories = response.data.filter(
        (cat) =>
          !cat.id ||
          cat.id.toString().trim() === "" ||
          cat.id.toString().includes("temp_")
      );

      if (invalidCategories.length > 0) {
        console.warn("Found categories with invalid IDs:", invalidCategories);
      }

      setCategories(response.data);
      setPagination({
        total: response.pagination?.total || response.total || 0,
        page: response.pagination?.page || response.page || 1,
        limit: response.pagination?.limit || params.limit || 10,
      });
    } catch (err: any) {
      // Log minimal info for debugging
      console.log(
        "Failed to fetch categories:",
        err.response?.status || "Network error"
      );
      setError(err.response?.data?.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const removeCategory = async (id: string) => {
    try {
      console.log("useCategories - removeCategory called with:", {
        id,
        type: typeof id,
      });

      // Use utility function to validate and sanitize ID
      const sanitizedId = sanitizeCategoryId(id);

      await deleteCategory(sanitizedId);
      setCategories((prev) =>
        prev.filter((category) => category.id !== sanitizedId)
      );
      setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
    } catch (err: any) {
      // Log minimal info for debugging
      console.log(
        "Failed to delete category:",
        err.response?.status || "Network error"
      );
      throw new Error(
        err.message ||
          err.response?.data?.message ||
          "Failed to delete category"
      );
    }
  };

  useEffect(() => {
  fetchCategories();
}, [params.page, params.limit, debouncedSearch, fetchCategories]);

  return {
    categories,
    loading,
    error,
    pagination,
    refetch: fetchCategories,
    removeCategory,
  };
}
