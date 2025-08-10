import React from 'react';
import { cn } from "@/lib/utils";
import { HITAMTreeLoading as NewHITAMTreeLoading } from './hitam-tree-loading';

interface LoadingAnimationProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
  progress?: number;
  onComplete?: () => void;
}

// Legacy component - now uses the new enhanced version
export const HITAMTreeLoading: React.FC<LoadingAnimationProps> = ({ 
  size = 'md', 
  className,
  showText = true,
  progress,
  onComplete
}) => {
  return (
    <NewHITAMTreeLoading
      size={size}
      className={className}
      showText={showText}
      progress={progress}
      onComplete={onComplete}
    />
  );
};

export const LoadingSpinner: React.FC<LoadingAnimationProps> = ({ 
  size = 'md', 
  className,
  progress
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  if (progress !== undefined) {
    // Progress-based spinner
    const circumference = 2 * Math.PI * 16; // radius = 16
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    
    return (
      <div className={cn("relative", sizeClasses[size], className)}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="3"
          />
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="#22c55e"
            strokeWidth="3"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-300 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-primary">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("animate-spin rounded-full border-2 border-primary border-t-transparent", sizeClasses[size], className)} />
  );
};