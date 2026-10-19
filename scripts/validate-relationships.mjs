import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  VERIFIED_RELATIONSHIPS,
  RELATIONSHIP_CATEGORY_LABELS,
  RELATIONSHIP_TYPE_LABELS,
  getRelationshipsForConcept,
  hasRelationshipsForConcept,
  buildRelationshipGraph,
  RELATIONSHIP_QUICK_HUBS
} from '../app/relationships.ts';

const atlas = JSON.parse(await readFile(new URL('../public/models/atlas.json', import.meta.url)));
const conceptMap = new Map(atlas.concepts.map(c => [c.id, c]));

console.log(`Auditing ${VERIFIED_RELATIONSHIPS.length} verified anatomical relationships against ${atlas.concepts.length} atlas concepts...`);

// 1. Minimum count assertion
assert.ok(VERIFIED_RELATIONSHIPS.length >= 25, 'Expected at least 25 verified anatomical relationships');

const validTypes = new Set([
  'part_of',
  'contains',
  'located_near',
  'connected_to',
  'surrounds',
  'supplies',
  'drains_into',
  'functionally_related'
]);

const validCategories = new Set(['structural', 'spatial', 'circulatory', 'functional']);

const relationshipIds = new Set();
const directionalPairs = new Set();
const connectedConcepts = new Set();

for (const rel of VERIFIED_RELATIONSHIPS) {
  // 2. ID validation
  assert.ok(rel.id && rel.id.trim().length > 0, 'Relationship missing ID');
  assert.ok(!relationshipIds.has(rel.id), `Duplicate relationship ID: ${rel.id}`);
  relationshipIds.add(rel.id);

  // 3. Source concept existence in atlas.json
  assert.ok(
    conceptMap.has(rel.sourceConceptId),
    `Source concept ID "${rel.sourceConceptId}" not found in atlas.json (rel: ${rel.id})`
  );

  // 4. Target concept existence in atlas.json
  assert.ok(
    conceptMap.has(rel.targetConceptId),
    `Target concept ID "${rel.targetConceptId}" not found in atlas.json (rel: ${rel.id})`
  );

  // 5. No self-loops
  assert.notEqual(
    rel.sourceConceptId,
    rel.targetConceptId,
    `Self-loop detected: concept ${rel.sourceConceptId} connects to itself in ${rel.id}`
  );

  connectedConcepts.add(rel.sourceConceptId);
  connectedConcepts.add(rel.targetConceptId);

  // 6. Valid relationship type
  assert.ok(validTypes.has(rel.type), `Invalid relationship type "${rel.type}" in ${rel.id}`);
  assert.ok(RELATIONSHIP_TYPE_LABELS[rel.type], `Missing label configuration for type ${rel.type}`);

  // 7. Valid category
  assert.ok(validCategories.has(rel.category), `Invalid category "${rel.category}" in ${rel.id}`);
  assert.ok(RELATIONSHIP_CATEGORY_LABELS[rel.category], `Missing category label for ${rel.category}`);

  // 8. Non-empty explanation
  assert.ok(
    typeof rel.explanation === 'string' && rel.explanation.trim().length >= 15,
    `Explanation for ${rel.id} is too short or empty: "${rel.explanation}"`
  );

  // 9. Source reference
  assert.ok(
    typeof rel.sourceReference === 'string' && rel.sourceReference.trim().length >= 5,
    `Missing or empty source reference in ${rel.id}`
  );

  // 10. Source kind
  assert.ok(
    rel.sourceKind === 'atlas' || rel.sourceKind === 'verified_educational_source',
    `Invalid sourceKind in ${rel.id}`
  );

  // 11. Duplicate directional edge detection
  const pairKey = `${rel.sourceConceptId}-->${rel.targetConceptId}::${rel.type}`;
  assert.ok(!directionalPairs.has(pairKey), `Duplicate directional relationship found: ${pairKey}`);
  directionalPairs.add(pairKey);

  // 12. Directional semantics sanity: "part_of" should not have duplicate "contains" in exact same direction
  if (rel.type === 'part_of') {
    const invertedKey = `${rel.targetConceptId}-->${rel.sourceConceptId}::part_of`;
    assert.ok(!directionalPairs.has(invertedKey), `Contradictory bidirectional part_of found: ${rel.id}`);
  }
}

