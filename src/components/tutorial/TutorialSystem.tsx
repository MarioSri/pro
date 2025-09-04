import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';
import {
  Play,
  X,
  ArrowLeft,
  ArrowRight,
  SkipForward,
  RotateCcw,
  CheckCircle,
  Lightbulb,
  Target,
  Eye,
  Zap
} from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'hover' | 'scroll' | 'none';
  optional?: boolean;
  mobileDescription?: string;
}

interface TutorialSystemProps {
  isOpen: boolean;
  onClose: () => void;
  autoStart?: boolean;
  userRole: string;
}

export const TutorialSystem: React.FC<TutorialSystemProps> = ({
  isOpen,
  onClose,
  autoStart = false,
  userRole
}) => {
  const { user } = useAuth();
  const { isMobile } = useResponsive();
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showWelcome, setShowWelcome] = useState(autoStart);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);

  const getTutorialSteps = (): TutorialStep[] => {
    const baseSteps: TutorialStep[] = [
      {
        id: 'dashboard',
        title: 'Dashboard Overview',
        description: 'Your personalized dashboard shows key statistics, recent documents, and quick actions based on your role.',
        targetSelector: '[data-tutorial="dashboard"]',
        position: 'center',
        action: 'none'
      },
      {
        id: 'search',
        title: 'Universal Search',
        description: 'Search across all documents, users, departments, and more with powerful filtering options.',
        targetSelector: '[data-tutorial="search"]',
        position: 'bottom',
        action: 'click',
        mobileDescription: 'Tap the search icon to access universal search functionality.'
      },
      {
        id: 'documents',
        title: 'Document Management',
        description: 'Submit new documents, track their status, and manage your submissions through the approval workflow.',
        targetSelector: '[data-tutorial="documents"]',
        position: 'bottom',
        action: 'none'
      },
      {
        id: 'track-documents',
        title: 'Track Documents',
        description: 'Monitor document status and manage LiveMeet+ requests for real-time clarification meetings.',
        targetSelector: '[data-tutorial="track-documents"]',
        position: 'bottom',
        action: 'none'
      },
      {
        id: 'calendar',
        title: 'Meeting Scheduler',
        description: 'Schedule meetings with Google Meet, Zoom, or Teams integration. Manage your calendar and meeting requests.',
        targetSelector: '[data-tutorial="calendar"]',
        position: 'bottom',
        action: 'none'
      },
      {
        id: 'messages',
        title: 'Communication Center',
        description: 'Access real-time chat, polls, digital signatures, and collaborative communication tools.',
        targetSelector: '[data-tutorial="messages"]',
        position: 'bottom',
        action: 'none'
      },
      {
        id: 'emergency',
        title: 'Emergency Management',
        description: 'Submit urgent documents that bypass normal approval workflows for immediate attention.',
        targetSelector: '[data-tutorial="emergency"]',
        position: 'bottom',
        action: 'none'
      }
    ];

    // Add role-specific steps
    if (user?.permissions.canApprove) {
      baseSteps.push({
        id: 'approvals',
        title: 'Approval Center',
        description: 'Review and approve pending documents with digital signatures and advanced approval workflows.',
        targetSelector: '[data-tutorial="approvals"]',
        position: 'bottom',
        action: 'none'
      });
    }

    if (user?.permissions.canManageWorkflows) {
      baseSteps.push({
        id: 'workflow',
        title: 'Workflow Management',
        description: 'Design and manage document approval workflows with visual builder and routing configuration.',
        targetSelector: '[data-tutorial="workflow"]',
        position: 'bottom',
        action: 'none'
      });
    }

    if (user?.permissions.canViewAnalytics) {
      baseSteps.push({
        id: 'analytics',
        title: 'Analytics Dashboard',
        description: 'View comprehensive insights into document workflows, approval rates, and system performance.',
        targetSelector: '[data-tutorial="analytics"]',
        position: 'bottom',
        action: 'none'
      });
    }

    return baseSteps;
  };

  const tutorialSteps = getTutorialSteps();

  useEffect(() => {
    if (isOpen && !showWelcome) {
      startTutorial();
    }
  }, [isOpen, showWelcome]);

  useEffect(() => {
    if (isActive && currentStep < tutorialSteps.length) {
      highlightElement(tutorialSteps[currentStep]);
    }
  }, [currentStep, isActive, tutorialSteps]);

  const startTutorial = () => {
    setIsActive(true);
    setCurrentStep(0);
    setShowWelcome(false);
    
    // Add tutorial data attributes to elements
    addTutorialAttributes();
    
    // Create overlay
    createOverlay();
  };

  const addTutorialAttributes = () => {
    // Add data attributes to navigation elements
    const dashboardLink = document.querySelector('a[href="/dashboard"]');
    if (dashboardLink) dashboardLink.setAttribute('data-tutorial', 'dashboard');

    const searchLink = document.querySelector('a[href="/search"]');
    if (searchLink) searchLink.setAttribute('data-tutorial', 'search');

    const documentsLink = document.querySelector('a[href="/documents"]');
    if (documentsLink) documentsLink.setAttribute('data-tutorial', 'documents');

    const trackDocumentsLink = document.querySelector('a[href="/track-documents"]');
    if (trackDocumentsLink) trackDocumentsLink.setAttribute('data-tutorial', 'track-documents');

    const calendarLink = document.querySelector('a[href="/calendar"]');
    if (calendarLink) calendarLink.setAttribute('data-tutorial', 'calendar');

    const messagesLink = document.querySelector('a[href="/messages"]');
    if (messagesLink) messagesLink.setAttribute('data-tutorial', 'messages');

    const emergencyLink = document.querySelector('a[href="/emergency"]');
    if (emergencyLink) emergencyLink.setAttribute('data-tutorial', 'emergency');

    const approvalsLink = document.querySelector('a[href="/approvals"]');
    if (approvalsLink) approvalsLink.setAttribute('data-tutorial', 'approvals');

    const workflowLink = document.querySelector('a[href="/workflow"]');
    if (workflowLink) workflowLink.setAttribute('data-tutorial', 'workflow');

    const analyticsLink = document.querySelector('a[href="/analytics"]');
    if (analyticsLink) analyticsLink.setAttribute('data-tutorial', 'analytics');
  };

  const createOverlay = () => {
    const overlay = document.createElement('div');
    overlay.id = 'tutorial-overlay';
    overlay.className = 'fixed inset-0 bg-black/60 z-40 transition-opacity duration-300';
    overlay.style.pointerEvents = 'none';
    document.body.appendChild(overlay);
  };

  const removeOverlay = () => {
    const overlay = document.getElementById('tutorial-overlay');
    if (overlay) {
      overlay.remove();
    }
  };

  const highlightElement = (step: TutorialStep) => {
    // Remove previous highlight
    if (highlightedElement) {
      highlightedElement.style.position = '';
      highlightedElement.style.zIndex = '';
      highlightedElement.style.boxShadow = '';
      highlightedElement.classList.remove('tutorial-highlight');
    }

    // Find and highlight new element
    const element = document.querySelector(step.targetSelector) as HTMLElement;
    if (element) {
      setHighlightedElement(element);
      
      // Add highlight styles
      element.style.position = 'relative';
      element.style.zIndex = '50';
      element.style.boxShadow = '0 0 0 4px rgba(34, 197, 94, 0.5), 0 0 20px rgba(34, 197, 94, 0.3)';
      element.classList.add('tutorial-highlight');
      
      // Calculate tooltip position
      const rect = element.getBoundingClientRect();
      const tooltipX = rect.left + rect.width / 2;
      const tooltipY = step.position === 'top' ? rect.top - 20 : rect.bottom + 20;
      
      setTooltipPosition({ x: tooltipX, y: tooltipY });
      
      // Scroll element into view
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'center'
      });
    }
  };

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTutorial = () => {
    completeTutorial();
  };

  const restartTutorial = () => {
    setCurrentStep(0);
    setShowWelcome(true);
    setIsActive(false);
  };

  const completeTutorial = () => {
    setIsActive(false);
    removeOverlay();
    
    if (highlightedElement) {
      highlightedElement.style.position = '';
      highlightedElement.style.zIndex = '';
      highlightedElement.style.boxShadow = '';
      highlightedElement.classList.remove('tutorial-highlight');
    }
    
    // Mark tutorial as completed
    localStorage.setItem('iaoms-tutorial-completed', 'true');
    
    onClose();
  };

  const currentStepData = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  // Welcome Modal
  if (showWelcome) {
    return (
      <Dialog open={showWelcome} onOpenChange={() => setShowWelcome(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-primary">
              Welcome to IAOMS! 🎉
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-primary-foreground" />
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Institutional Activity Oversight and Management System - Your digital workspace for seamless document management and collaboration.
              </p>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                What you'll learn:
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Navigate the main dashboard and features</li>
                <li>• Submit and track documents efficiently</li>
                <li>• Use communication and collaboration tools</li>
                <li>• Access role-specific features and workflows</li>
              </ul>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => setShowWelcome(false)}
                variant="outline"
                className="flex-1"
              >
                No thanks, I'll explore myself
              </Button>
              <Button
                onClick={startTutorial}
                variant="gradient"
                className="flex-1"
              >
                <Play className="w-4 h-4 mr-2" />
                Take a Quick Tour
              </Button>
            </div>
            
            <p className="text-xs text-center text-muted-foreground">
              You can access this tutorial anytime from your profile menu
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Tutorial Tooltip
  if (isActive && currentStepData) {
    return (
      <>
        {/* Tutorial Tooltip */}
        <div
          className={cn(
            "fixed z-50 bg-white border border-primary shadow-xl rounded-lg p-4 max-w-sm",
            isMobile ? "left-4 right-4 bottom-4" : "transform -translate-x-1/2"
          )}
          style={isMobile ? {} : {
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`
          }}
        >
          {/* Progress Header */}
          <div className="flex items-center justify-between mb-3">
            <Badge variant="outline" className="text-xs">
              Step {currentStep + 1} of {tutorialSteps.length}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={skipTutorial}
              className="h-6 w-6"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <Progress value={progress} className="h-2 mb-4" />

          {/* Content */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-primary flex items-center gap-2">
              <Zap className="w-5 h-5" />
              {currentStepData.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isMobile && currentStepData.mobileDescription 
                ? currentStepData.mobileDescription 
                : currentStepData.description}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={prevStep}
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
                onClick={skipTutorial}
                className="text-muted-foreground"
              >
                <SkipForward className="w-4 h-4 mr-1" />
                Skip Tour
              </Button>
              
              <Button
                size="sm"
                onClick={nextStep}
                variant="gradient"
                className="flex items-center gap-2"
              >
                {currentStep === tutorialSteps.length - 1 ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Complete
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
        </div>

        {/* Mobile Tutorial Controls */}
        {isMobile && (
          <div className="fixed top-4 left-4 right-4 z-50 bg-white/95 backdrop-blur-sm border border-primary rounded-lg p-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Interactive Tour</span>
                <Badge variant="outline" className="text-xs">
                  {currentStep + 1}/{tutorialSteps.length}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={skipTutorial}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <Progress value={progress} className="h-1 mt-2" />
          </div>
        )}
      </>
    );
  }

  return null;
};

// Tutorial Manager Component
interface TutorialManagerProps {
  className?: string;
}

export const TutorialManager: React.FC<TutorialManagerProps> = ({ className }) => {
  const { user } = useAuth();
  const [showTutorial, setShowTutorial] = useState(false);
  const [hasCompletedTutorial, setHasCompletedTutorial] = useState(false);

  useEffect(() => {
    // Check if user has completed tutorial
    const completed = localStorage.getItem('iaoms-tutorial-completed');
    setHasCompletedTutorial(!!completed);
    
    // Auto-start tutorial for new users
    if (!completed && user) {
      setTimeout(() => {
        setShowTutorial(true);
      }, 2000); // Delay to allow page to load
    }
  }, [user]);

  const startTutorial = () => {
    setShowTutorial(true);
  };

  const resetTutorial = () => {
    localStorage.removeItem('iaoms-tutorial-completed');
    setHasCompletedTutorial(false);
    setShowTutorial(true);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            Interactive Tutorials
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div>
              <h4 className="font-medium">IAOMS Quick Tour</h4>
              <p className="text-sm text-muted-foreground">
                Learn the essential features and navigation
              </p>
              {hasCompletedTutorial && (
                <Badge variant="success" className="mt-2">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={startTutorial}
                variant="default"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Tour
              </Button>
              {hasCompletedTutorial && (
                <Button
                  onClick={resetTutorial}
                  variant="outline"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restart
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Role-Specific Features</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Learn about features available to your {user?.role} role
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <Target className="w-4 h-4 mr-2" />
                Role Guide
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Advanced Features</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Explore advanced workflows and integrations
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <Zap className="w-4 h-4 mr-2" />
                Advanced Guide
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Pro Tip</h4>
                <p className="text-sm text-blue-700 mt-1">
                  You can access tutorials anytime from your profile menu. Each tutorial is tailored to your specific role and permissions.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tutorial System */}
      <TutorialSystem
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        autoStart={!hasCompletedTutorial}
        userRole={user?.role || 'employee'}
      />
    </div>
  );
};

// Hook for tutorial integration
export const useTutorial = () => {
  const [showTutorial, setShowTutorial] = useState(false);

  const startTutorial = () => {
    setShowTutorial(true);
  };

  const closeTutorial = () => {
    setShowTutorial(false);
  };

  return {
    showTutorial,
    startTutorial,
    closeTutorial
  };
};