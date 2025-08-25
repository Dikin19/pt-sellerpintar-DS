"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Category } from "@/lib/type"

interface CategoryTableProps {
    categories: Category[]
    onEdit?: (category: Category) => void
    onDelete?: (category: Category) => void
}

export function CategoryTable({ categories, onEdit, onDelete }: CategoryTableProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    if (categories.length === 0) {
        return (
            <div className="text-center py-8 sm:py-12 lg:py-16 px-4">
                <p className="text-gray-600 text-base sm:text-lg lg:text-xl font-medium mb-2">No categories found.</p>
                <p className="text-gray-500 text-sm sm:text-base">Create your first category to get started.</p>
            </div>
        )
    }

    return (
        <div className="w-full">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="min-w-[150px]">Name</TableHead>
                        <TableHead className="hidden sm:table-cell min-w-[120px]">Created</TableHead>
                        <TableHead className="hidden md:table-cell min-w-[120px]">Updated</TableHead>
                        <TableHead className="w-12"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories
                        .filter(category => {
                            // Filter out categories without valid IDs
                            const hasValidId = category.id;
                            return hasValidId && category.name;
                        })
                        .map((category) => {
                            return (
                                <TableRow key={category.id}>
                                    <TableCell className="p-2 sm:p-4">
                                        <div className="space-y-1">
                                            <p className="font-medium text-sm sm:text-base break-words">
                                                {category.name}
                                            </p>
                                            {/* Show dates on mobile when hidden in separate columns */}
                                            <div className="sm:hidden space-y-1 text-xs text-muted-foreground">
                                                <div>Created: {formatDate(category.createdAt)}</div>
                                                <div>Updated: {formatDate(category.updatedAt)}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell p-2 sm:p-4 text-xs sm:text-sm text-muted-foreground">
                                        {formatDate(category.createdAt)}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell p-2 sm:p-4 text-xs sm:text-sm text-muted-foreground">
                                        {formatDate(category.updatedAt)}
                                    </TableCell>
                                    <TableCell className="p-2 sm:p-4">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => onEdit?.(category)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onDelete?.(category)} className="text-destructive">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                </TableBody>
            </Table>
        </div>
    )
}
