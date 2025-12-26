import { useEffect, useRef, useState, useCallback } from 'react';
import { 
  ArrowLeft,
  Check,
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
  const [flyoutPosition, setFlyoutPosition] = useState({ top: 0, height: 0, left: 0, width: 320 });
  const [togglingLayerId, setTogglingLayerId] = useState<number | null>(null);

  // Calculate flyout position: align with sidebar bounds
  const calculatePosition = useCallback(() => {
    const gap = 12; // gap between sidebar and flyout
    const internalPadding = 12; // padding inside for narrower appearance

    // Get sidebar bounds (single source of truth)
    const sideTop = sidebarRect?.top ?? 80;
    const sideRight = sidebarRect?.right ?? 336;
    const sideBottom = sidebarRect?.bottom ?? (window.innerHeight - 24);
    const sideWidth = sidebarRect?.width ?? 320;

    // Flyout starts at sidebar top, ends at sidebar bottom (aligned)
    const flyoutTop = sideTop;
    const flyoutHeight = sideBottom - sideTop;

    // Horizontal positioning - right next to sidebar
    const flyoutLeft = sideRight + gap;
    
    // Width: match sidebar width minus internal padding for slightly narrower look
    const flyoutWidth = Math.max(280, sideWidth - internalPadding);
    
    // Ensure flyout doesn't go off-screen horizontally
    const availableWidth = window.innerWidth - flyoutLeft - 16;
    const finalWidth = Math.min(flyoutWidth, availableWidth);
    const finalLeft = Math.min(flyoutLeft, Math.max(16, window.innerWidth - finalWidth - 16));

    return {
      top: flyoutTop,
      height: flyoutHeight,
      left: finalLeft,
      width: finalWidth,
    };
  }, [sidebarRect]);

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
        "fixed",
        // SOLID background - no transparency to prevent layering issues
        "bg-white dark:bg-[#1a1f2e]",
        // Border and shadow for depth - NO shadow on hover to prevent header interference
        "border border-border/30 dark:border-white/15",
        "rounded-[18px]",
        "shadow-[0_10px_40px_rgba(15,23,42,0.15),0_4px_12px_rgba(0,0,0,0.08)]",
        "dark:shadow-[0_10px_40px_rgba(0,0,0,0.45)]",
        // Remove hover shadow effects
        "hover:shadow-[0_10px_40px_rgba(15,23,42,0.15),0_4px_12px_rgba(0,0,0,0.08)]",
        "dark:hover:shadow-[0_10px_40px_rgba(0,0,0,0.45)]",
        // Animation
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
        width: `${flyoutPosition.width}px`,
        maxHeight: `${flyoutPosition.height}px`,
        // Below header but above other content
        zIndex: 'var(--z-flyout)',
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`${theme.name} layers`}
    >
      {/* Header - Sticky & Compact */}
      <div 
        className={cn(
          "px-3.5 py-3 border-b border-border/10 dark:border-white/10 flex-shrink-0",
          isHealthcare 
            ? "bg-gradient-to-r from-primary/8 to-transparent" 
            : "bg-gradient-to-r from-education/8 to-transparent"
        )}
      >
        {/* Row 1: Back + Title */}
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={onClose}
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
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

        {/* Row 2: Counter + Actions (single row) */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{visibleCount}</span>
            <span className="mx-0.5">of</span>
            <span>{totalCount}</span>
            <span className="ml-0.5">visible</span>
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onSelectAll(theme.id)}
              disabled={allVisible}
              className={cn(
                "flex items-center gap-1 px-2 h-6 rounded-md text-[11px] font-medium transition-all duration-120",
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
                "flex items-center gap-1 px-2 h-6 rounded-md text-[11px] font-medium transition-all duration-120",
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

      {/* Scrollable Layer List - only this area scrolls */}
      <div className="flex-1 overflow-y-auto px-3 py-3 pb-4 space-y-2 overscroll-contain scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
        {theme.layers.map((layer) => {
          const isHighlighted = highlightedLayerId === layer.id;
          const isToggling = togglingLayerId === layer.id;
          const LayerIcon = iconMap[layer.icon];
          
          return (
            <button
              key={layer.id}
              onClick={(e) => {
                e.stopPropagation();
                handleLayerToggle(theme.id, layer.id);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left group cursor-pointer",
                "transition-all duration-150 ease-out",
                "active:scale-[0.98]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                isHighlighted && "ring-2 ring-primary ring-offset-1 ring-offset-background",
                isToggling && "scale-[0.98]",
                // SELECTED STATE - Dark navy background matching reference
                layer.visible
                  ? "bg-[#0F304F] text-white shadow-lg border-0"
                  : "bg-white dark:bg-white/5 border border-border/30 hover:bg-muted/40 hover:border-border/50 text-foreground"
              )}
              aria-pressed={layer.visible}
              aria-selected={layer.visible}
              role="button"
              tabIndex={0}
              aria-label={`${layer.name}: ${layer.visible ? 'visible' : 'hidden'}`}
            >
              {/* Icon container */}
              <div
                className={cn(
                  "w-10 h-10 flex-shrink-0 rounded-lg flex items-center justify-center transition-all duration-150",
                  layer.visible 
                    ? "bg-white/15" 
                    : "bg-muted/40"
                )}
              >
                <div className={cn(
                  "transition-transform duration-150",
                  layer.visible ? "text-white" : "text-muted-foreground"
                )}>
                  {LayerIcon ? (
                    <LayerIcon className="w-5 h-5" />
                  ) : (
                    <div className={cn(
                      "w-4 h-4 rounded",
                      layer.visible ? "bg-white" : "bg-muted-foreground/40"
                    )} />
                  )}
                </div>
              </div>
              
              {/* Text content */}
              <div className="flex-1 min-w-0">
                <span className={cn(
                  "block text-sm truncate transition-colors duration-150",
                  layer.visible ? "font-semibold text-white" : "font-medium text-foreground"
                )}>
                  {layer.name}
                </span>
                <p className={cn(
                  "text-xs truncate mt-0.5 transition-colors duration-150",
                  layer.visible ? "text-white/70" : "text-muted-foreground"
                )}>
                  {layer.description}
                </p>
              </div>
              
              {/* Check indicator - filled circle with checkmark when selected, empty circle otherwise */}
              <div
                className={cn(
                  "w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center transition-all duration-150",
                  layer.visible
                    ? "bg-white"
                    : "border-2 border-muted-foreground/30 group-hover:border-muted-foreground/50",
                  isToggling && "scale-90"
                )}
              >
                {layer.visible && (
                  <Check className={cn(
                    "w-3.5 h-3.5 text-[#0F304F] stroke-[3]",
                    isToggling && "scale-110"
                  )} />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}