/**
 * Unified Color System for Smart Map
 * Single source of truth for all category colors
 */

import {
  Building2, Stethoscope, Microscope, Pill, HeartPulse, Siren,
  Accessibility, Truck, School, Building, BookOpen, Baby, Users,
  type LucideIcon
} from 'lucide-react';

export interface CategoryColor {
  base: string;       // 100% color for icons, markers, text
  light: string;      // 8-12% opacity background
  medium: string;     // 15-20% opacity for chips/tags
  glow: string;       // 40% opacity for shadows/glows
  iconName: string;   // Lucide icon name
}

// Category Color Mapping - Single Source of Truth
export const categoryColors: Record<string, CategoryColor> = {
  // Healthcare Categories
  'Hospitals': {
    base: '#0369a1',       // Primary Blue (sky-700)
    light: 'rgba(3, 105, 161, 0.10)',
    medium: 'rgba(3, 105, 161, 0.15)',
    glow: 'rgba(3, 105, 161, 0.40)',
    iconName: 'Building2',
  },
  'Clinics': {
    base: '#0d9488',       // Teal (teal-600)
    light: 'rgba(13, 148, 136, 0.10)',
    medium: 'rgba(13, 148, 136, 0.15)',
    glow: 'rgba(13, 148, 136, 0.40)',
    iconName: 'Stethoscope',
  },
  'Diagnostic Centers': {
    base: '#0891b2',       // Cyan (cyan-600)
    light: 'rgba(8, 145, 178, 0.10)',
    medium: 'rgba(8, 145, 178, 0.15)',
    glow: 'rgba(8, 145, 178, 0.40)',
    iconName: 'Microscope',
  },
  'Pharmacies': {
    base: '#16a34a',       // Green (green-600)
    light: 'rgba(22, 163, 74, 0.10)',
    medium: 'rgba(22, 163, 74, 0.15)',
    glow: 'rgba(22, 163, 74, 0.40)',
    iconName: 'Pill',
  },
  'Healthcare Centers': {
    base: '#14b8a6',       // Mint/Teal (teal-500)
    light: 'rgba(20, 184, 166, 0.10)',
    medium: 'rgba(20, 184, 166, 0.15)',
    glow: 'rgba(20, 184, 166, 0.40)',
    iconName: 'HeartPulse',
  },
  'Ambulance Stations': {
    base: '#dc2626',       // Red (red-600) - Emergency
    light: 'rgba(220, 38, 38, 0.10)',
    medium: 'rgba(220, 38, 38, 0.15)',
    glow: 'rgba(220, 38, 38, 0.40)',
    iconName: 'Siren',
  },
  'Rehabilitation Centres': {
    base: '#7c3aed',       // Purple (violet-600)
    light: 'rgba(124, 58, 237, 0.10)',
    medium: 'rgba(124, 58, 237, 0.15)',
    glow: 'rgba(124, 58, 237, 0.40)',
    iconName: 'Accessibility',
  },
  'Mobile Health Units': {
    base: '#475569',       // Slate/Neutral Blue (slate-600)
    light: 'rgba(71, 85, 105, 0.10)',
    medium: 'rgba(71, 85, 105, 0.15)',
    glow: 'rgba(71, 85, 105, 0.40)',
    iconName: 'Truck',
  },
  // Education Categories
  'Public Schools': {
    base: '#38B6FF',       // Light Blue (education brand)
    light: 'rgba(56, 182, 255, 0.10)',
    medium: 'rgba(56, 182, 255, 0.15)',
    glow: 'rgba(56, 182, 255, 0.40)',
    iconName: 'School',
  },
  'Private Schools': {
    base: '#3b82f6',       // Blue (blue-500)
    light: 'rgba(59, 130, 246, 0.10)',
    medium: 'rgba(59, 130, 246, 0.15)',
    glow: 'rgba(59, 130, 246, 0.40)',
    iconName: 'Building',
  },
  'Charter Schools': {
    base: '#6366f1',       // Indigo (indigo-500)
    light: 'rgba(99, 102, 241, 0.10)',
    medium: 'rgba(99, 102, 241, 0.15)',
    glow: 'rgba(99, 102, 241, 0.40)',
    iconName: 'BookOpen',
  },
  'Nurseries': {
    base: '#f59e0b',       // Amber (amber-500)
    light: 'rgba(245, 158, 11, 0.10)',
    medium: 'rgba(245, 158, 11, 0.15)',
    glow: 'rgba(245, 158, 11, 0.40)',
    iconName: 'Baby',
  },
  'POD Centers': {
    base: '#8b5cf6',       // Violet (violet-500)
    light: 'rgba(139, 92, 246, 0.10)',
    medium: 'rgba(139, 92, 246, 0.15)',
    glow: 'rgba(139, 92, 246, 0.40)',
    iconName: 'Users',
  },
};

// Get category color by facility type name
export function getCategoryColor(typeName: string): CategoryColor {
  return categoryColors[typeName] || {
    base: '#64748b',
    light: 'rgba(100, 116, 139, 0.10)',
    medium: 'rgba(100, 116, 139, 0.15)',
    glow: 'rgba(100, 116, 139, 0.40)',
    iconName: 'Building2',
  };
}

// Get category color by layer ID
export function getCategoryColorByLayerId(layerId: number): CategoryColor {
  const layerToTypeMap: Record<number, string> = {
    330: 'Hospitals',
    328: 'Clinics',
    217: 'Diagnostic Centers',
    332: 'Pharmacies',
    329: 'Healthcare Centers',
    196: 'Ambulance Stations',
    234: 'Rehabilitation Centres',
    235: 'Mobile Health Units',
    211: 'Public Schools',
    212: 'Private Schools',
    208: 'Charter Schools',
    209: 'Nurseries',
    210: 'POD Centers',
  };
  
  const typeName = layerToTypeMap[layerId];
  return typeName ? getCategoryColor(typeName) : getCategoryColor('');
}

// Status colors (separate from category colors)
export const statusColors = {
  emergency: {
    base: '#dc2626',
    light: 'rgba(220, 38, 38, 0.10)',
    text: '#991b1b',
  },
  success: {
    base: '#16a34a',
    light: 'rgba(22, 163, 74, 0.10)',
    text: '#166534',
  },
  neutral: {
    base: '#64748b',
    light: 'rgba(100, 116, 139, 0.10)',
    text: '#475569',
  },
  info: {
    base: '#0369a1',
    light: 'rgba(3, 105, 161, 0.10)',
    text: '#0c4a6e',
  },
};

// Primary CTA color (neutral, not category-colored)
export const ctaColor = {
  base: '#0c4a6e',
  gradient: 'linear-gradient(135deg, #0c4a6e 0%, #063660 100%)',
};

// Icon mapping for categories
const categoryIcons: Record<string, LucideIcon> = {
  'Hospitals': Building2,
  'Clinics': Stethoscope,
  'Diagnostic Centers': Microscope,
  'Pharmacies': Pill,
  'Healthcare Centers': HeartPulse,
  'Ambulance Stations': Siren,
  'Rehabilitation Centres': Accessibility,
  'Mobile Health Units': Truck,
  'Public Schools': School,
  'Private Schools': Building,
  'Charter Schools': BookOpen,
  'Nurseries': Baby,
  'POD Centers': Users,
  // Theme group names
  'Healthcare & Wellness': HeartPulse,
  'Education': School,
};

// Get category icon by name
export function getCategoryIcon(typeName: string): LucideIcon {
  return categoryIcons[typeName] || Building2;
}
