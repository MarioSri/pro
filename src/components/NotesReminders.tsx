import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  StickyNote,
  Plus,
  X,
  Edit,
  Save,
  Bell,
  Calendar,
  Clock,
  Pin,
  Palette,
  Search,
  Filter
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

interface Note {
  id: number;
  title: string;
  content: string;
  color: string;
  position: { x: number; y: number };
  createdAt: string;
  category: string;
  pinned: boolean;
}

interface Reminder {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  category: string;
}

interface NotesRemindersProps {
  userRole: string;
  isMessagesPage?: boolean;
}

export function NotesReminders({ userRole, isMessagesPage = false }: NotesRemindersProps) {
  const [draggedNoteId, setDraggedNoteId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: "Faculty Meeting Follow-up",
      content: "Review new curriculum proposals and schedule next review meeting",
      color: "bg-yellow-200",
      position: { x: 50, y: 100 },
      createdAt: "2024-01-15",
      category: "meetings",
      pinned: true
    },
    {
      id: 2,
      title: "Budget Review",
      content: "Check Q1 budget allocations and submit variance report",
      color: "bg-blue-200",
      position: { x: 300, y: 150 },
      createdAt: "2024-01-14",
      category: "finance",
      pinned: false
    },
    {
      id: 3,
      title: "Student Evaluation",
      content: "Complete mid-semester evaluation forms for all courses",
      color: "bg-green-200",
      position: { x: 550, y: 120 },
      createdAt: "2024-01-13",
      category: "academic",
      pinned: false
    }
  ]);

  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: 1,
      title: "Submit Monthly Report",
      description: "Department performance and activity report for January",
      dueDate: "2024-01-25",
      dueTime: "17:00",
      priority: "high",
      completed: false,
      category: "reports"
    },
    {
      id: 2,
      title: "Faculty Appraisal Meeting",
      description: "Annual performance review with Dr. Smith",
      dueDate: "2024-01-22",
      dueTime: "14:00",
      priority: "medium",
      completed: false,
      category: "meetings"
    },
    {
      id: 3,
      title: "Research Proposal Deadline",
      description: "Submit proposal for new research project funding",
      dueDate: "2024-01-30",
      dueTime: "23:59",
      priority: "high",
      completed: false,
      category: "research"
    }
  ]);

  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    color: "bg-yellow-200",
    category: "general"
  });

  const [newReminder, setNewReminder] = useState({
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
    priority: "medium" as const,
    category: "general"
  });

  const [editingNote, setEditingNote] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const noteColors = [
    { name: "Yellow", class: "bg-yellow-200" },
    { name: "Blue", class: "bg-blue-200" },
    { name: "Green", class: "bg-green-200" },
    { name: "Pink", class: "bg-pink-200" },
    { name: "Purple", class: "bg-purple-200" },
    { name: "Orange", class: "bg-orange-200" }
  ];

  const categories = [
    "general", "meetings", "finance", "academic", "research", "administrative"
  ];

  const addNote = () => {
    const note: Note = {
      id: Date.now(),
      ...newNote,
      position: { x: Math.random() * 400, y: Math.random() * 300 + 100 },
      createdAt: new Date().toISOString().split('T')[0],
      pinned: false
    };
    setNotes([...notes, note]);
    setNewNote({ title: "", content: "", color: "bg-yellow-200", category: "general" });
  };

  const addReminder = () => {
    const reminder: Reminder = {
      id: Date.now(),
      ...newReminder,
      completed: false
    };
    setReminders([...reminders, reminder]);
    setNewReminder({
      title: "",
      description: "",
      dueDate: "",
      dueTime: "",
      priority: "medium",
      category: "general"
    });
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const togglePin = (id: number) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, pinned: !note.pinned } : note
    ));
  };

  const toggleReminder = (id: number) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
    ));
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "bg-blue-100 text-blue-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800"
    };
    return colors[priority as keyof typeof colors];
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  const upcomingReminders = reminders
    .filter(reminder => !reminder.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notes & Reminders</h2>
          <p className="text-muted-foreground">Organize your thoughts and stay on top of important tasks</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Reminder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Reminder</DialogTitle>
                <DialogDescription>Set up a reminder for important tasks</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    placeholder="Reminder title"
                    value={newReminder.title}
                    onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Reminder description"
                    value={newReminder.description}
                    onChange={(e) => setNewReminder({...newReminder, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Due Date</label>
                    <Input
                      type="date"
                      value={newReminder.dueDate}
                      onChange={(e) => setNewReminder({...newReminder, dueDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Due Time</label>
                    <Input
                      type="time"
                      value={newReminder.dueTime}
                      onChange={(e) => setNewReminder({...newReminder, dueTime: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <Select value={newReminder.priority} onValueChange={(value: any) => setNewReminder({...newReminder, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select value={newReminder.category} onValueChange={(value) => setNewReminder({...newReminder, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <DialogTrigger asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogTrigger>
                  <Button onClick={addReminder} variant="gradient">
                    <Bell className="w-4 h-4 mr-2" />
                    Create Reminder
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="gradient">
                <Plus className="w-4 h-4 mr-2" />
                Add Note
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Note</DialogTitle>
                <DialogDescription>Add a sticky note to your dashboard</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    placeholder="Note title"
                    value={newNote.title}
                    onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    placeholder="Note content"
                    value={newNote.content}
                    onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Color</label>
                    <div className="flex gap-2">
                      {noteColors.map(color => (
                        <button
                          key={color.class}
                          className={`w-8 h-8 rounded-full border-2 ${color.class} ${
                            newNote.color === color.class ? 'border-primary' : 'border-border'
                          }`}
                          onClick={() => setNewNote({...newNote, color: color.class})}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select value={newNote.category} onValueChange={(value) => setNewNote({...newNote, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <DialogTrigger asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogTrigger>
                  <Button onClick={addNote} variant="gradient">
                    <StickyNote className="w-4 h-4 mr-2" />
                    Create Note
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notes Canvas */}
        <Card className="lg:col-span-2 shadow-elegant">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <StickyNote className="w-5 h-5 text-primary" />
                Sticky Notes
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative min-h-[500px] bg-gradient-subtle rounded-lg p-4 overflow-hidden">
              {sortedNotes.map((note) => (
                <div
                  key={note.id}
                  className={`absolute w-64 p-4 rounded-lg shadow-md transition-all hover:shadow-lg animate-scale-in ${note.color} ${isMessagesPage ? 'cursor-move' : 'cursor-default'}`}
                  style={{
                    left: `${note.position.x}px`,
                    top: `${note.position.y}px`,
                    zIndex: note.pinned ? 10 : 1
                  }}
                  draggable={isMessagesPage}
                  onDragStart={(e) => {
                    if (!isMessagesPage) return;
                    setDraggedNoteId(note.id);
                    const rect = e.currentTarget.getBoundingClientRect();
                    setDragOffset({
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top
                    });
                  }}
                  onDragEnd={(e) => {
                    if (!isMessagesPage || !draggedNoteId) return;
                    const container = e.currentTarget.parentElement?.getBoundingClientRect();
                    if (!container) return;
                    
                    const x = e.clientX - container.left - dragOffset.x;
                    const y = e.clientY - container.top - dragOffset.y;
                    
                    setNotes(notes.map(n => 
                      n.id === draggedNoteId
                        ? { ...n, position: { x, y } }
                        : n
                    ));
                    setDraggedNoteId(null);
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm pr-2">{note.title}</h4>
                    <div className="flex gap-1">
                      <button
                        onClick={() => togglePin(note.id)}
                        className={`p-1 rounded transition-colors ${
                          note.pinned ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                        }`}
                      >
                        <Pin className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setEditingNote(note.id)}
                        className="p-1 rounded text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{note.content}</p>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <Badge variant="outline" className="text-xs">
                      {note.category}
                    </Badge>
                    <span>{note.createdAt}</span>
                  </div>
                  {note.pinned && (
                    <div className="absolute -top-1 -right-1">
                      <Pin className="w-4 h-4 text-primary" />
                    </div>
                  )}
                </div>
              ))}
              
              {sortedNotes.length === 0 && (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <StickyNote className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No notes yet. Create your first note!</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reminders */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Upcoming Reminders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingReminders.map((reminder) => (
              <div
                key={reminder.id}
                className="p-3 border rounded-lg space-y-2 hover:bg-accent transition-colors animate-fade-in"
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-sm">{reminder.title}</h4>
                  <div className="flex gap-1">
                    <Badge className={`text-xs ${getPriorityColor(reminder.priority)}`}>
                      {reminder.priority}
                    </Badge>
                    <button
                      onClick={() => toggleReminder(reminder.id)}
                      className="text-muted-foreground hover:text-success transition-colors"
                    >
                      <Clock className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{reminder.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {reminder.dueDate}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {reminder.dueTime}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {reminder.category}
                </Badge>
              </div>
            ))}
            
            {upcomingReminders.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No upcoming reminders</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}