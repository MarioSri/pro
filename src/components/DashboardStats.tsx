import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Calendar as CalendarIcon,
  TrendingUp,
  AlertTriangle,
  Eye,
  Search,
  ArrowRight
} from "lucide-react";
import { AdvancedSignatureIcon } from "@/components/ui/signature-icon";

interface DashboardStatsProps {
  userRole: string;
  onNavigate: (view: string) => void;
}

export function DashboardStats({ userRole, onNavigate }: DashboardStatsProps) {
  const navigate = useNavigate();
  
  // Mock data - in real app this would come from API
  const getStatsForRole = () => {
    const commonStats = [
      {
        title: "Total Documents",
        value: "47",
        change: "+12%",
        icon: FileText,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        trend: "up"
      },
      {
        title: "Pending Reviews",
        value: "8",
        change: "-3",
        icon: Clock,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        trend: "down"
      },
      {
        title: "Approved",
        value: "35",
        change: "+8",
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
        trend: "up"
      },
      {
        title: "Rejected",
        value: "4",
        change: "+1",
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        trend: "up"
      }
    ];

    const roleSpecific = {
      principal: [
        ...baseStats,
        {
          title: "Active Users",
          value: "156",
          change: "+5%",
          icon: Users,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          trend: "up"
        }
      ],
      registrar: [
        ...baseStats,
        {
          title: "Workflows Active",
          value: "23",
          change: "+2",
          icon: TrendingUp,
          color: "text-indigo-600",
          bgColor: "bg-indigo-50",
          trend: "up"
        }
      ],
      hod: baseStats,
      employee: baseStats.slice(0, 3)
    };

    return roleSpecific[userRole as keyof typeof roleSpecific] || baseStats;
  };

  const stats = getStatsForRole();

  const recentDocuments = [
    {
      id: 1,
      title: "Faculty Recruitment Letter",
      type: "Letter",
      status: "approved",
      submittedBy: "Dr. Sharma",
      date: "2024-01-15",
      priority: "normal"
    },
    {
      id: 2,
      title: "Semester Fee Structure Circular",
      type: "Circular",
      status: "pending",
      submittedBy: "Finance Team",
      date: "2024-01-14",
      priority: "high"
    },
    {
      id: 3,
      title: "Monthly Academic Report",
      type: "Report",
      status: "under-review",
      submittedBy: "Academic Cell",
      date: "2024-01-13",
      priority: "normal"
    },
    {
      id: 4,
      title: "Infrastructure Development Plan",
      type: "Report",
      status: "rejected",
      submittedBy: "Engineering Dept",
      date: "2024-01-12",
      priority: "urgent"
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { variant: "default" as const, text: "Approved", color: "bg-green-100 text-green-800" },
      pending: { variant: "secondary" as const, text: "Pending", color: "bg-orange-100 text-orange-800" },
      "under-review": { variant: "outline" as const, text: "Under Review", color: "bg-blue-100 text-blue-800" },
      rejected: { variant: "destructive" as const, text: "Rejected", color: "bg-red-100 text-red-800" }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || { variant: "outline" as const, text: status, color: "bg-gray-100 text-gray-800" };
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      normal: "text-blue-600",
      high: "text-orange-600",
      urgent: "text-red-600"
    };
    return colors[priority as keyof typeof colors] || "text-gray-600";
  };

  return (
    <div className="space-y-6">
      {/* Improved Stats Grid - Better Alignment */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-elegant hover:shadow-glow transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                </div>
                <div className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full",
                  stat.trend === 'up' ? 'text-green-700 bg-green-100' : 
                  stat.trend === 'down' ? 'text-red-700 bg-red-100' : 'text-gray-700 bg-gray-100'
                )}>
                  {stat.change}
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Improved Recent Documents - Better Layout */}
      <Card className="shadow-elegant">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Documents</CardTitle>
              <CardDescription className="text-sm">Latest document submissions and their status</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/documents")} className="h-9">
              <Eye className="w-4 h-4 mr-2" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 truncate">{doc.title}</h4>
                    <p className="text-xs text-gray-600">
                      {doc.type} • {doc.submittedBy} • {doc.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <AlertTriangle className={cn("w-4 h-4", getPriorityColor(doc.priority))} />
                  <Badge className={cn("text-xs", getStatusBadge(doc.status).color)}>
                    {getStatusBadge(doc.status).text}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Improved Quick Actions - Compact Grid */}
      <Card className="shadow-elegant">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription className="text-sm">Frequently used actions for your role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button 
              variant="outline" 
              className="h-16 p-3 flex flex-col gap-2 hover:shadow-md transition-all"
              onClick={() => navigate("/search")}
            >
              <Search className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-medium">Universal Search</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 p-3 flex flex-col gap-2 hover:shadow-md transition-all"
              onClick={() => navigate("/documents")}
            >
              <FileText className="w-5 h-5 text-green-600" />
              <span className="text-xs font-medium">Submit Document</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 p-3 flex flex-col gap-2 hover:shadow-md transition-all"
              onClick={() => navigate("/approvals")}
            >
              <AdvancedSignatureIcon className="w-5 h-5 text-orange-600" />
              <span className="text-xs font-medium">Review Pending</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 p-3 flex flex-col gap-2 hover:shadow-md transition-all"
              onClick={() => navigate("/calendar")}
            >
              <CalendarIcon className="w-5 h-5 text-purple-600" />
              <span className="text-xs font-medium">Schedule Meeting</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}