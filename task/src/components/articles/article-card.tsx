import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import type { Article } from "@/lib/type";

interface ArticleCardProps {
    article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const truncateContent = (content: string, maxLength: number = 150) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    return (
        <Card className="h-full hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <Badge variant="secondary" className="mb-2">
                        {article.category.name}
                    </Badge>
                </div>
                <CardTitle className="text-lg leading-tight">
                    <Link
                        href={`/articles/${article.id}`}
                        className="hover:text-blue-600 transition-colors"
                    >
                        {article.title}
                    </Link>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {truncateContent(article.content)}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        <span>{article.user.username}</span>
                    </div>
                    <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{formatDate(article.createdAt)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
