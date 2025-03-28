import { useState, useEffect } from "react";
import { CircleAlert, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Define the NewsArticle interface
interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
}

export default function ComplianceNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/compliance/news");
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Received news data:", data);
      setArticles(data);
    } catch (err) {
      console.error("Failed to fetch news:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="container py-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Crypto Compliance News</h1>
        <p className="text-muted-foreground">
          Stay up-to-date with the latest regulatory developments in the cryptocurrency space.
        </p>
        
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchNews} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 border border-destructive/50 rounded-lg bg-destructive/10 text-destructive flex items-center gap-2">
          <CircleAlert className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          // Loading skeletons
          Array(6).fill(null).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-2/3 mb-1" />
                <Skeleton className="h-4 w-1/3" />
              </CardHeader>
              <CardContent className="pb-2">
                <Skeleton className="h-24 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-4 w-full" />
              </CardFooter>
            </Card>
          ))
        ) : articles.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <p className="text-muted-foreground">No articles found. Please try again later.</p>
          </div>
        ) : (
          articles.map((article, index) => (
            <Card key={index} className="overflow-hidden flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="line-clamp-2 text-xl">
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {article.title}
                  </a>
                </CardTitle>
                <CardDescription>
                  {new Date(article.publishedAt).toLocaleDateString()} · {article.source}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2 flex-grow">
                <p className="line-clamp-4 text-muted-foreground">
                  {article.description}
                </p>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="link" asChild className="px-0">
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Read full article
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}