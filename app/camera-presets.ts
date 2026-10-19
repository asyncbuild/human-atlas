import * as T from 'three';
import type { Atlas } from './anatomy';

export interface AnatomicalCameraPreset {
  direction: T.Vector3;
  paddingMultiplier?: number;
  description: string;
}

/**
 * Verified viewing presets for major anatomical structures, calibrated to the
 * atlas.json coordinate system (+X: anatomical left, -X: anatomical right,
 * +Y: superior/cranial, +Z: anterior/ventral, -Z: posterior/dorsal).
 */
export const ANATOMICAL_CAMERA_PRESETS: Record<string, AnatomicalCameraPreset> = {
  // Cardiovascular
  FMA7088: { // Heart
    direction: new T.Vector3(0.18, 0.08, 0.98).normalize(),
    paddingMultiplier: 1.45,
    description: 'Anterior-oblique thoracic view framing cardiac apex and great vessels'
  },
  FMA3734: { // Aorta
    direction: new T.Vector3(0.20, 0.05, 0.97).normalize(),
    paddingMultiplier: 1.35,
    description: 'Anterior-oblique thoracic view tracing the systemic aorta'
  },
  FMA3736: { // Ascending aorta
    direction: new T.Vector3(0.15, 0.05, 0.98).normalize(),
    paddingMultiplier: 1.5,
    description: 'Anterior thoracic view of the ascending aorta'
  },
  FMA3768: { // Arch of aorta
    direction: new T.Vector3(0.20, 0.10, 0.97).normalize(),
    paddingMultiplier: 1.5,
    description: 'Anterior view framing the aortic arch and brachiocephalic branches'
  },
  FMA3784: { // Descending aorta
    direction: new T.Vector3(0.25, 0.05, 0.96).normalize(),
    paddingMultiplier: 1.35,
    description: 'Anterior-oblique view of the thoracic descending aorta'
  },
  FMA3789: { // Abdominal aorta
    direction: new T.Vector3(0.15, 0.05, 0.98).normalize(),
    paddingMultiplier: 1.4,
    description: 'Anterior retroperitoneal view of the abdominal aorta'
  },
  FMA8612: { // Pulmonary trunk
    direction: new T.Vector3(0.12, 0.06, 0.99).normalize(),
    paddingMultiplier: 1.5,
    description: 'Anterior view of the pulmonary trunk arising from the right ventricle'
  },
  FMA4720: { // Superior vena cava
    direction: new T.Vector3(-0.15, 0.05, 0.98).normalize(),
    paddingMultiplier: 1.5,
    description: 'Anterior-right view of the superior vena cava entering the right atrium'
  },
  FMA10951: { // Inferior vena cava
    direction: new T.Vector3(-0.15, 0.05, 0.98).normalize(),
    paddingMultiplier: 1.35,
    description: 'Anterior-right view of the inferior vena cava'
  },

  // Central Nervous System
  FMA50801: { // Brain
    direction: new T.Vector3(0.15, 0.35, 0.92).normalize(),
    paddingMultiplier: 1.45,
    description: 'Anterosuperior cranial view exposing cerebral hemispheres and lobes'
  },
  FMA79876: { // Brainstem
    direction: new T.Vector3(0.10, 0.25, 0.96).normalize(),
    paddingMultiplier: 1.5,
    description: 'Anterosuperior view focusing on midbrain, pons, and medulla'
  },
  FMA67944: { // Cerebellum
    direction: new T.Vector3(0.15, 0.25, -0.95).normalize(),
    paddingMultiplier: 1.45,
    description: 'Posterosuperior view framing cerebellar hemispheres and vermis'
  },
  FMA7647: { // Spinal cord
    direction: new T.Vector3(0.0, 0.05, -1.0).normalize(),
    paddingMultiplier: 1.35,
    description: 'Posterior view displaying longitudinal descending neural tracts'
  },

  // Skeletal & Articular
  FMA46565: { // Skull
    direction: new T.Vector3(0.35, 0.15, 0.92).normalize(),
    paddingMultiplier: 1.4,
    description: 'Three-quarter cranial view displaying neurocranium and facial skeleton'
  },
  FMA13478: { // Vertebral column
    direction: new T.Vector3(0.0, 0.05, -1.0).normalize(),
    paddingMultiplier: 1.35,
    description: 'Posterior view framing the full longitudinal axis of the spine'
  },
  FMA7485: { // Sternum
    direction: new T.Vector3(0.0, 0.02, 1.0).normalize(),
    paddingMultiplier: 1.4,
    description: 'Direct anterior thoracic view framing manubrium, body, and xiphoid'
  },
  FMA7574: { // Ribs
    direction: new T.Vector3(0.25, 0.05, 0.96).normalize(),
    paddingMultiplier: 1.35,
    description: 'Anterior-oblique view of the bilateral thoracic cage'
  },
  FMA7480: { // Rib cage
    direction: new T.Vector3(0.25, 0.05, 0.96).normalize(),
    paddingMultiplier: 1.35,
    description: 'Anterior-oblique view of the complete rib cage'
  },
  FMA24474: { // Right femur
    direction: new T.Vector3(-0.25, 0.02, 0.96).normalize(),
    paddingMultiplier: 1.35,
    description: 'Anterior-lateral view framing the full length of the right femur'
  },
  FMA24475: { // Left femur
    direction: new T.Vector3(0.25, 0.02, 0.96).normalize(),
    paddingMultiplier: 1.35,
    description: 'Anterior-lateral view framing the full length of the left femur'
  },
  FMA9611: { // Bilateral femurs
    direction: new T.Vector3(0.0, 0.02, 1.0).normalize(),
    paddingMultiplier: 1.35,
    description: 'Anterior view framing bilateral thigh long bones'
  },
  FMA23130: { // Right humerus
    direction: new T.Vector3(-0.35, 0.05, 0.93).normalize(),
    paddingMultiplier: 1.35,
    description: 'Anterior-lateral view framing the right arm humerus'
  },
  FMA23131: { // Left humerus
    direction: new T.Vector3(0.35, 0.05, 0.93).normalize(),
    paddingMultiplier: 1.35,
    description: 'Anterior-lateral view framing the left arm humerus'
  },
  FMA13303: { // Bilateral humeri
    direction: new T.Vector3(0.0, 0.05, 1.0).normalize(),
    paddingMultiplier: 1.35,
    description: 'Anterior view framing bilateral arm long bones'
  },

  // Digestive & Visceral
  FMA7148: { // Stomach
    direction: new T.Vector3(0.20, 0.05, 0.97).normalize(),
    paddingMultiplier: 1.4,
    description: 'Anterior-oblique view framing gastric cardia, body, and antrum'
  },
  FMA7197: { // Liver
    direction: new T.Vector3(-0.25, 0.05, 0.96).normalize(),
    paddingMultiplier: 1.35,
    description: 'Anterior-oblique view framing the diaphragmatic liver lobes'
  },
  FMA7202: { // Gallbladder
    direction: new T.Vector3(-0.25, -0.15, 0.95).normalize(),
    paddingMultiplier: 1.6,
    description: 'Anteroinferior view looking toward the inferior visceral liver surface'
  },
  FMA7206: { // Duodenum
    direction: new T.Vector3(0.05, 0.02, 0.99).normalize(),
    paddingMultiplier: 1.5,
    description: 'Anterior epigastric view framing the C-shaped duodenal loop'
  },
  FMA7131: { // Esophagus
    direction: new T.Vector3(0.15, 0.05, 0.98).normalize(),
    paddingMultiplier: 1.35,
    description: 'Anterior-oblique view of the mediastinal muscular esophagus'
  },
  FMA7198: { // Pancreas
    direction: new T.Vector3(0.10, 0.05, 0.99).normalize(),
    paddingMultiplier: 1.45,
    description: 'Anterior view of the retroperitoneal pancreas'
  },
  FMA7196: { // Spleen
    direction: new T.Vector3(0.40, 0.10, 0.91).normalize(),
    paddingMultiplier: 1.5,
    description: 'Left upper quadrant lateral view of the spleen'
  },

  // Urinary
  FMA7204: { // Right kidney
    direction: new T.Vector3(-0.45, 0.15, -0.88).normalize(),
    paddingMultiplier: 1.5,
    description: 'Posterior-oblique right view exposing the right retroperitoneal kidney'
  },
  FMA7205: { // Left kidney
    direction: new T.Vector3(0.45, 0.15, -0.88).normalize(),
    paddingMultiplier: 1.5,
    description: 'Posterior-oblique left view exposing the left retroperitoneal kidney'
  },
  FMA7203: { // Bilateral kidneys
    direction: new T.Vector3(0.0, 0.12, -0.99).normalize(),
    paddingMultiplier: 1.45,
    description: 'Posterior retroperitoneal view framing paired kidneys'
  },
  FMA15900: { // Urinary bladder
    direction: new T.Vector3(0.0, 0.20, 0.98).normalize(),
    paddingMultiplier: 1.5,
    description: 'Anterosuperior view into the pelvic floor framing the bladder'
  },

  // Respiratory
  FMA7309: { // Right lung
    direction: new T.Vector3(-0.35, 0.05, 0.93).normalize(),
    paddingMultiplier: 1.35,
    description: 'Anterior-right view of the trilobed right lung'
  },
  FMA7310: { // Left lung
    direction: new T.Vector3(0.35, 0.05, 0.93).normalize(),
    paddingMultiplier: 1.35,
    description: 'Anterior-left view of the bilobed left lung'
  },
  FMA7394: { // Trachea
    direction: new T.Vector3(0.0, 0.05, 1.0).normalize(),
    paddingMultiplier: 1.45,
    description: 'Anterior cervical-mediastinal view of the trachea'
  },
  FMA13295: { // Diaphragm
    direction: new T.Vector3(0.15, 0.25, 0.95).normalize(),
    paddingMultiplier: 1.35,
    description: 'Anterosuperior view of the musculotendinous diaphragmatic dome'
  }
};

