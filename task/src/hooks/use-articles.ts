"use client";

import { useState, useCallback, useEffect } from "react";
import {
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} from "@/lib/api";
import type {
  Article,
  ArticleFormData,
  ArticleFilters,
  PaginatedResponse,
} from "@/lib/type";
import { useDebounce } from "./use-debounce";

interface UseArticlesParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
}

export function useArticles(params?: UseArticlesParams) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 9,
  });

  const debouncedSearch = useDebounce(params?.search || "", 400);

  const fetchArticles = useCallback(
    async (
      filters?: ArticleFilters
    ): Promise<PaginatedResponse<Article> | null> => {
      setLoading(true);
      setError(null);
      try {
        const searchFilters = filters || {
          page: params?.page || 1,
          limit: params?.limit || 9,
          search: debouncedSearch,
          categoryId: params?.categoryId,
        };

        const response = await getArticles(searchFilters);
        setArticles(response.data);
        setPagination({
          total: response.total,
          page: response.page,
          limit: response.pagination?.limit || params?.limit || 9,
        });
        return response;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch articles";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [params?.page, params?.limit, debouncedSearch, params?.categoryId]
  );

  // Auto-fetch when params change
  useEffect(() => {
    if (params) {
      fetchArticles();
    }
  }, [
    params?.page,
    params?.limit,
    debouncedSearch,
    params?.categoryId,
    fetchArticles,
  ]);

  const createArticleHandler = useCallback(
    async (data: ArticleFormData): Promise<Article | null> => {
      setLoading(true);
      setError(null);
      try {
        const newArticle = await createArticle(data);
        setArticles((prev) => [newArticle, ...prev]);
        return newArticle;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to create article";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateArticleHandler = useCallback(
    async (id: string, data: ArticleFormData): Promise<Article | null> => {
      setLoading(true);
      setError(null);
      try {
        const updatedArticle = await updateArticle(id, data);
        setArticles((prev) =>
          prev.map((article) => (article.id === id ? updatedArticle : article))
        );
        return updatedArticle;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to update article";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteArticleHandler = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await deleteArticle(id);
        setArticles((prev) => prev.filter((article) => article.id !== id));
        setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
        return true;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to delete article";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    articles,
    loading,
    error,
    pagination,
    fetchArticles,
    createArticle: createArticleHandler,
    updateArticle: updateArticleHandler,
    deleteArticle: deleteArticleHandler,
    clearError,
  };
}
