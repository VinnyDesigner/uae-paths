import { useState } from 'react';
import { Map, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type BaseMapStyle = 'default' | 'original' | 'grey' | 'grey-lite' | 'night' | 'orthophoto' | 'land-lot';

interface BaseMapOption {
  id: BaseMapStyle;
  name: string;
  url: string;
  thumbnail: string;
}

const baseMapOptions: BaseMapOption[] = [
  {
    id: 'default',
    name: 'Default',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    thumbnail: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)'
  },
  {
    id: 'original',
    name: 'Original',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    thumbnail: 'linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%)'
  },
  {
    id: 'grey',
    name: 'Grey',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    thumbnail: 'linear-gradient(135deg, #9e9e9e 0%, #757575 100%)'
  },
  {
    id: 'grey-lite',
    name: 'Grey Lite',
    url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}{r}.png',
    thumbnail: 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)'
  },
  {
    id: 'night',
    name: 'Night',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    thumbnail: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
  },
  {
    id: 'orthophoto',
    name: 'Orthophoto',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/{z}/{y}/{x}',
    thumbnail: 'linear-gradient(135deg, #4a7c59 0%, #2d5a27 100%)'
  },
  {
    id: 'land-lot',
    name: 'Land Lot',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    thumbnail: 'linear-gradient(135deg, #e8d5b7 0%, #d4a574 100%)'
  }
];

interface BaseMapSelectorProps {
  selectedStyle: BaseMapStyle;
  onStyleChange: (style: BaseMapStyle, url: string) => void;
  className?: string;
}

export function BaseMapSelector({ selectedStyle, onStyleChange, className }: BaseMapSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedOption = baseMapOptions.find(opt => opt.id === selectedStyle) || baseMapOptions[0];

  return (
    <div className={cn("absolute bottom-4 left-4 z-[1000]", className)}>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-card rounded-xl shadow-lg border border-border px-3 py-2 hover:bg-secondary transition-colors"
        >
          <Map className="w-4 h-4 text-foreground" />
          <span className="text-sm font-medium text-foreground">{selectedOption.name}</span>
          <ChevronDown className={cn(
            "w-4 h-4 text-muted-foreground transition-transform",
            isOpen && "rotate-180"
          )} />
        </button>

        {isOpen && (
          <div className="absolute bottom-full left-0 mb-2 bg-card rounded-xl shadow-xl border border-border overflow-hidden animate-fade-in min-w-[200px]">
            <div className="p-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 py-1.5">
                Base Map
              </p>
              <div className="space-y-1">
                {baseMapOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      onStyleChange(option.id, option.url);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-colors",
                      selectedStyle === option.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary text-foreground"
                    )}
                  >
                    <div
                      className="w-8 h-8 rounded-lg border border-border flex-shrink-0"
                      style={{ background: option.thumbnail }}
                    />
                    <span className="text-sm font-medium">{option.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { baseMapOptions };
