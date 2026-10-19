import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  VERIFIED_SYNONYMS,
  buildAnatomySearchIndex,
  executeAnatomySearch,
  normalizeSearchString
} from '../app/anatomy-search.ts';

const atlas = JSON.parse(await readFile(new URL('../public/models/atlas.json', import.meta.url)));
const conceptMap = new Map(atlas.concepts.map(c => [c.id, c]));

console.log(`Auditing anatomical search index and ${VERIFIED_SYNONYMS.length} verified synonyms against ${atlas.concepts.length} atlas concepts...`);

// 1. Synonym dictionary assertions
assert.ok(VERIFIED_SYNONYMS.length >= 20, 'Expected at least 20 verified anatomical synonyms');

for (const syn of VERIFIED_SYNONYMS) {
  assert.ok(syn.term && syn.term.trim().length > 0, 'Synonym missing term string');
  assert.ok(syn.conceptId && syn.conceptId.trim().length > 0, `Synonym "${syn.term}" missing conceptId`);
  assert.ok(syn.justification && syn.justification.trim().length > 0, `Synonym "${syn.term}" missing authoritative justification`);

  // Target concept existence in atlas.json
  assert.ok(
    conceptMap.has(syn.conceptId),
    `Synonym "${syn.term}" points to unknown concept ID: "${syn.conceptId}"`
  );
}

// 2. Build index
const index = buildAnatomySearchIndex(atlas);
assert.equal(index.totalConcepts, atlas.concepts.length, 'Index concept count mismatch');
assert.equal(index.totalSynonyms, VERIFIED_SYNONYMS.length, 'Index synonym count mismatch');

// 3. Exact Canonical Name Searches
const testCanonical = [
  { query: 'heart', expectedId: 'FMA7088' },
  { query: 'brain', expectedId: 'FMA50801' },
  { query: 'liver', expectedId: 'FMA7197' },
  { query: 'stomach', expectedId: 'FMA7148' },
  { query: 'kidney', expectedId: 'FMA7203' },
  { query: 'trachea', expectedId: 'FMA7394' },
  { query: 'femur', expectedId: 'FMA9611' },
  { query: 'patella', expectedId: 'FMA24485' },
  { query: 'clavicle', expectedId: 'FMA13321' },
  { query: 'sternum', expectedId: 'FMA7485' }
];

for (const t of testCanonical) {
  const res = executeAnatomySearch(t.query, index);
  assert.ok(res.length > 0, `Search for "${t.query}" returned 0 results`);
  assert.equal(res[0].conceptId, t.expectedId, `Top result for "${t.query}" was ${res[0].conceptId} (${res[0].canonicalName}), expected ${t.expectedId}`);
  assert.equal(res[0].matchKind, 'exact_canonical');
}

// 4. Exact Verified Synonym Searches
const testSynonyms = [
  { query: 'windpipe', expectedId: 'FMA7394' },
  { query: 'collarbone', expectedId: 'FMA13321' },
  { query: 'kneecap', expectedId: 'FMA24485' },
  { query: 'shinbone', expectedId: 'FMA24476' },
  { query: 'thighbone', expectedId: 'FMA9611' },
  { query: 'breastbone', expectedId: 'FMA7485' },
  { query: 'shoulder blade', expectedId: 'FMA13394' },
  { query: 'gullet', expectedId: 'FMA7131' },
  { query: 'belly', expectedId: 'FMA7148' },
  { query: 'heel bone', expectedId: 'FMA24496' }
];

for (const t of testSynonyms) {
  const res = executeAnatomySearch(t.query, index);
  assert.ok(res.length > 0, `Synonym search for "${t.query}" returned 0 results`);
  assert.equal(res[0].conceptId, t.expectedId, `Top result for synonym "${t.query}" was ${res[0].conceptId} (${res[0].canonicalName}), expected ${t.expectedId}`);
  assert.equal(res[0].matchKind, 'exact_synonym');
  assert.ok(res[0].matchedAlias, 'Expected matchedAlias on synonym search');
}

// 5. Concept ID Searches (with or without 'FMA' prefix, case-insensitive)
const testIds = [
  { query: 'FMA7088', expectedId: 'FMA7088' },
  { query: 'fma7088', expectedId: 'FMA7088' },
  { query: '7088', expectedId: 'FMA7088' },
  { query: 'FMA50801', expectedId: 'FMA50801' },
  { query: 'FMA7394', expectedId: 'FMA7394' }
];

