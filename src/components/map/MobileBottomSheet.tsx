import { useState, useRef, useEffect } from 'react';
import { X, Layers, Filter, GripHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeGroup, FilterState } from '@/types/map';
import { SidePanelLayers } from './SidePanelLayers';
import { InlineFilters } from './InlineFilters';

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
  const startY = useRef(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Sheet heights based on state
  const getSheetHeight = (state: SheetState) => {
    switch (state) {
      case 'peek': return '30vh';
      case 'half': return '60vh';
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

  // Reset state when sheet opens
  useEffect(() => {
    if (isOpen) {
      setSheetState('half');
      setDragOffset(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
          "absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl border-t border-border flex flex-col",
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
          <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
          <div className="flex items-center gap-1 mt-1">
            <GripHorizontal className="w-4 h-4 text-muted-foreground/50" />
          </div>
        </div>

        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-4 py-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground">Layers & Filters</h3>
              <p className="text-xs text-muted-foreground">Configure map display</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Close panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-6">
          {/* Filters Section */}
          <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary" />
              Filters
            </h4>
            <InlineFilters filters={filters} onFilterChange={onFilterChange} className="flex-wrap" />
          </div>

          {/* Layers Section */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2 px-1">
              <Layers className="w-4 h-4 text-primary" />
              Map Layers
            </h4>
            <SidePanelLayers
              layers={layers}
              onLayerToggle={onLayerToggle}
              onSelectAll={onSelectAll}
              onClearAll={onClearAll}
              highlightedLayerId={highlightedLayerId}
            />
          </div>
        </div>

        {/* Safe area padding */}
        <div className="h-6 flex-shrink-0" />
      </div>
    </div>
  );
}
