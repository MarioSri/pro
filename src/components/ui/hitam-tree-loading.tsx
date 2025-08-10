import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

// Shared size and text configurations for all components
const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24', 
  lg: 'w-32 h-32',
  xl: 'w-40 h-40'
};

const textSizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl'
};

// Shared size and text configurations for all components
const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24', 
  lg: 'w-32 h-32',
  xl: 'w-40 h-40'
};

const textSizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl'
};

interface HITAMTreeLoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  progress?: number; // 0-100, if provided will use controlled progress
  onComplete?: () => void;
  duration?: number; // Animation duration in milliseconds
}

export const HITAMTreeLoading: React.FC<HITAMTreeLoadingProps> = ({ 
  size = 'md', 
  className,
  showText = true,
  progress: controlledProgress,
  onComplete,
  duration = 3000
}) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

      const newProgress = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        setIsComplete(true);
        clearInterval(interval);
        setTimeout(() => onComplete?.(), 500);
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [controlledProgress, duration, onComplete, isComplete]);

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Definitions for gradients and masks */}
          <defs>
            {/* Filling gradient that moves from bottom to top */}
            <linearGradient id="fillGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset={`${Math.max(0, progress - 10)}%`} stopColor="#ffffff" />
              <stop offset={`${progress}%`} stopColor="#22c55e" />
              <stop offset={`${Math.min(100, progress + 10)}%`} stopColor="#16a34a" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>
            
            {/* Glow effect gradient */}
            <radialGradient id="glowGradient" cx="50%" cy="90%" r="60%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#22c55e" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
            </radialGradient>
            
            {/* Tree mask based on the HITAM logo */}
            <mask id="treeMask">
              <rect width="400" height="400" fill="black"/>
              
              {/* Main trunk */}
              <path
                d="M200 350 L200 280"
                stroke="white"
                strokeWidth="12"
                strokeLinecap="round"
              />
              
              {/* Root system */}
              <path
                d="M200 350 Q180 360 160 350 M200 350 Q220 360 240 350 M200 350 Q190 370 170 365 M200 350 Q210 370 230 365"
                stroke="white"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
              />
              
              {/* Main branches - creating the tree structure from the logo */}
              <path
                d="M200 280 Q180 260 160 240 Q140 220 120 200 Q100 180 90 160 Q85 140 95 120 Q110 100 130 90 Q150 85 170 90 Q190 95 200 110"
                stroke="white"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
              />
              
              <path
                d="M200 280 Q220 260 240 240 Q260 220 280 200 Q300 180 310 160 Q315 140 305 120 Q290 100 270 90 Q250 85 230 90 Q210 95 200 110"
                stroke="white"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
              />
              
              {/* Secondary branches */}
              <path
                d="M200 280 Q170 250 140 230 Q120 210 110 190 Q105 170 115 150 Q125 130 145 125 Q165 125 180 135"
                stroke="white"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
              />
              
              <path
                d="M200 280 Q230 250 260 230 Q280 210 290 190 Q295 170 285 150 Q275 130 255 125 Q235 125 220 135"
                stroke="white"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
              />
              
              {/* Leaf clusters - organic circular shapes */}
              <circle cx="130" cy="120" r="25" fill="white" />
              <circle cx="270" cy="120" r="25" fill="white" />
              <circle cx="200" cy="100" r="30" fill="white" />
              <circle cx="160" cy="140" r="20" fill="white" />
              <circle cx="240" cy="140" r="20" fill="white" />
              <circle cx="110" cy="160" r="18" fill="white" />
              <circle cx="290" cy="160" r="18" fill="white" />
              <circle cx="200" cy="80" r="25" fill="white" />
              <circle cx="175" cy="65" r="15" fill="white" />
              <circle cx="225" cy="65" r="15" fill="white" />
              
              {/* Additional foliage details */}
              <ellipse cx="150" cy="110" rx="15" ry="20" fill="white" />
              <ellipse cx="250" cy="110" rx="15" ry="20" fill="white" />
              <ellipse cx="200" cy="55" rx="20" ry="15" fill="white" />
              
              {/* Small branch details */}
              <path
                d="M130 120 Q120 110 115 100 M270 120 Q280 110 285 100 M200 100 Q190 90 185 80 M200 100 Q210 90 215 80"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            </mask>
            
            {/* Ripple effect */}
            <filter id="ripple">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/> 
              </feMerge>
            </filter>
          </defs>
          
          {/* Background glow effect */}
          <circle
            cx="200"
            cy="350"
            r="80"
            fill="url(#glowGradient)"
            opacity={progress / 100}
            className="animate-pulse"
          />
          
          {/* Ripple effects at the base */}
          {[1, 2, 3].map((i) => (
            <circle
              key={i}
              cx="200"
              cy="350"
              r={30 + i * 15}
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              opacity={0}
              filter="url(#ripple)"
            >
              <animate
                attributeName="r"
                values={`${30 + i * 15};${50 + i * 20};${30 + i * 15}`}
                dur={`${2 + i * 0.5}s`}
                repeatCount="indefinite"
                begin={`${i * 0.3}s`}
              />
              <animate
                attributeName="opacity"
                values="0;0.6;0"
                dur={`${2 + i * 0.5}s`}
                repeatCount="indefinite"
                begin={`${i * 0.3}s`}
              />
            </circle>
          ))}
          
          {/* Main tree shape with filling animation */}
          <rect
            width="400"
            height="400"
            fill="url(#fillGradient)"
            mask="url(#treeMask)"
          />
          
          {/* Tree outline for definition */}
          <g mask="url(#treeMask)" opacity="0.3">
            <rect
              width="400"
              height="400"
              fill="none"
              stroke="#16a34a"
              strokeWidth="2"
            />
          </g>
          
          {/* Sparkle effects that appear as the tree fills */}
          {progress > 20 && (
            <g opacity={Math.min(1, (progress - 20) / 30)}>
              {[
                { x: 130, y: 120, delay: 0 },
                { x: 270, y: 120, delay: 0.2 },
                { x: 200, y: 100, delay: 0.4 },
                { x: 200, y: 80, delay: 0.6 }
              ].map((sparkle, i) => (
                <g key={i}>
                  <circle
                    cx={sparkle.x}
                    cy={sparkle.y}
                    r="3"
                    fill="#ffffff"
                    opacity="0"
                  >
                    <animate
                      attributeName="opacity"
                      values="0;1;0"
                      dur="1.5s"
                      begin={`${sparkle.delay}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                  <path
                    d={`M${sparkle.x-6},${sparkle.y} L${sparkle.x+6},${sparkle.y} M${sparkle.x},${sparkle.y-6} L${sparkle.x},${sparkle.y+6}`}
                    stroke="#ffffff"
                    strokeWidth="2"
                    opacity="0"
                  >
                    <animate
                      attributeName="opacity"
                      values="0;0.8;0"
                      dur="1.5s"
                      begin={`${sparkle.delay}s`}
                      repeatCount="indefinite"
                    />
                  </path>
                </g>
              ))}
            </g>
          )}
          
          {/* Completion glow */}
          {progress >= 100 && (
            <circle
              cx="200"
              cy="200"
              r="150"
              fill="none"
              stroke="#22c55e"
              strokeWidth="4"
              opacity="0"
            >
              <animate
                attributeName="opacity"
                values="0;0.8;0"
                dur="1s"
                begin="0s"
              />
              <animate
                attributeName="r"
                values="150;180;150"
                dur="1s"
                begin="0s"
              />
            </circle>
          )}
        </svg>
        
        {/* Progress indicator */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-center mt-1 text-muted-foreground">
            {Math.round(progress)}%
          </p>
        </div>
      </div>
      
      {showText && (
        <div className={cn("mt-12 text-center animate-fade-in", textSizes[size])}>
          <h2 className="font-bold text-primary mb-1">HITAM</h2>
          <p className="text-sm text-muted-foreground">
            {progress < 30 ? 'Initializing...' :
             progress < 60 ? 'Loading workspace...' :
             progress < 90 ? 'Preparing dashboard...' :
             progress < 100 ? 'Almost ready...' :
             'Welcome!'}
          </p>
        </div>
      )}
    </div>
  );
};

// Enhanced version with more detailed animation states
export const HITAMTreeLoadingDetailed: React.FC<HITAMTreeLoadingProps> = ({ 
  size = 'md', 
  className,
  showText = true,
  progress: controlledProgress,
  onComplete,
  duration = 3000
}) => {
  const [progress, setProgress] = useState(0);
  const [animationPhase, setAnimationPhase] = useState<'roots' | 'trunk' | 'branches' | 'leaves' | 'complete'>('roots');

  useEffect(() => {
    if (controlledProgress !== undefined) {
      setProgress(controlledProgress);
      
      // Update animation phase based on progress
      if (controlledProgress < 20) setAnimationPhase('roots');
      else if (controlledProgress < 40) setAnimationPhase('trunk');
      else if (controlledProgress < 70) setAnimationPhase('branches');
      else if (controlledProgress < 100) setAnimationPhase('leaves');
      else setAnimationPhase('complete');
      
      if (controlledProgress >= 100) {
        setTimeout(() => onComplete?.(), 500);
      }
      return;
    }

    // Auto-progress with phases
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(newProgress);
      
      // Update animation phase
      if (newProgress < 20) setAnimationPhase('roots');
      else if (newProgress < 40) setAnimationPhase('trunk');
      else if (newProgress < 70) setAnimationPhase('branches');
      else if (newProgress < 100) setAnimationPhase('leaves');
      else setAnimationPhase('complete');
      
      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => onComplete?.(), 500);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [controlledProgress, duration, onComplete]);

  const getPhaseMessage = () => {
    switch (animationPhase) {
      case 'roots': return 'Establishing connection...';
      case 'trunk': return 'Building foundation...';
      case 'branches': return 'Expanding network...';
      case 'leaves': return 'Finalizing setup...';
      case 'complete': return 'Ready to go!';
      default: return 'Loading...';
    }
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Dynamic filling gradient */}
            <linearGradient id="dynamicFill" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#ffffff">
                <animate
                  attributeName="stop-color"
                  values="#ffffff;#f0fdf4;#22c55e"
                  dur={`${duration}ms`}
                  begin="0s"
                  fill="freeze"
                />
              </stop>
              <stop offset={`${progress}%`} stopColor="#22c55e">
                <animate
                  attributeName="stop-color"
                  values="#ffffff;#dcfce7;#16a34a;#15803d"
                  dur={`${duration}ms`}
                  begin="0s"
                  fill="freeze"
                />
              </stop>
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>
            
            {/* Pulsing glow at base */}
            <radialGradient id="basePulse" cx="50%" cy="90%" r="40%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
            </radialGradient>
            
            {/* Tree silhouette mask */}
            <mask id="hitamTreeMask">
              <rect width="400" height="400" fill="black"/>
              
              {/* Recreating the HITAM tree logo structure */}
              
              {/* Central trunk */}
              <rect x="195" y="280" width="10" height="70" fill="white" rx="5" />
              
              {/* Root system */}
              <path
                d="M200 350 
                   Q185 360 170 355 Q155 350 145 345
                   M200 350 
                   Q215 360 230 355 Q245 350 255 345
                   M200 350
                   Q190 365 175 370 Q160 375 150 370
                   M200 350
                   Q210 365 225 370 Q240 375 250 370"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
              
              {/* Main canopy - organic tree shape */}
              <ellipse cx="200" cy="180" rx="80" ry="60" fill="white" />
              <ellipse cx="160" cy="160" rx="40" ry="35" fill="white" />
              <ellipse cx="240" cy="160" rx="40" ry="35" fill="white" />
              <ellipse cx="200" cy="120" rx="50" ry="40" fill="white" />
              <ellipse cx="180" cy="100" rx="25" ry="30" fill="white" />
              <ellipse cx="220" cy="100" rx="25" ry="30" fill="white" />
              
              {/* Branch structure */}
              <path
                d="M200 280 Q180 250 160 220 Q140 190 130 160 Q125 140 135 120 Q145 100 165 90 Q185 85 200 95"
                stroke="white"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
              />
              
              <path
                d="M200 280 Q220 250 240 220 Q260 190 270 160 Q275 140 265 120 Q255 100 235 90 Q215 85 200 95"
                stroke="white"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
              />
              
              {/* Smaller branches */}
              <path
                d="M200 280 Q170 240 150 200 Q135 170 140 140 Q145 120 160 110 Q175 105 185 115"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
              
              <path
                d="M200 280 Q230 240 250 200 Q265 170 260 140 Q255 120 240 110 Q225 105 215 115"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
              
              {/* Top branches */}
              <path
                d="M200 95 Q180 80 165 70 Q150 60 145 50 M200 95 Q220 80 235 70 Q250 60 255 50"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            </mask>
          </defs>
          
          {/* Animated base glow */}
          <circle
            cx="200"
            cy="350"
            r="60"
            fill="url(#basePulse)"
            opacity={Math.min(1, progress / 50)}
          >
            <animate
              attributeName="r"
              values="60;80;60"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Main tree with filling effect */}
          <rect
            width="400"
            height="400"
            fill="url(#dynamicFill)"
            mask="url(#hitamTreeMask)"
          />
          
          {/* Animated filling effect overlay */}
          <rect
            width="400"
            height={400 - (progress / 100) * 400}
            y={(progress / 100) * 400}
            fill="#22c55e"
            mask="url(#hitamTreeMask)"
            opacity="0.8"
          />
          
          {/* Energy particles rising through the tree */}
          {progress > 10 && (
            <g opacity={Math.min(1, (progress - 10) / 40)}>
              {[1, 2, 3, 4, 5].map((i) => (
                <circle
                  key={i}
                  cx={195 + Math.sin(i) * 10}
                  cy="350"
                  r="2"
                  fill="#ffffff"
                  opacity="0"
                >
                  <animate
                    attributeName="cy"
                    values="350;50"
                    dur={`${3 + i * 0.2}s`}
                    begin={`${i * 0.3}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    dur={`${3 + i * 0.2}s`}
                    begin={`${i * 0.3}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="r"
                    values="2;4;2;1"
                    dur={`${3 + i * 0.2}s`}
                    begin={`${i * 0.3}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              ))}
            </g>
          )}
          
          {/* Completion burst effect */}
          {progress >= 100 && (
            <g>
              <circle
                cx="200"
                cy="200"
                r="0"
                fill="none"
                stroke="#22c55e"
                strokeWidth="3"
                opacity="1"
              >
                <animate
                  attributeName="r"
                  values="0;120;150"
                  dur="0.8s"
                  begin="0s"
                  fill="freeze"
                />
                <animate
                  attributeName="opacity"
                  values="1;0.3;0"
                  dur="0.8s"
                  begin="0s"
                  fill="freeze"
                />
              </circle>
            </g>
          )}
        </svg>
      </div>
      
      {showText && (
        <div className={cn("mt-8 text-center", textSizes[size])}>
          <h2 className="font-bold text-primary mb-2">HITAM</h2>
          <p className="text-sm text-muted-foreground animate-pulse">
            {getPhaseMessage()}
          </p>
          {progress >= 100 && (
            <p className="text-xs text-success mt-1 animate-fade-in">
              ✓ Authentication successful
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// Simple version for quick loading states
export const HITAMTreeLoadingSimple: React.FC<HITAMTreeLoadingProps> = ({ 
  size = 'md', 
  className 
}) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full animate-spin"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#22c55e"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="60 40"
          />
          <circle
            cx="50"
            cy="50"
            r="25"
            fill="#22c55e"
            opacity="0.3"
          />
          <path
            d="M50 30 Q45 25 40 30 Q35 35 40 40 Q45 45 50 40 Q55 35 60 40 Q65 35 60 30 Q55 25 50 30"
            fill="#ffffff"
          />
        </svg>
      </div>
    </div>
  );
};