import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Menu, X, Sparkles, Filter, Map, MapPin } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { SmartSearch } from '@/components/search/SmartSearch';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { DirectionsPanel } from '@/components/map/DirectionsPanel';
import { InlineFilters } from '@/components/map/InlineFilters';
import { SidePanelLayers } from '@/components/map/SidePanelLayers';
import { Button } from '@/components/ui/button';
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
        {/* Left Panel Overlay - Desktop (Glassmorphism) */}
        <div className="hidden lg:flex flex-col w-80 absolute top-4 left-4 bottom-4 bg-white/40 dark:bg-card/40 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-2xl shadow-2xl z-[1001]">
          {/* Sticky Search Stack - Non-scrolling, contains search + suggestions overlay */}
          <div className="relative z-20 p-4 pb-3 bg-white/60 dark:bg-card/60 backdrop-blur-xl border-b border-white/20 dark:border-white/10 shadow-sm rounded-t-2xl" style={{ overflow: 'visible' }}>
            <div className="relative bg-white/50 dark:bg-white/5 rounded-xl p-3 border border-white/20 dark:border-white/10 transition-all hover:bg-white/60 dark:hover:bg-white/10" style={{ overflow: 'visible' }}>
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
          
          {/* Scrollable Content Area - Only this scrolls */}
          <div className="relative z-10 p-4 pt-3 space-y-4 overflow-y-auto flex-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/30 hover:scrollbar-thumb-white/50">
            {/* Result Count - Shows only when search results exist */}
            {searchResults.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground px-1">
                <MapPin className="w-3 h-3" />
                <span>{searchResults.length} {searchResults.length === 1 ? 'facility' : 'facilities'} found{searchIntent?.responseMessage ? ` – ${searchIntent.responseMessage}` : ''}</span>
              </div>
            )}
            
            {/* Filters Section */}
            <div className="bg-white/30 dark:bg-white/5 rounded-xl pt-3 pb-4 px-4 border border-white/20 dark:border-white/10">
              <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" />
                Filters
              </h4>
              <InlineFilters filters={filters} onFilterChange={setFilters} className="flex-col gap-3" />
            </div>
            
            {/* Map Layers Section */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2 px-1">
                <Map className="w-4 h-4 text-primary" />
                Map Layers
              </h4>
              <SidePanelLayers 
                layers={layers} 
                onLayerToggle={handleLayerToggle}
                highlightedLayerId={highlightedLayerId}
              />
            </div>
          </div>
        </div>

        {/* Mobile Search Bar Overlay */}
        <div className="lg:hidden absolute top-4 left-4 right-4 z-[1001]">
          <SmartSearch onSearch={handleSearch} onLocateMe={handleLocateMe} isSearching={isSearching} />
          {userMessage && (
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground bg-card/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-border">
              <Sparkles className="w-3 h-3 text-primary" />
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

          {/* Map Controls Overlay - Desktop (removed base map & legend - now in side panel) */}
          {/* Kept empty for potential future controls */}

          {/* Mobile Bottom Controls */}
          <div className="lg:hidden absolute bottom-20 left-4 right-4 z-10 flex items-center justify-end">
            <Button
              variant="default"
              className="shadow-lg"
              onClick={() => setMobileSheetOpen(true)}
            >
              <Menu className="w-4 h-4 mr-2" />
              Layers & Filters
            </Button>
          </div>

      </main>

      {/* Mobile Bottom Sheet */}
      {mobileSheetOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setMobileSheetOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl border-t border-border max-h-[80vh] overflow-y-auto animate-slide-in-right">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <h3 className="font-heading font-semibold text-foreground">Layers & Filters</h3>
              <button onClick={() => setMobileSheetOpen(false)} className="p-2 rounded-lg hover:bg-secondary">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-6">
              {/* Mobile Filters */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Filters</h4>
                <InlineFilters filters={filters} onFilterChange={setFilters} className="flex-wrap" />
              </div>

              {/* Mobile Layers */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Map Layers</h4>
                <div className="space-y-3">
                  {layers.map(theme => (
                    <div key={theme.id} className="bg-secondary/30 rounded-xl p-3">
                      <h5 className="text-sm font-medium text-foreground mb-2">{theme.name}</h5>
                      <div className="space-y-2">
                        {theme.layers.map(layer => (
                          <label
                            key={layer.id}
                            className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-secondary/50 cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-5 h-5 rounded-md"
                                style={{ backgroundColor: layer.color }}
                              />
                              <span className="text-sm text-foreground">{layer.name}</span>
                            </div>
                            <input
                              type="checkbox"
                              checked={layer.visible}
                              onChange={() => handleLayerToggle(theme.id, layer.id)}
                              className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Directions Panel - Desktop: right side modal, Mobile: bottom sheet */}
      {directionsFacility && (
        <>
          {/* Desktop */}
          <div className="hidden lg:block fixed top-1/2 right-8 -translate-y-1/2 z-[1100]">
            <DirectionsPanel 
              facility={directionsFacility} 
              onClose={() => setDirectionsFacility(null)} 
            />
          </div>
          {/* Mobile */}
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
