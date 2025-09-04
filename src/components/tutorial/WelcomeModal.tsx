import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import {
  Play,
  Lightbulb,
  Target,
  Crown,
  Shield,
  Users,
  Briefcase,
  CheckCircle,
  Clock,
  FileText,
  Calendar
} from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTutorial: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  onStartTutorial
}) => {
  const { user } = useAuth();

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'principal': return Crown;
      case 'registrar': return Shield;
      case 'program-head': return Users;
      case 'hod': return Users;
      default: return Briefcase;
    }
  };

  const getRoleFeatures = () => {
    const baseFeatures = [
      'Document submission and tracking',
      'Real-time communication tools',
      'Meeting scheduler integration',
      'Personal productivity features'
    ];

    const roleFeatures = {
      principal: [
        ...baseFeatures,
        'Institution-wide analytics',
        'User and role management',
        'Emergency response system',
        'Mass document distribution'
      ],
      registrar: [
        ...baseFeatures,
        'Academic administration',
        'Cross-department workflows',
        'Approval management',
        'System analytics'
      ],
      'program-head': [
        ...baseFeatures,
        'Program-specific workflows',
        'Student management tools',
        'Department coordination',
        'Academic planning'
      ],
      hod: [
        ...baseFeatures,
        'Department management',
        'Faculty coordination',
        'Budget and resource planning',
        'Performance analytics'
      ],
      employee: [
        ...baseFeatures,
        'Personal task management',
        'Workflow participation',
        'Document collaboration',
        'Status tracking'
      ]
    };

    return roleFeatures[user?.role as keyof typeof roleFeatures] || baseFeatures;
  };

  const RoleIcon = getRoleIcon();
  const features = getRoleFeatures();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-bold text-primary mb-2">
            Welcome to IAOMS! 🎉
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Hero Section */}
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
              <RoleIcon className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Welcome, {user?.name}!
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              <strong>Institutional Activity Oversight and Management System</strong> - Your comprehensive digital workspace for seamless document management, collaboration, and institutional workflows.
            </p>
          </div>

          {/* Role-Specific Features */}
          <div className="bg-gradient-subtle p-6 rounded-lg border">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Features Available to {user?.role?.charAt(0).toUpperCase()}{user?.role?.slice(1)}s:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tutorial Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium text-blue-900">5 Minutes</h4>
              <p className="text-sm text-blue-700">Quick interactive tour</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium text-green-900">8 Key Features</h4>
              <p className="text-sm text-green-700">Essential functionality</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium text-purple-900">Always Available</h4>
              <p className="text-sm text-purple-700">Access anytime</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              No thanks, I'll explore myself
            </Button>
            <Button
              onClick={onStartTutorial}
              variant="gradient"
              className="flex-1"
            >
              <Play className="w-4 h-4 mr-2" />
              Take a Quick Tour
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              💡 You can access tutorials anytime from your profile menu → Tutorials
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};