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
  Check,
  Circle,
  CheckCircle2,
  XCircle,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeGroup } from '@/types/map';
import { useToast } from '@/hooks/use-toast';
import { getCategoryColor } from '@/lib/mapColors';
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
    return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
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
      <div className={cn("space-y-5", className)}>
        {layers.map((theme) => {
          const isExpanded = expandedGroups.includes(theme.id);
          const visibleCount = getVisibleLayerCount(theme);
          const totalCount = theme.layers.length;
          const allVisible = getAllLayersVisible(theme);
          const noneVisible = getNoLayersVisible(theme);
          const isHealthcare = theme.colorClass === 'healthcare';

          return (
            <div
              key={theme.id}
              className="bg-white/40 dark:bg-white/5 rounded-2xl border border-white/30 dark:border-white/10 overflow-hidden shadow-sm"
            >
              {/* Section Header - 2 Row Structure */}
              <div 
                className={cn(
                  "p-4",
                  isHealthcare 
                    ? "bg-gradient-to-r from-primary/5 to-transparent" 
                    : "bg-gradient-to-r from-education/5 to-transparent"
                )}
              >
                {/* Row 1: Section Identity */}
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={() => toggleGroup(theme.id)}
                    className={cn(
                      "flex items-center gap-3 transition-all flex-1 min-w-0",
                      "hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 rounded-lg"
                    )}
                    aria-expanded={isExpanded}
                    aria-label={`${theme.name} section`}
                  >
                    {/* Fixed 44x44 icon container with tinted background */}
                    <div
                      className={cn(
                        "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm",
                        isHealthcare 
                          ? "bg-primary/15 text-primary" 
                          : "bg-education/15 text-education"
                      )}
                    >
                      {getThemeIcon(theme.icon)}
                    </div>
                    {/* Title */}
                    <span className="text-base font-semibold text-foreground leading-tight">
                      {theme.name}
                    </span>
                  </button>
                  
                  {/* Chevron - Animated rotation */}
                  <button
                    onClick={() => toggleGroup(theme.id)}
                    className="p-2.5 -mr-1 rounded-lg hover:bg-white/30 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0 transition-colors"
                    aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
                  >
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 text-muted-foreground transition-transform duration-200 ease-out",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </button>
                </div>

                {/* Subtle divider */}
                <div className="h-px bg-border/30 mt-3 mb-2.5" />

                {/* Row 2: Status & Actions - Single baseline row */}
                <div className="flex items-center h-8">
                  {/* Left: Status text */}
                  <span className="text-[13px] leading-8 text-muted-foreground">
                    <span className="font-medium text-foreground">{visibleCount}</span>
                    <span className="mx-0.5">of</span>
                    <span>{totalCount}</span>
                    <span className="ml-1">visible</span>
                  </span>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Right: Actions - Same baseline */}
                  {/* Desktop/Tablet inline actions */}
                  <div className="hidden sm:flex items-center h-8">
                    <button
                      onClick={() => handleSelectAll(theme)}
                      disabled={allVisible}
                      className={cn(
                        "text-[13px] leading-8 px-2.5 rounded-md transition-all font-medium",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                        allVisible
                          ? "text-muted-foreground/40 cursor-not-allowed"
                          : "text-primary hover:bg-primary/10 active:scale-95"
                      )}
                      aria-label={`Select all ${theme.name} layers`}
                    >
                      Select All
                    </button>
                    <span className="text-border/40 text-[13px] leading-8 mx-1">|</span>
                    <button
                      onClick={() => handleClearAll(theme)}
                      disabled={noneVisible}
                      className={cn(
                        "text-[13px] leading-8 px-2.5 rounded-md transition-all font-medium",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                        noneVisible
                          ? "text-muted-foreground/40 cursor-not-allowed"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground active:scale-95"
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
                        className="sm:hidden p-2 rounded-lg hover:bg-white/30 dark:hover:bg-white/10 h-8 w-8 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
                        aria-label="Layer actions"
                      >
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-card border border-border shadow-xl z-50">
                      <DropdownMenuItem 
                        onClick={() => handleSelectAll(theme)}
                        disabled={allVisible}
                        className="gap-2.5 min-h-[44px]"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Select All
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleClearAll(theme)}
                        disabled={noneVisible}
                        className="gap-2.5 min-h-[44px]"
                      >
                        <XCircle className="w-4 h-4" />
                        Clear All
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Layers List - Card-like rows with spacing */}
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-out motion-reduce:transition-none",
                  isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div className="px-3 pb-4 pt-1 space-y-3">
                  {theme.layers.map((layer) => {
                    const isHighlighted = highlightedLayerId === layer.id;
                    const LayerIcon = iconMap[layer.icon];
                    const categoryColor = getCategoryColor(layer.name);
                    const layerColor = categoryColor.base;
                    
                    return (
                      <Tooltip key={layer.id}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => onLayerToggle(theme.id, layer.id)}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-3.5 rounded-xl text-left group",
                              "transition-all duration-200 ease-out motion-reduce:transition-none",
                              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                              isHighlighted && "ring-2 ring-primary ring-offset-1 ring-offset-background",
                              layer.visible
                                ? "bg-white/60 dark:bg-white/10 border border-white/50 dark:border-white/20 shadow-sm"
                                : "bg-white/20 dark:bg-white/5 border border-transparent hover:bg-white/40 dark:hover:bg-white/10 hover:border-white/30"
                            )}
                            aria-pressed={layer.visible}
                            aria-label={`${layer.name}: ${layer.visible ? 'visible' : 'hidden'}`}
                          >
                            {/* Left: Layer Icon with tinted background */}
                            <div
                              className={cn(
                                "w-10 h-10 flex-shrink-0 rounded-lg flex items-center justify-center",
                                "transition-all duration-200 ease-out motion-reduce:transition-none",
                                layer.visible 
                                  ? "shadow-sm" 
                                  : "opacity-60 group-hover:opacity-80"
                              )}
                              style={{ 
                                backgroundColor: `${layerColor}15`,
                              }}
                            >
                              <div 
                                className={cn(
                                  "transition-all duration-200 ease-out motion-reduce:transition-none",
                                  layer.visible ? "opacity-100 scale-100" : "opacity-70 scale-95 group-hover:scale-100"
                                )}
                                style={{ color: layerColor }}
                              >
                                {LayerIcon ? (
                                  <LayerIcon className="w-5 h-5" />
                                ) : (
                                  <div
                                    className="w-5 h-5 rounded"
                                    style={{ backgroundColor: layerColor }}
                                  />
                                )}
                              </div>
                            </div>
                            
                            {/* Center: Text Container */}
                            <div className="flex-1 min-w-0 pr-1">
                              <span className={cn(
                                "block text-sm font-medium truncate transition-colors",
                                layer.visible ? "text-foreground" : "text-foreground/80"
                              )}>
                                {layer.name}
                              </span>
                              <p className={cn(
                                "text-xs truncate hidden sm:block transition-colors",
                                layer.visible ? "text-muted-foreground" : "text-muted-foreground/70"
                              )}>
                                {layer.description}
                              </p>
                            </div>
                            
                            {/* Right: Toggle Indicator */}
                            <div
                              className={cn(
                                "flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg",
                                "transition-all duration-200 ease-out motion-reduce:transition-none",
                                layer.visible
                                  ? "shadow-sm"
                                  : "bg-muted/20 group-hover:bg-muted/40"
                              )}
                              style={{
                                backgroundColor: layer.visible ? `${layerColor}20` : undefined,
                              }}
                            >
                              <div
                                className={cn(
                                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ease-out",
                                  layer.visible
                                    ? "border-transparent"
                                    : "border-muted-foreground/25 group-hover:border-muted-foreground/40"
                                )}
                                style={{
                                  backgroundColor: layer.visible ? layerColor : 'transparent',
                                }}
                              >
                                {layer.visible ? (
                                  <Check className="w-3.5 h-3.5 text-white" />
                                ) : (
                                  <Circle className="w-3 h-3 text-muted-foreground/30 group-hover:text-muted-foreground/50" />
                                )}
                              </div>
                            </div>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="text-xs max-w-[220px] p-3">
                          <p className="font-medium mb-0.5">{layer.name}</p>
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
