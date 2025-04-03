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
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, CalendarIcon, Filter, BarChart, FileCheck, Clock, AlertTriangle, Save, Eye } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
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
  
  // State for View/Edit dialogs
  const [viewReportDialog, setViewReportDialog] = useState(false);
  const [editReportDialog, setEditReportDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ComplianceReport | null>(null);
  
  // State for Edit Schedule dialog
  const [editScheduleDialog, setEditScheduleDialog] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ReportSchedule | null>(null);

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
    isLoading: loadingReports,
    error: reportsError
  } = useQuery<ComplianceReport[]>({
    queryKey: ['/api/compliance/reports'],
    enabled: true,
  });
  
  // Debug logging for reports
  console.log('Reports data:', reports);
  if (reportsError) console.error('Reports error:', reportsError);

  // Fetch schedules
  const { 
    data: schedules, 
    isLoading: loadingSchedules 
  } = useQuery<ReportSchedule[]>({
    queryKey: ['/api/compliance/report-schedules'],
    enabled: true,
  });
  
  // Update report mutation
  const updateReportMutation = useMutation({
    mutationFn: async (data: Partial<ComplianceReport> & { id: number }) => {
      const res = await apiRequest("PATCH", `/api/compliance/reports/${data.id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/compliance/reports'] });
    }
  });
  
  // Update schedule mutation
  const updateScheduleMutation = useMutation({
    mutationFn: async (data: Partial<ReportSchedule> & { id: number }) => {
      const res = await apiRequest("PATCH", `/api/compliance/report-schedules/${data.id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/compliance/report-schedules'] });
    }
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
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              setSelectedReport(report);
                              setViewReportDialog(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              setSelectedReport(report);
                              setEditReportDialog(true);
                            }}
                          >
                            <Save className="h-4 w-4 mr-1" />
                            Edit
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
                          <Button 
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedSchedule(schedule);
                              setEditScheduleDialog(true);
                            }}
                          >
                            <Save className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive"
                          >
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

      {/* View Report Dialog */}
      <Dialog open={viewReportDialog} onOpenChange={setViewReportDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>
              {selectedReport && reportTypes?.find(type => type.id === selectedReport.report_type_id)?.name}
            </DialogTitle>
            <DialogDescription>
              Review the details of this compliance report.
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Entity Type</h4>
                  <p className="capitalize">{selectedReport.entity_type}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Status</h4>
                  <StatusBadge status={selectedReport.status} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Jurisdiction</h4>
                  <p>{selectedReport.jurisdiction_id ? `ID: ${selectedReport.jurisdiction_id}` : "Global"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Due Date</h4>
                  <p>{selectedReport.due_date ? new Date(selectedReport.due_date).toLocaleDateString() : "Not set"}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Report Data</h4>
                <div className="bg-muted/20 p-4 rounded-md">
                  <pre className="text-sm whitespace-pre-wrap">
                    {selectedReport.report_data ? 
                      JSON.stringify(
                        typeof selectedReport.report_data === 'string' ? 
                          JSON.parse(selectedReport.report_data || '{"empty": true}') : 
                          {"empty": true}
                        , null, 2) 
                      : "No data provided"}
                  </pre>
                </div>
              </div>
              
              {selectedReport.submission_date && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Submitted</h4>
                  <p>{new Date(selectedReport.submission_date).toLocaleString()}</p>
                </div>
              )}
              
              {selectedReport.reviewer_notes && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Notes</h4>
                  <p className="text-sm text-muted-foreground">{selectedReport.reviewer_notes}</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewReportDialog(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setViewReportDialog(false);
              setSelectedReport(selectedReport);
              setEditReportDialog(true);
            }}>
              Edit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Report Dialog */}
      <Dialog open={editReportDialog} onOpenChange={setEditReportDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit Compliance Report</DialogTitle>
            <DialogDescription>
              Update the details of this compliance report.
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="report-status" className="text-sm font-medium">
                  Status
                </label>
                <Select defaultValue={selectedReport.status || "draft"}>
                  <SelectTrigger id="report-status-value">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="needs_review">Needs Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="report-due-date" className="text-sm font-medium">
                  Due Date
                </label>
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <Input 
                    id="report-due-date"
                    type="date" 
                    defaultValue={selectedReport.due_date ? 
                      new Date(selectedReport.due_date).toISOString().split('T')[0] : 
                      ""} 
                  />
                  <Button variant="outline" size="icon">
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="report-data" className="text-sm font-medium">
                  Report Data (JSON)
                </label>
                <Textarea 
                  id="report-data"
                  rows={8}
                  defaultValue={selectedReport.report_data || '{"empty": true}'}
                />
                <p className="text-xs text-muted-foreground">
                  Enter valid JSON data for this report.
                </p>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="report-comments" className="text-sm font-medium">
                  Notes
                </label>
                <Textarea 
                  id="report-comments"
                  rows={3}
                  defaultValue={selectedReport.reviewer_notes || ""}
                  placeholder="Add any notes or comments about this report"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditReportDialog(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={() => {
                if (!selectedReport) return;
                
                // Create form elements to get values
                const statusSelect = document.querySelector('#report-status-value') as HTMLSelectElement;
                const dueDateInput = document.querySelector('#report-due-date') as HTMLInputElement;
                const reportDataTextarea = document.querySelector('#report-data') as HTMLTextAreaElement;
                const commentsTextarea = document.querySelector('#report-comments') as HTMLTextAreaElement;
                
                // Get values and validate
                const status = statusSelect?.value || selectedReport.status;
                const due_date = dueDateInput?.value ? new Date(dueDateInput.value) : selectedReport.due_date;
                let report_data = selectedReport.report_data;
                
                try {
                  // Validate JSON if provided
                  if (reportDataTextarea?.value) {
                    JSON.parse(reportDataTextarea.value);
                    report_data = reportDataTextarea.value;
                  }
                  
                  // Save changes
                  updateReportMutation.mutate({
                    id: selectedReport.id,
                    status,
                    due_date,
                    report_data,
                    reviewer_notes: commentsTextarea?.value || selectedReport.reviewer_notes
                  });
                  
                  // Close dialog
                  setEditReportDialog(false);
                } catch (error) {
                  console.error("Invalid JSON data:", error);
                  alert("Please ensure report data is valid JSON");
                }
              }}
              disabled={updateReportMutation.isPending}
            >
              {updateReportMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Schedule Dialog */}
      <Dialog open={editScheduleDialog} onOpenChange={setEditScheduleDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Report Schedule</DialogTitle>
            <DialogDescription>
              Update the recurring schedule for compliance report generation.
            </DialogDescription>
          </DialogHeader>
          
          {selectedSchedule && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="schedule-frequency" className="text-sm font-medium">
                  Frequency
                </label>
                <Select defaultValue={selectedSchedule.frequency}>
                  <SelectTrigger id="schedule-frequency-value">
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
                <label htmlFor="schedule-next-due-date" className="text-sm font-medium">
                  Next Due Date
                </label>
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <Input 
                    id="schedule-next-due-date"
                    type="date" 
                    defaultValue={
                      new Date(selectedSchedule.next_due_date).toISOString().split('T')[0]
                    } 
                  />
                  <Button variant="outline" size="icon">
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="reminders" 
                    className="h-4 w-4" 
                    defaultChecked={selectedSchedule.reminders_enabled === true}
                  />
                  <label htmlFor="reminders" className="text-sm font-medium">
                    Enable Reminders
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="auto-gen" 
                    className="h-4 w-4" 
                    defaultChecked={selectedSchedule.auto_generate === true}
                  />
                  <label htmlFor="auto-gen" className="text-sm font-medium">
                    Auto-generate Reports
                  </label>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditScheduleDialog(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={() => {
                if (!selectedSchedule) return;
                
                // Create form elements to get values
                const frequencySelect = document.querySelector('#schedule-frequency-value') as HTMLSelectElement;
                const dueDateInput = document.querySelector('#schedule-next-due-date') as HTMLInputElement;
                const remindersCheckbox = document.querySelector('#reminders') as HTMLInputElement;
                const autoGenCheckbox = document.querySelector('#auto-gen') as HTMLInputElement;
                
                // Get values
                const frequency = frequencySelect?.value || selectedSchedule.frequency;
                const next_due_date = dueDateInput?.value ? new Date(dueDateInput.value) : selectedSchedule.next_due_date;
                const reminders_enabled = remindersCheckbox?.checked ?? !!selectedSchedule.reminders_enabled;
                const auto_generate = autoGenCheckbox?.checked ?? !!selectedSchedule.auto_generate;
                
                // Save changes
                updateScheduleMutation.mutate({
                  id: selectedSchedule.id,
                  frequency,
                  next_due_date,
                  reminders_enabled,
                  auto_generate
                });
                
                // Close dialog
                setEditScheduleDialog(false);
              }}
              disabled={updateScheduleMutation.isPending}
            >
              {updateScheduleMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}