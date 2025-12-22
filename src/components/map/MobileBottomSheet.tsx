import { useState, useRef, useEffect } from 'react';
import { X, Layers, Filter, ChevronRight, ChevronDown, Check, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeGroup, FilterState } from '@/types/map';
import { InlineFilters } from './InlineFilters';
import { LayerToggleButton } from './LayerToggleButton';
import { getCategoryColor, getCategoryIcon } from '@/lib/mapColors';

interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  layers: ThemeGroup[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onLayerToggle: (themeId: number, layerId: number) => void;
  onSelectAll: (themeId: number) => void;
  onClearAll: (themeId: number) => void;
  highlightedLayerId?: number | null;
}

type SheetState = 'peek' | 'half' | 'full';

export function MobileBottomSheet({
  isOpen,
  onClose,
  layers,
  filters,
  onFilterChange,
  onLayerToggle,
  onSelectAll,
  onClearAll,
  highlightedLayerId,
}: MobileBottomSheetProps) {
  const [sheetState, setSheetState] = useState<SheetState>('half');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [expandedThemeId, setExpandedThemeId] = useState<number | null>(null);
  const startY = useRef(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Sheet heights based on state
  const getSheetHeight = (state: SheetState) => {
    switch (state) {
      case 'peek': return '35vh';
      case 'half': return '55vh';
      case 'full': return '90vh';
    }
  };

  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    setDragOffset(diff);
  };

  // Handle touch end
  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Determine new state based on drag distance
    const threshold = 50;
    if (dragOffset > threshold) {
      // Dragged down
      if (sheetState === 'full') setSheetState('half');
      else if (sheetState === 'half') setSheetState('peek');
      else onClose();
    } else if (dragOffset < -threshold) {
      // Dragged up
      if (sheetState === 'peek') setSheetState('half');
      else if (sheetState === 'half') setSheetState('full');
    }
    setDragOffset(0);
  };

  // Expand to full when a category is selected
  const handleCategoryClick = (themeId: number) => {
    if (expandedThemeId === themeId) {
      setExpandedThemeId(null);
    } else {
      setExpandedThemeId(themeId);
      setSheetState('full');
    }
  };

  // Reset state when sheet opens
  useEffect(() => {
    if (isOpen) {
      setSheetState('half');
      setDragOffset(0);
      setExpandedThemeId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getVisibleCount = (theme: ThemeGroup) => 
    theme.layers.filter(l => l.visible).length;

  return (
    <div className="lg:hidden fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-foreground/20 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        ref={contentRef}
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-card rounded-t-[20px] border-t border-border flex flex-col shadow-2xl",
          !isDragging && "transition-all duration-300 ease-out"
        )}
        style={{
          height: getSheetHeight(sheetState),
          transform: isDragging ? `translateY(${Math.max(0, dragOffset)}px)` : undefined,
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Layers and Filters"
      >
        {/* Drag Handle */}
        <div
          className="flex flex-col items-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Header */}
        <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-base">Layers & Filters</h3>
              <p className="text-xs text-muted-foreground">Configure map display</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Close panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* Filters Section - Always visible in peek/half */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Filters</span>
            </div>
            <InlineFilters filters={filters} onFilterChange={onFilterChange} className="flex-wrap gap-2" />
          </div>

          {/* Categories Section */}
          <div className="p-4 space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Map Layers</span>
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
                  className="bg-secondary/50 rounded-xl overflow-hidden border border-border/50"
                >
                  {/* Category Card - Two Row Layout */}
                  <div className="p-4">
                    {/* Row 1: Icon + Title + Chevron - Single baseline */}
                    <button
                      onClick={() => handleCategoryClick(theme.id)}
                      className="w-full flex items-center gap-3 group/row"
                    >
                      {/* Fixed 40x40 icon container */}
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-active/row:scale-95"
                        style={{ backgroundColor: `${categoryColor.base}15` }}
                      >
                        <CategoryIcon 
                          className="w-5 h-5" 
                          style={{ color: categoryColor.base }}
                        />
                      </div>

                      {/* Title - vertically centered */}
                      <span className="flex-1 text-left text-base font-semibold text-foreground leading-tight truncate">
                        {theme.name}
                      </span>

                      {/* Right: Status + Chevron */}
                      <div className="flex items-center gap-2 flex-shrink-0">
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
                          "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
                          isExpanded ? "bg-primary/10" : "group-hover/row:bg-secondary"
                        )}>
                          <ChevronRight 
                            className={cn(
                              "w-5 h-5 text-muted-foreground transition-transform duration-200",
                              isExpanded && "rotate-90 text-primary"
                            )} 
                          />
                        </div>
                      </div>
                    </button>

                    {/* Subtle divider */}
                    <div className="h-px bg-border/30 mt-3 mb-3" />

                    {/* Row 2: Visibility Count (left) | Actions (right) */}
                    <div className="flex items-center justify-between h-8">
                      {/* Left: Visibility status */}
                      <span className="text-[13px] leading-8 text-muted-foreground whitespace-nowrap">
                        <span className="font-medium text-foreground">{visibleCount}</span>
                        <span className="mx-1">of</span>
                        <span>{totalCount}</span>
                        <span className="ml-1">visible</span>
                      </span>

                      {/* Right: Action buttons */}
                      <div className="flex items-center h-8">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectAll(theme.id);
                          }}
                          disabled={allSelected}
                          className={cn(
                            "text-[13px] leading-8 px-2 rounded-md font-medium transition-all",
                            allSelected
                              ? "text-muted-foreground/40 cursor-not-allowed"
                              : "text-primary active:scale-95"
                          )}
                        >
                          Select All
                        </button>
                        <span className="text-border/50 text-[13px] leading-8 mx-0.5 select-none">|</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onClearAll(theme.id);
                          }}
                          disabled={visibleCount === 0}
                          className={cn(
                            "text-[13px] leading-8 px-2 rounded-md font-medium transition-all",
                            visibleCount === 0
                              ? "text-muted-foreground/40 cursor-not-allowed"
                              : "text-muted-foreground active:scale-95"
                          )}
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Layer Items - Level 2 (Expanded) */}
                  <div className={cn(
                    "overflow-hidden transition-all duration-300 ease-out",
                    isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  )}>
                    {/* Bulk Actions */}
                    <div className="px-4 py-2 bg-secondary/30 border-t border-border/30 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {visibleCount} layer{visibleCount !== 1 ? 's' : ''} active
                      </span>
                      <div className="flex gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectAll(theme.id);
                          }}
                          className="text-xs font-medium text-primary hover:text-primary/80 transition-colors min-h-[32px] px-2"
                        >
                          Select All
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onClearAll(theme.id);
                          }}
                          disabled={visibleCount === 0}
                          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed min-h-[32px] px-2"
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
                              "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 min-h-[52px]",
                              "hover:bg-secondary active:scale-[0.98]",
                              layer.visible && "bg-secondary/80",
                              isHighlighted && "ring-2 ring-primary ring-offset-1"
                            )}
                            style={{
                              borderLeft: layer.visible ? `3px solid ${layerColor.base}` : '3px solid transparent'
                            }}
                          >
                            {/* Layer Icon */}
                            <div 
                              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                              style={{ 
                                backgroundColor: layer.visible ? `${layerColor.base}15` : 'transparent',
                                opacity: layer.visible ? 1 : 0.5
                              }}
                            >
                              <LayerIcon 
                                className="w-4 h-4 transition-colors duration-200" 
                                style={{ color: layer.visible ? layerColor.base : 'currentColor' }}
                              />
                            </div>

                            {/* Layer Name */}
                            <span className={cn(
                              "flex-1 text-left text-sm transition-colors duration-200",
                              layer.visible ? "text-foreground font-medium" : "text-muted-foreground"
                            )}>
                              {layer.name}
                            </span>

                            {/* Toggle Indicator */}
                            <LayerToggleButton
                              visible={layer.visible}
                              color={layerColor.base}
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

        {/* Done Button - Sticky Footer */}
        <div className="p-4 border-t border-border bg-card">
          <button
            onClick={onClose}
            className="w-full py-3.5 px-4 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 min-h-[48px]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
