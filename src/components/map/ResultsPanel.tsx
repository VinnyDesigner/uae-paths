import { Facility } from '@/types/map';
import { FacilityCard } from './FacilityCard';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface ResultsPanelProps {
  results: Facility[];
  searchQuery?: string;
  onFacilityClick: (facility: Facility) => void;
  onClose: () => void;
  className?: string;
}

export function ResultsPanel({ results, searchQuery, onFacilityClick, onClose, className }: ResultsPanelProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className={cn(
      "bg-card border-t border-border shadow-lg",
      className
    )}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div>
          <h3 className="font-heading font-semibold text-foreground text-sm">
            Search Results
          </h3>
          {searchQuery && (
            <p className="text-xs text-muted-foreground">
              {searchQuery}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
      
      <div className="p-3 overflow-x-auto">
        <div className="flex gap-3 pb-1">
          {results.map((facility) => (
            <div
              key={facility.id}
              onClick={() => onFacilityClick(facility)}
              className="flex-shrink-0 w-64"
            >
              <FacilityCard facility={facility} compact />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
