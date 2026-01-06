import { useEffect, useRef, useState, useCallback } from 'react';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Point from '@arcgis/core/geometry/Point';
import PopupTemplate from '@arcgis/core/PopupTemplate';
import Basemap from '@arcgis/core/Basemap';
import TileLayer from '@arcgis/core/layers/TileLayer';
import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
import esriConfig from '@arcgis/core/config';
import '@arcgis/core/assets/esri/themes/light/main.css';
import { ZoomIn, ZoomOut, Maximize, LocateFixed, Home, Map as MapIcon, Check, List, Layers, ChevronRight, Building2, Heart, GraduationCap, Stethoscope, Pill, HeartPulse, Siren, Accessibility, Truck, Microscope, School, Building, BookOpen, Baby, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeGroup, Facility, MapLayer } from '@/types/map';
import { arcgisBaseMaps, ArcGISBaseMapOption } from './BaseMapSelector';
import { getCategoryColor, getCategoryColorByLayerId, statusColors, ctaColor } from '@/lib/mapColors';

// Configure ArcGIS assets path
esriConfig.assetsPath = 'https://js.arcgis.com/4.30/@arcgis/core/assets';

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

// Create custom symbol for facility markers
function createMarkerSymbol(facilityType: string, isHighlighted: boolean = false) {
  const categoryColor = getCategoryColor(facilityType);
  const color = categoryColor.base;
  const size = isHighlighted ? '48px' : '40px';
  
  return {
    type: 'simple-marker',
    style: 'circle',
    color: color,
    size: size,
    outline: {
      color: 'white',
      width: 3
    }
  };
}

