import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function JurisdictionsList() {
  const { data: jurisdictions, isLoading, error } = useQuery<any[]>({
    queryKey: ['/api/jurisdictions'],
  });
  
  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !jurisdictions) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold">Error loading jurisdictions</h1>
        <p className="mt-2">Could not load jurisdictions list.</p>
      </div>
    );
  }

  if (jurisdictions.length === 0) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold">No jurisdictions found</h1>
        <p className="mt-2">Please check back later for regulatory jurisdiction information.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Regulatory Jurisdictions</h1>
          <p className="text-muted-foreground">Browse regulatory information by jurisdiction</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jurisdictions.map((jurisdiction) => (
          <Card key={jurisdiction.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {jurisdiction.name}
                </CardTitle>
                <Badge 
                  className={getRiskLevelColor(jurisdiction.risk_level)}
                >
                  {jurisdiction.risk_level}
                </Badge>
              </div>
              <CardDescription>{jurisdiction.region}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex justify-between mb-3">
                <Badge variant="outline" className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Favorability: {jurisdiction.favorability_score}/100
                </Badge>
              </div>
              {jurisdiction.notes && (
                <p className="text-sm line-clamp-3">{jurisdiction.notes}</p>
              )}
            </CardContent>
            <CardFooter className="pt-2">
              <Button 
                variant="default" 
                className="w-full flex items-center justify-center gap-2"
                onClick={() => window.location.href = `/jurisdiction-detail/${jurisdiction.id}`}
              >
                View Details
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}