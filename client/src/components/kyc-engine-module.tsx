import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Loader2, 
  Users, 
  Search, 
  ShieldAlert, 
  FileStack, 
  RefreshCw, 
  Plus, 
  BarChart4, 
  UserCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface KYCVerificationRequest {
  id: string;
  customerName: string;
  type: string;
  dateSubmitted: string;
  status: 'pending' | 'approved' | 'rejected' | 'additional_info';
  riskLevel: 'low' | 'medium' | 'high';
  country: string;
}

interface KYCEngineProps {
  userId: number;
}

export function KYCEngineModule({ userId }: KYCEngineProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch KYC verification requests
  const { data: kycRequests, isLoading: isLoadingKYC } = useQuery({
    queryKey: ["/api/kyc/verifications"],
    queryFn: async () => {
      const response = await fetch("/api/kyc/verifications");
      if (!response.ok) throw new Error("Failed to fetch KYC verification requests");
      return response.json();
    },
    enabled: !!userId,
  });

  // Fetch KYC provider integrations
  const { data: kycProviders, isLoading: isLoadingProviders } = useQuery({
    queryKey: ["/api/kyc/providers"],
    queryFn: async () => {
      const response = await fetch("/api/kyc/providers");
      if (!response.ok) throw new Error("Failed to fetch KYC providers");
      return response.json();
    },
  });

  const isLoading = isLoadingKYC || isLoadingProviders;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading KYC engine...</p>
      </div>
    );
  }

  // Sample data for display purposes
  const kycStats = {
    pending: 14,
    approved: 87,
    rejected: 6,
    totalVerifications: 107,
    highRisk: 8,
    mediumRisk: 23,
    lowRisk: 76,
    averageCompletionTime: "4.2 hours"
  };

  const sampleVerifications: KYCVerificationRequest[] = [
    {
      id: "VRF-001289",
      customerName: "John Smith",
      type: "Individual",
      dateSubmitted: "2025-03-28",
      status: "pending",
      riskLevel: "low",
      country: "United Kingdom"
    },
    {
      id: "VRF-001288",
      customerName: "Acme Corporation",
      type: "Corporate",
      dateSubmitted: "2025-03-28",
      status: "additional_info",
      riskLevel: "medium",
      country: "Singapore"
    },
    {
      id: "VRF-001287",
      customerName: "Elena Rodriguez",
      type: "Individual",
      dateSubmitted: "2025-03-27",
      status: "approved",
      riskLevel: "low",
      country: "Spain"
    },
    {
      id: "VRF-001286",
      customerName: "Blockchain Ventures Ltd",
      type: "Corporate",
      dateSubmitted: "2025-03-27",
      status: "pending",
      riskLevel: "high",
      country: "Cayman Islands"
    },
    {
      id: "VRF-001285",
      customerName: "Wei Zhang",
      type: "Individual",
      dateSubmitted: "2025-03-26",
      status: "rejected",
      riskLevel: "high",
      country: "China"
    }
  ];

  const integrations = [
    { id: "jumio", name: "Jumio", status: "active", docTypes: 12, countries: 195 },
    { id: "sumsub", name: "SumSub", status: "active", docTypes: 10, countries: 220 },
    { id: "veriff", name: "Veriff", status: "inactive", docTypes: 8, countries: 190 },
    { id: "worldcheck", name: "World-Check", status: "active", docTypes: 6, countries: 210 },
  ];

  // Status badge color mapping
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900 dark:text-amber-300 flex items-center">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300 flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" /> Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300 flex items-center">
            <XCircle className="h-3 w-3 mr-1" /> Rejected
          </Badge>
        );
      case "additional_info":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300 flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" /> Needs Info
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">{status}</Badge>
        );
    }
  };

  // Risk level badge color mapping
  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">
            Low
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900 dark:text-amber-300">
            Medium
          </Badge>
        );
      case "high":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300">
            High
          </Badge>
        );
      default:
        return (
          <Badge>{risk}</Badge>
        );
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">CDD & KYC Engine</h2>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Verification
          </Button>
        </div>
        <p className="text-muted-foreground">
          Streamline onboarding with pluggable identity tools and risk classification
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground">Pending Verifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold">{kycStats.pending}</div>
              <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                {kycStats.pending > 10 ? "High Volume" : "Normal"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground">Approved Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{Math.round((kycStats.approved / kycStats.totalVerifications) * 100)}%</div>
            <Progress value={(kycStats.approved / kycStats.totalVerifications) * 100} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground">High Risk Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold">{kycStats.highRisk}</div>
              <div className="text-xs text-muted-foreground">
                {Math.round((kycStats.highRisk / kycStats.totalVerifications) * 100)}% of total
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground">Avg. Completion Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kycStats.averageCompletionTime}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="verifications" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="verifications">Verifications</TabsTrigger>
          <TabsTrigger value="providers">KYC Providers</TabsTrigger>
          <TabsTrigger value="sanctions">PEP & Sanctions</TabsTrigger>
          <TabsTrigger value="recertification">Recertification</TabsTrigger>
        </TabsList>

        <TabsContent value="verifications" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-1/3">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search verifications..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="additional_info">Needs Info</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleVerifications.map((verification) => (
                  <TableRow key={verification.id}>
                    <TableCell className="font-medium">{verification.id}</TableCell>
                    <TableCell>{verification.customerName}</TableCell>
                    <TableCell>{verification.type}</TableCell>
                    <TableCell>{verification.dateSubmitted}</TableCell>
                    <TableCell>{verification.country}</TableCell>
                    <TableCell>{getRiskBadge(verification.riskLevel)}</TableCell>
                    <TableCell>{getStatusBadge(verification.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="providers" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {integrations.map((integration) => (
              <Card key={integration.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">{integration.name}</CardTitle>
                    <Badge
                      variant="outline"
                      className={
                        integration.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                      }
                    >
                      {integration.status === "active" ? "Connected" : "Disconnected"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div>Document Types: {integration.docTypes}</div>
                    <div>Countries: {integration.countries}</div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 border-t py-3">
                  <Button 
                    variant={integration.status === "active" ? "outline" : "default"} 
                    className="w-full"
                  >
                    {integration.status === "active" ? "Configure" : "Connect"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Button className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add New KYC Provider
          </Button>
        </TabsContent>

        <TabsContent value="sanctions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>PEP & Sanctions Lookup</CardTitle>
              <CardDescription>
                Screen individuals and entities against global watchlists
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Watchlists</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-md p-4">
                    <div className="flex items-center">
                      <ShieldAlert className="h-5 w-5 mr-2 text-primary" />
                      <h4 className="font-medium">OFAC SDN</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Last updated: 2025-03-15</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <div className="flex items-center">
                      <ShieldAlert className="h-5 w-5 mr-2 text-primary" />
                      <h4 className="font-medium">EU Sanctions</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Last updated: 2025-03-20</p>
                  </div>
                  <div className="border rounded-md p-4">
                    <div className="flex items-center">
                      <ShieldAlert className="h-5 w-5 mr-2 text-primary" />
                      <h4 className="font-medium">UN Sanctions</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Last updated: 2025-03-12</p>
                  </div>
                </div>
              </div>

              <div className="border rounded-md p-6">
                <h3 className="text-lg font-medium mb-4">Sanctions Search</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="col-span-2">
                      <label className="text-sm font-medium mb-2 block">Name</label>
                      <Input placeholder="Enter name to search" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Country</label>
                      <Select defaultValue="">
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Countries</SelectItem>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="ru">Russia</SelectItem>
                          <SelectItem value="cn">China</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">List Type</label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue placeholder="Select list" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Lists</SelectItem>
                          <SelectItem value="pep">PEP</SelectItem>
                          <SelectItem value="sanctions">Sanctions</SelectItem>
                          <SelectItem value="enforcement">Enforcement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button>
                    <Search className="mr-2 h-4 w-4" /> Search Watchlists
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recertification" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recertification Engine</CardTitle>
              <CardDescription>
                Trigger periodic reviews for high-risk customers and entities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Schedule Name</TableHead>
                        <TableHead>Customer Type</TableHead>
                        <TableHead>Risk Level</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Next Batch</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">High-Risk Individual Review</TableCell>
                        <TableCell>Individual</TableCell>
                        <TableCell>High</TableCell>
                        <TableCell>Every 3 months</TableCell>
                        <TableCell>2025-04-01</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Active
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Medium-Risk Business Review</TableCell>
                        <TableCell>Corporate</TableCell>
                        <TableCell>Medium</TableCell>
                        <TableCell>Every 6 months</TableCell>
                        <TableCell>2025-06-15</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Active
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Annual Customer Refresh</TableCell>
                        <TableCell>All</TableCell>
                        <TableCell>All</TableCell>
                        <TableCell>Yearly</TableCell>
                        <TableCell>2026-01-15</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Active
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="border rounded-md p-6 bg-muted/30">
                  <h3 className="text-lg font-medium mb-4">Upcoming Recertifications</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Next 30 Days</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">23</div>
                          <div className="text-sm text-muted-foreground">Customers requiring review</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Overdue</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-red-600 dark:text-red-400">5</div>
                          <div className="text-sm text-muted-foreground">Reviews past due date</div>
                        </CardContent>
                      </Card>
                    </div>
                    <Button>
                      <RefreshCw className="mr-2 h-4 w-4" /> Run Manual Recertification
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}