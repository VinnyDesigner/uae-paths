import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, MapPin, X, Loader2, Sparkles, Navigation, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SmartSearchProps {
  onSearch: (query: string) => void;
  onLocateMe?: () => void;
  isSearching?: boolean;
  className?: string;
  size?: 'default' | 'large';
  placeholder?: string;
  activeLayerId?: number | null;
  variant?: 'light' | 'dark';
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
  activeLayerId,
  variant = 'light'
}: SmartSearchProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isDark = variant === 'dark';

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
          "relative flex items-center rounded-[20px] md:rounded-[24px] transition-all duration-300",
          isDark ? [
            "bg-white/5 backdrop-blur-xl border",
            isFocused 
              ? "border-cyan-400/40 shadow-[0_0_40px_-10px_hsl(188_100%_50%/0.25)]" 
              : "border-white/10 hover:border-white/15"
          ] : [
            "bg-white/98 backdrop-blur-xl border",
            isFocused 
              ? "shadow-[0_0_0_4px_hsl(200_100%_55%/0.12)] border-[hsl(200_100%_55%/0.4)]" 
              : "shadow-[0_4px_20px_-6px_hsl(210_50%_30%/0.12)] border-[hsl(210_30%_90%)] hover:shadow-[0_6px_28px_-6px_hsl(210_50%_30%/0.16)] hover:border-[hsl(210_40%_85%)]"
          ],
          isLarge ? "h-[60px] md:h-[68px]" : "h-12 md:h-14"
        )}
      >
        {/* Search icon with AI sparkle */}
        <div className={cn(
          "flex items-center justify-center flex-shrink-0",
          isLarge ? "pl-4 md:pl-5" : "pl-3 md:pl-4"
        )}>
          {isSearching ? (
            <Loader2 className={cn(
              "animate-spin",
              isDark ? "text-cyan-400" : "text-[hsl(200_100%_50%)]",
              isLarge ? "w-5 h-5 md:w-6 md:h-6" : "w-4 h-4 md:w-5 md:h-5"
            )} />
          ) : (
            <div className={cn(
              "relative flex items-center justify-center rounded-xl transition-all duration-300",
              isLarge ? "w-10 h-10 md:w-11 md:h-11" : "w-9 h-9",
              isDark 
                ? isFocused ? "bg-cyan-500/20" : "bg-white/10"
                : isFocused ? "bg-gradient-to-br from-[hsl(195_100%_55%/0.15)] to-[hsl(210_100%_60%/0.1)]" : "bg-[hsl(210_60%_96%)]"
            )}>
              <Search className={cn(
                "transition-colors duration-200",
                isDark 
                  ? isFocused ? "text-cyan-400" : "text-white/60"
                  : isFocused ? "text-[hsl(200_100%_48%)]" : "text-[hsl(210_50%_45%)]",
                isLarge ? "w-5 h-5 md:w-[22px] md:h-[22px]" : "w-4 h-4"
              )} />
              <Sparkles className={cn(
                "absolute -top-0.5 -right-0.5 transition-all duration-300",
                isDark 
                  ? isFocused ? "opacity-100 text-cyan-300" : "opacity-50 text-white/40"
                  : isFocused ? "opacity-100 text-[hsl(188_100%_48%)]" : "opacity-50 text-[hsl(210_50%_55%)]",
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
            setTimeout(() => setIsFocused(false), 150);
          }}
          onKeyDown={handleKeyDown}
          placeholder={dynamicPlaceholder}
          className={cn(
            "flex-1 min-w-0 bg-transparent border-none outline-none truncate",
            isDark 
              ? "text-white placeholder:text-white/40"
              : "text-foreground placeholder:text-muted-foreground/45",
            isLarge ? "pl-3 md:pl-4 pr-2 text-base md:text-lg font-medium" : "pl-3 md:pl-4 pr-2 text-sm"
          )}
          aria-label="Search facilities"
        />

        <div className="flex items-center gap-1.5 md:gap-2 pr-2 md:pr-2.5 flex-shrink-0">
          {query && (
            <button
              onClick={clearSearch}
              className={cn(
                "transition-all rounded-full flex items-center justify-center",
                isDark 
                  ? "text-white/40 hover:text-white hover:bg-white/10"
                  : "text-muted-foreground/50 hover:text-foreground hover:bg-secondary/70",
                isLarge ? "p-2 min-h-[38px] min-w-[38px]" : "p-1.5 min-h-[32px] min-w-[32px]"
              )}
              aria-label="Clear search"
            >
              <X className={cn(isLarge ? "w-4 h-4" : "w-4 h-4")} />
            </button>
          )}

          {onLocateMe && (
            <>
              <div className={cn(
                "w-px mx-0.5 hidden sm:block",
                isDark ? "bg-white/15" : "bg-border/40",
                isLarge ? "h-7" : "h-6"
              )} />
              <button
                onClick={onLocateMe}
                className={cn(
                  "transition-all rounded-full flex items-center justify-center",
                  isDark 
                    ? "text-cyan-400/60 hover:text-cyan-400 hover:bg-cyan-400/10"
                    : "text-primary/60 hover:text-primary hover:bg-primary/10",
                  isLarge ? "p-2 min-h-[38px] min-w-[38px]" : "p-1.5 min-h-[32px] min-w-[32px]"
                )}
                title="Use my location"
                aria-label="Use my location"
              >
                <Navigation className={cn(isLarge ? "w-4 h-4" : "w-4 h-4")} />
              </button>
            </>
          )}

          {/* Primary action button - Gradient circular */}
          <button
            onClick={() => handleSubmit()}
            disabled={!query.trim()}
            className={cn(
              "flex items-center justify-center rounded-xl transition-all duration-250",
              "disabled:opacity-20 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              isDark ? [
                "bg-gradient-to-br from-cyan-400 via-cyan-500 to-cyan-600 text-white",
                "shadow-[0_6px_24px_-5px_hsl(188_100%_50%/0.5)] hover:shadow-[0_8px_30px_-5px_hsl(188_100%_50%/0.6)]",
                "active:scale-[0.96] focus-visible:ring-cyan-400"
              ] : [
                "bg-gradient-to-br from-[hsl(192_100%_46%)] via-[hsl(205_100%_50%)] to-[hsl(218_90%_50%)] text-white",
                "shadow-[0_6px_22px_-5px_hsl(200_100%_45%/0.45)] hover:shadow-[0_8px_28px_-5px_hsl(200_100%_45%/0.55)]",
                "active:scale-[0.96] focus-visible:ring-[hsl(200_100%_55%)]"
              ],
              isLarge ? "w-12 h-12 md:w-14 md:h-14" : "w-10 h-10"
            )}
            aria-label="Search"
          >
            <ArrowRight className={cn(
              "transition-transform duration-200",
              isLarge ? "w-5 h-5 md:w-[22px] md:h-[22px]" : "w-4 h-4"
            )} />
          </button>
        </div>
      </div>

      {/* AI-Powered Suggestions - Premium dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div 
          className={cn(
            "absolute left-0 right-0 top-full mt-3 rounded-2xl shadow-elevated z-[9999] animate-fade-in flex flex-col max-h-[220px] md:max-h-[300px] overflow-hidden",
            isDark 
              ? "bg-[hsl(215_40%_15%/0.95)] backdrop-blur-xl border border-white/10"
              : "bg-card/98 backdrop-blur-xl border border-border/50"
          )}
        >
          {/* Header */}
          <div className={cn(
            "flex items-center gap-2 px-4 py-3 border-b flex-shrink-0",
            isDark ? "border-white/10 bg-white/5" : "border-border/30 bg-secondary/30"
          )}>
            <div className={cn(
              "w-6 h-6 rounded-lg flex items-center justify-center",
              isDark ? "bg-cyan-500/20" : "bg-primary/10"
            )}>
              <Sparkles className={cn("w-3.5 h-3.5", isDark ? "text-cyan-400" : "text-primary")} />
            </div>
            <p className={cn(
              "text-xs font-semibold uppercase tracking-wider",
              isDark ? "text-white/60" : "text-muted-foreground"
            )}>
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
                    ? isDark 
                      ? "bg-cyan-500/20 text-white shadow-soft"
                      : "bg-primary text-primary-foreground shadow-soft"
                    : isDark
                      ? "text-white/80 hover:bg-white/10"
                      : "text-foreground hover:bg-secondary/80"
                )}
              >
                <span className="text-lg flex-shrink-0">{suggestion.icon}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium">{suggestion.text}</span>
                  <span className={cn(
                    "ml-2 text-xs px-2 py-0.5 rounded-full font-medium",
                    index === selectedIndex 
                      ? isDark
                        ? "bg-cyan-400/20 text-cyan-300"
                        : "bg-primary-foreground/20 text-primary-foreground"
                      : isDark
                        ? "bg-white/10 text-white/50"
                        : "bg-secondary text-muted-foreground"
                  )}>
                    {suggestion.category}
                  </span>
                </div>
                <MapPin className={cn(
                  "w-4 h-4 flex-shrink-0",
                  index === selectedIndex 
                    ? isDark ? "text-cyan-300/60" : "text-primary-foreground/60"
                    : isDark ? "text-white/30" : "text-muted-foreground/40"
                )} />
              </button>
            ))}
          </div>
          
          {/* Footer */}
          <div className={cn(
            "px-4 py-2.5 border-t flex items-center gap-2 flex-shrink-0",
            isDark ? "bg-white/5 border-white/10" : "bg-secondary/40 border-border/30"
          )}>
            <Sparkles className={cn("w-3 h-3", isDark ? "text-cyan-400/70" : "text-primary/70")} />
            <p className={cn(
              "text-xs font-medium",
              isDark ? "text-white/40" : "text-muted-foreground/70"
            )}>
              AI understands natural language queries
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
