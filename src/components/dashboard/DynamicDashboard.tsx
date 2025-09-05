import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';
import { getDashboardConfig } from '@/config/roleConfigs';
import { DashboardWidget } from '@/types/dashboard';
import { cn } from '@/lib/utils';

// Widget Components
import { StatsWidget } from './widgets/StatsWidget';
import { QuickActionsWidget } from './widgets/QuickActionsWidget';
import { DocumentsWidget } from './widgets/DocumentsWidget';
import { CalendarWidget } from './widgets/CalendarWidget';
import { NotificationsWidget } from './widgets/NotificationsWidget';
import { AnalyticsWidget } from './widgets/AnalyticsWidget';
import { StickyNotesWidget } from './widgets/StickyNotesWidget';
import { ChatWidget } from './widgets/ChatWidget';
import { WorkflowWidget } from './widgets/WorkflowWidget';
import { AIWidget } from './widgets/AIWidget';

import {
  Settings,
  Layout,
  Eye,
  EyeOff,
  RotateCcw,
  Save,
  Grid3X3,
  Maximize2
} from 'lucide-react';

interface DynamicDashboardProps {
  className?: string;
}

export const DynamicDashboard: React.FC<DynamicDashboardProps> = ({ className }) => {
  const { user } = useAuth();
  const { isMobile, isTablet } = useResponsive();
  const [dashboardConfig, setDashboardConfig] = useState<any>(null);
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const config = getDashboardConfig(user.role, user.department, user.branch);
      setDashboardConfig(config);
      
      // Load saved widget configuration or use defaults
      const savedWidgets = localStorage.getItem(`dashboard-widgets-${user.role}`);
      if (savedWidgets) {
        setWidgets(JSON.parse(savedWidgets));
      } else {
        setWidgets(getDefaultWidgets(config));
      }
    }
  }, [user]);

  const getDefaultWidgets = (config: any): DashboardWidget[] => {
    const defaultWidgets: DashboardWidget[] = [
      {
        id: 'stats',
        type: 'stats',
        title: 'Dashboard Statistics',
        position: { x: 0, y: 0, w: 12, h: 2 },
        visible: true,
        permissions: []
      },
      {
        id: 'quickActions',
        type: 'quickActions',
        title: 'Quick Actions',
        position: { x: 0, y: 2, w: 6, h: 2 },
        visible: true,
        permissions: []
      },
      {
        id: 'documents',
        type: 'documents',
        title: 'Recent Documents',
        position: { x: 6, y: 2, w: 6, h: 2 },
        visible: true,
        permissions: []
      },
      {
        id: 'notifications',
        type: 'notifications',
        title: 'Notifications',
        position: { x: 0, y: 4, w: 6, h: 2 },
        visible: true,
        permissions: []
      },
      {
        id: 'analytics',
        type: 'analytics',
        title: 'Analytics Overview',
        position: { x: 6, y: 4, w: 6, h: 2 },
        visible: config.permissions.canViewAnalytics,
        permissions: ['canViewAnalytics']
      },
      {
        id: 'workflow',
        type: 'workflow',
        title: 'Workflow Management',
        position: { x: 0, y: 6, w: 12, h: 2 },
        visible: config.permissions.canManageWorkflows,
        permissions: ['canManageWorkflows']
      },
      {
        id: 'ai',
        type: 'ai',
        title: 'AI Assistant',
        position: { x: 0, y: 8, w: 12, h: 2 },
        visible: config.permissions.canAccessAI,
        permissions: ['canAccessAI']
      }
    ];

    return defaultWidgets.filter(widget => {
      if (widget.permissions.length === 0) return widget.visible;
      return widget.permissions.every(permission => 
        config.permissions[permission as keyof typeof config.permissions]
      );
    });
  };

  const renderWidget = (widget: DashboardWidget) => {
    if (!widget.visible && !isCustomizing) return null;

    const widgetProps = {
      userRole: user?.role || '',
      permissions: dashboardConfig?.permissions,
      isCustomizing,
      onSelect: () => setSelectedWidget(widget.id),
      isSelected: selectedWidget === widget.id
    };

    const WidgetComponent = () => {
      switch (widget.type) {
        case 'stats':
          return <StatsWidget {...widgetProps} />;
        case 'quickActions':
          return <QuickActionsWidget {...widgetProps} />;
        case 'documents':
          return <DocumentsWidget {...widgetProps} />;
        case 'notifications':
          return <NotificationsWidget {...widgetProps} />;
        case 'analytics':
          return <AnalyticsWidget {...widgetProps} />;
        case 'workflow':
          return <WorkflowWidget {...widgetProps} />;
        case 'ai':
          return <AIWidget {...widgetProps} />;
        default:
          return <div>Unknown widget type: {widget.type}</div>;
      }
    };

    // Improved grid positioning with consistent spacing
    const gridColumn = isMobile ? 'span 1' : `span ${Math.min(widget.position.w, 12)}`;
    const gridRow = `span ${Math.min(widget.position.h, 3)}`;

    return (
      <div
        key={widget.id}
        className={cn(
          "relative transition-all duration-200",
          isCustomizing && "border-2 border-dashed border-primary/50 rounded-lg p-1",
          selectedWidget === widget.id && "border-primary shadow-glow",
          !widget.visible && isCustomizing && "opacity-50",
          "min-h-[200px]" // Standardized minimum height
        )}
        style={{
          gridColumn,
          gridRow
        }}
        onClick={() => isCustomizing && setSelectedWidget(widget.id)}
      >
        {/* Resize Handle */}
        {isCustomizing && widget.visible && (
          <div className="absolute bottom-2 right-2 flex gap-1 z-20">
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6 bg-white shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                resizeWidget(widget.id, 'small');
              }}
              title="Small size"
            >
              <div className="w-2 h-2 bg-current rounded" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6 bg-white shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                resizeWidget(widget.id, 'medium');
              }}
              title="Medium size"
            >
              <div className="w-3 h-3 bg-current rounded" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6 bg-white shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                resizeWidget(widget.id, 'large');
              }}
              title="Large size"
            >
              <div className="w-4 h-4 bg-current rounded" />
            </Button>
          </div>
        )}
        
        <WidgetComponent />
        
        {isCustomizing && (
          <div className="absolute top-2 right-2 flex gap-1 z-10">
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6 bg-white shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                toggleWidgetVisibility(widget.id);
              }}
            >
              {widget.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </Button>
          </div>
        )}
      </div>
    );
  };

  const resizeWidget = (widgetId: string, size: 'small' | 'medium' | 'large') => {
    const sizeMap = {
      small: { w: 4, h: 1 },
      medium: { w: 6, h: 2 },
      large: { w: 12, h: 2 }
    };
    
    setWidgets(prev => prev.map(widget =>
      widget.id === widgetId 
        ? { ...widget, position: { ...widget.position, ...sizeMap[size] } }
        : widget
    ));
  };

  const toggleWidgetVisibility = (widgetId: string) => {
    setWidgets(prev => prev.map(widget =>
      widget.id === widgetId ? { ...widget, visible: !widget.visible } : widget
    ));
  };

  const saveLayout = () => {
    if (user) {
      localStorage.setItem(`dashboard-widgets-${user.role}`, JSON.stringify(widgets));
      setIsCustomizing(false);
      setSelectedWidget(null);
    }
  };

  const resetLayout = () => {
    if (dashboardConfig) {
      setWidgets(getDefaultWidgets(dashboardConfig));
    }
  };

  if (!user || !dashboardConfig) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-8 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Redesigned Dashboard Controls - Compact Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Dashboard Widgets</h2>
          <Badge variant="outline" className="text-xs">
            {widgets.filter(w => w.visible).length} Active
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isCustomizing ? "default" : "outline"}
            size="sm"
            onClick={() => setIsCustomizing(!isCustomizing)}
            className="h-9"
          >
            <Layout className="w-4 h-4 mr-2" />
            {isCustomizing ? "Exit Customize" : "Customize"}
          </Button>
          
          {isCustomizing && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={resetLayout}
                className="h-9"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button
                size="sm"
                onClick={saveLayout}
                className="h-9"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Customization Instructions - Compact */}
      {isCustomizing && (
        <Card className="border-primary bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Settings className="w-4 h-4" />
              <span className="font-medium text-sm">Customization Mode Active</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Click widgets to select them. Use the eye icon to show/hide widgets. Changes save automatically when you exit.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Improved Dashboard Grid - Consistent Spacing */}
      <div 
        className={cn(
          "grid gap-4 auto-rows-min",
          isMobile ? "grid-cols-1" : 
          isTablet ? "grid-cols-2" : 
          "grid-cols-12"
        )}
        style={{
          gridTemplateRows: 'repeat(auto-fit, minmax(180px, auto))',
          gridAutoRows: 'minmax(180px, auto)'
        }}
      >
        {widgets
          .filter(widget => widget.visible || isCustomizing)
          .sort((a, b) => a.position.y - b.position.y || a.position.x - b.position.x)
          .map(widget => renderWidget(widget))}
      </div>

      {/* Widget Customization Panel - Improved */}
      {isCustomizing && selectedWidget && (
        <Card className="border-primary bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Grid3X3 className="w-5 h-5" />
              Widget Settings: {widgets.find(w => w.id === selectedWidget)?.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Size</label>
                <select
                  className="w-full h-9 px-3 py-1 border border-input bg-background rounded-md text-sm"
                  value={
                    widgets.find(w => w.id === selectedWidget)?.position.w === 4 ? 'small' :
                    widgets.find(w => w.id === selectedWidget)?.position.w === 6 ? 'medium' : 'large'
                  }
                  onChange={(e) => {
                    if (selectedWidget) {
                      resizeWidget(selectedWidget, e.target.value as 'small' | 'medium' | 'large');
                    }
                  }}
                >
                  <option value="small">Small (4 columns)</option>
                  <option value="medium">Medium (6 columns)</option>
                  <option value="large">Large (12 columns)</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Compact Mode</label>
                <select
                  className="w-full h-9 px-3 py-1 border border-input bg-background rounded-md text-sm"
                  value={widgets.find(w => w.id === selectedWidget)?.position.h || 1}
                  onChange={(e) => {
                    const newHeight = parseInt(e.target.value);
                    setWidgets(prev => prev.map(widget =>
                      widget.id === selectedWidget 
                        ? { ...widget, position: { ...widget.position, h: newHeight } }
                        : widget
                    ));
                  }}
                >
                  <option value={1}>Compact</option>
                  <option value={2}>Standard</option>
                  <option value={3}>Expanded</option>
                </select>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleWidgetVisibility(selectedWidget)}
                className="mt-6 h-9"
              >
                {widgets.find(w => w.id === selectedWidget)?.visible ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Show
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedWidget(null)}
                className="mt-6 h-9"
              >
                Done
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};