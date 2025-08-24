"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { categoryFormSchema, type CategoryFormData } from "@/lib/validations"
import { createCategory, updateCategory } from "@/lib/api"
import type { Category } from "@/lib/type"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
  onSuccess: () => void
}

export function CategoryFormDialog({ open, onOpenChange, category, onSuccess }: CategoryFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const isEditing = !!category

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
    },
  })

  useEffect(() => {
    if (category) {
      setValue("name", category.name)
    } else {
      reset()
    }
  }, [category, setValue, reset])

  const onSubmit = async (data: CategoryFormData) => {
    try {
      setIsSubmitting(true)

      if (isEditing && category) {
        console.log("=== CATEGORY EDIT DEBUG ===")
        console.log("Full category object:", JSON.stringify(category, null, 2))
        console.log("Category keys:", Object.keys(category))
        console.log("Category.id:", category.id)
        console.log("typeof category.id:", typeof category.id)
        console.log("category.id === undefined:", category.id === undefined)
        console.log("category.id === null:", category.id === null)
        console.log("category.id === '':", category.id === "")

        // Check for alternative ID fields
        const possibleIds = {
          id: category.id,
          _id: (category as any)._id,
          categoryId: (category as any).categoryId,
          ID: (category as any).ID
        }
        console.log("Possible ID fields:", possibleIds)

        // Find the first non-empty ID
        const categoryId = category.id ||
          (category as any)._id ||
          (category as any).categoryId ||
          (category as any).ID;

        console.log("Selected categoryId:", categoryId)
        console.log("typeof categoryId:", typeof categoryId)

        if (!categoryId || categoryId.toString().trim() === "") {
          console.error("ERROR: No valid category ID found!")
          throw new Error(`Category ID is missing or empty. Available fields: ${Object.keys(category).join(', ')}`)
        }

        console.log("Proceeding with update using ID:", categoryId)
        await updateCategory(categoryId.toString(), data)
        toast({
          title: "Success",
          description: "Category updated successfully",
        })
      } else {
        console.log("Creating new category")
        await createCategory(data)
        toast({
          title: "Success",
          description: "Category created successfully",
        })
      }

      onSuccess()
      onOpenChange(false)
      reset()
    } catch (error: any) {
      console.error("Category form error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save category",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Category" : "Create New Category"}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the category details below." : "Fill in the form below to create a new category."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter category name"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Category" : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
