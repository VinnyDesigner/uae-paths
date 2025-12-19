import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { SmartSearch } from '@/components/search/SmartSearch';
import { LayerCatalogue } from '@/components/map/LayerCatalogue';
import { MapFilters } from '@/components/map/MapFilters';
import { DynamicLegend } from '@/components/map/DynamicLegend';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { ResultsPanel } from '@/components/map/ResultsPanel';
import { FacilityCard } from '@/components/map/FacilityCard';
import { MapLayerControl } from '@/components/map/MapLayerControl';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { themeGroups } from '@/data/layers';
import { uaeFacilities } from '@/data/facilities';
import { useAISearch } from '@/hooks/useAISearch';
import { ThemeGroup, Facility, FilterState } from '@/types/map';

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>();

  const { isSearching, searchResults, searchIntent, userMessage, search, clearResults, getLayersToEnable } = useAISearch();

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
  };

  const handleClearResults = () => {
    clearResults();
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />

      {/* Mobile Search Bar - Sticky */}
      <div className="lg:hidden sticky top-0 z-30 p-3 bg-card/95 backdrop-blur-sm border-b border-border">
        <SmartSearch onSearch={handleSearch} onLocateMe={handleLocateMe} isSearching={isSearching} />
        {userMessage && (
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-3 h-3 text-primary" />
            <span>{userMessage}</span>
          </div>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop Sidebar */}
        <aside className={cn(
          "hidden lg:flex flex-col bg-card border-r border-border transition-all duration-300 overflow-hidden",
          sidebarOpen ? "w-80 xl:w-96" : "w-0"
        )}>
          <div className="p-4 border-b border-border">
            <SmartSearch onSearch={handleSearch} onLocateMe={handleLocateMe} isSearching={isSearching} />
            {userMessage && (
              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 rounded-lg p-2">
                <Sparkles className="w-3 h-3 text-primary flex-shrink-0" />
                <span>{userMessage}</span>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <LayerCatalogue layers={layers} onLayerToggle={handleLayerToggle} />
            <DynamicLegend layers={layers} />
            <MapFilters filters={filters} onFilterChange={setFilters} />
          </div>
        </aside>

        {/* Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={cn(
            "hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-card border border-border rounded-r-lg p-2 shadow-md hover:bg-secondary transition-all",
            sidebarOpen ? "translate-x-80 xl:translate-x-96" : "translate-x-0"
          )}
        >
          {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        {/* Map Area */}
        <main className="flex-1 relative h-full min-h-[500px]">
          <InteractiveMap
            layers={layers}
            facilities={uaeFacilities}
            searchResults={searchResults}
            selectedFacility={selectedFacility}
            onFacilitySelect={handleFacilityClick}
            suggestedZoom={searchIntent?.suggestedZoom}
            className="h-full w-full"
          />

          {/* Layer Control on Map - Desktop */}
          <div className="hidden lg:block">
            <MapLayerControl layers={layers} onLayerToggle={handleLayerToggle} />
          </div>

          {/* Mobile Bottom Sheet Toggle */}
          <Button
            variant="default"
            className="lg:hidden absolute bottom-20 left-4 z-10 shadow-lg"
            onClick={() => setMobileSheetOpen(true)}
          >
            <Menu className="w-4 h-4 mr-2" />
            Layers & Filters
          </Button>

          {/* Desktop Facility Card */}
          {selectedFacility && (
            <div className="hidden lg:block absolute top-4 left-4 z-10 w-80 animate-slide-in-left">
              <FacilityCard
                facility={selectedFacility}
                onClose={() => setSelectedFacility(null)}
                onNavigate={() => {
                  window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedFacility.coordinates[1]},${selectedFacility.coordinates[0]}`, '_blank');
                }}
              />
            </div>
          )}

          {/* Results Panel */}
          {searchResults.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 z-10">
              <ResultsPanel
                results={searchResults}
                searchQuery={searchIntent?.responseMessage || ''}
                onFacilityClick={handleFacilityClick}
                onClose={handleClearResults}
              />
            </div>
          )}
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
              <div className="p-4 space-y-4">
                <LayerCatalogue layers={layers} onLayerToggle={handleLayerToggle} />
                <DynamicLegend layers={layers} />
                <MapFilters filters={filters} onFilterChange={setFilters} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Facility Card */}
      {selectedFacility && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-gradient-to-t from-background via-background to-transparent pt-10">
          <FacilityCard
            facility={selectedFacility}
            onClose={() => setSelectedFacility(null)}
            onNavigate={() => {
              window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedFacility.coordinates[1]},${selectedFacility.coordinates[0]}`, '_blank');
            }}
          />
        </div>
      )}
    </div>
  );
}
