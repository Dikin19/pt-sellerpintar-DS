import { useState, useEffect } from 'react';
import { getArticlesPaginated, deleteArticle } from '@/lib/api';
import { Article, PaginatedResponse } from '@/types';
import { useDebounce } from './use-debounce';

interface UseArticlesParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
}

export function useArticles(params: UseArticlesParams = {}) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 9,
  });

  const debouncedSearch = useDebounce(params.search || '', 400);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getArticlesPaginated({
        page: params.page || 1,
        limit: params.limit || 9,
        search: debouncedSearch,
        categoryId: params.categoryId,
      });

      setArticles(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  const removeArticle = async (id: string) => {
    try {
      await deleteArticle(id);
      setArticles(prev => prev.filter(article => article.id !== id));
      setPagination(prev => ({ ...prev, total: prev.total - 1 }));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to delete article');
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [params.page, params.limit, debouncedSearch, params.categoryId]);

  return {
    articles,
    loading,
    error,
    pagination,
    refetch: fetchArticles,
    removeArticle,
  };
}