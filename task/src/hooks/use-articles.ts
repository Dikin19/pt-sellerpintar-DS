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

  return {
    articles,
    loading,
    error,
    fetchArticles,
    createArticle: createArticleHandler,
    updateArticle: updateArticleHandler,
    deleteArticle: deleteArticleHandler,
    clearError,
  };
}
