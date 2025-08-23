import { DashboardLayout } from "@/components/DashboardLayout";
import { EmergencyWorkflowInterface } from "@/components/EmergencyWorkflowInterface";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Emergency = () => {
  const [userRole] = useState("employee");
  const { toast } = useToast();
  const navigate = useNavigate();

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
          <h1 className="text-3xl font-bold text-foreground mb-2">Emergency Management</h1>
          <p className="text-muted-foreground">Priority document submission and emergency response</p>
        </div>
        
        <EmergencyWorkflowInterface userRole={userRole} />
      </div>
    </DashboardLayout>
  );
};

export default Emergency;