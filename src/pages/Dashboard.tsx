import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardStats } from "@/components/DashboardStats";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [userRole] = useState("employee"); // This would come from auth context
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const handleNavigate = (view: string) => {
    // Navigation handled by React Router
    console.log("Navigate to:", view);
  };

  return (
    <DashboardLayout userRole={userRole} onLogout={handleLogout}>
      <DashboardStats userRole={userRole} onNavigate={handleNavigate} />
    </DashboardLayout>
  );
};

export default Dashboard;