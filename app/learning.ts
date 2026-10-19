import type { SystemId, View, Atlas, Concept } from './anatomy';
import { getCitationSource } from './citations.ts';

export type QuestionType = 'identification' | 'multiple-choice' | 'true-false';
export type QuestionDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface LearningQuestion {
  id: string;
  type: QuestionType;
  title: string;
  system: SystemId;
  difficulty: QuestionDifficulty;
  targetConceptId?: string; // Required for 'identification'
  targetConceptName?: string;
  options?: string[]; // Required for 'multiple-choice' & 'true-false'
  correctAnswer: string; // Option text for MC/TF, or targetConceptId for identification
  explanation: string;
  hint: string;
  cameraView?: View;
  sources?: { title: string; url: string; authoritativeBody?: string }[];
}

export interface LearningSessionConfig {
  category: 'all' | 'skeletal' | 'cardiopulmonary' | 'visceral' | 'neuro';
  difficulty: 'all' | 'Beginner' | 'Intermediate';
  questionCount: number;
}

export interface UserAnswerRecord {
  questionId: string;
  questionType: QuestionType;
  userSelection: string;
  isCorrect: boolean;
  attemptsUsed: number;
  hintUsed: boolean;
  targetConceptId?: string;
}

export interface LearningSessionState {
  questions: LearningQuestion[];
  currentIndex: number;
  answers: Record<string, UserAnswerRecord>;
  isCompleted: boolean;
  score: number;
}

