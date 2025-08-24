import { useState, useEffect } from 'react';
import { getCategories, deleteCategory } from '@/lib/api';
import { Category, PaginatedResponse } from '@/types';
import { useDebounce } from './use-debounce';

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

  const debouncedSearch = useDebounce(params.search || '', 400);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getCategories({
        page: params.page || 1,
        limit: params.limit || 10,
        search: debouncedSearch,
      });

      setCategories(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const removeCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      setCategories(prev => prev.filter(category => category.id !== id));
      setPagination(prev => ({ ...prev, total: prev.total - 1 }));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete category');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [params.page, params.limit, debouncedSearch]);

  return {
    categories,
    loading,
    error,
    pagination,
    refetch: fetchCategories,
    removeCategory,
  };
}