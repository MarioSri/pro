import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  User,
  Calendar,
  Building,
  Zap,
  Filter,
  ArrowRight
} from 'lucide-react';

interface Document {
  id: string;
  title: string;
  type: 'Letter' | 'Circular' | 'Report';
  status: 'pending' | 'approved' | 'rejected' | 'in-review' | 'emergency';
  submittedBy: string;
  submittedByRole: string;
  department: string;
  branch?: string;
  year?: string;
  date: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  description: string;
  requiresAction: boolean;
  escalationLevel: number;
  aiSummary?: string;
}

interface DocumentsWidgetProps {
  userRole: string;
  permissions: any;
  isCustomizing?: boolean;
  onSelect?: () => void;
  isSelected?: boolean;
}

export const DocumentsWidget: React.FC<DocumentsWidgetProps> = ({
  userRole,
  permissions,
  isCustomizing,
  onSelect,
  isSelected
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isMobile } = useResponsive();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'urgent' | 'emergency'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch documents based on role
    const fetchDocuments = async () => {
      setLoading(true);
      
      const mockDocuments: Document[] = [
        {
          id: 'DOC-2024-001',
          title: 'Faculty Recruitment Authorization - CSE Department',
          type: 'Letter',
          status: userRole === 'employee' ? 'pending' : 'approved',
          submittedBy: 'Dr. Rajesh Kumar',
          submittedByRole: 'HOD',
          department: 'Computer Science & Engineering',
          branch: 'CSE',
          year: '3rd Year',
          date: '2024-01-15',
          priority: 'high',
          description: 'Authorization for hiring 3 new faculty members to address growing enrollment',
          requiresAction: userRole === 'principal' || userRole === 'registrar',
          escalationLevel: 0,
          aiSummary: 'Request for 3 CSE faculty positions due to 25% enrollment increase. Budget approved.'
        },
        {
          id: 'DOC-2024-002',
          title: 'Semester Fee Structure Update Circular',
          type: 'Circular',
          status: 'pending',
          submittedBy: 'Prof. Anita Sharma',
          submittedByRole: 'Registrar',
          department: 'Finance',
          date: '2024-01-14',
          priority: 'medium',
          description: 'Updated fee structure for upcoming semester with new course additions',
          requiresAction: userRole === 'principal',
          escalationLevel: 1,
          aiSummary: 'Fee increase of 8% for new courses. Includes lab fees and technology upgrades.'
        },
        {
          id: 'DOC-2024-003',
          title: 'Emergency Infrastructure Repair Report',
          type: 'Report',
          status: 'emergency',
          submittedBy: 'Maintenance Team',
          submittedByRole: 'Employee',
          department: 'Infrastructure',
          date: '2024-01-16',
          priority: 'emergency',
          description: 'Critical electrical system failure in Block A requiring immediate attention',
          requiresAction: true,
          escalationLevel: 2,
          aiSummary: 'Critical electrical failure affecting 200+ students. Immediate repair needed, cost ₹2.5L.'
        }
      ];

      // Filter documents based on role and permissions
      const filteredDocs = mockDocuments.filter(doc => {
        if (userRole === 'employee') {
          return doc.submittedBy === user?.name || doc.department === user?.department;
        }
        if (userRole === 'hod') {
          return doc.department === user?.department || doc.branch === user?.branch;
        }
        if (userRole === 'program-head') {
          return doc.branch === user?.branch && doc.year === user?.year;
        }
        return true; // Principal and Registrar see all
      });

      setTimeout(() => {
        setDocuments(filteredDocs);
        setLoading(false);
      }, 600);
    };

    fetchDocuments();
  }, [userRole, user]);

  const getFilteredDocuments = () => {
    switch (filter) {
      case 'pending':
        return documents.filter(doc => doc.status === 'pending' || doc.status === 'in-review');
      case 'urgent':
        return documents.filter(doc => doc.priority === 'high' || doc.priority === 'emergency');
      case 'emergency':
        return documents.filter(doc => doc.status === 'emergency' || doc.priority === 'emergency');
      default:
        return documents;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-orange-600" />;
      case 'in-review': return <Eye className="w-4 h-4 text-blue-600" />;
      case 'emergency': return <AlertTriangle className="w-4 h-4 text-red-600 animate-pulse" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: { variant: "default" as const, text: "Approved", color: "bg-green-100 text-green-800" },
      rejected: { variant: "destructive" as const, text: "Rejected", color: "bg-red-100 text-red-800" },
      pending: { variant: "secondary" as const, text: "Pending", color: "bg-orange-100 text-orange-800" },
      'in-review': { variant: "outline" as const, text: "In Review", color: "bg-blue-100 text-blue-800" },
      emergency: { variant: "destructive" as const, text: "EMERGENCY", color: "bg-red-200 text-red-900" }
    };
    return variants[status as keyof typeof variants] || { variant: "outline" as const, text: status, color: "bg-gray-100 text-gray-800" };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'text-red-700 font-bold animate-pulse';
      case 'high': return 'text-orange-700 font-semibold';
      case 'medium': return 'text-yellow-700';
      case 'low': return 'text-green-700';
      default: return 'text-gray-600';
    }
  };

  const filteredDocuments = getFilteredDocuments();
  const urgentCount = documents.filter(doc => doc.requiresAction && (doc.priority === 'high' || doc.priority === 'emergency')).length;

  if (loading) {
    return (
      <Card className={cn(
        "shadow-elegant h-full",
        isSelected && "border-primary",
        isCustomizing && "cursor-pointer"
      )} onClick={onSelect}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-primary" />
            Recent Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "shadow-elegant hover:shadow-glow transition-all duration-300 h-full",
      isSelected && "border-primary",
      isCustomizing && "cursor-pointer"
    )} onClick={onSelect}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-primary" />
            Recent Documents
            {urgentCount > 0 && (
              <Badge className="bg-red-100 text-red-800 animate-pulse text-xs">
                {urgentCount} urgent
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {(['all', 'pending', 'urgent', 'emergency'] as const).map(filterType => (
                <Button
                  key={filterType}
                  variant={filter === filterType ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter(filterType)}
                  className="h-7 px-2 text-xs"
                >
                  {filterType === 'all' ? 'All' : 
                   filterType === 'pending' ? 'Pending' :
                   filterType === 'urgent' ? 'Urgent' : 'Emergency'}
                </Button>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/documents")}
              className="h-7 px-3 text-xs"
            >
              <Eye className="w-3 h-3 mr-1" />
              View All
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {filteredDocuments.slice(0, 5).map((doc, index) => (
              <div
                key={doc.id}
                className={cn(
                  "p-4 border rounded-lg hover:bg-gray-50 transition-all cursor-pointer animate-fade-in",
                  doc.status === 'emergency' && "border-red-200 bg-red-50",
                  doc.requiresAction && "border-l-4 border-l-orange-500"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => navigate(`/documents/${doc.id}`)}
              >
                {/* Header Row */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0 pr-3">
                    <h4 className="font-medium text-sm line-clamp-2 text-gray-900">
                      {doc.title}
                    </h4>
                    {doc.aiSummary && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        🤖 {doc.aiSummary}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {getStatusIcon(doc.status)}
                    <Badge className={cn("text-xs", getStatusBadge(doc.status).color)}>
                      {getStatusBadge(doc.status).text}
                    </Badge>
                  </div>
                </div>
                
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span className="truncate">{doc.submittedBy}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    <span className="truncate">{doc.department}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{doc.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertTriangle className={cn("w-3 h-3", getPriorityColor(doc.priority))} />
                    <span className={getPriorityColor(doc.priority)}>
                      {doc.priority.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Branch and Year info */}
                {(userRole === 'program-head' || userRole === 'hod') && (doc.branch || doc.year) && (
                  <div className="flex items-center gap-2 mb-2">
                    {doc.branch && (
                      <Badge variant="outline" className="text-xs px-2 py-0">
                        {doc.branch}
                      </Badge>
                    )}
                    {doc.year && (
                      <Badge variant="outline" className="text-xs px-2 py-0">
                        {doc.year}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Action Required Indicator */}
                {doc.requiresAction && (
                  <div className="flex items-center gap-2 p-2 bg-orange-50 rounded border border-orange-200">
                    <Zap className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-medium text-orange-800">
                      Action Required
                    </span>
                    {doc.escalationLevel > 0 && (
                      <Badge className="bg-red-100 text-red-800 text-xs">
                        Escalated {doc.escalationLevel}x
                      </Badge>
                    )}
                  </div>
                )}

                {/* Quick Actions for Approvers */}
                {doc.requiresAction && (userRole === 'principal' || userRole === 'registrar' || userRole === 'hod') && (
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="flex-1 h-8 text-xs bg-green-600 hover:bg-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" className="flex-1 h-8 text-xs">
                      <XCircle className="w-3 h-3 mr-1" />
                      Reject
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 px-2">
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
            
            {filteredDocuments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm font-medium">No documents found</p>
                <p className="text-xs">
                  {filter === 'all' ? 'No documents available' : `No ${filter} documents`}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Widget Footer */}
        <div className="flex items-center justify-between pt-4 border-t mt-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{filteredDocuments.length} documents</span>
            {urgentCount > 0 && (
              <span className="text-orange-600 font-medium">
                {urgentCount} require action
              </span>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/documents")}
            className="h-8 text-xs"
          >
            View All
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};