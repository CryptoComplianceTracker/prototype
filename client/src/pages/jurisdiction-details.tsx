import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Loader2, 
  ArrowLeft, 
  Info, 
  AlertCircle, 
  Globe,
  Book,
  Coins, 
  FileText, 
  Bell, 
  RefreshCw, 
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function JurisdictionDetails() {
  const { id } = useParams<{ id: string }>();
  
  const { data, isLoading, error } = useQuery<any>({
    queryKey: [`/api/jurisdictions/${id}`],
    enabled: !!id,
    retry: 1
  });
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
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

  if (error || !data) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold">Error loading jurisdiction</h1>
        <p className="mt-2">Could not load jurisdiction details.</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.href = "/jurisdictions"}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jurisdictions
        </Button>
      </div>
    );
  }

  const {
    jurisdiction,
    regulatoryBodies,
    regulations,
    complianceRequirements,
    taxationRule,
    reportingObligations,
    regulatoryUpdates,
    tags,
    keywords
  } = data;

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{jurisdiction.name}</h1>
          <p className="text-muted-foreground">Region: {jurisdiction.region}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge 
            className={getRiskLevelColor(jurisdiction.risk_level)}
          >
            Risk: {jurisdiction.risk_level}
          </Badge>
          <Badge 
            variant="outline" 
            className="flex items-center gap-1"
          >
            <AlertCircle className="h-3 w-3" />
            Favorability: {jurisdiction.favorability_score}/100
          </Badge>
        </div>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1"
        onClick={() => window.location.href = "/jurisdictions"}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to All Jurisdictions
      </Button>
      
      {jurisdiction.notes && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-4 w-4" />
              Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{jurisdiction.notes}</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="regulatory_bodies">
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
          {regulatoryBodies?.length === 0 ? (
            <p className="text-muted-foreground">No regulatory bodies specified</p>
          ) : (
            <div className="space-y-4">
              {regulatoryBodies?.map((body: any) => (
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
          {regulations?.length === 0 ? (
            <p className="text-muted-foreground">No regulations specified</p>
          ) : (
            <div className="space-y-4">
              {regulations?.map((regulation: any) => (
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
          {complianceRequirements?.length === 0 ? (
            <p className="text-muted-foreground">No compliance requirements specified</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {complianceRequirements?.map((requirement: any) => (
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
          {!taxationRule ? (
            <p className="text-muted-foreground">No taxation information available</p>
          ) : (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Coins className="h-5 w-5" />
                  Taxation Rules
                </CardTitle>
                {taxationRule.tax_authority_url && (
                  <CardDescription>
                    <a 
                      href={taxationRule.tax_authority_url} 
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
                    <Badge variant={taxationRule.income_tax_applicable ? "default" : "outline"}>
                      {taxationRule.income_tax_applicable ? "Applicable" : "Not Applicable"}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">Capital Gains Tax</span>
                    <Badge variant={taxationRule.capital_gains_tax ? "default" : "outline"}>
                      {taxationRule.capital_gains_tax ? "Applicable" : "Not Applicable"}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">VAT</span>
                    <Badge variant={taxationRule.vat_applicable ? "default" : "outline"}>
                      {taxationRule.vat_applicable ? "Applicable" : "Not Applicable"}
                    </Badge>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-md font-medium mb-2">Description</h3>
                  <p>{taxationRule.tax_description}</p>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Last Updated: {formatDate(taxationRule.last_updated)}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Reporting Tab */}
        <TabsContent value="reporting" className="space-y-4">
          {reportingObligations?.length === 0 ? (
            <p className="text-muted-foreground">No reporting obligations specified</p>
          ) : (
            <div className="space-y-4">
              {reportingObligations?.map((obligation: any) => (
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
          {regulatoryUpdates?.length === 0 ? (
            <p className="text-muted-foreground">No regulatory updates available</p>
          ) : (
            <div className="space-y-4">
              {regulatoryUpdates?.map((update: any) => (
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
                  {tags?.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No tags specified</p>
                  ) : (
                    tags?.map((tag: any) => (
                      <Badge key={tag.id} variant="secondary">{tag.tag}</Badge>
                    ))
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-2">Search Keywords</h3>
                <div className="space-y-1">
                  {keywords?.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No keywords specified</p>
                  ) : (
                    keywords?.map((keyword: any) => (
                      <div key={keyword.id} className="text-sm px-3 py-1 rounded-md bg-muted">
                        {keyword.keyword}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}