import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { SmartSearch } from '@/components/search/SmartSearch';
import { LayerCatalogue } from '@/components/map/LayerCatalogue';
import { MapFilters } from '@/components/map/MapFilters';
import { DynamicLegend } from '@/components/map/DynamicLegend';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { ResultsPanel } from '@/components/map/ResultsPanel';
import { FacilityCard } from '@/components/map/FacilityCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { themeGroups, sampleFacilities } from '@/data/layers';
import { ThemeGroup, Facility, FilterState } from '@/types/map';

export default function SmartMapPage() {
  // Force map container to have explicit height
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Handle initial search from URL
  useEffect(() => {
    const query = searchParams.get('search');
    if (query) {
      handleSearch(query);
    }
  }, [searchParams]);

  const handleLayerToggle = (themeId: number, layerId: number) => {
    setLayers(prevLayers =>
      prevLayers.map(theme =>
        theme.id === themeId
          ? {
              ...theme,
              layers: theme.layers.map(layer =>
                layer.id === layerId
                  ? { ...layer, visible: !layer.visible }
                  : layer
              ),
            }
          : theme
      )
    );
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);

    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simple search logic - in production this would hit the ArcGIS MapServer
    const queryLower = query.toLowerCase();
    const results = sampleFacilities.filter(facility => {
      const matchesName = facility.name.toLowerCase().includes(queryLower);
      const matchesType = facility.type.toLowerCase().includes(queryLower);
      const matchesEmirate = facility.emirate.toLowerCase().includes(queryLower);
      const matchesTheme = facility.theme.toLowerCase().includes(queryLower);
      
      // Check for specific keywords
      const isNearestQuery = queryLower.includes('nearest') || queryLower.includes('near');
      const isHospitalQuery = queryLower.includes('hospital');
      const isSchoolQuery = queryLower.includes('school');
      const isClinicQuery = queryLower.includes('clinic');
      const isPharmacyQuery = queryLower.includes('pharmac');

      if (isNearestQuery) {
        if (isHospitalQuery) return facility.type === 'Hospitals';
        if (isSchoolQuery) return facility.type.includes('School');
        if (isClinicQuery) return facility.type === 'Clinics';
        if (isPharmacyQuery) return facility.type === 'Pharmacies';
        return true; // Return all if no specific type
      }

      return matchesName || matchesType || matchesEmirate || matchesTheme;
    });

    // Add mock distances
    const resultsWithDistance = results.map(r => ({
      ...r,
      distance: Math.random() * 10 + 0.5,
    })).sort((a, b) => a.distance - b.distance);

    setSearchResults(resultsWithDistance);
    setIsSearching(false);

    // Auto-enable relevant layers
    if (resultsWithDistance.length > 0) {
      const layerIds = [...new Set(resultsWithDistance.map(r => r.layerId))];
      setLayers(prevLayers =>
        prevLayers.map(theme => ({
          ...theme,
          layers: theme.layers.map(layer => ({
            ...layer,
            visible: layerIds.includes(layer.id) ? true : layer.visible,
          })),
        }))
      );
    }
  };

  const handleFacilityClick = (facility: Facility) => {
    setSelectedFacility(facility);
  };

  const clearSearchResults = () => {
    setSearchResults([]);
    setSearchQuery('');
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />

      {/* Mobile Search Bar */}
      <div className="lg:hidden p-4 bg-card border-b border-border">
        <SmartSearch onSearch={handleSearch} isSearching={isSearching} />
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "hidden lg:flex flex-col bg-card border-r border-border transition-all duration-300 overflow-hidden",
            sidebarOpen ? "w-80 xl:w-96" : "w-0"
          )}
        >
          {/* Search */}
          <div className="p-4 border-b border-border">
            <SmartSearch onSearch={handleSearch} isSearching={isSearching} />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <LayerCatalogue
              layers={layers}
              onLayerToggle={handleLayerToggle}
            />
            <DynamicLegend layers={layers} />
            <MapFilters
              filters={filters}
              onFilterChange={setFilters}
            />
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
          {sidebarOpen ? (
            <X className="w-4 h-4 text-foreground" />
          ) : (
            <Menu className="w-4 h-4 text-foreground" />
          )}
        </button>

        {/* Map Area */}
        <main className="flex-1 relative h-full min-h-[500px]">
          <InteractiveMap
            layers={layers}
            selectedFacility={selectedFacility}
            onFacilitySelect={handleFacilityClick}
            className="h-full w-full"
          />

          {/* Mobile Bottom Sheet Toggle */}
          <Button
            variant="default"
            className="lg:hidden absolute bottom-20 left-4 z-10 shadow-lg"
            onClick={() => setMobileSheetOpen(true)}
          >
            <Menu className="w-4 h-4 mr-2" />
            Layers & Filters
          </Button>

          {/* Selected Facility Card (Desktop) */}
          {selectedFacility && (
            <div className="hidden lg:block absolute top-4 left-4 z-10 w-80 animate-slide-in-left">
              <FacilityCard
                facility={selectedFacility}
                onClose={() => setSelectedFacility(null)}
                onNavigate={() => {
                  // Open directions in new tab
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${selectedFacility.coordinates[0]},${selectedFacility.coordinates[1]}`,
                    '_blank'
                  );
                }}
              />
            </div>
          )}

          {/* Results Panel */}
          {searchResults.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 z-10">
              <ResultsPanel
                results={searchResults}
                searchQuery={searchQuery}
                onFacilityClick={handleFacilityClick}
                onClose={clearSearchResults}
              />
            </div>
          )}
        </main>

        {/* Mobile Bottom Sheet */}
        {mobileSheetOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
              onClick={() => setMobileSheetOpen(false)}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl border-t border-border max-h-[80vh] overflow-y-auto animate-slide-in-right">
              <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
                <h3 className="font-heading font-semibold text-foreground">
                  Layers & Filters
                </h3>
                <button
                  onClick={() => setMobileSheetOpen(false)}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <LayerCatalogue
                  layers={layers}
                  onLayerToggle={handleLayerToggle}
                />
                <DynamicLegend layers={layers} />
                <MapFilters
                  filters={filters}
                  onFilterChange={setFilters}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Selected Facility Card */}
      {selectedFacility && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-gradient-to-t from-background via-background to-transparent pt-10">
          <FacilityCard
            facility={selectedFacility}
            onClose={() => setSelectedFacility(null)}
            onNavigate={() => {
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${selectedFacility.coordinates[0]},${selectedFacility.coordinates[1]}`,
                '_blank'
              );
            }}
          />
        </div>
      )}
    </div>
  );
}
