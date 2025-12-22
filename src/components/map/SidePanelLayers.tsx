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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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

  const handleSelectAll = (theme: ThemeGroup) => {
    if (onSelectAll) {
      onSelectAll(theme.id);
    } else {
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
    <TooltipProvider delayDuration={300}>
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
              {/* Theme Header - 2 Row Structure */}
              <div className="p-3 sm:p-4">
                {/* Row 1: Section Identity */}
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleGroup(theme.id)}
                    className={cn(
                      "flex items-center gap-3 transition-all flex-1 min-w-0",
                      "hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 rounded-md"
                    )}
                    aria-expanded={isExpanded}
                    aria-label={`${theme.name} section`}
                  >
                    {/* Fixed 40x40 icon container */}
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                        isHealthcare 
                          ? "bg-primary/20 text-primary" 
                          : "bg-education/20 text-education"
                      )}
                    >
                      {getThemeIcon(theme.icon)}
                    </div>
                    {/* Title - single line */}
                    <span className="text-[15px] sm:text-base font-semibold text-foreground leading-tight line-clamp-1">
                      {theme.name}
                    </span>
                  </button>
                  
                  {/* Chevron only - top right */}
                  <button
                    onClick={() => toggleGroup(theme.id)}
                    className="p-2 -mr-1 rounded-md hover:bg-white/20 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0"
                    aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
                  >
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 text-muted-foreground transition-transform duration-200",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </button>
                </div>

                {/* Subtle divider */}
                <div className="h-px bg-border/40 my-3" />

                {/* Row 2: Status & Actions */}
                <div className="flex items-center justify-between gap-3 min-h-[32px]">
                  {/* Left: Status text - single line */}
                  <span className="text-[13px] text-muted-foreground whitespace-nowrap">
                    {visibleCount} layer{visibleCount !== 1 ? 's' : ''} visible
                  </span>

                  {/* Right: Actions inline */}
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    {/* Desktop/Tablet inline actions */}
                    <div className="hidden sm:flex items-center">
                      <button
                        onClick={() => handleSelectAll(theme)}
                        disabled={allVisible}
                        className={cn(
                          "text-[13px] px-2.5 py-1.5 rounded-md transition-colors font-medium whitespace-nowrap",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                          allVisible
                            ? "text-muted-foreground/40 cursor-not-allowed"
                            : "text-primary hover:bg-primary/10 active:bg-primary/15"
                        )}
                        aria-label={`Select all ${theme.name} layers`}
                      >
                        Select All
                      </button>
                      <span className="text-border/60 mx-0.5">·</span>
                      <button
                        onClick={() => handleClearAll(theme)}
                        disabled={noneVisible}
                        className={cn(
                          "text-[13px] px-2.5 py-1.5 rounded-md transition-colors font-medium whitespace-nowrap",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                          noneVisible
                            ? "text-muted-foreground/40 cursor-not-allowed"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground active:bg-muted/70"
                        )}
                        aria-label={`Clear all ${theme.name} layers`}
                      >
                        Clear All
                      </button>
                    </div>

                    {/* Mobile dropdown menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button 
                          className="sm:hidden p-2 rounded-md hover:bg-white/20 dark:hover:bg-white/10 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          aria-label="Layer actions"
                        >
                          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 bg-card border border-border shadow-lg z-50">
                        <DropdownMenuItem 
                          onClick={() => handleSelectAll(theme)}
                          disabled={allVisible}
                          className="gap-2 min-h-[44px]"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Select All
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleClearAll(theme)}
                          disabled={noneVisible}
                          className="gap-2 min-h-[44px]"
                        >
                          <XCircle className="w-4 h-4" />
                          Clear All
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              {/* Layers List */}
              <div
                className={cn(
                  "overflow-hidden transition-all duration-200 motion-reduce:transition-none",
                  isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div className="px-2 sm:px-3 pb-3 space-y-2">
                  {theme.layers.map((layer) => {
                    const isHighlighted = highlightedLayerId === layer.id;
                    const LayerIcon = iconMap[layer.icon];
                    
                    return (
                      <Tooltip key={layer.id}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => onLayerToggle(theme.id, layer.id)}
                            className={cn(
                              "w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-3 min-h-[60px] rounded-lg text-left group",
                              "transition-all duration-150 motion-reduce:transition-none",
                              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                              isHighlighted && "ring-2 ring-primary ring-offset-1 ring-offset-background",
                              layer.visible
                                ? "bg-primary/15 border border-primary/30 shadow-sm"
                                : "bg-white/20 dark:bg-white/5 border border-transparent hover:bg-white/40 dark:hover:bg-white/10"
                            )}
                            aria-pressed={layer.visible}
                            aria-label={`${layer.name}: ${layer.visible ? 'visible' : 'hidden'}`}
                          >
                            {/* Left: Layer Icon - Fixed width with meaningful icon */}
                            <div
                              className={cn(
                                "w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 rounded-md flex items-center justify-center",
                                "transition-all duration-150 motion-reduce:transition-none",
                                layer.visible 
                                  ? "opacity-100 scale-100" 
                                  : "opacity-70 scale-[0.96] group-hover:opacity-90 group-hover:scale-[0.98]"
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
                            <div className="flex-1 min-w-0 pr-1">
                              <span className="block text-sm font-medium text-foreground truncate">
                                {layer.name}
                              </span>
                              <p className="text-xs text-muted-foreground truncate hidden sm:block">
                                {layer.description}
                              </p>
                            </div>
                            
                            {/* Right: Action Icon - Fixed width, touch-friendly */}
                            <div className={cn(
                              "flex-shrink-0 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-md",
                              "transition-all duration-150 motion-reduce:transition-none",
                              layer.visible 
                                ? "bg-primary/20 text-primary shadow-sm" 
                                : "bg-muted/30 text-muted-foreground group-hover:bg-muted/50"
                            )}>
                              <div className={cn(
                                "transition-opacity duration-150 motion-reduce:transition-none",
                                layer.visible ? "opacity-100" : "opacity-60 group-hover:opacity-80"
                              )}>
                                {layer.visible ? (
                                  <Eye className="w-4 h-4" />
                                ) : (
                                  <EyeOff className="w-4 h-4" />
                                )}
                              </div>
                            </div>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="text-xs max-w-[200px]">
                          <p className="font-medium">{layer.name}</p>
                          <p className="text-muted-foreground">{layer.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
