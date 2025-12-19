import { useState } from 'react';
import { List, ChevronDown, X } from 'lucide-react';
import { Heart, GraduationCap, Building2, Stethoscope, Pill, HeartPulse, Siren, Accessibility, Truck, Microscope, School, Building, BookOpen, Baby, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeGroup } from '@/types/map';

interface MapLegendProps {
  layers: ThemeGroup[];
  className?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart, GraduationCap, Building2, Stethoscope, Pill, HeartPulse, 
  Siren, Accessibility, Truck, Microscope, School, Building, BookOpen, Baby, Users
};

function getIcon(iconName: string) {
  return iconMap[iconName] || Building2;
}

export function MapLegend({ layers, className }: MapLegendProps) {
  const [isOpen, setIsOpen] = useState(true);
  
  const visibleLayers = layers.flatMap(theme =>
    theme.layers
      .filter(layer => layer.visible)
      .map(layer => ({ ...layer, themeName: theme.name, themeColor: theme.colorClass }))
  );

  if (visibleLayers.length === 0) {
    return null;
  }

  return (
    <div className={cn("absolute bottom-4 right-4 z-[1000]", className)}>
      {isOpen ? (
        <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden animate-fade-in min-w-[220px] max-w-[280px]">
          <div className="flex items-center justify-between p-3 border-b border-border bg-secondary/30">
            <div className="flex items-center gap-2">
              <List className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Legend</h3>
              <span className="text-xs text-muted-foreground">({visibleLayers.length})</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md hover:bg-secondary transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <div className="p-2 max-h-64 overflow-y-auto">
            <div className="space-y-1">
              {visibleLayers.map((layer) => {
                const LayerIcon = getIcon(layer.icon);
                const isEducation = layer.themeColor === 'education';
                return (
                  <div
                    key={layer.id}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0",
                        isEducation ? "bg-education" : ""
                      )}
                      style={{ backgroundColor: isEducation ? undefined : layer.color }}
                    >
                      <LayerIcon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-foreground truncate">{layer.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-card rounded-xl shadow-lg border border-border px-3 py-2 hover:bg-secondary transition-colors"
        >
          <List className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Legend</span>
          <span className="text-xs text-muted-foreground">({visibleLayers.length})</span>
        </button>
      )}
    </div>
  );
}
