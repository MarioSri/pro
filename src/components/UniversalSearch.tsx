import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Search, 
  X, 
  Filter, 
  Grid3X3, 
  List, 
  ChevronDown,
  ChevronRight,
  Calendar,
  FileText,
  Users,
  Building,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Edit,
  RotateCcw,
  History,
  Zap
} from "lucide-react";
import { useUniversalSearch } from "@/hooks/useUniversalSearch";
import { SearchResult, UserPermissions, AutocompleteItem, RecentSearch } from "@/types/search";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface UniversalSearchProps {
  userRole: string;
  className?: string;
}

// Constants for filter options
const STATUS_OPTIONS = ['In Progress', 'Pending', 'Rejected', 'Approved & Archived'];
const DEPARTMENT_OPTIONS = [
  'Computer Science & Engineering',
  'Electrical & Electronics Engineering', 
  'Electronics & Communication Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Finance',
  'Academic Affairs',
  'Administration'
];
const BRANCH_OPTIONS = ['CSE', 'EEE', 'ECE', 'MECH', 'CIVIL', 'CSM', 'CSO', 'CSD', 'CSC'];
const YEAR_OPTIONS = ['2024', '2023', '2022', '2021'];
const ROLE_OPTIONS = ['Principal', 'Registrar', 'HOD', 'Program Head', 'Employee', 'Mentor'];
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Emergency'];

