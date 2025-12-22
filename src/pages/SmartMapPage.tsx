import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, Filter, Map, MapPin, Layers } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { SmartSearch } from '@/components/search/SmartSearch';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { DirectionsPanel } from '@/components/map/DirectionsPanel';
import { InlineFilters } from '@/components/map/InlineFilters';
import { SidePanelLayers } from '@/components/map/SidePanelLayers';
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
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [directionsFacility, setDirectionsFacility] = useState<Facility | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>();
  const [highlightedLayerId, setHighlightedLayerId] = useState<number | null>(null);

  const { isSearching, searchResults, searchIntent, userMessage, search, clearResults, getLayersToEnable } = useAISearch();

  // Determine if hospitals layer is active based on search results or visible layers
  const activeHospitalLayer = useMemo(() => {
    // Check if hospitals are in search results
    const hasHospitalResults = searchResults.some(r => r.layerId === HOSPITAL_LAYER_ID);
    // Check if hospital layer is visible
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
    // Highlight the layer this facility belongs to
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
        {/* Left Panel - Desktop (Glassmorphism) - z-30 for desktop panel */}
        <div data-sidebar-panel className="hidden lg:flex flex-col w-80 absolute top-4 left-4 bottom-4 bg-white/50 dark:bg-card/40 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl shadow-2xl z-30">
          {/* Search Header - Fixed */}
          <div className="relative z-20 p-4 pb-3 bg-white/70 dark:bg-card/60 backdrop-blur-xl border-b border-white/30 dark:border-white/10 rounded-t-2xl flex-shrink-0" style={{ overflow: 'visible' }}>
            <div className="relative bg-white/60 dark:bg-white/5 rounded-xl p-3 border border-white/30 dark:border-white/10 transition-all hover:bg-white/70 dark:hover:bg-white/10" style={{ overflow: 'visible' }}>
              <SmartSearch 
                onSearch={handleSearch} 
                onLocateMe={handleLocateMe} 
                isSearching={isSearching} 
                size="default"
                activeLayerId={activeHospitalLayer}
              />
            </div>
            
            {/* AI Message */}
            {userMessage && (
              <div className="mt-3 flex items-center gap-2 text-sm text-foreground/80 bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-xl px-3 py-2.5 border border-white/30 dark:border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span className="line-clamp-2">{userMessage}</span>
              </div>
            )}

            {/* Result Count Badge */}
            {searchResults.length > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                  <MapPin className="w-3 h-3" />
                  <span>{searchResults.length} {searchResults.length === 1 ? 'facility' : 'facilities'}</span>
                </div>
                {searchIntent?.responseMessage && (
                  <span className="text-xs text-muted-foreground truncate">
                    {searchIntent.responseMessage}
                  </span>
                )}
              </div>
            )}
          </div>
          
          {/* Scrollable Content */}
          <div className="relative z-10 p-4 pt-3 space-y-4 overflow-y-auto overflow-x-visible flex-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/30 hover:scrollbar-thumb-white/50">
            {/* Filters */}
            <div className="bg-white/40 dark:bg-white/5 rounded-xl p-4 border border-white/30 dark:border-white/10">
              <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" />
                Filters
              </h4>
              <InlineFilters filters={filters} onFilterChange={setFilters} className="flex-col gap-3" />
            </div>
            
            {/* Map Layers */}
            <div className="relative">
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2 px-1">
                <Map className="w-4 h-4 text-primary" />
                Map Layers
              </h4>
              <SidePanelLayers 
                layers={layers} 
                onLayerToggle={handleLayerToggle}
                onSelectAll={handleSelectAll}
                onClearAll={handleClearAll}
                highlightedLayerId={highlightedLayerId}
              />
            </div>
          </div>
        </div>

        {/* Mobile Search Bar - Fixed sticky at top, always visible above menus */}
        <div className="lg:hidden absolute top-3 left-3 right-3 z-[60]">
          <div className="bg-card/98 backdrop-blur-xl rounded-xl shadow-lg border border-border/50 p-2">
            <SmartSearch onSearch={handleSearch} onLocateMe={handleLocateMe} isSearching={isSearching} />
          </div>
          {userMessage && (
            <div className="mt-2 flex items-center gap-2 text-xs text-foreground/80 bg-card/98 backdrop-blur-xl rounded-lg px-3 py-2 shadow-lg border border-border/50">
              <Sparkles className="w-3 h-3 text-primary flex-shrink-0" />
              <span className="truncate">{userMessage}</span>
            </div>
          )}
          {/* Mobile results count pill */}
          {searchResults.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium shadow-lg">
                <MapPin className="w-3 h-3" />
                <span>{searchResults.length}</span>
              </div>
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

          {/* Mobile FAB - Layers Button - z-20 for map controls */}
          <div className="lg:hidden absolute bottom-24 left-4 z-20">
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

      {/* Mobile Bottom Sheet - Enhanced with drag states */}
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

      {/* Directions Panel - Desktop: right side modal, Mobile: bottom sheet */}
      {directionsFacility && (
        <>
          {/* Desktop - z-[100] for modals */}
          <div className="hidden lg:block fixed top-1/2 right-8 -translate-y-1/2 z-[100]">
            <DirectionsPanel 
              facility={directionsFacility} 
              onClose={() => setDirectionsFacility(null)} 
            />
          </div>
          {/* Mobile - z-[100] for modals */}
          <div className="lg:hidden fixed inset-0 z-[100]">
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
