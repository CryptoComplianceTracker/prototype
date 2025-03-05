import { NewsArticle } from "@/lib/news-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper, ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface ComplianceNewsFeedProps {
  articles: NewsArticle[];
  isLoading: boolean;
}

export function ComplianceNewsFeed({ articles, isLoading }: ComplianceNewsFeedProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-5 bg-muted rounded w-3/4 mb-4" />
              <div className="h-4 bg-muted rounded w-1/2 mb-2" />
              <div className="h-4 bg-muted rounded w-1/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {articles.map((article, index) => (
        <Card key={index} className="group hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Newspaper className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{article.source}</span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(article.publishedAt), 'MMM d, yyyy')}
                  </span>
                </div>
                <a 
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 group-hover:text-primary transition-colors duration-200"
                >
                  <h3 className="font-semibold">{article.title}</h3>
                  <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </a>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {article.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
