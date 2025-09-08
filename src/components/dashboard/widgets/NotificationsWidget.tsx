import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';
import {
  Bell,
  CheckCircle2,
  Clock,
  FileText,
  Calendar,
  AlertTriangle,
  X,
  Eye,
  ArrowRight,
  Users,
  Zap
} from 'lucide-react';

interface NotificationsWidgetProps {
  userRole: string;
  permissions: any;
  isCustomizing?: boolean;
  onSelect?: () => void;
  isSelected?: boolean;
}

export const NotificationsWidget: React.FC<NotificationsWidgetProps> = ({
  userRole,
  permissions,
  isCustomizing,
  onSelect,
  isSelected
}) => {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, removeNotification } = useNotifications();
  const { isMobile } = useResponsive();
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'approval': return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'submission': return <FileText className="w-4 h-4 text-primary" />;
      case 'reminder': return <Clock className="w-4 h-4 text-warning" />;
      case 'emergency': return <AlertTriangle className="w-4 h-4 text-destructive animate-pulse" />;
      case 'meeting': return <Calendar className="w-4 h-4 text-blue-500" />;
      default: return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'urgent':
        return notifications.filter(n => n.urgent || n.type === 'emergency');
      default:
        return notifications;
    }
  };

  const filteredNotifications = getFilteredNotifications();
  const urgentCount = notifications.filter(n => n.urgent || n.type === 'emergency').length;

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <Card className={cn(
      "shadow-elegant hover:shadow-glow transition-all duration-300",
      "dashboard-widget-container",
      isSelected && "border-primary",
      isCustomizing && "cursor-pointer"
    )} onClick={onSelect}>
      <CardHeader className={cn(isMobile && "pb-3")}>
        <div className="flex items-center justify-between">
          <CardTitle className={cn(
            "flex items-center gap-2",
            isMobile ? "text-lg" : "text-xl"
          )}>
            <Bell className="w-5 h-5 text-primary" />
            Notifications
            <div className="flex gap-1">
              {unreadCount > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  {unreadCount}
                </Badge>
              )}
              {urgentCount > 0 && (
                <Badge variant="warning" className="text-xs">
                  {urgentCount} urgent
                </Badge>
              )}
            </div>
          </CardTitle>
          
          <div className="flex gap-1">
            {(['all', 'unread', 'urgent'] as const).map(filterType => (
              <Button
                key={filterType}
                variant={filter === filterType ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter(filterType)}
                className="h-6 px-2 text-xs"
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="dashboard-widget-content">
        <ScrollArea className={cn(isMobile ? "h-32" : "h-40")}>
          <div className="space-y-2">
            {filteredNotifications.slice(0, isMobile ? 5 : 8).map((notification, index) => (
              <div
                key={notification.id}
                className={cn(
                  "p-2 border rounded-lg hover:bg-accent transition-all cursor-pointer animate-fade-in",
                  !notification.read && "bg-primary/5 border-l-4 border-l-primary",
                  notification.urgent && "border-warning bg-warning/5",
                  notification.type === 'emergency' && "border-destructive bg-destructive/5"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h5 className={cn(
                        "font-medium line-clamp-1",
                        !notification.read ? 'text-foreground' : 'text-muted-foreground',
                        "text-xs"
                      )}>
                        {notification.title}
                        {notification.urgent && (
                          <Badge variant="destructive" className="ml-1 text-xs px-1 py-0">
                            Urgent
                          </Badge>
                        )}
                      </h5>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                      >
                        <X className="w-2.5 h-2.5" />
                      </Button>
                    </div>
                    
                    <p className={cn(
                      "text-muted-foreground mt-0.5 line-clamp-1",
                      "text-xs"
                    )}>
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">
                        {getTimeAgo(notification.timestamp)}
                      </span>
                      {notification.actionUrl && (
                        <Button variant="ghost" size="sm" className="h-4 text-xs">
                          <ArrowRight className="w-2.5 h-2.5 mr-1" />
                          View
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredNotifications.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                <Bell className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {filter === 'all' ? 'No notifications' : `No ${filter} notifications`}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-1 pt-2 border-t">
          <div className="text-center p-1.5 bg-muted/30 rounded">
            <p className={cn(
              "font-bold text-primary",
              "text-lg"
            )}>
              {notifications.length}
            </p>
            <p className={cn(
              "text-muted-foreground",
              "text-xs"
            )}>
              Total
            </p>
          </div>
          <div className="text-center p-1.5 bg-muted/30 rounded">
            <p className={cn(
              "font-bold text-warning",
              "text-lg"
            )}>
              {unreadCount}
            </p>
            <p className={cn(
              "text-muted-foreground",
              "text-xs"
            )}>
              Unread
            </p>
          </div>
          <div className="text-center p-1.5 bg-muted/30 rounded">
            <p className={cn(
              "font-bold text-destructive",
              "text-lg"
            )}>
              {urgentCount}
            </p>
            <p className={cn(
              "text-muted-foreground",
              "text-xs"
            )}>
              Urgent
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};