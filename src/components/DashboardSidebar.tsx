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
  Mic,
  PenTool,
  StickyNote,
  Bell,
  AlertTriangle,
  Target
} from "lucide-react";

interface DashboardSidebarProps {
  userRole: string;
}

export function DashboardSidebar({ userRole }: DashboardSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;

  // Role-based menu items
  const getMenuItems = () => {
    const commonItems = [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Documents", url: "/documents", icon: FileText },
      { title: "Calendar", url: "/calendar", icon: Calendar },
      { title: "Messages", url: "/messages", icon: MessageSquare },
      { title: "Advanced Signature", url: "/advanced-signature", icon: PenTool },
      { title: "Emergency", url: "/emergency", icon: AlertTriangle },
      { title: "Next Steps", url: "/next-steps", icon: Target },
    ];

    const roleSpecificItems = {
      principal: [
        ...commonItems,
        { title: "Workflow Management", url: "/workflow", icon: GitBranch },
        { title: "Approvals", url: "/approvals", icon: CheckSquare },
        { title: "Analytics", url: "/analytics", icon: BarChart3 },
      ],
      registrar: [
        ...commonItems,
        { title: "Workflow Management", url: "/workflow", icon: GitBranch },
        { title: "Approvals", url: "/approvals", icon: CheckSquare },
        { title: "Analytics", url: "/analytics", icon: BarChart3 },
      ],
      "hod-eee": [
        ...commonItems,
        { title: "Approvals", url: "/approvals", icon: CheckSquare },
        { title: "Analytics", url: "/analytics", icon: BarChart3 },
      ],
      "hod-mech": [
        ...commonItems,
        { title: "Approvals", url: "/approvals", icon: CheckSquare },
        { title: "Analytics", url: "/analytics", icon: BarChart3 },
      ],
      "hod-cse": [
        ...commonItems,
        { title: "Approvals", url: "/approvals", icon: CheckSquare },
        { title: "Analytics", url: "/analytics", icon: BarChart3 },
      ],
      "hod-ece": [
        ...commonItems,
        { title: "Approvals", url: "/approvals", icon: CheckSquare },
        { title: "Analytics", url: "/analytics", icon: BarChart3 },
      ],
      "hod-csm-cso": [
        ...commonItems,
        { title: "Approvals", url: "/approvals", icon: CheckSquare },
        { title: "Analytics", url: "/analytics", icon: BarChart3 },
      ],
      "hod-csd-csc": [
        ...commonItems,
        { title: "Approvals", url: "/approvals", icon: CheckSquare },
        { title: "Analytics", url: "/analytics", icon: BarChart3 },
      ],
      employee: [
        ...commonItems,
        { title: "Analytics", url: "/analytics", icon: BarChart3 },
      ],
    };

    return roleSpecificItems[userRole as keyof typeof roleSpecificItems] || commonItems;
  };

  const menuItems = getMenuItems();
  const isExpanded = menuItems.some(item => isActive(item.url));

  const getRoleIcon = () => {
    switch (userRole) {
      case "principal": return Crown;
      case "registrar": return Shield;
      case "hod-eee":
      case "hod-mech":
      case "hod-cse":
      case "hod-ece":
      case "hod-csm-cso":
      case "hod-csd-csc":
        return Users;
      default: return UserCheck;
    }
  };

  const RoleIcon = getRoleIcon();

  return (
    <Sidebar collapsible="icon">
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-elegant">
            <RoleIcon className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-semibold text-sm">IAOMS</h2>
              <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
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