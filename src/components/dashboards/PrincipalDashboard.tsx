import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, 
  AlertTriangle, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  XCircle,
  Bell
} from "lucide-react";

interface PrincipalDashboardProps {
  onNavigate: (view: string) => void;
}

export function PrincipalDashboard({ onNavigate }: PrincipalDashboardProps) {
  const approvalStats = {
    pending: 12,
    approved: 45,
    rejected: 3,
    emergency: 2
  };

  const emergencyDocuments = [
    {
      id: 1,
      title: "Emergency Budget Allocation Request",
      department: "CSE",
      submittedBy: "Dr. Rajesh Kumar",
      priority: "Critical",
      timeAgo: "2 hours ago"
    },
    {
      id: 2,
      title: "Urgent Faculty Recruitment Approval",
      department: "ECE",
      submittedBy: "Prof. Meera Sharma",
      priority: "High",
      timeAgo: "4 hours ago"
    }
  ];

  const systemAnalytics = [
    { label: "Total Documents", value: "234", change: "+12%" },
    { label: "Active Users", value: "89", change: "+5%" },
    { label: "Workflows", value: "15", change: "+2%" },
    { label: "Compliance Rate", value: "97%", change: "+1%" }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Principal Dashboard</h1>
        <p className="text-muted-foreground">System-wide overview and management controls</p>
      </div>

      {/* Emergency Alerts */}
      {emergencyDocuments.length > 0 && (
        <Alert className="border-destructive bg-destructive/10">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription>
            <span className="font-medium">Emergency Documents Pending:</span> {emergencyDocuments.length} urgent approvals require immediate attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Approval Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{approvalStats.pending}</div>
            <p className="text-xs text-muted-foreground">Requires action</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvalStats.approved}</div>
            <p className="text-xs text-muted-foreground">Documents processed</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{approvalStats.rejected}</div>
            <p className="text-xs text-muted-foreground">Need revision</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergency</CardTitle>
            <Bell className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{approvalStats.emergency}</div>
            <p className="text-xs text-muted-foreground">Urgent attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emergency Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Emergency Document Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {emergencyDocuments.map((doc) => (
              <div key={doc.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{doc.title}</h4>
                  <Badge variant={doc.priority === "Critical" ? "destructive" : "secondary"}>
                    {doc.priority}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Department: {doc.department}</p>
                  <p>Submitted by: {doc.submittedBy}</p>
                  <p>{doc.timeAgo}</p>
                </div>
                <Button size="sm" className="mt-2" onClick={() => onNavigate('approvals')}>
                  Review Now
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* System Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              System Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {systemAnalytics.map((stat) => (
              <div key={stat.label} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <Badge variant="outline" className="text-green-600">
                  {stat.change}
                </Badge>
              </div>
            ))}
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
              onClick={() => onNavigate('approvals')}
            >
              <FileText className="h-6 w-6" />
              <span className="text-sm">Review Approvals</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => onNavigate('analytics')}
            >
              <TrendingUp className="h-6 w-6" />
              <span className="text-sm">View Analytics</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => onNavigate('workflow')}
            >
              <Users className="h-6 w-6" />
              <span className="text-sm">Manage Roles</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => onNavigate('emergency')}
            >
              <Bell className="h-6 w-6" />
              <span className="text-sm">Emergency Panel</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}