import { useState } from 'react';
import { Map, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BaseMapOption {
  id: string;
  name: string;
  url: string;
  preview: string;
}

export const baseMaps: BaseMapOption[] = [
  {
    id: 'default',
    name: 'Default',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    preview: '🗺️'
  },
  {
    id: 'original',
    name: 'Original',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    preview: '🌍'
  },
  {
    id: 'grey',
    name: 'Grey',
    url: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
    preview: '⬜'
  },
  {
    id: 'grey-lite',
    name: 'Grey Lite',
    url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
    preview: '◻️'
  },
  {
    id: 'night',
    name: 'Night',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    preview: '🌙'
  },
  {
    id: 'satellite',
    name: 'Orthophoto',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    preview: '🛰️'
  },
  {
    id: 'terrain',
    name: 'Land Lot',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    preview: '🏔️'
  }
];

interface BaseMapSelectorProps {
  selectedMap: string;
  onMapChange: (mapId: string) => void;
  className?: string;
}

export function BaseMapSelector({ selectedMap, onMapChange, className }: BaseMapSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentMap = baseMaps.find(m => m.id === selectedMap) || baseMaps[0];

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-card rounded-xl shadow-lg border border-border px-3 py-2.5 hover:bg-secondary transition-colors"
      >
        <Map className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">{currentMap.name}</span>
        <ChevronDown className={cn(
          "w-4 h-4 text-muted-foreground transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[999]" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute bottom-full mb-2 left-0 bg-card rounded-xl shadow-xl border border-border overflow-hidden z-[1000] animate-fade-in min-w-[180px]">
            <div className="p-2">
              <p className="text-xs text-muted-foreground font-medium px-2 py-1.5 uppercase tracking-wide">
                Base Map
              </p>
              {baseMaps.map((map) => (
                <button
                  key={map.id}
                  onClick={() => {
                    onMapChange(map.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all",
                    selectedMap === map.id
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary"
                  )}
                >
                  <span className="text-lg">{map.preview}</span>
                  <span className="text-sm font-medium">{map.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
