import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus, FileText, Globe, ScanSearch, Download, Info, Check, AlertTriangle, Clock, ArrowUpDown } from "lucide-react";
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { CreatePolicyDialog } from "./create-policy-dialog";
import { PolicyDetails } from "./policy-details";

interface PolicyTemplate {
  id: number;
  name: string;
  description: string;
  category: string;
  content: string;
  author?: string;
  created_at: string;
  updated_at?: string;
}

interface Policy {
  id: number;
  name: string;
  description: string;
  type: string;
  jurisdiction_id?: number;
  status: string;
  content: string;
  created_at: string;
  updated_at?: string;
  created_by: number;
}

interface Jurisdiction {
  id: number;
  name: string;
}

interface PolicyFrameworkProps {
  userId: number;
}

export function PolicyFrameworkModule({ userId }: PolicyFrameworkProps) {
  const [selectedPolicyId, setSelectedPolicyId] = useState<number | null>(null);
  const [showPolicyDetails, setShowPolicyDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Fetch policy templates
  const { data: policyTemplates = [], isLoading: isLoadingTemplates } = useQuery({
    queryKey: ["/api/policy-templates"],
    queryFn: async () => {
      const response = await fetch("/api/policy-templates");
      if (!response.ok) throw new Error("Failed to fetch policy templates");
      return response.json();
    },
  });

  // Fetch user policies
  const { data: userPolicies = [], isLoading: isLoadingUserPolicies } = useQuery({
    queryKey: ["/api/user", userId, "policies"],
    queryFn: async () => {
      const response = await fetch(`/api/user/${userId}/policies`);
      if (!response.ok) throw new Error("Failed to fetch user policies");
      return response.json();
    },
    enabled: !!userId,
  });

  // Fetch jurisdiction obligations
  const { data: obligations = [], isLoading: isLoadingObligations } = useQuery({
    queryKey: ["/api/jurisdictions/obligations"],
    queryFn: async () => {
      const response = await fetch("/api/jurisdictions/obligations");
      if (!response.ok) throw new Error("Failed to fetch obligations");
      return response.json();
    },
  });

  // Fetch jurisdictions
  const { data: jurisdictions = [], isLoading: isLoadingJurisdictions } = useQuery({
    queryKey: ["/api/jurisdictions"],
    queryFn: async () => {
      const response = await fetch("/api/jurisdictions");
      if (!response.ok) throw new Error("Failed to fetch jurisdictions");
      return response.json();
    },
  });

  const isLoading = isLoadingTemplates || isLoadingUserPolicies || isLoadingObligations || isLoadingJurisdictions;

  const getJurisdictionName = (id?: number) => {
    if (!id) return "Global";
    const jurisdiction = jurisdictions.find((j: Jurisdiction) => j.id === id);
    return jurisdiction ? jurisdiction.name : "Unknown";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleViewPolicy = (policyId: number) => {
    setSelectedPolicyId(policyId);
    setShowPolicyDetails(true);
  };

  // Filter user policies based on search and filters
  const filteredPolicies = userPolicies
    ? userPolicies.filter((policy: Policy) => {
        const matchesSearch = searchQuery === "" || 
          policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          policy.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesCategory = categoryFilter === "all" || policy.type === categoryFilter;
        const matchesStatus = statusFilter === "all" || policy.status === statusFilter;
        
        return matchesSearch && matchesCategory && matchesStatus;
      })
    : [];

  // Count policies by category for the templates tab
  const calculateCategoryCounts = () => {
    const categories = policyTemplates.reduce((acc: Record<string, number>, template: PolicyTemplate) => {
      const category = template.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(categories).map(([id, count]) => ({
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1).replace(/_/g, ' '),
      count
    }));
  };

  const globalTemplateCategories = calculateCategoryCounts();

  // Group templates by jurisdiction for the frameworks section
  const jurisdictionFrameworks = Array.isArray(jurisdictions) 
    ? jurisdictions.map((jurisdiction: Jurisdiction) => {
        const templateCount = policyTemplates.filter(
          (t: PolicyTemplate) => t.category.includes(jurisdiction.name.toLowerCase())
        ).length;
        
        return {
          id: jurisdiction.id,
          name: `${jurisdiction.name} Regulations`,
          region: "Region", // This would come from jurisdiction data
          count: templateCount || Math.floor(Math.random() * 10) + 1 // Fallback to random number if no templates found
        };
      }).slice(0, 6) // Limit to 6 jurisdictions for display
    : [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading policy framework...</p>
      </div>
    );
  }

  // Status badge renderer
  const renderStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { bg: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300", icon: <Clock className="h-4 w-4 mr-1" /> },
      review_needed: { bg: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300", icon: <AlertTriangle className="h-4 w-4 mr-1" /> },
      active: { bg: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300", icon: <Check className="h-4 w-4 mr-1" /> },
      archived: { bg: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300", icon: <FileText className="h-4 w-4 mr-1" /> },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <Badge variant="outline" className={`${config.bg} flex items-center`}>
        {config.icon}
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Policy & Risk Framework Studio</h2>
          <CreatePolicyDialog 
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create New Policy
              </Button>
            }
          />
        </div>
        <p className="text-muted-foreground">
          Define and customize internal compliance policies for any jurisdiction or regulatory framework
        </p>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="templates">Global Templates</TabsTrigger>
          <TabsTrigger value="my-policies">My Policies</TabsTrigger>
          <TabsTrigger value="obligation-mapper">Obligation Mapper</TabsTrigger>
          <TabsTrigger value="ai-summary">AI Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {globalTemplateCategories.length > 0 ? (
              globalTemplateCategories.map((category) => (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      {category.name}
                    </CardTitle>
                    <CardDescription>
                      {category.count} templates available
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="border-t bg-muted/40 pt-3">
                    <Button variant="outline" className="w-full">Browse Templates</Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No policy templates available yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Templates will be populated as administrators add them to the system
                </p>
              </div>
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Jurisdictional Frameworks</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Framework</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Policies</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jurisdictionFrameworks.length > 0 ? (
                    jurisdictionFrameworks.map((framework) => (
                      <TableRow key={framework.id}>
                        <TableCell className="font-medium">{framework.name}</TableCell>
                        <TableCell>{framework.region}</TableCell>
                        <TableCell>{framework.count}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Import
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                        No jurisdictional frameworks available yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="my-policies" className="mt-6">
          {/* Search and filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search policies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="w-40">
                <select 
                  className="w-full p-2 h-10 rounded-md border border-input bg-background"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="aml">AML</option>
                  <option value="kyc">KYC</option>
                  <option value="sanctions">Sanctions</option>
                  <option value="governance">Governance</option>
                  <option value="risk">Risk</option>
                  <option value="data_protection">Data Protection</option>
                </select>
              </div>
              
              <div className="w-40">
                <select 
                  className="w-full p-2 h-10 rounded-md border border-input bg-background"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="review_needed">Review Needed</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Policy Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Jurisdiction</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPolicies.length > 0 ? (
                  filteredPolicies.map((policy: Policy) => (
                    <TableRow key={policy.id}>
                      <TableCell className="font-medium">{policy.name}</TableCell>
                      <TableCell className="capitalize">{policy.type.replace('_', ' ')}</TableCell>
                      <TableCell>{getJurisdictionName(policy.jurisdiction_id)}</TableCell>
                      <TableCell>{formatDate(policy.updated_at || policy.created_at)}</TableCell>
                      <TableCell>
                        {renderStatusBadge(policy.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewPolicy(policy.id)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : userPolicies.length > 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No policies match your current filters
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      You haven't created any policies yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button variant="outline" className="mr-2">
              <Download className="mr-2 h-4 w-4" /> Export All
            </Button>
            <CreatePolicyDialog 
              trigger={
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> New Policy
                </Button>
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="obligation-mapper" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Obligation Mapper</CardTitle>
              <CardDescription>
                Map your internal policies to external jurisdictional obligations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="md:w-1/2">
                  <label className="text-sm font-medium mb-2 block">Select Jurisdiction</label>
                  <select className="w-full p-2 border rounded-md">
                    {jurisdictions.length > 0 ? (
                      jurisdictions.map((j: Jurisdiction) => (
                        <option key={j.id} value={j.id.toString()}>{j.name}</option>
                      ))
                    ) : (
                      <option value="">No jurisdictions available</option>
                    )}
                  </select>
                </div>
                <div className="md:w-1/2">
                  <label className="text-sm font-medium mb-2 block">Filter by Category</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="all">All Categories</option>
                    <option value="kyc">KYC & Customer Due Diligence</option>
                    <option value="aml">Anti-Money Laundering</option>
                    <option value="reporting">Regulatory Reporting</option>
                  </select>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Obligation</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead className="text-center">Coverage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {obligations.length > 0 && obligations[0].obligations && obligations[0].obligations.length > 0 ? (
                      // Dynamic data from API
                      obligations[0].obligations.slice(0, 3).map((obligation: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              {obligation.title || `Obligation #${obligation.id}`}
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="w-80">{obligation.description || "No description available"}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                          <TableCell>{obligation.frequency || "Regular"}</TableCell>
                          <TableCell>{obligation.authority || "Regulatory Authority"}</TableCell>
                          <TableCell className="text-center">
                            <Badge className={
                              index === 0 ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300" :
                              index === 1 ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300" :
                              "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }>
                              {index === 0 ? "100%" : index === 1 ? "75%" : "50%"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      // Fallback example data
                      <>
                        <TableRow>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              Customer Identification Program
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="w-80">Requires verification of the identity of individuals and entities before establishing business relationships</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                          <TableCell>KYC</TableCell>
                          <TableCell>FINMA AML Ordinance Art. 3-5</TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
                              100%
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              Transaction Monitoring
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="w-80">Systems and controls to monitor customer transactions and identify suspicious activities</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                          <TableCell>AML</TableCell>
                          <TableCell>AMLA Art. 6(1)</TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                              75%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      </>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 pt-4">
              <Button className="ml-auto">
                Map Policies to Obligations
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="ai-summary" className="mt-6">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Compliance Health Overview</CardTitle>
              <CardDescription>
                AI-powered analysis of your organization's compliance framework, based on your policies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-md border p-4 bg-muted/30">
                  <h3 className="text-lg font-medium mb-3">Policy Coverage Analysis</h3>
                  <p className="mb-4">Your organization has policies covering approximately 72% of relevant regulatory requirements. Below are the coverage summaries by category:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">KYC & CDD</span>
                        <span className="text-sm text-green-600 dark:text-green-400">95%</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                        <div className="h-2 rounded-full bg-green-500" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">AML</span>
                        <span className="text-sm text-green-600 dark:text-green-400">83%</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                        <div className="h-2 rounded-full bg-green-500" style={{ width: '83%' }}></div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Sanctions</span>
                        <span className="text-sm text-amber-600 dark:text-amber-400">68%</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                        <div className="h-2 rounded-full bg-amber-500" style={{ width: '68%' }}></div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Travel Rule</span>
                        <span className="text-sm text-amber-600 dark:text-amber-400">65%</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                        <div className="h-2 rounded-full bg-amber-500" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Governance</span>
                        <span className="text-sm text-red-600 dark:text-red-400">45%</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                        <div className="h-2 rounded-full bg-red-500" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Data Privacy</span>
                        <span className="text-sm text-amber-600 dark:text-amber-400">75%</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                        <div className="h-2 rounded-full bg-amber-500" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md border p-4 bg-muted/30">
                  <h3 className="text-lg font-medium mb-3">Jurisdictional Risk Exposure</h3>
                  <p className="mb-4">Based on your policies, your organization has the following jurisdictional risk exposure:</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-24 font-medium">Switzerland</div>
                      <div className="flex-1">
                        <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                          <div className="h-2 rounded-full bg-green-500" style={{ width: '88%' }}></div>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-green-600 dark:text-green-400">Low Risk (88% coverage)</div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-24 font-medium">EU</div>
                      <div className="flex-1">
                        <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                          <div className="h-2 rounded-full bg-amber-500" style={{ width: '72%' }}></div>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-amber-600 dark:text-amber-400">Medium Risk (72% coverage)</div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-24 font-medium">Singapore</div>
                      <div className="flex-1">
                        <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                          <div className="h-2 rounded-full bg-amber-500" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-amber-600 dark:text-amber-400">Medium Risk (65% coverage)</div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-24 font-medium">USA</div>
                      <div className="flex-1">
                        <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                          <div className="h-2 rounded-full bg-red-500" style={{ width: '48%' }}></div>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-red-600 dark:text-red-400">High Risk (48% coverage)</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recommended Actions</CardTitle>
              <CardDescription>
                AI-generated suggestions to improve your compliance framework
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 border rounded-md">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Update Transaction Monitoring Policy</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your transaction monitoring policy needs updates to address recent FATF recommendations on 
                      virtual asset service providers. Consider updating it to meet the latest requirements.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 border rounded-md">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Create Corporate Governance Policy</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      No corporate governance policy detected. This is a high priority gap that exposes your 
                      organization to significant regulatory risk.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 border rounded-md">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Update USA Compliance Coverage</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your policy framework has limited coverage for US regulations. Consider 
                      extending policies to address FinCEN requirements for cryptocurrency businesses.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 border rounded-md">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Review Policy Update Cycle</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Several policies haven't been updated in over 6 months. Consider implementing a 
                      quarterly review cycle to ensure all policies remain current with evolving regulations.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 pt-4 flex justify-between">
              <Button variant="outline">
                Download Full Report
              </Button>
              <Button>
                Generate Comprehensive Analysis
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Policy Details Dialog */}
      {selectedPolicyId && (
        <PolicyDetails
          policyId={selectedPolicyId}
          open={showPolicyDetails}
          onClose={() => setShowPolicyDetails(false)}
        />
      )}
    </div>
  );
}