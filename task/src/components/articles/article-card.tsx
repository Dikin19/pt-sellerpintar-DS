import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Calendar, Eye } from "lucide-react"
import type { Article } from "@/lib/type"

interface ArticleCardProps {
  article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
  // URL gambar dari Pollinations API
  const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    article.title
  )}%20app%20logo?width=500&height=300&nologo=true`

  // Format tanggal
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Potong konten
  const truncateContent = (content: string, maxLength: number = 100) => {
    if (!content) return ""
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength).trim() + "..."
  }

  return (
    <Card className="group h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md bg-white overflow-hidden flex flex-col">
      {/* Image Container */}
      <div className="relative overflow-hidden h-48">
        <Image
          src={pollinationsUrl}
          alt={article.title}
          width={500}
          height={300}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/95 text-gray-700 font-medium shadow-sm">
            {article.category?.name || "Uncategorized"}
          </Badge>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1 p-4">
        {/* Title */}
        <h3 className="text-lg leading-tight font-bold text-gray-900 mb-3 min-h-[3.5rem] flex items-start">
          <Link
            href={`/articles/${article.id}`}
            className="hover:text-blue-600 transition-colors duration-200 line-clamp-2"
          >
            {article.title}
          </Link>
        </h3>

        {/* Content Preview */}
        <p className="text-gray-600 text-sm mb-4 flex-1 min-h-[4rem] line-clamp-3">
          {truncateContent(article.content)}
        </p>

        {/* Footer */}
        <div className="mt-auto">
          <div className="flex items-center justify-between text-xs text-gray-500 pb-3 border-b border-gray-100">
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span className="font-medium">{article.user?.username || "Unknown"}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(article.createdAt)}</span>
            </div>
          </div>

          <div className="flex items-center justify-end pt-3">
            <Link
              href={`/articles/${article.id}`}
              className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 group-hover:translate-x-1"
            >
              <Eye className="h-3 w-3 mr-1" />
              Read More
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}