// Create CIMSymbol for custom marker with icon
function createCustomMarkerSymbol(facilityType: string, isHighlighted: boolean = false) {
  const categoryColor = getCategoryColor(facilityType);
  const iconSvg = markerIcons[categoryColor.iconName] || markerIcons['Building2'];
  const size = isHighlighted ? 42 : 36;
  
  // Use PictureMarkerSymbol with data URL for custom SVG marker
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size + 10}" viewBox="0 0 ${size} ${size + 10}">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="${categoryColor.glow}" flood-opacity="0.5"/>
        </filter>
      </defs>
      <g filter="url(#shadow)">
        <path d="M${size/2} ${size + 5} L${size * 0.2} ${size * 0.6} A${size/2 - 2} ${size/2 - 2} 0 1 1 ${size * 0.8} ${size * 0.6} Z" fill="${categoryColor.base}" stroke="white" stroke-width="2"/>
        <circle cx="${size/2}" cy="${size/2 - 2}" r="${size/3}" fill="${categoryColor.base}"/>
        <g transform="translate(${size/2 - 8}, ${size/2 - 10}) scale(0.7)" fill="none" stroke="white" stroke-width="2">
          ${iconSvg.replace(/<svg[^>]*>|<\/svg>/g, '')}
        </g>
      </g>
    </svg>
  `;
  
  const dataUrl = `data:image/svg+xml;base64,${btoa(svgContent)}`;
  
  return {
    type: 'picture-marker',
    url: dataUrl,
    width: size,
    height: size + 10,
    yoffset: (size + 10) / 2
  };
}

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onLocateMe: () => void;
  onFullscreen: () => void;
  selectedBaseMap: string;
  onBaseMapChange: (mapId: string) => void;
  layers: ThemeGroup[];
  onLayerToggle?: (themeId: number, layerId: number) => void;
  onSelectAll?: (themeId: number) => void;
  onClearAll?: (themeId: number) => void;
  highlightedLayerId?: number | null;
}

function MapControlsOverlay({ onZoomIn, onZoomOut, onResetView, onLocateMe, onFullscreen, selectedBaseMap, onBaseMapChange, layers, onLayerToggle, onSelectAll, onClearAll, highlightedLayerId }: MapControlsProps) {
  const [baseMapOpen, setBaseMapOpen] = useState(false);
  const [legendOpen, setLegendOpen] = useState(false);
  const [layersOpen, setLayersOpen] = useState(true);
  // Multiple categories can be expanded - first one expanded by default
  const [expandedCategories, setExpandedCategories] = useState<number[]>(layers[0]?.id ? [layers[0].id] : []);

  // Get visible layers for legend
  const visibleLayers = layers.flatMap(theme =>
    theme.layers
      .filter(layer => layer.visible)
      .map(layer => ({ ...layer, themeName: theme.name, themeColor: theme.colorClass }))
  );

  return (
    <>
      {/* Desktop only: Top-right controls (Home, Fullscreen, Layers, Zoom In/Out) - z-panel */}
      <div className="hidden lg:flex absolute top-4 right-4 z-[var(--z-panel)] flex-col gap-2.5 pointer-events-none">
        <div className="flex flex-col gap-2.5 pointer-events-auto">
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

          {/* Map Layers Control */}
          {onLayerToggle && (
            <div className="relative">
              <button
                onClick={() => setLayersOpen(!layersOpen)}
                className={cn(
                  "bg-card rounded-xl shadow-lg border border-border p-3 hover:bg-secondary hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  layersOpen && "bg-secondary"
                )}
                title="Map Layers"
                aria-label="Toggle map layers"
                aria-expanded={layersOpen}
              >
                <Layers className="w-5 h-5 text-foreground" />
                {layers.flatMap(t => t.layers).filter(l => l.visible).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                    {layers.flatMap(t => t.layers).filter(l => l.visible).length}
                  </span>
                )}
              </button>

              {/* Layers Panel */}
              {layersOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-[var(--z-popover-backdrop)]" 
                    onClick={() => setLayersOpen(false)} 
                  />
                  <div className="absolute top-0 right-full mr-2 w-72 bg-card/95 backdrop-blur-xl rounded-xl shadow-xl border border-border overflow-hidden z-[var(--z-popover)] animate-fade-in">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-foreground">Map Layers</span>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                      {layers.map((theme) => {
                        const ThemeIcon = getIcon(theme.icon);
                        const visibleCount = theme.layers.filter(l => l.visible).length;
                        const hasVisibleLayers = visibleCount > 0;
                        const isExpanded = expandedCategories.includes(theme.id);

                        const toggleCategory = () => {
                          setExpandedCategories(prev => 
                            prev.includes(theme.id) 
                              ? prev.filter(id => id !== theme.id)
                              : [...prev, theme.id]
                          );
                        };

                        return (
                          <div key={theme.id} className="rounded-lg overflow-hidden">
                            {/* Category Header - Clickable to expand/collapse */}
                            <button
                              onClick={toggleCategory}
                              className={cn(
                                "w-full flex items-center gap-3 p-2.5 rounded-lg transition-all duration-150",
                                isExpanded 
                                  ? "bg-secondary" 
                                  : "bg-secondary/30 hover:bg-secondary/50"
                              )}
                            >
                              <div
                                className={cn(
                                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-150",
                                  hasVisibleLayers 
                                    ? "bg-primary text-primary-foreground" 
                                    : "bg-primary/10 text-primary"
                                )}
                              >
                                <ThemeIcon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 text-left">
                                <p className="font-medium text-sm text-foreground">{theme.name}</p>
                                {hasVisibleLayers && (
                                  <p className="text-[10px] text-muted-foreground">
                                    {visibleCount} active
                                  </p>
                                )}
                              </div>
                              <ChevronRight 
                                className={cn(
                                  "w-4 h-4 text-muted-foreground transition-transform duration-200",
                                  isExpanded && "rotate-90"
                                )} 
                              />
                            </button>
                            
                            {/* Expandable Layer List */}
                            <div 
                              className={cn(
                                "overflow-hidden transition-all duration-200 ease-out",
                                isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                              )}
                            >
                              <div className="py-2 px-2 space-y-1">
                                {theme.layers.map((layer) => {
                                  const LayerIcon = getIcon(layer.icon);
                                  const isHighlighted = highlightedLayerId === layer.id;
                                  
                                  return (
                                    <label
                                      key={layer.id}
                                      className={cn(
                                        "flex items-center gap-2 p-2 rounded-lg transition-all duration-150 cursor-pointer",
                                        layer.visible ? "bg-card" : "hover:bg-card/50",
                                        isHighlighted && "ring-2 ring-primary"
                                      )}
                                    >
                                      <div
                                        className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: layer.color + '15' }}
                                      >
                                        <LayerIcon
                                          className="w-3.5 h-3.5"
                                          style={{ color: layer.color }}
                                        />
                                      </div>
                                      <span className="flex-1 text-xs text-foreground truncate">
                                        {layer.name}
                                      </span>
                                      <input
                                        type="checkbox"
                                        checked={layer.visible}
                                        onChange={() => onLayerToggle(theme.id, layer.id)}
                                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary accent-primary"
                                      />
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Zoom Control Pill */}
          <div className="flex flex-col bg-card rounded-xl shadow-lg border border-border overflow-hidden">
            <button
              onClick={onZoomIn}
              className="p-3 hover:bg-secondary transition-colors border-b border-border"
              title="Zoom In"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={onZoomOut}
              className="p-3 hover:bg-secondary transition-colors"
              title="Zoom Out"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop only: Bottom-left controls (Locate Me, Base Map Selector) - z-map-controls */}
      <div className="hidden lg:flex absolute bottom-20 left-4 z-[var(--z-map-controls)] flex-col gap-2.5 pointer-events-none">
        <div className="flex flex-col gap-2.5 pointer-events-auto">
          <button
            onClick={onLocateMe}
            className="bg-card rounded-xl shadow-lg border border-border p-3 hover:bg-secondary hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            title="Locate Me"
            aria-label="Find my location"
          >
            <LocateFixed className="w-5 h-5 text-foreground" />
          </button>

          {/* Base Map Selector */}
          <div className="relative">
            <button
              onClick={() => setBaseMapOpen(!baseMapOpen)}
              className={cn(
                "bg-card rounded-xl shadow-lg border border-border p-3 hover:bg-secondary hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                baseMapOpen && "bg-secondary"
              )}
              title="Base Map"
              aria-label="Select base map"
              aria-expanded={baseMapOpen}
            >
              <MapIcon className="w-5 h-5 text-foreground" />
            </button>

            {baseMapOpen && (
              <>
                <div 
                  className="fixed inset-0 z-[var(--z-popover-backdrop)]" 
                  onClick={() => setBaseMapOpen(false)} 
                />
                <div className="absolute bottom-0 left-full ml-2 bg-card/95 backdrop-blur-xl rounded-xl shadow-xl border border-border overflow-hidden z-[var(--z-popover)] animate-fade-in p-3 w-[280px]">
                  <p className="text-xs text-muted-foreground font-medium px-1 pb-2 uppercase tracking-wide">
                    Select Base Map
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {arcgisBaseMaps.map((map) => (
                      <button
                        key={map.id}
                        onClick={() => {
                          onBaseMapChange(map.id);
                          setBaseMapOpen(false);
                        }}
                        className={cn(
                          "relative group rounded-lg overflow-hidden border-2 transition-all",
                          selectedBaseMap === map.id
                            ? "border-primary ring-2 ring-primary/30"
                            : "border-transparent hover:border-primary/50"
                        )}
                      >
                        <div className="aspect-square relative bg-muted">
                          <img
                            src={map.previewImage}
                            alt={map.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <div className="hidden absolute inset-0 flex items-center justify-center text-2xl bg-muted">
                            {map.preview}
                          </div>
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

      {/* Mobile controls: Zoom In/Out and Locate Me (more compact) - z-map-controls */}
      <div className="lg:hidden absolute top-4 right-4 z-[var(--z-map-controls)] flex flex-col gap-2 pointer-events-none">
        <div className="flex flex-col gap-2 pointer-events-auto">
          <button
            onClick={onLocateMe}
            className="bg-card rounded-lg shadow-md border border-border p-2.5 hover:bg-secondary active:scale-95 transition-all"
            title="Locate Me"
            aria-label="Find my location"
          >
            <LocateFixed className="w-4 h-4 text-foreground" />
          </button>
          <div className="flex flex-col bg-card rounded-lg shadow-md border border-border overflow-hidden">
            <button
              onClick={onZoomIn}
              className="p-2.5 hover:bg-secondary transition-colors border-b border-border"
              title="Zoom In"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4 text-foreground" />
            </button>
            <button
              onClick={onZoomOut}
              className="p-2.5 hover:bg-secondary transition-colors"
              title="Zoom Out"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Legend Panel - Desktop bottom right - z-panel */}
      {visibleLayers.length > 0 && (
        <div className="hidden lg:block absolute bottom-20 right-4 z-[var(--z-panel)] pointer-events-auto">
          <div className="bg-card/95 backdrop-blur-xl rounded-xl shadow-xl border border-border overflow-hidden">
            <button
              onClick={() => setLegendOpen(!legendOpen)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <List className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Legend</span>
                <span className="text-xs text-muted-foreground">({visibleLayers.length})</span>
              </div>
              <ChevronRight 
                className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform duration-200",
                  legendOpen && "rotate-90"
                )} 
              />
            </button>
            
            {legendOpen && (
              <div className="px-3 pb-3 max-h-48 overflow-y-auto">
                <div className="space-y-1.5">
                  {visibleLayers.map((layer) => {
                    const LayerIcon = getIcon(layer.icon);
                    return (
                      <div key={layer.id} className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: layer.color }}
                        >
                          <LayerIcon className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs text-foreground truncate">{layer.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
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
  onLayerToggle?: (themeId: number, layerId: number) => void;
  onSelectAll?: (themeId: number) => void;
  onClearAll?: (themeId: number) => void;
  highlightedLayerId?: number | null;
  className?: string;
}

// UAE Center coordinates
const UAE_CENTER = { longitude: 54.3773, latitude: 24.4539 };
const UAE_ZOOM = 10;

export function InteractiveMap({ 
  layers, 
  facilities,
  searchResults = [],
  selectedFacility, 
  onFacilitySelect,
  onGetDirections,
  suggestedZoom,
  baseMapId = 'streets',
  onBaseMapChange,
  onLayerToggle,
  onSelectAll,
  onClearAll,
  highlightedLayerId,
  className 
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const viewRef = useRef<MapView | null>(null);
  const graphicsLayerRef = useRef<GraphicsLayer | null>(null);
  const userGraphicRef = useRef<Graphic | null>(null);

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
    if (!mapContainerRef.current || viewRef.current) return;

    const selectedBasemap = arcgisBaseMaps.find(m => m.id === baseMapId) || arcgisBaseMaps[0];
    
    const map = new Map({
      basemap: selectedBasemap.arcgisBasemap as any
    });

    const graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

    const view = new MapView({
      container: mapContainerRef.current,
      map: map,
      center: [UAE_CENTER.longitude, UAE_CENTER.latitude],
      zoom: UAE_ZOOM,
      ui: {
        components: [] // Remove default UI components
      },
      popup: {
        dockEnabled: false,
        dockOptions: {
          buttonEnabled: false
        }
      }
    });

    mapRef.current = map;
    viewRef.current = view;
    graphicsLayerRef.current = graphicsLayer;

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
        mapRef.current = null;
        graphicsLayerRef.current = null;
      }
    };
  }, []);

  // Update basemap when baseMapId changes
  useEffect(() => {
    if (!mapRef.current) return;

    const selectedBasemap = arcgisBaseMaps.find(m => m.id === baseMapId) || arcgisBaseMaps[0];
    mapRef.current.basemap = selectedBasemap.arcgisBasemap as any;
  }, [baseMapId]);

  // Zoom to search results when they change
  useEffect(() => {
    if (!viewRef.current || searchResults.length === 0) return;

    const points = searchResults.map(f => ({
      longitude: f.coordinates[0],
      latitude: f.coordinates[1]
    }));

    if (points.length === 1) {
      viewRef.current.goTo({
        center: [points[0].longitude, points[0].latitude],
        zoom: suggestedZoom || 13
      }, { duration: 1000 });
    } else {
      const xCoords = points.map(p => p.longitude);
      const yCoords = points.map(p => p.latitude);
      
      viewRef.current.goTo({
        target: {
          type: 'extent',
          xmin: Math.min(...xCoords) - 0.02,
          ymin: Math.min(...yCoords) - 0.02,
          xmax: Math.max(...xCoords) + 0.02,
          ymax: Math.max(...yCoords) + 0.02,
          spatialReference: { wkid: 4326 }
        } as any
      }, { duration: 1000 });
    }
  }, [searchResults, suggestedZoom]);

  // Update markers when visible facilities change
  useEffect(() => {
    if (!graphicsLayerRef.current || !viewRef.current) return;

    // Clear existing graphics
    graphicsLayerRef.current.removeAll();

    // Add new graphics for each facility
    visibleFacilities.forEach(facility => {
      const isHighlighted = isSearchResult(facility);
      const categoryColor = getCategoryColor(facility.type);

      const point = new Point({
        longitude: facility.coordinates[0],
        latitude: facility.coordinates[1]
      });

      // Hospital-specific popup content
      const isHospital = facility.type === 'Hospitals';
      const hospitalInfo = isHospital ? `
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

      const distanceInfo = facility.distance 
        ? `<p style="color: ${categoryColor.base}; margin: 4px 0 0 0; font-weight: 500;">
             📍 ${facility.distance.toFixed(1)} km away
           </p>` 
        : '';

      const popupContent = `
        <div style="padding: 8px; min-width: 260px; font-family: system-ui, sans-serif;">
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
                ${markerIcons[categoryColor.iconName] || markerIcons['Building2']}
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
          ${hospitalInfo}
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
            <a href="https://www.google.com/maps/dir/?api=1&destination=${facility.coordinates[1]},${facility.coordinates[0]}" target="_blank" style="
              flex: 1;
              padding: 10px;
              border-radius: 10px;
              background: ${ctaColor.gradient};
              color: white;
              font-size: 13px;
              font-weight: 500;
              border: none;
              cursor: pointer;
              text-align: center;
              text-decoration: none;
              display: block;
            ">
              📍 Open with Google Maps
            </a>
          </div>
        </div>
      `;

      const graphic = new Graphic({
        geometry: point,
        symbol: {
          type: 'simple-marker',
          style: 'circle',
          color: categoryColor.base,
          size: isHighlighted ? 18 : 14,
          outline: {
            color: 'white',
            width: 2
          }
        } as any,
        attributes: {
          id: facility.id,
          name: facility.name,
          type: facility.type,
          address: facility.address,
          emirate: facility.emirate
        },
        popupTemplate: {
          title: facility.name,
          content: popupContent
        } as any
      });

      graphicsLayerRef.current!.add(graphic);
    });

    // Set up click handler for facility selection
    if (viewRef.current && onFacilitySelect) {
      viewRef.current.on('click', (event) => {
        viewRef.current!.hitTest(event).then((response) => {
          const results = response.results.filter(
            (result) => (result as any).graphic?.layer === graphicsLayerRef.current
          );
          if (results.length > 0) {
            const graphic = (results[0] as any).graphic;
            const facility = visibleFacilities.find(f => f.id === graphic.attributes.id);
            if (facility) {
              onFacilitySelect(facility);
            }
          }
        });
      });
    }
  }, [visibleFacilities, layers, onFacilitySelect, getLayerColor, isSearchResult]);

  // Handle selected facility
  useEffect(() => {
    if (!viewRef.current || !selectedFacility) return;

    viewRef.current.goTo({
      center: [selectedFacility.coordinates[0], selectedFacility.coordinates[1]],
      zoom: 15
    }, { duration: 800 });

    // Open popup for selected facility
    const graphic = graphicsLayerRef.current?.graphics.find(
      g => g.attributes?.id === selectedFacility.id
    );
    if (graphic) {
      viewRef.current.popup.open({
        features: [graphic],
        location: graphic.geometry as Point
      });
    }
  }, [selectedFacility]);

  const handleZoomIn = () => {
    if (viewRef.current) {
      viewRef.current.goTo({ zoom: viewRef.current.zoom + 1 });
    }
  };

  const handleZoomOut = () => {
    if (viewRef.current) {
      viewRef.current.goTo({ zoom: viewRef.current.zoom - 1 });
    }
  };

  const handleResetView = () => {
    if (viewRef.current) {
      viewRef.current.goTo({
        center: [UAE_CENTER.longitude, UAE_CENTER.latitude],
        zoom: UAE_ZOOM
      }, { duration: 1000 });
    }
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Remove existing user marker
          if (userGraphicRef.current && graphicsLayerRef.current) {
            graphicsLayerRef.current.remove(userGraphicRef.current);
          }

          // Add user location marker
          const userPoint = new Point({
            longitude: longitude,
            latitude: latitude
          });

          const userGraphic = new Graphic({
            geometry: userPoint,
            symbol: {
              type: 'simple-marker',
              style: 'circle',
              color: '#3b82f6',
              size: 16,
              outline: {
                color: 'white',
                width: 3
              }
            } as any,
            popupTemplate: {
              title: '📍 Your Location',
              content: 'You are here'
            } as any
          });

          graphicsLayerRef.current?.add(userGraphic);
          userGraphicRef.current = userGraphic;

          viewRef.current?.goTo({
            center: [longitude, latitude],
            zoom: 14
          }, { duration: 1000 });
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
    <div className={cn("relative w-full h-full min-h-[500px]", className)}>
      <div
        ref={mapContainerRef}
        className="absolute inset-0 w-full h-full rounded-xl overflow-hidden"
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
        onLayerToggle={onLayerToggle}
        onSelectAll={onSelectAll}
        onClearAll={onClearAll}
        highlightedLayerId={highlightedLayerId}
      />

      {/* Gradient overlay at bottom (must not block UI) */}
      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none bg-gradient-to-t from-background/20 to-transparent" />
    </div>
  );
}
