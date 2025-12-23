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
  const [sectionRect, setSectionRect] = useState<DOMRect | null>(null);
  const [sidebarRect, setSidebarRect] = useState<DOMRect | null>(null);
  const categoryRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Get sidebar and section bounds on mount and resize
  useEffect(() => {
    const updateRects = () => {
      const sidebar =
        containerRef.current?.closest('[data-sidebar-panel]') ||
        document.querySelector('[data-sidebar-panel]');

      if (sidebar) {
        setSidebarRect(sidebar.getBoundingClientRect());

        // Map Layers section anchor: the heading element in SmartMapPage
        const header = sidebar.querySelector('[data-map-layers-header]') as HTMLElement | null;
        if (header) {
          setSectionRect(header.getBoundingClientRect());
        }
      } else {
        // Fallback (shouldn't happen)
        const header = document.querySelector('[data-map-layers-header]') as HTMLElement | null;
        if (header) {
          setSectionRect(header.getBoundingClientRect());
        }
      }
    };

    updateRects();
    window.addEventListener('resize', updateRects);

    const scrollContainer = containerRef.current?.closest('.overflow-y-auto');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', updateRects);
    }

    return () => {
      window.removeEventListener('resize', updateRects);
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', updateRects);
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

  const handleCategoryClick = useCallback((theme: ThemeGroup) => {
    // Update rects before opening flyout
    const sidebar =
      containerRef.current?.closest('[data-sidebar-panel]') ||
      document.querySelector('[data-sidebar-panel]');

    if (sidebar) {
      setSidebarRect(sidebar.getBoundingClientRect());
      const header = sidebar.querySelector('[data-map-layers-header]') as HTMLElement | null;
      if (header) setSectionRect(header.getBoundingClientRect());
    } else {
      const header = document.querySelector('[data-map-layers-header]') as HTMLElement | null;
      if (header) setSectionRect(header.getBoundingClientRect());
    }

    setSelectedTheme(theme);
  }, []);

  const handleCloseFlyout = useCallback(() => {
    setSelectedTheme(null);
  }, []);

  const setRef = useCallback((themeId: number) => (el: HTMLDivElement | null) => {
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
          const isSelected = selectedTheme?.id === theme.id;

          return (
            <div
              key={theme.id}
              ref={setRef(theme.id)}
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
              <div className="p-4 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
                {/* Row 1: 3-Column Grid - Icon (44px) | Title (flex) | Chevron (40px) */}
                <button
                  onClick={() => handleCategoryClick(theme)}
                  className={cn(
                    "w-full grid grid-cols-[44px_1fr_40px] items-center gap-2 group/row",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 rounded-xl",
                    "-mx-1 px-1 py-1"
                  )}
                  aria-label={`Open ${theme.name} layers`}
                >
                  {/* Icon container - Fixed 44x44px, unified primary color */}
                  <div
                    className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center",
                      "transition-all duration-150 group-hover/row:scale-105",
                      "bg-primary/10 text-primary shadow-sm shadow-primary/10"
                    )}
                  >
                    {getThemeIcon(theme.icon)}
                  </div>
                  
                  {/* Title - Flexible with proper truncation */}
                  <span className="text-left text-[15px] font-semibold text-foreground leading-snug line-clamp-2">
                    {theme.name}
                  </span>
                  
                  {/* Chevron - Fixed 40x40px */}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      "transition-all duration-150",
                      "group-hover/row:bg-white/40 dark:group-hover/row:bg-white/10",
                      isSelected && "bg-primary/10"
                    )}
                  >
                    <ChevronRight
                      className={cn(
                        "w-5 h-5 transition-all duration-150 ease-out",
                        "group-hover/row:translate-x-0.5",
                        isSelected ? "text-primary translate-x-0.5" : "text-muted-foreground"
                      )}
                    />
                  </div>
                </button>

                {/* Row 2: Visibility summary - clean status only */}
                <div className="flex items-center gap-1.5 mt-2 pl-1">
                  <span className="text-sm font-semibold text-foreground">{visibleCount}</span>
                  <span className="text-sm text-muted-foreground">of {totalCount} visible</span>
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
        sectionRect={sectionRect}
        sidebarRect={sidebarRect}
      />
    </div>
  );
}