import { useState } from 'react';
import { MapPin, Ruler, Building2, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FilterState } from '@/types/map';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface FilterPillsProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  className?: string;
}

const municipalities = [
  'Abu Dhabi',
  'Al Ain',
  'Al Dhafra',
];

const facilityTypes = [
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'education', label: 'Education' },
];

export function FilterPills({ filters, onFilterChange, className }: FilterPillsProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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

  const hasActiveFilters = filters.emirate !== 'All Municipalities' || 
    (filters.distance && filters.distance > 0) || 
    (filters.facilityTypes && filters.facilityTypes.length > 0);

  const clearFilters = () => {
    onFilterChange({
      emirate: 'All Municipalities',
      distance: null,
      facilityTypes: [],
    });
    setOpenDropdown(null);
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {/* Emirate Pill */}
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(openDropdown === 'emirate' ? null : 'emirate')}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all text-sm font-medium",
            "hover:shadow-md active:scale-[0.98]",
            filters.emirate !== 'All Municipalities'
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-white/80 dark:bg-card/80 backdrop-blur-sm border-border/50 text-foreground hover:bg-white dark:hover:bg-card"
          )}
        >
          <MapPin className={cn(
            "w-4 h-4",
            filters.emirate !== 'All Municipalities' ? "text-primary-foreground" : "text-primary"
          )} />
          <span>{filters.emirate === 'All Municipalities' ? 'Municipality' : filters.emirate}</span>
          <ChevronDown className={cn(
            "w-3.5 h-3.5 transition-transform",
            openDropdown === 'emirate' && "rotate-180"
          )} />
        </button>

        {openDropdown === 'emirate' && (
          <>
            <div className="fixed inset-0 z-[var(--z-popover-backdrop)]" onClick={() => setOpenDropdown(null)} />
            <div className="absolute top-full mt-2 left-0 min-w-[180px] bg-card/95 backdrop-blur-xl rounded-xl shadow-xl border border-border overflow-hidden z-[var(--z-popover)] animate-fade-in">
              <div className="p-2 max-h-64 overflow-y-auto">
                {municipalities.map((municipality) => (
                  <button
                    key={municipality}
                    onClick={() => handleEmirateChange(municipality)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                      filters.emirate === municipality
                        ? "bg-primary text-primary-foreground font-medium"
                        : "hover:bg-secondary text-foreground"
                    )}
                  >
                    {municipality}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Distance Pill */}
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(openDropdown === 'distance' ? null : 'distance')}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all text-sm font-medium",
            "hover:shadow-md active:scale-[0.98]",
            filters.distance && filters.distance > 0
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-white/80 dark:bg-card/80 backdrop-blur-sm border-border/50 text-foreground hover:bg-white dark:hover:bg-card"
          )}
        >
          <Ruler className={cn(
            "w-4 h-4",
            filters.distance && filters.distance > 0 ? "text-primary-foreground" : "text-primary"
          )} />
          <span>{filters.distance ? `${filters.distance} km` : 'Distance'}</span>
          <ChevronDown className={cn(
            "w-3.5 h-3.5 transition-transform",
            openDropdown === 'distance' && "rotate-180"
          )} />
        </button>

        {openDropdown === 'distance' && (
          <>
            <div className="fixed inset-0 z-[var(--z-popover-backdrop)]" onClick={() => setOpenDropdown(null)} />
            <div className="absolute top-full mt-2 left-0 min-w-[220px] bg-card/95 backdrop-blur-xl rounded-xl shadow-xl border border-border overflow-hidden z-[var(--z-popover)] animate-fade-in p-4">
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

      {/* Facility Type Pill */}
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all text-sm font-medium",
            "hover:shadow-md active:scale-[0.98]",
            filters.facilityTypes && filters.facilityTypes.length > 0
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-white/80 dark:bg-card/80 backdrop-blur-sm border-border/50 text-foreground hover:bg-white dark:hover:bg-card"
          )}
        >
          <Building2 className={cn(
            "w-4 h-4",
            filters.facilityTypes && filters.facilityTypes.length > 0 ? "text-primary-foreground" : "text-primary"
          )} />
          <span>
            {filters.facilityTypes?.length 
              ? `${filters.facilityTypes.length} type${filters.facilityTypes.length > 1 ? 's' : ''}` 
              : 'Facility Type'}
          </span>
          <ChevronDown className={cn(
            "w-3.5 h-3.5 transition-transform",
            openDropdown === 'type' && "rotate-180"
          )} />
        </button>

        {openDropdown === 'type' && (
          <>
            <div className="fixed inset-0 z-[var(--z-popover-backdrop)]" onClick={() => setOpenDropdown(null)} />
            <div className="absolute top-full mt-2 left-0 min-w-[200px] bg-card/95 backdrop-blur-xl rounded-xl shadow-xl border border-border overflow-hidden z-[var(--z-popover)] animate-fade-in">
              <RadioGroup
                value={filters.facilityTypes?.[0] || ''}
                onValueChange={(value) => onFilterChange({ ...filters, facilityTypes: [value] })}
                className="p-2.5 space-y-1"
              >
                {facilityTypes.map((type) => (
                  <label
                    key={type.id}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all",
                      filters.facilityTypes?.includes(type.id)
                        ? "bg-primary/15 border border-primary/30"
                        : "hover:bg-secondary border border-transparent"
                    )}
                  >
                    <RadioGroupItem
                      value={type.id}
                      className="border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                    <span className="text-sm text-foreground">{type.label}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>
          </>
        )}
      </div>

      {/* Clear Filters Pill */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all text-sm font-medium border border-destructive/20 active:scale-[0.98]"
        >
          <X className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      )}
    </div>
  );
}
