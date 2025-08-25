"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface AdminCategoryFiltersProps {
    search: string
    onSearchChange: (value: string) => void
    onAddCategory?: () => void
    resultsInfo?: string
}

export function AdminCategoryFilters({
    search,
    onSearchChange,
    resultsInfo,
}: AdminCategoryFiltersProps) {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value)
    }

    const handleClearSearch = () => {
        onSearchChange("")
    }

    return (
        <div className="bg-white p-3 sm:p-4 rounded-lg border mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3 sm:h-4 sm:w-4" />
                    <Input
                        placeholder="Search categories by name..."
                        value={search}
                        onChange={handleSearchChange}
                        className="pl-8 sm:pl-10 pr-8 sm:pr-10 text-sm sm:text-base h-9 sm:h-10"
                        type="text"
                    />
                    {search && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearSearch}
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8 p-0"
                        >
                            <X className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                    )}
                </div>
            </div>

            {resultsInfo && (
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                    {resultsInfo}
                </p>
            )}
        </div>
    )
}
