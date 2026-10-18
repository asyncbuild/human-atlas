import type { Concept, Part, SystemId } from './anatomy';

export interface AnatomicalSource {
  title: string;
  url: string;
  authoritativeBody?: string;
}

export interface RelatedConceptRef {
  conceptId: string;
  name: string;
  relationship: string;
}

export interface AnatomicalKnowledgeEntry {
  conceptId: string;
  canonicalName: string;
  anatomicalSystem: SystemId;
  overview: string;
  location?: string;
  anatomicalFeatures?: string[];
  function?: string;
  relatedStructures?: RelatedConceptRef[];
  clinicalNotes?: string;
  sources: AnatomicalSource[];
  verificationStatus: 'verified' | 'unverified' | 'draft';
}

export const KNOWLEDGE_BASE: Record<string, AnatomicalKnowledgeEntry> = {
  // 1. HEART (FMA7088)
  FMA7088: {
    conceptId: 'FMA7088',
    canonicalName: 'Heart',
    anatomicalSystem: 'cardiac',
    overview:
      'The heart is a four-chambered muscular organ functioning as the central pump of the cardiovascular system. It continuously drives systemic circulation to supply oxygen and nutrients to peripheral tissues while propelling deoxygenated blood through the pulmonary circuit for alveolar gas exchange.',
    location:
      'Middle mediastinum of the thoracic cavity, posterior to the sternum and anterior to the vertebral column (T5–T8 levels). Its base faces posterosuperiorly, while its apex points anteroinferiorly and to the left, resting upon the central tendon of the diaphragm.',
    anatomicalFeatures: [
      'Right atrium: Thin-walled chamber receiving systemic venous blood via the superior and inferior vena cava, and coronary venous blood via the coronary sinus.',
      'Right ventricle: Muscular chamber with prominent trabeculae carneae that pumps deoxygenated blood through the pulmonary semilunar valve into the pulmonary trunk.',
      'Left atrium: Forms the anatomical base of the heart; receives four oxygenated pulmonary veins from the bilateral lungs.',
      'Left ventricle: Thickest myocardial wall (~3x thickness of right ventricle); generates high systemic pressures to propel blood through the aortic valve into the ascending aorta.',
      'Atrioventricular valves: Tricuspid valve (right) and bicuspid/mitral valve (left), anchored by chordae tendineae to papillary muscles to prevent systolic regurgitation.',
      'Semilunar valves: Aortic and pulmonary valves composed of three fibrous cusps that prevent diastolic backflow.'
    ],
    function:
      'Rhythmic alternating contraction (systole) and relaxation (diastole) mediated by the intrinsic cardiac conduction system (sinoatrial node, atrioventricular node, bundle of His, bundle branches, and Purkinje fibers). Generates hydrostatic pressure gradients maintaining ~5 liters/minute of resting cardiac output.',
    relatedStructures: [
      { conceptId: 'FMA7309', name: 'Right lung', relationship: 'Adjacent organ within the right thoracic cavity' },
      { conceptId: 'FMA7310', name: 'Left lung', relationship: 'Cardiac notch of left lung accommodates the heart apex' },
      { conceptId: 'FMA13295', name: 'Diaphragm', relationship: 'Fibrous pericardium firmly anchors to the diaphragmatic central tendon' }
    ],
    clinicalNotes:
      'Coronary artery disease (CAD) arising from atherosclerotic plaque accumulation in the left anterior descending, circumflex, or right coronary arteries causes myocardial ischemia or acute myocardial infarction (AMI). Valvular stenosis or insufficiency produces characteristic auscultatory heart murmurs. Heart failure reflects ventricular dysfunction leading to systemic congestion or pulmonary edema.',
    sources: [
      {
        title: 'StatPearls: Anatomy, Thorax, Heart',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK470256/',
        authoritativeBody: 'National Center for Biotechnology Information (NCBI)'
      },
      {
        title: "Gray's Anatomy: The Anatomical Basis of Clinical Practice (42nd ed.)",
        url: 'https://www.elsevier.com/books/grays-anatomy/standring/978-0-7020-7705-0',
        authoritativeBody: 'Elsevier Health Sciences'
      }
    ],
    verificationStatus: 'verified'
  },

  // 2. BRAIN (FMA50801)
  FMA50801: {
    conceptId: 'FMA50801',
    canonicalName: 'Brain',
    anatomicalSystem: 'nervous',
    overview:
      'The brain is the principal organ of the central nervous system (CNS), containing approximately 86 billion neurons and billions of neuroglial supporting cells. It integrates incoming sensory input, coordinates voluntary and involuntary motor outputs, and sustains consciousness, memory, reasoning, and autonomic homeostasis.',
    location:
      'Cranial cavity of the neurocranium, enveloped by three protective meningeal membranes (dura mater, arachnoid mater, pia mater) and cushioned within circulating cerebrospinal fluid (CSF).',
    anatomicalFeatures: [
      'Cerebral hemispheres: Divided by the longitudinal cerebral fissure and connected by the corpus callosum; organized into frontal, parietal, temporal, occipital, and insular lobes.',
      'Cerebellar hemispheres: Positioned in the posterior cranial fossa; features high-density folia and deep cerebellar nuclei specialized in motor coordination and balance.',
      'Diencephalon: Encompasses the thalamus (sensory relay hub), hypothalamus (endocrine and autonomic regulator), and epithalamus.',
      'Brainstem: Consisting of midbrain, pons, and medulla oblongata; transmits ascending and descending fiber tracts and houses cranial nerve nuclei (III–XII) and vital respiratory/cardiovascular centers.',
      'Ventricular system: Interconnected series of CSF-filled chambers including lateral ventricles, third ventricle, cerebral aqueduct, and fourth ventricle.'
    ],
    function:
      'Processes complex sensory perception, generates voluntary motor commands via corticospinal and corticobulbar pathways, regulates autonomic physiological drives (hunger, thirst, sleep-wake cycles, cardiorespiratory drive), and supports higher cognitive faculties including language and executive function.',
    relatedStructures: [
      { conceptId: 'FMA7647', name: 'Spinal cord', relationship: 'Direct continuous extension through the foramen magnum' },
      { conceptId: 'FMA46565', name: 'Skull', relationship: 'Rigid bony neurocranium encasing and shielding cerebral tissue' }
    ],
    clinicalNotes:
      'Ischemic and hemorrhagic strokes cause rapid focal neurological deficits corresponding to disrupted cerebral arterial distributions (e.g., middle cerebral artery territory). Traumatic brain injuries (TBI) and intracranial masses produce elevated intracranial pressure (ICP), risking cerebral herniation syndromes through the tentorial notch or foramen magnum.',
    sources: [
      {
        title: 'StatPearls: Neuroanatomy, Brain',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK537247/',
        authoritativeBody: 'NCBI Bookshelf'
      }
    ],
    verificationStatus: 'verified'
  },

  // 3. LIVER (FMA7197)
  FMA7197: {
    conceptId: 'FMA7197',
    canonicalName: 'Liver',
    anatomicalSystem: 'digestive',
    overview:
      'The liver is the largest internal organ and primary metabolic hub of the human body, weighing approximately 1.5 kg in an adult. It features a unique dual vascular supply, receiving ~75% of blood from the portal vein (nutrient-rich from intestines) and ~25% from the hepatic artery (oxygen-rich from systemic circulation).',
    location:
      'Right upper quadrant (RUQ) of the abdominal cavity, occupying the entire right hypochondrium, much of the epigastrium, and extending into the left hypochondrium immediately beneath the diaphragm.',
    anatomicalFeatures: [
      'Anatomical lobes: Large right lobe and smaller left lobe separated anteriorly by the falciform ligament; caudate and quadrate lobes demarcated on the visceral surface.',
      'Porta hepatis: Transverse visceral fissure transmitting the portal vein, proper hepatic artery, common hepatic duct, lymph vessels, and autonomic nerves.',
      'Hepatic microarchitecture: Hexagonal classical hepatic lobules composed of radiating hepatocyte plates surrounding a central vein, bounded by portal triads at the periphery.',
      'Peritoneal relations: Enclosed in visceral peritoneum except for the posterior "bare area" in direct contact with the inferior surface of the diaphragm.'
    ],
    function:
      'Synthesizes essential plasma proteins (albumin, clotting factors I, II, V, VII, IX, X), produces bile for dietary lipid digestion, stores glycogen and vitamins (A, D, B12), metabolizes carbohydrates, lipids, and amino acids, biotransforms xenobiotics and pharmaceuticals, and converts toxic ammonia into urea.',
    relatedStructures: [
      { conceptId: 'FMA7148', name: 'Stomach', relationship: 'Left lobe anteriorly overlaps the lesser curvature of the stomach' },
      { conceptId: 'FMA13295', name: 'Diaphragm', relationship: 'Convex diaphragmatic surface conforms to the diaphragmatic dome' },
      { conceptId: 'FMA7198', name: 'Pancreas', relationship: 'Bile duct joins pancreatic duct at the hepatopancreatic ampulla' }
    ],
    clinicalNotes:
      'Chronic parenchymal inflammation (viral hepatitis, non-alcoholic steatohepatitis, alcohol use) leads to diffuse hepatic fibrosis and cirrhosis. Cirrhotic distortion of intrahepatic vascular architecture precipitates portal hypertension, splenomegaly, ascites, and esophageal varices. Impaired bilirubin conjugation results in clinical jaundice.',
    sources: [
      {
        title: 'StatPearls: Anatomy, Abdomen and Pelvis, Liver',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK535439/',
        authoritativeBody: 'NCBI Bookshelf'
      }
    ],
    verificationStatus: 'verified'
  },

  // 4. STOMACH (FMA7148)
  FMA7148: {
    conceptId: 'FMA7148',
    canonicalName: 'Stomach',
    anatomicalSystem: 'digestive',
    overview:
      'The stomach is a distensible J-shaped muscular organ of the upper alimentary tract situated between the esophagus and the duodenum. It acts as a temporary reservoir, initiates chemical digestion through acid and protease secretion, and mechanically liquefies ingested food into acidic chyme.',
    location:
      'Left upper quadrant (LUQ), epigastric, and umbilical regions of the abdominal cavity, inferior to the diaphragm and anterior to the pancreas and left kidney.',
    anatomicalFeatures: [
      'Cardia: Transition zone receiving the terminal abdominal esophagus at the gastroesophageal junction.',
      'Fundus: Dome-shaped superior portion projecting above the level of the cardiac orifice, often accumulating swallowed air.',
      'Body (corpus): Central, largest portion extending between the fundus and the pyloric antrum.',
      'Pyloric part: Comprises the wide pyloric antrum and narrow pyloric canal, ending at the thickened circular smooth muscle pyloric sphincter.',
      'Curvatures: Convex greater curvature (inferolateral, attaching greater omentum) and concave lesser curvature (superomedial, attaching lesser omentum).',
      'Gastric wall: Three smooth muscle coats (outer longitudinal, middle circular, inner oblique) lined by thick rugae folds.'
    ],
    function:
      'Mechanical digestion via coordinated peristaltic contractions of the three muscular layers. Chemical digestion through gastric juice secretion (~2–3 L/day): parietal cells secrete hydrochloric acid (pH 1.5–2.0) and intrinsic factor (essential for B12 absorption); chief cells secrete pepsinogen (cleaved to active pepsin).',
    relatedStructures: [
      { conceptId: 'FMA7197', name: 'Liver', relationship: 'Lesser omentum spans lesser curvature of stomach to the liver' },
      { conceptId: 'FMA7196', name: 'Spleen', relationship: 'Gastrosplenic ligament connects the greater curvature to splenic hilum' },
      { conceptId: 'FMA7198', name: 'Pancreas', relationship: 'Pancreatic anterior surface forms posterior stomach bed' }
    ],
    clinicalNotes:
      'Gastric and duodenal peptic ulcer disease commonly results from Helicobacter pylori colonization or chronic nonsteroidal anti-inflammatory drug (NSAID) use causing mucosal barrier erosion. Incompetence of the lower esophageal sphincter produces gastroesophageal reflux disease (GERD), predisposing to metaplastic Barrett esophagus.',
    sources: [
      {
        title: 'StatPearls: Anatomy, Abdomen and Pelvis, Stomach',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK499849/',
        authoritativeBody: 'NCBI Bookshelf'
      }
    ],
    verificationStatus: 'verified'
  },

  // 5. RIGHT LUNG (FMA7309)
  FMA7309: {
    conceptId: 'FMA7309',
    canonicalName: 'Right lung',
    anatomicalSystem: 'respiratory',
    overview:
      'The right lung is the larger and heavier of the bilateral respiratory organs, accounting for approximately 55% of total pulmonary capacity. It is partitioned into three distinct lobes (superior, middle, inferior) by two interlobar fissures (oblique and horizontal).',
    location:
      'Right hemithorax within the right visceral pleural cavity, extending from its apex (~2.5 cm above the first rib) down to its concave base resting upon the right diaphragmatic dome.',
    anatomicalFeatures: [
      'Superior lobe: Forms the upper anterior portion of the lung and apex.',
      'Middle lobe: Small wedge-shaped lobe located along the anterior lower border.',
      'Inferior lobe: Largest lobe, occupying the posterior and inferior base of the lung.',
      'Horizontal fissure: Separates superior and middle lobes anteriorly.',
      'Oblique fissure: Separates inferior lobe from superior and middle lobes.',
      'Pulmonary hilum: Medial root transmitting the eparterial and hyparterial right main bronchi, pulmonary arteries, superior and inferior pulmonary veins, and bronchial vessels.'
    ],
    function:
      'Conducts ambient ventilation and facilitates passive alveolar gas exchange across the blood-air barrier, oxygenating systemic venous blood from the right ventricle and clearing carbon dioxide.',
    relatedStructures: [
      { conceptId: 'FMA7310', name: 'Left lung', relationship: 'Contralateral respiratory organ in left hemithorax' },
      { conceptId: 'FMA7394', name: 'Trachea', relationship: 'Receives air via the right principal bronchus' },
      { conceptId: 'FMA13295', name: 'Diaphragm', relationship: 'Base rests on right diaphragmatic dome' },
      { conceptId: 'FMA7088', name: 'Heart', relationship: 'Medial mediastinal surface displays cardiac impression' }
    ],
    clinicalNotes:
      'The right main bronchus is wider, shorter (~2.5 cm), and runs more vertically (~25 degrees from midline) than the left, causing foreign body aspiration to preferentially lodge in the right bronchial tree (particularly the superior segment of the right lower lobe). Lobar pneumonia commonly affects discrete segments or entire lobes.',
    sources: [
      {
        title: 'StatPearls: Anatomy, Thorax, Lung',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK532961/',
        authoritativeBody: 'NCBI Bookshelf'
      }
    ],
    verificationStatus: 'verified'
  },

  // 6. LEFT LUNG (FMA7310)
  FMA7310: {
    conceptId: 'FMA7310',
    canonicalName: 'Left lung',
    anatomicalSystem: 'respiratory',
    overview:
      'The left lung is divided into two lobes (superior and inferior) by a single oblique fissure. It is slightly smaller in volume than the right lung to accommodate the leftward orientation of the pericardial cavity and heart apex.',
    location:
      'Left hemithorax within the left pleural sac, extending from the thoracic apex to the left hemidiaphragm.',
    anatomicalFeatures: [
      'Superior lobe: Features the prominent anterior cardiac notch accommodating the heart, and the lingula (homolog to the right middle lobe) at its anteroinferior margin.',
      'Inferior lobe: Forms the greater part of the posterior and basal pulmonary mass.',
      'Oblique fissure: Extends obliquely from the T3/T4 spinous process level down to the 6th costochondral junction.',
      'Left pulmonary hilum: Medial root transmitting the left main bronchus, pulmonary artery (located superiorly), and pulmonary veins.'
    ],
    function:
      'Provides pulmonary alveolar surface area for blood oxygenation and carbon dioxide elimination. Expands during negative intrathoracic pressure created by diaphragmatic descent and intercostal muscle contraction.',
    relatedStructures: [
      { conceptId: 'FMA7309', name: 'Right lung', relationship: 'Contralateral respiratory organ' },
      { conceptId: 'FMA7088', name: 'Heart', relationship: 'Cardiac notch and anterior impression cradle the left ventricle' },
      { conceptId: 'FMA7394', name: 'Trachea', relationship: 'Supplied by the left principal bronchus' },
      { conceptId: 'FMA13295', name: 'Diaphragm', relationship: 'Concave diaphragmatic base contacts left dome' }
    ],
    clinicalNotes:
      'Pleural effusion, pneumothorax, or hemothorax in the left pleural cavity compresses lung tissue, causing compressive atelectasis and mediastinal shift. Chronic obstructive pulmonary disease (COPD) causes irreversible alveolar wall destruction (emphysema) and airway hypersecretion (chronic bronchitis).',
    sources: [
      {
        title: 'StatPearls: Anatomy, Thorax, Lung',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK532961/',
        authoritativeBody: 'NCBI Bookshelf'
      }
    ],
    verificationStatus: 'verified'
  },

  // 7. RIGHT KIDNEY (FMA7204)
  FMA7204: {
    conceptId: 'FMA7204',
    canonicalName: 'Right kidney',
    anatomicalSystem: 'urinary',
    overview:
      'The right kidney is a retroperitoneal bean-shaped excretory organ located on the posterior abdominal wall. It lies slightly lower (~1–2 cm) than the left kidney due to the substantial mass of the overlying right hepatic lobe.',
    location:
      'Retroperitoneal space at vertebral levels T12 to L3, lateral to the vertebral column and psoas major muscle, with its anterior surface in relation to the liver, duodenum, and ascending colon.',
    anatomicalFeatures: [
      'Renal capsule: Tough, fibrous outer membrane resistant to stretching, enclosed in perirenal fat and Gerota renal fascia.',
      'Renal cortex: Pale outer parenchymal layer containing ~1 million nephrons (renal corpuscles and convoluted tubules).',
      'Renal medulla: Darker inner layer arranged into 8–18 striated renal pyramids ending in renal papillae.',
      'Calyceal system: Minor calyces receiving papilla drainage that merge into 2–3 major calyces, uniting to form the funnel-shaped renal pelvis.',
      'Renal hilum: Medial cleft transmitting the renal vein anteriorly, renal artery centrally, and renal pelvis/ureter posteriorly.'
    ],
    function:
      'Extracts metabolic waste products (urea, creatinine, uric acid) from the blood; regulates extracellular fluid volume, systemic arterial pressure (via renin secretion), electrolyte concentrations (Na+, K+, Cl-, HCO3-), and acid-base balance; produces erythropoietin and activates vitamin D.',
    relatedStructures: [
      { conceptId: 'FMA7205', name: 'Left kidney', relationship: 'Contralateral paired excretory organ' },
      { conceptId: 'FMA7197', name: 'Liver', relationship: 'Hepatic impression covers anterior upper pole' },
      { conceptId: 'FMA15900', name: 'Urinary bladder', relationship: 'Ureter conveys urine down to the bladder' }
    ],
    clinicalNotes:
      'Nephrolithiasis (calcium oxalate, uric acid, or struvite calculi) obstructing the ureteropelvic junction causes acute renal colic radiating from flank to groin. Hydronephrosis develops when urinary outflow is obstructed, predisposing to parenchymal atrophy and secondary pyelonephritis.',
    sources: [
      {
        title: 'StatPearls: Anatomy, Abdomen and Pelvis, Kidneys',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK499818/',
        authoritativeBody: 'NCBI Bookshelf'
      }
    ],
    verificationStatus: 'verified'
  },

  // 8. LEFT KIDNEY (FMA7205)
  FMA7205: {
    conceptId: 'FMA7205',
    canonicalName: 'Left kidney',
    anatomicalSystem: 'urinary',
    overview:
      'The left kidney is a retroperitoneal organ of the urinary system positioned symmetrically opposite the right kidney. Under resting physiological conditions, both kidneys together receive 20% to 25% of total cardiac output via the paired renal arteries.',
    location:
      'Retroperitoneal space along vertebral levels T12 to L3, directly anterior to the 11th and 12th ribs, quadratus lumborum, and psoas major, adjacent to the spleen, stomach, pancreas tail, and descending colon.',
    anatomicalFeatures: [
      'Renal parenchyma: Divided into outer cortex and inner medullary pyramids separated by renal columns of Bertin.',
      'Nephron unit: Composed of Bowman capsule enclosing the glomerulus, proximal tubule, loop of Henle, and distal convoluted tubule.',
      'Renal hilum: Vertical fissure on the medial concave border opening into the renal sinus.',
      'Vascular relations: Left renal vein is longer than the right, crossing anterior to the abdominal aorta beneath the superior mesenteric artery.'
    ],
    function:
      'Performs selective glomerular ultrafiltration, tubular reabsorption, and tubular secretion to maintain body fluid osmolarity and chemical composition. Secretes renin in response to decreased renal perfusion pressure.',
    relatedStructures: [
      { conceptId: 'FMA7204', name: 'Right kidney', relationship: 'Contralateral paired excretory organ' },
      { conceptId: 'FMA7196', name: 'Spleen', relationship: 'Superior pole abuts the splenic visceral surface' },
      { conceptId: 'FMA15900', name: 'Urinary bladder', relationship: 'Drains via left ureter into bladder trigone' }
    ],
    clinicalNotes:
      'The left renal vein can become compressed between the abdominal aorta and superior mesenteric artery ("nutcracker syndrome"), causing left flank pain, hematuria, and left varicocele in males (due to impaired drainage of the left testicular vein into the left renal vein). Chronic kidney disease (CKD) manifests as progressive loss of glomerular filtration.',
    sources: [
      {
        title: 'StatPearls: Anatomy, Abdomen and Pelvis, Kidneys',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK499818/',
        authoritativeBody: 'NCBI Bookshelf'
      }
    ],
    verificationStatus: 'verified'
  },

  // 9. RIGHT FEMUR (FMA24474)
  FMA24474: {
    conceptId: 'FMA24474',
    canonicalName: 'Right femur',
    anatomicalSystem: 'skeletal',
    overview:
      'The right femur is the longest, heaviest, and strongest long bone in the human body, spanning the right thigh between the pelvic hip joint and the knee joint. Its internal trabecular architecture is oriented along compressive and tensile stress lines to withstand immense weight-bearing forces.',
    location:
      'Right lower extremity, articulating proximally with the acetabulum of the pelvis and distally with the tibial plateau and patella.',
    anatomicalFeatures: [
      'Femoral head: Smooth, two-thirds spherical articular surface directed medially, superiorly, and anteriorly into the pelvic acetabulum; features a small fovea capitis for the ligamentum teres.',
      'Femoral neck: Cylindrical bone segment connecting head to shaft at an angle of inclination (~125 degrees in adults); common site of osteoporotic fractures.',
      'Greater trochanter: Large quadrangular lateral projection providing attachment for gluteus medius, gluteus minimus, piriformis, and obturator internus.',
      'Lesser trochanter: Conical posteromedial projection receiving the conjoined tendon of psoas major and iliacus (iliopsoas).',
      'Shaft (diaphysis): Convex anteriorly; prominent posterior longitudinal ridge (linea aspera) for adductor muscle attachments.',
      'Distal condyles: Medial and lateral condyles separated by the intercondylar fossa posteriorly and articulating with the patella anteriorly.'
    ],
    function:
      'Transmits mechanical gravitational forces from the axial skeleton and pelvic girdle down to the tibia during standing, walking, running, and jumping. Provides major skeletal lever arms for powerful locomotor muscles of the hip and knee.',
    relatedStructures: [
      { conceptId: 'FMA24475', name: 'Left femur', relationship: 'Contralateral skeletal element of the lower limb' },
      { conceptId: 'FMA13478', name: 'Vertebral column', relationship: 'Axial body weight transmits via pelvis to both femurs' }
    ],
    clinicalNotes:
      'Femoral neck fractures in elderly patients frequently disrupt the intra-capsular retinacular arterial branches of the medial circumflex femoral artery, leading to avascular necrosis (AVN) of the femoral head. High-energy diaphyseal fractures cause substantial internal hemorrhage (up to 1–1.5 L of blood loss into the thigh compartment) and carry a risk of fat embolism syndrome.',
    sources: [
      {
        title: 'StatPearls: Anatomy, Bony Pelvis and Lower Limb, Femur',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK532982/',
        authoritativeBody: 'NCBI Bookshelf'
      }
    ],
    verificationStatus: 'verified'
  },

  // 10. LEFT FEMUR (FMA24475)
  FMA24475: {
    conceptId: 'FMA24475',
    canonicalName: 'Left femur',
    anatomicalSystem: 'skeletal',
    overview:
      'The left femur is the primary skeletal pillar of the left lower extremity. Symmetrical in structural design to the right femur, its cortical bone thickness and spongy trabeculae dynamically remodel in response to mechanical loading (Wolff law).',
    location:
      'Left thigh region, between the left acetabulum of the pelvis and the left knee joint complex.',
    anatomicalFeatures: [
      'Femoral head: Articulates with the left acetabulum forming a multiaxial ball-and-socket synovial joint.',
      'Femoral neck: Provides mechanical clearance for extensive range of hip motion (flexion, extension, abduction, adduction, circumduction).',
      'Intertrochanteric line & crest: Anterior line and posterior prominent ridge demarcating neck-to-shaft transition.',
      'Linea aspera: Prominent bifurcated posterior ridge on the shaft dividing distally into medial and lateral supracondylar lines.',
      'Knee articular surfaces: Broad medial and lateral condyles articulating with the tibial plateau.'
    ],
    function:
      'Supports axial body weight and acts as a rigid class-3 mechanical lever for bipedal locomotion, stabilizing the pelvic ring during single-leg stance phases of gait.',
    relatedStructures: [
      { conceptId: 'FMA24474', name: 'Right femur', relationship: 'Contralateral skeletal element of the lower limb' },
      { conceptId: 'FMA13478', name: 'Vertebral column', relationship: 'Transmits vertebral loading through pelvic sacrum and ilium' }
    ],
    clinicalNotes:
      'Osteoarthritis of the hip (coxarthrosis) involves degeneration of the femoral head articular cartilage, joint space narrowing, and subchondral osteophyte formation, often treated with total hip arthroplasty (THA). Distal supracondylar fractures risk injury to the popliteal artery and tibial nerve.',
    sources: [
      {
        title: 'StatPearls: Anatomy, Bony Pelvis and Lower Limb, Femur',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK532982/',
        authoritativeBody: 'NCBI Bookshelf'
      }
    ],
    verificationStatus: 'verified'
  },

  // 11. RIGHT HUMERUS (FMA23130)
  FMA23130: {
    conceptId: 'FMA23130',
    canonicalName: 'Right humerus',
    anatomicalSystem: 'skeletal',
    overview:
      'The right humerus is the longest and largest bone of the right upper extremity, forming the skeletal framework of the arm (brachium). It articulates proximally with the scapula and distally with the radius and ulna at the elbow.',
    location:
      'Right arm, extending between the shoulder (glenohumeral) joint and the elbow (cubital) joint.',
    anatomicalFeatures: [
      'Humeral head: Hemispherical smooth articular surface oriented medially, superiorly, and posteriorly into the shallow glenoid fossa of the scapula.',
      'Anatomical and surgical necks: Surgical neck is the constricted zone distal to the greater and lesser tubercles, representing a common fracture site.',
      'Greater and lesser tubercles: Separated by the intertubercular (bicipital) groove conveying the long head of biceps tendon; attach rotator cuff muscles (SITS).',
      'Shaft (diaphysis): Cylindrical proximally, triangular distally; features the lateral deltoid tuberosity and posterior radial (spiral) groove.',
      'Distal condyle: Capitulum (lateral, articulates with radius head) and trochlea (medial spool-shaped, articulates with ulna trochlear notch).',
      'Medial and lateral epicondyles: Medial epicondyle is prominent and provides attachment for forearm flexors; posterior surface grooves for the ulnar nerve.'
    ],
    function:
      'Provides skeletal support and wide-ranging multi-axis mobility for the upper limb, acting as an essential lever for lifting, throwing, pushing, and spatial positioning of the hand.',
    relatedStructures: [
      { conceptId: 'FMA23131', name: 'Left humerus', relationship: 'Contralateral upper extremity long bone' }
    ],
    clinicalNotes:
      'Mid-shaft humeral fractures commonly injure the radial nerve as it traverses the radial (spiral) groove, resulting in characteristic "wrist drop" (loss of wrist and finger extension) and sensory loss over the dorsal first web space. Surgical neck fractures risk axillary nerve injury and posterior circumflex humeral artery disruption.',
    sources: [
      {
        title: 'StatPearls: Anatomy, Shoulder and Upper Limb, Humerus',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK534821/',
        authoritativeBody: 'NCBI Bookshelf'
      }
    ],
    verificationStatus: 'verified'
  },

  // 12. LEFT HUMERUS (FMA23131)
  FMA23131: {
    conceptId: 'FMA23131',
    canonicalName: 'Left humerus',
    anatomicalSystem: 'skeletal',
    overview:
      'The left humerus is the structural foundation of the left arm. Symmetrical to the right humerus, it facilitates the extraordinary mobility of the left glenohumeral joint in coordination with the scapulothoracic rhythm.',
    location:
      'Left arm region, spanning from the left glenoid cavity of the scapula to the proximal left radius and ulna.',
    anatomicalFeatures: [
      'Proximal epiphysis: Humeral head, anatomical neck, greater tubercle (supraspinatus, infraspinatus, teres minor insertions), and lesser tubercle (subscapularis insertion).',
      'Diaphysis: Cortical bone shaft bearing the deltoid tuberosity and posterior radial spiral groove.',
      'Distal epiphysis: Medial epicondyle, lateral epicondyle, olecranon fossa (posterior, receives ulna olecranon during extension), and coronoid/radial fossae (anterior).'
    ],
    function:
      'Serves as a mechanical link connecting the shoulder girdle to the forearm and hand, transmitting muscular forces produced by pectoralis major, latissimus dorsi, deltoid, and rotator cuff muscles.',
    relatedStructures: [
      { conceptId: 'FMA23130', name: 'Right humerus', relationship: 'Contralateral upper extremity long bone' }
    ],
    clinicalNotes:
      'Supracondylar fractures of the distal humerus, most prevalent in pediatric falls onto an outstretched hand, represent orthopedic emergencies due to the high risk of brachial artery entrapment and median nerve injury, which can lead to ischemic Volkmann contracture.',
    sources: [
      {
        title: 'StatPearls: Anatomy, Shoulder and Upper Limb, Humerus',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK534821/',
        authoritativeBody: 'NCBI Bookshelf'
      }
    ],
    verificationStatus: 'verified'
  },

  // 13. SKULL (FMA46565)
  FMA46565: {
    conceptId: 'FMA46565',
    canonicalName: 'Skull',
    anatomicalSystem: 'skeletal',
    overview:
      'The skull is the complex skeletal framework of the head, composed of 22 separate bones (excluding the 6 middle ear ossicles) unified by immovable fibrous joints termed sutures, with the exception of the freely movable synovial temporomandibular joint of the mandible.',
    location:
      'Superior terminal segment of the axial skeleton, articulating via its occipital condyles with the superior articular facets of the C1 atlas vertebra.',
    anatomicalFeatures: [
      'Neurocranium (8 bones): Encases the brain; formed by the frontal, occipital, sphenoid, ethmoid, and paired parietal and temporal bones.',
      'Viscerocranium (14 facial bones): Supports facial architecture and special senses; formed by paired maxillae, zygomatic, nasal, lacrimal, palatine, and inferior nasal conchae, plus the vomer and mandible.',
      'Cranial base & fossae: Internal floor partitioned into anterior, middle, and posterior cranial fossae supporting cerebral lobes, cerebellum, and brainstem.',
      'Cranial sutures: Coronal, sagittal, lambdoid, and squamous sutures that interlock adjacent bones.',
      'Cranial apertures: Major foramina transmitting vessels and cranial nerves, including the foramen magnum, jugular foramen, optic canals, and superior orbital fissures.'
    ],
    function:
      'Protects the encephalon, meninges, and neurovasculature from mechanical trauma; houses and anchors sensory organs for vision, hearing, equilibrium, olfaction, and gustation; provides attachments for muscles of mastication and facial expression.',
    relatedStructures: [
      { conceptId: 'FMA50801', name: 'Brain', relationship: 'Completely contained within and protected by the neurocranium' },
      { conceptId: 'FMA13478', name: 'Vertebral column', relationship: 'Articulates at the atlanto-occipital joints atop the C1 atlas' },
      { conceptId: 'FMA7647', name: 'Spinal cord', relationship: 'Exits cranial vault via the foramen magnum' }
    ],
    clinicalNotes:
      'Basilar skull fractures involving the temporal or sphenoid bones manifest with clinical hallmarks: periorbital ecchymosis ("raccoon eyes"), retroauricular ecchymosis ("Battle sign"), and CSF rhinorrhea or otorrhea. Craniosynostosis (premature closure of infant sutures) alters skull morphology and may compromise intracranial volume.',
    sources: [
      {
        title: 'StatPearls: Anatomy, Head and Neck, Skull',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK538167/',
        authoritativeBody: 'NCBI Bookshelf'
      }
    ],
    verificationStatus: 'verified'
  },

  // 14. VERTEBRAL COLUMN (FMA13478)
  FMA13478: {
    conceptId: 'FMA13478',
    canonicalName: 'Vertebral column',
    anatomicalSystem: 'skeletal',
    overview:
      'The vertebral column (spine) is the flexible central axis of the human skeleton, comprising 33 vertebrae categorized into five regions: 7 cervical, 12 thoracic, 5 lumbar, 5 fused sacral (forming the sacrum), and 4 fused coccygeal (forming the coccyx).',
    location:
      'Dorsal midline of the axial torso, extending from the base of the skull down to the pelvic floor and gluteal cleft.',
    anatomicalFeatures: [
      'Cervical spine (C1–C7): Highly mobile; features transverse foramina transmitting vertebral arteries; specialized C1 (atlas) and C2 (axis) support head movement.',
      'Thoracic spine (T1–T12): Articulates with 12 pairs of ribs via costal facets; exhibits posterior kyphotic curvature.',
      'Lumbar spine (L1–L5): Heavy, broad cylindrical vertebral bodies engineered for major axial compression; exhibits anterior lordotic curvature.',
      'Sacrum & Coccyx: Fused triangular bones transmitting axial forces to the iliac pelvic bones through bilateral sacroiliac joints.',
      'Vertebral canal: Longitudinal lumen formed by consecutive vertebral foramina, encasing the spinal cord, meninges, and spinal roots.',
      'Intervertebral discs: Fibrocartilaginous pads between vertebral bodies with an outer fibrous anulus fibrosus and gelatinous central nucleus pulposus.'
    ],
    function:
      'Provides structural axial support for the torso and head; permits multi-planar trunk movement (flexion, extension, lateral bending, rotation); protects the vulnerable spinal cord and cauda equina from traumatic injury.',
    relatedStructures: [
      { conceptId: 'FMA7647', name: 'Spinal cord', relationship: 'Enclosed within and protected by the vertebral canal' },
      { conceptId: 'FMA46565', name: 'Skull', relationship: 'Articulates superiorly with the occipital condyles' },
      { conceptId: 'FMA24474', name: 'Right femur', relationship: 'Transmits body weight through pelvic girdle to femur' }
    ],
    clinicalNotes:
      'Herniation of the nucleus pulposus (most common at L4–L5 and L5–S1) compresses traversing or exiting spinal nerve roots, producing lumbar radiculopathy (sciatica). Degenerative spinal stenosis causes neurogenic claudication during ambulation. Pathological spinal curvatures include scoliosis (lateral deviation) and hyperkyphosis.',
    sources: [
      {
        title: 'StatPearls: Anatomy, Back, Vertebral Column',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK525969/',
        authoritativeBody: 'NCBI Bookshelf'
      }
    ],
    verificationStatus: 'verified'
  },

  // 15. SPINAL CORD (FMA7647)
  FMA7647: {
    conceptId: 'FMA7647',
    canonicalName: 'Spinal cord',
    anatomicalSystem: 'nervous',
    overview:
      'The spinal cord is the primary bidirectional neural highway of the central nervous system, connecting the encephalon to the peripheral body. It gives rise to 31 bilateral pairs of spinal nerves (8 cervical, 12 thoracic, 5 lumbar, 5 sacral, 1 coccygeal) through ventral (motor) and dorsal (sensory) roots.',
    location:
      'Vertebral canal, extending from the foramen magnum of the occipital bone (continuous with the medulla oblongata) down to the conus medullaris at the L1/L2 vertebral level in adults.',
    anatomicalFeatures: [
      'Conus medullaris: Tapered caudal terminal extremity of the spinal cord proper.',
      'Cauda equina: Collection of elongated lumbosacral dorsal and ventral nerve roots descending within the lumbar cistern before exiting through their intervertebral foramina.',
      'Filum terminale: Slender fibrous prolongation of pia mater anchoring the conus medullaris to the coccygeal periosteum.',
      'Spinal gray matter: Butterfly-shaped central core containing dorsal (sensory interneurons), ventral (somatic alpha motor neurons), and lateral (sympathetic/parasympathetic autonomic) horns.',
      'Spinal white matter: Peripheral myelinated ascending tracts (dorsal column-medial lemniscal, spinothalamic) and descending motor tracts (lateral and anterior corticospinal).'
    ],
    function:
      'Conducts sensory afferent signals from peripheral receptors to the brain, delivers motor efferent signals from higher centers to skeletal muscles and autonomic effectors, and independently coordinates somatic and visceral spinal reflexes (e.g., deep tendon stretch reflexes).',
    relatedStructures: [
      { conceptId: 'FMA50801', name: 'Brain', relationship: 'Direct continuous extension of the brainstem medulla oblongata' },
      { conceptId: 'FMA13478', name: 'Vertebral column', relationship: 'Protected within the bony longitudinal vertebral canal' },
      { conceptId: 'FMA46565', name: 'Skull', relationship: 'Passes through the occipital foramen magnum' }
    ],
    clinicalNotes:
      'Traumatic spinal cord injury (SCI) above C3–C5 causes diaphragmatic paralysis requiring mechanical ventilation due to phrenic nerve impairment. Complete transection results in permanent loss of sensory and motor function below the lesion level (spinal shock followed by spastic paralysis). Cauda equina compression produces a surgical emergency with saddle anesthesia and sphincter dysfunction.',
    sources: [
      {
        title: 'StatPearls: Anatomy, Spinal Cord',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK544321/',
        authoritativeBody: 'NCBI Bookshelf'
      }
    ],
    verificationStatus: 'verified'
  },

  // 16. TRACHEA (FMA7394)
  FMA7394: {
    conceptId: 'FMA7394',
    canonicalName: 'Trachea',
    anatomicalSystem: 'respiratory',
    overview:
      'The trachea (windpipe) is a flexible cartilaginous and membranous tube approximately 10–12 cm long and 2 cm wide, forming the initial segment of the lower respiratory conducting zone between the larynx and primary bronchi.',
    location:
      'Midline of the neck and superior/middle mediastinum, extending from the inferior border of the cricoid cartilage (C6 level) down to the carina at the T4/T5 level (sternal angle of Louis).',
    anatomicalFeatures: [
      'Tracheal cartilages: 16–20 C-shaped hyaline cartilage rings that keep the airway patent under negative inspiratory pressures.',
      'Trachealis muscle: Posterior longitudinal and transverse smooth muscle bridging the open cartilage ends, resting against the anterior wall of the esophagus.',
      'Carina: Internal sagittal cartilaginous ridge at the tracheal bifurcation into right and left main bronchi; richly innervated with sensitive cough reflex receptors.',
      'Mucosa: Pseudostratified ciliated columnar epithelium containing goblet cells that produce mucus.'
    ],
    function:
      'Transports inspired air to the lungs and expels expired gases; the mucociliary escalator traps inhaled particulates and pathogens, propelling them cephalad toward the pharynx for swallowing or expectoration.',
    relatedStructures: [
      { conceptId: 'FMA7309', name: 'Right lung', relationship: 'Bifurcates into the right principal bronchus' },
      { conceptId: 'FMA7310', name: 'Left lung', relationship: 'Bifurcates into the left principal bronchus' },
      { conceptId: 'FMA7088', name: 'Heart', relationship: 'Aortic arch curves over the left pulmonary root anterior to trachea' }
    ],
    clinicalNotes:
      'Acute upper airway obstruction (foreign body, angioedema, epiglottitis) can necessitate emergency cricothyroidotomy or tracheostomy (usually between 2nd and 3rd tracheal rings). Tracheomalacia involves structural weakness and dynamic expiratory collapse of tracheal cartilages.',
    sources: [
      {
        title: 'StatPearls: Anatomy, Head and Neck, Trachea',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK470390/',
        authoritativeBody: 'NCBI Bookshelf'
      }
    ],
    verificationStatus: 'verified'
  },

  // 17. DIAPHRAGM (FMA13295)
  FMA13295: {
    conceptId: 'FMA13295',
    canonicalName: 'Diaphragm',
    anatomicalSystem: 'muscular',
    overview:
      'The diaphragm is a broad, dome-shaped musculofibrous partition separating the thoracic and abdominal cavities. It is the primary muscle of inspiration, responsible for approximately 75% of resting tidal volume ventilation.',
    location:
      'Floor of the thoracic cavity and roof of the abdominal cavity, attached peripherally to the xiphoid process, lower six costal cartilages/ribs, and upper lumbar vertebrae via the right and left crura.',
    anatomicalFeatures: [
      'Central tendon: Strong clover-leaf aponeurotic tendon into which circumferential radial muscle fibers insert.',
      'Crura: Musculotendinous bundles; right crus arises from L1–L3 bodies, left crus from L1–L2 bodies.',
      'Caval opening (T8): Transmits inferior vena cava and branches of the right phrenic nerve through the central tendon.',
      'Esophageal hiatus (T10): Muscular aperture formed by the right crus transmitting the esophagus and anterior/posterior vagal trunks.',
      'Aortic hiatus (T12): Posterior osseofibrous tunnel transmitting the descending abdominal aorta, thoracic duct, and azygos vein.',
      'Innervation: Exclusive motor innervation from bilateral phrenic nerves (C3, C4, C5: "C3, 4, 5 keep the diaphragm alive").'
    ],
    function:
      'Contraction flattens the dome, increasing intra-thoracic vertical diameter and volume, which reduces intrathoracic pressure and drives atmospheric air into the lungs. Also assists in increasing intra-abdominal pressure during defecation, micturition, and parturition.',
    relatedStructures: [
      { conceptId: 'FMA7088', name: 'Heart', relationship: 'Pericardium is firmly fused to the superior surface of central tendon' },
      { conceptId: 'FMA7309', name: 'Right lung', relationship: 'Right hemidiaphragm dome directly supports right lung base' },
      { conceptId: 'FMA7310', name: 'Left lung', relationship: 'Left hemidiaphragm dome directly supports left lung base' },
      { conceptId: 'FMA7197', name: 'Liver', relationship: 'Superior diaphragmatic surface directly contacts the liver' }
    ],
    clinicalNotes:
      'Phrenic nerve injury causes ipsilateral diaphragmatic paralysis and paradoxical upward movement on inspiration. Congenital diaphragmatic hernias (e.g., Bochdalek hernia through posterolateral pleuroperitoneal defect) allow abdominal viscera to compress developing fetal lungs, causing severe pulmonary hypoplasia.',
    sources: [
      {
        title: 'StatPearls: Anatomy, Thorax, Diaphragm',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK519558/',
        authoritativeBody: 'NCBI Bookshelf'
      }
    ],
    verificationStatus: 'verified'
  },

  // 18. SPLEEN (FMA7196)
  FMA7196: {
    conceptId: 'FMA7196',
    canonicalName: 'Spleen',
    anatomicalSystem: 'lymphatic',
    overview:
      'The spleen is the largest lymphoid organ in the body, dedicated to hematologic filtration and systemic immune surveillance. It is highly vascular, filtering approximately 10% of total cardiac output every minute.',
    location:
      'Left upper quadrant (LUQ) in the left hypochondrium, nestled beneath the left hemidiaphragm and protected by the 9th, 10th, and 11th ribs, posterior to the stomach and lateral to the left kidney.',
    anatomicalFeatures: [
      'Red pulp: Comprises splenic cords (cords of Billroth) and venous sinuses; acts as a mechanical filter removing aged or damaged red blood cells.',
      'White pulp: Comprises periarteriolar lymphoid sheaths (PALS, rich in T cells) and lymphoid follicles (rich in B cells) organizing immune defenses against blood-borne antigens.',
      'Splenic hilum: Transverse fissure on the visceral surface transmitting the tortuous splenic artery, splenic vein, and autonomic nerves.',
      'Peritoneal ligaments: Suspended by the gastrosplenic ligament (to stomach) and splenorenal ligament (to left posterior abdominal wall).'
    ],
    function:
      'Immune surveillance and antibody production; mechanical clearance and phagocytosis of senescent erythrocytes and opsonized bacteria; recycling of hemoglobin iron; serves as a reservoir for platelets and monocytes.',
    relatedStructures: [
      { conceptId: 'FMA7148', name: 'Stomach', relationship: 'Connected by the gastrosplenic ligament' },
      { conceptId: 'FMA7205', name: 'Left kidney', relationship: 'Posteromedial renal impression abuts the left kidney' },
      { conceptId: 'FMA7198', name: 'Pancreas', relationship: 'Tail of the pancreas abuts the splenic hilum' }
    ],
    clinicalNotes:
      'Because of its rich vascularity and fragile capsule, blunt abdominal trauma (e.g., motor vehicle collision, sports impact) frequently causes splenic rupture with life-threatening intra-abdominal hemorrhage. Splenectomized individuals face lifetime susceptibility to overwhelming post-splenectomy infection (OPSI) caused by encapsulated bacteria.',
    sources: [
      {
        title: 'StatPearls: Anatomy, Abdomen and Pelvis, Spleen',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK541018/',
        authoritativeBody: 'NCBI Bookshelf'
      }
    ],
    verificationStatus: 'verified'
  },

  // 19. PANCREAS (FMA7198)
  FMA7198: {
    conceptId: 'FMA7198',
    canonicalName: 'Pancreas',
    anatomicalSystem: 'digestive',
    overview:
      'The pancreas is an elongated retroperitoneal gland (~15 cm long) with dual endocrine and exocrine functions, lying transversely across the posterior abdominal wall from the duodenum to the spleen.',
    location:
      'Retroperitoneal space at vertebral levels L1–L2, posterior to the stomach and lesser sac, with its head cradled by the C-shaped loop of the duodenum.',
    anatomicalFeatures: [
      'Head: Expanded medial portion in contact with duodenal C-loop; gives off the hook-like uncinate process passing posterior to superior mesenteric vessels.',
      'Neck & Body: Crosses anterior to the abdominal aorta, inferior vena cava, and left renal vein, forming part of the posterior stomach bed.',
      'Tail: Narrowed lateral extremity that passes within the splenorenal ligament to abut the splenic hilum.',
      'Duct system: Main pancreatic duct (of Wirsung) traversing the length of the gland, joining the common bile duct at the hepatopancreatic ampulla (ampulla of Vater).'
    ],
    function:
      'Exocrine function (~98% of tissue): Acinar cells synthesize and secrete digestive proenzymes (trypsinogen, chymotrypsinogen, amylase, lipase) and alkaline bicarbonate juice neutralizing gastric acid in the duodenum. Endocrine function (~2%): Islets of Langerhans secrete insulin (beta cells), glucagon (alpha cells), and somatostatin (delta cells) directly into the portal circulation.',
    relatedStructures: [
      { conceptId: 'FMA7148', name: 'Stomach', relationship: 'Stomach lies directly anterior to the pancreatic body' },
      { conceptId: 'FMA7197', name: 'Liver', relationship: 'Common bile duct courses through pancreatic head to join pancreatic duct' },
      { conceptId: 'FMA7196', name: 'Spleen', relationship: 'Pancreatic tail contacts the splenic hilum' }
    ],
    clinicalNotes:
      'Acute pancreatitis, most commonly provoked by gallstone impaction at the ampulla of Vater or alcohol toxicity, causes autodigestion of pancreatic tissue with severe epigastric pain radiating to the back. Pancreatic ductal adenocarcinoma, especially in the pancreatic head, classically causes painless obstructive jaundice.',
    sources: [
      {
        title: 'StatPearls: Anatomy, Abdomen and Pelvis, Pancreas',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK532912/',
        authoritativeBody: 'NCBI Bookshelf'
      }
    ],
    verificationStatus: 'verified'
  },

  // 20. URINARY BLADDER (FMA15900)
  FMA15900: {
    conceptId: 'FMA15900',
    canonicalName: 'Urinary bladder',
    anatomicalSystem: 'urinary',
    overview:
      'The urinary bladder is a hollow, distensible pelvic organ with strong muscular walls designed for variable-volume storage and controlled expulsion of urine. In adults, its capacity typically ranges from 400 to 600 mL.',
    location:
      'Lesser pelvis, resting on the pelvic floor directly posterior to the pubic symphysis. In males, it lies anterior to the rectum and superior to the prostate gland; in females, anterior to the vagina and anteroinferior to the uterus.',
    anatomicalFeatures: [
      'Apex: Points anteriorly toward the superior border of the pubic symphysis, anchored by the median umbilical ligament (urachus remnant).',
      'Body and Fundus: Triangular posteroinferior base receiving the bilateral ureters.',
      'Neck: Most fixed and inferior portion surrounding the internal urethral orifice, resting on the prostate in males or pelvic fascia in females.',
      'Trigone: Smooth, non-distensible triangular mucosal area on the internal base bounded by the two ureteric orifices and the internal urethral orifice.',
      'Detrusor muscle: Three interlaced layers of smooth muscle (inner longitudinal, middle circular, outer longitudinal) that contract synchronously during micturition.'
    ],
    function:
      'Provides high-compliance, low-pressure storage of urine arriving from the kidneys via ureteric peristalsis. Micturition is triggered by stretch receptors sending afferents to the sacral spinal cord (S2–S4) and pontine micturition center, initiating parasympathetic detrusor contraction and somatic external urethral sphincter relaxation.',
    relatedStructures: [
      { conceptId: 'FMA7204', name: 'Right kidney', relationship: 'Receives urine via the right ureter' },
      { conceptId: 'FMA7205', name: 'Left kidney', relationship: 'Receives urine via the left ureter' }
    ],
    clinicalNotes:
      'Cystitis (bacterial infection, frequently caused by uropathogenic Escherichia coli) causes mucosal inflammation with dysuria, urgency, and suprapubic pain. Urinary retention occurs with benign prostatic hyperplasia (BPH) obstructing the bladder neck. Painless gross hematuria in adults is a hallmark of urothelial (transitional cell) bladder carcinoma.',
    sources: [
      {
        title: 'StatPearls: Anatomy, Abdomen and Pelvis, Urinary Bladder',
        url: 'https://www.ncbi.nlm.nih.gov/books/NBK534241/',
        authoritativeBody: 'NCBI Bookshelf'
      }
    ],
    verificationStatus: 'verified'
  }
};

