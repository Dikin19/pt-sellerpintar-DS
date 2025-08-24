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
  const [relatedLoading, setRelatedLoading] = useState(false)



  useEffect(() => {
    const fetchArticle = async () => {
      if (!params.id || typeof params.id !== "string") return

      setLoading(true)
      try {
        const articleData = await getArticle(params.id)
        if (articleData) {
          setArticle(articleData)

          // Fetch related articles - prioritize same category first
          setRelatedLoading(true)
          let relatedResponse = await getArticles({
            categoryId: articleData.categoryId,
            limit: 10, // Get more to filter out current article
          })

          // Filter out the current article and get first 3
          let related = relatedResponse.data.filter(a => a.id !== articleData.id).slice(0, 3)

          // If we don't have enough articles in the same category, get more from other categories
          if (related.length < 3) {
            const additionalResponse = await getArticles({
              limit: 10 - related.length,
            })

            const additionalArticles = additionalResponse.data
              .filter(a => a.id !== articleData.id && !related.some(r => r.id === a.id))
              .slice(0, 3 - related.length)

            related = [...related, ...additionalArticles]
          }

          setRelatedArticles(related)
          setRelatedLoading(false)
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
                <Link href="/admin">
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
        {(relatedArticles.length > 0 || relatedLoading) && (
          <section className="mt-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">You Might Also Like</h2>
              <p className="text-gray-600">Discover more interesting articles</p>
            </div>

            {relatedLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ gridAutoRows: '1fr' }}>
                {relatedArticles.map((relatedArticle) => {
                  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
                    relatedArticle.title
                  )}%20app%20logo?width=500&height=300&nologo=true`

                  return (
                    <Card
                      key={relatedArticle.id}
                      className="group h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md bg-white overflow-hidden flex flex-col"
                    >
                      {/* Image Container */}
                      <div className="relative overflow-hidden h-48">
                        <Image
                          src={imageUrl}
                          alt={relatedArticle.title}
                          width={500}
                          height={300}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge variant="secondary" className="bg-white/95 text-gray-700 font-medium shadow-sm">
                            {relatedArticle.category.name}
                          </Badge>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Content Container */}
                      <div className="flex flex-col flex-1 p-4">
                        {/* Title */}
                        <h3 className="text-lg leading-tight font-bold text-gray-900 mb-3 min-h-[3.5rem] flex items-start">
                          <Link
                            href={`/articles/${relatedArticle.id}`}
                            className="hover:text-blue-600 transition-colors duration-200 line-clamp-2"
                          >
                            {relatedArticle.title}
                          </Link>
                        </h3>

                        {/* Content Preview */}
                        <p className="text-gray-600 text-sm mb-4 flex-1 min-h-[4rem] line-clamp-3">
                          {relatedArticle.content.slice(0, 100).trim()}...
                        </p>

                        {/* Footer */}
                        <div className="mt-auto">
                          <div className="flex items-center justify-between text-xs text-gray-500 pb-3 border-t border-gray-100">
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span className="font-medium">{relatedArticle.user.username}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(relatedArticle.createdAt)}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-end pt-3">
                            <Link
                              href={`/articles/${relatedArticle.id}`}
                              className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 group-hover:translate-x-1"
                            >
                              Read More →
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}