export const DEFAULT_CAMERA_DIRECTION = new T.Vector3(0.25, 0.10, 0.96).normalize();

export function getCameraPresetForConcept(conceptId?: string): AnatomicalCameraPreset {
  if (conceptId && ANATOMICAL_CAMERA_PRESETS[conceptId]) {
    return ANATOMICAL_CAMERA_PRESETS[conceptId];
  }
  return {
    direction: DEFAULT_CAMERA_DIRECTION.clone(),
    paddingMultiplier: 1.4,
    description: 'Default anterior-oblique perspective'
  };
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
}

export interface StructureBoundsResult {
  box: T.Box3;
  center: T.Vector3;
  size: T.Vector3;
}

export interface StructureFramingResult {
  box: T.Box3;
  center: T.Vector3;
  size: T.Vector3;
  distance: number;
  cameraPosition: T.Vector3;
  targetPosition: T.Vector3;
  preset: AnatomicalCameraPreset;
}

export interface FramingOptions {
  viewportWidth: number;
  viewportHeight: number;
  cameraFov: number; // in degrees
  cameraAspect: number;
  inspectorOpen?: boolean;
  conceptId?: string;
  paddingMultiplier?: number;
}

export function calculateStructureBounds(
  atlas: Atlas,
  selectedPartIds: string[],
  offsets?: (T.Vector3 | [number, number, number] | Float32Array)[]
): StructureBoundsResult | null {
  if (!selectedPartIds || selectedPartIds.length === 0) return null;

  const idSet = new Set(selectedPartIds);
  const box = new T.Box3();
  let matchedCount = 0;

  for (let i = 0; i < atlas.parts.length; i++) {
    const p = atlas.parts[i];
    if (idSet.has(p.id)) {
      const min = new T.Vector3().fromArray(p.bounds[0]);
      const max = new T.Vector3().fromArray(p.bounds[1]);
      const partBox = new T.Box3(min, max);

      if (offsets && offsets[i]) {
        const off = offsets[i];
        if (off instanceof T.Vector3) {
          partBox.translate(off);
        } else if (Array.isArray(off)) {
          partBox.translate(new T.Vector3(off[0], off[1], off[2]));
        } else if (off.length >= 3) {
          partBox.translate(new T.Vector3(off[0], off[1], off[2]));
        }
      }
      box.union(partBox);
      matchedCount++;
    }
  }

  if (matchedCount === 0 || box.isEmpty()) return null;

  const center = box.getCenter(new T.Vector3());
  const size = box.getSize(new T.Vector3());

  // Enforce small minimum size so micro-structures do not cause division by zero or extreme zoom
  size.x = Math.max(size.x, 0.015);
  size.y = Math.max(size.y, 0.015);
  size.z = Math.max(size.z, 0.015);

  return { box, center, size };
}

