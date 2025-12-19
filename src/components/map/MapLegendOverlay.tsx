import { useState } from 'react';
import { Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { Heart, GraduationCap, Building2, Stethoscope, Pill, HeartPulse, Siren, Accessibility, Truck, Microscope, School, Building, BookOpen, Baby, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeGroup } from '@/types/map';

interface MapLegendOverlayProps {
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

export function MapLegendOverlay({ layers, className }: MapLegendOverlayProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const visibleLayers = layers.flatMap(theme =>
    theme.layers
      .filter(layer => layer.visible)
      .map(layer => ({ ...layer, themeName: theme.name, themeColor: theme.colorClass }))
  );

  if (visibleLayers.length === 0) {
    return null;
  }

  return (
    <div className={cn("bg-card/95 backdrop-blur-sm rounded-xl shadow-lg border border-border overflow-hidden", className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-secondary/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Legend</span>
          <span className="text-xs text-muted-foreground bg-secondary rounded-full px-2 py-0.5">
            {visibleLayers.length}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="px-3 pb-3 max-h-48 overflow-y-auto">
          <div className="space-y-1.5">
            {visibleLayers.map((layer) => {
              const LayerIcon = getIcon(layer.icon);
              return (
                <div
                  key={layer.id}
                  className="flex items-center gap-2.5 py-1.5"
                >
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: layer.color }}
                  >
                    <LayerIcon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-foreground truncate">{layer.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
