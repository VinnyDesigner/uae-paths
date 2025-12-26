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
  const [selectedThemeId, setSelectedThemeId] = useState<number | null>(null);
  const [sectionRect, setSectionRect] = useState<DOMRect | null>(null);
  const [sidebarRect, setSidebarRect] = useState<DOMRect | null>(null);
  const categoryRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Derive selectedTheme from layers prop to ensure it always reflects current state
  const selectedTheme = selectedThemeId !== null 
    ? layers.find(t => t.id === selectedThemeId) ?? null 
    : null;

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

    setSelectedThemeId(theme.id);
  }, []);

  const handleCloseFlyout = useCallback(() => {
    setSelectedThemeId(null);
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
      <div className="space-y-2">
        {layers.map((theme) => {
          const visibleCount = getVisibleLayerCount(theme);
          const totalCount = theme.layers.length;
          const isSelected = selectedTheme?.id === theme.id;
          const hasVisibleLayers = visibleCount > 0;

          return (
            <button
              key={theme.id}
              ref={setRef(theme.id)}
              onClick={() => handleCategoryClick(theme)}
              className={cn(
                "w-full rounded-xl border overflow-hidden transition-all duration-200",
                "bg-white/60 dark:bg-white/5 backdrop-blur-sm",
                "hover:bg-white/80 dark:hover:bg-white/8",
                "active:scale-[0.98]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                isSelected 
                  ? "border-primary/40 ring-1 ring-primary/20 shadow-md" 
                  : "border-white/50 dark:border-white/10 shadow-sm hover:border-primary/20 hover:shadow-md"
              )}
              aria-label={`Open ${theme.name} layers`}
            >
              {/* Compact Card Layout */}
              <div className="flex items-center gap-3 px-3 py-2.5">
                {/* Icon - Compact 36x36px */}
                <div
                  className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                    "transition-all duration-150",
                    hasVisibleLayers 
                      ? "bg-primary text-white shadow-sm shadow-primary/30" 
                      : "bg-primary/10 text-primary"
                  )}
                >
                  {getThemeIcon(theme.icon)}
                </div>
                
                {/* Content - Title & Count inline */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-foreground truncate">
                      {theme.name}
                    </span>
                    <span className={cn(
                      "text-xs font-medium px-1.5 py-0.5 rounded-md flex-shrink-0",
                      hasVisibleLayers 
                        ? "bg-primary/15 text-primary" 
                        : "bg-muted/50 text-muted-foreground"
                    )}>
                      {visibleCount}/{totalCount}
                    </span>
                  </div>
                </div>
                
                {/* Chevron */}
                <ChevronRight
                  className={cn(
                    "w-4 h-4 flex-shrink-0 transition-all duration-150",
                    isSelected ? "text-primary translate-x-0.5" : "text-muted-foreground/60"
                  )}
                />
              </div>
            </button>
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