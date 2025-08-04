import { DashboardLayout } from "@/components/DashboardLayout";
import { AudioNotesGenerator } from "@/components/AudioNotesGenerator";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const AudioNotes = () => {
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Audio Notes Generator</h1>
          <p className="text-muted-foreground">Convert speech to text with AI-powered transcription</p>
        </div>
        
        <AudioNotesGenerator userRole={userRole} />
      </div>
    </DashboardLayout>
  );
};

export default AudioNotes;