export const UniversalSearch: React.FC<UniversalSearchProps> = ({ userRole, className }) => {
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedFilterSections, setExpandedFilterSections] = useState<Record<string, boolean>>({
    status: true,
    department: true,
    role: false,
    priority: false,
    dateRange: false
  });

  const searchInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // User permissions based on role
  const userPermissions: UserPermissions = {
    role: userRole,
    department: userRole === 'HOD' ? 'Computer Science & Engineering' : undefined,
    branch: userRole === 'HOD' ? 'CSE' : undefined,
    canViewAllDepartments: ['Principal', 'Registrar'].includes(userRole),
    canApproveDocuments: ['Principal', 'Registrar', 'HOD'].includes(userRole),
    canEditDocuments: ['Principal', 'Registrar', 'HOD', 'Program Head'].includes(userRole),
    canViewUsers: ['Principal', 'Registrar', 'HOD'].includes(userRole)
  };

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
  } = useUniversalSearch(userPermissions);

  // Handle click outside autocomplete
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node) &&
          searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search input
  const handleSearchInput = (value: string) => {
    updateQuery(value);
    setShowAutocomplete(value.trim().length > 0);
  };

  // Handle search submit
  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setShowAutocomplete(false);
    search();
  };

  // Handle autocomplete selection
  const handleAutocompleteSelect = (item: AutocompleteItem) => {
    updateQuery(item.text);
    setShowAutocomplete(false);
    search(item.text);
  };

  // Handle filter change
  const handleFilterChange = (filterType: keyof typeof searchState.filters, value: string, checked: boolean) => {
    if (filterType === 'dateRange') return; // Handle separately
    
    const currentValues = searchState.filters[filterType] as string[];
    const newValues = checked 
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
    
    updateFilters({ [filterType]: newValues });
  };

  // Handle date range filter
  const handleDateRangeChange = (type: 'startDate' | 'endDate', value: string) => {
    updateFilters({
      dateRange: {
        ...searchState.filters.dateRange,
        [type]: value
      }
    });
  };

  // Toggle filter section
  const toggleFilterSection = (section: string) => {
    setExpandedFilterSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Pending': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-300';
      case 'Approved & Archived': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'In Progress': return <Clock className="w-3 h-3" />;
      case 'Pending': return <AlertTriangle className="w-3 h-3" />;
      case 'Rejected': return <XCircle className="w-3 h-3" />;
      case 'Approved & Archived': return <CheckCircle2 className="w-3 h-3" />;
      default: return <FileText className="w-3 h-3" />;
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'Emergency': return 'bg-red-200 text-red-900 border-red-400';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Highlight search terms in text
  const highlightText = (text: string, query: string): React.ReactNode => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  // Render search result card
  const renderResultCard = (result: SearchResult) => (
    <Card key={result.id} className="hover:shadow-md transition-all duration-200 animate-fade-in">
      <CardContent className="p-4 md:p-6">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg leading-tight">
                {highlightText(result.title, searchState.query)}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {highlightText(result.description, searchState.query)}
              </p>
            </div>
            
            <div className="flex flex-col gap-2 items-end">
              <Badge className={getStatusColor(result.status)} variant="outline">
                {getStatusIcon(result.status)}
                <span className="ml-1">{result.status}</span>
              </Badge>
              <Badge className={getPriorityColor(result.priority)} variant="outline">
                {result.priority}
              </Badge>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge variant="secondary">{result.type}</Badge>
            <Badge variant="outline">{result.department}</Badge>
            {result.branch && <Badge variant="outline">{result.branch}</Badge>}
            {result.year && <Badge variant="outline">{result.year}</Badge>}
            {result.role && <Badge variant="outline">{result.role}</Badge>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div>
              <p className="font-medium">Submitted by</p>
              <p>{highlightText(result.submittedBy, searchState.query)}</p>
            </div>
            <div>
              <p className="font-medium">Created</p>
              <p>{result.createdDate}</p>
            </div>
            <div>
              <p className="font-medium">Modified</p>
              <p>{result.modifiedDate}</p>
            </div>
          </div>

          {/* Rejection reason if applicable */}
          {result.status === 'Rejected' && result.metadata?.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">
                <strong>Rejection Reason:</strong> {result.metadata.rejectionReason}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            {result.permissions.canView && (
              <Button variant="outline" size="sm" className="h-10">
                <Eye className="w-4 h-4 mr-2" />
                View
              </Button>
            )}
            {result.permissions.canEdit && (
              <Button variant="outline" size="sm" className="h-10">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
            {result.permissions.canApprove && result.status === 'Pending' && (
              <Button variant="default" size="sm" className="h-10">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Approve
              </Button>
            )}
            {result.permissions.canReject && result.status === 'Pending' && (
              <Button variant="destructive" size="sm" className="h-10">
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Render search result list item
  const renderResultListItem = (result: SearchResult) => (
    <div key={result.id} className="border rounded-lg p-4 hover:bg-accent transition-colors animate-fade-in">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold truncate">
              {highlightText(result.title, searchState.query)}
            </h3>
            <Badge className={getStatusColor(result.status)} variant="outline">
              {getStatusIcon(result.status)}
              <span className="ml-1">{result.status}</span>
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-2 text-xs mb-2">
            <Badge variant="secondary">{result.type}</Badge>
            <Badge variant="outline">{result.department}</Badge>
            {result.branch && <Badge variant="outline">{result.branch}</Badge>}
            <Badge className={getPriorityColor(result.priority)} variant="outline">
              {result.priority}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground">
            By {highlightText(result.submittedBy, searchState.query)} • {result.createdDate}
          </p>
        </div>
        
        <div className="flex gap-1">
          {result.permissions.canView && (
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          )}
          {result.permissions.canEdit && (
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  // Render filter section
  const renderFilterSection = (
    title: string,
    sectionKey: string,
    options: string[],
    selectedValues: string[]
  ) => (
    <Collapsible
      open={expandedFilterSections[sectionKey]}
      onOpenChange={() => toggleFilterSection(sectionKey)}
    >
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-3 h-auto">
          <span className="font-medium">{title}</span>
          <div className="flex items-center gap-2">
            {selectedValues.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {selectedValues.length}
              </Badge>
            )}
            {expandedFilterSections[sectionKey] ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-3">
        <div className="space-y-2">
          {options.map(option => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`${sectionKey}-${option}`}
                checked={selectedValues.includes(option)}
                onCheckedChange={(checked) => 
                  handleFilterChange(sectionKey as any, option, !!checked)
                }
              />
              <Label 
                htmlFor={`${sectionKey}-${option}`}
                className="text-sm cursor-pointer flex-1"
              >
                {option}
              </Label>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <div className={cn("space-y-6 animate-fade-in", className)}>
      {/* Search Header */}
      <Card className="shadow-elegant">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Universal Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search documents, users, departments, events..."
                  value={searchState.query}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  onFocus={() => setShowAutocomplete(searchState.query.trim().length > 0)}
                  className="pl-12 pr-12 h-12 text-base rounded-full shadow-sm border-2 focus:border-primary"
                />
                {searchState.query && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </form>

            {/* Autocomplete Dropdown */}
            {showAutocomplete && (searchState.autocomplete.length > 0 || searchState.recentSearches.length > 0) && (
              <div
                ref={autocompleteRef}
                className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 max-h-80 overflow-hidden"
              >
                <ScrollArea className="max-h-80">
                  {/* Autocomplete suggestions */}
                  {searchState.autocomplete.length > 0 && (
                    <div className="p-2">
                      <p className="text-xs font-medium text-muted-foreground px-2 py-1">Suggestions</p>
                      {searchState.autocomplete.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleAutocompleteSelect(item)}
                          className="w-full text-left px-3 py-2 hover:bg-accent rounded-md transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Search className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{item.text}</p>
                              <p className="text-xs text-muted-foreground">{item.category}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Recent searches */}
                  {searchState.recentSearches.length > 0 && (
                    <>
                      {searchState.autocomplete.length > 0 && <Separator />}
                      <div className="p-2">
                        <p className="text-xs font-medium text-muted-foreground px-2 py-1">Recent Searches</p>
                        {searchState.recentSearches.map((recent) => (
                          <button
                            key={recent.id}
                            onClick={() => loadRecentSearch(recent)}
                            className="w-full text-left px-3 py-2 hover:bg-accent rounded-md transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <History className="w-4 h-4 text-muted-foreground" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{recent.query}</p>
                                <p className="text-xs text-muted-foreground">
                                  {recent.resultCount} results • {recent.timestamp.toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </ScrollArea>
              </div>
            )}
          </div>

          {/* Quick Search Categories */}
          {!searchState.query && searchState.results.length === 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Letters', icon: FileText, query: 'type:Letter' },
                { label: 'Circulars', icon: FileText, query: 'type:Circular' },
                { label: 'Reports', icon: FileText, query: 'type:Report' },
                { label: 'Users', icon: Users, query: 'type:User' },
                { label: 'Departments', icon: Building, query: 'type:Department' },
                { label: 'Events', icon: Calendar, query: 'type:Event' },
                { label: 'Pending', icon: Clock, query: 'status:Pending' },
                { label: 'Emergency', icon: Zap, query: 'priority:Emergency' }
              ].map((category) => (
                <Button
                  key={category.label}
                  variant="outline"
                  onClick={() => search(category.query)}
                  className="h-16 flex flex-col gap-1 text-center"
                >
                  <category.icon className="w-5 h-5" />
                  <span className="text-xs">{category.label}</span>
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters and Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Desktop Filters */}
        <div className="hidden lg:block">
          <Card className="shadow-elegant sticky top-6">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Filters</CardTitle>
                <div className="flex items-center gap-2">
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary">{activeFilterCount}</Badge>
                  )}
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              {/* Status Filter */}
              {renderFilterSection('Status', 'status', STATUS_OPTIONS, searchState.filters.status)}
              <Separator />
              
              {/* Department Filter */}
              {renderFilterSection('Department', 'departments', DEPARTMENT_OPTIONS, searchState.filters.departments)}
              <Separator />
              
              {/* Branch Filter */}
              {renderFilterSection('Branch', 'branches', BRANCH_OPTIONS, searchState.filters.branches)}
              <Separator />
              
              {/* Role Filter */}
              {renderFilterSection('Role', 'roles', ROLE_OPTIONS, searchState.filters.roles)}
              <Separator />
              
              {/* Priority Filter */}
              {renderFilterSection('Priority', 'priority', PRIORITY_OPTIONS, searchState.filters.priority)}
              <Separator />

              {/* Date Range Filter */}
              <Collapsible
                open={expandedFilterSections.dateRange}
                onOpenChange={() => toggleFilterSection('dateRange')}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-3 h-auto">
                    <span className="font-medium">Date Range</span>
                    <div className="flex items-center gap-2">
                      {(searchState.filters.dateRange.startDate || searchState.filters.dateRange.endDate) && (
                        <Badge variant="secondary" className="text-xs">1</Badge>
                      )}
                      {expandedFilterSections.dateRange ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-3 pb-3">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Date Type</Label>
                      <select
                        value={searchState.filters.dateRange.type}
                        onChange={(e) => updateFilters({
                          dateRange: {
                            ...searchState.filters.dateRange,
                            type: e.target.value as any
                          }
                        })}
                        className="w-full mt-1 px-2 py-1 border rounded text-sm"
                      >
                        <option value="created">Created</option>
                        <option value="modified">Modified</option>
                        <option value="approved">Approved</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs">Start Date</Label>
                      <Input
                        type="date"
                        value={searchState.filters.dateRange.startDate}
                        onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                        className="mt-1 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">End Date</Label>
                      <Input
                        type="date"
                        value={searchState.filters.dateRange.endDate}
                        onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                        className="mt-1 text-sm"
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-3 space-y-4">
          {/* Results Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">
                {searchState.query ? `Results for "${searchState.query}"` : 'Search Results'}
              </h2>
              {searchState.totalResults > 0 && (
                <Badge variant="outline">
                  {searchState.totalResults} result{searchState.totalResults !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {/* Mobile Filter Button */}
              <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh]">
                  <SheetHeader>
                    <SheetTitle>Search Filters</SheetTitle>
                  </SheetHeader>
                  <ScrollArea className="h-full mt-4">
                    <div className="space-y-4">
                      {/* Mobile filter content - same as desktop but in sheet */}
                      <div className="space-y-1">
                        {renderFilterSection('Status', 'status', STATUS_OPTIONS, searchState.filters.status)}
                        <Separator />
                        {renderFilterSection('Department', 'departments', DEPARTMENT_OPTIONS, searchState.filters.departments)}
                        <Separator />
                        {renderFilterSection('Branch', 'branches', BRANCH_OPTIONS, searchState.filters.branches)}
                        <Separator />
                        {renderFilterSection('Role', 'roles', ROLE_OPTIONS, searchState.filters.roles)}
                        <Separator />
                        {renderFilterSection('Priority', 'priority', PRIORITY_OPTIONS, searchState.filters.priority)}
                      </div>
                      
                      <div className="flex gap-2 pt-4">
                        <Button onClick={resetFilters} variant="outline" className="flex-1">
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Reset
                        </Button>
                        <Button onClick={() => setShowMobileFilters(false)} className="flex-1">
                          Apply Filters
                        </Button>
                      </div>
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>

              {/* View Toggle */}
              <div className="flex border rounded-lg p-1">
                <Button
                  variant={searchState.viewMode === 'card' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => searchState.viewMode !== 'card' && toggleViewMode()}
                  className="h-8 w-8 p-0"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={searchState.viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => searchState.viewMode !== 'list' && toggleViewMode()}
                  className="h-8 w-8 p-0"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 p-4 bg-muted/30 rounded-lg">
              <span className="text-sm font-medium">Active filters:</span>
              
              {/* Status filters */}
              {searchState.filters.status.map(status => (
                <Badge key={status} variant="secondary" className="gap-1">
                  {status}
                  <button
                    onClick={() => handleFilterChange('status', status, false)}
                    className="ml-1 hover:bg-background/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              
              {/* Department filters */}
              {searchState.filters.departments.map(dept => (
                <Badge key={dept} variant="secondary" className="gap-1">
                  {dept}
                  <button
                    onClick={() => handleFilterChange('departments', dept, false)}
                    className="ml-1 hover:bg-background/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              
              {/* Other filters */}
              {[...searchState.filters.branches, ...searchState.filters.roles, ...searchState.filters.priority].map(filter => (
                <Badge key={filter} variant="secondary" className="gap-1">
                  {filter}
                  <button
                    onClick={() => {
                      // Determine which filter type this belongs to
                      if (BRANCH_OPTIONS.includes(filter)) handleFilterChange('branches', filter, false);
                      else if (ROLE_OPTIONS.includes(filter)) handleFilterChange('roles', filter, false);
                      else if (PRIORITY_OPTIONS.includes(filter)) handleFilterChange('priority', filter, false);
                    }}
                    className="ml-1 hover:bg-background/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                <RotateCcw className="w-4 h-4 mr-1" />
                Clear all
              </Button>
            </div>
          )}

          {/* Loading State */}
          {searchState.isLoading && (
            <div className="space-y-4">
              {searchState.viewMode === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-5 w-16" />
                          </div>
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-2/3" />
                          <div className="flex gap-2">
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-12" />
                          </div>
                          <div className="flex gap-2">
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-8 w-16" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-5 w-3/4" />
                          <div className="flex gap-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-12" />
                          </div>
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                        <div className="flex gap-1">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Error State */}
          {searchState.error && (
            <Card className="border-destructive">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-destructive" />
                <h3 className="text-lg font-semibold mb-2">Search Error</h3>
                <p className="text-muted-foreground mb-4">{searchState.error}</p>
                <Button onClick={() => search()} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retry Search
                </Button>
              </CardContent>
            </Card>
          )}

          {/* No Results State */}
          {!searchState.isLoading && !searchState.error && searchState.results.length === 0 && searchState.query && (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="w-16 h-16 mx-auto mb-6 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
                <p className="text-muted-foreground mb-6">
                  No results found for "<strong>{searchState.query}</strong>". Try:
                </p>
                <div className="space-y-2 text-sm text-muted-foreground mb-6">
                  <p>• Checking your spelling</p>
                  <p>• Using different keywords</p>
                  <p>• Removing some filters</p>
                  <p>• Searching for broader terms</p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button variant="outline" onClick={() => search('letters')}>
                    Search Letters
                  </Button>
                  <Button variant="outline" onClick={() => search('reports')}>
                    Search Reports
                  </Button>
                  <Button variant="outline" onClick={() => search('pending')}>
                    Pending Items
                  </Button>
                  <Button variant="outline" onClick={resetFilters}>
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State (no search performed) */}
          {!searchState.isLoading && !searchState.error && searchState.results.length === 0 && !searchState.query && (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="w-16 h-16 mx-auto mb-6 text-primary opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Universal Search</h3>
                <p className="text-muted-foreground mb-6">
                  Search across all documents, users, departments, and events in IAOMS
                </p>
                
                {/* Recent searches */}
                {searchState.recentSearches.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Recent Searches</h4>
                    <div className="flex flex-wrap justify-center gap-2">
                      {searchState.recentSearches.slice(0, 3).map((recent) => (
                        <Button
                          key={recent.id}
                          variant="outline"
                          size="sm"
                          onClick={() => loadRecentSearch(recent)}
                        >
                          <History className="w-4 h-4 mr-2" />
                          {recent.query}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-sm text-muted-foreground">
                  Start typing in the search bar above or click on a category to begin
                </p>
              </CardContent>
            </Card>
          )}

          {/* Search Results */}
          {!searchState.isLoading && !searchState.error && searchState.results.length > 0 && (
            <>
              {searchState.viewMode === 'card' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchState.results.map(renderResultCard)}
                </div>
              ) : (
                <div className="space-y-3">
                  {searchState.results.map(renderResultListItem)}
                </div>
              )}

              {/* Pagination */}
              {searchState.totalPages > 1 && (
                <div className="flex justify-center pt-6">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      disabled={searchState.currentPage === 1}
                      onClick={() => {
                        // Handle pagination
                        toast({
                          title: "Pagination",
                          description: "Pagination functionality would be implemented here",
                        });
                      }}
                    >
                      Previous
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {[...Array(Math.min(5, searchState.totalPages))].map((_, i) => {
                        const page = i + 1;
                        return (
                          <Button
                            key={page}
                            variant={page === searchState.currentPage ? "default" : "outline"}
                            size="sm"
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      disabled={searchState.currentPage === searchState.totalPages}
                      onClick={() => {
                        // Handle pagination
                        toast({
                          title: "Pagination",
                          description: "Pagination functionality would be implemented here",
                        });
                      }}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};