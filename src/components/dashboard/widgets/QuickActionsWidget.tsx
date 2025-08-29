import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';
import {
  Search,
  Plus,
  Clock,
  Calendar,
  AlertTriangle,
  Bell,
  Users,
  FileText,
  CheckSquare,
  BarChart3,
  GitBranch,
  MessageSquare,
  Zap,
  Settings,
  Upload,
  Download,
  Share,
  Archive,
  ArrowRightLeft
} from 'lucide-react';

interface QuickActionsWidgetProps {
  userRole: string;
  permissions: any;
  isCustomizing?: boolean;
  onSelect?: () => void;
  isSelected?: boolean;
}

export const QuickActionsWidget: React.FC<QuickActionsWidgetProps> = ({
  userRole,
  permissions,
  isCustomizing,
  onSelect,
  isSelected
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isMobile } = useResponsive();

  const getActionsForRole = () => {
    const baseActions = [
      {
        label: "Universal Search",
        icon: Search,
        path: "/search",
        color: "text-primary",
        bgColor: "bg-primary/10",
        description: "Search documents, users, departments"
      },
      {
        label: "Submit Document",
        icon: Plus,
        path: "/documents",
        color: "text-success",
        bgColor: "bg-success/10",
        description: "Upload new documents"
      },
      {
        label: "Calendar",
        icon: Calendar,
        path: "/calendar",
        color: "text-blue-500",
        bgColor: "bg-blue-50",
        description: "Schedule meetings and events"
      },
      {
        label: "Emergency",
        icon: AlertTriangle,
        path: "/emergency",
        color: "text-destructive",
        bgColor: "bg-destructive/10",
        description: "Emergency submissions"
      },
      {
        label: "Reminders",
        icon: Bell,
        path: "/reminders",
        color: "text-purple-500",
        bgColor: "bg-purple-50",
        description: "Personal reminders"
      },
      {
        label: "Messages",
        icon: MessageSquare,
        path: "/messages",
        color: "text-indigo-500",
        bgColor: "bg-indigo-50",
        description: "Communication center"
      }
    ];

    const roleSpecificActions = {
      principal: [
        ...baseActions,
        {
          label: "Mass Distribution",
          icon: Share,
          path: "/mass-distribution",
          color: "text-orange-500",
          bgColor: "bg-orange-50",
          description: "Distribute to multiple recipients"
        },
        {
          label: "Role Management",
          icon: Users,
          path: "/role-management",
          color: "text-cyan-500",
          bgColor: "bg-cyan-50",
          description: "Manage user roles and permissions"
        },
        {
          label: "Workflow Builder",
          icon: GitBranch,
          path: "/workflow",
          color: "text-pink-500",
          bgColor: "bg-pink-50",
          description: "Design approval workflows"
        },
        {
          label: "Analytics",
          icon: BarChart3,
          path: "/analytics",
          color: "text-green-600",
          bgColor: "bg-green-50",
          description: "System analytics and reports"
        },
        {
          label: "Approvals",
          icon: CheckSquare,
          path: "/approvals",
          color: "text-warning",
          bgColor: "bg-yellow-50",
          description: "Review pending approvals"
        },
        {
          label: "System Settings",
          icon: Settings,
          path: "/settings",
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          description: "System configuration"
        }
      ],
      registrar: [
        ...baseActions,
        {
          label: "Approvals",
          icon: CheckSquare,
          path: "/approvals",
          color: "text-warning",
          bgColor: "bg-yellow-50",
          description: "Review pending approvals"
        },
        {
          label: "Analytics",
          icon: BarChart3,
          path: "/analytics",
          color: "text-green-600",
          bgColor: "bg-green-50",
          description: "Department analytics"
        },
        {
          label: "Workflow Management",
          icon: GitBranch,
          path: "/workflow",
          color: "text-pink-500",
          bgColor: "bg-pink-50",
          description: "Manage approval workflows"
        },
        {
          label: "Archive",
          icon: Archive,
          path: "/archive",
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          description: "Document archive"
        }
      ],
      'program-head': [
        ...baseActions,
        {
          label: "Approvals",
          icon: CheckSquare,
          path: "/approvals",
          color: "text-warning",
          bgColor: "bg-yellow-50",
          description: "Review program documents"
        },
        {
          label: "Analytics",
          icon: BarChart3,
          path: "/analytics",
          color: "text-green-600",
          bgColor: "bg-green-50",
          description: "Program analytics"
        },
        {
          label: "Department Chat",
          icon: Users,
          path: "/department-chat",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          description: "Department communication"
        }
      ],
      hod: [
        ...baseActions,
        {
          label: "Approvals",
          icon: CheckSquare,
          path: "/approvals",
          color: "text-warning",
          bgColor: "bg-yellow-50",
          description: "Review department documents"
        },
        {
          label: "Analytics",
          icon: BarChart3,
          path: "/analytics",
          color: "text-green-600",
          bgColor: "bg-green-50",
          description: "Department analytics"
        },
        {
          label: "Faculty Management",
          icon: Users,
          path: "/faculty",
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          description: "Manage faculty activities"
        }
      ],
      employee: [
        ...baseActions.slice(0, 6), // Remove some actions for employees
        {
          label: "Track Documents",
          icon: FileText,
          path: "/documents",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          description: "Track your submissions"
        },
        {
          label: "Bi-Directional Routing",
          icon: ArrowRightLeft,
          path: "/approval-routing",
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          description: "Approval routing management"
        },
        {
          label: "Analytics",
          icon: BarChart3,
          path: "/analytics",
          color: "text-green-600",
          bgColor: "bg-green-50",
          description: "View analytics dashboard"
        }
      ]
    };

    return roleSpecificActions[userRole as keyof typeof roleSpecificActions] || baseActions;
  };

  const actions = getActionsForRole();

  return (
    <Card className={cn(
      "shadow-elegant hover:shadow-glow transition-all duration-300",
      isSelected && "border-primary",
      isCustomizing && "cursor-pointer"
    )} onClick={onSelect}>
      <CardHeader className={cn(isMobile && "pb-3")}>
        <CardTitle className={cn(
          "flex items-center gap-2",
          isMobile ? "text-lg" : "text-xl"
        )}>
          <Zap className="w-5 h-5 text-primary" />
          Quick Actions
          <Badge variant="outline" className="ml-auto">
            {actions.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn(
          "grid gap-3",
          isMobile ? "grid-cols-2" : "grid-cols-3 lg:grid-cols-4"
        )}>
          {actions.map((action, index) => (
            <Button
              key={action.path}
              variant="outline"
              onClick={() => navigate(action.path)}
              className={cn(
                "flex flex-col gap-2 transition-all duration-200 hover:shadow-md animate-scale-in",
                isMobile ? "h-20 p-3" : "h-24 p-4"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={cn(
                "rounded-full flex items-center justify-center",
                action.bgColor,
                isMobile ? "p-2" : "p-3"
              )}>
                <action.icon className={cn(
                  action.color,
                  isMobile ? "w-4 h-4" : "w-5 h-5"
                )} />
              </div>
              <div className="text-center">
                <span className={cn(
                  "font-medium",
                  isMobile ? "text-xs" : "text-sm"
                )}>
                  {action.label}
                </span>
                {!isMobile && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {action.description}
                  </p>
                )}
              </div>
            </Button>
          ))}
        </div>

        {/* Role-specific quick stats */}
        {(userRole === 'principal' || userRole === 'registrar') && (
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2 bg-muted/30 rounded">
                <p className={cn(
                  "font-bold text-primary",
                  isMobile ? "text-lg" : "text-xl"
                )}>
                  {userRole === 'principal' ? '8' : '5'}
                </p>
                <p className={cn(
                  "text-muted-foreground",
                  isMobile ? "text-xs" : "text-sm"
                )}>
                  Urgent
                </p>
              </div>
              <div className="p-2 bg-muted/30 rounded">
                <p className={cn(
                  "font-bold text-warning",
                  isMobile ? "text-lg" : "text-xl"
                )}>
                  {userRole === 'principal' ? '23' : '12'}
                </p>
                <p className={cn(
                  "text-muted-foreground",
                  isMobile ? "text-xs" : "text-sm"
                )}>
                  Today
                </p>
              </div>
              <div className="p-2 bg-muted/30 rounded">
                <p className={cn(
                  "font-bold text-success",
                  isMobile ? "text-lg" : "text-xl"
                )}>
                  {userRole === 'principal' ? '156' : '89'}
                </p>
                <p className={cn(
                  "text-muted-foreground",
                  isMobile ? "text-xs" : "text-sm"
                )}>
                  This Week
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};