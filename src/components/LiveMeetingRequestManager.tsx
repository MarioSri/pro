import React, { useState, useEffect } from 'react';
import { RefreshCw, Filter, Search, TrendingUp, Clock, Users, AlertTriangle, Grid, List, Video, CheckCircle, Zap, Lightbulb, Target } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';
import { LiveMeetingRequestCard } from './LiveMeetingRequestCard';
import { liveMeetingService } from '../services/LiveMeetingService';
import { LiveMeetingRequest, LiveMeetingStats, LiveMeetingResponse } from '../types/liveMeeting';
import { cn } from '../lib/utils';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  description?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color, description }) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
          {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </div>
        <div className={`p-2 bg-${color}-100 rounded-lg`}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

export const LiveMeetingRequestManager: React.FC = () => {
  const [activeRequests, setActiveRequests] = useState<LiveMeetingRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<LiveMeetingRequest[]>([]);
  const [stats, setStats] = useState<LiveMeetingStats | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { toast } = useToast();

  useEffect(() => {
    loadLiveMeetingRequests();
    loadStats();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [activeRequests, filter, searchTerm]);

  const loadLiveMeetingRequests = async () => {
    try {
      setLoading(true);
      const requests = await liveMeetingService.getMyRequests();
      setActiveRequests(requests);
    } catch (error) {
      console.error('Error loading LiveMeet+ requests:', error);
      toast({
        title: "Error",
        description: "Failed to load LiveMeet+ requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await liveMeetingService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadLiveMeetingRequests(), loadStats()]);
    setRefreshing(false);
    toast({
      title: "Refreshed",
      description: "LiveMeet+ requests updated",
      variant: "default"
    });
  };

  const applyFilters = () => {
    let filtered = activeRequests;

    // Apply status/urgency filter
    if (filter !== 'all') {
      filtered = filtered.filter(request => {
        switch (filter) {
          case 'pending':
            return request.status === 'pending';
          case 'urgent':
            return request.urgency === 'urgent';
          case 'immediate':
            return request.urgency === 'immediate';
          case 'normal':
            return request.urgency === 'normal';
          default:
            return true;
        }
      });
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.documentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.purpose.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const response: LiveMeetingResponse = {
        requestId,
        response: 'accept',
        message: 'Request accepted'
      };

      await liveMeetingService.respondToRequest(response);
      
      // Update local state
      setActiveRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'accepted' as const, responseTime: new Date() }
            : req
        )
      );

      toast({
        title: "Meeting Accepted",
        description: "LiveMeet+ request accepted successfully. Meeting link will be generated.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error accepting LiveMeet+ request:', error);
      toast({
        title: "Error",
        description: "Failed to accept LiveMeet+ request",
        variant: "destructive"
      });
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    try {
      const response: LiveMeetingResponse = {
        requestId,
        response: 'decline',
        message: 'Request declined'
      };

      await liveMeetingService.respondToRequest(response);
      
      // Update local state
      setActiveRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'rejected' as const, responseTime: new Date() }
            : req
        )
      );

      toast({
        title: "Meeting Declined",
        description: "LiveMeet+ request declined successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error declining LiveMeet+ request:', error);
      toast({
        title: "Error",
        description: "Failed to decline LiveMeet+ request",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-32">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
            🔴 LiveMeet+
            {filteredRequests.filter(r => r.status === 'pending').length > 0 && (
              <Badge variant="destructive" className="animate-pulse text-sm px-3 py-1">
                {filteredRequests.filter(r => r.status === 'pending').length} pending
              </Badge>
            )}
          </h2>
          <p className="text-muted-foreground mt-2 text-lg">
            Real-time communication requests for document workflows
          </p>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live tracking enabled</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Auto-refresh every 30s</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-10 px-4"
            >
              <Grid className="w-4 h-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-10 px-4"
            >
              <List className="w-4 h-4 mr-2" />
              List
            </Button>
          </div>
          
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            className="flex items-center gap-2 h-10 px-4"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Pending LiveMeet+"
            value={stats.pendingRequests}
            icon={<Clock className="h-6 w-6 text-yellow-600" />}
            color="yellow"
            description="Awaiting response"
          />
          <StatsCard
            title="Immediate"
            value={stats.immediateRequests}
            icon={<AlertTriangle className="h-6 w-6 text-red-600" />}
            color="red"
            description="Within 15 minutes"
          />
          <StatsCard
            title="Today's LiveMeet+"
            value={stats.todaysMeetings}
            icon={<Users className="h-6 w-6 text-blue-600" />}
            color="blue"
            description="Scheduled today"
          />
          <StatsCard
            title="Success Rate"
            value={`${stats.successRate}%`}
            icon={<TrendingUp className="h-6 w-6 text-green-600" />}
            color="green"
            description="Acceptance rate"
          />
        </div>
      )}

      {/* Filters and Search */}
      <Card className="shadow-elegant">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search requests by title, requester, or purpose..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 h-12 text-base"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-48 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Requests</SelectItem>
                  <SelectItem value="pending">Pending Only</SelectItem>
                  <SelectItem value="immediate">🔥 Immediate</SelectItem>
                  <SelectItem value="urgent">⚡ Urgent</SelectItem>
                  <SelectItem value="normal">📅 Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Introduction */}
      <Card className="shadow-elegant border-l-4 border-l-primary bg-gradient-subtle">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <Video className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-2">
                LiveMeet+ Real-Time Communication
              </h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Request immediate clarification meetings during document approval workflows. 
                Connect instantly with approvers for faster decision-making and reduced approval cycles.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-sm">Instant meeting requests</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-sm">Auto-generated meeting links</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-sm">Context-aware notifications</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className={cn(
        "space-y-4",
        viewMode === 'grid' ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : "space-y-4"
      )}>
        {filteredRequests.length === 0 ? (
          <Card className="shadow-elegant">
            <CardContent className="p-12 text-center">
              <div className="space-y-2">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">No LiveMeet+ requests</h3>
                <p className="text-muted-foreground text-lg">
                  {searchTerm || filter !== 'all' 
                    ? 'No requests match your current filters' 
                    : 'No active LiveMeet+ requests at the moment'}
                </p>
                <div className="mt-6">
                  <Button variant="outline" onClick={() => setFilter('all')}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map(request => (
            <div key={request.id} className="animate-fade-in">
              <LiveMeetingRequestCard
                request={request}
                onAccept={handleAcceptRequest}
                onDecline={handleDeclineRequest}
              />
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      {filteredRequests.filter(r => r.status === 'pending').length > 0 && (
        <Card className="shadow-elegant border-l-4 border-l-warning bg-warning/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-warning rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-warning-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Quick Actions Available</h4>
                  <p className="text-muted-foreground">
                    {filteredRequests.filter(r => r.status === 'pending').length} requests awaiting your response
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="h-12 px-6">
                  Accept All Normal
                </Button>
                <Button className="bg-orange-600 hover:bg-orange-700 h-12 px-6">
                  Review Urgent First
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* How It Works Guide */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            How LiveMeet+ Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="font-semibold mb-2">Request Meeting</h4>
              <p className="text-sm text-muted-foreground">
                Click "Request Live Meeting" during document review to initiate immediate clarification
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-xl font-bold text-green-600">2</span>
              </div>
              <h4 className="font-semibold mb-2">Instant Notification</h4>
              <p className="text-sm text-muted-foreground">
                Recipients receive immediate notifications via email, dashboard, and mobile alerts
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-xl font-bold text-purple-600">3</span>
              </div>
              <h4 className="font-semibold mb-2">Quick Response</h4>
              <p className="text-sm text-muted-foreground">
                Accept or decline with optional message and suggested alternative times
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-xl font-bold text-orange-600">4</span>
              </div>
              <h4 className="font-semibold mb-2">Auto-Generated Link</h4>
              <p className="text-sm text-muted-foreground">
                Meeting link automatically created for Google Meet, Zoom, or Teams
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Use Cases */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Common Use Cases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Document Clarifications</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                  <span>Unclear policy requirements in circulars</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                  <span>Budget allocation questions in reports</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                  <span>Technical specification clarifications</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Urgent Approvals</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                  <span>Time-sensitive recruitment decisions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                  <span>Emergency infrastructure approvals</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                  <span>Critical policy implementation discussions</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};