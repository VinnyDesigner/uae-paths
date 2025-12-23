import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Layers, Filter, ChevronRight, ArrowLeft, Check, CheckCircle2, XCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeGroup, FilterState } from '@/types/map';
import { InlineFilters } from './InlineFilters';
import { getCategoryIcon } from '@/lib/mapColors';

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
  const [selectedThemeId, setSelectedThemeId] = useState<number | null>(null);
  const [togglingLayerId, setTogglingLayerId] = useState<number | null>(null);

  // Derive selectedTheme from layers prop to always have fresh data
  const selectedTheme = selectedThemeId !== null 
    ? layers.find(t => t.id === selectedThemeId) ?? null 
    : null;
  const startY = useRef(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Sheet heights - max 85% to leave breathing room at top
  const getSheetHeight = (state: SheetState) => {
    switch (state) {
      case 'peek': return '35vh';
      case 'half': return '55vh';
      case 'full': return '85vh';
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 50;
    if (dragOffset > threshold) {
      if (sheetState === 'full') setSheetState('half');
      else if (sheetState === 'half') setSheetState('peek');
      else onClose();
    } else if (dragOffset < -threshold) {
      if (sheetState === 'peek') setSheetState('half');
      else if (sheetState === 'half') setSheetState('full');
    }
    setDragOffset(0);
  };

  const handleCategoryClick = (theme: ThemeGroup) => {
    setSelectedThemeId(theme.id);
    setSheetLevel('layers');
    setSheetState('full');
  };

  const handleBackToCategories = () => {
    setSheetLevel('categories');
    setSelectedThemeId(null);
    setSheetState('half');
  };

  // Handle layer toggle with animation feedback
  const handleLayerToggle = useCallback((themeId: number, layerId: number) => {
    setTogglingLayerId(layerId);
    onLayerToggle(themeId, layerId);
    setTimeout(() => setTogglingLayerId(null), 150);
  }, [onLayerToggle]);

  useEffect(() => {
    if (isOpen) {
      setSheetState('half');
      setDragOffset(0);
      setSheetLevel('categories');
      setSelectedThemeId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getVisibleCount = (theme: ThemeGroup) => 
    theme.layers.filter(l => l.visible).length;

  return (
    <div className="lg:hidden fixed inset-0 z-[70]">
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
          "absolute bottom-0 left-0 right-0 bg-card rounded-t-[20px] border-t border-border",
          "flex flex-col shadow-2xl",
          !isDragging && "transition-all duration-300 ease-out"
        )}
        style={{
          height: getSheetHeight(sheetState),
          transform: isDragging ? `translateY(${Math.max(0, dragOffset)}px)` : undefined,
          paddingBottom: 'env(safe-area-inset-bottom, 16px)',
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

        {/* Header - Categories Level */}
        {sheetLevel === 'categories' && (
          <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between flex-shrink-0">
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
              className="p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Header - Layers Level */}
        {sheetLevel === 'layers' && selectedTheme && (
          <div className="bg-card border-b border-border px-4 py-3 flex-shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToCategories}
                className="w-10 h-10 rounded-xl bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors min-h-[44px] min-w-[44px]"
                aria-label="Back"
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
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Actions row */}
            <div className="flex items-center justify-end gap-2 mt-3">
              <button
                onClick={() => onSelectAll(selectedTheme.id)}
                disabled={getVisibleCount(selectedTheme) === selectedTheme.layers.length}
                className={cn(
                  "flex items-center gap-1.5 px-3 h-9 rounded-lg text-sm font-medium transition-all duration-120",
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
                  "flex items-center gap-1.5 px-3 h-9 rounded-lg text-sm font-medium transition-all duration-120",
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

        {/* Content - Categories */}
        {sheetLevel === 'categories' && (
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {/* Filters */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Filters</span>
              </div>
              <InlineFilters filters={filters} onFilterChange={onFilterChange} className="flex-wrap gap-2" />
            </div>

            {/* Categories */}
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
                const CategoryIcon = getCategoryIcon(theme.name);

                return (
                  <div 
                    key={theme.id} 
                    className="bg-secondary/40 rounded-xl overflow-hidden border border-border/50"
                  >
                    <div className="p-4">
                      {/* Row 1: 3-column grid - Icon (44px) | Title (flex) | Status+Chevron */}
                      <button
                        onClick={() => handleCategoryClick(theme)}
                        className="w-full grid grid-cols-[44px_1fr_auto] items-center gap-3 group/row active:scale-[0.98] transition-transform duration-120"
                      >
                        {/* Icon - Fixed 44x44, unified primary color */}
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-primary/10">
                          <CategoryIcon className="w-5 h-5 text-primary" />
                        </div>

                        {/* Title */}
                        <span className="text-left text-base font-semibold text-foreground line-clamp-2 leading-snug">
                          {theme.name}
                        </span>

                        {/* Status + Chevron - unified primary color */}
                        <div className="flex items-center gap-2">
                          {allSelected && (
                            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-primary/15">
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                            </div>
                          )}
                          {someSelected && (
                            <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                              {visibleCount}
                            </div>
                          )}
                          {/* Chevron - Fixed 40x40 */}
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center group-active/row:bg-secondary">
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </div>
                      </button>

                      {/* Divider */}
                      <div className="h-px bg-border/40 my-3" />

                      {/* Row 2: Counter + Actions - Grid alignment */}
                      <div className="grid grid-cols-2 items-center h-8">
                        <span className="text-sm text-muted-foreground">
                          <span className="font-semibold text-foreground">{visibleCount}</span>
                          <span className="mx-1">of</span>
                          <span>{totalCount}</span>
                          <span className="ml-1">visible</span>
                        </span>

                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectAll(theme.id);
                            }}
                            disabled={allSelected}
                            className={cn(
                              "text-xs px-2 h-7 rounded-md font-medium transition-all duration-120",
                              allSelected
                                ? "text-muted-foreground/40 cursor-not-allowed"
                                : "text-primary active:scale-95"
                            )}
                          >
                            All
                          </button>
                          <span className="text-muted-foreground/30 text-xs">|</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onClearAll(theme.id);
                            }}
                            disabled={visibleCount === 0}
                            className={cn(
                              "text-xs px-2 h-7 rounded-md font-medium transition-all duration-120",
                              visibleCount === 0
                                ? "text-muted-foreground/40 cursor-not-allowed"
                                : "text-muted-foreground active:scale-95"
                            )}
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sticky Footer */}
            <div className="sticky bottom-0 p-4 bg-card border-t border-border">
              <button
                onClick={onClose}
                className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-xl font-semibold text-sm shadow-lg hover:bg-primary/90 active:scale-[0.98] transition-all duration-150"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Content - Layers */}
        {sheetLevel === 'layers' && selectedTheme && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-2">
            {selectedTheme.layers.map(layer => {
                const LayerIcon = getCategoryIcon(layer.name);
                const isHighlighted = highlightedLayerId === layer.id;
                const isToggling = togglingLayerId === layer.id;

                return (
                  <button
                    key={layer.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLayerToggle(selectedTheme.id, layer.id);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl min-h-[60px]",
                      "transition-all duration-120 active:scale-[0.98]",
                      // Unified selection styling - primary color only
                      layer.visible 
                        ? "bg-[var(--selection-bg)] border-2 border-[var(--selection-border)] shadow-sm" 
                        : "bg-transparent border border-border/50 hover:bg-[var(--selection-bg-hover)]",
                      isHighlighted && "ring-2 ring-primary ring-offset-1",
                      isToggling && "scale-[0.98]"
                    )}
                    aria-selected={layer.visible}
                    role="button"
                    tabIndex={0}
                  >
                    {/* Icon - primary tint when selected */}
                    <div 
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-120",
                        layer.visible 
                          ? "bg-primary/10 shadow-sm" 
                          : "bg-muted/30 opacity-60"
                      )}
                    >
                      <LayerIcon 
                        className={cn(
                          "w-5 h-5 transition-transform duration-120",
                          layer.visible 
                            ? "scale-100 text-primary" 
                            : "scale-95 text-muted-foreground"
                        )}
                      />
                    </div>

                    {/* Text */}
                    <div className="flex-1 text-left min-w-0">
                      <span className={cn(
                        "block text-sm truncate transition-colors duration-120",
                        layer.visible ? "font-semibold text-foreground" : "font-medium text-foreground/75"
                      )}>
                        {layer.name}
                      </span>
                      <p className={cn(
                        "text-xs truncate mt-0.5 transition-colors duration-120",
                        layer.visible ? "text-muted-foreground" : "text-muted-foreground/60"
                      )}>
                        {layer.description}
                      </p>
                    </div>

                    {/* Unified check indicator - primary color only */}
                    <div 
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-120",
                        layer.visible ? "bg-primary/10 shadow-sm" : "bg-muted/20"
                      )}
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center transition-all duration-120",
                          layer.visible 
                            ? "bg-primary" 
                            : "border-2 border-muted-foreground/25",
                          isToggling && "scale-90"
                        )}
                      >
                        {layer.visible ? (
                          <Check className={cn(
                            "w-3 h-3 text-white transition-transform duration-120",
                            isToggling && "scale-110"
                          )} />
                        ) : (
                          <Circle className="w-2 h-2 text-muted-foreground/30" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Sticky Footer */}
            <div className="flex-shrink-0 p-4 bg-card border-t border-border">
              <button
                onClick={onClose}
                className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-xl font-semibold text-sm shadow-lg hover:bg-primary/90 active:scale-[0.98] transition-all duration-150"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}