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
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {/* Emirate Filter */}
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(openDropdown === 'emirate' ? null : 'emirate')}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm",
            filters.emirate !== 'All Emirates'
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card border-border hover:bg-secondary text-foreground"
          )}
        >
          <MapPin className="w-4 h-4" />
          <span className="hidden sm:inline">{filters.emirate}</span>
          <span className="sm:hidden">Emirate</span>
          <ChevronDown className={cn("w-3 h-3 transition-transform", openDropdown === 'emirate' && "rotate-180")} />
        </button>

        {openDropdown === 'emirate' && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
            <div className="absolute top-full mt-1 left-0 bg-card rounded-xl shadow-xl border border-border overflow-hidden z-50 min-w-[180px] animate-fade-in">
              <div className="p-2 max-h-64 overflow-y-auto">
                {emirates.map((emirate) => (
                  <button
                    key={emirate}
                    onClick={() => handleEmirateChange(emirate)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                      filters.emirate === emirate
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary text-foreground"
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
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(openDropdown === 'distance' ? null : 'distance')}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm",
            filters.distance && filters.distance > 0
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card border-border hover:bg-secondary text-foreground"
          )}
        >
          <Ruler className="w-4 h-4" />
          <span className="hidden sm:inline">
            {filters.distance ? `${filters.distance} km` : 'Distance'}
          </span>
          <span className="sm:hidden">
            {filters.distance ? `${filters.distance}km` : 'Dist'}
          </span>
          <ChevronDown className={cn("w-3 h-3 transition-transform", openDropdown === 'distance' && "rotate-180")} />
        </button>

        {openDropdown === 'distance' && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
            <div className="absolute top-full mt-1 left-0 bg-card rounded-xl shadow-xl border border-border overflow-hidden z-50 w-64 animate-fade-in p-4">
              <p className="text-sm font-medium text-foreground mb-3">Distance radius</p>
              <Slider
                value={[filters.distance || 0]}
                onValueChange={handleDistanceChange}
                min={0}
                max={50}
                step={1}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0 km</span>
                <span className="font-medium text-primary">{filters.distance || 0} km</span>
                <span>50 km</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Facility Type Filter */}
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm",
            filters.facilityTypes && filters.facilityTypes.length > 0
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card border-border hover:bg-secondary text-foreground"
          )}
        >
          <Building2 className="w-4 h-4" />
          <span className="hidden sm:inline">
            {filters.facilityTypes?.length 
              ? `${filters.facilityTypes.length} type${filters.facilityTypes.length > 1 ? 's' : ''}` 
              : 'Facility Type'}
          </span>
          <span className="sm:hidden">Type</span>
          <ChevronDown className={cn("w-3 h-3 transition-transform", openDropdown === 'type' && "rotate-180")} />
        </button>

        {openDropdown === 'type' && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
            <div className="absolute top-full mt-1 left-0 bg-card rounded-xl shadow-xl border border-border overflow-hidden z-50 min-w-[200px] animate-fade-in">
              <div className="p-3 space-y-2">
                {facilityTypes.map((type) => (
                  <label
                    key={type.id}
                    className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-secondary cursor-pointer transition-colors"
                  >
                    <Checkbox
                      checked={filters.facilityTypes?.includes(type.id) || false}
                      onCheckedChange={() => handleFacilityTypeToggle(type.id)}
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
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-sm"
        >
          <X className="w-3 h-3" />
          <span className="hidden sm:inline">Clear</span>
        </button>
      )}
    </div>
  );
}
