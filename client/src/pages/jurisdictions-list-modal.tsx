import { useQuery } from "@tanstack/react-query";
import { 
  ArrowRight, 
  Filter, 
  Globe, 
  Search, 
  SlidersHorizontal, 
  X,
  ArrowLeft,
  Info,
  Book,
  Coins,
  FileText,
  Bell,
  RefreshCw,
  Tag,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export default function JurisdictionsListModal() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);
  const [selectedJurisdictionId, setSelectedJurisdictionId] = useState<number | null>(null);
  
  const regions = ["Europe", "Asia Pacific", "Americas", "Africa", "Middle East"];
  const riskLevels = ["Low", "Medium", "High", "Critical"];
  
  const { data: jurisdictions, isLoading } = useQuery<any[]>({
    queryKey: ["/api/jurisdictions"],
  });
  
  const { data: jurisdictionDetails, isLoading: isLoadingDetails } = useQuery<any>({
    queryKey: [`/api/jurisdictions/${selectedJurisdictionId}`],
    enabled: !!selectedJurisdictionId,
  });
  
  const filteredJurisdictions = jurisdictions?.filter(jurisdiction => {
    // Filter out Switzerland cards with IDs 1, 2, and 3
    if (jurisdiction.name === "Switzerland" && (jurisdiction.id === 1 || jurisdiction.id === 2 || jurisdiction.id === 3)) {
      return false;
    }
    
    // Apply search filter
    const matchesSearch = searchQuery === "" || 
      jurisdiction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (jurisdiction.notes && jurisdiction.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Apply region filter
    const matchesRegion = selectedRegion === null || jurisdiction.region === selectedRegion;
    
    // Apply risk filter
    const matchesRisk = selectedRisk === null || jurisdiction.risk_level.toLowerCase() === selectedRisk.toLowerCase();
    
    return matchesSearch && matchesRegion && matchesRisk;
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
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const openJurisdictionDetails = (id: number) => {
    setSelectedJurisdictionId(id);
  };
  
  const closeJurisdictionDetails = () => {
    setSelectedJurisdictionId(null);
  };
  
  return (
    <div className="container">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Global Jurisdictions</h1>
          <p className="text-muted-foreground">Browse and compare regulatory frameworks across different jurisdictions</p>
        </div>
      </div>
      
      <div className="grid gap-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jurisdictions..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-9 w-9 p-0"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <div className="relative inline-block">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setSelectedRegion(null)}
              >
                <Globe className="h-4 w-4" />
                {selectedRegion || "All Regions"}
                {selectedRegion && (
                  <X
                    className="h-3 w-3 ml-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRegion(null);
                    }}
                  />
                )}
              </Button>
              <div className="absolute z-10 mt-2 w-48 bg-popover shadow-lg rounded-md border overflow-hidden hidden group-focus-within:block">
                {regions.map((region) => (
                  <button
                    key={region}
                    className="w-full px-4 py-2 text-left hover:bg-accent"
                    onClick={() => setSelectedRegion(region)}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="relative inline-block">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setSelectedRisk(null)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                {selectedRisk ? `Risk: ${selectedRisk}` : "All Risk Levels"}
                {selectedRisk && (
                  <X
                    className="h-3 w-3 ml-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRisk(null);
                    }}
                  />
                )}
              </Button>
              <div className="absolute z-10 mt-2 w-48 bg-popover shadow-lg rounded-md border overflow-hidden hidden group-focus-within:block">
                {riskLevels.map((level) => (
                  <button
                    key={level}
                    className="w-full px-4 py-2 text-left hover:bg-accent"
                    onClick={() => setSelectedRisk(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-7 w-40 mb-1" />
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent className="pb-2">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJurisdictions?.map((jurisdiction) => (
            <Card key={jurisdiction.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{jurisdiction.name}</CardTitle>
                    <CardDescription>{jurisdiction.region}</CardDescription>
                  </div>
                  <Badge className={getRiskLevelColor(jurisdiction.risk_level)}>
                    {jurisdiction.risk_level}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm flex items-center gap-1 mb-2">
                  <span className="font-medium">Favorability:</span> 
                  <span>{jurisdiction.favorability_score}/100</span>
                </p>
                {jurisdiction.notes && (
                  <p className="text-sm line-clamp-3">{jurisdiction.notes}</p>
                )}
              </CardContent>
              <CardFooter className="pt-2">
                <Button 
                  variant="default" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => openJurisdictionDetails(jurisdiction.id)}
                >
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Jurisdiction Details Dialog */}
      <Dialog 
        open={selectedJurisdictionId !== null} 
        onOpenChange={(open) => {
          if (!open) closeJurisdictionDetails();
        }}
      >
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          {isLoadingDetails ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : jurisdictionDetails ? (
            <>
              <DialogHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <DialogTitle className="text-2xl font-bold">
                      {jurisdictionDetails.jurisdiction.name}
                    </DialogTitle>
                    <DialogDescription>
                      Region: {jurisdictionDetails.jurisdiction.region}
                    </DialogDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getRiskLevelColor(jurisdictionDetails.jurisdiction.risk_level)}>
                      Risk: {jurisdictionDetails.jurisdiction.risk_level}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Favorability: {jurisdictionDetails.jurisdiction.favorability_score}/100
                    </Badge>
                  </div>
                </div>
              </DialogHeader>
              
              {jurisdictionDetails.jurisdiction.notes && (
                <Card className="mt-4">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{jurisdictionDetails.jurisdiction.notes}</p>
                  </CardContent>
                </Card>
              )}
              
              <Tabs defaultValue="regulatory_bodies" className="mt-6">
                <TabsList className="grid grid-cols-2 md:grid-cols-7 mb-4">
                  <TabsTrigger value="regulatory_bodies">Regulatory Bodies</TabsTrigger>
                  <TabsTrigger value="regulations">Regulations</TabsTrigger>
                  <TabsTrigger value="compliance">Compliance</TabsTrigger>
                  <TabsTrigger value="taxation">Taxation</TabsTrigger>
                  <TabsTrigger value="reporting">Reporting</TabsTrigger>
                  <TabsTrigger value="updates">Updates</TabsTrigger>
                  <TabsTrigger value="tags">Tags</TabsTrigger>
                </TabsList>
                
                {/* Regulatory Bodies Tab */}
                <TabsContent value="regulatory_bodies" className="space-y-4">
                  {jurisdictionDetails.regulatoryBodies?.length === 0 ? (
                    <p className="text-muted-foreground">No regulatory bodies specified</p>
                  ) : (
                    <div className="space-y-4">
                      {jurisdictionDetails.regulatoryBodies?.map((body: any) => (
                        <Card key={body.id}>
                          <CardHeader>
                            <CardTitle className="text-xl">{body.name}</CardTitle>
                            {body.website_url && (
                              <CardDescription>
                                <a 
                                  href={body.website_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  {body.website_url}
                                </a>
                              </CardDescription>
                            )}
                          </CardHeader>
                          <CardContent>
                            <p>{body.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                {/* Regulations Tab */}
                <TabsContent value="regulations" className="space-y-4">
                  {jurisdictionDetails.regulations?.length === 0 ? (
                    <p className="text-muted-foreground">No regulations specified</p>
                  ) : (
                    <div className="space-y-4">
                      {jurisdictionDetails.regulations?.map((regulation: any) => (
                        <Card key={regulation.id}>
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg flex items-center gap-2">
                                <Book className="h-4 w-4" />
                                {regulation.title}
                              </CardTitle>
                              <Badge variant="outline">{regulation.type}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <p>{regulation.description}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="font-medium">Effective Date: </span>
                                <span>{formatDate(regulation.effective_date)}</span>
                              </div>
                              <div>
                                <span className="font-medium">Last Updated: </span>
                                <span>{formatDate(regulation.last_updated)}</span>
                              </div>
                            </div>
                            
                            {regulation.compliance_url && (
                              <div className="mt-2">
                                <a 
                                  href={regulation.compliance_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary text-sm hover:underline flex items-center gap-1"
                                >
                                  <FileText className="h-3 w-3" />
                                  Official Documentation
                                </a>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                {/* Compliance Requirements Tab */}
                <TabsContent value="compliance" className="space-y-4">
                  {jurisdictionDetails.complianceRequirements?.length === 0 ? (
                    <p className="text-muted-foreground">No compliance requirements specified</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {jurisdictionDetails.complianceRequirements?.map((requirement: any) => (
                        <Card key={requirement.id}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{requirement.requirement_type}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p>{requirement.summary}</p>
                            {requirement.details && (
                              <p className="text-sm text-muted-foreground mt-2">{requirement.details}</p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                {/* Taxation Tab */}
                <TabsContent value="taxation" className="space-y-4">
                  {!jurisdictionDetails.taxationRule ? (
                    <p className="text-muted-foreground">No taxation information available</p>
                  ) : (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl flex items-center gap-2">
                          <Coins className="h-5 w-5" />
                          Taxation Rules
                        </CardTitle>
                        {jurisdictionDetails.taxationRule.tax_authority_url && (
                          <CardDescription>
                            <a 
                              href={jurisdictionDetails.taxationRule.tax_authority_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              Tax Authority Website
                            </a>
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm text-muted-foreground">Income Tax</span>
                            <Badge variant={jurisdictionDetails.taxationRule.income_tax_applicable ? "default" : "outline"}>
                              {jurisdictionDetails.taxationRule.income_tax_applicable ? "Applicable" : "Not Applicable"}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-col gap-1">
                            <span className="text-sm text-muted-foreground">Capital Gains Tax</span>
                            <Badge variant={jurisdictionDetails.taxationRule.capital_gains_tax ? "default" : "outline"}>
                              {jurisdictionDetails.taxationRule.capital_gains_tax ? "Applicable" : "Not Applicable"}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-col gap-1">
                            <span className="text-sm text-muted-foreground">VAT</span>
                            <Badge variant={jurisdictionDetails.taxationRule.vat_applicable ? "default" : "outline"}>
                              {jurisdictionDetails.taxationRule.vat_applicable ? "Applicable" : "Not Applicable"}
                            </Badge>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-md font-medium mb-2">Description</h3>
                          <p>{jurisdictionDetails.taxationRule.tax_description}</p>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          Last Updated: {formatDate(jurisdictionDetails.taxationRule.last_updated)}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                {/* Reporting Tab */}
                <TabsContent value="reporting" className="space-y-4">
                  {jurisdictionDetails.reportingObligations?.length === 0 ? (
                    <p className="text-muted-foreground">No reporting obligations specified</p>
                  ) : (
                    <div className="space-y-4">
                      {jurisdictionDetails.reportingObligations?.map((obligation: any) => (
                        <Card key={obligation.id}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Bell className="h-4 w-4" />
                              {obligation.type}
                            </CardTitle>
                            <CardDescription>Frequency: {obligation.frequency}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {obligation.submission_url && (
                              <div>
                                <h4 className="text-sm font-medium mb-1">Submission URL</h4>
                                <a 
                                  href={obligation.submission_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary text-sm hover:underline"
                                >
                                  {obligation.submission_url}
                                </a>
                              </div>
                            )}
                            
                            {obligation.penalties && (
                              <div>
                                <h4 className="text-sm font-medium mb-1">Penalties for Non-Compliance</h4>
                                <p className="text-sm">{obligation.penalties}</p>
                              </div>
                            )}
                            
                            <div className="text-xs text-muted-foreground">
                              Last Reviewed: {formatDate(obligation.last_reviewed)}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                {/* Updates Tab */}
                <TabsContent value="updates" className="space-y-4">
                  {jurisdictionDetails.regulatoryUpdates?.length === 0 ? (
                    <p className="text-muted-foreground">No regulatory updates available</p>
                  ) : (
                    <div className="space-y-4">
                      {jurisdictionDetails.regulatoryUpdates?.map((update: any) => (
                        <Card key={update.id}>
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg flex items-center gap-2">
                                <RefreshCw className="h-4 w-4" />
                                {update.update_title}
                              </CardTitle>
                              <Badge variant="outline">
                                {formatDate(update.update_date)}
                              </Badge>
                            </div>
                            <CardDescription>{update.source}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p>{update.summary}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                {/* Tags Tab */}
                <TabsContent value="tags" className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Tags & Keywords
                      </CardTitle>
                      <CardDescription>
                        Classification tags and common search terms for this jurisdiction
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {jurisdictionDetails.tags?.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No tags specified</p>
                          ) : (
                            jurisdictionDetails.tags?.map((tag: any, index: number) => (
                              <Badge key={index} variant="secondary">{tag}</Badge>
                            ))
                          )}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Search Keywords</h3>
                        <div className="space-y-1">
                          {jurisdictionDetails.keywords?.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No keywords specified</p>
                          ) : (
                            jurisdictionDetails.keywords?.map((keyword: any, index: number) => (
                              <div key={index} className="text-sm px-3 py-1 rounded-md bg-muted">
                                {keyword}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <div className="py-12 text-center">
              <h2 className="text-lg font-semibold">Error loading jurisdiction details</h2>
              <p className="text-muted-foreground mt-2">Could not load jurisdiction details.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}