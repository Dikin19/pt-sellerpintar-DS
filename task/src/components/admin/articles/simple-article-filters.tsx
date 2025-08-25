"use client"

import { useState} from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"
import type { Category, PaginatedResponse } from "@/lib/type"

interface SimpleArticleFiltersProps {
    categories?: Category[] | PaginatedResponse<Category>
    onFiltersChange: (filters: { search: string; categoryId: string }) => void
    initialSearch?: string
    initialCategoryId?: string
}

export function SimpleArticleFilters({
    categories = [],
    onFiltersChange,
    initialSearch = "",
    initialCategoryId = "",
}: SimpleArticleFiltersProps) {
    const [search, setSearch] = useState(initialSearch)
    const [categoryId, setCategoryId] = useState(initialCategoryId)

    // Extract categories array from different possible response formats
    const categoryList: Category[] = Array.isArray(categories)
        ? categories
        : categories && typeof categories === 'object' && 'data' in categories && Array.isArray(categories.data)
            ? categories.data
            : []

    const handleSearch = () => {
        console.log("Manual search triggered with:", { search: search.trim(), categoryId })
        onFiltersChange({
            search: search.trim(),
            categoryId: categoryId || "",
        })
    }

    const handleClear = () => {
        setSearch("")
        setCategoryId("")
        onFiltersChange({
            search: "",
            categoryId: "",
        })
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Type to search articles..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="pl-10"
                        type="text"
                    />
                </div>

                <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        {categoryList.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="flex gap-2">
                    <Button onClick={handleSearch} className="px-6">
                        Search
                    </Button>
                    <Button onClick={handleClear} variant="outline" className="px-4">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Show current filters */}
            {(search || categoryId) && (
                <div className="flex flex-wrap gap-2 text-sm">
                    <span className="text-muted-foreground">Active filters:</span>
                    {search && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Search: "{search}"
                        </span>
                    )}
                    {categoryId && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                            Category: {categoryList.find(c => c.id === categoryId)?.name || "Unknown"}
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}
