import { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  X, 
  Loader2, 
  Sparkles, 
  Navigation, 
  ArrowRight,
  ChevronDown,
  Ruler,
  Building2,
  SlidersHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FilterState } from '@/types/map';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

interface UnifiedSearchPanelProps {
  // Search props
  onSearch: (query: string) => void;
  onLocateMe?: () => void;
  isSearching?: boolean;
  searchResults?: number;
  userMessage?: string;
  // Filter props
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  // State
  className?: string;
}

const emirates = [
  'All Emirates',
  'Abu Dhabi',
  'Dubai',
  'Sharjah',
  'Ajman',
  'Ras Al Khaimah',
  'Fujairah',
  'Umm Al Quwain',
];

const facilityTypes = [
  { id: 'hospitals', label: 'Hospitals', icon: '🏥' },
  { id: 'clinics', label: 'Clinics', icon: '🩺' },
  { id: 'pharmacies', label: 'Pharmacies', icon: '💊' },
  { id: 'schools', label: 'Schools', icon: '🎓' },
  { id: 'nurseries', label: 'Nurseries', icon: '👶' },
];

const aiSuggestions = [
  { text: 'Nearest hospital', icon: '🏥', category: 'Emergency' },
  { text: 'Emergency hospital near me', icon: '🚑', category: 'Emergency' },
  { text: 'Hospitals with ICU in Abu Dhabi', icon: '🏥', category: 'Healthcare' },
  { text: 'Schools in Abu Dhabi', icon: '🎓', category: 'Education' },
  { text: 'Pharmacies near me', icon: '💊', category: 'Healthcare' },
  { text: 'Clinics in Dubai', icon: '🩺', category: 'Healthcare' },
];

