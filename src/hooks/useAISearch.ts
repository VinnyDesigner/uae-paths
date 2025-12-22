import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Facility } from '@/types/map';
import { uaeFacilities, filterFacilities, AISearchIntent, facilityTypeToLayer } from '@/data/facilities';
import { useToast } from '@/hooks/use-toast';

interface UseAISearchResult {
  isSearching: boolean;
  searchResults: Facility[];
  searchIntent: AISearchIntent | null;
  userMessage: string;
  search: (query: string, userLocation?: { lat: number; lng: number }) => Promise<void>;
  clearResults: () => void;
  getLayersToEnable: () => number[];
}

export function useAISearch(): UseAISearchResult {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Facility[]>([]);
  const [searchIntent, setSearchIntent] = useState<AISearchIntent | null>(null);
  const [userMessage, setUserMessage] = useState('');
  const { toast } = useToast();

  const search = useCallback(async (query: string, userLocation?: { lat: number; lng: number }) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setUserMessage('');

    try {
      // Call the AI search edge function
      const { data, error } = await supabase.functions.invoke('smart-search', {
        body: { query, userLocation }
      });

      if (error) {
        console.error('AI search error:', error);
        throw new Error(error.message || 'Search failed');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const intent: AISearchIntent = data;
      setSearchIntent(intent);
      setUserMessage(intent.responseMessage);

      // Filter facilities based on AI intent
      const results = filterFacilities(uaeFacilities, intent, userLocation);
      setSearchResults(results);

      if (results.length === 0) {
        toast({
          title: "No results found",
          description: `No facilities found for "${query}". Try a different search.`,
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      
      // Fallback to local search if AI fails
      const fallbackIntent: AISearchIntent = {
        intent: 'general',
        facilityTypes: [],
        emirate: null,
        themes: ['healthcare', 'education'],
        isProximitySearch: query.toLowerCase().includes('near'),
        keywords: query.toLowerCase().split(' ').filter(w => w.length > 2),
        suggestedZoom: 12,
        responseMessage: `Showing results for "${query}"`
      };

      setSearchIntent(fallbackIntent);
      const results = filterFacilities(uaeFacilities, fallbackIntent, userLocation);
      setSearchResults(results);
      setUserMessage(fallbackIntent.responseMessage);

      // Only show toast for rate limit errors
      if (error instanceof Error && error.message.includes('Rate limit')) {
        toast({
          title: "Search completed",
          description: error.message,
          variant: "destructive"
        });
      }
    } finally {
      setIsSearching(false);
    }
  }, [toast]);

  const clearResults = useCallback(() => {
    setSearchResults([]);
    setSearchIntent(null);
    setUserMessage('');
  }, []);

  const getLayersToEnable = useCallback((): number[] => {
    if (!searchIntent) return [];
    
    const layerIds: number[] = [];
    for (const facilityType of searchIntent.facilityTypes) {
      const layerId = facilityTypeToLayer[facilityType];
      if (layerId) layerIds.push(layerId);
    }
    
    // If no specific layers, return all from results
    if (layerIds.length === 0 && searchResults.length > 0) {
      return [...new Set(searchResults.map(r => r.layerId))];
    }
    
    return layerIds;
  }, [searchIntent, searchResults]);

  return {
    isSearching,
    searchResults,
    searchIntent,
    userMessage,
    search,
    clearResults,
    getLayersToEnable
  };
}
