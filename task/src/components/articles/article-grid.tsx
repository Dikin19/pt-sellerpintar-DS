import type { Article } from "@/lib/type"
import { ArticleCard } from "./article-card"
import { Loading } from "@/components/ui/loading"

interface ArticleGridProps {
  articles: Article[]
  isLoading?: boolean
}

export function ArticleGrid({ articles, isLoading = false }: ArticleGridProps) {
  if (isLoading) {
    return <Loading text="Loading articles..." className="py-12" />
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No articles found.</p>
        <p className="text-muted-foreground text-sm mt-2">Try adjusting your search or filter criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  )
}
