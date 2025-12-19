import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ZoomIn, ZoomOut, Maximize, LocateFixed, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeGroup, Facility } from '@/types/map';
import { sampleFacilities } from '@/data/layers';

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

interface InteractiveMapProps {
  layers: ThemeGroup[];
  selectedFacility?: Facility | null;
  onFacilitySelect?: (facility: Facility) => void;
  className?: string;
}

// UAE Center coordinates
const UAE_CENTER: L.LatLngTuple = [24.4539, 54.3773];
const UAE_ZOOM = 10;

export function InteractiveMap({ layers, selectedFacility, onFacilitySelect, className }: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

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

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: UAE_CENTER,
      zoom: UAE_ZOOM,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when visible facilities change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    visibleFacilities.forEach(facility => {
      const isHealthcare = facility.theme === 'healthcare';
      const marker = L.marker(facility.coordinates, {
        icon: createCustomIcon(getLayerColor(facility.layerId), isHealthcare),
      });

      const popupContent = `
        <div style="padding: 12px; min-width: 220px; font-family: system-ui, sans-serif;">
          <div style="display: flex; align-items: flex-start; gap: 12px;">
            <div style="
              width: 40px;
              height: 40px;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 18px;
              background-color: ${isHealthcare ? '#ccfbf1' : '#fef3c7'};
            ">
              ${isHealthcare ? '🏥' : '🎓'}
            </div>
            <div style="flex: 1; min-width: 0;">
              <h4 style="font-weight: 600; font-size: 14px; margin: 0 0 4px 0; color: #1e293b;">
                ${facility.name}
              </h4>
              <span style="
                display: inline-block;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 500;
                background-color: ${isHealthcare ? '#ccfbf1' : '#fef3c7'};
                color: ${isHealthcare ? '#0d9488' : '#d97706'};
              ">
                ${facility.type}
              </span>
            </div>
          </div>
          <div style="margin-top: 12px; font-size: 13px;">
            <p style="color: #64748b; margin: 0 0 4px 0;">
              <strong style="color: #1e293b;">Address:</strong> ${facility.address}
            </p>
            <p style="color: #64748b; margin: 0;">
              <strong style="color: #1e293b;">Emirate:</strong> ${facility.emirate}
            </p>
          </div>
          <button style="
            margin-top: 12px;
            width: 100%;
            padding: 8px;
            border-radius: 8px;
            background-color: #0c4a6e;
            color: white;
            font-size: 13px;
            font-weight: 500;
            border: none;
            cursor: pointer;
          ">
            View Details
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => onFacilitySelect?.(facility));
      marker.addTo(mapRef.current!);
      markersRef.current.push(marker);
    });
  }, [visibleFacilities, layers, onFacilitySelect]);

  const handleZoomIn = () => {
    mapRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut();
  };

  const handleResetView = () => {
    mapRef.current?.flyTo(UAE_CENTER, UAE_ZOOM, { duration: 1 });
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          mapRef.current?.flyTo(
            [position.coords.latitude, position.coords.longitude],
            14,
            { duration: 1 }
          );
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleFullscreen = () => {
    const container = mapContainerRef.current;
    if (container) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        container.requestFullscreen();
      }
    }
  };

  return (
    <div className={cn("relative w-full h-full min-h-[500px] rounded-xl overflow-hidden", className)}>
      <div
        ref={mapContainerRef}
        className="w-full h-full"
        style={{ minHeight: '500px' }}
      />

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
