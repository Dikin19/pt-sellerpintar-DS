"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminHeader } from "@/components/admin/admin-header"
import { CategoryTable } from "@/components/admin/categories/category-table"
import { CategoryFormDialog } from "@/components/admin/categories/category-form-dialog"
import { DeleteCategoryDialog } from "@/components/admin/categories/delete-category-dialog"
import { RoleGuard } from "@/components/auth/role-guard"
import { Pagination } from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { AdminCategoryFilters } from "@/components/admin/categories/admin-category-filters"
import { Plus } from "lucide-react"
import { getCategories } from "@/lib/api"
import type { Category, PaginatedResponse } from "@/lib/type"
import { useDebounce } from "@/hooks/use-debounce"

export default function AdminCategoriesPage() {
    const [allCategories, setAllCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState("")

    const [formDialogOpen, setFormDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

    const itemsPerPage = 10
    const debouncedSearch = useDebounce(search, 400)

    // Client-side filtering and pagination - same pattern as admin/articles
    const { categories, pagination } = useMemo(() => {
        if (!allCategories || !Array.isArray(allCategories)) {
            return {
                categories: [],
                pagination: {
                    page: 1,
                    totalPages: 1,
                    total: 0
                }
            }
        }

        let filtered = [...allCategories]

        console.log("Starting filter with:", {
            totalCategories: allCategories.length,
            searchTerm: debouncedSearch
        })

        // Filter by search term
        if (debouncedSearch && debouncedSearch.trim()) {
            const searchTerm = debouncedSearch.toLowerCase().trim()
            console.log("Applying search filter:", searchTerm)

            filtered = filtered.filter(category => {
                const name = category.name || ""
                const matches = name.toLowerCase().includes(searchTerm)

                if (matches) {
                    console.log("Category matches search:", {
                        id: category.id,
                        name: name
                    })
                }

                return matches
            })

            console.log("After search filter:", filtered.length, "categories")
        }

        // Pagination
        const total = filtered.length
        const totalPages = Math.ceil(total / itemsPerPage)
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        const paginatedCategories = filtered.slice(startIndex, endIndex)

        return {
            categories: paginatedCategories,
            pagination: {
                page: currentPage,
                totalPages,
                total
            }
        }
    }, [allCategories, debouncedSearch, currentPage, itemsPerPage])

    const fetchAllCategories = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            // Fetch all categories without search/filter - we'll filter client-side
            const response: PaginatedResponse<Category> = await getCategories({
                page: 1,
                limit: 1000 // Get a large number to fetch all categories
            })

            console.log("Raw categories API response:", response)

            // Validate and clean the categories data
            const categoriesData = response.data || []
            const validCategories = categoriesData.filter(category => {
                if (!category || typeof category !== 'object') {
                    console.warn("Invalid category object:", category)
                    return false
                }

                if (!category.id) {
                    console.warn("Category missing ID:", category)
                    return false
                }

                // Ensure required string properties exist
                if (typeof category.name !== 'string') {
                    console.warn("Category with invalid name:", category)
                    category.name = category.name || ""
                }

                return true
            })

            console.log("Valid categories after filtering:", validCategories.length)
            setAllCategories(validCategories)
        } catch (error) {
            console.error("Failed to fetch categories:", error)
            setError("Failed to fetch categories. Please try again.")
            setAllCategories([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchAllCategories()
    }, [fetchAllCategories])

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page)
    }, [])

    const handleCreate = useCallback(() => {
        setSelectedCategory(null)
        setFormDialogOpen(true)
    }, [])

    const handleEdit = useCallback((category: Category) => {
        setSelectedCategory(category)
        setFormDialogOpen(true)
    }, [])

    const handleDelete = useCallback((category: Category) => {
        setSelectedCategory(category)
        setDeleteDialogOpen(true)
    }, [])

    const handleSuccess = useCallback(() => {
        fetchAllCategories() // Refresh all categories after create/update/delete
    }, [fetchAllCategories])

    if (loading) {
        return (
            <RoleGuard allowedRoles={["Admin"]}>
                <AdminLayout>
                    <div className="flex items-center justify-center min-h-[50vh] lg:min-h-[60vh]">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-sm sm:text-base lg:text-lg text-gray-600">Loading categories...</p>
                        </div>
                    </div>
                </AdminLayout>
            </RoleGuard>
        )
    }

    if (error) {
        return (
            <RoleGuard allowedRoles={["Admin"]}>
                <AdminLayout>
                    <div className="flex items-center justify-center min-h-[50vh] lg:min-h-[60vh] px-4">
                        <div className="text-center max-w-md mx-auto">
                            <p className="text-red-600 mb-4 text-sm sm:text-base lg:text-lg font-medium">{error}</p>
                            <Button onClick={fetchAllCategories} className="w-full sm:w-auto">
                                Try Again
                            </Button>
                        </div>
                    </div>
                </AdminLayout>
            </RoleGuard>
        )
    }

    return (
        <RoleGuard allowedRoles={["Admin"]}>
            <AdminLayout>
                <AdminHeader title="Categories" description={`Total Categories: ${pagination.total}`}>
                    <Button onClick={handleCreate} className="w-full sm:w-auto min-w-fit">
                        <Plus className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">New Category</span>
                        <span className="sm:hidden">New</span>
                    </Button>
                </AdminHeader>

                <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6">
                    {/* Search and Filters */}
                    <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg border shadow-sm">
                        <AdminCategoryFilters
                            search={search}
                            onSearchChange={setSearch}
                            onAddCategory={() => setFormDialogOpen(true)}
                            resultsInfo={debouncedSearch ? `Found ${pagination.total} result(s)` : undefined}
                        />
                    </div>

                    {/* Categories Table */}
                    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                        {categories.length === 0 ? (
                            <div className="text-center py-12 sm:py-16 lg:py-20 px-4">
                                <div className="max-w-md mx-auto">
                                    <p className="text-gray-600 text-base sm:text-lg lg:text-xl font-medium mb-2">
                                        {debouncedSearch ? "No categories found matching your search." : "No categories found."}
                                    </p>
                                    <p className="text-gray-500 text-sm sm:text-base mb-6">
                                        {debouncedSearch ? "Try adjusting your search terms." : "Create your first category to get started."}
                                    </p>
                                    {!debouncedSearch && (
                                        <Button onClick={handleCreate} className="w-full sm:w-auto">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create Category
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Table Container with horizontal scroll */}
                                <div className="overflow-x-auto">
                                    <div className="min-w-full">
                                        <CategoryTable
                                            categories={categories}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                        />
                                    </div>
                                </div>

                                {/* Pagination */}
                                {pagination.totalPages > 1 && (
                                    <div className="px-4 sm:px-6 py-4 border-t bg-gray-50">
                                        <div className="flex justify-center">
                                            <Pagination
                                                currentPage={currentPage}
                                                totalPages={pagination.totalPages}
                                                onPageChange={handlePageChange}
                                            />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Dialogs */}
                <CategoryFormDialog
                    open={formDialogOpen}
                    onOpenChange={setFormDialogOpen}
                    category={selectedCategory}
                    onSuccess={handleSuccess}
                />

                <DeleteCategoryDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    category={selectedCategory}
                    onSuccess={handleSuccess}
                />
            </AdminLayout>
        </RoleGuard>
    )
}
