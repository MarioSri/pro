import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  CalendarDays,
  User,
  FileIcon
} from "lucide-react";

interface DocumentTrackerProps {
  userRole: string;
}

export function DocumentTracker({ userRole }: DocumentTrackerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Mock data - would come from API in real app
  const documents = [
    {
      id: "DOC-2024-001",
      title: "Faculty Recruitment Authorization",
      type: "Letter",
      status: "approved",
      priority: "high",
      submittedBy: "Dr. Sharma (HOD-CSE)",
      submittedDate: "2024-01-15",
      approvedBy: "Principal",
      approvedDate: "2024-01-16",
      description: "Authorization letter for recruiting 3 faculty members in CSE department",
      workflow: [
        { step: "Submitted", date: "2024-01-15 10:30 AM", status: "completed", user: "Dr. Sharma" },
        { step: "HOD Review", date: "2024-01-15 02:15 PM", status: "completed", user: "Dr. Sharma" },
        { step: "Registrar Review", date: "2024-01-15 04:20 PM", status: "completed", user: "Registrar" },
        { step: "Principal Approval", date: "2024-01-16 09:45 AM", status: "completed", user: "Principal" }
      ]
    },
    {
      id: "DOC-2024-002",
      title: "Semester Fee Structure Update",
      type: "Circular",
      status: "pending",
      priority: "normal",
      submittedBy: "Finance Team",
      submittedDate: "2024-01-14",
      description: "Updated fee structure for the upcoming semester",
      workflow: [
        { step: "Submitted", date: "2024-01-14 11:00 AM", status: "completed", user: "Finance Team" },
        { step: "Registrar Review", date: "2024-01-14 03:30 PM", status: "completed", user: "Registrar" },
        { step: "Principal Approval", date: "Pending", status: "pending", user: "Principal" }
      ]
    },
    {
      id: "DOC-2024-003",
      title: "Monthly Academic Performance Report",
      type: "Report",
      status: "under-review",
      priority: "normal",
      submittedBy: "Academic Cell",
      submittedDate: "2024-01-13",
      description: "Comprehensive academic performance analysis for December 2023",
      workflow: [
        { step: "Submitted", date: "2024-01-13 09:15 AM", status: "completed", user: "Academic Cell" },
        { step: "Registrar Review", date: "In Progress", status: "current", user: "Registrar" }
      ]
    },
    {
      id: "DOC-2024-004",
      title: "Infrastructure Development Proposal",
      type: "Report",
      status: "rejected",
      priority: "urgent",
      submittedBy: "Engineering Dept",
      submittedDate: "2024-01-12",
      rejectedBy: "Principal",
      rejectedDate: "2024-01-13",
      rejectionReason: "Budget constraints. Please revise with cost optimization.",
      description: "Proposal for new laboratory equipment and infrastructure upgrades",
      workflow: [
        { step: "Submitted", date: "2024-01-12 02:00 PM", status: "completed", user: "Engineering Dept" },
        { step: "HOD Review", date: "2024-01-12 04:45 PM", status: "completed", user: "HOD-Engineering" },
        { step: "Registrar Review", date: "2024-01-13 10:20 AM", status: "completed", user: "Registrar" },
        { step: "Principal Review", date: "2024-01-13 11:30 AM", status: "rejected", user: "Principal" }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="w-4 h-4 text-success" />;
      case "pending": return <Clock className="w-4 h-4 text-warning" />;
      case "under-review": return <Eye className="w-4 h-4 text-blue-500" />;
      case "rejected": return <XCircle className="w-4 h-4 text-destructive" />;
      default: return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: "success" as const,
      pending: "warning" as const,
      "under-review": "default" as const,
      rejected: "destructive" as const
    };
    return variants[status as keyof typeof variants] || "default";
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      normal: "text-blue-500",
      high: "text-warning",
      urgent: "text-destructive"
    };
    return colors[priority as keyof typeof colors] || "text-muted-foreground";
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    const matchesType = typeFilter === "all" || doc.type.toLowerCase() === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Document Tracking</h2>
          <p className="text-muted-foreground">Monitor status and progress of all submitted documents</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-elegant">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents by title or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="letter">Letter</SelectItem>
                  <SelectItem value="circular">Circular</SelectItem>
                  <SelectItem value="report">Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <div className="space-y-4">
        {filteredDocuments.map((doc) => (
          <Card key={doc.id} className="shadow-elegant hover:shadow-glow transition-all duration-300">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{doc.title}</h3>
                      <Badge variant="outline">{doc.id}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{doc.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FileIcon className="w-4 h-4" />
                        {doc.type}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {doc.submittedBy}
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" />
                        {doc.submittedDate}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-4 h-4 ${getPriorityColor(doc.priority)}`} />
                    <Badge variant={getStatusBadge(doc.status)}>
                      {getStatusIcon(doc.status)}
                      <span className="ml-1 capitalize">{doc.status.replace('-', ' ')}</span>
                    </Badge>
                  </div>
                </div>

                {/* Workflow Progress */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Workflow Progress
                  </h4>
                  <div className="space-y-2">
                    {doc.workflow.map((step, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          step.status === 'completed' ? 'bg-success' :
                          step.status === 'current' ? 'bg-warning' :
                          step.status === 'rejected' ? 'bg-destructive' :
                          'bg-muted-foreground'
                        }`} />
                        <div className="flex-1 flex items-center justify-between">
                          <span className="text-sm font-medium">{step.step}</span>
                          <div className="text-xs text-muted-foreground">
                            {step.date} • {step.user}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rejection Reason (if applicable) */}
                {doc.status === "rejected" && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                    <h5 className="font-medium text-destructive mb-1">Rejection Reason</h5>
                    <p className="text-sm text-muted-foreground">{doc.rejectionReason}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <Card className="shadow-elegant">
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No documents found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}