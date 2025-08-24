import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Article } from "@/lib/type"

interface ArticleCardProps {
  article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content
    return content.slice(0, maxLength) + "..."
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 overflow-hidden h-full">
      <Link href={`/articles/${article.id}`}>
        <CardContent className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="text-xs">
              {article.category.name}
            </Badge>
            <span className="text-xs text-muted-foreground">{formatDate(article.createdAt)}</span>
          </div>
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2 flex-shrink-0">
            {article.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-3 mb-3 flex-grow">
            {truncateContent(article.content)}
          </p>
          <div className="flex items-center justify-between flex-shrink-0">
            <Badge variant="outline" className="text-xs">
              By {article.user.username}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatDate(article.updatedAt)}
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
