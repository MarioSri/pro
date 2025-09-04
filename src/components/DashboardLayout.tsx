import { ReactNode } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { NotificationCenter } from "./NotificationCenter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, LogOut, Search, Settings, Crown, Shield, Users, Briefcase } from "lucide-react";
import { Lightbulb } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: string;
  onLogout: () => void;
}

export function DashboardLayout({ children, userRole, onLogout }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar userRole={userRole} />
        
        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between px-4">
              {/* Left Section - IAOMS Title and Date */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div>
                    <h1 className="text-lg font-semibold text-foreground">IAOMS</h1>
                    <p className="text-xs text-muted-foreground">{currentDate}</p>
                  </div>
                </div>
              </div>

              {/* Right Section - Navigation & Profile */}
              <div className="flex items-center gap-3">
                {/* Main Navigation Buttons */}
                <div className="hidden md:flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/search")}
                    title="Universal Search"
                    className="text-sm"
                  >
                    <Search className="w-4 h-4 mr-1" />
                    Search
                  </Button>
                </div>

                {/* Notifications */}
                <NotificationCenter userRole={userRole} />

                {/* Profile Settings Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 hover:bg-muted">
                      <Avatar className="w-7 h-7">
                        <AvatarFallback className="text-xs bg-primary text-primary-foreground font-medium">
                          {roleInfo.title.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden sm:block text-left">
                        <div className="text-sm font-medium capitalize">{roleInfo.title}</div>
                        <div className="text-xs text-muted-foreground">{roleInfo.description}</div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <div className="px-3 py-2 border-b">
                      <div className="flex items-center gap-2">
                        <RoleIcon className="w-4 h-4 text-primary" />
                        <div>
                          <div className="font-medium text-sm">{roleInfo.title}</div>
                          <div className="text-xs text-muted-foreground">{roleInfo.description}</div>
                        </div>
                      </div>
                    </div>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="w-4 h-4 mr-2" />
                      Profile Settings
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem onClick={() => navigate('/tutorials')}>
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Tutorials
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 space-y-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}