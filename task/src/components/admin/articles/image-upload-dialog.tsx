"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Upload, Loader2, X } from "lucide-react"
import Image from "next/image"
import type { Article } from "@/lib/type"

interface ImageUploadDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    article: Article | null
    onSuccess?: () => void
}

export function ImageUploadDialog({ open, onOpenChange, article, onSuccess }: ImageUploadDialogProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { toast } = useToast()

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
        if (!allowedTypes.includes(file.type)) {
            toast({
                title: "Invalid file type",
                description: "Only JPEG, PNG, GIF, and WebP files are allowed",
                variant: "destructive",
            })
            return
        }

        // Validate file size (5MB)
        const maxSize = 5 * 1024 * 1024
        if (file.size > maxSize) {
            toast({
                title: "File too large",
                description: "File size must be less than 5MB",
                variant: "destructive",
            })
            return
        }

        setSelectedFile(file)

        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
            setPreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)
    }

    const handleUpload = async () => {
        if (!selectedFile || !article) return

        setUploading(true)
        try {
            const formData = new FormData()
            formData.append("image", selectedFile)

            console.log("Uploading image:", {
                articleId: article.id,
                fileName: selectedFile.name,
                fileSize: selectedFile.size,
                fileType: selectedFile.type
            })

            const response = await fetch(`/api/articles/${article.id}/image`, {
                method: "PUT",
                body: formData,
            })

            console.log("Upload response:", {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok,
                headers: Object.fromEntries(response.headers.entries())
            })

            if (!response.ok) {
                let errorMessage = "Failed to upload image"
                try {
                    const errorData = await response.json()
                    errorMessage = errorData.error || errorMessage
                } catch (error) {
                    // If response is not JSON, use status text or generic message
                    errorMessage = response.statusText || `HTTP ${response.status}: ${errorMessage}` || ``
                }
                throw new Error(errorMessage)
            }

            const result = await response.json()
            console.log("Upload success:", result)

            toast({
                title: "Success",
                description: "Image uploaded successfully",
            })

            onSuccess?.()
            onOpenChange(false)
            handleReset()
        } catch (error: any) {
            console.error("Upload error:", error)
            toast({
                title: "Upload failed",
                description: error.message || "Failed to upload image",
                variant: "destructive",
            })
        } finally {
            setUploading(false)
        }
    }

    const handleReset = () => {
        setSelectedFile(null)
        setPreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleClose = () => {
        handleReset()
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Upload Article Image</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {article && (
                        <div className="text-sm text-muted-foreground">
                            <strong>Article:</strong> {article.title}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="image">Select Image</Label>
                        <Input
                            ref={fileInputRef}
                            id="image"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            onChange={handleFileSelect}
                            disabled={uploading}
                        />
                        <p className="text-xs text-muted-foreground">
                            Supported formats: JPEG, PNG, GIF, WebP. Maximum size: 5MB
                        </p>
                    </div>

                    {preview && (
                        <div className="space-y-2">
                            <Label>Preview</Label>
                            <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                                <Image
                                    src={preview}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="absolute top-2 right-2"
                                    onClick={handleReset}
                                    disabled={uploading}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={handleClose} disabled={uploading}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpload}
                            disabled={!selectedFile || uploading}
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
