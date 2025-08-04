import { DashboardLayout } from "@/components/DashboardLayout";
import { SelfReminderSystem } from "@/components/SelfReminderSystem";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Reminders = () => {
  const [userRole] = useState("employee");
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <DashboardLayout userRole={userRole} onLogout={handleLogout}>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Personal Reminders</h1>
          <p className="text-muted-foreground">Stay organized with smart reminder notifications</p>
        </div>
        
        <SelfReminderSystem userRole={userRole} />
      </div>
    </DashboardLayout>
  );
};

export default Reminders;