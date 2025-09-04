import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Users, FileText, Clock, CheckCircle2, XCircle, Calendar, Lightbulb, Play, RotateCcw, Target, ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTutorial } from "@/components/tutorial/TutorialProvider";
import { useState } from "react";

const Analytics = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { startTutorial, hasCompletedTutorial, resetTutorial } = useTutorial();
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showTutorialModal, setShowTutorialModal] = useState(false);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const handleStartTutorial = () => {
    setShowTutorialModal(true);
    setTutorialStep(0);
  };

  const handleNextTutorialStep = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      setShowTutorialModal(false);
      toast({
        title: "Tutorial Complete!",
        description: "You've completed the IAOMS tutorial.",
      });
    }
  };

  const handlePrevTutorialStep = () => {
    if (tutorialStep > 0) {
      setTutorialStep(tutorialStep - 1);
    }
  };

  const tutorialSteps = [
    {
      title: "Welcome to IAOMS",
      description: "Learn how to navigate and use the Institutional Activity Oversight and Management System effectively."
    },
    {
      title: "Dashboard Overview",
      description: "Your dashboard provides quick access to all essential features and real-time updates."
    },
    {
      title: "Document Management",
      description: "Submit, track, and manage your documents through the complete approval workflow."
    },
    {
      title: "Communication Tools",
      description: "Use real-time chat, polls, and digital signatures for seamless collaboration."
    }
  ];

  if (!user) {
    return null; // This should be handled by ProtectedRoute, but adding as safety
  }

  const departmentStats = [
    { name: "Computer Science", submitted: 45, approved: 38, rejected: 7, pending: 0 },
    { name: "Electrical Engineering", submitted: 32, approved: 28, rejected: 2, pending: 2 },
    { name: "Mechanical Engineering", submitted: 28, approved: 24, rejected: 3, pending: 1 },
    { name: "Electronics & Communication", submitted: 35, approved: 30, rejected: 4, pending: 1 },
    { name: "Civil Engineering", submitted: 22, approved: 20, rejected: 1, pending: 1 }
  ];

  const monthlyTrends = [
    { month: "Oct", documents: 120, approved: 98, rejected: 15, avgTime: 2.3 },
    { month: "Nov", documents: 135, approved: 115, rejected: 12, avgTime: 2.1 },
    { month: "Dec", documents: 98, approved: 85, rejected: 8, avgTime: 1.9 },
    { month: "Jan", documents: 162, approved: 140, rejected: 17, avgTime: 2.2 }
  ];

  return (
    <DashboardLayout userRole={user.role} onLogout={handleLogout}>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive insights into document workflow performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">162</p>
                  <p className="text-sm text-muted-foreground">Total Documents</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-success" />
                    <span className="text-xs text-success">+12% vs last month</span>
                  </div>
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
                  <p className="text-2xl font-bold">140</p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-muted-foreground">86.4% approval rate</span>
                  </div>
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
                  <p className="text-2xl font-bold">2.2</p>
                  <p className="text-sm text-muted-foreground">Avg. Days</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-muted-foreground">Processing time</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-destructive/10 rounded-lg">
                  <XCircle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">17</p>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-muted-foreground">10.5% rejection rate</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Document Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Approved</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div className="bg-success h-2 rounded-full" style={{ width: "86.4%" }}></div>
                        </div>
                        <span className="text-sm font-medium">86.4%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Rejected</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div className="bg-destructive h-2 rounded-full" style={{ width: "10.5%" }}></div>
                        </div>
                        <span className="text-sm font-medium">10.5%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Pending</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div className="bg-warning h-2 rounded-full" style={{ width: "3.1%" }}></div>
                        </div>
                        <span className="text-sm font-medium">3.1%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Top Performers
                  </CardTitle>
                  <CardDescription>Departments with best approval rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {departmentStats.slice(0, 3).map((dept, index) => (
                      <div key={dept.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">#{index + 1}</Badge>
                          <span className="text-sm">{dept.name}</span>
                        </div>
                        <span className="text-sm font-medium">
                          {((dept.approved / dept.submitted) * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="departments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Department-wise Analytics</CardTitle>
                <CardDescription>Document submission and approval statistics by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentStats.map((dept) => (
                    <div key={dept.name} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{dept.name}</h3>
                        <Badge variant="outline">{dept.submitted} total</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                          <span>{dept.approved} approved</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-destructive" />
                          <span>{dept.rejected} rejected</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-warning" />
                          <span>{dept.pending} pending</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-success h-2 rounded-full" 
                            style={{ width: `${(dept.approved / dept.submitted) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {((dept.approved / dept.submitted) * 100).toFixed(1)}% approval rate
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Monthly Trends
                </CardTitle>
                <CardDescription>Document submission and processing trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyTrends.map((month) => (
                    <div key={month.month} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{month.month} 2024</h3>
                        <Badge variant="outline">{month.documents} documents</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Approved</p>
                          <p className="font-medium">{month.approved}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Rejected</p>
                          <p className="font-medium">{month.rejected}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Avg. Processing</p>
                          <p className="font-medium">{month.avgTime} days</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Success Rate</p>
                          <p className="font-medium">{((month.approved / month.documents) * 100).toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-6">
            {/* Interactive Tutorials Card - Fixed Version */}
            <Card className="shadow-lg border-primary/20 tutorial-card-container">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-primary" />
                  Interactive Tutorials
                </CardTitle>
                <CardDescription>
                  Learn how to use IAOMS effectively with guided tutorials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pb-6">
                {/* Tutorial Modal Toggle */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20">
                  <div className="flex-1 pr-4">
                    <h4 className="font-semibold text-lg mb-2">IAOMS Quick Tour</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Master the essential features and navigation in just 5 minutes
                    </p>
                    {hasCompletedTutorial && (
                      <Badge variant="default" className="bg-success text-white">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 min-w-fit">
                    <Button
                      onClick={handleStartTutorial}
                      variant="default"
                      size="sm"
                      className="w-full"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {hasCompletedTutorial ? 'Review Tour' : 'Start Tour'}
                    </Button>
                    {hasCompletedTutorial && (
                      <Button
                        onClick={resetTutorial}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                    )}
                  </div>
                </div>

                {/* Tutorial Steps Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-border rounded-lg hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-primary" />
                      <h4 className="font-medium">Role-Specific Features</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Discover features tailored for your {user?.role} role
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate('/tutorials')}
                    >
                      Explore Role Guide
                    </Button>
                  </div>
                  
                  <div className="p-4 border border-border rounded-lg hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-primary" />
                      <h4 className="font-medium">Workflow Mastery</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Learn document submission and approval processes
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate('/tutorials')}
                    >
                      View Workflows
                    </Button>
                  </div>
                </div>

                {/* Tutorial Modal */}
                {showTutorialModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <Badge variant="outline" className="text-xs">
                            Step {tutorialStep + 1} of {tutorialSteps.length}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowTutorialModal(false)}
                          >
                            ✕
                          </Button>
                        </div>
                        
                        <div className="mb-6">
                          <h3 className="text-xl font-semibold mb-3">
                            {tutorialSteps[tutorialStep].title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {tutorialSteps[tutorialStep].description}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrevTutorialStep}
                            disabled={tutorialStep === 0}
                            className="flex items-center gap-2"
                          >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                          </Button>
                          
                          <Button
                            size="sm"
                            onClick={handleNextTutorialStep}
                            className="flex items-center gap-2"
                          >
                            {tutorialStep === tutorialSteps.length - 1 ? (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                Complete
                              </>
                            ) : (
                              <>
                                Next
                                <ArrowRight className="w-4 h-4" />
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators for workflow efficiency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Processing Times</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Average Processing Time</span>
                        <span className="font-medium">2.2 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Fastest Approval</span>
                        <span className="font-medium">4 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Longest Processing</span>
                        <span className="font-medium">7 days</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Quality Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">First-time Approval Rate</span>
                        <span className="font-medium">78.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Resubmission Rate</span>
                        <span className="font-medium">12.3%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">User Satisfaction</span>
                        <span className="font-medium">4.6/5.0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;