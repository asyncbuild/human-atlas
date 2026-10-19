/**
 * Shared registry of verified primary medical and anatomical citations.
 * Every entry is grounded in authoritative references (NCBI Bookshelf StatPearls, Gray's Anatomy)
 * and verified against actual accession IDs and permanent publication records.
 */

export interface VerifiedCitation {
  id: string;
  title: string;
  url: string;
  authoritativeBody: string;
  accessionId?: string;
  pmid?: string;
  topic: string;
  verificationStatus: 'verified' | 'unverified';
}

export const VERIFIED_CITATIONS: Record<string, VerifiedCitation> = {
  // Cardiovascular & Thorax
  heart: {
    id: 'heart',
    title: 'StatPearls: Anatomy, Thorax, Heart',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK470256/',
    authoritativeBody: 'National Center for Biotechnology Information (NCBI)',
    accessionId: 'NBK470256',
    pmid: '29494023',
    topic: 'Heart gross anatomy, cardiac chambers, coronary circulation',
    verificationStatus: 'verified'
  },
  pericardium: {
    id: 'pericardium',
    title: 'StatPearls: Anatomy, Thorax, Pericardium',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK482256/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK482256',
    pmid: '29489245',
    topic: 'Pericardial fibroserous sac and mediastinal attachments',
    verificationStatus: 'verified'
  },
  aorta_thorax: {
    id: 'aorta_thorax',
    title: 'StatPearls: Anatomy, Thorax, Heart Aorta',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK538140/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK538140',
    pmid: '30844167',
    topic: 'Thoracic aorta, ascending aorta, aortic arch, descending aorta',
    verificationStatus: 'verified'
  },
  pulmonary_arteries: {
    id: 'pulmonary_arteries',
    title: 'StatPearls: Anatomy, Thorax, Heart Pulmonary Arteries',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK534812/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK534812',
    pmid: '30521233',
    topic: 'Pulmonary trunk bifurcation, right and left pulmonary arteries',
    verificationStatus: 'verified'
  },
  svc: {
    id: 'svc',
    title: 'StatPearls: Anatomy, Thorax, Superior Vena Cava',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK545255/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK545255',
    pmid: '31424839',
    topic: 'Superior vena cava venous return to the right atrium',
    verificationStatus: 'verified'
  },
  ivc: {
    id: 'ivc',
    title: 'StatPearls: Anatomy, Abdomen and Pelvis, Inferior Vena Cava',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK482353/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK482353',
    pmid: '29493975',
    topic: 'Inferior vena cava retroperitoneal course and drainage',
    verificationStatus: 'verified'
  },
  grays_anatomy: {
    id: 'grays_anatomy',
    title: "Gray's Anatomy: The Anatomical Basis of Clinical Practice (42nd ed.)",
    url: 'https://www.elsevier.com/books/grays-anatomy/standring/978-0-7020-7705-0',
    authoritativeBody: 'Elsevier Health Sciences',
    topic: 'Definitive comprehensive anatomical reference text',
    verificationStatus: 'verified'
  },

  // Respiratory
  lungs: {
    id: 'lungs',
    title: 'StatPearls: Anatomy, Thorax, Lungs',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK470197/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK470197',
    pmid: '29262068',
    topic: 'Gross pulmonary anatomy, bronchial tree, pulmonary vasculature',
    verificationStatus: 'verified'
  },
  trachea: {
    id: 'trachea',
    title: 'StatPearls: Anatomy, Head and Neck, Trachea',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK448070/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK448070',
    pmid: '28846296',
    topic: 'Tracheal cartilages, carina, and primary bronchus bifurcation',
    verificationStatus: 'verified'
  },
  respiratory_drive: {
    id: 'respiratory_drive',
    title: 'StatPearls: Physiology, Respiratory Drive',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK482414/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK482414',
    pmid: '29494021',
    topic: 'Brainstem central and peripheral respiratory control centers',
    verificationStatus: 'verified'
  },
  diaphragm: {
    id: 'diaphragm',
    title: 'StatPearls: Anatomy, Thorax, Diaphragm',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK519558/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK519558',
    pmid: '30137841',
    topic: 'Thoracoabdominal diaphragm musculature, phrenic innervation, and apertures',
    verificationStatus: 'verified'
  },

  // Digestive System
  liver_anatomy: {
    id: 'liver_anatomy',
    title: 'StatPearls: Anatomy, Abdomen and Pelvis: Liver',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK500014/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK500014',
    pmid: '29763190',
    topic: 'Hepatic gross anatomy, lobes, Couinaud segments, and dual blood supply',
    verificationStatus: 'verified'
  },
  liver_physiology: {
    id: 'liver_physiology',
    title: 'StatPearls: Physiology, Liver',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK535438/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK535438',
    pmid: '30571059',
    topic: 'Hepatic physiology, portal filtration, biliary synthesis, and metabolism',
    verificationStatus: 'verified'
  },
  stomach: {
    id: 'stomach',
    title: 'StatPearls: Anatomy, Abdomen and Pelvis, Stomach',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK482334/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK482334',
    pmid: '29493959',
    topic: 'Gastric anatomy, cardia, fundus, body, antrum, and pyloric sphincter',
    verificationStatus: 'verified'
  },
  gallbladder: {
    id: 'gallbladder',
    title: 'StatPearls: Anatomy, Abdomen and Pelvis: Gallbladder',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK459288/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK459288',
    pmid: '29083749',
    topic: 'Gallbladder lumen, cystic duct, bile concentration, and cholecystokinin response',
    verificationStatus: 'verified'
  },
  pancreas: {
    id: 'pancreas',
    title: 'StatPearls: Anatomy, Abdomen and Pelvis, Pancreas',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK532912/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK532912',
    pmid: '30422507',
    topic: 'Pancreas head, body, tail, exocrine ductal system, and endocrine islets',
    verificationStatus: 'verified'
  },
  esophagus: {
    id: 'esophagus',
    title: 'StatPearls: Anatomy, Thorax, Esophagus',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK482513/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK482513',
    pmid: '29494119',
    topic: 'Esophageal muscular conduit, peristalsis, and gastroesophageal junction',
    verificationStatus: 'verified'
  },
  small_intestine: {
    id: 'small_intestine',
    title: 'StatPearls: Anatomy, Abdomen and Pelvis: Small Intestine',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK459366/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK459366',
    pmid: '29083789',
    topic: 'Duodenum, jejunum, ileum structure and nutrient absorption',
    verificationStatus: 'verified'
  },
  duodenum: {
    id: 'duodenum',
    title: 'StatPearls: Anatomy, Abdomen and Pelvis: Duodenum',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK482390/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK482390',
    pmid: '29494012',
    topic: 'Duodenal parts (superior, descending, horizontal, ascending) and vascular supply',
    verificationStatus: 'verified'
  },
  large_intestine: {
    id: 'large_intestine',
    title: 'StatPearls: Anatomy, Abdomen and Pelvis: Large Intestine',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK470577/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK470577',
    pmid: '29262220',
    topic: 'Cecum, colon, rectum, and fecal waste concentration',
    verificationStatus: 'verified'
  },

  // Urinary & Lymphatic
  kidneys: {
    id: 'kidneys',
    title: 'StatPearls: Anatomy, Abdomen and Pelvis: Kidneys',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK482385/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK482385',
    pmid: '29494007',
    topic: 'Renal parenchyma, cortex, medullary pyramids, and ureteric pelvis',
    verificationStatus: 'verified'
  },
  renal_physiology: {
    id: 'renal_physiology',
    title: 'StatPearls: Physiology, Renal',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK538339/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK538339',
    pmid: '30855923',
    topic: 'Glomerular ultrafiltration, tubular reabsorption, renin secretion',
    verificationStatus: 'verified'
  },
  urinary_bladder: {
    id: 'urinary_bladder',
    title: 'StatPearls: Anatomy, Abdomen and Pelvis, Bladder',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK531465/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK531465',
    pmid: '30285360',
    topic: 'Urinary bladder storage, detrusor musculature, trigone, and micturition',
    verificationStatus: 'verified'
  },
  spleen: {
    id: 'spleen',
    title: 'StatPearls: Anatomy, Abdomen and Pelvis, Spleen',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK482235/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK482235',
    pmid: '29489170',
    topic: 'Splenic red pulp hematologic filtration and white pulp immune surveillance',
    verificationStatus: 'verified'
  },

  // Skeletal & Joint Articulations
  femur: {
    id: 'femur',
    title: 'StatPearls: Anatomy, Bony Pelvis and Lower Limb: Femur',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK532982/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK532982',
    pmid: '30422560',
    topic: 'Femoral head, neck, trochanters, shaft, and distal articular condyles',
    verificationStatus: 'verified'
  },
  humerus: {
    id: 'humerus',
    title: 'StatPearls: Anatomy, Shoulder and Upper Limb, Humerus',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK534821/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK534821',
    pmid: '30521242',
    topic: 'Humeral head, anatomical/surgical necks, tubercles, and cubital condyles',
    verificationStatus: 'verified'
  },
  skull: {
    id: 'skull',
    title: 'StatPearls: Anatomy, Head and Neck, Skull',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK499834/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK499834',
    pmid: '29763009',
    topic: 'Neurocranium, viscerocranium, sutures, and cranial fossae',
    verificationStatus: 'verified'
  },
  vertebral_column: {
    id: 'vertebral_column',
    title: 'StatPearls: Anatomy, Back, Vertebral Column',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK525969/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK525969',
    pmid: '30247844',
    topic: 'Spinal column regional vertebrae, intervertebral discs, and curvatures',
    verificationStatus: 'verified'
  },
  vertebral_canal: {
    id: 'vertebral_canal',
    title: 'StatPearls: Anatomy, Back, Vertebral Canal',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK557587/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK557587',
    pmid: '32491519',
    topic: 'Spinal canal boundaries, protective meninges, and epidural space',
    verificationStatus: 'verified'
  },
  sternum: {
    id: 'sternum',
    title: 'StatPearls: Anatomy, Thorax, Sternum',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK541141/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK541141',
    pmid: '31082185',
    topic: 'Sternal manubrium, body, xiphoid process, and costal notches',
    verificationStatus: 'verified'
  },
  ribs: {
    id: 'ribs',
    title: 'StatPearls: Anatomy, Thorax, Ribs',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK538328/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK538328',
    pmid: '30855912',
    topic: 'Thoracic rib cage osseous architecture, costal grooves, and intercostal spaces',
    verificationStatus: 'verified'
  },
  sacroiliac_joint: {
    id: 'sacroiliac_joint',
    title: 'StatPearls: Anatomy, Abdomen and Pelvis, Sacroiliac Joint',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK507801/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK507801',
    pmid: '29939578',
    topic: 'Sacroiliac joint axial-to-pelvic biomechanical load transmission',
    verificationStatus: 'verified'
  },
  cervical_vertebrae: {
    id: 'cervical_vertebrae',
    title: 'StatPearls: Anatomy, Head and Neck: Cervical Vertebrae',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK539734/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK539734',
    pmid: '30969556',
    topic: 'Subaxial cervical spine and craniocervical junction (C0-C1 atlanto-occipital)',
    verificationStatus: 'verified'
  },

  // Central Nervous System
  cerebral_cortex: {
    id: 'cerebral_cortex',
    title: 'StatPearls: Neuroanatomy, Cerebral Cortex',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK537247/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK537247',
    pmid: '30725932',
    topic: 'Cerebral hemispheres, cerebral cortex gyri, sulci, and functional lobes',
    verificationStatus: 'verified'
  },
  cerebellum: {
    id: 'cerebellum',
    title: 'StatPearls: Neuroanatomy, Cerebellum',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK538167/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK538167',
    pmid: '30855865',
    topic: 'Cerebellar hemispheres, vermis, folia, cerebellar peduncles, and motor coordination',
    verificationStatus: 'verified'
  },
  brainstem: {
    id: 'brainstem',
    title: 'StatPearls: Neuroanatomy, Brainstem',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK544297/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK544297',
    pmid: '31412805',
    topic: 'Midbrain, pons, medulla oblongata, cranial nerve nuclei, and autonomic pathways',
    verificationStatus: 'verified'
  },
  spinal_cord: {
    id: 'spinal_cord',
    title: 'StatPearls: Neuroanatomy, Spinal Cord',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK559056/',
    authoritativeBody: 'NCBI Bookshelf',
    accessionId: 'NBK559056',
    pmid: '32644482',
    topic: 'Spinal cord gray/white matter tracts, ascending/descending spinal pathways',
    verificationStatus: 'verified'
  }
};

