'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { CategoryForm } from '@/components/forms/category-form';
import { LoadingPage } from '@/components/ui/loading-spinner';
import { getCategoryById } from '@/lib/api';
import { Category } from '@/types';

export default function EditCategoryPage() {
  const params = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categoryData = await getCategoryById(params.id as string);
        setCategory(categoryData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch category');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCategory();
    }
  }, [params.id]);

  if (loading) {
    return <LoadingPage />;
  }

  if (error || !category) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error || 'Category not found'}</p>
          <button onClick={() => window.history.back()}>Go Back</button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <CategoryForm category={category} mode="edit" />
    </DashboardLayout>
  );
}