import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';
import {
  Brain,
  Sparkles,
  FileText,
  Users,
  Clock,
  TrendingUp,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Zap,
  ArrowRight,
  Send
} from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'summary' | 'suggestion' | 'optimization' | 'prediction' | 'alert';
  title: string;
  content: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  documentId?: string;
  timestamp: Date;
}

interface AIWidgetProps {
  userRole: string;
  permissions: any;
  isCustomizing?: boolean;
  onSelect?: () => void;
  isSelected?: boolean;
}

export const AIWidget: React.FC<AIWidgetProps> = ({
  userRole,
  permissions,
  isCustomizing,
  onSelect,
  isSelected
}) => {
  const { user } = useAuth();
  const { isMobile } = useResponsive();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [quickQuery, setQuickQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'actionable' | 'high-priority'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate AI insights generation based on role
    const generateInsights = async () => {
      setLoading(true);
      
      const roleBasedInsights: AIInsight[] = [
        {
          id: '1',
          type: 'summary',
          title: 'Document Processing Summary',
          content: `This week: ${userRole === 'principal' ? '23 documents processed with 89% approval rate' : 
                                userRole === 'registrar' ? '15 documents reviewed with 92% efficiency' :
                                userRole === 'hod' ? '8 department documents with 94% approval rate' :
                                '3 submissions with 100% approval rate'}. Processing time improved by 15%.`,
          confidence: 94,
          priority: 'medium',
          actionable: false,
          timestamp: new Date(Date.now() - 3600000)
        },
        {
          id: '2',
          type: 'suggestion',
          title: 'Workflow Optimization',
          content: userRole === 'principal' ? 
            'Consider implementing parallel approval for routine documents to reduce processing time by 30%.' :
            userRole === 'registrar' ?
            'Faculty recruitment documents could benefit from pre-approval templates to speed up processing.' :
            userRole === 'hod' ?
            'Department reports show consistent patterns - suggest creating automated templates.' :
            'Your submission timing (10-11 AM) aligns with peak approval hours for faster processing.',
          confidence: 87,
          priority: 'high',
          actionable: true,
          timestamp: new Date(Date.now() - 7200000)
        },
        {
          id: '3',
          type: 'prediction',
          title: 'Workload Forecast',
          content: userRole === 'principal' ?
            'Expected 35% increase in document submissions next week due to semester planning. Consider additional review capacity.' :
            userRole === 'registrar' ?
            'Fee structure circulars typically see 40% more submissions in the next 2 weeks.' :
            userRole === 'hod' ?
            'Academic reports deadline approaching - expect 60% increase in submissions.' :
            'Optimal submission window: Tuesday-Thursday, 10 AM - 12 PM for fastest approval.',
          confidence: 82,
          priority: 'medium',
          actionable: true,
          timestamp: new Date(Date.now() - 10800000)
        },
        {
          id: '4',
          type: 'alert',
          title: 'Attention Required',
          content: userRole === 'principal' ?
            '3 documents have been pending for over 48 hours. Auto-escalation will trigger in 6 hours.' :
            userRole === 'registrar' ?
            '2 emergency documents require immediate attention.' :
            userRole === 'hod' ?
            '1 document from your department is overdue for review.' :
            'Your document DOC-2024-001 has been approved and is ready for download.',
          confidence: 96,
          priority: 'high',
          actionable: true,
          documentId: 'DOC-2024-001',
          timestamp: new Date(Date.now() - 1800000)
        }
      ];

      // Add role-specific insights
      if (userRole === 'principal' || userRole === 'registrar') {
        roleBasedInsights.push({
          id: '5',
          type: 'optimization',
          title: 'System Performance',
          content: 'Document approval efficiency increased by 23% this month. Peak performance hours: 10 AM - 12 PM. Consider scheduling important reviews during these hours.',
          confidence: 91,
          priority: 'low',
          actionable: true,
          timestamp: new Date(Date.now() - 14400000)
        });
      }

      setTimeout(() => {
        setInsights(roleBasedInsights);
        setLoading(false);
      }, 1000);
    };

    generateInsights();
  }, [userRole]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'summary': return <FileText className="w-4 h-4 text-primary" />;
      case 'suggestion': return <Lightbulb className="w-4 h-4 text-warning" />;
      case 'optimization': return <TrendingUp className="w-4 h-4 text-success" />;
      case 'prediction': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'alert': return <AlertCircle className="w-4 h-4 text-destructive" />;
      default: return <Sparkles className="w-4 h-4 text-primary" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-success';
    if (confidence >= 70) return 'text-warning';
    return 'text-muted-foreground';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleQuickQuery = async () => {
    if (!quickQuery.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const newInsight: AIInsight = {
        id: Date.now().toString(),
        type: 'summary',
        title: 'AI Response',
        content: `Based on your query "${quickQuery}", here are the key insights: ${quickQuery.includes('document') ? 'Document processing is currently optimal with 89% approval rate.' : 'System performance is excellent with no issues detected.'}`,
        confidence: 85,
        priority: 'medium',
        actionable: false,
        timestamp: new Date()
      };
      
      setInsights(prev => [newInsight, ...prev]);
      setQuickQuery('');
      setIsProcessing(false);
    }, 2000);
  };

  const getFilteredInsights = () => {
    switch (filter) {
      case 'actionable':
        return insights.filter(insight => insight.actionable);
      case 'high-priority':
        return insights.filter(insight => insight.priority === 'high');
      default:
        return insights;
    }
  };

  const filteredInsights = getFilteredInsights();
  const actionableCount = insights.filter(insight => insight.actionable).length;
  const highPriorityCount = insights.filter(insight => insight.priority === 'high').length;

  if (loading) {
    return (
      <Card className={cn(
        "shadow-elegant",
        isSelected && "border-primary",
        isCustomizing && "cursor-pointer"
      )} onClick={onSelect}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "shadow-elegant hover:shadow-glow transition-all duration-300",
      "dashboard-widget-container",
      isSelected && "border-primary",
      isCustomizing && "cursor-pointer"
    )} onClick={onSelect}>
      <CardHeader className={cn(isMobile && "pb-3")}>
        <div className="flex items-center justify-between">
          <CardTitle className={cn(
            "flex items-center gap-2",
            isMobile ? "text-lg" : "text-xl"
          )}>
            <Brain className="w-5 h-5 text-primary" />
            AI Assistant
            <div className="flex gap-1">
              {actionableCount > 0 && (
                <Badge variant="warning" className="text-xs">
                  {actionableCount} actionable
                </Badge>
              )}
              {highPriorityCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {highPriorityCount} priority
                </Badge>
              )}
            </div>
          </CardTitle>
          
          <div className="flex gap-1">
            {(['all', 'actionable', 'high-priority'] as const).map(filterType => (
              <Button
                key={filterType}
                variant={filter === filterType ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter(filterType)}
                className="h-6 px-2 text-xs"
              >
                {filterType === 'all' ? 'All' : 
                 filterType === 'actionable' ? 'Action' : 'Priority'}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="dashboard-widget-content space-y-3">
        {/* Quick Query */}
        <div className="space-y-1.5">
          <div className="flex gap-2">
            <Textarea
              placeholder="Ask AI about documents, workflows, or analytics..."
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
              className={cn(
                "flex-1 resize-none",
                "h-8 text-sm"
              )}
              rows={1}
            />
            <Button
              onClick={handleQuickQuery}
              disabled={isProcessing || !quickQuery.trim()}
              className="h-8 w-8 p-0"
            >
              {isProcessing ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* AI Insights */}
        <ScrollArea className={cn(isMobile ? "h-28" : "h-32")}>
          <div className="space-y-2">
            {filteredInsights.slice(0, isMobile ? 3 : 4).map((insight, index) => (
              <div
                key={insight.id}
                className={cn(
                  "p-2 border rounded-lg hover:bg-accent transition-all animate-fade-in",
                  insight.priority === 'high' && "border-l-4 border-l-destructive",
                  insight.actionable && "bg-primary/5"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 mt-1">
                    {getInsightIcon(insight.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h5 className={cn(
                        "font-medium",
                        "text-sm"
                      )}>
                        {insight.title}
                      </h5>
                      <div className="flex items-center gap-1">
                        <Badge 
                          className={getPriorityColor(insight.priority)}
                        >
                          {insight.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {insight.confidence}%
                        </Badge>
                      </div>
                    </div>
                    
                    <p className={cn(
                      "text-muted-foreground mb-1",
                      "text-xs"
                    )}>
                      {insight.content}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {insight.timestamp.toLocaleTimeString()}
                      </span>
                      {insight.actionable && (
                        <Button variant="ghost" size="sm" className="h-5 text-xs">
                          <ArrowRight className="w-3 h-3 mr-1" />
                          Take Action
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredInsights.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                <Brain className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  No AI insights available
                </p>
                <p className="text-xs">
                  AI will analyze your activity and provide insights
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* AI Quick Actions */}
        <div className="grid grid-cols-2 gap-1 pt-2 border-t">
          <Button variant="outline" size="sm" className="text-xs h-6">
            <FileText className="w-3 h-3 mr-1" />
            Summarize Docs
          </Button>
          <Button variant="outline" size="sm" className="text-xs h-6">
            <Users className="w-3 h-3 mr-1" />
            Suggest Recipients
          </Button>
          <Button variant="outline" size="sm" className="text-xs h-6">
            <Clock className="w-3 h-3 mr-1" />
            Predict Timeline
          </Button>
          <Button variant="outline" size="sm" className="text-xs h-6">
            <TrendingUp className="w-3 h-3 mr-1" />
            Optimize Process
          </Button>
        </div>

        {/* AI Stats */}
        <div className="grid grid-cols-3 gap-1 pt-2 border-t">
          <div className="text-center p-1.5 bg-muted/30 rounded">
            <p className={cn(
              "font-bold text-primary",
              "text-lg"
            )}>
              {insights.length}
            </p>
            <p className={cn(
              "text-muted-foreground",
              "text-xs"
            )}>
              Insights
            </p>
          </div>
          <div className="text-center p-1.5 bg-muted/30 rounded">
            <p className={cn(
              "font-bold text-warning",
              "text-lg"
            )}>
              {actionableCount}
            </p>
            <p className={cn(
              "text-muted-foreground",
              "text-xs"
            )}>
              Actionable
            </p>
          </div>
          <div className="text-center p-1.5 bg-muted/30 rounded">
            <p className={cn(
              "font-bold text-success",
              "text-lg"
            )}>
              89%
            </p>
            <p className={cn(
              "text-muted-foreground",
              "text-xs"
            )}>
              Accuracy
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};