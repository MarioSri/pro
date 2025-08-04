import { DashboardLayout } from "@/components/DashboardLayout";
import { NotesCanvaSystem } from "@/components/NotesCanvaSystem";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const NotesCanvas = () => {
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
      <NotesCanvaSystem userRole={userRole} />
    </DashboardLayout>
  );
};

export default NotesCanvas;