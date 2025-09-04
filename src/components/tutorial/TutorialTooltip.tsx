import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  ArrowRight,
  X,
  SkipForward,
  CheckCircle,
  Zap,
  Target
} from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  mobileDescription?: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface TutorialTooltipProps {
  step: TutorialStep;
  currentStep: number;
  totalSteps: number;
  position: { x: number; y: number };
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onClose: () => void;
  className?: string;
}

export const TutorialTooltip: React.FC<TutorialTooltipProps> = ({
  step,
  currentStep,
  totalSteps,
  position,
  onNext,
  onPrev,
  onSkip,
  onClose,
  className
}) => {
  const { isMobile } = useResponsive();
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div
      className={cn(
        "fixed z-50 bg-white border-2 border-primary shadow-2xl rounded-xl p-6 max-w-sm animate-scale-in",
        isMobile ? "left-4 right-4 bottom-4" : "transform -translate-x-1/2",
        className
      )}
      style={isMobile ? {} : {
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <Badge variant="outline" className="text-xs font-medium">
            Step {currentStep + 1} of {totalSteps}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground mt-1 text-center">
          {Math.round(progress)}% Complete
        </p>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-primary flex items-center gap-2">
            <Zap className="w-5 h-5" />
            {step.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {isMobile && step.mobileDescription 
              ? step.mobileDescription 
              : step.description}
          </p>
        </div>

        {/* Feature Highlight */}
        <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 text-primary text-sm font-medium">
            <Target className="w-4 h-4" />
            Key Feature Spotlight
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrev}
          disabled={currentStep === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            className="text-muted-foreground hover:text-foreground"
          >
            <SkipForward className="w-4 h-4 mr-1" />
            Skip Tour
          </Button>
          
          <Button
            size="sm"
            onClick={onNext}
            variant="gradient"
            className="flex items-center gap-2 shadow-elegant"
          >
            {isLastStep ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Complete Tour
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Progress Indicator */}
      {isMobile && (
        <div className="flex justify-center mt-4">
          <div className="flex gap-1">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  i <= currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};