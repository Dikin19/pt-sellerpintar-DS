"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { articleUpdateSchema, type ArticleUpdateData } from "@/lib/validations"
import { articlesManagementApi } from "@/lib/api"
import type { Article, Category } from "@/lib/type"
import { Loader2, Eye } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ArticleFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  article?: Article | null
  categories: Category[] | { data: Category[] } // biar fleksibel
  onSuccess: () => void
}

export function ArticleFormDialog({
  open,
  onOpenChange,
  article,
  categories = [],
  onSuccess,
}: ArticleFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("form")
  const isEditing = !!article

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ArticleUpdateData>({
    resolver: zodResolver(articleUpdateSchema),
    defaultValues: {
      title: "",
      content: "",
      categoryId: "",
    },
  })

  const watchedValues = watch()

  // Reset form when dialog opens/closes or article changes
  useEffect(() => {
    if (open) {
      if (article) {
        // Editing existing article
        reset({
          title: article.title || "",
          content: article.content || "",
          categoryId: String(article.category?.id || article.categoryId || ""),
        })
      } else {
        // Creating new article
        reset({
          title: "",
          content: "",
          categoryId: "",
        })
      }
      setActiveTab("form")
    }
  }, [open, article, reset])

  const onSubmit = async (data: ArticleUpdateData) => {
    setIsSubmitting(true)
    try {
      if (isEditing && article) {
        // For updating existing articles
        await articlesManagementApi.updateArticle(article.id, data)
        toast({
          title: "Success",
          description: "Article updated successfully",
        })
      } else {
        // For creating new articles - backend only needs title, content, categoryId
        const createData = {
          title: data.title.trim(),
          content: data.content.trim(),
          categoryId: data.categoryId,
          // Remove excerpt and thumbnail since backend doesn't accept them
        }

        console.log("Creating article with data:", createData)
        await articlesManagementApi.createArticle(createData)
        toast({
          title: "Success",
          description: "Article created successfully",
        })
      }
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Article submission error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save article. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }  // ✅ pastikan categories array
  const categoryList: Category[] = Array.isArray(categories) ? categories : (categories as any)?.data || []
  const selectedCategory = categoryList.find(
    (cat: Category) => String(cat.id) === String(watchedValues.categoryId)
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Article" : "Create Article"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the article details below." : "Create a new article for your blog."}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form">Edit</TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          {/* --- FORM TAB --- */}
          <TabsContent value="form" className="mt-4 overflow-y-auto max-h-[60vh]">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter article title (minimum 5 characters)"
                  {...register("title")}
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId">Category *</Label>
                <Select
                  value={watchedValues.categoryId}
                  onValueChange={(value) => setValue("categoryId", value)}
                >
                  <SelectTrigger className={errors.categoryId ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryList.length > 0 ? (
                      categoryList.map((category: Category) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        No categories available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.categoryId && (
                  <p className="text-sm text-destructive">{errors.categoryId.message}</p>
                )}
                {categoryList.length === 0 && (
                  <p className="text-sm text-amber-600">No categories found. Please create a category first.</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  placeholder="Write your article content here (minimum 50 characters)..."
                  rows={8}
                  {...register("content")}
                  className={errors.content ? "border-destructive" : ""}
                />
                {errors.content && <p className="text-sm text-destructive">{errors.content.message}</p>}
                <p className="text-sm text-gray-500">
                  {watchedValues.content ? `${watchedValues.content.length} characters` : "0 characters"}
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setActiveTab("preview")}
                  disabled={!watchedValues.title || !watchedValues.content || !watchedValues.categoryId}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !watchedValues.title || !watchedValues.content || !watchedValues.categoryId}
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEditing ? "Update Article" : "Create Article"}
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* --- PREVIEW TAB --- */}
          <TabsContent value="preview" className="mt-4 overflow-y-auto max-h-[60vh]">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {selectedCategory && <Badge variant="secondary">{selectedCategory.name}</Badge>}
                  {!selectedCategory && watchedValues.categoryId && (
                    <Badge variant="outline">Category Selected</Badge>
                  )}
                </div>
                <CardTitle className="text-2xl">
                  {watchedValues.title || "Article Title"}
                </CardTitle>
                {watchedValues.content && (
                  <p className="text-sm text-gray-600">
                    Auto-generated excerpt: {watchedValues.content.substring(0, 200)}
                    {watchedValues.content.length > 200 ? "..." : ""}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap">
                    {watchedValues.content || "Article content will appear here..."}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t text-sm text-gray-500">
                  <p><strong>Characters:</strong> {watchedValues.content?.length || 0}</p>
                  <p><strong>Words:</strong> {watchedValues.content ? watchedValues.content.trim().split(/\s+/).length : 0}</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setActiveTab("form")}>
                Back to Edit
              </Button>
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting || !watchedValues.title || !watchedValues.content || !watchedValues.categoryId}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Update Article" : "Create Article"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