/**
 * Returns a standard citation source object for knowledge, learning, or guide entries.
 */
export function getCitationSource(id: keyof typeof VERIFIED_CITATIONS): {
  title: string;
  url: string;
  authoritativeBody: string;
} {
  const c = VERIFIED_CITATIONS[id];
  if (!c) {
    throw new Error(`Unknown citation ID: ${String(id)}`);
  }
  return {
    title: c.title,
    url: c.url,
    authoritativeBody: c.authoritativeBody
  };
}

/**
 * Returns a formatted citation string for relationship sourceReference fields.
 */
export function formatRelationshipCitation(id: keyof typeof VERIFIED_CITATIONS): string {
  const c = VERIFIED_CITATIONS[id];
  if (!c) {
    throw new Error(`Unknown citation ID: ${String(id)}`);
  }
  if (c.accessionId) {
    return `${c.title} (NCBI Bookshelf ${c.accessionId})`;
  }
  return c.title;
}

/**
 * Resolves a citation string (e.g. from a relationship sourceReference) to a VerifiedCitation entry.
 */
export function findCitationByReference(refString: string): VerifiedCitation | undefined {
  if (!refString) return undefined;
  for (const c of Object.values(VERIFIED_CITATIONS)) {
    if (
      refString.includes(c.title) ||
      (c.accessionId && refString.includes(c.accessionId)) ||
      (c.id && refString.toLowerCase().includes(c.id.toLowerCase()))
    ) {
      return c;
    }
  }
  return undefined;
}
