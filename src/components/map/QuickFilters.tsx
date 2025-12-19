import { useState } from 'react';
import { Filter, ChevronDown, RotateCcw, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { emirates, themeGroups } from '@/data/layers';
import { FilterState } from '@/types/map';

interface QuickFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  className?: string;
}

export function QuickFilters({ filters, onFilterChange, className }: QuickFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const allFacilityTypes = themeGroups.flatMap(theme => 
    theme.layers.map(l => ({ name: l.name, color: l.color, themeColor: theme.colorClass }))
  );

  const handleEmirateChange = (value: string) => {
    onFilterChange({ ...filters, emirate: value });
  };

  const handleDistanceChange = (value: number[]) => {
    onFilterChange({ ...filters, distance: value[0] });
  };

  const handleFacilityTypeToggle = (type: string) => {
    const newTypes = filters.facilityTypes.includes(type)
      ? filters.facilityTypes.filter(t => t !== type)
      : [...filters.facilityTypes, type];
    onFilterChange({ ...filters, facilityTypes: newTypes });
  };

  const handleReset = () => {
    onFilterChange({
      emirate: 'All Emirates',
      distance: null,
      facilityTypes: [],
    });
  };

  const hasActiveFilters = 
    filters.emirate !== 'All Emirates' || 
    filters.distance !== null || 
    filters.facilityTypes.length > 0;

  return (
    <div className={cn("bg-card/95 backdrop-blur-sm rounded-xl border border-border shadow-sm", className)}>
      {/* Collapsed view - Quick filter chips */}
      <div className="flex items-center gap-2 p-3 flex-wrap">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
            hasActiveFilters 
              ? "bg-primary text-primary-foreground" 
              : "bg-secondary text-foreground hover:bg-secondary/80"
          )}
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-primary-foreground/20 text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
              {(filters.emirate !== 'All Emirates' ? 1 : 0) + 
               (filters.distance !== null ? 1 : 0) + 
               filters.facilityTypes.length}
            </span>
          )}
          <ChevronDown className={cn(
            "w-3 h-3 transition-transform",
            isExpanded && "rotate-180"
          )} />
        </button>

        {/* Quick Emirate Selector */}
        <Select value={filters.emirate} onValueChange={handleEmirateChange}>
          <SelectTrigger className="w-auto min-w-[140px] h-8 text-sm bg-secondary border-0">
            <MapPin className="w-3 h-3 mr-1 text-muted-foreground" />
            <SelectValue placeholder="Emirate" />
          </SelectTrigger>
          <SelectContent>
            {emirates.map((emirate) => (
              <SelectItem key={emirate} value={emirate}>
                {emirate}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Quick Distance Pills */}
        <div className="flex items-center gap-1.5">
          {[1, 5, 10].map((km) => (
            <button
              key={km}
              onClick={() => onFilterChange({ ...filters, distance: filters.distance === km ? null : km })}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-medium transition-colors",
                filters.distance === km
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              )}
            >
              {km} km
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Expanded view - Full filters */}
      {isExpanded && (
        <div className="p-4 pt-0 border-t border-border animate-fade-in">
          {/* Distance Slider */}
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground">Distance</label>
              <span className="text-sm text-muted-foreground">
                {filters.distance ? `${filters.distance} km` : 'Any'}
              </span>
            </div>
            <Slider
              value={[filters.distance || 0]}
              onValueChange={handleDistanceChange}
              max={50}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0 km</span>
              <span>50 km</span>
            </div>
          </div>

          {/* Facility Types Grid */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Facility Type</label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {allFacilityTypes.map(({ name, color, themeColor }) => (
                <label
                  key={name}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors",
                    filters.facilityTypes.includes(name)
                      ? "bg-primary/10 border border-primary/30"
                      : "hover:bg-secondary/50"
                  )}
                >
                  <Checkbox
                    checked={filters.facilityTypes.includes(name)}
                    onCheckedChange={() => handleFacilityTypeToggle(name)}
                  />
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: themeColor === 'education' ? 'hsl(200, 100%, 61%)' : color }}
                  />
                  <span className="text-xs text-foreground truncate">{name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
