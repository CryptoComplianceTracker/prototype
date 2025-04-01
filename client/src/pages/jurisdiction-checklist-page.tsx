import React from "react";
import { useParams, useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import JurisdictionChecklist from "@/components/jurisdiction-checklist";

export default function JurisdictionChecklistPage() {
  const params = useParams<{ jurisdictionId: string }>();
  const jurisdictionId = params.jurisdictionId;
  const [_, setLocation] = useLocation();
  const { user } = useAuth();
  
  // Convert jurisdictionId to number
  const id = parseInt(jurisdictionId || '0');
  
  // Fetch jurisdiction details
  const {
    data: jurisdictionData,
    isLoading,
    error
  } = useQuery({
    queryKey: [`/api/jurisdictions/${id}`],
    queryFn: async () => {
      console.log(`Fetching jurisdiction with ID: ${id}`);
      const response = await fetch(`/api/jurisdictions/${id}`);
      if (!response.ok) {
        const error = await response.text();
        console.error(`Error fetching jurisdiction: ${error}`);
        throw new Error('Failed to fetch jurisdiction details');
      }
      const data = await response.json();
      console.log('Received jurisdiction data:', data);
      return data;
    },
    enabled: !!user && !isNaN(id)
  });
  
  // Extract the jurisdiction from the response
  const jurisdiction = jurisdictionData?.jurisdiction || jurisdictionData;
  
  if (isLoading) {
    return (
      <div className="container max-w-7xl py-6 space-y-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  if (error || !jurisdiction) {
    return (
      <div className="container max-w-7xl py-6 space-y-8">
        <Button 
          variant="outline" 
          className="mb-6"
          onClick={() => setLocation("/jurisdictions")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jurisdictions
        </Button>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load jurisdiction. Please try again.'}
          </AlertDescription>
        </Alert>
        
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Jurisdiction Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The jurisdiction you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => setLocation("/jurisdictions")}>
            View All Jurisdictions
          </Button>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container max-w-7xl py-6 space-y-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/jurisdictions">Jurisdictions</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/jurisdictions/${jurisdiction.id}`}>{jurisdiction.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Compliance Checklist</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <Button 
        variant="outline" 
        className="mb-6"
        onClick={() => setLocation(`/jurisdictions/${jurisdiction.id}`)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to {jurisdiction.name}
      </Button>
      
      <JurisdictionChecklist 
        jurisdictionId={jurisdiction.id}
        jurisdictionName={jurisdiction.name}
      />
    </div>
  );
}