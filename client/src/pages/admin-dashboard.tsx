import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, CheckCircle, AlertCircle } from "lucide-react";
import type { ExchangeInfo } from "@shared/schema";
import { useComplianceNews } from "@/lib/news-service";
import { ComplianceNewsFeed } from "@/components/compliance-news-feed";

export default function AdminDashboard() {
  const { data: exchangeRegistrations, isLoading } = useQuery<ExchangeInfo[]>({
    queryKey: ["/api/admin/exchanges"],
  });

  const { data: newsArticles, isLoading: isLoadingNews } = useComplianceNews();

  if (isLoading) {
    return (
      <div className="container py-8">
        <div>Loading...</div>
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
            {exchangeRegistrations?.map((registration) => (
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
                    </div>
                    <ChevronDown className="h-5 w-5 transition-transform ui-expanded:rotate-180" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="border-t p-4 space-y-6">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">General Information</h4>
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
                          <span className="text-sm text-muted-foreground">Location:</span>
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
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Compliance Contact</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Name:</span>
                          <p>{registration.complianceContactName}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Email:</span>
                          <p>{registration.complianceContactEmail}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Phone:</span>
                          <p>{registration.complianceContactPhone}</p>
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
                              Bot Detection Active
                            </div>
                          ) : (
                            <div className="flex items-center text-red-500">
                              <AlertCircle className="w-4 h-4 mr-2" />
                              No Bot Detection
                            </div>
                          )}
                        </div>
                        <div>
                          {registration.washTradingDetection?.spoofingDetection ? (
                            <div className="flex items-center text-green-500">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Spoofing Detection Active
                            </div>
                          ) : (
                            <div className="flex items-center text-red-500">
                              <AlertCircle className="w-4 h-4 mr-2" />
                              No Spoofing Detection
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Custody Information</h4>
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
                          <span className="text-sm text-muted-foreground">Fund Segregation:</span>
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
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
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