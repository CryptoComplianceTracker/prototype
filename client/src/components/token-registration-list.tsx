import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { TokenRegistration } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, PlusIcon, Search, FileTextIcon, ClipboardCheckIcon, ShieldAlertIcon, GlobeIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { TOKEN_CATEGORIES } from "@/lib/token-types";

interface TokenListProps {
  isAdmin?: boolean;
}

export default function TokenRegistrationList({ isAdmin = false }: TokenListProps) {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  
  // Fetch token registrations
  const { data: tokens, isLoading, error } = useQuery<TokenRegistration[]>({
    queryKey: [isAdmin ? "/api/tokens/admin" : "/api/tokens"],
    enabled: !!user
  });

  // Filter tokens by search and category
  const filteredTokens = tokens?.filter(token => {
    const matchesSearch = searchQuery === "" || 
      token.tokenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.tokenSymbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.issuerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || token.tokenCategory === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle viewing token details
  const viewTokenDetails = (tokenId: number) => {
    navigate(`/tokens/${tokenId}`);
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "destructive";
      case "pending":
        return "warning";
      case "draft":
        return "outline";
      default:
        return "secondary";
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading token registrations...</span>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="w-full text-center py-10">
        <p className="text-destructive">Error loading token registrations. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tokens..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {TOKEN_CATEGORIES.map(category => (
                <SelectItem key={category} value={category}>
                  {category.replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button asChild>
            <Link href="/tokens/register">
              <PlusIcon className="h-4 w-4 mr-2" />
              Register New Token
            </Link>
          </Button>
        </div>
      </div>

      {filteredTokens?.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-lg text-muted-foreground">No token registrations found.</p>
            <Button asChild className="mt-4">
              <Link href="/tokens/register">Register Your First Token</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredTokens?.map(token => (
            <Card key={token.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div>
                    <CardTitle className="text-xl">
                      {token.tokenName} ({token.tokenSymbol})
                    </CardTitle>
                    <CardDescription>
                      {token.issuerName} • {new Date(token.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={getBadgeVariant(token.registrationStatus)}>
                      {token.registrationStatus.charAt(0).toUpperCase() + token.registrationStatus.slice(1)}
                    </Badge>
                    <Badge variant="secondary">
                      {token.tokenCategory.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Token Type</p>
                    <p>{token.tokenType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Blockchain</p>
                    <p>{token.blockchainNetworks?.[0]?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Standard</p>
                    <p>{token.tokenStandard || "N/A"}</p>
                  </div>
                </div>
                
                {isAdmin && (
                  <Accordion type="single" collapsible className="mt-4">
                    <AccordionItem value="details">
                      <AccordionTrigger>Token Details</AccordionTrigger>
                      <AccordionContent>
                        <Tabs defaultValue="overview">
                          <TabsList className="mb-4">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="documents">
                              <FileTextIcon className="h-4 w-4 mr-2" />
                              Documents
                            </TabsTrigger>
                            <TabsTrigger value="verifications">
                              <ClipboardCheckIcon className="h-4 w-4 mr-2" />
                              Verifications
                            </TabsTrigger>
                            <TabsTrigger value="risk">
                              <ShieldAlertIcon className="h-4 w-4 mr-2" />
                              Risk Assessment
                            </TabsTrigger>
                            <TabsTrigger value="jurisdictions">
                              <GlobeIcon className="h-4 w-4 mr-2" />
                              Jurisdictions
                            </TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="overview">
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium">Description</h4>
                                <p className="text-sm text-muted-foreground">{token.description}</p>
                              </div>
                              
                              <div>
                                <h4 className="font-medium">Issuer Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                  <div>
                                    <p className="text-sm font-medium">Legal Entity</p>
                                    <p className="text-sm">{token.issuerLegalEntity}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Website</p>
                                    <p className="text-sm break-all">
                                      <a href={token.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                        {token.websiteUrl}
                                      </a>
                                    </p>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-medium">Compliance Information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                  <div>
                                    <p className="text-sm font-medium">Regulatory Status</p>
                                    <p className="text-sm">{token.regulatoryStatus || "Not specified"}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Whitelist Status</p>
                                    <p className="text-sm">{token.whitelistStatus ? "Enabled" : "Disabled"}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">AML Policy</p>
                                    <p className="text-sm">
                                      {token.amlPolicyUrl ? (
                                        <a href={token.amlPolicyUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                          View Policy
                                        </a>
                                      ) : "Not provided"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Last Audit Date</p>
                                    <p className="text-sm">
                                      {token.lastAuditDate ? format(new Date(token.lastAuditDate), 'PPP') : "Not audited"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="documents">
                            <div className="p-4 text-center">
                              <p className="text-muted-foreground">
                                View documents by opening the full token details
                              </p>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="verifications">
                            <div className="p-4 text-center">
                              <p className="text-muted-foreground">
                                View verifications by opening the full token details
                              </p>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="risk">
                            <div className="p-4 text-center">
                              <p className="text-muted-foreground">
                                View risk assessments by opening the full token details
                              </p>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="jurisdictions">
                            <div className="p-4 text-center">
                              <p className="text-muted-foreground">
                                View jurisdiction approvals by opening the full token details
                              </p>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}
              </CardContent>
              
              <CardFooter className="border-t bg-muted/50 flex justify-end p-4">
                <Button 
                  variant="default" 
                  onClick={() => viewTokenDetails(token.id)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}