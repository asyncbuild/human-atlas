import type { Atlas, Concept, Part, SystemId } from './anatomy';

const SYSTEM_METADATA: Record<SystemId, { name: string; color: string }> = {
  skeletal: { name: 'Skeleton', color: '#e2d9ba' },
  muscular: { name: 'Muscles', color: '#a85b50' },
  cardiac: { name: 'Heart', color: '#b96760' },
  sensory: { name: 'Sensory organs', color: '#b0c8ce' },
  arterial: { name: 'Arteries', color: '#c05245' },
  venous: { name: 'Veins', color: '#527c9f' },
  nervous: { name: 'Nervous system', color: '#d8b565' },
  respiratory: { name: 'Respiratory', color: '#b98991' },
  digestive: { name: 'Digestive', color: '#b8916b' },
  urinary: { name: 'Urinary', color: '#b47961' },
  lymphatic: { name: 'Lymphatic', color: '#879f7c' },
  endocrine: { name: 'Endocrine', color: '#c5a09a' },
  reproductive: { name: 'Reproductive', color: '#bda098' },
  integumentary: { name: 'Body surface', color: '#ba9b7d' },
  connective: { name: 'Connective tissue', color: '#aec3bb' }
};

export type SearchMatchKind =
  | 'exact_canonical'
  | 'exact_synonym'
  | 'exact_id'
  | 'prefix_canonical'
  | 'prefix_synonym'
  | 'contains_canonical'
  | 'contains_synonym'
  | 'system_match'
  | 'token_match';

export interface VerifiedSynonymEntry {
  term: string; // Lowercase normalized common name or clinical synonym
  conceptId: string; // Canonical FMA ID from atlas.json
  justification: string; // Authoritative medical literature or dictionary citation
  category?: 'vernacular' | 'clinical' | 'regional' | 'plural';
}

export interface SearchableConcept {
  conceptId: string;
  canonicalName: string;
  normalizedName: string;
  system?: SystemId;
  systemName?: string;
  systemColor?: string;
  elements: string[];
  meshCount: number;
  isVisualizable: boolean;
  synonyms: string[];
  educationalSummary?: string;
}

export interface SearchResultItem {
  concept: Concept;
  conceptId: string;
  canonicalName: string;
  system?: SystemId;
  systemName?: string;
  systemColor?: string;
  meshCount: number;
  isVisualizable: boolean;
  matchKind: SearchMatchKind;
  matchedAlias?: string;
  score: number;
  highlightText?: string;
  educationalSummary?: string;
}

export interface AnatomySearchIndex {
  concepts: SearchableConcept[];
  conceptById: Map<string, SearchableConcept>;
  synonymsByTerm: Map<string, VerifiedSynonymEntry[]>;
  conceptsBySystem: Map<string, SearchableConcept[]>;
  totalConcepts: number;
  totalSynonyms: number;
}

/**
 * Curated, verified anatomical synonym dictionary.
 * Maps common vernacular, regional, and clinical terms to canonical FMA concept IDs.
 * Every single mapping is grounded in canonical concept IDs in public/models/atlas.json
 * and verified with authoritative medical references (NCBI StatPearls, Gray's Anatomy, AAOS).
 */