// 13. Query functions and empty state safety
const heartRels = getRelationshipsForConcept('FMA7088');
assert.ok(heartRels.length >= 5, `Expected heart to have at least 5 relationships, got ${heartRels.length}`);
assert.ok(hasRelationshipsForConcept('FMA7088'));

const nonExistentRels = getRelationshipsForConcept('FMA_NONEXISTENT_999999');
assert.deepEqual(nonExistentRels, []);
assert.equal(hasRelationshipsForConcept('FMA_NONEXISTENT_999999'), false);

// 14. Graph generation tests
const resolver = id => conceptMap.get(id)?.name;
const sysResolver = () => 'cardiac';

const graphL1 = buildRelationshipGraph('FMA7088', resolver, sysResolver, 1);
assert.ok(graphL1.nodes.length >= 6, 'Graph Level 1 should contain root plus neighbors');
assert.ok(graphL1.edges.length >= 5, 'Graph Level 1 should contain edges');
assert.ok(graphL1.nodes.some(n => n.id === 'FMA7088' && n.isCenter), 'Center node must be marked isCenter');

const graphL2 = buildRelationshipGraph('FMA7088', resolver, sysResolver, 2);
assert.ok(graphL2.nodes.length >= graphL1.nodes.length, 'Graph Level 2 must expand or equal Level 1');
const uniqueNodeIds = new Set(graphL2.nodes.map(n => n.id));
assert.equal(uniqueNodeIds.size, graphL2.nodes.length, 'Graph Level 2 must not contain duplicate nodes');

// 15. REGRESSION TEST: BUG-REL-01 - Quick Hub Navigator & Bilateral Lungs Hub Validation
assert.ok(Array.isArray(RELATIONSHIP_QUICK_HUBS), 'Expected RELATIONSHIP_QUICK_HUBS to be an array');
assert.ok(RELATIONSHIP_QUICK_HUBS.length >= 7, 'Expected at least 7 quick hubs');

// Regression test: ensure FMA7195 (non-existent lung ID) is completely absent
assert.equal(
  RELATIONSHIP_QUICK_HUBS.some(h => h.id === 'FMA7195'),
  false,
  'Regression BUG-REL-01: FMA7195 must not exist in RELATIONSHIP_QUICK_HUBS'
);
assert.equal(
  conceptMap.has('FMA7195'),
  false,
  'Regression BUG-REL-01: FMA7195 is confirmed non-existent in atlas.json'
);

// Verify all quick hub IDs resolve to real atlas concepts
for (const hub of RELATIONSHIP_QUICK_HUBS) {
  assert.ok(
    conceptMap.has(hub.id),
    `Quick hub "${hub.name}" references concept ID "${hub.id}" which does not exist in atlas.json`
  );
  if (hub.subConcepts) {
    for (const sub of hub.subConcepts) {
      assert.ok(
        conceptMap.has(sub.id),
        `Quick hub subconcept "${sub.name}" references ID "${sub.id}" which does not exist in atlas.json`
      );
      assert.ok(
        conceptMap.get(sub.id).elements.length > 0,
        `Quick hub subconcept "${sub.name}" (${sub.id}) must have 3D mesh elements in atlas.json`
      );
    }
  }
}

// Verify bilateral Lungs hub configuration
const lungsHub = RELATIONSHIP_QUICK_HUBS.find(h => h.name === 'Lungs');
assert.ok(lungsHub, 'Quick hubs must include a "Lungs" entry');
assert.equal(lungsHub.isBilateralGroup, true, 'Lungs hub must be marked isBilateralGroup: true');
assert.ok(lungsHub.subConcepts && lungsHub.subConcepts.length === 2, 'Lungs hub must expose exactly 2 bilateral subconcepts');

