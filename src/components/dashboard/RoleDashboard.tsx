import React from 'react';
import { DynamicDashboard } from './DynamicDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';
import { getDashboardConfig } from '@/config/roleConfigs';
import { cn } from '@/lib/utils';
import {
  Crown,
  Shield,
  Users,
  Building,
  User,
  Settings,
  Zap,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

export const RoleDashboard: React.FC = () => {
  const { user } = useAuth();
  const { isMobile } = useResponsive();

  if (!user) return null;

  const dashboardConfig = getDashboardConfig(user.role, user.department, user.branch);
  
  const getRoleIcon = () => {
    switch (user.role) {
      case 'principal': return Crown;
      case 'registrar': return Shield;
      case 'program-head': return Users;
      case 'hod': return Building;
      default: return User;
    }
  };

  const RoleIcon = getRoleIcon();

  const getRoleDescription = () => {
    switch (user.role) {
      case 'principal':
        return 'Complete institutional oversight with full administrative control and system-wide analytics.';
      case 'registrar':
        return 'Academic administration with document approval authority and cross-departmental coordination.';
      case 'program-head':
        return `Program-specific management for ${user.branch || 'department'} with focused approval workflows.`;
      case 'hod':
        return `Department leadership for ${user.department} with faculty management and document approvals.`;
      default:
        return 'Document submission and tracking with personal task management tools.';
    }
  };

  const getEnabledFeatures = () => {
    return Object.entries(dashboardConfig.features)
      .filter(([_, enabled]) => enabled)
      .map(([feature, _]) => feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));
  };

  const enabledFeatures = getEnabledFeatures();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Redesigned Role Welcome Banner - Compact & Clean */}
      <Card className="shadow-elegant bg-gradient-primary text-primary-foreground border-0 overflow-hidden">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* Role Icon & Info - Aligned Left */}
            <div className="lg:col-span-8 flex items-center gap-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-white/20 flex items-center justify-center shadow-lg">
                <RoleIcon className="w-8 h-8 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold truncate">
                  Welcome to IAOMS Dashboard
                </h1>
                <p className="opacity-90 text-sm">
                  Logged in as <span className="font-semibold">{user.name}</span>
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge className="bg-white/20 text-white border-white/30 text-xs font-medium">
                    {dashboardConfig.displayName}
                  </Badge>
                  {user.department && (
                    <Badge className="bg-white/20 text-white border-white/30 text-xs">
                      {user.department}
                    </Badge>
                  )}
                  {user.branch && (
                    <Badge className="bg-white/20 text-white border-white/30 text-xs">
                      {user.branch}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Stats - Aligned Right */}
            <div className="lg:col-span-4 flex justify-end">
              <div className="text-right">
                <div className="flex items-center justify-end gap-2 mb-1">
                  <Zap className="w-5 h-5" />
                  <span className="text-2xl font-bold">{enabledFeatures.length}</span>
                </div>
                <p className="text-sm opacity-90">Features Available</p>
              </div>
            </div>
          </div>
          
          {/* Role Description - Full Width */}
          <div className="mt-4 p-4 bg-white/10 rounded-lg">
            <p className="text-sm opacity-90 leading-relaxed">
              {getRoleDescription()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Redesigned Feature Overview - Compact Grid */}
      <Card className="shadow-elegant">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            Available Features
            <Badge variant="outline" className="ml-auto">
              {enabledFeatures.length} Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
            {enabledFeatures.map((feature, index) => (
              <Badge 
                key={feature} 
                variant="outline" 
                className="justify-center py-2 px-3 text-xs font-medium transition-all hover:bg-primary hover:text-primary-foreground cursor-default animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {feature}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Dashboard with Improved Layout */}
      <DynamicDashboard />

      {/* Redesigned Help Section - Compact & Informative */}
      <Card className="shadow-elegant border-l-4 border-l-primary">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="w-5 h-5 text-primary" />
            Dashboard Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm mb-1">Customize Layout</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Use customization options to arrange widgets according to your workflow preferences.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm mb-1">Role-Based Access</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Dashboard shows features specific to your role and permissions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm mb-1">Quick Navigation</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Use sidebar navigation or mobile bottom bar for quick access.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};