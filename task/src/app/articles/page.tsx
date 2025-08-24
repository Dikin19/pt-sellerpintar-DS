"use client"

import { useState, useEffect, useCallback } from "react"
import { ArticleGrid } from "@/components/articles/article-grid"
import { ArticleFilters } from "@/components/articles/article-filters"
import { RoleGuard } from "@/components/auth/role-guard"
import { RoleWelcomeBanner } from "@/components/auth/role-welcome-banner"
import { Pagination } from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { useAuth, usePermission } from "@/contexts/auth-context"
import { getArticles, getCategories } from "@/lib/api"
import type { Article, Category, PaginatedResponse } from "@/lib/type"
import Link from "next/link"
import { Loader2, LogOut, User, Shield } from "lucide-react"

export default function ArticlesPage() {
  const { user, logout, isLoading: authLoading } = useAuth()
  const { isAdmin } = usePermission()
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  })
  const [filters, setFilters] = useState({
    search: "",
    categoryId: "",
  })

  const fetchArticles = useCallback(
    async (page = 1) => {
      setLoading(true)
      try {
        const response: PaginatedResponse<Article> = await getArticles({
          ...filters,
          page,
          limit: 9,
        })

        setArticles(response.data ?? [])

        // Use optional chaining for consistent pagination handling
        setPagination({
          page: response.pagination?.page ?? page,
          totalPages: response.pagination?.totalPages ?? 1,
          total: response.pagination?.total ?? (response.data?.length ?? 0),
        })
      } catch (error) {
        console.error("Failed to fetch articles:", error)
      } finally {
        setLoading(false)
      }
    },
    [filters],
  )


  const fetchCategories = useCallback(async () => {
    try {
      const categoriesData = await getCategories()
      setCategories(categoriesData.data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchArticles(1)
  }, [fetchArticles])

  const handleFiltersChange = useCallback((newFilters: { search: string; categoryId: string }) => {
    setFilters(newFilters)
  }, [])

  const handlePageChange = useCallback(
    (page: number) => {
      fetchArticles(page)
    },
    [fetchArticles],
  )

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <RoleGuard allowedRoles={["Admin", "User"]}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">L</span>
                </div>
                <span className="font-semibold">Logoipsum</span>
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
                      {isAdmin() && (
                        <Button variant="secondary" size="sm" onClick={() => (window.location.href = "/admin")}>
                          Admin Panel
                        </Button>
                      )}
                      <Button variant="secondary" size="sm" asChild>
                        <Link href="/permissions">View Permissions</Link>
                      </Button>
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
                    You have read-only access to articles and categories
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

          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing: {pagination.total} of {pagination.total} articles
              {!isAdmin() && (
                <span className="ml-2 text-sm text-orange-600">
                  (Read-only mode - User access)
                </span>
              )}
            </p>
          </div>

          <ArticleFilters categories={categories} onFiltersChange={handleFiltersChange} />

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <ArticleGrid articles={articles} />
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </main>
      </div>
    </RoleGuard>
  )
}
