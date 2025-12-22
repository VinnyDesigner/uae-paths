import { ThemeGroup, Facility } from '@/types/map';
import { categoryColors } from '@/lib/mapColors';

// Helper to get color from unified system
const getColor = (typeName: string) => categoryColors[typeName]?.base || '#64748b';

export const healthcareLayers: ThemeGroup = {
  id: 350,
  name: 'Healthcare & Wellness',
  description: 'Healthcare facilities and emergency services',
  icon: 'Heart',
  colorClass: 'healthcare',
  layers: [
    { id: 330, name: 'Hospitals', description: 'Major hospitals and medical centers', visible: true, color: getColor('Hospitals'), icon: 'Building2' },
    { id: 328, name: 'Clinics', description: 'Medical clinics and outpatient facilities', visible: false, color: getColor('Clinics'), icon: 'Stethoscope' },
    { id: 217, name: 'Diagnostic Centers', description: 'Medical testing and diagnostics', visible: false, color: getColor('Diagnostic Centers'), icon: 'Microscope' },
    { id: 332, name: 'Pharmacies', description: 'Pharmacies and drug stores', visible: false, color: getColor('Pharmacies'), icon: 'Pill' },
    { id: 329, name: 'Healthcare Centers', description: 'Primary healthcare centers', visible: false, color: getColor('Healthcare Centers'), icon: 'HeartPulse' },
    { id: 196, name: 'Ambulance Stations', description: 'Emergency ambulance stations', visible: false, color: getColor('Ambulance Stations'), icon: 'Siren' },
    { id: 234, name: 'Rehabilitation Centres', description: 'Physical therapy and rehabilitation', visible: false, color: getColor('Rehabilitation Centres'), icon: 'Accessibility' },
    { id: 235, name: 'Mobile Health Units', description: 'Mobile healthcare services', visible: false, color: getColor('Mobile Health Units'), icon: 'Truck' },
  ],
};

export const educationLayers: ThemeGroup = {
  id: 300,
  name: 'Education',
  description: 'Educational institutions and learning centers',
  icon: 'GraduationCap',
  colorClass: 'education',
  layers: [
    { id: 211, name: 'Public Schools', description: 'Government public schools', visible: true, color: getColor('Public Schools'), icon: 'School' },
    { id: 212, name: 'Private Schools', description: 'Private educational institutions', visible: false, color: getColor('Private Schools'), icon: 'Building' },
    { id: 208, name: 'Charter Schools', description: 'Charter and specialized schools', visible: false, color: getColor('Charter Schools'), icon: 'BookOpen' },
    { id: 209, name: 'Nurseries', description: 'Early childhood education centers', visible: false, color: getColor('Nurseries'), icon: 'Baby' },
    { id: 210, name: 'POD Centers', description: 'Professional Outreach for Development', visible: false, color: getColor('POD Centers'), icon: 'Users' },
  ],
};

export const themeGroups: ThemeGroup[] = [healthcareLayers, educationLayers];

