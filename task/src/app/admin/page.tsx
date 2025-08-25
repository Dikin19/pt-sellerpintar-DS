"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { ArticleGrid } from "@/components/articles/article-grid"
import { ArticleFilters } from "@/components/articles/article-filters"
import { RoleGuard } from "@/components/auth/role-guard"
import { RoleWelcomeBanner } from "@/components/auth/role-welcome-banner"
import { Pagination } from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { useAuth, usePermission } from "@/contexts/auth-context"
import { getArticles, getCategories } from "@/lib/api"
import type { Article, Category, PaginatedResponse } from "@/lib/type"
import { Loader2, LogOut, User, Shield } from "lucide-react"
import Image from "next/image"

export default function AdminPage() {
  const { user, logout, isLoading: authLoading } = useAuth()
  const { isAdmin } = usePermission()
  const [allArticles, setAllArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    search: "",
    categoryId: "",
  })

  const itemsPerPage = 9

  // Client-side filtering and pagination dengan logika yang sama seperti admin/articles
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

    // Filter by search term dengan debounce yang sudah dihandle di SearchInput
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

    // Pagination - hanya tampilkan pagination jika data lebih dari 9 item
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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const pollinationsUrl = user
    ? `https://image.pollinations.ai/prompt/${encodeURIComponent(
      user.username
    )}%20app%20logo?width=500&height=500&nologo=true`
    : null

  return (
    <RoleGuard allowedRoles={["Admin", "User"]}>
      <div className="min-h-screen bg-background">
        <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden">
                  {pollinationsUrl ? (
                    <Image
                      src={pollinationsUrl}
                      alt="App Logo"
                      width={32}  
                      height={32}  
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-500">N/A</span>
                  )}
                </div>
                <span className="font-semibold">
                  Seller Pintar Digital Asia
                </span>
              </div>

              <div className="flex items-center gap-4">
                {user && (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4" />
                      <span>{user.username}</span>
                      <span className="text-xs bg-blue-500 px-2 py-1 rounded-full">
                        {user.role}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={logout}
                      className="text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="text-center">
              <p className="text-blue-100 text-sm mb-2">Blog portal</p>
              <h1 className="text-4xl font-bold mb-4">The Journal: Design Resources, Interviews, and Industry News</h1>
              <p className="text-blue-100 text-lg">
                Your daily dose of design insights!
                {!isAdmin() && (
                  <span className="block text-sm mt-2 text-blue-200">
                    <Shield className="inline h-4 w-4 mr-1" />
                    You have read-only access to articles
                  </span>
                )}
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Role-based Welcome Banner */}
          <RoleWelcomeBanner />

          {/* Filters dengan debounce 400ms */}
          <ArticleFilters
            categories={categories}
            onFiltersChange={handleFiltersChange}
            initialSearch={filters.search}
            initialCategoryId={filters.categoryId}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <ArticleGrid articles={articles} isLoading={loading} />

              {/* Hanya tampilkan pagination jika data lebih dari 9 item */}
              {pagination.total > itemsPerPage && (
                <div className="mt-8">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </RoleGuard>
  )
}
