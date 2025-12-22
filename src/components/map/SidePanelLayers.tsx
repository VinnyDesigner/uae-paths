import { useState } from 'react';
import { 
  ChevronRight, 
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
import { LayerFlyout } from './LayerFlyout';

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
  const [selectedTheme, setSelectedTheme] = useState<ThemeGroup | null>(null);
  const { toast } = useToast();

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

  const handleSelectAll = (themeId: number) => {
    const theme = layers.find(t => t.id === themeId);
    if (!theme) return;
    
    if (onSelectAll) {
      onSelectAll(themeId);
    } else {
      theme.layers.forEach(layer => {
        if (!layer.visible) {
          onLayerToggle(themeId, layer.id);
        }
      });
    }
    toast({
      description: `${theme.name} layers enabled (${theme.layers.length})`,
      duration: 1500,
    });
  };

  const handleClearAll = (themeId: number) => {
    const theme = layers.find(t => t.id === themeId);
    if (!theme) return;
    
    if (onClearAll) {
      onClearAll(themeId);
    } else {
      theme.layers.forEach(layer => {
        if (layer.visible) {
          onLayerToggle(themeId, layer.id);
        }
      });
    }
    toast({
      description: `${theme.name} layers cleared`,
      duration: 1500,
    });
  };

  const handleCategoryClick = (theme: ThemeGroup) => {
    setSelectedTheme(theme);
  };

  const handleCloseFlyout = () => {
    setSelectedTheme(null);
  };

  return (
    <div className={cn("relative", className)} data-sidebar-layers>
      <div className="space-y-5">
        {layers.map((theme) => {
          const visibleCount = getVisibleLayerCount(theme);
          const totalCount = theme.layers.length;
          const allVisible = getAllLayersVisible(theme);
          const noneVisible = getNoLayersVisible(theme);
          const isHealthcare = theme.colorClass === 'healthcare';
          const isSelected = selectedTheme?.id === theme.id;

          return (
            <div
              key={theme.id}
              className={cn(
                "bg-white/40 dark:bg-white/5 rounded-2xl border overflow-hidden transition-all duration-200",
                "hover:shadow-md hover:border-white/40 dark:hover:border-white/15",
                isSelected 
                  ? "border-primary/50 ring-2 ring-primary/20 shadow-md" 
                  : "border-white/30 dark:border-white/10 shadow-sm"
              )}
            >
              {/* Card Content */}
              <div 
                className={cn(
                  "p-4",
                  isHealthcare 
                    ? "bg-gradient-to-r from-primary/5 to-transparent" 
                    : "bg-gradient-to-r from-education/5 to-transparent"
                )}
              >
                {/* Row 1: Icon + Title + Chevron - Single baseline */}
                <button
                  onClick={() => handleCategoryClick(theme)}
                  className={cn(
                    "w-full flex items-center gap-3 group/row",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 rounded-lg",
                    "-mx-1 px-1 py-1"
                  )}
                  aria-label={`Open ${theme.name} layers`}
                >
                  {/* Fixed 40x40 icon container */}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform duration-200",
                      "group-hover/row:scale-105",
                      isHealthcare 
                        ? "bg-primary/15 text-primary" 
                        : "bg-education/15 text-education"
                    )}
                  >
                    {getThemeIcon(theme.icon)}
                  </div>
                  
                  {/* Title - vertically centered */}
                  <span className="flex-1 text-left text-base font-semibold text-foreground leading-tight truncate">
                    {theme.name}
                  </span>
                  
                  {/* Right Chevron - vertically centered */}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200",
                      "group-hover/row:bg-white/30 dark:group-hover/row:bg-white/10",
                      isSelected && "bg-primary/10"
                    )}
                  >
                    <ChevronRight
                      className={cn(
                        "w-5 h-5 transition-all duration-200 ease-out",
                        "group-hover/row:translate-x-0.5",
                        isSelected ? "text-primary translate-x-0.5" : "text-muted-foreground"
                      )}
                    />
                  </div>
                </button>

                {/* Subtle divider */}
                <div className="h-px bg-border/30 mt-3 mb-3" />

                {/* Row 2: Visibility Count (left) | Actions (right) - Single baseline */}
                <div className="flex items-center justify-between h-8">
                  {/* Left: Visibility status */}
                  <span className="text-[13px] leading-8 text-muted-foreground whitespace-nowrap">
                    <span className="font-medium text-foreground">{visibleCount}</span>
                    <span className="mx-1">of</span>
                    <span>{totalCount}</span>
                    <span className="ml-1">visible</span>
                  </span>

                  {/* Right: Actions - Desktop/Tablet */}
                  <div className="hidden sm:flex items-center h-8">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectAll(theme.id);
                      }}
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
                    <span className="text-border/50 text-[13px] leading-8 mx-0.5 select-none">|</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearAll(theme.id);
                      }}
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

                  {/* Right: Actions - Mobile dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button 
                        className="sm:hidden p-2 rounded-lg hover:bg-white/30 dark:hover:bg-white/10 h-8 w-8 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
                        aria-label="Layer actions"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-card border border-border shadow-xl z-50">
                      <DropdownMenuItem 
                        onClick={() => handleSelectAll(theme.id)}
                        disabled={allVisible}
                        className="gap-2.5 min-h-[44px]"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Select All
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleClearAll(theme.id)}
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
            </div>
          );
        })}
      </div>

      {/* Layer Flyout - Opens to the right */}
      <LayerFlyout
        theme={selectedTheme}
        isOpen={!!selectedTheme}
        onClose={handleCloseFlyout}
        onLayerToggle={onLayerToggle}
        onSelectAll={handleSelectAll}
        onClearAll={handleClearAll}
        highlightedLayerId={highlightedLayerId}
      />
    </div>
  );
}
