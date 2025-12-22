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
  clickedElementRect?: DOMRect | null;
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
  clickedElementRect,
}: LayerFlyoutProps) {
  const flyoutRef = useRef<HTMLDivElement>(null);
  const [flyoutPosition, setFlyoutPosition] = useState({ top: 0, maxHeight: 0 });

  // Calculate flyout position based on clicked element
  const calculatePosition = useCallback(() => {
    if (!clickedElementRect) {
      // Default position if no rect
      const headerHeight = 64;
      const padding = 16;
      return {
        top: headerHeight + padding,
        maxHeight: window.innerHeight - headerHeight - padding * 2,
      };
    }

    const headerHeight = 64;
    const safeTop = headerHeight + 16;
    const safeBottom = 16;
    const viewportHeight = window.innerHeight;
    
    // Estimate flyout height (header ~120px + list items ~70px each)
    const estimatedItemHeight = 72;
    const estimatedHeaderHeight = 140;
    const estimatedListHeight = (theme?.layers.length || 8) * estimatedItemHeight;
    const estimatedFlyoutHeight = Math.min(
      estimatedHeaderHeight + estimatedListHeight,
      viewportHeight - safeTop - safeBottom
    );

    // Start from clicked element's top
    let targetTop = clickedElementRect.top;

    // Clamp to viewport bounds
    const minTop = safeTop;
    const maxTop = viewportHeight - estimatedFlyoutHeight - safeBottom;
    
    targetTop = Math.max(minTop, Math.min(targetTop, maxTop));

    const maxHeight = viewportHeight - targetTop - safeBottom;

    return { top: targetTop, maxHeight };
  }, [clickedElementRect, theme?.layers.length]);

  // Update position when opening or clicked element changes
  useEffect(() => {
    if (isOpen) {
      setFlyoutPosition(calculatePosition());
    }
  }, [isOpen, calculatePosition]);

  // Recalculate on resize
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        setFlyoutPosition(calculatePosition());
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, calculatePosition]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node) && isOpen) {
        // Check if click is on the sidebar (parent panel)
        const sidebar = document.querySelector('[data-sidebar-layers]');
        if (sidebar && sidebar.contains(e.target as Node)) {
          return; // Don't close if clicking on sidebar
        }
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!theme) return null;

  const visibleCount = theme.layers.filter(l => l.visible).length;
  const totalCount = theme.layers.length;
  const allVisible = theme.layers.every(l => l.visible);
  const noneVisible = theme.layers.every(l => !l.visible);
  const isHealthcare = theme.colorClass === 'healthcare';

  // Position: sidebar width (320px / w-80) + left offset (16px) + small gap
  const leftPosition = 320 + 16 + 8; // 344px from left edge

  return (
    <div
      ref={flyoutRef}
      className={cn(
        "fixed w-[380px] bg-white/95 dark:bg-card/95 backdrop-blur-xl",
        "border border-white/30 dark:border-white/10 rounded-2xl shadow-2xl z-[1002]",
        "transition-all duration-250 ease-out",
        "flex flex-col overflow-hidden",
        isOpen 
          ? "opacity-100 translate-x-0 pointer-events-auto" 
          : "opacity-0 -translate-x-4 pointer-events-none"
      )}
      style={{ 
        left: `${leftPosition}px`,
        top: `${flyoutPosition.top}px`,
        maxHeight: `${flyoutPosition.maxHeight}px`,
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`${theme.name} layers`}
    >
      {/* Flyout Header - Sticky */}
      <div 
        className={cn(
          "px-4 py-4 border-b border-white/20 dark:border-white/10 flex-shrink-0",
          isHealthcare 
            ? "bg-gradient-to-r from-primary/10 to-transparent" 
            : "bg-gradient-to-r from-education/10 to-transparent"
        )}
      >
        {/* Row 1: Back + Title - vertically centered */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
              "bg-white/50 dark:bg-white/10 hover:bg-white/70 dark:hover:bg-white/20",
              "transition-all active:scale-95",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            )}
            aria-label="Go back to categories"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h3 className="flex-1 text-base font-semibold text-foreground truncate">
            {theme.name}
          </h3>
        </div>

        {/* Subtle divider */}
        <div className="h-px bg-border/30 mt-3 mb-3" />

        {/* Row 2: Visibility Count (left) | Actions (right) - aligned baseline */}
        <div className="flex items-center justify-between h-8">
          {/* Left: Visibility status */}
          <span className="text-[13px] leading-8 text-muted-foreground whitespace-nowrap">
            <span className="font-medium text-foreground">{visibleCount}</span>
            <span className="mx-1">of</span>
            <span>{totalCount}</span>
            <span className="ml-1">visible</span>
          </span>

          {/* Right: Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectAll(theme.id)}
              disabled={allVisible}
              className={cn(
                "flex items-center gap-1.5 px-3 h-8 rounded-lg text-sm font-medium transition-all",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                allVisible
                  ? "bg-muted/30 text-muted-foreground/40 cursor-not-allowed"
                  : "bg-primary/10 text-primary hover:bg-primary/20 active:scale-95"
              )}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Select All
            </button>
            <button
              onClick={() => onClearAll(theme.id)}
              disabled={noneVisible}
              className={cn(
                "flex items-center gap-1.5 px-3 h-8 rounded-lg text-sm font-medium transition-all",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                noneVisible
                  ? "bg-muted/30 text-muted-foreground/40 cursor-not-allowed"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95"
              )}
            >
              <XCircle className="w-3.5 h-3.5" />
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Layer List */}
      <TooltipProvider delayDuration={300}>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 overscroll-contain">
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
                      "transition-all duration-150 ease-out motion-reduce:transition-none",
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
                        "transition-all duration-150 ease-out motion-reduce:transition-none",
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
                          "transition-all duration-150 ease-out motion-reduce:transition-none",
                          layer.visible ? "opacity-100 scale-100" : "opacity-70 scale-[0.98] group-hover:scale-100"
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
                        "text-xs truncate transition-colors",
                        layer.visible ? "text-muted-foreground" : "text-muted-foreground/70"
                      )}>
                        {layer.description}
                      </p>
                    </div>
                    
                    {/* Right: Toggle Indicator */}
                    <div
                      className={cn(
                        "flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg",
                        "transition-all duration-150 ease-out motion-reduce:transition-none",
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
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-150 ease-out",
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
      </TooltipProvider>
    </div>
  );
}