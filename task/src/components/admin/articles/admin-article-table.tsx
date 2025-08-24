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
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No articles found.</p>
        <p className="text-muted-foreground text-sm mt-2">
          {articles?.length === 0 ? "Try adjusting your search criteria or create your first article." : "Create your first article to get started."}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden ml-50px">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Thumbnails</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Created at</TableHead>
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
                <TableCell>
                  <div className="w-12 h-12 relative rounded overflow-hidden">
                    <Image
                      src={pollinationsUrl || "/placeholder.svg"}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-medium text-sm">{article.title}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {article.category.name}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
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
