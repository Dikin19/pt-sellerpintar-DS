"use client"

import { useState, useEffect, useCallback } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminHeader } from "@/components/admin/admin-header"
import { CategoryTable } from "@/components/admin/categories/category-table"
import { CategoryFormDialog } from "@/components/admin/categories/category-form-dialog"
import { DeleteCategoryDialog } from "@/components/admin/categories/delete-category-dialog"
import { RoleGuard } from "@/components/auth/role-guard"
import { SearchInput } from "@/components/ui/search-input"
import { Pagination } from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { Loading } from "@/components/ui/loading"
import { getCategories } from "@/lib/api"
import type { Category, PaginatedResponse } from "@/lib/type"
import { Plus } from "lucide-react"

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        total: 0,
    })
    const [search, setSearch] = useState("")

    const [formDialogOpen, setFormDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

    const fetchCategories = useCallback(
        async (page = 1) => {
            setLoading(true)
            try {
                const response: PaginatedResponse<Category> = await getCategories({
                    search,
                    page,
                    limit: 10,
                })

                console.log("Categories API response:", response)
                console.log("Categories data:", response.data)

                // Log each category to check their structure
                if (response.data && Array.isArray(response.data)) {
                    response.data.forEach((cat, index) => {
                        console.log(`Category ${index}:`, cat)
                        console.log(`Category ${index} ID:`, cat.id)
                    })
                }

                setCategories(response.data || [])

                // Use optional chaining and nullish coalescing to handle missing pagination
                setPagination({
                    page: response.pagination?.page ?? page,
                    totalPages: response.pagination?.totalPages ?? 1,
                    total: response.pagination?.total ?? (response.data?.length || 0),
                })
            } catch (error) {
                console.error("Failed to fetch categories:", error)
                // Reset to empty state on error
                setCategories([])
                setPagination({
                    page: 1,
                    totalPages: 1,
                    total: 0,
                })
            } finally {
                setLoading(false)
            }
        },
        [search],
    )

    useEffect(() => {
        fetchCategories(1)
    }, [fetchCategories])

    const handleSearchChange = useCallback((value: string) => {
        setSearch(value)
    }, [])

    const handlePageChange = useCallback(
        (page: number) => {
            fetchCategories(page)
        },
        [fetchCategories],
    )

    const handleCreate = () => {
        setSelectedCategory(null)
        setFormDialogOpen(true)
    }

    const handleEdit = (category: Category) => {
        console.log("=== HANDLE EDIT DEBUG ===")
        console.log("handleEdit called with category:", JSON.stringify(category, null, 2))
        console.log("Category keys:", Object.keys(category))
        console.log("Category.id:", category.id)
        console.log("typeof category.id:", typeof category.id)
        console.log("Setting selectedCategory state...")
        setSelectedCategory(category)
        console.log("Opening form dialog...")
        setFormDialogOpen(true)
    }

    const handleDelete = (category: Category) => {
        setSelectedCategory(category)
        setDeleteDialogOpen(true)
    }

    const handleSuccess = () => {
        fetchCategories(pagination.page)
    }

    return (
        <RoleGuard allowedRoles={["Admin"]}>
            <AdminLayout>
                <AdminHeader title="Categories" description="Manage article categories">
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Category
                    </Button>
                </AdminHeader>

                <div className="p-6">
                    <div className="mb-6 max-w-md">
                        <SearchInput
                            value={search}
                            onSearch={handleSearchChange}
                            placeholder="Search categories..."
                            debounceMs={400}
                        />
                    </div>

                    {loading ? (
                        <Loading text="Loading categories..." />
                    ) : (
                        <>
                            <CategoryTable categories={categories} onEdit={handleEdit} onDelete={handleDelete} />
                            <Pagination
                                currentPage={pagination.page}
                                totalPages={pagination.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}
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
