import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ArticleList } from '@/components/articles/article-list';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <ArticleList />
    </DashboardLayout>
  );
}