import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  VERIFIED_CITATIONS,
  getCitationSource,
  formatRelationshipCitation
} from '../app/citations.ts';
import { KNOWLEDGE_BASE, findKnowledgeForConcept } from '../app/knowledge.ts';
import { QUESTION_BANK } from '../app/learning.ts';
import { GUIDED_EXPLORATIONS } from '../app/guides.ts';
import { VERIFIED_RELATIONSHIPS } from '../app/relationships.ts';
import { VERIFIED_SYNONYMS } from '../app/anatomy-search.ts';

console.log('Auditing scientific citations and source attributions across AnatomyExplorer...');

// 1. Registry Validation
const citationKeys = Object.keys(VERIFIED_CITATIONS);
assert.ok(citationKeys.length >= 20, `Expected at least 20 verified citations, got ${citationKeys.length}`);

for (const [key, citation] of Object.entries(VERIFIED_CITATIONS)) {
  assert.equal(citation.id, key, `Citation key "${key}" must match its id field "${citation.id}"`);
  assert.ok(citation.title && citation.title.trim().length > 0, `Missing title in citation "${key}"`);
  assert.ok(citation.url && citation.url.startsWith('https://'), `Invalid URL in citation "${key}": ${citation.url}`);
  assert.ok(citation.authoritativeBody && citation.authoritativeBody.length > 0, `Missing authoritativeBody in "${key}"`);
  assert.ok(citation.topic && citation.topic.length > 0, `Missing topic in "${key}"`);
  assert.ok(
    citation.verificationStatus === 'verified' || citation.verificationStatus === 'unverified',
    `Invalid verificationStatus in "${key}"`
  );

  // If accession ID is given, URL must contain it
  if (citation.accessionId) {
    assert.ok(
      citation.url.includes(citation.accessionId),
      `Accession ID ${citation.accessionId} must match URL ${citation.url} in "${key}"`
    );
  }
}

// 2. Helper Functions
const heartSrc = getCitationSource('heart');
assert.equal(heartSrc.title, 'StatPearls: Anatomy, Thorax, Heart');
assert.equal(heartSrc.url, 'https://www.ncbi.nlm.nih.gov/books/NBK470256/');

const heartRelStr = formatRelationshipCitation('heart');
assert.equal(heartRelStr, 'StatPearls: Anatomy, Thorax, Heart (NCBI Bookshelf NBK470256)');

assert.throws(() => {
  // @ts-expect-error Testing non-existent key
  getCitationSource('non_existent_key');
}, /Unknown citation ID/);

assert.throws(() => {
  // @ts-expect-error Testing non-existent key
  formatRelationshipCitation('non_existent_key');
}, /Unknown citation ID/);

// 3. Knowledge Base Source Validation
for (const [conceptId, entry] of Object.entries(KNOWLEDGE_BASE)) {
  assert.ok(
    Array.isArray(entry.sources) && entry.sources.length >= 1,
    `Knowledge entry ${conceptId} (${entry.canonicalName}) must have at least one citation source`
  );

  for (const src of entry.sources) {
    assert.ok(src.title && src.title.length > 0, `Empty title in source for ${conceptId}`);
    assert.ok(src.url && src.url.startsWith('https://'), `Invalid URL in source for ${conceptId}: ${src.url}`);
  }
}

// 4. Learning Questions Source Validation
for (const q of QUESTION_BANK) {
  if (q.sources) {
    assert.ok(Array.isArray(q.sources), `Sources in question ${q.id} must be an array`);
    for (const src of q.sources) {
      assert.ok(src.title && src.title.length > 0, `Empty title in source for question ${q.id}`);
      assert.ok(src.url && src.url.startsWith('https://'), `Invalid URL in question ${q.id}: ${src.url}`);
    }
  }
}

// 5. Guides Source Validation
for (const g of GUIDED_EXPLORATIONS) {
  for (const step of g.steps) {
    if (step.sources) {
      assert.ok(Array.isArray(step.sources), `Sources in step ${step.id} must be an array`);
      for (const src of step.sources) {
        assert.ok(src.title && src.title.length > 0, `Empty title in source for step ${step.id}`);
        assert.ok(src.url && src.url.startsWith('https://'), `Invalid URL in step ${step.id}: ${src.url}`);
      }
    }
  }
}

