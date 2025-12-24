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
  onOpenChange?: (isOpen: boolean) => void;
  hideSubmitButton?: boolean;
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

const hospitalKeywords = ['hospital', 'hospitals', 'emergency', 'icu', 'trauma', 'medical'];

export function SmartSearch({ 
  onSearch, 
  onLocateMe,
  isSearching = false, 
  className, 
  size = 'default',
  placeholder = "Search for nearest healthcare, schools, or wellness centers...",
  activeLayerId,
  variant = 'light',
  onOpenChange,
  hideSubmitButton = false
}: SmartSearchProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isDark = variant === 'dark';
  const isLarge = size === 'large';

  // Notify parent of open state changes
  useEffect(() => {
    onOpenChange?.(showSuggestions || isFocused);
  }, [showSuggestions, isFocused, onOpenChange]);

  const showHospitalIcon = useMemo(() => {
    const isHospitalLayerActive = activeLayerId === 330;
    const hasHospitalKeyword = hospitalKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    );
    return isHospitalLayerActive || hasHospitalKeyword;
  }, [activeLayerId, query]);

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
      setIsFocused(false);
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
      setIsFocused(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full z-[var(--z-dropdown)]",
        className,
      )}
      style={{ overflow: 'visible' }}
    >
      {/* Page dim overlay when dropdown is open */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="fixed inset-0 bg-black/30 z-[var(--z-popover-backdrop)] pointer-events-none" />
      )}
      
      {/* Liquid Glass Search Container - Continuous glowing effect */}
      <div
        className={cn(
          "relative flex items-center transition-all duration-300 rounded-full overflow-visible z-[var(--z-dropdown)]",
          isDark ? [
            "glass-search-liquid",
            "border-2 border-[rgba(0,192,255,0.4)]",
            "bg-[rgba(255,255,255,0.12)]",
            "animate-search-glow",
            isFocused && "!bg-[rgba(255,255,255,0.18)] !border-[rgba(0,192,255,0.6)]"
          ] : [
            "glass-search rounded-[20px] md:rounded-[24px]"
          ],
          isLarge 
            ? "h-[64px] md:h-[70px] lg:h-[76px]" 
            : "h-12 md:h-14"
        )}
      >
        {/* Active overlay removed - focus handled by glass-search-liquid:focus-within */}

        <div className={cn(
          "flex items-center justify-center flex-shrink-0",
          isLarge ? "pl-2 md:pl-3" : "pl-2 md:pl-3"
        )}>
          {isSearching ? (
            <div className={cn(
              "flex items-center justify-center rounded-full",
              isLarge ? "w-11 h-11 md:w-12 md:h-12" : "w-9 h-9",
              "bg-[rgba(0,0,0,0.20)] border border-white/18"
            )}>
              <Loader2 className={cn(
                "animate-spin text-cyan-400",
                isLarge ? "w-5 h-5 md:w-6 md:h-6" : "w-4 h-4 md:w-5 md:h-5"
              )} strokeWidth={2} />
            </div>
          ) : (
            <div className={cn(
              "relative flex items-center justify-center rounded-full transition-all duration-300",
              isLarge ? "w-11 h-11 md:w-12 md:h-12" : "w-9 h-9",
              isDark 
                ? "bg-[rgba(0,0,0,0.20)] border border-white/18"
                : isFocused ? "bg-gradient-to-br from-[hsl(195_100%_55%/0.15)] to-[hsl(210_100%_60%/0.1)]" : "bg-[hsl(210_60%_96%)]"
            )}>
              <Search className={cn(
                "transition-colors duration-200",
                isDark 
                  ? "text-cyan-400"
                  : isFocused ? "text-[hsl(200_100%_48%)]" : "text-[hsl(210_50%_45%)]",
                isLarge ? "w-5 h-5" : "w-4 h-4"
              )} strokeWidth={2} />
              <Sparkles className={cn(
                "absolute -top-0.5 -right-0.5 transition-all duration-300",
                isDark 
                  ? "opacity-80 text-cyan-300"
                  : isFocused ? "opacity-100 text-[hsl(188_100%_48%)]" : "opacity-50 text-[hsl(210_50%_55%)]",
                isLarge ? "w-3 h-3" : "w-2.5 h-2.5"
              )} strokeWidth={2} />
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
            "flex-1 min-w-0 border-none truncate",
            "focus:outline-none focus:ring-0 focus:border-none focus:bg-transparent",
            "active:bg-transparent active:outline-none active:ring-0",
            "[&:focus]:bg-transparent [&:focus]:shadow-none [&:focus]:outline-none",
            isDark 
              ? "text-[rgba(255,255,255,0.95)] placeholder:text-[rgba(255,255,255,0.50)]"
              : "text-foreground placeholder:text-muted-foreground/45",
            isLarge ? "pl-3 md:pl-4 pr-2 text-base md:text-lg font-medium" : "pl-3 pr-2 text-sm"
          )}
          style={{ 
            fontSize: isLarge ? '18px' : undefined, 
            outline: 'none', 
            boxShadow: 'none',
            background: 'transparent',
            WebkitTapHighlightColor: 'transparent',
            caretColor: 'rgba(0, 212, 255, 0.9)'
          }}
          aria-label="Search facilities"
        />

        <div className="flex items-center gap-1.5 md:gap-2 pr-2 md:pr-3 flex-shrink-0">
          {query && (
            <button
              onClick={clearSearch}
              className={cn(
                "transition-all rounded-full flex items-center justify-center",
                isDark 
                  ? "text-white/40 hover:text-white hover:bg-white/10"
                  : "text-muted-foreground/50 hover:text-foreground hover:bg-secondary/70",
                isLarge ? "p-2" : "p-1.5"
              )}
              aria-label="Clear search"
            >
              <X className="w-4 h-4" strokeWidth={2} />
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
                  isLarge ? "p-2" : "p-1.5"
                )}
                title="Use my location"
                aria-label="Use my location"
              >
                <Navigation className="w-4 h-4" strokeWidth={2} />
              </button>
            </>
          )}

          {/* Primary action button - Darker gradient for better visibility */}
          {!hideSubmitButton && (
            <button
              onClick={() => handleSubmit()}
              className={cn(
                "flex items-center justify-center rounded-full transition-all duration-250",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                isDark ? [
                  "bg-[#00DAFF] text-[#063660]",
                  "shadow-[0_10px_30px_rgba(0,218,255,0.4)] hover:shadow-[0_14px_35px_rgba(0,218,255,0.5)]",
                  "active:scale-[0.96] focus-visible:ring-[#00DAFF] hover:brightness-110"
                ] : [
                  "bg-[#00DAFF] text-[#063660]",
                  "shadow-[0_6px_22px_-5px_rgba(0,218,255,0.45)]",
                  "active:scale-[0.96] focus-visible:ring-[#00DAFF]"
                ],
                isLarge ? "w-12 h-12 md:w-14 md:h-14" : "w-10 h-10"
              )}
              aria-label="Search"
            >
              <ArrowRight className={cn(
                "transition-transform duration-200 text-white drop-shadow-sm",
                isLarge ? "w-5 h-5 md:w-6 md:h-6" : "w-4 h-4"
              )} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>

      {/* Dropdown - matching search bar rounded corners */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div 
          className={cn(
            "absolute left-0 right-0 top-full mt-2 z-[var(--z-dropdown)] animate-fade-in flex flex-col overflow-hidden",
            "glass-dropdown"
          )}
          style={{ maxHeight: 'min(420px, 46vh)' }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10 flex-shrink-0">
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-cyan-500/20">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" strokeWidth={2} />
            </div>
            <p className="text-xs font-semibold tracking-wider text-white/65 uppercase">
              Suggestions for you
            </p>
          </div>
          
          {/* Scrollable Suggestions List */}
          <div className="flex-1 overflow-y-auto scroll-smooth px-3 py-2">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={suggestion.text}
                onClick={() => handleSubmit(suggestion.text)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-[20px] text-left transition-all duration-150",
                  index === selectedIndex
                    ? "bg-cyan-500/20 text-white"
                    : "text-[rgba(255,255,255,0.92)] hover:bg-white/8"
                )}
              >
                <span className="text-lg flex-shrink-0">{suggestion.icon}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium">{suggestion.text}</span>
                  <span className={cn(
                    "ml-2 text-xs px-2 py-0.5 rounded-full font-medium",
                    index === selectedIndex 
                      ? "bg-cyan-400/20 text-cyan-300"
                      : "bg-white/10 text-[rgba(255,255,255,0.60)]"
                  )}>
                    {suggestion.category}
                  </span>
                </div>
                <MapPin className={cn(
                  "w-4 h-4 flex-shrink-0",
                  index === selectedIndex ? "text-cyan-300/60" : "text-white/25"
                )} strokeWidth={2} />
              </button>
            ))}
          </div>
          
        </div>
      )}
    </div>
  );
}
