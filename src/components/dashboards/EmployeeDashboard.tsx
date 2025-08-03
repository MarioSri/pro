import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Upload, 
  Eye, 
  MessageSquare, 
  StickyNote,
  Archive,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from "lucide-react";

interface EmployeeDashboardProps {
  onNavigate: (view: string) => void;
}

export function EmployeeDashboard({ onNavigate }: EmployeeDashboardProps) {
  const submissionStats = {
    pending: 3,
    approved: 12,
    rejected: 1,
    inReview: 5
  };

  const recentSubmissions = [
    {
      id: 1,
      title: "Monthly Progress Report - December 2024",
      type: "Progress Report",
      status: "Approved",
      submittedAt: "2024-01-08",
      reviewer: "Dr. Rajesh Kumar (HOD)",
      feedback: "Excellent work on project milestones"
    },
    {
      id: 2,
      title: "Leave Application - Annual Leave",
      type: "Leave Request",
      status: "In Review",
      submittedAt: "2024-01-10",
      reviewer: "Prof. Meera Sharma",
      feedback: null
    },
    {
      id: 3,
      title: "Research Paper Submission Request",
      type: "Academic",
      status: "Rejected",
      submittedAt: "2024-01-05",
      reviewer: "Dr. Priya Singh",
      feedback: "Please revise abstract and methodology section"
    },
    {
      id: 4,
      title: "Equipment Purchase Request",
      type: "Purchase",
      status: "Pending",
      submittedAt: "2024-01-09",
      reviewer: "Pending Assignment",
      feedback: null
    }
  ];

  const quickNotes = [
    {
      id: 1,
      text: "Meeting with HOD scheduled for Jan 15th",
      createdAt: "2024-01-10",
      priority: "High"
    },
    {
      id: 2,
      text: "Submit project proposal by Jan 20th",
      createdAt: "2024-01-09",
      priority: "Medium"
    },
    {
      id: 3,
      text: "Review colleague's research paper",
      createdAt: "2024-01-08",
      priority: "Low"
    }
  ];

  const documentArchive = [
    { category: "Reports", count: 24, lastAdded: "2024-01-08" },
    { category: "Leave Applications", count: 8, lastAdded: "2024-01-10" },
    { category: "Academic Submissions", count: 6, lastAdded: "2024-01-05" },
    { category: "Purchase Requests", count: 3, lastAdded: "2024-01-09" }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "In Review":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "Pending":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Approved":
        return "default" as const;
      case "Rejected":
        return "destructive" as const;
      case "In Review":
        return "secondary" as const;
      case "Pending":
        return "outline" as const;
      default:
        return "outline" as const;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Employee Dashboard</h1>
        <p className="text-muted-foreground">Submit, track, and manage your documents</p>
      </div>

      {/* Submission Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{submissionStats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting assignment</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Review</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{submissionStats.inReview}</div>
            <p className="text-xs text-muted-foreground">Being reviewed</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{submissionStats.approved}</div>
            <p className="text-xs text-muted-foreground">Successfully processed</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{submissionStats.rejected}</div>
            <p className="text-xs text-muted-foreground">Need revision</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Submit Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-500" />
            Submit New Reports/Circulars
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="h-20 flex flex-col gap-2"
              onClick={() => onNavigate('documents')}
            >
              <FileText className="h-6 w-6" />
              <span className="text-sm">Submit Report</span>
            </Button>
            <Button 
              variant="outline"
              className="h-20 flex flex-col gap-2"
              onClick={() => onNavigate('documents')}
            >
              <Upload className="h-6 w-6" />
              <span className="text-sm">Upload Document</span>
            </Button>
            <Button 
              variant="outline"
              className="h-20 flex flex-col gap-2"
              onClick={() => onNavigate('documents')}
            >
              <MessageSquare className="h-6 w-6" />
              <span className="text-sm">Submit Request</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Approval Status & Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-purple-500" />
              Approval Status & Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentSubmissions.map((submission) => (
              <div key={submission.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{submission.title}</h4>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(submission.status)}
                    <Badge variant={getStatusBadgeVariant(submission.status)}>
                      {submission.status}
                    </Badge>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground space-y-1 mb-2">
                  <p>Type: {submission.type}</p>
                  <p>Submitted: {submission.submittedAt}</p>
                  <p>Reviewer: {submission.reviewer}</p>
                </div>
                {submission.feedback && (
                  <div className="p-2 bg-muted rounded text-xs">
                    <p className="font-medium">Feedback:</p>
                    <p>{submission.feedback}</p>
                  </div>
                )}
                {submission.status === "Rejected" && (
                  <Button size="sm" className="mt-2" onClick={() => onNavigate('documents')}>
                    Re-upload Document
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Notes/Reminders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <StickyNote className="h-5 w-5 text-yellow-500" />
              Quick Notes/Reminder Feature
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickNotes.map((note) => (
              <div key={note.id} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium">{note.text}</p>
                  <Badge variant={
                    note.priority === "High" ? "destructive" : 
                    note.priority === "Medium" ? "default" : "secondary"
                  }>
                    {note.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Created: {note.createdAt}</p>
              </div>
            ))}
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full"
              onClick={() => onNavigate('notes')}
            >
              Add New Note
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Personal Document Archive */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5 text-gray-500" />
            Personal Document Archive
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {documentArchive.map((archive, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <h4 className="font-medium text-sm mb-2">{archive.category}</h4>
                <div className="text-2xl font-bold mb-1">{archive.count}</div>
                <p className="text-xs text-muted-foreground">Last added: {archive.lastAdded}</p>
                <Button size="sm" variant="outline" className="w-full mt-3">
                  View Archive
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-medium text-sm">Document Submission Rate</p>
                <p className="text-xs text-muted-foreground">This month vs last month</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">15 docs</p>
                <Badge variant="outline" className="text-green-600">+25%</Badge>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-medium text-sm">Average Approval Time</p>
                <p className="text-xs text-muted-foreground">Your submissions</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">2.1 days</p>
                <Badge variant="outline" className="text-green-600">-0.5 days</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completion Rate</span>
                <span>87%</span>
              </div>
              <Progress value={87} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}