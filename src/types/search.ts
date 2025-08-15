// TypeScript interfaces for Universal Search System
export interface SearchResult {
  id: string;
  title: string;
  type: 'Letter' | 'Circular' | 'Report' | 'User' | 'Department' | 'Event' | 'Meeting';
  status: 'In Progress' | 'Pending' | 'Rejected' | 'Approved & Archived';
  department: string;
  branch?: string;
  year?: string;
  role?: string;
  submittedBy: string;
  submittedByRole: string;
  createdDate: string;
  modifiedDate: string;
  approvedDate?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Emergency';
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
  };
}

export interface SearchFilters {
  status: string[];
  departments: string[];
  branches: string[];
  years: string[];
  roles: string[];
  priority: string[];
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