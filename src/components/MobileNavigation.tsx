import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  MessageSquare,
  CheckSquare,
  BarChart3,
  AlertTriangle,
  User,
  Menu,
  X,
  Search,
  GitBranch,
  Eye,
  Lightbulb
} from "lucide-react";
import { AdvancedSignatureIcon } from "@/components/ui/signature-icon";
import { cn } from "@/lib/utils";

interface MobileNavigationProps {
  userRole: string;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ userRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getMenuItems = () => {
    const commonItems = [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Search", url: "/search", icon: Search },
      { title: "Track Documents", url: "/track-documents", icon: Eye },
      { title: "Calendar", url: "/calendar", icon: Calendar },
      { title: "Messages", url: "/messages", icon: MessageSquare },
      { title: "Document Management", url: "/documents", icon: FileText },
      { title: "Signature", url: "/advanced-signature", icon: AdvancedSignatureIcon },
      { title: "Emergency Management", url: "/emergency", icon: AlertTriangle },
      { title: "Tutorials", url: "/tutorials", icon: Lightbulb },
      { title: "Profile", url: "/profile", icon: User },
    ];

    const roleSpecificItems = {
      principal: [
        ...commonItems,
        { title: "Approval Center", url: "/approvals", icon: CheckSquare },
        { title: "Workflow Management", url: "/workflow", icon: GitBranch },
        { title: "Bi-Directional Routing", url: "/approval-routing", icon: CheckSquare },
        { title: "Analytics Dashboard", url: "/analytics", icon: BarChart3 },
      ],
      registrar: [
        ...commonItems,
        { title: "Approval Center", url: "/approvals", icon: CheckSquare },
        { title: "Workflow Management", url: "/workflow", icon: GitBranch },
        { title: "Bi-Directional Routing", url: "/approval-routing", icon: CheckSquare },
        { title: "Analytics Dashboard", url: "/analytics", icon: BarChart3 },
      ],
      "program-head": [
        ...commonItems,
        { title: "Approval Center", url: "/approvals", icon: CheckSquare },
        { title: "Workflow Management", url: "/workflow", icon: GitBranch },
        { title: "Bi-Directional Routing", url: "/approval-routing", icon: CheckSquare },
        { title: "Analytics Dashboard", url: "/analytics", icon: BarChart3 },
      ],
      hod: [
        ...commonItems,
        { title: "Approval Center", url: "/approvals", icon: CheckSquare },
        { title: "Workflow Management", url: "/workflow", icon: GitBranch },
        { title: "Bi-Directional Routing", url: "/approval-routing", icon: CheckSquare },
        { title: "Analytics Dashboard", url: "/analytics", icon: BarChart3 },
      ],
      employee: [
        ...commonItems,
        { title: "Workflow Management", url: "/workflow", icon: GitBranch },
        { title: "Bi-Directional Routing", url: "/approval-routing", icon: CheckSquare },
        { title: "Analytics Dashboard", url: "/analytics", icon: BarChart3 },
      ],
    };

    return roleSpecificItems[userRole as keyof typeof roleSpecificItems] || commonItems;
  };

  const menuItems = getMenuItems();
  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (url: string) => {
    navigate(url);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-full shadow-lg bg-background"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setIsOpen(false)} />
      )}

      {/* Mobile Navigation Menu */}
      <div className={cn(
        "md:hidden fixed top-0 left-0 h-full w-80 bg-background border-r shadow-xl z-50 transform transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 pt-20">
          <div className="mb-6">
            <h2 className="text-xl font-bold">IAOMS</h2>
            <p className="text-sm text-muted-foreground capitalize">{userRole}</p>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.url}
                variant={isActive(item.url) ? "default" : "ghost"}
                onClick={() => handleNavigation(item.url)}
                className="w-full justify-start h-12 text-base"
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.title}
              </Button>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-30">
        <div className="grid grid-cols-4 gap-1 p-2">
          {menuItems.slice(0, 4).map((item) => (
            <Button
              key={item.url}
              variant={isActive(item.url) ? "default" : "ghost"}
              onClick={() => handleNavigation(item.url)}
              className="flex flex-col h-16 px-2 py-1"
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.title}</span>
            </Button>
          ))}
        </div>
      </div>
    </>
  );
};