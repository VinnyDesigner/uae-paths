import { useState } from 'react';
import { Map, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// Legacy Leaflet-style basemaps (kept for reference)
export interface BaseMapOption {
  id: string;
  name: string;
  url: string;
  preview: string;
  previewImage: string;
}

export const baseMaps: BaseMapOption[] = [
  {
    id: 'default',
    name: 'Default',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    preview: '🗺️',
    previewImage: 'https://a.basemaps.cartocdn.com/light_all/6/32/22.png'
  },
  {
    id: 'original',
    name: 'Original',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    preview: '🌍',
    previewImage: 'https://a.tile.openstreetmap.org/6/32/22.png'
  },
  {
    id: 'grey',
    name: 'Grey',
    url: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
    preview: '⬜',
    previewImage: 'https://a.basemaps.cartocdn.com/light_nolabels/6/32/22.png'
  },
  {
    id: 'grey-lite',
    name: 'Grey Lite',
    url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
    preview: '◻️',
    previewImage: 'https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/6/32/22.png'
  },
  {
    id: 'night',
    name: 'Night',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    preview: '🌙',
    previewImage: 'https://a.basemaps.cartocdn.com/dark_all/6/32/22.png'
  },
  {
    id: 'satellite',
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    preview: '🛰️',
    previewImage: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/6/22/32'
  },
  {
    id: 'satellite-labels',
    name: 'Satellite + Labels',
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    preview: '🌐',
    previewImage: 'https://mt1.google.com/vt/lyrs=y&x=32&y=22&z=6'
  },
  {
    id: 'terrain',
    name: 'Land Lot',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    preview: '🏔️',
    previewImage: 'https://a.tile.opentopomap.org/6/32/22.png'
  }
];

// ArcGIS basemaps using SDK 4.x built-in basemaps
export interface ArcGISBaseMapOption {
  id: string;
  name: string;
  arcgisBasemap: string;
  preview: string;
  previewImage: string;
}

export const arcgisBaseMaps: ArcGISBaseMapOption[] = [
  {
    id: 'streets',
    name: 'Streets',
    arcgisBasemap: 'streets-vector',
    preview: '🗺️',
    previewImage: 'https://www.arcgis.com/sharing/rest/content/items/de26a3cf4cc9451298ea173c4b324736/info/thumbnail/thumbnail1702503399058.jpeg'
  },
  {
    id: 'streets-navigation',
    name: 'Navigation',
    arcgisBasemap: 'streets-navigation-vector',
    preview: '🧭',
    previewImage: 'https://www.arcgis.com/sharing/rest/content/items/63c47b7177f946b49902c24129b87252/info/thumbnail/thumbnail1702503436892.jpeg'
  },
  {
    id: 'gray',
    name: 'Light Gray',
    arcgisBasemap: 'gray-vector',
    preview: '⬜',
    previewImage: 'https://www.arcgis.com/sharing/rest/content/items/8a2cba3b0ebf4f9584e2c0e06b77c75d/info/thumbnail/thumbnail1702503352376.jpeg'
  },
  {
    id: 'dark-gray',
    name: 'Dark Gray',
    arcgisBasemap: 'dark-gray-vector',
    preview: '◼️',
    previewImage: 'https://www.arcgis.com/sharing/rest/content/items/5e9b3685f4c24d8781073dd928ebda50/info/thumbnail/thumbnail1702503271929.jpeg'
  },
  {
    id: 'satellite',
    name: 'Satellite',
    arcgisBasemap: 'satellite',
    preview: '🛰️',
    previewImage: 'https://www.arcgis.com/sharing/rest/content/items/67372ff42cd145319639a99152b15bc3/info/thumbnail/thumbnail1702501637498.jpeg'
  },
  {
    id: 'hybrid',
    name: 'Hybrid',
    arcgisBasemap: 'hybrid',
    preview: '🌐',
    previewImage: 'https://www.arcgis.com/sharing/rest/content/items/ea3befe305494bb5b2acd77e1b3135dc/info/thumbnail/thumbnail1702501674605.jpeg'
  },
  {
    id: 'topo',
    name: 'Topographic',
    arcgisBasemap: 'topo-vector',
    preview: '🏔️',
    previewImage: 'https://www.arcgis.com/sharing/rest/content/items/7dc6cea0b1764a1f9af2e679f642f0f5/info/thumbnail/thumbnail1702503463880.jpeg'
  },
  {
    id: 'osm',
    name: 'OpenStreetMap',
    arcgisBasemap: 'osm',
    preview: '🌍',
    previewImage: 'https://www.arcgis.com/sharing/rest/content/items/f81bc478e12c4f1691d0d7ab6361f5a6/info/thumbnail/osm_702.png'
  }
];

interface BaseMapSelectorProps {
  selectedMap: string;
  onMapChange: (mapId: string) => void;
  className?: string;
  variant?: 'default' | 'panel';
}

export function BaseMapSelector({ selectedMap, onMapChange, className, variant = 'default' }: BaseMapSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentMap = arcgisBaseMaps.find(m => m.id === selectedMap) || arcgisBaseMaps[0];

  // Panel variant - shows grid of image previews
  if (variant === 'panel') {
    return (
      <div className={cn("", className)}>
        <div className="grid grid-cols-3 gap-2">
          {arcgisBaseMaps.map((map) => (
            <button
              key={map.id}
              onClick={() => onMapChange(map.id)}
              className={cn(
                "relative group rounded-lg overflow-hidden border-2 transition-all",
                selectedMap === map.id
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
                {selectedMap === map.id && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-primary-foreground" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Default variant - dropdown button
  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-card rounded-xl shadow-lg border border-border px-3 py-2.5 hover:bg-secondary transition-colors"
      >
        <Map className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">{currentMap.name}</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[var(--z-popover-backdrop)]" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute bottom-full mb-2 left-0 bg-card/95 backdrop-blur-xl rounded-xl shadow-xl border border-border overflow-hidden z-[var(--z-popover)] animate-fade-in p-3 w-[280px]">
            <p className="text-xs text-muted-foreground font-medium px-1 pb-2 uppercase tracking-wide">
              Select Base Map
            </p>
            <div className="grid grid-cols-3 gap-2">
              {arcgisBaseMaps.map((map) => (
                <button
                  key={map.id}
                  onClick={() => {
                    onMapChange(map.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "relative group rounded-lg overflow-hidden border-2 transition-all",
                    selectedMap === map.id
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
                    {selectedMap === map.id && (
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
  );
}
