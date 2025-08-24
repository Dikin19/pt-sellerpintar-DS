"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loading } from "@/components/ui/loading"
import { useAuth } from "@/contexts/auth-context"
import { getArticle, getArticles } from "@/lib/api"
import type { Article } from "@/lib/type"
import { ArrowLeft, Calendar, User, LogOut } from "lucide-react"
import Image from "next/image"

export default function ArticleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [article, setArticle] = useState<Article | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)



  useEffect(() => {
    const fetchArticle = async () => {
      if (!params.id || typeof params.id !== "string") return

      setLoading(true)
      try {
        const articleData = await getArticle(params.id)
        if (articleData) {
          setArticle(articleData)

          // Fetch related articles from the same category
          const relatedResponse = await getArticles({
            categoryId: articleData.categoryId,
            limit: 3,
          })

          // Filter out the current article
          const related = relatedResponse.data.filter(a => a.id !== articleData.id).slice(0, 3)
          setRelatedArticles(related)
        } else {
          router.push("/articles")
        }
      } catch (error) {
        console.error("Failed to fetch article:", error)
        router.push("/articles")
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [params.id, router])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return <Loading text="Loading article..." className="min-h-screen" />
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h1>
          <Button asChild>
            <Link href="/articles">Back to Articles</Link>
          </Button>
        </div>
      </div>
    )
  }
  const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    article.title
  )}%20app%20logo?width=500&height=500&nologo=true`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/articles">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Articles
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-4">
              {user && (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4" />
                    <span>{user.username}</span>
                    {user.role === "Admin" && (
                      <Button variant="secondary" size="sm" onClick={() => (window.location.href = "/admin")}>
                        Admin Panel
                      </Button>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
          {/* Article Header */}
          <header className="mb-6">
            <div className="px-6 pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary">{article.category.name}</Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(article.createdAt)}
                </span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {article.user.username}
                </span>
              </div>

              {/* Gambar utama */}
              <div className="mb-6 flex justify-center overflow-hidden rounded-xl">
                <Image
                  src={pollinationsUrl}
                  alt={article.title}
                  width={600}
                  height={300}
                  className="object-cover h-64 sm:h-80 md:h-96 transition-transform duration-300 hover:scale-105"
                />
              </div>

              <h1 className="text-4xl font-extrabold text-gray-900 mb-4 px-1">{article.title}</h1>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose max-w-none px-6 mb-6">
            <div className="whitespace-pre-wrap text-lg leading-relaxed text-gray-700">
              {article.content}
            </div>
          </div>

          {/* Article Footer */}
          <footer className="border-t px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
            <div className="text-sm text-muted-foreground">
              Last updated: {formatDate(article.updatedAt)}
            </div>
            <Badge variant="outline">{article.category.name}</Badge>
          </footer>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => {
                const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
                  relatedArticle.title
                )}%20app%20logo?width=500&height=300&nologo=true`

                return (
                  <Card
                    key={relatedArticle.id}
                    className="group hover:shadow-xl transition-shadow flex flex-col h-full"
                  >
                    <CardHeader className="p-0">
                      <div className="flex items-center gap-2 px-4 pt-4">
                        <Badge variant="secondary" className="text-xs">
                          {relatedArticle.category.name}
                        </Badge>
                      </div>

                      <div className="overflow-hidden mt-2">
                        <Image
                          src={imageUrl}
                          alt={relatedArticle.title}
                          width={500}
                          height={300}
                          className="w-full h-48 object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>

                      <CardTitle className="text-lg font-semibold px-4 py-2 group-hover:text-primary transition-colors">
                        <Link href={`/articles/${relatedArticle.id}`}>
                          {relatedArticle.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex flex-col flex-1 px-4 pb-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {relatedArticle.content.slice(0, 150)}...
                      </p>
                      <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground pt-4">
                        <span>{relatedArticle.user.username}</span>
                        <span>{formatDate(relatedArticle.createdAt)}</span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
