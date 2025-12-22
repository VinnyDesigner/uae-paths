import { useEffect, useRef, useState, useCallback } from 'react';
import { 
  ArrowLeft,
  Check,
  Circle,
  CheckCircle2,
  XCircle,
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
import { getCategoryColor } from '@/lib/mapColors';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface LayerFlyoutProps {
  theme: ThemeGroup | null;
  isOpen: boolean;
  onClose: () => void;
  onLayerToggle: (themeId: number, layerId: number) => void;
  onSelectAll: (themeId: number) => void;
  onClearAll: (themeId: number) => void;
  highlightedLayerId?: number | null;
  sectionRect?: DOMRect | null;
  sidebarRect?: DOMRect | null;
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

export function LayerFlyout({ 
  theme, 
  isOpen, 
  onClose, 
  onLayerToggle,
  onSelectAll,
  onClearAll,
  highlightedLayerId,
  sectionRect,
  sidebarRect,
}: LayerFlyoutProps) {
  const flyoutRef = useRef<HTMLDivElement>(null);
  const [flyoutPosition, setFlyoutPosition] = useState({ top: 0, height: 0, left: 0 });
  const [togglingLayerId, setTogglingLayerId] = useState<number | null>(null);

  // Calculate flyout position: starts at Map Layers section top, ends at sidebar bottom
  const calculatePosition = useCallback(() => {
    const gap = 12; // gap between sidebar and flyout
    const flyoutWidth = 340;

    // Sidebar bounds (viewport space)
    const sidebarTop = sidebarRect?.top ?? 80;
    const sidebarBottom = sidebarRect?.bottom ?? (window.innerHeight - 16);
    const sidebarRight = sidebarRect?.right ?? 336;

    // Top aligned to Map Layers heading/top
    const sectionTop = sectionRect?.top ?? sidebarTop;

    const unclampedLeft = sidebarRight + gap;
    const maxLeft = Math.max(16, window.innerWidth - flyoutWidth - 16);
    const left = Math.min(unclampedLeft, maxLeft);

    const top = Math.max(sidebarTop, sectionTop);
    const height = Math.max(0, sidebarBottom - top);

    return {
      top,
      height,
      left,
    };
  }, [sectionRect, sidebarRect]);

  useEffect(() => {
    if (isOpen) {
      setFlyoutPosition(calculatePosition());
    }
  }, [isOpen, calculatePosition]);

  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        setFlyoutPosition(calculatePosition());
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, calculatePosition]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node) && isOpen) {
        const sidebar = document.querySelector('[data-sidebar-layers]');
        if (sidebar && sidebar.contains(e.target as Node)) {
          return;
        }
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Handle layer toggle with animation feedback
  const handleLayerToggle = useCallback((themeId: number, layerId: number) => {
    setTogglingLayerId(layerId);
    onLayerToggle(themeId, layerId);
    // Clear animation state after animation completes
    setTimeout(() => setTogglingLayerId(null), 150);
  }, [onLayerToggle]);

  if (!theme) return null;

  const visibleCount = theme.layers.filter(l => l.visible).length;
  const totalCount = theme.layers.length;
  const allVisible = theme.layers.every(l => l.visible);
  const noneVisible = theme.layers.every(l => !l.visible);
  const isHealthcare = theme.colorClass === 'healthcare';

  return (
    <div
      ref={flyoutRef}
      className={cn(
        "fixed w-[340px] bg-white/98 dark:bg-card/98 backdrop-blur-xl",
        "border border-white/60 dark:border-white/15 rounded-2xl shadow-2xl",
        "transition-all duration-200 ease-out",
        "flex flex-col overflow-hidden",
        isOpen
          ? "opacity-100 translate-x-0 pointer-events-auto"
          : "opacity-0 -translate-x-3 pointer-events-none"
      )}
      style={{
        left: `${flyoutPosition.left}px`,
        top: `${flyoutPosition.top}px`,
        height: `${flyoutPosition.height}px`,
        // Leaflet controls/markers often sit at z-index 400–1000; keep flyout above them.
        zIndex: 1200,
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`${theme.name} layers`}
    >
      {/* Header - Fixed */}
      <div 
        className={cn(
          "px-4 py-3.5 border-b border-white/20 dark:border-white/10 flex-shrink-0",
          isHealthcare 
            ? "bg-gradient-to-r from-primary/10 to-transparent" 
            : "bg-gradient-to-r from-education/10 to-transparent"
        )}
      >
        {/* Row 1: Back + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
              "bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20",
              "transition-all duration-150 active:scale-95",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            )}
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>
          <h3 className="flex-1 text-sm font-semibold text-foreground truncate">
            {theme.name}
          </h3>
        </div>

        {/* Divider */}
        <div className="h-px bg-border/30 mt-3 mb-2.5" />

        {/* Row 2: Counter + Actions */}
        <div className="flex items-center justify-between h-7">
          <span className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{visibleCount}</span>
            <span className="mx-1">of</span>
            <span>{totalCount}</span>
            <span className="ml-1">visible</span>
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSelectAll(theme.id)}
              disabled={allVisible}
              className={cn(
                "flex items-center gap-1 px-2.5 h-7 rounded-lg text-xs font-medium transition-all duration-120",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                allVisible
                  ? "bg-muted/30 text-muted-foreground/40 cursor-not-allowed"
                  : "bg-primary/10 text-primary hover:bg-primary/20 active:scale-95"
              )}
            >
              <CheckCircle2 className="w-3 h-3" />
              All
            </button>
            <button
              onClick={() => onClearAll(theme.id)}
              disabled={noneVisible}
              className={cn(
                "flex items-center gap-1 px-2.5 h-7 rounded-lg text-xs font-medium transition-all duration-120",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                noneVisible
                  ? "bg-muted/30 text-muted-foreground/40 cursor-not-allowed"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95"
              )}
            >
              <XCircle className="w-3 h-3" />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Layer List */}
      <TooltipProvider delayDuration={400}>
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 overscroll-contain">
          {theme.layers.map((layer) => {
            const isHighlighted = highlightedLayerId === layer.id;
            const isToggling = togglingLayerId === layer.id;
            const LayerIcon = iconMap[layer.icon];
            const categoryColor = getCategoryColor(layer.name);
            const layerColor = categoryColor.base;
            
            return (
              <Tooltip key={layer.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLayerToggle(theme.id, layer.id);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left group",
                      "transition-all duration-120 ease-out",
                      "active:scale-[0.98]",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                      isHighlighted && "ring-2 ring-primary ring-offset-1 ring-offset-background",
                      isToggling && "scale-[0.98]",
                      layer.visible
                        ? "bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/20 shadow-sm"
                        : "bg-white/30 dark:bg-white/5 border border-transparent hover:bg-white/50 dark:hover:bg-white/10 hover:border-white/40"
                    )}
                    aria-pressed={layer.visible}
                    aria-label={`${layer.name}: ${layer.visible ? 'visible' : 'hidden'}`}
                  >
                    {/* Icon with tinted background */}
                    <div
                      className={cn(
                        "w-9 h-9 flex-shrink-0 rounded-lg flex items-center justify-center",
                        "transition-all duration-120",
                        layer.visible 
                          ? "shadow-sm" 
                          : "opacity-60 group-hover:opacity-80"
                      )}
                      style={{ backgroundColor: `${layerColor}12` }}
                    >
                      <div 
                        className={cn(
                          "transition-transform duration-120",
                          layer.visible ? "scale-100" : "scale-95 group-hover:scale-100"
                        )}
                        style={{ color: layerColor }}
                      >
                        {LayerIcon ? (
                          <LayerIcon className="w-4.5 h-4.5" />
                        ) : (
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: layerColor }}
                          />
                        )}
                      </div>
                    </div>
                    
                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <span className={cn(
                        "block text-sm font-medium truncate transition-colors duration-120",
                        layer.visible ? "text-foreground" : "text-foreground/75"
                      )}>
                        {layer.name}
                      </span>
                      <p className={cn(
                        "text-[11px] truncate mt-0.5 transition-colors duration-120",
                        layer.visible ? "text-muted-foreground" : "text-muted-foreground/60"
                      )}>
                        {layer.description}
                      </p>
                    </div>
                    
                    {/* Toggle indicator with animation */}
                    <div
                      className={cn(
                        "flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg",
                        "transition-all duration-120",
                        layer.visible
                          ? "shadow-sm"
                          : "bg-muted/20 group-hover:bg-muted/30"
                      )}
                      style={{
                        backgroundColor: layer.visible ? `${layerColor}18` : undefined,
                      }}
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center transition-all duration-120",
                          layer.visible
                            ? "border-0"
                            : "border-2 border-muted-foreground/20 group-hover:border-muted-foreground/30",
                          isToggling && "scale-90"
                        )}
                        style={{
                          backgroundColor: layer.visible ? layerColor : 'transparent',
                        }}
                      >
                        {layer.visible ? (
                          <Check className={cn(
                            "w-3 h-3 text-white transition-transform duration-120",
                            isToggling && "scale-110"
                          )} />
                        ) : (
                          <Circle className="w-2 h-2 text-muted-foreground/25 group-hover:text-muted-foreground/40" />
                        )}
                      </div>
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs max-w-[180px] p-2.5">
                  <p className="font-medium mb-0.5">{layer.name}</p>
                  <p className="text-muted-foreground">{layer.description}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>
    </div>
  );
}