import { useState, useEffect } from 'react';
import { X, Navigation, MapPin, Car, Footprints, Bus, Copy, ExternalLink, LocateFixed, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Facility } from '@/types/map';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface DirectionsPanelProps {
  facility: Facility;
  onClose: () => void;
  className?: string;
}

type TravelMode = 'driving' | 'walking' | 'transit';

export function DirectionsPanel({ facility, onClose, className }: DirectionsPanelProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const [startingPoint, setStartingPoint] = useState('My Location');
  const [useManualEntry, setUseManualEntry] = useState(false);
  const [travelMode, setTravelMode] = useState<TravelMode>('driving');
  const [copied, setCopied] = useState<'link' | 'address' | null>(null);
  const { toast } = useToast();

  // Try to get location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions?.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          setLocationStatus('granted');
          getLocation();
        } else if (result.state === 'denied') {
          setLocationStatus('denied');
        }
      });
    }
  }, []);

  const getLocation = () => {
    setLocationStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationStatus('granted');
        setStartingPoint('My Location');
        setUseManualEntry(false);
      },
      (error) => {
        console.error('Location error:', error);
        setLocationStatus('denied');
        toast({
          title: "Location access denied",
          description: "Please enter your starting point manually",
          variant: "destructive"
        });
      }
    );
  };

  const getMapsUrl = (provider: 'google' | 'apple') => {
    const destLat = facility.coordinates[1];
    const destLng = facility.coordinates[0];
    const mode = travelMode === 'driving' ? 'driving' : travelMode === 'walking' ? 'walking' : 'transit';

    if (provider === 'google') {
      const origin = userLocation 
        ? `&origin=${userLocation.lat},${userLocation.lng}` 
        : '';
      return `https://www.google.com/maps/dir/?api=1${origin}&destination=${destLat},${destLng}&travelmode=${mode}`;
    } else {
      // Apple Maps
      const origin = userLocation 
        ? `saddr=${userLocation.lat},${userLocation.lng}&` 
        : '';
      const dirflg = travelMode === 'driving' ? 'd' : travelMode === 'walking' ? 'w' : 'r';
      return `https://maps.apple.com/?${origin}daddr=${destLat},${destLng}&dirflg=${dirflg}`;
    }
  };

  const openInMaps = (provider: 'google' | 'apple') => {
    window.open(getMapsUrl(provider), '_blank');
  };

  const copyToClipboard = async (type: 'link' | 'address') => {
    try {
      const text = type === 'link' 
        ? getMapsUrl('google') 
        : `${facility.name}, ${facility.address}, ${facility.emirate}, UAE`;
      
      await navigator.clipboard.writeText(text);
      setCopied(type);
      toast({
        title: type === 'link' ? "Link copied!" : "Address copied!",
        description: "Copied to clipboard"
      });
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        variant: "destructive"
      });
    }
  };

  const travelModes: { id: TravelMode; icon: React.ElementType; label: string }[] = [
    { id: 'driving', icon: Car, label: 'Drive' },
    { id: 'walking', icon: Footprints, label: 'Walk' },
    { id: 'transit', icon: Bus, label: 'Transit' },
  ];

  return (
    <div 
      className={cn(
        // Base styles
        "bg-card border border-border shadow-xl overflow-hidden animate-scale-in flex flex-col",
        // Mobile & Desktop: floating card
        "w-full max-w-md rounded-2xl",
        // Tablet (768px - 1024px): full-screen modal
        "md:max-lg:fixed md:max-lg:inset-0 md:max-lg:w-screen md:max-lg:h-screen",
        "md:max-lg:max-w-full md:max-lg:rounded-none md:max-lg:shadow-none md:max-lg:border-0",
        "md:max-lg:z-50",
        className
      )}
    >
      {/* Header - Sticky */}
      <div className="relative bg-gradient-to-r from-primary to-primary/80 p-4 flex-shrink-0 sticky top-0 z-10">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <Navigation className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white/70 mb-0.5">Directions To</p>
            <h3 className="font-heading font-semibold text-white leading-tight line-clamp-2">
              {facility.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4">
        {/* Start Point */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Start Point</label>
          
          {!useManualEntry ? (
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-secondary/50 rounded-lg border border-border">
                {locationStatus === 'requesting' ? (
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                ) : locationStatus === 'granted' ? (
                  <LocateFixed className="w-4 h-4 text-primary" />
                ) : (
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                )}
                <span className="text-sm text-foreground">
                  {locationStatus === 'requesting' ? 'Getting location...' : startingPoint}
                </span>
              </div>
              {locationStatus !== 'granted' && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={getLocation}
                  disabled={locationStatus === 'requesting'}
                >
                  <LocateFixed className="w-4 h-4 mr-1.5" />
                  Enable
                </Button>
              )}
            </div>
          ) : (
            <Input
              placeholder="Enter starting address..."
              value={startingPoint}
              onChange={(e) => setStartingPoint(e.target.value)}
              className="bg-secondary/50"
            />
          )}

          {locationStatus === 'denied' && !useManualEntry && (
            <button 
              onClick={() => setUseManualEntry(true)}
              className="text-xs text-primary hover:underline"
            >
              Enter starting point manually
            </button>
          )}
          {useManualEntry && (
            <button 
              onClick={() => {
                setUseManualEntry(false);
                setStartingPoint('My Location');
              }}
              className="text-xs text-primary hover:underline"
            >
              Use my location instead
            </button>
          )}
        </div>

        {/* Destination */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Destination</label>
          <div className="p-3 bg-secondary/30 rounded-lg border border-border">
            <p className="text-sm font-medium text-foreground">{facility.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{facility.address}, {facility.emirate}</p>
          </div>
        </div>

        {/* Travel Mode */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Travel Mode</label>
          <div className="flex gap-2">
            {travelModes.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setTravelMode(id)}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all",
                  travelMode === id 
                    ? "bg-primary/10 border-primary text-primary" 
                    : "bg-secondary/30 border-border text-muted-foreground hover:bg-secondary/50"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Distance info if available */}
        {facility.distance && (
          <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
            <Navigation className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {facility.distance.toFixed(1)} km away
            </span>
          </div>
        )}
      </div>

      {/* Actions - Sticky Footer */}
      <div 
        className={cn(
          "p-4 space-y-3 flex-shrink-0 bg-card border-t border-border/50",
          // Safe area padding for tablet full-screen mode
          "md:max-lg:pb-[calc(1rem+env(safe-area-inset-bottom))]"
        )}
      >
        {/* Primary Actions */}
        <div className="flex gap-2">
          <Button
            className="flex-1 gradient-primary text-white"
            onClick={() => openInMaps('google')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open in Google Maps
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => openInMaps('apple')}
          >
            Apple Maps
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => copyToClipboard('link')}
          >
            {copied === 'link' ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
            Copy Link
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => copyToClipboard('address')}
          >
            {copied === 'address' ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
            Address
          </Button>
        </div>
      </div>
    </div>
  );
}