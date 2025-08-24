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
import { logCategoryDebugInfo } from "@/lib/category-utils"
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
    formState: { errors, isValid, isDirty },
    reset,
    setValue,
    watch,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
    },
    mode: "onChange", // Enable real-time validation
  })

  const watchedName = watch("name")

  useEffect(() => {
    if (category) {
      setValue("name", category.name, { shouldValidate: true, shouldDirty: true })
    } else {
      reset({ name: "" })
    }
  }, [category, setValue, reset])

  const onSubmit = async (data: CategoryFormData) => {
    try {
      setIsSubmitting(true)

      if (isEditing && category) {
        const categoryId = category.id;

        if (!categoryId || categoryId.toString().trim() === "") {
          throw new Error("Category ID is missing or empty")
        }

        // Log details for debugging
        console.log("Updating category:", {
          id: categoryId,
          originalCategory: category,
          updateData: data,
          categoryType: typeof categoryId,
        });

        logCategoryDebugInfo(category, "Before update");

        await updateCategory(categoryId.toString(), data)
        toast({
          title: "Success",
          description: "Category updated successfully",
        })
      } else {
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

      // Show more specific error messages
      let errorMessage = "Failed to save category";

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
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
            {watchedName && watchedName.trim() && !errors.name && (
              <p className="text-sm text-green-600">✓ Valid category name</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isValid || (!isDirty && !isEditing)}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Category" : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