export function UnifiedSearchPanel({
  onSearch,
  onLocateMe,
  isSearching = false,
  searchResults = 0,
  userMessage,
  filters,
  onFilterChange,
  className,
}: UnifiedSearchPanelProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check for active filters
  const activeFilters = useMemo(() => {
    const chips: { label: string; type: string; value: string }[] = [];
    
    if (filters.emirate !== 'All Emirates') {
      chips.push({ label: filters.emirate, type: 'emirate', value: filters.emirate });
    }
    if (filters.distance && filters.distance > 0) {
      chips.push({ label: `${filters.distance} km`, type: 'distance', value: String(filters.distance) });
    }
    if (filters.facilityTypes && filters.facilityTypes.length > 0) {
      filters.facilityTypes.forEach(typeId => {
        const facility = facilityTypes.find(f => f.id === typeId);
        if (facility) {
          chips.push({ label: facility.label, type: 'facilityType', value: typeId });
        }
      });
    }
    
    return chips;
  }, [filters]);

  const hasActiveFilters = activeFilters.length > 0;

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
        setOpenDropdown(null);
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

  const handleEmirateChange = (emirate: string) => {
    onFilterChange({ ...filters, emirate });
    setOpenDropdown(null);
  };

  const handleDistanceChange = (value: number[]) => {
    onFilterChange({ ...filters, distance: value[0] });
  };

  const handleFacilityTypeToggle = (typeId: string) => {
    const currentTypes = filters.facilityTypes || [];
    const newTypes = currentTypes.includes(typeId)
      ? currentTypes.filter(t => t !== typeId)
      : [...currentTypes, typeId];
    onFilterChange({ ...filters, facilityTypes: newTypes });
  };

  const removeFilter = (type: string, value: string) => {
    if (type === 'emirate') {
      onFilterChange({ ...filters, emirate: 'All Emirates' });
    } else if (type === 'distance') {
      onFilterChange({ ...filters, distance: null });
    } else if (type === 'facilityType') {
      onFilterChange({
        ...filters,
        facilityTypes: filters.facilityTypes.filter(t => t !== value),
      });
    }
  };

  const clearAllFilters = () => {
    onFilterChange({
      emirate: 'All Emirates',
      distance: null,
      facilityTypes: [],
    });
  };

  return (
    <div ref={containerRef} className={cn("flex flex-col", className)}>
      {/* Search Bar - Primary Interaction */}
      <div className="relative z-[var(--z-dropdown)]">
        {/* Dim overlay when suggestions open */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="fixed inset-0 bg-black/20 z-[var(--z-popover-backdrop)] pointer-events-none" />
        )}

        <div
          className={cn(
            "relative flex items-center transition-all duration-200 rounded-2xl overflow-visible",
            "bg-white dark:bg-card border-2",
            isFocused 
              ? "border-primary shadow-lg shadow-primary/10" 
              : "border-border/60 hover:border-primary/40 shadow-sm"
          )}
        >
          {/* Search Icon */}
          <div className="flex items-center justify-center pl-4">
            {isSearching ? (
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10">
                <Loader2 className="w-5 h-5 animate-spin text-primary" strokeWidth={2} />
              </div>
            ) : (
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                isFocused ? "bg-primary/10" : "bg-muted/50"
              )}>
                <Search className={cn(
                  "w-5 h-5",
                  isFocused ? "text-primary" : "text-muted-foreground"
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
            placeholder="Search hospitals, schools, clinics..."
            className={cn(
              "flex-1 h-14 min-w-0 border-none bg-transparent",
              "focus:outline-none focus:ring-0",
              "text-foreground placeholder:text-muted-foreground/60",
              "pl-4 pr-2 text-base font-medium"
            )}
            aria-label="Search facilities"
          />

          <div className="flex items-center gap-2 pr-3">
            {query && (
              <button
                onClick={clearSearch}
                className="p-2 rounded-lg text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            )}

            {onLocateMe && (
              <button
                onClick={onLocateMe}
                className="p-2 rounded-lg text-primary/60 hover:text-primary hover:bg-primary/10 transition-colors"
                title="Use my location"
                aria-label="Use my location"
              >
                <Navigation className="w-4 h-4" strokeWidth={2} />
              </button>
            )}

            <button
              onClick={() => handleSubmit()}
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-xl transition-all",
                "bg-primary text-primary-foreground",
                "hover:bg-primary/90 active:scale-95",
                "shadow-md shadow-primary/20"
              )}
              aria-label="Search"
            >
              <ArrowRight className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div
            className={cn(
              "absolute left-0 right-0 top-full mt-2 z-[var(--z-dropdown)]",
              "bg-white dark:bg-card border border-border rounded-xl",
              "shadow-xl animate-fade-in overflow-hidden"
            )}
            style={{ maxHeight: '300px' }}
          >
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-muted/30">
              <Sparkles className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Suggestions
              </p>
            </div>

            <div className="overflow-y-auto max-h-[240px] p-2">
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={suggestion.text}
                  onClick={() => handleSubmit(suggestion.text)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                    index === selectedIndex
                      ? "bg-primary/10 text-foreground"
                      : "text-foreground/80 hover:bg-muted/50"
                  )}
                >
                  <span className="text-base flex-shrink-0">{suggestion.icon}</span>
                  <span className="flex-1 text-sm font-medium">{suggestion.text}</span>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    "bg-muted text-muted-foreground"
                  )}>
                    {suggestion.category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Active Filter Chips */}
      {(hasActiveFilters || searchResults > 0 || userMessage) && (
        <div className="flex flex-wrap items-center gap-2 mt-3 px-1 animate-fade-in">
          {/* Results count chip */}
          {searchResults > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
              <MapPin className="w-3 h-3" />
              <span>{searchResults} {searchResults === 1 ? 'result' : 'results'}</span>
            </div>
          )}
          
          {/* Filter chips */}
          {activeFilters.map((chip, index) => (
            <div
              key={`${chip.type}-${chip.value}-${index}`}
              className={cn(
                "flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full",
                "bg-primary/10 text-primary text-xs font-medium",
                "border border-primary/20"
              )}
            >
              <span>{chip.label}</span>
              <button
                onClick={() => removeFilter(chip.type, chip.value)}
                className="p-0.5 rounded-full hover:bg-primary/20 transition-colors"
                aria-label={`Remove ${chip.label} filter`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* Clear all button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors px-2 py-1"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* AI Message */}
      {userMessage && (
        <div className="mt-3 flex items-start gap-2 text-sm text-foreground/80 bg-muted/50 rounded-xl px-3 py-2.5 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
          <span className="line-clamp-2">{userMessage}</span>
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-border/60 my-4" />

      {/* Filter Results Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-semibold text-foreground">Filter Results</h4>
        </div>

        <div className="space-y-2">
          {/* Location Selector */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'emirate' ? null : 'emirate')}
              className={cn(
                "w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border transition-all text-sm",
                filters.emirate !== 'All Emirates'
                  ? "bg-primary/10 text-foreground border-primary/30"
                  : "bg-muted/30 border-border hover:bg-muted/50 text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <MapPin className={cn(
                  "w-4 h-4",
                  filters.emirate !== 'All Emirates' ? "text-primary" : "text-muted-foreground"
                )} />
                <span className="font-medium">{filters.emirate}</span>
              </div>
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform text-muted-foreground",
                openDropdown === 'emirate' && "rotate-180"
              )} />
            </button>

            {openDropdown === 'emirate' && (
              <>
                <div className="fixed inset-0 z-[var(--z-popover-backdrop)]" onClick={() => setOpenDropdown(null)} />
                <div className="absolute top-full mt-1 left-0 right-0 bg-white dark:bg-card rounded-xl shadow-xl border border-border overflow-hidden z-[var(--z-popover)] animate-fade-in">
                  <div className="p-2 max-h-64 overflow-y-auto">
                    {emirates.map((emirate) => (
                      <button
                        key={emirate}
                        onClick={() => handleEmirateChange(emirate)}
                        className={cn(
                          "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors",
                          filters.emirate === emirate
                            ? "bg-primary text-primary-foreground font-medium"
                            : "hover:bg-muted/50 text-foreground"
                        )}
                      >
                        {emirate}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Distance Selector */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'distance' ? null : 'distance')}
              className={cn(
                "w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border transition-all text-sm",
                filters.distance && filters.distance > 0
                  ? "bg-primary/10 text-foreground border-primary/30"
                  : "bg-muted/30 border-border hover:bg-muted/50 text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <Ruler className={cn(
                  "w-4 h-4",
                  filters.distance && filters.distance > 0 ? "text-primary" : "text-muted-foreground"
                )} />
                <span className="font-medium">
                  {filters.distance && filters.distance > 0 ? `Within ${filters.distance} km` : 'Distance'}
                </span>
              </div>
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform text-muted-foreground",
                openDropdown === 'distance' && "rotate-180"
              )} />
            </button>

            {openDropdown === 'distance' && (
              <>
                <div className="fixed inset-0 z-[var(--z-popover-backdrop)]" onClick={() => setOpenDropdown(null)} />
                <div className="absolute top-full mt-1 left-0 right-0 bg-white dark:bg-card rounded-xl shadow-xl border border-border overflow-hidden z-[var(--z-popover)] animate-fade-in p-4">
                  <p className="text-sm font-medium text-foreground mb-3">Distance radius</p>
                  <Slider
                    value={[filters.distance || 0]}
                    onValueChange={handleDistanceChange}
                    min={0}
                    max={50}
                    step={1}
                    className="mb-3"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0 km</span>
                    <span className="font-semibold text-primary">{filters.distance || 0} km</span>
                    <span>50 km</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Facility Type */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
              className={cn(
                "w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border transition-all text-sm",
                filters.facilityTypes && filters.facilityTypes.length > 0
                  ? "bg-primary/10 text-foreground border-primary/30"
                  : "bg-muted/30 border-border hover:bg-muted/50 text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <Building2 className={cn(
                  "w-4 h-4",
                  filters.facilityTypes && filters.facilityTypes.length > 0 ? "text-primary" : "text-muted-foreground"
                )} />
                <span className="font-medium">
                  {filters.facilityTypes?.length
                    ? `${filters.facilityTypes.length} type${filters.facilityTypes.length > 1 ? 's' : ''} selected`
                    : 'Facility Type'}
                </span>
              </div>
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform text-muted-foreground",
                openDropdown === 'type' && "rotate-180"
              )} />
            </button>

            {openDropdown === 'type' && (
              <>
                <div className="fixed inset-0 z-[var(--z-popover-backdrop)]" onClick={() => setOpenDropdown(null)} />
                <div className="absolute top-full mt-1 left-0 right-0 bg-white dark:bg-card rounded-xl shadow-xl border border-border overflow-hidden z-[var(--z-popover)] animate-fade-in">
                  <div className="p-3 space-y-1">
                    {facilityTypes.map((type) => (
                      <label
                        key={type.id}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors",
                          filters.facilityTypes?.includes(type.id)
                            ? "bg-primary/10"
                            : "hover:bg-muted/50"
                        )}
                      >
                        <Checkbox
                          checked={filters.facilityTypes?.includes(type.id) || false}
                          onCheckedChange={() => handleFacilityTypeToggle(type.id)}
                          className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <span className="text-base">{type.icon}</span>
                        <span className="text-sm text-foreground font-medium">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
