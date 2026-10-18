import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { QUESTION_BANK, isSelectionMatchingTarget } from '../app/learning.ts';
import { KNOWLEDGE_BASE } from '../app/knowledge.ts';
import { SYSTEMS } from '../app/anatomy.ts';

const atlas = JSON.parse(await readFile(new URL('../public/models/atlas.json', import.meta.url)));
const conceptMap = new Map(atlas.concepts.map(c => [c.id, c]));
const partSet = new Set(atlas.parts.map(p => p.id));
const systemIds = new Set(SYSTEMS.map(s => s.id));

assert.ok(QUESTION_BANK.length >= 10, 'Question bank must have at least 10 questions');
const questionIds = new Set();

let identificationCount = 0;
let multipleChoiceCount = 0;
let trueFalseCount = 0;

for (const q of QUESTION_BANK) {
  assert.ok(q.id && !questionIds.has(q.id), `Duplicate or missing question ID: ${q.id}`);
  questionIds.add(q.id);

  assert.ok(q.title && q.title.trim().length > 0, `Missing title in ${q.id}`);
  assert.ok(systemIds.has(q.system), `Invalid system ID in ${q.id}: ${q.system}`);
  assert.ok(['Beginner', 'Intermediate', 'Advanced'].includes(q.difficulty), `Invalid difficulty in ${q.id}`);
  assert.ok(q.explanation && q.explanation.trim().length > 0, `Missing explanation in ${q.id}`);
  assert.ok(q.hint && q.hint.trim().length > 0, `Missing hint in ${q.id}`);

  if (q.type === 'identification') {
    identificationCount++;
    assert.ok(q.targetConceptId, `Identification question ${q.id} must have targetConceptId`);
    assert.equal(q.correctAnswer, q.targetConceptId, `Identification question correctAnswer must match targetConceptId`);

    const concept = conceptMap.get(q.targetConceptId);
    assert.ok(concept, `Concept ${q.targetConceptId} not found in atlas.json for ${q.id}`);
    assert.ok(concept.elements.length > 0, `Concept ${q.targetConceptId} has no elements`);

    // Verify educational entry in knowledge base
    const knowledge = KNOWLEDGE_BASE[q.targetConceptId];
    assert.ok(knowledge, `Target concept ${q.targetConceptId} missing in knowledge.ts`);
    assert.equal(knowledge.verificationStatus, 'verified');

    // Test selection matching function
    const samplePartId = concept.elements[0];
    assert.ok(
      isSelectionMatchingTarget(samplePartId, null, q.targetConceptId, atlas),
      `Mesh ${samplePartId} failed to match target concept ${q.targetConceptId}`
    );
    assert.ok(
      isSelectionMatchingTarget(null, q.targetConceptId, q.targetConceptId, atlas),
      `Concept ${q.targetConceptId} failed to match itself`
    );
    assert.ok(
      !isSelectionMatchingTarget('nonexistent-mesh', 'nonexistent-concept', q.targetConceptId, atlas),
      `Nonexistent mesh falsely matched target concept ${q.targetConceptId}`
    );
  } else if (q.type === 'multiple-choice') {
    multipleChoiceCount++;
    assert.ok(Array.isArray(q.options) && q.options.length >= 3, `MC question ${q.id} must have at least 3 options`);
    assert.ok(q.options.includes(q.correctAnswer), `MC question ${q.id} correctAnswer must be one of the options`);
  } else if (q.type === 'true-false') {
    trueFalseCount++;
    assert.ok(Array.isArray(q.options) && q.options.length === 2, `TF question ${q.id} must have exactly 2 options`);
    assert.ok(q.options.includes(q.correctAnswer), `TF question ${q.id} correctAnswer must be in options`);
  } else {
    assert.fail(`Unknown question type: ${q.type} in ${q.id}`);
  }
}

console.log(`Validated ${QUESTION_BANK.length} learning questions:`);
console.log(`- ${identificationCount} 3D structure identification questions`);
console.log(`- ${multipleChoiceCount} multiple-choice questions`);
console.log(`- ${trueFalseCount} true/false questions`);
console.log(`All target concepts, mesh elements, and knowledge entries confirmed.`);
