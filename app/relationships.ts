import type { SystemId } from './anatomy';
import { formatRelationshipCitation } from './citations.ts';

export type AnatomicalRelationshipType =
  | 'part_of'
  | 'contains'
  | 'located_near'
  | 'connected_to'
  | 'surrounds'
  | 'supplies'
  | 'drains_into'
  | 'functionally_related';

export type RelationshipCategory =
  | 'structural'
  | 'spatial'
  | 'circulatory'
  | 'functional';

export interface AnatomicalRelationship {
  id: string;
  sourceConceptId: string;
  targetConceptId: string;
  type: AnatomicalRelationshipType;
  category: RelationshipCategory;
  explanation: string;
  sourceReference: string;
  sourceKind: 'atlas' | 'verified_educational_source';
  confidence: 'high' | 'verified';
}

export interface RelationshipGraphNode {
  id: string;
  name: string;
  system?: SystemId;
  depth: number;
  isCenter: boolean;
  relationshipCount: number;
}

export interface RelationshipGraphEdge {
  id: string;
  source: string;
  target: string;
  type: AnatomicalRelationshipType;
  category: RelationshipCategory;
  explanation: string;
  sourceReference: string;
  isOutgoing: boolean; // Relative to the currently inspected/central node
}

export interface RelationshipGraphData {
  nodes: RelationshipGraphNode[];
  edges: RelationshipGraphEdge[];
  centerConceptId: string;
  depth: number;
  totalAvailable: number;
}

export const RELATIONSHIP_CATEGORY_LABELS: Record<RelationshipCategory, { label: string; description: string; color: string }> = {
  structural: {
    label: 'Structural',
    description: 'Direct continuity, articulatory connections, or anatomical subdivisions',
    color: '#38bdf8' // Cyan / Sky
  },
  spatial: {
    label: 'Spatial',
    description: 'Anatomical adjacency, surrounding cavities, or protective envelopes',
    color: '#fbbf24' // Amber
  },
  circulatory: {
    label: 'Circulatory',
    description: 'Vascular conduits, hemodynamic outflow supplies, or venous drainages',
    color: '#f43f5e' // Rose / Crimson
  },
  functional: {
    label: 'Functional',
    description: 'Physiological interdependence, cooperative reflexes, or shared biomechanical roles',
    color: '#a855f7' // Purple
  }
};

export const RELATIONSHIP_TYPE_LABELS: Record<AnatomicalRelationshipType, { label: string; badge: string }> = {
  part_of: { label: 'Part of', badge: 'Part' },
  contains: { label: 'Contains', badge: 'Contains' },
  located_near: { label: 'Located near', badge: 'Adjacent' },
  connected_to: { label: 'Connected to', badge: 'Connected' },
  surrounds: { label: 'Surrounds', badge: 'Surrounds' },
  supplies: { label: 'Supplies', badge: 'Supplies' },
  drains_into: { label: 'Drains into', badge: 'Drains' },
  functionally_related: { label: 'Functionally related to', badge: 'Functional' }
};

/**
 * Curated, verified anatomical relationships grounded in canonical FMA identifiers
 * from public/models/atlas.json and supported by authoritative medical literature.
 */
