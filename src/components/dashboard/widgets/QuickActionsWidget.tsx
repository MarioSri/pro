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
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        description: "Search documents, users, departments"
      },
      {
        label: "Submit Document",
        icon: Plus,
        path: "/documents",
        color: "text-green-600",
        bgColor: "bg-green-50",
        description: "Upload new documents"
      },
      {
        label: "Calendar",
        icon: Calendar,
        path: "/calendar",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        description: "Schedule meetings and events"
      },
      {
        label: "Emergency",
        icon: AlertTriangle,
        path: "/emergency",
        color: "text-red-600",
        bgColor: "bg-red-50",
        description: "Emergency submissions"
      },
      {
        label: "Messages",
        icon: MessageSquare,
        path: "/messages",
        color: "text-indigo-600",
        bgColor: "bg-indigo-50",
        description: "Communication center"
      },
      {
        label: "Reminders",
        icon: Bell,
        path: "/reminders",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        description: "Personal reminders"
      }
    ];

    const roleSpecificActions = {
      principal: [
        ...baseActions,
        {
          label: "Mass Distribution",
          icon: Share,
          path: "/mass-distribution",
          color: "text-cyan-600",
          bgColor: "bg-cyan-50",
          description: "Distribute to multiple recipients"
        },
        {
          label: "Role Management",
          icon: Users,
          path: "/role-management",
          color: "text-pink-600",
          bgColor: "bg-pink-50",
          description: "Manage user roles"
        },
        {
          label: "Workflow Builder",
          icon: GitBranch,
          path: "/workflow",
          color: "text-violet-600",
          bgColor: "bg-violet-50",
          description: "Design workflows"
        },
        {
          label: "Analytics",
          icon: BarChart3,
          path: "/analytics",
          color: "text-emerald-600",
          bgColor: "bg-emerald-50",
          description: "System analytics"
        },
        {
          label: "Approvals",
          icon: CheckSquare,
          path: "/approvals",
          color: "text-amber-600",
          bgColor: "bg-amber-50",
          description: "Review approvals"
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
          color: "text-amber-600",
          bgColor: "bg-amber-50",
          description: "Review approvals"
        },
        {
          label: "Analytics",
          icon: BarChart3,
          path: "/analytics",
          color: "text-emerald-600",
          bgColor: "bg-emerald-50",
          description: "Department analytics"
        },
        {
          label: "Workflow Management",
          icon: GitBranch,
          path: "/workflow",
          color: "text-violet-600",
          bgColor: "bg-violet-50",
          description: "Manage workflows"
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
          color: "text-amber-600",
          bgColor: "bg-amber-50",
          description: "Review program documents"
        },
        {
          label: "Analytics",
          icon: BarChart3,
          path: "/analytics",
          color: "text-emerald-600",
          bgColor: "bg-emerald-50",
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
          color: "text-amber-600",
          bgColor: "bg-amber-50",
          description: "Review department documents"
        },
        {
          label: "Analytics",
          icon: BarChart3,
          path: "/analytics",
          color: "text-emerald-600",
          bgColor: "bg-emerald-50",
          description: "Department analytics"
        },
        {
          label: "Faculty Management",
          icon: Users,
          path: "/faculty",
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          description: "Manage faculty"
        }
      ],
      employee: [
        ...baseActions.slice(0, 6),
        {
          label: "Track Documents",
          icon: FileText,
          path: "/track-documents",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          description: "Track submissions"
        },
        {
          label: "Bi-Directional Routing",
          icon: ArrowRightLeft,
          path: "/approval-routing",
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          description: "Approval routing"
        },
        {
          label: "Analytics",
          icon: BarChart3,
          path: "/analytics",
          color: "text-emerald-600",
          bgColor: "bg-emerald-50",
          description: "View analytics"
        }
      ]
    };

    return roleSpecificActions[userRole as keyof typeof roleSpecificActions] || baseActions;
  };

  const actions = getActionsForRole();

  return (
    <Card className={cn(
      "shadow-elegant hover:shadow-glow transition-all duration-300 h-full",
      isSelected && "border-primary",
      isCustomizing && "cursor-pointer"
    )} onClick={onSelect}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Quick Actions
          </div>
          <Badge variant="outline" className="text-xs">
            {actions.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {actions.map((action, index) => (
            <Button
              key={action.path}
              variant="outline"
              onClick={() => navigate(action.path)}
              className={cn(
                "flex flex-col gap-2 h-20 p-3 transition-all duration-200 hover:shadow-md animate-scale-in border-gray-200 hover:border-gray-300",
                "group relative overflow-hidden"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Background Gradient on Hover */}
              <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                action.bgColor
              )} />
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className={cn(
                  "p-2 rounded-lg transition-colors duration-200",
                  action.bgColor,
                  "group-hover:bg-white group-hover:shadow-sm"
                )}>
                  <action.icon className={cn(
                    "w-4 h-4 transition-colors duration-200",
                    action.color
                  )} />
                </div>
                <div className="text-center">
                  <span className="text-xs font-medium text-gray-900 group-hover:text-gray-900">
                    {action.label}
                  </span>
                </div>
              </div>
            </Button>
          ))}
        </div>

        {/* Role-specific quick stats */}
        {(userRole === 'principal' || userRole === 'registrar') && (
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xl font-bold text-red-600">
                  {userRole === 'principal' ? '8' : '5'}
                </p>
                <p className="text-xs text-gray-600 font-medium">Urgent</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xl font-bold text-orange-600">
                  {userRole === 'principal' ? '23' : '12'}
                </p>
                <p className="text-xs text-gray-600 font-medium">Today</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xl font-bold text-green-600">
                  {userRole === 'principal' ? '156' : '89'}
                </p>
                <p className="text-xs text-gray-600 font-medium">This Week</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};