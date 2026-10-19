import type { Concept, Part, SystemId } from './anatomy';
import { getCitationSource } from './citations.ts';

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
    sources: [getCitationSource('heart'), getCitationSource('grays_anatomy')],
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
    sources: [getCitationSource('cerebral_cortex')],
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
    sources: [getCitationSource('liver_anatomy')],
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
    sources: [getCitationSource('stomach')],
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
    sources: [getCitationSource('lungs')],
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
    sources: [getCitationSource('lungs')],
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
    sources: [getCitationSource('kidneys'), getCitationSource('renal_physiology')],
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
    sources: [getCitationSource('kidneys'), getCitationSource('renal_physiology')],
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
    sources: [getCitationSource('femur')],
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
    sources: [getCitationSource('femur')],
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
    sources: [getCitationSource('humerus')],
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
    sources: [getCitationSource('humerus')],
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
    sources: [getCitationSource('skull')],
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
    sources: [getCitationSource('vertebral_column')],
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
    sources: [getCitationSource('spinal_cord')],
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
    sources: [getCitationSource('trachea')],
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
    sources: [getCitationSource('diaphragm')],
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
    sources: [getCitationSource('spleen')],
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
    sources: [getCitationSource('pancreas')],
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
    sources: [getCitationSource('urinary_bladder')],
    verificationStatus: 'verified'
  },

  // 21. AORTA (FMA3734)
  FMA3734: {
    conceptId: 'FMA3734',
    canonicalName: 'Aorta',
    anatomicalSystem: 'arterial',
    overview:
      'The aorta is the largest systemic artery in the human body, originating from the left ventricle of the heart and distributing oxygenated blood under high hydrostatic pressure throughout the systemic circulation via its thoracic and abdominal segments.',
    location:
      'Extends from the aortic root at the base of the left ventricle in the middle mediastinum, arches superiorly and posteriorly over the pulmonary vessels, descends through the posterior mediastinum, passes through the aortic hiatus of the diaphragm (T12), and continues in the retroperitoneum down to the L4 vertebral level, where it bifurcates into the common iliac arteries.',
    anatomicalFeatures: [
      'Ascending aorta: Originates at the aortic valve orifice with the aortic root and sinuses of Valsalva, giving off the right and left coronary arteries.',
      'Aortic arch: Traverses the superior mediastinum from right-to-left and anterior-to-posterior, giving rise to three major systemic trunks: the brachiocephalic artery, left common carotid artery, and left subclavian artery.',
      'Thoracic descending aorta: Courses through the posterior mediastinum anterior and left of the vertebral column, giving off posterior intercostal, bronchial, esophageal, and superior phrenic arteries.',
      'Abdominal aorta: Retroperitoneal continuation distal to the T12 diaphragmatic hiatus; branches into visceral trunks (celiac trunk, superior mesenteric, inferior mesenteric) and paired renal, gonadal, and lumbar arteries before bifurcating at L4.',
      'Arterial wall architecture: Composed of three distinct tunics (intima, media, adventitia); the thick tunica media is rich in concentric elastic lamellae providing the Windkessel effect to dampen pulsatile pressure fluctuations.'
    ],
    function:
      'Transports the entire stroke volume of oxygenated blood pumped by the left ventricle to all systemic organs, vascular beds, and extremities. Its high elastic compliance accommodates systolic ejection and maintains forward diastolic perfusion pressure.',
    relatedStructures: [
      { conceptId: 'FMA7088', name: 'Heart', relationship: 'Arises directly from the aortic valve orifice of the left ventricle' },
      { conceptId: 'FMA8612', name: 'Pulmonary trunk', relationship: 'Ascending aorta ascends adjacent to and slightly to the right of the pulmonary trunk' },
      { conceptId: 'FMA7131', name: 'Esophagus', relationship: 'Descending aorta descends posterior to and then to the left of the esophagus' },
      { conceptId: 'FMA13295', name: 'Diaphragm', relationship: 'Traverses the aortic hiatus anterior to the T12 vertebral body' }
    ],
    clinicalNotes:
      'Aortic dissection involves a tear in the tunica intima allowing blood to surge into the tunica media, creating a false lumen (classified by Stanford criteria into Type A involving the ascending aorta and Type B confined to the descending aorta). Abdominal aortic aneurysm (AAA), commonly linked to atherosclerosis and connective tissue degeneration, poses risk of catastrophic rupture when vessel diameter exceeds critical thresholds.',
    sources: [getCitationSource('aorta_thorax'), getCitationSource('grays_anatomy')],
    verificationStatus: 'verified'
  },

  // 22. ESOPHAGUS (FMA7131)
  FMA7131: {
    conceptId: 'FMA7131',
    canonicalName: 'Esophagus',
    anatomicalSystem: 'digestive',
    overview:
      'The esophagus is a muscular conducting tube approximately 25 cm in length connecting the pharynx to the stomach, specialized for the coordinated, peristaltic transit of ingested food boluses and liquids.',
    location:
      'Originates in the neck at the inferior border of the cricoid cartilage (C6 level), descends through the superior and posterior mediastinum posterior to the trachea and pericardium, traverses the diaphragm at the esophageal hiatus (T10), and terminates at the gastric cardia (T11).',
    anatomicalFeatures: [
      'Cervical esophagus (C6–T1): Lies posterior to the trachea and anterior to the prevertebral fascia, accompanied laterally by carotid sheaths and recurrent laryngeal nerves.',
      'Thoracic esophagus (T1–T10): Longest segment, passing through the superior and posterior mediastinum; crossed anteriorly by the left main bronchus and aortic arch.',
      'Abdominal esophagus (T10–T11): Short 1.5–2 cm intraperitoneal segment terminating at the gastroesophageal junction (Z-line).',
      'Muscular transition: Proximal upper third is composed entirely of striated skeletal muscle, middle third is a mixture of skeletal and smooth muscle, and distal lower third is exclusively involuntary smooth muscle.',
      'Physiological constrictions: Three anatomical narrowings: cervical (pharyngoesophageal junction / upper esophageal sphincter, C6), thoracic/bronchoaortic (crossing of aortic arch and left main bronchus, T4/T5), and diaphragmatic (traversing the esophageal hiatus, T10).'
    ],
    function:
      'Transports ingested material from the hypopharynx to the stomach via coordinated primary and secondary peristaltic contraction waves regulated by the vagus nerve and enteric myenteric (Auerbach) plexus, while preventing gastric retrograde acid reflux via the lower esophageal sphincter (LES).',
    relatedStructures: [
      { conceptId: 'FMA7394', name: 'Trachea', relationship: 'Courses immediately anterior to the upper and middle thoracic esophagus' },
      { conceptId: 'FMA7088', name: 'Heart', relationship: 'Left atrium lies directly anterior to the mid-thoracic esophagus' },
      { conceptId: 'FMA7148', name: 'Stomach', relationship: 'Direct continuous entry into the gastric cardia at the T11 level' },
      { conceptId: 'FMA13295', name: 'Diaphragm', relationship: 'Traverses the esophageal hiatus formed by the right crus at T10' }
    ],
    clinicalNotes:
      'Gastroesophageal reflux disease (GERD) results from transient or persistent incompetence of the lower esophageal sphincter, leading to acid mucosal irritation (heartburn) and potentially Barrett esophagus (intestinal metaplasia of stratified squamous mucosa to specialized columnar epithelium), a risk factor for esophageal adenocarcinoma. Esophageal varices develop in the distal esophageal venous submucosa in portal hypertension due to porto-systemic anastomoses between left gastric and azygos veins.',
    sources: [getCitationSource('esophagus')],
    verificationStatus: 'verified'
  },

  // 23. GALLBLADDER (FMA7202)
  FMA7202: {
    conceptId: 'FMA7202',
    canonicalName: 'Gallbladder',
    anatomicalSystem: 'digestive',
    overview:
      'The gallbladder is a pear-shaped intraperitoneal sac situated on the visceral surface of the liver, functioning as a storage and concentration reservoir for hepatic bile between meals.',
    location:
      'Right upper quadrant (RUQ) of the abdomen, resting in the shallow gallbladder fossa on the inferior visceral surface of the liver between the right anatomical lobe and the quadrate lobe (segments IV and V).',
    anatomicalFeatures: [
      'Fundus: Rounded anterior projection extending beyond the inferior liver margin, classically projecting at the tip of the right ninth costal cartilage in the midclavicular line.',
      'Body: Central portion extending posterosuperiorly, resting against the duodenum and transverse colon.',
      'Neck: Narrowed, tapered portion that curves toward the porta hepatis; mucosal folds form the spiral valve of Heister.',
      'Cystic duct: Carries bile bidirectionally between the gallbladder neck and the common hepatic duct to form the common bile duct.',
      'Mucosal concentration: Highly folded rugae lined by simple columnar epithelium with apical microvilli that absorb water and electrolytes, concentrating bile up to five- to ten-fold.'
    ],
    function:
      'Stores 30 to 50 mL of hepatic bile and actively concentrates it by absorbing sodium, chloride, and water. Upon entry of dietary lipids and amino acids into the duodenum, duodenal I cells secrete cholecystokinin (CCK), which stimulates gallbladder smooth muscle contraction and relaxes the sphincter of Oddi, discharging concentrated bile into the duodenum for fat emulsification.',
    relatedStructures: [
      { conceptId: 'FMA7197', name: 'Liver', relationship: 'Rests directly in the gallbladder fossa on the visceral surface of the liver' },
      { conceptId: 'FMA7206', name: 'Duodenum', relationship: 'Cystic duct joins common hepatic duct to discharge bile into the duodenum via the common bile duct' }
    ],
    clinicalNotes:
      'Cholelithiasis (gallstones) forms when bile composition becomes supersaturated with cholesterol or bilirubin pigments. Impaction of a stone within the cystic duct causes biliary colic and acute cholecystitis (characterized by Murphy sign: inspiratory arrest during deep palpation of the right upper quadrant). Gallstone migration into the common bile duct (choledocholithiasis) can cause obstructive jaundice or acute gallstone pancreatitis.',
    sources: [getCitationSource('gallbladder')],
    verificationStatus: 'verified'
  },

  // 24. DUODENUM (FMA7206)
  FMA7206: {
    conceptId: 'FMA7206',
    canonicalName: 'Duodenum',
    anatomicalSystem: 'digestive',
    overview:
      'The duodenum is the initial, shortest (approximately 25 cm), and widest segment of the small intestine, forming a C-shaped loop around the head of the pancreas where gastric chyme mixes with biliary and pancreatic digestive secretions.',
    location:
      'Epigastric and umbilical regions of the abdomen, spanning vertebral levels L1 through L3; predominantly retroperitoneal except for the mobile initial duodenal bulb.',
    anatomicalFeatures: [
      'Superior part (first part / D1, ~5 cm): Extends from the gastric pylorus to the neck of the gallbladder at L1; includes the intraperitoneal duodenal bulb.',
      'Descending part (second part / D2, ~7.5 cm): Descends retroperitoneally along the right side of L1–L3; contains the major duodenal papilla (of Vater) where the common bile duct and main pancreatic duct empty.',
      'Horizontal part (third part / D3, ~10 cm): Crosses retroperitoneally from right to left across the anterior aspect of the IVC and abdominal aorta at the level of L3, passed anteriorly by the superior mesenteric vessels.',
      'Ascending part (fourth part / D4, ~2.5 cm): Ascends to the level of L2 along the left side of the aorta, terminating at the duodenojejunal flexure supported by the suspensory ligament of Treitz.',
      'Brunner glands: Submucosal branched glands located in the duodenal wall that secrete alkaline mucus rich in bicarbonate to protect against acidic gastric chyme.'
    ],
    function:
      'Receives acidic chyme from the stomach through the pyloric sphincter; neutralizes stomach acid via pancreatic bicarbonate and Brunner gland secretions; mixes chyme with bile and pancreatic enzymes (lipase, amylase, trypsinogen) to initiate primary chemical digestion and early absorption of iron, calcium, and nutrients.',
    relatedStructures: [
      { conceptId: 'FMA7148', name: 'Stomach', relationship: 'Continuous proximally with the pyloric canal of the stomach' },
      { conceptId: 'FMA7198', name: 'Pancreas', relationship: 'C-shaped loop cradles and adheres to the head of the pancreas' },
      { conceptId: 'FMA7202', name: 'Gallbladder', relationship: 'Receives concentrated bile from the biliary tract via the major duodenal papilla' },
      { conceptId: 'FMA7197', name: 'Liver', relationship: 'Connected to the liver porta hepatis via the hepatoduodenal ligament containing the portal triad' }
    ],
    clinicalNotes:
      'Duodenal peptic ulcers occur most frequently in the first part (duodenal bulb) due to Helicobacter pylori infection or nonsteroidal anti-inflammatory drug (NSAID) use; anterior ulcer perforation causes peritonitis and free air under the diaphragm, while posterior ulcer erosion into the gastroduodenal artery can produce massive upper gastrointestinal hemorrhage. Superior mesenteric artery (SMA) syndrome results from compression of the third part of the duodenum between the abdominal aorta and overlying SMA.',
    sources: [getCitationSource('duodenum'), getCitationSource('small_intestine')],
    verificationStatus: 'verified'
  },

  // 25. SUPERIOR VENA CAVA (FMA4720)
  FMA4720: {
    conceptId: 'FMA4720',
    canonicalName: 'Superior vena cava',
    anatomicalSystem: 'venous',
    overview:
      'The superior vena cava (SVC) is a large, valveless venous conduit approximately 7 cm long and 2 cm in diameter that collects deoxygenated blood from the upper half of the body (head, neck, upper extremities, and thoracic wall) and delivers it into the right atrium of the heart.',
    location:
      'Superior and middle mediastinum in the right thoracic cavity, extending from the level of the lower border of the first right costal cartilage down to the right atrium at the level of the third right costal cartilage.',
    anatomicalFeatures: [
      'Formation: Formed behind the lower border of the right first costal cartilage by the confluence of the right and left brachiocephalic (innominate) veins.',
      'Azygos arch tributary: The azygos vein arches anteriorly over the root of the right lung to enter the posterior wall of the SVC just before it enters the pericardium.',
      'Pericardial reflection: The lower half of the SVC is enclosed within the fibrous pericardial sac and lined by serous pericardium.',
      'Valveless design: Lacks internal valves, allowing central venous pressure waveforms from the right atrium to be transmitted retrogradely to the internal jugular veins.'
    ],
    function:
      'Channels high-flow systemic venous return (~2.5 liters/min at rest) from cranial, cervical, upper limb, and thoracic parietal circuits directly into the right atrium, maintaining cardiac preload for the right ventricle.',
    relatedStructures: [
      { conceptId: 'FMA7088', name: 'Heart', relationship: 'Terminates in the posterosuperior aspect of the right atrium' },
      { conceptId: 'FMA3736', name: 'Ascending aorta', relationship: 'Ascending aorta lies immediately anteromedial to the SVC' },
      { conceptId: 'FMA7309', name: 'Right lung', relationship: 'Abuts the medial mediastinal surface of the right lung' },
      { conceptId: 'FMA7394', name: 'Trachea', relationship: 'Trachea lies posteromedial to the upper portion of the SVC' }
    ],
    clinicalNotes:
      'Superior vena cava syndrome occurs when extrinsic compression (most commonly by mediastinal neoplasms such as non-small cell lung cancer, small cell lung cancer, or lymphoma) or thrombosis impairs venous return, resulting in facial and upper extremity edema, cyanosis, and dilated superficial collateral veins over the anterior chest wall. Central venous catheterization via the internal jugular or subclavian vein targets the cavoatrial junction for central venous pressure monitoring or vasoactive infusions.',
    sources: [getCitationSource('svc')],
    verificationStatus: 'verified'
  },

  // 26. INFERIOR VENA CAVA (FMA10951)
  FMA10951: {
    conceptId: 'FMA10951',
    canonicalName: 'Inferior vena cava',
    anatomicalSystem: 'venous',
    overview:
      'The inferior vena cava (IVC) is the largest vein in the human body, conducting deoxygenated venous blood from all tissues and organs below the diaphragm back to the right atrium of the heart.',
    location:
      'Retroperitoneal space along the posterior abdominal wall, anterior to the lumbar spine and immediately to the right of the abdominal aorta, ascending through the caval opening of the diaphragmatic central tendon at T8 to enter the right atrium.',
    anatomicalFeatures: [
      'Formation: Formed anterior to the L5 vertebral body by the confluence of the bilateral common iliac veins, posterior and slightly right of the aortic bifurcation.',
      'Abdominal course: Ascends vertically in the retroperitoneum along the right psoas major and right sympathetic trunk, grooving the posterior visceral surface of the liver in the bare area.',
      'Major tributaries: Receives lumbar veins, right gonadal vein, bilateral renal veins (with the longer left renal vein crossing anterior to the aorta), right suprarenal vein, inferior phrenic veins, and three large hepatic veins draining the liver.',
      'Caval opening: Passes through the central tendon of the diaphragm at the level of the T8 vertebra; contraction of the diaphragm during inspiration dilates the opening, facilitating venous return.'
    ],
    function:
      'Collects and channels venous return from the lower extremities, pelvic viscera, abdominal wall, and abdominal organs (including the hepatic venous outflow containing filtered portal blood) to the right atrium under low hydrostatic pressure.',
    relatedStructures: [
      { conceptId: 'FMA3734', name: 'Aorta', relationship: 'Runs parallel and immediately to the right of the abdominal aorta' },
      { conceptId: 'FMA7088', name: 'Heart', relationship: 'Empties into the posteroinferior aspect of the right atrium' },
      { conceptId: 'FMA7197', name: 'Liver', relationship: 'Courses through a deep groove on the posterior surface of the liver, receiving the hepatic veins' },
      { conceptId: 'FMA13295', name: 'Diaphragm', relationship: 'Traverses the caval opening in the central tendon of the diaphragm at T8' }
    ],
    clinicalNotes:
      'Deep vein thrombosis (DVT) originating in the deep veins of the lower extremity can embolize through the IVC to occlude the pulmonary arterial tree (pulmonary embolism). In patients with contraindications to anticoagulation, an IVC filter can be deployed percutaneously into the infrarenal IVC to trap ascending thrombi. IVC compression by a gravid uterus during the third trimester of pregnancy can cause supine hypotensive syndrome.',
    sources: [getCitationSource('ivc')],
    verificationStatus: 'verified'
  },

  // 27. BRAINSTEM (FMA79876)
  FMA79876: {
    conceptId: 'FMA79876',
    canonicalName: 'Brainstem',
    anatomicalSystem: 'nervous',
    overview:
      'The brainstem is the stalk-like caudal component of the brain connecting the cerebral hemispheres and diencephalon superiorly to the spinal cord inferiorly, consisting of the midbrain, pons, and medulla oblongata.',
    location:
      'Posterior cranial fossa, resting on the clivus of the sphenoid and occipital bones anterior to the cerebellum, extending from the level of the tentorial notch down to the foramen magnum where it becomes continuous with the cervical spinal cord.',
    anatomicalFeatures: [
      'Midbrain (mesencephalon): Rostral segment containing the cerebral peduncles (crura cerebri transmitting descending motor tracts), substantia nigra, red nuclei, cerebral aqueduct, and tectal plate (superior and inferior colliculi).',
      'Pons: Intermediate bulbous segment characterized by prominent transverse pontocerebellar fibers, middle cerebellar peduncles, and the pontine tegmentum containing cranial nerve nuclei V, VI, VII, and VIII.',
      'Medulla oblongata: Caudal segment featuring ventral pyramids transmitting corticospinal fibers (with their pyramidal decussation), lateral olivary eminences (inferior olivary nucleus), and nuclei of cranial nerves IX, X, XI, and XII.',
      'Reticular formation: Diffuse polysynaptic network extending throughout the brainstem core, incorporating the ascending reticular activating system (ARAS) and cardiorespiratory regulatory centers.',
      'Ventricular system: Traversed by the narrow cerebral aqueduct (connecting third and fourth ventricles) and forming the diamond-shaped floor (rhomboid fossa) of the fourth ventricle.'
    ],
    function:
      'Controls vital autonomic vegetative homeostatic functions including respiratory rhythm generation, cardiovascular hemodynamic regulation, and vasomotor tone; conducts all ascending sensory and descending motor axonal pathways between the cerebrum, cerebellum, and periphery; contains nuclei for ten pairs of cranial nerves (CN III through XII).',
    relatedStructures: [
      { conceptId: 'FMA50801', name: 'Brain', relationship: 'Caudal component of the brain, continuous superiorly with the diencephalon' },
      { conceptId: 'FMA67944', name: 'Cerebellum', relationship: 'Directly connected to the cerebellum via superior, middle, and inferior cerebellar peduncles' },
      { conceptId: 'FMA7647', name: 'Spinal cord', relationship: 'Continuous inferiorly with the spinal cord at the foramen magnum' },
      { conceptId: 'FMA46565', name: 'Skull', relationship: 'Rests upon the bony clivus within the posterior cranial fossa' }
    ],
    clinicalNotes:
      'Brainstem strokes (e.g., Wallenberg lateral medullary syndrome caused by posterior inferior cerebellar artery [PICA] occlusion) cause crossed neurological deficits (ipsilateral cranial nerve and Horner syndrome with contralateral body pain/temperature sensory loss). Herniation syndromes (e.g., transtentorial uncal or tonsillar herniation through the foramen magnum) compress brainstem cardiorespiratory centers, causing coma, Cheyne-Stokes respirations, pupillary abnormalities, and fatal respiratory arrest.',
    sources: [getCitationSource('brainstem'), getCitationSource('cerebral_cortex')],
    verificationStatus: 'verified'
  },

  // 28. CEREBELLUM (FMA67944)
  FMA67944: {
    conceptId: 'FMA67944',
    canonicalName: 'Cerebellum',
    anatomicalSystem: 'nervous',
    overview:
      'The cerebellum ("little brain") is a major structure of the hindbrain located in the posterior cranial fossa, dedicated to motor coordination, precise timing, motor learning, postural balance, and vestibulo-ocular reflexes.',
    location:
      'Posterior cranial fossa, positioned dorsal to the pons and medulla oblongata and inferior to the tentorium cerebelli (a dural fold that separates it from the occipital lobes of the cerebral hemispheres).',
    anatomicalFeatures: [
      'Hemispheres and Vermis: Composed of two lateral cerebellar hemispheres united along the midline by the narrow, worm-like vermis.',
      'Cortex and Folia: Highly folded cortical surface composed of tightly packed parallel transverse gyri (folia) organized into a three-layered cortex (molecular layer, Purkinje cell layer, and granular layer).',
      'Deep cerebellar nuclei: Four bilateral pairs of subcortical nuclei embedded within the central white matter: fastigial, globose, emboliform, and dentate nuclei.',
      'Cerebellar peduncles: Three bilateral bundles of white matter tracts connecting the cerebellum to the brainstem: superior peduncle (main output to thalamus and midbrain), middle peduncle (massive mossy fiber input from pontine nuclei), and inferior peduncle (vestibular and olivary climbing fiber inputs).',
      'Arbor vitae: Characteristic tree-like branching pattern of cerebellar white matter visible in sagittal cross-sections.'
    ],
    function:
      'Acts as a neural comparator comparing intended motor commands from the motor cortex with actual peripheral somatosensory and vestibular feedback, computing error corrections to smooth out voluntary movements, maintain equilibrium, regulate muscle tone, and consolidate motor skills (such as typing or riding a bicycle).',
    relatedStructures: [
      { conceptId: 'FMA79876', name: 'Brainstem', relationship: 'Connected to the midbrain, pons, and medulla via the three cerebellar peduncles' },
      { conceptId: 'FMA50801', name: 'Brain', relationship: 'Separated from the cerebral occipital lobes by the tentorium cerebelli' },
      { conceptId: 'FMA46565', name: 'Skull', relationship: 'Housed within the infratentorial compartment of the posterior cranial fossa' }
    ],
    clinicalNotes:
      'Cerebellar lesions (from stroke, multiple sclerosis, or chronic ethanol toxicity damaging the anterior cerebellar vermis) do not cause motor paralysis, but produce ipsilateral ataxia, dysmetria (past-pointing), dysdiadochokinesia (impaired rapid alternating movements), intention tremor, scanning speech, and nystagmus.',
    sources: [getCitationSource('cerebellum')],
    verificationStatus: 'verified'
  },

  // 29. PULMONARY TRUNK (FMA8612)
  FMA8612: {
    conceptId: 'FMA8612',
    canonicalName: 'Pulmonary trunk',
    anatomicalSystem: 'arterial',
    overview:
      'The pulmonary trunk (pulmonary artery trunk) is the thick, short systemic arterial vessel (~5 cm long and 3 cm wide) that carries deoxygenated blood from the right ventricle of the heart to the lungs for oxygenation and carbon dioxide elimination.',
    location:
      'Middle mediastinum, emerging from the conus arteriosus (infundibulum) of the right ventricle anterior to the ascending aorta, ascending posterolaterally to the left of the aorta beneath the aortic arch, where it bifurcates at the level of the T5 vertebra into the right and left pulmonary arteries.',
    anatomicalFeatures: [
      'Pulmonary orifice and valve: Guarded by the pulmonary semilunar valve comprising three fibrous cusps (anterior, right, and left) that prevent diastolic regurgitation into the right ventricle.',
      'Pericardial sleeve: Contained entirely within the fibrous pericardial sac enclosed in a common serous sheath alongside the ascending aorta.',
      'Bifurcation: Divides at the concavity of the aortic arch into the right pulmonary artery (longer, passing posterior to the ascending aorta and SVC to enter the right lung root) and left pulmonary artery (shorter, passing anterior to the descending aorta to enter the left lung root).',
      'Ligamentum arteriosum: Fibrous cord connecting the superior surface of the bifurcation to the concavity of the aortic arch, representing the obliterated ductus arteriosus.'
    ],
    function:
      'Transports the entire deoxygenated cardiac output from the right ventricle into the low-resistance pulmonary vascular bed, initiating pulmonary circulation for alveolar respiratory gas exchange.',
    relatedStructures: [
      { conceptId: 'FMA7088', name: 'Heart', relationship: 'Originates directly from the conus arteriosus of the right ventricle' },
      { conceptId: 'FMA3734', name: 'Aorta', relationship: 'Ascends anterior and left of the ascending aorta, connected to arch by ligamentum arteriosum' },
      { conceptId: 'FMA7309', name: 'Right lung', relationship: 'Right branch delivers deoxygenated blood to the right lung root' },
      { conceptId: 'FMA7310', name: 'Left lung', relationship: 'Left branch delivers deoxygenated blood to the left lung root' }
    ],
    clinicalNotes:
      'Pulmonary embolism (PE) occurs when a thrombus (commonly originating from lower extremity deep veins) dislodges and occludes the pulmonary trunk or its branches. A massive "saddle embolus" straddling the bifurcation of the pulmonary trunk can cause acute right ventricular strain, cardiogenic shock, and electromechanical dissociation. Pulmonary arterial hypertension (PAH) leads to pathological remodeling and right heart failure (cor pulmonale).',
    sources: [getCitationSource('pulmonary_arteries'), getCitationSource('grays_anatomy')],
    verificationStatus: 'verified'
  },

  // 30. STERNUM (FMA7485)
  FMA7485: {
    conceptId: 'FMA7485',
    canonicalName: 'Sternum',
    anatomicalSystem: 'skeletal',
    overview:
      'The sternum (breastbone) is a flat, elongated osseous bone situated in the anterior midline of the thoracic wall, forming the anterior anchor of the thoracic cage and protecting vital mediastinal viscera including the heart and great vessels.',
    location:
      'Anterior thoracic midline, extending vertically from the level of the T2/T3 intervertebral disc down to the T9/T10 vertebral level.',
    anatomicalFeatures: [
      'Manubrium: Broad, quadrangular superior segment; features a palpable superior jugular (suprasternal) notch, bilateral clavicular notches (articulating with the clavicles at sternoclavicular joints), and facet notches for the first costal cartilages.',
      'Sternal angle (angle of Louis): Prominent transverse ridge marking the fibrocartilaginous manubriosternal joint at the level of the T4/T5 intervertebral disc; articulates with the second costal cartilage and serves as a major anatomical landmark.',
      'Body (mesosternum): Elongated, flat central segment possessing lateral costal articular facets for costal cartilages 3 through 7.',
      'Xiphoid process: Small, cartilaginous or ossified inferior terminal projection at the T9/T10 level, providing attachment for the rectus abdominis muscle, transversus abdominis aponeurosis, and linea alba.',
      'Hematopoietic red bone marrow: Retains active hematopoietic trabecular red marrow throughout adulthood.'
    ],
    function:
      'Provides anterior structural stability and protection for the heart, ascending aorta, pulmonary trunk, and lungs; serves as an anterior rigid pivot for costal cartilage articulation during respiratory pump-handle thoracic expansion; serves as an attachment site for major muscles (pectoralis major, sternocleidomastoid, rectus abdominis).',
    relatedStructures: [
      { conceptId: 'FMA7088', name: 'Heart', relationship: 'Directly overlies the anterior pericardium and ventricles' },
      { conceptId: 'FMA7574', name: 'Ribs', relationship: 'Articulates with true ribs 1 through 7 via their respective costal cartilages' },
      { conceptId: 'FMA13295', name: 'Diaphragm', relationship: 'Provides sternal origin attachment for anterior diaphragmatic fibers via the xiphoid process' }
    ],
    clinicalNotes:
      'Median sternotomy is the standard vertical surgical incision through the sternum used to gain access to the heart and mediastinum for open-heart operations (such as coronary artery bypass grafting or valve replacement). Sternal fracture typically results from high-energy blunt anterior chest trauma (e.g., motor vehicle dashboard or steering wheel impact) and demands clinical evaluation for underlying myocardial contusion or aortic injury.',
    sources: [getCitationSource('sternum')],
    verificationStatus: 'verified'
  },

  // 31. RIBS (FMA7574)
  FMA7574: {
    conceptId: 'FMA7574',
    canonicalName: 'Ribs',
    anatomicalSystem: 'skeletal',
    overview:
      'The ribs are 12 pairs of curved, flat, highly elastic bones that form the lateral and posterior skeletal framework of the thoracic cage, shielding the cardiopulmonary organs and facilitating respiratory ventilation.',
    location:
      'Bilateral thoracic wall, extending circumferentially from their posterior articulations with the 12 thoracic vertebrae (T1–T12) around to the anterior chest wall.',
    anatomicalFeatures: [
      'True ribs (vertebrosternal, ribs 1–7): Articulate directly with the sternum via their own individual costal cartilages.',
      'False ribs (vertebrochondral, ribs 8–10): Their costal cartilages fuse with the cartilage of the rib immediately above, forming the anterior costal margin.',
      'Floating ribs (vertebral, ribs 11–12): Possess free anterior cartilaginous tips that do not connect to the sternum or costal margin, ending in the posterior abdominal wall musculature.',
      'Typical rib structure (ribs 3–9): Consists of a head (possessing two articular demifacets for adjacent vertebral bodies and intervertebral disc), neck, tubercle (articulating with the vertebral transverse process), angle (point of sharp anterior curvature), shaft, and costal groove on the inferior internal border protecting the intercostal neurovascular bundle (vein, artery, nerve: "VAN").'
    ],
    function:
      'Encloses and protects thoracic organs (heart, lungs, great vessels) and upper abdominal viscera (liver, spleen, stomach, kidneys); provides osseous attachments for intercostal and pectoral muscles; enables bucket-handle (transverse) and pump-handle (anterior-posterior) volume expansion of the thoracic cavity during breathing.',
    relatedStructures: [
      { conceptId: 'FMA13478', name: 'Vertebral column', relationship: 'Articulates posteriorly with thoracic vertebrae at costovertebral and costotransverse joints' },
      { conceptId: 'FMA7485', name: 'Sternum', relationship: 'Ribs 1 through 7 connect anteriorly to the sternum via costal cartilages' },
      { conceptId: 'FMA7309', name: 'Right lung', relationship: 'Surrounds and protects the right lung and pleura' },
      { conceptId: 'FMA7310', name: 'Left lung', relationship: 'Surrounds and protects the left lung and pleura' }
    ],
    clinicalNotes:
      'Rib fractures are the most frequent chest injuries in blunt trauma; fractures of ribs 4 through 9 are most common, while lower rib fractures (10–12) raise concern for traumatic laceration of the spleen (left) or liver (right). Flail chest occurs when three or more adjacent ribs are fractured in two or more places, creating an unstable paradoxical segment that impairs ventilation. Thoracentesis and chest tube insertion are performed along the superior border of a rib to avoid the neurovascular bundle in the subcostal groove.',
    sources: [getCitationSource('ribs')],
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
  location:
    'Bilateral lower extremities, extending within each thigh between the pelvic acetabulum (hip joint) proximally and the knee joint (articulating with the patella and tibia) distally.',
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
  location:
    'Bilateral upper extremities, extending within each arm between the shoulder (glenohumeral) joint proximally and the elbow (cubital) joint distally.',
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
  location:
    'Retroperitoneal space along the posterior abdominal wall on either side of the vertebral column (T12–L3), flanking the psoas major muscles. The right kidney lies slightly lower and relates anteriorly to the liver, duodenum, and ascending colon; the left kidney relates anteriorly to the stomach, spleen, pancreas tail, and descending colon.',
  relatedStructures: [
    { conceptId: 'FMA7204', name: 'Right kidney', relationship: 'Right retroperitoneal kidney' },
    { conceptId: 'FMA7205', name: 'Left kidney', relationship: 'Left retroperitoneal kidney' },
    { conceptId: 'FMA15900', name: 'Urinary bladder', relationship: 'Ureters convey urine from kidneys to bladder' }
  ]
};

