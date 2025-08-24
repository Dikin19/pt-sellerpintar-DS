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
                await updateCategory(category.id, data)
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
