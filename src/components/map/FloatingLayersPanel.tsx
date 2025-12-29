import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Layers, 
  X, 
  ChevronRight,
  ChevronLeft,
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
import { ThemeGroup, MapLayer } from '@/types/map';
import { useToast } from '@/hooks/use-toast';
import { getCategoryIcon } from '@/lib/mapColors';

interface FloatingLayersPanelProps {
  layers: ThemeGroup[];
  onLayerToggle: (themeId: number, layerId: number) => void;
  onSelectAll: (themeId: number) => void;
  onClearAll: (themeId: number) => void;
  highlightedLayerId?: number | null;
  className?: string;
  compact?: boolean;
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

export function FloatingLayersPanel({
  layers,
  onLayerToggle,
  onSelectAll,
  onClearAll,
  highlightedLayerId,
  className,
  compact = false,
}: FloatingLayersPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ThemeGroup | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Close panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedTheme(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getThemeIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
  };

  const getVisibleCount = (theme: ThemeGroup) => 
    theme.layers.filter(l => l.visible).length;

  const getTotalVisibleCount = () => 
    layers.reduce((acc, theme) => acc + getVisibleCount(theme), 0);

  const handleSelectAll = useCallback((themeId: number) => {
    onSelectAll(themeId);
    const theme = layers.find(t => t.id === themeId);
    if (theme) {
      toast({
        description: `All ${theme.name} layers enabled`,
        duration: 1500,
      });
    }
  }, [layers, onSelectAll, toast]);

  const handleClearAll = useCallback((themeId: number) => {
    onClearAll(themeId);
    const theme = layers.find(t => t.id === themeId);
    if (theme) {
      toast({
        description: `All ${theme.name} layers cleared`,
        duration: 1500,
      });
    }
  }, [layers, onClearAll, toast]);

  const totalVisible = getTotalVisibleCount();

  return (
    <div ref={panelRef} className={cn("relative", className)}>
      {/* Floating Button - Icon only when compact */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setSelectedTheme(null);
        }}
        className={cn(
          "flex items-center justify-center transition-all duration-200",
          "bg-white dark:bg-card border-2 shadow-lg",
          "hover:shadow-xl active:scale-95",
          compact ? "w-10 h-10 rounded-xl" : "gap-2 px-4 py-3 rounded-xl",
          isOpen
            ? "border-primary shadow-primary/10"
            : "border-border hover:border-primary/40"
        )}
        aria-expanded={isOpen}
        aria-label="Toggle map layers"
        title="Map Layers"
      >
        <Layers className={cn(
          "w-5 h-5 transition-colors",
          isOpen ? "text-primary" : "text-muted-foreground"
        )} />
        {!compact && (
          <>
            <span className="text-sm font-semibold text-foreground">Layers</span>
            {totalVisible > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs font-bold rounded-full bg-primary text-primary-foreground">
                {totalVisible}
              </span>
            )}
          </>
        )}
        {compact && totalVisible > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 text-[10px] font-bold rounded-full bg-primary text-primary-foreground flex items-center justify-center">
            {totalVisible}
          </span>
        )}
      </button>

      {/* Panel Overlay - Opens upward when compact (bottom positioned) */}
      {isOpen && (
        <div 
          className={cn(
            "absolute z-[var(--z-flyout)]",
            "w-80 bg-white dark:bg-card rounded-2xl border border-border",
            "shadow-2xl animate-fade-in overflow-hidden",
            compact 
              ? "bottom-full left-0 mb-2" 
              : "top-full right-0 mt-2"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-3">
              {selectedTheme && (
                <button
                  onClick={() => setSelectedTheme(null)}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                  aria-label="Back to categories"
                >
                  <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  {selectedTheme ? selectedTheme.name : 'Map Layers'}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                setSelectedTheme(null);
              }}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Category List */}
          {!selectedTheme && (
            <div className="p-3 space-y-2 max-h-[400px] overflow-y-auto">
              {layers.map((theme) => {
                const visibleCount = getVisibleCount(theme);
                const totalCount = theme.layers.length;
                const hasVisibleLayers = visibleCount > 0;
                const CategoryIcon = getCategoryIcon(theme.name);

                return (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl transition-all",
                      "border hover:shadow-sm active:scale-[0.98]",
                      hasVisibleLayers
                        ? "bg-primary/5 border-primary/20 hover:bg-primary/10"
                        : "bg-muted/30 border-border hover:bg-muted/50"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                      hasVisibleLayers
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}>
                      <CategoryIcon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 text-left min-w-0">
                      <span className="text-sm font-semibold text-foreground block truncate">
                        {theme.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {visibleCount} of {totalCount} active
                      </span>
                    </div>

                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Layer List */}
          {selectedTheme && (
            <div className="flex flex-col max-h-[400px]">
              {/* Actions */}
              <div className="flex items-center justify-end gap-2 px-4 py-2 border-b border-border bg-muted/20">
                <button
                  onClick={() => handleSelectAll(selectedTheme.id)}
                  disabled={getVisibleCount(selectedTheme) === selectedTheme.layers.length}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
                    getVisibleCount(selectedTheme) === selectedTheme.layers.length
                      ? "text-muted-foreground/50 cursor-not-allowed"
                      : "text-primary hover:bg-primary/10 active:scale-95"
                  )}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  All
                </button>
                <button
                  onClick={() => handleClearAll(selectedTheme.id)}
                  disabled={getVisibleCount(selectedTheme) === 0}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
                    getVisibleCount(selectedTheme) === 0
                      ? "text-muted-foreground/50 cursor-not-allowed"
                      : "text-muted-foreground hover:bg-muted active:scale-95"
                  )}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Clear
                </button>
              </div>

              {/* Layers */}
              <div className="p-3 space-y-1.5 overflow-y-auto">
                {selectedTheme.layers.map((layer) => {
                  const LayerIcon = getCategoryIcon(layer.name);
                  const isHighlighted = highlightedLayerId === layer.id;

                  return (
                    <button
                      key={layer.id}
                      onClick={() => onLayerToggle(selectedTheme.id, layer.id)}
                      className={cn(
                        "w-full flex items-center gap-3 p-2.5 rounded-xl transition-all",
                        "border active:scale-[0.98]",
                        layer.visible
                          ? "bg-primary/5 border-primary/25"
                          : "bg-transparent border-transparent hover:bg-muted/40",
                        isHighlighted && "ring-2 ring-primary ring-offset-1"
                      )}
                      aria-pressed={layer.visible}
                    >
                      {/* Checkbox indicator */}
                      <div className={cn(
                        "w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all",
                        layer.visible
                          ? "bg-primary border-primary"
                          : "border-border bg-white dark:bg-card"
                      )}>
                        {layer.visible && (
                          <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />
                        )}
                      </div>

                      {/* Icon */}
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        layer.visible
                          ? "bg-primary/10 text-primary"
                          : "bg-muted/50 text-muted-foreground"
                      )}>
                        <LayerIcon className="w-4 h-4" />
                      </div>

                      {/* Label */}
                      <span className={cn(
                        "flex-1 text-left text-sm truncate",
                        layer.visible ? "font-medium text-foreground" : "text-foreground/70"
                      )}>
                        {layer.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