for (const t of testIds) {
  const res = executeAnatomySearch(t.query, index);
  assert.ok(res.length > 0, `ID search for "${t.query}" returned 0 results`);
  assert.equal(res[0].conceptId, t.expectedId, `Top result for ID "${t.query}" was ${res[0].conceptId}, expected ${t.expectedId}`);
  assert.ok(res[0].matchKind === 'exact_id' || res[0].matchKind === 'exact_canonical');
}

// 6. Case-insensitivity & whitespace tolerance
const testVariations = [
  { query: '  HEART   ', expectedId: 'FMA7088' },
  { query: 'wInDpIpE', expectedId: 'FMA7394' },
  { query: '  kNeEcaP  ', expectedId: 'FMA24485' }
];

for (const t of testVariations) {
  const res = executeAnatomySearch(t.query, index);
  assert.ok(res.length > 0, `Search for variation "${t.query}" returned 0 results`);
  assert.equal(res[0].conceptId, t.expectedId);
}

// 7. Partial & Prefix Searches
const testPrefix = [
  { query: 'trach', expectedId: 'FMA7394' },
  { query: 'windp', expectedId: 'FMA7394' }
];

for (const t of testPrefix) {
  const res = executeAnatomySearch(t.query, index);
  assert.ok(res.length > 0, `Prefix search for "${t.query}" returned 0 results`);
  assert.equal(res[0].conceptId, t.expectedId);
}

// 8. Ambiguous Terms (e.g. "lung", "vena cava", "kidneys")
const lungResults = executeAnatomySearch('lung', index);
assert.ok(lungResults.length >= 2, 'Expected multiple results for general "lung" query');
const lungIds = new Set(lungResults.map(r => r.conceptId));
assert.ok(lungIds.has('FMA7309') || lungIds.has('FMA7310'), 'Expected right or left lung in "lung" query');

const venaResults = executeAnatomySearch('vena cava', index);
assert.ok(venaResults.length >= 2, 'Expected both superior and inferior vena cava for "vena cava" query');

// 9. Empty and No-results query safety
const emptyResults = executeAnatomySearch('', index);
assert.ok(emptyResults.length > 0, 'Expected default recommendations for empty search');

const nonexistent = executeAnatomySearch('xyznonexistentorgan12345', index);
assert.equal(nonexistent.length, 0, 'Expected empty array for non-existent term');

// 10. Non-visualizable concept honesty
const mockNonVisualizable = {
  ...atlas,
  concepts: [
    ...atlas.concepts,
    { id: 'FMA_MOCK_NO_MESH', name: 'intangible anatomical space', elements: [] }
  ]
};
const mockIndex = buildAnatomySearchIndex(mockNonVisualizable);
const mockRes = executeAnatomySearch('intangible anatomical space', mockIndex);
assert.ok(mockRes.length > 0);
assert.equal(mockRes[0].meshCount, 0);
assert.equal(mockRes[0].isVisualizable, false, 'Non-visualizable concept must have isVisualizable: false');

// 11. REGRESSION TEST: ERR-SRCH-01 Brainstem Synonym Resolution
console.log('Testing ERR-SRCH-01 brainstem search mapping...');
const brainstemResults = executeAnatomySearch('brainstem', index);
assert.ok(brainstemResults.length > 0, 'Search for "brainstem" must return results');
assert.equal(
  brainstemResults[0].conceptId,
  'FMA79876',
  'ERR-SRCH-01: "brainstem" query must resolve to dedicated concept FMA79876'
);
assert.notEqual(
  brainstemResults[0].conceptId,
  'FMA50801',
  'ERR-SRCH-01: "brainstem" query must NOT resolve to broader brain concept FMA50801'
);
assert.equal(brainstemResults[0].canonicalName, 'brainstem', 'Canonical name must be "brainstem"');
assert.equal(brainstemResults[0].meshCount, 11, 'Brainstem concept must have exactly 11 meshes');
assert.equal(brainstemResults[0].isVisualizable, true, 'Brainstem must be visualizable');

// Verify all 11 constituent meshes exist in atlas.parts
const partIds = new Set(atlas.parts.map(p => p.id));
for (const elementId of brainstemResults[0].concept.elements) {
  assert.ok(partIds.has(elementId), `Brainstem constituent mesh ${elementId} must exist in atlas.parts`);
}

// Verify broader "brain" search continues to resolve to broader concept FMA50801
const brainResults = executeAnatomySearch('brain', index);
assert.ok(brainResults.length > 0, 'Search for "brain" must return results');
assert.equal(
  brainResults[0].conceptId,
  'FMA50801',
  'Query "brain" must continue to resolve to broader brain concept FMA50801'
);
assert.equal(brainResults[0].canonicalName, 'brain', 'Canonical name must be "brain"');
assert.equal(brainResults[0].meshCount, 59, 'Brain concept must have 59 meshes');

