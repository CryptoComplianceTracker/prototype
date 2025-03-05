import { useQuery } from "@tanstack/react-query";

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
}

// This is a mock service for demo purposes
// In production, this would call a real news API
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
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockNewsArticles;
    },
  });
}
