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
  EyeOff,
  CheckCircle2,
  XCircle,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeGroup } from '@/types/map';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SidePanelLayersProps {
  layers: ThemeGroup[];
  onLayerToggle: (themeId: number, layerId: number) => void;
  onSelectAll?: (themeId: number) => void;
  onClearAll?: (themeId: number) => void;
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

export function SidePanelLayers({ 
  layers, 
  onLayerToggle, 
  onSelectAll,
  onClearAll,
  highlightedLayerId, 
  className 
}: SidePanelLayersProps) {
  const [expandedGroups, setExpandedGroups] = useState<number[]>([350, 300]);
  const { toast } = useToast();

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

  const getAllLayersVisible = (theme: ThemeGroup) => {
    return theme.layers.every(l => l.visible);
  };

  const getNoLayersVisible = (theme: ThemeGroup) => {
    return theme.layers.every(l => !l.visible);
  };

  const getThemeIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
  };

  const getLayerIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
  };

  const handleSelectAll = (theme: ThemeGroup) => {
    if (onSelectAll) {
      onSelectAll(theme.id);
    } else {
      // Fallback: toggle all layers on
      theme.layers.forEach(layer => {
        if (!layer.visible) {
          onLayerToggle(theme.id, layer.id);
        }
      });
    }
    toast({
      description: `${theme.name} layers enabled (${theme.layers.length})`,
      duration: 1500,
    });
  };

  const handleClearAll = (theme: ThemeGroup) => {
    if (onClearAll) {
      onClearAll(theme.id);
    } else {
      // Fallback: toggle all layers off
      theme.layers.forEach(layer => {
        if (layer.visible) {
          onLayerToggle(theme.id, layer.id);
        }
      });
    }
    toast({
      description: `${theme.name} layers cleared`,
      duration: 1500,
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      {layers.map((theme) => {
        const isExpanded = expandedGroups.includes(theme.id);
        const visibleCount = getVisibleLayerCount(theme);
        const allVisible = getAllLayersVisible(theme);
        const noneVisible = getNoLayersVisible(theme);
        const isHealthcare = theme.colorClass === 'healthcare';

        return (
          <div
            key={theme.id}
            className="bg-white/30 dark:bg-white/5 rounded-xl border border-white/20 dark:border-white/10 overflow-hidden"
          >
            {/* Theme Header */}
            <div className="flex items-center justify-between px-4 py-3">
              <button
                onClick={() => toggleGroup(theme.id)}
                className={cn(
                  "flex items-center gap-3 transition-all flex-1",
                  "hover:opacity-80"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    isHealthcare 
                      ? "bg-primary/20 text-primary" 
                      : "bg-education/20 text-education"
                  )}
                >
                  {getThemeIcon(theme.icon)}
                </div>
                <div className="text-left min-w-0">
                  <h4 className="text-sm font-semibold text-foreground truncate">{theme.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {visibleCount} layer{visibleCount !== 1 ? 's' : ''} visible
                  </p>
                </div>
              </button>
              
              {/* Actions - Desktop: inline buttons, Mobile: dropdown */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Desktop inline actions */}
                <div className="hidden sm:flex items-center gap-1">
                  <button
                    onClick={() => handleSelectAll(theme)}
                    disabled={allVisible}
                    className={cn(
                      "text-xs px-2 py-1 rounded-md transition-all min-h-[32px]",
                      allVisible
                        ? "text-muted-foreground/50 cursor-not-allowed"
                        : "text-primary hover:bg-primary/10"
                    )}
                  >
                    Select All
                  </button>
                  <button
                    onClick={() => handleClearAll(theme)}
                    disabled={noneVisible}
                    className={cn(
                      "text-xs px-2 py-1 rounded-md transition-all min-h-[32px]",
                      noneVisible
                        ? "text-muted-foreground/50 cursor-not-allowed"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    Clear All
                  </button>
                </div>

                {/* Mobile dropdown menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="sm:hidden p-2 rounded-md hover:bg-white/20 dark:hover:bg-white/10 min-h-[40px] min-w-[40px] flex items-center justify-center">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem 
                      onClick={() => handleSelectAll(theme)}
                      disabled={allVisible}
                      className="gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Select All
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleClearAll(theme)}
                      disabled={noneVisible}
                      className="gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Clear All
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <button
                  onClick={() => toggleGroup(theme.id)}
                  className="p-1 rounded-md hover:bg-white/20 dark:hover:bg-white/10"
                >
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-muted-foreground transition-transform duration-200",
                      isExpanded && "rotate-180"
                    )}
                  />
                </button>
              </div>
            </div>

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
                  const LayerIcon = iconMap[layer.icon];
                  
                  return (
                    <button
                      key={layer.id}
                      onClick={() => onLayerToggle(theme.id, layer.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-3 min-h-[60px] rounded-lg text-left group",
                        "transition-all duration-150 motion-reduce:transition-none",
                        isHighlighted && "ring-2 ring-primary ring-offset-1 ring-offset-background",
                        layer.visible
                          ? "bg-primary/15 border border-primary/30"
                          : "bg-white/20 dark:bg-white/5 border border-transparent hover:bg-white/40 dark:hover:bg-white/10"
                      )}
                    >
                      {/* Left: Layer Icon - Fixed width with meaningful icon */}
                      <div
                        className={cn(
                          "w-9 h-9 flex-shrink-0 rounded-md flex items-center justify-center",
                          "transition-all duration-150 motion-reduce:transition-none",
                          layer.visible 
                            ? "opacity-100 scale-100" 
                            : "opacity-80 scale-[0.96]"
                        )}
                        style={{ backgroundColor: layer.color + '20' }}
                      >
                        <div 
                          className={cn(
                            "transition-all duration-150 motion-reduce:transition-none",
                            layer.visible ? "opacity-100" : "opacity-70"
                          )}
                          style={{ color: layer.color }}
                        >
                          {LayerIcon ? (
                            <LayerIcon className="w-4 h-4" />
                          ) : (
                            <div
                              className="w-4 h-4 rounded-sm"
                              style={{ backgroundColor: layer.color }}
                            />
                          )}
                        </div>
                      </div>
                      
                      {/* Center: Text Container - Flexible, truncates */}
                      <div className="flex-1 min-w-0">
                        <span className="block text-sm font-medium text-foreground truncate">
                          {layer.name}
                        </span>
                        <p className="text-xs text-muted-foreground truncate sm:block hidden">
                          {layer.description}
                        </p>
                      </div>
                      
                      {/* Right: Action Icon - Fixed width, touch-friendly */}
                      <div className={cn(
                        "flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-md",
                        "transition-all duration-150 motion-reduce:transition-none",
                        layer.visible 
                          ? "bg-primary/20 text-primary" 
                          : "bg-muted/50 text-muted-foreground group-hover:bg-muted"
                      )}>
                        <div className={cn(
                          "transition-opacity duration-150 motion-reduce:transition-none",
                          layer.visible ? "opacity-100" : "opacity-70"
                        )}>
                          {layer.visible ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </div>
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
