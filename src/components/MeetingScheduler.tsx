import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Plus,
  Video,
  MapPin,
  Bell,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  ExternalLink
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MeetingSchedulerProps {
  userRole: string;
}

export function MeetingScheduler({ userRole }: MeetingSchedulerProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meetings, setMeetings] = useState([
    {
      id: 1,
      title: "Faculty Recruitment Discussion",
      description: "Review applications for new faculty positions",
      date: "2024-01-18",
      time: "10:00 AM",
      duration: 60,
      attendees: ["Principal", "Registrar", "HOD-CSE"],
      location: "Conference Room A",
      type: "in-person",
      status: "confirmed",
      documents: ["DOC-2024-001"]
    },
    {
      id: 2,
      title: "Budget Review Meeting",
      description: "Quarterly budget analysis and planning",
      date: "2024-01-19",
      time: "2:00 PM",
      duration: 90,
      attendees: ["Principal", "Finance Head", "Registrar"],
      location: "Online",
      type: "virtual",
      status: "pending",
      documents: []
    },
    {
      id: 3,
      title: "Academic Performance Review",
      description: "Semester performance analysis and improvements",
      date: "2024-01-20",
      time: "11:00 AM",
      duration: 45,
      attendees: ["All HODs", "Academic Cell"],
      location: "Auditorium",
      type: "in-person",
      status: "confirmed",
      documents: ["DOC-2024-003"]
    }
  ]);

  const [newMeeting, setNewMeeting] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: 60,
    attendees: [],
    location: "",
    type: "in-person"
  });

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM"
  ];

  const availableAttendees = [
    "Principal", "Registrar", "HOD-CSE", "HOD-EEE", "HOD-ECE", "HOD-MECH",
    "Dean", "Finance Head", "Academic Cell", "Librarian"
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmed: { variant: "success" as const, text: "Confirmed" },
      pending: { variant: "warning" as const, text: "Pending" },
      cancelled: { variant: "destructive" as const, text: "Cancelled" }
    };
    return variants[status as keyof typeof variants] || { variant: "default" as const, text: status };
  };

  const getTypeIcon = (type: string) => {
    return type === "virtual" ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />;
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const dateStr = date.toISOString().split('T')[0];
      const dayMeetings = meetings.filter(m => m.date === dateStr);
      
      days.push({
        date: i,
        fullDate: dateStr,
        meetings: dayMeetings,
        isToday: i === today.getDate(),
        isSelected: dateStr === selectedDate.toISOString().split('T')[0]
      });
    }
    
    return days;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Meeting Scheduler</h2>
          <p className="text-muted-foreground">Schedule and manage institutional meetings</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="gradient" className="animate-scale-in">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Meeting
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule New Meeting</DialogTitle>
              <DialogDescription>
                Create a new meeting with participants and agenda
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Meeting Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter meeting title"
                    value={newMeeting.title}
                    onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newMeeting.date}
                    onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Select value={newMeeting.time} onValueChange={(value) => setNewMeeting({...newMeeting, time: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Duration (minutes)</Label>
                  <Select value={newMeeting.duration.toString()} onValueChange={(value) => setNewMeeting({...newMeeting, duration: parseInt(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={newMeeting.type} onValueChange={(value) => setNewMeeting({...newMeeting, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-person">In-Person</SelectItem>
                      <SelectItem value="virtual">Virtual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Meeting agenda and description"
                  value={newMeeting.description}
                  onChange={(e) => setNewMeeting({...newMeeting, description: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Meeting location or video link"
                  value={newMeeting.location}
                  onChange={(e) => setNewMeeting({...newMeeting, location: e.target.value})}
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <DialogTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogTrigger>
                <Button variant="gradient">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2 shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              Calendar - {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {generateCalendarDays().map((day) => (
                <div
                  key={day.date}
                  className={`p-2 rounded-lg cursor-pointer transition-all hover:bg-accent ${
                    day.isToday ? 'bg-primary text-primary-foreground' :
                    day.isSelected ? 'bg-accent' : ''
                  }`}
                  onClick={() => setSelectedDate(new Date(day.fullDate))}
                >
                  <div className="text-sm font-medium">{day.date}</div>
                  {day.meetings.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {day.meetings.slice(0, 2).map((meeting, idx) => (
                        <div key={idx} className={`w-2 h-2 rounded-full ${
                          meeting.status === 'confirmed' ? 'bg-success' : 'bg-warning'
                        }`} />
                      ))}
                      {day.meetings.length > 2 && (
                        <span className="text-xs">+{day.meetings.length - 2}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Meetings */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Upcoming Meetings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {meetings.slice(0, 4).map((meeting) => (
              <div key={meeting.id} className="p-3 border rounded-lg hover:bg-accent transition-colors animate-scale-in">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{meeting.title}</h4>
                  <Badge variant={getStatusBadge(meeting.status).variant} className="text-xs">
                    {getStatusBadge(meeting.status).text}
                  </Badge>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3" />
                    {meeting.date} at {meeting.time}
                  </div>
                  <div className="flex items-center gap-1">
                    {getTypeIcon(meeting.type)}
                    {meeting.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {meeting.attendees.length} attendees
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Meetings List */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>All Meetings</CardTitle>
          <CardDescription>Manage and track all scheduled meetings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-all animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{meeting.title}</h3>
                    <p className="text-sm text-muted-foreground">{meeting.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadge(meeting.status).variant}>
                      {getStatusBadge(meeting.status).text}
                    </Badge>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                    <span>{meeting.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{meeting.time} ({meeting.duration}m)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(meeting.type)}
                    <span>{meeting.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{meeting.attendees.length} attendees</span>
                  </div>
                </div>
                
                {/* Attendees */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Attendees</Label>
                  <div className="flex flex-wrap gap-2">
                    {meeting.attendees.map((attendee, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-2 py-1 bg-muted rounded-md text-sm">
                        <Avatar className="w-5 h-5">
                          <AvatarFallback className="text-xs">
                            {attendee.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {attendee}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Linked Documents */}
                {meeting.documents.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Related Documents</Label>
                    <div className="flex gap-2">
                      {meeting.documents.map((docId, idx) => (
                        <Badge key={idx} variant="outline" className="cursor-pointer hover:bg-accent">
                          {docId}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end gap-2 pt-2">
                  {meeting.type === "virtual" && (
                    <Button variant="outline" size="sm">
                      <Video className="w-4 h-4 mr-2" />
                      Join Meeting
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Bell className="w-4 h-4 mr-2" />
                    Set Reminder
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}