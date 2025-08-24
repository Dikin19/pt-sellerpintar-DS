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
            <div className="text-center py-12 bg-white rounded-lg border">
                <p className="text-muted-foreground text-lg">No categories found.</p>
                <p className="text-muted-foreground text-sm mt-2">Create your first category to get started.</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Updated</TableHead>
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
                                    <TableCell>
                                        <p className="font-medium text-sm">{category.name}</p>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {formatDate(category.createdAt)}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {formatDate(category.updatedAt)}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
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