console.log(`Validated ${VERIFIED_SYNONYMS.length} curated synonyms, deterministic ranking, ID queries, ambiguity, and boundary cases.`);
console.log('ERR-SRCH-01 Brainstem regression checks passed.');

// 12. REGRESSION TESTS: Batch 5 Search Synonym Improvements (GAP-SRCH-01)
console.log('Testing GAP-SRCH-01 bowel & guts search mapping for both small and large intestines...');

// "bowel" query assertions
const bowelResults = executeAnatomySearch('bowel', index);
assert.ok(bowelResults.length >= 2, 'Search for "bowel" must return at least 2 results');
const bowelTopTwo = bowelResults.slice(0, 2);
const bowelTopIds = bowelTopTwo.map(r => r.conceptId);
assert.ok(bowelTopIds.includes('FMA7200'), '"bowel" query must include Small Intestine (FMA7200) in top results');
assert.ok(bowelTopIds.includes('FMA7201'), '"bowel" query must include Large Intestine (FMA7201) in top results');
assert.equal(bowelTopTwo[0].score, 900, 'Top result for "bowel" must be exact synonym match with score 900');
assert.equal(bowelTopTwo[1].score, 900, 'Second result for "bowel" must be exact synonym match with score 900');
assert.equal(bowelTopTwo[0].matchKind, 'exact_synonym');
assert.equal(bowelTopTwo[1].matchKind, 'exact_synonym');
assert.equal(bowelTopTwo[0].conceptId, 'FMA7200', 'Small intestine ranks first due to greater mesh count (56 vs 8)');
assert.equal(bowelTopTwo[1].conceptId, 'FMA7201', 'Large intestine ranks second due to smaller mesh count');

// "guts" query assertions
const gutsResults = executeAnatomySearch('guts', index);
assert.ok(gutsResults.length >= 2, 'Search for "guts" must return at least 2 results');
const gutsTopTwo = gutsResults.slice(0, 2);
const gutsTopIds = gutsTopTwo.map(r => r.conceptId);
assert.ok(gutsTopIds.includes('FMA7200'), '"guts" query must include Small Intestine (FMA7200) in top results');
assert.ok(gutsTopIds.includes('FMA7201'), '"guts" query must include Large Intestine (FMA7201) in top results');
assert.equal(gutsTopTwo[0].score, 900, 'Top result for "guts" must be exact synonym match with score 900');
assert.equal(gutsTopTwo[1].score, 900, 'Second result for "guts" must be exact synonym match with score 900');
assert.equal(gutsTopTwo[0].matchKind, 'exact_synonym');
assert.equal(gutsTopTwo[1].matchKind, 'exact_synonym');
assert.equal(gutsTopTwo[0].conceptId, 'FMA7200');
assert.equal(gutsTopTwo[1].conceptId, 'FMA7201');

// Exact anatomical name assertions: "small intestine"
const smallIntestineResults = executeAnatomySearch('small intestine', index);
assert.ok(smallIntestineResults.length > 0, 'Search for "small intestine" must return results');
assert.equal(smallIntestineResults[0].conceptId, 'FMA7200', '"small intestine" must resolve to FMA7200 as rank 1');
assert.equal(smallIntestineResults[0].matchKind, 'exact_canonical', 'Match kind must be exact_canonical');
assert.equal(smallIntestineResults[0].score, 1000);

// Exact anatomical name assertions: "large intestine"
const largeIntestineResults = executeAnatomySearch('large intestine', index);
assert.ok(largeIntestineResults.length > 0, 'Search for "large intestine" must return results');
assert.equal(largeIntestineResults[0].conceptId, 'FMA7201', '"large intestine" must resolve to FMA7201 as rank 1');
assert.equal(largeIntestineResults[0].matchKind, 'exact_canonical', 'Match kind must be exact_canonical');
assert.equal(largeIntestineResults[0].score, 1000);

// Exact ID queries
const fma7200Results = executeAnatomySearch('FMA7200', index);
assert.equal(fma7200Results[0].conceptId, 'FMA7200', 'Exact ID FMA7200 must resolve');
const fma7201Results = executeAnatomySearch('FMA7201', index);
assert.equal(fma7201Results[0].conceptId, 'FMA7201', 'Exact ID FMA7201 must resolve');

console.log('GAP-SRCH-01 Intestine search regression checks passed.');

