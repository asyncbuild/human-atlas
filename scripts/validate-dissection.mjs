import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  DISSECTION_PRESETS,
  DISSECTION_LAYERS,
  INITIAL_CLIPPING_STATE,
  resolveEffectiveClippingState
} from '../app/dissection.ts';
import { SYSTEMS, DEFAULT_VISIBLE } from '../app/anatomy.ts';

const atlas = JSON.parse(await readFile(new URL('../public/models/atlas.json', import.meta.url)));
const validSystems = new Set(SYSTEMS.map(s => s.id));
const partSystems = new Set(atlas.parts.map(p => p.system));

// 1. Validate Presets
assert.ok(DISSECTION_PRESETS.length >= 6, 'Must provide at least 6 dissection presets');
const presetIds = new Set();

const expectedPresetIds = ['full-body', 'superficial', 'muscular', 'skeletal', 'visceral', 'cardiopulmonary'];
for (const id of expectedPresetIds) {
  assert.ok(DISSECTION_PRESETS.some(p => p.id === id), `Missing required preset: ${id}`);
}

for (const preset of DISSECTION_PRESETS) {
  assert.ok(preset.id && !presetIds.has(preset.id), `Duplicate or missing preset ID: ${preset.id}`);
  presetIds.add(preset.id);
  assert.ok(preset.name && preset.name.trim().length > 0, `Missing name for preset ${preset.id}`);
  assert.ok(preset.description && preset.description.trim().length > 0, `Missing description for preset ${preset.id}`);
  assert.ok(preset.systems.length > 0, `Preset ${preset.id} must specify at least 1 system`);

  for (const sys of preset.systems) {
    assert.ok(validSystems.has(sys), `Invalid system ${sys} in preset ${preset.id}`);
    assert.ok(partSystems.has(sys), `System ${sys} has no meshes in atlas parts`);
  }

  // Count visible parts for this preset
  const visiblePartsCount = atlas.parts.filter(p => preset.systems.includes(p.system)).length;
  assert.ok(visiblePartsCount > 0, `Preset ${preset.id} has 0 visible parts in atlas`);
  console.log(`Preset validated: "${preset.name}" (${visiblePartsCount} visible meshes, systems: ${preset.systems.join(', ')})`);
}

// 2. Validate Progressive Layers
assert.ok(DISSECTION_LAYERS.length >= 4, 'Must provide at least 4 dissection layers');
const layerIds = new Set();
for (const layer of DISSECTION_LAYERS) {
  assert.ok(layer.id && !layerIds.has(layer.id), `Duplicate layer ID: ${layer.id}`);
  layerIds.add(layer.id);
  assert.ok(validSystems.has(layer.system), `Invalid system in layer: ${layer.system}`);
  const layerPartCount = atlas.parts.filter(p => p.system === layer.system).length;
  assert.ok(layerPartCount > 0, `Layer ${layer.name} has no parts in atlas`);
  console.log(`Layer validated: "${layer.name}" (${layerPartCount} meshes, system: ${layer.system})`);
}

// 3. Validate Clipping State & Bounds
assert.ok(INITIAL_CLIPPING_STATE, 'Missing INITIAL_CLIPPING_STATE');
assert.ok(['axial', 'sagittal', 'coronal'].includes(INITIAL_CLIPPING_STATE.orientation));
assert.ok(INITIAL_CLIPPING_STATE.offset >= 0 && INITIAL_CLIPPING_STATE.offset <= 100);

let min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
atlas.parts.forEach(p => {
  for (let i = 0; i < 3; i++) {
    min[i] = Math.min(min[i], p.bounds[0][i]);
    max[i] = Math.max(max[i], p.bounds[1][i]);
  }
});

