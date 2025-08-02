import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Search, Users, X, ChevronDown, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface RecipientSelectorProps {
  userRole: string;
  selectedRecipients: string[];
  onRecipientsChange: (recipients: string[]) => void;
}

interface RecipientGroup {
  title: string;
  recipients: Array<{
    id: string;
    name: string;
    role: string;
    department?: string;
  }>;
}

export function RecipientSelector({ userRole, selectedRecipients, onRecipientsChange }: RecipientSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["hods", "admins"]);

  const recipientGroups: RecipientGroup[] = [
    {
      title: "Heads of Departments",
      recipients: [
        { id: "hod-eee", name: "Dr. Rajesh Kumar", role: "HOD", department: "EEE" },
        { id: "hod-mech", name: "Dr. Priya Sharma", role: "HOD", department: "MECH" },
        { id: "hod-cse", name: "Dr. Anil Verma", role: "HOD", department: "CSE" },
        { id: "hod-ece", name: "Dr. Sunita Rao", role: "HOD", department: "ECE" },
        { id: "hod-csm", name: "Dr. Vikram Singh", role: "HOD", department: "CSM & CSO" },
        { id: "hod-csd", name: "Dr. Meera Gupta", role: "HOD", department: "CSD & CSC" },
      ]
    },
    {
      title: "Administrative Roles",
      recipients: [
        { id: "principal", name: "Dr. A.K. Sharma", role: "Principal" },
        { id: "registrar", name: "Dr. B.N. Reddy", role: "Registrar" },
        { id: "dean", name: "Dr. C.P. Singh", role: "Dean" },
        { id: "chairman", name: "Dr. D.R. Gupta", role: "Chairman" },
        { id: "director", name: "Dr. E.S. Kumar", role: "Director" },
        { id: "cdc", name: "Dr. F.T. Sharma", role: "CDC" },
      ]
    },
    {
      title: "Program Heads (All Branches)",
      recipients: [
        { id: "ph-cse-1", name: "Dr. Amit Shah", role: "Program Head", department: "CSE - Year 1" },
        { id: "ph-cse-2", name: "Dr. Neha Patel", role: "Program Head", department: "CSE - Year 2" },
        { id: "ph-ece-1", name: "Dr. Ravi Mehta", role: "Program Head", department: "ECE - Year 1" },
        { id: "ph-eee-1", name: "Dr. Sita Ram", role: "Program Head", department: "EEE - Year 1" },
        { id: "ph-mech-1", name: "Dr. Kiran Joshi", role: "Program Head", department: "MECH - Year 1" },
      ]
    },
    {
      title: "Specialized Roles",
      recipients: [
        { id: "controller", name: "Dr. G.H. Kumar", role: "Controller of Examinations" },
        { id: "asst-dean", name: "Dr. H.I. Verma", role: "Asst. Dean IIIC" },
        { id: "head-ops", name: "Mr. I.J. Singh", role: "Head Operations" },
        { id: "librarian", name: "Mrs. J.K. Sharma", role: "Librarian" },
        { id: "ssg", name: "Mr. K.L. Gupta", role: "SSG" },
      ]
    }
  ];

  // Filter recipients based on user role permissions
  const getAuthorizedGroups = () => {
    if (userRole === "principal") {
      return recipientGroups; // Principal can send to anyone
    }
    if (userRole === "registrar") {
      return recipientGroups.filter(group => 
        ["Heads of Departments", "Administrative Roles", "Program Heads (All Branches)"].includes(group.title)
      );
    }
    if (userRole.includes("hod")) {
      return recipientGroups.filter(group => 
        ["Administrative Roles", "Program Heads (All Branches)", "Specialized Roles"].includes(group.title)
      );
    }
    // Default for employees
    return recipientGroups.filter(group => 
      ["Heads of Departments", "Administrative Roles"].includes(group.title)
    );
  };

  const authorizedGroups = getAuthorizedGroups();

  const filteredGroups = authorizedGroups.map(group => ({
    ...group,
    recipients: group.recipients.filter(recipient =>
      recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipient.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipient.department?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(group => group.recipients.length > 0);

  const handleRecipientToggle = (recipientId: string) => {
    const updatedRecipients = selectedRecipients.includes(recipientId)
      ? selectedRecipients.filter(id => id !== recipientId)
      : [...selectedRecipients, recipientId];
    onRecipientsChange(updatedRecipients);
  };

  const handleGroupSelectAll = (groupRecipients: any[]) => {
    const groupIds = groupRecipients.map(r => r.id);
    const allSelected = groupIds.every(id => selectedRecipients.includes(id));
    
    if (allSelected) {
      onRecipientsChange(selectedRecipients.filter(id => !groupIds.includes(id)));
    } else {
      const newRecipients = [...new Set([...selectedRecipients, ...groupIds])];
      onRecipientsChange(newRecipients);
    }
  };

  const toggleGroupExpansion = (groupTitle: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupTitle) 
        ? prev.filter(title => title !== groupTitle)
        : [...prev, groupTitle]
    );
  };

  const removeRecipient = (recipientId: string) => {
    onRecipientsChange(selectedRecipients.filter(id => id !== recipientId));
  };

  const getRecipientName = (id: string) => {
    for (const group of recipientGroups) {
      const recipient = group.recipients.find(r => r.id === id);
      if (recipient) return `${recipient.name} (${recipient.role})`;
    }
    return id;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Select Recipients
        </CardTitle>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search recipients by name, role, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Selected Recipients */}
        {selectedRecipients.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Selected ({selectedRecipients.length})</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onRecipientsChange([])}
              >
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedRecipients.map(id => (
                <Badge key={id} variant="secondary" className="flex items-center gap-1">
                  {getRecipientName(id)}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-destructive" 
                    onClick={() => removeRecipient(id)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {filteredGroups.map((group) => {
              const groupId = group.title.toLowerCase().replace(/\s+/g, '-');
              const isExpanded = expandedGroups.includes(groupId);
              const allSelected = group.recipients.every(r => selectedRecipients.includes(r.id));
              const someSelected = group.recipients.some(r => selectedRecipients.includes(r.id));

              return (
                <Collapsible 
                  key={group.title}
                  open={isExpanded}
                  onOpenChange={() => toggleGroupExpansion(groupId)}
                >
                  <div className="border rounded-lg">
                    <CollapsibleTrigger className="w-full p-3 flex items-center justify-between hover:bg-muted/50">
                      <div className="flex items-center gap-2">
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        <span className="font-medium">{group.title}</span>
                        <Badge variant="outline">{group.recipients.length}</Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGroupSelectAll(group.recipients);
                        }}
                      >
                        {allSelected ? "Deselect All" : "Select All"}
                      </Button>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <Separator />
                      <div className="p-3 space-y-2">
                        {group.recipients.map((recipient) => (
                          <div 
                            key={recipient.id} 
                            className="flex items-center space-x-3 p-2 rounded hover:bg-muted/50"
                          >
                            <Checkbox
                              id={recipient.id}
                              checked={selectedRecipients.includes(recipient.id)}
                              onCheckedChange={() => handleRecipientToggle(recipient.id)}
                            />
                            <div className="flex-1">
                              <label 
                                htmlFor={recipient.id} 
                                className="text-sm font-medium cursor-pointer"
                              >
                                {recipient.name}
                              </label>
                              <p className="text-xs text-muted-foreground">
                                {recipient.role}
                                {recipient.department && ` - ${recipient.department}`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}