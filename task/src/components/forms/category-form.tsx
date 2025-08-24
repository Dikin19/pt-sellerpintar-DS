'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { categoryFormSchema, type CategoryFormData } from '@/lib/validations';
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
      if (mode === 'create') {
        await createCategory(data);
      } else if (category) {
        await updateCategory(category.id, data);
      }
      
      router.push('/dashboard/categories');
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to ${mode} category`);
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
                {...register('name')}
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