import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { AdvancedDigitalSignature } from "@/components/AdvancedDigitalSignature";
import { TouchSignaturePad } from "@/components/signature/TouchSignaturePad";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useResponsive } from "@/hooks/useResponsive";

const AdvancedSignature = () => {
  const { user } = useAuth();
  const { isMobile } = useResponsive();

  if (!user) return null;

  return (
    <ResponsiveLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Digital Signature
          </h1>
          <p className="text-muted-foreground">
            {isMobile ? 'Touch-optimized signature capture' : 'Multi-modal signature capture with quality validation'}
          </p>
        </div>
        
        {isMobile ? (
          <TouchSignaturePad />
        ) : (
          <Tabs defaultValue="advanced" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="advanced">Advanced Tools</TabsTrigger>
              <TabsTrigger value="touch">Touch Pad</TabsTrigger>
            </TabsList>
            
            <TabsContent value="advanced">
              <AdvancedDigitalSignature userRole={user.role} />
            </TabsContent>
            
            <TabsContent value="touch">
              <TouchSignaturePad />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </ResponsiveLayout>
  );
};

export default AdvancedSignature;