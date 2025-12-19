import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { searchSuggestions } from '@/data/layers';

interface SmartSearchProps {
  onSearch: (query: string) => void;
  isSearching?: boolean;
  className?: string;
  size?: 'default' | 'large';
}

export function SmartSearch({ onSearch, isSearching = false, className, size = 'default' }: SmartSearchProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions = searchSuggestions.filter(s =>
    s.text.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredSuggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && filteredSuggestions[selectedIndex]) {
        handleSubmit(filteredSuggestions[selectedIndex].text);
      } else {
        handleSubmit();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const isLarge = size === 'large';

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div
        className={cn(
          "relative flex items-center bg-card border border-border rounded-full shadow-card transition-all duration-200",
          showSuggestions && "shadow-card-hover border-primary/30",
          isLarge ? "h-14 md:h-16" : "h-12"
        )}
      >
        <div className={cn("flex items-center justify-center text-muted-foreground", isLarge ? "pl-5 md:pl-6" : "pl-4")}>
          {isSearching ? (
            <Loader2 className={cn("animate-spin", isLarge ? "w-5 h-5 md:w-6 md:h-6" : "w-5 h-5")} />
          ) : (
            <Search className={cn(isLarge ? "w-5 h-5 md:w-6 md:h-6" : "w-5 h-5")} />
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder="Try 'nearest hospital', 'schools in Abu Dhabi'"
          className={cn(
            "flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground",
            isLarge ? "px-4 text-base md:text-lg" : "px-3 text-sm"
          )}
        />

        {query && (
          <button
            onClick={clearSearch}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => handleSubmit()}
          disabled={!query.trim() || isSearching}
          className={cn(
            "gradient-primary text-primary-foreground rounded-full font-medium transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
            isLarge ? "h-10 md:h-12 px-5 md:px-8 mr-2 text-sm md:text-base" : "h-9 px-5 mr-1.5 text-sm"
          )}
        >
          Search
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50 animate-fade-in">
          <div className="p-2">
            <p className="px-3 py-2 text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Suggested Searches
            </p>
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={suggestion.text}
                onClick={() => handleSubmit(suggestion.text)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                  index === selectedIndex
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary"
                )}
              >
                <MapPin className="w-4 h-4 opacity-60" />
                <span className="text-sm">{suggestion.text}</span>
              </button>
            ))}
          </div>
          <div className="px-4 py-3 bg-secondary/50 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Search supports public healthcare and education datasets only.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
