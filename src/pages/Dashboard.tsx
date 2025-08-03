import { DashboardLayout } from "@/components/DashboardLayout";
import { PrincipalDashboard } from "@/components/dashboards/PrincipalDashboard";
import { RegistrarDashboard } from "@/components/dashboards/RegistrarDashboard";
import { HodDashboard } from "@/components/dashboards/HodDashboard";
import { EmployeeDashboard } from "@/components/dashboards/EmployeeDashboard";
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

  const renderDashboard = () => {
    switch (userRole) {
      case "principal":
        return <PrincipalDashboard onNavigate={handleNavigate} />;
      case "registrar":
        return <RegistrarDashboard onNavigate={handleNavigate} />;
      case "hod":
        return <HodDashboard onNavigate={handleNavigate} />;
      case "employee":
      default:
        return <EmployeeDashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <DashboardLayout userRole={userRole} onLogout={handleLogout}>
      {renderDashboard()}
    </DashboardLayout>
  );
};

export default Dashboard;