// Aliases for Aortic Segments & Rib Cage:
KNOWLEDGE_BASE['FMA3736'] = {
  ...KNOWLEDGE_BASE['FMA3734'],
  conceptId: 'FMA3736',
  canonicalName: 'Ascending aorta',
  overview:
    'The ascending aorta is the initial intrapericardial segment of the aorta, beginning at the aortic root of the left ventricle and continuing to the origin of the brachiocephalic trunk where it becomes the aortic arch.',
  location:
    'Middle mediastinum within the pericardial sac, extending obliquely superiorly, anteriorly, and to the right from the base of the left ventricle at the level of the third left costal cartilage to the upper border of the second right costal cartilage.',
  anatomicalFeatures: [
    'Aortic sinuses (of Valsalva): Three dilatations of the aortic root directly superior to the aortic valve cusps, giving rise to the left and right coronary arteries.',
    'Sinotubular junction: Distinct anatomical transition between the bulbous aortic root and the cylindrical ascending aorta.',
    'Pericardial sleeve: Enclosed within a common sheath of serous pericardium shared with the adjacent pulmonary trunk.'
  ],
  function:
    'Receives the left ventricular systolic stroke volume under peak hemodynamic pressure, channels blood superiorly toward the arch, and fills coronary arteries during ventricular diastole via elastic recoil in the aortic sinuses.',
  relatedStructures: [
    { conceptId: 'FMA7088', name: 'Heart', relationship: 'Originates directly from the left ventricle' },
    { conceptId: 'FMA8612', name: 'Pulmonary trunk', relationship: 'Ascends adjacent to and right of the pulmonary trunk' },
    { conceptId: 'FMA3768', name: 'Arch of aorta', relationship: 'Continuous distally with the aortic arch at the sternal angle' }
  ],
  clinicalNotes:
    'Stanford Type A aortic dissection originates in or involves the ascending aorta and is a surgical emergency due to risk of pericardial tamponade, acute aortic valve regurgitation, or coronary malperfusion.'
};

