import { useState, useEffect } from "react";
import { AuthenticationCard } from "@/components/AuthenticationCard";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { ResponsiveDashboard } from "@/components/dashboard/ResponsiveDashboard";
import { HITAMTreeLoading } from "@/components/ui/loading-animation";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Index = () => {
  const { user, isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (role: string) => {
    try {
      await login(role);
      
      // Show success message with role information
      const roleNames = {
        'principal': 'Principal',
        'registrar': 'Registrar', 
        'hod': 'Head of Department',
        'program-head': 'Program Department Head',
        'employee': 'Employee'
      };
      
      toast.success(`Welcome to IAOMS!`, {
        description: `Successfully logged in as ${roleNames[role as keyof typeof roleNames]}`,
        duration: 3000,
      });
      
      // Navigate to dashboard after successful login
      navigate('/dashboard');
    } catch (error) {
      toast.error('Login Failed', {
        description: 'Unable to authenticate. Please try again.',
      });
    }
  };

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <HITAMTreeLoading size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthenticationCard onLogin={handleLogin} />;
  }

  return (
    <ResponsiveLayout>
      <ResponsiveDashboard />
    </ResponsiveLayout>
  );
};

export default Index;