export const QUESTION_BANK: LearningQuestion[] = [
  // 1. Identification: Heart
  {
    id: 'q-id-heart',
    type: 'identification',
    title: 'Locate and select the Heart on the 3D model',
    system: 'cardiac',
    difficulty: 'Beginner',
    targetConceptId: 'FMA7088',
    targetConceptName: 'Heart',
    correctAnswer: 'FMA7088',
    cameraView: 'front',
    hint: 'Located in the middle mediastinum of the thoracic cavity, posterior to the sternum with its apex pointing anteroinferiorly to the left.',
    explanation:
      'The heart is a four-chambered muscular pump located in the middle mediastinum that drives systemic circulation and propels blood through the pulmonary circuit for gas exchange.',
    sources: [getCitationSource('heart')]
  },

  // 2. Multiple Choice: Heart Ventricular Wall
  {
    id: 'q-mc-heart-wall',
    type: 'multiple-choice',
    title: 'Which chamber of the heart possesses the thickest myocardial wall?',
    system: 'cardiac',
    difficulty: 'Intermediate',
    options: ['Right atrium', 'Right ventricle', 'Left atrium', 'Left ventricle'],
    correctAnswer: 'Left ventricle',
    hint: 'This chamber generates high hydrostatic pressures to propel blood through the aortic valve into the systemic arterial circuit.',
    explanation:
      'The left ventricle features the thickest myocardial wall (roughly 3 times thicker than the right ventricle) to overcome systemic vascular resistance and pump blood throughout the entire body.',
    sources: [getCitationSource('heart')]
  },

  // 3. True/False: Pericardium Anchoring
  {
    id: 'q-tf-pericardium',
    type: 'true-false',
    title: 'The fibrous pericardium enclosing the heart is firmly anchored to the central tendon of the diaphragm.',
    system: 'cardiac',
    difficulty: 'Beginner',
    options: ['True', 'False'],
    correctAnswer: 'True',
    hint: 'This anatomical anchor secures the heart position within the thorax during diaphragmatic respiration.',
    explanation:
      'True: The fibrous pericardium is fused inferiorly with the central tendon of the diaphragm, stabilizing cardiac position during respiratory motion and postural shifts.',
    sources: [getCitationSource('pericardium')]
  },

  // 4. Identification: Skull
  {
    id: 'q-id-skull',
    type: 'identification',
    title: 'Locate and select the Skull (Cranium & Facial Skeleton) on the 3D model',
    system: 'skeletal',
    difficulty: 'Beginner',
    targetConceptId: 'FMA46565',
    targetConceptName: 'Skull',
    correctAnswer: 'FMA46565',
    cameraView: 'three-quarter',
    hint: 'The superior-most osseous structure of the axial skeleton, enclosing the brain and supporting the facial apparatus.',
    explanation:
      'The human skull comprises 22 bones joined by immovable sutures (except the mandible), forming the neurocranium to shield the brain and the viscerocranium for facial structure and mastication.',
    sources: [getCitationSource('skull')]
  },

  // 5. Multiple Choice: Longest Bone
  {
    id: 'q-mc-femur-fact',
    type: 'multiple-choice',
    title: 'Which bone is the longest, heaviest, and strongest in the human body?',
    system: 'skeletal',
    difficulty: 'Beginner',
    options: ['Humerus', 'Femur', 'Tibia', 'Fibula'],
    correctAnswer: 'Femur',
    hint: 'This bone constitutes the skeletal framework of the thigh, articulating with the pelvic acetabulum.',
    explanation:
      'The femur is the longest, heaviest, and strongest bone in the human body, engineered to absorb massive kinetic loads and transmit torso weight from the pelvic girdle to the tibia during bipedal locomotion.',
    sources: [getCitationSource('femur')]
  },

  // 6. Identification: Right Femur
  {
    id: 'q-id-femur',
    type: 'identification',
    title: 'Locate and select the Right Femur on the 3D model',
    system: 'skeletal',
    difficulty: 'Beginner',
    targetConceptId: 'FMA24474',
    targetConceptName: 'Right femur',
    correctAnswer: 'FMA24474',
    cameraView: 'front',
    hint: 'The major long bone of the right lower extremity, situated between the right hip joint and the right knee joint.',
    explanation:
      'The right femur articulates proximally with the acetabulum of the pelvis at the multi-axial hip joint and distally with the patella and tibia at the bicondylar knee joint.',
    sources: [getCitationSource('femur')]
  },

  // 7. Identification: Vertebral Column
  {
    id: 'q-id-vertebral-column',
    type: 'identification',
    title: 'Locate and select the Vertebral Column on the 3D model',
    system: 'skeletal',
    difficulty: 'Beginner',
    targetConceptId: 'FMA13478',
    targetConceptName: 'Vertebral column',
    correctAnswer: 'FMA13478',
    cameraView: 'side',
    hint: 'The segmented posterior axial osseous pillar extending from the base of the skull down to the pelvis.',
    explanation:
      'Composed of 33 stacked vertebrae (cervical, thoracic, lumbar, sacral, coccygeal), the vertebral column provides axial weight-bearing flexibility while enclosing and protecting the spinal cord.',
    sources: [getCitationSource('vertebral_column')]
  },

  // 8. Identification: Diaphragm
  {
    id: 'q-id-diaphragm',
    type: 'identification',
    title: 'Locate and select the Diaphragm on the 3D model',
    system: 'muscular',
    difficulty: 'Intermediate',
    targetConceptId: 'FMA13295',
    targetConceptName: 'Diaphragm',
    correctAnswer: 'FMA13295',
    cameraView: 'front',
    hint: 'A large dome-shaped musculotendinous partition forming the floor of the thoracic cavity and the roof of the abdomen.',
    explanation:
      'The diaphragm is the primary motor of inspiration. Its contraction draws the central tendon inferiorly, increasing thoracic vertical volume and creating negative intrathoracic pressure that pulls air inward.',
    sources: [getCitationSource('diaphragm')]
  },

  // 9. Multiple Choice: Phrenic Nerve
  {
    id: 'q-mc-diaphragm-nerve',
    type: 'multiple-choice',
    title: 'Which nerve provides exclusive motor innervation to the diaphragm?',
    system: 'muscular',
    difficulty: 'Intermediate',
    options: ['Vagus nerve', 'Phrenic nerve', 'Intercostal nerve', 'Accessory nerve'],
    correctAnswer: 'Phrenic nerve',
    hint: 'This nerve arises from cervical spinal nerve roots C3, C4, and C5.',
    explanation:
      'The bilateral phrenic nerves (originating from anterior rami C3, C4, and C5) supply the sole motor innervation to the diaphragm as well as sensory innervation to its central tendon.',
    sources: [getCitationSource('diaphragm')]
  },

  // 10. Identification: Trachea
  {
    id: 'q-id-trachea',
    type: 'identification',
    title: 'Locate and select the Trachea (Conducting Windpipe) on the 3D model',
    system: 'respiratory',
    difficulty: 'Beginner',
    targetConceptId: 'FMA7394',
    targetConceptName: 'Trachea',
    correctAnswer: 'FMA7394',
    cameraView: 'front',
    hint: 'A midline tubular conduit in the superior mediastinum descending anterior to the esophagus.',
    explanation:
      'The trachea is a flexible cartilaginous conduit reinforced by 16–20 C-shaped hyaline cartilage rings that conduct ambient air between the larynx and the main bronchi at the carina.',
    sources: [getCitationSource('trachea')]
  },

  // 11. Multiple Choice: Pulmonary Lobes
  {
    id: 'q-mc-lung-lobes',
    type: 'multiple-choice',
    title: 'How many anatomical lobes divide the right lung compared to the left lung?',
    system: 'respiratory',
    difficulty: 'Beginner',
    options: [
      'Right: 2 lobes, Left: 3 lobes',
      'Right: 3 lobes, Left: 2 lobes',
      'Right: 3 lobes, Left: 3 lobes',
      'Right: 2 lobes, Left: 2 lobes'
    ],
    correctAnswer: 'Right: 3 lobes, Left: 2 lobes',
    hint: 'The left lung has fewer lobes to accommodate the cardiac notch and impression created by the heart.',
    explanation:
      'The right lung is divided by horizontal and oblique fissures into 3 lobes (superior, middle, inferior), while the left lung is divided by a single oblique fissure into 2 lobes (superior and inferior).',
    sources: [getCitationSource('lungs')]
  },

  // 12. Identification: Left Lung
  {
    id: 'q-id-left-lung',
    type: 'identification',
    title: 'Locate and select the Left Lung on the 3D model',
    system: 'respiratory',
    difficulty: 'Beginner',
    targetConceptId: 'FMA7310',
    targetConceptName: 'Left lung',
    correctAnswer: 'FMA7310',
    cameraView: 'three-quarter',
    hint: 'Located in the left hemithorax, with a prominent cardiac impression accommodating the ventricular apex.',
    explanation:
      'The left lung occupies the left hemithorax. It features two lobes and the cardiac notch along its anterior border that directly conforms around the pericardial sac.',
    sources: [getCitationSource('lungs')]
  },

  // 13. Identification: Liver
  {
    id: 'q-id-liver',
    type: 'identification',
    title: 'Locate and select the Liver on the 3D model',
    system: 'digestive',
    difficulty: 'Beginner',
    targetConceptId: 'FMA7197',
    targetConceptName: 'Liver',
    correctAnswer: 'FMA7197',
    cameraView: 'front',
    hint: 'The largest solid internal organ, situated in the right upper quadrant directly beneath the diaphragm.',
    explanation:
      'The liver is the body’s principal metabolic factory, weighing ~1.5 kg and functioning in plasma protein synthesis, bile production, glycogen storage, lipid metabolism, and detoxification.',
    sources: [getCitationSource('liver_anatomy')]
  },

  // 14. Multiple Choice: Liver Dual Blood Supply
  {
    id: 'q-mc-liver-circulation',
    type: 'multiple-choice',
    title: 'Approximately what percentage of the resting blood flow to the liver is delivered via the portal vein?',
    system: 'digestive',
    difficulty: 'Intermediate',
    options: ['~25%', '~50%', '~75%', '~95%'],
    correctAnswer: '~75%',
    hint: 'The portal vein delivers nutrient-dense deoxygenated blood absorbed from the stomach, intestines, and spleen.',
    explanation:
      'The liver has a dual vascular supply: approximately 75% arrives via the portal vein (nutrient-rich venous blood from the intestines), while 25% arrives via the proper hepatic artery (oxygen-rich arterial blood).',
    sources: [getCitationSource('liver_physiology')]
  },

  // 15. Identification: Brain
  {
    id: 'q-id-brain',
    type: 'identification',
    title: 'Locate and select the Brain on the 3D model',
    system: 'nervous',
    difficulty: 'Beginner',
    targetConceptId: 'FMA50801',
    targetConceptName: 'Brain',
    correctAnswer: 'FMA50801',
    cameraView: 'three-quarter',
    hint: 'Enclosed securely inside the protective bony neurocranium.',
    explanation:
      'The brain encompasses the cerebrum, diencephalon, cerebellum, and brainstem, functioning as the chief integration center for sensory perception, voluntary motor initiation, and autonomic regulation.',
    sources: [getCitationSource('cerebral_cortex')]
  },

  // 16. Identification: Right Kidney
  {
    id: 'q-id-kidney',
    type: 'identification',
    title: 'Locate and select the Right Kidney on the 3D model',
    system: 'urinary',
    difficulty: 'Intermediate',
    targetConceptId: 'FMA7204',
    targetConceptName: 'Right kidney',
    correctAnswer: 'FMA7204',
    cameraView: 'front',
    hint: 'A retroperitoneal bean-shaped organ located along the posterior abdominal wall on the right side.',
    explanation:
      'The right kidney sits retroperitoneally at the T12–L3 vertebral levels, functioning to filter nitrogenous wastes, regulate extracellular fluid volume and blood pressure, and maintain electrolyte equilibrium.',
    sources: [getCitationSource('kidneys')]
  },

  // 17. Multiple Choice: Asymmetric Kidney Position
  {
    id: 'q-mc-kidney-position',
    type: 'multiple-choice',
    title: 'Why is the right kidney positioned slightly lower (more inferior) than the left kidney?',
    system: 'urinary',
    difficulty: 'Intermediate',
    options: [
      'Due to downward displacement by the massive right lobe of the liver',
      'Due to asymmetric displacement by the stomach',
      'Due to the descent of the splenic flexure',
      'Due to curvature of the abdominal aorta'
    ],
    correctAnswer: 'Due to downward displacement by the massive right lobe of the liver',
    hint: 'Consider the space occupied in the right hypochondrium by the largest solid internal organ.',
    explanation:
      'The right kidney lies approximately 1–2 cm lower than the left kidney because the large right lobe of the liver occupies the right hypochondrium immediately above it.',
    sources: [getCitationSource('kidneys')]
  },

  // 18. Identification: Stomach
  {
    id: 'q-id-stomach',
    type: 'identification',
    title: 'Locate and select the Stomach on the 3D model',
    system: 'digestive',
    difficulty: 'Beginner',
    targetConceptId: 'FMA7148',
    targetConceptName: 'Stomach',
    correctAnswer: 'FMA7148',
    cameraView: 'front',
    hint: 'A muscular J-shaped digestive reservoir in the left upper quadrant and epigastrium, inferior to the diaphragm.',
    explanation:
      'The stomach receives chewed bolus via the esophagus, secretes hydrochloric acid and pepsinogen for chemical digestion, and churns food into acidic chyme before pyloric passage to the duodenum.',
    sources: [getCitationSource('stomach')]
  }
];

