import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { DirectionsPanel } from '@/components/map/DirectionsPanel';
import { UnifiedSearchPanel } from '@/components/map/UnifiedSearchPanel';
import { FloatingLayersPanel } from '@/components/map/FloatingLayersPanel';
import { MobileBottomSheet } from '@/components/map/MobileBottomSheet';
import { SmartSearch } from '@/components/search/SmartSearch';
import { cn } from '@/lib/utils';
import { themeGroups } from '@/data/layers';
import { uaeFacilities } from '@/data/facilities';
import { useAISearch } from '@/hooks/useAISearch';
import { ThemeGroup, Facility, FilterState } from '@/types/map';

const HOSPITAL_LAYER_ID = 330;
const STORAGE_KEY = 'smartmap-panel-collapsed';

export default function SmartMapPage() {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const [searchParams] = useSearchParams();
  const [layers, setLayers] = useState<ThemeGroup[]>(themeGroups);
  const [filters, setFilters] = useState<FilterState>({
    emirate: 'All Emirates',
    distance: null,
    facilityTypes: [],
  });
  const [baseMapId, setBaseMapId] = useState('default');
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [directionsFacility, setDirectionsFacility] = useState<Facility | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>();
  const [highlightedLayerId, setHighlightedLayerId] = useState<number | null>(null);
  
  // Panel collapse state
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored === 'true';
    }
    return false;
  });

  const { isSearching, searchResults, searchIntent, userMessage, search, clearResults, getLayersToEnable } = useAISearch();

  // Persist collapse state
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, String(isPanelCollapsed));
  }, [isPanelCollapsed]);

  // Handle initial search from URL
  useEffect(() => {
    const query = searchParams.get('search');
    if (query) {
      search(query, userLocation);
    }
  }, [searchParams]);

  // Auto-enable layers when search returns results
  useEffect(() => {
    const layersToEnable = getLayersToEnable();
    if (layersToEnable.length > 0) {
      setLayers(prevLayers =>
        prevLayers.map(theme => ({
          ...theme,
          layers: theme.layers.map(layer => ({
            ...layer,
            visible: layersToEnable.includes(layer.id) ? true : layer.visible,
          })),
        }))
      );
    }
  }, [searchResults, getLayersToEnable]);

  const handleLayerToggle = (themeId: number, layerId: number) => {
    setLayers(prevLayers =>
      prevLayers.map(theme =>
        theme.id === themeId
          ? {
              ...theme,
              layers: theme.layers.map(layer =>
                layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
              ),
            }
          : theme
      )
    );
  };

  const handleSelectAll = (themeId: number) => {
    setLayers(prevLayers =>
      prevLayers.map(theme =>
        theme.id === themeId
          ? {
              ...theme,
              layers: theme.layers.map(layer => ({ ...layer, visible: true })),
            }
          : theme
      )
    );
  };

  const handleClearAll = (themeId: number) => {
    setLayers(prevLayers =>
      prevLayers.map(theme =>
        theme.id === themeId
          ? {
              ...theme,
              layers: theme.layers.map(layer => ({ ...layer, visible: false })),
            }
          : theme
      )
    );
  };

  const handleSearch = async (query: string) => {
    await search(query, userLocation);
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        }
      );
    }
  };

  const handleFacilityClick = (facility: Facility) => {
    setSelectedFacility(facility);
    setHighlightedLayerId(facility.layerId);
  };

  const handleClearResults = () => {
    clearResults();
    setHighlightedLayerId(null);
  };

  // Handle directions panel opening via custom event from map popup
  const handleOpenDirections = useCallback((event: CustomEvent<{ facilityId: string }>) => {
    const facility = uaeFacilities.find(f => f.id === event.detail.facilityId);
    if (facility) {
      setDirectionsFacility(facility);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('openDirections', handleOpenDirections as EventListener);
    return () => {
      window.removeEventListener('openDirections', handleOpenDirections as EventListener);
    };
  }, [handleOpenDirections]);

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />

      {/* Map Area */}
      <main className="flex-1 relative h-full min-h-[500px]">
        {/* Map Container - base layer */}
        <div className="absolute inset-0">
          <InteractiveMap
            layers={layers}
            facilities={uaeFacilities}
            searchResults={searchResults}
            selectedFacility={selectedFacility}
            onFacilitySelect={handleFacilityClick}
            suggestedZoom={searchIntent?.suggestedZoom}
            baseMapId={baseMapId}
            onBaseMapChange={setBaseMapId}
            className="h-full w-full"
          />
        </div>

        {/* Left Panel - Desktop (Search + Filters) */}
        <div
          className={cn(
            "hidden lg:flex flex-col absolute top-4 left-4 bottom-4",
            "bg-white/95 dark:bg-card/95 backdrop-blur-xl",
            "border border-border/60 shadow-xl",
            "rounded-2xl z-[var(--z-floating)]",
            "transition-all duration-300 ease-out",
            isPanelCollapsed ? "w-14" : "w-[340px]"
          )}
        >
          {/* Collapse Toggle */}
          <button
            onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
            className={cn(
              "absolute -right-3 top-8 z-50",
              "w-6 h-12 rounded-full",
              "bg-primary text-primary-foreground",
              "flex items-center justify-center",
              "shadow-lg shadow-primary/20",
              "hover:bg-primary/90 active:scale-95 transition-all",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            )}
            aria-label={isPanelCollapsed ? "Expand Panel" : "Collapse Panel"}
          >
            {isPanelCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>

          {/* Collapsed State */}
          {isPanelCollapsed && (
            <div className="flex flex-col items-center py-6 gap-4 animate-fade-in">
              <button
                onClick={() => setIsPanelCollapsed(false)}
                className="w-10 h-10 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center transition-colors"
                aria-label="Expand search panel"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </button>
            </div>
          )}

          {/* Expanded State */}
          {!isPanelCollapsed && (
            <div className="flex flex-col flex-1 overflow-hidden animate-fade-in">
              <div className="p-5 overflow-y-auto flex-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border">
                <UnifiedSearchPanel
                  onSearch={handleSearch}
                  onLocateMe={handleLocateMe}
                  isSearching={isSearching}
                  searchResults={searchResults.length}
                  userMessage={userMessage}
                  filters={filters}
                  onFilterChange={setFilters}
                />
              </div>
            </div>
          )}
        </div>

        {/* Bottom Right - Floating Layers Button (Desktop) - Left of legends */}
        <div className="hidden lg:block absolute bottom-6 right-52 z-[var(--z-floating)]">
          <FloatingLayersPanel
            layers={layers}
            onLayerToggle={handleLayerToggle}
            onSelectAll={handleSelectAll}
            onClearAll={handleClearAll}
            highlightedLayerId={highlightedLayerId}
            compact
          />
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden absolute top-3 left-3 right-3 z-[var(--z-popover)]">
          <div className="bg-white/98 dark:bg-card/98 backdrop-blur-xl rounded-xl shadow-lg border border-border/50 p-2">
            <SmartSearch 
              onSearch={handleSearch} 
              onLocateMe={handleLocateMe} 
              isSearching={isSearching}
              size="default"
            />
          </div>
          {searchResults.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{searchResults.length}</span>
              </div>
            </div>
          )}
        </div>

        {/* Mobile FAB - Layers Button */}
        <div className="lg:hidden absolute bottom-24 left-4 z-40">
          <button
            onClick={() => setMobileSheetOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground shadow-xl rounded-full px-4 py-3 min-h-[52px] hover:bg-primary/90 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Open layers and filters"
          >
            <Layers className="w-5 h-5" />
            <span className="text-sm font-semibold">Layers</span>
          </button>
        </div>
      </main>

      {/* Mobile Bottom Sheet */}
      <MobileBottomSheet
        isOpen={mobileSheetOpen}
        onClose={() => setMobileSheetOpen(false)}
        layers={layers}
        filters={filters}
        onFilterChange={setFilters}
        onLayerToggle={handleLayerToggle}
        onSelectAll={handleSelectAll}
        onClearAll={handleClearAll}
        highlightedLayerId={highlightedLayerId}
      />

      {/* Directions Panel */}
      {directionsFacility && (
        <>
          {/* Desktop */}
          <div className="hidden lg:block fixed top-1/2 right-8 -translate-y-1/2 z-[var(--z-modal)]">
            <DirectionsPanel 
              facility={directionsFacility} 
              onClose={() => setDirectionsFacility(null)} 
            />
          </div>
          {/* Mobile */}
          <div className="lg:hidden fixed inset-0 z-[var(--z-modal)]">
            <div 
              className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" 
              onClick={() => setDirectionsFacility(null)} 
            />
            <div className="absolute bottom-0 left-0 right-0 animate-slide-in-right">
              <DirectionsPanel 
                facility={directionsFacility} 
                onClose={() => setDirectionsFacility(null)}
                className="rounded-b-none"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
