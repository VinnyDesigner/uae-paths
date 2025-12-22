import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ZoomIn, ZoomOut, Maximize, LocateFixed, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeGroup, Facility } from '@/types/map';
import { baseMaps, BaseMapOption } from './BaseMapSelector';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons with pulse animation for search results
const createCustomIcon = (color: string, isHealthcare: boolean, isHighlighted: boolean = false, isHospital: boolean = false) => {
  const pulseAnimation = isHighlighted ? `
    <div style="
      position: absolute;
      width: 48px;
      height: 48px;
      top: -8px;
      left: -8px;
      border-radius: 50%;
      background: ${color}33;
      animation: pulse 2s infinite;
    "></div>
    <style>
      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.5); opacity: 0; }
        100% { transform: scale(1); opacity: 0; }
      }
    </style>
  ` : '';

  // Special hospital icon
  const iconEmoji = isHospital ? '🏥' : (isHealthcare ? '❤️' : '🎓');
  const iconSize = isHospital ? 40 : 36;
  const iconAnchor = isHospital ? 20 : 18;

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative;">
        ${pulseAnimation}
        <div style="
          width: ${iconSize}px;
          height: ${iconSize}px;
          background: ${isHospital ? '#063660' : color};
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px ${isHospital ? '#06366066' : color + '66'};
          border: 3px solid white;
          ${isHighlighted ? 'animation: bounce 1s ease-in-out;' : ''}
        ">
          <div style="
            transform: rotate(45deg);
            color: white;
            font-size: ${isHospital ? '18px' : '16px'};
          ">
            ${iconEmoji}
          </div>
        </div>
      </div>
    `,
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconAnchor, iconSize],
    popupAnchor: [0, -iconSize],
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
    <>
      {/* Top-right controls: Reset, Locate, Fullscreen */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={onResetView}
          className="bg-card rounded-xl shadow-lg border border-border p-3 hover:bg-secondary hover:scale-105 active:scale-95 transition-all duration-200"
          title="Reset to UAE"
        >
          <Home className="w-5 h-5 text-foreground" />
        </button>
        
        <button
          onClick={onLocateMe}
          className="bg-card rounded-xl shadow-lg border border-border p-3 hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95 transition-all duration-200"
          title="Locate me"
        >
          <LocateFixed className="w-5 h-5" />
        </button>
        
        <button
          onClick={onFullscreen}
          className="bg-card rounded-xl shadow-lg border border-border p-3 hover:bg-secondary hover:scale-105 active:scale-95 transition-all duration-200"
          title="Fullscreen"
        >
          <Maximize className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Bottom-right: Combined Zoom Control */}
      <div className="absolute bottom-20 right-4 z-[1000]">
        <div className="flex flex-col bg-[#1a1a1a] rounded-lg shadow-lg overflow-hidden">
          <button
            onClick={onZoomIn}
            aria-label="Zoom In"
            className="p-3 hover:bg-[#2a2a2a] active:bg-[#333] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <ZoomIn className="w-5 h-5 text-white" />
          </button>
          <div className="h-px bg-[#333]" />
          <button
            onClick={onZoomOut}
            aria-label="Zoom Out"
            className="p-3 hover:bg-[#2a2a2a] active:bg-[#333] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <ZoomOut className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </>
  );
}

interface InteractiveMapProps {
  layers: ThemeGroup[];
  facilities: Facility[];
  searchResults?: Facility[];
  selectedFacility?: Facility | null;
  onFacilitySelect?: (facility: Facility) => void;
  suggestedZoom?: number;
  baseMapId?: string;
  className?: string;
}

// UAE Center coordinates
const UAE_CENTER: L.LatLngTuple = [24.4539, 54.3773];
const UAE_ZOOM = 10;

export function InteractiveMap({ 
  layers, 
  facilities,
  searchResults = [],
  selectedFacility, 
  onFacilitySelect, 
  suggestedZoom,
  baseMapId = 'default',
  className 
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Get visible layer IDs
  const visibleLayerIds = layers.flatMap(theme =>
    theme.layers.filter(l => l.visible).map(l => l.id)
  );

  // Filter facilities based on visible layers
  const visibleFacilities = facilities.filter(f =>
    visibleLayerIds.includes(f.layerId)
  );

  // Check if a facility is in search results
  const isSearchResult = useCallback((facility: Facility) => {
    return searchResults.some(r => r.id === facility.id);
  }, [searchResults]);

  // Get layer color by id
  const getLayerColor = useCallback((layerId: number): string => {
    for (const theme of layers) {
      const layer = theme.layers.find(l => l.id === layerId);
      if (layer) return layer.color;
    }
    return '#0d9488';
  }, [layers]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: UAE_CENTER,
      zoom: UAE_ZOOM,
      zoomControl: false,
    });

    const initialBaseMap = baseMaps.find(m => m.id === baseMapId) || baseMaps[0];
    const tileLayer = L.tileLayer(initialBaseMap.url, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      tileLayerRef.current = null;
    };
  }, []);

  // Update base map when baseMapId changes
  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return;

    const newBaseMap = baseMaps.find(m => m.id === baseMapId) || baseMaps[0];
    tileLayerRef.current.setUrl(newBaseMap.url);
  }, [baseMapId]);

  // Zoom to search results when they change
  useEffect(() => {
    if (!mapRef.current || searchResults.length === 0) return;

    const bounds = L.latLngBounds(
      searchResults.map(f => [f.coordinates[1], f.coordinates[0]] as L.LatLngTuple)
    );

    mapRef.current.flyToBounds(bounds, {
      padding: [80, 80],
      maxZoom: suggestedZoom || 13,
      duration: 1
    });
  }, [searchResults, suggestedZoom]);

  // Update markers when visible facilities change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    visibleFacilities.forEach(facility => {
      const isHealthcare = facility.theme === 'healthcare';
      const isHighlighted = isSearchResult(facility);
      const isHospital = facility.type === 'Hospitals';
      
      const marker = L.marker([facility.coordinates[1], facility.coordinates[0]], {
        icon: createCustomIcon(getLayerColor(facility.layerId), isHealthcare, isHighlighted, isHospital),
        zIndexOffset: isHighlighted ? 1000 : 0,
      });

      const distanceInfo = facility.distance 
        ? `<p style="color: #0d9488; margin: 4px 0 0 0; font-weight: 500;">
             📍 ${facility.distance.toFixed(1)} km away
           </p>` 
        : '';

      // Hospital-specific popup content
      const hospitalSpecificInfo = isHospital ? `
        <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px;">
          <div style="
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 500;
            background-color: ${facility.hasEmergency ? '#dcfce7' : '#f1f5f9'};
            color: ${facility.hasEmergency ? '#166534' : '#64748b'};
          ">
            ⚡ Emergency: ${facility.hasEmergency ? 'Yes' : 'No'}
          </div>
          ${facility.bedCapacity ? `
            <div style="
              display: flex;
              align-items: center;
              gap: 4px;
              padding: 4px 8px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: 500;
              background-color: #e0f4ff;
              color: #0369a1;
            ">
              🛏️ ${facility.bedCapacity} Beds
            </div>
          ` : ''}
        </div>
        ${facility.specialties && facility.specialties.length > 0 ? `
          <div style="margin-top: 12px;">
            <p style="font-size: 11px; color: #64748b; margin-bottom: 6px;">Specialties:</p>
            <div style="display: flex; flex-wrap: wrap; gap: 4px;">
              ${facility.specialties.map(s => `
                <span style="
                  padding: 3px 8px;
                  border-radius: 4px;
                  font-size: 10px;
                  font-weight: 500;
                  background-color: #e0f2fe;
                  color: #0369a1;
                ">${s}</span>
              `).join('')}
            </div>
          </div>
        ` : ''}
      ` : '';

      const popupContent = `
        <div style="padding: 16px; min-width: 280px; font-family: system-ui, sans-serif;">
          <div style="display: flex; align-items: flex-start; gap: 12px;">
            <div style="
              width: 48px;
              height: 48px;
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 22px;
              background-color: ${isHospital ? '#063660' : (isHealthcare ? '#ccfbf1' : '#e0f4ff')};
              flex-shrink: 0;
            ">
              ${isHospital ? '<span style="filter: grayscale(100%) brightness(10);">🏥</span>' : (isHealthcare ? '❤️' : '🎓')}
            </div>
            <div style="flex: 1; min-width: 0;">
              <h4 style="font-weight: 600; font-size: 15px; margin: 0 0 6px 0; color: #1e293b; line-height: 1.3;">
                ${facility.name}
              </h4>
              <span style="
                display: inline-block;
                padding: 4px 10px;
                border-radius: 20px;
                font-size: 11px;
                font-weight: 600;
                letter-spacing: 0.02em;
                background-color: ${isHospital ? '#063660' : (isHealthcare ? '#ccfbf1' : '#e0f4ff')};
                color: ${isHospital ? 'white' : (isHealthcare ? '#0d9488' : '#38B6FF')};
              ">
                ${facility.type}
              </span>
            </div>
          </div>
          ${hospitalSpecificInfo}
          <div style="margin-top: 14px; font-size: 13px; line-height: 1.5;">
            <p style="color: #64748b; margin: 0;">
              📍 ${facility.address}
            </p>
            <p style="color: #64748b; margin: 4px 0 0 0;">
              🏛️ ${facility.emirate}
            </p>
            ${distanceInfo}
          </div>
          <div style="display: flex; gap: 8px; margin-top: 14px;">
            <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${facility.coordinates[1]},${facility.coordinates[0]}', '_blank')" style="
              flex: 1;
              padding: 10px;
              border-radius: 10px;
              background: linear-gradient(135deg, #0c4a6e 0%, #063660 100%);
              color: white;
              font-size: 13px;
              font-weight: 500;
              border: none;
              cursor: pointer;
              transition: all 0.2s;
            " onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
              🧭 Get Directions
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 340,
        className: 'custom-popup'
      });
      marker.on('click', () => onFacilitySelect?.(facility));
      marker.addTo(mapRef.current!);
      markersRef.current.push(marker);
    });
  }, [visibleFacilities, layers, onFacilitySelect, getLayerColor, isSearchResult]);

  // Handle selected facility
  useEffect(() => {
    if (!mapRef.current || !selectedFacility) return;

    mapRef.current.flyTo(
      [selectedFacility.coordinates[1], selectedFacility.coordinates[0]],
      15,
      { duration: 0.8 }
    );

    // Find and open the popup for the selected facility
    const marker = markersRef.current.find(m => {
      const latlng = m.getLatLng();
      return latlng.lat === selectedFacility.coordinates[1] && 
             latlng.lng === selectedFacility.coordinates[0];
    });
    if (marker) {
      marker.openPopup();
    }
  }, [selectedFacility]);

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
          const { latitude, longitude } = position.coords;
          
          // Remove existing user marker
          if (userMarkerRef.current) {
            userMarkerRef.current.remove();
          }

          // Add user location marker
          const userIcon = L.divIcon({
            className: 'user-location-marker',
            html: `
              <div style="position: relative;">
                <div style="
                  position: absolute;
                  width: 40px;
                  height: 40px;
                  top: -12px;
                  left: -12px;
                  border-radius: 50%;
                  background: #3b82f633;
                  animation: userPulse 2s infinite;
                "></div>
                <div style="
                  width: 16px;
                  height: 16px;
                  background: #3b82f6;
                  border-radius: 50%;
                  border: 3px solid white;
                  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.5);
                "></div>
              </div>
              <style>
                @keyframes userPulse {
                  0% { transform: scale(1); opacity: 0.8; }
                  50% { transform: scale(1.5); opacity: 0; }
                  100% { transform: scale(1); opacity: 0; }
                }
              </style>
            `,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          });

          userMarkerRef.current = L.marker([latitude, longitude], { icon: userIcon })
            .addTo(mapRef.current!)
            .bindPopup('📍 Your Location');

          mapRef.current?.flyTo([latitude, longitude], 14, { duration: 1 });
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
      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none bg-gradient-to-t from-background/20 to-transparent" />
    </div>
  );
}
