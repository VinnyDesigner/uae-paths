import { useState } from 'react';
import { Layers, ChevronDown, ChevronUp } from 'lucide-react';
import { Heart, GraduationCap, Building2, Stethoscope, Pill, HeartPulse, Siren, Accessibility, Truck, Microscope, School, Building, BookOpen, Baby, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeGroup } from '@/types/map';
import { Switch } from '@/components/ui/switch';

interface LayerTogglePanelProps {
  layers: ThemeGroup[];
  onLayerToggle: (themeId: number, layerId: number) => void;
  className?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart, GraduationCap, Building2, Stethoscope, Pill, HeartPulse, 
  Siren, Accessibility, Truck, Microscope, School, Building, BookOpen, Baby, Users
};

function getIcon(iconName: string) {
  return iconMap[iconName] || Building2;
}

export function LayerTogglePanel({ layers, onLayerToggle, className }: LayerTogglePanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedTheme, setExpandedTheme] = useState<number | null>(null);

  const totalActiveLayers = layers.reduce(
    (acc, theme) => acc + theme.layers.filter(l => l.visible).length,
    0
  );

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-card rounded-xl shadow-lg border border-border px-3 py-2.5 hover:bg-secondary transition-colors"
      >
        <Layers className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Layers</span>
        {totalActiveLayers > 0 && (
          <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
            {totalActiveLayers}
          </span>
        )}
        <ChevronDown className={cn(
          "w-4 h-4 text-muted-foreground transition-transform",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[var(--z-popover-backdrop)]" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute bottom-full mb-2 right-0 bg-card rounded-xl shadow-xl border border-border overflow-hidden z-[var(--z-popover)] animate-fade-in w-72">
            <div className="p-3 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Map Layers</h3>
              <p className="text-xs text-muted-foreground">{totalActiveLayers} layers active</p>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {layers.map((theme) => {
                const ThemeIcon = getIcon(theme.icon);
                const activeCount = theme.layers.filter(l => l.visible).length;
                const isExpanded = expandedTheme === theme.id;
                
                return (
                  <div key={theme.id} className="border-b border-border last:border-b-0">
                    <button
                      onClick={() => setExpandedTheme(isExpanded ? null : theme.id)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          theme.colorClass === 'healthcare' ? 'bg-healthcare/10' : 'bg-education/10'
                        )}>
                          <ThemeIcon className={cn(
                            "w-4 h-4",
                            theme.colorClass === 'healthcare' ? 'text-healthcare' : 'text-education'
                          )} />
                        </div>
                        <div className="text-left">
                          <span className="text-sm font-medium text-foreground block">{theme.name}</span>
                          <span className="text-xs text-muted-foreground">{activeCount} active</span>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="px-4 pb-3 space-y-2">
                        {theme.layers.map((layer) => {
                          const LayerIcon = getIcon(layer.icon);
                          return (
                            <div
                              key={layer.id}
                              className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/30"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-6 h-6 rounded-md flex items-center justify-center"
                                  style={{ backgroundColor: layer.color }}
                                >
                                  <LayerIcon className="w-3.5 h-3.5 text-white" />
                                </div>
                                <span className="text-sm text-foreground">{layer.name}</span>
                              </div>
                              <Switch
                                checked={layer.visible}
                                onCheckedChange={() => onLayerToggle(theme.id, layer.id)}
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
