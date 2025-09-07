import { DashboardLayout } from "@/components/DashboardLayout";
import { MeetingScheduler } from "@/components/MeetingScheduler";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Calendar = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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
          <h1 className="text-3xl font-bold text-foreground mb-2">📅 Meeting Scheduler</h1>
          <p className="text-muted-foreground">The smart way to schedule meetings and manage your calendar, with advanced integration for Google Meet, Zoom, and Microsoft Teams.</p>
        </div>
        
        <MeetingScheduler userRole={user.role} />
      </div>
    </DashboardLayout>
  );
};

export default Calendar;