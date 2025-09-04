import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { NotificationCenter } from '@/components/NotificationCenter';
import { 
  Menu, 
  Bell, 
  User, 
  LogOut, 
  Settings,
  Search,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const MobileHeader: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const menuItems = [
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: AlertTriangle, label: 'Emergency', path: '/emergency' },
  ];

  return (
    <header className="md:hidden sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-area-pt">
      <div className="flex h-16 items-center justify-between px-4 min-h-[64px]">
        {/* Left side - Menu */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-12 w-12 min-w-[48px] min-h-[48px] touch-manipulation">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 max-w-[85vw] safe-area-pt">
            <SheetHeader>
              <SheetTitle className="text-left">
                <div className="flex items-center gap-3 py-2">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                  </div>
                </div>
              </SheetTitle>
            </SheetHeader>
            
            <div className="mt-8 space-y-3 pb-6">
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  onClick={() => {
                    navigate(item.path);
                    setMenuOpen(false);
                  }}
                  className="w-full justify-start h-14 text-base min-h-[56px] touch-manipulation"
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Button>
              ))}
              
              <div className="pt-6 mt-6 border-t">
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start h-14 text-base text-destructive hover:text-destructive min-h-[56px] touch-manipulation"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Sign Out
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Center - Logo/Title */}
        <div className="flex-1 text-center px-4">
          <h1 className="text-lg font-bold">IAOMS</h1>
          <p className="text-xs text-muted-foreground">HITAM</p>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/search')}
            className="h-12 w-12 min-w-[48px] min-h-[48px] touch-manipulation"
          >
            <Search className="w-5 h-5" />
          </Button>

          <div className="relative">
            <NotificationCenter userRole={user.role} />
          </div>
        </div>
      </div>
    </header>
  );
};