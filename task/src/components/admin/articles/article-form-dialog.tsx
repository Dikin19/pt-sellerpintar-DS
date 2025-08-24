'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useArticles } from '@/hooks/use-articles'
import { useCategories } from '@/hooks/use-categories'
import { validateArticleForm, displayValidationResults, displayFormErrors } from '@/lib/form-validation'
import { showSuccessToast, showErrorToast } from '@/lib/toast-utils'
import { articleFormSchema } from '@/lib/validations'
import type { Article } from '@/lib/type'
import { Loader2 } from 'lucide-react'

// Define the form data type based on the actual schema
type ArticleFormFields = {
  title: string
  content: string
  categoryId: string
}

interface ArticleFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  article?: Article | null
  onSuccess?: () => void
}

export function ArticleFormDialog({
  open,
  onOpenChange,
  article,
  onSuccess
}: ArticleFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { createArticle, updateArticle } = useArticles()
  const { categories, refetch: refetchCategories } = useCategories()

  const isEditing = !!article

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<ArticleFormFields>({
    resolver: zodResolver(articleFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      content: '',
      categoryId: ''
    }
  })

  // Load categories when dialog opens
  useEffect(() => {
    if (open) {
      refetchCategories()
    }
  }, [open, refetchCategories])

  // Reset form when dialog opens/closes or article changes
  useEffect(() => {
    if (open) {
      if (article) {
        // Editing existing article
        reset({
          title: article.title || '',
          content: article.content || '',
          categoryId: article.categoryId || ''
        })
      } else {
        // Creating new article
        reset({
          title: '',
          content: '',
          categoryId: ''
        })
      }
    }
  }, [open, article, reset])

  const onSubmit = async (data: ArticleFormFields) => {
    try {
      setIsSubmitting(true)

      // Client-side validation with enhanced checks
      const validationResult = validateArticleForm(data)

      // Display validation results
      if (!validationResult.isValid) {
        displayValidationResults(validationResult)
        return
      }

      // Display warnings if any (non-blocking)
      if (validationResult.warnings.length > 0) {
        displayValidationResults(validationResult, true)
      }

      let result

      // Create compatible data object for API
      const apiData = {
        title: data.title,
        content: data.content,
        categoryId: data.categoryId,
        excerpt: data.content.substring(0, 150) + '...' // Auto-generate excerpt from content
      }

      if (isEditing && article) {
        // Update existing article
        result = await updateArticle(article.id, apiData)
        if (result) {
          showSuccessToast('Article updated successfully!')
        }
      } else {
        // Create new article
        result = await createArticle(apiData)
        if (result) {
          showSuccessToast('Article created successfully!')
        }
      }

      if (result) {
        onOpenChange(false)
        onSuccess?.()
      }

    } catch (error) {
      console.error('Article form submission error:', error)
      showErrorToast('Failed to save article. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Article' : 'Create New Article'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title *
            </Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Enter article title"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Category Field */}
          <div className="space-y-2">
            <Label htmlFor="categoryId" className="text-sm font-medium">
              Category *
            </Label>
            <Select
              value={watch('categoryId')}
              onValueChange={(value) => setValue('categoryId', value)}
            >
              <SelectTrigger className={errors.categoryId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-sm text-red-600">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Content Field */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium">
              Content *
            </Label>
            <Textarea
              id="content"
              {...register('content')}
              placeholder="Write your article content here..."
              rows={10}
              className={`resize-none ${errors.content ? 'border-red-500' : ''}`}
            />
            {errors.content && (
              <p className="text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[100px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Update Article' : 'Create Article'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
