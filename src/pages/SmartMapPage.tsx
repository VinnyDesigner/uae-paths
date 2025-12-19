import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Menu, X, Sparkles, Layers } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { SmartSearch } from '@/components/search/SmartSearch';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { ResultsPanel } from '@/components/map/ResultsPanel';
import { BaseMapSelector } from '@/components/map/BaseMapSelector';
import { MapLegendOverlay } from '@/components/map/MapLegendOverlay';
import { InlineFilters } from '@/components/map/InlineFilters';
import { LayerTogglePanel } from '@/components/map/LayerTogglePanel';
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
  const [baseMapId, setBaseMapId] = useState('default');
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

      {/* Map Area with Left Panel */}
      <main className="flex-1 flex h-full min-h-[500px]">
        {/* Left Panel - Desktop */}
        <div className="hidden lg:flex flex-col w-80 bg-card border-r border-border z-[1001] shrink-0">
          <div className="p-4 space-y-4">
            <SmartSearch onSearch={handleSearch} onLocateMe={handleLocateMe} isSearching={isSearching} size="default" />
            {userMessage && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2 border border-border">
                <Sparkles className="w-3 h-3 text-primary flex-shrink-0" />
                <span className="line-clamp-2">{userMessage}</span>
              </div>
            )}
            <div className="border-t border-border pt-4">
              <h4 className="text-sm font-semibold text-foreground mb-3">Filters</h4>
              <InlineFilters filters={filters} onFilterChange={setFilters} className="flex-wrap" />
            </div>
          </div>
          
          {/* Search Results Count */}
          {searchResults.length > 0 && (
            <div className="px-4 py-2 bg-primary/10 border-y border-border flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {searchResults.length} facilities found
              </span>
            </div>
          )}
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
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
            className="h-full w-full"
          />

          {/* Map Controls Overlay - Desktop */}
          <div className="hidden lg:flex absolute bottom-4 left-4 z-[1000] gap-2">
            <BaseMapSelector selectedMap={baseMapId} onMapChange={setBaseMapId} />
            <LayerTogglePanel layers={layers} onLayerToggle={handleLayerToggle} />
          </div>

          {/* Legend Overlay - Desktop (bottom-right) */}
          <div className="hidden lg:block absolute bottom-4 right-4 z-[1000]">
            <MapLegendOverlay layers={layers} />
          </div>

          {/* Mobile Bottom Controls */}
          <div className="lg:hidden absolute bottom-20 left-4 right-4 z-10 flex items-center justify-between gap-2">
            <div className="flex gap-2">
              <BaseMapSelector selectedMap={baseMapId} onMapChange={setBaseMapId} />
            </div>
            <Button
              variant="default"
              className="shadow-lg"
              onClick={() => setMobileSheetOpen(true)}
            >
              <Menu className="w-4 h-4 mr-2" />
              Layers & Filters
            </Button>
          </div>

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

              {/* Mobile Legend */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Legend</h4>
                <MapLegendOverlay layers={layers} />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
