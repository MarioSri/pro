import { DashboardLayout } from "@/components/DashboardLayout";
import { DashboardStats } from "@/components/DashboardStats";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [userRole] = useState("employee"); // This would come from auth context
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const handleNavigate = (view: string) => {
    // Legacy function - now handled by React Router
    console.log("Legacy navigate to:", view);
  };

  return (
    <DashboardLayout userRole={userRole} onLogout={handleLogout}>
      <DashboardStats userRole={userRole} onNavigate={handleNavigate} />
    </DashboardLayout>
  );
};

export default Dashboard;