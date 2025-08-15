import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';
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
  Plus,
  Bell
} from 'lucide-react';

interface DashboardStats {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}

interface RecentDocument {
  id: string;
  title: string;
  type: string;
  status: 'approved' | 'pending' | 'under-review' | 'rejected';
  submittedBy: string;
  date: string;
  priority: 'normal' | 'high' | 'urgent';
}

export const ResponsiveDashboard: React.FC = () => {
  const { user } = useAuth();
  const { isMobile, isTablet } = useResponsive();
  const navigate = useNavigate();

  if (!user) return null;

  const getStatsForRole = (): DashboardStats[] => {
    const commonStats = [
      {
        title: "Total Documents",
        value: "47",
        change: "+12%",
        icon: FileText,
        color: "text-blue-500",
        bgColor: "bg-blue-50"
      },
      {
        title: "Pending Reviews",
        value: "8",
        change: "-3",
        icon: Clock,
        color: "text-warning",
        bgColor: "bg-yellow-50"
      },
      {
        title: "Approved",
        value: "35",
        change: "+8",
        icon: CheckCircle,
        color: "text-success",
        bgColor: "bg-green-50"
      },
      {
        title: "Rejected",
        value: "4",
        change: "+1",
        icon: XCircle,
        color: "text-destructive",
        bgColor: "bg-red-50"
      }
    ];

    const roleSpecific = {
      principal: [
        ...commonStats,
        {
          title: "Active Users",
          value: "156",
          change: "+5%",
          icon: Users,
          color: "text-purple-500",
          bgColor: "bg-purple-50"
        }
      ],
      registrar: [
        ...commonStats,
        {
          title: "Workflows Active",
          value: "23",
          change: "+2",
          icon: TrendingUp,
          color: "text-indigo-500",
          bgColor: "bg-indigo-50"
        }
      ],
      hod: commonStats,
      'program-head': commonStats,
      employee: commonStats.slice(0, 3)
    };

    return roleSpecific[user.role] || commonStats;
  };

  const recentDocuments: RecentDocument[] = [
    {
      id: "1",
      title: "Faculty Recruitment Letter",
      type: "Letter",
      status: "approved",
      submittedBy: "Dr. Sharma",
      date: "2024-01-15",
      priority: "normal"
    },
    {
      id: "2",
      title: "Semester Fee Structure Circular",
      type: "Circular",
      status: "pending",
      submittedBy: "Finance Team",
      date: "2024-01-14",
      priority: "high"
    },
    {
      id: "3",
      title: "Monthly Academic Report",
      type: "Report",
      status: "under-review",
      submittedBy: "Academic Cell",
      date: "2024-01-13",
      priority: "normal"
    },
    {
      id: "4",
      title: "Infrastructure Development Plan",
      type: "Report",
      status: "rejected",
      submittedBy: "Engineering Dept",
      date: "2024-01-12",
      priority: "urgent"
    }
  ];

  const quickActions = [
    { 
      label: "Search", 
      icon: Search, 
      path: "/search", 
      color: "text-primary",
      description: "Find documents, users, and more"
    },
    { 
      label: "Submit Document", 
      icon: Plus, 
      path: "/documents", 
      color: "text-success",
      description: "Upload new documents"
    },
    { 
      label: "Review Pending", 
      icon: Clock, 
      path: "/approvals", 
      color: "text-warning",
      description: "Review pending approvals",
      show: user.permissions.canApprove
    },
    { 
      label: "Schedule Meeting", 
      icon: CalendarIcon, 
      path: "/calendar", 
      color: "text-blue-500",
      description: "Schedule new meetings"
    },
    { 
      label: "Emergency", 
      icon: AlertTriangle, 
      path: "/emergency", 
      color: "text-destructive",
      description: "Emergency submissions"
    },
    { 
      label: "Reminders", 
      icon: Bell, 
      path: "/reminders", 
      color: "text-purple-500",
      description: "Personal reminders"
    }
  ].filter(action => action.show !== false);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { variant: "success" as const, text: "Approved" },
      pending: { variant: "warning" as const, text: "Pending" },
      "under-review": { variant: "default" as const, text: "Under Review" },
      rejected: { variant: "destructive" as const, text: "Rejected" }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || { variant: "default" as const, text: status };
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      normal: "text-blue-500",
      high: "text-warning",
      urgent: "text-destructive"
    };
    return colors[priority as keyof typeof colors] || "text-muted-foreground";
  };

  const stats = getStatsForRole();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className={cn(
        "bg-gradient-primary rounded-lg p-6 text-primary-foreground",
        isMobile && "p-4"
      )}>
        <h1 className={cn(
          "font-bold mb-2",
          isMobile ? "text-xl" : "text-2xl"
        )}>
          Welcome back, {user.name.split(' ')[0]}!
        </h1>
        <p className={cn(
          "opacity-90",
          isMobile ? "text-sm" : "text-base"
        )}>
          {user.department || 'HITAM'} • {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </p>
      </div>

      {/* Stats Grid */}
      <div className={cn(
        "grid gap-4",
        isMobile ? "grid-cols-2" : isTablet ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-4"
      )}>
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-elegant hover:shadow-glow transition-all duration-300">
            <CardContent className={cn("p-4", isMobile && "p-3")}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className={cn(
                    "text-muted-foreground font-medium",
                    isMobile ? "text-xs" : "text-sm"
                  )}>
                    {stat.title}
                  </p>
                  <p className={cn(
                    "font-bold",
                    isMobile ? "text-xl" : "text-2xl"
                  )}>
                    {stat.value}
                  </p>
                  <p className={cn(
                    "text-muted-foreground mt-1",
                    isMobile ? "text-xs" : "text-xs"
                  )}>
                    <span className={stat.change.startsWith('+') ? 'text-success' : 'text-destructive'}>
                      {stat.change}
                    </span>
                    {' '}from last week
                  </p>
                </div>
                <div className={cn(
                  "rounded-full flex-shrink-0",
                  stat.bgColor,
                  isMobile ? "p-2" : "p-3"
                )}>
                  <stat.icon className={cn(
                    stat.color,
                    isMobile ? "w-5 h-5" : "w-6 h-6"
                  )} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="shadow-elegant">
        <CardHeader className={cn(isMobile && "pb-3")}>
          <CardTitle className={cn(isMobile ? "text-lg" : "text-xl")}>
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={cn(
            "grid gap-3",
            isMobile ? "grid-cols-2" : isTablet ? "grid-cols-3" : "grid-cols-3 lg:grid-cols-6"
          )}>
            {quickActions.map((action) => (
              <Button
                key={action.path}
                variant="outline"
                onClick={() => navigate(action.path)}
                className={cn(
                  "flex flex-col gap-2 transition-all duration-200 hover:shadow-md",
                  isMobile ? "h-20 p-3" : "h-24 p-4"
                )}
              >
                <action.icon className={cn(
                  action.color,
                  isMobile ? "w-5 h-5" : "w-6 h-6"
                )} />
                <div className="text-center">
                  <span className={cn(
                    "font-medium",
                    isMobile ? "text-xs" : "text-sm"
                  )}>
                    {action.label}
                  </span>
                  {!isMobile && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {action.description}
                    </p>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Documents */}
      <Card className="shadow-elegant">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={cn(isMobile ? "text-lg" : "text-xl")}>
                Recent Documents
              </CardTitle>
              <p className={cn(
                "text-muted-foreground",
                isMobile ? "text-sm" : "text-base"
              )}>
                Latest document submissions and their status
              </p>
            </div>
            {!isMobile && (
              <Button variant="outline" size="sm" onClick={() => navigate("/documents")}>
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className={cn(isMobile && "px-4")}>
          <div className="space-y-3">
            {recentDocuments.map((doc) => (
              <div 
                key={doc.id} 
                className={cn(
                  "flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer",
                  isMobile && "flex-col items-start space-y-3"
                )}
                onClick={() => navigate(`/documents/${doc.id}`)}
              >
                <div className={cn(
                  "flex items-center gap-3",
                  isMobile && "w-full"
                )}>
                  <div className="p-2 bg-primary/10 rounded-md flex-shrink-0">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={cn(
                      "font-medium",
                      isMobile ? "text-base" : "text-sm"
                    )}>
                      {doc.title}
                    </h4>
                    <p className={cn(
                      "text-muted-foreground",
                      isMobile ? "text-sm" : "text-xs"
                    )}>
                      {doc.type} • {doc.submittedBy} • {doc.date}
                    </p>
                  </div>
                </div>
                
                <div className={cn(
                  "flex items-center gap-2 flex-shrink-0",
                  isMobile && "w-full justify-between"
                )}>
                  <AlertTriangle className={cn(
                    "w-4 h-4",
                    getPriorityColor(doc.priority)
                  )} />
                  <Badge variant={getStatusBadge(doc.status).variant}>
                    {getStatusBadge(doc.status).text}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          
          {isMobile && (
            <Button 
              variant="outline" 
              onClick={() => navigate("/documents")}
              className="w-full mt-4 h-12"
            >
              <Eye className="w-4 h-4 mr-2" />
              View All Documents
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};