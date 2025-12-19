import { Facility } from '@/types/map';

// Comprehensive UAE facilities dataset
export const uaeFacilities: Facility[] = [
  // ============ HEALTHCARE - HOSPITALS ============
  // Abu Dhabi
  { id: 'h1', name: 'Cleveland Clinic Abu Dhabi', type: 'Hospitals', theme: 'healthcare', layerId: 330, address: 'Al Maryah Island', emirate: 'Abu Dhabi', coordinates: [54.3952, 24.5015] },
  { id: 'h2', name: 'Sheikh Khalifa Medical City', type: 'Hospitals', theme: 'healthcare', layerId: 330, address: 'Karamah Street', emirate: 'Abu Dhabi', coordinates: [54.3673, 24.4755] },
  { id: 'h3', name: 'Burjeel Hospital Abu Dhabi', type: 'Hospitals', theme: 'healthcare', layerId: 330, address: 'Najda Street', emirate: 'Abu Dhabi', coordinates: [54.3590, 24.4885] },
  { id: 'h4', name: 'NMC Royal Hospital', type: 'Hospitals', theme: 'healthcare', layerId: 330, address: 'Khalifa City', emirate: 'Abu Dhabi', coordinates: [54.5683, 24.4165] },
  { id: 'h5', name: 'Al Ain Hospital', type: 'Hospitals', theme: 'healthcare', layerId: 330, address: 'Al Ain City Center', emirate: 'Abu Dhabi', coordinates: [55.7608, 24.2075] },
  { id: 'h6', name: 'Mediclinic Al Noor Hospital', type: 'Hospitals', theme: 'healthcare', layerId: 330, address: 'Airport Road', emirate: 'Abu Dhabi', coordinates: [54.4185, 24.4458] },
  { id: 'h7', name: 'Tawam Hospital', type: 'Hospitals', theme: 'healthcare', layerId: 330, address: 'Al Ain', emirate: 'Abu Dhabi', coordinates: [55.7412, 24.2285] },
  
  // Dubai
  { id: 'h8', name: 'Dubai Hospital', type: 'Hospitals', theme: 'healthcare', layerId: 330, address: 'Al Baraha', emirate: 'Dubai', coordinates: [55.3085, 25.2765] },
  { id: 'h9', name: 'Rashid Hospital', type: 'Hospitals', theme: 'healthcare', layerId: 330, address: 'Oud Metha', emirate: 'Dubai', coordinates: [55.3125, 25.2318] },
  { id: 'h10', name: 'Mediclinic City Hospital', type: 'Hospitals', theme: 'healthcare', layerId: 330, address: 'Dubai Healthcare City', emirate: 'Dubai', coordinates: [55.3245, 25.2285] },
  { id: 'h11', name: 'American Hospital Dubai', type: 'Hospitals', theme: 'healthcare', layerId: 330, address: 'Oud Metha', emirate: 'Dubai', coordinates: [55.3185, 25.2398] },
  { id: 'h12', name: 'Saudi German Hospital Dubai', type: 'Hospitals', theme: 'healthcare', layerId: 330, address: 'Al Barsha', emirate: 'Dubai', coordinates: [55.2012, 25.1125] },
  
  // Sharjah
  { id: 'h13', name: 'Al Qassimi Hospital', type: 'Hospitals', theme: 'healthcare', layerId: 330, address: 'Al Taawun', emirate: 'Sharjah', coordinates: [55.3875, 25.3385] },
  { id: 'h14', name: 'University Hospital Sharjah', type: 'Hospitals', theme: 'healthcare', layerId: 330, address: 'University City', emirate: 'Sharjah', coordinates: [55.5125, 25.2985] },
  
  // Other Emirates
  { id: 'h15', name: 'Ajman Specialty General Hospital', type: 'Hospitals', theme: 'healthcare', layerId: 330, address: 'Al Nuaimia', emirate: 'Ajman', coordinates: [55.4458, 25.4025] },
  { id: 'h16', name: 'Saqr Hospital', type: 'Hospitals', theme: 'healthcare', layerId: 330, address: 'RAK City', emirate: 'Ras Al Khaimah', coordinates: [55.9425, 25.7585] },
  { id: 'h17', name: 'Fujairah Hospital', type: 'Hospitals', theme: 'healthcare', layerId: 330, address: 'Fujairah City', emirate: 'Fujairah', coordinates: [56.3415, 25.1285] },

  // ============ HEALTHCARE - CLINICS ============
  { id: 'c1', name: 'SEHA Clinic Al Bateen', type: 'Clinics', theme: 'healthcare', layerId: 328, address: 'Al Bateen Area', emirate: 'Abu Dhabi', coordinates: [54.3415, 24.4625] },
  { id: 'c2', name: 'Mediclinic Airport Road', type: 'Clinics', theme: 'healthcare', layerId: 328, address: 'Airport Road', emirate: 'Abu Dhabi', coordinates: [54.4152, 24.4358] },
  { id: 'c3', name: 'HealthPlus Family Clinic', type: 'Clinics', theme: 'healthcare', layerId: 328, address: 'Al Khalidiya', emirate: 'Abu Dhabi', coordinates: [54.3385, 24.4785] },
  { id: 'c4', name: 'SEHA Al Mushrif Clinic', type: 'Clinics', theme: 'healthcare', layerId: 328, address: 'Al Mushrif', emirate: 'Abu Dhabi', coordinates: [54.3825, 24.4585] },
  { id: 'c5', name: 'Aster Clinic Al Nahda', type: 'Clinics', theme: 'healthcare', layerId: 328, address: 'Al Nahda', emirate: 'Dubai', coordinates: [55.3712, 25.2885] },
  { id: 'c6', name: 'Prime Medical Center', type: 'Clinics', theme: 'healthcare', layerId: 328, address: 'Deira', emirate: 'Dubai', coordinates: [55.3285, 25.2685] },
  { id: 'c7', name: 'NMC Clinic Sharjah', type: 'Clinics', theme: 'healthcare', layerId: 328, address: 'Al Majaz', emirate: 'Sharjah', coordinates: [55.3985, 25.3185] },

  // ============ HEALTHCARE - DIAGNOSTIC CENTERS ============
  { id: 'd1', name: 'Gulf Diagnostic Center', type: 'Diagnostic Centers', theme: 'healthcare', layerId: 217, address: 'Tourist Club Area', emirate: 'Abu Dhabi', coordinates: [54.3585, 24.4925] },
  { id: 'd2', name: 'Al Borg Medical Laboratories', type: 'Diagnostic Centers', theme: 'healthcare', layerId: 217, address: 'Hamdan Street', emirate: 'Abu Dhabi', coordinates: [54.3525, 24.4825] },
  { id: 'd3', name: 'Dr. Sulaiman Al Habib Diagnostics', type: 'Diagnostic Centers', theme: 'healthcare', layerId: 217, address: 'Dubai Healthcare City', emirate: 'Dubai', coordinates: [55.3215, 25.2255] },

  // ============ HEALTHCARE - PHARMACIES ============
  { id: 'p1', name: 'ADNOC Pharmacy Marina Mall', type: 'Pharmacies', theme: 'healthcare', layerId: 332, address: 'Marina Mall', emirate: 'Abu Dhabi', coordinates: [54.3224, 24.4765] },
  { id: 'p2', name: 'Boots Pharmacy Yas Mall', type: 'Pharmacies', theme: 'healthcare', layerId: 332, address: 'Yas Mall', emirate: 'Abu Dhabi', coordinates: [54.6072, 24.4889] },
  { id: 'p3', name: 'Life Pharmacy Al Wahda', type: 'Pharmacies', theme: 'healthcare', layerId: 332, address: 'Al Wahda Mall', emirate: 'Abu Dhabi', coordinates: [54.3812, 24.4678] },
  { id: 'p4', name: 'BinSina Pharmacy MOE', type: 'Pharmacies', theme: 'healthcare', layerId: 332, address: 'Mall of Emirates', emirate: 'Dubai', coordinates: [55.2005, 25.1185] },
  { id: 'p5', name: 'Aster Pharmacy Downtown', type: 'Pharmacies', theme: 'healthcare', layerId: 332, address: 'Downtown Dubai', emirate: 'Dubai', coordinates: [55.2745, 25.1975] },
  { id: 'p6', name: 'Life Pharmacy Sharjah City', type: 'Pharmacies', theme: 'healthcare', layerId: 332, address: 'Sharjah City Centre', emirate: 'Sharjah', coordinates: [55.3945, 25.3285] },

  // ============ HEALTHCARE - AMBULANCE STATIONS ============
  { id: 'a1', name: 'Abu Dhabi Ambulance Center', type: 'Ambulance Stations', theme: 'healthcare', layerId: 196, address: 'Electra Street', emirate: 'Abu Dhabi', coordinates: [54.3622, 24.4895] },
  { id: 'a2', name: 'Emergency Response Unit Al Ain', type: 'Ambulance Stations', theme: 'healthcare', layerId: 196, address: 'Al Ain Central', emirate: 'Abu Dhabi', coordinates: [55.7512, 24.2125] },
  { id: 'a3', name: 'Dubai Corporation Ambulance HQ', type: 'Ambulance Stations', theme: 'healthcare', layerId: 196, address: 'Al Rashidiya', emirate: 'Dubai', coordinates: [55.3825, 25.2385] },
  { id: 'a4', name: 'Sharjah Ambulance Services', type: 'Ambulance Stations', theme: 'healthcare', layerId: 196, address: 'Industrial Area', emirate: 'Sharjah', coordinates: [55.4125, 25.3025] },

  // ============ HEALTHCARE - HEALTHCARE CENTERS ============
  { id: 'hc1', name: 'SEHA Primary Healthcare Al Wathba', type: 'Healthcare Centers', theme: 'healthcare', layerId: 329, address: 'Al Wathba', emirate: 'Abu Dhabi', coordinates: [54.6125, 24.2185] },
  { id: 'hc2', name: 'DHA Primary Healthcare Satwa', type: 'Healthcare Centers', theme: 'healthcare', layerId: 329, address: 'Al Satwa', emirate: 'Dubai', coordinates: [55.2685, 25.2385] },

  // ============ HEALTHCARE - REHABILITATION CENTRES ============
  { id: 'r1', name: 'NeuroSpinal Hospital Rehabilitation', type: 'Rehabilitation Centres', theme: 'healthcare', layerId: 234, address: 'Jumeirah', emirate: 'Dubai', coordinates: [55.2325, 25.2085] },
  { id: 'r2', name: 'Al Ain Rehabilitation Center', type: 'Rehabilitation Centres', theme: 'healthcare', layerId: 234, address: 'Al Ain', emirate: 'Abu Dhabi', coordinates: [55.7385, 24.1985] },

  // ============ EDUCATION - PUBLIC SCHOOLS ============
  { id: 's1', name: 'GEMS Cambridge International School', type: 'Public Schools', theme: 'education', layerId: 211, address: 'Khalifa City A', emirate: 'Abu Dhabi', coordinates: [54.5885, 24.4215] },
  { id: 's2', name: 'Al Ain English Speaking School', type: 'Public Schools', theme: 'education', layerId: 211, address: 'Al Ain', emirate: 'Abu Dhabi', coordinates: [55.7425, 24.1985] },
  { id: 's3', name: 'Abu Dhabi Grammar School', type: 'Public Schools', theme: 'education', layerId: 211, address: 'Tourist Club Area', emirate: 'Abu Dhabi', coordinates: [54.3518, 24.4925] },
  { id: 's4', name: 'Al Ittihad National Private School', type: 'Public Schools', theme: 'education', layerId: 211, address: 'Al Nahyan', emirate: 'Abu Dhabi', coordinates: [54.3685, 24.4585] },
  { id: 's5', name: 'Dubai National School Al Barsha', type: 'Public Schools', theme: 'education', layerId: 211, address: 'Al Barsha', emirate: 'Dubai', coordinates: [55.1985, 25.1025] },
  { id: 's6', name: 'Sharjah English School', type: 'Public Schools', theme: 'education', layerId: 211, address: 'Al Khan', emirate: 'Sharjah', coordinates: [55.3725, 25.3425] },

  // ============ EDUCATION - PRIVATE SCHOOLS ============
  { id: 's7', name: 'Brighton College Abu Dhabi', type: 'Private Schools', theme: 'education', layerId: 212, address: 'Al Reem Island', emirate: 'Abu Dhabi', coordinates: [54.4125, 24.5085] },
  { id: 's8', name: 'Cranleigh Abu Dhabi', type: 'Private Schools', theme: 'education', layerId: 212, address: 'Saadiyat Island', emirate: 'Abu Dhabi', coordinates: [54.4385, 24.5245] },
  { id: 's9', name: 'The British School Al Khubairat', type: 'Private Schools', theme: 'education', layerId: 212, address: 'Al Khubairat', emirate: 'Abu Dhabi', coordinates: [54.3285, 24.4615] },
  { id: 's10', name: 'GEMS Wellington International School', type: 'Private Schools', theme: 'education', layerId: 212, address: 'Al Sufouh', emirate: 'Dubai', coordinates: [55.1585, 25.0985] },
  { id: 's11', name: 'Dubai College', type: 'Private Schools', theme: 'education', layerId: 212, address: 'Al Sufouh', emirate: 'Dubai', coordinates: [55.1685, 25.1025] },
  { id: 's12', name: 'Emirates International School Jumeirah', type: 'Private Schools', theme: 'education', layerId: 212, address: 'Jumeirah', emirate: 'Dubai', coordinates: [55.2385, 25.2185] },
  { id: 's13', name: 'Victoria International School Sharjah', type: 'Private Schools', theme: 'education', layerId: 212, address: 'Muwaileh', emirate: 'Sharjah', coordinates: [55.5025, 25.2885] },

  // ============ EDUCATION - CHARTER SCHOOLS ============
  { id: 's14', name: 'Aldar Academies Charter School', type: 'Charter Schools', theme: 'education', layerId: 208, address: 'Mohammed Bin Zayed City', emirate: 'Abu Dhabi', coordinates: [54.5485, 24.3585] },
  { id: 's15', name: 'GEMS Al Khaleej Charter School', type: 'Charter Schools', theme: 'education', layerId: 208, address: 'Al Quoz', emirate: 'Dubai', coordinates: [55.2285, 25.1285] },

  // ============ EDUCATION - NURSERIES ============
  { id: 'n1', name: 'Yellow Brick Nursery', type: 'Nurseries', theme: 'education', layerId: 209, address: 'Al Muroor', emirate: 'Abu Dhabi', coordinates: [54.3782, 24.4528] },
  { id: 'n2', name: 'Little Gems Learning Center', type: 'Nurseries', theme: 'education', layerId: 209, address: 'Al Reef', emirate: 'Abu Dhabi', coordinates: [54.6125, 24.3985] },
  { id: 'n3', name: 'Apple Tree Nursery', type: 'Nurseries', theme: 'education', layerId: 209, address: 'Khalidiya', emirate: 'Abu Dhabi', coordinates: [54.3412, 24.4695] },
  { id: 'n4', name: 'Blossom Nursery JLT', type: 'Nurseries', theme: 'education', layerId: 209, address: 'JLT', emirate: 'Dubai', coordinates: [55.1485, 25.0685] },
  { id: 'n5', name: 'Kids First Nursery', type: 'Nurseries', theme: 'education', layerId: 209, address: 'Al Qusais', emirate: 'Dubai', coordinates: [55.3885, 25.2725] },
  { id: 'n6', name: 'Chubby Cheeks Nursery Sharjah', type: 'Nurseries', theme: 'education', layerId: 209, address: 'Al Nahda', emirate: 'Sharjah', coordinates: [55.3785, 25.3085] },

  // ============ EDUCATION - POD CENTERS ============
  { id: 'pod1', name: 'Abu Dhabi POD Center', type: 'POD Centers', theme: 'education', layerId: 210, address: 'Al Bateen', emirate: 'Abu Dhabi', coordinates: [54.3485, 24.4585] },
  { id: 'pod2', name: 'Dubai Knowledge Park POD', type: 'POD Centers', theme: 'education', layerId: 210, address: 'Knowledge Park', emirate: 'Dubai', coordinates: [55.1585, 25.0885] },
];

