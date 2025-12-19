import { useState } from 'react';
import { Filter, RotateCcw, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { emirates, themeGroups } from '@/data/layers';
import { FilterState } from '@/types/map';

interface MapFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  className?: string;
}

export function MapFilters({ filters, onFilterChange, className }: MapFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const allFacilityTypes = themeGroups.flatMap(theme => theme.layers.map(l => l.name));

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
    <div className={cn("bg-card rounded-xl border border-border overflow-hidden shadow-sm", className)}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors"
      >
        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
          <Filter className="w-5 h-5 text-foreground" />
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-medium text-foreground text-sm">Filters</h3>
          <p className="text-xs text-muted-foreground">
            {hasActiveFilters ? 'Filters applied' : 'No filters applied'}
          </p>
        </div>
        <ChevronDown className={cn(
          "w-5 h-5 text-muted-foreground transition-transform",
          isExpanded && "rotate-180"
        )} />
      </button>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-4 border-t border-border space-y-5 animate-fade-in">
          {/* Emirate Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Emirate</label>
            <Select value={filters.emirate} onValueChange={handleEmirateChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select emirate" />
              </SelectTrigger>
              <SelectContent>
                {emirates.map((emirate) => (
                  <SelectItem key={emirate} value={emirate}>
                    {emirate}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Distance Filter */}
          <div className="space-y-3">
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

          {/* Facility Types */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Facility Type</label>
            <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
              {allFacilityTypes.slice(0, 8).map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={filters.facilityTypes.includes(type)}
                    onCheckedChange={() => handleFacilityTypeToggle(type)}
                  />
                  <span className="text-sm text-foreground">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!hasActiveFilters}
            className="w-full"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}
