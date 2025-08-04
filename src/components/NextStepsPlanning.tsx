import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Users,
  FileText,
  TrendingUp,
  Lightbulb,
  Flag,
  ArrowRight,
  Edit,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NextStep {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'implementation' | 'enhancement' | 'maintenance' | 'compliance';
  assignee: string;
  dueDate: string;
  status: 'planned' | 'in-progress' | 'completed' | 'blocked';
  dependencies: string[];
  estimatedHours: number;
  actualHours?: number;
  completionPercentage: number;
  tags: string[];
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  status: 'upcoming' | 'current' | 'completed' | 'delayed';
  steps: string[];
  progress: number;
}

interface NextStepsPlanningProps {
  userRole: string;
}

export const NextStepsPlanning: React.FC<NextStepsPlanningProps> = ({ userRole }) => {
  const [nextSteps, setNextSteps] = useState<NextStep[]>([
    {
      id: '1',
      title: 'AI-Powered Automation Panel Implementation',
      description: 'Develop smart document processing with auto-summarization, intent detection, and recipient suggestions',
      priority: 'high',
      category: 'implementation',
      assignee: 'Development Team',
      dueDate: '2024-02-15',
      status: 'planned',
      dependencies: [],
      estimatedHours: 40,
      completionPercentage: 0,
      tags: ['AI', 'automation', 'frontend']
    },
    {
      id: '2',
      title: 'Poll & Feedback System',
      description: 'Interactive polling and feedback collection with real-time visualization',
      priority: 'medium',
      category: 'implementation',
      assignee: 'Frontend Team',
      dueDate: '2024-02-20',
      status: 'planned',
      dependencies: ['1'],
      estimatedHours: 32,
      completionPercentage: 0,
      tags: ['polling', 'feedback', 'charts']
    },
    {
      id: '3',
      title: 'Digital Voting & Approvals',
      description: 'Secure voting system for committees with live tally and audit trail',
      priority: 'high',
      category: 'implementation',
      assignee: 'Security Team',
      dueDate: '2024-02-25',
      status: 'planned',
      dependencies: ['2'],
      estimatedHours: 48,
      completionPercentage: 0,
      tags: ['voting', 'security', 'audit']
    },
    {
      id: '4',
      title: 'Live Meet Communication Request',
      description: 'In-person meeting coordination with calendar integration and RSVP tracking',
      priority: 'medium',
      category: 'enhancement',
      assignee: 'Integration Team',
      dueDate: '2024-03-01',
      status: 'planned',
      dependencies: [],
      estimatedHours: 24,
      completionPercentage: 0,
      tags: ['meetings', 'calendar', 'communication']
    },
    {
      id: '5',
      title: 'Document Archive & AI Enhancement',
      description: 'Old document digitization with OCR processing and AI enhancement',
      priority: 'medium',
      category: 'implementation',
      assignee: 'AI Team',
      dueDate: '2024-03-10',
      status: 'planned',
      dependencies: ['1'],
      estimatedHours: 56,
      completionPercentage: 0,
      tags: ['OCR', 'AI', 'archive']
    },
    {
      id: '6',
      title: 'Bi-Directional Approval Routing',
      description: 'Advanced workflow management with conditional routing and escalation paths',
      priority: 'high',
      category: 'implementation',
      assignee: 'Workflow Team',
      dueDate: '2024-03-15',
      status: 'planned',
      dependencies: ['3'],
      estimatedHours: 64,
      completionPercentage: 0,
      tags: ['workflow', 'routing', 'automation']
    }
  ]);

  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: '1',
      title: 'Phase 1: Core AI Features',
      description: 'Implementation of AI-powered automation and smart processing features',
      targetDate: '2024-02-28',
      status: 'current',
      steps: ['1', '2', '5'],
      progress: 15
    },
    {
      id: '2',
      title: 'Phase 2: Advanced Workflows',
      description: 'Enhanced workflow management and approval routing systems',
      targetDate: '2024-03-31',
      status: 'upcoming',
      steps: ['3', '6'],
      progress: 0
    },
    {
      id: '3',
      title: 'Phase 3: Analytics & Compliance',
      description: 'Real-time dashboards, compliance mapping, and performance analytics',
      targetDate: '2024-04-30',
      status: 'upcoming',
      steps: [],
      progress: 0
    }
  ]);

  const [newStep, setNewStep] = useState<Partial<NextStep>>({
    title: '',
    description: '',
    priority: 'medium',
    category: 'implementation',
    assignee: '',
    dueDate: '',
    estimatedHours: 8,
    tags: []
  });

  const { toast } = useToast();

  const addNextStep = () => {
    if (!newStep.title || !newStep.dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in title and due date",
        variant: "destructive"
      });
      return;
    }

    const step: NextStep = {
      id: Date.now().toString(),
      title: newStep.title!,
      description: newStep.description || '',
      priority: newStep.priority || 'medium',
      category: newStep.category || 'implementation',
      assignee: newStep.assignee || 'Unassigned',
      dueDate: newStep.dueDate!,
      status: 'planned',
      dependencies: [],
      estimatedHours: newStep.estimatedHours || 8,
      completionPercentage: 0,
      tags: newStep.tags || []
    };

    setNextSteps([...nextSteps, step]);
    setNewStep({
      title: '',
      description: '',
      priority: 'medium',
      category: 'implementation',
      assignee: '',
      dueDate: '',
      estimatedHours: 8,
      tags: []
    });

    toast({
      title: "Next Step Added",
      description: "New implementation step added to roadmap",
    });
  };

  const updateStepStatus = (id: string, status: NextStep['status']) => {
    setNextSteps(nextSteps.map(step => 
      step.id === id ? { ...step, status } : step
    ));
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-blue-100 text-blue-800 border-blue-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      critical: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[priority as keyof typeof colors];
  };

  const getStatusColor = (status: string) => {
    const colors = {
      planned: 'bg-gray-100 text-gray-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      blocked: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors];
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'implementation': return <Target className="w-4 h-4" />;
      case 'enhancement': return <TrendingUp className="w-4 h-4" />;
      case 'maintenance': return <FileText className="w-4 h-4" />;
      case 'compliance': return <Flag className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const totalEstimatedHours = nextSteps.reduce((acc, step) => acc + step.estimatedHours, 0);
  const completedSteps = nextSteps.filter(step => step.status === 'completed').length;
  const inProgressSteps = nextSteps.filter(step => step.status === 'in-progress').length;
  const blockedSteps = nextSteps.filter(step => step.status === 'blocked').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-elegant">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{nextSteps.length}</p>
                <p className="text-sm text-muted-foreground">Total Steps</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inProgressSteps}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedSteps}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalEstimatedHours}h</p>
                <p className="text-sm text-muted-foreground">Est. Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="roadmap" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="roadmap">Implementation Roadmap</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="planning">Add New Step</TabsTrigger>
        </TabsList>

        <TabsContent value="roadmap" className="space-y-6">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>IAOMS Implementation Roadmap</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {nextSteps.map((step, index) => (
                    <div key={step.id} className="border rounded-lg p-4 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getCategoryIcon(step.category)}
                            <h4 className="font-semibold">{step.title}</h4>
                            <Badge className={getPriorityColor(step.priority)}>
                              {step.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {step.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(step.status)}>
                            {step.status.replace('-', ' ')}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <p className="text-muted-foreground">Assignee</p>
                          <p className="font-medium">{step.assignee}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Due Date</p>
                          <p className="font-medium">{step.dueDate}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Estimated</p>
                          <p className="font-medium">{step.estimatedHours}h</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Progress</p>
                          <p className="font-medium">{step.completionPercentage}%</p>
                        </div>
                      </div>

                      {step.completionPercentage > 0 && (
                        <div className="mb-3">
                          <Progress value={step.completionPercentage} className="h-2" />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {step.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex gap-2">
                          {step.status === 'planned' && (
                            <Button 
                              size="sm" 
                              onClick={() => updateStepStatus(step.id, 'in-progress')}
                            >
                              Start
                            </Button>
                          )}
                          {step.status === 'in-progress' && (
                            <Button 
                              size="sm" 
                              variant="success"
                              onClick={() => updateStepStatus(step.id, 'completed')}
                            >
                              Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-6">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Project Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {milestones.map((milestone) => (
                  <div key={milestone.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg">{milestone.title}</h4>
                      <Badge 
                        variant={
                          milestone.status === 'completed' ? 'success' :
                          milestone.status === 'current' ? 'default' :
                          milestone.status === 'delayed' ? 'destructive' : 'secondary'
                        }
                      >
                        {milestone.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      {milestone.description}
                    </p>
                    
                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Target: {milestone.targetDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <Flag className="w-4 h-4" />
                        {milestone.steps.length} steps
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{milestone.progress}%</span>
                      </div>
                      <Progress value={milestone.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning" className="space-y-6">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Add New Implementation Step</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="step-title">Title *</Label>
                  <Input
                    id="step-title"
                    value={newStep.title}
                    onChange={(e) => setNewStep({...newStep, title: e.target.value})}
                    placeholder="Implementation step title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="step-assignee">Assignee</Label>
                  <Input
                    id="step-assignee"
                    value={newStep.assignee}
                    onChange={(e) => setNewStep({...newStep, assignee: e.target.value})}
                    placeholder="Team or person responsible"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="step-description">Description</Label>
                <Textarea
                  id="step-description"
                  value={newStep.description}
                  onChange={(e) => setNewStep({...newStep, description: e.target.value})}
                  placeholder="Detailed description of the implementation step"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <select
                    value={newStep.priority}
                    onChange={(e) => setNewStep({...newStep, priority: e.target.value as any})}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select
                    value={newStep.category}
                    onChange={(e) => setNewStep({...newStep, category: e.target.value as any})}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="implementation">Implementation</option>
                    <option value="enhancement">Enhancement</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="compliance">Compliance</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="step-date">Due Date *</Label>
                  <Input
                    id="step-date"
                    type="date"
                    value={newStep.dueDate}
                    onChange={(e) => setNewStep({...newStep, dueDate: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="step-hours">Est. Hours</Label>
                  <Input
                    id="step-hours"
                    type="number"
                    min="1"
                    value={newStep.estimatedHours}
                    onChange={(e) => setNewStep({...newStep, estimatedHours: parseInt(e.target.value) || 8})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="step-tags">Tags (comma separated)</Label>
                <Input
                  id="step-tags"
                  value={newStep.tags?.join(', ')}
                  onChange={(e) => {
                    const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                    setNewStep({...newStep, tags});
                  }}
                  placeholder="e.g., AI, frontend, mobile, security"
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setNewStep({
                    title: '',
                    description: '',
                    priority: 'medium',
                    category: 'implementation',
                    assignee: '',
                    dueDate: '',
                    estimatedHours: 8,
                    tags: []
                  })}
                >
                  Clear
                </Button>
                <Button onClick={addNextStep} variant="gradient">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Step
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Implementation Timeline */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Remaining Components to Implement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'AI-Powered Automation Panel', priority: 'high', hours: 40 },
              { name: 'Poll & Feedback System', priority: 'medium', hours: 32 },
              { name: 'Digital Voting & Approvals', priority: 'high', hours: 48 },
              { name: 'Live Meet Communication Request', priority: 'medium', hours: 24 },
              { name: 'Document Archive & AI Enhancement', priority: 'medium', hours: 56 },
              { name: 'Bi-Directional Approval Routing', priority: 'high', hours: 64 },
              { name: 'Auto-Escalation Management', priority: 'high', hours: 32 },
              { name: 'Advanced Meeting Features', priority: 'medium', hours: 40 },
              { name: 'Document Lifecycle Tracker', priority: 'medium', hours: 36 },
              { name: 'Compliance Mapping Dashboard', priority: 'high', hours: 48 },
              { name: 'Real-Time Dashboard Heatmaps', priority: 'medium', hours: 44 },
              { name: 'Taskboard Integration', priority: 'medium', hours: 28 }
            ].map((component, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">{component.name}</h4>
                    <div className="flex items-center justify-between">
                      <Badge className={getPriorityColor(component.priority)}>
                        {component.priority}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {component.hours}h
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};