// Layer ID to facility type mapping
export const layerToFacilityTypes: Record<number, string[]> = {
  330: ['Hospitals'],
  328: ['Clinics'],
  217: ['Diagnostic Centers'],
  332: ['Pharmacies'],
  329: ['Healthcare Centers'],
  196: ['Ambulance Stations'],
  234: ['Rehabilitation Centres'],
  235: ['Mobile Health Units'],
  211: ['Public Schools'],
  212: ['Private Schools'],
  208: ['Charter Schools'],
  209: ['Nurseries'],
  210: ['POD Centers'],
};

// Facility type to layer ID mapping
export const facilityTypeToLayer: Record<string, number> = {
  'Hospitals': 330,
  'Clinics': 328,
  'Diagnostic Centers': 217,
  'Pharmacies': 332,
  'Healthcare Centers': 329,
  'Ambulance Stations': 196,
  'Rehabilitation Centres': 234,
  'Mobile Health Units': 235,
  'Public Schools': 211,
  'Private Schools': 212,
  'Charter Schools': 208,
  'Nurseries': 209,
  'POD Centers': 210,
};

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Enhanced search function with AI intent
export interface AISearchIntent {
  intent: string;
  facilityTypes: string[];
  emirate: string | null;
  themes: string[];
  isProximitySearch: boolean;
  keywords: string[];
  suggestedZoom: number;
  responseMessage: string;
}

