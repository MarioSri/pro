import { DashboardLayout } from "@/components/DashboardLayout";
import { UniversalSearch } from "@/components/UniversalSearch";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [userRole] = useState("employee"); // This would come from auth context
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    window.location.href = "/";
  };

  return (
    <DashboardLayout userRole={userRole} onLogout={handleLogout}>
      <div className="container mx-auto p-6">
        <UniversalSearch userRole={userRole} />
      </div>
    </DashboardLayout>
  );
};

export default Search;