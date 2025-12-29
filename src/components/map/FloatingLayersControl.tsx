import { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Layers, 
  X,
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
  ChevronRight,
  Check,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeGroup } from '@/types/map';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface FloatingLayersControlProps {
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

function getIcon(iconName: string) {
  return iconMap[iconName] || Building2;
}

export function FloatingLayersControl({ 
  layers, 
  onLayerToggle, 
  onSelectAll,
  onClearAll,
  highlightedLayerId,
  className 
}: FloatingLayersControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedThemeId, setExpandedThemeId] = useState<number | null>(null);
  const { toast } = useToast();

  const activeLayerCount = layers.flatMap(t => t.layers).filter(l => l.visible).length;

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

  const toggleTheme = (themeId: number) => {
    setExpandedThemeId(prev => prev === themeId ? null : themeId);
  };

  return (
    <div className={cn("relative", className)}>
      {/* Toggle Button - matches other map control buttons */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "bg-card rounded-xl shadow-lg border border-border p-3 hover:bg-secondary hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          isOpen && "bg-secondary"
        )}
        title="Map Layers"
        aria-label="Toggle map layers"
        aria-expanded={isOpen}
      >
        <Layers className="w-5 h-5 text-foreground" />
        {activeLayerCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold text-primary-foreground">
            {activeLayerCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[var(--z-popover-backdrop)]" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute bottom-full right-0 mb-2 w-72 bg-card/95 backdrop-blur-xl rounded-xl shadow-xl border border-border overflow-hidden z-[var(--z-popover)] animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-foreground text-sm">Map Layers</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-secondary transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Layer Categories */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {layers.map((theme) => {
                const ThemeIcon = getIcon(theme.icon);
                const visibleCount = theme.layers.filter(l => l.visible).length;
                const isExpanded = expandedThemeId === theme.id;
                const hasVisibleLayers = visibleCount > 0;

                return (
                  <div key={theme.id} className="rounded-lg overflow-hidden">
                    {/* Theme Header */}
                    <button
                      onClick={() => toggleTheme(theme.id)}
                      className={cn(
                        "w-full flex items-center gap-3 p-2.5 rounded-lg transition-all",
                        isExpanded ? "bg-secondary" : "hover:bg-secondary/50"
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                          hasVisibleLayers 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-primary/10 text-primary"
                        )}
                      >
                        <ThemeIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-sm text-foreground">{theme.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {visibleCount}/{theme.layers.length} active
                        </p>
                      </div>
                      <ChevronRight
                        className={cn(
                          "w-4 h-4 text-muted-foreground transition-transform",
                          isExpanded && "rotate-90"
                        )}
                      />
                    </button>

                    {/* Individual Layers */}
                    {isExpanded && (
                      <div className="py-2 px-2 space-y-1 bg-secondary/30 rounded-b-lg">
                        {/* Quick Actions */}
                        <div className="flex gap-2 pb-2 mb-2 border-b border-border/50">
                          <button
                            onClick={() => handleSelectAll(theme.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          >
                            <Check className="w-3 h-3" />
                            Select All
                          </button>
                          <button
                            onClick={() => handleClearAll(theme.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-lg bg-secondary text-muted-foreground hover:bg-secondary/80 transition-colors"
                          >
                            <XCircle className="w-3 h-3" />
                            Clear All
                          </button>
                        </div>
                        
                        {theme.layers.map((layer) => {
                          const LayerIcon = getIcon(layer.icon);
                          const isHighlighted = highlightedLayerId === layer.id;
                          
                          return (
                            <div
                              key={layer.id}
                              className={cn(
                                "flex items-center gap-2 p-2 rounded-lg transition-all",
                                layer.visible ? "bg-card" : "hover:bg-card/50",
                                isHighlighted && "ring-2 ring-primary"
                              )}
                            >
                              <div
                                className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: layer.color + '15' }}
                              >
                                <LayerIcon
                                  className="w-3.5 h-3.5"
                                  style={{ color: layer.color }}
                                />
                              </div>
                              <span className="flex-1 text-xs text-foreground truncate">
                                {layer.name}
                              </span>
                              <Switch
                                checked={layer.visible}
                                onCheckedChange={() => onLayerToggle(theme.id, layer.id)}
                                className="scale-75"
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