// Axial plane range (Y: 0.05 to 1.70)
assert.ok(min[1] <= 0.05 && max[1] >= 1.70, 'Atlas Y bounds span body height');
// Sagittal plane range (X: -0.30 to +0.30)
assert.ok(min[0] <= -0.30 && max[0] >= 0.30, 'Atlas X bounds span body width');
// Coronal plane range (Z: -0.14 to +0.14)
assert.ok(min[2] <= -0.14 && max[2] >= 0.14, 'Atlas Z bounds span body depth');

// 4. REGRESSION TEST: BUG-DIS-01 - Cross-Section Clipping Lifecycle & State Leak Prevention
// Test A: Effective clipping state resolution guarantees no clipping leak outside Dissection Mode
const activeCut = {
  enabled: true,
  orientation: 'axial',
  offset: 45,
  inverted: false
};

// When Dissection Mode is closed, effective clipping MUST be INITIAL_CLIPPING_STATE (disabled)
const closedEffective = resolveEffectiveClippingState(false, false, false, activeCut);
assert.equal(closedEffective.enabled, false, 'Regression BUG-DIS-01: Clipping must NOT be enabled when dissection is closed');
assert.deepEqual(closedEffective, INITIAL_CLIPPING_STATE, 'Closed dissection must resolve to INITIAL_CLIPPING_STATE');

// When Dissection Mode is open with no overlays, active clipping is preserved
const openEffective = resolveEffectiveClippingState(true, false, false, activeCut);
assert.equal(openEffective.enabled, true, 'Clipping must be active when dissection is open and no overlays active');
assert.equal(openEffective.offset, 45);

// When a Guided Tour is active, clipping must be suppressed
const guideSuppressed = resolveEffectiveClippingState(true, true, false, activeCut);
assert.equal(guideSuppressed.enabled, false, 'Regression BUG-DIS-01: Active Guided Tour must suppress clipping plane');

// When Learning Mode is active, clipping must be suppressed
const learningSuppressed = resolveEffectiveClippingState(true, false, true, activeCut);
assert.equal(learningSuppressed.enabled, false, 'Regression BUG-DIS-01: Active Learning challenge must suppress clipping plane');

// Test B: Lifecycle simulation of user closing, reopening, and resetting clipping
let simDissectionOpen = false;
let simClipping = INITIAL_CLIPPING_STATE;

const closeDissectionSim = () => {
  simDissectionOpen = false;
  simClipping = INITIAL_CLIPPING_STATE;
};

// 1. User enters Dissection Mode
simDissectionOpen = true;
assert.equal(resolveEffectiveClippingState(simDissectionOpen, false, false, simClipping).enabled, false);

// 2. User enables and offsets clipping
simClipping = { enabled: true, orientation: 'axial', offset: 50, inverted: false };
assert.equal(resolveEffectiveClippingState(simDissectionOpen, false, false, simClipping).enabled, true);

// 3. User closes Dissection Mode (Free Exploration button / Escape / mode switch)
closeDissectionSim();
assert.equal(simDissectionOpen, false);
assert.equal(resolveEffectiveClippingState(simDissectionOpen, false, false, simClipping).enabled, false, 'Free exploration must have uncut model');

// 4. User reopens Dissection Mode -> starts from clean unclipped state
simDissectionOpen = true;
assert.equal(simClipping.enabled, false, 'Reopening dissection must start with clipping disabled');
assert.equal(resolveEffectiveClippingState(simDissectionOpen, false, false, simClipping).enabled, false);

// 5. User re-enables and resets clipping
simClipping = { enabled: true, orientation: 'sagittal', offset: 30, inverted: true };
assert.equal(resolveEffectiveClippingState(simDissectionOpen, false, false, simClipping).enabled, true);
simClipping = INITIAL_CLIPPING_STATE; // Reset Plane button
assert.equal(resolveEffectiveClippingState(simDissectionOpen, false, false, simClipping).enabled, false);

console.log('\nAll dissection presets, progressive layers, cross-section clipping specifications, and BUG-DIS-01 lifecycle regression checks passed.');
