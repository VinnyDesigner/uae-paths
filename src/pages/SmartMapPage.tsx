import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, Layers, MapPin } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { SmartSearch } from '@/components/search/SmartSearch';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { DirectionsPanel } from '@/components/map/DirectionsPanel';
import { RightSidePanel } from '@/components/map/RightSidePanel';
import { MobileBottomSheet } from '@/components/map/MobileBottomSheet';
import { cn } from '@/lib/utils';
import { themeGroups } from '@/data/layers';
import { uaeFacilities } from '@/data/facilities';
import { useAISearch } from '@/hooks/useAISearch';
import { ThemeGroup, Facility, FilterState } from '@/types/map';

const HOSPITAL_LAYER_ID = 330;

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
  const [layersPanelOpen, setLayersPanelOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [directionsFacility, setDirectionsFacility] = useState<Facility | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>();
  const [highlightedLayerId, setHighlightedLayerId] = useState<number | null>(null);

  const { isSearching, searchResults, searchIntent, userMessage, search, clearResults, getLayersToEnable } = useAISearch();

  // Determine if hospitals layer is active based on search results or visible layers
  const activeHospitalLayer = useMemo(() => {
    const hasHospitalResults = searchResults.some(r => r.layerId === HOSPITAL_LAYER_ID);
    const isHospitalLayerVisible = layers.some(theme =>
      theme.layers.some(l => l.id === HOSPITAL_LAYER_ID && l.visible)
    );
    return hasHospitalResults || isHospitalLayerVisible ? HOSPITAL_LAYER_ID : null;
  }, [searchResults, layers]);

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

  // Count total visible layers
  const visibleLayerCount = useMemo(() => {
    return layers.reduce((acc, theme) => acc + theme.layers.filter(l => l.visible).length, 0);
  }, [layers]);

  // Generate search context message
  const searchContext = useMemo(() => {
    if (searchResults.length > 0 && searchIntent?.responseMessage) {
      return `${searchResults.length} facilities found – ${searchIntent.responseMessage}`;
    }
    if (searchResults.length > 0) {
      return `Showing ${searchResults.length} ${searchResults.length === 1 ? 'facility' : 'facilities'}`;
    }
    return undefined;
  }, [searchResults, searchIntent]);

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />

      {/* Map Area */}
      <main className="flex-1 relative h-full min-h-[500px]">
        {/* Desktop/Tablet: Left Search Panel (Compact - No Layers) */}
        <div className="hidden md:flex flex-col w-80 absolute top-4 left-4 z-[1001] space-y-3">
          {/* Search Card */}
          <div className="bg-white/40 dark:bg-card/40 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-2xl shadow-xl p-4">
            <div className="bg-white/50 dark:bg-white/5 rounded-xl p-3 border border-white/20 dark:border-white/10 transition-all hover:bg-white/60 dark:hover:bg-white/10">
              <SmartSearch
                onSearch={handleSearch}
                onLocateMe={handleLocateMe}
                isSearching={isSearching}
                size="default"
                activeLayerId={activeHospitalLayer}
              />
            </div>

            {userMessage && (
              <div className="mt-3 flex items-center gap-2 text-sm text-foreground/80 bg-white/40 dark:bg-white/5 backdrop-blur-sm rounded-xl px-3 py-2.5 border border-white/20 dark:border-white/10">
                <Sparkles className="w-3 h-3 text-primary flex-shrink-0" />
                <span className="line-clamp-2">{userMessage}</span>
              </div>
            )}
          </div>

          {/* Search Results Count */}
          {searchResults.length > 0 && (
            <div className="bg-white/40 dark:bg-card/40 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-xl shadow-lg px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-medium">{searchResults.length}</span>
                <span className="text-muted-foreground">
                  {searchResults.length === 1 ? 'facility' : 'facilities'} found
                </span>
              </div>
              {searchIntent?.responseMessage && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {searchIntent.responseMessage}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Mobile Search Bar Overlay - Compact */}
        <div className="md:hidden absolute top-2 left-3 right-3 z-[1001]">
          <SmartSearch onSearch={handleSearch} onLocateMe={handleLocateMe} isSearching={isSearching} />
          {userMessage && (
            <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground bg-card/95 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow-lg border border-border">
              <Sparkles className="w-3 h-3 text-primary flex-shrink-0" />
              <span className="truncate">{userMessage}</span>
            </div>
          )}
        </div>

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

        {/* Layers & Filters FAB - Desktop/Tablet (Right side) */}
        <div className="hidden md:block absolute bottom-24 right-4 z-[1001]">
          <button
            onClick={() => setLayersPanelOpen(true)}
            className="group flex items-center gap-2.5 bg-card text-foreground shadow-lg rounded-xl px-4 py-3 border border-border hover:bg-secondary hover:shadow-xl active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Open layers and filters"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
              <Layers className="w-4 h-4 text-primary" />
            </div>
            <div className="text-left">
              <span className="text-sm font-medium block">Layers & Filters</span>
              <span className="text-xs text-muted-foreground">{visibleLayerCount} active</span>
            </div>
          </button>
        </div>

        {/* Mobile FAB - Layers Button */}
        <div className="md:hidden absolute bottom-20 left-4 z-[1001]">
          <button
            onClick={() => setLayersPanelOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground shadow-lg rounded-full px-4 py-3 min-h-[48px] hover:bg-primary/90 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Open layers and filters"
          >
            <Layers className="w-5 h-5" />
            <span className="text-sm font-medium">Layers</span>
            {visibleLayerCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-primary-foreground/20 rounded-full text-xs font-medium">
                {visibleLayerCount}
              </span>
            )}
          </button>
        </div>
      </main>

      {/* Desktop/Tablet: Right Side Panel */}
      <div className="hidden md:block">
        <RightSidePanel
          isOpen={layersPanelOpen}
          onClose={() => setLayersPanelOpen(false)}
          layers={layers}
          filters={filters}
          onFilterChange={setFilters}
          onLayerToggle={handleLayerToggle}
          onSelectAll={handleSelectAll}
          onClearAll={handleClearAll}
          highlightedLayerId={highlightedLayerId}
          searchContext={searchContext}
        />
      </div>

      {/* Mobile: Bottom Sheet */}
      <div className="md:hidden">
        <MobileBottomSheet
          isOpen={layersPanelOpen}
          onClose={() => setLayersPanelOpen(false)}
          layers={layers}
          filters={filters}
          onFilterChange={setFilters}
          onLayerToggle={handleLayerToggle}
          onSelectAll={handleSelectAll}
          onClearAll={handleClearAll}
          highlightedLayerId={highlightedLayerId}
        />
      </div>

      {/* Directions Panel */}
      {directionsFacility && (
        <>
          {/* Desktop */}
          <div className="hidden lg:block fixed top-1/2 right-8 -translate-y-1/2 z-[1100]">
            <DirectionsPanel
              facility={directionsFacility}
              onClose={() => setDirectionsFacility(null)}
            />
          </div>
          {/* Mobile/Tablet */}
          <div className="lg:hidden fixed inset-0 z-[1100]">
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
