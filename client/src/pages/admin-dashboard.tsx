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
import * as React from "react";
import type { 
  ExchangeInfo, 
  StablecoinInfo, 
  DefiProtocolInfo,
  NftMarketplaceInfo,
  CryptoFundInfo 
} from "@shared/schema";
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
  const { 
    data: exchangeRegistrations, 
    isLoading: isLoadingExchanges, 
    error: exchangeError 
  } = useQuery<ExchangeInfo[]>({
    queryKey: ["/api/admin/exchanges"],
    retry: 2,
  });

  const { 
    data: stablecoinRegistrations, 
    isLoading: isLoadingStablecoins, 
    error: stablecoinError 
  } = useQuery<StablecoinInfo[]>({
    queryKey: ["/api/admin/stablecoins"],
    retry: 2,
  });

  const { 
    data: defiRegistrations, 
    isLoading: isLoadingDefi, 
    error: defiError 
  } = useQuery<DefiProtocolInfo[]>({
    queryKey: ["/api/admin/defi"],
    retry: 2,
  });

  const { 
    data: nftRegistrations, 
    isLoading: isLoadingNft, 
    error: nftError 
  } = useQuery<NftMarketplaceInfo[]>({
    queryKey: ["/api/admin/nft"],
    retry: 2,
  });

  const { 
    data: fundRegistrations, 
    isLoading: isLoadingFunds, 
    error: fundError 
  } = useQuery<CryptoFundInfo[]>({
    queryKey: ["/api/admin/funds"],
    retry: 2,
  });

  const { data: newsArticles, isLoading: isLoadingNews } = useComplianceNews();
  
  const isLoading = isLoadingExchanges || isLoadingStablecoins || isLoadingDefi || isLoadingNft || isLoadingFunds;
  const error = exchangeError || stablecoinError || defiError || nftError || fundError;

  const [activeTab, setActiveTab] = React.useState("exchanges");
  
  const handleExport = () => {
    if (activeTab === "exchanges" && exchangeRegistrations && exchangeRegistrations.length > 0) {
      exportToCSV(exchangeRegistrations as ExchangeInfo[], 'exchange-registrations.csv');
    } else if (activeTab === "stablecoins" && stablecoinRegistrations && stablecoinRegistrations.length > 0) {
      exportToCSV(stablecoinRegistrations as StablecoinInfo[], 'stablecoin-registrations.csv');
    } else if (activeTab === "defi" && defiRegistrations && defiRegistrations.length > 0) {
      exportToCSV(defiRegistrations as DefiProtocolInfo[], 'defi-protocol-registrations.csv');
    } else if (activeTab === "nft" && nftRegistrations && nftRegistrations.length > 0) {
      exportToCSV(nftRegistrations as NftMarketplaceInfo[], 'nft-marketplace-registrations.csv');
    } else if (activeTab === "funds" && fundRegistrations && fundRegistrations.length > 0) {
      exportToCSV(fundRegistrations as CryptoFundInfo[], 'crypto-fund-registrations.csv');
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

  // Check if any registration data exists
  const hasRegistrations = 
    (exchangeRegistrations && exchangeRegistrations.length > 0) ||
    (stablecoinRegistrations && stablecoinRegistrations.length > 0) ||
    (defiRegistrations && defiRegistrations.length > 0) ||
    (nftRegistrations && nftRegistrations.length > 0) ||
    (fundRegistrations && fundRegistrations.length > 0);

  if (!hasRegistrations) {
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

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button 
          onClick={handleExport}
          disabled={
            (activeTab === "exchanges" && (!exchangeRegistrations || exchangeRegistrations.length === 0)) ||
            (activeTab === "stablecoins" && (!stablecoinRegistrations || stablecoinRegistrations.length === 0)) ||
            (activeTab === "defi" && (!defiRegistrations || defiRegistrations.length === 0)) ||
            (activeTab === "nft" && (!nftRegistrations || nftRegistrations.length === 0)) ||
            (activeTab === "funds" && (!fundRegistrations || fundRegistrations.length === 0)) ||
            activeTab === "compliance"
          }
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export {activeTab !== "compliance" ? activeTab.charAt(0).toUpperCase() + activeTab.slice(1) : ""} Data
        </Button>
      </div>

      <Tabs 
        defaultValue="exchanges" 
        onValueChange={value => setActiveTab(value)}
      >
        <TabsList className="grid grid-cols-6">
          <TabsTrigger value="exchanges">Exchanges</TabsTrigger>
          <TabsTrigger value="stablecoins">Stablecoins</TabsTrigger>
          <TabsTrigger value="defi">DeFi Protocols</TabsTrigger>
          <TabsTrigger value="nft">NFT Marketplaces</TabsTrigger>
          <TabsTrigger value="funds">Crypto Funds</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        {/* Exchange Registrations Tab */}
        <TabsContent value="exchanges">
          <div className="space-y-4">
            {exchangeRegistrations && exchangeRegistrations.length > 0 ? (
              exchangeRegistrations.map((registration) => {
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
              })
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Exchange Registrations</AlertTitle>
                <AlertDescription>
                  No exchange registrations found in the system.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>

        {/* Stablecoin Registrations Tab */}
        <TabsContent value="stablecoins">
          <div className="space-y-4">
            {stablecoinRegistrations && stablecoinRegistrations.length > 0 ? (
              stablecoinRegistrations.map((registration) => (
                <Collapsible
                  key={registration.id}
                  className="border rounded-lg bg-card transition-all duration-200 hover:shadow-md"
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <h3 className="text-lg font-semibold">
                          {registration.stablecoinName}
                        </h3>
                        <Badge>{registration.backingAssetType}</Badge>
                      </div>
                      <ChevronDown className="h-5 w-5 transition-transform ui-expanded:rotate-180" />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t p-4 space-y-6">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">
                          Stablecoin Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-muted-foreground">Issuer:</span>
                            <p>{registration.issuerName}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Jurisdiction:</span>
                            <p>{registration.jurisdiction}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Total Supply:</span>
                            <p>{registration.totalSupply ? registration.totalSupply.toLocaleString() : 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Pegged To:</span>
                            <p>{registration.peggedTo || 'USD'}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Blockchain Platforms</h4>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <span className="text-sm text-muted-foreground">Platforms:</span>
                            <p>{registration.blockchainPlatforms ? JSON.stringify(registration.blockchainPlatforms) : 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Stablecoin Registrations</AlertTitle>
                <AlertDescription>
                  No stablecoin registrations found in the system.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>

        {/* DeFi Protocol Registrations Tab */}
        <TabsContent value="defi">
          <div className="space-y-4">
            {defiRegistrations && defiRegistrations.length > 0 ? (
              defiRegistrations.map((registration) => (
                <Collapsible
                  key={registration.id}
                  className="border rounded-lg bg-card transition-all duration-200 hover:shadow-md"
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <h3 className="text-lg font-semibold">
                          {registration.protocolName}
                        </h3>
                        <Badge>{registration.protocolType}</Badge>
                      </div>
                      <ChevronDown className="h-5 w-5 transition-transform ui-expanded:rotate-180" />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t p-4 space-y-6">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">
                          Protocol Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-muted-foreground">Website:</span>
                            <p className="truncate">
                              <a href={registration.websiteUrl} target="_blank" rel="noopener noreferrer"
                                className="text-primary hover:underline">
                                {registration.websiteUrl}
                              </a>
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Smart Contract Addresses:</span>
                            <p>{registration.smartContractAddresses ? JSON.stringify(registration.smartContractAddresses) : 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No DeFi Protocol Registrations</AlertTitle>
                <AlertDescription>
                  No DeFi protocol registrations found in the system.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>

        {/* NFT Marketplace Registrations Tab */}
        <TabsContent value="nft">
          <div className="space-y-4">
            {nftRegistrations && nftRegistrations.length > 0 ? (
              nftRegistrations.map((registration) => (
                <Collapsible
                  key={registration.id}
                  className="border rounded-lg bg-card transition-all duration-200 hover:shadow-md"
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <h3 className="text-lg font-semibold">
                          {registration.marketplaceName}
                        </h3>
                        <Badge>NFT Marketplace</Badge>
                      </div>
                      <ChevronDown className="h-5 w-5 transition-transform ui-expanded:rotate-180" />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t p-4 space-y-6">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">
                          Marketplace Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-muted-foreground">Business Entity:</span>
                            <p>{registration.businessEntity}</p>
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
                          <div>
                            <span className="text-sm text-muted-foreground">Blockchain Networks:</span>
                            <p>{registration.blockchainNetworks ? JSON.stringify(registration.blockchainNetworks) : 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Supported Standards:</span>
                            <p>{registration.supportedStandards ? JSON.stringify(registration.supportedStandards) : 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No NFT Marketplace Registrations</AlertTitle>
                <AlertDescription>
                  No NFT marketplace registrations found in the system.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>

        {/* Crypto Fund Registrations Tab */}
        <TabsContent value="funds">
          <div className="space-y-4">
            {fundRegistrations && fundRegistrations.length > 0 ? (
              fundRegistrations.map((registration) => (
                <Collapsible
                  key={registration.id}
                  className="border rounded-lg bg-card transition-all duration-200 hover:shadow-md"
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <h3 className="text-lg font-semibold">
                          {registration.fundName}
                        </h3>
                        <Badge>{registration.fundType}</Badge>
                      </div>
                      <ChevronDown className="h-5 w-5 transition-transform ui-expanded:rotate-180" />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t p-4 space-y-6">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">
                          Fund Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-muted-foreground">Registration Number:</span>
                            <p>{registration.registrationNumber}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Jurisdiction:</span>
                            <p>{registration.jurisdiction}</p>
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
                          <div>
                            <span className="text-sm text-muted-foreground">Regulatory Licenses:</span>
                            <p>{registration.regulatoryLicenses ? JSON.stringify(registration.regulatoryLicenses) : 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Crypto Fund Registrations</AlertTitle>
                <AlertDescription>
                  No crypto fund registrations found in the system.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>

        {/* Compliance Tab */}
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