KNOWLEDGE_BASE['FMA3768'] = {
  ...KNOWLEDGE_BASE['FMA3734'],
  conceptId: 'FMA3768',
  canonicalName: 'Arch of aorta',
  overview:
    'The arch of the aorta is the curved segment of the systemic arterial trunk connecting the ascending aorta to the descending thoracic aorta, spanning across the superior mediastinum.',
  location:
    'Superior mediastinum, arching posterosuperiorly and to the left anterior to the trachea and esophagus, reaching the left side of the T4 vertebral body at the sternal angle of Louis.',
  anatomicalFeatures: [
    'Brachiocephalic artery: First and largest branch, dividing into right subclavian and right common carotid arteries.',
    'Left common carotid artery: Second branch, ascending to supply the left side of the neck, head, and encephalon.',
    'Left subclavian artery: Third branch, ascending to supply the left upper extremity and vertebral artery.',
    'Ligamentum arteriosum: Fibrous remnant of the fetal ductus arteriosus connecting the inferior aspect of the arch to the pulmonary trunk bifurcation.'
  ],
  function:
    'Channels systemic blood flow from the anterior mediastinum to the posterior thoracic cavity while supplying the head, neck, upper extremities, and brain.',
  relatedStructures: [
    { conceptId: 'FMA3734', name: 'Aorta', relationship: 'Transitional curved segment of the greater aorta' },
    { conceptId: 'FMA7394', name: 'Trachea', relationship: 'Arches anterior and leftward across the lower trachea' },
    { conceptId: 'FMA7131', name: 'Esophagus', relationship: 'Passes to the left of the esophagus' },
    { conceptId: 'FMA8612', name: 'Pulmonary trunk', relationship: 'Connected to the pulmonary bifurcation via the ligamentum arteriosum' }
  ],
  clinicalNotes:
    'Coarctation of the aorta is a congenital narrowing typically located near the ductus arteriosus / ligamentum arteriosum, causing upper-extremity hypertension, diminished femoral pulses, and collateral intercostal arterial hypertrophy (producing rib notching).'
};