export function filterFacilities(
  facilities: Facility[],
  aiIntent: AISearchIntent,
  userLocation?: { lat: number; lng: number }
): Facility[] {
  let filtered = [...facilities];

  // Filter by themes
  if (aiIntent.themes.length > 0) {
    filtered = filtered.filter(f => aiIntent.themes.includes(f.theme));
  }

  // Filter by facility types
  if (aiIntent.facilityTypes.length > 0) {
    filtered = filtered.filter(f => 
      aiIntent.facilityTypes.some(type => 
        f.type.toLowerCase().includes(type.toLowerCase()) ||
        type.toLowerCase().includes(f.type.toLowerCase())
      )
    );
  }

  // Filter by emirate
  if (aiIntent.emirate) {
    filtered = filtered.filter(f => 
      f.emirate.toLowerCase() === aiIntent.emirate!.toLowerCase()
    );
  }

  // Filter by keywords
  if (aiIntent.keywords.length > 0) {
    const keywordFiltered = filtered.filter(f => 
      aiIntent.keywords.some(keyword =>
        f.name.toLowerCase().includes(keyword) ||
        f.type.toLowerCase().includes(keyword) ||
        f.address.toLowerCase().includes(keyword)
      )
    );
    // Only apply keyword filter if it returns results
    if (keywordFiltered.length > 0) {
      filtered = keywordFiltered;
    }
  }

  // Calculate distances if user location is available
  if (userLocation) {
    filtered = filtered.map(f => ({
      ...f,
      distance: calculateDistance(userLocation.lat, userLocation.lng, f.coordinates[1], f.coordinates[0])
    }));
    // Sort by distance
    filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  return filtered;
}
