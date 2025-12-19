import { Heart, GraduationCap, Building2, Stethoscope, Pill, HeartPulse, Siren, Accessibility, Truck, Microscope, School, Building, BookOpen, Baby, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeGroup, MapLayer } from '@/types/map';

interface DynamicLegendProps {
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

export function DynamicLegend({ layers, className }: DynamicLegendProps) {
  const visibleLayers = layers.flatMap(theme =>
    theme.layers
      .filter(layer => layer.visible)
      .map(layer => ({ ...layer, themeName: theme.name, themeColor: theme.colorClass }))
  );

  if (visibleLayers.length === 0) {
    return (
      <div className={cn("bg-card rounded-xl border border-border p-4 shadow-sm", className)}>
        <h3 className="font-heading font-semibold text-foreground text-sm mb-3">Legend</h3>
        <p className="text-sm text-muted-foreground">No layers visible. Toggle layers above to see them on the map.</p>
      </div>
    );
  }

  return (
    <div className={cn("bg-card rounded-xl border border-border overflow-hidden shadow-sm", className)}>
      <div className="p-4 border-b border-border">
        <h3 className="font-heading font-semibold text-foreground text-sm">Legend</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{visibleLayers.length} layers visible</p>
      </div>
      <div className="p-3 max-h-64 overflow-y-auto">
        <div className="space-y-2">
          {visibleLayers.map((layer) => {
            const LayerIcon = getIcon(layer.icon);
            return (
              <div
                key={layer.id}
                className="flex items-center gap-3 p-2 rounded-lg bg-secondary/40"
              >
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: layer.color }}
                >
                  <LayerIcon className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{layer.name}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
