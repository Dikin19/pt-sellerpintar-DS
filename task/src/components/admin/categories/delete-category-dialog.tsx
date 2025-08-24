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
import { deleteCategory } from "@/lib/api"
import type { Category } from "@/lib/type"
import { logCategoryDebugInfo } from "@/lib/category-utils"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DeleteCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category | null
  onSuccess: () => void
}

export function DeleteCategoryDialog({ open, onOpenChange, category, onSuccess }: DeleteCategoryDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!category) return

    setIsDeleting(true)
    try {
      // Log details for debugging
      console.log("Deleting category:", {
        id: category.id,
        name: category.name,
        category: category,
        idType: typeof category.id,
      });

      logCategoryDebugInfo(category, "Before delete");

      await deleteCategory(category.id)
      toast({
        title: "Success",
        description: "Category deleted successfully",
      })
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      console.error("Delete category error:", error)

      // Show more specific error messages
      let errorMessage = "Failed to delete category";

      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
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
          <AlertDialogTitle>Delete Category</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{category?.name}"? This action cannot be undone. All articles in this
            category will need to be reassigned.
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
