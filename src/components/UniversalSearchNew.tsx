import React, { useState, useCallback } from 'react';
import { Search, X, Filter, Grid, List, Calendar, Users, FileText, Building, Clock, AlertTriangle, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { useUniversalSearch } from '@/hooks/useUniversalSearch';
import { SearchResult, SearchFilters, UserRole } from '@/types/search';

interface UniversalSearchProps {
  userRole: UserRole;
  className?: string;
}

export function UniversalSearch({ userRole, className = '' }: UniversalSearchProps) {
  const {
    searchState,
    search,
    updateQuery,
    updateFilters,
    clearSearch,
    resetFilters,
    toggleViewMode,
    loadRecentSearch,
    activeFilterCount
  } = useUniversalSearch({ role: userRole });
  
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter options for IAOMS
  const filterOptions = {
    status: ['Active', 'Pending', 'Approved & Archived', 'In Progress', 'Rejected', 'Completed', 'Scheduled', 'Draft'],
    types: ['Letter', 'Circular', 'Report', 'User', 'Department', 'Event', 'Meeting', 'LiveMeeting', 'Emergency'],
    departments: [
      'Computer Science & Engineering',
      'Electrical Engineering', 
      'Mechanical Engineering',
      'Electronics & Communication',
      'Academic Affairs',
      'Finance',
      'Administration'
    ],
    branches: ['CSE', 'MECH', 'EEE', 'ECE', 'CSM', 'CSO', 'CSD', 'CSC'],
    years: ['1st', '2nd', '3rd', '4th'],
    roles: ['Principal', 'HOD', 'Registrar', 'Employee', 'Student', 'System'],
    priority: ['Emergency', 'Immediate', 'High', 'Urgent', 'Medium', 'Normal', 'Low']
  };

  // Handle search input changes
  const handleSearchInput = useCallback((value: string) => {
    updateQuery(value);
    setShowSuggestions(value.length > 0);
    if (value.length > 2) {
      search(value, searchState.filters);
    } else if (value.length === 0) {
      clearSearch();
      setShowSuggestions(false);
    }
  }, [updateQuery, search, searchState.filters, clearSearch]);

  // Handle filter changes
  const handleFilterChange = useCallback((filterType: keyof SearchFilters, value: any) => {
    if (filterType === 'dateRange') {
      updateFilters({ ...searchState.filters, [filterType]: value });
    } else {
      const currentValues = searchState.filters[filterType] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      updateFilters({ ...searchState.filters, [filterType]: newValues });
    }
  }, [updateFilters, searchState.filters]);

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'emergency':
        return 'bg-red-500 text-white';
      case 'in progress':
        return 'bg-blue-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'approved & archived':
      case 'completed':
        return 'bg-green-500 text-white';
      case 'active':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Priority color mapping
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'emergency':
      case 'immediate':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
      case 'urgent':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
      case 'normal':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'letter':
      case 'circular':
        return <FileText className="w-4 h-4" />;
      case 'report':
        return <Building className="w-4 h-4" />;
      case 'user':
        return <Users className="w-4 h-4" />;
      case 'event':
      case 'meeting':
      case 'livemeeting':
        return <Calendar className="w-4 h-4" />;
      case 'emergency':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  // Highlight search terms in text
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
  };

  // Render search suggestions
  const renderSuggestions = () => {
    if (!showSuggestions || !searchState.query) return null;

    const suggestions = [
      'Letters from Principal',
      'Pending approvals',
      'CSE Department reports',
      'Emergency notifications',
      'Meeting schedules',
      'Faculty documents',
      'Student records'
    ].filter(suggestion => 
      suggestion.toLowerCase().includes(searchState.query.toLowerCase())
    );

    return (
      <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1">
        <div className="p-2">
          {suggestions.length > 0 && (
            <>
              <div className="px-3 py-1 text-xs text-gray-500 font-medium">Suggestions</div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
                  onClick={() => {
                    updateQuery(suggestion);
                    setShowSuggestions(false);
                    search(suggestion, searchState.filters);
                  }}
                  aria-label={`Search for ${suggestion}`}
                >
                  <span dangerouslySetInnerHTML={{ 
                    __html: highlightText(suggestion, searchState.query) 
                  }} />
                </button>
              ))}
            </>
          )}
          
          {searchState.recentSearches.length > 0 && (
            <>
              <Separator className="my-2" />
              <div className="px-3 py-1 text-xs text-gray-500 font-medium">Recent Searches</div>
              {searchState.recentSearches.slice(0, 5).map((recent, index) => (
                <button
                  key={index}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm flex items-center justify-between"
                  onClick={() => {
                    loadRecentSearch(recent);
                    setShowSuggestions(false);
                  }}
                  aria-label={`Load recent search: ${recent.query}`}
                >
                  <span>{recent.query}</span>
                  <Clock className="w-3 h-3 text-gray-400" />
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    );
  };

  // Render filter chips
  const renderActiveFilters = () => {
    const activeFilters = [];
    
    searchState.filters.status.forEach(status => {
      activeFilters.push({ type: 'status', value: status, label: `Status: ${status}` });
    });
    
    searchState.filters.departments.forEach(dept => {
      activeFilters.push({ type: 'departments', value: dept, label: `Dept: ${dept.split(' ')[0]}...` });
    });
    
    searchState.filters.branches.forEach(branch => {
      activeFilters.push({ type: 'branches', value: branch, label: `Branch: ${branch}` });
    });
    
    searchState.filters.roles.forEach(role => {
      activeFilters.push({ type: 'roles', value: role, label: `Role: ${role}` });
    });
    
    searchState.filters.priority.forEach(priority => {
      activeFilters.push({ type: 'priority', value: priority, label: `Priority: ${priority}` });
    });

    searchState.filters.types.forEach(type => {
      activeFilters.push({ type: 'types', value: type, label: `Type: ${type}` });
    });

    if (activeFilters.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {activeFilters.map((filter, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1"
          >
            {filter.label}
            <button
              onClick={() => handleFilterChange(filter.type as keyof SearchFilters, filter.value)}
              className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
              aria-label={`Remove ${filter.label} filter`}
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="h-6 px-2 text-xs"
        >
          Clear all
        </Button>
      </div>
    );
  };

  // Render filter section
  const renderFilters = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Document Type</label>
        <div className="grid grid-cols-2 gap-2">
          {filterOptions.types.map(type => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type}`}
                checked={searchState.filters.types.includes(type)}
                onCheckedChange={() => handleFilterChange('types', type)}
              />
              <label htmlFor={`type-${type}`} className="text-sm">{type}</label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Status</label>
        <div className="grid grid-cols-2 gap-2">
          {filterOptions.status.map(status => (
            <div key={status} className="flex items-center space-x-2">
              <Checkbox
                id={`status-${status}`}
                checked={searchState.filters.status.includes(status)}
                onCheckedChange={() => handleFilterChange('status', status)}
              />
              <label htmlFor={`status-${status}`} className="text-sm">{status}</label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Priority</label>
        <div className="grid grid-cols-2 gap-2">
          {filterOptions.priority.map(priority => (
            <div key={priority} className="flex items-center space-x-2">
              <Checkbox
                id={`priority-${priority}`}
                checked={searchState.filters.priority.includes(priority)}
                onCheckedChange={() => handleFilterChange('priority', priority)}
              />
              <label htmlFor={`priority-${priority}`} className="text-sm">{priority}</label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Branch</label>
        <div className="grid grid-cols-3 gap-2">
          {filterOptions.branches.map(branch => (
            <div key={branch} className="flex items-center space-x-2">
              <Checkbox
                id={`branch-${branch}`}
                checked={searchState.filters.branches.includes(branch as any)}
                onCheckedChange={() => handleFilterChange('branches', branch)}
              />
              <label htmlFor={`branch-${branch}`} className="text-sm">{branch}</label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Role</label>
        <div className="grid grid-cols-2 gap-2">
          {filterOptions.roles.map(role => (
            <div key={role} className="flex items-center space-x-2">
              <Checkbox
                id={`role-${role}`}
                checked={searchState.filters.roles.includes(role)}
                onCheckedChange={() => handleFilterChange('roles', role)}
              />
              <label htmlFor={`role-${role}`} className="text-sm">{role}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render search results
  const renderResults = () => {
    if (searchState.isLoading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (searchState.error) {
      return (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Search Error</h3>
            <p className="text-gray-600 mb-4">{searchState.error}</p>
            <Button onClick={() => search(searchState.query, searchState.filters)}>Try Again</Button>
          </CardContent>
        </Card>
      );
    }

    if (searchState.results.length === 0 && searchState.query) {
      return (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button variant="outline" size="sm" onClick={() => {
                updateQuery('letters');
                search('letters', searchState.filters);
              }}>
                Search Letters
              </Button>
              <Button variant="outline" size="sm" onClick={() => {
                updateQuery('reports');
                search('reports', searchState.filters);
              }}>
                Search Reports
              </Button>
              <Button variant="outline" size="sm" onClick={() => {
                updateQuery('meetings');
                search('meetings', searchState.filters);
              }}>
                Search Meetings
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (searchState.results.length === 0) {
      return (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold mb-3">Universal Search for IAOMS</h3>
            <p className="text-gray-600 mb-6">
              Search through letters, circulars, reports, users, events, meetings, and more across all departments
            </p>
            {searchState.recentSearches.length > 0 && (
              <>
                <h4 className="text-sm font-medium mb-3 text-left">Recent Searches</h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {searchState.recentSearches.slice(0, 3).map((recent, index) => (
                    <Button
                      key={index}
                      variant="outline" 
                      size="sm"
                      onClick={() => loadRecentSearch(recent)}
                    >
                      {recent.query}
                    </Button>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      );
    }

    return (
      <div className={searchState.viewMode === 'card' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
        {searchState.results.map((result) => (
          <Card key={result.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {getTypeIcon(result.type)}
                  <CardTitle 
                    className="text-base truncate"
                    dangerouslySetInnerHTML={{ 
                      __html: highlightText(result.title, searchState.query) 
                    }}
                  />
                </div>
                <Badge className={getStatusColor(result.status)} variant="secondary">
                  {result.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {result.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Users className="w-3 h-3" />
                  <span>{result.submittedBy}</span>
                  <span>•</span>
                  <span>{result.department}</span>
                  {result.branch && (
                    <>
                      <span>•</span>
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        {result.branch}
                      </Badge>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>Created: {new Date(result.createdDate).toLocaleDateString()}</span>
                  {result.modifiedDate !== result.createdDate && (
                    <>
                      <span>•</span>
                      <span>Updated: {new Date(result.modifiedDate).toLocaleDateString()}</span>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Badge className={getPriorityColor(result.priority)} variant="outline">
                    {result.priority}
                  </Badge>
                  
                  {result.tags && result.tags.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Tag className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {result.tags.slice(0, 2).join(', ')}
                        {result.tags.length > 2 && ` +${result.tags.length - 2}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className={`w-full max-w-7xl mx-auto p-4 space-y-6 ${className}`}>
      {/* Search Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Universal Search</h1>
          <p className="text-gray-600">Search across all IAOMS documents, users, and activities</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleViewMode}
            className="hidden sm:flex"
          >
            {searchState.viewMode === 'card' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            {searchState.viewMode === 'card' ? 'List' : 'Grid'}
          </Button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search letters, reports, users, meetings..."
            className="pl-10 pr-12 py-3 text-lg"
            value={searchState.query}
            onChange={(e) => handleSearchInput(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          {searchState.query && (
            <button
              onClick={() => {
                updateQuery('');
                clearSearch();
                setShowSuggestions(false);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        {renderSuggestions()}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Search Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <ScrollArea className="h-[calc(100vh-8rem)]">
                {renderFilters()}
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>

        {searchState.results.length > 0 && (
          <div className="text-sm text-gray-600">
            {searchState.results.length} results found
            {searchState.query && ` for "${searchState.query}"`}
          </div>
        )}
      </div>

      {/* Active Filters */}
      {renderActiveFilters()}

      {/* Search Results */}
      {renderResults()}
    </div>
  );
}
