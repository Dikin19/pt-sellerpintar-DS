"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "./input"
import { cn } from "@/lib/utils"

interface SearchInputProps {
    value?: string
    placeholder?: string
    onSearch: (value: string) => void
    debounceMs?: number
    className?: string
}

export function SearchInput({
    value = "",
    placeholder = "Search...",
    onSearch,
    debounceMs = 300,
    className
}: SearchInputProps) {
    const [searchValue, setSearchValue] = useState(value)

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(searchValue)
        }, debounceMs)

        return () => clearTimeout(timer)
    }, [searchValue, onSearch, debounceMs])

    useEffect(() => {
        setSearchValue(value)
    }, [value])

    return (
        <div className={cn("relative", className)}>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={placeholder}
                className="pl-10"
            />
        </div>
    )
}
