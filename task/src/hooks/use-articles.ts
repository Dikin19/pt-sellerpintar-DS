<<<<<<< HEAD
"use client";

import { useState, useCallback } from "react";
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

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = useCallback(
    async (
      filters?: ArticleFilters
    ): Promise<PaginatedResponse<Article> | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await getArticles(filters);
        setArticles(response.data);
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
    []
  );

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
=======
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
>>>>>>> 217b6e120a965a6d984dee0f3222aea329e90b60

  return {
    articles,
    loading,
    error,
<<<<<<< HEAD
    fetchArticles,
    createArticle: createArticleHandler,
    updateArticle: updateArticleHandler,
    deleteArticle: deleteArticleHandler,
    clearError,
  };
}
=======
    pagination,
    refetch: fetchArticles,
    removeArticle,
  };
}
>>>>>>> 217b6e120a965a6d984dee0f3222aea329e90b60
