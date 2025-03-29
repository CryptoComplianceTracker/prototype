import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronRight, Download, Upload, Users, FileText, AlertCircle, Activity, BarChart, Shield } from "lucide-react";
import { PolicyFrameworkModule } from "@/components/policy-framework-module";
import { KYCEngineModule } from "@/components/kyc-engine-module";
import { useAuth } from "@/hooks/use-auth";

interface ModuleStatus {
  totalCount: number;
  completedCount: number;
}

interface ComplianceStatus {
  policies: ModuleStatus;
  kyc: ModuleStatus;
  transactions: ModuleStatus;
  sars: ModuleStatus;
  obligations: ModuleStatus;
  reviews: ModuleStatus;
  intelligence: ModuleStatus;
  reporting: ModuleStatus;
}

function StatusCard({ 
  title, 
  description, 
  status, 
  icon: Icon,
  buttonUrl
}: { 
  title: string; 
  description: string; 
  status: ModuleStatus; 
  icon: React.ElementType;
  buttonUrl?: string;
}) {
  const completion = status.completedCount / status.totalCount * 100;
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-0 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Completion</span>
              <span className="text-muted-foreground">{status.completedCount}/{status.totalCount}</span>
            </div>
            <Progress value={completion} className="h-2" />
          </div>
          {buttonUrl && (
            <Button variant="ghost" size="sm" className="w-full justify-between" asChild>
              <a href={buttonUrl}>
                View Details
                <ChevronRight className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function TransactionMonitoringModule() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Transaction Monitoring</h3>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
      <p className="text-muted-foreground">
        Monitor and analyze blockchain transactions for compliance with regulatory requirements
        and detect suspicious activities.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Pending Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">2 high risk, 6 medium risk</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Transactions Monitored</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">257</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Suspicious Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">4.7% of total transactions</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SARModule() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Suspicious Activity Reporting</h3>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          New SAR
        </Button>
      </div>
      <p className="text-muted-foreground">
        Create, manage and submit Suspicious Activity Reports (SARs) to relevant regulatory authorities
        in compliance with regulatory requirements.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Pending SARs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Due in 5 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Submitted SARs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">SAR Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">Acceptance rate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ObligationsModule() {
  const { data: obligations, isLoading } = useQuery({
    queryKey: ["/api/jurisdictions/obligations"],
    queryFn: async () => {
      const response = await fetch("/api/jurisdictions/obligations");
      if (!response.ok) throw new Error("Failed to fetch obligations");
      return response.json();
    }
  });

  if (isLoading) {
    return <div>Loading obligations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Regulatory Obligations</h3>
        <Button variant="outline" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          View All
        </Button>
      </div>
      <p className="text-muted-foreground">
        Track and manage compliance with regulatory obligations across all jurisdictions 
        where your business operates.
      </p>

      <div className="space-y-5">
        {obligations?.map((obligation: any) => (
          <Card key={obligation.id}>
            <CardContent className="p-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{obligation.title}</h4>
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                    {obligation.category}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{obligation.description}</p>
                <div className="pt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-xs text-muted-foreground">{obligation.source}</span>
                    <span className="font-medium">{obligation.coverage}% Complete</span>
                  </div>
                  <Progress value={obligation.coverage} className="h-1.5 mt-1.5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ComplianceReviewModule() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Compliance Reviews</h3>
        <Button variant="outline" size="sm">
          <AlertCircle className="h-4 w-4 mr-2" />
          Schedule Review
        </Button>
      </div>
      <p className="text-muted-foreground">
        Conduct regular reviews of your compliance program to ensure it remains effective 
        and addresses evolving regulatory requirements.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Next Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">April 15, 2025</div>
            <p className="text-xs text-muted-foreground">Quarterly AML Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Open Findings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">2 high priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Review Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">Last quarter</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function IntelligenceModule() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Market Intelligence</h3>
        <Button variant="outline" size="sm">
          <Activity className="h-4 w-4 mr-2" />
          View Insights
        </Button>
      </div>
      <p className="text-muted-foreground">
        Monitor industry developments, regulatory changes, and emerging risks 
        to proactively address compliance challenges.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Regulatory Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Emerging Risks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Being monitored</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Risk Outlook</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">Moderate</div>
            <p className="text-xs text-muted-foreground">Stable trend</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ReportingModule() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Regulatory Reporting</h3>
        <Button variant="outline" size="sm">
          <BarChart className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>
      <p className="text-muted-foreground">
        Generate and submit required regulatory reports across multiple jurisdictions,
        with automatic scheduling and notification capabilities.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Upcoming Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Due within 14 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Submitted Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">9</div>
            <p className="text-xs text-muted-foreground">Last quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Filing Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">99%</div>
            <p className="text-xs text-muted-foreground">Year to date</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ComplianceDashboardHeader({ status }: { status: ComplianceStatus }) {
  const totalItems = Object.values(status).reduce((acc, curr) => acc + curr.totalCount, 0);
  const completedItems = Object.values(status).reduce((acc, curr) => acc + curr.completedCount, 0);
  const overallCompletion = (completedItems / totalItems) * 100;
  
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Compliance Overview</CardTitle>
          <CardDescription>Your compliance program status across all modules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{Math.round(overallCompletion)}%</div>
                <p className="text-sm text-muted-foreground">Overall completion</p>
              </div>
              <div>
                <Shield className="h-8 w-8 text-primary opacity-80" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span>Progress</span>
                <span>{completedItems}/{totalItems} items completed</span>
              </div>
              <Progress value={overallCompletion} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>High Risk Tasks</CardTitle>
          <CardDescription>Urgent compliance items</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">7</div>
          <p className="text-sm text-muted-foreground mt-1">Requires immediate attention</p>
          <Button variant="outline" size="sm" className="mt-4 w-full">
            View Tasks
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Jurisdiction Coverage</CardTitle>
          <CardDescription>Active regulatory frameworks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">12</div>
          <p className="text-sm text-muted-foreground mt-1">Countries with complete coverage</p>
          <Button variant="outline" size="sm" className="mt-4 w-full">
            View Coverage
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ComplianceDashboardPage() {
  const { user } = useAuth();
  const userId = user?.id ?? 0;
  
  const { data: complianceStatus = {
    policies: { totalCount: 0, completedCount: 0 },
    kyc: { totalCount: 0, completedCount: 0 },
    transactions: { totalCount: 0, completedCount: 0 },
    sars: { totalCount: 0, completedCount: 0 },
    obligations: { totalCount: 0, completedCount: 0 },
    reviews: { totalCount: 0, completedCount: 0 },
    intelligence: { totalCount: 0, completedCount: 0 },
    reporting: { totalCount: 0, completedCount: 0 }
  } } = useQuery({
    queryKey: ["/api/user/compliance"],
    queryFn: async () => {
      const response = await fetch("/api/user/compliance");
      if (!response.ok) throw new Error("Failed to fetch compliance status");
      return response.json();
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Compliance Dashboard</h2>
        <p className="text-muted-foreground mt-2">
          Manage and monitor your regulatory compliance across multiple jurisdictions
        </p>
      </div>
      
      <ComplianceDashboardHeader status={complianceStatus} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard 
          title="Policy Framework" 
          description="Develop and manage compliance policies" 
          status={complianceStatus.policies} 
          icon={FileText}
          buttonUrl="#policy-framework"
        />
        <StatusCard 
          title="KYC Engine" 
          description="Customer due diligence processes" 
          status={complianceStatus.kyc} 
          icon={Users}
          buttonUrl="#kyc-engine"
        />
        <StatusCard 
          title="Transaction Monitoring" 
          description="Detect suspicious activity" 
          status={complianceStatus.transactions} 
          icon={Activity}
          buttonUrl="#transaction-monitoring"
        />
        <StatusCard 
          title="Suspicious Activity" 
          description="SAR filing and management" 
          status={complianceStatus.sars} 
          icon={AlertCircle}
          buttonUrl="#sar-module"
        />
        <StatusCard 
          title="Regulatory Obligations" 
          description="Track compliance requirements" 
          status={complianceStatus.obligations} 
          icon={Shield}
          buttonUrl="#obligations"
        />
        <StatusCard 
          title="Compliance Reviews" 
          description="Internal audits and assessments" 
          status={complianceStatus.reviews} 
          icon={Download}
          buttonUrl="#compliance-reviews"
        />
        <StatusCard 
          title="Market Intelligence" 
          description="Regulatory developments tracking" 
          status={complianceStatus.intelligence} 
          icon={BarChart}
          buttonUrl="#intelligence"
        />
        <StatusCard 
          title="Regulatory Reporting" 
          description="Generate and submit reports" 
          status={complianceStatus.reporting} 
          icon={Upload}
          buttonUrl="#reporting"
        />
      </div>
      
      <Tabs defaultValue="policy-framework" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 h-auto">
          <TabsTrigger id="policy-framework" value="policy-framework" className="py-2.5">Policy Framework</TabsTrigger>
          <TabsTrigger id="kyc-engine" value="kyc-engine" className="py-2.5">KYC Engine</TabsTrigger>
          <TabsTrigger id="transaction-monitoring" value="transaction-monitoring" className="py-2.5">Transaction Monitoring</TabsTrigger>
          <TabsTrigger id="sar-module" value="sar-module" className="py-2.5">Suspicious Activity</TabsTrigger>
          <TabsTrigger id="obligations" value="obligations" className="py-2.5">Obligations</TabsTrigger>
          <TabsTrigger id="compliance-reviews" value="compliance-reviews" className="py-2.5">Reviews</TabsTrigger>
          <TabsTrigger id="intelligence" value="intelligence" className="py-2.5">Intelligence</TabsTrigger>
          <TabsTrigger id="reporting" value="reporting" className="py-2.5">Reporting</TabsTrigger>
        </TabsList>
        
        <TabsContent value="policy-framework" className="p-0 border-0">
          <PolicyFrameworkModule userId={userId} />
        </TabsContent>
        
        <TabsContent value="kyc-engine" className="p-0 border-0">
          <KYCEngineModule userId={userId} />
        </TabsContent>
        
        <TabsContent value="transaction-monitoring" className="p-0 border-0">
          <TransactionMonitoringModule />
        </TabsContent>
        
        <TabsContent value="sar-module" className="p-0 border-0">
          <SARModule />
        </TabsContent>
        
        <TabsContent value="obligations" className="p-0 border-0">
          <ObligationsModule />
        </TabsContent>
        
        <TabsContent value="compliance-reviews" className="p-0 border-0">
          <ComplianceReviewModule />
        </TabsContent>
        
        <TabsContent value="intelligence" className="p-0 border-0">
          <IntelligenceModule />
        </TabsContent>
        
        <TabsContent value="reporting" className="p-0 border-0">
          <ReportingModule />
        </TabsContent>
      </Tabs>
    </div>
  );
}