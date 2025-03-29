import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useComplianceNews } from "@/lib/news-service";
import { ComplianceNewsFeed } from "@/components/compliance-news-feed";
import RegulatoryMap from "@/components/regulatory-map";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Loader2, Search, GlobeIcon, ArrowRightIcon } from "lucide-react";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function CompliancePage() {
  const { data: newsArticles, isLoading: isLoadingNews } = useComplianceNews();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: jurisdictions, isLoading: isLoadingJurisdictions } = useQuery<any[]>({
    queryKey: ["/api/jurisdictions"],
  });

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const filteredJurisdictions = useMemo(() => {
    if (!jurisdictions) return [];
    
    if (!searchQuery.trim()) return jurisdictions;
    
    const query = searchQuery.toLowerCase();
    return jurisdictions.filter(j => 
      j.name.toLowerCase().includes(query) || 
      j.region.toLowerCase().includes(query) ||
      (j.risk_level && j.risk_level.toLowerCase().includes(query))
    );
  }, [jurisdictions, searchQuery]);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Compliance Center</h1>

      <div className="grid gap-8">
        <Tabs defaultValue="map">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap justify-between items-center gap-4">
                <CardTitle>Global Regulatory Landscape</CardTitle>
                <TabsList>
                  <TabsTrigger value="map">Map View</TabsTrigger>
                  <TabsTrigger value="list">Jurisdiction List</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent>
              <TabsContent value="map" className="mt-0">
                <RegulatoryMap />
              </TabsContent>
              
              <TabsContent value="list" className="mt-0 space-y-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by name, region, or risk level..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {isLoadingJurisdictions ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : !jurisdictions || jurisdictions.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No jurisdictions found in the database</p>
                  </div>
                ) : filteredJurisdictions.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No jurisdictions found matching your search</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredJurisdictions.map((jurisdiction) => (
                      <Card key={jurisdiction.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-xl">{jurisdiction.name}</CardTitle>
                              <CardDescription>{jurisdiction.region}</CardDescription>
                            </div>
                            <Badge className={getRiskLevelColor(jurisdiction.risk_level)}>
                              {jurisdiction.risk_level || "Unknown"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm line-clamp-3">
                            {jurisdiction.notes || "No additional information available."}
                          </p>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <GlobeIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                Favorability: {jurisdiction.favorability_score || "N/A"}{jurisdiction.favorability_score ? "/100" : ""}
                              </span>
                            </div>
                            
                            <Link href={`/jurisdiction/${jurisdiction.id}`}>
                              <Button variant="outline" size="sm" className="flex items-center gap-1">
                                Details
                                <ArrowRightIcon className="h-3 w-3" />
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>

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