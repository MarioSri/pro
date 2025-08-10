import React from 'react';
import { HITAMTreeLoading, HITAMTreeLoadingDetailed } from './hitam-tree-loading';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from "@/lib/utils";

interface ResponsiveLoadingProps {
  progress?: number;
  onComplete?: () => void;
  message?: string;
  className?: string;
  variant?: 'auth' | 'page' | 'component';
}

// Responsive loading component that adapts to screen size
export const ResponsiveHITAMLoading: React.FC<ResponsiveLoadingProps> = ({
  progress,
  onComplete,
  message,
  className,
  variant = 'component'
}) => {
  const isMobile = useIsMobile();
  
  const getSize = () => {
    if (variant === 'auth') return isMobile ? 'lg' : 'xl';
    if (variant === 'page') return isMobile ? 'md' : 'lg';
    return isMobile ? 'sm' : 'md';
  };

  const getContainerClass = () => {
    switch (variant) {
      case 'auth':
        return "min-h-screen flex items-center justify-center bg-gradient-subtle p-4";
      case 'page':
        return "min-h-[50vh] flex items-center justify-center";
      default:
        return "flex items-center justify-center py-8";
    }
  };

  return (
    <div className={cn(getContainerClass(), className)}>
      <div className="text-center space-y-4">
        <HITAMTreeLoadingDetailed
          size={getSize()}
          showText={variant === 'auth'}
          progress={progress}
          onComplete={onComplete}
        />
        
        {message && variant !== 'auth' && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
        
        {variant === 'auth' && (
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-bold text-primary">HITAM</h2>
            <p className="text-sm text-muted-foreground">
              Hyderabad Institute of Technology and Management
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Loading overlay for forms and modals
export const LoadingOverlay: React.FC<{
  isVisible: boolean;
  message?: string;
  progress?: number;
}> = ({ isVisible, message, progress }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
      <div className="text-center">
        <HITAMTreeLoading 
          size="md" 
          showText={false}
          progress={progress}
        />
        {message && (
          <p className="mt-3 text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    </div>
  );
};