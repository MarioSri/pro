import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RecipientSelector } from "@/components/RecipientSelector";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  FileText,
  Image,
  File,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  Send,
  Plus
} from "lucide-react";
import { LoadingState } from "@/components/ui/loading-states";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DocumentUploaderProps {
  userRole: string;
  onSubmit: (data: any) => void;
}

export function DocumentUploader({ userRole, onSubmit }: DocumentUploaderProps) {
  const { toast } = useToast();
  const [documentTypes, setDocumentTypes] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("normal");

  const documentTypeOptions = [
    { id: "letter", label: "Letter", icon: FileText },
    { id: "circular", label: "Circular", icon: File },
    { id: "report", label: "Report", icon: FileText },
  ];

  const handleDocumentTypeChange = (typeId: string, checked: boolean) => {
    if (checked) {
      setDocumentTypes([...documentTypes, typeId]);
    } else {
      setDocumentTypes(documentTypes.filter(id => id !== typeId));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // Check if required fields are filled
    if (documentTypes.length === 0) {
      toast({
        title: "Document Type Required",
        description: "Please select at least one document type.",
        variant: "destructive",
      });
      return;
    }
    
    if (uploadedFiles.length === 0) {
      toast({
        title: "File Upload Required",
        description: "Please upload at least one file to submit.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedRecipients.length === 0) {
      toast({
        title: "Recipients Required", 
        description: "Please select at least one recipient for the document.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    // Show success toast
    toast({
      title: "Document Submitted Successfully",
      description: "Your document has been submitted and is being processed.",
    });
    
    // Simulate upload process with loading animation
    setTimeout(() => {
      const data = {
        documentTypes,
        files: uploadedFiles,
        recipients: selectedRecipients,
        description,
        priority,
        timestamp: new Date().toISOString(),
      };
      onSubmit(data);
      setIsUploading(false);
    }, 2000);
  };

  const handleAddHierarchy = () => {
    toast({
      title: "Hierarchy Management",
      description: "Document hierarchy management is available for advanced workflow configuration.",
      variant: "default"
    });
  };

  // Enable the button but show validation messages on click
  const isSubmitDisabled = false;

  return (
    <div className="space-y-6">
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Submit Document
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Document Type Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Document Type</Label>
            <div className="grid grid-cols-3 gap-3">
              {documentTypeOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent transition-colors">
                  <Checkbox
                    id={option.id}
                    checked={documentTypes.includes(option.id)}
                    onCheckedChange={(checked) => handleDocumentTypeChange(option.id, !!checked)}
                  />
                  <Label htmlFor={option.id} className="flex items-center gap-2 cursor-pointer">
                    <option.icon className="w-4 h-4" />
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Upload Documents</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xlsx,.xls,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                title="Upload document files"
              />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <div className="space-y-2">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop files here, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports: PDF, DOC, DOCX, XLS, XLSX, PNG, JPG, JPEG
                  </p>
                </div>
              </Label>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Uploaded Files</Label>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-accent rounded-md">
                    <div className="flex items-center gap-2">
                      <File className="w-4 h-4 text-primary" />
                      <span className="text-sm">{file.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {(file.size / 1024 / 1024).toFixed(1)} MB
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                      className="h-6 w-6"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Document Management Recipients */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Document Management Recipients</Label>
            <RecipientSelector
              userRole={userRole}
              selectedRecipients={selectedRecipients}
              onRecipientsChange={setSelectedRecipients}
            />
            
            {/* Add Hierarchy Button (Optional) */}
            <div className="flex justify-center pt-2">
              <Button 
                onClick={handleAddHierarchy}
                className="flex items-center gap-2 transition-all duration-700 ease-out flex-shrink-0"
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4" />
                Add Hierarchy
              </Button>
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Priority Level</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    Normal Priority
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-warning" />
                    High Priority
                  </div>
                </SelectItem>
                <SelectItem value="urgent">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                    Urgent
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <Label htmlFor="description" className="text-base font-medium">
              Description / Comments
            </Label>
            <Textarea
              id="description"
              placeholder="Provide additional context or instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            {isUploading ? (
              <LoadingState 
                type="spinner" 
                message="Uploading document..." 
                className="py-4"
              />
            ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
              variant="gradient"
              size="lg"
              className="min-w-32"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Document
            </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}