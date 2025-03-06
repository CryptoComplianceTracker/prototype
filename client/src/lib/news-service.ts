import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
}

// NewsAPI response interface
interface NewsAPIResponse {
  articles: Array<{
    title: string;
    description: string;
    url: string;
    publishedAt: string;
    source: {
      name: string;
    };
  }>;
}

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const NEWS_API_ENDPOINT = "https://newsapi.org/v2/everything";

const fetchCryptoComplianceNews = async (): Promise<NewsArticle[]> => {
  try {
    const response = await axios.get<NewsAPIResponse>(NEWS_API_ENDPOINT, {
      params: {
        q: "(crypto OR cryptocurrency OR blockchain) AND (compliance OR regulation OR regulatory)",
        language: "en",
        sortBy: "publishedAt",
        pageSize: 10,
        apiKey: NEWS_API_KEY,
      },
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
      },
    });

    return response.data.articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      publishedAt: article.publishedAt,
      source: article.source.name,
    }));
  } catch (error) {
    console.error("Error fetching news:", error);
    throw new Error("Failed to fetch news data");
  }
};

// Keep mock data as fallback
const mockNewsArticles: NewsArticle[] = [
  {
    title: "SEC Announces New Crypto Exchange Registration Requirements",
    description: "The Securities and Exchange Commission has announced new registration requirements for cryptocurrency exchanges operating in the United States...",
    url: "https://example.com/news/1",
    publishedAt: "2025-03-05T10:00:00Z",
    source: "Crypto Compliance Weekly"
  },
  {
    title: "EU Updates AML Directives for Crypto Firms",
    description: "The European Union has released updated Anti-Money Laundering directives specifically targeting cryptocurrency firms...",
    url: "https://example.com/news/2",
    publishedAt: "2025-03-04T15:30:00Z",
    source: "European Regulatory News"
  },
  {
    title: "Global Crypto Regulations: A 2025 Overview",
    description: "A comprehensive look at the evolving landscape of cryptocurrency regulations across major jurisdictions...",
    url: "https://example.com/news/3",
    publishedAt: "2025-03-03T09:15:00Z",
    source: "Global Compliance Digest"
  },
];

export function useComplianceNews() {
  return useQuery({
    queryKey: ["/api/compliance/news"],
    queryFn: fetchCryptoComplianceNews,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 4 * 60 * 1000, // Consider data stale after 4 minutes
    placeholderData: mockNewsArticles // Use mock data as placeholder while loading
  });
}