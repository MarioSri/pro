import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square, 
  Download, 
  FileText, 
  Save,
  Waveform,
  Brain,
  Volume2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AudioNotesGeneratorProps {
  userRole: string;
}

export const AudioNotesGenerator: React.FC<AudioNotesGeneratorProps> = ({ userRole }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentType, setDocumentType] = useState("letter");
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timerRef = useRef<NodeJS.Timeout>();
  
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
        processAudioToText(blob);
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Start waveform animation
      drawWaveform(stream);
      
      toast({
        title: "Recording Started",
        description: "Speak clearly for best transcription results",
      });
    } catch (error) {
      toast({
        title: "Microphone Error",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      toast({
        title: "Recording Stopped",
        description: "Processing audio for transcription...",
      });
    }
  };

  const drawWaveform = (stream: MediaStream) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    
    source.connect(analyser);
    analyser.fftSize = 256;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isRecording) return;
      
      animationRef.current = requestAnimationFrame(draw);
      
      analyser.getByteFrequencyData(dataArray);
      
      ctx.fillStyle = 'hsl(var(--background))';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
        
        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, 'hsl(var(--primary))');
        gradient.addColorStop(1, 'hsl(var(--primary-glow))');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
      }
    };
    
    draw();
  };

  const processAudioToText = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    // Simulate AI transcription processing
    setTimeout(() => {
      const mockTranscript = `This is a simulated transcription of the recorded audio. In a real implementation, this would use services like OpenAI Whisper, Google Speech-to-Text, or Azure Speech Services to convert the audio to text. The transcription would appear here in real-time as the audio is processed.

Key points from the recording:
- Document submission request
- Meeting scheduling discussion
- Budget allocation review
- Faculty development program details

This transcript can be edited and formatted into a proper document using the controls below.`;
      
      setTranscript(mockTranscript);
      setIsProcessing(false);
      
      toast({
        title: "Transcription Complete",
        description: "Audio has been converted to text successfully",
      });
    }, 3000);
  };

  const playAudio = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const saveDocument = () => {
    if (!transcript.trim()) {
      toast({
        title: "No Content",
        description: "Please record audio and generate transcript first",
        variant: "destructive"
      });
      return;
    }

    const documentData = {
      title: documentTitle || "Audio Generated Document",
      type: documentType,
      content: transcript,
      audioUrl: audioUrl,
      createdAt: new Date().toISOString(),
      duration: recordingTime
    };

    // Save to localStorage for demo
    const savedDocs = JSON.parse(localStorage.getItem('audioDocuments') || '[]');
    savedDocs.push(documentData);
    localStorage.setItem('audioDocuments', JSON.stringify(savedDocs));

    toast({
      title: "Document Saved",
      description: "Audio-generated document saved successfully",
    });
  };

  const exportDocument = (format: 'pdf' | 'docx' | 'txt') => {
    if (!transcript.trim()) {
      toast({
        title: "No Content",
        description: "Please generate transcript first",
        variant: "destructive"
      });
      return;
    }

    // Create downloadable content
    const content = `${documentTitle || 'Audio Generated Document'}\n\n${transcript}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentTitle || 'audio-document'}.${format === 'txt' ? 'txt' : format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Document Exported",
      description: `Document exported as ${format.toUpperCase()}`,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Recording Controls */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-primary" />
            Live Audio-to-Notes Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Recording Button */}
          <div className="flex flex-col items-center space-y-4">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              size="lg"
              variant={isRecording ? "destructive" : "default"}
              className={`w-20 h-20 rounded-full text-lg font-semibold transition-all duration-300 ${
                isRecording ? 'animate-pulse shadow-glow' : 'hover:scale-105'
              }`}
            >
              {isRecording ? <Square className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {isRecording ? 'Recording...' : 'Tap to start recording'}
              </p>
              {recordingTime > 0 && (
                <Badge variant="outline" className="mt-2">
                  {formatTime(recordingTime)}
                </Badge>
              )}
            </div>
          </div>

          {/* Waveform Visualization */}
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              width={300}
              height={100}
              className="border rounded-lg bg-muted/30"
            />
          </div>

          {/* Audio Playback Controls */}
          {audioUrl && (
            <div className="flex items-center justify-center gap-4 p-4 bg-muted/30 rounded-lg">
              <Button
                onClick={playAudio}
                variant="outline"
                size="sm"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
              <span className="text-sm text-muted-foreground">
                Audio recorded ({formatTime(recordingTime)})
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transcription Display */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Live Transcription
            {isProcessing && (
              <Badge variant="outline" className="animate-pulse">
                Processing...
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64 w-full border rounded-lg p-4">
            {isProcessing ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Converting audio to text...</p>
                </div>
              </div>
            ) : transcript ? (
              <Textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="min-h-[200px] border-none resize-none focus:ring-0"
                placeholder="Transcribed text will appear here..."
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <Waveform className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Start recording to see live transcription</p>
                </div>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Document Creation */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Document Creation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doc-title">Document Title</Label>
              <Input
                id="doc-title"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                placeholder="Enter document title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doc-type">Document Type</Label>
              <select
                id="doc-type"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="letter">Letter</option>
                <option value="circular">Circular</option>
                <option value="report">Report</option>
                <option value="memo">Memo</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-4">
            <Button onClick={saveDocument} variant="default">
              <Save className="w-4 h-4 mr-2" />
              Save Document
            </Button>
            <Button onClick={() => exportDocument('pdf')} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button onClick={() => exportDocument('docx')} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export DOCX
            </Button>
            <Button onClick={() => exportDocument('txt')} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export TXT
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};