// 6. Relationships Source Validation
for (const rel of VERIFIED_RELATIONSHIPS) {
  assert.ok(
    rel.sourceReference && rel.sourceReference.length >= 10,
    `Relationship ${rel.id} has invalid or short sourceReference: "${rel.sourceReference}"`
  );
}

// 7. ANTI-REGRESSION GUARDS: Banned Erroneous Accession ID Mappings
// Discovered during the audit: these erroneous pairs must never re-occur.
const BANNED_MAPPINGS = [
  { topic: 'stomach', bannedIds: ['NBK499849', 'NBK448165', 'NBK470176'] },
  { topic: 'diaphragm', bannedIds: ['NBK537042', 'NBK519507'] },
  { topic: 'skull', bannedIds: ['NBK538167', 'NBK538180', 'NBK538169'] },
  { topic: 'kidneys', bannedIds: ['NBK499818', 'NBK470397', 'NBK535456'] },
  { topic: 'trachea', bannedIds: ['NBK470390', 'NBK448074', 'NBK448208', 'NBK470256'] },
  { topic: 'liver', bannedIds: ['NBK535439'] },
  { topic: 'spleen', bannedIds: ['NBK541018', 'NBK482353'] },
  { topic: 'urinary bladder', bannedIds: ['NBK534241'] },
  { topic: 'femur', bannedIds: ['NBK535456'] },
  { topic: 'humerus', bannedIds: ['NBK538169'] },
  { topic: 'spinal cord', bannedIds: ['NBK544321', 'NBK538167'] },
  { topic: 'lungs', bannedIds: ['NBK532961'] },
  { topic: 'superior vena cava', bannedIds: ['NBK519503'] },
  { topic: 'respiratory drive', bannedIds: ['NBK519503'] }
];

// Check Knowledge Base
for (const entry of Object.values(KNOWLEDGE_BASE)) {
  const normName = entry.canonicalName.toLowerCase();
  for (const banned of BANNED_MAPPINGS) {
    if (normName.includes(banned.topic)) {
      for (const src of entry.sources) {
        for (const badId of banned.bannedIds) {
          assert.ok(
            !src.url.includes(badId),
            `Regression ERR-CITE-01: Knowledge entry ${entry.canonicalName} references banned accession ${badId}`
          );
        }
      }
    }
  }
}

// Check Learning Questions
for (const q of QUESTION_BANK) {
  const normTitle = (q.title + ' ' + (q.targetConceptName ?? '') + ' ' + q.explanation).toLowerCase();
  if (q.sources) {
    for (const banned of BANNED_MAPPINGS) {
      if (normTitle.includes(banned.topic)) {
        for (const src of q.sources) {
          for (const badId of banned.bannedIds) {
            assert.ok(
              !src.url.includes(badId),
              `Regression ERR-CITE-01: Question ${q.id} references banned accession ${badId}`
            );
          }
        }
      }
    }
  }
}

// Check Guides
for (const g of GUIDED_EXPLORATIONS) {
  for (const step of g.steps) {
    const norm = (step.title + ' ' + step.explanation).toLowerCase();
    if (step.sources) {
      for (const banned of BANNED_MAPPINGS) {
        if (norm.includes(banned.topic)) {
          for (const src of step.sources) {
            for (const badId of banned.bannedIds) {
              assert.ok(
                !src.url.includes(badId),
                `Regression ERR-CITE-01: Guide step ${step.id} references banned accession ${badId}`
              );
            }
          }
        }
      }
    }
  }
}

// Check Relationships
for (const rel of VERIFIED_RELATIONSHIPS) {
  const norm = (rel.id + ' ' + rel.explanation).toLowerCase();
  for (const banned of BANNED_MAPPINGS) {
    if (norm.includes(banned.topic)) {
      for (const badId of banned.bannedIds) {
        assert.ok(
          !rel.sourceReference.includes(badId),
          `Regression ERR-CITE-01: Relationship ${rel.id} sourceReference includes banned accession ${badId}`
        );
      }
    }
  }
}

// Check Search Synonyms
for (const syn of VERIFIED_SYNONYMS) {
  const norm = (syn.term + ' ' + syn.justification).toLowerCase();
  for (const banned of BANNED_MAPPINGS) {
    if (norm.includes(banned.topic)) {
      for (const badId of banned.bannedIds) {
        assert.ok(
          !syn.justification.includes(badId),
          `Regression ERR-CITE-01: Synonym "${syn.term}" justification includes banned accession ${badId}`
        );
      }
    }
  }
}

