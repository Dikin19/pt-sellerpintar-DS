"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { articlesManagementApi } from "@/lib/api"
import type { Article } from "@/lib/type"
import { Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface DeleteArticleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  article: Article | null
  onSuccess: () => void
}

export function DeleteArticleDialog({ open, onOpenChange, article, onSuccess }: DeleteArticleDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!article) return

    setIsDeleting(true)
    try {
      await articlesManagementApi.deleteArticle(article.id)
      toast({
        title: "Success",
        description: "Article deleted successfully",
      })
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete article",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Article</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{article?.title}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
