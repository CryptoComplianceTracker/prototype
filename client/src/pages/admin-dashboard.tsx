import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import type { ExchangeInfo } from "@shared/schema";
import { useComplianceNews } from "@/lib/news-service";
import { ComplianceNewsFeed } from "@/components/compliance-news-feed";
import { RiskAnalysisDisplay } from "@/components/risk-analysis-display";
import { calculateRiskScore } from "@/lib/risk-analysis";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { InfoTooltip } from "@/components/ui/tooltip-with-info";
import { complianceTerms } from "@/lib/compliance-terms";

export default function AdminDashboard() {
  const { data: exchangeRegistrations, isLoading, error } = useQuery<ExchangeInfo[]>({
    queryKey: ["/api/admin/exchanges"],
    retry: 2,
  });

  const { data: newsArticles, isLoading: isLoadingNews } = useComplianceNews();

  if (isLoading) {
    return (
      <div className="container py-8 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading exchange data...</span>
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
            Failed to load exchange registrations. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!exchangeRegistrations?.length) {
    return (
      <div className="container py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Registrations</AlertTitle>
          <AlertDescription>
            No exchange registrations found. New registrations will appear here.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs defaultValue="registrations">
        <TabsList>
          <TabsTrigger value="registrations">Exchange Registrations</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="registrations">
          <div className="space-y-4">
            {exchangeRegistrations.map((registration) => {
              const riskAssessment = calculateRiskScore(registration);
              return (
                <Collapsible
                  key={registration.id}
                  className="border rounded-lg bg-card transition-all duration-200 hover:shadow-md"
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <h3 className="text-lg font-semibold">
                          {registration.exchangeName}
                        </h3>
                        <Badge>{registration.exchangeType}</Badge>
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
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">
                          <InfoTooltip 
                            term={complianceTerms.regulatoryCompliance.term}
                            explanation={complianceTerms.regulatoryCompliance.explanation}
                          >
                            Regulatory Information
                          </InfoTooltip>
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-muted-foreground">Legal Entity:</span>
                            <p>{registration.legalEntityName}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Registration #:</span>
                            <p>{registration.registrationNumber}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">
                              <InfoTooltip 
                                term={complianceTerms.jurisdictionalRisk.term}
                                explanation={complianceTerms.jurisdictionalRisk.explanation}
                              >
                                Location
                              </InfoTooltip>
                            </span>
                            <p>{registration.headquartersLocation}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Website:</span>
                            <p className="truncate">
                              <a href={registration.websiteUrl} target="_blank" rel="noopener noreferrer"
                                 className="text-primary hover:underline">
                                {registration.websiteUrl}
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Security & Risk Management</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            {registration.washTradingDetection?.automatedBotDetection ? (
                              <div className="flex items-center text-green-500">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                <InfoTooltip 
                                  term={complianceTerms.washTrading.term}
                                  explanation={complianceTerms.washTrading.explanation}
                                >
                                  Bot Detection Active
                                </InfoTooltip>
                              </div>
                            ) : (
                              <div className="flex items-center text-red-500">
                                <AlertCircle className="w-4 h-4 mr-2" />
                                <InfoTooltip 
                                  term={complianceTerms.washTrading.term}
                                  explanation={complianceTerms.washTrading.explanation}
                                >
                                  No Bot Detection
                                </InfoTooltip>
                              </div>
                            )}
                          </div>
                          <div>
                            {registration.washTradingDetection?.spoofingDetection ? (
                              <div className="flex items-center text-green-500">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                <InfoTooltip 
                                  term={complianceTerms.spoofing.term}
                                  explanation={complianceTerms.spoofing.explanation}
                                >
                                  Spoofing Detection Active
                                </InfoTooltip>
                              </div>
                            ) : (
                              <div className="flex items-center text-red-500">
                                <AlertCircle className="w-4 h-4 mr-2" />
                                <InfoTooltip 
                                  term={complianceTerms.spoofing.term}
                                  explanation={complianceTerms.spoofing.explanation}
                                >
                                  No Spoofing Detection
                                </InfoTooltip>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">
                          <InfoTooltip 
                            term={complianceTerms.coldStorage.term}
                            explanation={complianceTerms.coldStorage.explanation}
                          >
                            Custody Information
                          </InfoTooltip>
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-muted-foreground">Cold Storage:</span>
                            <p>{registration.custodyArrangements?.coldStoragePercentage}%</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Hot Wallet:</span>
                            <p>{registration.custodyArrangements?.hotWalletPercentage}%</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">
                              <InfoTooltip 
                                term={complianceTerms.fundSegregation.term}
                                explanation={complianceTerms.fundSegregation.explanation}
                              >
                                Fund Segregation
                              </InfoTooltip>
                            </span>
                            <p>
                              {registration.custodyArrangements?.userFundSegregation ? (
                                <span className="text-green-500">Enabled</span>
                              ) : (
                                <span className="text-red-500">Disabled</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 border-t pt-6">
                        <h4 className="text-lg font-semibold mb-4">Risk Assessment</h4>
                        <RiskAnalysisDisplay assessment={riskAssessment} />
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="compliance">
          <div className="grid gap-6">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}