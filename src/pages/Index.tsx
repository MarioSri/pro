import { useState, useEffect } from "react";
import { AuthenticationCard } from "@/components/AuthenticationCard";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { ResponsiveDashboard } from "@/components/dashboard/ResponsiveDashboard";
import { HITAMTreeLoading } from "@/components/ui/loading-animation";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user, isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (role: string) => {
    await login(role);
    navigate('/dashboard');
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