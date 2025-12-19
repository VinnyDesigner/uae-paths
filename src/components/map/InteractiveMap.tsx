import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ZoomIn, ZoomOut, Maximize, LocateFixed, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeGroup, Facility } from '@/types/map';
import { sampleFacilities } from '@/data/layers';
import { Button } from '@/components/ui/button';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (color: string, isHealthcare: boolean) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        border: 2px solid white;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-size: 14px;
        ">
          ${isHealthcare ? '🏥' : '🎓'}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onLocateMe: () => void;
  onFullscreen: () => void;
}

function MapControlsOverlay({ onZoomIn, onZoomOut, onResetView, onLocateMe, onFullscreen }: MapControlsProps) {
  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      <div className="bg-card rounded-lg shadow-md border border-border overflow-hidden">
        <button
          onClick={onZoomIn}
          className="p-2.5 hover:bg-secondary transition-colors border-b border-border"
          title="Zoom in"
        >
          <ZoomIn className="w-5 h-5 text-foreground" />
        </button>
        <button
          onClick={onZoomOut}
          className="p-2.5 hover:bg-secondary transition-colors"
          title="Zoom out"
        >
          <ZoomOut className="w-5 h-5 text-foreground" />
        </button>
      </div>
      <button
        onClick={onResetView}
        className="bg-card rounded-lg shadow-md border border-border p-2.5 hover:bg-secondary transition-colors"
        title="Reset to UAE"
      >
        <Home className="w-5 h-5 text-foreground" />
      </button>
      <button
        onClick={onLocateMe}
        className="bg-card rounded-lg shadow-md border border-border p-2.5 hover:bg-secondary transition-colors"
        title="Locate me"
      >
        <LocateFixed className="w-5 h-5 text-foreground" />
      </button>
      <button
        onClick={onFullscreen}
        className="bg-card rounded-lg shadow-md border border-border p-2.5 hover:bg-secondary transition-colors"
        title="Fullscreen"
      >
        <Maximize className="w-5 h-5 text-foreground" />
      </button>
    </div>
  );
}

interface FacilityPopupProps {
  facility: Facility;
}

function FacilityPopupContent({ facility }: FacilityPopupProps) {
  const isHealthcare = facility.theme === 'healthcare';
  
  return (
    <div className="p-3 min-w-[240px]">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-lg",
            isHealthcare ? "bg-healthcare-light" : "bg-education-light"
          )}
        >
          {isHealthcare ? '🏥' : '🎓'}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-heading font-semibold text-foreground text-sm leading-tight">
            {facility.name}
          </h4>
          <span
            className={cn(
              "inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium",
              isHealthcare
                ? "bg-healthcare-light text-healthcare"
                : "bg-education-light text-education"
            )}
          >
            {facility.type}
          </span>
        </div>
      </div>
      <div className="mt-3 space-y-1.5 text-sm">
        <p className="text-muted-foreground">
          <span className="font-medium text-foreground">Address:</span> {facility.address}
        </p>
        <p className="text-muted-foreground">
          <span className="font-medium text-foreground">Emirate:</span> {facility.emirate}
        </p>
        {facility.distance !== undefined && (
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">Distance:</span> {facility.distance.toFixed(1)} km
          </p>
        )}
      </div>
      <button className="mt-3 w-full text-center py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-dark transition-colors">
        View Details
      </button>
    </div>
  );
}

interface MapViewControllerProps {
  center: [number, number] | null;
  zoom: number | null;
}

function MapViewController({ center, zoom }: MapViewControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (center && zoom) {
      map.flyTo(center, zoom, { duration: 1 });
    }
  }, [center, zoom, map]);

  return null;
}

interface InteractiveMapProps {
  layers: ThemeGroup[];
  selectedFacility?: Facility | null;
  onFacilitySelect?: (facility: Facility) => void;
  className?: string;
}

// UAE Center coordinates
const UAE_CENTER: [number, number] = [24.4539, 54.3773];
const UAE_ZOOM = 10;

export function InteractiveMap({ layers, selectedFacility, onFacilitySelect, className }: InteractiveMapProps) {
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [mapZoom, setMapZoom] = useState<number | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Get visible layer IDs
  const visibleLayerIds = layers.flatMap(theme =>
    theme.layers.filter(l => l.visible).map(l => l.id)
  );

  // Filter facilities based on visible layers
  const visibleFacilities = sampleFacilities.filter(f =>
    visibleLayerIds.includes(f.layerId)
  );

  // Get layer color by id
  const getLayerColor = (layerId: number): string => {
    for (const theme of layers) {
      const layer = theme.layers.find(l => l.id === layerId);
      if (layer) return layer.color;
    }
    return '#0d9488';
  };

  const handleZoomIn = () => {
    mapRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut();
  };

  const handleResetView = () => {
    setMapCenter(UAE_CENTER);
    setMapZoom(UAE_ZOOM);
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
          setMapZoom(14);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleFullscreen = () => {
    const mapContainer = document.querySelector('.leaflet-container');
    if (mapContainer) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        mapContainer.requestFullscreen();
      }
    }
  };

  return (
    <div className={cn("relative w-full h-full rounded-xl overflow-hidden", className)}>
      <MapContainer
        center={UAE_CENTER}
        zoom={UAE_ZOOM}
        className="w-full h-full"
        zoomControl={false}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        <MapViewController center={mapCenter} zoom={mapZoom} />

        {visibleFacilities.map((facility) => (
          <Marker
            key={facility.id}
            position={facility.coordinates}
            icon={createCustomIcon(getLayerColor(facility.layerId), facility.theme === 'healthcare')}
            eventHandlers={{
              click: () => onFacilitySelect?.(facility),
            }}
          >
            <Popup>
              <FacilityPopupContent facility={facility} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <MapControlsOverlay
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
        onLocateMe={handleLocateMe}
        onFullscreen={handleFullscreen}
      />

      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none bg-gradient-to-t from-background/10 to-transparent" />
    </div>
  );
}
