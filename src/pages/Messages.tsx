import { DashboardLayout } from "@/components/DashboardLayout";
import { NotesReminders } from "@/components/NotesReminders";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/ChatInterface";
import { PollManager } from "@/components/PollManager";
import { SignatureManager } from "@/components/SignatureManager";
import { WorkflowDemo } from "@/components/WorkflowDemo";
import { LiveMeetingRequestManager } from "@/components/LiveMeetingRequestManager";
import { DecentralizedChatService } from "@/services/DecentralizedChatService";
import { useAuth } from "@/contexts/AuthContext";
import { 
  MessageCircle, 
  Users, 
  Bell, 
  BarChart3, 
  PenTool, 
  Zap, 
  MessageSquare,
  TrendingUp,
  Hash,
  FileText,
  CheckCircle2,
  Clock,
  Video
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Messages = () => {
  const [userRole] = useState("employee");
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [chatService] = useState(() => new DecentralizedChatService(
    import.meta.env.VITE_WS_URL || 'ws://localhost:8080',
    import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
  ));

  // Communication stats
  const [stats, setStats] = useState({
    unreadMessages: 8,
    pendingSignatures: 2,
    activePolls: 1,
    onlineUsers: 23,
    totalChannels: 5,
    notifications: 4,
    liveMeetingRequests: 3 // NEW: Live meeting requests
  });

  useEffect(() => {
    if (!user) return;

    // Load initial stats (in real implementation, this would come from the API)
    setStats(prevStats => ({
      ...prevStats,
      unreadMessages: Math.floor(Math.random() * 20),
      pendingSignatures: Math.floor(Math.random() * 5),
      activePolls: Math.floor(Math.random() * 3),
      onlineUsers: 15 + Math.floor(Math.random() * 30)
    }));

    return () => {
      chatService.disconnect();
    };
  }, [user, chatService]);

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  return (
    <DashboardLayout userRole={userRole} onLogout={handleLogout}>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Communication Center</h1>
          <p className="text-muted-foreground">Messages, notes, and reminders for collaborative work</p>
        </div>

        <Tabs defaultValue="notes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="notes">Notes & Reminders</TabsTrigger>
            <TabsTrigger value="chat" className="relative">
              Department Chat
              {stats.unreadMessages > 0 && (
                <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs">
                  {stats.unreadMessages}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="live-requests" className="relative">
              🔴 Live Requests
              {stats.liveMeetingRequests > 0 && (
                <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs animate-pulse">
                  {stats.liveMeetingRequests}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="polls">
              Polls & Voting
              {stats.activePolls > 0 && (
                <Badge variant="secondary" className="ml-2 px-1 py-0 text-xs">
                  {stats.activePolls}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="signatures">
              Digital Signatures
              {stats.pendingSignatures > 0 && (
                <Badge variant="secondary" className="ml-2 px-1 py-0 text-xs">
                  {stats.pendingSignatures}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="notifications">
              Notifications
              {stats.notifications > 0 && (
                <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs">
                  {stats.notifications}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="notes" className="space-y-6">
            <NotesReminders userRole={userRole} />
          </TabsContent>

          <TabsContent value="live-requests" className="space-y-6">
            <LiveMeetingRequestManager />
          </TabsContent>
          
          <TabsContent value="chat" className="space-y-6">
            {/* Communication Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Messages</p>
                      <p className="text-2xl font-bold">{stats.unreadMessages}</p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Online</p>
                      <p className="text-2xl font-bold">{stats.onlineUsers}</p>
                    </div>
                    <Users className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Channels</p>
                      <p className="text-2xl font-bold">{stats.totalChannels}</p>
                    </div>
                    <Hash className="w-8 h-8 text-indigo-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Signatures</p>
                      <p className="text-2xl font-bold">{stats.pendingSignatures}</p>
                    </div>
                    <PenTool className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Polls</p>
                      <p className="text-2xl font-bold">{stats.activePolls}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">Live</span>
                      </div>
                    </div>
                    <Zap className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Chat Interface */}
            <Card className="min-h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Department Communication Hub
                </CardTitle>
                <CardDescription>
                  Real-time chat, document workflows, and collaboration tools
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px]">
                  <ChatInterface />
                </div>
              </CardContent>
            </Card>

            {/* Workflow Integration Demo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Document Workflow Integration
                </CardTitle>
                <CardDescription>
                  See how document workflows integrate with the communication system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WorkflowDemo />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="polls" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Polls & Voting Center
                </CardTitle>
                <CardDescription>
                  Create polls, collect feedback, and make collaborative decisions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PollManager
                  chatService={chatService}
                  channelId="general"
                  userId={user?.id || ''}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signatures" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PenTool className="h-5 w-5" />
                  Digital Signature Center
                </CardTitle>
                <CardDescription>
                  Request, collect, and manage digital signatures for documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SignatureManager
                  chatService={chatService}
                  channelId="general"
                  userId={user?.id || ''}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Center
                </CardTitle>
                <CardDescription>
                  Manage communication alerts and system notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-muted/20 rounded-lg">
                    <MessageCircle className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">New Messages</p>
                      <p className="text-xl font-bold">{stats.unreadMessages}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-muted/20 rounded-lg">
                    <PenTool className="w-8 h-8 text-purple-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Signature Requests</p>
                      <p className="text-xl font-bold">{stats.pendingSignatures}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-muted/20 rounded-lg">
                    <BarChart3 className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Active Polls</p>
                      <p className="text-xl font-bold">{stats.activePolls}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-muted/20 rounded-lg">
                    <FileText className="w-8 h-8 text-orange-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Document Updates</p>
                      <p className="text-xl font-bold">3</p>
                    </div>
                  </div>
                </div>

                {/* Recent Notifications */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Recent Notifications</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-start gap-3 p-4 border rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">New message in #general</h4>
                          <Badge variant="secondary">2 min ago</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">John Doe shared a document for review</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 border rounded-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">Signature request received</h4>
                          <Badge variant="secondary">15 min ago</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Academic letter requires your approval</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 border rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">Poll participation reminder</h4>
                          <Badge variant="secondary">1 hour ago</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Vote on the new academic calendar proposal</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 border rounded-lg">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">Document workflow completed</h4>
                          <Badge variant="secondary">2 hours ago</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Annual report has been approved by all stakeholders</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Message Notifications</p>
                          <p className="text-sm text-muted-foreground">Get notified of new messages</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Enabled
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Signature Requests</p>
                          <p className="text-sm text-muted-foreground">Alert for signature requests</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Enabled
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Poll Notifications</p>
                          <p className="text-sm text-muted-foreground">Notify about new polls</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Enabled
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Document Updates</p>
                          <p className="text-sm text-muted-foreground">Updates on document workflows</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Clock className="w-4 h-4 mr-1" />
                          Delayed
                        </Button>
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

export default Messages;