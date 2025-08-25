import { useMemo } from "react";
import { Article, PaginatedResponse } from "@/lib/type";

interface UseSearchArticlesProps {
  allArticles: Article[];
  searchTerm: string;
  categoryId: string;
  page: number;
  limit: number;
}

export function useSearchArticles({
  allArticles,
  searchTerm,
  categoryId,
  page,
  limit,
}: UseSearchArticlesProps): PaginatedResponse<Article> {
  const filteredArticles = useMemo(() => {
    let filtered = [...allArticles];

    // Filter by search term
    if (searchTerm && searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(search) ||
          article.content.toLowerCase().includes(search) ||
          article.excerpt.toLowerCase().includes(search)
      );
    }

    // Filter by category
    if (categoryId && categoryId.trim()) {
      filtered = filtered.filter(
        (article) => article.categoryId === categoryId
      );
    }

    return filtered;
  }, [allArticles, searchTerm, categoryId]);

  const paginatedResult = useMemo(() => {
    const total = filteredArticles.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = filteredArticles.slice(startIndex, endIndex);

    return {
      data,
      page,
      totalPages,
      total,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }, [filteredArticles, page, limit]);

  return paginatedResult;
}
