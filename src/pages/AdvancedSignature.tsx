import { DashboardLayout } from "@/components/DashboardLayout";
import { AdvancedDigitalSignature } from "@/components/AdvancedDigitalSignature";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const AdvancedSignature = () => {
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Advanced Digital Signature</h1>
          <p className="text-muted-foreground">Multi-modal signature capture with quality validation</p>
        </div>
        
        <AdvancedDigitalSignature userRole={userRole} />
      </div>
    </DashboardLayout>
  );
};

export default AdvancedSignature;