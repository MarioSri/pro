import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Workflow, GitBranch, Clock, CheckCircle2, XCircle, Users } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const WorkflowManagement = () => {
  const [userRole] = useState("employee");
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

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
    <DashboardLayout userRole={userRole} onLogout={handleLogout}>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Workflow Management</h1>
          <p className="text-muted-foreground">Design and manage document approval workflows</p>
        </div>

        <div className="grid gap-6">
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
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Workflow Templates
              </CardTitle>
              <CardDescription>
                Manage and configure approval workflows
              </CardDescription>
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
                      <Button variant="outline" size="sm">View Analytics</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WorkflowManagement;