import React from 'react';
import { DynamicDashboard } from './DynamicDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  TrendingUp
} from 'lucide-react';

export const RoleDashboard: React.FC = () => {
  const { user } = useAuth();
  const { isMobile } = useResponsive();

  if (!user) return null;

  const dashboardConfig = getDashboardConfig(user.role, user.department, user.branch, user.year);
  
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
        return 'Complete institutional oversight with full administrative control, mass distribution capabilities, and system-wide analytics.';
      case 'registrar':
        return 'Academic administration with document approval authority, workflow management, and cross-departmental coordination.';
      case 'program-head':
        return `Program-specific management for ${user.branch} ${user.year} with focused approval workflows and academic scheduling.`;
      case 'hod':
        return `Department leadership for ${user.department} with faculty management, document approvals, and departmental analytics.`;
      default:
        return 'Document submission and tracking with personal task management and communication tools.';
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
      {/* Role Header */}
      <Card className="shadow-elegant bg-gradient-primary text-primary-foreground">
        <CardContent className={cn("p-6", isMobile && "p-4")}>
          <div className="flex items-center gap-4">
            <div className={cn(
              "rounded-full bg-white/20 flex items-center justify-center",
              isMobile ? "w-12 h-12" : "w-16 h-16"
            )}>
              <RoleIcon className={cn(
                "text-white",
                isMobile ? "w-6 h-6" : "w-8 h-8"
              )} />
            </div>
            
            <div className="flex-1">
              <h1 className={cn(
                "font-bold",
                isMobile ? "text-xl" : "text-2xl"
              )}>
                {dashboardConfig.displayName} Dashboard
              </h1>
              <p className={cn(
                "opacity-90 mt-1",
                isMobile ? "text-sm" : "text-base"
              )}>
                {user.name}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.department && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {user.department}
                  </Badge>
                )}
                {user.branch && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {user.branch}
                  </Badge>
                )}
                {user.year && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    {user.year}
                  </Badge>
                )}
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className={cn(
                  "font-bold",
                  isMobile ? "text-lg" : "text-xl"
                )}>
                  {enabledFeatures.length}
                </span>
              </div>
              <p className={cn(
                "opacity-90",
                isMobile ? "text-xs" : "text-sm"
              )}>
                Features Available
              </p>
            </div>
          </div>
          
          <p className={cn(
            "mt-4 opacity-90",
            isMobile ? "text-sm" : "text-base"
          )}>
            {getRoleDescription()}
          </p>
        </CardContent>
      </Card>

      {/* Feature Overview */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className={cn(
            "flex items-center gap-2",
            isMobile ? "text-lg" : "text-xl"
          )}>
            <Zap className="w-5 h-5 text-primary" />
            Available Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={cn(
            "grid gap-2",
            isMobile ? "grid-cols-2" : "grid-cols-3 lg:grid-cols-4"
          )}>
            {enabledFeatures.map((feature, index) => (
              <Badge 
                key={feature} 
                variant="outline" 
                className={cn(
                  "justify-center py-2 animate-scale-in",
                  isMobile ? "text-xs" : "text-sm"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {feature}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Dashboard */}
      <DynamicDashboard />

      {/* Role-Specific Help */}
      <Card className="shadow-elegant border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className={cn(
            "flex items-center gap-2",
            isMobile ? "text-lg" : "text-xl"
          )}>
            <Settings className="w-5 h-5 text-primary" />
            Dashboard Help
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div>
                <p className={cn(
                  "font-medium",
                  isMobile ? "text-sm" : "text-base"
                )}>
                  Customize Your Dashboard
                </p>
                <p className={cn(
                  "text-muted-foreground",
                  isMobile ? "text-xs" : "text-sm"
                )}>
                  Click "Customize" to rearrange widgets, change sizes, and personalize your workspace.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div>
                <p className={cn(
                  "font-medium",
                  isMobile ? "text-sm" : "text-base"
                )}>
                  Role-Based Access
                </p>
                <p className={cn(
                  "text-muted-foreground",
                  isMobile ? "text-xs" : "text-sm"
                )}>
                  Your dashboard shows only the features and data relevant to your role and permissions.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <div>
                <p className={cn(
                  "font-medium",
                  isMobile ? "text-sm" : "text-base"
                )}>
                  Real-Time Updates
                </p>
                <p className={cn(
                  "text-muted-foreground",
                  isMobile ? "text-xs" : "text-sm"
                )}>
                  All widgets update automatically with live data from the system.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};