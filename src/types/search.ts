// TypeScript interfaces for Universal Search System - HITAM IAOMS
export interface SearchResult {
  id: string;
  title: string;
  type: 'Letter' | 'Circular' | 'Report' | 'User' | 'Department' | 'Event' | 'Meeting' | 'LiveMeeting' | 'Emergency';
  status: 'In Progress' | 'Pending' | 'Rejected' | 'Approved & Archived' | 'Draft' | 'Active' | 'Scheduled' | 'Completed';
  department: string;
  branch?: 'EEE' | 'MECH' | 'CSE' | 'ECE' | 'CSM' | 'CSO' | 'CSD' | 'CSC';
  year?: '1st' | '2nd' | '3rd' | '4th';
  role?: string;
  submittedBy: string;
  submittedByRole: string;
  createdDate: string;
  modifiedDate: string;
  approvedDate?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Emergency' | 'Immediate' | 'Urgent' | 'Normal';
  urgency?: 'immediate' | 'urgent' | 'normal';
  description: string;
  tags: string[];
  permissions: {
    canView: boolean;
    canEdit: boolean;
    canApprove: boolean;
    canReject: boolean;
  };
  metadata?: {
    fileSize?: string;
    documentId?: string;
    workflowStep?: string;
    rejectionReason?: string;
    meetingLink?: string;
    location?: string;
    participants?: string[];
  };
}

export interface SearchFilters {
  status: string[];
  departments: string[];
  branches: ('EEE' | 'MECH' | 'CSE' | 'ECE' | 'CSM' | 'CSO' | 'CSD' | 'CSC')[];
  years: ('1st' | '2nd' | '3rd' | '4th')[];
  roles: string[];
  priority: ('Low' | 'Medium' | 'High' | 'Emergency' | 'Immediate' | 'Urgent' | 'Normal')[];
  types: ('Letter' | 'Circular' | 'Report' | 'User' | 'Department' | 'Event' | 'Meeting' | 'LiveMeeting' | 'Emergency')[];
  dateRange: {
    type: 'created' | 'modified' | 'approved';
    startDate: string;
    endDate: string;
  };
}

export interface AutocompleteItem {
  id: string;
  text: string;
  type: 'document' | 'user' | 'department' | 'recent';
  category: string;
  metadata?: any;
}

export interface RecentSearch {
  id: string;
  query: string;
  filters: Partial<SearchFilters>;
  timestamp: Date;
  resultCount: number;
}

export interface SearchState {
  query: string;
  filters: SearchFilters;
  results: SearchResult[];
  autocomplete: AutocompleteItem[];
  recentSearches: RecentSearch[];
  isLoading: boolean;
  error: string | null;
  viewMode: 'card' | 'list';
  currentPage: number;
  totalPages: number;
  totalResults: number;
}

export interface UserPermissions {
  role: string;
  department?: string;
  branch?: string;
  canViewAllDepartments: boolean;
  canApproveDocuments: boolean;
  canEditDocuments: boolean;
  canViewUsers: boolean;
}