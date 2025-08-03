import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { 
  Building, 
  FileText, 
  Users, 
  Calendar as CalendarIcon, 
  StickyNote,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { useState } from "react";

interface HodDashboardProps {
  onNavigate: (view: string) => void;
}

export function HodDashboard({ onNavigate }: HodDashboardProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const departmentStats = {
    pendingSubmissions: 6,
    approvedToday: 8,
    rejectedDocuments: 2,
    teamMembers: 24
  };

  const pendingApprovals = [
    {
      id: 1,
      title: "Faculty Leave Application - Dr. Priya Singh",
      type: "Leave Request",
      submittedBy: "Dr. Priya Singh",
      submittedAt: "2024-01-10 09:30 AM",
      priority: "Medium",
      department: "CSE"
    },
    {
      id: 2,
      title: "Equipment Purchase Proposal",
      type: "Purchase Request",
      submittedBy: "Prof. Amit Kumar",
      submittedAt: "2024-01-10 11:15 AM",
      priority: "High",
      department: "CSE"
    },
    {
      id: 3,
      title: "Course Curriculum Update",
      type: "Academic",
      submittedBy: "Dr. Neha Sharma",
      submittedAt: "2024-01-09 04:20 PM",
      priority: "Low",
      department: "CSE"
    }
  ];

  const upcomingTasks = [
    {
      id: 1,
      task: "Review Q1 Department Budget",
      date: "2024-01-15",
      time: "10:00 AM",
      type: "Review"
    },
    {
      id: 2,
      task: "Faculty Performance Evaluation",
      date: "2024-01-16",
      time: "02:00 PM",
      type: "Evaluation"
    },
    {
      id: 3,
      task: "Department Meeting",
      date: "2024-01-18",
      time: "11:00 AM",
      type: "Meeting"
    }
  ];

  const personalReminders = [
    {
      id: 1,
      text: "Submit annual department report by Jan 20",
      priority: "High",
      dueDate: "2024-01-20"
    },
    {
      id: 2,
      text: "Review new faculty applications",
      priority: "Medium",
      dueDate: "2024-01-22"
    },
    {
      id: 3,
      text: "Update course allocation for next semester",
      priority: "Low",
      dueDate: "2024-01-25"
    }
  ];

  const departmentAnalytics = [
    { metric: "Documents Processed", value: "156", change: "+12%" },
    { metric: "Average Processing Time", value: "2.3 days", change: "-15%" },
    { metric: "Faculty Satisfaction", value: "4.2/5", change: "+0.3" },
    { metric: "Compliance Score", value: "94%", change: "+2%" }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">HOD Dashboard - Computer Science</h1>
        <p className="text-muted-foreground">Department management and oversight</p>
      </div>

      {/* Department Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Submissions</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{departmentStats.pendingSubmissions}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{departmentStats.approvedToday}</div>
            <p className="text-xs text-muted-foreground">Documents processed</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{departmentStats.rejectedDocuments}</div>
            <p className="text-xs text-muted-foreground">Need revision</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{departmentStats.teamMembers}</div>
            <p className="text-xs text-muted-foreground">Faculty & Staff</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Approvals */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Approve/Reject Circular Interface
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingApprovals.map((approval) => (
              <div key={approval.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{approval.title}</h4>
                  <Badge variant={
                    approval.priority === "High" ? "destructive" : 
                    approval.priority === "Medium" ? "default" : "secondary"
                  }>
                    {approval.priority}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1 mb-3">
                  <p>Type: {approval.type}</p>
                  <p>Submitted by: {approval.submittedBy}</p>
                  <p>Submitted: {approval.submittedAt}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="default" onClick={() => onNavigate('approvals')}>
                    Review
                  </Button>
                  <Button size="sm" variant="outline" className="text-green-600 border-green-600">
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 border-red-600">
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-purple-500" />
              Team Task Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
            <div className="mt-4 space-y-2">
              <h4 className="font-medium text-sm">Upcoming Tasks</h4>
              {upcomingTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="text-xs p-2 bg-muted rounded">
                  <p className="font-medium">{task.task}</p>
                  <p className="text-muted-foreground">{task.date} at {task.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Self Reminder Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <StickyNote className="h-5 w-5 text-yellow-500" />
              Self-Reminder Panel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {personalReminders.map((reminder) => (
              <div key={reminder.id} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium">{reminder.text}</p>
                  <Badge variant={
                    reminder.priority === "High" ? "destructive" : 
                    reminder.priority === "Medium" ? "default" : "secondary"
                  }>
                    {reminder.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Due: {reminder.dueDate}</p>
              </div>
            ))}
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full"
              onClick={() => onNavigate('notes')}
            >
              Add New Reminder
            </Button>
          </CardContent>
        </Card>

        {/* Department Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Department-Specific Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {departmentAnalytics.map((analytic, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">{analytic.metric}</p>
                  <p className="text-lg font-bold">{analytic.value}</p>
                </div>
                <Badge variant="outline" className="text-green-600">
                  {analytic.change}
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
              onClick={() => onNavigate('documents')}
            >
              <FileText className="h-6 w-6" />
              <span className="text-sm">Submit Report</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => onNavigate('approvals')}
            >
              <CheckCircle className="h-6 w-6" />
              <span className="text-sm">Review Queue</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => onNavigate('calendar')}
            >
              <CalendarIcon className="h-6 w-6" />
              <span className="text-sm">Schedule Meeting</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col gap-2"
              onClick={() => onNavigate('analytics')}
            >
              <TrendingUp className="h-6 w-6" />
              <span className="text-sm">View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}