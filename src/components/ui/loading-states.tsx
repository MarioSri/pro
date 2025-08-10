import React from 'react';
import { HITAMTreeLoading, LoadingSpinner } from './loading-animation';
import { HITAMTreeLoadingDetailed } from './hitam-tree-loading';
import { AuthenticationLoading } from './enhanced-loading-states';
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  type?: 'tree' | 'spinner' | 'auth' | 'detailed';
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
  progress?: number;
  onComplete?: () => void;
  userRole?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'tree',
  size = 'md',
  message,
  className,
  progress,
  onComplete,
  userRole = 'employee'
}) => {
  if (type === 'auth' && onComplete) {
    return (
      <AuthenticationLoading
        userRole={userRole}
        onComplete={onComplete}
        className={className}
      />
    );
  }

  if (type === 'detailed') {
    return (
      <div className={cn("flex flex-col items-center justify-center p-8", className)}>
        <HITAMTreeLoadingDetailed
          size={size}
          showText={!!message}
          progress={progress}
          onComplete={onComplete}
        />
        {message && (
          <p className="mt-4 text-sm text-muted-foreground text-center">{message}</p>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center justify-center p-8", className)}>
      {type === 'tree' ? (
        <HITAMTreeLoading 
          size={size} 
          showText={!!message}
          progress={progress}
          onComplete={onComplete}
        />
      ) : (
        <LoadingSpinner size={size} />
      )}
      {message && type === 'spinner' && (
        <p className="mt-4 text-sm text-muted-foreground text-center">{message}</p>
      )}
    </div>
  );
};

export const PageLoadingState: React.FC<{ message?: string }> = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
    <HITAMTreeLoadingDetailed size="lg" showText={true} />
    {message && (
      <div className="absolute bottom-1/3 text-center">
        <p className="text-muted-foreground">{message}</p>
      </div>
    )}
  </div>
);

export const InlineLoadingState: React.FC<{ message?: string }> = ({ message }) => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <HITAMTreeLoading size="lg" className="mx-auto mb-4" showText={false} />
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  </div>
);