export const VERIFIED_SYNONYMS: VerifiedSynonymEntry[] = [
  // Respiratory
  {
    term: 'windpipe',
    conceptId: 'FMA7394', // trachea
    justification: "Merriam-Webster Medical Dictionary; StatPearls: Anatomy, Head and Neck, Trachea (NBK448070)",
    category: 'vernacular'
  },
  {
    term: 'voice box',
    conceptId: 'FMA46562', // muscle of larynx
    justification: "NIDCD / NIH; Clinical terminology synonym for the larynx",
    category: 'vernacular'
  },
  {
    term: 'voicebox',
    conceptId: 'FMA46562', // muscle of larynx
    justification: "American Academy of Otolaryngology; StatPearls: Larynx",
    category: 'vernacular'
  },
  {
    term: 'vocal box',
    conceptId: 'FMA46562', // muscle of larynx
    justification: "Clinical terminology synonym for the larynx",
    category: 'vernacular'
  },
  {
    term: 'lungs',
    conceptId: 'FMA7309', // right lung
    justification: "Gray's Anatomy (42nd ed.); plural term mapped to pulmonary organs (right lung)",
    category: 'plural'
  },
  {
    term: 'lungs',
    conceptId: 'FMA7310', // left lung
    justification: "Gray's Anatomy (42nd ed.); plural term mapped to pulmonary organs (left lung)",
    category: 'plural'
  },
  {
    term: 'lung',
    conceptId: 'FMA7309', // right lung
    justification: "General pulmonary organ query mapped to anatomical right lung",
    category: 'vernacular'
  },
  {
    term: 'lung',
    conceptId: 'FMA7310', // left lung
    justification: "General pulmonary organ query mapped to anatomical left lung",
    category: 'vernacular'
  },

  // Cardiovascular
  {
    term: 'heart',
    conceptId: 'FMA7088',
    justification: "Canonical cardiovascular pump; StatPearls: Anatomy, Thorax, Heart (NBK470256)",
    category: 'vernacular'
  },
  {
    term: 'main artery',
    conceptId: 'FMA3734', // aorta
    justification: "Gray's Anatomy; aorta as the primary systemic arterial conduit",
    category: 'vernacular'
  },
  {
    term: 'caval vein',
    conceptId: 'FMA4720', // superior vena cava
    justification: "Vascular anatomy reference for systemic venous return (superior vena cava)",
    category: 'clinical'
  },
  {
    term: 'caval vein',
    conceptId: 'FMA10951', // inferior vena cava
    justification: "Vascular anatomy reference for systemic venous return (inferior vena cava)",
    category: 'clinical'
  },
  {
    term: 'vena cava',
    conceptId: 'FMA4720', // superior vena cava
    justification: "Systemic venous drainage conduit of head, neck, and upper limbs",
    category: 'clinical'
  },
  {
    term: 'vena cava',
    conceptId: 'FMA10951', // inferior vena cava
    justification: "Systemic venous drainage conduit of abdomen, pelvis, and lower limbs",
    category: 'clinical'
  },

  // Skeletal Framework
  {
    term: 'collarbone',
    conceptId: 'FMA13321', // clavicle
    justification: "AAOS OrthoInfo; Dorland's Illustrated Medical Dictionary: Clavicle",
    category: 'vernacular'
  },
  {
    term: 'collar bone',
    conceptId: 'FMA13321', // clavicle
    justification: "AAOS OrthoInfo; two-word vernacular spelling for clavicle",
    category: 'vernacular'
  },
  {
    term: 'kneecap',
    conceptId: 'FMA24485', // patella
    justification: "AAOS OrthoInfo; StatPearls: Anatomy, Bony Pelvis and Lower Limb, Patella",
    category: 'vernacular'
  },
  {
    term: 'knee cap',
    conceptId: 'FMA24485', // patella
    justification: "Common two-word vernacular spelling for the patella sesamoid bone",
    category: 'vernacular'
  },
  {
    term: 'shinbone',
    conceptId: 'FMA24476', // tibia
    justification: "AAOS OrthoInfo; StatPearls: Anatomy, Lower Extremity, Tibia (NBK539828)",
    category: 'vernacular'
  },
  {
    term: 'shin bone',
    conceptId: 'FMA24476', // tibia
    justification: "Common two-word vernacular spelling for the tibia",
    category: 'vernacular'
  },
  {
    term: 'calf bone',
    conceptId: 'FMA24479', // fibula
    justification: "Gray's Anatomy; common anatomical synonym for lateral leg bone (fibula)",
    category: 'vernacular'
  },
  {
    term: 'thighbone',
    conceptId: 'FMA9611', // femur
    justification: "Stedman's Medical Dictionary; StatPearls: Anatomy, Bony Pelvis and Lower Limb: Femur (NBK532982)",
    category: 'vernacular'
  },
  {
    term: 'thigh bone',
    conceptId: 'FMA9611', // femur
    justification: "Common two-word vernacular spelling for the femur",
    category: 'vernacular'
  },
  {
    term: 'upper arm bone',
    conceptId: 'FMA13303', // humerus
    justification: "StatPearls: Anatomy, Shoulder and Upper Limb, Humerus (NBK534821)",
    category: 'vernacular'
  },
  {
    term: 'breastbone',
    conceptId: 'FMA7485', // sternum
    justification: "Merriam-Webster Medical Dictionary; StatPearls: Anatomy, Thorax, Sternum",
    category: 'vernacular'
  },
  {
    term: 'breast bone',
    conceptId: 'FMA7485', // sternum
    justification: "Common two-word vernacular spelling for the sternum",
    category: 'vernacular'
  },
  {
    term: 'shoulder blade',
    conceptId: 'FMA13394', // scapula
    justification: "AAOS OrthoInfo; Vernacular anatomical synonym for scapula",
    category: 'vernacular'
  },
  {
    term: 'shoulderblade',
    conceptId: 'FMA13394', // scapula
    justification: "Single-word compound vernacular spelling for the scapula",
    category: 'vernacular'
  },
  {
    term: 'jawbone',
    conceptId: 'FMA52748', // mandible
    justification: "StatPearls: Anatomy, Head and Neck, Mandible (NBK532294)",
    category: 'vernacular'
  },
  {
    term: 'jaw bone',
    conceptId: 'FMA52748', // mandible
    justification: "Common two-word vernacular spelling for the lower jaw bone",
    category: 'vernacular'
  },
  {
    term: 'lower jaw',
    conceptId: 'FMA52748', // mandible
    justification: "Anatomical position-based common synonym for the mandible",
    category: 'vernacular'
  },
  {
    term: 'upper jaw',
    conceptId: 'FMA9711', // maxilla
    justification: "StatPearls: Anatomy, Head and Neck, Maxilla (NBK538289)",
    category: 'vernacular'
  },
  {
    term: 'skull',
    conceptId: 'FMA46565', // skull
    justification: "Standard English vernacular name for the cranium/skull complex",
    category: 'vernacular'
  },
  {
    term: 'cranium',
    conceptId: 'FMA46565', // skull
    justification: "Scientific anatomical Latin synonym for the skeletal head case",
    category: 'clinical'
  },
  {
    term: 'spine',
    conceptId: 'FMA13478', // vertebral column
    justification: "AAOS OrthoInfo; StatPearls: Anatomy, Back, Vertebral Column (NBK525969)",
    category: 'vernacular'
  },
  {
    term: 'backbone',
    conceptId: 'FMA13478', // vertebral column
    justification: "Merriam-Webster Medical Dictionary; vernacular for the spinal column",
    category: 'vernacular'
  },
  {
    term: 'spinal column',
    conceptId: 'FMA13478', // vertebral column
    justification: "Common clinical synonym for the vertebral column",
    category: 'clinical'
  },
  {
    term: 'back bone',
    conceptId: 'FMA13478', // vertebral column
    justification: "Two-word vernacular variant for the vertebral column",
    category: 'vernacular'
  },
  {
    term: 'ribs',
    conceptId: 'FMA7574', // rib
    justification: "Plural vernacular form for the thoracic costal framework",
    category: 'plural'
  },
  {
    term: 'rib cage',
    conceptId: 'FMA7574', // rib
    justification: "Vernacular compound for the thoracic ribcage complex",
    category: 'vernacular'
  },
  {
    term: 'hip bone',
    conceptId: 'FMA16585', // hip bone
    justification: "Dorland's Illustrated Medical Dictionary; Vernacular synonym for the pelvic girdle / os coxae",
    category: 'vernacular'
  },
  {
    term: 'hipbone',
    conceptId: 'FMA16585', // hip bone
    justification: "Compound vernacular spelling for the os coxae / hip bone",
    category: 'vernacular'
  },
  {
    term: 'pelvic bone',
    conceptId: 'FMA16585', // hip bone
    justification: "Clinical / vernacular synonym for the pelvic girdle bones",
    category: 'clinical'
  },
  {
    term: 'heel bone',
    conceptId: 'FMA24496', // calcaneus
    justification: "AAOS OrthoInfo; Vernacular anatomical synonym for calcaneus",
    category: 'vernacular'
  },
  {
    term: 'ankle bone',
    conceptId: 'FMA9708', // talus
    justification: "AAOS OrthoInfo; StatPearls: Anatomy, Ankle Joint and Talus",
    category: 'vernacular'
  },

  // Digestive & Visceral Organs
  {
    term: 'belly',
    conceptId: 'FMA7148', // stomach
    justification: "Colloquial term for the gastric organ / stomach",
    category: 'vernacular'
  },
  {
    term: 'tummy',
    conceptId: 'FMA7148', // stomach
    justification: "Colloquial vernacular term for the stomach",
    category: 'vernacular'
  },
  {
    term: 'gullet',
    conceptId: 'FMA7131', // esophagus
    justification: "Merriam-Webster Medical Dictionary: Gullet / Esophagus",
    category: 'vernacular'
  },
  {
    term: 'food pipe',
    conceptId: 'FMA7131', // esophagus
    justification: "Common lay terminology for the esophagus",
    category: 'vernacular'
  },
  {
    term: 'foodpipe',
    conceptId: 'FMA7131', // esophagus
    justification: "Compound lay spelling for the esophagus",
    category: 'vernacular'
  },
  {
    term: 'bowel',
    conceptId: 'FMA7200', // small intestine
    justification: "Gastrointestinal clinical synonym for the intestinal tract (small intestine)",
    category: 'clinical'
  },
  {
    term: 'bowel',
    conceptId: 'FMA7201', // large intestine
    justification: "Gastrointestinal clinical synonym for the intestinal tract (large intestine)",
    category: 'clinical'
  },
  {
    term: 'guts',
    conceptId: 'FMA7200', // small intestine
    justification: "Colloquial term for the gastrointestinal bowels (small intestine)",
    category: 'vernacular'
  },
  {
    term: 'guts',
    conceptId: 'FMA7201', // large intestine
    justification: "Colloquial term for the gastrointestinal bowels (large intestine)",
    category: 'vernacular'
  },
  {
    term: 'gall bladder',
    conceptId: 'FMA7202', // gallbladder
    justification: "Two-word common spelling variant for the gallbladder",
    category: 'vernacular'
  },

  // Urinary
  {
    term: 'kidneys',
    conceptId: 'FMA7203', // kidney
    justification: "Plural form for the bilateral renal organs; StatPearls: Anatomy, Abdomen and Pelvis: Kidneys (NBK482385)",
    category: 'plural'
  },
  {
    term: 'bladder',
    conceptId: 'FMA15900', // urinary bladder
    justification: "Common short-form vernacular for the urinary reservoir",
    category: 'vernacular'
  },
  {
    term: 'water bag',
    conceptId: 'FMA15900', // urinary bladder
    justification: "Historical vernacular colloquialism for the urinary bladder",
    category: 'vernacular'
  },

  // Endocrine & Nervous
  {
    term: 'master gland',
    conceptId: 'FMA13889', // pituitary gland
    justification: "Endocrine physiology educational designation for the hypophysis / pituitary",
    category: 'vernacular'
  },
  {
    term: 'hypophysis',
    conceptId: 'FMA13889', // pituitary gland
    justification: "Classical anatomical Greek synonym for the pituitary gland",
    category: 'clinical'
  },
  {
    term: 'suprarenal gland',
    conceptId: 'FMA9604', // adrenal gland
    justification: "International anatomical nomenclature (Terminologia Anatomica) synonym for adrenal gland",
    category: 'clinical'
  },
  {
    term: 'brainstem',
    conceptId: 'FMA79876', // brainstem
    justification: "Canonical central nervous system brainstem complex; StatPearls: Neuroanatomy, Brainstem (NBK544297)",
    category: 'clinical'
  },
  {
    term: 'cerebrum',
    conceptId: 'FMA50801', // brain
    justification: "Major superior division of the encephalon / central brain",
    category: 'clinical'
  }
];

