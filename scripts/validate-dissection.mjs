import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { DISSECTION_PRESETS, DISSECTION_LAYERS, INITIAL_CLIPPING_STATE } from '../app/dissection.ts';
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

console.log('\nAll dissection presets, progressive layers, and cross-section clipping specifications passed validation.');