const rightLungSub = lungsHub.subConcepts.find(s => s.id === 'FMA7309');
const leftLungSub = lungsHub.subConcepts.find(s => s.id === 'FMA7310');
assert.ok(rightLungSub, 'Lungs hub must expose Right Lung (FMA7309)');
assert.ok(leftLungSub, 'Lungs hub must expose Left Lung (FMA7310)');

// Verify that both lung roots generate rich, valid relationship graphs
const rightLungGraph = buildRelationshipGraph('FMA7309', resolver, sysResolver, 1);
assert.ok(rightLungGraph.totalAvailable >= 2, `Right Lung should have at least 2 direct connections, got ${rightLungGraph.totalAvailable}`);
assert.ok(rightLungGraph.edges.some(e => e.id === 'rel_lungs_bilateral_func'), 'Right Lung graph must include bilateral functional connection to Left Lung');

const leftLungGraph = buildRelationshipGraph('FMA7310', resolver, sysResolver, 1);
assert.ok(leftLungGraph.totalAvailable >= 2, `Left Lung should have at least 2 direct connections, got ${leftLungGraph.totalAvailable}`);
assert.ok(leftLungGraph.edges.some(e => e.id === 'rel_lungs_bilateral_func'), 'Left Lung graph must include bilateral functional connection to Right Lung');

// 16. REGRESSION TESTS: Batch 4 Scientific Content & Relationship Fixes

// A. ERR-REL-01: Spine-to-femur relationships must be functional, not direct structural articulations
const vertRightFemur = VERIFIED_RELATIONSHIPS.find(r => r.id === 'rel_vert_right_femur');
const vertLeftFemur = VERIFIED_RELATIONSHIPS.find(r => r.id === 'rel_vert_left_femur');
assert.ok(vertRightFemur, 'rel_vert_right_femur must exist');
assert.ok(vertLeftFemur, 'rel_vert_left_femur must exist');

assert.equal(vertRightFemur.category, 'functional', 'ERR-REL-01: rel_vert_right_femur category must be functional');
assert.equal(vertRightFemur.type, 'functionally_related', 'ERR-REL-01: rel_vert_right_femur type must be functionally_related');
assert.notEqual(vertRightFemur.category, 'structural', 'ERR-REL-01: Spine-to-femur must not be structural');
assert.notEqual(vertRightFemur.type, 'connected_to', 'ERR-REL-01: Spine-to-femur must not be connected_to');
assert.ok(vertRightFemur.explanation.includes('indirectly'), 'Explanation must describe indirect load transmission');

assert.equal(vertLeftFemur.category, 'functional', 'ERR-REL-01: rel_vert_left_femur category must be functional');
assert.equal(vertLeftFemur.type, 'functionally_related', 'ERR-REL-01: rel_vert_left_femur type must be functionally_related');
assert.notEqual(vertLeftFemur.category, 'structural', 'ERR-REL-01: Spine-to-femur must not be structural');
assert.notEqual(vertLeftFemur.type, 'connected_to', 'ERR-REL-01: Spine-to-femur must not be connected_to');
assert.ok(vertLeftFemur.explanation.includes('indirectly'), 'Explanation must describe indirect load transmission');

// B. ERR-REL-02: Liver-to-gallbladder bile transport must not be circulatory
const liverGallbladder = VERIFIED_RELATIONSHIPS.find(r => r.id === 'rel_liver_gallbladder_supply');
assert.ok(liverGallbladder, 'rel_liver_gallbladder_supply must exist');
assert.equal(liverGallbladder.category, 'functional', 'ERR-REL-02: Bile transport category must be functional');
assert.notEqual(liverGallbladder.category, 'circulatory', 'ERR-REL-02: Bile transport must NOT be circulatory');
assert.ok(!liverGallbladder.explanation.toLowerCase().includes('blood'), 'Bile transport must not imply blood circulation');

