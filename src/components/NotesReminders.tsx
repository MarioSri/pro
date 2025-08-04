import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Plus,
  X,
  Edit,
  Save,
  Bell,
  Calendar,
  Clock,
  Pin,
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

interface Message {
  id: number;
  title: string;
  content: string;
  sender: string;
  recipient: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

interface NotesRemindersProps {
  userRole: string;
}

export function NotesReminders({ userRole }: NotesRemindersProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      title: "Document Review Request",
      content: "Please review the attached faculty recruitment proposal and provide feedback by EOD.",
      sender: "Principal",
      recipient: userRole,
      timestamp: "2024-01-15 10:30 AM",
      read: false,
      priority: "high",
      category: "review"
    },
    {
      id: 2,
      title: "Meeting Confirmation",
      content: "Confirming your attendance for tomorrow's budget review meeting at 2:00 PM.",
      sender: "Registrar",
      recipient: userRole,
      timestamp: "2024-01-14 3:45 PM",
      read: true,
      priority: "medium",
      category: "meeting"
    }
  ]);

  const [newMessage, setNewMessage] = useState({
    title: "",
    content: "",
    recipient: "",
    priority: "medium" as const,
    category: "general"
  });

  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    "general", "review", "meeting", "urgent", "information", "request"
  ];

  const recipients = [
    "Principal", "Registrar", "HOD-EEE", "HOD-MECH", "HOD-CSE", "HOD-ECE", "HOD-CSM-CSO", "HOD-CSD-CSC"
  ];

  const addMessage = () => {
    const message: Message = {
      id: Date.now(),
      ...newMessage,
      sender: userRole,
      timestamp: new Date().toLocaleString(),
      read: false
    };
    setMessages([message, ...messages]);
    setNewMessage({ title: "", content: "", recipient: "", priority: "medium", category: "general" });
  };

  const markAsRead = (id: number) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, read: true } : msg
    ));
  };

  const deleteMessage = (id: number) => {
    setMessages(messages.filter(msg => msg.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "bg-blue-100 text-blue-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800"
    };
    return colors[priority as keyof typeof colors];
  };

  const filteredMessages = messages.filter(message => 
    message.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.sender.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Internal Messages</h2>
          <p className="text-muted-foreground">Communicate with colleagues and track important messages</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="gradient">
                <Plus className="w-4 h-4 mr-2" />
                New Message
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send New Message</DialogTitle>
                <DialogDescription>Send a message to a colleague</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    placeholder="Message title"
                    value={newMessage.title}
                    onChange={(e) => setNewMessage({...newMessage, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    placeholder="Message content"
                    value={newMessage.content}
                    onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Recipient</label>
                    <Select value={newMessage.recipient} onValueChange={(value) => setNewMessage({...newMessage, recipient: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipient" />
                      </SelectTrigger>
                      <SelectContent>
                        {recipients.map(recipient => (
                          <SelectItem key={recipient} value={recipient}>{recipient}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <Select value={newMessage.priority} onValueChange={(value: any) => setNewMessage({...newMessage, priority: value})}>
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
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={newMessage.category} onValueChange={(value) => setNewMessage({...newMessage, category: value})}>
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
                <div className="flex justify-end gap-2 pt-4">
                  <DialogTrigger asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogTrigger>
                  <Button onClick={addMessage} variant="gradient">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <Card className="shadow-elegant">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Messages ({filteredMessages.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`p-4 border rounded-lg transition-colors hover:bg-accent ${
                !message.read ? 'bg-primary/5 border-primary/20' : ''
              }`}
              onClick={() => markAsRead(message.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className={`font-medium ${!message.read ? 'font-semibold' : ''}`}>
                  {message.title}
                </h4>
                <div className="flex items-center gap-2">
                  <Badge className={getPriorityColor(message.priority)}>
                    {message.priority}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMessage(message.id);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{message.content}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>From: {message.sender}</span>
                  <span>{message.timestamp}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {message.category}
                </Badge>
              </div>
            </div>
          ))}
          
          {filteredMessages.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No messages found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}