KNOWLEDGE_BASE['FMA3784'] = {
  ...KNOWLEDGE_BASE['FMA3734'],
  conceptId: 'FMA3784',
  canonicalName: 'Descending aorta',
  overview:
    'The descending aorta is the longest continuous portion of the aorta, beginning at the termination of the aortic arch at the T4 vertebral level and extending through both the posterior mediastinum (thoracic aorta) and retroperitoneal abdomen (abdominal aorta) down to its terminal bifurcation at L4.',
  location:
    'Thoracic posterior mediastinum and retroperitoneal abdominal cavity, coursing anterior and slightly left of the vertebral column from T4 down to L4.',
  anatomicalFeatures: [
    'Thoracic descending segment: Lies in the posterior mediastinum from T4 to T12, giving rise to paired posterior intercostal arteries, subcostal arteries, and visceral bronchial and esophageal branches.',
    'Aortic hiatus: Traverses the diaphragm at the T12 vertebral level accompanied by the thoracic duct and azygos vein.',
    'Abdominal descending segment: Courses retroperitoneally from T12 to L4, distributing blood to abdominal viscera, the abdominal wall, and lower extremities.'
  ],
  function:
    'Delivers oxygenated blood to the thoracic wall and viscera, spinal cord, abdominal organs, pelvic structures, and both lower extremities.',
  relatedStructures: [
    { conceptId: 'FMA3734', name: 'Aorta', relationship: 'Descending continuation of the systemic arterial trunk' },
    { conceptId: 'FMA13478', name: 'Vertebral column', relationship: 'Courses along the anterior and left lateral aspect of thoracic and lumbar vertebrae' },
    { conceptId: 'FMA13295', name: 'Diaphragm', relationship: 'Passes through the diaphragmatic aortic hiatus at T12' }
  ],
  clinicalNotes:
    'Thoracic descending aortic aneurysms and Stanford Type B dissections (originating distal to the left subclavian artery) are managed medically or with thoracic endovascular aortic repair (TEVAR). Compromise of the great radicular artery (of Adamkiewicz) arising from lower intercostal or upper lumbar branches carries risk of spinal cord ischemia.'
};

