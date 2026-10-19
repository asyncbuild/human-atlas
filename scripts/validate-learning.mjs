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

// ==========================================
// REGRESSION TESTS: BUG-LRN-01 Concept Targeting
// ==========================================
import { filterQuestions, getConceptLearningInfo } from '../app/learning.ts';

console.log('Testing BUG-LRN-01 Concept Targeting in filterQuestions and getConceptLearningInfo...');

// 1. Concept with direct question (Heart: FMA7088)
const heartInfo = getConceptLearningInfo('FMA7088');
assert.equal(heartInfo.hasDirectQuestion, true, 'Heart should have direct question');
assert.ok(heartInfo.directQuestionsCount >= 1, 'Heart should have at least 1 direct question');

const heartConfig = {
  category: 'cardiopulmonary',
  difficulty: 'all',
  questionCount: 5
};
const heartQuestions = filterQuestions(heartConfig, 'FMA7088');
assert.equal(heartQuestions.length, 5, 'Should return configured number of questions');
assert.equal(heartQuestions[0].targetConceptId, 'FMA7088', 'Target concept question must be placed first in pool');
// Verify no duplicates
const heartQuestionIds = new Set(heartQuestions.map(q => q.id));
assert.equal(heartQuestionIds.size, heartQuestions.length, 'Questions must not contain duplicates');

// 2. Category filtering consistency
const skeletalConfig = {
  category: 'skeletal',
  difficulty: 'all',
  questionCount: 10
};
const skeletalQuestions = filterQuestions(skeletalConfig);
for (const q of skeletalQuestions) {
  assert.equal(q.system, 'skeletal', `Category skeletal should only yield skeletal questions, found ${q.system}`);
}

const neuroConfig = {
  category: 'neuro',
  difficulty: 'all',
  questionCount: 10
};
const neuroQuestions = filterQuestions(neuroConfig);
for (const q of neuroQuestions) {
  assert.equal(q.system, 'nervous', `Category neuro should only yield nervous questions, found ${q.system}`);
}

// 3. Fallback when concept has no direct question (e.g. Right Lung: FMA7309)
const rightLungInfo = getConceptLearningInfo('FMA7309');
assert.equal(rightLungInfo.hasDirectQuestion, false, 'Right lung has no direct question in current question bank');
assert.equal(rightLungInfo.directQuestionsCount, 0);

const fallbackConfig = {
  category: 'cardiopulmonary',
  difficulty: 'all',
  questionCount: 4
};
const fallbackQuestions = filterQuestions(fallbackConfig, 'FMA7309');
assert.equal(fallbackQuestions.length, 4, 'Should fallback and return questions from category');
for (const q of fallbackQuestions) {
  assert.ok(
    q.system === 'cardiac' || q.system === 'respiratory' || q.system === 'muscular',
    'Fallback questions must be valid cardiopulmonary questions'
  );
  // Ensure no fake questions are fabricated
  assert.ok(QUESTION_BANK.some(bankQ => bankQ.id === q.id), 'All questions must come from verified QUESTION_BANK');
}

// 4. Generic mode without concept ID
const genericQuestions = filterQuestions({ category: 'all', difficulty: 'all', questionCount: 5 });
assert.equal(genericQuestions.length, 5, 'Generic mode returns requested question count');
assert.equal(new Set(genericQuestions.map(q => q.id)).size, 5, 'Generic mode returns distinct questions');

console.log('✓ BUG-LRN-01 regression tests PASSED.');

// ==========================================
// REGRESSION TESTS: ERR-KNOW-01 Bilateral Knowledge Descriptions
// ==========================================
console.log('Testing ERR-KNOW-01 Bilateral Knowledge Descriptions in KNOWLEDGE_BASE...');

// 1. Femur (Bilateral) FMA9611
const femurBilateral = KNOWLEDGE_BASE['FMA9611'];
assert.ok(femurBilateral, 'KNOWLEDGE_BASE must contain FMA9611');
assert.equal(femurBilateral.canonicalName, 'Femur (Bilateral)');
assert.ok(
  !femurBilateral.location.startsWith('Right lower extremity'),
  'ERR-KNOW-01: Bilateral femur location must NOT claim right lower extremity as exclusive location'
);
assert.ok(
  femurBilateral.location.toLowerCase().includes('bilateral lower extremities') ||
  femurBilateral.location.toLowerCase().includes('each thigh'),
  'ERR-KNOW-01: Bilateral femur location must describe bilateral lower extremities'
);
// Verify unilateral femurs retain proper lateralized locations
assert.ok(KNOWLEDGE_BASE['FMA24474'].location.startsWith('Right lower extremity'));
assert.ok(KNOWLEDGE_BASE['FMA24475'].location.startsWith('Left thigh'));

// 2. Humerus (Bilateral) FMA13303
const humerusBilateral = KNOWLEDGE_BASE['FMA13303'];
assert.ok(humerusBilateral, 'KNOWLEDGE_BASE must contain FMA13303');
assert.equal(humerusBilateral.canonicalName, 'Humerus (Bilateral)');
assert.ok(
  !humerusBilateral.location.startsWith('Right arm'),
  'ERR-KNOW-01: Bilateral humerus location must NOT claim right arm as exclusive location'
);
assert.ok(
  humerusBilateral.location.toLowerCase().includes('bilateral upper extremities') ||
  humerusBilateral.location.toLowerCase().includes('each arm'),
  'ERR-KNOW-01: Bilateral humerus location must describe bilateral upper extremities'
);
// Verify unilateral humeri retain proper lateralized locations
assert.ok(KNOWLEDGE_BASE['FMA23130'].location.startsWith('Right arm'));
assert.ok(KNOWLEDGE_BASE['FMA23131'].location.startsWith('Left arm'));

// 3. Kidneys (Bilateral) FMA7203
const kidneysBilateral = KNOWLEDGE_BASE['FMA7203'];
assert.ok(kidneysBilateral, 'KNOWLEDGE_BASE must contain FMA7203');
assert.equal(kidneysBilateral.canonicalName, 'Kidneys (Bilateral)');
assert.ok(
  kidneysBilateral.location.toLowerCase().includes('liver') &&
  kidneysBilateral.location.toLowerCase().includes('spleen'),
  'ERR-KNOW-01: Bilateral kidneys location must describe both right (liver) and left (spleen) visceral relations'
);
assert.ok(
  kidneysBilateral.location.toLowerCase().includes('right kidney') &&
  kidneysBilateral.location.toLowerCase().includes('left kidney'),
  'ERR-KNOW-01: Bilateral kidneys location must differentiate right vs left anatomical relations'
);
// Verify unilateral kidneys retain proper lateralized relations
assert.ok(KNOWLEDGE_BASE['FMA7204'].location.includes('liver'));
assert.ok(KNOWLEDGE_BASE['FMA7205'].location.includes('spleen'));

console.log('✓ ERR-KNOW-01 regression tests PASSED.');

