"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus, X } from "lucide-react"

interface AdminCategoryFiltersProps {
    search: string
    onSearchChange: (value: string) => void
    onAddCategory?: () => void
    resultsInfo?: string
}

export function AdminCategoryFilters({
    search,
    onSearchChange,
    onAddCategory,
    resultsInfo,
}: AdminCategoryFiltersProps) {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value)
    }

    const handleClearSearch = () => {
        onSearchChange("")
    }

    return (
        <div className="bg-white p-4 rounded-lg border mb-6">
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search categories by name..."
                        value={search}
                        onChange={handleSearchChange}
                        className="pl-10 pr-10"
                        type="text"
                    />
                    {search && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearSearch}
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            {resultsInfo && (
                <p className="text-sm text-muted-foreground mt-2">
                    {resultsInfo}
                </p>
            )}
        </div>
    )
}