KNOWLEDGE_BASE['FMA3789'] = {
  ...KNOWLEDGE_BASE['FMA3734'],
  conceptId: 'FMA3789',
  canonicalName: 'Abdominal aorta',
  overview:
    'The abdominal aorta is the final segment of the aorta, situated retroperitoneally between the diaphragmatic aortic hiatus at T12 and its terminal bifurcation into the left and right common iliac arteries at L4.',
  location:
    'Retroperitoneal space of the posterior abdominal wall, anterior to the lumbar vertebral bodies (T12–L4) and immediately to the left of the inferior vena cava.',
  anatomicalFeatures: [
    'Unpaired anterior visceral branches: Celiac trunk (T12), superior mesenteric artery (L1), and inferior mesenteric artery (L3) supplying the foregut, midgut, and hindgut.',
    'Paired lateral visceral branches: Middle suprarenal arteries, renal arteries (L1–L2), and gonadal (testicular or ovarian) arteries.',
    'Parietal branches: Inferior phrenic arteries, four pairs of lumbar arteries, and the median sacral artery.',
    'Terminal bifurcation: Divides at the level of the L4 vertebra into the left and right common iliac arteries.'
  ],
  function:
    'Serves as the principal arterial trunk supplying the entire digestive tract, accessory digestive organs, kidneys, pelvic organs, and lower extremities.',
  relatedStructures: [
    { conceptId: 'FMA3734', name: 'Aorta', relationship: 'Abdominal retroperitoneal portion of the aorta' },
    { conceptId: 'FMA10951', name: 'Inferior vena cava', relationship: 'Runs parallel and immediately to the right of the abdominal aorta' },
    { conceptId: 'FMA7204', name: 'Right kidney', relationship: 'Right renal artery crosses posterior to the IVC to reach right kidney' },
    { conceptId: 'FMA7205', name: 'Left kidney', relationship: 'Left renal artery arises directly from abdominal aorta' }
  ],
  clinicalNotes:
    'Abdominal aortic aneurysms (AAAs) most frequently develop in the infrarenal segment between the renal artery origins and the iliac bifurcation. Rupture presents with the classic triad of sudden severe flank/back pain, hypotension, and a pulsatile abdominal mass.'
};

