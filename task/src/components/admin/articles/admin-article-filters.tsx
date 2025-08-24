"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import type { Category, PaginatedResponse } from "@/lib/type"
import { useDebounce } from "@/hooks/use-debounce"

interface AdminArticleFiltersProps {
  categories?: Category[] | PaginatedResponse<Category>
  onFiltersChange: (filters: { search: string; categoryId: string }) => void
  initialSearch?: string
  initialCategoryId?: string
}

export function AdminArticleFilters({
  categories = [],
  onFiltersChange,
  initialSearch = "",
  initialCategoryId = "",
}: AdminArticleFiltersProps) {
  const [search, setSearch] = useState(initialSearch)
  const [categoryId, setCategoryId] = useState(initialCategoryId)

  const debouncedSearch = useDebounce(search, 500)

  // Memoize the callback to prevent unnecessary re-renders
  const handleFiltersChange = useCallback(() => {
    const filters = {
      search: debouncedSearch.trim(),
      categoryId: categoryId || "",
    }
    console.log("Filters changing:", filters)
    onFiltersChange(filters)
  }, [debouncedSearch, categoryId, onFiltersChange])

  useEffect(() => {
    handleFiltersChange()
  }, [handleFiltersChange])

  // Extract categories array from different possible response formats
  const categoryList: Category[] = Array.isArray(categories)
    ? categories
    : categories && typeof categories === 'object' && 'data' in categories && Array.isArray(categories.data)
      ? categories.data
      : []

  // Handle search input change with immediate state update
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    console.log("Search input changed to:", value)
    setSearch(value)

    // If user clears the search, trigger immediate filter update
    if (!value.trim()) {
      console.log("Search cleared, triggering immediate update")
      onFiltersChange({
        search: "",
        categoryId: categoryId || "",
      })
    }
  }, [categoryId, onFiltersChange])

  // Handle category selection change
  const handleCategoryChange = useCallback((value: string) => {
    setCategoryId(value)
    console.log("Category value changed:", value)
  }, [])

  // Handle reset/clear filters
  const handleClearFilters = useCallback(() => {
    setSearch("")
    setCategoryId("")
    console.log("Filters cleared")
  }, [])

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search articles by title or content..."
          value={search}
          onChange={handleSearchChange}
          className="pl-10"
          type="text"
        />
      </div>
      <div className="flex gap-2">
        <Select value={categoryId} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categoryList.length > 0 ? (
              categoryList.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="" disabled>
                No categories available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        <Button
          onClick={handleClearFilters}
          variant="outline"
          className="px-4"
          disabled={!search && !categoryId}
        >
          Clear All
        </Button>
      </div>
    </div>
  )
}
