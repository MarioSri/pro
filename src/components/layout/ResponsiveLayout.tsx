import React, { ReactNode } from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import { MobileHeader } from './MobileHeader';
import { MobileBottomNav } from './MobileBottomNav';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';

interface ResponsiveLayoutProps {
  children: ReactNode;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children }) => {
  const { isMobile } = useResponsive();
  const { user, logout } = useAuth();

  if (!user) return null;

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <MobileHeader />
        <main className="pb-20 px-4 py-6">
          {children}
        </main>
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <DashboardLayout userRole={user.role} onLogout={logout}>
      {children}
    </DashboardLayout>
  );
};