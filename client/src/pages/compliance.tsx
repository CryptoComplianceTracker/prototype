import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useComplianceNews } from "@/lib/news-service";
import { ComplianceNewsFeed } from "@/components/compliance-news-feed";
import RegulatoryMap from "@/components/regulatory-map";

export default function CompliancePage() {
  const { data: newsArticles, isLoading: isLoadingNews } = useComplianceNews();

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Compliance Center</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Global Regulatory Landscape</CardTitle>
          </CardHeader>
          <CardContent>
            <RegulatoryMap />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Compliance News & Regulations</CardTitle>
          </CardHeader>
          <CardContent>
            <ComplianceNewsFeed 
              articles={newsArticles || []}
              isLoading={isLoadingNews}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}