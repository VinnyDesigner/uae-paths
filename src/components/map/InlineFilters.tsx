import { useState } from 'react';
import { Filter, MapPin, Ruler, Building2, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FilterState } from '@/types/map';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

interface InlineFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
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

export function InlineFilters({ filters, onFilterChange, className }: InlineFiltersProps) {
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

  const hasActiveFilters = filters.emirate !== 'All Emirates' || 
    (filters.distance && filters.distance > 0) || 
    (filters.facilityTypes && filters.facilityTypes.length > 0);

  const clearFilters = () => {
    onFilterChange({
      emirate: 'All Emirates',
      distance: null,
      facilityTypes: [],
    });
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Emirate Filter */}
      <div className="relative w-full">
        <button
          onClick={() => setOpenDropdown(openDropdown === 'emirate' ? null : 'emirate')}
          className={cn(
            "w-full flex items-center justify-between gap-2 px-4 py-3.5 rounded-xl border transition-all text-sm group",
            filters.emirate !== 'All Emirates'
              ? "bg-primary/20 text-foreground border-primary/50 shadow-sm"
              : "bg-white/30 dark:bg-white/5 border-white/20 dark:border-white/10 hover:bg-white/50 dark:hover:bg-white/10 text-foreground"
          )}
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{filters.emirate}</span>
          </div>
          <ChevronDown className={cn("w-4 h-4 transition-transform text-muted-foreground", openDropdown === 'emirate' && "rotate-180")} />
        </button>

        {openDropdown === 'emirate' && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
            <div className="absolute top-full mt-2 left-0 right-0 bg-white/90 dark:bg-card/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/30 dark:border-white/10 overflow-hidden z-50 animate-fade-in">
              <div className="p-2.5 max-h-64 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary/20">
                {emirates.map((emirate) => (
                  <button
                    key={emirate}
                    onClick={() => handleEmirateChange(emirate)}
                    className={cn(
                      "w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all",
                      filters.emirate === emirate
                        ? "bg-primary text-primary-foreground font-medium"
                        : "hover:bg-primary/10 text-foreground"
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

      {/* Distance Filter */}
      <div className="relative w-full">
        <button
          onClick={() => setOpenDropdown(openDropdown === 'distance' ? null : 'distance')}
          className={cn(
            "w-full flex items-center justify-between gap-2 px-4 py-3.5 rounded-xl border transition-all text-sm",
            filters.distance && filters.distance > 0
              ? "bg-primary/20 text-foreground border-primary/50 shadow-sm"
              : "bg-white/30 dark:bg-white/5 border-white/20 dark:border-white/10 hover:bg-white/50 dark:hover:bg-white/10 text-foreground"
          )}
        >
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-primary" />
            <span>{filters.distance ? `${filters.distance} km radius` : 'Distance'}</span>
          </div>
          <ChevronDown className={cn("w-4 h-4 transition-transform text-muted-foreground", openDropdown === 'distance' && "rotate-180")} />
        </button>

        {openDropdown === 'distance' && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
            <div className="absolute top-full mt-2 left-0 right-0 bg-white/90 dark:bg-card/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/30 dark:border-white/10 overflow-hidden z-50 animate-fade-in p-5">
              <p className="text-sm font-medium text-foreground mb-4">Distance radius</p>
              <Slider
                value={[filters.distance || 0]}
                onValueChange={handleDistanceChange}
                min={0}
                max={50}
                step={1}
                className="mb-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0 km</span>
                <span className="font-semibold text-primary text-sm">{filters.distance || 0} km</span>
                <span>50 km</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Facility Type Filter */}
      <div className="relative w-full">
        <button
          onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
          className={cn(
            "w-full flex items-center justify-between gap-2 px-4 py-3.5 rounded-xl border transition-all text-sm",
            filters.facilityTypes && filters.facilityTypes.length > 0
              ? "bg-primary/20 text-foreground border-primary/50 shadow-sm"
              : "bg-white/30 dark:bg-white/5 border-white/20 dark:border-white/10 hover:bg-white/50 dark:hover:bg-white/10 text-foreground"
          )}
        >
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            <span>
              {filters.facilityTypes?.length 
                ? `${filters.facilityTypes.length} type${filters.facilityTypes.length > 1 ? 's' : ''} selected` 
                : 'Facility Type'}
            </span>
          </div>
          <ChevronDown className={cn("w-4 h-4 transition-transform text-muted-foreground", openDropdown === 'type' && "rotate-180")} />
        </button>

        {openDropdown === 'type' && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
            <div className="absolute top-full mt-2 left-0 right-0 bg-white/90 dark:bg-card/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/30 dark:border-white/10 overflow-hidden z-50 animate-fade-in">
              <div className="p-3.5 space-y-2">
                {facilityTypes.map((type) => (
                  <label
                    key={type.id}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-3 rounded-lg cursor-pointer transition-all",
                      filters.facilityTypes?.includes(type.id)
                        ? "bg-primary/15 border border-primary/30"
                        : "hover:bg-primary/10 border border-transparent"
                    )}
                  >
                    <Checkbox
                      checked={filters.facilityTypes?.includes(type.id) || false}
                      onCheckedChange={() => handleFacilityTypeToggle(type.id)}
                      className="border-primary/50 data-[state=checked]:bg-primary"
                    />
                    <span className="text-lg">{type.icon}</span>
                    <span className="text-sm text-foreground">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all text-sm border border-destructive/20"
        >
          <X className="w-4 h-4" />
          <span>Clear All Filters</span>
        </button>
      )}
    </div>
  );
}
