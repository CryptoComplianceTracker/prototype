import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, AlertCircle, CheckCircle, Loader2, Download } from "lucide-react";
import type { Registration } from "@shared/schema";
import { useComplianceNews } from "@/lib/news-service";
import { ComplianceNewsFeed } from "@/components/compliance-news-feed";
import { RiskAnalysisDisplay } from "@/components/risk-analysis-display";
import { calculateRiskScore } from "@/lib/risk-analysis";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { InfoTooltip } from "@/components/ui/tooltip-with-info";
import { complianceTerms } from "@/lib/compliance-terms";
import { Button } from "@/components/ui/button";
import { exportToCSV } from "@/lib/export-utils";

export default function AdminDashboard() {
  const { data: registrations, isLoading, error } = useQuery<Registration[]>({
    queryKey: ["/api/admin/registrations"],
    retry: 2,
  });

  const { data: newsArticles, isLoading: isLoadingNews } = useComplianceNews();

  const handleExport = () => {
    if (registrations) {
      exportToCSV(registrations);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading registration data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load registrations. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!registrations?.length) {
    return (
      <div className="container py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Registrations</AlertTitle>
          <AlertDescription>
            No registrations found. New registrations will appear here.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Group registrations by type
  const registrationsByType = registrations.reduce((acc, reg) => {
    if (!acc[reg.registrationType]) {
      acc[reg.registrationType] = [];
    }
    acc[reg.registrationType].push(reg);
    return acc;
  }, {} as Record<string, Registration[]>);

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button 
          onClick={handleExport}
          disabled={!registrations?.length}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Registrations</TabsTrigger>
          <TabsTrigger value="exchange">Exchanges</TabsTrigger>
          <TabsTrigger value="stablecoin">Stablecoins</TabsTrigger>
          <TabsTrigger value="defi">DeFi Protocols</TabsTrigger>
          <TabsTrigger value="nft">NFT Marketplaces</TabsTrigger>
          <TabsTrigger value="fund">Crypto Funds</TabsTrigger>
          <TabsTrigger value="news">Compliance News</TabsTrigger>
        </TabsList>

        {/* All Registrations Tab */}
        <TabsContent value="all">
          <div className="space-y-4">
            {registrations.map((registration) => (
              <RegistrationCard key={registration.id} registration={registration} />
            ))}
          </div>
        </TabsContent>

        {/* Type-specific Tabs */}
        {Object.entries(registrationsByType).map(([type, regs]) => (
          <TabsContent key={type} value={type}>
            <div className="space-y-4">
              {regs.map((registration) => (
                <RegistrationCard key={registration.id} registration={registration} />
              ))}
            </div>
          </TabsContent>
        ))}

        {/* News Tab */}
        <TabsContent value="news">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RegistrationCard({ registration }: { registration: Registration }) {
  const riskAssessment = calculateRiskScore(registration.entityDetails);

  return (
    <Collapsible
      key={registration.id}
      className="border rounded-lg bg-card transition-all duration-200 hover:shadow-md"
    >
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">
              {registration.name}
            </h3>
            <Badge>{registration.registrationType}</Badge>
            <Badge variant={registration.status === 'approved' ? 'default' : 'secondary'}>
              {registration.status}
            </Badge>
            <Badge 
              variant={
                riskAssessment.riskLevel === "Low" ? "default" :
                riskAssessment.riskLevel === "Medium" ? "secondary" :
                "destructive"
              }
            >
              <InfoTooltip 
                term={complianceTerms.riskAssessment.term}
                explanation={complianceTerms.riskAssessment.explanation}
              >
                {riskAssessment.riskLevel} Risk
              </InfoTooltip>
            </Badge>
          </div>
          <ChevronDown className="h-5 w-5 transition-transform ui-expanded:rotate-180" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="border-t p-4 space-y-6">
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Registration Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Registration Number:</span>
                <p>{registration.registrationNumber || 'Not Assigned'}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Jurisdiction:</span>
                <p>{registration.jurisdiction || 'Not Specified'}</p>
              </div>
              {registration.websiteUrl && (
                <div>
                  <span className="text-sm text-muted-foreground">Website:</span>
                  <p className="truncate">
                    <a href={registration.websiteUrl} target="_blank" rel="noopener noreferrer"
                       className="text-primary hover:underline">
                      {registration.websiteUrl}
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Risk Assessment</h4>
            <RiskAnalysisDisplay assessment={riskAssessment} />
          </div>

          {/* Entity-specific details based on registration type */}
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Entity Details</h4>
            <pre className="bg-muted p-4 rounded-md overflow-auto">
              {JSON.stringify(registration.entityDetails, null, 2)}
            </pre>
          </div>

          {registration.complianceData && (
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">Compliance Data</h4>
              <pre className="bg-muted p-4 rounded-md overflow-auto">
                {JSON.stringify(registration.complianceData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}