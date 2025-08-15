import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { MobileSearchInterface } from "@/components/search/MobileSearchInterface";
import { UniversalSearch } from "@/components/UniversalSearch";
import { useResponsive } from "@/hooks/useResponsive";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const Search = () => {
  const { user } = useAuth();
  const { isMobile } = useResponsive();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: string, filters: any) => {
    setLoading(true);
    // Simulate search API call
    setTimeout(() => {
      setSearchResults([]);
      setLoading(false);
    }, 1000);
  };

  if (!user) return null;

  return (
    <ResponsiveLayout>
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Universal Search
          </h1>
          <p className="text-muted-foreground">
            Search across documents, users, departments, and more
          </p>
        </div>
        
        {isMobile ? (
          <MobileSearchInterface
            onSearch={handleSearch}
            results={searchResults}
            loading={loading}
          />
        ) : (
          <UniversalSearch userRole={user.role} />
        )}
      </div>
    </ResponsiveLayout>
  );
};

export default Search;