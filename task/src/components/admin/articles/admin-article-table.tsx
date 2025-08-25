"use client"

import Image from "next/image"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Article } from "@/lib/type"
import { formatDistanceToNow } from "date-fns"

interface AdminArticleTableProps {
  articles: Article[]
  onEdit?: (article: Article) => void
  onDelete?: (article: Article) => void
}

export function AdminArticleTable({ articles, onEdit, onDelete }: AdminArticleTableProps) {
  console.log("AdminArticleTable received articles:", articles);

  // Validate that we're actually getting articles
  const validArticles = articles?.filter(item => {
    if (!item.title) {
      console.warn("Invalid article found (missing title):", item);
      return false;
    }
    if ((item as any).name && !item.content) {
      console.warn("This looks like a category, not an article:", item);
      return false;
    }
    return true;
  }) || [];

  if (!validArticles || validArticles.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 lg:py-16 px-4">
        <p className="text-gray-600 text-base sm:text-lg lg:text-xl font-medium mb-2">No articles found.</p>
        <p className="text-gray-500 text-sm sm:text-base">
          {articles?.length === 0 ? "Try adjusting your search criteria or create your first article." : "Create your first article to get started."}
        </p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 sm:w-20">Image</TableHead>
            <TableHead className="min-w-[200px]">Title</TableHead>
            <TableHead className="hidden sm:table-cell min-w-[120px]">Category</TableHead>
            <TableHead className="hidden md:table-cell min-w-[140px]">Created</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {validArticles.map((article) => {
            const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
              article.title
            )}%20app%20logo?width=500&height=500&nologo=true`

            return (
              <TableRow key={article.id}>
                <TableCell className="p-2 sm:p-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 relative rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={pollinationsUrl || "/placeholder.svg"}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="p-2 sm:p-4">
                  <div className="space-y-1">
                    <p className="font-medium text-sm sm:text-base line-clamp-2 break-words">
                      {article.title}
                    </p>
                    {/* Show category on mobile when hidden in separate column */}
                    <div className="sm:hidden">
                      <Badge variant="secondary" className="text-xs">
                        {article.category.name}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell p-2 sm:p-4">
                  <Badge variant="secondary" className="text-xs">
                    {article.category.name}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell p-2 sm:p-4 text-xs sm:text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
                </TableCell>
                <TableCell className="p-2 sm:p-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit?.(article)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete?.(article)}
                        className="text-destructive"
                      >
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
