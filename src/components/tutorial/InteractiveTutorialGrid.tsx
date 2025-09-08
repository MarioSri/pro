import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Search,
  Eye,
  Calendar,
  MessageSquare,
  FileText,
  PenTool,
  AlertTriangle,
  CheckSquare,
  GitBranch,
  ArrowRightLeft,
  BarChart3,
  Play,
  ArrowRight,
  Target,
  Zap
} from 'lucide-react';

interface TutorialCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  path: string;
  color: string;
  bgColor: string;
  category: 'core' | 'management' | 'tools';
  permissions?: string[];
  estimatedTime: string;
  features: string[];
}

interface InteractiveTutorialGridProps {
  className?: string;
}

export const InteractiveTutorialGrid: React.FC<InteractiveTutorialGridProps> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { isMobile } = useResponsive();

  const tutorialCards: TutorialCard[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Your personalized control center with role-specific widgets and real-time statistics',
      icon: LayoutDashboard,
      path: '/dashboard',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      category: 'core',
      estimatedTime: '2 min',
      features: ['Role-based widgets', 'Real-time stats', 'Quick actions', 'Customizable layout']
    },
    {
      id: 'search',
      title: 'Universal Search',
      description: 'Search across all documents, users, departments with advanced filtering capabilities',
      icon: Search,
      path: '/search',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      category: 'core',
      estimatedTime: '3 min',
      features: ['Cross-platform search', 'Advanced filters', 'Real-time results', 'Recent searches']
    },
    {
      id: 'track-documents',
      title: 'Track Documents',
      description: 'Monitor document status and manage LiveMeet+ requests for real-time clarification',
      icon: Eye,
      path: '/track-documents',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      category: 'core',
      estimatedTime: '4 min',
      features: ['Status tracking', 'LiveMeet+ requests', 'Workflow monitoring', 'Real-time updates']
    },
    {
      id: 'calendar',
      title: 'Meeting Scheduler',
      description: 'Schedule meetings with Google Meet, Zoom, Teams integration and conflict detection',
      icon: Calendar,
      path: '/calendar',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      category: 'core',
      estimatedTime: '5 min',
      features: ['Multi-platform integration', 'Conflict detection', 'Auto-invitations', 'AI scheduling']
    },
    {
      id: 'messages',
      title: 'Communication Center',
      description: 'Real-time chat, polls, digital signatures, and collaborative communication tools',
      icon: MessageSquare,
      path: '/messages',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      category: 'core',
      estimatedTime: '4 min',
      features: ['Real-time chat', 'Digital signatures', 'Polls & voting', 'File sharing']
    },
    {
      id: 'documents',
      title: 'Document Management',
      description: 'Submit, track, and manage documents through complete approval workflows',
      icon: FileText,
      path: '/documents',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      category: 'core',
      estimatedTime: '3 min',
      features: ['Document submission', 'Approval workflows', 'Status tracking', 'File management']
    },
    {
      id: 'advanced-signature',
      title: 'Advanced Signature',
      description: 'Multi-modal signature capture with quality validation and advanced tools',
      icon: PenTool,
      path: '/advanced-signature',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      category: 'tools',
      estimatedTime: '3 min',
      features: ['Multi-modal capture', 'Quality validation', 'Signature library', 'Touch optimization']
    },
    {
      id: 'emergency',
      title: 'Emergency Management',
      description: 'Priority document submission and emergency response with bypass workflows',
      icon: AlertTriangle,
      path: '/emergency',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      category: 'tools',
      estimatedTime: '2 min',
      features: ['Emergency submission', 'Bypass workflows', 'Priority routing', 'Instant notifications']
    },
    {
      id: 'approvals',
      title: 'Approval Center',
      description: 'Review and approve pending documents with digital signatures and workflows',
      icon: CheckSquare,
      path: '/approvals',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      category: 'management',
      permissions: ['canApprove'],
      estimatedTime: '4 min',
      features: ['Document review', 'Digital approval', 'Workflow management', 'Bulk actions']
    },
    {
      id: 'workflow',
      title: 'Workflow Management',
      description: 'Design and manage document approval workflows with visual builder',
      icon: GitBranch,
      path: '/workflow',
      color: 'text-violet-600',
      bgColor: 'bg-violet-50',
      category: 'management',
      permissions: ['canManageWorkflows'],
      estimatedTime: '6 min',
      features: ['Visual workflow builder', 'Role-based routing', 'Escalation paths', 'Template management']
    },
    {
      id: 'approval-routing',
      title: 'Bi-Directional Routing',
      description: 'Advanced approval routing with counter-approval and escalation management',
      icon: ArrowRightLeft,
      path: '/approval-routing',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      category: 'management',
      permissions: ['canManageWorkflows'],
      estimatedTime: '5 min',
      features: ['Bi-directional routing', 'Counter-approval', 'Auto-escalation', 'Smart notifications']
    },
    {
      id: 'analytics',
      title: 'Analytics Dashboard',
      description: 'Comprehensive insights into document workflows and system performance',
      icon: BarChart3,
      path: '/analytics',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      category: 'management',
      permissions: ['canViewAnalytics'],
      estimatedTime: '4 min',
      features: ['Performance metrics', 'Workflow analytics', 'Department insights', 'Trend analysis']
    }
  ];

  const getVisibleCards = () => {
    return tutorialCards.filter(card => {
      if (!card.permissions) return true;
      return card.permissions.every(permission => 
        user?.permissions[permission as keyof typeof user.permissions]
      );
    });
  };

  const handleCardClick = (card: TutorialCard) => {
    // Add navigation highlight effect
    const navElement = document.querySelector(`[data-tutorial="${card.id}"]`);
    if (navElement) {
      navElement.classList.add('tutorial-navigation-highlight');
      
      // Remove highlight after navigation
      setTimeout(() => {
        navElement.classList.remove('tutorial-navigation-highlight');
      }, 3000);
    }

    // Navigate to the page
    navigate(card.path);
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'core': return 'Core Features';
      case 'management': return 'Management Tools';
      case 'tools': return 'Specialized Tools';
      default: return 'Features';
    }
  };

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case 'core': return 'Essential daily-use features for all users';
      case 'management': return 'Advanced management and approval tools';
      case 'tools': return 'Specialized tools for specific workflows';
      default: return 'Available features';
    }
  };

  const visibleCards = getVisibleCards();
  const groupedCards = visibleCards.reduce((acc, card) => {
    if (!acc[card.category]) {
      acc[card.category] = [];
    }
    acc[card.category].push(card);
    return acc;
  }, {} as Record<string, TutorialCard[]>);

  return (
    <div className={cn("space-y-8", className)}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-glow">
          <Target className="w-8 h-8 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-primary mb-2">Interactive Feature Tutorials</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Click any card below to instantly navigate to that feature and explore its capabilities. 
            Each tutorial is designed for your <span className="font-semibold text-primary">{user?.role}</span> role.
          </p>
        </div>
      </div>

      {/* Tutorial Cards by Category */}
      {Object.entries(groupedCards).map(([category, cards]) => (
        <div key={category} className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              {getCategoryTitle(category)}
            </h3>
            <p className="text-muted-foreground">
              {getCategoryDescription(category)}
            </p>
          </div>

          <div className={cn(
            "grid gap-6",
            isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          )}>
            {cards.map((card, index) => (
              <Card
                key={card.id}
                className={cn(
                  "group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105",
                  "border-2 border-transparent hover:border-primary/30",
                  "animate-scale-in overflow-hidden"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleCardClick(card)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className={cn(
                      "p-3 rounded-xl transition-all duration-300 group-hover:scale-110",
                      card.bgColor
                    )}>
                      <card.icon className={cn("w-8 h-8", card.color)} />
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        {card.estimatedTime}
                      </Badge>
                      <Badge variant="secondary" className="text-xs mt-1 block">
                        {card.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {card.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-foreground">Key Features:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {card.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                      variant="outline"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Explore {card.title}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Navigation Sync Indicator */}
      <Card className="bg-gradient-subtle border-primary/20">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-primary" />
            <span className="font-semibold text-primary">Smart Navigation</span>
          </div>
          <p className="text-sm text-muted-foreground">
            When you click a tutorial card, the corresponding navigation item will be highlighted in green, 
            making it easy to find the feature again later.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};