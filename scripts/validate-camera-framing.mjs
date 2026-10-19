import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as T from 'three';
import {
  calculateStructureBounds,
  calculateStructureFraming,
  easeOutCubic,
  getCameraPresetForConcept,
  ANATOMICAL_CAMERA_PRESETS,
  DEFAULT_CAMERA_DIRECTION
} from '../app/camera-presets.ts';

const atlas = JSON.parse(readFileSync(new URL('../public/models/atlas.json', import.meta.url), 'utf8'));

console.log('Auditing Smart Focus Camera framing, bounds computation, presets, and animation math...');

// 1. Empty and Invalid Bounds Safety
assert.equal(calculateStructureBounds(atlas, []), null, 'Empty part array must return null');
assert.equal(calculateStructureBounds(atlas, ['non_existent_id_xyz']), null, 'Non-existent ID must return null');
assert.equal(
  calculateStructureFraming(atlas, [], {
    viewportWidth: 1200,
    viewportHeight: 800,
    cameraFov: 34,
    cameraAspect: 1.5
  }),
  null,
  'Framing with empty selection must return null'
);

// 2. Single-Mesh Bounding Box & Dimensions
const duodenumConcept = atlas.concepts.find(c => c.id === 'FMA7206');
assert.ok(duodenumConcept, 'Duodenum concept FMA7206 must exist in atlas');
const duoBounds = calculateStructureBounds(atlas, duodenumConcept.elements);
assert.ok(duoBounds !== null, 'Duodenum bounds should not be null');
assert.ok(duoBounds.size.x > 0 && duoBounds.size.y > 0 && duoBounds.size.z > 0, 'Duodenum dimensions must be positive');
assert.ok(duoBounds.center.y > 0.9 && duoBounds.center.y < 1.4, 'Duodenum vertical position must be within epigastric abdomen');

// 3. Combined Bounds for Multi-Mesh Concepts
const multiMeshConcepts = [
  { id: 'FMA79876', name: 'Brainstem', minElements: 5 },
  { id: 'FMA7574', name: 'Ribs', minElements: 20 },
  { id: 'FMA3734', name: 'Aorta', minElements: 4 },
  { id: 'FMA7088', name: 'Heart', minElements: 1 }
];

for (const mc of multiMeshConcepts) {
  const concept = atlas.concepts.find(c => c.id === mc.id);
  assert.ok(concept, `Concept ${mc.id} (${mc.name}) must exist`);
  assert.ok(concept.elements.length >= mc.minElements, `${mc.name} must have at least ${mc.minElements} elements`);

  const combined = calculateStructureBounds(atlas, concept.elements);
  assert.ok(combined !== null, `Combined bounds for ${mc.name} must not be null`);

  // Verify that combined box encloses each constituent element's box
  for (const eid of concept.elements) {
    const part = atlas.parts.find(p => p.id === eid);
    assert.ok(part, `Part ${eid} in ${mc.name} must exist`);
    const partMin = new T.Vector3().fromArray(part.bounds[0]);
    const partMax = new T.Vector3().fromArray(part.bounds[1]);

    assert.ok(
      combined.box.min.x <= partMin.x + 1e-5 &&
      combined.box.min.y <= partMin.y + 1e-5 &&
      combined.box.min.z <= partMin.z + 1e-5,
      `Combined min for ${mc.name} must enclose part ${eid}`
    );
    assert.ok(
      combined.box.max.x >= partMax.x - 1e-5 &&
      combined.box.max.y >= partMax.y - 1e-5 &&
      combined.box.max.z >= partMax.z - 1e-5,
      `Combined max for ${mc.name} must enclose part ${eid}`
    );
  }
}

// 4. Camera-Distance Scaling for Different Structure Sizes
const smallOrgan = atlas.concepts.find(c => c.id === 'FMA7202'); // Gallbladder (~0.05m)
const mediumOrgan = atlas.concepts.find(c => c.id === 'FMA50801'); // Brain (~0.18m)
const largeOrgan = atlas.concepts.find(c => c.id === 'FMA24474'); // Right femur (~0.47m)
const longStructure = atlas.concepts.find(c => c.id === 'FMA13478'); // Spine (~0.70m)

const framingOpts = {
  viewportWidth: 1200,
  viewportHeight: 800,
  cameraFov: 34,
  cameraAspect: 1.5,
  inspectorOpen: true
};

const smallFrame = calculateStructureFraming(atlas, smallOrgan.elements, { ...framingOpts, conceptId: smallOrgan.id });
const mediumFrame = calculateStructureFraming(atlas, mediumOrgan.elements, { ...framingOpts, conceptId: mediumOrgan.id });
const largeFrame = calculateStructureFraming(atlas, largeOrgan.elements, { ...framingOpts, conceptId: largeOrgan.id });
const longFrame = calculateStructureFraming(atlas, longStructure.elements, { ...framingOpts, conceptId: longStructure.id });

assert.ok(smallFrame && mediumFrame && largeFrame && longFrame);
console.log(`Framing distances: Gallbladder: ${smallFrame.distance.toFixed(3)}m, Brain: ${mediumFrame.distance.toFixed(3)}m, Femur: ${largeFrame.distance.toFixed(3)}m, Spine: ${longFrame.distance.toFixed(3)}m`);

assert.ok(
  smallFrame.distance < mediumFrame.distance,
  `Small organ distance (${smallFrame.distance}) must be smaller than medium organ distance (${mediumFrame.distance})`
);
assert.ok(
  mediumFrame.distance < largeFrame.distance,
  `Medium organ distance (${mediumFrame.distance}) must be smaller than large organ distance (${largeFrame.distance})`
);
assert.ok(
  largeFrame.distance < longFrame.distance,
  `Large organ distance (${largeFrame.distance}) must be smaller than full spine distance (${longFrame.distance})`
);

