import type { View } from './anatomy';

export type GuideDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface GuidedStepSource {
  title: string;
  url: string;
  authoritativeBody?: string;
}

export interface GuidedStep {
  id: string;
  title: string;
  conceptId: string; // Must match a concept in atlas.json
  explanation: string; // Concise, focused educational explanation for this step
  learningObjectives?: string[];
  cameraView?: View;
  sources?: GuidedStepSource[];
}

export interface GuidedExploration {
  id: string;
  title: string;
  description: string;
  difficulty: GuideDifficulty;
  category: string;
  estimatedMinutes: number;
  steps: GuidedStep[];
}

export const GUIDED_EXPLORATIONS: GuidedExploration[] = [
  {
    id: 'cardiovascular-core',
    title: 'Cardiovascular System Essentials',
    description: 'Explore the central muscular pump and its primary thoracic anatomical relationships.',
    difficulty: 'Beginner',
    category: 'Cardiology & Thorax',
    estimatedMinutes: 4,
    steps: [
      {
        id: 'cardio-step-1',
        title: 'The Central Muscular Pump',
        conceptId: 'FMA7088', // Heart (83 parts in atlas)
        explanation:
          'The heart is a four-chambered muscular pump located in the middle mediastinum that drives systemic and pulmonary circulation to supply oxygenated blood and nutrients to all bodily tissues.',
        learningObjectives: [
          'Locate the middle mediastinal position of the heart',
          'Understand dual-circuit circulation (pulmonary vs systemic)',
          'Identify apical orientation pointing anteroinferiorly to the left'
        ],
        cameraView: 'front',
        sources: [
          {
            title: 'StatPearls: Anatomy, Thorax, Heart',
            url: 'https://www.ncbi.nlm.nih.gov/books/NBK470256/',
            authoritativeBody: 'National Center for Biotechnology Information (NCBI)'
          }
        ]
      },
      {
        id: 'cardio-step-2',
        title: 'Thoracic Base & Pericardial Support',
        conceptId: 'FMA13295', // Diaphragm (1 part in atlas)
        explanation:
          'The dome-shaped musculotendinous diaphragm forms the inferior anatomical boundary of the thoracic cavity. The fibrous pericardium surrounding the heart is firmly anchored to the central tendon of the diaphragm.',
        learningObjectives: [
          'Recognize pericardial anchoring to the central tendon',
          'Understand diaphragmatic excursion during respiration and its effect on cardiac position',
          'Identify thoracic and abdominal cavity partitioning'
        ],
        cameraView: 'front',
        sources: [
          {
            title: 'StatPearls: Anatomy, Abdomen and Pelvis, Diaphragm',
            url: 'https://www.ncbi.nlm.nih.gov/books/NBK537042/',
            authoritativeBody: 'National Center for Biotechnology Information (NCBI)'
          }
        ]
      },
      {
        id: 'cardio-step-3',
        title: 'Pulmonary Circuit Partner',
        conceptId: 'FMA7310', // Left lung (124 parts in atlas)
        explanation:
          'The left lung features a prominent cardiac notch and lingula along its anterior border, directly accommodating the apex of the heart within the left hemithorax and partnering in gas exchange.',
        learningObjectives: [
          'Observe the cardiac notch accommodating the ventricular apex',
          'Relate right-ventricular pulmonary outflow to left-lung alveolar gas exchange',
          'Identify pulmonary venous return to the left atrium'
        ],
        cameraView: 'three-quarter',
        sources: [
          {
            title: 'StatPearls: Anatomy, Thorax, Lungs',
            url: 'https://www.ncbi.nlm.nih.gov/books/NBK470197/',
            authoritativeBody: 'National Center for Biotechnology Information (NCBI)'
          }
        ]
      }
    ]
  },
  {
    id: 'skeletal-framework',
    title: 'Core Skeletal Framework',
    description: 'Navigate key axial and appendicular osseous structures that provide structural protection and locomotion.',
    difficulty: 'Beginner',
    category: 'Osteology & Biomechanics',
    estimatedMinutes: 5,
    steps: [
      {
        id: 'skel-step-1',
        title: 'The Cranial Vault & Facial Skeleton',
        conceptId: 'FMA46565', // Skull (43 parts in atlas)
        explanation:
          'The human skull comprises 22 bones joined by immovable sutures (except the mandible), forming the neurocranium to protect the brain and the viscerocranium to support the eyes, airway, and mastication.',
        learningObjectives: [
          'Distinguish neurocranial brain protection from facial skeleton viscerocranium',
          'Identify cranial cavity boundaries and cranial fossae',
          'Observe suture junctions between major cranial plates'
        ],
        cameraView: 'three-quarter',
        sources: [
          {
            title: 'StatPearls: Anatomy, Head and Neck, Skull',
            url: 'https://www.ncbi.nlm.nih.gov/books/NBK538180/',
            authoritativeBody: 'National Center for Biotechnology Information (NCBI)'
          }
        ]
      },
      {
        id: 'skel-step-2',
        title: 'The Axial Spinal Column',
        conceptId: 'FMA13478', // Vertebral column (48 parts in atlas)
        explanation:
          'Composed of 33 stacked vertebrae, the vertebral column provides the primary longitudinal structural axis for the body, supports head and trunk weight, and encloses the spinal cord within the vertebral canal.',
        learningObjectives: [
          'Examine cervical, thoracic, and lumbar spinal curvatures',
          'Understand load transmission down the axial skeleton to the pelvis',
          'Identify neural arch protection around the spinal cord'
        ],
        cameraView: 'side',
        sources: [
          {
            title: 'StatPearls: Anatomy, Back, Vertebral Column',
            url: 'https://www.ncbi.nlm.nih.gov/books/NBK525969/',
            authoritativeBody: 'National Center for Biotechnology Information (NCBI)'
          }
        ]
      },
      {
        id: 'skel-step-3',
        title: 'Upper Limb Brachial Lever',
        conceptId: 'FMA23130', // Right humerus (1 part in atlas)
        explanation:
          'The humerus is the single long bone of the upper arm, articulating proximally with the shallow scapular glenoid fossa and distally at the elbow with the radius and ulna to position the hand in 3D space.',
        learningObjectives: [
          'Identify hemispherical humeral head articulating with the scapula',
          'Understand wide range-of-motion multi-axial biomechanics',
          'Examine distal condyles forming the hinge elbow joint'
        ],
        cameraView: 'front',
        sources: [
          {
            title: 'StatPearls: Anatomy, Shoulder and Upper Limb, Humerus',
            url: 'https://www.ncbi.nlm.nih.gov/books/NBK534821/',
            authoritativeBody: 'National Center for Biotechnology Information (NCBI)'
          }
        ]
      },
      {
        id: 'skel-step-4',
        title: 'Primary Weight-Bearing Lever',
        conceptId: 'FMA24474', // Right femur (1 part in atlas)
        explanation:
          'The femur is the longest, heaviest, and strongest bone in the human body, engineered to sustain massive bending moments and transmit torso weight from the pelvic acetabulum down to the knee during bipedal gait.',
        learningObjectives: [
          'Observe the femoral head, neck-shaft angle, and greater trochanter',
          'Understand load absorption during standing, running, and jumping',
          'Examine distal bicondylar articulation with the tibial plateau'
        ],
        cameraView: 'front',
        sources: [
          {
            title: 'StatPearls: Anatomy, Bony Pelvis and Lower Limb, Femur',
            url: 'https://www.ncbi.nlm.nih.gov/books/NBK532982/',
            authoritativeBody: 'National Center for Biotechnology Information (NCBI)'
          }
        ]
      }
    ]
  },
  {
    id: 'respiratory-pathway',
    title: 'Respiratory & Gas Exchange Pathway',
    description: 'Trace the ventilatory conduit from the central conducting windpipe into the bilateral alveolar lobes and primary breathing motor.',
    difficulty: 'Intermediate',
    category: 'Pulmonology',
    estimatedMinutes: 5,
    steps: [
      {
        id: 'resp-step-1',
        title: 'The Primary Conducting Windpipe',
        conceptId: 'FMA7394', // Trachea (1 part in atlas)
        explanation:
          'The trachea is a midline fibrocartilaginous tube reinforced by 16–20 C-shaped hyaline cartilage rings that prevents airway collapse under negative inspiratory pressure, conducting air between larynx and carina.',
        learningObjectives: [
          'Recognize C-shaped cartilage rings keeping the airway patent',
          'Understand posterior trachealis muscle role during deglutition',
          'Identify bifurcation at the carina into primary bronchi'
        ],
        cameraView: 'front',
        sources: [
          {
            title: 'StatPearls: Anatomy, Thorax, Trachea',
            url: 'https://www.ncbi.nlm.nih.gov/books/NBK448074/',
            authoritativeBody: 'National Center for Biotechnology Information (NCBI)'
          }
        ]
      },
      {
        id: 'resp-step-2',
        title: 'The Trilobed Right Lung',
        conceptId: 'FMA7309', // Right lung (156 parts in atlas)
        explanation:
          'Larger and heavier than the left lung, the right lung is partitioned by horizontal and oblique fissures into three distinct lobes (superior, middle, inferior) maximizing alveolar surface area for blood oxygenation.',
        learningObjectives: [
          'Identify superior, middle, and inferior right pulmonary lobes',
          'Trace horizontal and oblique fissure planes',
          'Compare right lung volume and bronchopulmonary segments'
        ],
        cameraView: 'front',
        sources: [
          {
            title: 'StatPearls: Anatomy, Thorax, Lungs',
            url: 'https://www.ncbi.nlm.nih.gov/books/NBK470197/',
            authoritativeBody: 'National Center for Biotechnology Information (NCBI)'
          }
        ]
      },
      {
        id: 'resp-step-3',
        title: 'The Bilobed Left Lung',
        conceptId: 'FMA7310', // Left lung (124 parts in atlas)
        explanation:
          'Composed of superior and inferior lobes separated by an oblique fissure, the left lung features a pronounced cardiac impression and lingula where it conforms around the pericardial sac.',
        learningObjectives: [
          'Contrast 2-lobed left architecture with 3-lobed right architecture',
          'Identify the lingula as the embryological homologue of the right middle lobe',
          'Observe mediastinal impressions created by the heart and aorta'
        ],
        cameraView: 'three-quarter',
        sources: [
          {
            title: 'StatPearls: Anatomy, Thorax, Lungs',
            url: 'https://www.ncbi.nlm.nih.gov/books/NBK470197/',
            authoritativeBody: 'National Center for Biotechnology Information (NCBI)'
          }
        ]
      },
      {
        id: 'resp-step-4',
        title: 'The Primary Motor of Respiration',
        conceptId: 'FMA13295', // Diaphragm (1 part in atlas)
        explanation:
          'Inspiratory contraction pulls the central tendon inferiorly, flattening the diaphragmatic dome, increasing thoracic vertical volume, and dropping intrathoracic pressure to pull air through the conductive airways.',
        learningObjectives: [
          'Understand negative-pressure ventilation mechanics',
          'Identify bilateral phrenic nerve motor innervation (C3, C4, C5)',
          'Distinguish active inspiration from passive elastic expiration'
        ],
        cameraView: 'front',
        sources: [
          {
            title: 'StatPearls: Anatomy, Abdomen and Pelvis, Diaphragm',
            url: 'https://www.ncbi.nlm.nih.gov/books/NBK537042/',
            authoritativeBody: 'National Center for Biotechnology Information (NCBI)'
          }
        ]
      }
    ]
  }
];

export function getGuideById(id: string): GuidedExploration | undefined {
  return GUIDED_EXPLORATIONS.find(g => g.id === id);
}

export function validateGuideStepConcept(conceptId: string, atlasConceptIds: Set<string>): boolean {
  return atlasConceptIds.has(conceptId);
}
