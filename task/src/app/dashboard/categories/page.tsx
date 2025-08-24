import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { CategoryList } from '@/components/categories/category-list';

export default function CategoriesPage() {
  return (
    <DashboardLayout>
      <CategoryList />
    </DashboardLayout>
  );
}