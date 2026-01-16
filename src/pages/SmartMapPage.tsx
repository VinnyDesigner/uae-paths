import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Layers } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { SmartSearch } from '@/components/search/SmartSearch';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { DirectionsPanel } from '@/components/map/DirectionsPanel';
import { FilterPills } from '@/components/map/FilterPills';
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
    return () => {
      document.body.style.overflow = '';
    };
  }, []);
  const [searchParams] = useSearchParams();
  const [layers, setLayers] = useState<ThemeGroup[]>(themeGroups);
  const [filters, setFilters] = useState<FilterState>({
    emirate: 'All Municipalities',
    distance: null,
    facilityTypes: []
  });
  const [baseMapId, setBaseMapId] = useState('streets');
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [directionsFacility, setDirectionsFacility] = useState<Facility | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | undefined>();
  const [highlightedLayerId, setHighlightedLayerId] = useState<number | null>(null);
  const {
    isSearching,
    searchResults,
    searchIntent,
    userMessage,
    search,
    clearResults,
    getLayersToEnable
  } = useAISearch();

  // Determine if hospitals layer is active based on search results or visible layers
  const activeHospitalLayer = useMemo(() => {
    // Check if hospitals are in search results
    const hasHospitalResults = searchResults.some(r => r.layerId === HOSPITAL_LAYER_ID);
    // Check if hospital layer is visible
    const isHospitalLayerVisible = layers.some(theme => theme.layers.some(l => l.id === HOSPITAL_LAYER_ID && l.visible));
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
      setLayers(prevLayers => prevLayers.map(theme => ({
        ...theme,
        layers: theme.layers.map(layer => ({
          ...layer,
          visible: layersToEnable.includes(layer.id) ? true : layer.visible
        }))
      })));
    }
  }, [searchResults, getLayersToEnable]);
  const handleLayerToggle = (themeId: number, layerId: number) => {
    setLayers(prevLayers => prevLayers.map(theme => theme.id === themeId ? {
      ...theme,
      layers: theme.layers.map(layer => layer.id === layerId ? {
        ...layer,
        visible: !layer.visible
      } : layer)
    } : theme));
  };
  const handleSelectAll = (themeId: number) => {
    setLayers(prevLayers => prevLayers.map(theme => theme.id === themeId ? {
      ...theme,
      layers: theme.layers.map(layer => ({
        ...layer,
        visible: true
      }))
    } : theme));
  };
  const handleClearAll = (themeId: number) => {
    setLayers(prevLayers => prevLayers.map(theme => theme.id === themeId ? {
      ...theme,
      layers: theme.layers.map(layer => ({
        ...layer,
        visible: false
      }))
    } : theme));
  };
  const handleSearch = async (query: string) => {
    await search(query, userLocation);
  };
  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
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
  const handleOpenDirections = useCallback((event: CustomEvent<{
    facilityId: string;
  }>) => {
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
  return <div className="h-screen flex flex-col bg-background">
      <Header />

      {/* Map Area - Wrapper with proper stacking context */}
      <main className="flex-1 relative h-full min-h-[500px]">
        {/* Map Container - base layer */}
        <div className="absolute inset-0">
          <InteractiveMap layers={layers} facilities={uaeFacilities} searchResults={searchResults} selectedFacility={selectedFacility} onFacilitySelect={handleFacilityClick} suggestedZoom={searchIntent?.suggestedZoom} baseMapId={baseMapId} onBaseMapChange={setBaseMapId} onLayerToggle={handleLayerToggle} onSelectAll={handleSelectAll} onClearAll={handleClearAll} highlightedLayerId={highlightedLayerId} className="h-full w-full" />
        </div>

        {/* Floating Search + Filters Row - Desktop */}
        <div className="hidden lg:flex absolute top-4 left-4 z-[var(--z-floating)] items-center gap-4">
          {/* Search Bar */}
          <div className="w-[340px]">
            <SmartSearch onSearch={handleSearch} onLocateMe={handleLocateMe} isSearching={isSearching} size="default" activeLayerId={activeHospitalLayer} hideSubmitButton disableGlow />
          </div>
          
          {/* Filter Pills - Vertically centered with search */}
          <FilterPills filters={filters} onFilterChange={setFilters} />
        </div>

        {/* Results Indicator - Secondary element with clear separation */}
        {searchResults.length > 0 && <div className="hidden lg:block absolute top-[76px] left-4 z-[var(--z-floating)]">
            <div className="flex items-center gap-2 h-9 px-4 rounded-[18px] backdrop-blur-sm shadow-sm bg-muted">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              <span className="text-[13px] font-semibold text-foreground/90">
                {searchResults.length} {searchResults.length === 1 ? 'facility' : 'facilities'}
              </span>
              {searchIntent?.isProximitySearch && <>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="text-[13px] font-normal text-muted-foreground">Near your location</span>
                </>}
              {searchIntent?.emirate && !searchIntent?.isProximitySearch && <>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="text-[13px] font-normal text-muted-foreground">in {searchIntent.emirate}</span>
                </>}
            </div>
          </div>}

        {/* Mobile Search Bar - Fixed sticky at top, always visible above menus */}
        <div className="lg:hidden absolute top-3 left-3 right-3 z-[var(--z-popover)]">
          <SmartSearch onSearch={handleSearch} onLocateMe={handleLocateMe} isSearching={isSearching} />
          {/* Mobile results count - secondary indicator with clear separation */}
          {searchResults.length > 0 && <div className="mt-3 inline-flex items-center gap-1.5 h-9 px-4 rounded-[18px] bg-white/85 dark:bg-card/85 backdrop-blur-sm shadow-sm border border-border/30">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              <span className="text-xs font-semibold text-foreground/90">
                {searchResults.length} {searchResults.length === 1 ? 'facility' : 'facilities'}
              </span>
              {searchIntent?.isProximitySearch && <>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="text-xs font-normal text-muted-foreground">Near you</span>
                </>}
            </div>}
        </div>

        {/* Mobile FAB - Layers Button - z-40 for map controls */}
        <div className="lg:hidden absolute bottom-24 left-4 z-40">
          <button onClick={() => setMobileSheetOpen(true)} className="flex items-center gap-2 bg-primary text-primary-foreground shadow-xl rounded-full px-4 py-3 min-h-[52px] hover:bg-primary/90 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" aria-label="Open layers and filters">
            <Layers className="w-5 h-5" />
            <span className="text-sm font-semibold">Layers</span>
          </button>
        </div>
      </main>

      {/* Mobile Bottom Sheet - Enhanced with drag states */}
      <MobileBottomSheet isOpen={mobileSheetOpen} onClose={() => setMobileSheetOpen(false)} layers={layers} filters={filters} onFilterChange={setFilters} onLayerToggle={handleLayerToggle} onSelectAll={handleSelectAll} onClearAll={handleClearAll} highlightedLayerId={highlightedLayerId} />

      {/* Directions Panel - Desktop: right side modal, Mobile: bottom sheet */}
      {directionsFacility && <>
          {/* Desktop - z-modal */}
          <div className="hidden lg:block fixed top-1/2 right-8 -translate-y-1/2 z-[var(--z-modal)]">
            <DirectionsPanel facility={directionsFacility} onClose={() => setDirectionsFacility(null)} />
          </div>
          {/* Mobile - z-modal */}
          <div className="lg:hidden fixed inset-0 z-[var(--z-modal)]">
            <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={() => setDirectionsFacility(null)} />
            <div className="absolute bottom-0 left-0 right-0 animate-slide-in-right">
              <DirectionsPanel facility={directionsFacility} onClose={() => setDirectionsFacility(null)} className="rounded-b-none" />
            </div>
          </div>
        </>}

    </div>;
}