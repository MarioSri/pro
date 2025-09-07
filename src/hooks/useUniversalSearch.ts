import { useState, useEffect, useCallback, useMemo } from 'react';
import { SearchResult, SearchFilters, AutocompleteItem, RecentSearch, SearchState, UserPermissions } from '@/types/search';
import { useToast } from '@/hooks/use-toast';

// Mock data generator for demonstration
const generateMockResults = (query: string, filters: SearchFilters, userPermissions: UserPermissions): SearchResult[] => {
  const mockData: SearchResult[] = [
    {
      id: 'DOC-2024-001',
      title: 'Faculty Recruitment Authorization Letter',
      type: 'Letter' as const,
      status: 'Approved & Archived' as const,
      department: 'Computer Science & Engineering',
      branch: 'CSE' as const,
      year: '2024',
      role: 'HOD',
      submittedBy: 'Dr. Rajesh Kumar',
      submittedByRole: 'HOD',
      createdDate: '2024-01-15',
      modifiedDate: '2024-01-16',
      approvedDate: '2024-01-17',
      priority: 'High' as const,
      urgency: 'urgent' as const,
      description: 'Authorization for hiring 3 new faculty members in CSE department',
      tags: ['recruitment', 'faculty', 'authorization'],
      permissions: {
        canView: true,
        canEdit: userPermissions.role === 'Principal' || userPermissions.role === 'HOD',
        canApprove: userPermissions.role === 'Principal',
        canReject: userPermissions.role === 'Principal'
      },
      metadata: {
        fileSize: '2.3 MB',
        documentId: 'DOC-2024-001',
        workflowStep: 'Completed'
      }
    },
    {
      id: 'DOC-2024-002',
      title: 'Semester Fee Structure Circular',
      type: 'Circular' as const,
      status: 'Pending' as const,
      department: 'Finance',
      role: 'Registrar',
      submittedBy: 'Prof. Anita Sharma',
      submittedByRole: 'Registrar',
      createdDate: '2024-01-14',
      modifiedDate: '2024-01-15',
      priority: 'Medium' as const,
      urgency: 'normal' as const,
      description: 'Updated fee structure for upcoming semester',
      tags: ['fees', 'semester', 'finance'],
      permissions: {
        canView: true,
        canEdit: userPermissions.role === 'Principal' || userPermissions.role === 'Registrar',
        canApprove: userPermissions.role === 'Principal',
        canReject: userPermissions.role === 'Principal'
      },
      metadata: {
        fileSize: '1.8 MB',
        documentId: 'DOC-2024-002',
        workflowStep: 'Principal Review'
      }
    },
    {
      id: 'DOC-2024-003',
      title: 'Monthly Academic Performance Report',
      type: 'Report' as const,
      status: 'In Progress' as const,
      department: 'Academic Affairs',
      branch: 'EEE' as const,
      year: '2024',
      role: 'HOD',
      submittedBy: 'Dr. Mohammed Ali',
      submittedByRole: 'HOD',
      createdDate: '2024-01-13',
      modifiedDate: '2024-01-14',
      priority: 'Medium' as const,
      urgency: 'normal' as const,
      description: 'Comprehensive academic performance analysis for EEE department',
      tags: ['academic', 'performance', 'monthly'],
      permissions: {
        canView: true,
        canEdit: userPermissions.role === 'Principal' || userPermissions.role === 'HOD',
        canApprove: userPermissions.role === 'Principal',
        canReject: userPermissions.role === 'Principal'
      },
      metadata: {
        fileSize: '4.1 MB',
        documentId: 'DOC-2024-003',
        workflowStep: 'HOD Review'
      }
    },
    {
      id: 'DOC-2024-004',
      title: 'Infrastructure Upgrade Proposal',
      type: 'Report' as const,
      status: 'Rejected' as const,
      department: 'Electrical Engineering',
      branch: 'EEE' as const,
      role: 'Employee',
      submittedBy: 'Prof. David Brown',
      submittedByRole: 'Employee',
      createdDate: '2024-01-12',
      modifiedDate: '2024-01-13',
      priority: 'Low' as const,
      urgency: 'normal' as const,
      description: 'Proposal for upgrading laboratory equipment in EEE department',
      tags: ['infrastructure', 'upgrade', 'laboratory'],
      permissions: {
        canView: true,
        canEdit: userPermissions.role === 'Principal' || userPermissions.department === 'Electrical Engineering',
        canApprove: false,
        canReject: false
      },
      metadata: {
        fileSize: '3.2 MB',
        documentId: 'DOC-2024-004',
        workflowStep: 'Rejected',
        rejectionReason: 'Budget constraints - please revise with cost optimization'
      }
    },
    {
      id: 'USER-001',
      title: 'Dr. Rajesh Kumar',
      type: 'User' as const,
      status: 'Active' as const,
      department: 'Computer Science & Engineering',
      branch: 'CSE' as const,
      role: 'HOD',
      submittedBy: 'System',
      submittedByRole: 'System',
      createdDate: '2023-06-01',
      modifiedDate: '2024-01-10',
      priority: 'Medium' as const,
      urgency: 'normal' as const,
      description: 'Head of Department - Computer Science & Engineering',
      tags: ['faculty', 'hod', 'computer-science'],
      permissions: {
        canView: userPermissions.canViewUsers,
        canEdit: userPermissions.role === 'Principal',
        canApprove: false,
        canReject: false
      }
    },
    {
      id: 'EVENT-001',
      title: 'Annual Faculty Development Program',
      type: 'Event' as const,
      status: 'Scheduled' as const,
      department: 'Academic Affairs',
      role: 'Principal',
      submittedBy: 'Dr. Robert Smith',
      submittedByRole: 'Principal',
      createdDate: '2024-01-10',
      modifiedDate: '2024-01-15',
      priority: 'High' as const,
      urgency: 'normal' as const,
      description: 'Three-day faculty development program focusing on modern teaching methodologies',
      tags: ['faculty', 'development', 'training'],
      permissions: {
        canView: true,
        canEdit: userPermissions.role === 'Principal',
        canApprove: false,
        canReject: false
      }
    }
  ];

  // Filter based on query
  let filteredResults = mockData;
  
  if (query.trim()) {
    const searchTerm = query.toLowerCase();
    filteredResults = mockData.filter(item => 
      item.title.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.submittedBy.toLowerCase().includes(searchTerm) ||
      item.department.toLowerCase().includes(searchTerm) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  // Apply filters
  if (filters.status.length > 0) {
    filteredResults = filteredResults.filter(item => filters.status.includes(item.status));
  }

  if (filters.departments.length > 0) {
    filteredResults = filteredResults.filter(item => filters.departments.includes(item.department));
  }

  if (filters.branches.length > 0) {
    filteredResults = filteredResults.filter(item => 
      item.branch && filters.branches.includes(item.branch)
    );
  }

  if (filters.roles.length > 0) {
    filteredResults = filteredResults.filter(item => 
      item.role && filters.roles.includes(item.role)
    );
  }

  if (filters.priority.length > 0) {
    filteredResults = filteredResults.filter(item => filters.priority.includes(item.priority));
  }

  if (filters.types.length > 0) {
    filteredResults = filteredResults.filter(item => filters.types.includes(item.type));
  }

  // Apply role-based visibility
  return filteredResults.filter(item => {
    // Basic permission check
    if (!item.permissions.canView) return false;
    
    // Department-specific visibility
    if (userPermissions.department && !userPermissions.canViewAllDepartments) {
      return item.department === userPermissions.department || 
             item.branch === userPermissions.branch;
    }
    
    return true;
  });
};

const generateAutocomplete = (query: string): AutocompleteItem[] => {
  if (!query.trim()) return [];
  
  const suggestions: AutocompleteItem[] = [
    { id: '1', text: 'Faculty Recruitment', type: 'document', category: 'Letters' },
    { id: '2', text: 'Fee Structure', type: 'document', category: 'Circulars' },
    { id: '3', text: 'Academic Report', type: 'document', category: 'Reports' },
    { id: '4', text: 'Dr. Rajesh Kumar', type: 'user', category: 'Users' },
    { id: '5', text: 'Computer Science Engineering', type: 'department', category: 'Departments' },
    { id: '6', text: 'Faculty Development Program', type: 'document', category: 'Events' }
  ];

  return suggestions.filter(item => 
    item.text.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 6);
};

export const useUniversalSearch = (userPermissions: UserPermissions) => {
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    filters: {
      status: [],
      departments: [],
      branches: [],
      years: [],
      roles: [],
      priority: [],
      types: [],
      dateRange: {
        type: 'created',
        startDate: '',
        endDate: ''
      }
    },
    results: [],
    autocomplete: [],
    recentSearches: [],
    isLoading: false,
    error: null,
    viewMode: 'card',
    currentPage: 1,
    totalPages: 1,
    totalResults: 0
  });

  const { toast } = useToast();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('iaoms-recent-searches');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSearchState(prev => ({
          ...prev,
          recentSearches: parsed.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp)
          }))
        }));
      } catch (error) {
        console.error('Failed to load recent searches:', error);
      }
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = useCallback((query: string, filters: SearchFilters, resultCount: number) => {
    if (!query.trim()) return;

    const newSearch: RecentSearch = {
      id: Date.now().toString(),
      query,
      filters,
      timestamp: new Date(),
      resultCount
    };

    setSearchState(prev => {
      const updated = [newSearch, ...prev.recentSearches.filter(s => s.query !== query)].slice(0, 5);
      localStorage.setItem('iaoms-recent-searches', JSON.stringify(updated));
      return { ...prev, recentSearches: updated };
    });
  }, []);

  // Perform search
  const performSearch = useCallback(async (query: string, filters: SearchFilters) => {
    setSearchState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const results = generateMockResults(query, filters, userPermissions);
      const totalResults = results.length;
      const totalPages = Math.ceil(totalResults / 10);

      setSearchState(prev => ({
        ...prev,
        results,
        totalResults,
        totalPages,
        isLoading: false,
        currentPage: 1
      }));

      // Save to recent searches if query exists
      if (query.trim()) {
        saveRecentSearch(query, filters, totalResults);
      }

      if (results.length === 0 && query.trim()) {
        toast({
          title: "No Results Found",
          description: `No results found for "${query}". Try adjusting your search terms or filters.`,
        });
      }

    } catch (error) {
      setSearchState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to perform search. Please try again.'
      }));
      
      toast({
        title: "Search Error",
        description: "Failed to perform search. Please try again.",
        variant: "destructive"
      });
    }
  }, [userPermissions, saveRecentSearch, toast]);

  // Update autocomplete
  const updateAutocomplete = useCallback((query: string) => {
    if (query.trim().length < 2) {
      setSearchState(prev => ({ ...prev, autocomplete: [] }));
      return;
    }

    const suggestions = generateAutocomplete(query);
    setSearchState(prev => ({ ...prev, autocomplete: suggestions }));
  }, []);

  // Search function
  const search = useCallback((query?: string, newFilters?: Partial<SearchFilters>) => {
    const searchQuery = query !== undefined ? query : searchState.query;
    const searchFilters = newFilters ? { ...searchState.filters, ...newFilters } : searchState.filters;
    
    setSearchState(prev => ({ 
      ...prev, 
      query: searchQuery,
      filters: searchFilters 
    }));
    
    performSearch(searchQuery, searchFilters);
  }, [searchState.query, searchState.filters, performSearch]);

  // Update query
  const updateQuery = useCallback((query: string) => {
    setSearchState(prev => ({ ...prev, query }));
    updateAutocomplete(query);
  }, [updateAutocomplete]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setSearchState(prev => ({ 
      ...prev, 
      filters: { ...prev.filters, ...newFilters } 
    }));
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchState(prev => ({
      ...prev,
      query: '',
      autocomplete: [],
      results: [],
      totalResults: 0,
      totalPages: 1,
      currentPage: 1,
      error: null
    }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    const defaultFilters: SearchFilters = {
      status: [],
      departments: [],
      branches: [],
      years: [],
      roles: [],
      priority: [],
      types: [],
      dateRange: {
        type: 'created',
        startDate: '',
        endDate: ''
      }
    };
    
    setSearchState(prev => ({ ...prev, filters: defaultFilters }));
  }, []);

  // Toggle view mode
  const toggleViewMode = useCallback(() => {
    setSearchState(prev => ({
      ...prev,
      viewMode: prev.viewMode === 'card' ? 'list' : 'card'
    }));
  }, []);

  // Load recent search
  const loadRecentSearch = useCallback((recentSearch: RecentSearch) => {
    setSearchState(prev => ({
      ...prev,
      query: recentSearch.query,
      filters: { ...prev.filters, ...recentSearch.filters }
    }));
    
    performSearch(recentSearch.query, { ...searchState.filters, ...recentSearch.filters });
  }, [performSearch, searchState.filters]);

  // Get active filter count
  const activeFilterCount = useMemo(() => {
    const { status, departments, branches, years, roles, priority, types, dateRange } = searchState.filters;
    return status.length + departments.length + branches.length + years.length + 
           roles.length + priority.length + types.length +
           (dateRange.startDate ? 1 : 0) + (dateRange.endDate ? 1 : 0);
  }, [searchState.filters]);

  return {
    searchState,
    search,
    updateQuery,
    updateFilters,
    clearSearch,
    resetFilters,
    toggleViewMode,
    loadRecentSearch,
    activeFilterCount
  };
};