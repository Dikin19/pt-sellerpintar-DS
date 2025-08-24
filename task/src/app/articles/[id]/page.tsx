"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loading } from "@/components/ui/loading"
import { RoleGuard } from "@/components/auth/role-guard"
import { useAuth, usePermission } from "@/contexts/auth-context"
import { getArticle, getArticles } from "@/lib/api"
import type { Article } from "@/lib/type"
import { ArrowLeft, Calendar, User, LogOut, Eye, Shield } from "lucide-react"

export default function ArticleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { isAdmin } = usePermission()
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

  return (
    <RoleGuard allowedRoles={["Admin", "User"]}>
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
                {!isAdmin() && (
                  <div className="flex items-center gap-2 text-sm text-orange-600">
                    <Eye className="h-4 w-4" />
                    <span>Reading Mode (User Access)</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                {user && (
                  <>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4" />
                      <span>{user.username}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {user.role}
                      </span>
                      {isAdmin() && (
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

        {/* User Role Notice */}
        {!isAdmin() && (
          <div className="bg-blue-50 border-b border-blue-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <Shield className="h-4 w-4" />
                <span>You are viewing this article with User permissions (read-only access)</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <article className="bg-white rounded-lg shadow-sm p-8 mb-8">
            {/* Article Header */}
            <header className="mb-8">
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
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
            </header>

            {/* Article Content */}
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-lg leading-relaxed">
                {article.content}
              </div>
            </div>

            {/* Article Footer */}
            <footer className="mt-8 pt-8 border-t">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Last updated: {formatDate(article.updatedAt)}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{article.category.name}</Badge>
                  {!isAdmin() && (
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                      Read-only
                    </Badge>
                  )}
                </div>
              </div>
            </footer>
          </article>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <Card key={relatedArticle.id} className="group hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {relatedArticle.category.name}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        <Link href={`/articles/${relatedArticle.id}`}>
                          {relatedArticle.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {relatedArticle.content.slice(0, 150)}...
                      </p>
                      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{relatedArticle.user.username}</span>
                        <span>{formatDate(relatedArticle.createdAt)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </RoleGuard>
  )
}
