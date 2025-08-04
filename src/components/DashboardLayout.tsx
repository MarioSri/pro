import { ReactNode } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { NotificationCenter } from "./NotificationCenter";
import { MobileNavigation } from "./MobileNavigation";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: string;
  onLogout: () => void;
}

export function DashboardLayout({ children, userRole, onLogout }: DashboardLayoutProps) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <MobileNavigation userRole={userRole} />
        <DashboardSidebar userRole={userRole} />
        
        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:pl-0 pl-16">
            <div className="flex h-14 items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hidden md:flex" />
                <div>
                  <h1 className="text-base md:text-lg font-semibold">IAOMS Dashboard</h1>
                  <p className="text-xs text-muted-foreground hidden md:block">{currentDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Notifications */}
                <NotificationCenter userRole={userRole} />

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 h-10 md:h-auto">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                          {userRole.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline capitalize">{userRole}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem>
                      <User className="w-4 h-4 mr-2" />
                      <Link to="/profile">Profile Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}