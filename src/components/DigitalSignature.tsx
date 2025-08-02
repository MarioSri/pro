import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  PenTool,
  Upload,
  Save,
  Trash2,
  CheckCircle,
  RotateCcw,
  Camera,
  FileImage,
  User,
  Calendar,
  Clock
} from "lucide-react";

interface DigitalSignatureProps {
  document?: any;
  onSignature?: (signatureData: string) => void;
  userRole: string;
}

export function DigitalSignature({ document, onSignature, userRole }: DigitalSignatureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [savedSignatures, setSavedSignatures] = useState<string[]>([]);
  const [selectedSignature, setSelectedSignature] = useState<string>("");
  const [signatureMode, setSignatureMode] = useState<"draw" | "upload" | "saved">("draw");

  // Mock document for signature
  const mockDocument = document || {
    id: "DOC-2024-001",
    title: "Faculty Recruitment Authorization",
    submittedBy: "Dr. Sharma (HOD-CSE)",
    submittedDate: "2024-01-15",
    status: "pending-signature"
  };

  useEffect(() => {
    // Load saved signatures from localStorage
    const saved = localStorage.getItem(`signatures-${userRole}`);
    if (saved) {
      setSavedSignatures(JSON.parse(saved));
    }
  }, [userRole]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL();
    const newSignatures = [...savedSignatures, dataURL];
    setSavedSignatures(newSignatures);
    localStorage.setItem(`signatures-${userRole}`, JSON.stringify(newSignatures));
  };

  const applySignature = () => {
    const canvas = canvasRef.current;
    let signatureData = "";
    
    if (signatureMode === "draw" && canvas) {
      signatureData = canvas.toDataURL();
    } else if (signatureMode === "saved" && selectedSignature) {
      signatureData = selectedSignature;
    }
    
    if (signatureData && onSignature) {
      onSignature(signatureData);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Document Information */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-primary" />
            Digital Signature Required
          </CardTitle>
          <CardDescription>
            Please review and sign the document below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Document ID:</span>
                <span className="ml-2">{mockDocument.id}</span>
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <Badge variant="warning" className="ml-2">Pending Signature</Badge>
              </div>
              <div>
                <span className="font-medium">Submitted By:</span>
                <span className="ml-2">{mockDocument.submittedBy}</span>
              </div>
              <div>
                <span className="font-medium">Date:</span>
                <span className="ml-2">{mockDocument.submittedDate}</span>
              </div>
            </div>
            <Separator className="my-4" />
            <div>
              <h4 className="font-medium mb-2">{mockDocument.title}</h4>
              <p className="text-muted-foreground text-sm">
                This document requires your digital signature for approval. Please review the content carefully before signing.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Signature Methods */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle>Choose Signature Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={signatureMode === "draw" ? "default" : "outline"}
              onClick={() => setSignatureMode("draw")}
              className="flex-1"
            >
              <PenTool className="w-4 h-4 mr-2" />
              Draw Signature
            </Button>
            <Button
              variant={signatureMode === "saved" ? "default" : "outline"}
              onClick={() => setSignatureMode("saved")}
              className="flex-1"
              disabled={savedSignatures.length === 0}
            >
              <Save className="w-4 h-4 mr-2" />
              Use Saved ({savedSignatures.length})
            </Button>
            <Button
              variant={signatureMode === "upload" ? "default" : "outline"}
              onClick={() => setSignatureMode("upload")}
              className="flex-1"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
            </Button>
          </div>

          {/* Draw Signature */}
          {signatureMode === "draw" && (
            <div className="space-y-4 animate-scale-in">
              <div className="border-2 border-dashed border-border rounded-lg p-4">
                <Label className="text-sm font-medium mb-2 block">
                  Draw your signature below:
                </Label>
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={200}
                  className="border border-border rounded-md bg-white cursor-crosshair w-full max-w-full"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" onClick={clearCanvas}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                  <Button variant="outline" size="sm" onClick={saveSignature}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Signature
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Saved Signatures */}
          {signatureMode === "saved" && savedSignatures.length > 0 && (
            <div className="space-y-4 animate-scale-in">
              <Label className="text-sm font-medium">Select a saved signature:</Label>
              <div className="grid grid-cols-2 gap-3">
                {savedSignatures.map((sig, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${
                      selectedSignature === sig ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                    onClick={() => setSelectedSignature(sig)}
                  >
                    <img
                      src={sig}
                      alt={`Signature ${index + 1}`}
                      className="w-full h-16 object-contain"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-muted-foreground">
                        Signature {index + 1}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newSignatures = savedSignatures.filter((_, i) => i !== index);
                          setSavedSignatures(newSignatures);
                          localStorage.setItem(`signatures-${userRole}`, JSON.stringify(newSignatures));
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Signature */}
          {signatureMode === "upload" && (
            <div className="space-y-4 animate-scale-in">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="signature-upload"
                />
                <Label htmlFor="signature-upload" className="cursor-pointer">
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Upload signature image
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG up to 2MB
                    </p>
                  </div>
                </Label>
              </div>
            </div>
          )}

          {/* Signature Actions */}
          <div className="flex justify-between pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>Signing as: {userRole.charAt(0).toUpperCase() + userRole.slice(1)}</span>
            </div>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    Preview Document
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Document Preview</DialogTitle>
                    <DialogDescription>
                      Review the document before signing
                    </DialogDescription>
                  </DialogHeader>
                  <div className="bg-muted/30 rounded-lg p-6 min-h-[400px] flex items-center justify-center">
                    <p className="text-muted-foreground">Document preview would appear here</p>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant="gradient"
                onClick={applySignature}
                className="min-w-32"
                disabled={
                  (signatureMode === "saved" && !selectedSignature) ||
                  (signatureMode === "upload")
                }
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Sign Document
              </Button>
            </div>
          </div>

          {/* Signature Metadata */}
          <div className="bg-muted/20 rounded-lg p-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Date: {new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Time: {new Date().toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>IP: 192.168.1.100</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}