// 8. Cross-Module Consistency Checks (ERR-CITE-02)
// Stomach -> NBK482334
assert.ok(KNOWLEDGE_BASE['FMA7148'].sources[0].url.includes('NBK482334'));
assert.ok(QUESTION_BANK.find(q => q.id === 'q-id-stomach')?.sources?.[0].url.includes('NBK482334'));
assert.ok(VERIFIED_RELATIONSHIPS.find(r => r.id === 'rel_stomach_duodenum')?.sourceReference.includes('NBK482334'));

// Diaphragm -> NBK519558
assert.ok(KNOWLEDGE_BASE['FMA13295'].sources[0].url.includes('NBK519558'));
assert.ok(QUESTION_BANK.find(q => q.id === 'q-id-diaphragm')?.sources?.[0].url.includes('NBK519558'));
assert.ok(GUIDED_EXPLORATIONS[0].steps.find(s => s.id === 'cardio-step-2')?.sources?.[0].url.includes('NBK519558'));
assert.ok(VERIFIED_RELATIONSHIPS.find(r => r.id === 'rel_diaphragm_right_lung')?.sourceReference.includes('NBK519558'));

// Skull -> NBK499834
assert.ok(KNOWLEDGE_BASE['FMA46565'].sources[0].url.includes('NBK499834'));
assert.ok(QUESTION_BANK.find(q => q.id === 'q-id-skull')?.sources?.[0].url.includes('NBK499834'));
assert.ok(GUIDED_EXPLORATIONS[1].steps.find(s => s.id === 'skel-step-1')?.sources?.[0].url.includes('NBK499834'));
assert.ok(VERIFIED_RELATIONSHIPS.find(r => r.id === 'rel_skull_brain_surround')?.sourceReference.includes('NBK499834'));

// Trachea -> NBK448070
assert.ok(KNOWLEDGE_BASE['FMA7394'].sources[0].url.includes('NBK448070'));
assert.ok(QUESTION_BANK.find(q => q.id === 'q-id-trachea')?.sources?.[0].url.includes('NBK448070'));
assert.ok(GUIDED_EXPLORATIONS[2].steps.find(s => s.id === 'resp-step-1')?.sources?.[0].url.includes('NBK448070'));
assert.ok(VERIFIED_RELATIONSHIPS.find(r => r.id === 'rel_trachea_right_bronchus')?.sourceReference.includes('NBK448070'));

// Kidneys -> NBK482385
assert.ok(KNOWLEDGE_BASE['FMA7204'].sources[0].url.includes('NBK482385'));
assert.ok(QUESTION_BANK.find(q => q.id === 'q-id-kidney')?.sources?.[0].url.includes('NBK482385'));
assert.ok(VERIFIED_RELATIONSHIPS.find(r => r.id === 'rel_right_kidney_bladder_drain')?.sourceReference.includes('NBK482385'));

// 9. BATCH 7: Knowledge Base Expansion & Atlas Concept Integrity
const atlas = JSON.parse(readFileSync(new URL('../public/models/atlas.json', import.meta.url), 'utf8'));
const atlasConceptMap = new Map(atlas.concepts.map(c => [c.id, c]));
const kbKeys = Object.keys(KNOWLEDGE_BASE);

assert.ok(kbKeys.length >= 35, `Expected at least 35 knowledge entries in Batch 7, got ${kbKeys.length}`);

