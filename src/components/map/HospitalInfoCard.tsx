import { X, MapPin, Navigation, Building2, Bed, Stethoscope, AlertCircle, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Facility } from '@/types/map';
import { Button } from '@/components/ui/button';

interface HospitalInfoCardProps {
  facility: Facility;
  onClose?: () => void;
  onNavigate?: () => void;
  onViewDetails?: () => void;
  className?: string;
}

export function HospitalInfoCard({ 
  facility, 
  onClose, 
  onNavigate,
  onViewDetails,
  className 
}: HospitalInfoCardProps) {
  const isHospital = facility.type === 'Hospitals';

  const handleNavigate = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${facility.coordinates[1]},${facility.coordinates[0]}`,
      '_blank'
    );
    onNavigate?.();
  };

  return (
    <div 
      className={cn(
        "bg-card rounded-2xl border border-border shadow-xl overflow-hidden animate-scale-in",
        "w-[320px] max-w-[90vw]",
        className
      )}
    >
      {/* Header */}
      <div className="relative bg-gradient-to-r from-primary to-primary-dark p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-semibold text-white leading-tight line-clamp-2">
              {facility.name}
            </h3>
            <span className="inline-block mt-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
              {facility.type}
            </span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Hospital-specific info */}
      {isHospital && (
        <div className="p-4 bg-secondary/30 border-b border-border">
          <div className="flex flex-wrap gap-2">
            {/* Emergency Department */}
            <div className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium",
              facility.hasEmergency 
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-muted text-muted-foreground"
            )}>
              <AlertCircle className="w-3.5 h-3.5" />
              Emergency: {facility.hasEmergency ? 'Yes' : 'No'}
            </div>
            
            {/* Bed Capacity */}
            {facility.bedCapacity && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary">
                <Bed className="w-3.5 h-3.5" />
                {facility.bedCapacity} Beds
              </div>
            )}
          </div>
          
          {/* Specialties */}
          {facility.specialties && facility.specialties.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                <Stethoscope className="w-3.5 h-3.5" />
                Specialties
              </div>
              <div className="flex flex-wrap gap-1.5">
                {facility.specialties.map((specialty, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 rounded-md text-xs bg-healthcare-light text-healthcare font-medium"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Location Details */}
      <div className="p-4 space-y-2.5">
        <div className="flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-foreground">{facility.address}</p>
            <p className="text-xs text-muted-foreground">{facility.emirate}, UAE</p>
          </div>
        </div>

        {facility.distance !== undefined && (
          <div className="flex items-center gap-2.5">
            <Navigation className="w-4 h-4 text-primary flex-shrink-0" />
            <p className="text-sm font-medium text-primary">{facility.distance.toFixed(1)} km away</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 pt-0 flex gap-2">
        <Button
          variant="default"
          className="flex-1 gradient-primary text-white"
          onClick={handleNavigate}
        >
          <Navigation className="w-4 h-4 mr-2" />
          Get Directions
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={onViewDetails}
          title="View Details"
        >
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