// Aliases for bilateral concepts and collective concepts:
KNOWLEDGE_BASE['FMA9611'] = {
  ...KNOWLEDGE_BASE['FMA24474'],
  conceptId: 'FMA9611',
  canonicalName: 'Femur (Bilateral)',
  overview:
    'The femurs (thigh bones) are the longest, strongest, and heaviest tubular long bones in the human skeleton. Each femur articulates proximally with the pelvic acetabulum and distally with the tibia and patella, bearing the entirety of upper body weight during bipedal standing and locomotion.',
  relatedStructures: [
    { conceptId: 'FMA24474', name: 'Right femur', relationship: 'Right lateral member of bilateral pair' },
    { conceptId: 'FMA24475', name: 'Left femur', relationship: 'Left lateral member of bilateral pair' },
    { conceptId: 'FMA13478', name: 'Vertebral column', relationship: 'Axial body weight transmitted via pelvic girdle' }
  ]
};

KNOWLEDGE_BASE['FMA13303'] = {
  ...KNOWLEDGE_BASE['FMA23130'],
  conceptId: 'FMA13303',
  canonicalName: 'Humerus (Bilateral)',
  overview:
    'The humeri are the principal long bones of the upper limbs, providing the skeletal framework of the arms. Each humerus articulates proximally with the glenoid cavity of the scapula and distally with the radius and ulna at the elbow joint.',
  relatedStructures: [
    { conceptId: 'FMA23130', name: 'Right humerus', relationship: 'Right member of bilateral pair' },
    { conceptId: 'FMA23131', name: 'Left humerus', relationship: 'Left member of bilateral pair' }
  ]
};

