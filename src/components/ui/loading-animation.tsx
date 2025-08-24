import React from 'react';
import { cn } from "@/lib/utils";

interface LoadingAnimationProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

export const HITAMTreeLoading: React.FC<LoadingAnimationProps> = ({ 
  size = 'md', 
  className,
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32', 
    lg: 'w-48 h-48'
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      {/* HITAM Tree Container with filling animation */}
      <div className={cn("relative overflow-hidden rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg", sizeClasses[size])}>
        {/* Base HITAM Tree Image */}
        <img 
          src="/hitam-tree-logo.png" 
          alt="HITAM Tree Logo"
          className="w-full h-full object-contain opacity-30 grayscale"
        />
        
        {/* Colored Tree Overlay with Rising Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="/hitam-tree-logo.png" 
            alt="HITAM Tree Logo"
            className="w-full h-full object-contain hitam-tree-rising"
          />
        </div>
        
        {/* Ripple Effect at the Base */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent rounded-full opacity-0 hitam-ripple">
        </div>
        
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-green-200/20 via-emerald-300/10 to-transparent opacity-0 rounded-lg hitam-glow">
        </div>
        
        {/* Sparkle Particles */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute w-1 h-1 bg-green-400 rounded-full opacity-0 hitam-sparkle",
                `hitam-sparkle-${i}`
              )}
            />
          ))}
        </div>
      </div>
      
      {showText && (
        <div className="mt-6 text-center space-y-2 hitam-text-fadeup">
          <p className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            HITAM
          </p>
          <p className="text-sm text-muted-foreground font-medium">
            Loading your workspace...
          </p>
          <div className="flex justify-center space-x-1 mt-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={cn("w-2 h-2 bg-green-500 rounded-full hitam-dot-pulse", `hitam-dot-${i}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const LoadingSpinner: React.FC<LoadingAnimationProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={cn("animate-spin rounded-full border-2 border-primary border-t-transparent", sizeClasses[size], className)} />
  );
};