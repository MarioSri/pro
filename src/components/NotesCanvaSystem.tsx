import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  StickyNote, 
  Plus, 
  Search, 
  Filter, 
  Palette, 
  Pin, 
  X, 
  Edit, 
  Save,
  Tag,
  Calendar,
  Bell,
  Trash2,
  Copy,
  Move,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  tags: string[];
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  zIndex: number;
}

interface NotesCanvaSystemProps {
  userRole: string;
}

export const NotesCanvaSystem: React.FC<NotesCanvaSystemProps> = ({ userRole }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [draggedNote, setDraggedNote] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [zoom, setZoom] = useState(1);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [newNotePosition, setNewNotePosition] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const maxZIndex = useRef(1);
  
  const { toast } = useToast();

  const noteColors = [
    { name: 'Yellow', class: 'bg-yellow-200 border-yellow-300', value: '#fef08a' },
    { name: 'Blue', class: 'bg-blue-200 border-blue-300', value: '#bfdbfe' },
    { name: 'Green', class: 'bg-green-200 border-green-300', value: '#bbf7d0' },
    { name: 'Pink', class: 'bg-pink-200 border-pink-300', value: '#fbcfe8' },
    { name: 'Purple', class: 'bg-purple-200 border-purple-300', value: '#e9d5ff' },
    { name: 'Orange', class: 'bg-orange-200 border-orange-300', value: '#fed7aa' },
    { name: 'Red', class: 'bg-red-200 border-red-300', value: '#fecaca' },
    { name: 'Gray', class: 'bg-gray-200 border-gray-300', value: '#e5e7eb' }
  ];

  useEffect(() => {
    const savedNotes = localStorage.getItem('canvasNotes');
    if (savedNotes) {
      const parsed = JSON.parse(savedNotes);
      setNotes(parsed.map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      })));
    }
  }, []);

  const saveNotes = (newNotes: Note[]) => {
    setNotes(newNotes);
    localStorage.setItem('canvasNotes', JSON.stringify(newNotes));
  };

  const createNote = (x: number, y: number) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: 'Click to edit...',
      color: noteColors[0].value,
      position: { x, y },
      size: { width: 200, height: 150 },
      tags: [],
      pinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      zIndex: ++maxZIndex.current
    };
    
    const updatedNotes = [...notes, newNote];
    saveNotes(updatedNotes);
    setSelectedNote(newNote.id);
    
    toast({
      title: "Note Created",
      description: "New sticky note added to canvas",
    });
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    const updatedNotes = notes.map(note => 
      note.id === id 
        ? { ...note, ...updates, updatedAt: new Date() }
        : note
    );
    saveNotes(updatedNotes);
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    saveNotes(updatedNotes);
    setSelectedNote(null);
    
    toast({
      title: "Note Deleted",
      description: "Sticky note removed from canvas",
    });
  };

  const duplicateNote = (id: string) => {
    const originalNote = notes.find(note => note.id === id);
    if (!originalNote) return;

    const newNote: Note = {
      ...originalNote,
      id: Date.now().toString(),
      title: `${originalNote.title} (Copy)`,
      position: { 
        x: originalNote.position.x + 20, 
        y: originalNote.position.y + 20 
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      zIndex: ++maxZIndex.current
    };
    
    const updatedNotes = [...notes, newNote];
    saveNotes(updatedNotes);
    
    toast({
      title: "Note Duplicated",
      description: "Note copied successfully",
    });
  };

  const togglePin = (id: string) => {
    updateNote(id, { pinned: !notes.find(n => n.id === id)?.pinned });
  };

  const bringToFront = (id: string) => {
    updateNote(id, { zIndex: ++maxZIndex.current });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - canvasOffset.x) / zoom;
      const y = (e.clientY - rect.top - canvasOffset.y) / zoom;
      
      if (isCreatingNote) {
        createNote(x, y);
        setIsCreatingNote(false);
      } else {
        setSelectedNote(null);
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    setDraggedNote(noteId);
    setSelectedNote(noteId);
    bringToFront(noteId);
    
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    dragOffset.current = {
      x: (e.clientX - rect.left) / zoom - note.position.x,
      y: (e.clientY - rect.top) / zoom - note.position.y
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedNote || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - canvasOffset.x) / zoom - dragOffset.current.x;
    const y = (e.clientY - rect.top - canvasOffset.y) / zoom - dragOffset.current.y;
    
    updateNote(draggedNote, { position: { x, y } });
  };

  const handleMouseUp = () => {
    setDraggedNote(null);
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !filterTag || note.tags.includes(filterTag);
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

  const convertToReminder = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;

    // This would integrate with the reminder system
    toast({
      title: "Reminder Created",
      description: `Reminder created from note: ${note.title}`,
    });
  };

  return (
    <div className="h-screen flex flex-col animate-fade-in">
      {/* Toolbar */}
      <Card className="shadow-elegant rounded-b-lg">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <StickyNote className="w-5 h-5 text-primary" />
              Notes Canvas
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsCreatingNote(!isCreatingNote)}
                variant={isCreatingNote ? "default" : "outline"}
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isCreatingNote ? 'Click canvas to add' : 'Add Note'}
              </Button>
              
              <div className="flex items-center gap-1">
                <Button
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                  variant="outline"
                  size="sm"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm px-2">{Math.round(zoom * 100)}%</span>
                <Button
                  onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                  variant="outline"
                  size="sm"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="">All tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
            
            <Badge variant="outline">
              {filteredNotes.length} notes
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden relative">
        <div
          ref={canvasRef}
          className="w-full h-full relative bg-gradient-subtle cursor-crosshair select-none"
          style={{
            transform: `scale(${zoom}) translate(${canvasOffset.x}px, ${canvasOffset.y}px)`,
            transformOrigin: '0 0'
          }}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(to right, #000 1px, transparent 1px),
                linear-gradient(to bottom, #000 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
          
          {/* Notes */}
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className={`absolute border-2 rounded-lg shadow-md cursor-move transition-all duration-200 ${
                selectedNote === note.id ? 'ring-2 ring-primary' : ''
              } ${note.pinned ? 'ring-1 ring-yellow-400' : ''}`}
              style={{
                left: note.position.x,
                top: note.position.y,
                width: note.size.width,
                height: note.size.height,
                backgroundColor: note.color,
                borderColor: note.color,
                zIndex: note.zIndex,
                transform: draggedNote === note.id ? 'rotate(2deg)' : 'rotate(0deg)'
              }}
              onMouseDown={(e) => handleMouseDown(e, note.id)}
            >
              {/* Note Header */}
              <div className="flex items-center justify-between p-2 border-b border-black/10">
                <input
                  type="text"
                  value={note.title}
                  onChange={(e) => updateNote(note.id, { title: e.target.value })}
                  className="bg-transparent border-none outline-none font-medium text-sm flex-1"
                  onClick={(e) => e.stopPropagation()}
                />
                
                <div className="flex items-center gap-1">
                  {note.pinned && <Pin className="w-3 h-3 text-yellow-600" />}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePin(note.id);
                    }}
                    className="p-1 hover:bg-black/10 rounded"
                  >
                    <Pin className={`w-3 h-3 ${note.pinned ? 'text-yellow-600' : 'text-gray-500'}`} />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    className="p-1 hover:bg-black/10 rounded"
                  >
                    <X className="w-3 h-3 text-gray-500" />
                  </button>
                </div>
              </div>
              
              {/* Note Content */}
              <textarea
                value={note.content}
                onChange={(e) => updateNote(note.id, { content: e.target.value })}
                className="w-full h-full p-2 bg-transparent border-none outline-none resize-none text-sm"
                style={{ height: note.size.height - 40 }}
                onClick={(e) => e.stopPropagation()}
                placeholder="Type your note here..."
              />
              
              {/* Note Footer */}
              <div className="absolute bottom-1 right-1 flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateNote(note.id);
                  }}
                  className="p-1 hover:bg-black/10 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Duplicate"
                >
                  <Copy className="w-3 h-3 text-gray-500" />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    convertToReminder(note.id);
                  }}
                  className="p-1 hover:bg-black/10 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Convert to Reminder"
                >
                  <Bell className="w-3 h-3 text-gray-500" />
                </button>
              </div>
              
              {/* Resize Handle */}
              <div
                className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize opacity-50 hover:opacity-100"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  // Handle resize logic here
                }}
              >
                <div className="w-full h-full bg-gray-400 rounded-tl-lg" />
              </div>
            </div>
          ))}
          
          {/* Empty State */}
          {notes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <StickyNote className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No notes yet</p>
                <p className="text-sm">Click "Add Note" to create your first sticky note</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Note Properties Panel */}
      {selectedNote && (
        <Card className="absolute top-20 right-4 w-64 shadow-elegant animate-scale-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Note Properties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(() => {
              const note = notes.find(n => n.id === selectedNote);
              if (!note) return null;
              
              return (
                <>
                  <div>
                    <Label className="text-xs">Color</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {noteColors.map((color) => (
                        <button
                          key={color.value}
                          className={`w-6 h-6 rounded border-2 ${
                            note.color === color.value ? 'border-primary' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => updateNote(note.id, { color: color.value })}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs">Tags</Label>
                    <Input
                      placeholder="Add tags (comma separated)"
                      value={note.tags.join(', ')}
                      onChange={(e) => {
                        const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                        updateNote(note.id, { tags });
                      }}
                      className="text-xs"
                    />
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    <p>Created: {note.createdAt.toLocaleDateString()}</p>
                    <p>Updated: {note.updatedAt.toLocaleDateString()}</p>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => duplicateNote(note.id)}
                      className="flex-1 text-xs"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => convertToReminder(note.id)}
                      className="flex-1 text-xs"
                    >
                      <Bell className="w-3 h-3 mr-1" />
                      Remind
                    </Button>
                  </div>
                </>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );
};