export const VERIFIED_RELATIONSHIPS: AnatomicalRelationship[] = [
  // =========================================================================
  // CARDIOVASCULAR & HEMODYNAMIC NETWORK (Heart, Aorta, Venae Cavae)
  // =========================================================================
  {
    id: 'rel_heart_aorta_supply',
    sourceConceptId: 'FMA7088', // heart
    targetConceptId: 'FMA3736', // ascending aorta
    type: 'supplies',
    category: 'circulatory',
    explanation: 'The left ventricle ejects oxygenated systemic blood across the aortic valve directly into the ascending aorta during ventricular systole.',
    sourceReference: formatRelationshipCitation('heart'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_heart_pulmonary_trunk',
    sourceConceptId: 'FMA7088', // heart
    targetConceptId: 'FMA8612', // pulmonary trunk
    type: 'connected_to',
    category: 'circulatory',
    explanation: 'The conus arteriosus of the right ventricle leads directly into the pulmonary semilunar valve and the pulmonary trunk to supply the pulmonary circuit.',
    sourceReference: formatRelationshipCitation('grays_anatomy'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_svc_heart_drain',
    sourceConceptId: 'FMA4720', // superior vena cava
    targetConceptId: 'FMA7088', // heart
    type: 'drains_into',
    category: 'circulatory',
    explanation: 'The superior vena cava drains deoxygenated systemic venous return from the head, neck, upper limbs, and thorax into the posterosuperior aspect of the right atrium.',
    sourceReference: formatRelationshipCitation('svc'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_ivc_heart_drain',
    sourceConceptId: 'FMA10951', // inferior vena cava
    targetConceptId: 'FMA7088', // heart
    type: 'drains_into',
    category: 'circulatory',
    explanation: 'The inferior vena cava ascends through the caval opening of the diaphragm to drain venous return from the abdomen, pelvis, and lower limbs into the posteroinferior right atrium.',
    sourceReference: formatRelationshipCitation('ivc'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_heart_diaphragm_loc',
    sourceConceptId: 'FMA7088', // heart
    targetConceptId: 'FMA13295', // diaphragm
    type: 'located_near',
    category: 'spatial',
    explanation: 'The diaphragmatic surface of the heart rests upon the central tendon of the diaphragm, to which the fibrous pericardium is firmly and immovably fused.',
    sourceReference: formatRelationshipCitation('pericardium'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_heart_right_lung_loc',
    sourceConceptId: 'FMA7088', // heart
    targetConceptId: 'FMA7309', // right lung
    type: 'located_near',
    category: 'spatial',
    explanation: 'The right atrium and right ventricle produce a broad, shallow cardiac impression on the mediastinal surface of the right lung.',
    sourceReference: formatRelationshipCitation('lungs'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_heart_left_lung_loc',
    sourceConceptId: 'FMA7088', // heart
    targetConceptId: 'FMA7310', // left lung
    type: 'located_near',
    category: 'spatial',
    explanation: 'The left ventricular apex projects anteroinferiorly to the left, deeply indenting the anterior margin of the left lung to form the cardiac notch.',
    sourceReference: formatRelationshipCitation('lungs'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_sternum_heart_loc',
    sourceConceptId: 'FMA7485', // sternum
    targetConceptId: 'FMA7088', // heart
    type: 'located_near',
    category: 'spatial',
    explanation: 'The body of the sternum and xiphoid process sit directly anterior to the anterior pericardium and right ventricle in the thoracic cage.',
    sourceReference: formatRelationshipCitation('sternum'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },

  // =========================================================================
  // AORTIC CONTINUITY (Ascending -> Arch -> Descending -> Abdominal)
  // =========================================================================
  {
    id: 'rel_aorta_asc_to_arch',
    sourceConceptId: 'FMA3736', // ascending aorta
    targetConceptId: 'FMA3768', // arch of aorta
    type: 'connected_to',
    category: 'structural',
    explanation: 'The ascending aorta transitions continuously into the aortic arch at the level of the sternal angle (T4/T5 intervertebral disc).',
    sourceReference: formatRelationshipCitation('aorta_thorax'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_aorta_arch_to_desc',
    sourceConceptId: 'FMA3768', // arch of aorta
    targetConceptId: 'FMA3784', // descending aorta
    type: 'connected_to',
    category: 'structural',
    explanation: 'The aortic arch continues posteroinferiorly past the left side of the T4 vertebral body as the thoracic descending aorta.',
    sourceReference: formatRelationshipCitation('aorta_thorax'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_aorta_desc_to_abd',
    sourceConceptId: 'FMA3784', // descending aorta
    targetConceptId: 'FMA3789', // abdominal aorta
    type: 'connected_to',
    category: 'structural',
    explanation: 'The thoracic descending aorta passes through the diaphragmatic aortic hiatus at the T12 vertebral level to become the abdominal aorta.',
    sourceReference: formatRelationshipCitation('aorta_thorax'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_arch_trachea_loc',
    sourceConceptId: 'FMA3768', // arch of aorta
    targetConceptId: 'FMA7394', // trachea
    type: 'located_near',
    category: 'spatial',
    explanation: 'The aortic arch curves anteroposteriorly immediately anterior and to the left of the lower trachea before its bifurcation.',
    sourceReference: formatRelationshipCitation('grays_anatomy'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },

  // =========================================================================
  // RESPIRATORY & TRACHEOBRONCHIAL PATHWAY (Trachea, Bronchi, Lungs)
  // =========================================================================
  {
    id: 'rel_trachea_right_bronchus',
    sourceConceptId: 'FMA7394', // trachea
    targetConceptId: 'FMA68418', // right main bronchus proper
    type: 'connected_to',
    category: 'structural',
    explanation: 'The trachea bifurcates at the carina into the right principal bronchus, which is wider, shorter, and more vertical as it enters the right lung hilum.',
    sourceReference: formatRelationshipCitation('trachea'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_trachea_left_bronchus',
    sourceConceptId: 'FMA7394', // trachea
    targetConceptId: 'FMA7396', // left main bronchus
    type: 'connected_to',
    category: 'structural',
    explanation: 'The trachea bifurcates at the carina into the left principal bronchus, traversing inferolaterally beneath the aortic arch to enter the left lung hilum.',
    sourceReference: formatRelationshipCitation('trachea'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_lungs_bilateral_func',
    sourceConceptId: 'FMA7309', // right lung
    targetConceptId: 'FMA7310', // left lung
    type: 'functionally_related',
    category: 'functional',
    explanation: 'The bilateral lungs function as the coordinated respiratory pair responsible for tidal gas exchange and systemic acid-base regulation.',
    sourceReference: formatRelationshipCitation('respiratory_drive'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_diaphragm_right_lung',
    sourceConceptId: 'FMA13295', // diaphragm
    targetConceptId: 'FMA7309', // right lung
    type: 'functionally_related',
    category: 'functional',
    explanation: 'Right hemidiaphragmatic contraction flattens the dome, increasing thoracic vertical volume and generating subatmospheric pleural pressure to inflate the right lung.',
    sourceReference: formatRelationshipCitation('diaphragm'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_diaphragm_left_lung',
    sourceConceptId: 'FMA13295', // diaphragm
    targetConceptId: 'FMA7310', // left lung
    type: 'functionally_related',
    category: 'functional',
    explanation: 'Left hemidiaphragmatic contraction directly drives negative intrapleural pressure excursion and ventilation of the left lung.',
    sourceReference: formatRelationshipCitation('diaphragm'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },

  // =========================================================================
  // GASTROINTESTINAL & VISCERAL PATHWAY (Stomach, Liver, Pancreas, Gallbladder, Duodenum)
  // =========================================================================
  {
    id: 'rel_esophagus_stomach',
    sourceConceptId: 'FMA7131', // esophagus
    targetConceptId: 'FMA7148', // stomach
    type: 'connected_to',
    category: 'structural',
    explanation: 'The abdominal esophagus pierces the diaphragmatic hiatus at T10 to join the gastric cardia at the gastroesophageal junction.',
    sourceReference: formatRelationshipCitation('esophagus'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_stomach_duodenum',
    sourceConceptId: 'FMA7148', // stomach
    targetConceptId: 'FMA7206', // duodenum
    type: 'connected_to',
    category: 'structural',
    explanation: 'The gastric pyloric canal empties through the muscular pyloric sphincter into the superior (first) part of the duodenum.',
    sourceReference: formatRelationshipCitation('stomach'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_liver_gallbladder_supply',
    sourceConceptId: 'FMA7197', // liver
    targetConceptId: 'FMA7202', // gallbladder
    type: 'supplies',
    category: 'functional',
    explanation: 'Hepatocytes continually synthesize and secrete bile, supplying it through the biliary ductal pathway to the gallbladder for storage and concentration.',
    sourceReference: formatRelationshipCitation('gallbladder'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_gallbladder_duodenum',
    sourceConceptId: 'FMA7202', // gallbladder
    targetConceptId: 'FMA7206', // duodenum
    type: 'connected_to',
    category: 'structural',
    explanation: 'The gallbladder empties concentrated bile through the cystic duct and common bile duct into the descending (second) part of the duodenum.',
    sourceReference: formatRelationshipCitation('gallbladder'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_pancreas_duodenum',
    sourceConceptId: 'FMA7198', // pancreas
    targetConceptId: 'FMA7206', // duodenum
    type: 'connected_to',
    category: 'structural',
    explanation: 'The main pancreatic duct joins the common bile duct at the hepatopancreatic ampulla (ampulla of Vater) to release digestive enzymes into the duodenum.',
    sourceReference: formatRelationshipCitation('pancreas'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_liver_stomach_loc',
    sourceConceptId: 'FMA7197', // liver
    targetConceptId: 'FMA7148', // stomach
    type: 'located_near',
    category: 'spatial',
    explanation: 'The visceral surface of the left hepatic lobe features the gastric impression, which contacts the lesser curvature and anterior wall of the stomach.',
    sourceReference: formatRelationshipCitation('liver_anatomy'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_liver_diaphragm_loc',
    sourceConceptId: 'FMA7197', // liver
    targetConceptId: 'FMA13295', // diaphragm
    type: 'located_near',
    category: 'spatial',
    explanation: 'The superior convex diaphragmatic surface of the liver conforms precisely to the inferior concavity of the right hemidiaphragm.',
    sourceReference: formatRelationshipCitation('liver_anatomy'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_pancreas_stomach_loc',
    sourceConceptId: 'FMA7198', // pancreas
    targetConceptId: 'FMA7148', // stomach
    type: 'located_near',
    category: 'spatial',
    explanation: 'The body and neck of the pancreas form a major portion of the stomach bed across the posterior wall of the omental bursa (lesser sac).',
    sourceReference: formatRelationshipCitation('pancreas'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_spleen_stomach_loc',
    sourceConceptId: 'FMA7196', // spleen
    targetConceptId: 'FMA7148', // stomach
    type: 'located_near',
    category: 'spatial',
    explanation: 'The gastrosplenic ligament bridges the greater curvature of the gastric fundus directly to the visceral hilum of the spleen.',
    sourceReference: formatRelationshipCitation('spleen'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_spleen_pancreas_loc',
    sourceConceptId: 'FMA7196', // spleen
    targetConceptId: 'FMA7198', // pancreas
    type: 'located_near',
    category: 'spatial',
    explanation: 'The tail of the pancreas extends into the splenorenal ligament to make anatomical contact with the visceral hilum of the spleen.',
    sourceReference: formatRelationshipCitation('spleen'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },

  // =========================================================================
  // RENAL & URINARY SYSTEM (Kidneys, Bladder)
  // =========================================================================
  {
    id: 'rel_right_kidney_bladder_drain',
    sourceConceptId: 'FMA7204', // right kidney
    targetConceptId: 'FMA15900', // urinary bladder
    type: 'drains_into',
    category: 'functional',
    explanation: 'The right renal pelvis funnels filtered urine through the right ureter into the posteroinferior base of the urinary bladder at the ureteric orifice for storage.',
    sourceReference: formatRelationshipCitation('kidneys'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_left_kidney_bladder_drain',
    sourceConceptId: 'FMA7205', // left kidney
    targetConceptId: 'FMA15900', // urinary bladder
    type: 'drains_into',
    category: 'functional',
    explanation: 'The left renal pelvis empties urine through peristaltic contractions of the left ureter into the trigone of the urinary bladder for storage.',
    sourceReference: formatRelationshipCitation('kidneys'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_right_kidney_liver_loc',
    sourceConceptId: 'FMA7204', // right kidney
    targetConceptId: 'FMA7197', // liver
    type: 'located_near',
    category: 'spatial',
    explanation: 'The superior pole and anterior upper quadrant of the right kidney form the deep renal impression on the visceral surface of the liver.',
    sourceReference: formatRelationshipCitation('liver_anatomy'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_left_kidney_spleen_loc',
    sourceConceptId: 'FMA7205', // left kidney
    targetConceptId: 'FMA7196', // spleen
    type: 'located_near',
    category: 'spatial',
    explanation: 'The upper pole and superolateral border of the left kidney contact the posteromedial renal impression of the spleen.',
    sourceReference: formatRelationshipCitation('spleen'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_kidneys_bilateral_func',
    sourceConceptId: 'FMA7204', // right kidney
    targetConceptId: 'FMA7205', // left kidney
    type: 'functionally_related',
    category: 'functional',
    explanation: 'The paired kidneys maintain homeostatic fluid balance, plasma osmolality, electrolyte concentration, and arterial blood pressure via renin secretion.',
    sourceReference: formatRelationshipCitation('renal_physiology'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },

  // =========================================================================
  // CENTRAL NERVOUS SYSTEM (Brain, Cerebellum, Brainstem, Spinal Cord, Skull)
  // =========================================================================
  {
    id: 'rel_cerebellum_brain_part',
    sourceConceptId: 'FMA67944', // cerebellum
    targetConceptId: 'FMA50801', // brain
    type: 'part_of',
    category: 'structural',
    explanation: 'The cerebellum is the metencephalic division of the brain located in the posterior cranial fossa, coordinating motor timing and balance.',
    sourceReference: formatRelationshipCitation('cerebellum'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_brainstem_brain_part',
    sourceConceptId: 'FMA79876', // brainstem
    targetConceptId: 'FMA50801', // brain
    type: 'part_of',
    category: 'structural',
    explanation: 'The brainstem comprises the midbrain, pons, and medulla oblongata, functioning as the vital conduit and autonomic regulatory hub of the brain.',
    sourceReference: formatRelationshipCitation('brainstem'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_brain_spinal_cord',
    sourceConceptId: 'FMA50801', // brain
    targetConceptId: 'FMA7647', // spinal cord
    type: 'connected_to',
    category: 'structural',
    explanation: 'The medulla oblongata of the brainstem transitions continuously into the cervical spinal cord at the inferior margin of the foramen magnum.',
    sourceReference: formatRelationshipCitation('spinal_cord'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_skull_brain_surround',
    sourceConceptId: 'FMA46565', // skull
    targetConceptId: 'FMA50801', // brain
    type: 'surrounds',
    category: 'spatial',
    explanation: 'The neurocranium forms a rigid osseous chamber encasing the cerebral hemispheres, cerebellum, and brainstem to provide physical impact protection.',
    sourceReference: formatRelationshipCitation('skull'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_vert_spinal_cord_surround',
    sourceConceptId: 'FMA13478', // vertebral column
    targetConceptId: 'FMA7647', // spinal cord
    type: 'surrounds',
    category: 'spatial',
    explanation: 'The continuous longitudinal vertebral canal formed by the vertebral arches encloses and protects the spinal cord from C1 to the conus medullaris (L1/L2).',
    sourceReference: formatRelationshipCitation('vertebral_canal'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_skull_vertebral_art',
    sourceConceptId: 'FMA46565', // skull
    targetConceptId: 'FMA13478', // vertebral column
    type: 'connected_to',
    category: 'structural',
    explanation: 'The occipital condyles on the skull base articulate with the superior articular facets of the C1 atlas at the synovial atlanto-occipital joints.',
    sourceReference: formatRelationshipCitation('cervical_vertebrae'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },

  // =========================================================================
  // MUSCULOSKELETAL & APPENDICULAR LEVERAGE (Vertebral Column, Pelvis, Limbs)
  // =========================================================================
  {
    id: 'rel_vert_right_femur',
    sourceConceptId: 'FMA13478', // vertebral column
    targetConceptId: 'FMA24474', // right femur
    type: 'functionally_related',
    category: 'functional',
    explanation: 'The vertebral column transmits axial body weight and mechanical loads indirectly to the right femur via the pelvic ring and right acetabulofemoral hip joint during upright posture and locomotion.',
    sourceReference: formatRelationshipCitation('sacroiliac_joint'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_vert_left_femur',
    sourceConceptId: 'FMA13478', // vertebral column
    targetConceptId: 'FMA24475', // left femur
    type: 'functionally_related',
    category: 'functional',
    explanation: 'The vertebral column transmits axial torso weight and ground reaction forces indirectly to the left femur via the pelvic ring and left hip joint during bipedal gait and standing.',
    sourceReference: formatRelationshipCitation('sacroiliac_joint'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_femurs_bilateral_func',
    sourceConceptId: 'FMA24474', // right femur
    targetConceptId: 'FMA24475', // left femur
    type: 'functionally_related',
    category: 'functional',
    explanation: 'The bilateral femurs function as the primary load-bearing biomechanical struts of the lower extremities during bipedal standing and locomotion.',
    sourceReference: formatRelationshipCitation('femur'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  },
  {
    id: 'rel_humeri_bilateral_func',
    sourceConceptId: 'FMA23130', // right humerus
    targetConceptId: 'FMA23131', // left humerus
    type: 'functionally_related',
    category: 'functional',
    explanation: 'The bilateral humeri provide the skeletal levers of the upper arms, articulating at the glenohumeral and elbow joints for upper extremity reach and manipulation.',
    sourceReference: formatRelationshipCitation('humerus'),
    sourceKind: 'verified_educational_source',
    confidence: 'verified'
  }
];

/**
 * Fast lookup map indexed by concept ID for bidirectional relationship discovery.
 */
const RELATIONSHIPS_BY_CONCEPT = new Map<string, AnatomicalRelationship[]>();

// Populate bidirectional lookup index
VERIFIED_RELATIONSHIPS.forEach(rel => {
  // Source indexing
  const srcList = RELATIONSHIPS_BY_CONCEPT.get(rel.sourceConceptId) ?? [];
  srcList.push(rel);
  RELATIONSHIPS_BY_CONCEPT.set(rel.sourceConceptId, srcList);

  // Target indexing
  const tgtList = RELATIONSHIPS_BY_CONCEPT.get(rel.targetConceptId) ?? [];
  tgtList.push(rel);
  RELATIONSHIPS_BY_CONCEPT.set(rel.targetConceptId, tgtList);
});

/**
 * Returns all verified relationships connected to a given concept ID.
 */
export function getRelationshipsForConcept(conceptId: string): AnatomicalRelationship[] {
  return RELATIONSHIPS_BY_CONCEPT.get(conceptId) ?? [];
}

/**
 * Checks whether verified relationships exist for a given concept ID.
 */
export function hasRelationshipsForConcept(conceptId: string): boolean {
  return (RELATIONSHIPS_BY_CONCEPT.get(conceptId)?.length ?? 0) > 0;
}

/**
 * Generates an ego-network graph around the central concept up to a given depth (1 or 2).
 * Strictly guards against duplicates and cyclic traversal.
 */
export function buildRelationshipGraph(
  centerConceptId: string,
  conceptNameResolver: (id: string) => string | undefined,
  conceptSystemResolver: (id: string) => SystemId | undefined,
  maxDepth = 1
): RelationshipGraphData {
  const directRels = getRelationshipsForConcept(centerConceptId);
  const totalAvailable = directRels.length;

  if (totalAvailable === 0) {
    return {
      nodes: [
        {
          id: centerConceptId,
          name: conceptNameResolver(centerConceptId) ?? centerConceptId,
          system: conceptSystemResolver(centerConceptId),
          depth: 0,
          isCenter: true,
          relationshipCount: 0
        }
      ],
      edges: [],
      centerConceptId,
      depth: maxDepth,
      totalAvailable: 0
    };
  }

  const visitedNodeIds = new Set<string>([centerConceptId]);
  const nodeMap = new Map<string, RelationshipGraphNode>();
  const edgeMap = new Map<string, RelationshipGraphEdge>();

  // Center Node
  nodeMap.set(centerConceptId, {
    id: centerConceptId,
    name: conceptNameResolver(centerConceptId) ?? centerConceptId,
    system: conceptSystemResolver(centerConceptId),
    depth: 0,
    isCenter: true,
    relationshipCount: totalAvailable
  });

  // Level 1 Traversal
  directRels.forEach(rel => {
    const isOutgoing = rel.sourceConceptId === centerConceptId;
    const neighborId = isOutgoing ? rel.targetConceptId : rel.sourceConceptId;

    if (!nodeMap.has(neighborId)) {
      visitedNodeIds.add(neighborId);
      nodeMap.set(neighborId, {
        id: neighborId,
        name: conceptNameResolver(neighborId) ?? neighborId,
        system: conceptSystemResolver(neighborId),
        depth: 1,
        isCenter: false,
        relationshipCount: getRelationshipsForConcept(neighborId).length
      });
    }

    if (!edgeMap.has(rel.id)) {
      edgeMap.set(rel.id, {
        id: rel.id,
        source: rel.sourceConceptId,
        target: rel.targetConceptId,
        type: rel.type,
        category: rel.category,
        explanation: rel.explanation,
        sourceReference: rel.sourceReference,
        isOutgoing
      });
    }
  });

  // Optional Level 2 Traversal if requested
  if (maxDepth >= 2) {
    const level1Neighbors = Array.from(visitedNodeIds).filter(id => id !== centerConceptId);

    level1Neighbors.forEach(l1Id => {
      const secondaryRels = getRelationshipsForConcept(l1Id);

      secondaryRels.forEach(rel => {
        const isOutgoingFromL1 = rel.sourceConceptId === l1Id;
        const l2Id = isOutgoingFromL1 ? rel.targetConceptId : rel.sourceConceptId;

        if (!nodeMap.has(l2Id) && nodeMap.size < 24) {
          visitedNodeIds.add(l2Id);
          nodeMap.set(l2Id, {
            id: l2Id,
            name: conceptNameResolver(l2Id) ?? l2Id,
            system: conceptSystemResolver(l2Id),
            depth: 2,
            isCenter: false,
            relationshipCount: getRelationshipsForConcept(l2Id).length
          });
        }

        // Add edge if both endpoints are in the nodeMap
        if (nodeMap.has(rel.sourceConceptId) && nodeMap.has(rel.targetConceptId) && !edgeMap.has(rel.id)) {
          edgeMap.set(rel.id, {
            id: rel.id,
            source: rel.sourceConceptId,
            target: rel.targetConceptId,
            type: rel.type,
            category: rel.category,
            explanation: rel.explanation,
            sourceReference: rel.sourceReference,
            isOutgoing: rel.sourceConceptId === centerConceptId
          });
        }
      });
    });
  }

  return {
    nodes: Array.from(nodeMap.values()),
    edges: Array.from(edgeMap.values()),
    centerConceptId,
    depth: maxDepth,
    totalAvailable
  };
}

export interface QuickHubConcept {
  id: string;
  name: string;
}

export interface QuickHubGroup {
  id: string;
  name: string;
  isBilateralGroup?: boolean;
  subConcepts?: QuickHubConcept[];
}

export const RELATIONSHIP_QUICK_HUBS: QuickHubGroup[] = [
  { id: 'FMA7088', name: 'Heart' },
  { id: 'FMA3736', name: 'Ascending Aorta' },
  { id: 'FMA50801', name: 'Brain' },
  { id: 'FMA7148', name: 'Stomach' },
  { id: 'FMA7197', name: 'Liver' },
  {
    id: 'FMA7204',
    name: 'Kidneys',
    isBilateralGroup: true,
    subConcepts: [
      { id: 'FMA7204', name: 'Right Kidney' },
      { id: 'FMA7205', name: 'Left Kidney' }
    ]
  },
  {
    id: 'FMA7309',
    name: 'Lungs',
    isBilateralGroup: true,
    subConcepts: [
      { id: 'FMA7309', name: 'Right Lung' },
      { id: 'FMA7310', name: 'Left Lung' }
    ]
  },
  { id: 'FMA7394', name: 'Trachea' }
];
