import { useState } from 'react';
import { 
  ChevronDown, 
  Heart, 
  GraduationCap,
  Building2,
  Stethoscope,
  Microscope,
  Pill,
  HeartPulse,
  Siren,
  Accessibility,
  Truck,
  School,
  Building,
  BookOpen,
  Baby,
  Users,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeGroup } from '@/types/map';

interface SidePanelLayersProps {
  layers: ThemeGroup[];
  onLayerToggle: (themeId: number, layerId: number) => void;
  highlightedLayerId?: number | null;
  className?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart,
  GraduationCap,
  Building2,
  Stethoscope,
  Microscope,
  Pill,
  HeartPulse,
  Siren,
  Accessibility,
  Truck,
  School,
  Building,
  BookOpen,
  Baby,
  Users,
};

export function SidePanelLayers({ layers, onLayerToggle, highlightedLayerId, className }: SidePanelLayersProps) {
  const [expandedGroups, setExpandedGroups] = useState<number[]>([350, 300]); // Both expanded by default

  const toggleGroup = (groupId: number) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const getVisibleLayerCount = (theme: ThemeGroup) => {
    return theme.layers.filter(l => l.visible).length;
  };

  const getThemeIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
  };

  const getLayerIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
  };

  return (
    <div className={cn("space-y-3", className)}>
      {layers.map((theme) => {
        const isExpanded = expandedGroups.includes(theme.id);
        const visibleCount = getVisibleLayerCount(theme);
        const isHealthcare = theme.colorClass === 'healthcare';

        return (
          <div
            key={theme.id}
            className="bg-white/30 dark:bg-white/5 rounded-xl border border-white/20 dark:border-white/10 overflow-hidden"
          >
            {/* Theme Header */}
            <button
              onClick={() => toggleGroup(theme.id)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 transition-all",
                "hover:bg-white/20 dark:hover:bg-white/10"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    isHealthcare 
                      ? "bg-primary/20 text-primary" 
                      : "bg-education/20 text-education"
                  )}
                >
                  {getThemeIcon(theme.icon)}
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-semibold text-foreground">{theme.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {visibleCount} layer{visibleCount !== 1 ? 's' : ''} visible
                  </p>
                </div>
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform duration-200",
                  isExpanded && "rotate-180"
                )}
              />
            </button>

            {/* Layers List */}
            <div
              className={cn(
                "overflow-hidden transition-all duration-200",
                isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className="px-3 pb-3 space-y-2">
                {theme.layers.map((layer) => {
                  const isHighlighted = highlightedLayerId === layer.id;
                  return (
                    <button
                      key={layer.id}
                      onClick={() => onLayerToggle(theme.id, layer.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-3 min-h-[56px] rounded-lg transition-all text-left group",
                        isHighlighted && "ring-2 ring-primary ring-offset-1 ring-offset-background",
                        layer.visible
                          ? "bg-primary/15 border border-primary/30"
                          : "bg-white/20 dark:bg-white/5 border border-transparent hover:bg-white/40 dark:hover:bg-white/10"
                      )}
                    >
                      {/* Left: Layer Icon - Fixed width */}
                      <div
                        className="w-8 h-8 flex-shrink-0 rounded-md flex items-center justify-center"
                        style={{ backgroundColor: layer.color + '30' }}
                      >
                        <div
                          className="w-4 h-4 rounded-sm"
                          style={{ backgroundColor: layer.color }}
                        />
                      </div>
                      
                      {/* Center: Text Container - Flexible, truncates */}
                      <div className="flex-1 min-w-0">
                        <span className="block text-sm font-medium text-foreground truncate">
                          {layer.name}
                        </span>
                        <p className="text-xs text-muted-foreground truncate">
                          {layer.description}
                        </p>
                      </div>
                      
                      {/* Right: Action Icon - Fixed width */}
                      <div className={cn(
                        "flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-md transition-all",
                        layer.visible 
                          ? "bg-primary/20 text-primary" 
                          : "bg-muted/50 text-muted-foreground group-hover:bg-muted"
                      )}>
                        {layer.visible ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
