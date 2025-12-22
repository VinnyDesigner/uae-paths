export interface MapLayer {
  id: number;
  name: string;
  description: string;
  visible: boolean;
  color: string;
  icon: string;
}

export interface ThemeGroup {
  id: number;
  name: string;
  description: string;
  icon: string;
  colorClass: string;
  layers: MapLayer[];
}

export interface Facility {
  id: string;
  name: string;
  type: string;
  theme: 'healthcare' | 'education';
  layerId: number;
  address: string;
  emirate: string;
  coordinates: [number, number];
  distance?: number;
  // Hospital-specific attributes
  hasEmergency?: boolean;
  bedCapacity?: number;
  specialties?: string[];
}

export interface SearchSuggestion {
  text: string;
  type: 'query' | 'facility' | 'layer';
  icon?: string;
}

export interface FilterState {
  emirate: string;
  distance: number | null;
  facilityTypes: string[];
}
