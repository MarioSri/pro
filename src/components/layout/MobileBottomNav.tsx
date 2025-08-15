import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Search,
  Bell,
  User,
  CheckSquare,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';

export const MobileBottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  if (!user) return null;

  const getNavItems = () => {
    const baseItems = [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
      { path: '/search', icon: Search, label: 'Search' },
      { path: '/documents', icon: FileText, label: 'Docs' },
    ];

    if (user.permissions.canApprove) {
      baseItems.push({ path: '/approvals', icon: CheckSquare, label: 'Approve' });
    } else {
      baseItems.push({ path: '/calendar', icon: Calendar, label: 'Calendar' });
    }

    return baseItems;
  };

  const navItems = getNavItems();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50 safe-area-pb">
      <div className="grid grid-cols-4 gap-1 p-2">
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant={isActive(item.path) ? "default" : "ghost"}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col h-16 px-2 py-1 relative",
              "min-w-[44px] min-h-[44px]", // Touch target requirements
              isActive(item.path) && "bg-primary/10 text-primary"
            )}
          >
            <div className="relative">
              <item.icon className="w-5 h-5 mb-1" />
              {item.path === '/approvals' && unreadCount > 0 && (
                <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs bg-destructive">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </div>
            <span className="text-xs font-medium">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};