// A. No duplicates and every entry references an existing atlas concept with required fields
const seenIds = new Set();
for (const [conceptId, entry] of Object.entries(KNOWLEDGE_BASE)) {
  assert.ok(!seenIds.has(conceptId), `Duplicate concept ID detected in KNOWLEDGE_BASE: ${conceptId}`);
  seenIds.add(conceptId);

  assert.equal(entry.conceptId, conceptId, `Entry conceptId "${entry.conceptId}" must match key "${conceptId}"`);
  assert.ok(atlasConceptMap.has(conceptId), `Knowledge entry ${conceptId} (${entry.canonicalName}) does not exist in atlas.json`);
  assert.ok(entry.canonicalName && entry.canonicalName.trim().length > 0, `Missing canonicalName in ${conceptId}`);
  assert.ok(entry.anatomicalSystem && entry.anatomicalSystem.length > 0, `Missing anatomicalSystem in ${conceptId}`);
  assert.ok(entry.overview && entry.overview.trim().length >= 40, `Overview too short in ${conceptId}`);
  assert.ok(entry.location && entry.location.trim().length > 0, `Missing location in ${conceptId}`);
  assert.ok(entry.function && entry.function.trim().length > 0, `Missing function in ${conceptId}`);
  assert.ok(entry.clinicalNotes && entry.clinicalNotes.trim().length > 0, `Missing clinicalNotes in ${conceptId}`);
  assert.ok(Array.isArray(entry.anatomicalFeatures) && entry.anatomicalFeatures.length >= 1, `Missing anatomicalFeatures in ${conceptId}`);
  assert.ok(Array.isArray(entry.sources) && entry.sources.length >= 1, `Missing sources in ${conceptId}`);
  assert.equal(entry.verificationStatus, 'verified', `Unverified status in ${conceptId}`);

  // Related structures validity
  if (entry.relatedStructures) {
    for (const rel of entry.relatedStructures) {
      assert.ok(atlasConceptMap.has(rel.conceptId), `Related structure ${rel.conceptId} in ${conceptId} not in atlas.json`);
      assert.ok(rel.name && rel.name.trim().length > 0, `Missing related structure name in ${conceptId}`);
      assert.ok(rel.relationship && rel.relationship.trim().length > 0, `Missing relationship text in ${conceptId}`);
    }
  }
}

// B. Specific Batch 7 Target Structures Regression Tests
const BATCH_7_TARGETS = [
  { id: 'FMA3734', name: 'Aorta', system: 'arterial' },
  { id: 'FMA3736', name: 'Ascending aorta', system: 'arterial' },
  { id: 'FMA3768', name: 'Arch of aorta', system: 'arterial' },
  { id: 'FMA3784', name: 'Descending aorta', system: 'arterial' },
  { id: 'FMA3789', name: 'Abdominal aorta', system: 'arterial' },
  { id: 'FMA7131', name: 'Esophagus', system: 'digestive' },
  { id: 'FMA7202', name: 'Gallbladder', system: 'digestive' },
  { id: 'FMA7206', name: 'Duodenum', system: 'digestive' },
  { id: 'FMA4720', name: 'Superior vena cava', system: 'venous' },
  { id: 'FMA10951', name: 'Inferior vena cava', system: 'venous' },
  { id: 'FMA79876', name: 'Brainstem', system: 'nervous' },
  { id: 'FMA67944', name: 'Cerebellum', system: 'nervous' },
  { id: 'FMA8612', name: 'Pulmonary trunk', system: 'arterial' },
  { id: 'FMA7485', name: 'Sternum', system: 'skeletal' },
  { id: 'FMA7574', name: 'Ribs', system: 'skeletal' },
  { id: 'FMA7480', name: 'Rib cage', system: 'skeletal' }
];

for (const target of BATCH_7_TARGETS) {
  const resolved = findKnowledgeForConcept(target.id, undefined, atlas.concepts);
  assert.ok(resolved.entry !== null, `findKnowledgeForConcept failed for Batch 7 target: ${target.id}`);
  assert.equal(resolved.entry.conceptId, target.id);
  assert.equal(resolved.entry.canonicalName, target.name);
  assert.equal(resolved.entry.anatomicalSystem, target.system);
  assert.ok(resolved.entry.sources.length >= 1, `Target ${target.id} must have verified citations`);
}

// C. Bilateral vs Unilateral Structural Integrity
const bilateralEntries = ['FMA9611', 'FMA13303', 'FMA7203', 'FMA7574'];
for (const bId of bilateralEntries) {
  const bEntry = KNOWLEDGE_BASE[bId];
  const text = (bEntry.overview + ' ' + bEntry.location).toLowerCase();
  assert.ok(
    text.includes('bilateral') || text.includes('paired') || text.includes('12 pairs'),
    `Bilateral concept ${bId} (${bEntry.canonicalName}) must explicitly describe bilateral/paired structure`
  );
}

console.log('✓ All registry entries, modules, anti-regression guards, Batch 7 knowledge expansions, and cross-module consistency tests PASSED.');
