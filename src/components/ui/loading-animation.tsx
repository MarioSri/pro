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
    lg: 'w-40 h-40'
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Tree Silhouette */}
          <defs>
            <linearGradient id="treeGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0">
                <animate
                  attributeName="stop-opacity"
                  values="0;1;1"
                  dur="2.5s"
                  begin="0s"
                  fill="freeze"
                />
              </stop>
              <stop offset="30%" stopColor="#7CB342" stopOpacity="0">
                <animate
                  attributeName="stop-opacity"
                  values="0;0;1;1"
                  dur="2.5s"
                  begin="0.5s"
                  fill="freeze"
                />
              </stop>
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0">
                <animate
                  attributeName="stop-opacity"
                  values="0;0;0;1"
                  dur="2.5s"
                  begin="1s"
                  fill="freeze"
                />
              </stop>
            </linearGradient>
            
            <mask id="treeMask">
              <rect width="200" height="200" fill="black"/>
              {/* HITAM Tree Path - Based on the logo design */}
              <path
                d="M100 180 L100 140 M80 140 Q100 120 120 140 M70 120 Q100 100 130 120 M60 100 Q100 80 140 100 M50 80 Q100 60 150 80 M40 60 Q100 40 160 60 M30 40 Q100 20 170 40"
                stroke="white"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Tree branches and leaves pattern */}
              <circle cx="100" cy="70" r="45" fill="white" opacity="0.8"/>
              <circle cx="85" cy="85" r="25" fill="white"/>
              <circle cx="115" cy="85" r="25" fill="white"/>
              <circle cx="100" cy="55" r="30" fill="white"/>
              <circle cx="75" cy="65" r="20" fill="white"/>
              <circle cx="125" cy="65" r="20" fill="white"/>
            </mask>
          </defs>
          
          {/* Tree Shape */}
          <rect
            width="200"
            height="200"
            fill="url(#treeGradient)"
            mask="url(#treeMask)"
            className="animate-fade-in"
          />
          
          {/* Subtle glow effect */}
          <circle
            cx="100"
            cy="70"
            r="60"
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
            opacity="0"
            className="animate-pulse"
          >
            <animate
              attributeName="opacity"
              values="0;0.3;0"
              dur="3s"
              begin="2s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>
      
      {showText && (
        <div className="mt-4 text-center animate-fade-in">
          <p className="text-lg font-semibold text-primary">HITAM</p>
          <p className="text-sm text-muted-foreground">Loading your workspace...</p>
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