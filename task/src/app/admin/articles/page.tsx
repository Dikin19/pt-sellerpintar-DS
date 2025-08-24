"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminArticleTable } from "@/components/admin/articles/admin-article-table"
import { AdminArticleFilters } from "@/components/admin/articles/admin-article-filters"
import { ArticleFormDialog } from "@/components/admin/articles/article-form-dialog"
import { DeleteArticleDialog } from "@/components/admin/articles/delete-article-dialog"
import { Pagination } from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { getArticles, getCategories } from "@/lib/api"
import type { Article, Category, PaginatedResponse } from "@/lib/type"
import { Loader2, Plus } from "lucide-react"

export default function AdminArticlesPage() {
  const [allArticles, setAllArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    search: "",
    categoryId: "",
  })

  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

  const itemsPerPage = 10

  // Client-side filtering and pagination
  const { articles, pagination } = useMemo(() => {
    // Ensure allArticles is valid and contains valid articles
    if (!allArticles || !Array.isArray(allArticles)) {
      return {
        articles: [],
        pagination: {
          page: 1,
          totalPages: 1,
          total: 0
        }
      }
    }

    let filtered = [...allArticles]

    console.log("Starting filter with:", {
      totalArticles: allArticles.length,
      searchTerm: filters.search,
      categoryId: filters.categoryId
    })

    // Filter by search term
    if (filters.search && filters.search.trim()) {
      const search = filters.search.toLowerCase().trim()
      console.log("Applying search filter:", search)

      filtered = filtered.filter(article => {
        // Safely check each property for null/undefined before calling toLowerCase
        const title = article.title || ""
        const content = article.content || ""
        const excerpt = article.excerpt || ""

        const matchesTitle = title.toLowerCase().includes(search)
        const matchesContent = content.toLowerCase().includes(search)
        const matchesExcerpt = excerpt.toLowerCase().includes(search)

        const matches = matchesTitle || matchesContent || matchesExcerpt

        if (matches) {
          console.log("Article matches search:", {
            id: article.id,
            title: title.substring(0, 50),
            matchesTitle,
            matchesContent,
            matchesExcerpt
          })
        }

        return matches
      })

      console.log("After search filter:", filtered.length, "articles")
    }

    // Filter by category
    if (filters.categoryId && filters.categoryId.trim()) {
      console.log("Applying category filter:", filters.categoryId)
      filtered = filtered.filter(article => article.categoryId === filters.categoryId)
      console.log("After category filter:", filtered.length, "articles")
    }

    // Pagination
    const total = filtered.length
    const totalPages = Math.ceil(total / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedArticles = filtered.slice(startIndex, endIndex)

    return {
      articles: paginatedArticles,
      pagination: {
        page: currentPage,
        totalPages,
        total
      }
    }
  }, [allArticles, filters, currentPage, itemsPerPage])

  const fetchAllArticles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch all articles without search/filter - we'll filter client-side
      const response: PaginatedResponse<Article> = await getArticles({
        page: 1,
        limit: 1000 // Get a large number to fetch all articles
      })

      console.log("Raw API response:", response)

      // Validate and clean the articles data
      const articles = response.data || []
      const validArticles = articles.filter(article => {
        if (!article || typeof article !== 'object') {
          console.warn("Invalid article object:", article)
          return false
        }

        if (!article.id) {
          console.warn("Article missing ID:", article)
          return false
        }

        // Ensure required string properties exist
        if (typeof article.title !== 'string') {
          console.warn("Article with invalid title:", article)
          article.title = article.title || ""
        }

        if (typeof article.content !== 'string') {
          console.warn("Article with invalid content:", article)
          article.content = article.content || ""
        }

        if (typeof article.excerpt !== 'string') {
          console.warn("Article with invalid excerpt:", article)
          article.excerpt = article.excerpt || ""
        }

        return true
      })

      console.log("Valid articles after filtering:", validArticles.length)
      setAllArticles(validArticles)
    } catch (error) {
      console.error("Failed to fetch articles:", error)
      setError("Failed to fetch articles. Please try again.")
      setAllArticles([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchCategories = useCallback(async () => {
    try {
      const categoriesData = await getCategories()
      // Extract the array from paginated response if needed
      const categoryList = Array.isArray(categoriesData)
        ? categoriesData
        : categoriesData.data || []
      setCategories(categoryList)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
    fetchAllArticles()
  }, [fetchCategories, fetchAllArticles])

  const handleFiltersChange = useCallback((newFilters: { search: string; categoryId: string }) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleCreate = useCallback(() => {
    setSelectedArticle(null)
    setFormDialogOpen(true)
  }, [])

  const handleEdit = useCallback((article: Article) => {
    setSelectedArticle(article)
    setFormDialogOpen(true)
  }, [])

  const handleDelete = useCallback((article: Article) => {
    setSelectedArticle(article)
    setDeleteDialogOpen(true)
  }, [])

  const handleSuccess = useCallback(() => {
    fetchAllArticles() // Refresh all articles after create/update/delete
  }, [fetchAllArticles])

  return (
    <AdminLayout>
      <AdminHeader title="Articles" description={`Total Articles: ${pagination.total}`}>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Article
        </Button>
      </AdminHeader>

      <div className="p-6">
        <div className="bg-white p-4 rounded-lg border mb-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Search Articles</label>
              <input
                type="text"
                placeholder="Enter search term..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    setCurrentPage(1)
                    fetchAllArticles()
                  }
                }}
              />
            </div>
            <div className="w-48">
              <label className="block text-sm font-medium mb-2">Category:</label>
              <select
                value={filters.categoryId}
                onChange={(e) => setFilters(prev => ({ ...prev, categoryId: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {
                setCurrentPage(1)
                fetchAllArticles()
              }}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Search
            </button>
            <button
              onClick={() => {
                setFilters({ search: "", categoryId: "" })
                setCurrentPage(1)
                fetchAllArticles()
              }}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Clear
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error}</p>
            <Button
              onClick={() => fetchAllArticles()}
              className="mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <>
            <AdminArticleTable
              articles={articles}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            {articles.length > 0 && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}

        <ArticleFormDialog
          open={formDialogOpen}
          onOpenChange={setFormDialogOpen}
          article={selectedArticle}
          onSuccess={handleSuccess}
        />

        <DeleteArticleDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          article={selectedArticle}
          onSuccess={handleSuccess}
        />
      </div>
    </AdminLayout>
  )
}
