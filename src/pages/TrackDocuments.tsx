import { DashboardLayout } from "@/components/DashboardLayout";
import { DocumentTracker } from "@/components/DocumentTracker";
import { LiveMeetingRequestManager } from "@/components/LiveMeetingRequestManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Eye, Video } from "lucide-react";

const TrackDocuments = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Tracking stats
  const [stats, setStats] = useState({
    pendingDocuments: 5,
    liveMeetRequests: 3
  });

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

  return (
    <DashboardLayout userRole={user.role} onLogout={handleLogout}>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Track Documents</h1>
          <p className="text-muted-foreground">Monitor document status and manage LiveMeet+ requests</p>
        </div>

        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="documents" className="relative">
              <Eye className="w-4 h-4 mr-2" />
              Document Tracking
              {stats.pendingDocuments > 0 && (
                <Badge variant="secondary" className="ml-2 px-1 py-0 text-xs">
                  {stats.pendingDocuments}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="livemeet" className="relative">
              🔴 LiveMeet+
              {stats.liveMeetRequests > 0 && (
                <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs animate-pulse">
                  {stats.liveMeetRequests}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="documents" className="space-y-6">
            <DocumentTracker userRole={user.role} />
          </TabsContent>

          <TabsContent value="livemeet" className="space-y-6">
            <LiveMeetingRequestManager />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TrackDocuments;
