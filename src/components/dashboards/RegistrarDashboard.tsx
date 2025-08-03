import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  GitBranch, 
  FileCheck, 
  Clock, 
  Bot, 
  Activity, 
  MapPin,
  Calendar,
  CheckCircle2
} from "lucide-react";

interface RegistrarDashboardProps {
  onNavigate: (view: string) => void;
}

export function RegistrarDashboard({ onNavigate }: RegistrarDashboardProps) {
  const workflowStats = {
    routingPending: 8,
    upcomingReviews: 15,
    completed: 32,
    complianceRate: 94
  };

  const upcomingReviews = [
    {
      id: 1,
      title: "Academic Calendar Revision",
      department: "Academic Affairs",
      dueDate: "2024-01-15",
      priority: "High",
      status: "In Review"
    },
    {
      id: 2,
      title: "Student Admission Guidelines",
      department: "Admissions",
      dueDate: "2024-01-18",
      priority: "Medium",
      status: "Pending"
    },
    {
      id: 3,
      title: "Faculty Performance Metrics",
      department: "HR",
      dueDate: "2024-01-20",
      priority: "Low",
      status: "Draft"
    }
  ];

  const aiSummaries = [
    {
      documentType: "Budget Proposals",
      count: 5,
      keyInsights: "3 requests exceed allocated budget by 15%",
      riskLevel: "Medium"
    },
    {
      documentType: "Policy Updates",
      count: 8,
      keyInsights: "All updates align with regulatory requirements",
      riskLevel: "Low"
    },
    {
      documentType: "Staff Requests",
      count: 12,
      keyInsights: "Increased leave requests in Engineering dept",
      riskLevel: "Low"
    }
  ];

  const activityLogs = [
    { role: "HOD - CSE", action: "Submitted budget proposal", time: "10 mins ago" },
    { role: "Principal", action: "Approved faculty recruitment", time: "25 mins ago" },
    { role: "HOD - ECE", action: "Updated curriculum guidelines", time: "1 hour ago" },
    { role: "Employee", action: "Submitted leave application", time: "2 hours ago" }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Registrar Dashboard</h1>
        <p className="text-muted-foreground">Workflow management and document oversight</p>
      </div>

      {/* Workflow Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Routing Pending</CardTitle>
            <GitBranch className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{workflowStats.routingPending}</div>
            <p className="text-xs text-muted-foreground">Awaiting assignment</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Reviews</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{workflowStats.upcomingReviews}</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{workflowStats.completed}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
            <MapPin className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{workflowStats.complianceRate}%</div>
            <Progress value={workflowStats.complianceRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Upcoming Document Reviews
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingReviews.map((review) => (
              <div key={review.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{review.title}</h4>
                  <Badge variant={
                    review.priority === "High" ? "destructive" : 
                    review.priority === "Medium" ? "default" : "secondary"
                  }>
                    {review.priority}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Department: {review.department}</p>
                  <p>Due: {review.dueDate}</p>
                  <p>Status: {review.status}</p>
                </div>
                <Button size="sm" className="mt-2" onClick={() => onNavigate('documents')}>
                  Review Document
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Summaries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-purple-500" />
              AI-Generated Summaries
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiSummaries.map((summary, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{summary.documentType}</h4>
                  <Badge variant={
                    summary.riskLevel === "High" ? "destructive" : 
                    summary.riskLevel === "Medium" ? "default" : "secondary"
                  }>
                    {summary.riskLevel} Risk
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {summary.count} documents analyzed
                </p>
                <p className="text-sm">{summary.keyInsights}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role Activity Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              Role-wise Activity Logs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activityLogs.map((log, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">{log.role}</p>
                  <p className="text-xs text-muted-foreground">{log.action}</p>
                </div>
                <span className="text-xs text-muted-foreground">{log.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Compliance Mapping */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-purple-500" />
              Compliance Mapping Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Academic Policies</span>
                <div className="flex items-center gap-2">
                  <Progress value={100} className="w-20" />
                  <span className="text-xs">100%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Financial Regulations</span>
                <div className="flex items-center gap-2">
                  <Progress value={95} className="w-20" />
                  <span className="text-xs">95%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">HR Guidelines</span>
                <div className="flex items-center gap-2">
                  <Progress value={88} className="w-20" />
                  <span className="text-xs">88%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Safety Protocols</span>
                <div className="flex items-center gap-2">
                  <Progress value={92} className="w-20" />
                  <span className="text-xs">92%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => onNavigate('workflow')}
            >
              <GitBranch className="h-6 w-6" />
              <span className="text-sm">Route Documents</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => onNavigate('documents')}
            >
              <FileCheck className="h-6 w-6" />
              <span className="text-sm">Review Queue</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => onNavigate('analytics')}
            >
              <Activity className="h-6 w-6" />
              <span className="text-sm">Activity Logs</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => onNavigate('compliance')}
            >
              <MapPin className="h-6 w-6" />
              <span className="text-sm">Compliance Map</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}