KNOWLEDGE_BASE['FMA7203'] = {
  ...KNOWLEDGE_BASE['FMA7204'],
  conceptId: 'FMA7203',
  canonicalName: 'Kidneys (Bilateral)',
  overview:
    'The kidneys are paired retroperitoneal bean-shaped excretory organs located on either side of the vertebral column (T12–L3). They filter blood to excrete metabolic wastes, regulate fluid and electrolyte balances, and maintain blood pressure via renin secretion.',
  relatedStructures: [
    { conceptId: 'FMA7204', name: 'Right kidney', relationship: 'Right retroperitoneal kidney' },
    { conceptId: 'FMA7205', name: 'Left kidney', relationship: 'Left retroperitoneal kidney' },
    { conceptId: 'FMA15900', name: 'Urinary bladder', relationship: 'Ureters convey urine from kidneys to bladder' }
  ]
};

/**
 * Resolver that finds direct knowledge or contextual parent organ relationships.
 */
export function findKnowledgeForConcept(
  conceptId: string,
  partId?: string,
  atlasConcepts?: Concept[],
  atlasParts?: Map<string, Part>
): {
  entry: AnatomicalKnowledgeEntry | null;
  parentConcept: Concept | null;
} {
  // 1. Direct hit in knowledge base
  if (KNOWLEDGE_BASE[conceptId]) {
    return { entry: KNOWLEDGE_BASE[conceptId], parentConcept: null };
  }

  // 2. Check if part belongs to any known concept in KNOWLEDGE_BASE
  if (partId && atlasConcepts) {
    const parent = atlasConcepts.find(
      c => KNOWLEDGE_BASE[c.id] && c.id !== conceptId && c.elements.includes(partId)
    );
    if (parent) {
      return { entry: null, parentConcept: parent };
    }
  }

  // 3. Fallback: check if part's conceptId maps to knowledge
  if (partId && atlasParts) {
    const p = atlasParts.get(partId);
    if (p && p.conceptId && KNOWLEDGE_BASE[p.conceptId]) {
      return { entry: KNOWLEDGE_BASE[p.conceptId], parentConcept: null };
    }
  }

  return { entry: null, parentConcept: null };
}
