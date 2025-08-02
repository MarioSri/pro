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
  FileText,
  Upload,
  CheckCircle,
  Clock,
  Users,
  Settings,
  BarChart3,
  Calendar,
  MessageSquare,
  AlertTriangle,
  Building2,
  Shield,
  User
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
      { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
      { title: "Documents", url: "/documents", icon: FileText },
      { title: "Calendar", url: "/calendar", icon: Calendar },
      { title: "Messages", url: "/messages", icon: MessageSquare },
    ];

    const roleSpecificItems = {
      principal: [
        ...commonItems,
        { title: "All Approvals", url: "/approvals", icon: CheckCircle },
        { title: "User Management", url: "/users", icon: Users },
        { title: "System Settings", url: "/settings", icon: Settings },
        { title: "Emergency Center", url: "/emergency", icon: AlertTriangle },
      ],
      registrar: [
        ...commonItems,
        { title: "Workflow Management", url: "/workflows", icon: Settings },
        { title: "Approvals", url: "/approvals", icon: CheckCircle },
        { title: "Analytics", url: "/analytics", icon: BarChart3 },
      ],
      hod: [
        ...commonItems,
        { title: "Submit Document", url: "/submit", icon: Upload },
        { title: "Department Reports", url: "/reports", icon: FileText },
        { title: "Team Calendar", url: "/team-calendar", icon: Calendar },
        { title: "Pending Reviews", url: "/pending", icon: Clock },
      ],
      employee: [
        ...commonItems,
        { title: "Submit Document", url: "/submit", icon: Upload },
        { title: "My Submissions", url: "/submissions", icon: FileText },
        { title: "Status Tracking", url: "/tracking", icon: Clock },
      ],
    };

    return roleSpecificItems[userRole as keyof typeof roleSpecificItems] || commonItems;
  };

  const menuItems = getMenuItems();
  const isExpanded = menuItems.some(item => isActive(item.url));

  const getRoleIcon = () => {
    switch (userRole) {
      case "principal": return Building2;
      case "registrar": return Shield;
      case "hod": return Users;
      default: return User;
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