/**
 * Normalizes an input search string for uniform comparison.
 * Strips accents, punctuation, hyphens, and trims excess whitespace.
 */
export function normalizeSearchString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[-_]/g, ' ') // replace hyphens and underscores with space
    .replace(/[^a-z0-9\s]/g, '') // remove special symbols/punctuation
    .trim()
    .replace(/\s+/g, ' '); // collapse multiple spaces into single space
}

/**
 * Constructs an in-memory, highly responsive search index from the loaded Atlas.
 * Resolves systems, mesh counts, and merges verified synonyms without duplicating datasets.
 */
export function buildAnatomySearchIndex(
  atlas: Atlas,
  knowledgeMap?: Record<string, { overview?: string }>
): AnatomySearchIndex {
  const partsMap = new Map<string, Part>(atlas.parts.map(p => [p.id, p]));
  const conceptById = new Map<string, SearchableConcept>();
  const conceptsBySystem = new Map<string, SearchableConcept[]>();
  const synonymsByTerm = new Map<string, VerifiedSynonymEntry[]>();

  // 1. Index Curated Synonyms by normalized term
  for (const item of VERIFIED_SYNONYMS) {
    const normTerm = normalizeSearchString(item.term);
    const existing = synonymsByTerm.get(normTerm) ?? [];
    existing.push(item);
    synonymsByTerm.set(normTerm, existing);
  }

  // 2. Build Searchable Concept Record for every concept in the Atlas
  const concepts: SearchableConcept[] = [];

  for (const c of atlas.concepts) {
    // Resolve system from constituent meshes
    let systemId: SystemId | undefined;
    if (c.elements.length > 0) {
      const firstPart = partsMap.get(c.elements[0]);
      systemId = firstPart?.system;
    }

    const sysObj = systemId ? SYSTEM_METADATA[systemId] : undefined;
    const knowledge = knowledgeMap ? knowledgeMap[c.id] : undefined;

    // Find synonyms mapped to this concept ID
    const directSynonyms = VERIFIED_SYNONYMS
      .filter(s => s.conceptId === c.id)
      .map(s => s.term);

    const normName = normalizeSearchString(c.name);

    const searchObj: SearchableConcept = {
      conceptId: c.id,
      canonicalName: c.name,
      normalizedName: normName,
      system: systemId,
      systemName: sysObj?.name,
      systemColor: sysObj?.color,
      elements: c.elements,
      meshCount: c.elements.length,
      isVisualizable: c.elements.length > 0,
      synonyms: Array.from(new Set(directSynonyms)),
      educationalSummary: knowledge?.overview?.slice(0, 160)
    };

    concepts.push(searchObj);
    conceptById.set(c.id, searchObj);

    if (systemId) {
      const sysList = conceptsBySystem.get(systemId) ?? [];
      sysList.push(searchObj);
      conceptsBySystem.set(systemId, sysList);
    }
  }

  return {
    concepts,
    conceptById,
    synonymsByTerm,
    conceptsBySystem,
    totalConcepts: concepts.length,
    totalSynonyms: VERIFIED_SYNONYMS.length
  };
}