export function calculateStructureFraming(
  atlas: Atlas,
  selectedPartIds: string[],
  options: FramingOptions,
  offsets?: (T.Vector3 | [number, number, number] | Float32Array)[]
): StructureFramingResult | null {
  const bounds = calculateStructureBounds(atlas, selectedPartIds, offsets);
  if (!bounds) return null;

  const { box, center, size } = bounds;
  const { viewportWidth: w, viewportHeight: h, cameraFov, cameraAspect, inspectorOpen, conceptId } = options;

  const mobile = w < 768;
  const landscape = w > h && h <= 600;

  let left = w > 1100 ? 300 : 20;
  let right = w - 20;
  let top = mobile ? 175 : 90;
  let bottom = h - (mobile ? 180 : 120);

  if (inspectorOpen) {
    if (landscape) {
      right = w - 355;
      top = 80;
      bottom = h - 100;
    } else if (mobile) {
      top = 110;
      bottom = Math.max(top + 80, h * 0.45);
    } else {
      right = w - 385;
      left = w > 1100 ? 305 : 25;
    }
  }

  const availableWidth = Math.max(120, right - left);
  const availableHeight = Math.max(40, bottom - top);

  const preset = getCameraPresetForConcept(conceptId);
  const pad = options.paddingMultiplier ?? preset.paddingMultiplier ?? 1.4;

  const fovRad = T.MathUtils.degToRad(cameraFov / 2);
  const maxDimY = size.y * (h / availableHeight);
  const maxDimX = (size.x * (w / availableWidth)) / Math.max(0.2, cameraAspect);
  const maxDim = Math.max(maxDimY, maxDimX, size.z);

  // Calculate distance ensuring the structure fits within clear screen area
  const distance = Math.max(0.08, (maxDim / (2 * Math.tan(fovRad))) * pad);

  const targetPosition = center.clone();
  const cameraPosition = center.clone().addScaledVector(preset.direction, distance);

  return {
    box,
    center,
    size,
    distance,
    targetPosition,
    cameraPosition,
    preset
  };
}
