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
import { Input } from "@/components/ui/input"
import { AdminCategoryFilters } from "@/components/admin/categories/admin-category-filters"
import { Plus, Search } from "lucide-react"
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

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        console.log("Search input changed to:", value)
        setSearch(value)
        setCurrentPage(1) // Reset to first page when search changes

        // If user clears the search, reset immediately
        if (!value.trim()) {
            console.log("Search cleared")
        }
    }, [])

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
                    <div className="flex items-center justify-center h-64">
                        <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <span>Loading categories...</span>
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
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <p className="text-red-600 mb-4">{error}</p>
                            <Button onClick={fetchAllCategories}>Try Again</Button>
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
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Category
                    </Button>
                </AdminHeader>

                <div className="p-6">
                    {/* Search and Filters */}
                    <AdminCategoryFilters
                        search={search}
                        onSearchChange={setSearch}
                        onAddCategory={() => setFormDialogOpen(true)}
                        resultsInfo={debouncedSearch ? `Found ${pagination.total} result(s)` : undefined}
                    />

                    {/* Categories Table */}
                    <div className="bg-white rounded-lg border">
                        {categories.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground text-lg">
                                    {debouncedSearch ? "No categories found matching your search." : "No categories found."}
                                </p>
                                <p className="text-muted-foreground text-sm mt-2">
                                    {debouncedSearch ? "Try adjusting your search terms." : "Create your first category to get started."}
                                </p>
                                {!debouncedSearch && (
                                    <Button onClick={handleCreate} className="mt-4">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Category
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <>
                                <CategoryTable 
                                    categories={categories} 
                                    onEdit={handleEdit} 
                                    onDelete={handleDelete} 
                                />
                                {pagination.totalPages > 1 && (
                                    <div className="p-4 border-t">
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={pagination.totalPages}
                                            onPageChange={handlePageChange}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

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
