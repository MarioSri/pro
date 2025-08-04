import { DashboardLayout } from "@/components/DashboardLayout";
import { NextStepsPlanning } from "@/components/NextStepsPlanning";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const NextSteps = () => {
  const [userRole] = useState("employee");
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    // Redirect to login page
    window.location.href = "/";
  };

  return (
    <DashboardLayout userRole={userRole} onLogout={handleLogout}>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Next Steps Planning</h1>
          <p className="text-muted-foreground">Implementation roadmap and milestone tracking for IAOMS</p>
        </div>
        
        <NextStepsPlanning userRole={userRole} />
      </div>
    </DashboardLayout>
  );
};

export default NextSteps;