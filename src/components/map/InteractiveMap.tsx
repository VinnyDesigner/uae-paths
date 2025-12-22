import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ZoomIn, ZoomOut, Maximize, LocateFixed, Home, Map, Check, List, Building2, Heart, GraduationCap, Stethoscope, Pill, HeartPulse, Siren, Accessibility, Truck, Microscope, School, Building, BookOpen, Baby, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeGroup, Facility, MapLayer } from '@/types/map';
import { baseMaps, BaseMapOption } from './BaseMapSelector';
import { getCategoryColor, getCategoryColorByLayerId, statusColors, ctaColor } from '@/lib/mapColors';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart, GraduationCap, Building2, Stethoscope, Pill, HeartPulse, 
  Siren, Accessibility, Truck, Microscope, School, Building, BookOpen, Baby, Users
};

function getIcon(iconName: string) {
  return iconMap[iconName] || Building2;
}

// SVG icons for markers (inline to avoid external dependencies)
const markerIcons: Record<string, string> = {
  Building2: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>',
  Stethoscope: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>',
  Microscope: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/></svg>',
  Pill: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>',
  HeartPulse: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>',
  Siren: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18v-6a5 5 0 1 1 10 0v6"/><path d="M5 21a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1Z"/><path d="M21 12h1"/><path d="M18.5 4.5 18 5"/><path d="M2 12h1"/><path d="M12 2v1"/><path d="m4.929 4.929.707.707"/><path d="M12 12v6"/></svg>',
  Accessibility: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="4" r="1"/><path d="m18 19 1-7-6 1"/><path d="m5 8 3-3 5.5 3-2.36 3.5"/><path d="M4.24 14.5a5 5 0 0 0 6.88 6"/><path d="M13.76 17.5a5 5 0 0 0-6.88-6"/></svg>',
  Truck: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18h2"/><path d="M19 18h2"/><path d="M19 18a2 2 0 1 0 0-4h-3"/><path d="M8 18a2 2 0 1 1 0-4H5.83"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>',
  School: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 6 8-4 8 4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"/><path d="M18 5v17"/><path d="M6 5v17"/><circle cx="12" cy="9" r="2"/></svg>',
  Building: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>',
  BookOpen: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
  Baby: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/></svg>',
  Users: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
};

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons with consistent colors from unified system
const createCustomIcon = (facilityType: string, isHighlighted: boolean = false) => {
  const categoryColor = getCategoryColor(facilityType);
  const color = categoryColor.base;
  const iconSvg = markerIcons[categoryColor.iconName] || markerIcons['Building2'];
  
  const pulseAnimation = isHighlighted ? `
    <div style="
      position: absolute;
      width: 48px;
      height: 48px;
      top: -8px;
      left: -8px;
      border-radius: 50%;
      background: ${categoryColor.glow};
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

  const iconSize = isHighlighted ? 42 : 36;
  const iconAnchor = isHighlighted ? 21 : 18;

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position: relative;">
        ${pulseAnimation}
        <div style="
          width: ${iconSize}px;
          height: ${iconSize}px;
          background: ${color};
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px ${categoryColor.glow};
          border: 3px solid white;
          ${isHighlighted ? 'transform: rotate(-45deg) scale(1.05);' : ''}
        ">
          <div style="
            transform: rotate(45deg);
            color: white;
            width: 16px;
            height: 16px;
          ">
            ${iconSvg}
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
  selectedBaseMap: string;
  onBaseMapChange: (mapId: string) => void;
  layers: ThemeGroup[];
}

function MapControlsOverlay({ onZoomIn, onZoomOut, onResetView, onLocateMe, onFullscreen, selectedBaseMap, onBaseMapChange, layers }: MapControlsProps) {
  const [baseMapOpen, setBaseMapOpen] = useState(false);
  const [legendOpen, setLegendOpen] = useState(false);

  // Get visible layers for legend
  const visibleLayers = layers.flatMap(theme =>
    theme.layers
      .filter(layer => layer.visible)
      .map(layer => ({ ...layer, themeName: theme.name, themeColor: theme.colorClass }))
  );

  return (
    <>
      {/* Desktop only: Top-right controls (Reset, Fullscreen) - Hidden on tablet */}
      <div className="hidden lg:flex absolute top-4 right-4 z-[1000] flex-col gap-2 pointer-events-none">
        <div className="flex flex-col gap-2 pointer-events-auto">
          <button
            onClick={onResetView}
            className="bg-card rounded-xl shadow-lg border border-border p-3 hover:bg-secondary hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            title="Reset to UAE"
            aria-label="Reset map view"
          >
            <Home className="w-5 h-5 text-foreground" />
          </button>
          
          <button
            onClick={onFullscreen}
            className="bg-card rounded-xl shadow-lg border border-border p-3 hover:bg-secondary hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            title="Fullscreen"
            aria-label="Toggle fullscreen"
          >
            <Maximize className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>

      {/* Desktop/Tablet: Bottom-right controls (Legend, Locate, Zoom, BaseMap) */}
      <div className="hidden md:flex absolute bottom-8 right-4 z-[1000] items-end gap-2 pointer-events-none">
        {/* Legend Control */}
        <div className="relative pointer-events-auto">
          <button
            onClick={() => setLegendOpen(!legendOpen)}
            className={cn(
              "bg-card rounded-xl shadow-lg border border-border p-3 hover:bg-secondary hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              legendOpen && "bg-secondary"
            )}
            title="Map Legend"
            aria-label="Toggle legend"
            aria-expanded={legendOpen}
          >
            <List className="w-5 h-5 text-foreground" />
            {visibleLayers.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                {visibleLayers.length}
              </span>
            )}
          </button>

          {/* Legend Panel */}
          {legendOpen && (
            <>
              <div 
                className="fixed inset-0 z-[999]" 
                onClick={() => setLegendOpen(false)} 
              />
              <div className="absolute bottom-full right-0 mb-2 bg-card/95 backdrop-blur-xl rounded-xl shadow-xl border border-border overflow-hidden z-[1000] animate-fade-in w-[240px]">
                <div className="px-3 py-2.5 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <List className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">Legend</span>
                    </div>
                    <span className="text-xs text-muted-foreground bg-secondary rounded-full px-2 py-0.5">
                      {visibleLayers.length}
                    </span>
                  </div>
                </div>
                <div className="p-2.5 max-h-52 overflow-y-auto">
                  {visibleLayers.length === 0 ? (
                    <p className="text-xs text-muted-foreground p-3 text-center">
                      No active layers
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {visibleLayers.map((layer) => {
                        const LayerIcon = getIcon(layer.icon);
                        return (
                          <div
                            key={layer.id}
                            className="flex items-center gap-3 py-2 px-2.5 rounded-lg hover:bg-secondary/50 transition-colors"
                          >
                            {/* Tinted background icon - consistent with side panel */}
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: `${layer.color}15` }}
                            >
                              <LayerIcon 
                                className="w-4 h-4" 
                                style={{ color: layer.color }} 
                              />
                            </div>
                            <span className="text-xs font-medium text-foreground truncate">{layer.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Locate Me + Zoom + Base Map Controls Stack */}
        <div className="flex flex-col gap-2 items-end pointer-events-auto">
          {/* Locate Me - visible on tablet and desktop */}
          <button
            onClick={onLocateMe}
            className="bg-card rounded-xl shadow-lg border border-border p-3 hover:bg-primary hover:text-primary-foreground hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            title="Locate me"
            aria-label="Find my location"
          >
            <LocateFixed className="w-5 h-5" />
          </button>

          {/* Zoom Control Pill - Hidden on tablet and mobile, only desktop */}
          <div className="hidden lg:flex flex-col bg-card rounded-xl shadow-lg border border-border overflow-hidden">
            <button
              onClick={onZoomIn}
              aria-label="Zoom In"
              className="p-3 hover:bg-secondary active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <ZoomIn className="w-5 h-5 text-foreground" />
            </button>
            <div className="h-px bg-border" />
            <button
              onClick={onZoomOut}
              aria-label="Zoom Out"
              className="p-3 hover:bg-secondary active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <ZoomOut className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Base Map Control */}
          <div className="relative pointer-events-auto">
            <button
              onClick={() => setBaseMapOpen(!baseMapOpen)}
              className="bg-card rounded-xl shadow-lg border border-border p-3 hover:bg-secondary hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              title="Change Base Map"
              aria-label="Change base map"
              aria-expanded={baseMapOpen}
            >
              <Map className="w-5 h-5 text-foreground" />
            </button>

            {/* Base Map Selector Panel */}
            {baseMapOpen && (
              <>
                <div 
                  className="fixed inset-0 z-[999]" 
                  onClick={() => setBaseMapOpen(false)} 
                />
                <div className="absolute bottom-full right-0 mb-2 bg-card/95 backdrop-blur-xl rounded-xl shadow-xl border border-border overflow-hidden z-[1000] animate-fade-in p-3 w-[280px]">
                  <p className="text-xs text-muted-foreground font-medium px-1 pb-2 uppercase tracking-wide">
                    Base Map
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {baseMaps.map((map) => (
                      <button
                        key={map.id}
                        onClick={() => {
                          onBaseMapChange(map.id);
                          setBaseMapOpen(false);
                        }}
                        className={cn(
                          "relative group rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                          selectedBaseMap === map.id
                            ? "border-primary ring-2 ring-primary/30"
                            : "border-transparent hover:border-primary/50"
                        )}
                      >
                        <div className="aspect-square relative">
                          <img
                            src={map.previewImage}
                            alt={map.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className={cn(
                            "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent",
                            "flex items-end justify-center pb-1"
                          )}>
                            <span className="text-[10px] font-medium text-white truncate px-1">
                              {map.name}
                            </span>
                          </div>
                          {selectedBaseMap === map.id && (
                            <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile: Single unified control rail - bottom right (no zoom controls) */}
      <div className="md:hidden absolute bottom-20 right-4 z-[1000] flex flex-col gap-2.5 pointer-events-auto safe-area-inset-bottom">

        {/* Locate Me */}
        <button
          onClick={onLocateMe}
          className="bg-card rounded-xl shadow-lg border border-border p-2.5 hover:bg-primary hover:text-primary-foreground active:scale-95 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Find my location"
        >
          <LocateFixed className="w-5 h-5" />
        </button>

        {/* Legend */}
        <div className="relative">
          <button
            onClick={() => setLegendOpen(!legendOpen)}
            className={cn(
              "bg-card rounded-xl shadow-lg border border-border p-2.5 active:scale-95 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center",
              legendOpen && "bg-secondary"
            )}
            aria-label="Toggle legend"
            aria-expanded={legendOpen}
          >
            <List className="w-5 h-5 text-foreground" />
            {visibleLayers.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-[9px] font-bold text-primary-foreground">
                {visibleLayers.length}
              </span>
            )}
          </button>

          {/* Mobile Legend Panel */}
          {legendOpen && (
            <>
              <div 
                className="fixed inset-0 z-[999]" 
                onClick={() => setLegendOpen(false)} 
              />
              <div className="absolute bottom-full right-0 mb-2 bg-card/95 backdrop-blur-xl rounded-xl shadow-xl border border-border overflow-hidden z-[1000] animate-fade-in w-[200px]">
                <div className="px-3 py-2 border-b border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">Legend</span>
                    <span className="text-[10px] text-muted-foreground bg-secondary rounded-full px-1.5 py-0.5">
                      {visibleLayers.length}
                    </span>
                  </div>
                </div>
                <div className="p-2 max-h-44 overflow-y-auto">
                  {visibleLayers.length === 0 ? (
                    <p className="text-xs text-muted-foreground p-2 text-center">
                      No active layers
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {visibleLayers.map((layer) => {
                        const LayerIcon = getIcon(layer.icon);
                        return (
                          <div
                            key={layer.id}
                            className="flex items-center gap-2.5 py-2 px-2 rounded-lg"
                          >
                            {/* Tinted background icon - consistent with side panel */}
                            <div
                              className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: `${layer.color}15` }}
                            >
                              <LayerIcon 
                                className="w-3.5 h-3.5" 
                                style={{ color: layer.color }} 
                              />
                            </div>
                            <span className="text-[11px] font-medium text-foreground truncate">{layer.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Base Map */}
        <div className="relative">
          <button
            onClick={() => setBaseMapOpen(!baseMapOpen)}
            className={cn(
              "bg-card rounded-xl shadow-lg border border-border p-2.5 active:scale-95 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center",
              baseMapOpen && "bg-secondary"
            )}
            aria-label="Change base map"
            aria-expanded={baseMapOpen}
          >
            <Map className="w-5 h-5 text-foreground" />
          </button>

          {/* Mobile Base Map Panel */}
          {baseMapOpen && (
            <>
              <div 
                className="fixed inset-0 z-[999]" 
                onClick={() => setBaseMapOpen(false)} 
              />
              <div className="absolute bottom-full right-0 mb-2 bg-card/95 backdrop-blur-xl rounded-xl shadow-xl border border-border overflow-hidden z-[1000] animate-fade-in p-2 w-[180px]">
                <div className="grid grid-cols-2 gap-1.5">
                  {baseMaps.map((map) => (
                    <button
                      key={map.id}
                      onClick={() => {
                        onBaseMapChange(map.id);
                        setBaseMapOpen(false);
                      }}
                      className={cn(
                        "relative rounded-lg overflow-hidden border-2 transition-all",
                        selectedBaseMap === map.id
                          ? "border-primary"
                          : "border-transparent"
                      )}
                    >
                      <div className="aspect-square relative">
                        <img
                          src={map.previewImage}
                          alt={map.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-0.5">
                          <span className="text-[9px] font-medium text-white truncate px-0.5">
                            {map.name}
                          </span>
                        </div>
                        {selectedBaseMap === map.id && (
                          <div className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-primary rounded-full flex items-center justify-center">
                            <Check className="w-2 h-2 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
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
  onGetDirections?: (facility: Facility) => void;
  suggestedZoom?: number;
  baseMapId?: string;
  onBaseMapChange?: (mapId: string) => void;
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
  onGetDirections,
  suggestedZoom,
  baseMapId = 'default',
  onBaseMapChange,
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
      const isHighlighted = isSearchResult(facility);
      const categoryColor = getCategoryColor(facility.type);
      const iconSvg = markerIcons[categoryColor.iconName] || markerIcons['Building2'];
      
      const marker = L.marker([facility.coordinates[1], facility.coordinates[0]], {
        icon: createCustomIcon(facility.type, isHighlighted),
        zIndexOffset: isHighlighted ? 1000 : 0,
      });

      const distanceInfo = facility.distance 
        ? `<p style="color: ${categoryColor.base}; margin: 4px 0 0 0; font-weight: 500;">
             📍 ${facility.distance.toFixed(1)} km away
           </p>` 
        : '';

      // Hospital-specific popup content with unified colors
      const isHospital = facility.type === 'Hospitals';
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
            background-color: ${facility.hasEmergency ? statusColors.success.light : statusColors.neutral.light};
            color: ${facility.hasEmergency ? statusColors.success.text : statusColors.neutral.text};
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
              background-color: ${statusColors.info.light};
              color: ${statusColors.info.text};
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
                  background-color: ${categoryColor.medium};
                  color: ${categoryColor.base};
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
              background-color: ${categoryColor.light};
              flex-shrink: 0;
              color: ${categoryColor.base};
            ">
              <div style="width: 24px; height: 24px;">
                ${iconSvg}
              </div>
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
                background-color: ${categoryColor.medium};
                color: ${categoryColor.base};
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
            <button onclick="window.dispatchEvent(new CustomEvent('openDirections', { detail: { facilityId: '${facility.id}' } }))" style="
              flex: 1;
              padding: 10px;
              border-radius: 10px;
              background: ${ctaColor.gradient};
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
        selectedBaseMap={baseMapId}
        onBaseMapChange={onBaseMapChange || (() => {})}
        layers={layers}
      />

      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none bg-gradient-to-t from-background/20 to-transparent" />
    </div>
  );
}
