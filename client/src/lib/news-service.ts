import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "../lib/queryClient";

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
}

/**
 * Hook for fetching latest crypto compliance news
 * Uses a server-side endpoint to avoid CORS issues with the News API
 */
export function useComplianceNews() {
  return useQuery<NewsArticle[]>({
    queryKey: ["/api/compliance/news"],
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 4 * 60 * 1000, // Consider data stale after 4 minutes
  });
}