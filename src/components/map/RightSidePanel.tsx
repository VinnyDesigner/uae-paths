import { X, Layers, Filter, ChevronRight, ChevronDown, CheckCircle2, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeGroup, FilterState } from '@/types/map';
import { InlineFilters } from './InlineFilters';
import { LayerToggleButton } from './LayerToggleButton';
import { getCategoryColor, getCategoryIcon } from '@/lib/mapColors';
import { useState } from 'react';

interface RightSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  layers: ThemeGroup[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onLayerToggle: (themeId: number, layerId: number) => void;
  onSelectAll: (themeId: number) => void;
  onClearAll: (themeId: number) => void;
  highlightedLayerId?: number | null;
  searchContext?: string;
}

export function RightSidePanel({
  isOpen,
  onClose,
  layers,
  filters,
  onFilterChange,
  onLayerToggle,
  onSelectAll,
  onClearAll,
  highlightedLayerId,
  searchContext,
}: RightSidePanelProps) {
  const [expandedThemeId, setExpandedThemeId] = useState<number | null>(null);

  const handleCategoryClick = (themeId: number) => {
    setExpandedThemeId(expandedThemeId === themeId ? null : themeId);
  };

  const getVisibleCount = (theme: ThemeGroup) =>
    theme.layers.filter(l => l.visible).length;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-foreground/10 backdrop-blur-[2px] transition-opacity duration-300 z-[1050]",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-[380px] max-w-[90vw] bg-card border-l border-border shadow-2xl z-[1051] flex flex-col transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Layers and Filters"
      >
        {/* Header */}
        <div className="flex-shrink-0 border-b border-border bg-card">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Layers className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground text-base">Layers & Filters</h2>
                <p className="text-xs text-muted-foreground">Configure map display</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Context */}
          {searchContext && (
            <div className="px-4 pb-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2">
                <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span className="line-clamp-1">{searchContext}</span>
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* Filters Section */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Filters</span>
            </div>
            <InlineFilters filters={filters} onFilterChange={onFilterChange} className="flex-col gap-3" />
          </div>

          {/* Map Layers Section */}
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Map Layers</span>
            </div>

            {layers.map(theme => {
              const visibleCount = getVisibleCount(theme);
              const totalCount = theme.layers.length;
              const isExpanded = expandedThemeId === theme.id;
              const allSelected = visibleCount === totalCount;
              const someSelected = visibleCount > 0 && visibleCount < totalCount;
              const categoryColor = getCategoryColor(theme.name);
              const CategoryIcon = getCategoryIcon(theme.name);

              return (
                <div
                  key={theme.id}
                  className="bg-secondary/30 rounded-xl overflow-hidden border border-border/50 transition-all duration-200 hover:bg-secondary/40"
                >
                  {/* Category Header */}
                  <button
                    onClick={() => handleCategoryClick(theme.id)}
                    className="w-full flex items-center gap-3 p-3.5 text-left transition-colors"
                  >
                    {/* Category Icon */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200"
                      style={{ backgroundColor: `${categoryColor.base}12` }}
                    >
                      <CategoryIcon
                        className="w-5 h-5"
                        style={{ color: categoryColor.base }}
                      />
                    </div>

                    {/* Category Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground text-sm">{theme.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {visibleCount} of {totalCount} visible
                      </div>
                    </div>

                    {/* Status Indicator */}
                    <div className="flex items-center gap-2">
                      {allSelected && (
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${categoryColor.base}20` }}
                        >
                          <CheckCircle2
                            className="w-4 h-4"
                            style={{ color: categoryColor.base }}
                          />
                        </div>
                      )}
                      {someSelected && (
                        <div
                          className="px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${categoryColor.base}15`,
                            color: categoryColor.base
                          }}
                        >
                          {visibleCount}
                        </div>
                      )}
                      <div className={cn(
                        "transition-transform duration-200",
                        isExpanded && "rotate-90"
                      )}>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  </button>

                  {/* Expanded Layer Items */}
                  <div className={cn(
                    "overflow-hidden transition-all duration-300 ease-out",
                    isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                  )}>
                    {/* Bulk Actions */}
                    <div className="px-4 py-2.5 bg-secondary/40 border-t border-border/30 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {visibleCount} layer{visibleCount !== 1 ? 's' : ''} active
                      </span>
                      <div className="flex gap-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectAll(theme.id);
                          }}
                          className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                          Select All
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onClearAll(theme.id);
                          }}
                          disabled={visibleCount === 0}
                          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>

                    {/* Layer List */}
                    <div className="px-3 py-2 space-y-1">
                      {theme.layers.map(layer => {
                        const layerColor = getCategoryColor(layer.name);
                        const LayerIcon = getCategoryIcon(layer.name);
                        const isHighlighted = highlightedLayerId === layer.id;

                        return (
                          <button
                            key={layer.id}
                            onClick={() => onLayerToggle(theme.id, layer.id)}
                            className={cn(
                              "group w-full flex items-center gap-3 p-2.5 rounded-lg transition-all duration-200",
                              "hover:bg-secondary/60 active:scale-[0.98]",
                              layer.visible && "bg-secondary/50",
                              isHighlighted && "ring-2 ring-primary ring-offset-1"
                            )}
                            style={{
                              borderLeft: layer.visible ? `3px solid ${layerColor.base}` : '3px solid transparent'
                            }}
                          >
                            {/* Layer Icon */}
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                              style={{
                                backgroundColor: layer.visible ? `${layerColor.base}12` : 'transparent',
                                opacity: layer.visible ? 1 : 0.6
                              }}
                            >
                              <LayerIcon
                                className="w-4 h-4 transition-colors duration-200"
                                style={{ color: layer.visible ? layerColor.base : 'currentColor' }}
                              />
                            </div>

                            {/* Layer Info */}
                            <div className="flex-1 min-w-0 text-left">
                              <span className={cn(
                                "block text-sm transition-colors duration-200 truncate",
                                layer.visible ? "text-foreground font-medium" : "text-muted-foreground"
                              )}>
                                {layer.name}
                              </span>
                              {layer.description && (
                                <span className="block text-xs text-muted-foreground/70 truncate">
                                  {layer.description}
                                </span>
                              )}
                            </div>

                            {/* Toggle Indicator */}
                            <LayerToggleButton
                              visible={layer.visible}
                              color={layerColor.base}
                              className="w-8 h-8"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-border bg-card">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 active:scale-[0.98] transition-all duration-200"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </>
  );
}
