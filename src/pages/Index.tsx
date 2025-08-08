import { useState } from "react";
import { AuthenticationCard } from "@/components/AuthenticationCard";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardStats } from "@/components/DashboardStats";
import { DocumentUploader } from "@/components/DocumentUploader";
import { DocumentTracker } from "@/components/DocumentTracker";
import { DigitalSignature } from "@/components/DigitalSignature";
import { MeetingScheduler } from "@/components/MeetingScheduler";
import { NotesReminders } from "@/components/NotesReminders";
import { EmergencyFeatures } from "@/components/EmergencyFeatures";
import { HITAMTreeLoading } from "@/components/ui/loading-animation";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<string>("");
  const [currentView, setCurrentView] = useState<"dashboard" | "submit" | "documents" | "tracking" | "signature" | "meetings" | "notes" | "emergency">("dashboard");
  const { toast } = useToast();

  const handleLogin = (role: string) => {
    setIsLoading(true);
    
    // Simulate authentication process with HITAM tree animation
    setTimeout(() => {
      setUserRole(role);
      setIsAuthenticated(true);
      setIsLoading(false);
      toast({
        title: "Login Successful",
        description: `Welcome to IAOMS, ${role}!`,
      });
    }, 3000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole("");
    setCurrentView("dashboard");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const handleDocumentSubmit = (data: any) => {
    console.log("Document submitted:", data);
    toast({
      title: "Document Submitted",
      description: "Your document has been submitted for review.",
    });
    setCurrentView("dashboard");
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view as "dashboard" | "submit" | "documents" | "tracking" | "signature" | "meetings" | "notes" | "emergency");
  };

  if (!isAuthenticated) {
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
          <HITAMTreeLoading size="lg" />
        </div>
      );
    }
    
    return <AuthenticationCard onLogin={handleLogin} />;
  }

  return (
    <DashboardLayout userRole={userRole} onLogout={handleLogout}>
      {currentView === "dashboard" && (
        <DashboardStats userRole={userRole} onNavigate={handleNavigate} />
      )}
      {currentView === "submit" && (
        <DocumentUploader userRole={userRole} onSubmit={handleDocumentSubmit} />
      )}
      {currentView === "tracking" && (
        <DocumentTracker userRole={userRole} />
      )}
      {currentView === "documents" && (
        <DocumentTracker userRole={userRole} />
      )}
      {currentView === "signature" && (
        <DigitalSignature userRole={userRole} />
      )}
      {currentView === "meetings" && (
        <MeetingScheduler userRole={userRole} />
      )}
      {currentView === "notes" && (
        <NotesReminders userRole={userRole} />
      )}
      {currentView === "emergency" && (
        <EmergencyFeatures userRole={userRole} />
      )}
    </DashboardLayout>
  );
};

export default Index;
