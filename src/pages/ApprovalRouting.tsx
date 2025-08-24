import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BiDirectionalApprovalManager } from '@/components/BiDirectionalApprovalManager';
import { WorkflowConfiguration } from '@/components/WorkflowConfiguration';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  Settings,
  Clock,
  CheckCircle2,
  ArrowRightLeft,
  Shield,
  Zap,
  BarChart3,
  FileText,
  Users,
  Bell,
  TrendingUp
} from 'lucide-react';

const ApprovalRouting: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('manager');

  // Mock statistics - in a real app, these would come from the workflow engine
  const stats = {
    pendingApprovals: 12,
    completedToday: 8,
    averageTime: '2.3 hours',
    escalationRate: '5%',
    counterApprovals: 3
  };

  const features = [
    {
      icon: ArrowRightLeft,
      title: 'Bi-Directional Routing',
      description: 'Dynamic approval paths that adapt based on document type, department, and business rules',
      color: 'text-blue-500'
    },
    {
      icon: Shield,
      title: 'Counter-Approval System',
      description: 'Additional verification layer where designated users can validate critical decisions',
      color: 'text-green-500'
    },
    {
      icon: Clock,
      title: 'Auto-Escalation',
      description: 'Automatic escalation to higher authorities when approvals exceed configured timeouts',
      color: 'text-orange-500'
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Context-aware notifications with configurable priority levels and delivery methods',
      color: 'text-purple-500'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reporting',
      description: 'Comprehensive insights into approval bottlenecks, completion times, and process efficiency',
      color: 'text-indigo-500'
    },
    {
      icon: Zap,
      title: 'Role-Based Rules',
      description: 'Flexible rule engine that routes documents based on user roles, departments, and custom criteria',
      color: 'text-yellow-500'
    }
  ];

  const isAdmin = user?.role === 'principal' || user?.role === 'registrar';

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Approval Routing System</h1>
          <p className="text-muted-foreground mt-2">
            Bi-directional approval workflows with intelligent routing and escalation
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {stats.pendingApprovals} Pending
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {stats.completedToday} Today
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completedToday}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Time</p>
                <p className="text-2xl font-bold">{stats.averageTime}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Escalation Rate</p>
                <p className="text-2xl font-bold">{stats.escalationRate}</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Counter</p>
                <p className="text-2xl font-bold">{stats.counterApprovals}</p>
              </div>
              <Shield className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5" />
            System Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className={cn("flex-shrink-0 p-2 rounded-lg bg-muted", feature.color)}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manager" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Approval Manager
          </TabsTrigger>
          <TabsTrigger 
            value="configuration" 
            className="flex items-center gap-2"
            disabled={!isAdmin}
          >
            <Settings className="w-4 h-4" />
            Configuration
            {!isAdmin && (
              <Badge variant="secondary" className="ml-2 text-xs">
                Admin Only
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manager" className="space-y-4">
          <BiDirectionalApprovalManager />
        </TabsContent>

        <TabsContent value="configuration" className="space-y-4">
          {isAdmin ? (
            <WorkflowConfiguration />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Administrator Access Required</h3>
                <p className="text-muted-foreground text-center">
                  You need administrator privileges to configure workflows and approval routing.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                1. Review Pending Approvals
              </h4>
              <p className="text-sm text-muted-foreground">
                Check the "Approval Manager" tab to see documents waiting for your review and action.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4" />
                2. Process Documents
              </h4>
              <p className="text-sm text-muted-foreground">
                Approve, reject, or request changes with detailed comments and reasoning.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Settings className="w-4 h-4" />
                3. Configure Workflows
              </h4>
              <p className="text-sm text-muted-foreground">
                Administrators can create and modify approval workflows to match institutional processes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovalRouting;
