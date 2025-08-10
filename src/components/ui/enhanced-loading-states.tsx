import React, { useState, useEffect } from 'react';
import { HITAMTreeLoading, HITAMTreeLoadingDetailed, HITAMTreeLoadingSimple } from './hitam-tree-loading';
import { cn } from "@/lib/utils";

interface AuthenticationLoadingProps {
  userRole: string;
  onComplete: () => void;
  className?: string;
}

// Authentication-specific loading component
export const AuthenticationLoading: React.FC<AuthenticationLoadingProps> = ({
  userRole,
  onComplete,
  className
}) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'connecting' | 'verifying' | 'loading' | 'complete'>('connecting');

  useEffect(() => {
    const phases = [
      { name: 'connecting', duration: 800, message: 'Connecting to HITAM servers...' },
      { name: 'verifying', duration: 1200, message: 'Verifying credentials...' },
      { name: 'loading', duration: 1000, message: 'Loading your workspace...' },
      { name: 'complete', duration: 500, message: 'Welcome!' }
    ];

    let currentPhaseIndex = 0;
    let phaseStartTime = Date.now();
    
    const interval = setInterval(() => {
      const currentPhase = phases[currentPhaseIndex];
      const phaseElapsed = Date.now() - phaseStartTime;
      const phaseProgress = Math.min((phaseElapsed / currentPhase.duration) * 100, 100);
      
      // Calculate overall progress
      const previousPhasesProgress = currentPhaseIndex * 25; // Each phase is 25%
      const currentPhaseContribution = (phaseProgress / 100) * 25;
      const totalProgress = previousPhasesProgress + currentPhaseContribution;
      
      setProgress(totalProgress);
      setPhase(currentPhase.name as any);
      
      if (phaseProgress >= 100) {
        if (currentPhaseIndex < phases.length - 1) {
          currentPhaseIndex++;
          phaseStartTime = Date.now();
        } else {
          clearInterval(interval);
          setTimeout(onComplete, 500);
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  const getPhaseMessage = () => {
    switch (phase) {
      case 'connecting': return 'Connecting to HITAM servers...';
      case 'verifying': return `Verifying ${userRole} credentials...`;
      case 'loading': return 'Loading your workspace...';
      case 'complete': return 'Welcome to IAOMS!';
      default: return 'Loading...';
    }
  };

  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-gradient-subtle", className)}>
      <div className="text-center space-y-8">
        <HITAMTreeLoadingDetailed
          size="xl"
          showText={false}
          progress={progress}
        />
        
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">HITAM</h2>
          <div className="space-y-2">
            <p className="text-lg font-medium text-foreground">
              {getPhaseMessage()}
            </p>
            <div className="w-64 mx-auto">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
          
          {/* Phase indicators */}
          <div className="flex justify-center space-x-4 mt-6">
            {['connecting', 'verifying', 'loading', 'complete'].map((phaseName, index) => (
              <div
                key={phaseName}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  progress >= (index + 1) * 25 
                    ? "bg-green-500 scale-110" 
                    : progress >= index * 25 
                      ? "bg-green-300 animate-pulse" 
                      : "bg-gray-300"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading state for page transitions
export const PageTransitionLoading: React.FC<{ message?: string }> = ({ message }) => (
  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="text-center">
      <HITAMTreeLoading size="lg" showText={false} />
      {message && (
        <p className="mt-4 text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  </div>
);

// Inline loading for components
export const InlineTreeLoading: React.FC<{ 
  message?: string; 
  size?: 'sm' | 'md' | 'lg';
}> = ({ message, size = 'md' }) => (
  <div className="flex flex-col items-center justify-center py-8">
    <HITAMTreeLoadingSimple size={size} />
    {message && (
      <p className="mt-4 text-sm text-muted-foreground text-center">{message}</p>
    )}
  </div>
);

// Button loading state
export const ButtonLoading: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'sm' }) => (
  <HITAMTreeLoadingSimple size={size} className="mr-2" />
);