export function filterQuestions(
  config: LearningSessionConfig,
  targetConceptId?: string
): LearningQuestion[] {
  let pool = [...QUESTION_BANK];

  if (config.category === 'skeletal') {
    pool = pool.filter(q => q.system === 'skeletal');
  } else if (config.category === 'cardiopulmonary') {
    pool = pool.filter(q => q.system === 'cardiac' || q.system === 'respiratory' || q.system === 'muscular');
  } else if (config.category === 'visceral') {
    pool = pool.filter(q => q.system === 'digestive' || q.system === 'urinary');
  } else if (config.category === 'neuro') {
    pool = pool.filter(q => q.system === 'nervous');
  }

  if (targetConceptId) {
    const directMatches = pool.filter(q => q.targetConceptId === targetConceptId);
    let filteredPool = config.difficulty !== 'all' ? pool.filter(q => q.difficulty === config.difficulty) : pool;
    const nonDirect = filteredPool.filter(q => q.targetConceptId !== targetConceptId);
    const shuffledOthers = [...nonDirect].sort(() => 0.5 - Math.random());
    const combined = [...directMatches, ...shuffledOthers];
    return combined.slice(0, Math.min(config.questionCount, combined.length));
  }

  if (config.difficulty !== 'all') {
    pool = pool.filter(q => q.difficulty === config.difficulty);
  }

  // Shuffle pool deterministically or pseudo-randomly
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(config.questionCount, shuffled.length));
}

/**
 * Resolves the question availability for a specific anatomical concept
 */
export function getConceptLearningInfo(conceptId: string): {
  hasDirectQuestion: boolean;
  directQuestionsCount: number;
} {
  const matches = QUESTION_BANK.filter(q => q.targetConceptId === conceptId);
  return {
    hasDirectQuestion: matches.length > 0,
    directQuestionsCount: matches.length
  };
}

/**
 * Checks whether a selected mesh part or concept ID matches the target concept ID
 */
export function isSelectionMatchingTarget(
  selectedPartId: string | null,
  chosenConceptId: string | null,
  targetConceptId: string,
  atlas: Atlas
): boolean {
  if (chosenConceptId && chosenConceptId === targetConceptId) return true;
  const targetConcept = atlas.concepts.find(c => c.id === targetConceptId);
  if (!targetConcept) return false;

  if (selectedPartId && targetConcept.elements.includes(selectedPartId)) {
    return true;
  }

  if (chosenConceptId) {
    const chosenConcept = atlas.concepts.find(c => c.id === chosenConceptId);
    if (chosenConcept && chosenConcept.elements.some(el => targetConcept.elements.includes(el))) {
      return true;
    }
  }

  return false;
}