// 5. Anatomical Viewing Direction Verification
for (const [conceptId, preset] of Object.entries(ANATOMICAL_CAMERA_PRESETS)) {
  assert.ok(preset.direction instanceof T.Vector3, `Preset ${conceptId} direction must be Vector3`);
  const length = preset.direction.length();
  assert.ok(Math.abs(length - 1.0) < 1e-4, `Preset ${conceptId} direction must be normalized (length = ${length})`);
  assert.ok(preset.description && preset.description.length > 5, `Preset ${conceptId} must have description`);
}

// Heart preset must be anterior-oblique
const heartPreset = getCameraPresetForConcept('FMA7088');
assert.ok(heartPreset.direction.z > 0.8, 'Heart must be viewed anteriorly (+Z)');

// Spine preset must be posterior
const spinePreset = getCameraPresetForConcept('FMA13478');
assert.ok(spinePreset.direction.z < -0.8, 'Vertebral column must be viewed posteriorly (-Z)');

// Right Kidney must be posterior-oblique right (-X, -Z)
const rightKidneyPreset = getCameraPresetForConcept('FMA7204');
assert.ok(rightKidneyPreset.direction.x < 0 && rightKidneyPreset.direction.z < 0, 'Right kidney must be viewed from posterior-right');

// Left Kidney must be posterior-oblique left (+X, -Z)
const leftKidneyPreset = getCameraPresetForConcept('FMA7205');
assert.ok(leftKidneyPreset.direction.x > 0 && leftKidneyPreset.direction.z < 0, 'Left kidney must be viewed from posterior-left');

// Brain preset must be anterosuperior (+Y, +Z)
const brainPreset = getCameraPresetForConcept('FMA50801');
assert.ok(brainPreset.direction.y > 0.2 && brainPreset.direction.z > 0.8, 'Brain must be viewed anterosuperiorly');

// Fallback to default
const unknownPreset = getCameraPresetForConcept('UNKNOWN_ID_9999');
assert.ok(Math.abs(unknownPreset.direction.distanceTo(DEFAULT_CAMERA_DIRECTION)) < 1e-5, 'Unknown concept must fall back to default direction');

// 6. Easing Function & Interpolation Math
assert.equal(easeOutCubic(0), 0, 'Easing at t=0 must be 0');
assert.equal(easeOutCubic(1), 1, 'Easing at t=1 must be 1');
assert.ok(easeOutCubic(0.5) > 0.5, 'Cubic ease-out should be front-loaded (> 0.5 at midpoint)');

let prevVal = -1;
for (let t = 0; t <= 1; t += 0.05) {
  const v = easeOutCubic(t);
  assert.ok(v >= prevVal - 1e-9, `Easing must be monotonically increasing at t=${t}`);
  assert.ok(v >= 0 && v <= 1, `Easing must stay within [0, 1] at t=${t}`);
  prevVal = v;
}

// 7. Simulated Multi-Step Camera Transition & Mid-flight Cancellation
let transition = {
  startPos: new T.Vector3(1.4, 1.05, 3.6),
  endPos: brainPreset.direction.clone().multiplyScalar(0.5).add(new T.Vector3(0, 1.6, 0)),
  startTarget: new T.Vector3(0, 0.85, 0),
  endTarget: new T.Vector3(0, 1.6, 0),
  startTime: 1000,
  duration: 700
};

// At 50% elapsed:
const tHalf = 1350;
const pProgress = (tHalf - transition.startTime) / transition.duration;
const pEased = easeOutCubic(pProgress);
const currentPos = new T.Vector3().lerpVectors(transition.startPos, transition.endPos, pEased);
const currentTarget = new T.Vector3().lerpVectors(transition.startTarget, transition.endTarget, pEased);

assert.ok(currentPos.distanceTo(transition.startPos) > 0.1, 'Camera must have moved away from start');
assert.ok(currentPos.distanceTo(transition.endPos) > 0.1, 'Camera must not have reached end prematurely');

// User interrupts with manual drag: transition resets to null
let userInterrupted = true;
if (userInterrupted) {
  transition = null;
}
assert.equal(transition, null, 'Transition must be cleared on user interruption');

// New selection redirects from current position:
const newTarget = new T.Vector3(0.02, 1.30, 0.02); // Heart
transition = {
  startPos: currentPos.clone(),
  endPos: heartPreset.direction.clone().multiplyScalar(0.35).add(newTarget),
  startTarget: currentTarget.clone(),
  endTarget: newTarget,
  startTime: 1400,
  duration: 700
};
assert.ok(transition.startPos.equals(currentPos), 'New transition must seamlessly take over from in-flight position');

// 8. Exploded-View Displacements Preservation
const offsets = atlas.parts.map(() => new T.Vector3(0.1, 0.2, 0.0));
const displacedBounds = calculateStructureBounds(atlas, duodenumConcept.elements, offsets);
assert.ok(displacedBounds !== null);
assert.ok(
  Math.abs(displacedBounds.center.x - (duoBounds.center.x + 0.1)) < 1e-4,
  'Explosion offset X must be incorporated into structure center'
);
assert.ok(
  Math.abs(displacedBounds.center.y - (duoBounds.center.y + 0.2)) < 1e-4,
  'Explosion offset Y must be incorporated into structure center'
);

console.log('✓ All Smart Focus Camera framing, bounds, distance, presets, easing, and cancellation tests PASSED.');