KNOWLEDGE_BASE['FMA7480'] = {
  ...KNOWLEDGE_BASE['FMA7574'],
  conceptId: 'FMA7480',
  canonicalName: 'Rib cage',
  overview:
    'The rib cage (thoracic cage) is the osteocartilaginous conical framework formed by the 12 thoracic vertebrae posteriorly, 12 pairs of ribs and their costal cartilages anterolaterally, and the sternum anteriorly.',
  location:
    'Torso, enclosing the thoracic cavity between the superior thoracic aperture (thoracic inlet) at the neck base and the inferior thoracic aperture (thoracic outlet) closed by the diaphragm.',
  anatomicalFeatures: [
    'Thoracic skeleton: Formed by 12 pairs of ribs, 12 thoracic vertebrae, intervertebral discs, and the three parts of the sternum.',
    'Costal cartilages: Bars of hyaline cartilage providing elasticity and compliance to the anterior thoracic wall.',
    'Intercostal spaces: 11 pairs of intercostal spaces occupied by intercostal muscles, vessels, and nerves.'
  ],
  function:
    'Protects thoracic and upper abdominal organs, supports the shoulder girdle and upper extremities, and dynamically alters intrathoracic pressure and volume during respiration.',
  relatedStructures: [
    { conceptId: 'FMA7574', name: 'Ribs', relationship: 'Constituent osseous ribs forming the lateral cage' },
    { conceptId: 'FMA7485', name: 'Sternum', relationship: 'Anterior osseous strut of the rib cage' },
    { conceptId: 'FMA13478', name: 'Vertebral column', relationship: 'Posterior axial anchor of the rib cage' }
  ],
  clinicalNotes:
    'Deformities of the thoracic cage include pectus excavatum (funnel chest, concave sternum) and pectus carinatum (pigeon chest, protrusion of the sternum).',
  sources: [getCitationSource('ribs'), getCitationSource('sternum')]
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
