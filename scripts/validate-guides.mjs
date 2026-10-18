import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { GUIDED_EXPLORATIONS } from '../app/guides.ts';
import { KNOWLEDGE_BASE } from '../app/knowledge.ts';

const atlas = JSON.parse(await readFile(new URL('../public/models/atlas.json', import.meta.url)));
const conceptMap = new Map(atlas.concepts.map(c => [c.id, c]));
const partSet = new Set(atlas.parts.map(p => p.id));

assert.ok(GUIDED_EXPLORATIONS.length >= 3, 'Must have at least 3 guided explorations');
const guideIds = new Set();

let totalSteps = 0;

for (const guide of GUIDED_EXPLORATIONS) {
  assert.ok(guide.id && !guideIds.has(guide.id), `Duplicate or missing guide id: ${guide.id}`);
  guideIds.add(guide.id);

  assert.ok(guide.title && guide.title.trim().length > 0, `Missing title for guide ${guide.id}`);
  assert.ok(guide.description && guide.description.trim().length > 0, `Missing description for guide ${guide.id}`);
  assert.ok(['Beginner', 'Intermediate', 'Advanced'].includes(guide.difficulty), `Invalid difficulty in ${guide.id}`);
  assert.ok(guide.steps && guide.steps.length >= 2, `Guide ${guide.id} must have at least 2 steps`);

  const stepIds = new Set();

  for (let i = 0; i < guide.steps.length; i++) {
    const step = guide.steps[i];
    assert.ok(step.id && !stepIds.has(step.id), `Duplicate or missing step id in ${guide.id}: ${step.id}`);
    stepIds.add(step.id);

    assert.ok(step.title && step.title.trim().length > 0, `Missing step title in ${guide.id}:${step.id}`);
    assert.ok(step.explanation && step.explanation.trim().length > 0, `Missing step explanation in ${guide.id}:${step.id}`);

    // Verify concept exists in atlas.json
    const concept = conceptMap.get(step.conceptId);
    assert.ok(concept, `Step ${step.id} references nonexistent atlas concept: ${step.conceptId}`);
    assert.ok(concept.elements && concept.elements.length > 0, `Concept ${step.conceptId} has no mesh elements`);

    // Verify all mesh elements exist in atlas
    for (const elId of concept.elements) {
      assert.ok(partSet.has(elId), `Mesh ${elId} in concept ${step.conceptId} not found in atlas parts`);
    }

    // Verify educational entry exists in knowledge base
    const knowledge = KNOWLEDGE_BASE[step.conceptId];
    assert.ok(knowledge, `Step ${step.id} concept ${step.conceptId} missing educational entry in knowledge.ts`);
    assert.equal(knowledge.verificationStatus, 'verified', `Concept ${step.conceptId} is not verified in knowledge.ts`);

    totalSteps++;
  }

  console.log(`Guide validated: "${guide.title}" (${guide.steps.length} steps, difficulty: ${guide.difficulty})`);
}

console.log(`\nAll ${GUIDED_EXPLORATIONS.length} guided explorations and ${totalSteps} steps successfully validated against atlas.json and knowledge.ts.`);