// Sample facilities data (in production, this would come from the ArcGIS MapServer)
export const sampleFacilities: Facility[] = [
  // Healthcare - Hospitals
  { id: 'h1', name: 'Cleveland Clinic Abu Dhabi', type: 'Hospitals', theme: 'healthcare', layerId: 330, address: 'Al Maryah Island', emirate: 'Abu Dhabi', coordinates: [54.3952, 24.5015] },
  { id: 'h2', name: 'Sheikh Khalifa Medical City', type: 'Hospitals', theme: 'healthcare', layerId: 330, address: 'Karamah Street', emirate: 'Abu Dhabi', coordinates: [54.3673, 24.4755] },
  { id: 'h3', name: 'Burjeel Hospital', type: 'Hospitals', theme: 'healthcare', layerId: 330, address: 'Najda Street', emirate: 'Abu Dhabi', coordinates: [54.3590, 24.4885] },
  { id: 'h4', name: 'NMC Royal Hospital', type: 'Hospitals', theme: 'healthcare', layerId: 330, address: 'Khalifa City', emirate: 'Abu Dhabi', coordinates: [54.5683, 24.4165] },
  { id: 'h5', name: 'Al Ain Hospital', type: 'Hospitals', theme: 'healthcare', layerId: 330, address: 'Al Ain City Center', emirate: 'Abu Dhabi', coordinates: [55.7608, 24.2075] },

  // Healthcare - Clinics
  { id: 'c1', name: 'SEHA Clinic Al Bateen', type: 'Clinics', theme: 'healthcare', layerId: 328, address: 'Al Bateen Area', emirate: 'Abu Dhabi', coordinates: [54.3415, 24.4625] },
  { id: 'c2', name: 'Mediclinic Airport Road', type: 'Clinics', theme: 'healthcare', layerId: 328, address: 'Airport Road', emirate: 'Abu Dhabi', coordinates: [54.4152, 24.4358] },
  { id: 'c3', name: 'HealthPlus Family Clinic', type: 'Clinics', theme: 'healthcare', layerId: 328, address: 'Al Khalidiya', emirate: 'Abu Dhabi', coordinates: [54.3385, 24.4785] },

  // Healthcare - Pharmacies
  { id: 'p1', name: 'ADNOC Pharmacy Marina Mall', type: 'Pharmacies', theme: 'healthcare', layerId: 332, address: 'Marina Mall', emirate: 'Abu Dhabi', coordinates: [54.3224, 24.4765] },
  { id: 'p2', name: 'Boots Pharmacy Yas Mall', type: 'Pharmacies', theme: 'healthcare', layerId: 332, address: 'Yas Mall', emirate: 'Abu Dhabi', coordinates: [54.6072, 24.4889] },
  { id: 'p3', name: 'Life Pharmacy Al Wahda', type: 'Pharmacies', theme: 'healthcare', layerId: 332, address: 'Al Wahda Mall', emirate: 'Abu Dhabi', coordinates: [54.3812, 24.4678] },

  // Healthcare - Ambulance Stations
  { id: 'a1', name: 'Abu Dhabi Ambulance Center', type: 'Ambulance Stations', theme: 'healthcare', layerId: 196, address: 'Electra Street', emirate: 'Abu Dhabi', coordinates: [54.3622, 24.4895] },
  { id: 'a2', name: 'Emergency Response Unit Al Ain', type: 'Ambulance Stations', theme: 'healthcare', layerId: 196, address: 'Al Ain Central', emirate: 'Abu Dhabi', coordinates: [55.7512, 24.2125] },

  // Education - Public Schools
  { id: 's1', name: 'GEMS Cambridge International School', type: 'Public Schools', theme: 'education', layerId: 211, address: 'Khalifa City A', emirate: 'Abu Dhabi', coordinates: [54.5885, 24.4215] },
  { id: 's2', name: 'Al Ain English Speaking School', type: 'Public Schools', theme: 'education', layerId: 211, address: 'Al Ain', emirate: 'Abu Dhabi', coordinates: [55.7425, 24.1985] },
  { id: 's3', name: 'Abu Dhabi Grammar School', type: 'Public Schools', theme: 'education', layerId: 211, address: 'Tourist Club Area', emirate: 'Abu Dhabi', coordinates: [54.3518, 24.4925] },

  // Education - Private Schools
  { id: 's4', name: 'Brighton College Abu Dhabi', type: 'Private Schools', theme: 'education', layerId: 212, address: 'Al Reem Island', emirate: 'Abu Dhabi', coordinates: [54.4125, 24.5085] },
  { id: 's5', name: 'Cranleigh Abu Dhabi', type: 'Private Schools', theme: 'education', layerId: 212, address: 'Saadiyat Island', emirate: 'Abu Dhabi', coordinates: [54.4385, 24.5245] },
  { id: 's6', name: 'The British School Al Khubairat', type: 'Private Schools', theme: 'education', layerId: 212, address: 'Al Khubairat', emirate: 'Abu Dhabi', coordinates: [54.3285, 24.4615] },

  // Education - Nurseries
  { id: 'n1', name: 'Yellow Brick Nursery', type: 'Nurseries', theme: 'education', layerId: 209, address: 'Al Muroor', emirate: 'Abu Dhabi', coordinates: [54.3782, 24.4528] },
  { id: 'n2', name: 'Little Gems Learning Center', type: 'Nurseries', theme: 'education', layerId: 209, address: 'Al Reef', emirate: 'Abu Dhabi', coordinates: [54.6125, 24.3985] },
  { id: 'n3', name: 'Apple Tree Nursery', type: 'Nurseries', theme: 'education', layerId: 209, address: 'Khalidiya', emirate: 'Abu Dhabi', coordinates: [54.3412, 24.4695] },
];

export const searchSuggestions = [
  { text: 'Nearest hospital', type: 'query' as const, icon: 'Search' },
  { text: 'Hospitals in Abu Dhabi', type: 'query' as const, icon: 'Search' },
  { text: 'Nearby schools', type: 'query' as const, icon: 'Search' },
  { text: 'Pharmacies near me', type: 'query' as const, icon: 'Search' },
  { text: 'Clinics in Al Ain', type: 'query' as const, icon: 'Search' },
  { text: 'Private schools Abu Dhabi', type: 'query' as const, icon: 'Search' },
];

export const emirates = [
  'All Emirates',
  'Abu Dhabi',
  'Dubai',
  'Sharjah',
  'Ajman',
  'Ras Al Khaimah',
  'Fujairah',
  'Umm Al Quwain',
];
