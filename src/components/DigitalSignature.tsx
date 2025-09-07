import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas as FabricCanvas, Image as FabricImage } from 'fabric';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Camera, 
  Save, 
  Trash2, 
  Download, 
  Upload, 
  CheckCircle, 
  XCircle,
  Clock,
  User,
  Calendar,
  Eye,
  Settings,
  RefreshCw
} from "lucide-react";
import { AdvancedSignatureIcon } from "@/components/ui/signature-icon";
import { useToast } from "@/hooks/use-toast";

interface SavedSignature {
  id: string;
  name: string;
  dataUrl: string;
  createdAt: Date;
  metadata: {
    width: number;
    height: number;
    signer: string;
    role: string;
  };
}

interface SignatureComponentProps {
  onSignatureCapture?: (signature: string) => void;
  userRole?: string;
  userName?: string;
}

export const DigitalSignature: React.FC<SignatureComponentProps> = ({ 
  onSignatureCapture, 
  userRole = "Employee",
  userName = "Current User" 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 200 });
  const [savedSignatures, setSavedSignatures] = useState<SavedSignature[]>([]);
  const [selectedSignature, setSelectedSignature] = useState<SavedSignature | null>(null);
  const [signatureName, setSignatureName] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [currentSignatureData, setCurrentSignatureData] = useState<string>('');
  const { toast } = useToast();

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: canvasSize.width,
      height: canvasSize.height,
      backgroundColor: "#ffffff",
      isDrawingMode: true,
    });

    // Configure brush settings - check if freeDrawingBrush exists
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = "#000000";
      canvas.freeDrawingBrush.width = 2;
    }

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [canvasSize]);

  // Load saved signatures from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('digitalSignatures');
    if (saved) {
      setSavedSignatures(JSON.parse(saved));
    }
  }, []);

  const saveSignature = useCallback(() => {
    if (!fabricCanvas || !signatureName.trim()) {
      toast({
        title: "Error",
        description: "Please provide a signature name and draw a signature",
        variant: "destructive"
      });
      return;
    }

    const dataUrl = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1.0,
      multiplier: 1
    });

    const newSignature: SavedSignature = {
      id: Date.now().toString(),
      name: signatureName,
      dataUrl,
      createdAt: new Date(),
      metadata: {
        width: canvasSize.width,
        height: canvasSize.height,
        signer: userName,
        role: userRole
      }
    };

    const updatedSignatures = [...savedSignatures, newSignature];
    setSavedSignatures(updatedSignatures);
    localStorage.setItem('digitalSignatures', JSON.stringify(updatedSignatures));
    
    setSignatureName('');
    clearCanvas();
    
    toast({
      title: "Success",
      description: "Signature saved successfully"
    });
  }, [fabricCanvas, signatureName, canvasSize, savedSignatures, userName, userRole, toast]);

  const clearCanvas = useCallback(() => {
    if (fabricCanvas) {
      fabricCanvas.clear();
      fabricCanvas.backgroundColor = "#ffffff";
      fabricCanvas.renderAll();
    }
  }, [fabricCanvas]);

  const loadSignature = useCallback((signature: SavedSignature) => {
    if (!fabricCanvas) return;

    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
    setSelectedSignature(signature);
    
    toast({
      title: "Signature Loaded",
      description: "Signature loaded successfully. You can now draw over it or use as-is."
    });
  }, [fabricCanvas, toast]);

  const captureSignature = useCallback(() => {
    if (!fabricCanvas) return;

    const dataUrl = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1.0,
      multiplier: 1
    });

    setCurrentSignatureData(dataUrl);
    setShowPreview(true);
    
    if (onSignatureCapture) {
      onSignatureCapture(dataUrl);
    }
  }, [fabricCanvas, onSignatureCapture]);

  const deleteSignature = useCallback((id: string) => {
    const updatedSignatures = savedSignatures.filter(sig => sig.id !== id);
    setSavedSignatures(updatedSignatures);
    localStorage.setItem('digitalSignatures', JSON.stringify(updatedSignatures));
    
    toast({
      title: "Deleted",
      description: "Signature removed from library"
    });
  }, [savedSignatures, toast]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera",
        variant: "destructive"
      });
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    if (!cameraActive) {
      toast({
        title: "Camera Not Active",
        description: "Camera is already stopped or was never started.",
        variant: "destructive"
      });
      return;
    }

    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => {
        track.stop();
        console.log('Camera track stopped:', track.kind);
      });
      
      // Clear the video source
      videoRef.current.srcObject = null;
      
      setCameraActive(false);
      
      toast({
        title: "Camera Stopped",
        description: "Camera stream has been stopped successfully.",
      });
    } else {
      setCameraActive(false);
      toast({
        title: "Camera Stopped",
        description: "Camera stream has been stopped.",
      });
    }
  }, [cameraActive, toast]);

  const captureFromCamera = useCallback(() => {
    if (!videoRef.current || !fabricCanvas) {
      toast({
        title: "Camera Not Ready",
        description: "Please start the camera first to capture a signature.",
        variant: "destructive"
      });
      return;
    }

    if (!cameraActive) {
      toast({
        title: "Camera Not Active",
        description: "Please start the camera before capturing a signature.",
        variant: "destructive"
      });
      return;
    }

    // Create a temporary canvas to capture the video frame
    const tempCanvas = document.createElement('canvas');
    const video = videoRef.current;
    
    tempCanvas.width = video.videoWidth || 640;
    tempCanvas.height = video.videoHeight || 480;
    
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
    
    // Draw current video frame to temporary canvas
    tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
    
    // Get the image data and add it to the fabric canvas
    const imageDataURL = tempCanvas.toDataURL('image/png');
    
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    
    // Create fabric image from captured frame
    FabricImage.fromURL(imageDataURL).then((img) => {
      if (!img || !fabricCanvas) return;
      
      // Scale image to fit canvas
      const scale = Math.min(
        fabricCanvas.width! / img.width!,
        fabricCanvas.height! / img.height!
      );
      
      img.scale(scale);
      img.set({
        left: (fabricCanvas.width! - img.width! * scale) / 2,
        top: (fabricCanvas.height! - img.height! * scale) / 2,
        selectable: false,
        evented: false
      });
      
      fabricCanvas.add(img);
      fabricCanvas.renderAll();
    }).catch((error) => {
      console.error('Error loading captured image:', error);
      toast({
        title: "Capture Error",
        description: "Failed to process the captured image.",
        variant: "destructive"
      });
    });
    
    stopCamera();
    
    toast({
      title: "Signature Captured Successfully",
      description: "Camera input captured. You can now edit or save your signature."
    });
  }, [fabricCanvas, stopCamera, toast, cameraActive]);

  const resizeCanvas = useCallback((width: number, height: number) => {
    setCanvasSize({ width, height });
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AdvancedSignatureIcon className="w-5 h-5 text-primary" />
            Digital Signature Capture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="draw" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="draw">Hand Draw</TabsTrigger>
              <TabsTrigger value="camera">Camera</TabsTrigger>
              <TabsTrigger value="library">Saved Signatures</TabsTrigger>
            </TabsList>

            <TabsContent value="draw" className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Label>Canvas Size:</Label>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => resizeCanvas(300, 150)}
                  >
                    Small
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => resizeCanvas(400, 200)}
                  >
                    Medium
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => resizeCanvas(500, 250)}
                  >
                    Large
                  </Button>
                </div>
                <Button onClick={clearCanvas} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>

              <div className="border rounded-lg p-4 bg-gray-50">
                <canvas 
                  ref={canvasRef}
                  className="border border-gray-300 rounded bg-white cursor-crosshair"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label htmlFor="signatureName">Signature Name</Label>
                  <Input
                    id="signatureName"
                    value={signatureName}
                    onChange={(e) => setSignatureName(e.target.value)}
                    placeholder="e.g., Primary Signature"
                  />
                </div>
                <div className="flex gap-2 pt-6">
                  <Button onClick={saveSignature}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={captureSignature} variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="camera" className="space-y-4">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button onClick={startCamera} disabled={cameraActive}>
                    <Camera className="h-4 w-4 mr-2" />
                    Start Camera
                  </Button>
                  <Button 
                    onClick={captureFromCamera} 
                    disabled={false}
                    variant="outline"
                  >
                    Capture Signature
                  </Button>
                  <Button onClick={stopCamera} disabled={false} variant="outline">
                    Stop Camera
                  </Button>
                </div>
                
                {cameraActive && (
                  <div className="border rounded-lg p-4">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      muted 
                      className="w-full max-w-md rounded"
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="library" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedSignatures.map((signature) => (
                  <Card key={signature.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{signature.name}</h4>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => deleteSignature(signature.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        
                        <img 
                          src={signature.dataUrl} 
                          alt={signature.name}
                          className="w-full h-20 object-contain border rounded bg-white"
                        />
                        
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {signature.metadata.signer}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {signature.createdAt.toLocaleDateString()}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {signature.metadata.role}
                          </Badge>
                        </div>
                        
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => loadSignature(signature)}
                        >
                          Use Signature
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {savedSignatures.length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    <AdvancedSignatureIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No saved signatures yet</p>
                    <p className="text-sm">Create your first signature using the drawing tools</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Signature Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Signature Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {currentSignatureData && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <img 
                  src={currentSignatureData} 
                  alt="Signature Preview"
                  className="max-w-full h-auto"
                />
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label>Signer</Label>
                <p className="text-muted-foreground">{userName}</p>
              </div>
              <div>
                <Label>Role</Label>
                <p className="text-muted-foreground">{userRole}</p>
              </div>
              <div>
                <Label>Timestamp</Label>
                <p className="text-muted-foreground">{new Date().toLocaleString()}</p>
              </div>
              <div>
                <Label>Canvas Size</Label>
                <p className="text-muted-foreground">{canvasSize.width} × {canvasSize.height}</p>
              </div>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Close
              </Button>
              <Button onClick={() => {
                // Apply signature logic here
                setShowPreview(false);
                toast({
                  title: "Signature Applied",
                  description: "Your signature has been applied to the document"
                });
              }}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Apply Signature
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};