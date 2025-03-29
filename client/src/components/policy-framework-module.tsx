import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus, FileText, Globe, ScanSearch, Download, Info } from "lucide-react";
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

interface PolicyTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  jurisdiction: string;
  lastUpdated: string;
}

interface PolicyFrameworkProps {
  userId: number;
}

export function PolicyFrameworkModule({ userId }: PolicyFrameworkProps) {
  const [activeTemplate, setActiveTemplate] = useState<PolicyTemplate | null>(null);
  
  // Fetch policy templates
  const { data: policyTemplates, isLoading: isLoadingTemplates } = useQuery({
    queryKey: ["/api/policy-templates"],
    queryFn: async () => {
      const response = await fetch("/api/policy-templates");
      if (!response.ok) throw new Error("Failed to fetch policy templates");
      return response.json();
    },
  });

  // Fetch user policies
  const { data: userPolicies, isLoading: isLoadingUserPolicies } = useQuery({
    queryKey: ["/api/user", userId, "policies"],
    queryFn: async () => {
      const response = await fetch(`/api/user/${userId}/policies`);
      if (!response.ok) throw new Error("Failed to fetch user policies");
      return response.json();
    },
    enabled: !!userId,
  });

  // Fetch jurisdiction obligations
  const { data: obligations, isLoading: isLoadingObligations } = useQuery({
    queryKey: ["/api/jurisdictions/obligations"],
    queryFn: async () => {
      const response = await fetch("/api/jurisdictions/obligations");
      if (!response.ok) throw new Error("Failed to fetch obligations");
      return response.json();
    },
  });

  const isLoading = isLoadingTemplates || isLoadingUserPolicies || isLoadingObligations;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading policy framework...</p>
      </div>
    );
  }

  const globalTemplateCategories = [
    { id: "aml", name: "Anti-Money Laundering", count: 8 },
    { id: "kyc", name: "Know Your Customer", count: 6 },
    { id: "sanctions", name: "Sanctions Screening", count: 4 },
    { id: "governance", name: "Corporate Governance", count: 5 },
    { id: "risk", name: "Risk Assessment", count: 7 },
    { id: "data", name: "Data Protection", count: 3 },
  ];

  const jurisdictionFrameworks = [
    { id: "fatf", name: "FATF Recommendations", region: "Global", count: 40 },
    { id: "eu-aml", name: "EU 6th AML Directive", region: "Europe", count: 28 },
    { id: "fincen", name: "FinCEN Guidelines", region: "United States", count: 15 },
    { id: "mas", name: "MAS PS-N02", region: "Singapore", count: 12 },
    { id: "finma", name: "FINMA Circular", region: "Switzerland", count: 10 },
    { id: "austrac", name: "AUSTRAC Rules", region: "Australia", count: 8 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Policy & Risk Framework Studio</h2>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create New Policy
          </Button>
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
            {globalTemplateCategories.map((category) => (
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
            ))}
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
                  {jurisdictionFrameworks.map((framework) => (
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
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="my-policies" className="mt-6">
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
                <TableRow>
                  <TableCell className="font-medium">KYC Onboarding Policy</TableCell>
                  <TableCell>Customer Due Diligence</TableCell>
                  <TableCell>Switzerland</TableCell>
                  <TableCell>2025-03-15</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Transaction Monitoring Procedure</TableCell>
                  <TableCell>AML</TableCell>
                  <TableCell>Global</TableCell>
                  <TableCell>2025-02-28</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900 dark:text-amber-300">
                      Review Needed
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Travel Rule Implementation</TableCell>
                  <TableCell>FATF Compliance</TableCell>
                  <TableCell>Global</TableCell>
                  <TableCell>2025-01-10</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300">
                      Draft
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="outline" className="mr-2">
              <Download className="mr-2 h-4 w-4" /> Export All
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Policy
            </Button>
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
              <div className="flex space-x-4 mb-6">
                <div className="w-1/2">
                  <label className="text-sm font-medium mb-2 block">Select Jurisdiction</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="switzerland">Switzerland</option>
                    <option value="singapore">Singapore</option>
                    <option value="usa">United States</option>
                    <option value="eu">European Union</option>
                  </select>
                </div>
                <div className="w-1/2">
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
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900 dark:text-emerald-300">
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
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900 dark:text-amber-300">
                          75%
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          Suspicious Activity Reporting
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-80">Report suspicious transactions to the Money Laundering Reporting Office Switzerland (MROS)</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                      <TableCell>Reporting</TableCell>
                      <TableCell>AMLA Art. 9</TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300">
                          50%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t bg-muted/40 pt-6">
              <Button variant="outline">Run Gap Analysis</Button>
              <Button>Map Selected Obligations</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="ai-summary" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Law Summary</CardTitle>
              <CardDescription>
                Upload regulatory PDFs to get structured SOP recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border border-dashed rounded-lg p-8 text-center bg-muted/30">
                <ScanSearch className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Upload Regulatory Document</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Upload a PDF of a regulation or law to receive an AI-generated structured summary and compliance recommendations
                </p>
                <div className="flex justify-center">
                  <Button>Upload Document</Button>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Recent Analysis</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document</TableHead>
                        <TableHead>Jurisdiction</TableHead>
                        <TableHead>Generated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">EU 6th AML Directive</TableCell>
                        <TableCell>European Union</TableCell>
                        <TableCell>2025-03-20</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">FINMA Circular 2023/01</TableCell>
                        <TableCell>Switzerland</TableCell>
                        <TableCell>2025-03-15</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}