import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  VERIFIED_RELATIONSHIPS,
  RELATIONSHIP_CATEGORY_LABELS,
  RELATIONSHIP_TYPE_LABELS,
  getRelationshipsForConcept,
  hasRelationshipsForConcept,
  buildRelationshipGraph
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

const emptyGraph = buildRelationshipGraph('FMA_EMPTY', resolver, sysResolver, 1);
assert.equal(emptyGraph.totalAvailable, 0);
assert.equal(emptyGraph.edges.length, 0);
assert.equal(emptyGraph.nodes.length, 1);

console.log(`Validated ${VERIFIED_RELATIONSHIPS.length} relationships connecting ${connectedConcepts.size} unique anatomical concepts.`);
console.log('Graph construction, depth expansion, and empty-state safety checks passed.');
