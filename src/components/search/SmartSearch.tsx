import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, MapPin, X, Loader2, Sparkles, Navigation, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SmartSearchProps {
  onSearch: (query: string) => void;
  onLocateMe?: () => void;
  isSearching?: boolean;
  className?: string;
  size?: 'default' | 'large';
  placeholder?: string;
  activeLayerId?: number | null;
}

const aiSuggestions = [
  { text: 'Nearest hospital', icon: '🏥', category: 'Emergency' },
  { text: 'Emergency hospital near me', icon: '🚑', category: 'Emergency' },
  { text: 'Hospitals with ICU in Abu Dhabi', icon: '🏥', category: 'Healthcare' },
  { text: 'Schools in Abu Dhabi', icon: '🎓', category: 'Education' },
  { text: 'Pharmacies near me', icon: '💊', category: 'Healthcare' },
  { text: 'Clinics in Dubai', icon: '🩺', category: 'Healthcare' },
  { text: 'Private schools Abu Dhabi', icon: '📚', category: 'Education' },
  { text: 'Hospitals in Sharjah', icon: '🏥', category: 'Healthcare' },
  { text: 'Nearest nursery', icon: '👶', category: 'Education' },
  { text: 'Healthcare centers near me', icon: '🏨', category: 'Healthcare' },
];

// Hospital-related keywords for icon display
const hospitalKeywords = ['hospital', 'hospitals', 'emergency', 'icu', 'trauma', 'medical'];

export function SmartSearch({ 
  onSearch, 
  onLocateMe,
  isSearching = false, 
  className, 
  size = 'default',
  placeholder = "Search for nearest healthcare, schools, or wellness centers...",
  activeLayerId
}: SmartSearchProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if hospital icon should be shown
  const showHospitalIcon = useMemo(() => {
    const isHospitalLayerActive = activeLayerId === 330;
    const hasHospitalKeyword = hospitalKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    );
    return isHospitalLayerActive || hasHospitalKeyword;
  }, [activeLayerId, query]);

  // Dynamic placeholder based on context
  const dynamicPlaceholder = useMemo(() => {
    if (activeLayerId === 330) {
      return "Search hospitals, emergency care, specialties…";
    }
    return placeholder;
  }, [activeLayerId, placeholder]);

  const filteredSuggestions = query.trim() 
    ? aiSuggestions.filter(s =>
        s.text.toLowerCase().includes(query.toLowerCase()) ||
        s.category.toLowerCase().includes(query.toLowerCase())
      )
    : aiSuggestions;

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
    <div ref={containerRef} className={cn("relative w-full", className)} style={{ overflow: 'visible' }}>
      <div
        className={cn(
          "relative flex items-center bg-card border border-border rounded-2xl shadow-lg transition-all duration-300",
          showSuggestions && "shadow-xl border-primary/50 ring-2 ring-primary/20",
          !showSuggestions && "hover:shadow-xl hover:border-border/80",
          isLarge ? "h-14 md:h-16" : "h-12"
        )}
      >
        {/* Search/Hospital indicator */}
        <div className={cn(
          "flex items-center justify-center",
          isLarge ? "pl-5 md:pl-6" : "pl-4"
        )}>
          {isSearching ? (
            <Loader2 className={cn("animate-spin text-primary", isLarge ? "w-5 h-5 md:w-6 md:h-6" : "w-5 h-5")} />
          ) : (
            <div className="relative">
              <Search className={cn("text-muted-foreground", isLarge ? "w-5 h-5 md:w-6 md:h-6" : "w-5 h-5")} />
              <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-primary animate-pulse" />
            </div>
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
          placeholder={dynamicPlaceholder}
          className={cn(
            "flex-1 min-w-0 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground truncate",
            isLarge ? "pl-4 pr-2 text-base md:text-lg" : "pl-3 pr-2 text-sm"
          )}
        />

        <div className="flex items-center gap-1 pr-3">
          {query && (
            <button
              onClick={clearSearch}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {onLocateMe && (
            <>
              <div className="w-px h-5 bg-border mx-1" />
              <button
                onClick={onLocateMe}
                className="p-1.5 text-primary hover:text-primary/80 transition-colors rounded-full hover:bg-primary/10"
                title="Use my location"
              >
                <Navigation className={cn("w-4 h-4", isLarge && "w-5 h-5")} />
              </button>
            </>
          )}
        </div>

      </div>

      {/* AI-Powered Suggestions - Compact fixed height with internal scroll */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div 
          className="absolute left-0 right-0 top-full mt-2 bg-card border border-border rounded-xl shadow-2xl z-[9999] animate-fade-in flex flex-col max-h-[200px] md:max-h-[280px]"
        >
          {/* Fixed Header */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/50 flex-shrink-0">
            <Sparkles className="w-4 h-4 text-primary" />
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              AI-Powered Suggestions
            </p>
          </div>
          
          {/* Scrollable Suggestions List */}
          <div className="flex-1 overflow-y-auto scroll-smooth px-2 py-1.5">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={suggestion.text}
                onClick={() => handleSubmit(suggestion.text)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all",
                  index === selectedIndex
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary"
                )}
              >
                <span className="text-lg flex-shrink-0">{suggestion.icon}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium">{suggestion.text}</span>
                  <span className={cn(
                    "ml-2 text-xs px-2 py-0.5 rounded-full",
                    index === selectedIndex 
                      ? "bg-primary-foreground/20 text-primary-foreground" 
                      : "bg-secondary text-muted-foreground"
                  )}>
                    {suggestion.category}
                  </span>
                </div>
                <MapPin className={cn(
                  "w-4 h-4 flex-shrink-0",
                  index === selectedIndex ? "text-primary-foreground/60" : "text-muted-foreground/60"
                )} />
              </button>
            ))}
          </div>
          
          {/* Fixed Footer Hint */}
          <div className="px-4 py-2 bg-secondary/50 border-t border-border rounded-b-xl flex items-center gap-2 flex-shrink-0">
            <Sparkles className="w-3 h-3 text-primary" />
            <p className="text-xs text-muted-foreground">
              AI understands natural language queries
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
