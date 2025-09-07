import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';
import { DocumentStats } from '@/types/dashboard';
import { cn } from '@/lib/utils';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  TrendingUp,
  AlertTriangle,
  Building,
  Calendar,
  Zap
} from 'lucide-react';

interface StatsWidgetProps {
  userRole: string;
  permissions: any;
  isCustomizing?: boolean;
  onSelect?: () => void;
  isSelected?: boolean;
}

export const StatsWidget: React.FC<StatsWidgetProps> = ({
  userRole,
  permissions,
  isCustomizing,
  onSelect,
  isSelected
}) => {
  const { user } = useAuth();
  const { isMobile } = useResponsive();
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch stats
    const fetchStats = async () => {
      setLoading(true);
      
      // Mock data based on role
      const mockStats: DocumentStats = {
        total: userRole === 'principal' ? 247 : userRole === 'registrar' ? 189 : userRole === 'hod' ? 67 : 23,
        pending: userRole === 'principal' ? 18 : userRole === 'registrar' ? 12 : userRole === 'hod' ? 8 : 3,
        approved: userRole === 'principal' ? 198 : userRole === 'registrar' ? 156 : userRole === 'hod' ? 52 : 18,
        rejected: userRole === 'principal' ? 31 : userRole === 'registrar' ? 21 : userRole === 'hod' ? 7 : 2,
        inReview: userRole === 'principal' ? 15 : userRole === 'registrar' ? 8 : userRole === 'hod' ? 4 : 1,
        emergency: userRole === 'principal' ? 3 : userRole === 'registrar' ? 2 : userRole === 'hod' ? 1 : 0,
        byDepartment: {
          'CSE': 45,
          'EEE': 38,
          'ECE': 42,
          'MECH': 35,
          'CSM': 28,
          'CSO': 25,
          'CSD': 22,
          'CSC': 18
        },
        byType: {
          'Letter': 89,
          'Circular': 76,
          'Report': 82
        },
        byPriority: {
          'Low': 45,
          'Medium': 128,
          'High': 58,
          'Emergency': 16
        },
        trends: [
          { date: '2024-01-01', count: 23, approved: 18, rejected: 5 },
          { date: '2024-01-02', count: 31, approved: 25, rejected: 6 },
          { date: '2024-01-03', count: 28, approved: 22, rejected: 6 },
          { date: '2024-01-04', count: 35, approved: 29, rejected: 6 },
          { date: '2024-01-05', count: 42, approved: 36, rejected: 6 }
        ]
      };

      setTimeout(() => {
        setStats(mockStats);
        setLoading(false);
      }, 800);
    };

    fetchStats();
  }, [userRole]);

  const getStatsCards = () => {
    if (!stats) return [];

    const baseStats = [
      {
        title: "Total Documents",
        value: stats.total.toString(),
        change: "+12%",
        icon: FileText,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        trend: "up"
      },
      {
        title: "Pending Reviews",
        value: stats.pending.toString(),
        change: "-3",
        icon: Clock,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        trend: "down"
      },
      {
        title: "Approved",
        value: stats.approved.toString(),
        change: "+8",
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
        trend: "up"
      },
      {
        title: "Rejected",
        value: stats.rejected.toString(),
        change: "+1",
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        trend: "up"
      }
    ];

    // Add role-specific stats
    if (userRole === 'principal') {
      baseStats.push({
        title: "Emergency",
        value: stats.emergency.toString(),
        change: "0",
        icon: AlertTriangle,
        color: "text-red-700",
        bgColor: "bg-red-100",
        trend: "stable"
      });
    }

    if (permissions?.canViewAllDepartments) {
      baseStats.push({
        title: "Departments",
        value: Object.keys(stats.byDepartment).length.toString(),
        change: "+0",
        icon: Building,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        trend: "stable"
      });
    }

    return baseStats;
  };

  const statsCards = getStatsCards();

  if (loading) {
    return (
      <Card className={cn(
        "shadow-elegant h-full",
        isSelected && "border-primary",
        isCustomizing && "cursor-pointer"
      )} onClick={onSelect}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-primary" />
            Dashboard Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "shadow-elegant hover:shadow-glow transition-all duration-300 h-full",
      "dashboard-widget-container",
      isSelected && "border-primary",
      isCustomizing && "cursor-pointer"
    )} onClick={onSelect}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="w-5 h-5 text-primary" />
          Dashboard Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="dashboard-widget-content">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="relative p-3 rounded-lg border hover:shadow-md transition-all duration-200 animate-scale-in bg-white min-h-[80px] flex flex-col justify-between"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon and Change Indicator */}
              <div className="flex items-center justify-between mb-2">
                <div className={cn("p-1.5 rounded-lg", stat.bgColor)}>
                  <stat.icon className={cn("w-4 h-4", stat.color)} />
                </div>
                <div className={cn(
                  "text-xs font-medium px-1.5 py-0.5 rounded-full",
                  stat.trend === 'up' ? 'text-green-700 bg-green-100' : 
                  stat.trend === 'down' ? 'text-red-700 bg-red-100' : 'text-gray-700 bg-gray-100'
                )}>
                  {stat.change}
                </div>
              </div>
              
              {/* Value and Title */}
              <div className="space-y-1">
                <p className="text-xl font-bold text-gray-900">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-600 font-medium leading-tight">
                  {stat.title}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Department Overview for Admin Roles */}
        {stats && (userRole === 'principal' || userRole === 'registrar') && (
          <div className="mt-4 pt-3 border-t">
            <h4 className="font-semibold mb-3 text-sm text-gray-700">
              Department Overview
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(stats.byDepartment).slice(0, 4).map(([dept, count]) => (
                <div key={dept} className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">{count}</p>
                  <p className="text-xs text-gray-600 font-medium">{dept}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};