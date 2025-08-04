import { DashboardLayout } from "@/components/DashboardLayout";
import { DocumentUploader } from "@/components/DocumentUploader";
import { DocumentTracker } from "@/components/DocumentTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Documents = () => {
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

  const handleDocumentSubmit = (data: any) => {
    console.log("Document submitted:", data);
    toast({
      title: "Document Submitted",
      description: "Your document has been submitted for review.",
    });
  };

  return (
    <DashboardLayout userRole={userRole} onLogout={handleLogout}>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Document Management</h1>
          <p className="text-muted-foreground">Submit and track your permission reports, letters, and circulars</p>
        </div>

        <Tabs defaultValue="submit" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="submit">Submit Document</TabsTrigger>
            <TabsTrigger value="track">Track Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="submit" className="space-y-6">
            <DocumentUploader userRole={userRole} onSubmit={handleDocumentSubmit} />
          </TabsContent>
          
          <TabsContent value="track" className="space-y-6">
            <DocumentTracker userRole={userRole} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Documents;