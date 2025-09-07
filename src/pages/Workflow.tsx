import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Workflow, GitBranch, Clock, CheckCircle2, XCircle, Users, Settings, Plus, ChevronDown, ChevronUp, FileText, AlertTriangle, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { WorkflowBuilder } from "@/components/WorkflowBuilder";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect, useRef } from "react";

const WorkflowManagement = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [expandedWorkflowId, setExpandedWorkflowId] = useState<number | null>(null);
  const dropdownRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (expandedWorkflowId !== null) {
        const currentDropdown = dropdownRefs.current[expandedWorkflowId];
        if (currentDropdown && !currentDropdown.contains(event.target as Node)) {
          setExpandedWorkflowId(null);
        }
      }
    };

    if (expandedWorkflowId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expandedWorkflowId]);

  const handleHierarchyToggle = (workflowId: number) => {
    setExpandedWorkflowId(expandedWorkflowId === workflowId ? null : workflowId);
  };

  const handleHierarchyOption = (option: string) => {
    toast({
      title: "Workflow Created",
      description: `${option} workflow has been created successfully.`,
    });
    setExpandedWorkflowId(null);
    // Here you can add navigation or other logic for each option
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  if (!user) {
    return null; // This should be handled by ProtectedRoute, but adding as safety
  }

  const workflows = [
    {
      id: 1,
      name: "Document Approval Workflow",
      description: "Standard approval process for reports and circulars",
      status: "active",
      steps: ["Submit", "HOD Review", "Registrar Approval", "Principal Sign-off"],
      documents: 24
    },
    {
      id: 2,
      name: "Emergency Document Workflow",
      description: "Fast-track approval for urgent documents",
      status: "active",
      steps: ["Submit", "Principal Direct Approval"],
      documents: 3
    },
    {
      id: 3,
      name: "Meeting Request Workflow",
      description: "Approval process for meeting scheduling",
      status: "draft",
      steps: ["Request", "Calendar Check", "Approval", "Notification"],
      documents: 0
    }
  ];

  return (
    <DashboardLayout userRole={user.role} onLogout={handleLogout}>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Workflow Management</h1>
          <p className="text-muted-foreground">Design and manage document approval workflows</p>
        </div>

        <Tabs defaultValue="templates" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="templates">Workflow Templates</TabsTrigger>
            <TabsTrigger value="builder">Visual Builder</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Workflow className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">3</p>
                      <p className="text-sm text-muted-foreground">Active Workflows</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-warning/10 rounded-lg">
                      <Clock className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-sm text-muted-foreground">Pending Approvals</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-success/10 rounded-lg">
                      <CheckCircle2 className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">89</p>
                      <p className="text-sm text-muted-foreground">Completed This Month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-shrink-0">
                    <CardTitle className="flex items-center gap-2">
                      <GitBranch className="h-5 w-5" />
                      Workflow Templates
                    </CardTitle>
                    <CardDescription>
                      Manage and configure approval workflows
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflows.map((workflow) => (
                    <div key={workflow.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{workflow.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant={workflow.status === "active" ? "default" : "secondary"}>
                            {workflow.status}
                          </Badge>
                          <Badge variant="outline">
                            {workflow.documents} documents
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{workflow.description}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <div className="flex items-center gap-1">
                          {workflow.steps.map((step, index) => (
                            <span key={step} className="flex items-center">
                              <span className="text-xs bg-muted px-2 py-1 rounded">{step}</span>
                              {index < workflow.steps.length - 1 && (
                                <span className="mx-1 text-muted-foreground">→</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit Workflow</Button>
                        <div className="relative" ref={(el) => dropdownRefs.current[workflow.id] = el}>
                          <Button 
                            onClick={() => handleHierarchyToggle(workflow.id)}
                            className="flex items-center gap-2 transition-all duration-700 ease-out flex-shrink-0"
                            variant="default"
                            size="sm"
                          >
                            <Plus className="h-4 w-4" />
                            Add Hierarchy
                            {expandedWorkflowId === workflow.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                          
                          {/* Horizontal Expandable Options */}
                          <div className={`absolute top-full left-0 mt-2 z-10 transition-all duration-700 ease-out ${
                            expandedWorkflowId === workflow.id ? 'max-w-none opacity-100 visible' : 'max-w-0 opacity-0 invisible'
                          }`}>
                            <div className="flex flex-col gap-2 bg-white border rounded-lg p-2 shadow-lg min-w-max">
                              <Button
                                onClick={() => handleHierarchyOption('Document Management')}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 whitespace-nowrap justify-start"
                              >
                                <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                <span>Document Management</span>
                              </Button>
                              
                              <Button
                                onClick={() => handleHierarchyOption('Emergency Management')}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 whitespace-nowrap justify-start"
                              >
                                <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                                <span>Emergency Management</span>
                              </Button>
                              
                              <Button
                                onClick={() => handleHierarchyOption('Approval Chain with Bypass')}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 whitespace-nowrap justify-start"
                              >
                                <Shield className="h-4 w-4 text-green-600 flex-shrink-0" />
                                <span>Approval Chain with Bypass</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="builder" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Visual Workflow Builder
                </CardTitle>
                <CardDescription>
                  Drag and drop to create custom approval workflows with role-based nodes and smart routing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WorkflowBuilder />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default WorkflowManagement;