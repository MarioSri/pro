import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  MessageSquare,
  GitBranch,
  CheckSquare,
  BarChart3,
  UserCheck,
  Users,
  GraduationCap,
  Building,
  Shield,
  Settings,
  Crown,
  Briefcase,
  PenTool,
  StickyNote,
  Bell,
  AlertTriangle,
  Search,
  ArrowRightLeft,
  Eye
} from "lucide-react";
import { AdvancedSignatureIcon } from "@/components/ui/signature-icon";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  userRole: string;
}

export function DashboardSidebar({ userRole }: DashboardSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;

  const getRoleInfo = () => {
    switch (userRole) {
      case "principal":
        return { 
          icon: Crown, 
          title: "Principal", 
          color: "bg-purple-100 text-purple-700 border-purple-200",
          description: "Institution Principal"
        };
      case "registrar":
        return { 
          icon: Shield, 
          title: "Registrar", 
          color: "bg-blue-100 text-blue-700 border-blue-200",
          description: "Academic Registrar"
        };
      case "program-head":
        return { 
          icon: Users, 
          title: "Program Head", 
          color: "bg-green-100 text-green-700 border-green-200",
          description: "Program Department Head"
        };
      case "hod":
        return { 
          icon: Users, 
          title: "HOD", 
          color: "bg-orange-100 text-orange-700 border-orange-200",
          description: "Head of Department"
        };
      case "employee":
        return { 
          icon: Briefcase, 
          title: "Employee", 
          color: "bg-gray-100 text-gray-700 border-gray-200",
          description: "Staff Member"
        };
      default:
        return { 
          icon: Briefcase, 
          title: "Employee", 
          color: "bg-gray-100 text-gray-700 border-gray-200",
          description: "Staff Member"
        };
    }
  };

  const roleInfo = getRoleInfo();
  const RoleIcon = roleInfo.icon;

  // Role-based menu items
  const getMenuItems = () => {
    const commonItems = [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Search", url: "/search", icon: Search },
      { title: "Document Management", url: "/documents", icon: FileText },
      { title: "Track Documents", url: "/track-documents", icon: Eye },
      { title: "Calendar", url: "/calendar", icon: Calendar },
      { title: "Messages", url: "/messages", icon: MessageSquare },
      { title: "Advanced Signature", url: "/advanced-signature", icon: AdvancedSignatureIcon },
      { title: "Emergency Management", url: "/emergency", icon: AlertTriangle },
    ];

    const adminItems = [
      { title: "Workflow Management", url: "/workflow", icon: GitBranch },
      { title: "Approval Center", url: "/approvals", icon: CheckSquare },
      { title: "Bi-Directional Routing", url: "/approval-routing", icon: ArrowRightLeft },
      { title: "Analytics Dashboard", url: "/analytics", icon: BarChart3 },
    ];

    const roleSpecificItems = {
      principal: [...commonItems, ...adminItems],
      registrar: [...commonItems, ...adminItems],
      "program-head": [...commonItems, ...adminItems],
      hod: [...commonItems, ...adminItems],
      employee: [...commonItems, 
        { title: "Workflow Management", url: "/workflow", icon: GitBranch },
        { title: "Bi-Directional Routing", url: "/approval-routing", icon: ArrowRightLeft },
        { title: "Analytics Dashboard", url: "/analytics", icon: BarChart3 }
      ],
    };

    return roleSpecificItems[userRole as keyof typeof roleSpecificItems] || commonItems;
  };

  const menuItems = getMenuItems();
  const isExpanded = menuItems.some(item => isActive(item.url));

  return (
    <Sidebar collapsible="icon">
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-elegant">
            <RoleIcon className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex-1">
              <h2 className="font-semibold text-sm">IAOMS</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={cn("text-xs font-medium border", roleInfo.color)}>
                  {roleInfo.title}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink to={item.url}>
                    {({ isActive }) => (
                      <SidebarMenuButton
                        isActive={isActive}
                        tooltip={collapsed ? item.title : undefined}
                        className="w-full justify-start"
                      >
                        <item.icon className="w-4 h-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="p-4 border-t mt-auto">
        <SidebarTrigger className="w-full" />
      </div>
    </Sidebar>
  );
}