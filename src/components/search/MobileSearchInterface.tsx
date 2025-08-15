import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Filter, 
  X, 
  Clock, 
  TrendingUp,
  FileText,
  Users,
  Calendar,
  Building
} from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  title: string;
  type: string;
  status: string;
  department: string;
  date: string;
  relevance: number;
}

interface MobileSearchInterfaceProps {
  onSearch: (query: string, filters: any) => void;
  results: SearchResult[];
  loading: boolean;
  className?: string;
}

export const MobileSearchInterface: React.FC<MobileSearchInterfaceProps> = ({
  onSearch,
  results,
  loading,
  className
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    status: [],
    departments: [],
    types: []
  });

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      onSearch(debouncedQuery, filters);
      
      // Add to recent searches
      setRecentSearches(prev => {
        const updated = [debouncedQuery, ...prev.filter(s => s !== debouncedQuery)].slice(0, 5);
        localStorage.setItem('mobile-recent-searches', JSON.stringify(updated));
        return updated;
      });
    }
  }, [debouncedQuery, filters, onSearch]);

  useEffect(() => {
    const saved = localStorage.getItem('mobile-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const suggestions = [
    'Faculty recruitment letters',
    'Pending approvals',
    'CSE department reports',
    'Emergency notifications',
    'Meeting schedules'
  ].filter(suggestion => 
    suggestion.toLowerCase().includes(query.toLowerCase())
  );

  const clearSearch = () => {
    setQuery('');
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-success text-success-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'letter': return <FileText className="w-4 h-4" />;
      case 'circular': return <Users className="w-4 h-4" />;
      case 'report': return <TrendingUp className="w-4 h-4" />;
      case 'meeting': return <Calendar className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Bar */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Search documents, users, departments..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            className="pl-12 pr-12 h-14 text-lg rounded-full shadow-sm"
            onFocus={() => setShowSuggestions(query.length > 0)}
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Search Suggestions */}
        {showSuggestions && (query || recentSearches.length > 0) && (
          <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg">
            <CardContent className="p-0">
              <ScrollArea className="max-h-80">
                {query && suggestions.length > 0 && (
                  <div className="p-3">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Suggestions</p>
                    {suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full justify-start h-12 text-left"
                      >
                        <Search className="w-4 h-4 mr-3 text-muted-foreground" />
                        <span className="text-base">{suggestion}</span>
                      </Button>
                    ))}
                  </div>
                )}
                
                {recentSearches.length > 0 && (
                  <>
                    {query && suggestions.length > 0 && <Separator />}
                    <div className="p-3">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Recent Searches</p>
                      {recentSearches.map((recent, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          onClick={() => handleSuggestionClick(recent)}
                          className="w-full justify-start h-12 text-left"
                        >
                          <Clock className="w-4 h-4 mr-3 text-muted-foreground" />
                          <span className="text-base">{recent}</span>
                        </Button>
                      ))}
                    </div>
                  </>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="h-12 px-4">
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {(filters.status.length + filters.departments.length + filters.types.length) > 0 && (
                <Badge className="ml-2 bg-primary text-primary-foreground">
                  {filters.status.length + filters.departments.length + filters.types.length}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[70vh]">
            <SheetHeader>
              <SheetTitle>Search Filters</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-full mt-4">
              <div className="space-y-6 pb-6">
                {/* Status Filters */}
                <div>
                  <h4 className="font-medium mb-3">Status</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {['Approved', 'Pending', 'Rejected', 'Under Review'].map((status) => (
                      <Button
                        key={status}
                        variant={filters.status.includes(status) ? "default" : "outline"}
                        onClick={() => {
                          setFilters(prev => ({
                            ...prev,
                            status: prev.status.includes(status)
                              ? prev.status.filter(s => s !== status)
                              : [...prev.status, status]
                          }));
                        }}
                        className="h-12 text-sm"
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Department Filters */}
                <div>
                  <h4 className="font-medium mb-3">Departments</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      'Computer Science & Engineering',
                      'Electrical Engineering', 
                      'Mechanical Engineering',
                      'Electronics & Communication'
                    ].map((dept) => (
                      <Button
                        key={dept}
                        variant={filters.departments.includes(dept) ? "default" : "outline"}
                        onClick={() => {
                          setFilters(prev => ({
                            ...prev,
                            departments: prev.departments.includes(dept)
                              ? prev.departments.filter(d => d !== dept)
                              : [...prev.departments, dept]
                          }));
                        }}
                        className="h-12 text-sm justify-start"
                      >
                        <Building className="w-4 h-4 mr-2" />
                        {dept}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Type Filters */}
                <div>
                  <h4 className="font-medium mb-3">Document Types</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {['Letter', 'Circular', 'Report', 'Meeting'].map((type) => (
                      <Button
                        key={type}
                        variant={filters.types.includes(type) ? "default" : "outline"}
                        onClick={() => {
                          setFilters(prev => ({
                            ...prev,
                            types: prev.types.includes(type)
                              ? prev.types.filter(t => t !== type)
                              : [...prev.types, type]
                          }));
                        }}
                        className="h-12 text-sm"
                      >
                        {getTypeIcon(type)}
                        <span className="ml-2">{type}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setFilters({ status: [], departments: [], types: [] })}
                  className="w-full h-12"
                >
                  Clear All Filters
                </Button>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      {/* Search Results */}
      <div className="space-y-3">
        {loading && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-muted rounded w-16"></div>
                      <div className="h-6 bg-muted rounded w-20"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && results.length === 0 && query && (
          <Card>
            <CardContent className="p-8 text-center">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or filters
              </p>
            </CardContent>
          </Card>
        )}

        {!loading && results.map((result) => (
          <Card key={result.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-base line-clamp-2 flex-1 pr-2">
                    {result.title}
                  </h3>
                  <Badge className={getStatusColor(result.status)}>
                    {result.status}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {getTypeIcon(result.type)}
                    <span className="ml-1">{result.type}</span>
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Building className="w-3 h-3 mr-1" />
                    {result.department}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{result.date}</span>
                  <span>{Math.round(result.relevance * 100)}% match</span>
                </div>
                
                <Button variant="outline" className="w-full h-12">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};