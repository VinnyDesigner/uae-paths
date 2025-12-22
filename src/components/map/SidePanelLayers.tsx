import { useState, useRef, useCallback, useEffect } from 'react';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeGroup } from '@/types/map';
import { useToast } from '@/hooks/use-toast';
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
  const [clickedRect, setClickedRect] = useState<DOMRect | null>(null);
  const [sidebarRect, setSidebarRect] = useState<DOMRect | null>(null);
  const categoryRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Get sidebar bounds on mount and resize
  useEffect(() => {
    const updateSidebarRect = () => {
      // Find the main sidebar container
      const sidebar = document.querySelector('.lg\\:flex.flex-col.w-80.absolute');
      if (sidebar) {
        setSidebarRect(sidebar.getBoundingClientRect());
      }
    };

    updateSidebarRect();
    window.addEventListener('resize', updateSidebarRect);
    
    const scrollContainer = containerRef.current?.closest('.overflow-y-auto');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', updateSidebarRect);
    }

    return () => {
      window.removeEventListener('resize', updateSidebarRect);
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', updateSidebarRect);
      }
    };
  }, []);

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

  const handleSelectAll = useCallback((themeId: number) => {
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
      description: `All ${theme.name} layers enabled`,
      duration: 1500,
    });
  }, [layers, onSelectAll, onLayerToggle, toast]);

  const handleClearAll = useCallback((themeId: number) => {
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
      description: `All ${theme.name} layers cleared`,
      duration: 1500,
    });
  }, [layers, onClearAll, onLayerToggle, toast]);

  const handleCategoryClick = useCallback((theme: ThemeGroup, buttonElement: HTMLButtonElement | null) => {
    const sidebar = document.querySelector('.lg\\:flex.flex-col.w-80.absolute');
    if (sidebar) {
      setSidebarRect(sidebar.getBoundingClientRect());
    }
    
    if (buttonElement) {
      setClickedRect(buttonElement.getBoundingClientRect());
    }
    setSelectedTheme(theme);
  }, []);

  const handleCloseFlyout = useCallback(() => {
    setSelectedTheme(null);
    setClickedRect(null);
  }, []);

  const setRef = useCallback((themeId: number) => (el: HTMLButtonElement | null) => {
    if (el) {
      categoryRefs.current.set(themeId, el);
    } else {
      categoryRefs.current.delete(themeId);
    }
  }, []);

  return (
    <div ref={containerRef} className={cn("relative", className)} data-sidebar-layers>
      <div className="space-y-3">
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
                "rounded-2xl border overflow-hidden transition-all duration-200",
                "bg-white/50 dark:bg-white/5 backdrop-blur-sm",
                "hover:shadow-md",
                isSelected 
                  ? "border-primary/40 ring-2 ring-primary/20 shadow-md" 
                  : "border-white/40 dark:border-white/10 shadow-sm hover:border-white/60"
              )}
            >
              {/* Card Content - 16px padding consistent */}
              <div 
                className={cn(
                  "p-4",
                  isHealthcare 
                    ? "bg-gradient-to-br from-primary/8 via-transparent to-transparent" 
                    : "bg-gradient-to-br from-education/8 via-transparent to-transparent"
                )}
              >
                {/* Row 1: Icon + Title + Chevron */}
                <button
                  ref={setRef(theme.id)}
                  onClick={(e) => handleCategoryClick(theme, e.currentTarget)}
                  className={cn(
                    "w-full flex items-center gap-3 group/row",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 rounded-xl",
                    "-mx-1 px-1 py-1"
                  )}
                  aria-label={`Open ${theme.name} layers`}
                >
                  {/* Icon container with category tint - 40x40px */}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                      "transition-all duration-200 group-hover/row:scale-105",
                      isHealthcare 
                        ? "bg-primary/12 text-primary shadow-sm shadow-primary/10" 
                        : "bg-education/12 text-education shadow-sm shadow-education/10"
                    )}
                  >
                    {getThemeIcon(theme.icon)}
                  </div>
                  
                  {/* Title - flex-1 for proper truncation */}
                  <span className="flex-1 text-left text-[15px] font-semibold text-foreground leading-tight truncate">
                    {theme.name}
                  </span>
                  
                  {/* Chevron - 40x40px container for alignment */}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                      "transition-all duration-200",
                      "group-hover/row:bg-white/40 dark:group-hover/row:bg-white/10",
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

                {/* Divider */}
                <div className="h-px bg-border/40 my-3" />

                {/* Row 2: Status (left) | Actions (right) */}
                <div className="flex items-center justify-between h-8">
                  {/* Left: Visibility counter */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-foreground">{visibleCount}</span>
                    <span className="text-sm text-muted-foreground">of {totalCount} visible</span>
                  </div>

                  {/* Right: Select All | Clear All */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectAll(theme.id);
                      }}
                      disabled={allVisible}
                      className={cn(
                        "flex items-center gap-1 px-2 h-7 rounded-lg text-xs font-medium transition-all",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        allVisible
                          ? "text-muted-foreground/40 cursor-not-allowed"
                          : "text-primary hover:bg-primary/10 active:scale-95"
                      )}
                      aria-label={`Select all ${theme.name} layers`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">All</span>
                    </button>
                    <span className="text-muted-foreground/30 text-xs select-none">|</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearAll(theme.id);
                      }}
                      disabled={noneVisible}
                      className={cn(
                        "flex items-center gap-1 px-2 h-7 rounded-lg text-xs font-medium transition-all",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        noneVisible
                          ? "text-muted-foreground/40 cursor-not-allowed"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground active:scale-95"
                      )}
                      aria-label={`Clear all ${theme.name} layers`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Clear</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Layer Flyout */}
      <LayerFlyout
        theme={selectedTheme}
        isOpen={!!selectedTheme}
        onClose={handleCloseFlyout}
        onLayerToggle={onLayerToggle}
        onSelectAll={handleSelectAll}
        onClearAll={handleClearAll}
        highlightedLayerId={highlightedLayerId}
        clickedElementRect={clickedRect}
        sidebarRect={sidebarRect}
      />
    </div>
  );
}