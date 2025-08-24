'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { categoryFormSchema, type CategoryFormData } from '@/lib/validations';
import { validateCategoryForm, displayValidationResults, displayFormErrors } from '@/lib/form-validation';
import { showSuccessToast, showErrorToast, showPromiseToast } from '@/lib/toast-utils';
import { createCategory, updateCategory } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { Category } from '@/types';

interface CategoryFormProps {
  category?: Category;
  mode: 'create' | 'edit';
}

export function CategoryForm({ category, mode }: CategoryFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name || '',
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Client-side validation with enhanced checks
      const validationResult = validateCategoryForm(data);

      // Display validation results
      if (!validationResult.isValid) {
        displayValidationResults(validationResult);
        setIsSubmitting(false);
        return;
      }

      // Display warnings if any (non-blocking)
      if (validationResult.warnings.length > 0) {
        displayValidationResults(validationResult, true);
      }

      if (mode === 'create') {
        await showPromiseToast(
          createCategory(data),
          {
            pending: "Creating category...",
            success: "Category created successfully!",
            error: "Failed to create category"
          }
        );
      } else if (category) {
        await showPromiseToast(
          updateCategory(category.id, data),
          {
            pending: "Updating category...",
            success: "Category updated successfully!",
            error: "Failed to update category"
          }
        );
      }

      router.push('/dashboard/categories');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || `Failed to ${mode} category`;
      setError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard/categories"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Categories
        </Link>

        <h1 className="text-2xl font-bold text-gray-900">
          {mode === 'create' ? 'Create Category' : 'Edit Category'}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter category name"
                {...register('name', {
                  onChange: (e) => {
                    // Clear previous errors when user starts typing
                    if (errors.name) {
                      setError(null);
                    }
                  }
                })}
                aria-invalid={errors.name ? 'true' : 'false'}
                className={errors.name ? 'border-red-500 focus:ring-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-600" role="alert">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
                onClick={() => {
                  // Display form errors if there are any
                  setTimeout(() => {
                    if (Object.keys(errors).length > 0) {
                      displayFormErrors(errors);
                    }
                  }, 100);
                }}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {mode === 'create' ? 'Creating...' : 'Updating...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {mode === 'create' ? 'Create Category' : 'Update Category'}
                  </>
                )}
              </Button>

              <Link href="/dashboard/categories">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}