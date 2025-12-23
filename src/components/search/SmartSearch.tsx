import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, MapPin, X, Loader2, Sparkles, Navigation, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [isFocused, setIsFocused] = useState(false);
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
        setIsFocused(false);
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
          "relative flex items-center bg-card/98 backdrop-blur-lg border rounded-[18px] md:rounded-[20px] transition-all duration-300",
          isFocused 
            ? "shadow-[0_0_0_3px_hsl(200_100%_55%/0.15)] border-[hsl(200_100%_55%/0.35)]" 
            : "shadow-soft border-border/25 hover:shadow-elevated hover:border-border/40",
          isLarge ? "h-[60px] md:h-[68px]" : "h-12 md:h-13"
        )}
      >
        {/* Search icon with AI sparkle - premium styling */}
        <div className={cn(
          "flex items-center justify-center flex-shrink-0",
          isLarge ? "pl-4 md:pl-5" : "pl-3 md:pl-4"
        )}>
          {isSearching ? (
            <Loader2 className={cn("animate-spin text-primary", isLarge ? "w-5 h-5 md:w-6 md:h-6" : "w-4 h-4 md:w-5 md:h-5")} />
          ) : (
            <div className={cn(
              "relative flex items-center justify-center rounded-xl transition-all duration-300",
              isLarge ? "w-10 h-10 md:w-11 md:h-11" : "w-9 h-9",
              isFocused 
                ? "bg-gradient-to-br from-[hsl(200_100%_55%/0.15)] to-[hsl(210_100%_60%/0.08)]" 
                : "bg-primary/8"
            )}>
              <Search className={cn(
                "transition-colors duration-200",
                isFocused ? "text-[hsl(200_100%_50%)]" : "text-primary/70",
                isLarge ? "w-5 h-5" : "w-4 h-4"
              )} />
              <Sparkles className={cn(
                "absolute -top-0.5 -right-0.5 transition-all duration-300",
                isFocused ? "opacity-100 text-[hsl(190_100%_50%)]" : "opacity-60 text-primary/70",
                isLarge ? "w-3.5 h-3.5" : "w-3 h-3"
              )} />
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
          onFocus={() => {
            setShowSuggestions(true);
            setIsFocused(true);
          }}
          onBlur={() => {
            // Delay to allow click on suggestions
            setTimeout(() => setIsFocused(false), 150);
          }}
          onKeyDown={handleKeyDown}
          placeholder={dynamicPlaceholder}
          className={cn(
            "flex-1 min-w-0 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/45 truncate",
            isLarge ? "pl-3.5 md:pl-4 pr-2 text-base md:text-lg font-medium" : "pl-3 md:pl-4 pr-2 text-sm"
          )}
          aria-label="Search facilities"
        />

        <div className="flex items-center gap-1.5 md:gap-2 pr-2 md:pr-2.5 flex-shrink-0">
          {query && (
            <button
              onClick={clearSearch}
              className={cn(
                "text-muted-foreground/50 hover:text-foreground transition-all rounded-full hover:bg-secondary/70 flex items-center justify-center",
                isLarge ? "p-2 min-h-[38px] min-w-[38px]" : "p-1.5 min-h-[32px] min-w-[32px]"
              )}
              aria-label="Clear search"
            >
              <X className={cn(isLarge ? "w-4 h-4" : "w-4 h-4")} />
            </button>
          )}

          {onLocateMe && (
            <>
              <div className={cn("w-px bg-border/40 mx-0.5 hidden sm:block", isLarge ? "h-7" : "h-6")} />
              <button
                onClick={onLocateMe}
                className={cn(
                  "text-primary/60 hover:text-primary transition-all rounded-full hover:bg-primary/10 flex items-center justify-center",
                  isLarge ? "p-2 min-h-[38px] min-w-[38px]" : "p-1.5 min-h-[32px] min-w-[32px]"
                )}
                title="Use my location"
                aria-label="Use my location"
              >
                <Navigation className={cn(isLarge ? "w-4 h-4" : "w-4 h-4")} />
              </button>
            </>
          )}

          {/* Primary action button - Solid gradient blue */}
          <button
            onClick={() => handleSubmit()}
            disabled={!query.trim()}
            className={cn(
              "flex items-center justify-center rounded-xl transition-all duration-250",
              "bg-gradient-to-br from-[hsl(195_100%_48%)] via-[hsl(205_100%_50%)] to-[hsl(215_100%_48%)] text-white",
              "shadow-[0_4px_16px_-4px_hsl(200_100%_50%/0.35)] hover:shadow-[0_6px_24px_-4px_hsl(200_100%_50%/0.5)] active:scale-95",
              "disabled:opacity-25 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(200_100%_55%)] focus-visible:ring-offset-2",
              isLarge ? "w-11 h-11 md:w-12 md:h-12" : "w-10 h-10"
            )}
            aria-label="Search"
          >
            <Send className={cn(
              "transition-transform duration-200",
              isLarge ? "w-4.5 h-4.5 md:w-5 md:h-5" : "w-4 h-4"
            )} />
          </button>
        </div>

      </div>

      {/* AI-Powered Suggestions - Premium dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div 
          className="absolute left-0 right-0 top-full mt-3 bg-card/98 backdrop-blur-xl border border-border/50 rounded-2xl shadow-elevated z-[9999] animate-fade-in flex flex-col max-h-[220px] md:max-h-[300px] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30 flex-shrink-0 bg-secondary/30">
            <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              AI-Powered Suggestions
            </p>
          </div>
          
          {/* Scrollable Suggestions List */}
          <div className="flex-1 overflow-y-auto scroll-smooth px-2 py-2">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={suggestion.text}
                onClick={() => handleSubmit(suggestion.text)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150",
                  index === selectedIndex
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-foreground hover:bg-secondary/80"
                )}
              >
                <span className="text-lg flex-shrink-0">{suggestion.icon}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium">{suggestion.text}</span>
                  <span className={cn(
                    "ml-2 text-xs px-2 py-0.5 rounded-full font-medium",
                    index === selectedIndex 
                      ? "bg-primary-foreground/20 text-primary-foreground" 
                      : "bg-secondary text-muted-foreground"
                  )}>
                    {suggestion.category}
                  </span>
                </div>
                <MapPin className={cn(
                  "w-4 h-4 flex-shrink-0",
                  index === selectedIndex ? "text-primary-foreground/60" : "text-muted-foreground/40"
                )} />
              </button>
            ))}
          </div>
          
          {/* Footer */}
          <div className="px-4 py-2.5 bg-secondary/40 border-t border-border/30 flex items-center gap-2 flex-shrink-0">
            <Sparkles className="w-3 h-3 text-primary/70" />
            <p className="text-xs text-muted-foreground/70 font-medium">
              AI understands natural language queries
            </p>
          </div>
        </div>
      )}
    </div>
  );
}