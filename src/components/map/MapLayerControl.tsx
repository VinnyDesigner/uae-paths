import { useState } from 'react';
import { Layers, ChevronDown, Eye, EyeOff, Heart, GraduationCap, Building2, Stethoscope, Pill, HeartPulse, Siren, Accessibility, Truck, Microscope, School, Building, BookOpen, Baby, Users, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeGroup } from '@/types/map';
import { Switch } from '@/components/ui/switch';

interface MapLayerControlProps {
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

export function MapLayerControl({ layers, onLayerToggle, className }: MapLayerControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedThemes, setExpandedThemes] = useState<number[]>([350, 300]);

  const toggleTheme = (themeId: number) => {
    setExpandedThemes(prev =>
      prev.includes(themeId)
        ? prev.filter(id => id !== themeId)
        : [...prev, themeId]
    );
  };

  const activeLayerCount = layers.flatMap(t => t.layers).filter(l => l.visible).length;

  return (
    <div className={cn("absolute bottom-24 right-4 z-20", className)}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 bg-card rounded-xl shadow-lg border border-border px-4 py-3 hover:bg-secondary transition-colors",
          isOpen && "bg-secondary"
        )}
      >
        <Layers className="w-5 h-5 text-primary" />
        <span className="text-sm font-medium text-foreground">Layers</span>
        {activeLayerCount > 0 && (
          <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
            {activeLayerCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-80 bg-card rounded-xl shadow-xl border border-border overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-heading font-semibold text-foreground">Map Layers</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Layer List */}
          <div className="max-h-96 overflow-y-auto p-3 space-y-2">
            {layers.map((theme) => {
              const isExpanded = expandedThemes.includes(theme.id);
              const ThemeIcon = getIcon(theme.icon);
              const visibleCount = theme.layers.filter(l => l.visible).length;
              const isHealthcare = theme.colorClass === 'healthcare';

              return (
                <div key={theme.id} className="bg-secondary/30 rounded-lg overflow-hidden">
                  {/* Theme Header */}
                  <button
                    onClick={() => toggleTheme(theme.id)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-secondary/50 transition-colors"
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        isHealthcare ? "bg-healthcare-light" : "bg-education-light"
                      )}
                    >
                      <ThemeIcon
                        className={cn(
                          "w-4 h-4",
                          isHealthcare ? "text-healthcare" : "text-education"
                        )}
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-sm text-foreground">{theme.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {visibleCount}/{theme.layers.length} active
                      </p>
                    </div>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-muted-foreground transition-transform",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </button>

                  {/* Layers */}
                  {isExpanded && (
                    <div className="px-3 pb-3 space-y-1">
                      {theme.layers.map((layer) => {
                        const LayerIcon = getIcon(layer.icon);
                        return (
                          <div
                            key={layer.id}
                            className={cn(
                              "flex items-center gap-2 p-2 rounded-lg transition-all",
                              layer.visible ? "bg-card" : "hover:bg-secondary/50"
                            )}
                          >
                            <div
                              className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: layer.color + '20' }}
                            >
                              <LayerIcon
                                className="w-3.5 h-3.5"
                                style={{ color: layer.color }}
                              />
                            </div>
                            <span className="flex-1 text-sm text-foreground truncate">
                              {layer.name}
                            </span>
                            <Switch
                              checked={layer.visible}
                              onCheckedChange={() => onLayerToggle(theme.id, layer.id)}
                              className="scale-90"
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
        </div>
      )}
    </div>
  );
}
