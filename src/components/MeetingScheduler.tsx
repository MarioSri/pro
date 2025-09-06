import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LiveMeetingRequestModal } from '@/components/LiveMeetingRequestModal';
import { useToast } from '@/hooks/use-toast';
import { useGoogleAPI } from '@/hooks/useGoogleAPI';
import { meetingAPI } from '@/services/MeetingAPIService';
import { Meeting, ConflictCheck, AISchedulingSuggestion } from '@/types/meeting';
import { cn } from '@/lib/utils';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  MapPin,
  Video,
  Plus,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap,
  Brain,
  Wifi,
  WifiOff,
  RefreshCw,
  Filter,
  Search,
  Grid,
  List,
  BarChart3,
  TrendingUp,
  Eye,
  Bell,
  ChevronLeft,
  ChevronRight,
  Target,
  Lightbulb
} from 'lucide-react';

interface MeetingSchedulerProps {
  userRole: string;
}

export const MeetingScheduler: React.FC<MeetingSchedulerProps> = ({ userRole }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showLiveConnectModal, setShowLiveConnectModal] = useState(false);
  const [conflicts, setConflicts] = useState<ConflictCheck | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<AISchedulingSuggestion | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'live-requests' | 'analytics'>('calendar');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');

  const { toast } = useToast();
  const { isLoaded: googleLoaded, isSignedIn: googleSignedIn, signIn: googleSignIn } = useGoogleAPI();

  // Meeting form state
  const [meetingForm, setMeetingForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: 60,
    attendees: [] as any[],
    location: 'google-meet',
    type: 'online' as 'online' | 'physical' | 'hybrid',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    category: 'academic' as 'academic' | 'administrative' | 'financial' | 'emergency'
  });

  useEffect(() => {
    loadMeetings();
    
    // Set up auto-sync every 30 seconds
    const syncInterval = setInterval(() => {
      autoSync();
    }, 30000);

    return () => clearInterval(syncInterval);
  }, []);

  const loadMeetings = async () => {
    // Simulate loading meetings
    const mockMeetings: Meeting[] = [
      {
        id: 'meeting-1',
        title: 'Faculty Development Workshop',
        description: 'Monthly faculty development session',
        date: '2024-01-18',
        time: '10:00',
        duration: 120,
        attendees: [
          { id: '1', name: 'Dr. Smith', email: 'smith@hitam.org', role: 'Principal', status: 'accepted', isRequired: true, canEdit: false },
          { id: '2', name: 'Prof. Johnson', email: 'johnson@hitam.org', role: 'HOD', status: 'pending', isRequired: true, canEdit: false }
        ],
        location: 'Conference Room A',
        type: 'physical',
        status: 'confirmed',
        documents: [],
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: 'medium',
        isRecurring: false,
        tags: ['faculty', 'development'],
        category: 'academic'
      },
      {
        id: 'meeting-2',
        title: 'Emergency Infrastructure Review',
        description: 'Urgent review of Block A electrical issues',
        date: '2024-01-17',
        time: '14:00',
        duration: 60,
        attendees: [
          { id: '1', name: 'Principal', email: 'principal@hitam.org', role: 'Principal', status: 'accepted', isRequired: true, canEdit: false },
          { id: '3', name: 'Maintenance Head', email: 'maintenance@hitam.org', role: 'Employee', status: 'accepted', isRequired: true, canEdit: false }
        ],
        location: 'https://meet.google.com/emergency-review',
        type: 'online',
        status: 'confirmed',
        documents: [],
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: 'urgent',
        isRecurring: false,
        tags: ['emergency', 'infrastructure'],
        category: 'emergency'
      }
    ];
    setMeetings(mockMeetings);
  };

  const autoSync = async () => {
    setSyncStatus('syncing');
    
    // Simulate sync process
    setTimeout(() => {
      setSyncStatus('synced');
      setLastSync(new Date());
    }, 1000);
  };

  const checkConflicts = async (meeting: Partial<Meeting>) => {
    const conflictCheck = await meetingAPI.checkConflicts(meeting);
    setConflicts(conflictCheck);
    return conflictCheck;
  };

  const getAISuggestions = async (meeting: Partial<Meeting>) => {
    const suggestions = await meetingAPI.getAISchedulingSuggestions(meeting);
    setAiSuggestions(suggestions);
    return suggestions;
  };

  const createMeeting = async () => {
    if (!meetingForm.title || !meetingForm.date || !meetingForm.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in title, date, and time",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);

    try {
      // Check for conflicts first
      const conflictCheck = await checkConflicts(meetingForm);
      
      if (conflictCheck.hasConflict) {
        toast({
          title: "Scheduling Conflict Detected",
          description: `${conflictCheck.conflicts.length} conflicts found. Please review suggestions.`,
          variant: "destructive"
        });
        setConflicts(conflictCheck);
        return;
      }

      const response = await meetingAPI.createMeeting(meetingForm as Meeting);
      
      setMeetings(prev => [...prev, response.meeting]);
      setShowCreateDialog(false);
      
      // Reset form
      setMeetingForm({
        title: '',
        description: '',
        date: '',
        time: '',
        duration: 60,
        attendees: [],
        location: 'google-meet',
        type: 'online',
        priority: 'medium',
        category: 'academic'
      });

      toast({
        title: "Meeting Created",
        description: `Meeting scheduled successfully with ${response.meetingLinks?.primary} integration`,
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create meeting",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getDateMeetings = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return meetings.filter(meeting => meeting.date === dateStr);
  };

  const getFilteredMeetings = () => {
    let filtered = meetings;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(meeting => meeting.status === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(meeting =>
        meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime());
  };

  const isDateUnavailable = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayMeetings = meetings.filter(meeting => meeting.date === dateStr);
    
    // Block dates with more than 5 meetings or any emergency meetings
    return dayMeetings.length >= 5 || dayMeetings.some(meeting => meeting.priority === 'urgent');
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const getSyncStatusIcon = () => {
    switch (syncStatus) {
      case 'synced': return <Wifi className="w-4 h-4 text-success" />;
      case 'syncing': return <RefreshCw className="w-4 h-4 text-warning animate-spin" />;
      case 'error': return <WifiOff className="w-4 h-4 text-destructive" />;
    }
  };

  const filteredMeetings = getFilteredMeetings();
  const todaysMeetings = getDateMeetings(new Date());
  const upcomingMeetings = meetings.filter(m => new Date(m.date) > new Date()).slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-primary" />
            Meeting Scheduler
          </h2>
          <p className="text-muted-foreground mt-2 text-lg">
            Schedule meetings with Google Meet, Zoom, and Teams integration
          </p>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {getSyncStatusIcon()}
              <span>Last sync: {lastSync.toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="w-4 h-4" />
              <span>{meetings.length} meetings scheduled</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button variant="gradient" size="lg" className="h-12 px-6">
                <Plus className="w-5 h-5 mr-2" />
                Schedule Meeting
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">Create New Meeting</DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="basic" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="attendees">Attendees</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                  <TabsTrigger value="ai">AI Assist</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Meeting Title *</Label>
                      <Input
                        id="title"
                        value={meetingForm.title}
                        onChange={(e) => setMeetingForm({...meetingForm, title: e.target.value})}
                        placeholder="Enter meeting title"
                        className="h-12"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={meetingForm.category} onValueChange={(value: any) => setMeetingForm({...meetingForm, category: value})}>
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="academic">Academic</SelectItem>
                          <SelectItem value="administrative">Administrative</SelectItem>
                          <SelectItem value="financial">Financial</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={meetingForm.description}
                      onChange={(e) => setMeetingForm({...meetingForm, description: e.target.value})}
                      placeholder="Meeting agenda and details"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={meetingForm.date}
                        onChange={(e) => setMeetingForm({...meetingForm, date: e.target.value})}
                        className="h-12"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="time">Time *</Label>
                      <Input
                        id="time"
                        type="time"
                        value={meetingForm.time}
                        onChange={(e) => setMeetingForm({...meetingForm, time: e.target.value})}
                        className="h-12"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Select value={meetingForm.duration.toString()} onValueChange={(value) => setMeetingForm({...meetingForm, duration: parseInt(value)})}>
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="90">1.5 hours</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                          <SelectItem value="180">3 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Meeting Type</Label>
                      <Select value={meetingForm.type} onValueChange={(value: any) => setMeetingForm({...meetingForm, type: value})}>
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="online">
                            <div className="flex items-center gap-2">
                              <Video className="w-4 h-4" />
                              Online Meeting
                            </div>
                          </SelectItem>
                          <SelectItem value="physical">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              In-Person Meeting
                            </div>
                          </SelectItem>
                          <SelectItem value="hybrid">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              Hybrid Meeting
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Platform/Location</Label>
                      <Select value={meetingForm.location} onValueChange={(value) => setMeetingForm({...meetingForm, location: value})}>
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {meetingForm.type === 'online' || meetingForm.type === 'hybrid' ? (
                            <>
                              <SelectItem value="google-meet">Google Meet</SelectItem>
                              <SelectItem value="zoom">Zoom</SelectItem>
                              <SelectItem value="teams">Microsoft Teams</SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="conference-room-a">Conference Room A</SelectItem>
                              <SelectItem value="conference-room-b">Conference Room B</SelectItem>
                              <SelectItem value="auditorium">Auditorium</SelectItem>
                              <SelectItem value="principal-office">Principal's Office</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="attendees" className="space-y-4">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Select Attendees</h4>
                    <p className="text-sm text-muted-foreground">
                      Choose participants for this meeting. Required attendees must accept for the meeting to proceed.
                    </p>
                    
                    {/* Attendee selection would go here */}
                    <div className="p-4 border rounded-lg bg-muted/30">
                      <p className="text-sm text-muted-foreground">
                        Attendee selection interface will be implemented here
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Priority Level</Label>
                      <Select value={meetingForm.priority} onValueChange={(value: any) => setMeetingForm({...meetingForm, priority: value})}>
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="high">High Priority</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="ai" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-primary" />
                      <h4 className="font-semibold">AI Scheduling Assistant</h4>
                    </div>
                    
                    <Button
                      onClick={() => getAISuggestions(meetingForm)}
                      variant="outline"
                      className="w-full h-12"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Get AI Suggestions
                    </Button>

                    {aiSuggestions && (
                      <div className="space-y-3">
                        <h5 className="font-medium">Recommended Time Slots</h5>
                        {aiSuggestions.recommendedSlots.slice(0, 3).map((slot, index) => (
                          <div key={index} className="p-3 border rounded-lg hover:bg-accent cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{slot.date} at {slot.time}</p>
                                <p className="text-sm text-muted-foreground">
                                  {slot.availabilityScore * 100}% availability
                                </p>
                              </div>
                              <Button size="sm" onClick={() => {
                                setMeetingForm({
                                  ...meetingForm,
                                  date: slot.date,
                                  time: slot.time,
                                  duration: slot.duration
                                });
                              }}>
                                Use This Slot
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={createMeeting} disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Create Meeting'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button 
            variant="outline" 
            onClick={() => setShowLiveConnectModal(true)}
            className="h-12 px-6 border-orange-500 text-orange-600 hover:bg-orange-50"
          >
            🔴 LiveConnect+
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-elegant">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <CalendarIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{meetings.length}</p>
                <p className="text-sm text-muted-foreground">Total Meetings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{meetings.filter(m => m.status === 'confirmed').length}</p>
                <p className="text-sm text-muted-foreground">Confirmed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-warning/10 rounded-lg">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{todaysMeetings.length}</p>
                <p className="text-sm text-muted-foreground">Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elegant">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{upcomingMeetings.length}</p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Interface */}
      <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)} className="space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="calendar">📅 Calendar</TabsTrigger>
            <TabsTrigger value="list">📋 List</TabsTrigger>
            <TabsTrigger value="live-requests" className="relative">
              🔴 LiveConnect+
              <Badge variant="destructive" className="ml-1 px-1 py-0 text-xs animate-pulse">
                3
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="analytics">📊 Analytics</TabsTrigger>
          </TabsList>

          {/* Search and Filter */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search meetings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 h-10"
              />
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40 h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="calendar" className="space-y-6">
          <Card className="shadow-elegant">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Month View
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <h3 className="text-lg font-semibold min-w-[200px] text-center">
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                disabled={(date) => isDateUnavailable(date)}
                className="rounded-md border"
                modifiers={{
                  booked: (date) => getDateMeetings(date).length > 0,
                  unavailable: (date) => isDateUnavailable(date)
                }}
                modifiersStyles={{
                  booked: { backgroundColor: 'hsl(var(--primary) / 0.1)', color: 'hsl(var(--primary))' },
                  unavailable: { backgroundColor: 'hsl(var(--destructive) / 0.1)', color: 'hsl(var(--destructive))' }
                }}
              />
              
              {/* Date Details */}
              {selectedDate && (
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-3">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h4>
                  
                  {getDateMeetings(selectedDate).length > 0 ? (
                    <div className="space-y-2">
                      {getDateMeetings(selectedDate).map(meeting => (
                        <div key={meeting.id} className="flex items-center justify-between p-3 bg-white rounded border">
                          <div>
                            <h5 className="font-medium">{meeting.title}</h5>
                            <p className="text-sm text-muted-foreground">
                              {meeting.time} • {meeting.duration} minutes
                            </p>
                          </div>
                          <Badge variant={meeting.status === 'confirmed' ? 'default' : 'secondary'}>
                            {meeting.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No meetings scheduled for this date</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>All Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {filteredMeetings.map(meeting => (
                    <div key={meeting.id} className="p-4 border rounded-lg hover:bg-accent transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{meeting.title}</h4>
                          <p className="text-muted-foreground mt-1">{meeting.description}</p>
                          
                          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="w-4 h-4" />
                              {meeting.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {meeting.time}
                            </div>
                            <div className="flex items-center gap-1">
                              {meeting.type === 'online' ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                              {meeting.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {meeting.attendees.length} attendees
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant={meeting.status === 'confirmed' ? 'default' : 'secondary'}>
                            {meeting.status}
                          </Badge>
                          <Badge variant={
                            meeting.priority === 'urgent' ? 'destructive' :
                            meeting.priority === 'high' ? 'warning' : 'outline'
                          }>
                            {meeting.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="live-requests" className="space-y-6">
          {/* LiveConnect+ Feature Introduction */}
          <Card className="shadow-elegant border-l-4 border-l-orange-500 bg-gradient-to-r from-orange-50 to-red-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    🔴 LiveConnect+ Real-Time Meetings
                  </h3>
                  <p className="text-muted-foreground mb-4 text-lg leading-relaxed">
                    Request immediate clarification meetings during document approval workflows. 
                    Connect instantly with stakeholders for faster decision-making and streamlined approvals.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-sm">Document workflow integration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-sm">Multi-platform support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-sm">Real-time status tracking</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                How LiveConnect+ Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">1</span>
                  </div>
                  <h4 className="font-semibold mb-2">Request Meeting</h4>
                  <p className="text-sm text-muted-foreground">
                    Click "🔴 LiveConnect+" during document review to request immediate clarification
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-green-600">2</span>
                  </div>
                  <h4 className="font-semibold mb-2">Instant Notification</h4>
                  <p className="text-sm text-muted-foreground">
                    Recipients receive immediate alerts via email, dashboard, and mobile notifications
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-purple-600">3</span>
                  </div>
                  <h4 className="font-semibold mb-2">Quick Response</h4>
                  <p className="text-sm text-muted-foreground">
                    Accept or decline with optional message and suggested alternative times
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-orange-600">4</span>
                  </div>
                  <h4 className="font-semibold mb-2">Auto-Generated Link</h4>
                  <p className="text-sm text-muted-foreground">
                    Meeting link automatically created for Google Meet, Zoom, or Teams
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              onClick={() => setShowLiveConnectModal(true)}
              className="h-16 flex flex-col gap-2 border-orange-500 text-orange-600 hover:bg-orange-50"
            >
              <Video className="w-6 h-6" />
              <span>Request LiveConnect+</span>
            </Button>
            
            <Button variant="outline" className="h-16 flex flex-col gap-2">
              <Eye className="w-6 h-6" />
              <span>View Active Requests</span>
            </Button>
            
            <Button variant="outline" className="h-16 flex flex-col gap-2">
              <BarChart3 className="w-6 h-6" />
              <span>LiveConnect+ Analytics</span>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Meeting Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Completion Rate</span>
                    <span className="font-bold text-success">94%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Average Duration</span>
                    <span className="font-bold">67 minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>On-Time Start Rate</span>
                    <span className="font-bold text-primary">89%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Platform Usage</span>
                    <div className="flex gap-2">
                      <Badge variant="outline">Google Meet 45%</Badge>
                      <Badge variant="outline">Zoom 35%</Badge>
                      <Badge variant="outline">Teams 20%</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>LiveConnect+ Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Total Requests</span>
                    <span className="font-bold">24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Success Rate</span>
                    <span className="font-bold text-success">96%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Avg Response Time</span>
                    <span className="font-bold">8 minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Most Active Time</span>
                    <span className="font-bold">10-12 AM</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Conflict Detection Alert */}
      {conflicts && conflicts.hasConflict && (
        <Alert className="border-destructive bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Scheduling Conflicts Detected:</strong> {conflicts.conflicts.length} conflicts found.
            <div className="mt-2">
              <Button size="sm" variant="outline" onClick={() => setConflicts(null)}>
                View Suggestions
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* LiveConnect+ Modal */}
      <LiveMeetingRequestModal
        isOpen={showLiveConnectModal}
        onClose={() => setShowLiveConnectModal(false)}
        documentId="sample-doc-id"
        documentType="circular"
        documentTitle="Sample Document for LiveConnect+ Demo"
      />
    </div>
  );
};