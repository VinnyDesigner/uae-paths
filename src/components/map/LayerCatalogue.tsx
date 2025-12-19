import { useState } from 'react';
import { ChevronDown, Eye, EyeOff, Heart, GraduationCap, Building2, Stethoscope, Pill, HeartPulse, Siren, Accessibility, Truck, Microscope, School, Building, BookOpen, Baby, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeGroup, MapLayer } from '@/types/map';
import { themeGroups } from '@/data/layers';
import { Switch } from '@/components/ui/switch';

interface LayerCatalogueProps {
  layers: ThemeGroup[];
  onLayerToggle: (themeId: number, layerId: number) => void;
  className?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart, GraduationCap, Building2, Stethoscope, Pill, HeartPulse, 
  Siren, Accessibility, Truck, Microscope, School, Building, BookOpen, Baby, Users
};

function getIcon(iconName: string) {
  return iconMap[iconName] || Building2;
}

export function LayerCatalogue({ layers, onLayerToggle, className }: LayerCatalogueProps) {
  const [expandedThemes, setExpandedThemes] = useState<number[]>([350, 300]); // Both expanded by default

  const toggleTheme = (themeId: number) => {
    setExpandedThemes(prev =>
      prev.includes(themeId)
        ? prev.filter(id => id !== themeId)
        : [...prev, themeId]
    );
  };

  const getVisibleCount = (theme: ThemeGroup) => {
    return theme.layers.filter(l => l.visible).length;
  };

  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="font-heading font-semibold text-foreground flex items-center gap-2 px-1">
        <span>Map Layers</span>
        <span className="text-xs font-normal text-muted-foreground">
          ({layers.flatMap(t => t.layers).filter(l => l.visible).length} active)
        </span>
      </h3>

      {layers.map((theme) => {
        const isExpanded = expandedThemes.includes(theme.id);
        const ThemeIcon = getIcon(theme.icon);
        const visibleCount = getVisibleCount(theme);
        const isHealthcare = theme.colorClass === 'healthcare';

        return (
          <div
            key={theme.id}
            className="bg-card rounded-xl border border-border overflow-hidden shadow-sm"
          >
            {/* Theme Header */}
            <button
              onClick={() => toggleTheme(theme.id)}
              className={cn(
                "w-full flex items-center gap-3 p-4 transition-colors text-left",
                isExpanded ? "border-b border-border" : "",
                "hover:bg-secondary/50"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                  isHealthcare ? "bg-healthcare-light" : "bg-education-light"
                )}
              >
                <ThemeIcon
                  className={cn(
                    "w-5 h-5",
                    isHealthcare ? "text-healthcare" : "text-education"
                  )}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground text-sm">{theme.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {visibleCount} of {theme.layers.length} visible
                </p>
              </div>
              <ChevronDown
                className={cn(
                  "w-5 h-5 text-muted-foreground transition-transform duration-200",
                  isExpanded && "rotate-180"
                )}
              />
            </button>

            {/* Layers List */}
            {isExpanded && (
              <div className="p-2 space-y-1 animate-fade-in">
                {theme.layers.map((layer) => {
                  const LayerIcon = getIcon(layer.icon);
                  return (
                    <div
                      key={layer.id}
                      className={cn(
                        "flex items-center gap-3 p-2.5 rounded-lg transition-all",
                        layer.visible
                          ? "bg-secondary/70"
                          : "hover:bg-secondary/40"
                      )}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: layer.color + '20' }}
                      >
                        <LayerIcon
                          className="w-4 h-4"
                          style={{ color: layer.color }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {layer.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {layer.description}
                        </p>
                      </div>
                      <Switch
                        checked={layer.visible}
                        onCheckedChange={() => onLayerToggle(theme.id, layer.id)}
                        className="flex-shrink-0"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