// C. ERR-REL-03: Kidney-to-bladder urinary drainage must not be circulatory
const rightKidneyBladder = VERIFIED_RELATIONSHIPS.find(r => r.id === 'rel_right_kidney_bladder_drain');
const leftKidneyBladder = VERIFIED_RELATIONSHIPS.find(r => r.id === 'rel_left_kidney_bladder_drain');
assert.ok(rightKidneyBladder, 'rel_right_kidney_bladder_drain must exist');
assert.ok(leftKidneyBladder, 'rel_left_kidney_bladder_drain must exist');

assert.equal(rightKidneyBladder.category, 'functional', 'ERR-REL-03: Right kidney drainage must be functional');
assert.notEqual(rightKidneyBladder.category, 'circulatory', 'ERR-REL-03: Right kidney drainage must NOT be circulatory');
assert.equal(rightKidneyBladder.sourceConceptId, 'FMA7204', 'Right kidney must use FMA7204');
assert.equal(rightKidneyBladder.targetConceptId, 'FMA15900', 'Target must be urinary bladder FMA15900');

assert.equal(leftKidneyBladder.category, 'functional', 'ERR-REL-03: Left kidney drainage must be functional');
assert.notEqual(leftKidneyBladder.category, 'circulatory', 'ERR-REL-03: Left kidney drainage must NOT be circulatory');
assert.equal(leftKidneyBladder.sourceConceptId, 'FMA7205', 'Left kidney must use FMA7205');
assert.equal(leftKidneyBladder.targetConceptId, 'FMA15900', 'Target must be urinary bladder FMA15900');

// D. ERR-REL-04: Bilateral Kidneys Quick Hub
const kidneysHub = RELATIONSHIP_QUICK_HUBS.find(h => h.name === 'Kidneys');
assert.ok(kidneysHub, 'Quick hubs must include a "Kidneys" entry');
assert.equal(kidneysHub.isBilateralGroup, true, 'ERR-REL-04: Kidneys hub must be marked isBilateralGroup: true');
assert.ok(kidneysHub.subConcepts && kidneysHub.subConcepts.length === 2, 'Kidneys hub must expose exactly 2 bilateral subconcepts');

const rightKidneySub = kidneysHub.subConcepts.find(s => s.id === 'FMA7204');
const leftKidneySub = kidneysHub.subConcepts.find(s => s.id === 'FMA7205');
assert.ok(rightKidneySub, 'ERR-REL-04: Kidneys hub must expose Right Kidney (FMA7204)');
assert.ok(leftKidneySub, 'ERR-REL-04: Kidneys hub must expose Left Kidney (FMA7205)');

// Ensure FMA7203 is NOT used as the graph root since it has no mapped relationships
assert.notEqual(kidneysHub.id, 'FMA7203', 'ERR-REL-04: Hub default root must not be FMA7203 which has 0 relationships');

// Verify that both kidney roots generate non-empty, rich relationship graphs
const rightKidneyGraph = buildRelationshipGraph('FMA7204', resolver, sysResolver, 1);
assert.ok(rightKidneyGraph.totalAvailable >= 3, `Right Kidney must have at least 3 direct connections, got ${rightKidneyGraph.totalAvailable}`);
assert.ok(rightKidneyGraph.edges.some(e => e.id === 'rel_kidneys_bilateral_func'), 'Right Kidney graph must include bilateral connection to Left Kidney');

const leftKidneyGraph = buildRelationshipGraph('FMA7205', resolver, sysResolver, 1);
assert.ok(leftKidneyGraph.totalAvailable >= 3, `Left Kidney must have at least 3 direct connections, got ${leftKidneyGraph.totalAvailable}`);
assert.ok(leftKidneyGraph.edges.some(e => e.id === 'rel_kidneys_bilateral_func'), 'Left Kidney graph must include bilateral connection to Right Kidney');

console.log(`Validated ${VERIFIED_RELATIONSHIPS.length} relationships connecting ${connectedConcepts.size} unique anatomical concepts.`);
console.log('Graph construction, depth expansion, empty-state safety, Quick Hubs bilateral Lungs and Kidneys regression checks passed.');

