import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, CalendarIcon, Filter, BarChart, FileCheck, Clock, AlertTriangle } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { type ComplianceReportType, type ComplianceReport, type ReportSchedule } from "@shared/schema";

// Status Badge component with appropriate color based on status
function StatusBadge({ status }: { status: string | null }) {
  const variants: Record<string, string> = {
    draft: "bg-gray-200 text-gray-800",
    in_progress: "bg-blue-100 text-blue-800", 
    submitted: "bg-purple-100 text-purple-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    needs_review: "bg-yellow-100 text-yellow-800",
    active: "bg-green-100 text-green-800",
    paused: "bg-yellow-100 text-yellow-800",
    completed: "bg-blue-100 text-blue-800"
  };

  const statusText = status || 'pending';
  const classes = statusText in variants ? variants[statusText] : "bg-gray-100 text-gray-800";

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${classes}`}>
      {statusText.replace(/_/g, ' ')}
    </span>
  );
}

export default function ComplianceReportingModule() {
  const [activeTab, setActiveTab] = useState("reports");
  const [reportDialog, setReportDialog] = useState(false);
  const [scheduleDialog, setScheduleDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch report types
  const { 
    data: reportTypes, 
    isLoading: loadingReportTypes 
  } = useQuery<ComplianceReportType[]>({
    queryKey: ['/api/compliance/report-types'],
    enabled: true,
  });

  // Fetch reports
  const { 
    data: reports, 
    isLoading: loadingReports 
  } = useQuery<ComplianceReport[]>({
    queryKey: ['/api/compliance/reports'],
    enabled: true,
  });

  // Fetch schedules
  const { 
    data: schedules, 
    isLoading: loadingSchedules 
  } = useQuery<ReportSchedule[]>({
    queryKey: ['/api/compliance/report-schedules'],
    enabled: true,
  });

  // Filter report types by category
  const filteredReportTypes = reportTypes 
    ? (selectedCategory 
        ? reportTypes.filter(type => type.category === selectedCategory) 
        : reportTypes)
    : [];

  // Get unique categories
  const categories = reportTypes
    ? Array.from(new Set(reportTypes.map(type => type.category)))
    : [];

  // Calculate upcoming reports (due in the next 30 days)
  const upcomingReports = reports
    ? reports.filter(report => {
        if (!report.due_date) return false;
        const dueDate = new Date(report.due_date);
        const now = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(now.getDate() + 30);
        return dueDate >= now && dueDate <= thirtyDaysFromNow;
      })
    : [];

  // Count reports by status
  const reportCounts = reports 
    ? {
        draft: reports.filter(r => r.status === 'draft').length,
        submitted: reports.filter(r => r.status === 'submitted').length,
        approved: reports.filter(r => r.status === 'approved').length,
        rejected: reports.filter(r => r.status === 'rejected').length,
      }
    : { draft: 0, submitted: 0, approved: 0, rejected: 0 };

  if (loadingReportTypes || loadingReports || loadingSchedules) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const renderReportTypeCard = (reportType: ComplianceReportType) => (
    <Card key={reportType.id} className="overflow-hidden">
      <CardHeader className="bg-muted/50 pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{reportType.name}</CardTitle>
          {reportType.template_available && (
            <Badge variant="outline" className="text-xs bg-primary/10">Template Available</Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2 h-10">{reportType.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Frequency</p>
            <p className="font-medium">{reportType.frequency}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Applies To</p>
            <p className="font-medium">{reportType.applies_to}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/30 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs" 
          onClick={() => setReportDialog(true)}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Create Report
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs" 
          onClick={() => setScheduleDialog(true)}
        >
          <Clock className="h-3.5 w-3.5 mr-1" />
          Schedule
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Regulatory Reporting</h3>
        <div className="flex gap-2">
          <Dialog open={reportDialog} onOpenChange={setReportDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Compliance Report</DialogTitle>
                <DialogDescription>
                  Select a report type and entity to create a new compliance report.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="report-type" className="text-sm font-medium">
                    Report Type
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes?.map(type => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="entity-type" className="text-sm font-medium">
                    Entity Type
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select entity type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exchange">Exchange</SelectItem>
                      <SelectItem value="stablecoin">Stablecoin</SelectItem>
                      <SelectItem value="defi">DeFi Protocol</SelectItem>
                      <SelectItem value="nft">NFT Marketplace</SelectItem>
                      <SelectItem value="fund">Crypto Fund</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="entity-id" className="text-sm font-medium">
                    Entity ID/Name
                  </label>
                  <Input placeholder="Enter entity ID or name" />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="jurisdiction" className="text-sm font-medium">
                    Jurisdiction
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select jurisdiction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global">Global</SelectItem>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="eu">European Union</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="sg">Singapore</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="due-date" className="text-sm font-medium">
                    Due Date
                  </label>
                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <Input type="date" />
                    <Button variant="outline" size="icon">
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setReportDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" onClick={() => setReportDialog(false)}>
                  Create Report
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={scheduleDialog} onOpenChange={setScheduleDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Clock className="h-4 w-4 mr-2" />
                Schedule Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Schedule Recurring Report</DialogTitle>
                <DialogDescription>
                  Set up a recurring schedule for compliance report generation.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="report-type" className="text-sm font-medium">
                    Report Type
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes?.map(type => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="frequency" className="text-sm font-medium">
                    Frequency
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="entity-type" className="text-sm font-medium">
                    Entity Type
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select entity type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exchange">Exchange</SelectItem>
                      <SelectItem value="stablecoin">Stablecoin</SelectItem>
                      <SelectItem value="defi">DeFi Protocol</SelectItem>
                      <SelectItem value="nft">NFT Marketplace</SelectItem>
                      <SelectItem value="fund">Crypto Fund</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="next-due-date" className="text-sm font-medium">
                    First Due Date
                  </label>
                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <Input type="date" />
                    <Button variant="outline" size="icon">
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="reminders" className="h-4 w-4" defaultChecked />
                    <label htmlFor="reminders" className="text-sm font-medium">
                      Enable Reminders
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="auto-gen" className="h-4 w-4" />
                    <label htmlFor="auto-gen" className="text-sm font-medium">
                      Auto-generate Reports
                    </label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setScheduleDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" onClick={() => setScheduleDialog(false)}>
                  Create Schedule
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <p className="text-muted-foreground">
        Generate and submit required regulatory reports across multiple jurisdictions,
        with automated scheduling and notification capabilities.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Upcoming Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{upcomingReports.length}</div>
            <p className="text-sm text-muted-foreground">Due in the next 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Draft Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{reportCounts.draft}</div>
            <p className="text-sm text-muted-foreground">Pending completion</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Submitted Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{reportCounts.submitted}</div>
            <p className="text-sm text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Approved Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{reportCounts.approved}</div>
            <p className="text-sm text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reports" onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">My Reports</TabsTrigger>
          <TabsTrigger value="schedules">Report Schedules</TabsTrigger>
          <TabsTrigger value="types">Report Types</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">All Reports</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <BarChart className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {reports && reports.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Type</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map(report => {
                    // Find report type name
                    const reportType = reportTypes?.find(type => type.id === report.report_type_id);
                    return (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{reportType?.name || "Unknown"}</TableCell>
                        <TableCell>{report.entity_type.charAt(0).toUpperCase() + report.entity_type.slice(1)}</TableCell>
                        <TableCell>
                          {report.due_date ? new Date(report.due_date).toLocaleDateString() : "Not set"}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={report.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 border rounded-md bg-muted/10">
              <FileCheck className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No reports yet</h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                You haven't created any compliance reports yet. Start by creating your first report.
              </p>
              <Button onClick={() => setReportDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Report
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="schedules" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Report Schedules</h3>
            <Button variant="outline" size="sm" onClick={() => setScheduleDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Schedule
            </Button>
          </div>

          {schedules && schedules.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Type</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Next Due</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedules.map(schedule => {
                    // Find report type name
                    const reportType = reportTypes?.find(type => type.id === schedule.report_type_id);
                    return (
                      <TableRow key={schedule.id}>
                        <TableCell className="font-medium">{reportType?.name || "Unknown"}</TableCell>
                        <TableCell className="capitalize">{schedule.frequency}</TableCell>
                        <TableCell>
                          {new Date(schedule.next_due_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={schedule.status || 'pending'} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            Pause
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 border rounded-md bg-muted/10">
              <Clock className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No schedules yet</h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                You haven't set up any recurring report schedules yet. Create a schedule to automate your reporting.
              </p>
              <Button onClick={() => setScheduleDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Schedule
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Available Report Types</h3>
            <Select value={selectedCategory || ""} onValueChange={(value) => setSelectedCategory(value === "" ? null : value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredReportTypes.map(reportType => renderReportTypeCard(reportType))}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Reporting Calendar</h3>
            <Button variant="outline" size="sm">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Month View
            </Button>
          </div>

          <div className="rounded-md border p-4">
            <Calendar />
          </div>

          <div className="space-y-4 mt-6">
            <h4 className="font-medium">Upcoming Deadlines</h4>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Report Type</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Days Left</TableHead>
                    <TableHead>Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingReports.length > 0 ? upcomingReports.map(report => {
                    const reportType = reportTypes?.find(type => type.id === report.report_type_id);
                    const dueDate = new Date(report.due_date!);
                    const now = new Date();
                    const daysLeft = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    
                    let priority = "Low";
                    let priorityColor = "text-green-600";
                    
                    if (daysLeft <= 3) {
                      priority = "Critical";
                      priorityColor = "text-red-600";
                    } else if (daysLeft <= 7) {
                      priority = "High";
                      priorityColor = "text-orange-600";
                    } else if (daysLeft <= 14) {
                      priority = "Medium";
                      priorityColor = "text-yellow-600";
                    }
                    
                    return (
                      <TableRow key={report.id}>
                        <TableCell>{dueDate.toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">{reportType?.name || "Unknown"}</TableCell>
                        <TableCell className="capitalize">{report.entity_type}</TableCell>
                        <TableCell>{daysLeft} days</TableCell>
                        <TableCell className={priorityColor}>
                          {daysLeft <= 3 && <AlertTriangle className="h-4 w-4 inline mr-1" />}
                          {priority}
                        </TableCell>
                      </TableRow>
                    );
                  }) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No upcoming reports due in the next 30 days
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}