import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { CategoryForm } from '@/components/forms/category-form';

export default function CreateCategoryPage() {
  return (
    <DashboardLayout>
      <CategoryForm mode="create" />
    </DashboardLayout>
  );
}