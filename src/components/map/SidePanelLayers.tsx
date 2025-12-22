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
                "bg-white/40 dark:bg-white/5 rounded-2xl border overflow-hidden shadow-sm transition-all duration-200",
                isSelected 
                  ? "border-primary/50 ring-2 ring-primary/20" 
                  : "border-white/30 dark:border-white/10"
              )}
            >
              {/* Section Header - Category Row */}
              <div 
                className={cn(
                  "p-4",
                  isHealthcare 
                    ? "bg-gradient-to-r from-primary/5 to-transparent" 
                    : "bg-gradient-to-r from-education/5 to-transparent"
                )}
              >
                {/* Row 1: Section Identity - Clickable to open flyout */}
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={() => handleCategoryClick(theme)}
                    className={cn(
                      "flex items-center gap-3 transition-all flex-1 min-w-0",
                      "hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 rounded-lg"
                    )}
                    aria-label={`Open ${theme.name} layers`}
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
                  
                  {/* Right Arrow - Opens flyout */}
                  <button
                    onClick={() => handleCategoryClick(theme)}
                    className={cn(
                      "p-2.5 -mr-1 rounded-lg hover:bg-white/30 dark:hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0 transition-all",
                      isSelected && "bg-primary/10"
                    )}
                    aria-label={`Open ${theme.name} layers panel`}
                  >
                    <ChevronRight
                      className={cn(
                        "w-5 h-5 transition-all duration-200 ease-out",
                        isSelected ? "text-primary translate-x-0.5" : "text-muted-foreground"
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
                    <span className="text-border/40 text-[13px] leading-8 mx-1">|</span>
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

                  {/* Mobile dropdown menu */}
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
