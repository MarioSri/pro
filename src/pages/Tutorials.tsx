import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { TutorialManager } from "@/components/tutorial/TutorialSystem";
import { useAuth } from "@/contexts/AuthContext";

const Tutorials = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <ResponsiveLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Interactive Tutorials
          </h1>
          <p className="text-muted-foreground">
            Learn how to use IAOMS effectively with guided interactive tours
          </p>
        </div>
        
        <TutorialManager />
      </div>
    </ResponsiveLayout>
  );
};

export default Tutorials;