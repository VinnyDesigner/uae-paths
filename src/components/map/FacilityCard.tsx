import { X, Heart, GraduationCap, MapPin, Navigation, Phone, Clock, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Facility } from '@/types/map';
import { Button } from '@/components/ui/button';

interface FacilityCardProps {
  facility: Facility;
  onClose?: () => void;
  compact?: boolean;
  className?: string;
}

export function FacilityCard({ facility, onClose, compact = false, className }: FacilityCardProps) {
  const isHealthcare = facility.theme === 'healthcare';

  const openGoogleMaps = () => {
    const [lng, lat] = facility.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 p-3 bg-card rounded-xl border border-border cursor-pointer hover:shadow-md transition-shadow",
          className
        )}
      >
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
            isHealthcare ? "bg-healthcare-light" : "bg-education-light"
          )}
        >
          {isHealthcare ? (
            <Heart className="w-5 h-5 text-healthcare" />
          ) : (
            <GraduationCap className="w-5 h-5 text-education" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground text-sm truncate">{facility.name}</h4>
          <p className="text-xs text-muted-foreground truncate">{facility.type}</p>
        </div>
        {facility.distance !== undefined && (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {facility.distance.toFixed(1)} km
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn("bg-card rounded-xl border border-border shadow-lg overflow-hidden", className)}>
      {/* Header */}
      <div
        className={cn(
          "p-4 flex items-start gap-3",
          isHealthcare ? "bg-healthcare-light/50" : "bg-education-light/50"
        )}
      >
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
            isHealthcare ? "bg-healthcare text-healthcare-foreground" : "bg-education text-education-foreground"
          )}
        >
          {isHealthcare ? (
            <Heart className="w-6 h-6" />
          ) : (
            <GraduationCap className="w-6 h-6" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-foreground leading-tight">
            {facility.name}
          </h3>
          <span
            className={cn(
              "inline-block mt-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
              isHealthcare
                ? "bg-healthcare/10 text-healthcare"
                : "bg-education/10 text-education"
            )}
          >
            {facility.type}
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Details */}
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-foreground">{facility.address}</p>
            <p className="text-xs text-muted-foreground">{facility.emirate}, UAE</p>
          </div>
        </div>

        {facility.distance !== undefined && (
          <div className="flex items-center gap-3">
            <Navigation className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <p className="text-sm text-foreground">{facility.distance.toFixed(1)} km away</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 pt-0">
        <Button
          variant={isHealthcare ? "healthcare" : "education"}
          className="w-full"
          onClick={openGoogleMaps}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Open with Google Maps
        </Button>
      </div>
    </div>
  );
}
