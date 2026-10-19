import type { SystemId } from './anatomy';

export type ClippingOrientation = 'axial' | 'sagittal' | 'coronal';

export interface ClippingState {
  enabled: boolean;
  orientation: ClippingOrientation;
  offset: number; // 0 to 100 percentage
  inverted: boolean;
}

export interface DissectionPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  systems: SystemId[];
}

export const DISSECTION_PRESETS: DissectionPreset[] = [
  {
    id: 'full-body',
    name: 'Full Body',
    badge: 'Complete',
    description: 'All 14 standard internal physiological systems assembled in physiological configuration.',
    systems: [
      'cardiac',
      'sensory',
      'skeletal',
      'muscular',
      'arterial',
      'venous',
      'nervous',
      'respiratory',
      'digestive',
      'urinary',
      'lymphatic',
      'endocrine',
      'reproductive',
      'connective'
    ]
  },
  {
    id: 'superficial',
    name: 'Skin & Superficial',
    badge: 'Surface',
    description: 'Body surface reference envelope (integumentary) with facial sensory architecture.',
    systems: ['integumentary', 'sensory']
  },
  {
    id: 'muscular',
    name: 'Muscular Anatomy',
    badge: 'Muscles',
    description: 'Superficial and deep skeletal musculature with tendon and connective tissues.',
    systems: ['muscular', 'connective']
  },
  {
    id: 'skeletal',
    name: 'Skeletal Framework',
    badge: 'Bones',
    description: 'Axial and appendicular osseous skeleton including cartilaginous articulations.',
    systems: ['skeletal', 'connective']
  },
  {
    id: 'visceral',
    name: 'Internal Organs',
    badge: 'Viscera',
    description: 'Thoracic, abdominal, and pelvic viscera unimpeded by musculoskeletal walls.',
    systems: ['cardiac', 'respiratory', 'digestive', 'urinary', 'endocrine', 'reproductive']
  },
  {
    id: 'cardiopulmonary',
    name: 'Cardiopulmonary',
    badge: 'Thoracic/Vascular',
    description: 'The heart, pulmonary lobes, tracheobronchial airway, and systemic and pulmonary vessels.',
    systems: ['cardiac', 'respiratory', 'arterial', 'venous']
  }
];

export interface ProgressiveLayer {
  id: string;
  name: string;
  system: SystemId;
  description: string;
}

export const DISSECTION_LAYERS: ProgressiveLayer[] = [
  {
    id: 'layer-skin',
    name: 'Skin / Body Surface',
    system: 'integumentary',
    description: 'Translucent outer barrier and body envelope'
  },
  {
    id: 'layer-muscle',
    name: 'Skeletal Musculature',
    system: 'muscular',
    description: 'Superficial and deep muscular layers'
  },
  {
    id: 'layer-vessels',
    name: 'Arterial & Venous Vessels',
    system: 'arterial', // arterial and venous handled together
    description: 'Circulatory vascular conduits'
  },
  {
    id: 'layer-nerves',
    name: 'Nervous System',
    system: 'nervous',
    description: 'Brain, spinal cord, and peripheral nerves'
  },
  {
    id: 'layer-viscera',
    name: 'Digestive & Visceral Organs',
    system: 'digestive',
    description: 'Gastrointestinal and abdominal organs'
  }
];

export const INITIAL_CLIPPING_STATE: ClippingState = {
  enabled: false,
  orientation: 'axial',
  offset: 65, // ~1.12m (thoracic / heart level)
  inverted: false
};

/**
 * Resolves the effective clipping state passed to the 3D scene.
 * Guarantees that clipping is only active when Dissection Mode is explicitly open
 * and not suppressed by Guided Tours or Learning Mode.
 */
export function resolveEffectiveClippingState(
  dissectionOpen: boolean,
  activeGuide: boolean,
  activeLearning: boolean,
  clippingState: ClippingState
): ClippingState {
  if (!dissectionOpen || activeGuide || activeLearning) {
    return INITIAL_CLIPPING_STATE;
  }
  return clippingState;
}