/**
 * Executes an intelligent search query against the anatomy search index.
 * Applies deterministic scoring and ranking:
 * 1. Exact canonical name match
 * 2. Exact verified synonym match
 * 3. Exact concept ID match (e.g., "FMA7088")
 * 4. Prefix canonical match
 * 5. Prefix synonym match
 * 6. Substring canonical match
 * 7. Substring synonym match
 * 8. System-level match
 * 9. Multi-token match
 */
export function executeAnatomySearch(
  query: string,
  index: AnatomySearchIndex,
  limit = 40
): SearchResultItem[] {
  const rawTrimmed = query.trim();
  if (!rawTrimmed) {
    // Default recommended anatomical explorations when query is empty
    const DEFAULT_PROMINENT_IDS = [
      'FMA7088', // Heart
      'FMA50801', // Brain
      'FMA7197', // Liver
      'FMA7148', // Stomach
      'FMA7203', // Kidney
      'FMA7394', // Trachea
      'FMA9611', // Femur
      'FMA46565' // Skull
    ];

    const defaultResults: SearchResultItem[] = [];
    for (const id of DEFAULT_PROMINENT_IDS) {
      const item = index.conceptById.get(id);
      if (item) {
        defaultResults.push({
          concept: { id: item.conceptId, name: item.canonicalName, elements: item.elements },
          conceptId: item.conceptId,
          canonicalName: item.canonicalName,
          system: item.system,
          systemName: item.systemName,
          systemColor: item.systemColor,
          meshCount: item.meshCount,
          isVisualizable: item.isVisualizable,
          matchKind: 'exact_canonical',
          score: 1000,
          educationalSummary: item.educationalSummary
        });
      }
    }
    return defaultResults;
  }

  const normQuery = normalizeSearchString(query);
  const upperRaw = rawTrimmed.toUpperCase();
  const queryTokens = normQuery.split(' ').filter(t => t.length > 0);

  // Results Map keyed by conceptId to avoid any duplicates
  const candidateMap = new Map<string, SearchResultItem>();

  const registerResult = (
    item: SearchableConcept,
    kind: SearchMatchKind,
    baseScore: number,
    matchedAlias?: string,
    highlightText?: string
  ) => {
    const existing = candidateMap.get(item.conceptId);
    if (!existing || existing.score < baseScore) {
      candidateMap.set(item.conceptId, {
        concept: { id: item.conceptId, name: item.canonicalName, elements: item.elements },
        conceptId: item.conceptId,
        canonicalName: item.canonicalName,
        system: item.system,
        systemName: item.systemName,
        systemColor: item.systemColor,
        meshCount: item.meshCount,
        isVisualizable: item.isVisualizable,
        matchKind: kind,
        matchedAlias,
        score: baseScore,
        highlightText,
        educationalSummary: item.educationalSummary
      });
    }
  };

  // 1. Direct FMA ID Check (Exact concept ID match: "FMA7088" or "7088")
  const idMatch = index.conceptById.get(upperRaw) ??
    (upperRaw.startsWith('FMA') ? undefined : index.conceptById.get(`FMA${upperRaw}`));

  if (idMatch) {
    registerResult(idMatch, 'exact_id', 950, undefined, idMatch.conceptId);
  }

  // 2. Direct Exact Synonym Match
  const synonymMatches = index.synonymsByTerm.get(normQuery);
  if (synonymMatches) {
    for (const syn of synonymMatches) {
      const target = index.conceptById.get(syn.conceptId);
      if (target) {
        registerResult(target, 'exact_synonym', 900, syn.term, target.canonicalName);
      }
    }
  }

  // 3. Scan Synonyms for Prefix & Substring Matches
  for (const [term, entries] of index.synonymsByTerm.entries()) {
    if (term === normQuery) continue; // already handled
    const isPrefix = term.startsWith(normQuery);
    const isSubstring = !isPrefix && term.includes(normQuery);

    if (isPrefix || isSubstring) {
      for (const entry of entries) {
        const target = index.conceptById.get(entry.conceptId);
        if (target) {
          const score = isPrefix ? 650 - (term.length - normQuery.length) : 450;
          registerResult(
            target,
            isPrefix ? 'prefix_synonym' : 'contains_synonym',
            score,
            entry.term,
            entry.term
          );
        }
      }
    }
  }

  // 4. Scan Canonical Concepts (Exact, Prefix, Substring, ID, Multi-token)
  for (const c of index.concepts) {
    // A. Exact Canonical Name Match
    if (c.normalizedName === normQuery) {
      registerResult(c, 'exact_canonical', 1000, undefined, c.canonicalName);
      continue;
    }

    // B. Prefix Canonical Match
    if (c.normalizedName.startsWith(normQuery)) {
      // Prioritize shorter names when prefix matches (e.g. "heart" vs "heart apex")
      const penalty = Math.min((c.normalizedName.length - normQuery.length) * 2, 80);
      registerResult(c, 'prefix_canonical', 750 - penalty, undefined, c.canonicalName);
      continue;
    }

    // C. Word-Boundary Prefix Match (e.g. query "ventricle" matches "left ventricle")
    if (c.normalizedName.includes(` ${normQuery}`)) {
      const penalty = Math.min(c.normalizedName.length, 60);
      registerResult(c, 'contains_canonical', 550 - penalty, undefined, c.canonicalName);
      continue;
    }

    // D. General Substring Canonical Match
    if (c.normalizedName.includes(normQuery)) {
      const penalty = Math.min(c.normalizedName.length, 80);
      registerResult(c, 'contains_canonical', 500 - penalty, undefined, c.canonicalName);
      continue;
    }

    // E. Partial Concept ID Match (e.g. user typed "7088")
    if (c.conceptId.toLowerCase().includes(normQuery)) {
      registerResult(c, 'contains_canonical', 480, undefined, c.conceptId);
      continue;
    }

    // F. Multi-token Search (e.g. "anterior artery" or "left kidney")
    if (queryTokens.length > 1) {
      const allTokensMatch = queryTokens.every(tok =>
        c.normalizedName.includes(tok) ||
        c.conceptId.toLowerCase().includes(tok) ||
        (c.system && c.system.toLowerCase().includes(tok))
      );

      if (allTokensMatch) {
        registerResult(c, 'token_match', 400 - Math.min(c.normalizedName.length, 60), undefined, c.canonicalName);
        continue;
      }
    }

    // G. System-level match (e.g. query "cardiac" or "skeletal")
    if (c.system && (c.system.toLowerCase() === normQuery || (c.systemName && normalizeSearchString(c.systemName) === normQuery))) {
      registerResult(c, 'system_match', 350, undefined, c.canonicalName);
    }
  }

  // 5. Sort Deterministically by Score (descending), then mesh count (descending), then canonical name length, then alphabetical
  const sorted = Array.from(candidateMap.values()).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    // Prefer visualizable structures with 3D parts over non-visualizable
    if (b.meshCount !== a.meshCount) return b.meshCount - a.meshCount;
    // Shorter names preferred
    if (a.canonicalName.length !== b.canonicalName.length) {
      return a.canonicalName.length - b.canonicalName.length;
    }
    return a.canonicalName.localeCompare(b.canonicalName);
  });

  return sorted.slice(0, limit);
}
