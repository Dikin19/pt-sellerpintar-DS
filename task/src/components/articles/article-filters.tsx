"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchInput } from "@/components/ui/search-input"
import type { Category } from "@/lib/type"

interface ArticleFiltersProps {
  categories: Category[]
  onFiltersChange: (filters: { search: string; categoryId: string }) => void
  initialSearch?: string
  initialCategoryId?: string
}

export function ArticleFilters({
  categories,
  onFiltersChange,
  initialSearch = "",
  initialCategoryId = "",
}: ArticleFiltersProps) {
  const [search, setSearch] = useState(initialSearch)
  const [categoryId, setCategoryId] = useState(initialCategoryId)

  useEffect(() => {
    onFiltersChange({
      search,
      categoryId,
    })
  }, [search, categoryId, onFiltersChange])

  const handleSearchChange = (value: string) => {
    setSearch(value)
  }

  const handleCategoryChange = (value: string) => {
    setCategoryId(value === "all" ? "" : value)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="flex-1">
        <SearchInput
          value={search}
          onSearch={handleSearchChange}
          placeholder="Search articles..."
          debounceMs={400}
        />
      </div>
      <Select value={categoryId || "all"} onValueChange={handleCategoryChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
