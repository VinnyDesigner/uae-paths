import { useState, useRef, useEffect } from 'react';
import { X, Layers, Filter, ChevronRight, ArrowLeft, Check, CheckCircle2, XCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeGroup, FilterState } from '@/types/map';
import { InlineFilters } from './InlineFilters';
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
type SheetLevel = 'categories' | 'layers';

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
  const [sheetLevel, setSheetLevel] = useState<SheetLevel>('categories');
  const [selectedTheme, setSelectedTheme] = useState<ThemeGroup | null>(null);
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

  // Navigate to layer list (level 2)
  const handleCategoryClick = (theme: ThemeGroup) => {
    setSelectedTheme(theme);
    setSheetLevel('layers');
    setSheetState('full');
  };

  // Navigate back to categories (level 1)
  const handleBackToCategories = () => {
    setSheetLevel('categories');
    setSelectedTheme(null);
    setSheetState('half');
  };

  // Reset state when sheet opens
  useEffect(() => {
    if (isOpen) {
      setSheetState('half');
      setDragOffset(0);
      setSheetLevel('categories');
      setSelectedTheme(null);
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

        {/* Header - Level 1 (Categories) */}
        {sheetLevel === 'categories' && (
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
        )}

        {/* Header - Level 2 (Layer List) */}
        {sheetLevel === 'layers' && selectedTheme && (
          <div className="bg-card border-b border-border px-4 py-3">
            {/* Row 1: Back + Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToCategories}
                className="w-10 h-10 rounded-xl bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors min-h-[44px] min-w-[44px]"
                aria-label="Back to categories"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-base truncate">{selectedTheme.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {getVisibleCount(selectedTheme)} of {selectedTheme.layers.length} visible
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
                aria-label="Close panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Row 2: Actions */}
            <div className="flex items-center justify-end gap-2 mt-3">
              <button
                onClick={() => onSelectAll(selectedTheme.id)}
                disabled={getVisibleCount(selectedTheme) === selectedTheme.layers.length}
                className={cn(
                  "flex items-center gap-1.5 px-3 h-9 rounded-lg text-sm font-medium transition-all",
                  getVisibleCount(selectedTheme) === selectedTheme.layers.length
                    ? "bg-muted/30 text-muted-foreground/40 cursor-not-allowed"
                    : "bg-primary/10 text-primary active:scale-95"
                )}
              >
                <CheckCircle2 className="w-4 h-4" />
                Select All
              </button>
              <button
                onClick={() => onClearAll(selectedTheme.id)}
                disabled={getVisibleCount(selectedTheme) === 0}
                className={cn(
                  "flex items-center gap-1.5 px-3 h-9 rounded-lg text-sm font-medium transition-all",
                  getVisibleCount(selectedTheme) === 0
                    ? "bg-muted/30 text-muted-foreground/40 cursor-not-allowed"
                    : "bg-muted/50 text-muted-foreground active:scale-95"
                )}
              >
                <XCircle className="w-4 h-4" />
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Content - Level 1 (Categories) */}
        {sheetLevel === 'categories' && (
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {/* Filters Section */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Filters</span>
              </div>
              <InlineFilters filters={filters} onFilterChange={onFilterChange} className="flex-wrap gap-2" />
            </div>

            {/* Categories Section */}
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Map Layers</span>
              </div>

              {layers.map(theme => {
                const visibleCount = getVisibleCount(theme);
                const totalCount = theme.layers.length;
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
                      {/* Row 1: Icon + Title + Status + Chevron - Grid layout */}
                      <button
                        onClick={() => handleCategoryClick(theme)}
                        className="w-full grid items-center gap-3 group/row active:scale-[0.98] transition-transform"
                        style={{ gridTemplateColumns: '40px 1fr auto 32px' }}
                      >
                        {/* Fixed 40x40 icon container */}
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${categoryColor.base}15` }}
                        >
                          <CategoryIcon 
                            className="w-5 h-5" 
                            style={{ color: categoryColor.base }}
                          />
                        </div>

                        {/* Title - vertically centered */}
                        <span className="text-left text-base font-semibold text-foreground leading-tight truncate">
                          {theme.name}
                        </span>

                        {/* Status indicator */}
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
                        </div>

                        {/* Chevron */}
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center group-active/row:bg-secondary">
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
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
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Content - Level 2 (Layer List) */}
        {sheetLevel === 'layers' && selectedTheme && (
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-2">
            {selectedTheme.layers.map(layer => {
              const layerColor = getCategoryColor(layer.name);
              const LayerIcon = getCategoryIcon(layer.name);
              const isHighlighted = highlightedLayerId === layer.id;

              return (
                <button
                  key={layer.id}
                  onClick={() => onLayerToggle(selectedTheme.id, layer.id)}
                  className={cn(
                    "w-full grid items-center gap-3 p-3 rounded-xl transition-all duration-150 min-h-[60px]",
                    "active:scale-[0.98]",
                    layer.visible 
                      ? "bg-white/60 dark:bg-white/10 border border-white/50 dark:border-white/20 shadow-sm" 
                      : "bg-white/20 dark:bg-white/5 border border-transparent",
                    isHighlighted && "ring-2 ring-primary ring-offset-1"
                  )}
                  style={{ gridTemplateColumns: '40px 1fr 40px' }}
                >
                  {/* Layer Icon */}
                  <div 
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150",
                      layer.visible ? "shadow-sm" : "opacity-60"
                    )}
                    style={{ backgroundColor: `${layerColor.base}15` }}
                  >
                    <LayerIcon 
                      className={cn(
                        "w-5 h-5 transition-all duration-150",
                        layer.visible ? "scale-100" : "scale-[0.98]"
                      )}
                      style={{ color: layerColor.base }}
                    />
                  </div>

                  {/* Layer Name + Description */}
                  <div className="text-left min-w-0">
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

                  {/* Toggle Indicator */}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150",
                      layer.visible ? "shadow-sm" : "bg-muted/20"
                    )}
                    style={{
                      backgroundColor: layer.visible ? `${layerColor.base}20` : undefined,
                    }}
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-150",
                        layer.visible
                          ? "border-transparent"
                          : "border-muted-foreground/25"
                      )}
                      style={{
                        backgroundColor: layer.visible ? layerColor.base : 'transparent',
                      }}
                    >
                      {layer.visible ? (
                        <Check className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <Circle className="w-3 h-3 text-muted-foreground/30" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

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