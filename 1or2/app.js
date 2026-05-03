const rawSpecialties = [
  {
    id: "internal-medicine",
    name: "Internal Medicine",
    blurb: "Broad adult medicine with diagnostic depth, longitudinal care, and room for subspecialty pathways.",
  },
  {
    id: "family-medicine",
    name: "Family Medicine",
    blurb: "High continuity, broad scope, and a strong emphasis on long-term relationships across settings.",
  },
  {
    id: "pediatrics",
    name: "Pediatrics",
    blurb: "Development-focused medicine built around children, families, communication, and continuity.",
  },
  {
    id: "child-neurology",
    name: "Child Neurology",
    blurb: "Neurologic diagnosis and chronic disease care for children, with family-centered communication and developmental context.",
  },
  {
    id: "emergency-medicine",
    name: "Emergency Medicine",
    blurb: "Acute undifferentiated care, shift work, and fast decisions with high variety.",
  },
  {
    id: "general-surgery",
    name: "General Surgery",
    blurb: "Procedure-heavy work centered on decisive action, operative ownership, and perioperative care.",
  },
  {
    id: "neurological-surgery",
    name: "Neurological Surgery",
    blurb: "High-stakes operative care of the brain, spine, and nervous system, with anatomy, acuity, and technical precision at the center.",
  },
  {
    id: "orthopedic-surgery",
    name: "Orthopaedic Surgery",
    blurb: "Musculoskeletal surgery with strong mechanical reasoning, procedures, recovery-focused follow-up, and operative intensity.",
  },
  {
    id: "plastic-surgery",
    name: "Plastic Surgery",
    blurb: "Reconstructive and aesthetic surgery that blends anatomy, fine technical work, visible outcomes, and longitudinal follow-up.",
  },
  {
    id: "vascular-surgery-integrated",
    name: "Vascular Surgery",
    blurb: "Vascular disease care with procedures, physiology, longitudinal risk management, and urgent operative or endovascular decisions.",
  },
  {
    id: "thoracic-surgery-integrated",
    name: "Thoracic Surgery",
    blurb: "Chest surgery involving large operations, anatomy, cancer care, perioperative ownership, and focused procedural expertise.",
  },
  {
    id: "anesthesiology",
    name: "Anesthesiology",
    blurb: "Physiology, procedures, acute management, and team-based care mostly without longitudinal continuity.",
  },
  {
    id: "psychiatry",
    name: "Psychiatry",
    blurb: "Conversation-rich care focused on longitudinal relationships, meaning-making, and behavior change.",
  },
  {
    id: "radiology",
    name: "Diagnostic Radiology",
    blurb: "Image-driven diagnostics with high pattern recognition, technology use, and less direct continuity.",
  },
  {
    id: "interventional-radiology-integrated",
    name: "Interventional Radiology",
    blurb: "Image-guided procedures and consultative care, combining visual interpretation, technical skill, and minimally invasive treatment.",
  },
  {
    id: "radiation-oncology",
    name: "Radiation Oncology",
    blurb: "Cancer-focused care that combines imaging, treatment planning, technology, longitudinal follow-up, and multidisciplinary decisions.",
  },
  {
    id: "neurology",
    name: "Neurology",
    blurb: "Diagnostic reasoning and localization paired with complex chronic disease management.",
  },
  {
    id: "obgyn",
    name: "Obstetrics & Gynecology",
    blurb: "A mix of continuity, procedures, acute moments, and care across different life stages.",
  },
  {
    id: "dermatology",
    name: "Dermatology",
    blurb: "Visual diagnosis, outpatient workflows, procedures, and relatively controlled practice environments.",
  },
  {
    id: "ophthalmology",
    name: "Ophthalmology",
    blurb: "A visually precise specialty that combines clinic, microsurgery, procedures, and a relatively structured workflow.",
  },
  {
    id: "otolaryngology",
    name: "Otolaryngology",
    blurb: "Head and neck care that blends clinic, surgery, anatomy, procedures, and continuity over time.",
  },
  {
    id: "urology",
    name: "Urology",
    blurb: "A defined surgical field balancing clinic, procedures, longitudinal issues, and operative work.",
  },
  {
    id: "physical-medicine-rehab",
    name: "Physical Medicine & Rehabilitation",
    blurb: "Function-focused care centered on rehabilitation, musculoskeletal issues, procedures, and quality of life over time.",
  },
  {
    id: "preventive-medicine",
    name: "Preventive Medicine",
    blurb: "Population health, prevention, systems thinking, and long-horizon risk reduction rather than one-patient-at-a-time acute care.",
  },
  {
    id: "med-peds",
    name: "Medicine-Pediatrics",
    blurb: "Combined adult and pediatric training with broad continuity and room for either primary care or hospital-based practice.",
  },
  {
    id: "pathology",
    name: "Pathology",
    blurb: "Disease-focused diagnostic work behind the scenes with low patient-facing continuity.",
  },
];

const specialtyVisuals = {
  "internal-medicine": { shortLabel: "Internal Med", color: "#2d7d89" },
  "family-medicine": { shortLabel: "Family Med", color: "#4d8d67" },
  pediatrics: { shortLabel: "Pediatrics", color: "#4c9ad7" },
  "child-neurology": { shortLabel: "Child Neuro", color: "#6677d6" },
  "emergency-medicine": { shortLabel: "Emergency", color: "#d96c58" },
  "general-surgery": { shortLabel: "Gen Surgery", color: "#9a5a46" },
  "neurological-surgery": { shortLabel: "Neurosurgery", color: "#7657a8" },
  "orthopedic-surgery": { shortLabel: "Orthopaedics", color: "#b66a4f" },
  "plastic-surgery": { shortLabel: "Plastic Surg", color: "#c27963" },
  "vascular-surgery-integrated": { shortLabel: "Vascular Surg", color: "#9b5f4a" },
  "thoracic-surgery-integrated": { shortLabel: "Thoracic Surg", color: "#8f624c" },
  anesthesiology: { shortLabel: "Anesthesia", color: "#5d6bb0" },
  psychiatry: { shortLabel: "Psychiatry", color: "#7d5b8d" },
  radiology: { shortLabel: "Diag Rads", color: "#4d78bc" },
  "interventional-radiology-integrated": { shortLabel: "IR", color: "#417fb5" },
  "radiation-oncology": { shortLabel: "Rad Onc", color: "#7866b3" },
  neurology: { shortLabel: "Neurology", color: "#5e6fd1" },
  obgyn: { shortLabel: "OB/GYN", color: "#c7648d" },
  dermatology: { shortLabel: "Dermatology", color: "#b88738" },
  ophthalmology: { shortLabel: "Ophthalmology", color: "#2f8fa0" },
  otolaryngology: { shortLabel: "ENT", color: "#aa7540" },
  urology: { shortLabel: "Urology", color: "#3d8777" },
  "physical-medicine-rehab": { shortLabel: "PM&R", color: "#5a9f8d" },
  "preventive-medicine": { shortLabel: "Preventive", color: "#5f9465" },
  "med-peds": { shortLabel: "Med-Peds", color: "#47858b" },
  pathology: { shortLabel: "Pathology", color: "#5f6774" },
};

const specialties = rawSpecialties.map((specialty) => ({
  ...specialty,
  kind: "specialty",
  shortLabel: specialtyVisuals[specialty.id]?.shortLabel ?? specialty.name,
  color: specialtyVisuals[specialty.id]?.color ?? "#2d7d89",
}));

function makeSignal(questionId, answer, weight, label) {
  return { questionId, answer, weight, label };
}

function makeFellowshipPath(id, name, shortLabel, parentId, blurb, tags, signals) {
  return { id, name, shortLabel, parentId, blurb, tags, signals };
}

const fellowshipPaths = [
  {
    id: "cardiology",
    name: "Cardiovascular Disease",
    shortLabel: "Cardiology",
    parentId: "internal-medicine",
    blurb: "Cardiovascular disease with a mix of physiology, hospital complexity, longitudinal care, and procedural branches.",
    tags: ["physiology", "hospital/clinic mix", "acuity"],
    signals: [
      { questionId: "physiology", answer: "yes", weight: 4, label: "physiology-heavy work" },
      { questionId: "pathophysiology-draw", answer: "yes", weight: 3, label: "mechanism-driven reasoning" },
      { questionId: "complex-hospitalized-adults", answer: "yes", weight: 3, label: "complex hospitalized adults" },
      { questionId: "office-procedures-balance", answer: "yes", weight: 2, label: "clinic with procedures" },
    ],
  },
  {
    id: "pulmonary-critical-care",
    name: "Pulmonary Disease and Critical Care Medicine",
    shortLabel: "Pulm/Crit",
    parentId: "internal-medicine",
    blurb: "Physiology, ICU care, complex adults, and a blend of continuity with higher-acuity hospital work.",
    tags: ["critical care", "adults", "physiology"],
    signals: [
      { questionId: "physiology", answer: "yes", weight: 4, label: "real-time physiology" },
      { questionId: "complex-hospitalized-adults", answer: "yes", weight: 3, label: "complex adult inpatient care" },
      { questionId: "low-emergencies", answer: "no", weight: 3, label: "at least some real acuity" },
      { questionId: "hospital-vs-office", answer: "yes", weight: 2, label: "hospital-based days" },
    ],
  },
  {
    id: "family-sports-medicine",
    name: "Sports Medicine",
    shortLabel: "Sports Med",
    parentId: "family-medicine",
    blurb: "Outpatient musculoskeletal care with procedures, recovery planning, and return-to-activity counseling.",
    tags: ["outpatient", "MSK", "function"],
    signals: [
      { questionId: "sports-and-return", answer: "yes", weight: 4, label: "return-to-activity goals" },
      { questionId: "function-rehab", answer: "yes", weight: 3, label: "function and mobility" },
      { questionId: "outpatient-most-days", answer: "yes", weight: 3, label: "outpatient rhythm" },
      { questionId: "clinic-with-procedures", answer: "yes", weight: 2, label: "clinic procedures" },
    ],
  },
  {
    id: "geriatrics",
    name: "Geriatric Medicine",
    shortLabel: "Geriatrics",
    parentId: "family-medicine",
    blurb: "Continuity-heavy care for older adults with multimorbidity, caregiver relationships, and quality-of-life decisions.",
    tags: ["continuity", "caregivers", "complexity"],
    signals: [
      { questionId: "continuity", answer: "yes", weight: 3, label: "long-term patient relationships" },
      { questionId: "caregiver-role", answer: "yes", weight: 4, label: "working closely with caregivers" },
      { questionId: "multimorbidity", answer: "yes", weight: 3, label: "many problems at once" },
      { questionId: "disability-and-qol", answer: "yes", weight: 2, label: "quality of life and adaptation" },
    ],
  },
  {
    id: "neonatology",
    name: "Neonatal-Perinatal Medicine",
    shortLabel: "Neonatology",
    parentId: "pediatrics",
    blurb: "Acuity, physiology, families, and team-based care centered on critically ill newborns.",
    tags: ["critical care", "newborns", "teams"],
    signals: [
      { questionId: "children-large-share", answer: "yes", weight: 4, label: "a strong pull toward kids" },
      { questionId: "physiology", answer: "yes", weight: 3, label: "real-time physiology" },
      { questionId: "regular-urgency", answer: "yes", weight: 3, label: "regular urgency" },
      { questionId: "acute-teamwork", answer: "yes", weight: 2, label: "acute team-based care" },
    ],
  },
  {
    id: "pediatric-cardiology",
    name: "Pediatric Cardiology",
    shortLabel: "Peds Cards",
    parentId: "pediatrics",
    blurb: "Cardiovascular physiology, imaging, and longitudinal care focused on congenital and pediatric heart disease.",
    tags: ["kids", "physiology", "longitudinal"],
    signals: [
      { questionId: "children-large-share", answer: "yes", weight: 4, label: "a large pediatric share" },
      { questionId: "physiology", answer: "yes", weight: 3, label: "cardiovascular physiology" },
      { questionId: "pathophysiology-draw", answer: "yes", weight: 3, label: "pathophysiology as a draw" },
      { questionId: "visual-patterns", answer: "yes", weight: 2, label: "image-based pattern recognition" },
    ],
  },
  {
    id: "medical-toxicology",
    name: "Medical Toxicology",
    shortLabel: "Toxicology",
    parentId: "emergency-medicine",
    blurb: "Acuity, pathophysiology, and consult-style reasoning around overdoses, poisonings, and exposures.",
    tags: ["acute", "consults", "pathophysiology"],
    signals: [
      { questionId: "acuity", answer: "yes", weight: 4, label: "high-pressure acute decisions" },
      { questionId: "uncertainty-tolerance", answer: "yes", weight: 3, label: "working through uncertainty" },
      { questionId: "pathophysiology-draw", answer: "yes", weight: 3, label: "mechanism-heavy thinking" },
      { questionId: "consultant-expertise", answer: "yes", weight: 2, label: "focused consultant work" },
    ],
  },
  {
    id: "trauma-critical-care",
    name: "Trauma & Critical Care",
    shortLabel: "Trauma/Crit",
    parentId: "general-surgery",
    blurb: "Large operations, ICU complexity, and decisive team-based care around severe injury and surgical illness.",
    tags: ["trauma", "OR", "ICU"],
    signals: [
      { questionId: "large-operations", answer: "yes", weight: 4, label: "large operative work" },
      { questionId: "regular-urgency", answer: "yes", weight: 3, label: "urgent or high-pressure situations" },
      { questionId: "acute-teamwork", answer: "yes", weight: 3, label: "tightly coordinated acute teams" },
      { questionId: "hospital-vs-office", answer: "yes", weight: 2, label: "hospital-based work" },
    ],
  },
  {
    id: "surgical-oncology",
    name: "Surgical Oncology",
    shortLabel: "Surg Onc",
    parentId: "general-surgery",
    blurb: "Cancer-focused operative work with longer arcs of treatment planning and multidisciplinary care.",
    tags: ["cancer", "OR", "continuity"],
    signals: [
      { questionId: "large-operations", answer: "yes", weight: 4, label: "large operations" },
      { questionId: "long-term-trust", answer: "yes", weight: 2, label: "longer treatment relationships" },
      { questionId: "focused-expertise", answer: "yes", weight: 3, label: "deep focused expertise" },
      { questionId: "acute-teamwork", answer: "yes", weight: 2, label: "multidisciplinary team work" },
    ],
  },
  {
    id: "orthopedic-sports-medicine",
    name: "Orthopedic Sports Medicine",
    shortLabel: "Ortho Sports",
    parentId: "orthopedic-surgery",
    blurb: "Biomechanics, operative and nonoperative MSK care, and return-to-play or return-to-function decisions.",
    tags: ["sports", "MSK", "procedures"],
    signals: [
      { questionId: "sports-and-return", answer: "yes", weight: 4, label: "return-to-sport work" },
      { questionId: "musculoskeletal-interest", answer: "yes", weight: 4, label: "musculoskeletal problems" },
      { questionId: "procedures", answer: "yes", weight: 2, label: "procedural work" },
      { questionId: "mixed-clinic-procedures", answer: "yes", weight: 2, label: "clinic plus surgery" },
    ],
  },
  {
    id: "hand-surgery",
    name: "Hand Surgery",
    shortLabel: "Hand Surg",
    parentId: "orthopedic-surgery",
    blurb: "Fine technical work, anatomy, and function around intricate upper-extremity injuries and reconstruction.",
    tags: ["fine motor", "anatomy", "function"],
    signals: [
      { questionId: "fine-motor-precision", answer: "yes", weight: 4, label: "very fine technical work" },
      { questionId: "narrow-anatomy", answer: "yes", weight: 3, label: "narrow anatomic focus" },
      { questionId: "manual-skill", answer: "yes", weight: 3, label: "hands-on technical skill" },
      { questionId: "function-over-operation", answer: "no", weight: 1, label: "operative solutions still matter" },
    ],
  },
  {
    id: "pain-medicine",
    name: "Pain Medicine",
    shortLabel: "Pain Med",
    parentId: "anesthesiology",
    blurb: "Procedures, longitudinal pain care, communication, and a clinic-based workflow with intervention mixed in.",
    tags: ["procedures", "continuity", "outpatient"],
    signals: [
      { questionId: "procedures", answer: "yes", weight: 3, label: "hands-on interventions" },
      { questionId: "continuity", answer: "yes", weight: 3, label: "repeat follow-up over time" },
      { questionId: "communication-over-procedures", answer: "yes", weight: 2, label: "talking through decisions" },
      { questionId: "office-procedures-balance", answer: "yes", weight: 3, label: "office procedures as a balance" },
    ],
  },
  {
    id: "child-adolescent-psychiatry",
    name: "Child and Adolescent Psychiatry",
    shortLabel: "Child Psych",
    parentId: "psychiatry",
    blurb: "Development, caregiver systems, and longitudinal mental-health care centered on younger patients.",
    tags: ["kids", "caregivers", "communication"],
    signals: [
      { questionId: "mental-health", answer: "yes", weight: 4, label: "mental health as a central focus" },
      { questionId: "children-large-share", answer: "yes", weight: 4, label: "a large pediatric share" },
      { questionId: "caregiver-role", answer: "yes", weight: 3, label: "working with caregivers" },
      { questionId: "longer-conversations", answer: "yes", weight: 2, label: "longer visits and depth" },
    ],
  },
  {
    id: "consult-liaison-psychiatry",
    name: "Consultation-Liaison Psychiatry",
    shortLabel: "C-L Psych",
    parentId: "psychiatry",
    blurb: "Psychiatric expertise in the medical hospital, with complex adult illness, teams, and consultant-style work.",
    tags: ["consults", "hospital", "complex adults"],
    signals: [
      { questionId: "mental-health", answer: "yes", weight: 4, label: "mental-health-focused work" },
      { questionId: "consultant-expertise", answer: "yes", weight: 3, label: "consultant work" },
      { questionId: "complex-hospitalized-adults", answer: "yes", weight: 3, label: "complex hospitalized adults" },
      { questionId: "hospital-vs-office", answer: "yes", weight: 2, label: "hospital-based days" },
    ],
  },
  {
    id: "interventional-radiology",
    name: "Interventional Radiology",
    shortLabel: "IR",
    parentId: "radiology",
    blurb: "Image-guided procedures, devices, anatomy, and consultant-style procedural care.",
    tags: ["images", "procedures", "consults"],
    signals: [
      { questionId: "images-and-data", answer: "yes", weight: 4, label: "interpreting images and data" },
      { questionId: "procedures", answer: "yes", weight: 3, label: "wanting procedures" },
      { questionId: "consultant-handoffs", answer: "yes", weight: 2, label: "consults and handoffs" },
      { questionId: "immediate-physical-result", answer: "yes", weight: 2, label: "seeing an immediate result" },
    ],
  },
  {
    id: "neuroradiology",
    name: "Neuroradiology",
    shortLabel: "Neurorads",
    parentId: "radiology",
    blurb: "Central nervous system imaging with high diagnostic density, subtle patterns, and anatomic localization.",
    tags: ["images", "brain", "diagnosis"],
    signals: [
      { questionId: "images-and-data", answer: "yes", weight: 4, label: "image-heavy work" },
      { questionId: "subtle-patterns", answer: "yes", weight: 3, label: "subtle patterns and distinctions" },
      { questionId: "anatomic-localization", answer: "yes", weight: 3, label: "anatomic localization" },
      { questionId: "diagnostic-workup", answer: "yes", weight: 2, label: "figuring out what is going on" },
    ],
  },
  {
    id: "vascular-neurology",
    name: "Vascular Neurology",
    shortLabel: "Stroke",
    parentId: "neurology",
    blurb: "Localization, stroke systems, and faster neurologic decision-making around acute cerebrovascular disease.",
    tags: ["stroke", "localization", "acuity"],
    signals: [
      { questionId: "anatomic-localization", answer: "yes", weight: 4, label: "careful localization" },
      { questionId: "regular-urgency", answer: "yes", weight: 3, label: "urgent decision-making" },
      { questionId: "hospital-vs-office", answer: "yes", weight: 2, label: "hospital-based work" },
      { questionId: "diagnostic-puzzle", answer: "yes", weight: 2, label: "diagnostic puzzles that unfold" },
    ],
  },
  {
    id: "epilepsy",
    name: "Epilepsy",
    shortLabel: "Epilepsy",
    parentId: "neurology",
    blurb: "Localization, longitudinal neurologic care, and pattern-heavy thinking around seizures and EEGs.",
    tags: ["continuity", "patterns", "localization"],
    signals: [
      { questionId: "anatomic-localization", answer: "yes", weight: 4, label: "precise localization" },
      { questionId: "long-workups", answer: "yes", weight: 3, label: "longer diagnostic workups" },
      { questionId: "continuity-follow-up", answer: "yes", weight: 3, label: "following patients over time" },
      { questionId: "uncertainty-tolerance", answer: "yes", weight: 2, label: "staying with uncertainty" },
    ],
  },
  {
    id: "maternal-fetal-medicine",
    name: "Maternal-Fetal Medicine",
    shortLabel: "MFM",
    parentId: "obgyn",
    blurb: "High-risk obstetrics with hospital complexity, continuity, and time-sensitive maternal-fetal decisions.",
    tags: ["pregnancy", "high risk", "continuity"],
    signals: [
      { questionId: "women-health", answer: "yes", weight: 4, label: "reproductive and gynecologic care" },
      { questionId: "labor-delivery-draw", answer: "yes", weight: 3, label: "labor and delivery as a draw" },
      { questionId: "complex-hospitalized-adults", answer: "yes", weight: 2, label: "complex inpatient care" },
      { questionId: "treatment-over-time", answer: "yes", weight: 2, label: "seeing care play out over time" },
    ],
  },
  {
    id: "gynecologic-oncology",
    name: "Gynecologic Oncology",
    shortLabel: "Gyn Onc",
    parentId: "obgyn",
    blurb: "Cancer-focused OB/GYN with larger operations, continuity, and multidisciplinary planning.",
    tags: ["cancer", "OR", "women's health"],
    signals: [
      { questionId: "women-health", answer: "yes", weight: 4, label: "a draw toward women's health" },
      { questionId: "large-operations", answer: "yes", weight: 3, label: "larger operations" },
      { questionId: "focused-expertise", answer: "yes", weight: 2, label: "focused expertise" },
      { questionId: "long-term-trust", answer: "yes", weight: 2, label: "longer arcs of care" },
    ],
  },
  {
    id: "mohs-surgery",
    name: "Mohs Surgery",
    shortLabel: "Mohs",
    parentId: "dermatology",
    blurb: "Outpatient skin cancer surgery with close visual detail, procedure volume, and fine technical work.",
    tags: ["outpatient", "fine detail", "procedures"],
    signals: [
      { questionId: "close-visual-detail", answer: "yes", weight: 4, label: "close visual detail" },
      { questionId: "low-emergencies", answer: "yes", weight: 2, label: "a lower-emergency environment" },
      { questionId: "fine-motor-precision", answer: "yes", weight: 3, label: "very fine technical work" },
      { questionId: "focused-outpatient-procedures", answer: "yes", weight: 3, label: "focused outpatient procedures" },
    ],
  },
  {
    id: "retina",
    name: "Retina",
    shortLabel: "Retina",
    parentId: "ophthalmology",
    blurb: "Microsurgery, imaging, and urgent or longitudinal vision-threatening disease with highly visual work.",
    tags: ["vision", "fine motor", "images"],
    signals: [
      { questionId: "preserve-vision", answer: "yes", weight: 4, label: "preserving or restoring vision" },
      { questionId: "fine-motor-precision", answer: "yes", weight: 4, label: "very fine technical work" },
      { questionId: "visual-patterns", answer: "yes", weight: 3, label: "visual pattern recognition" },
      { questionId: "regular-urgency", answer: "yes", weight: 1, label: "some true urgency" },
    ],
  },
  {
    id: "head-neck-oncology",
    name: "Head & Neck Oncology",
    shortLabel: "Head/Neck Onc",
    parentId: "otolaryngology",
    blurb: "Complex head and neck surgery with anatomy, airway considerations, cancer care, and multidisciplinary planning.",
    tags: ["head and neck", "cancer", "OR"],
    signals: [
      { questionId: "head-and-neck-interest", answer: "yes", weight: 4, label: "head and neck anatomy" },
      { questionId: "large-operations", answer: "yes", weight: 3, label: "larger operations" },
      { questionId: "acute-teamwork", answer: "yes", weight: 2, label: "tight team coordination" },
      { questionId: "focused-expertise", answer: "yes", weight: 2, label: "narrow expertise" },
    ],
  },
  {
    id: "urologic-oncology",
    name: "Urologic Oncology",
    shortLabel: "Uro Onc",
    parentId: "urology",
    blurb: "GU cancer care with operative work, continuity, and a defined adult disease focus.",
    tags: ["GU", "cancer", "OR"],
    signals: [
      { questionId: "urologic-problems", answer: "yes", weight: 4, label: "urologic problems as a draw" },
      { questionId: "large-operations", answer: "yes", weight: 3, label: "larger operations" },
      { questionId: "mostly-adults", answer: "yes", weight: 2, label: "mostly adult care" },
      { questionId: "continuity-follow-up", answer: "yes", weight: 2, label: "following outcomes over time" },
    ],
  },
  {
    id: "spinal-cord-injury-medicine",
    name: "Spinal Cord Injury Medicine",
    shortLabel: "SCI Medicine",
    parentId: "physical-medicine-rehab",
    blurb: "Rehab teams, disability, longitudinal function, and hospital-to-community recovery around spinal cord injury.",
    tags: ["rehab teams", "disability", "function"],
    signals: [
      { questionId: "rehab-team-draw", answer: "yes", weight: 4, label: "working with rehab teams" },
      { questionId: "disability-and-qol", answer: "yes", weight: 4, label: "disability and quality of life" },
      { questionId: "function-over-diagnosis", answer: "yes", weight: 3, label: "function over a single diagnosis" },
      { questionId: "continuity-follow-up", answer: "yes", weight: 2, label: "longitudinal follow-up" },
    ],
  },
  {
    id: "pmr-sports-medicine",
    name: "Sports Medicine",
    shortLabel: "PM&R Sports",
    parentId: "physical-medicine-rehab",
    blurb: "Return-to-play, function, outpatient musculoskeletal care, and rehab-oriented procedural work.",
    tags: ["sports", "function", "outpatient"],
    signals: [
      { questionId: "sports-and-return", answer: "yes", weight: 4, label: "return-to-activity questions" },
      { questionId: "function-rehab", answer: "yes", weight: 4, label: "restoring function" },
      { questionId: "outpatient-most-days", answer: "yes", weight: 2, label: "mostly outpatient days" },
      { questionId: "office-procedures-balance", answer: "yes", weight: 2, label: "office procedures" },
    ],
  },
  {
    id: "adolescent-medicine",
    name: "Adolescent Medicine",
    shortLabel: "Adolescent Med",
    parentId: "med-peds",
    blurb: "Cross-age continuity, communication, and developmental care at the transition between pediatrics and adult medicine.",
    tags: ["cross-age", "continuity", "communication"],
    signals: [
      { questionId: "adult-and-children", answer: "yes", weight: 4, label: "switching between adult and pediatric medicine" },
      { questionId: "keep-adult-peds-open", answer: "yes", weight: 4, label: "keeping both age ranges open" },
      { questionId: "continuity", answer: "yes", weight: 2, label: "long-term relationships" },
      { questionId: "context-outside-clinic", answer: "yes", weight: 2, label: "life outside the clinic" },
    ],
  },
  {
    id: "hematopathology",
    name: "Hematopathology",
    shortLabel: "Hemepath",
    parentId: "pathology",
    blurb: "Microscopy, morphology, and disease classification centered on blood, marrow, and lymphoid disorders.",
    tags: ["microscopy", "diagnosis", "hematology"],
    signals: [
      { questionId: "microscope-over-bedside", answer: "yes", weight: 4, label: "microscope or slides over bedside care" },
      { questionId: "subtle-patterns", answer: "yes", weight: 3, label: "subtle patterns and distinctions" },
      { questionId: "diagnostic-workup", answer: "yes", weight: 2, label: "figuring out what is going on" },
      { questionId: "away-from-bedside", answer: "yes", weight: 2, label: "valuable work away from the bedside" },
    ],
  },
  {
    id: "cytopathology",
    name: "Cytopathology",
    shortLabel: "Cytopath",
    parentId: "pathology",
    blurb: "Cellular diagnosis with microscopy, sampling decisions, and close visual attention to subtle morphologic change.",
    tags: ["microscopy", "visual detail", "diagnosis"],
    signals: [
      { questionId: "microscope-over-bedside", answer: "yes", weight: 4, label: "microscopy over bedside interaction" },
      { questionId: "close-visual-detail", answer: "yes", weight: 3, label: "close visual detail" },
      { questionId: "certainty-over-ambiguity", answer: "yes", weight: 2, label: "moving toward diagnostic certainty" },
      { questionId: "away-from-bedside", answer: "yes", weight: 2, label: "indirect but important work" },
    ],
  },
  makeFellowshipPath(
    "gastroenterology",
    "Gastroenterology",
    "GI",
    "internal-medicine",
    "A mix of physiology, procedures, longitudinal care, and organ-focused expertise in the GI tract and liver.",
    ["procedures", "continuity", "pathophysiology"],
    [
      makeSignal("pathophysiology-draw", "yes", 3, "mechanism-driven reasoning"),
      makeSignal("procedures", "yes", 3, "wanting procedures in the work"),
      makeSignal("continuity-follow-up", "yes", 3, "following chronic disease over time"),
      makeSignal("focused-expertise", "yes", 2, "deep organ-system expertise"),
    ]
  ),
  makeFellowshipPath(
    "hematology-oncology",
    "Hematology and Oncology",
    "Hem/Onc",
    "internal-medicine",
    "Cancer and blood disorders with longitudinal relationships, mechanism-heavy thinking, and complex treatment planning.",
    ["continuity", "complexity", "cancer"],
    [
      makeSignal("long-term-trust", "yes", 3, "longer arcs of patient trust"),
      makeSignal("complex-hospitalized-adults", "yes", 3, "complex adult medical care"),
      makeSignal("pathophysiology-draw", "yes", 3, "mechanism-heavy reasoning"),
      makeSignal("focused-expertise", "yes", 2, "focused disease expertise"),
    ]
  ),
  makeFellowshipPath(
    "endocrinology",
    "Endocrinology, Diabetes, and Metabolism",
    "Endocrine",
    "internal-medicine",
    "Longitudinal, physiology-rich care with a steadier pace and lots of chronic disease management.",
    ["continuity", "physiology", "outpatient"],
    [
      makeSignal("physiology", "yes", 3, "physiology as a central draw"),
      makeSignal("continuity", "yes", 3, "long-term follow-up"),
      makeSignal("low-emergencies", "yes", 3, "a lower-emergency environment"),
      makeSignal("outpatient-most-days", "yes", 2, "mostly outpatient days"),
    ]
  ),
  makeFellowshipPath(
    "nephrology",
    "Nephrology",
    "Nephrology",
    "internal-medicine",
    "Renal physiology, medically complex adults, and continuity across hospital and clinic settings.",
    ["physiology", "complex adults", "hospital/clinic mix"],
    [
      makeSignal("physiology", "yes", 4, "renal physiology and stabilization"),
      makeSignal("complex-hospitalized-adults", "yes", 3, "medically complex adults"),
      makeSignal("continuity-follow-up", "yes", 3, "following chronic illness over time"),
      makeSignal("hospital-vs-office", "yes", 2, "comfort with hospital-based work"),
    ]
  ),
  makeFellowshipPath(
    "rheumatology",
    "Rheumatology",
    "Rheum",
    "internal-medicine",
    "Longitudinal, puzzle-heavy care focused on chronic autoimmune and inflammatory disease.",
    ["diagnosis", "continuity", "ambiguity"],
    [
      makeSignal("long-workups", "yes", 3, "slower diagnostic workups"),
      makeSignal("uncertainty-tolerance", "yes", 3, "staying with ambiguity"),
      makeSignal("continuity-follow-up", "yes", 3, "continuity over time"),
      makeSignal("longer-conversations", "yes", 2, "longer visits and nuance"),
    ]
  ),
  makeFellowshipPath(
    "infectious-disease",
    "Infectious Disease",
    "ID",
    "internal-medicine",
    "Consult-heavy, diagnostic medicine built around pathophysiology, uncertainty, and medically complex adults.",
    ["consults", "diagnosis", "pathophysiology"],
    [
      makeSignal("consultant-expertise", "yes", 3, "consult-style expertise"),
      makeSignal("diagnostic-workup", "yes", 3, "figuring out what is going on"),
      makeSignal("pathophysiology-draw", "yes", 3, "mechanism-heavy thinking"),
      makeSignal("uncertainty-tolerance", "yes", 2, "tolerating uncertainty"),
    ]
  ),
  makeFellowshipPath(
    "addiction-medicine-family",
    "Addiction Medicine",
    "Addiction",
    "family-medicine",
    "Longitudinal outpatient care centered on behavior change, recovery, and broader life context.",
    ["continuity", "behavior", "communication"],
    [
      makeSignal("mental-health", "yes", 3, "mental health and behavior as a central focus"),
      makeSignal("longer-conversations", "yes", 3, "deeper visits and counseling"),
      makeSignal("continuity-follow-up", "yes", 3, "following patients over time"),
      makeSignal("context-outside-clinic", "yes", 2, "life outside the clinic matters"),
    ]
  ),
  makeFellowshipPath(
    "hospice-palliative-medicine-family",
    "Hospice and Palliative Medicine",
    "Palliative",
    "family-medicine",
    "Quality-of-life-centered care built around communication, symptoms, and longitudinal support through serious illness.",
    ["quality of life", "communication", "continuity"],
    [
      makeSignal("disability-and-qol", "yes", 4, "quality of life and adaptation"),
      makeSignal("longer-conversations", "yes", 3, "meaningful longer conversations"),
      makeSignal("continuity-follow-up", "yes", 3, "following patients over time"),
      makeSignal("low-emergencies", "yes", 2, "a less adrenaline-driven environment"),
    ]
  ),
  makeFellowshipPath(
    "sleep-medicine-family",
    "Sleep Medicine",
    "Sleep Med",
    "family-medicine",
    "A steadier outpatient field with physiology, focused expertise, and diagnostic workups that unfold over time.",
    ["outpatient", "physiology", "focused expertise"],
    [
      makeSignal("low-emergencies", "yes", 3, "few true emergencies"),
      makeSignal("long-workups", "yes", 3, "longer diagnostic workups"),
      makeSignal("outpatient-most-days", "yes", 3, "mostly outpatient rhythm"),
      makeSignal("focused-expertise", "yes", 2, "developing focused expertise"),
    ]
  ),
  makeFellowshipPath(
    "pediatric-critical-care",
    "Pediatric Critical Care Medicine",
    "PICU",
    "pediatrics",
    "High-acuity, physiology-heavy team care for critically ill children in the hospital.",
    ["critical care", "kids", "physiology"],
    [
      makeSignal("children-large-share", "yes", 4, "a strong draw toward children"),
      makeSignal("physiology", "yes", 3, "real-time physiology"),
      makeSignal("regular-urgency", "yes", 3, "frequent urgency"),
      makeSignal("acute-teamwork", "yes", 2, "coordinated acute teams"),
    ]
  ),
  makeFellowshipPath(
    "developmental-behavioral-pediatrics",
    "Developmental and Behavioral Pediatrics",
    "Dev-Beh Peds",
    "pediatrics",
    "Longitudinal pediatric care focused on development, family systems, behavior, and context outside the clinic room.",
    ["development", "continuity", "caregivers"],
    [
      makeSignal("children-large-share", "yes", 4, "a large pediatric share"),
      makeSignal("caregiver-role", "yes", 3, "working closely with caregivers"),
      makeSignal("longer-conversations", "yes", 3, "longer visits and interpretation"),
      makeSignal("context-outside-clinic", "yes", 2, "school, home, and daily context"),
    ]
  ),
  makeFellowshipPath(
    "pediatric-hematology-oncology",
    "Pediatric Hematology/Oncology",
    "Peds Hem/Onc",
    "pediatrics",
    "Longitudinal pediatric cancer and blood-disorder care with high complexity and close family relationships.",
    ["kids", "cancer", "continuity"],
    [
      makeSignal("children-large-share", "yes", 4, "a strong pull toward kids"),
      makeSignal("long-term-trust", "yes", 3, "longer arcs of trust"),
      makeSignal("pathophysiology-draw", "yes", 3, "mechanism-heavy reasoning"),
      makeSignal("continuity-follow-up", "yes", 2, "following treatment over time"),
    ]
  ),
  makeFellowshipPath(
    "pediatric-endocrinology",
    "Pediatric Endocrinology",
    "Peds Endocrine",
    "pediatrics",
    "Longitudinal pediatric physiology with a steadier clinic rhythm and lots of follow-up over time.",
    ["kids", "continuity", "physiology"],
    [
      makeSignal("children-large-share", "yes", 4, "a large pediatric share"),
      makeSignal("physiology", "yes", 3, "physiology as a draw"),
      makeSignal("continuity", "yes", 3, "long-term follow-up"),
      makeSignal("low-emergencies", "yes", 2, "lower-emergency pacing"),
    ]
  ),
  makeFellowshipPath(
    "emergency-medical-services",
    "Emergency Medical Services",
    "EMS",
    "emergency-medicine",
    "Systems-facing acute care focused on prehospital medicine, scene coordination, and fast operational decisions.",
    ["systems", "acute care", "teams"],
    [
      makeSignal("acuity", "yes", 4, "high-pressure acute decisions"),
      makeSignal("acute-teamwork", "yes", 3, "coordinated acute teams"),
      makeSignal("consultant-expertise", "yes", 2, "being called for focused expertise"),
      makeSignal("quick-decisions", "yes", 2, "acting with incomplete information"),
    ]
  ),
  makeFellowshipPath(
    "pediatric-emergency-medicine-em",
    "Pediatric Emergency Medicine",
    "Peds EM",
    "emergency-medicine",
    "Acute, shift-based emergency care centered on children, families, and undifferentiated pediatric presentations.",
    ["kids", "acute care", "shift work"],
    [
      makeSignal("children-large-share", "yes", 4, "a strong pull toward children"),
      makeSignal("acuity", "yes", 3, "acute decision-making"),
      makeSignal("clear-shifts", "yes", 3, "clear shift structure"),
      makeSignal("uncertainty-tolerance", "yes", 2, "working through uncertainty"),
    ]
  ),
  makeFellowshipPath(
    "sports-medicine-emergency",
    "Sports Medicine",
    "Sports Med",
    "emergency-medicine",
    "A more outpatient, musculoskeletal branch for people who like active patients, recovery goals, and procedures.",
    ["sports", "outpatient", "MSK"],
    [
      makeSignal("sports-and-return", "yes", 4, "return-to-activity goals"),
      makeSignal("function-rehab", "yes", 3, "function and mobility mattering"),
      makeSignal("outpatient-most-days", "yes", 3, "mostly outpatient rhythm"),
      makeSignal("clinic-with-procedures", "yes", 2, "clinic procedures"),
    ]
  ),
  makeFellowshipPath(
    "colorectal-surgery",
    "Colon and Rectal Surgery",
    "Colorectal",
    "general-surgery",
    "Organ-focused surgery that mixes major operations, clinic follow-up, and longitudinal problem-solving.",
    ["large operations", "continuity", "focused expertise"],
    [
      makeSignal("large-operations", "yes", 4, "larger operative work"),
      makeSignal("continuity-follow-up", "yes", 3, "seeing patients over time"),
      makeSignal("focused-expertise", "yes", 3, "focused expertise"),
      makeSignal("mixed-clinic-procedures", "yes", 2, "clinic plus procedures"),
    ]
  ),
  makeFellowshipPath(
    "vascular-surgery",
    "Vascular Surgery",
    "Vascular",
    "general-surgery",
    "A physiology-rich surgical path with major operations, urgent disease, and immediate procedural results.",
    ["physiology", "OR", "immediate results"],
    [
      makeSignal("physiology", "yes", 3, "physiology-heavy thinking"),
      makeSignal("large-operations", "yes", 4, "larger operations"),
      makeSignal("immediate-physical-result", "yes", 3, "seeing an immediate physical result"),
      makeSignal("mostly-adults", "yes", 2, "mostly adult patients"),
    ]
  ),
  makeFellowshipPath(
    "transplant-surgery",
    "Transplant Surgery",
    "Transplant",
    "general-surgery",
    "High-complexity surgery with physiology, ICU-level thinking, and long longitudinal arcs before and after transplant.",
    ["physiology", "complexity", "OR"],
    [
      makeSignal("physiology", "yes", 3, "real-time physiology"),
      makeSignal("large-operations", "yes", 4, "major operations"),
      makeSignal("hospital-vs-office", "yes", 3, "hospital-based work"),
      makeSignal("acute-teamwork", "yes", 2, "coordinated multidisciplinary teams"),
    ]
  ),
  makeFellowshipPath(
    "breast-surgery",
    "Breast Surgery",
    "Breast Surg",
    "general-surgery",
    "Cancer-focused surgery with continuity, clinic discussions, and a more defined surgical domain.",
    ["continuity", "women's health", "focused expertise"],
    [
      makeSignal("long-term-trust", "yes", 3, "longer arcs of trust"),
      makeSignal("women-health", "yes", 2, "care tied to women's health"),
      makeSignal("focused-expertise", "yes", 3, "deep domain expertise"),
      makeSignal("mixed-clinic-procedures", "yes", 2, "clinic plus surgery"),
    ]
  ),
  makeFellowshipPath(
    "adult-reconstruction",
    "Adult Reconstruction",
    "Arthroplasty",
    "orthopedic-surgery",
    "Joint replacement and reconstructive orthopedics with biomechanics, procedures, and continuity around recovery.",
    ["MSK", "procedures", "recovery"],
    [
      makeSignal("musculoskeletal-interest", "yes", 4, "musculoskeletal problems"),
      makeSignal("mostly-adults", "yes", 3, "mostly adult patients"),
      makeSignal("immediate-physical-result", "yes", 3, "seeing physical improvement"),
      makeSignal("continuity-follow-up", "yes", 2, "following recovery over time"),
    ]
  ),
  makeFellowshipPath(
    "spine-surgery",
    "Spine Surgery",
    "Spine",
    "orthopedic-surgery",
    "A focused surgical path built around anatomy, large operations, and high-stakes function.",
    ["anatomy", "large operations", "function"],
    [
      makeSignal("musculoskeletal-interest", "yes", 4, "musculoskeletal problems"),
      makeSignal("narrow-anatomy", "yes", 3, "a narrow anatomic focus"),
      makeSignal("large-operations", "yes", 3, "larger operations"),
      makeSignal("fine-motor-precision", "yes", 2, "precise technical work"),
    ]
  ),
  makeFellowshipPath(
    "orthopedic-trauma",
    "Orthopedic Trauma",
    "Ortho Trauma",
    "orthopedic-surgery",
    "Acute musculoskeletal surgery built around urgent decisions, fractures, teams, and operative ownership.",
    ["trauma", "MSK", "acute care"],
    [
      makeSignal("musculoskeletal-interest", "yes", 4, "musculoskeletal problems"),
      makeSignal("regular-urgency", "yes", 3, "true urgency"),
      makeSignal("acute-teamwork", "yes", 3, "tightly coordinated acute teams"),
      makeSignal("hospital-vs-office", "yes", 2, "hospital-based work"),
    ]
  ),
  makeFellowshipPath(
    "foot-ankle-orthopedics",
    "Foot & Ankle",
    "Foot/Ankle",
    "orthopedic-surgery",
    "Focused MSK surgery with a narrower anatomic domain, clinic-to-OR balance, and procedural depth.",
    ["MSK", "anatomy", "clinic/OR mix"],
    [
      makeSignal("musculoskeletal-interest", "yes", 4, "musculoskeletal problems"),
      makeSignal("narrow-anatomy", "yes", 3, "narrow anatomic focus"),
      makeSignal("mixed-clinic-procedures", "yes", 3, "clinic plus procedures"),
      makeSignal("fine-motor-precision", "yes", 2, "precise technical work"),
    ]
  ),
  makeFellowshipPath(
    "critical-care-anesthesiology",
    "Critical Care Medicine",
    "Crit Care",
    "anesthesiology",
    "ICU-level physiology, acute team care, and hospital-based management of critically ill patients.",
    ["critical care", "physiology", "hospital"],
    [
      makeSignal("physiology", "yes", 4, "real-time physiology"),
      makeSignal("hospital-vs-office", "yes", 3, "hospital-based days"),
      makeSignal("regular-urgency", "yes", 3, "time-sensitive care"),
      makeSignal("acute-teamwork", "yes", 2, "acute team coordination"),
    ]
  ),
  makeFellowshipPath(
    "cardiac-anesthesiology",
    "Adult Cardiothoracic Anesthesiology",
    "Cardiac Anes",
    "anesthesiology",
    "A physiology-heavy anesthesia path built around cardiac cases, acute teams, and high-stakes intraoperative management.",
    ["physiology", "OR", "acuity"],
    [
      makeSignal("physiology", "yes", 4, "hemodynamics and physiology"),
      makeSignal("operating-room", "yes", 3, "the OR as a draw"),
      makeSignal("acute-teamwork", "yes", 3, "coordinated operative teams"),
      makeSignal("regular-urgency", "yes", 2, "true acuity"),
    ]
  ),
  makeFellowshipPath(
    "pediatric-anesthesiology",
    "Pediatric Anesthesiology",
    "Peds Anes",
    "anesthesiology",
    "Procedural physiology and perioperative care centered on children and pediatric surgical teams.",
    ["kids", "OR", "physiology"],
    [
      makeSignal("children-large-share", "yes", 4, "a large pediatric share"),
      makeSignal("physiology", "yes", 3, "real-time physiology"),
      makeSignal("operating-room", "yes", 3, "operative environments"),
      makeSignal("acute-teamwork", "yes", 2, "acute team-based care"),
    ]
  ),
  makeFellowshipPath(
    "regional-anesthesia-acute-pain",
    "Regional Anesthesia & Acute Pain",
    "Regional",
    "anesthesiology",
    "Procedural anesthesia with immediate results, ultrasound-guided skill, and perioperative problem-solving.",
    ["procedures", "immediate results", "OR"],
    [
      makeSignal("procedures", "yes", 4, "hands-on interventions"),
      makeSignal("immediate-physical-result", "yes", 3, "seeing a result right away"),
      makeSignal("operating-room", "yes", 3, "the OR as a draw"),
      makeSignal("fine-motor-precision", "yes", 2, "technical precision"),
    ]
  ),
  makeFellowshipPath(
    "addiction-psychiatry",
    "Addiction Psychiatry",
    "Addiction",
    "psychiatry",
    "Longitudinal psychiatry centered on recovery, behavior change, and difficult real-world context outside the clinic room.",
    ["mental health", "recovery", "continuity"],
    [
      makeSignal("mental-health", "yes", 4, "mental health as a central focus"),
      makeSignal("longer-conversations", "yes", 3, "deeper visits and counseling"),
      makeSignal("continuity-follow-up", "yes", 3, "longitudinal follow-up"),
      makeSignal("context-outside-clinic", "yes", 2, "life outside the clinic matters"),
    ]
  ),
  makeFellowshipPath(
    "forensic-psychiatry",
    "Forensic Psychiatry",
    "Forensic",
    "psychiatry",
    "Consultative psychiatric work at the boundary of medicine, systems, and high-stakes interpretation.",
    ["consults", "analysis", "mental health"],
    [
      makeSignal("mental-health", "yes", 4, "mental-health-focused work"),
      makeSignal("consultant-expertise", "yes", 3, "focused consultant expertise"),
      makeSignal("longer-conversations", "yes", 2, "depth and interpretation in conversations"),
      makeSignal("uncertainty-tolerance", "yes", 2, "tolerating ambiguity"),
    ]
  ),
  makeFellowshipPath(
    "geriatric-psychiatry",
    "Geriatric Psychiatry",
    "Geri Psych",
    "psychiatry",
    "Psychiatric care for older adults with multimorbidity, caregivers, and quality-of-life issues.",
    ["older adults", "caregivers", "continuity"],
    [
      makeSignal("mental-health", "yes", 4, "mental health as a central focus"),
      makeSignal("caregiver-role", "yes", 3, "working with caregivers"),
      makeSignal("continuity-follow-up", "yes", 3, "longitudinal follow-up"),
      makeSignal("disability-and-qol", "yes", 2, "quality of life and adaptation"),
    ]
  ),
  makeFellowshipPath(
    "breast-imaging",
    "Breast Imaging",
    "Breast Img",
    "radiology",
    "Visually precise imaging with outpatient workflows, subtle pattern recognition, and a focused women's-health domain.",
    ["images", "visual detail", "women's health"],
    [
      makeSignal("images-and-data", "yes", 4, "image-heavy work"),
      makeSignal("close-visual-detail", "yes", 3, "close visual detail"),
      makeSignal("women-health", "yes", 2, "women's health as a draw"),
      makeSignal("focused-outpatient-procedures", "yes", 2, "focused outpatient workflows"),
    ]
  ),
  makeFellowshipPath(
    "pediatric-radiology",
    "Pediatric Radiology",
    "Peds Rads",
    "radiology",
    "Imaging-heavy pediatric diagnostics for people who like children but prefer a consultant-style, image-centered role.",
    ["kids", "images", "consults"],
    [
      makeSignal("children-large-share", "yes", 4, "a strong pull toward children"),
      makeSignal("images-and-data", "yes", 4, "interpreting images and structured data"),
      makeSignal("diagnostic-workup", "yes", 2, "diagnostic reasoning"),
      makeSignal("low-emergencies", "yes", 2, "a lower-emergency environment"),
    ]
  ),
  makeFellowshipPath(
    "musculoskeletal-radiology",
    "Musculoskeletal Radiology",
    "MSK Rads",
    "radiology",
    "A visually and anatomically focused imaging path centered on bones, joints, soft tissue, and procedures.",
    ["MSK", "images", "anatomy"],
    [
      makeSignal("images-and-data", "yes", 4, "image-heavy work"),
      makeSignal("musculoskeletal-interest", "yes", 3, "musculoskeletal problems"),
      makeSignal("subtle-patterns", "yes", 3, "subtle patterns and distinctions"),
      makeSignal("diagnostic-workup", "yes", 2, "figuring out what is going on"),
    ]
  ),
  makeFellowshipPath(
    "nuclear-radiology",
    "Nuclear Radiology",
    "Nuclear",
    "radiology",
    "Imaging and tracer-based diagnosis for people drawn to structured data, physiology, and focused expertise.",
    ["images", "physiology", "data"],
    [
      makeSignal("images-and-data", "yes", 4, "image and data interpretation"),
      makeSignal("pathophysiology-draw", "yes", 3, "mechanism-heavy thinking"),
      makeSignal("focused-expertise", "yes", 3, "focused expertise"),
      makeSignal("away-from-bedside", "yes", 2, "important work away from the bedside"),
    ]
  ),
  makeFellowshipPath(
    "movement-disorders",
    "Movement Disorders",
    "Movement",
    "neurology",
    "Longitudinal neurology centered on localization, careful phenotyping, and chronic disease over time.",
    ["continuity", "localization", "chronic disease"],
    [
      makeSignal("anatomic-localization", "yes", 4, "careful localization"),
      makeSignal("continuity-follow-up", "yes", 3, "following patients over time"),
      makeSignal("long-workups", "yes", 3, "longer workups and nuance"),
      makeSignal("uncertainty-tolerance", "yes", 2, "staying with uncertainty"),
    ]
  ),
  makeFellowshipPath(
    "neuromuscular-medicine-neurology",
    "Neuromuscular Medicine",
    "Neuromusc",
    "neurology",
    "Localization-heavy neurology focused on weakness, nerve and muscle disease, and diagnostic depth.",
    ["localization", "function", "diagnosis"],
    [
      makeSignal("anatomic-localization", "yes", 4, "precise localization"),
      makeSignal("function-rehab", "yes", 2, "function and disability mattering"),
      makeSignal("diagnostic-workup", "yes", 3, "figuring out what is going on"),
      makeSignal("continuity-follow-up", "yes", 2, "longitudinal follow-up"),
    ]
  ),
  makeFellowshipPath(
    "neurocritical-care",
    "Neurocritical Care",
    "Neurocrit",
    "neurology",
    "Acuity, hospital teams, physiology, and localization around neurologic emergencies.",
    ["critical care", "localization", "acuity"],
    [
      makeSignal("anatomic-localization", "yes", 3, "careful localization"),
      makeSignal("physiology", "yes", 3, "real-time physiology"),
      makeSignal("hospital-vs-office", "yes", 3, "hospital-based work"),
      makeSignal("regular-urgency", "yes", 3, "urgent decision-making"),
    ]
  ),
  makeFellowshipPath(
    "headache-medicine",
    "Headache Medicine",
    "Headache",
    "neurology",
    "Longitudinal, outpatient neurology for people who like chronic symptom patterns, nuance, and continuity.",
    ["continuity", "outpatient", "diagnosis"],
    [
      makeSignal("continuity-follow-up", "yes", 3, "following patients over time"),
      makeSignal("longer-conversations", "yes", 2, "deeper visits"),
      makeSignal("uncertainty-tolerance", "yes", 2, "tolerating diagnostic ambiguity"),
      makeSignal("low-emergencies", "yes", 3, "a lower-acuity environment"),
    ]
  ),
  makeFellowshipPath(
    "reproductive-endocrinology-infertility",
    "Reproductive Endocrinology",
    "REI",
    "obgyn",
    "Physiology, continuity, and focused reproductive care with a steadier clinic pace and procedural elements.",
    ["women's health", "physiology", "continuity"],
    [
      makeSignal("women-health", "yes", 4, "women's health as a core draw"),
      makeSignal("pathophysiology-draw", "yes", 3, "mechanism-heavy reasoning"),
      makeSignal("continuity-follow-up", "yes", 3, "longitudinal follow-up"),
      makeSignal("low-emergencies", "yes", 2, "a steadier pace"),
    ]
  ),
  makeFellowshipPath(
    "urogynecology",
    "Urogynecology and Reconstructive Pelvic Surgery",
    "Urogyne",
    "obgyn",
    "A continuity-heavy surgical branch of OB/GYN built around pelvic floor problems, procedures, and function.",
    ["women's health", "continuity", "procedures"],
    [
      makeSignal("women-health", "yes", 4, "women's health as a draw"),
      makeSignal("continuity-follow-up", "yes", 3, "seeing patients over time"),
      makeSignal("office-procedures-balance", "yes", 3, "office procedures as part of the work"),
      makeSignal("focused-expertise", "yes", 2, "focused expertise"),
    ]
  ),
  makeFellowshipPath(
    "minimally-invasive-gynecologic-surgery",
    "Minimally Invasive Gynecologic Surgery",
    "MIGS",
    "obgyn",
    "Fine technical gynecologic surgery with a clinic-to-OR mix and a narrower procedural focus.",
    ["women's health", "fine motor", "procedures"],
    [
      makeSignal("women-health", "yes", 4, "women's health as a core interest"),
      makeSignal("fine-motor-precision", "yes", 3, "very fine technical work"),
      makeSignal("focused-outpatient-procedures", "yes", 3, "focused outpatient procedures"),
      makeSignal("mixed-clinic-procedures", "yes", 2, "mixing clinic and surgery"),
    ]
  ),
  makeFellowshipPath(
    "complex-family-planning",
    "Complex Family Planning",
    "Family Plan",
    "obgyn",
    "Outpatient-forward reproductive care with procedures, counseling, and meaningful conversations around time-sensitive decisions.",
    ["women's health", "procedures", "communication"],
    [
      makeSignal("women-health", "yes", 4, "women's health as a central draw"),
      makeSignal("focused-outpatient-procedures", "yes", 3, "outpatient procedures"),
      makeSignal("longer-conversations", "yes", 2, "conversation and counseling"),
      makeSignal("outpatient-most-days", "yes", 2, "mostly outpatient rhythm"),
    ]
  ),
  makeFellowshipPath(
    "dermatopathology-dermatology",
    "Dermatopathology",
    "Dermpath",
    "dermatology",
    "A skin-focused microscopy and diagnosis path for people drawn to visual detail and pattern recognition.",
    ["microscopy", "visual detail", "diagnosis"],
    [
      makeSignal("microscope-over-bedside", "yes", 4, "microscopy over bedside work"),
      makeSignal("close-visual-detail", "yes", 3, "close visual detail"),
      makeSignal("visual-patterns", "yes", 3, "visual pattern recognition"),
      makeSignal("away-from-bedside", "yes", 2, "indirect but important work"),
    ]
  ),
  makeFellowshipPath(
    "pediatric-dermatology",
    "Pediatric Dermatology",
    "Peds Derm",
    "dermatology",
    "Skin-focused care for children with continuity, caregivers, and a more developmental or family-centered context.",
    ["kids", "continuity", "skin"],
    [
      makeSignal("children-large-share", "yes", 4, "a strong draw toward children"),
      makeSignal("continuity-follow-up", "yes", 3, "following patients over time"),
      makeSignal("close-visual-detail", "yes", 3, "close visual skin findings"),
      makeSignal("caregiver-role", "yes", 2, "working with caregivers"),
    ]
  ),
  makeFellowshipPath(
    "cosmetic-dermatology",
    "Cosmetic Dermatology",
    "Cosmetic",
    "dermatology",
    "An outpatient procedural path centered on visible results, fine detail, and lower-acuity clinic work.",
    ["outpatient", "procedures", "immediate results"],
    [
      makeSignal("focused-outpatient-procedures", "yes", 4, "focused outpatient procedures"),
      makeSignal("close-visual-detail", "yes", 3, "close visual detail"),
      makeSignal("immediate-physical-result", "yes", 3, "seeing visible results"),
      makeSignal("low-emergencies", "yes", 2, "a lower-emergency environment"),
    ]
  ),
  makeFellowshipPath(
    "complex-medical-dermatology",
    "Complex Medical Dermatology",
    "Med Derm",
    "dermatology",
    "A more longitudinal and diagnostic branch of dermatology with chronic disease and nuanced treatment over time.",
    ["diagnosis", "continuity", "skin"],
    [
      makeSignal("continuity-follow-up", "yes", 3, "following chronic disease over time"),
      makeSignal("diagnostic-workup", "yes", 3, "diagnostic reasoning"),
      makeSignal("close-visual-detail", "yes", 3, "close visual detail"),
      makeSignal("low-emergencies", "yes", 2, "a steadier pace"),
    ]
  ),
  makeFellowshipPath(
    "cornea-external-disease",
    "Cornea & External Disease",
    "Cornea",
    "ophthalmology",
    "Vision-preserving clinic and microsurgery work with procedures, imaging, and longitudinal care.",
    ["vision", "procedures", "continuity"],
    [
      makeSignal("preserve-vision", "yes", 4, "preserving or restoring vision"),
      makeSignal("fine-motor-precision", "yes", 3, "very fine technical work"),
      makeSignal("visual-patterns", "yes", 3, "visual pattern recognition"),
      makeSignal("continuity-follow-up", "yes", 2, "following patients over time"),
    ]
  ),
  makeFellowshipPath(
    "glaucoma",
    "Glaucoma",
    "Glaucoma",
    "ophthalmology",
    "A highly focused ophthalmology path that combines procedures, subtle visual change, and continuity over time.",
    ["vision", "subtle patterns", "continuity"],
    [
      makeSignal("preserve-vision", "yes", 4, "preserving vision"),
      makeSignal("focused-outpatient-procedures", "yes", 3, "focused clinic procedures"),
      makeSignal("continuity-follow-up", "yes", 3, "longitudinal follow-up"),
      makeSignal("subtle-patterns", "yes", 2, "subtle visual distinctions"),
    ]
  ),
  makeFellowshipPath(
    "pediatric-ophthalmology",
    "Pediatric Ophthalmology & Strabismus",
    "Peds Ophtho",
    "ophthalmology",
    "Vision-centered work for children and families with continuity, development, and surgical or procedural care.",
    ["kids", "vision", "caregivers"],
    [
      makeSignal("preserve-vision", "yes", 4, "vision as a strong draw"),
      makeSignal("children-large-share", "yes", 4, "a large pediatric share"),
      makeSignal("continuity-follow-up", "yes", 2, "longitudinal follow-up"),
      makeSignal("caregiver-role", "yes", 2, "working with caregivers"),
    ]
  ),
  makeFellowshipPath(
    "oculoplastics",
    "Oculofacial Plastic Surgery",
    "Oculoplastics",
    "ophthalmology",
    "Highly precise periocular surgery with fine motor work, visible results, and a focused anatomic domain.",
    ["fine motor", "anatomy", "immediate results"],
    [
      makeSignal("fine-motor-precision", "yes", 4, "very fine technical work"),
      makeSignal("close-visual-detail", "yes", 3, "close visual and anatomic detail"),
      makeSignal("focused-outpatient-procedures", "yes", 3, "focused outpatient procedures"),
      makeSignal("immediate-physical-result", "yes", 2, "seeing visible results"),
    ]
  ),
  makeFellowshipPath(
    "neuro-ophthalmology",
    "Neuro-Ophthalmology",
    "Neuro-Oph",
    "ophthalmology",
    "A puzzle-heavy visual pathway that blends vision care, localization, and complex diagnostic workups.",
    ["vision", "localization", "diagnosis"],
    [
      makeSignal("preserve-vision", "yes", 4, "vision as a core draw"),
      makeSignal("anatomic-localization", "yes", 3, "careful localization"),
      makeSignal("diagnostic-puzzle", "yes", 3, "diagnostic puzzles"),
      makeSignal("long-workups", "yes", 2, "longer workups"),
    ]
  ),
  makeFellowshipPath(
    "otology-neurotology",
    "Otology & Neurotology",
    "Otology",
    "otolaryngology",
    "A highly focused ENT path built around hearing, skull base anatomy, and fine technical precision.",
    ["sensory systems", "anatomy", "fine motor"],
    [
      makeSignal("sensory-systems", "yes", 3, "sensory systems as a draw"),
      makeSignal("head-and-neck-interest", "yes", 3, "head and neck anatomy"),
      makeSignal("fine-motor-precision", "yes", 3, "fine technical work"),
      makeSignal("focused-expertise", "yes", 2, "narrow expertise"),
    ]
  ),
  makeFellowshipPath(
    "rhinology-skull-base",
    "Rhinology & Skull Base Surgery",
    "Rhinology",
    "otolaryngology",
    "Focused head-and-neck surgery with anatomy, precision, and a clinic-to-OR mix around sinonasal disease.",
    ["anatomy", "procedures", "head and neck"],
    [
      makeSignal("head-and-neck-interest", "yes", 4, "head and neck anatomy"),
      makeSignal("sensory-systems", "yes", 2, "ENT content as a draw"),
      makeSignal("fine-motor-precision", "yes", 3, "precise technical work"),
      makeSignal("mixed-clinic-procedures", "yes", 2, "clinic plus procedures"),
    ]
  ),
  makeFellowshipPath(
    "laryngology",
    "Laryngology",
    "Laryngology",
    "otolaryngology",
    "A focused airway and voice path that mixes procedures, clinic, and communication-heavy patient goals.",
    ["voice", "airway", "procedures"],
    [
      makeSignal("head-and-neck-interest", "yes", 3, "head and neck anatomy"),
      makeSignal("ent-content", "yes", 3, "ENT clinic content"),
      makeSignal("focused-outpatient-procedures", "yes", 3, "focused outpatient procedures"),
      makeSignal("longer-conversations", "yes", 2, "communication around voice and function"),
    ]
  ),
  makeFellowshipPath(
    "facial-plastic-reconstructive-surgery",
    "Facial Plastic & Reconstructive Surgery",
    "Facial Plast",
    "otolaryngology",
    "Fine technical head-and-neck surgery with visible results and a strong focus on form and function.",
    ["fine motor", "head and neck", "immediate results"],
    [
      makeSignal("fine-motor-precision", "yes", 4, "very fine technical work"),
      makeSignal("head-and-neck-interest", "yes", 3, "head and neck anatomy"),
      makeSignal("immediate-physical-result", "yes", 3, "seeing a visible result"),
      makeSignal("focused-outpatient-procedures", "yes", 2, "focused procedural workflows"),
    ]
  ),
  makeFellowshipPath(
    "endourology-stone-disease",
    "Endourology & Stone Disease",
    "Endourology",
    "urology",
    "A procedural urology path centered on stones, obstruction, endoscopic skill, and immediate results.",
    ["GU", "procedures", "immediate results"],
    [
      makeSignal("urologic-problems", "yes", 4, "urologic problems as a draw"),
      makeSignal("focused-outpatient-procedures", "yes", 3, "focused procedures"),
      makeSignal("immediate-physical-result", "yes", 3, "seeing immediate physical results"),
      makeSignal("procedures", "yes", 2, "hands-on interventions"),
    ]
  ),
  makeFellowshipPath(
    "male-infertility-andrology",
    "Male Infertility & Andrology",
    "Andrology",
    "urology",
    "A clinic-heavy, focused urology path with procedures, longer relationships, and reproductive problem-solving.",
    ["GU", "continuity", "focused expertise"],
    [
      makeSignal("urologic-problems", "yes", 4, "urologic problems as a draw"),
      makeSignal("longer-conversations", "yes", 2, "longer visits and decision-making"),
      makeSignal("continuity-follow-up", "yes", 3, "following patients over time"),
      makeSignal("focused-expertise", "yes", 2, "focused expertise"),
    ]
  ),
  makeFellowshipPath(
    "pediatric-urology",
    "Pediatric Urology",
    "Peds Uro",
    "urology",
    "A pediatric, reconstructive, and continuity-heavy branch of urology for people who like children and families.",
    ["kids", "GU", "continuity"],
    [
      makeSignal("urologic-problems", "yes", 4, "urologic content as a draw"),
      makeSignal("children-large-share", "yes", 4, "a strong pull toward children"),
      makeSignal("continuity-follow-up", "yes", 2, "longitudinal follow-up"),
      makeSignal("mixed-clinic-procedures", "yes", 2, "clinic plus procedures"),
    ]
  ),
  makeFellowshipPath(
    "reconstructive-urology",
    "Reconstructive Urology",
    "Recon Uro",
    "urology",
    "A focused reconstructive branch built around function, anatomy, procedures, and longer arcs of recovery.",
    ["GU", "function", "procedures"],
    [
      makeSignal("urologic-problems", "yes", 4, "urologic problems as a draw"),
      makeSignal("continuity-follow-up", "yes", 3, "following outcomes over time"),
      makeSignal("focused-outpatient-procedures", "yes", 3, "focused procedural care"),
      makeSignal("fine-motor-precision", "yes", 2, "precise technical work"),
    ]
  ),
  makeFellowshipPath(
    "brain-injury-medicine",
    "Brain Injury Medicine",
    "Brain Injury",
    "physical-medicine-rehab",
    "A rehabilitation path centered on disability, function, teams, and longer recovery arcs after neurologic injury.",
    ["rehab", "disability", "teams"],
    [
      makeSignal("rehab-team-draw", "yes", 4, "working with rehab teams"),
      makeSignal("disability-and-qol", "yes", 4, "disability and quality of life"),
      makeSignal("function-over-diagnosis", "yes", 3, "function over a single diagnosis"),
      makeSignal("hospital-vs-office", "yes", 2, "comfort with hospital-based recovery care"),
    ]
  ),
  makeFellowshipPath(
    "pediatric-rehabilitation-medicine",
    "Pediatric Rehabilitation Medicine",
    "Peds Rehab",
    "physical-medicine-rehab",
    "Function-focused rehab for children with longitudinal care, caregivers, and interdisciplinary teams.",
    ["kids", "rehab", "continuity"],
    [
      makeSignal("function-rehab", "yes", 4, "restoring function"),
      makeSignal("children-large-share", "yes", 4, "a large pediatric share"),
      makeSignal("rehab-team-draw", "yes", 3, "rehab teams as a draw"),
      makeSignal("continuity-follow-up", "yes", 2, "longitudinal follow-up"),
    ]
  ),
  makeFellowshipPath(
    "neuromuscular-medicine-pmr",
    "Neuromuscular Medicine",
    "Neuromusc",
    "physical-medicine-rehab",
    "A PM&R path for people drawn to localization, function, disability, and longitudinal neuromuscular disease.",
    ["localization", "function", "continuity"],
    [
      makeSignal("function-rehab", "yes", 3, "restoring function"),
      makeSignal("anatomic-localization", "yes", 3, "careful localization"),
      makeSignal("long-workups", "yes", 3, "longer workups"),
      makeSignal("continuity-follow-up", "yes", 2, "seeing patients over time"),
    ]
  ),
  makeFellowshipPath(
    "pain-medicine-pmr",
    "Pain Medicine",
    "Pain Med",
    "physical-medicine-rehab",
    "Procedural outpatient PM&R with continuity, symptom relief, and long-term function in mind.",
    ["procedures", "continuity", "function"],
    [
      makeSignal("office-procedures-balance", "yes", 3, "office procedures as a balance"),
      makeSignal("continuity-follow-up", "yes", 3, "longitudinal follow-up"),
      makeSignal("communication-over-procedures", "yes", 2, "talking through decisions"),
      makeSignal("function-rehab", "yes", 2, "function and mobility mattering"),
    ]
  ),
  makeFellowshipPath(
    "adult-congenital-heart-disease",
    "Adult Congenital Heart Disease",
    "ACHD",
    "med-peds",
    "A classic med-peds branch for people who like cardiology, continuity, and caring across pediatric-to-adult transition.",
    ["cross-age", "cardiology", "continuity"],
    [
      makeSignal("keep-adult-peds-open", "yes", 4, "keeping both adult and pediatric medicine open"),
      makeSignal("adult-and-children", "yes", 4, "switching between adult and pediatric care"),
      makeSignal("physiology", "yes", 2, "cardiovascular physiology"),
      makeSignal("continuity-follow-up", "yes", 2, "long-term follow-up"),
    ]
  ),
  makeFellowshipPath(
    "allergy-immunology-med-peds",
    "Allergy and Immunology",
    "A/I",
    "med-peds",
    "A cross-age, outpatient-focused path for people who like mechanism, continuity, and focused expertise.",
    ["cross-age", "outpatient", "pathophysiology"],
    [
      makeSignal("keep-adult-peds-open", "yes", 4, "keeping both age ranges open"),
      makeSignal("focused-expertise", "yes", 3, "focused expertise"),
      makeSignal("pathophysiology-draw", "yes", 3, "mechanism-heavy reasoning"),
      makeSignal("low-emergencies", "yes", 2, "a steadier outpatient pace"),
    ]
  ),
  makeFellowshipPath(
    "hospice-palliative-medicine-med-peds",
    "Hospice and Palliative Medicine",
    "Palliative",
    "med-peds",
    "A cross-age communication-heavy path centered on quality of life, serious illness, and continuity through change.",
    ["cross-age", "quality of life", "communication"],
    [
      makeSignal("keep-adult-peds-open", "yes", 4, "keeping both adult and pediatric care open"),
      makeSignal("disability-and-qol", "yes", 3, "quality of life and adaptation"),
      makeSignal("longer-conversations", "yes", 3, "meaningful longer conversations"),
      makeSignal("continuity-follow-up", "yes", 2, "following patients over time"),
    ]
  ),
  makeFellowshipPath(
    "sports-medicine-med-peds",
    "Sports Medicine",
    "Sports Med",
    "med-peds",
    "A cross-age outpatient path for people who like musculoskeletal care, recovery goals, and active patients.",
    ["cross-age", "sports", "outpatient"],
    [
      makeSignal("adult-and-children", "yes", 4, "switching between adults and children"),
      makeSignal("sports-and-return", "yes", 4, "return-to-activity goals"),
      makeSignal("outpatient-most-days", "yes", 2, "mostly outpatient practice"),
      makeSignal("office-procedures-balance", "yes", 2, "office procedures"),
    ]
  ),
  makeFellowshipPath(
    "dermatopathology-pathology",
    "Dermatopathology",
    "Dermpath",
    "pathology",
    "A visually precise skin pathology branch for people drawn to microscopy, pattern recognition, and focused diagnosis.",
    ["microscopy", "visual detail", "skin"],
    [
      makeSignal("microscope-over-bedside", "yes", 4, "microscopy over bedside care"),
      makeSignal("close-visual-detail", "yes", 3, "close visual detail"),
      makeSignal("visual-patterns", "yes", 3, "visual pattern recognition"),
      makeSignal("away-from-bedside", "yes", 2, "important indirect work"),
    ]
  ),
  makeFellowshipPath(
    "neuropathology",
    "Neuropathology",
    "Neuropath",
    "pathology",
    "Microscopy and disease classification centered on the brain, nerves, and nervous system structures.",
    ["microscopy", "brain", "localization"],
    [
      makeSignal("microscope-over-bedside", "yes", 4, "microscopy as a draw"),
      makeSignal("anatomic-localization", "yes", 3, "anatomic localization"),
      makeSignal("subtle-patterns", "yes", 3, "subtle patterns and distinctions"),
      makeSignal("away-from-bedside", "yes", 2, "valuable work away from the bedside"),
    ]
  ),
  makeFellowshipPath(
    "molecular-genetic-pathology",
    "Molecular Genetic Pathology",
    "Molecular",
    "pathology",
    "Data- and mechanism-heavy pathology for people who like subtle distinctions, classification, and disease pathways.",
    ["molecular", "diagnosis", "pathophysiology"],
    [
      makeSignal("microscope-over-bedside", "yes", 3, "diagnostic work away from the bedside"),
      makeSignal("subtle-patterns", "yes", 3, "fine distinctions"),
      makeSignal("pathophysiology-draw", "yes", 3, "mechanism-heavy reasoning"),
      makeSignal("away-from-bedside", "yes", 2, "indirect but central work"),
    ]
  ),
  makeFellowshipPath(
    "forensic-pathology",
    "Forensic Pathology",
    "Forensic",
    "pathology",
    "A highly focused pathology path for people drawn to diagnosis, systems-facing impact, and careful reconstruction of what happened.",
    ["diagnosis", "focused expertise", "indirect impact"],
    [
      makeSignal("away-from-bedside", "yes", 3, "important work away from the bedside"),
      makeSignal("diagnostic-workup", "yes", 3, "figuring out what happened"),
      makeSignal("focused-expertise", "yes", 3, "focused expertise"),
      makeSignal("certainty-over-ambiguity", "yes", 2, "moving toward diagnostic certainty"),
    ]
  ),
  makeFellowshipPath(
    "academic-general-pediatrics",
    "Academic General Pediatrics",
    "Academic Peds",
    "pediatrics",
    "Broad pediatric care with teaching, systems work, prevention, continuity, and family-centered communication.",
    ["pediatrics", "academics", "continuity"],
    [
      makeSignal("children-large-share", "yes", 4, "a large pediatric share"),
      makeSignal("routine-preventive-care", "yes", 3, "prevention and health maintenance"),
      makeSignal("caregiver-role", "yes", 3, "working with caregivers"),
      makeSignal("continuity-follow-up", "yes", 2, "following patients over time"),
    ]
  ),
  makeFellowshipPath(
    "advanced-heart-failure-transplant-cardiology",
    "Advanced Heart Failure & Transplant Cardiology",
    "Adv HF/Transplant",
    "internal-medicine",
    "High-complexity cardiovascular care with physiology, hospital medicine, longitudinal arcs, and transplant decision-making.",
    ["cardiology", "transplant", "physiology"],
    [
      makeSignal("physiology", "yes", 4, "cardiovascular physiology"),
      makeSignal("complex-hospitalized-adults", "yes", 4, "complex hospitalized adults"),
      makeSignal("pathophysiology-draw", "yes", 3, "mechanism-heavy reasoning"),
      makeSignal("treatment-over-time", "yes", 2, "seeing treatment decisions play out"),
    ]
  ),
  makeFellowshipPath(
    "bone-soft-tissue-pathology",
    "Bone & Soft Tissue Pathology",
    "Bone/Soft Tissue",
    "pathology",
    "Focused diagnostic pathology around musculoskeletal tumors and soft tissue disease patterns.",
    ["pathology", "MSK", "diagnosis"],
    [
      makeSignal("microscope-over-bedside", "yes", 4, "microscopy over bedside care"),
      makeSignal("musculoskeletal-interest", "yes", 3, "musculoskeletal problems"),
      makeSignal("subtle-patterns", "yes", 3, "subtle visual distinctions"),
      makeSignal("focused-expertise", "yes", 2, "deep focused expertise"),
    ]
  ),
  makeFellowshipPath(
    "cancer-rehabilitation",
    "Cancer Rehabilitation",
    "Cancer Rehab",
    "physical-medicine-rehab",
    "Function-focused rehabilitation for patients living with cancer, treatment effects, disability, and recovery goals.",
    ["cancer", "rehab", "function"],
    [
      makeSignal("function-rehab", "yes", 4, "restoring function"),
      makeSignal("disability-and-qol", "yes", 4, "quality of life and adaptation"),
      makeSignal("recovery-over-stabilization", "yes", 3, "recovery after illness"),
      makeSignal("long-term-trust", "yes", 2, "longer treatment relationships"),
    ]
  ),
  makeFellowshipPath(
    "child-abuse-pediatrics",
    "Child Abuse",
    "Child Abuse",
    "pediatrics",
    "Pediatric expertise at the intersection of medical evaluation, family systems, safety, and careful communication.",
    ["pediatrics", "advocacy", "families"],
    [
      makeSignal("children-large-share", "yes", 4, "a large pediatric share"),
      makeSignal("family-context", "yes", 3, "family and social context"),
      makeSignal("caregiver-role", "yes", 3, "caregiver involvement"),
      makeSignal("uncertainty-tolerance", "yes", 2, "working through uncertainty"),
    ]
  ),
  makeFellowshipPath(
    "clinical-cardiac-electrophysiology",
    "Clinical Cardiac Electrophysiology",
    "Cardiac EP",
    "internal-medicine",
    "A focused cardiology path around arrhythmias, procedures, devices, physiology, and precise pattern recognition.",
    ["cardiology", "procedures", "physiology"],
    [
      makeSignal("physiology", "yes", 4, "cardiac physiology"),
      makeSignal("procedures", "yes", 3, "procedural work"),
      makeSignal("subtle-patterns", "yes", 3, "subtle pattern recognition"),
      makeSignal("focused-expertise", "yes", 2, "narrow expertise"),
    ]
  ),
  makeFellowshipPath(
    "clinical-neurophysiology",
    "Clinical Neurophysiology",
    "Neurophys",
    "neurology",
    "Neurologic localization and interpretation-heavy work using EEG, EMG, and other physiologic data.",
    ["neurology", "interpretation", "localization"],
    [
      makeSignal("anatomic-localization", "yes", 4, "anatomic localization"),
      makeSignal("images-and-data", "yes", 3, "structured data interpretation"),
      makeSignal("interpretation-over-procedures", "yes", 3, "interpretation-heavy work"),
      makeSignal("subtle-patterns", "yes", 2, "subtle distinctions"),
    ]
  ),
  makeFellowshipPath(
    "clinical-ultrasound",
    "Clinical Ultrasound",
    "Ultrasound",
    "emergency-medicine",
    "Bedside imaging, procedures, acute diagnosis, and real-time decision support in emergency care.",
    ["ultrasound", "acute care", "procedures"],
    [
      makeSignal("images-and-data", "yes", 4, "image interpretation"),
      makeSignal("acuity", "yes", 3, "acute decision-making"),
      makeSignal("procedures", "yes", 2, "hands-on procedures"),
      makeSignal("quick-decisions", "yes", 2, "quick decisions with incomplete information"),
    ]
  ),
  makeFellowshipPath(
    "emergency-radiology",
    "Emergency Radiology",
    "Emergency Rads",
    "radiology",
    "Fast-paced image interpretation for acute presentations, trauma, and urgent diagnostic questions.",
    ["radiology", "emergency", "images"],
    [
      makeSignal("images-and-data", "yes", 4, "image-heavy work"),
      makeSignal("regular-urgency", "yes", 3, "urgent situations"),
      makeSignal("consultant-handoffs", "yes", 2, "consultant handoffs"),
      makeSignal("behind-the-scenes", "yes", 2, "central indirect care"),
    ]
  ),
  makeFellowshipPath(
    "global-emergency-medicine",
    "Global Emergency Medicine",
    "Global EM",
    "emergency-medicine",
    "Emergency care with systems thinking, resource-variable settings, population context, and acute problem solving.",
    ["emergency", "global health", "systems"],
    [
      makeSignal("acuity", "yes", 3, "acute decision-making"),
      makeSignal("breadth", "yes", 3, "broad clinical variety"),
      makeSignal("community-generalist", "yes", 2, "community context"),
      makeSignal("quick-decisions", "yes", 2, "acting with incomplete information"),
    ]
  ),
  makeFellowshipPath(
    "hematology",
    "Hematology",
    "Hematology",
    "internal-medicine",
    "Mechanism-heavy adult medicine focused on blood disorders, diagnostic reasoning, and longitudinal complexity.",
    ["hematology", "diagnosis", "complexity"],
    [
      makeSignal("pathophysiology-draw", "yes", 4, "mechanism-heavy reasoning"),
      makeSignal("diagnostic-workup", "yes", 3, "diagnostic workups"),
      makeSignal("complex-hospitalized-adults", "yes", 2, "complex adults"),
      makeSignal("continuity-follow-up", "yes", 2, "following patients over time"),
    ]
  ),
  makeFellowshipPath(
    "oncology",
    "Oncology",
    "Oncology",
    "internal-medicine",
    "Cancer medicine with longitudinal treatment planning, complex decisions, communication, and multidisciplinary care.",
    ["oncology", "continuity", "complexity"],
    [
      makeSignal("long-term-trust", "yes", 4, "longer treatment relationships"),
      makeSignal("complex-hospitalized-adults", "yes", 3, "complex adult illness"),
      makeSignal("communication-over-procedures", "yes", 2, "talking through decisions"),
      makeSignal("pathophysiology-draw", "yes", 2, "disease mechanism"),
    ]
  ),
  makeFellowshipPath(
    "interventional-cardiology",
    "Interventional Cardiology",
    "Interv Cards",
    "internal-medicine",
    "Procedure-forward cardiology with physiology, acute decisions, devices, and immediate physical results.",
    ["cardiology", "procedures", "acuity"],
    [
      makeSignal("procedures", "yes", 4, "procedural work"),
      makeSignal("physiology", "yes", 3, "cardiovascular physiology"),
      makeSignal("immediate-physical-result", "yes", 3, "immediate physical results"),
      makeSignal("regular-urgency", "yes", 2, "urgent situations"),
    ]
  ),
  makeFellowshipPath(
    "interventional-pulmonology",
    "Interventional Pulmonology",
    "Interv Pulm",
    "internal-medicine",
    "Airway, pleural, and thoracic procedures paired with pulmonary physiology and consultative expertise.",
    ["pulmonary", "procedures", "consults"],
    [
      makeSignal("procedures", "yes", 4, "procedural work"),
      makeSignal("physiology", "yes", 3, "pulmonary physiology"),
      makeSignal("consultant-expertise", "yes", 3, "focused consultant expertise"),
      makeSignal("hospital-vs-office", "yes", 2, "hospital-based work"),
    ]
  ),
  makeFellowshipPath(
    "medical-genetics",
    "Medical Genetics",
    "Genetics",
    "med-peds",
    "Cross-age diagnostic care centered on inherited disease, family context, counseling, and long diagnostic arcs.",
    ["genetics", "families", "diagnosis"],
    [
      makeSignal("diagnostic-workup", "yes", 4, "figuring out what is going on"),
      makeSignal("family-context", "yes", 3, "family context"),
      makeSignal("adult-and-children", "yes", 3, "cross-age care"),
      makeSignal("long-workups", "yes", 2, "longer diagnostic workups"),
    ]
  ),
  makeFellowshipPath(
    "pediatric-gastroenterology",
    "Pediatric Gastroenterology",
    "Peds GI",
    "pediatrics",
    "Pediatric digestive disease care with physiology, procedures, continuity, and family-centered management.",
    ["pediatrics", "GI", "continuity"],
    [
      makeSignal("children-large-share", "yes", 4, "a large pediatric share"),
      makeSignal("pathophysiology-draw", "yes", 3, "mechanism-heavy reasoning"),
      makeSignal("clinic-with-procedures", "yes", 2, "clinic with procedures"),
      makeSignal("continuity-follow-up", "yes", 2, "following patients over time"),
    ]
  ),
  makeFellowshipPath(
    "pediatric-hospital-medicine",
    "Pediatric Hospital Medicine",
    "Peds Hospital",
    "pediatrics",
    "Hospital-based pediatric care with acute teams, families, diagnostic breadth, and inpatient coordination.",
    ["pediatrics", "hospital", "teams"],
    [
      makeSignal("children-large-share", "yes", 4, "a large pediatric share"),
      makeSignal("hospital-vs-office", "yes", 3, "hospital-based work"),
      makeSignal("acute-teamwork", "yes", 3, "team-based acute care"),
      makeSignal("breadth", "yes", 2, "broad clinical variety"),
    ]
  ),
  makeFellowshipPath(
    "pediatric-infectious-diseases",
    "Pediatric Infectious Diseases",
    "Peds ID",
    "pediatrics",
    "Consultative pediatric diagnosis around infections, immune context, antimicrobials, and complex workups.",
    ["pediatrics", "infection", "diagnosis"],
    [
      makeSignal("children-large-share", "yes", 4, "a large pediatric share"),
      makeSignal("diagnostic-workup", "yes", 3, "diagnostic workups"),
      makeSignal("consultant-expertise", "yes", 3, "focused consultant expertise"),
      makeSignal("pathophysiology-draw", "yes", 2, "mechanism-heavy reasoning"),
    ]
  ),
  makeFellowshipPath(
    "pediatric-nephrology",
    "Pediatric Nephrology",
    "Peds Neph",
    "pediatrics",
    "Kidney physiology, chronic disease, inpatient consults, and longitudinal care for children and families.",
    ["pediatrics", "kidney", "physiology"],
    [
      makeSignal("children-large-share", "yes", 4, "a large pediatric share"),
      makeSignal("physiology", "yes", 3, "physiology-heavy work"),
      makeSignal("continuity-follow-up", "yes", 3, "following patients over time"),
      makeSignal("complex-hospitalized-adults", "yes", 1, "complex inpatient-style problems"),
    ]
  ),
  makeFellowshipPath(
    "pediatric-pulmonology",
    "Pediatric Pulmonology",
    "Peds Pulm",
    "pediatrics",
    "Pulmonary physiology, chronic respiratory disease, inpatient consults, and longitudinal pediatric care.",
    ["pediatrics", "pulmonary", "physiology"],
    [
      makeSignal("children-large-share", "yes", 4, "a large pediatric share"),
      makeSignal("physiology", "yes", 3, "pulmonary physiology"),
      makeSignal("continuity-follow-up", "yes", 3, "following patients over time"),
      makeSignal("hospital-vs-office", "yes", 1, "some hospital-based work"),
    ]
  ),
  makeFellowshipPath(
    "pediatric-rheumatology",
    "Pediatric Rheumatology",
    "Peds Rheum",
    "pediatrics",
    "Longitudinal pediatric immune and inflammatory disease care with diagnostic subtlety and family partnership.",
    ["pediatrics", "rheumatology", "continuity"],
    [
      makeSignal("children-large-share", "yes", 4, "a large pediatric share"),
      makeSignal("continuity-follow-up", "yes", 3, "following patients over time"),
      makeSignal("diagnostic-workup", "yes", 3, "diagnostic workups"),
      makeSignal("subtle-patterns", "yes", 2, "subtle patterns"),
    ]
  ),
  makeFellowshipPath(
    "pediatric-surgery",
    "Pediatric Surgery",
    "Peds Surgery",
    "general-surgery",
    "Operative care for infants, children, and adolescents with acuity, family communication, and technical skill.",
    ["pediatrics", "OR", "surgery"],
    [
      makeSignal("children-large-share", "yes", 4, "a large pediatric share"),
      makeSignal("operating-room", "yes", 4, "operating room energy"),
      makeSignal("large-operations", "yes", 3, "larger operations"),
      makeSignal("manual-skill", "yes", 2, "technical manual skill"),
    ]
  ),
  makeFellowshipPath(
    "pediatric-transplant-hepatology",
    "Pediatric Transplant Hepatology",
    "Peds Transplant Hep",
    "pediatrics",
    "Complex pediatric liver disease and transplant care with physiology, longitudinal follow-up, and hospital complexity.",
    ["pediatrics", "transplant", "hepatology"],
    [
      makeSignal("children-large-share", "yes", 4, "a large pediatric share"),
      makeSignal("complex-hospitalized-adults", "yes", 3, "complex inpatient-style problems"),
      makeSignal("pathophysiology-draw", "yes", 3, "mechanism-heavy reasoning"),
      makeSignal("treatment-over-time", "yes", 2, "seeing treatment decisions play out"),
    ]
  ),
  makeFellowshipPath(
    "pediatric-adolescent-gynecology",
    "Pediatric and Adolescent Gynecology",
    "Peds/Adol Gyn",
    "obgyn",
    "Gynecologic care for younger patients with communication, development, family context, and outpatient procedures.",
    ["gynecology", "adolescents", "communication"],
    [
      makeSignal("women-health", "yes", 4, "gynecologic care"),
      makeSignal("children-large-share", "yes", 3, "younger patients"),
      makeSignal("longer-conversations", "yes", 3, "longer conversations"),
      makeSignal("office-procedures-balance", "yes", 2, "office procedures"),
    ]
  ),
  makeFellowshipPath(
    "pulmonary-disease",
    "Pulmonary Disease",
    "Pulmonary",
    "internal-medicine",
    "Pulmonary physiology, chronic respiratory disease, consults, procedures, and clinic-hospital balance.",
    ["pulmonary", "physiology", "consults"],
    [
      makeSignal("physiology", "yes", 4, "pulmonary physiology"),
      makeSignal("continuity-follow-up", "yes", 3, "following patients over time"),
      makeSignal("consultant-expertise", "yes", 2, "focused consultant work"),
      makeSignal("clinic-with-procedures", "yes", 2, "clinic with procedures"),
    ]
  ),
  makeFellowshipPath(
    "surgical-critical-care",
    "Surgical Critical Care",
    "Surg Crit Care",
    "general-surgery",
    "High-acuity ICU care for surgical patients with urgent decisions, physiology, teams, and perioperative complexity.",
    ["surgery", "critical care", "ICU"],
    [
      makeSignal("regular-urgency", "yes", 4, "urgent or high-pressure situations"),
      makeSignal("physiology", "yes", 3, "real-time physiology"),
      makeSignal("acute-teamwork", "yes", 3, "coordinated acute teams"),
      makeSignal("hospital-vs-office", "yes", 2, "hospital-based work"),
    ]
  ),
  makeFellowshipPath(
    "thoracic-surgery",
    "Thoracic Surgery",
    "Thoracic Surg",
    "general-surgery",
    "Chest surgery with large operations, anatomy, cancer care, procedures, and perioperative ownership.",
    ["surgery", "thoracic", "OR"],
    [
      makeSignal("operating-room", "yes", 4, "operating room energy"),
      makeSignal("large-operations", "yes", 4, "large operations"),
      makeSignal("narrow-anatomy", "yes", 2, "focused anatomy"),
      makeSignal("acute-teamwork", "yes", 2, "team-based operative care"),
    ]
  ),
];

const specialtyById = Object.fromEntries(specialties.map((specialty) => [specialty.id, specialty]));
const fellowshipPathsBySpecialtyId = fellowshipPaths.reduce((grouped, path) => {
  if (!grouped[path.parentId]) {
    grouped[path.parentId] = [];
  }

  grouped[path.parentId].push(path);
  return grouped;
}, {});

const compareDataById = {
  "anesthesiology": {
    name: "Anesthesiology",
    table: "AN-1",
    matchedN: 1136,
    unmatchedN: 191,
    matched: { contiguousRanks: 13.7, step2: 252, research: 3.8, publications: 9.0, work: 2.0, volunteer: 4.3, aoa: 14.4, nih: 33.1, phd: 3.8, otherGrad: 17.2 },
    unmatched: { contiguousRanks: 7.0, step2: 240, research: 3.1, publications: 5.4, work: 2.4, volunteer: 4.1, aoa: 0.5, nih: 24.1, phd: 1.6, otherGrad: 24.1 },
    neededFor90: { step2: 251, contiguousRanks: 12.2 },
  },
  "child-neurology": {
    name: "Child Neurology",
    table: "CN-1",
    matchedN: 115,
    unmatchedN: 2,
    matched: { contiguousRanks: 12.9, step2: 248, research: 3.0, publications: 9.8, work: 1.7, volunteer: 4.5, aoa: 13.9, nih: 30.4, phd: 13.4, otherGrad: 20.5 },
    unmatched: { contiguousRanks: 8.5, step2: 230, research: 2.0, publications: 1.0, work: 0.5, volunteer: 3.5, aoa: 0.0, nih: 0.0, phd: 0.0, otherGrad: 0.0 },
    neededFor90: { step2: 216, contiguousRanks: 3.9 },
  },
  "dermatology": {
    name: "Dermatology",
    table: "DM-1",
    matchedN: 314,
    unmatchedN: 126,
    matched: { contiguousRanks: 8.8, step2: 257, research: 6.4, publications: 27.7, work: 2.3, volunteer: 5.3, aoa: 41.1, nih: 41.7, phd: 9.8, otherGrad: 17.1 },
    unmatched: { contiguousRanks: 4.5, step2: 250, research: 4.9, publications: 19.0, work: 2.5, volunteer: 5.6, aoa: 23.8, nih: 23.0, phd: 1.7, otherGrad: 17.2 },
    neededFor90: { step2: null, contiguousRanks: 11.2 },
  },
  "diagnostic-radiology": {
    name: "Diagnostic Radiology",
    table: "DR-1",
    matchedN: 625,
    unmatchedN: 86,
    matched: { contiguousRanks: 13.8, step2: 256, research: 4.4, publications: 12.0, work: 1.9, volunteer: 3.9, aoa: 19.5, nih: 29.9, phd: 3.5, otherGrad: 19.3 },
    unmatched: { contiguousRanks: 5.5, step2: 241, research: 3.6, publications: 8.0, work: 2.1, volunteer: 3.6, aoa: 4.7, nih: 23.3, phd: 2.6, otherGrad: 18.2 },
    neededFor90: { step2: 258, contiguousRanks: 12.7 },
  },
  "emergency-medicine": {
    name: "Emergency Medicine",
    table: "EM-1",
    matchedN: 1027,
    unmatchedN: 20,
    matched: { contiguousRanks: 15.4, step2: 248, research: 2.8, publications: 5.7, work: 2.2, volunteer: 4.4, aoa: 11.8, nih: 24.8, phd: 1.0, otherGrad: 19.9 },
    unmatched: { contiguousRanks: 4.5, step2: 234, research: 2.3, publications: 5.0, work: 2.8, volunteer: 4.8, aoa: 0.0, nih: 15.0, phd: 5.0, otherGrad: 35.0 },
    neededFor90: { step2: 174, contiguousRanks: 4.9 },
  },
  "family-medicine": {
    name: "Family Medicine",
    table: "FM-1",
    matchedN: 1170,
    unmatchedN: 12,
    matched: { contiguousRanks: 13.5, step2: 244, research: 2.1, publications: 4.2, work: 1.8, volunteer: 4.6, aoa: 9.4, nih: 25.5, phd: 0.9, otherGrad: 17.0 },
    unmatched: { contiguousRanks: 5.1, step2: 231, research: 1.8, publications: 1.4, work: 2.3, volunteer: 7.4, aoa: 0.0, nih: 16.7, phd: 0.0, otherGrad: 8.3 },
    neededFor90: { step2: 168, contiguousRanks: 2.6 },
  },
  "general-surgery": {
    name: "General Surgery",
    table: "GS-1",
    matchedN: 858,
    unmatchedN: 181,
    matched: { contiguousRanks: 14.1, step2: 253, research: 4.2, publications: 10.9, work: 2.0, volunteer: 4.5, aoa: 22.0, nih: 27.7, phd: 1.8, otherGrad: 21.7 },
    unmatched: { contiguousRanks: 5.6, step2: 238, research: 3.7, publications: 7.3, work: 2.5, volunteer: 4.2, aoa: 2.8, nih: 16.6, phd: 1.2, otherGrad: 23.8 },
    neededFor90: { step2: 255, contiguousRanks: 12.6 },
  },
  "internal-medicine": {
    name: "Internal Medicine",
    table: "IM-1",
    matchedN: 3024,
    unmatchedN: 64,
    matched: { contiguousRanks: 13.2, step2: 251, research: 3.3, publications: 8.7, work: 1.8, volunteer: 4.2, aoa: 15.9, nih: 31.8, phd: 5.0, otherGrad: 19.0 },
    unmatched: { contiguousRanks: 3.6, step2: 234, research: 3.3, publications: 6.2, work: 1.9, volunteer: 4.1, aoa: 4.7, nih: 21.9, phd: 4.8, otherGrad: 27.0 },
    neededFor90: { step2: 214, contiguousRanks: 4.6 },
  },
  "internal-medicine-pediatrics": {
    name: "Internal Medicine/Pediatrics",
    table: "IP-1",
    matchedN: 294,
    unmatchedN: 46,
    matched: { contiguousRanks: 11.3, step2: 253, research: 3.1, publications: 6.9, work: 1.7, volunteer: 5.1, aoa: 22.4, nih: 36.1, phd: 1.8, otherGrad: 24.8 },
    unmatched: { contiguousRanks: 3.0, step2: 243, research: 2.6, publications: 6.2, work: 2.0, volunteer: 4.8, aoa: 6.5, nih: 17.4, phd: 4.5, otherGrad: 34.1 },
    neededFor90: { step2: 245, contiguousRanks: 6.6 },
  },
  "interventional-radiology": {
    name: "Interventional Radiology",
    table: "IR-1",
    matchedN: 117,
    unmatchedN: 24,
    matched: { contiguousRanks: 6.5, step2: 253, research: 4.7, publications: 15.8, work: 2.2, volunteer: 3.9, aoa: 17.9, nih: 31.6, phd: 2.8, otherGrad: 23.1 },
    unmatched: { contiguousRanks: 2.9, step2: 245, research: 4.6, publications: 10.1, work: 3.1, volunteer: 15.6, aoa: 12.5, nih: 16.7, phd: 0.0, otherGrad: 30.4 },
    neededFor90: { step2: null, contiguousRanks: 5.6 },
  },
  "neurology": {
    name: "Neurology",
    table: "N-1",
    matchedN: 488,
    unmatchedN: 30,
    matched: { contiguousRanks: 13.1, step2: 250, research: 3.5, publications: 8.8, work: 1.8, volunteer: 4.2, aoa: 12.5, nih: 26.8, phd: 4.7, otherGrad: 19.5 },
    unmatched: { contiguousRanks: 4.1, step2: 236, research: 2.8, publications: 5.5, work: 1.8, volunteer: 3.9, aoa: 0.0, nih: 16.7, phd: 3.6, otherGrad: 14.3 },
    neededFor90: { step2: 225, contiguousRanks: 6.1 },
  },
  "neurological-surgery": {
    name: "Neurological Surgery",
    table: "NS-1",
    matchedN: 161,
    unmatchedN: 71,
    matched: { contiguousRanks: 16.7, step2: 255, research: 5.8, publications: 37.4, work: 2.2, volunteer: 4.2, aoa: 28.0, nih: 46.0, phd: 6.8, otherGrad: 25.9 },
    unmatched: { contiguousRanks: 9.1, step2: 247, research: 5.5, publications: 31.8, work: 1.8, volunteer: 4.2, aoa: 14.1, nih: 25.4, phd: 7.9, otherGrad: 27.0 },
    neededFor90: { step2: null, contiguousRanks: 16.6 },
  },
  "obstetrics-gynecology": {
    name: "Obstetrics and Gynecology",
    table: "OB-1",
    matchedN: 925,
    unmatchedN: 149,
    matched: { contiguousRanks: 12.3, step2: 252, research: 3.8, publications: 9.0, work: 2.0, volunteer: 5.0, aoa: 22.1, nih: 28.5, phd: 1.4, otherGrad: 22.2 },
    unmatched: { contiguousRanks: 7.2, step2: 244, research: 3.3, publications: 6.8, work: 2.1, volunteer: 5.0, aoa: 9.4, nih: 22.8, phd: 4.3, otherGrad: 24.6 },
    neededFor90: { step2: 260, contiguousRanks: 11.8 },
  },
  "orthopaedic-surgery": {
    name: "Orthopaedic Surgery",
    table: "ORS-1",
    matchedN: 587,
    unmatchedN: 203,
    matched: { contiguousRanks: 11.8, step2: 257, research: 8.1, publications: 23.8, work: 2.5, volunteer: 4.8, aoa: 34.2, nih: 33.0, phd: 1.3, otherGrad: 18.2 },
    unmatched: { contiguousRanks: 6.3, step2: 246, research: 8.0, publications: 18.0, work: 2.4, volunteer: 4.8, aoa: 15.8, nih: 20.7, phd: 3.2, otherGrad: 24.7 },
    neededFor90: { step2: null, contiguousRanks: 13.3 },
  },
  "otolaryngology": {
    name: "Otolaryngology",
    table: "OTO-1",
    matchedN: 268,
    unmatchedN: 54,
    matched: { contiguousRanks: 13.6, step2: 256, research: 7.1, publications: 20.0, work: 2.0, volunteer: 4.3, aoa: 33.6, nih: 36.6, phd: 2.8, otherGrad: 17.9 },
    unmatched: { contiguousRanks: 7.2, step2: 251, research: 5.5, publications: 15.6, work: 2.4, volunteer: 6.7, aoa: 16.7, nih: 27.8, phd: 4.1, otherGrad: 24.5 },
    neededFor90: { step2: null, contiguousRanks: 12.7 },
  },
  "pathology": {
    name: "Pathology",
    table: "PTH-1",
    matchedN: 213,
    unmatchedN: 11,
    matched: { contiguousRanks: 12.4, step2: 247, research: 3.1, publications: 8.4, work: 1.9, volunteer: 3.3, aoa: 8.9, nih: 32.4, phd: 21.4, otherGrad: 14.4 },
    unmatched: { contiguousRanks: 6.5, step2: 232, research: 2.3, publications: 4.1, work: 3.2, volunteer: 4.7, aoa: 0.0, nih: 9.1, phd: 0.0, otherGrad: 20.0 },
    neededFor90: { step2: 217, contiguousRanks: 4.0 },
  },
  "pediatrics": {
    name: "Pediatrics",
    table: "PD-1",
    matchedN: 1216,
    unmatchedN: 2,
    matched: { contiguousRanks: 15.3, step2: 247, research: 2.6, publications: 6.4, work: 1.6, volunteer: 4.9, aoa: 13.4, nih: 28.7, phd: 3.1, otherGrad: 16.8 },
    unmatched: { contiguousRanks: 2.0, step2: 233, research: 0.5, publications: 21.5, work: 0.5, volunteer: 6.0, aoa: 0.0, nih: 50.0, phd: 50.0, otherGrad: 0.0 },
    neededFor90: { step2: 190, contiguousRanks: 3.3 },
  },
  "physical-medicine-rehabilitation": {
    name: "Physical Medicine and Rehabilitation",
    table: "PM-1",
    matchedN: 231,
    unmatchedN: 42,
    matched: { contiguousRanks: 13.7, step2: 248, research: 3.4, publications: 8.6, work: 1.8, volunteer: 4.8, aoa: 13.9, nih: 22.1, phd: 1.9, otherGrad: 16.1 },
    unmatched: { contiguousRanks: 5.1, step2: 236, research: 3.3, publications: 6.4, work: 2.2, volunteer: 4.9, aoa: 0.0, nih: 23.8, phd: 0.0, otherGrad: 12.5 },
    neededFor90: { step2: 249, contiguousRanks: 11.3 },
  },
  "plastic-surgery": {
    name: "Plastic Surgery",
    table: "PS-1",
    matchedN: 159,
    unmatchedN: 48,
    matched: { contiguousRanks: 13.6, step2: 256, research: 8.6, publications: 34.7, work: 2.7, volunteer: 5.0, aoa: 35.8, nih: 44.7, phd: 3.4, otherGrad: 24.0 },
    unmatched: { contiguousRanks: 7.4, step2: 247, research: 9.2, publications: 26.3, work: 2.4, volunteer: 4.9, aoa: 18.8, nih: 31.3, phd: 2.1, otherGrad: 27.1 },
    neededFor90: { step2: null, contiguousRanks: 13.0 },
  },
  "psychiatry": {
    name: "Psychiatry",
    table: "P-1",
    matchedN: 1051,
    unmatchedN: 123,
    matched: { contiguousRanks: 11.5, step2: 246, research: 3.0, publications: 7.5, work: 1.9, volunteer: 4.5, aoa: 9.2, nih: 30.4, phd: 4.8, otherGrad: 20.5 },
    unmatched: { contiguousRanks: 5.2, step2: 235, research: 3.1, publications: 4.6, work: 2.1, volunteer: 4.0, aoa: 1.6, nih: 26.0, phd: 2.7, otherGrad: 23.4 },
    neededFor90: { step2: 238, contiguousRanks: 8.4 },
  },
  "radiation-oncology": {
    name: "Radiation Oncology",
    table: "RO-1",
    matchedN: 103,
    unmatchedN: 3,
    matched: { contiguousRanks: 16.1, step2: 252, research: 4.2, publications: 15.9, work: 1.6, volunteer: 3.9, aoa: 15.5, nih: 34.0, phd: 14.4, otherGrad: 16.8 },
    unmatched: { contiguousRanks: 1.3, step2: 242, research: 2.0, publications: 13.5, work: 2.0, volunteer: 2.0, aoa: 0.0, nih: 33.3, phd: 100.0, otherGrad: 100.0 },
    neededFor90: { step2: 214, contiguousRanks: 4.8 },
  },
  "vascular-surgery": {
    name: "Vascular Surgery",
    table: "VS-1",
    matchedN: 64,
    unmatchedN: 6,
    matched: { contiguousRanks: 22.6, step2: 253, research: 4.6, publications: 12.8, work: 2.5, volunteer: 4.7, aoa: 14.1, nih: 37.5, phd: 1.7, otherGrad: 19.3 },
    unmatched: { contiguousRanks: 11.8, step2: 246, research: 4.5, publications: 8.0, work: 2.8, volunteer: 4.0, aoa: 16.7, nih: 0.0, phd: 20.0, otherGrad: 0.0 },
    neededFor90: { step2: 252, contiguousRanks: 16.8 },
  },
};

const specialtyCompareMap = {
  "anesthesiology": "anesthesiology",
  "child-neurology": "child-neurology",
  "dermatology": "dermatology",
  "emergency-medicine": "emergency-medicine",
  "family-medicine": "family-medicine",
  "general-surgery": "general-surgery",
  "internal-medicine": "internal-medicine",
  "interventional-radiology-integrated": "interventional-radiology",
  "med-peds": "internal-medicine-pediatrics",
  "neurology": "neurology",
  "neurological-surgery": "neurological-surgery",
  "obgyn": "obstetrics-gynecology",
  "orthopedic-surgery": "orthopaedic-surgery",
  "otolaryngology": "otolaryngology",
  "pathology": "pathology",
  "pediatrics": "pediatrics",
  "physical-medicine-rehab": "physical-medicine-rehabilitation",
  "plastic-surgery": "plastic-surgery",
  "psychiatry": "psychiatry",
  "radiation-oncology": "radiation-oncology",
  "radiology": "diagnostic-radiology",
  "vascular-surgery-integrated": "vascular-surgery",
};

const fellowshipCompareMap = {
  "interventional-radiology": "interventional-radiology",
  "vascular-surgery": "vascular-surgery",
};

const fellowshipCompareSelectionMap = {
  "interventional-radiology": "interventional-radiology-integrated",
  "thoracic-surgery": "thoracic-surgery-integrated",
  "vascular-surgery": "vascular-surgery-integrated",
};

const compareSliderDefinitions = [
  { key: "step2", label: "USMLE Step 2 CK score", min: 140, max: 280, step: 1, weight: 0.24 },
  { key: "contiguousRanks", label: "Contiguous ranked programs", min: 0, max: 30, step: 1, weight: 0.28 },
  { key: "research", label: "Research projects", min: 0, max: 20, step: 1, weight: 0.1 },
  { key: "publications", label: "Abstracts, presentations, publications", min: 0, max: 60, step: 1, weight: 0.12 },
  { key: "work", label: "Work experiences", min: 0, max: 10, step: 1, weight: 0.04 },
  { key: "volunteer", label: "Volunteer experiences", min: 0, max: 15, step: 1, weight: 0.04 },
];

const compareNeededFor90Keys = new Set(["step2", "contiguousRanks"]);

const compareCheckDefinitions = [
  { key: "aoa", label: "AOA" },
  { key: "nih", label: "Top 40 NIH-funded school" },
  { key: "phd", label: "PhD" },
  { key: "otherGrad", label: "Other graduate degree" },
];

const compareProfile = {
  step2: 250,
  contiguousRanks: 12,
  research: 3,
  publications: 8,
  work: 2,
  volunteer: 4,
  aoa: false,
  nih: false,
  phd: false,
  otherGrad: false,
};

const questions = [
  {
    id: "continuity",
    category: "Patient relationships",
    text: "Do you want long-term relationships with patients to be a major part of your work?",
    support: "Think about whether repeated follow-up over months to years feels energizing, not just acceptable.",
    yes: {
      "family-medicine": 4,
      "internal-medicine": 4,
      pediatrics: 4,
      psychiatry: 4,
      neurology: 4,
      obgyn: 3,
      dermatology: 2,
      "physical-medicine-rehab": 2,
      "med-peds": 4,
      "orthopedic-surgery": 2,
      ophthalmology: 2,
      otolaryngology: 3,
      urology: 3,
    },
    no: {
      "emergency-medicine": 4,
      anesthesiology: 4,
      radiology: 4,
      pathology: 5,
      "general-surgery": 3,
    },
  },
  {
    id: "procedures",
    category: "Procedural intensity",
    text: "Would you be disappointed if your future specialty involved very few procedures?",
    support: "This is about wanting hands-on interventions to be central to the job, not just available occasionally.",
    yes: {
      "general-surgery": 5,
      anesthesiology: 4,
      obgyn: 4,
      "emergency-medicine": 3,
      dermatology: 3,
      "orthopedic-surgery": 5,
      ophthalmology: 4,
      otolaryngology: 4,
      urology: 4,
      "physical-medicine-rehab": 2,
    },
    no: {
      psychiatry: 4,
      pathology: 3,
      radiology: 2,
      "internal-medicine": 2,
      pediatrics: 2,
      neurology: 2,
      "med-peds": 3,
      "physical-medicine-rehab": 1,
    },
  },
  {
    id: "acuity",
    category: "Pace and urgency",
    text: "Do you want frequent acute, time-pressured decision-making to be part of your normal week?",
    support: "Imagine whether being regularly pulled toward urgent action feels engaging or draining.",
    yes: {
      "emergency-medicine": 5,
      anesthesiology: 4,
      "general-surgery": 4,
      obgyn: 3,
      "orthopedic-surgery": 2,
      otolaryngology: 2,
      urology: 2,
      ophthalmology: 1,
    },
    no: {
      dermatology: 4,
      psychiatry: 3,
      pathology: 4,
      radiology: 2,
      "family-medicine": 2,
      "physical-medicine-rehab": 4,
      ophthalmology: 2,
      "med-peds": 2,
    },
  },
  {
    id: "breadth",
    category: "Scope",
    text: "Do you prefer being a broad generalist over spending most of your time in one tighter clinical domain?",
    support: "Choose yes if you like wide clinical variety more than a sharply bounded specialty identity.",
    yes: {
      "family-medicine": 5,
      "internal-medicine": 4,
      pediatrics: 4,
      "emergency-medicine": 4,
      "med-peds": 4,
      "physical-medicine-rehab": 2,
    },
    no: {
      dermatology: 3,
      radiology: 4,
      pathology: 4,
      psychiatry: 2,
      anesthesiology: 2,
      neurology: 2,
      "orthopedic-surgery": 4,
      ophthalmology: 5,
      otolaryngology: 4,
      urology: 4,
      "physical-medicine-rehab": 2,
    },
  },
  {
    id: "direct-patient-contact",
    category: "Daily work style",
    text: "Do you want most of your workday to involve direct face-to-face patient interaction?",
    support: "Think about where you want your energy to go on a typical day, not just during memorable moments.",
    yes: {
      psychiatry: 4,
      "family-medicine": 4,
      pediatrics: 4,
      "internal-medicine": 3,
      obgyn: 3,
      "physical-medicine-rehab": 3,
      "med-peds": 3,
      "orthopedic-surgery": 3,
      ophthalmology: 3,
      otolaryngology: 4,
      urology: 4,
    },
    no: {
      radiology: 5,
      pathology: 5,
      anesthesiology: 2,
      dermatology: 1,
    },
  },
  {
    id: "diagnostic-puzzle",
    category: "Thinking style",
    text: "Are you especially drawn to diagnostic puzzles even when the answer may take time to unfold?",
    support: "This favors specialties where pattern recognition, synthesis, and ambiguity tolerance matter a lot.",
    yes: {
      neurology: 6,
      "internal-medicine": 4,
      radiology: 4,
      pathology: 4,
      "emergency-medicine": 2,
      ophthalmology: 2,
      "med-peds": 2,
      otolaryngology: 2,
      "physical-medicine-rehab": 2,
      "orthopedic-surgery": 1,
      urology: 1,
    },
    no: {
      "family-medicine": 2,
      psychiatry: 2,
      dermatology: 2,
    },
  },
  {
    id: "operating-room",
    category: "Environment",
    text: "Does the operating room sound more energizing than the clinic?",
    support: "Answer yes if a tightly coordinated procedural environment feels like a draw rather than a tradeoff.",
    yes: {
      "general-surgery": 5,
      anesthesiology: 5,
      obgyn: 4,
      "orthopedic-surgery": 5,
      ophthalmology: 4,
      otolaryngology: 4,
      urology: 4,
    },
    no: {
      psychiatry: 4,
      "family-medicine": 4,
      dermatology: 3,
      pediatrics: 2,
      neurology: 2,
      "physical-medicine-rehab": 4,
      "med-peds": 3,
    },
  },
  {
    id: "shift-work",
    category: "Schedule shape",
    text: "Would you rather work defined shifts than carry a large outpatient panel over time?",
    support: "This asks about your preferred structure, not whether one model is easier.",
    yes: {
      "emergency-medicine": 5,
      anesthesiology: 3,
      radiology: 2,
      pathology: 1,
    },
    no: {
      "family-medicine": 4,
      "internal-medicine": 4,
      psychiatry: 3,
      dermatology: 4,
      pediatrics: 4,
      "physical-medicine-rehab": 3,
      "med-peds": 4,
      ophthalmology: 2,
      otolaryngology: 2,
      urology: 2,
      "orthopedic-surgery": 1,
    },
  },
  {
    id: "family-context",
    category: "Population fit",
    text: "Do you enjoy working closely with family dynamics and the broader context around a patient?",
    support: "Choose yes if caregiver relationships and family systems feel meaningful rather than peripheral.",
    yes: {
      pediatrics: 5,
      psychiatry: 3,
      "family-medicine": 3,
      obgyn: 2,
      "med-peds": 4,
      "physical-medicine-rehab": 2,
    },
    no: {
      pathology: 2,
      radiology: 2,
      anesthesiology: 1,
    },
  },
  {
    id: "women-health",
    category: "Clinical population",
    text: "Would longitudinal menstrual, contraceptive, sexual, or gynecologic care feel meaningful to you?",
    support: "This is about ongoing reproductive and gynecologic care, not just the acute pull of labor and delivery.",
    yes: {
      obgyn: 6,
      "family-medicine": 2,
    },
    no: {
      pathology: 1,
      radiology: 1,
    },
  },
  {
    id: "mental-health",
    category: "Clinical interests",
    text: "Would you be happy spending a large part of your career focused on mental health and behavior?",
    support: "Answer yes only if that focus feels genuinely central to your interest in medicine.",
    yes: {
      psychiatry: 7,
      pediatrics: 1,
      "family-medicine": 1,
    },
    no: {
      "general-surgery": 1,
      anesthesiology: 1,
      radiology: 1,
    },
  },
  {
    id: "visual-patterns",
    category: "Sensory fit",
    text: "Are you naturally drawn to image-based or visually pattern-driven diagnosis?",
    support: "Think about whether you like identifying what matters from imaging, skin findings, slides, or visual data.",
    yes: {
      radiology: 6,
      dermatology: 5,
      pathology: 4,
      neurology: 3,
      ophthalmology: 5,
      "orthopedic-surgery": 1,
      otolaryngology: 1,
    },
    no: {
      psychiatry: 2,
      "family-medicine": 1,
    },
  },
  {
    id: "behind-the-scenes",
    category: "Work environment",
    text: "Would you still feel fulfilled in a specialty where patients may rarely know you were central to their care?",
    support: "This can signal comfort with diagnostic or systems-facing impact rather than bedside visibility.",
    yes: {
      pathology: 6,
      radiology: 5,
      anesthesiology: 3,
    },
    no: {
      "family-medicine": 2,
      pediatrics: 2,
      psychiatry: 2,
      obgyn: 2,
      "physical-medicine-rehab": 2,
      "med-peds": 2,
      "orthopedic-surgery": 2,
      ophthalmology: 2,
      otolaryngology: 2,
      urology: 2,
    },
  },
  {
    id: "lifestyle-structure",
    category: "Workflow",
    text: "Does a relatively predictable outpatient rhythm matter a lot to you?",
    support: "Pick yes if controlled cadence and fewer abrupt schedule changes are especially important.",
    yes: {
      dermatology: 5,
      psychiatry: 2,
      radiology: 2,
      "family-medicine": 2,
      "physical-medicine-rehab": 4,
      ophthalmology: 3,
      "med-peds": 1,
      otolaryngology: 1,
      urology: 1,
    },
    no: {
      "general-surgery": 3,
      obgyn: 3,
      "emergency-medicine": 2,
      anesthesiology: 2,
      "orthopedic-surgery": 3,
      otolaryngology: 2,
      urology: 2,
    },
  },
  {
    id: "physiology",
    category: "Core interests",
    text: "Do moment-to-moment physiology and immediate clinical stabilization feel especially compelling?",
    support: "This favors specialties that spend a lot of time managing what is happening right now in the body.",
    yes: {
      anesthesiology: 6,
      "emergency-medicine": 3,
      "general-surgery": 2,
      "internal-medicine": 2,
      urology: 2,
      otolaryngology: 2,
      ophthalmology: 1,
      "orthopedic-surgery": 1,
      "physical-medicine-rehab": 1,
    },
    no: {
      psychiatry: 2,
      dermatology: 1,
      pathology: 1,
      "med-peds": 1,
    },
  },
  {
    id: "children",
    category: "Population fit",
    text: "Do you strongly prefer working with children over primarily working with adults?",
    support: "Say yes only if this is a real attraction, not just something you could tolerate.",
    yes: {
      pediatrics: 7,
      "family-medicine": 1,
      "med-peds": 4,
      ophthalmology: 1,
      otolaryngology: 1,
      "physical-medicine-rehab": 1,
    },
    no: {
      "internal-medicine": 2,
      neurology: 1,
      psychiatry: 1,
      "orthopedic-surgery": 1,
      urology: 1,
    },
  },
  {
    id: "manual-skill",
    category: "Procedural identity",
    text: "Would you like technical manual skill to be a core part of how you add value?",
    support: "This includes operating, airway work, procedures, and other hands-on technical performance.",
    yes: {
      "general-surgery": 5,
      anesthesiology: 4,
      obgyn: 4,
      dermatology: 2,
      "emergency-medicine": 2,
      "orthopedic-surgery": 5,
      ophthalmology: 4,
      otolaryngology: 4,
      urology: 4,
      "physical-medicine-rehab": 2,
    },
    no: {
      psychiatry: 4,
      pathology: 3,
      radiology: 2,
      neurology: 2,
      "med-peds": 2,
      "physical-medicine-rehab": 1,
    },
  },
  {
    id: "ambiguity",
    category: "Tolerance for uncertainty",
    text: "Are you comfortable living with substantial diagnostic uncertainty during the workup process?",
    support: "Some fields regularly start with incomplete information and move before the picture is clean.",
    yes: {
      "emergency-medicine": 4,
      "internal-medicine": 3,
      neurology: 4,
      psychiatry: 1,
      "med-peds": 2,
      "physical-medicine-rehab": 2,
      ophthalmology: 1,
      otolaryngology: 1,
      urology: 1,
    },
    no: {
      pathology: 3,
      radiology: 2,
      dermatology: 2,
      anesthesiology: 1,
      "orthopedic-surgery": 2,
      ophthalmology: 2,
      urology: 1,
    },
  },
  {
    id: "preventive-care",
    category: "Care philosophy",
    text: "Does preventive care and long-horizon health maintenance feel central to what you want to do?",
    support: "This catches interest in the slower work of keeping people well, not only treating acute illness.",
    yes: {
      "family-medicine": 5,
      pediatrics: 4,
      "internal-medicine": 3,
      obgyn: 2,
      "med-peds": 3,
      "physical-medicine-rehab": 2,
      ophthalmology: 1,
    },
    no: {
      anesthesiology: 1,
      radiology: 1,
      pathology: 1,
      "orthopedic-surgery": 1,
      otolaryngology: 1,
      urology: 1,
    },
  },
  {
    id: "function-rehab",
    category: "Clinical interests",
    text: "Are you especially drawn to helping patients regain function, mobility, or independence after illness or injury?",
    support: "This can point toward specialties centered on recovery, rehabilitation, and long-term function.",
    yes: {
      "physical-medicine-rehab": 7,
      "orthopedic-surgery": 3,
      neurology: 3,
      pediatrics: 1,
      "family-medicine": 1,
      "med-peds": 2,
    },
    no: {
      pathology: 1,
      radiology: 1,
    },
  },
  {
    id: "narrow-anatomy",
    category: "Scope",
    text: "Would you enjoy becoming an expert in one smaller part of the body rather than working across many organ systems?",
    support: "This can point toward specialties with a narrower anatomic focus and a more tightly defined scope.",
    yes: {
      ophthalmology: 4,
      otolaryngology: 4,
      urology: 4,
      dermatology: 3,
      "orthopedic-surgery": 3,
      obgyn: 2,
    },
    no: {
      "family-medicine": 3,
      "internal-medicine": 2,
      pediatrics: 2,
      "med-peds": 3,
      "emergency-medicine": 2,
      "physical-medicine-rehab": 1,
    },
  },
];

function mergeWeights(...maps) {
  return maps.reduce((combined, map) => {
    Object.entries(map).forEach(([specialtyId, value]) => {
      combined[specialtyId] = (combined[specialtyId] || 0) + value;
    });
    return combined;
  }, {});
}

function makeQuestion(id, category, text, support, yes, no) {
  return { id, category, text, support, yes, no };
}

const p = {
  contY: {
    "family-medicine": 4,
    "internal-medicine": 4,
    pediatrics: 4,
    psychiatry: 4,
    neurology: 4,
    obgyn: 3,
    dermatology: 2,
    "physical-medicine-rehab": 2,
    "med-peds": 4,
    "orthopedic-surgery": 2,
    ophthalmology: 2,
    otolaryngology: 3,
    urology: 3,
  },
  contN: {
    "emergency-medicine": 4,
    anesthesiology: 4,
    radiology: 4,
    pathology: 5,
    "general-surgery": 3,
  },
  procY: {
    "general-surgery": 5,
    anesthesiology: 4,
    obgyn: 4,
    "emergency-medicine": 3,
    dermatology: 3,
    "orthopedic-surgery": 5,
    ophthalmology: 4,
    otolaryngology: 4,
    urology: 4,
    "physical-medicine-rehab": 2,
  },
  procN: {
    psychiatry: 4,
    pathology: 3,
    radiology: 2,
    "internal-medicine": 2,
    pediatrics: 2,
    neurology: 2,
    "med-peds": 3,
  },
  acuteY: {
    "emergency-medicine": 5,
    anesthesiology: 4,
    "general-surgery": 4,
    obgyn: 3,
    "orthopedic-surgery": 2,
    otolaryngology: 2,
    urology: 2,
    ophthalmology: 1,
  },
  acuteN: {
    dermatology: 4,
    psychiatry: 3,
    pathology: 4,
    radiology: 2,
    "family-medicine": 2,
    "physical-medicine-rehab": 4,
    ophthalmology: 2,
    "med-peds": 2,
  },
  broadY: {
    "family-medicine": 5,
    "internal-medicine": 4,
    pediatrics: 4,
    "emergency-medicine": 4,
    "med-peds": 4,
    "physical-medicine-rehab": 2,
  },
  broadN: {
    dermatology: 3,
    radiology: 4,
    pathology: 4,
    psychiatry: 2,
    anesthesiology: 2,
    neurology: 2,
    "orthopedic-surgery": 4,
    ophthalmology: 5,
    otolaryngology: 4,
    urology: 4,
    "physical-medicine-rehab": 2,
  },
  directY: {
    psychiatry: 4,
    "family-medicine": 4,
    pediatrics: 4,
    "internal-medicine": 3,
    obgyn: 3,
    "physical-medicine-rehab": 3,
    "med-peds": 3,
    "orthopedic-surgery": 3,
    ophthalmology: 3,
    otolaryngology: 4,
    urology: 4,
  },
  directN: {
    radiology: 5,
    pathology: 5,
    anesthesiology: 2,
    dermatology: 1,
  },
  diagY: {
    neurology: 6,
    "internal-medicine": 4,
    radiology: 4,
    pathology: 4,
    "emergency-medicine": 2,
    ophthalmology: 2,
    "med-peds": 2,
    otolaryngology: 2,
    "physical-medicine-rehab": 2,
    "orthopedic-surgery": 1,
    urology: 1,
  },
  orY: {
    "general-surgery": 5,
    anesthesiology: 5,
    obgyn: 4,
    "orthopedic-surgery": 5,
    ophthalmology: 4,
    otolaryngology: 4,
    urology: 4,
  },
  orN: {
    psychiatry: 4,
    "family-medicine": 4,
    dermatology: 3,
    pediatrics: 2,
    neurology: 2,
    "physical-medicine-rehab": 4,
    "med-peds": 3,
  },
  shiftY: {
    "emergency-medicine": 5,
    anesthesiology: 3,
    radiology: 2,
    pathology: 1,
  },
  shiftN: {
    "family-medicine": 4,
    "internal-medicine": 4,
    psychiatry: 3,
    dermatology: 4,
    pediatrics: 4,
    "physical-medicine-rehab": 3,
    "med-peds": 4,
    ophthalmology: 2,
    otolaryngology: 2,
    urology: 2,
  },
  familyY: {
    pediatrics: 5,
    psychiatry: 3,
    "family-medicine": 3,
    obgyn: 2,
    "med-peds": 4,
    "physical-medicine-rehab": 2,
  },
  womenY: {
    obgyn: 6,
    "family-medicine": 1,
  },
  mentalY: {
    psychiatry: 7,
    pediatrics: 1,
    "family-medicine": 1,
  },
  visualY: {
    radiology: 6,
    dermatology: 5,
    pathology: 4,
    neurology: 3,
    ophthalmology: 5,
    "orthopedic-surgery": 1,
    otolaryngology: 1,
  },
  behindY: {
    pathology: 6,
    radiology: 5,
    anesthesiology: 3,
  },
  lifeY: {
    dermatology: 5,
    psychiatry: 2,
    radiology: 2,
    "family-medicine": 2,
    "physical-medicine-rehab": 4,
    ophthalmology: 3,
    "med-peds": 1,
    otolaryngology: 1,
    urology: 1,
  },
  physY: {
    anesthesiology: 6,
    "emergency-medicine": 3,
    "general-surgery": 2,
    "internal-medicine": 2,
    urology: 2,
    otolaryngology: 2,
    ophthalmology: 1,
    "orthopedic-surgery": 1,
    "physical-medicine-rehab": 1,
  },
  childY: {
    pediatrics: 7,
    "family-medicine": 1,
    "med-peds": 4,
    ophthalmology: 1,
    otolaryngology: 1,
    "physical-medicine-rehab": 1,
  },
  manualY: {
    "general-surgery": 5,
    anesthesiology: 4,
    obgyn: 4,
    dermatology: 2,
    "emergency-medicine": 2,
    "orthopedic-surgery": 5,
    ophthalmology: 4,
    otolaryngology: 4,
    urology: 4,
    "physical-medicine-rehab": 2,
  },
  ambigY: {
    "emergency-medicine": 4,
    "internal-medicine": 3,
    neurology: 4,
    psychiatry: 1,
    "med-peds": 2,
    "physical-medicine-rehab": 2,
    ophthalmology: 1,
    otolaryngology: 1,
    urology: 1,
  },
  ambigN: {
    pathology: 3,
    radiology: 2,
    dermatology: 2,
    anesthesiology: 1,
    "orthopedic-surgery": 2,
    ophthalmology: 2,
    urology: 1,
  },
  prevY: {
    "family-medicine": 5,
    pediatrics: 4,
    "internal-medicine": 3,
    obgyn: 2,
    "med-peds": 3,
    "physical-medicine-rehab": 2,
    ophthalmology: 1,
  },
  rehabY: {
    "physical-medicine-rehab": 7,
    "orthopedic-surgery": 3,
    neurology: 3,
    pediatrics: 1,
    "family-medicine": 1,
    "med-peds": 2,
  },
  narrowY: {
    ophthalmology: 4,
    otolaryngology: 4,
    urology: 4,
    dermatology: 3,
    "orthopedic-surgery": 3,
    obgyn: 2,
  },
  adultY: {
    "internal-medicine": 4,
    neurology: 3,
    psychiatry: 1,
    "orthopedic-surgery": 1,
    urology: 1,
  },
  medpedsY: {
    "med-peds": 6,
    "internal-medicine": 2,
    pediatrics: 2,
    "family-medicine": 1,
  },
  orthoY: {
    "orthopedic-surgery": 7,
    "physical-medicine-rehab": 3,
    "general-surgery": 1,
    "emergency-medicine": 1,
  },
  ophthoY: {
    ophthalmology: 5,
    radiology: 1,
    dermatology: 1,
  },
  entY: {
    otolaryngology: 7,
    ophthalmology: 1,
    urology: 1,
  },
  uroY: {
    urology: 7,
    obgyn: 1,
    "general-surgery": 1,
  },
  consultantY: {
    radiology: 4,
    pathology: 4,
    anesthesiology: 3,
    neurology: 3,
  },
  inpatientY: {
    "internal-medicine": 4,
    pediatrics: 3,
    "med-peds": 4,
    neurology: 2,
    "emergency-medicine": 2,
    "general-surgery": 1,
  },
  commY: {
    psychiatry: 4,
    "family-medicine": 3,
    pediatrics: 3,
    "physical-medicine-rehab": 2,
    "med-peds": 1,
    obgyn: 1,
  },
  outprocY: {
    dermatology: 4,
    ophthalmology: 3,
    otolaryngology: 3,
    urology: 3,
    "physical-medicine-rehab": 2,
  },
  chronicY: {
    "internal-medicine": 4,
    neurology: 4,
    psychiatry: 2,
    "physical-medicine-rehab": 2,
    "med-peds": 1,
    "family-medicine": 2,
    pediatrics: 2,
  },
};

questions.push(
  makeQuestion("continuity-brief-encounters", "Patient relationships", "Would a specialty built mostly around brief one-time encounters feel unsatisfying to you?", "Choose yes if you want follow-up and familiarity to be part of the work.", mergeWeights(p.contY, p.directY), mergeWeights(p.contN, p.shiftY)),
  makeQuestion("continuity-follow-up", "Patient relationships", "Do you want to know how patients are doing months after you first meet them?", "This asks whether longer follow-up feels meaningful, not just acceptable.", mergeWeights(p.contY, p.prevY), mergeWeights(p.contN, p.behindY)),
  makeQuestion("continuity-fresh-cases", "Patient relationships", "Would seeing a steady stream of new cases appeal more than building longer relationships?", "Say yes if novelty and turnover sound more energizing than follow-up.", mergeWeights(p.contN, p.shiftY), mergeWeights(p.contY)),
  makeQuestion("communication-over-procedures", "Daily work style", "Would you rather spend more time talking through decisions than doing procedures?", "This separates conversation-heavy work from hands-on technical work.", mergeWeights(p.commY, p.mentalY), mergeWeights(p.procY, p.manualY)),
  makeQuestion("caregiver-role", "Patient relationships", "Does working closely with caregivers sound like an important part of practice?", "Think about whether family and caregiver involvement feels central or secondary.", mergeWeights(p.familyY, p.childY), mergeWeights(p.behindY)),
  makeQuestion("longer-conversations", "Daily work style", "Do longer visits sound more appealing than rapid turnover?", "This is about pace and depth of interaction.", mergeWeights(p.commY, p.contY), mergeWeights(p.acuteY, p.shiftY)),
  makeQuestion("panel-management", "Workflow", "Would managing a panel of patients over time feel satisfying to you?", "Choose yes if continuity itself feels meaningful.", mergeWeights(p.contY, p.shiftN, p.prevY), mergeWeights(p.shiftY, p.behindY)),
  makeQuestion("adult-and-children", "Population fit", "Does switching between pediatric and adult medicine sound energizing rather than draining?", "This is about enjoying age-range variety itself, not just wanting to keep both doors open.", mergeWeights(p.medpedsY, p.broadY), mergeWeights(p.narrowY)),
  makeQuestion("routine-preventive-care", "Care philosophy", "Would you be comfortable if much of your work involved preventive care and chronic disease follow-up?", "Choose yes if that sounds meaningful, not just manageable.", mergeWeights(p.prevY, p.contY), mergeWeights(p.procY, p.acuteY)),
  makeQuestion("listening-as-tool", "Clinical interests", "Does careful listening feel like one of the most meaningful tools in medicine?", "This points toward specialties where conversation and interpretation matter a lot.", mergeWeights(p.commY, p.mentalY), mergeWeights(p.consultantY, p.manualY)),
  makeQuestion("broad-vs-narrow-alt", "Scope", "Would you rather stay broad than narrow quickly into one body system?", "This asks about the kind of scope you want over time.", mergeWeights(p.broadY), mergeWeights(p.narrowY)),
  makeQuestion("context-outside-clinic", "Patient relationships", "Does understanding a patient's life outside the clinic sound important to you?", "Think about family, school, work, and daily function.", mergeWeights(p.familyY, p.commY), mergeWeights(p.behindY)),
  makeQuestion("long-term-trust", "Patient relationships", "Would it matter to you if a specialty offered very little chance to build long-term trust with patients?", "Say yes if that would feel like a real loss.", mergeWeights(p.contY), mergeWeights(p.contN)),
  makeQuestion("chronic-vs-episodic", "Workflow", "Are you comfortable following the same chronic problem over years rather than solving a short episode and moving on?", "This separates longitudinal management from episodic care.", mergeWeights(p.chronicY, p.contY), mergeWeights(p.acuteY, p.shiftY)),
  makeQuestion("community-generalist", "Scope", "Does community-based general medical practice appeal to you more than highly specialized referral work?", "Choose yes if broad day-to-day variety sounds better than a tightly bounded niche.", mergeWeights(p.broadY, p.prevY), mergeWeights(p.narrowY, p.consultantY)),
  makeQuestion("miss-operating-room", "Environment", "Would you miss the operating room if it were not part of your future work?", "This catches whether surgery feels like an important part of your identity.", mergeWeights(p.orY, p.procY), mergeWeights(p.orN, p.commY)),
  makeQuestion("hands-doing-the-work", "Procedural identity", "Do you picture yourself feeling most engaged when your hands are doing the work?", "Think about manual and technical work, not just occasional procedures.", mergeWeights(p.manualY, p.procY), mergeWeights(p.procN, p.commY)),
  makeQuestion("procedural-vs-medical", "Procedural identity", "Does fixing a problem procedurally sound more appealing than managing it medically over time?", "This helps separate procedural fields from longitudinal medical management.", mergeWeights(p.procY, p.manualY), mergeWeights(p.chronicY, p.contY)),
  makeQuestion("regular-urgency", "Pace and urgency", "Do you want regular exposure to urgent or high-pressure situations?", "Choose yes if time-sensitive decision-making feels energizing.", mergeWeights(p.acuteY), mergeWeights(p.acuteN)),
  makeQuestion("nights-weekends", "Schedule shape", "Would frequent nights, weekends, or unpredictable call feel acceptable if the work fit?", "This asks about tolerance for irregular schedules.", mergeWeights(p.acuteY, p.shiftY), mergeWeights(p.lifeY, p.shiftN)),
  makeQuestion("acute-teamwork", "Environment", "Do you like the idea of working in tightly coordinated teams around acute procedures or operations?", "This points toward team-based acute or operative settings.", mergeWeights(p.orY, p.physY), mergeWeights(p.contY, p.commY)),
  makeQuestion("perioperative-vs-clinic", "Environment", "Would perioperative care feel more interesting than clinic follow-up?", "This distinguishes OR-adjacent work from office-based continuity.", mergeWeights(p.orY, p.physY), mergeWeights(p.contY, p.lifeY)),
  makeQuestion("quick-decisions", "Tolerance for uncertainty", "Are you comfortable making decisions quickly when information is incomplete?", "Choose yes if acting before the full picture is available feels acceptable.", mergeWeights(p.acuteY, p.ambigY), mergeWeights(p.diagY, p.lifeY)),
  makeQuestion("hospital-vs-office", "Work environment", "Do hospital-based days sound more appealing than office-based days?", "This looks at the setting you can see yourself in most often.", mergeWeights(p.inpatientY, p.acuteY), mergeWeights(p.lifeY, p.outprocY)),
  makeQuestion("clinic-vs-hospital", "Work environment", "Would mostly clinic-based days suit you better than time in the hospital or OR?", "Choose yes if a steadier outpatient rhythm sounds better.", mergeWeights(p.lifeY, p.outprocY), mergeWeights(p.inpatientY, p.orY)),
  makeQuestion("clinic-with-procedures", "Workflow", "Would you like clinic days that still include procedures?", "This helps separate outpatient procedural fields from purely medical or purely operative ones.", mergeWeights(p.outprocY, p.procY), mergeWeights(p.commY, p.consultantY)),
  makeQuestion("call-worth-it", "Schedule shape", "Would a call-heavy specialty still feel worth it if the content matched your interests?", "Say yes if schedule demands would not be a major deterrent.", mergeWeights(p.orY, p.acuteY), mergeWeights(p.lifeY, p.shiftN))
);

questions.push(
  makeQuestion("immediate-physical-result", "Procedural identity", "Do you like the idea of seeing an immediate physical result from what you do?", "This points toward specialties where the effect of treatment is often visible right away.", mergeWeights(p.manualY, p.procY), mergeWeights(p.chronicY, p.commY)),
  makeQuestion("consultant-expertise", "Work role", "Would you be comfortable being asked for expertise rather than being the main ongoing doctor?", "Choose yes if a consultant role sounds meaningful, not distant.", mergeWeights(p.consultantY, p.diagY), mergeWeights(p.contY, p.prevY)),
  makeQuestion("consultant-handoffs", "Work role", "Does a specialty built around consultants, procedures, and handoffs sound appealing?", "This can separate continuity-heavy work from consultative or procedural roles.", mergeWeights(p.consultantY, p.orY, p.shiftY), mergeWeights(p.contY, p.familyY)),
  makeQuestion("diagnostic-workup", "Thinking style", "Would you enjoy specialties where a large part of the work is figuring out what is going on?", "Choose yes if diagnostic reasoning is a major draw.", mergeWeights(p.diagY), mergeWeights(p.commY)),
  makeQuestion("subtle-patterns", "Thinking style", "Do subtle patterns and fine distinctions catch your attention quickly?", "This often aligns with visually precise and diagnostic fields.", mergeWeights(p.visualY, p.diagY), mergeWeights(p.commY)),
  makeQuestion("images-and-data", "Thinking style", "Would you enjoy spending a lot of time interpreting images or other structured data?", "This looks at comfort with image- and data-heavy work.", mergeWeights(p.visualY, p.consultantY), mergeWeights(p.directY)),
  makeQuestion("microscope-over-bedside", "Work environment", "Would tissue, slides, or microscopic detail interest you more than bedside interaction?", "This helps separate pathology-style work from bedside-heavy fields.", mergeWeights(p.behindY, p.visualY), mergeWeights(p.directY, p.contY)),
  makeQuestion("uncertainty-tolerance", "Tolerance for uncertainty", "Can you tolerate not knowing the answer right away while you keep gathering information?", "Choose yes if uncertainty itself does not feel draining.", mergeWeights(p.ambigY, p.diagY), mergeWeights(p.ambigN)),
  makeQuestion("anatomic-localization", "Thinking style", "Does careful anatomic localization sound interesting to you?", "This can fit fields that rely on precise structural reasoning.", mergeWeights(p.diagY, p.narrowY, p.ophthoY, p.entY), mergeWeights(p.broadY)),
  makeQuestion("multimorbidity", "Clinical interests", "Do medically complex patients with several problems at once seem more interesting than a narrow, well-defined issue?", "Choose yes if complexity across systems feels engaging.", mergeWeights(p.chronicY, p.broadY), mergeWeights(p.narrowY)),
  makeQuestion("pathophysiology-draw", "Core interests", "Would thinking through pathophysiology be a major draw in your daily work?", "This points toward fields centered on mechanism, physiology, and reasoning.", mergeWeights(p.physY, p.diagY), mergeWeights(p.commY)),
  makeQuestion("focused-expertise", "Scope", "Would you prefer to be the person others call for focused expertise?", "This separates consultant and narrower roles from broad panel-based work.", mergeWeights(p.consultantY, p.narrowY), mergeWeights(p.broadY, p.contY)),
  makeQuestion("away-from-bedside", "Work environment", "Would you be comfortable doing valuable work that happens mostly away from the bedside?", "Choose yes if indirect but important work sounds satisfying.", mergeWeights(p.behindY, p.consultantY), mergeWeights(p.directY, p.contY)),
  makeQuestion("close-visual-detail", "Sensory fit", "Does close attention to small visual or anatomic detail sound satisfying?", "This often points toward visually precise specialties.", mergeWeights(p.visualY, p.narrowY), mergeWeights(p.broadY)),
  makeQuestion("certainty-over-ambiguity", "Tolerance for uncertainty", "Would you rather work in fields that often move toward diagnostic certainty than fields that live with ambiguity?", "This helps separate lower-ambiguity diagnostic work from uncertainty-heavy environments.", mergeWeights(p.ambigN, p.visualY), mergeWeights(p.ambigY, p.acuteY)),
  makeQuestion("long-workups", "Thinking style", "Do longer diagnostic workups sound more interesting than quick decisions under pressure?", "Choose yes if slower, deeper reasoning sounds more appealing.", mergeWeights(p.diagY, p.chronicY), mergeWeights(p.acuteY)),
  makeQuestion("interpretation-over-procedures", "Thinking style", "Would careful interpretation appeal to you more than hands-on procedures?", "This asks where you want most of your effort to go.", mergeWeights(p.visualY, p.consultantY), mergeWeights(p.manualY)),
  makeQuestion("interpretation-for-others", "Work role", "Does interpreting information for other clinicians sound as meaningful as direct bedside care?", "This points toward consultant and diagnostic fields.", mergeWeights(p.consultantY), mergeWeights(p.directY, p.contY)),
  makeQuestion("children-large-share", "Population fit", "Would you be happy if a large share of your practice involved children and adolescents?", "Choose yes only if that sounds like a real draw.", mergeWeights(p.childY, p.familyY), mergeWeights(p.adultY)),
  makeQuestion("mostly-adults", "Population fit", "Do you picture yourself caring mostly for adults rather than children?", "This helps separate adult-focused from child-focused practice.", mergeWeights(p.adultY, p.chronicY), mergeWeights(p.childY, p.medpedsY)),
  makeQuestion("pregnancy-and-repro", "Clinical interests", "Does the mix of clinic, procedures, and emergencies in OB/GYN sound appealing?", "Choose yes if that combination sounds more attractive than any single part of it on its own.", mergeWeights(p.womenY, p.outprocY, p.acuteY, p.orY), mergeWeights(p.broadY)),
  makeQuestion("conversation-based-care", "Clinical interests", "Would you be content spending a large part of the day in conversation-based care?", "This helps identify fields where communication is the main tool.", mergeWeights(p.mentalY, p.commY), mergeWeights(p.procY)),
  makeQuestion("recovery-over-stabilization", "Clinical interests", "Does recovery after injury or illness interest you more than acute stabilization?", "This distinguishes rehabilitation-oriented work from acute care.", mergeWeights(p.rehabY, p.lifeY), mergeWeights(p.acuteY)),
  makeQuestion("function-over-diagnosis", "Clinical interests", "Would helping patients improve function matter more to you than chasing a single diagnosis?", "Choose yes if day-to-day function feels especially meaningful.", mergeWeights(p.rehabY, p.contY), mergeWeights(p.diagY)),
  makeQuestion("musculoskeletal-interest", "Clinical interests", "Are bones, joints, muscles, and movement especially interesting to you?", "This can point toward musculoskeletal and rehab-oriented fields.", mergeWeights(p.orthoY, p.rehabY), mergeWeights(p.behindY)),
  makeQuestion("sensory-systems", "Clinical interests", "Do vision, hearing, voice, or other sensory systems especially interest you?", "Choose yes if these systems stand out to you more than others.", mergeWeights(p.ophthoY, p.entY), mergeWeights(p.broadY)),
  makeQuestion("head-and-neck-interest", "Clinical interests", "Does highly detailed head and neck anatomy feel especially intuitive or satisfying to you?", "This is about anatomic comfort and precision, not just tolerating ENT clinic topics.", mergeWeights(p.entY, p.narrowY), mergeWeights(p.broadY))
);

questions.push(
  makeQuestion("genitourinary-interest", "Clinical interests", "Does genitourinary anatomy feel more intuitive or compelling to you than most other systems?", "This asks about a true organ-system pull, not just being okay with those complaints.", mergeWeights(p.uroY, p.narrowY), mergeWeights(p.broadY)),
  makeQuestion("complex-hospitalized-adults", "Population fit", "Would you enjoy caring for medically complex hospitalized adults?", "This points toward adult inpatient medicine and consultant-heavy roles.", mergeWeights(p.inpatientY, p.chronicY, p.adultY), mergeWeights(p.lifeY)),
  makeQuestion("disability-and-qol", "Clinical interests", "Are disability, adaptation, and quality of life central issues you would want to work with?", "This helps identify rehabilitation-oriented interests.", mergeWeights(p.rehabY, p.commY), mergeWeights(p.acuteY)),
  makeQuestion("sports-and-return", "Clinical interests", "Does helping people return to sport, work, or daily function after injury sound especially meaningful?", "Choose yes if recovery goals and rehab timelines matter as much as the injury itself.", mergeWeights(p.orthoY, p.rehabY, p.lifeY), mergeWeights(p.behindY)),
  makeQuestion("labor-delivery-draw", "Clinical interests", "Does labor and delivery sound more appealing than most other acute care settings?", "This helps detect a stronger draw toward obstetric work.", mergeWeights(p.womenY, p.acuteY, p.orY), mergeWeights(p.acuteN)),
  makeQuestion("keep-adult-peds-open", "Population fit", "Would it be important to you to keep both adult and pediatric medicine open?", "Choose yes if a split age range sounds like a real advantage.", mergeWeights(p.medpedsY, p.childY, p.adultY), mergeWeights(p.narrowY)),
  makeQuestion("predictability-priority", "Workflow", "Does schedule predictability matter more to you than occasional high-adrenaline work?", "This separates steadier outpatient fields from acute or call-heavy ones.", mergeWeights(p.lifeY), mergeWeights(p.acuteY, p.shiftY)),
  makeQuestion("outpatient-most-days", "Work environment", "Would you rather spend most days in outpatient practice than in the hospital?", "Choose yes if clinic rhythm fits you better than inpatient flow.", mergeWeights(p.lifeY, p.contY), mergeWeights(p.inpatientY, p.acuteY)),
  makeQuestion("wards-vs-clinic", "Work environment", "Do wards, consult services, or hospital call sound more appealing than clinic flow?", "This helps separate inpatient from outpatient preferences.", mergeWeights(p.inpatientY, p.acuteY), mergeWeights(p.lifeY)),
  makeQuestion("treatment-over-time", "Patient relationships", "Do you want to see how treatment decisions play out over time?", "Choose yes if follow-up itself feels meaningful.", mergeWeights(p.contY, p.chronicY), mergeWeights(p.shiftY, p.behindY)),
  makeQuestion("office-procedures-balance", "Workflow", "Would a specialty with office procedures feel like a good balance for you?", "This often points toward outpatient procedural fields.", mergeWeights(p.outprocY, p.lifeY), mergeWeights(p.inpatientY)),
  makeQuestion("consults-over-panel", "Work role", "Would you enjoy consult work more than managing a full outpatient panel?", "Choose yes if focused expertise sounds better than being the main continuity doctor.", mergeWeights(p.consultantY, p.inpatientY), mergeWeights(p.contY, p.prevY)),
  makeQuestion("clear-shifts", "Schedule shape", "Would clear start-and-stop work shifts be a real advantage for you?", "This helps separate shift-based work from continuity-heavy roles.", mergeWeights(p.shiftY), mergeWeights(p.shiftN, p.contY)),
  makeQuestion("low-emergencies", "Pace and urgency", "Would you prefer a field where true emergencies are relatively uncommon?", "Choose yes if a lower-acuity environment sounds better.", mergeWeights(p.acuteN, p.lifeY), mergeWeights(p.acuteY)),
  makeQuestion("rehab-team-draw", "Environment", "Does working with PT, OT, speech therapy, or rehab teams sound appealing?", "This can point toward rehabilitation-focused practice.", mergeWeights(p.rehabY, p.commY), mergeWeights(p.consultantY)),
  makeQuestion("mixed-clinic-procedures", "Workflow", "Would you like a specialty that mixes clinic with procedures or surgery rather than only one setting?", "This often fits surgical subspecialties and outpatient procedural fields.", mergeWeights(p.outprocY, p.orY, p.contY), mergeWeights(p.shiftY)),
  makeQuestion("avoiding-large-panel", "Workflow", "Would avoiding a large continuity panel be a meaningful advantage for you?", "Choose yes if you do not want most of your work tied to ongoing panel management.", mergeWeights(p.shiftY, p.consultantY, p.behindY), mergeWeights(p.contY)),
  makeQuestion("panel-over-cases", "Workflow", "Would you rather manage a panel over time than move from case to case?", "This separates continuity-heavy work from episodic work.", mergeWeights(p.contY, p.prevY), mergeWeights(p.shiftY, p.acuteY)),
  makeQuestion("fine-motor-precision", "Procedural identity", "Does very fine, precise technical work sound appealing?", "This points toward fields that rely on small-scale technical precision.", mergeWeights(p.ophthoY, p.manualY, p.entY), mergeWeights(p.procN)),
  makeQuestion("fracture-biomechanics", "Clinical interests", "Do fractures, joints, and biomechanics sound more compelling than most other surgical problems?", "Choose yes if this content feels particularly interesting.", mergeWeights(p.orthoY), mergeWeights(p.broadY)),
  makeQuestion("preserve-vision", "Clinical interests", "Does helping preserve or restore vision sound especially meaningful?", "This helps identify a stronger pull toward ophthalmology.", mergeWeights(p.ophthoY, p.visualY), mergeWeights(p.broadY)),
  makeQuestion("ent-content", "Clinical interests", "Would you enjoy a practice centered on ear, sinus, airway, and voice complaints?", "Choose yes if that cluster of problems feels consistently interesting, not just tolerable.", mergeWeights(p.entY), mergeWeights(p.broadY)),
  makeQuestion("urologic-problems", "Clinical interests", "Do kidney stones, obstruction, hematuria, and related urologic issues stand out to you?", "This asks whether those complaints feel genuinely interesting, not just manageable.", mergeWeights(p.uroY), mergeWeights(p.broadY)),
  makeQuestion("large-operations", "Procedural identity", "Would large operations appeal to you more than smaller procedures?", "Choose yes if bigger operative work sounds more appealing than fine or office-based procedures.", mergeWeights(p.orY, p.orthoY), mergeWeights(p.outprocY, p.ophthoY)),
  makeQuestion("focused-outpatient-procedures", "Workflow", "Would a mostly outpatient specialty with focused procedures suit you well?", "This points toward specialties with a tighter scope and more clinic-based procedures.", mergeWeights(p.outprocY, p.lifeY, p.narrowY), mergeWeights(p.inpatientY, p.shiftY)),
  makeQuestion("body-region-expert", "Scope", "Would you enjoy refining the same focused set of problems and technical skills over time?", "Choose yes if depth-through-repetition sounds energizing rather than limiting.", mergeWeights(p.outprocY, p.ophthoY, p.entY, p.uroY, p.orthoY), mergeWeights(p.broadY)),
  makeQuestion("function-over-operation", "Clinical interests", "Does restoring movement or independence appeal more than removing disease or operating?", "This helps separate rehabilitation-oriented interests from operative ones.", mergeWeights(p.rehabY, p.contY), mergeWeights(p.orY, p.procY))
);

const nrmpMainMatchSpecialtySignals = {
  "child-neurology": [
    ["continuity", "yes", 4],
    ["diagnostic-puzzle", "yes", 5],
    ["family-context", "yes", 4],
    ["children", "yes", 6],
    ["ambiguity", "yes", 3],
    ["function-rehab", "yes", 2],
    ["caregiver-role", "yes", 4],
    ["continuity-follow-up", "yes", 4],
    ["panel-management", "yes", 3],
    ["chronic-vs-episodic", "yes", 4],
    ["diagnostic-workup", "yes", 4],
    ["anatomic-localization", "yes", 5],
    ["pathophysiology-draw", "yes", 4],
    ["long-workups", "yes", 4],
    ["children-large-share", "yes", 6],
    ["mostly-adults", "no", 4],
    ["treatment-over-time", "yes", 3],
    ["disability-and-qol", "yes", 3],
    ["rehab-team-draw", "yes", 2],
    ["focused-expertise", "yes", 3],
    ["visual-patterns", "yes", 2],
    ["operating-room", "no", 3],
    ["manual-skill", "no", 2],
    ["procedures", "no", 2],
  ],
  "interventional-radiology-integrated": [
    ["procedures", "yes", 5],
    ["visual-patterns", "yes", 5],
    ["behind-the-scenes", "yes", 3],
    ["diagnostic-puzzle", "yes", 4],
    ["physiology", "yes", 3],
    ["narrow-anatomy", "yes", 3],
    ["direct-patient-contact", "no", 2],
    ["continuity", "no", 3],
    ["shift-work", "yes", 2],
    ["hands-doing-the-work", "yes", 5],
    ["procedural-vs-medical", "yes", 5],
    ["consultant-expertise", "yes", 5],
    ["consultant-handoffs", "yes", 4],
    ["subtle-patterns", "yes", 4],
    ["images-and-data", "yes", 6],
    ["away-from-bedside", "yes", 4],
    ["close-visual-detail", "yes", 4],
    ["interpretation-over-procedures", "no", 3],
    ["interpretation-for-others", "yes", 4],
    ["focused-expertise", "yes", 4],
    ["immediate-physical-result", "yes", 4],
    ["clinic-with-procedures", "yes", 4],
    ["consults-over-panel", "yes", 4],
    ["avoiding-large-panel", "yes", 4],
    ["regular-urgency", "yes", 2],
    ["hospital-vs-office", "yes", 3],
  ],
  "neurological-surgery": [
    ["procedures", "yes", 6],
    ["acuity", "yes", 5],
    ["operating-room", "yes", 6],
    ["manual-skill", "yes", 6],
    ["physiology", "yes", 3],
    ["narrow-anatomy", "yes", 4],
    ["lifestyle-structure", "no", 4],
    ["preventive-care", "no", 3],
    ["miss-operating-room", "yes", 6],
    ["hands-doing-the-work", "yes", 6],
    ["procedural-vs-medical", "yes", 6],
    ["regular-urgency", "yes", 5],
    ["nights-weekends", "yes", 4],
    ["acute-teamwork", "yes", 5],
    ["perioperative-vs-clinic", "yes", 5],
    ["quick-decisions", "yes", 4],
    ["hospital-vs-office", "yes", 4],
    ["call-worth-it", "yes", 5],
    ["immediate-physical-result", "yes", 5],
    ["anatomic-localization", "yes", 6],
    ["pathophysiology-draw", "yes", 3],
    ["focused-expertise", "yes", 4],
    ["close-visual-detail", "yes", 3],
    ["large-operations", "yes", 6],
    ["low-emergencies", "no", 5],
    ["function-over-operation", "no", 4],
  ],
  "plastic-surgery": [
    ["continuity", "yes", 3],
    ["direct-patient-contact", "yes", 3],
    ["procedures", "yes", 5],
    ["operating-room", "yes", 5],
    ["manual-skill", "yes", 5],
    ["visual-patterns", "yes", 3],
    ["narrow-anatomy", "yes", 3],
    ["miss-operating-room", "yes", 5],
    ["hands-doing-the-work", "yes", 5],
    ["procedural-vs-medical", "yes", 5],
    ["clinic-with-procedures", "yes", 4],
    ["immediate-physical-result", "yes", 5],
    ["close-visual-detail", "yes", 4],
    ["focused-expertise", "yes", 4],
    ["fine-motor-precision", "yes", 5],
    ["mixed-clinic-procedures", "yes", 4],
    ["large-operations", "yes", 3],
    ["body-region-expert", "yes", 3],
    ["function-rehab", "yes", 2],
    ["disability-and-qol", "yes", 2],
    ["low-emergencies", "yes", 1],
  ],
  "preventive-medicine": [
    ["continuity", "yes", 3],
    ["breadth", "yes", 5],
    ["direct-patient-contact", "yes", 2],
    ["procedures", "no", 5],
    ["acuity", "no", 6],
    ["operating-room", "no", 6],
    ["manual-skill", "no", 3],
    ["preventive-care", "yes", 8],
    ["routine-preventive-care", "yes", 8],
    ["community-generalist", "yes", 7],
    ["context-outside-clinic", "yes", 5],
    ["broad-vs-narrow-alt", "yes", 4],
    ["communication-over-procedures", "yes", 3],
    ["panel-management", "yes", 3],
    ["chronic-vs-episodic", "yes", 4],
    ["clinic-vs-hospital", "yes", 4],
    ["outpatient-most-days", "yes", 4],
    ["low-emergencies", "yes", 6],
    ["predictability-priority", "yes", 5],
    ["hospital-vs-office", "no", 3],
  ],
  "radiation-oncology": [
    ["continuity", "yes", 4],
    ["direct-patient-contact", "yes", 3],
    ["diagnostic-puzzle", "yes", 3],
    ["visual-patterns", "yes", 4],
    ["procedures", "no", 2],
    ["acuity", "no", 3],
    ["lifestyle-structure", "yes", 3],
    ["long-term-trust", "yes", 5],
    ["chronic-vs-episodic", "yes", 4],
    ["communication-over-procedures", "yes", 3],
    ["consultant-expertise", "yes", 4],
    ["subtle-patterns", "yes", 4],
    ["images-and-data", "yes", 5],
    ["interpretation-over-procedures", "yes", 3],
    ["pathophysiology-draw", "yes", 4],
    ["focused-expertise", "yes", 4],
    ["treatment-over-time", "yes", 5],
    ["outpatient-most-days", "yes", 4],
    ["low-emergencies", "yes", 4],
    ["predictability-priority", "yes", 3],
    ["conversation-based-care", "yes", 2],
  ],
  "thoracic-surgery-integrated": [
    ["direct-patient-contact", "yes", 2],
    ["procedures", "yes", 5],
    ["acuity", "yes", 3],
    ["operating-room", "yes", 6],
    ["manual-skill", "yes", 5],
    ["physiology", "yes", 3],
    ["narrow-anatomy", "yes", 4],
    ["miss-operating-room", "yes", 6],
    ["hands-doing-the-work", "yes", 5],
    ["procedural-vs-medical", "yes", 5],
    ["regular-urgency", "yes", 3],
    ["acute-teamwork", "yes", 4],
    ["perioperative-vs-clinic", "yes", 5],
    ["hospital-vs-office", "yes", 4],
    ["call-worth-it", "yes", 4],
    ["immediate-physical-result", "yes", 4],
    ["pathophysiology-draw", "yes", 3],
    ["focused-expertise", "yes", 4],
    ["large-operations", "yes", 6],
    ["low-emergencies", "no", 3],
    ["function-over-operation", "no", 4],
  ],
  "vascular-surgery-integrated": [
    ["continuity", "yes", 3],
    ["direct-patient-contact", "yes", 3],
    ["procedures", "yes", 5],
    ["acuity", "yes", 4],
    ["operating-room", "yes", 5],
    ["manual-skill", "yes", 5],
    ["physiology", "yes", 5],
    ["narrow-anatomy", "yes", 3],
    ["miss-operating-room", "yes", 5],
    ["hands-doing-the-work", "yes", 5],
    ["procedural-vs-medical", "yes", 5],
    ["regular-urgency", "yes", 4],
    ["acute-teamwork", "yes", 4],
    ["perioperative-vs-clinic", "yes", 4],
    ["hospital-vs-office", "yes", 4],
    ["clinic-with-procedures", "yes", 3],
    ["immediate-physical-result", "yes", 4],
    ["pathophysiology-draw", "yes", 4],
    ["focused-expertise", "yes", 3],
    ["mostly-adults", "yes", 4],
    ["complex-hospitalized-adults", "yes", 4],
    ["wards-vs-clinic", "yes", 3],
    ["large-operations", "yes", 4],
    ["low-emergencies", "no", 3],
  ],
};

const questionByIdForSpecialtySignals = Object.fromEntries(questions.map((question) => [question.id, question]));
Object.entries(nrmpMainMatchSpecialtySignals).forEach(([specialtyId, signals]) => {
  signals.forEach(([questionId, response, weight]) => {
    const question = questionByIdForSpecialtySignals[questionId];
    if (!question || (response !== "yes" && response !== "no")) {
      return;
    }

    question[response][specialtyId] = (question[response][specialtyId] || 0) + weight;
  });
});

const questionIndexById = Object.fromEntries(questions.map((question, index) => [question.id, index]));
const QUESTION_ORDER_STORAGE_KEY = "1or2-question-order-mode";
const FELLOWSHIP_DISPLAY_STORAGE_KEY = "1or2-fellowship-display-mode";
const SHARE_SEED_VERSION = "v1";
const RESPONSE_TO_CODE = {
  yes: "y",
  no: "n",
  skip: "s",
  null: "u",
};
const CODE_TO_RESPONSE = {
  y: "yes",
  n: "no",
  s: "skip",
  u: null,
};

function loadOrderMode() {
  try {
    const storedMode = localStorage.getItem(QUESTION_ORDER_STORAGE_KEY);

    if (storedMode === "random" || storedMode === "sequential") {
      return storedMode;
    }

    localStorage.setItem(QUESTION_ORDER_STORAGE_KEY, "random");
    return "random";
  } catch {
    return "random";
  }
}

function saveOrderMode(mode) {
  try {
    localStorage.setItem(QUESTION_ORDER_STORAGE_KEY, mode);
  } catch {
    // Ignore storage failures in local file contexts.
  }
}

function shuffleIndices(indices) {
  const shuffled = [...indices];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

function buildQuestionOrder(mode) {
  const indices = questions.map((_, index) => index);
  return mode === "random" ? shuffleIndices(indices) : indices;
}

function loadFellowshipDisplayMode() {
  try {
    const storedMode = localStorage.getItem(FELLOWSHIP_DISPLAY_STORAGE_KEY);
    return storedMode === "separate" ? "separate" : "integrated";
  } catch {
    return "integrated";
  }
}

function saveFellowshipDisplayMode(mode) {
  try {
    localStorage.setItem(FELLOWSHIP_DISPLAY_STORAGE_KEY, mode);
  } catch {
    // Ignore storage failures in local file contexts.
  }
}

function encodeResponseSequence(responses) {
  return responses.map((response) => RESPONSE_TO_CODE[String(response)] ?? RESPONSE_TO_CODE.null).join("");
}

function decodeResponseSequence(encodedResponses) {
  if (encodedResponses.length !== questions.length) {
    throw new Error("The seed response list does not match this prompt set.");
  }

  return encodedResponses.split("").map((code) => {
    if (!(code in CODE_TO_RESPONSE)) {
      throw new Error("The seed contains an unknown response code.");
    }

    return CODE_TO_RESPONSE[code];
  });
}

function encodeQuestionOrder(questionOrder) {
  return questionOrder.map((index) => index.toString(36).padStart(2, "0")).join("");
}

function decodeQuestionOrder(encodedOrder) {
  if (encodedOrder.length !== questions.length * 2) {
    throw new Error("The seed prompt order does not match this prompt set.");
  }

  const decoded = [];

  for (let index = 0; index < encodedOrder.length; index += 2) {
    const value = Number.parseInt(encodedOrder.slice(index, index + 2), 36);

    if (!Number.isInteger(value) || value < 0 || value >= questions.length) {
      throw new Error("The seed contains an invalid prompt order.");
    }

    decoded.push(value);
  }

  if (new Set(decoded).size !== questions.length) {
    throw new Error("The seed prompt order is incomplete or duplicated.");
  }

  return decoded;
}

function buildShareSeed() {
  return [
    SHARE_SEED_VERSION,
    state.orderMode === "random" ? "r" : "s",
    state.currentIndex.toString(36),
    encodeResponseSequence(state.responses),
    encodeQuestionOrder(state.questionOrder),
  ].join(".");
}

function parseShareSeed(seedText) {
  const normalized = seedText.trim().replace(/\s+/g, "").toLowerCase();
  const [version, modeCode, currentIndexCode, responseSequence, questionOrderSequence] = normalized.split(".");

  if (!version || !modeCode || !currentIndexCode || !responseSequence || !questionOrderSequence) {
    throw new Error("This seed looks incomplete.");
  }

  if (version !== SHARE_SEED_VERSION) {
    throw new Error("This seed version is not supported here.");
  }

  if (modeCode !== "r" && modeCode !== "s") {
    throw new Error("This seed contains an invalid order mode.");
  }

  const currentIndex = Number.parseInt(currentIndexCode, 36);

  if (!Number.isInteger(currentIndex) || currentIndex < 0 || currentIndex > questions.length) {
    throw new Error("This seed contains an invalid place marker.");
  }

  return {
    orderMode: modeCode === "r" ? "random" : "sequential",
    currentIndex,
    responses: decodeResponseSequence(responseSequence),
    questionOrder: decodeQuestionOrder(questionOrderSequence),
  };
}

const initialOrderMode = loadOrderMode();
const initialFellowshipDisplayMode = loadFellowshipDisplayMode();

const state = {
  started: false,
  rankPanelCollapsed: true,
  orderMode: initialOrderMode,
  fellowshipDisplayMode: initialFellowshipDisplayMode,
  questionOrder: buildQuestionOrder(initialOrderMode),
  currentIndex: 0,
  resultsPreview: false,
  responses: Array(questions.length).fill(null),
};

let lastTrigger = null;
let selectedExploreId = specialties[0].id;
let selectedCompareId = "internal-medicine";
let exploreZoom = 1;
let exploreDragState = null;
let suppressExploreCanvasClick = false;
let exploreResizeFrame = null;

const EXPLORE_CANVAS_BASE_WIDTH = 1920;
const EXPLORE_CANVAS_BASE_HEIGHT = 1220;
const EXPLORE_ZOOM_MIN = 0.7;
const EXPLORE_ZOOM_MAX = 2.2;
const EXPLORE_ZOOM_STEP = 0.2;
const EXPLORE_WHEEL_ZOOM_STEP = 0.12;
const EXPLORE_DRAG_THRESHOLD = 4;
let exploreCanvasBaseWidth = EXPLORE_CANVAS_BASE_WIDTH;
let exploreCanvasBaseHeight = EXPLORE_CANVAS_BASE_HEIGHT;

const infoModal = document.getElementById("infoModal");
const infoBackdrop = document.getElementById("infoBackdrop");
const infoToggle = document.getElementById("infoToggle");
const closeInfoButton = document.getElementById("closeInfoButton");
const settingsModal = document.getElementById("settingsModal");
const settingsBackdrop = document.getElementById("settingsBackdrop");
const settingsToggle = document.getElementById("settingsToggle");
const closeSettingsButton = document.getElementById("closeSettingsButton");
const settingsStatus = document.getElementById("settingsStatus");
const questionOrderInputs = Array.from(document.querySelectorAll('input[name="questionOrder"]'));
const fellowshipDisplayInputs = Array.from(document.querySelectorAll('input[name="fellowshipDisplay"]'));
const resultsFellowshipDisplayInputs = Array.from(document.querySelectorAll('input[name="resultsFellowshipDisplay"]'));
const shareModal = document.getElementById("shareModal");
const shareBackdrop = document.getElementById("shareBackdrop");
const shareToggle = document.getElementById("shareToggle");
const startShareButton = document.getElementById("startShareButton");
const resultsShareButton = document.getElementById("resultsShareButton");
const continueQuizButton = document.getElementById("continueQuizButton");
const closeShareButton = document.getElementById("closeShareButton");
const shareExportSection = document.getElementById("shareExportSection");
const shareSummary = document.getElementById("shareSummary");
const shareSeedOutput = document.getElementById("shareSeedOutput");
const copySeedButton = document.getElementById("copySeedButton");
const shareCopyStatus = document.getElementById("shareCopyStatus");
const shareSeedInput = document.getElementById("shareSeedInput");
const loadSeedButton = document.getElementById("loadSeedButton");
const shareImportStatus = document.getElementById("shareImportStatus");
const compareView = document.getElementById("compareView");
const compareAboutButton = document.getElementById("compareAboutButton");
const compareAboutModal = document.getElementById("compareAboutModal");
const compareAboutBackdrop = document.getElementById("compareAboutBackdrop");
const closeCompareAboutButton = document.getElementById("closeCompareAboutButton");
const closeCompareButton = document.getElementById("closeCompareButton");
const compareSpecialtySelect = document.getElementById("compareSpecialtySelect");
const compareSliderGrid = document.getElementById("compareSliderGrid");
const compareOutput = document.getElementById("compareOutput");
const exploreView = document.getElementById("exploreView");
const exploreToggle = document.getElementById("exploreToggle");
const resultsExploreButton = document.getElementById("resultsExploreButton");
const closeExploreButton = document.getElementById("closeExploreButton");
const exploreCanvasShell = document.getElementById("exploreCanvasShell");
const exploreCanvas = document.getElementById("exploreCanvas");
const exploreZoomOutButton = document.getElementById("exploreZoomOut");
const exploreZoomResetButton = document.getElementById("exploreZoomReset");
const exploreZoomInButton = document.getElementById("exploreZoomIn");
const exploreZoomValue = document.getElementById("exploreZoomValue");
const exploreNodeType = document.getElementById("exploreNodeType");
const exploreNodeTitle = document.getElementById("exploreNodeTitle");
const exploreNodeBlurb = document.getElementById("exploreNodeBlurb");
const exploreNodeScore = document.getElementById("exploreNodeScore");
const exploreNodeParent = document.getElementById("exploreNodeParent");
const exploreNodeNotes = document.getElementById("exploreNodeNotes");
const exploreNodeConnections = document.getElementById("exploreNodeConnections");
const exploreCompareButton = document.getElementById("exploreCompareButton");
const rankToggleButton = document.getElementById("rankToggleButton");
const appGrid = document.getElementById("appGrid");
const startView = document.getElementById("startView");
const startButton = document.getElementById("startButton");
const startExploreButton = document.getElementById("startExploreButton");
const startCompareButton = document.getElementById("startCompareButton");
const startInfoButton = document.getElementById("startInfoButton");
const progressWrap = document.getElementById("progressWrap");
const questionView = document.getElementById("questionView");
const resultsView = document.getElementById("resultsView");
const questionCategory = document.getElementById("questionCategory");
const questionText = document.getElementById("questionText");
const questionSupport = document.getElementById("questionSupport");
const progressLabel = document.getElementById("progressLabel");
const progressPercent = document.getElementById("progressPercent");
const progressFill = document.getElementById("progressFill");
const backButton = document.getElementById("backButton");
const finishQuizButton = document.getElementById("finishQuizButton");
const skipButton = document.getElementById("skipButton");
const answerYes = document.getElementById("answerYes");
const answerNo = document.getElementById("answerNo");
const resultsTitle = document.getElementById("resultsTitle");
const resultsSummaryText = document.getElementById("resultsSummaryText");
const resultsList = document.getElementById("resultsList");
const skippedSummary = document.getElementById("skippedSummary");
const restartTop = document.getElementById("restartTop");
const retakeButton = document.getElementById("retakeButton");
const rankPanel = document.getElementById("rankPanel");
const rankPanelToggle = document.getElementById("rankPanelToggle");
const rankSummary = document.getElementById("rankSummary");
const rankList = document.getElementById("rankList");
const rankLeader = document.getElementById("rankLeader");
const rankLeaderName = document.getElementById("rankLeaderName");
const rankLeaderBlurb = document.getElementById("rankLeaderBlurb");
const rankDetail = document.getElementById("rankDetail");
const rankDetailLabel = document.getElementById("rankDetailLabel");
const rankReasons = document.getElementById("rankReasons");
const rankPathDetail = document.getElementById("rankPathDetail");
const rankPathTitle = document.getElementById("rankPathTitle");
const rankPathList = document.getElementById("rankPathList");

let compareReturnView = "start";
let exploreReturnView = "start";

function syncModalBodyLock() {
  const modalOpen =
    !infoModal.classList.contains("hidden") ||
    !settingsModal.classList.contains("hidden") ||
    !shareModal.classList.contains("hidden") ||
    !compareAboutModal.classList.contains("hidden");
  document.body.classList.toggle("modal-open", modalOpen);
}

function hideCompareAboutModal() {
  compareAboutModal.classList.add("hidden");
  compareAboutModal.setAttribute("aria-hidden", "true");
}

function setInfoModalOpen(isOpen, trigger = null) {
  if (isOpen) {
    settingsModal.classList.add("hidden");
    settingsModal.setAttribute("aria-hidden", "true");
    shareModal.classList.add("hidden");
    shareModal.setAttribute("aria-hidden", "true");
    hideCompareAboutModal();
  }

  infoModal.classList.toggle("hidden", !isOpen);
  infoModal.setAttribute("aria-hidden", String(!isOpen));
  syncModalBodyLock();

  if (isOpen) {
    lastTrigger = trigger ?? document.activeElement;
    closeInfoButton.focus();
    return;
  }

  if (lastTrigger instanceof HTMLElement) {
    lastTrigger.focus();
  }
}

function updateSettingsUI() {
  questionOrderInputs.forEach((input) => {
    input.checked = input.value === state.orderMode;
  });

  updateFellowshipDisplayControls();

  if (!state.started) {
    settingsStatus.textContent = "Prompt order is used when a session begins. Fellowship display can be changed any time.";
    return;
  }

  const orderMessage = countAnswered() === 0
    ? "Prompt order can still take effect immediately."
    : "Prompt order changes will be used the next time you restart the session.";
  settingsStatus.textContent = `${orderMessage} Fellowship display updates immediately.`;
}

function updateFellowshipDisplayControls() {
  fellowshipDisplayInputs.forEach((input) => {
    input.checked = input.value === state.fellowshipDisplayMode;
  });

  resultsFellowshipDisplayInputs.forEach((input) => {
    input.checked = input.value === state.fellowshipDisplayMode;
  });
}

function setSettingsModalOpen(isOpen, trigger = null) {
  if (isOpen) {
    infoModal.classList.add("hidden");
    infoModal.setAttribute("aria-hidden", "true");
    shareModal.classList.add("hidden");
    shareModal.setAttribute("aria-hidden", "true");
    hideCompareAboutModal();
    updateSettingsUI();
  }

  settingsModal.classList.toggle("hidden", !isOpen);
  settingsModal.setAttribute("aria-hidden", String(!isOpen));
  syncModalBodyLock();

  if (isOpen) {
    lastTrigger = trigger ?? document.activeElement;
    closeSettingsButton.focus();
    return;
  }

  if (lastTrigger instanceof HTMLElement) {
    lastTrigger.focus();
  }
}

function setStatusMessage(element, message, tone = "") {
  element.textContent = message;
  element.classList.remove("share-status--success", "share-status--error");

  if (tone === "success") {
    element.classList.add("share-status--success");
  }

  if (tone === "error") {
    element.classList.add("share-status--error");
  }
}

function buildShareSummary() {
  const answered = countExplicitAnswers();
  const skipped = countSkipped();
  const answeredLabel = `${answered} answered prompt${answered === 1 ? "" : "s"}`;
  const skippedLabel = skipped > 0
    ? ` and ${skipped} skipped prompt${skipped === 1 ? "" : "s"}`
    : "";

  if (isResultsActive()) {
    return `Current results: ${answeredLabel}. Loading this seed restores the same answer pattern.`;
  }

  return `Current signal: ${answeredLabel}${skippedLabel}. Loading this seed resumes from the same prompt order and place.`;
}

function updateShareUI() {
  const hasSession = state.started;
  shareExportSection.classList.toggle("hidden", !hasSession);
  shareSeedOutput.value = hasSession ? buildShareSeed() : "";
  shareSummary.textContent = hasSession ? buildShareSummary() : "";
  copySeedButton.disabled = !hasSession;
  setStatusMessage(shareCopyStatus, "");
  setStatusMessage(shareImportStatus, "");
}

function setShareModalOpen(isOpen, trigger = null) {
  if (isOpen) {
    infoModal.classList.add("hidden");
    infoModal.setAttribute("aria-hidden", "true");
    settingsModal.classList.add("hidden");
    settingsModal.setAttribute("aria-hidden", "true");
    hideCompareAboutModal();
    updateShareUI();
  }

  shareModal.classList.toggle("hidden", !isOpen);
  shareModal.setAttribute("aria-hidden", String(!isOpen));
  syncModalBodyLock();

  if (isOpen) {
    lastTrigger = trigger ?? document.activeElement;

    if (state.started) {
      closeShareButton.focus();
    } else {
      shareSeedInput.focus();
    }

    return;
  }

  if (lastTrigger instanceof HTMLElement) {
    lastTrigger.focus();
  }
}

function setCompareAboutModalOpen(isOpen, trigger = null) {
  if (isOpen) {
    infoModal.classList.add("hidden");
    infoModal.setAttribute("aria-hidden", "true");
    settingsModal.classList.add("hidden");
    settingsModal.setAttribute("aria-hidden", "true");
    shareModal.classList.add("hidden");
    shareModal.setAttribute("aria-hidden", "true");
  }

  compareAboutModal.classList.toggle("hidden", !isOpen);
  compareAboutModal.setAttribute("aria-hidden", String(!isOpen));
  syncModalBodyLock();

  if (isOpen) {
    lastTrigger = trigger ?? document.activeElement;
    closeCompareAboutButton.focus();
    return;
  }

  if (lastTrigger instanceof HTMLElement) {
    lastTrigger.focus();
  }
}

function getCompareDataIdForEntity(entity) {
  if (!entity) {
    return null;
  }

  if (compareDataById[entity.id]) {
    return entity.id;
  }

  if (entity.kind === "specialty") {
    return specialtyCompareMap[entity.id] || null;
  }

  if (entity.kind === "fellowship") {
    return fellowshipCompareMap[entity.id] || specialtyCompareMap[entity.parentId] || null;
  }

  return null;
}

function getCompareDataIdForEntityId(entityId) {
  if (compareDataById[entityId]) {
    return entityId;
  }

  const specialty = specialtyById[entityId];

  if (specialty) {
    return getCompareDataIdForEntity(specialty);
  }

  const fellowship = fellowshipPaths.find((path) => path.id === entityId);

  if (fellowship) {
    return getCompareDataIdForEntity({ ...fellowship, kind: "fellowship" });
  }

  return null;
}

function getSpecialtyOptionIdForCompareData(compareDataId) {
  return specialties.find((specialty) => getCompareDataIdForEntity(specialty) === compareDataId)?.id ?? null;
}

function getCompareOptionIdForSelection(selectionId) {
  if (specialtyById[selectionId]) {
    return selectionId;
  }

  const fellowship = fellowshipPaths.find((path) => path.id === selectionId);

  if (fellowship) {
    if (fellowshipCompareSelectionMap[fellowship.id]) {
      return fellowshipCompareSelectionMap[fellowship.id];
    }

    const compareDataId = getCompareDataIdForEntity({ ...fellowship, kind: "fellowship" });
    return getSpecialtyOptionIdForCompareData(compareDataId) ?? fellowship.parentId;
  }

  if (compareDataById[selectionId]) {
    return getSpecialtyOptionIdForCompareData(selectionId) ?? selectionId;
  }

  return selectionId;
}

function isKnownCompareSelectionId(selectionId) {
  return Boolean(
    compareDataById[selectionId]
    || specialtyById[selectionId]
    || fellowshipPaths.some((path) => path.id === selectionId)
  );
}

function getCompareSelectionLabel(selectionId) {
  const optionId = getCompareOptionIdForSelection(selectionId);
  const fellowship = fellowshipPaths.find((path) => path.id === selectionId);

  return specialtyById[optionId]?.name
    ?? compareDataById[selectionId]?.name
    ?? fellowship?.name
    ?? "Selected specialty";
}

function createCompareButton(selectionId, label = "Compare applicant profile") {
  if (!selectionId) {
    return "";
  }

  const optionId = getCompareOptionIdForSelection(selectionId);
  const compareDataId = getCompareDataIdForEntityId(selectionId)
    ?? getCompareDataIdForEntityId(optionId);

  if (!compareDataId || !compareDataById[compareDataId]) {
    return "";
  }

  return `<button class="ghost-button match-card__compare" type="button" data-compare-id="${selectionId}">${label}</button>`;
}

function getCompareDataOptions() {
  return specialties
    .map((specialty) => {
      const compareDataId = getCompareDataIdForEntity(specialty);
      return {
        id: specialty.id,
        name: specialty.name,
        hasCompareData: Boolean(compareDataId && compareDataById[compareDataId]),
      };
    })
    .filter((option) => option.hasCompareData)
    .sort((left, right) => left.name.localeCompare(right.name));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function ensureCompareControls() {
  compareSpecialtySelect.innerHTML = getCompareDataOptions()
    .map(({ id, name }) => `<option value="${id}">${name}</option>`)
    .join("");

  compareSliderGrid.innerHTML = compareSliderDefinitions.map((definition) => `
    <label class="compare-slider" for="compare-${definition.key}">
      <span class="compare-slider__top">
        <span>${definition.label}</span>
        <output id="compare-${definition.key}-value" for="compare-${definition.key}">${compareProfile[definition.key]}</output>
      </span>
      <span class="compare-slider__range${compareNeededFor90Keys.has(definition.key) ? " compare-slider__range--with-marker" : ""}">
        <input
          id="compare-${definition.key}"
          type="range"
          min="${definition.min}"
          max="${definition.max}"
          step="${definition.step}"
          value="${compareProfile[definition.key]}"
          data-compare-slider="${definition.key}"
        >
        <span class="compare-slider__needed90 is-hidden" id="compare-${definition.key}-needed90" aria-hidden="true">
          <span class="compare-slider__needed90-label"></span>
        </span>
      </span>
    </label>
  `).join("");
}

function syncCompareInputs() {
  compareSliderDefinitions.forEach((definition) => {
    const input = compareSliderGrid.querySelector(`[data-compare-slider="${definition.key}"]`);
    const output = document.getElementById(`compare-${definition.key}-value`);

    if (!input || !output) {
      return;
    }

    input.value = compareProfile[definition.key];
    output.textContent = compareProfile[definition.key];
  });

  compareCheckDefinitions.forEach((definition) => {
    const input = compareView.querySelector(`[data-compare-check="${definition.key}"]`);

    if (input) {
      input.checked = Boolean(compareProfile[definition.key]);
    }
  });
}

function formatCompareValue(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function getMarkerPosition(value, min, max) {
  return `${clamp(((value - min) / (max - min)) * 100, 0, 100)}%`;
}

function getNeededFor90Text(definition, value) {
  if (definition.key === "step2") {
    return `90%: ${Math.round(value)}`;
  }

  return `90%: ${formatCompareValue(value)} ranks`;
}

function updateNeededFor90Markers(data) {
  compareSliderDefinitions.forEach((definition) => {
    const marker = document.getElementById(`compare-${definition.key}-needed90`);
    const label = marker?.querySelector(".compare-slider__needed90-label");

    if (!marker || !label) {
      return;
    }

    marker.classList.add("is-hidden");

    if (!compareNeededFor90Keys.has(definition.key) || !data?.neededFor90) {
      return;
    }

    const value = data.neededFor90[definition.key];

    if (!Number.isFinite(value)) {
      return;
    }

    marker.style.setProperty("--x", getMarkerPosition(value, definition.min, definition.max));
    label.textContent = getNeededFor90Text(definition, value);
    marker.classList.remove("is-hidden");
  });
}

function getRadarPoint(center, radius, axisIndex, axisCount, ratio) {
  const angle = (-Math.PI / 2) + ((Math.PI * 2 * axisIndex) / axisCount);
  const distance = radius * ratio;

  return {
    x: center + (Math.cos(angle) * distance),
    y: center + (Math.sin(angle) * distance),
  };
}

function getRadarPointString(metrics, valueAccessor, maxRatio = 1.35) {
  const center = 150;
  const radius = 94;

  return metrics.map((metric, index) => {
    const value = Math.max(metric.radarMin ?? 0, valueAccessor(metric));
    const matchedMean = Math.max(0.01, metric.matchedMean);
    const ratio = clamp(value / matchedMean, 0, maxRatio) / maxRatio;
    const point = getRadarPoint(center, radius, index, metrics.length, ratio);

    return `${point.x.toFixed(1)},${point.y.toFixed(1)}`;
  }).join(" ");
}

function getRadarAxisLabel(label) {
  return label
    .replace("USMLE Step 2 CK score", "Step 2")
    .replace("Contiguous ranked programs", "Ranked programs")
    .replace("Abstracts, presentations, publications", "Publications")
    .replace("Research projects", "Research")
    .replace("Binary Individuators", "Binary individuators");
}

function getBinaryIndividuatorMetric(checkMetrics) {
  const baseline = 1;
  const positiveDeltas = checkMetrics.map((metric) => Math.max(0, metric.matchedPercent - metric.unmatchedPercent));
  const totalPositiveDelta = positiveDeltas.reduce((total, delta) => total + delta, 0);
  const availablePoints = 4;
  const fallbackWeight = availablePoints / Math.max(1, checkMetrics.length);
  const weightedMetrics = checkMetrics.map((metric, index) => ({
    ...metric,
    binaryWeight: totalPositiveDelta > 0
      ? (positiveDeltas[index] / totalPositiveDelta) * availablePoints
      : fallbackWeight,
  }));

  return {
    key: "binaryIndividuators",
    label: "Binary Individuators",
    min: baseline,
    max: baseline + availablePoints,
    value: baseline + weightedMetrics.reduce((total, metric) => total + (metric.checked ? metric.binaryWeight : 0), 0),
    matchedMean: baseline + weightedMetrics.reduce((total, metric) => total + ((metric.matchedPercent / 100) * metric.binaryWeight), 0),
    unmatchedMean: baseline + weightedMetrics.reduce((total, metric) => total + ((metric.unmatchedPercent / 100) * metric.binaryWeight), 0),
    meetsMatchedMean: false,
    isBinaryIndividuator: true,
    weightedMetrics,
  };
}

function formatCompareMetricValue(metric, value) {
  if (metric.isBinaryIndividuator) {
    return `${formatCompareValue(value)} of ${formatCompareValue(metric.max)}`;
  }

  return formatCompareValue(value);
}

function renderMatchedAverageRadar(metrics) {
  const center = 150;
  const radius = 94;
  const maxRatio = 1.35;
  const axisCount = metrics.length;
  const matchedRingRatio = 1 / maxRatio;
  const gridRatios = [0.25, 0.5, 0.75, 1].map((ratio) => ratio / maxRatio);
  const userPoints = getRadarPointString(metrics, (metric) => metric.value, maxRatio);
  const matchedPoints = getRadarPointString(metrics, (metric) => metric.matchedMean, maxRatio);
  const axisMarkup = metrics.map((metric, index) => {
    const outerPoint = getRadarPoint(center, radius, index, axisCount, 1);
    const labelPoint = getRadarPoint(center, radius + 26, index, axisCount, 1);
    const anchor = Math.abs(labelPoint.x - center) < 10
      ? "middle"
      : labelPoint.x > center ? "start" : "end";

    return `
      <line class="compare-radar__axis" x1="${center}" y1="${center}" x2="${outerPoint.x.toFixed(1)}" y2="${outerPoint.y.toFixed(1)}"></line>
      <text class="compare-radar__label" x="${labelPoint.x.toFixed(1)}" y="${labelPoint.y.toFixed(1)}" text-anchor="${anchor}">${getRadarAxisLabel(metric.label)}</text>
    `;
  }).join("");
  const gridMarkup = gridRatios.map((ratio) => {
    const points = metrics.map((_, index) => {
      const point = getRadarPoint(center, radius, index, axisCount, ratio);
      return `${point.x.toFixed(1)},${point.y.toFixed(1)}`;
    }).join(" ");

    return `<polygon class="compare-radar__grid" points="${points}"></polygon>`;
  }).join("");
  const matchedRingPoints = metrics.map((_, index) => {
    const point = getRadarPoint(center, radius, index, axisCount, matchedRingRatio);
    return `${point.x.toFixed(1)},${point.y.toFixed(1)}`;
  }).join(" ");

  return `
    <div class="compare-radar-card">
      <div class="compare-radar-card__copy">
        <h4>How your inputs compare with the matched average</h4>
      </div>
      <figure class="compare-radar" aria-label="Radar chart comparing your inputs with matched-applicant averages">
        <svg viewBox="0 0 300 300" role="img">
          <title>Your profile inputs compared with matched-applicant averages</title>
          <desc>The dashed polygon shows matched-applicant means. The filled teal polygon shows the user's current inputs, including a binary individuators axis scored from 1 to 5 using specialty-specific matched-minus-unmatched deltas and capped at 135 percent of the matched mean for each axis.</desc>
          ${gridMarkup}
          ${axisMarkup}
          <polygon class="compare-radar__matched" points="${matchedPoints}"></polygon>
          <polygon class="compare-radar__matched-ring" points="${matchedRingPoints}"></polygon>
          <polygon class="compare-radar__user" points="${userPoints}"></polygon>
        </svg>
      </figure>
    </div>
  `;
}

function renderCompareOutput() {
  const selectedOptionId = getCompareOptionIdForSelection(selectedCompareId);
  const selectedName = getCompareSelectionLabel(selectedCompareId);
  const selectedCompareDataId = getCompareDataIdForEntityId(selectedCompareId)
    ?? getCompareDataIdForEntityId(selectedOptionId);
  const data = selectedCompareDataId ? compareDataById[selectedCompareDataId] : null;

  compareSpecialtySelect.value = selectedOptionId;

  if (!data) {
    updateNeededFor90Markers(null);
    compareOutput.innerHTML = `
      <div class="compare-empty">
        <h3>${selectedName}</h3>
        <p>NRMP Charting Outcomes 2024 does not include a U.S. MD senior comparison table for this field, so there is no matched-applicant radar chart to show here.</p>
      </div>
    `;
    return;
  }

  updateNeededFor90Markers(data);

  const continuousMetrics = compareSliderDefinitions.map((definition) => {
    const value = Number(compareProfile[definition.key]);
    const matchedMean = data.matched[definition.key];
    const unmatchedMean = data.unmatched[definition.key];

    return {
      ...definition,
      value,
      matchedMean,
      unmatchedMean,
      meetsMatchedMean: value >= matchedMean,
    };
  });

  const checkMetrics = compareCheckDefinitions.map((definition) => {
    const checked = Boolean(compareProfile[definition.key]);
    const matchedPercent = data.matched[definition.key];
    const unmatchedPercent = data.unmatched[definition.key];

    return {
      ...definition,
      checked,
      matchedPercent,
      unmatchedPercent,
    };
  });

  const binaryIndividuatorMetric = getBinaryIndividuatorMetric(checkMetrics);
  binaryIndividuatorMetric.meetsMatchedMean = binaryIndividuatorMetric.value >= binaryIndividuatorMetric.matchedMean;
  const radarMetrics = [...continuousMetrics, binaryIndividuatorMetric];
  const matchedShare = Math.round((data.matchedN / (data.matchedN + data.unmatchedN)) * 100);

  const metricMarkup = radarMetrics.map((metric) => `
    <div class="compare-metric">
      <div class="compare-metric__head">
        <span>${metric.label}</span>
        <strong>You: ${formatCompareMetricValue(metric, metric.value)}</strong>
      </div>
      <div class="compare-bar" aria-hidden="true">
        <span class="compare-bar__marker compare-bar__marker--unmatched" style="--x: ${getMarkerPosition(metric.unmatchedMean, metric.min, metric.max)}"></span>
        <span class="compare-bar__marker compare-bar__marker--matched" style="--x: ${getMarkerPosition(metric.matchedMean, metric.min, metric.max)}"></span>
        <span class="compare-bar__marker compare-bar__marker--user" style="--x: ${getMarkerPosition(metric.value, metric.min, metric.max)}"></span>
      </div>
      <div class="compare-metric__values">
        <span>Matched mean ${formatCompareMetricValue(metric, metric.matchedMean)}</span>
        <span>Unmatched mean ${formatCompareMetricValue(metric, metric.unmatchedMean)}</span>
      </div>
    </div>
  `).join("");

  compareOutput.innerHTML = `
    ${renderMatchedAverageRadar(radarMetrics)}

    <div class="compare-summary-grid">
      <div class="compare-stat-card">
        <span class="meta-block__label">2024 specialty match share</span>
        <strong>${matchedShare}%</strong>
        <p>${data.matchedN} matched and ${data.unmatchedN} did not match to this preferred specialty in the analyzed U.S. MD senior group.</p>
      </div>
    </div>

    <div class="compare-legend" aria-hidden="true">
      <span><i class="compare-dot compare-dot--user"></i>You</span>
      <span><i class="compare-dot compare-dot--matched"></i>Matched mean</span>
      <span><i class="compare-dot compare-dot--unmatched"></i>Unmatched mean</span>
    </div>

    <div class="compare-metric-list">${metricMarkup}</div>
  `;
}

function getActivePrimaryView() {
  if (!exploreView.classList.contains("hidden")) {
    return "explore";
  }

  if (!compareView.classList.contains("hidden")) {
    return "compare";
  }

  if (!resultsView.classList.contains("hidden")) {
    return "results";
  }

  if (!questionView.classList.contains("hidden")) {
    return "question";
  }

  return "start";
}

function hideCompareView() {
  hideCompareAboutModal();
  compareView.classList.add("hidden");
  compareView.setAttribute("aria-hidden", "true");
}

function hideExploreView() {
  document.body.classList.remove("explore-mode");
  exploreView.classList.add("hidden");
  exploreView.setAttribute("aria-hidden", "true");
}

function scrollPageToTop() {
  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  });
}

function showCompareView(trigger = null, compareId = null, preserveReturn = false) {
  if (!preserveReturn) {
    compareReturnView = getActivePrimaryView();
  }

  infoModal.classList.add("hidden");
  infoModal.setAttribute("aria-hidden", "true");
  settingsModal.classList.add("hidden");
  settingsModal.setAttribute("aria-hidden", "true");
  shareModal.classList.add("hidden");
  shareModal.setAttribute("aria-hidden", "true");
  hideCompareAboutModal();
  hideExploreView();

  if (compareId && isKnownCompareSelectionId(compareId)) {
    selectedCompareId = getCompareOptionIdForSelection(compareId);
  }

  state.rankPanelCollapsed = true;
  ensureCompareControls();
  syncCompareInputs();
  renderCompareOutput();

  startView.classList.add("hidden");
  questionView.classList.add("hidden");
  resultsView.classList.add("hidden");
  progressWrap.classList.add("hidden");
  compareView.classList.remove("hidden");
  compareView.setAttribute("aria-hidden", "false");
  syncModalBodyLock();
  syncRankPanelVisibility();
  scrollPageToTop();

  lastTrigger = trigger ?? document.activeElement;
  closeCompareButton.focus();
}

function showExploreView(trigger = null, selectedId = null, preserveReturn = false) {
  if (!preserveReturn) {
    exploreReturnView = getActivePrimaryView();
  }

  infoModal.classList.add("hidden");
  infoModal.setAttribute("aria-hidden", "true");
  settingsModal.classList.add("hidden");
  settingsModal.setAttribute("aria-hidden", "true");
  shareModal.classList.add("hidden");
  shareModal.setAttribute("aria-hidden", "true");
  hideCompareAboutModal();

  if (selectedId) {
    selectedExploreId = selectedId;
  }

  state.rankPanelCollapsed = true;
  document.body.classList.add("explore-mode");
  startView.classList.add("hidden");
  questionView.classList.add("hidden");
  resultsView.classList.add("hidden");
  progressWrap.classList.add("hidden");
  hideCompareView();
  exploreView.classList.remove("hidden");
  exploreView.setAttribute("aria-hidden", "false");
  renderExploreView();
  syncModalBodyLock();
  syncRankPanelVisibility();
  centerExploreCanvas();
  scrollPageToTop();

  lastTrigger = trigger ?? document.activeElement;
  closeExploreButton.focus();
}

function returnFromCompareView() {
  hideCompareView();

  if (compareReturnView === "explore") {
    showExploreView(null, selectedExploreId, true);
    return;
  }

  if (compareReturnView === "results" && state.started) {
    showResults();
    return;
  }

  if (compareReturnView === "question" && state.started && state.currentIndex < questions.length) {
    renderQuestion();
    return;
  }

  showStartState();
}

function returnFromExploreView() {
  hideExploreView();

  if (exploreReturnView === "compare") {
    showCompareView(null, selectedCompareId, true);
    return;
  }

  if (exploreReturnView === "results" && state.started) {
    showResults();
    return;
  }

  if (exploreReturnView === "question" && state.started && state.currentIndex < questions.length) {
    renderQuestion();
    return;
  }

  showStartState();
}

function handleCompareInput(event) {
  const sliderKey = event.target.dataset.compareSlider;
  const checkKey = event.target.dataset.compareCheck;

  if (sliderKey) {
    compareProfile[sliderKey] = Number(event.target.value);
    const output = document.getElementById(`compare-${sliderKey}-value`);

    if (output) {
      output.textContent = event.target.value;
    }
  }

  if (checkKey) {
    compareProfile[checkKey] = event.target.checked;
  }

  renderCompareOutput();
}

function handleCompareSelectionChange() {
  selectedCompareId = compareSpecialtySelect.value;
  renderCompareOutput();
}

function handleCompareTriggerClick(event) {
  const trigger = event.target.closest("[data-compare-id]");

  if (!trigger) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  showCompareView(trigger, trigger.dataset.compareId);
}

function clampExploreZoom(value) {
  return Math.min(EXPLORE_ZOOM_MAX, Math.max(EXPLORE_ZOOM_MIN, value));
}

function syncExploreZoomControls() {
  const zoom = Number(exploreZoom.toFixed(2));
  const canvasWidth = Math.round(exploreCanvasBaseWidth * zoom);
  const canvasHeight = Math.round(exploreCanvasBaseHeight * zoom);

  exploreCanvas.style.width = `${canvasWidth}px`;
  exploreCanvas.style.height = `${canvasHeight}px`;
  exploreCanvas.style.minWidth = `${canvasWidth}px`;
  exploreCanvas.style.minHeight = `${canvasHeight}px`;
  exploreZoomValue.textContent = `${Math.round(zoom * 100)}%`;

  exploreZoomOutButton.disabled = zoom <= EXPLORE_ZOOM_MIN + 0.01;
  exploreZoomResetButton.disabled = Math.abs(zoom - 1) < 0.01;
  exploreZoomInButton.disabled = zoom >= EXPLORE_ZOOM_MAX - 0.01;
}

function centerExploreCanvas() {
  requestAnimationFrame(() => {
    const maxScrollLeft = Math.max(0, exploreCanvasShell.scrollWidth - exploreCanvasShell.clientWidth);
    const maxScrollTop = Math.max(0, exploreCanvasShell.scrollHeight - exploreCanvasShell.clientHeight);

    exploreCanvasShell.scrollLeft = maxScrollLeft / 2;
    exploreCanvasShell.scrollTop = maxScrollTop / 2;
  });
}

function setExploreZoom(nextZoom, preserveCenter = true, anchorPoint = null) {
  const previousWidth = exploreCanvasShell.scrollWidth || 1;
  const previousHeight = exploreCanvasShell.scrollHeight || 1;
  const shellRect = exploreCanvasShell.getBoundingClientRect();
  const anchorOffsetX = anchorPoint
    ? anchorPoint.clientX - shellRect.left
    : exploreCanvasShell.clientWidth / 2;
  const anchorOffsetY = anchorPoint
    ? anchorPoint.clientY - shellRect.top
    : exploreCanvasShell.clientHeight / 2;
  const anchorXRatio = (exploreCanvasShell.scrollLeft + anchorOffsetX) / previousWidth;
  const anchorYRatio = (exploreCanvasShell.scrollTop + anchorOffsetY) / previousHeight;

  exploreZoom = clampExploreZoom(nextZoom);
  syncExploreZoomControls();

  if (!preserveCenter) {
    return;
  }

  requestAnimationFrame(() => {
    exploreCanvasShell.scrollLeft = (exploreCanvasShell.scrollWidth * anchorXRatio) - anchorOffsetX;
    exploreCanvasShell.scrollTop = (exploreCanvasShell.scrollHeight * anchorYRatio) - anchorOffsetY;
  });
}

function resetExploreZoom() {
  setExploreZoom(1, false);
  centerExploreCanvas();
}

function handleExploreResize() {
  if (exploreView.classList.contains("hidden")) {
    return;
  }

  if (exploreResizeFrame) {
    cancelAnimationFrame(exploreResizeFrame);
  }

  exploreResizeFrame = requestAnimationFrame(() => {
    exploreResizeFrame = null;
    syncExploreZoomControls();
    centerExploreCanvas();
  });
}

function handleExploreWheel(event) {
  if (exploreView.classList.contains("hidden")) {
    return;
  }

  event.preventDefault();
  const direction = event.deltaY < 0 ? 1 : -1;
  setExploreZoom(
    exploreZoom + (direction * EXPLORE_WHEEL_ZOOM_STEP),
    true,
    { clientX: event.clientX, clientY: event.clientY }
  );
}

function handleExplorePointerDown(event) {
  if (event.button !== 0) {
    return;
  }

  exploreDragState = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    scrollLeft: exploreCanvasShell.scrollLeft,
    scrollTop: exploreCanvasShell.scrollTop,
    hasMoved: false,
  };
}

function handleExplorePointerMove(event) {
  if (!exploreDragState || event.pointerId !== exploreDragState.pointerId) {
    return;
  }

  const deltaX = event.clientX - exploreDragState.startX;
  const deltaY = event.clientY - exploreDragState.startY;

  if (!exploreDragState.hasMoved && Math.hypot(deltaX, deltaY) >= EXPLORE_DRAG_THRESHOLD) {
    exploreDragState.hasMoved = true;
    suppressExploreCanvasClick = true;

    if (!exploreCanvasShell.hasPointerCapture(event.pointerId)) {
      exploreCanvasShell.setPointerCapture(event.pointerId);
    }

    exploreCanvasShell.classList.add("explore-canvas-shell--dragging");
  }

  if (!exploreDragState.hasMoved) {
    return;
  }

  event.preventDefault();
  exploreCanvasShell.scrollLeft = exploreDragState.scrollLeft - deltaX;
  exploreCanvasShell.scrollTop = exploreDragState.scrollTop - deltaY;
}

function endExplorePointerDrag(event) {
  if (!exploreDragState || event.pointerId !== exploreDragState.pointerId) {
    return;
  }

  const shouldClearSuppressedClick = exploreDragState.hasMoved;

  if (exploreCanvasShell.hasPointerCapture(event.pointerId)) {
    exploreCanvasShell.releasePointerCapture(event.pointerId);
  }

  exploreCanvasShell.classList.remove("explore-canvas-shell--dragging");
  exploreDragState = null;

  if (shouldClearSuppressedClick) {
    setTimeout(() => {
      suppressExploreCanvasClick = false;
    }, 150);
  }
}

function applyOrderMode(mode) {
  if (mode !== "random" && mode !== "sequential") {
    return;
  }

  state.orderMode = mode;
  saveOrderMode(mode);
  updateSettingsUI();

  if (!state.started || countAnswered() === 0) {
    state.questionOrder = buildQuestionOrder(state.orderMode);

    if (state.started && !questionView.classList.contains("hidden")) {
      renderQuestion();
    }
  }
}

function applyFellowshipDisplayMode(mode) {
  if (mode !== "integrated" && mode !== "separate") {
    return;
  }

  state.fellowshipDisplayMode = mode;
  saveFellowshipDisplayMode(mode);
  updateFellowshipDisplayControls();
  updateSettingsUI();

  if (isResultsActive()) {
    showResults();
    return;
  }

  if (state.started && state.currentIndex < questions.length) {
    renderRankPanel();
  }
}

function syncCurrentResponseControls(response) {
  answerYes.classList.toggle("answer-button--selected", response === "yes");
  answerNo.classList.toggle("answer-button--selected", response === "no");
  skipButton.classList.toggle("ghost-button--selected", response === "skip");

  answerYes.setAttribute("aria-pressed", String(response === "yes"));
  answerNo.setAttribute("aria-pressed", String(response === "no"));
  skipButton.setAttribute("aria-pressed", String(response === "skip"));
  skipButton.textContent = response === "skip" ? "Skipped" : "Skip";
}

function applyImportedSession(seedPayload) {
  state.started = true;
  state.rankPanelCollapsed = true;
  state.orderMode = seedPayload.orderMode;
  state.questionOrder = [...seedPayload.questionOrder];
  state.currentIndex = seedPayload.currentIndex;
  state.resultsPreview = false;
  state.responses = [...seedPayload.responses];
  resultsList.innerHTML = "";
  restartTop.classList.remove("hidden");
  updateSettingsUI();
  setInfoModalOpen(false);
  setSettingsModalOpen(false);
  setShareModalOpen(false);
  hideCompareView();
  hideExploreView();
  shareSeedInput.value = "";
  startView.classList.add("hidden");
  progressWrap.classList.remove("hidden");

  if (state.currentIndex >= questions.length) {
    showResults();
    return;
  }

  renderQuestion();
}

async function copyCurrentSeed() {
  if (!state.started) {
    return;
  }

  const seed = buildShareSeed();

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(seed);
      setStatusMessage(shareCopyStatus, "Seed copied.", "success");
      return;
    }
  } catch {
    // Fall through to manual-copy fallback.
  }

  shareSeedOutput.focus();
  shareSeedOutput.select();

  try {
    const copied = typeof document.execCommand === "function" && document.execCommand("copy");
    setStatusMessage(
      shareCopyStatus,
      copied ? "Seed copied." : "Copy did not complete automatically. The seed is selected for manual copy.",
      copied ? "success" : ""
    );
  } catch {
    setStatusMessage(shareCopyStatus, "Copy did not complete automatically. The seed is selected for manual copy.");
  }
}

function loadSeedFromInput() {
  const seedText = shareSeedInput.value.trim();

  if (!seedText) {
    setStatusMessage(shareImportStatus, "Paste a seed first.", "error");
    return;
  }

  try {
    const parsedSeed = parseShareSeed(seedText);
    setStatusMessage(shareImportStatus, "Seed loaded.", "success");
    applyImportedSession(parsedSeed);
  } catch (error) {
    setStatusMessage(
      shareImportStatus,
      error instanceof Error ? error.message : "That seed could not be loaded.",
      "error"
    );
  }
}

function buildFellowshipSignalLine(label) {
  return `Your answers also leaned toward ${label}, which often supports this path.`;
}

function getFellowshipScoreData(specialtyResults = getScoreData()) {
  const answeredCount = countExplicitAnswers();
  const specialtyResultMap = Object.fromEntries(specialtyResults.map((item) => [item.id, item]));
  const ranked = fellowshipPaths
    .map((path) => {
      const parent = specialtyResultMap[path.parentId];
      const matchedSignals = [];
      let matchedWeight = 0;
      let answeredSignalWeight = 0;
      let matchedSignalCount = 0;
      const totalSignalWeight = path.signals.reduce((sum, signal) => sum + signal.weight, 0);

      path.signals.forEach((signal) => {
        const questionIndex = questionIndexById[signal.questionId];

        if (questionIndex === undefined) {
          return;
        }

        const response = state.responses[questionIndex];

        if (response !== "yes" && response !== "no") {
          return;
        }

        answeredSignalWeight += signal.weight;

        if (response === signal.answer) {
          matchedWeight += signal.weight;
          matchedSignalCount += 1;
          matchedSignals.push({
            kind: "signal",
            weight: signal.weight,
            explanation: buildFellowshipSignalLine(signal.label),
          });
        }
      });

      const signalRatio = answeredSignalWeight > 0 ? matchedWeight / answeredSignalWeight : 0;
      const coverageRatio = totalSignalWeight > 0 ? answeredSignalWeight / totalSignalWeight : 0;
      const parentAdjusted = parent?.adjusted ?? 0;
      const directAdjusted = answeredSignalWeight === 0
        ? 0
        : Math.min(1, signalRatio * (0.55 + coverageRatio * 0.45));
      const adjusted = answeredCount === 0 || answeredSignalWeight === 0
        ? 0
        : Math.min(1, parentAdjusted * directAdjusted);

      const reasons = [];

      if (parent && parent.raw > 0) {
        reasons.push({
          kind: "home",
          weight: Math.max(1, Math.round(parent.normalized / 18)),
          explanation: `${parent.name} is the home specialty for this path, so its specialty-level score gives useful context.`,
        });
      }

      matchedSignals
        .sort((left, right) => right.weight - left.weight)
        .slice(0, 2)
        .forEach((reason) => reasons.push(reason));

      return {
        ...path,
        kind: "fellowship",
        color: specialtyById[path.parentId]?.color ?? "#2d7d89",
        parentName: specialtyById[path.parentId]?.name ?? "Specialty",
        parentAdjusted,
        signalRatio,
        answeredSignalWeight,
        matchedWeight,
        matchedSignalCount,
        directAdjusted,
        adjusted,
        fitPercent: answeredCount === 0 ? 0 : Math.round(adjusted * 100),
        reasons,
      };
    })
    .sort((left, right) => {
      if (right.adjusted !== left.adjusted) {
        return right.adjusted - left.adjusted;
      }

      return left.name.localeCompare(right.name);
    });

  const topAdjusted = Math.max(ranked[0]?.adjusted ?? 0, 0.0001);
  return ranked.map((path) => ({
    ...path,
    normalized: answeredCount === 0 ? 0 : Math.round((path.adjusted / topAdjusted) * 100),
  }));
}

function getIndependentFellowshipScoreData(fellowshipResults = getFellowshipScoreData()) {
  const answeredCount = countExplicitAnswers();
  const ranked = [...fellowshipResults].sort((left, right) => {
    if (right.directAdjusted !== left.directAdjusted) {
      return right.directAdjusted - left.directAdjusted;
    }

    if (right.matchedWeight !== left.matchedWeight) {
      return right.matchedWeight - left.matchedWeight;
    }

    return left.name.localeCompare(right.name);
  });

  const topAdjusted = Math.max(ranked[0]?.directAdjusted ?? 0, 0.0001);
  return ranked.map((path) => ({
    ...path,
    adjusted: path.directAdjusted,
    fitPercent: answeredCount === 0 ? 0 : Math.round(path.directAdjusted * 100),
    normalized: answeredCount === 0 ? 0 : Math.round((path.directAdjusted / topAdjusted) * 100),
    reasons: path.reasons.filter((reason) => reason.kind !== "home"),
  }));
}

function getTopFellowshipsForSpecialty(specialtyId, limit = 3, fellowshipResults = null) {
  if (countExplicitAnswers() < 5) {
    return [];
  }

  const source = fellowshipResults ?? getFellowshipScoreData();
  return source
    .filter((path) => path.parentId === specialtyId && path.parentAdjusted > 0.08 && path.matchedWeight > 0)
    .slice(0, limit);
}

function createPathButton(path, compact = false) {
  return `
    <button class="path-pill ${compact ? "path-pill--compact" : ""}" type="button" data-explore-id="${path.id}">
      <span class="path-pill__top">
        <span class="path-pill__name">${path.name}</span>
        <span class="path-pill__score">${path.fitPercent}%</span>
      </span>
      <span class="path-pill__meta">${compact ? "Open in explore" : `via ${path.parentName}`}</span>
    </button>
  `;
}

function splitExploreLabel(label) {
  if (!label.includes(" ") || label.length <= 14) {
    return [label];
  }

  const words = label.split(" ");

  if (words.length === 2) {
    return words;
  }

  const midpoint = Math.ceil(words.length / 2);
  return [words.slice(0, midpoint).join(" "), words.slice(midpoint).join(" ")];
}

function buildExploreTextMarkup(label, x, y, className) {
  const lines = splitExploreLabel(label);

  if (lines.length === 1) {
    return `<text class="${className}" x="${x}" y="${y}">${lines[0]}</text>`;
  }

  return `
    <text class="${className}" x="${x}" y="${y}">
      <tspan x="${x}" dy="0">${lines[0]}</tspan>
      <tspan x="${x}" dy="1.12em">${lines[1]}</tspan>
    </text>
  `;
}

function getExploreProfileKey(questionId, answer) {
  return `${questionId}:${answer}`;
}

function addExploreProfileWeight(profile, key, weight) {
  if (!weight || weight <= 0) {
    return;
  }

  profile.set(key, (profile.get(key) ?? 0) + weight);
}

function getExploreEntityProfile(entity) {
  const profile = new Map();

  if (entity.kind === "specialty") {
    questions.forEach((question) => {
      addExploreProfileWeight(profile, getExploreProfileKey(question.id, "yes"), question.yes?.[entity.id]);
      addExploreProfileWeight(profile, getExploreProfileKey(question.id, "no"), question.no?.[entity.id]);
    });

    return profile;
  }

  entity.signals?.forEach((signal) => {
    addExploreProfileWeight(profile, getExploreProfileKey(signal.questionId, signal.answer), signal.weight);
  });

  return profile;
}

function getExploreProfileNorm(profile) {
  let total = 0;
  profile.forEach((weight) => {
    total += weight * weight;
  });

  return Math.sqrt(total);
}

function getExploreProfileSimilarity(left, right) {
  if (!left.profileNorm || !right.profileNorm) {
    return 0;
  }

  const smaller = left.profile.size <= right.profile.size ? left.profile : right.profile;
  const larger = smaller === left.profile ? right.profile : left.profile;
  let dot = 0;

  smaller.forEach((weight, key) => {
    dot += weight * (larger.get(key) ?? 0);
  });

  return dot / (left.profileNorm * right.profileNorm);
}

function getStableHash(value) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function getStableUnit(value) {
  return getStableHash(value) / 4294967295;
}

function normalizeExploreVector(vector, fallbackId) {
  const magnitude = Math.hypot(vector.x, vector.y);

  if (magnitude > 0.001) {
    return { x: vector.x / magnitude, y: vector.y / magnitude };
  }

  const fallbackAngle = getStableUnit(`fallback:${fallbackId}`) * Math.PI * 2;
  return { x: Math.cos(fallbackAngle), y: Math.sin(fallbackAngle) };
}

function getExploreRuleVector(questionId, answer) {
  const isYes = answer === "yes";
  const direct = (yesVector, noVector = { x: -yesVector.x, y: -yesVector.y }) => (
    isYes ? yesVector : noVector
  );

  if (["continuity-brief-encounters", "continuity-follow-up", "panel-management", "long-term-trust", "chronic-vs-episodic", "treatment-over-time", "panel-over-cases", "continuity"].includes(questionId)) {
    return direct({ x: -0.78, y: 0.62 }, { x: 0.52, y: -0.34 });
  }

  if (["continuity-fresh-cases", "avoiding-large-panel", "clear-shifts"].includes(questionId)) {
    return direct({ x: 0.46, y: -0.34 }, { x: -0.62, y: 0.5 });
  }

  if (["communication-over-procedures", "longer-conversations", "listening-as-tool", "context-outside-clinic", "conversation-based-care"].includes(questionId)) {
    return direct({ x: -0.84, y: 0.48 }, { x: 0.72, y: -0.18 });
  }

  if (["caregiver-role", "children-large-share", "adult-and-children", "keep-adult-peds-open"].includes(questionId)) {
    return direct({ x: -0.44, y: 0.48 }, { x: 0.12, y: -0.14 });
  }

  if (["mostly-adults", "complex-hospitalized-adults"].includes(questionId)) {
    return direct({ x: -0.04, y: -0.34 }, { x: -0.22, y: 0.36 });
  }

  if (["routine-preventive-care", "community-generalist", "broad-vs-narrow-alt"].includes(questionId)) {
    return direct({ x: -0.74, y: 0.58 }, { x: 0.64, y: -0.08 });
  }

  if (["miss-operating-room", "operating-room", "perioperative-vs-clinic", "acute-teamwork", "large-operations"].includes(questionId)) {
    return direct({ x: 0.86, y: -0.68 }, { x: -0.34, y: 0.5 });
  }

  if (["hands-doing-the-work", "procedural-vs-medical", "immediate-physical-result", "manual-skill", "procedures"].includes(questionId)) {
    return direct({ x: 0.88, y: -0.2 }, { x: -0.62, y: 0.34 });
  }

  if (["clinic-with-procedures", "office-procedures-balance", "mixed-clinic-procedures", "focused-outpatient-procedures", "fine-motor-precision"].includes(questionId)) {
    return direct({ x: 0.78, y: 0.34 }, { x: -0.44, y: -0.02 });
  }

  if (["regular-urgency", "quick-decisions", "call-worth-it", "nights-weekends", "wards-vs-clinic", "hospital-vs-office"].includes(questionId)) {
    return direct({ x: 0.26, y: -0.82 }, { x: -0.18, y: 0.72 });
  }

  if (["clinic-vs-hospital", "outpatient-most-days", "predictability-priority", "low-emergencies"].includes(questionId)) {
    return direct({ x: -0.08, y: 0.86 }, { x: 0.24, y: -0.76 });
  }

  if (["consultant-expertise", "consultant-handoffs", "focused-expertise", "consults-over-panel", "interpretation-for-others"].includes(questionId)) {
    return direct({ x: 0.42, y: -0.06 }, { x: -0.58, y: 0.5 });
  }

  if (["diagnostic-workup", "diagnostic-puzzle", "uncertainty-tolerance", "long-workups", "pathophysiology-draw", "physiology", "multimorbidity", "anatomic-localization"].includes(questionId)) {
    return direct({ x: -0.2, y: -0.26 }, { x: 0.18, y: 0.28 });
  }

  if (["subtle-patterns", "images-and-data", "microscope-over-bedside", "close-visual-detail", "visual-patterns", "interpretation-over-procedures", "certainty-over-ambiguity", "away-from-bedside"].includes(questionId)) {
    return direct({ x: 0.52, y: 0.04 }, { x: -0.44, y: 0.18 });
  }

  if (["pregnancy-and-repro", "labor-delivery-draw", "women-health"].includes(questionId)) {
    return direct({ x: 0.46, y: -0.28 }, { x: -0.32, y: 0.22 });
  }

  if (["recovery-over-stabilization", "function-over-diagnosis", "function-over-operation", "function-rehab", "rehab-team-draw", "disability-and-qol", "sports-and-return", "musculoskeletal-interest", "fracture-biomechanics"].includes(questionId)) {
    return direct({ x: 0.16, y: 0.78 }, { x: 0.36, y: -0.52 });
  }

  if (["sensory-systems", "head-and-neck-interest", "ent-content", "preserve-vision", "urologic-problems", "genitourinary-interest", "body-region-expert", "focused-outpatient-procedures"].includes(questionId)) {
    return direct({ x: 0.7, y: 0.24 }, { x: -0.5, y: 0.08 });
  }

  return null;
}

function getExploreSemanticVector(profileKey) {
  const [questionId, answer] = profileKey.split(":");

  if (!questionId || !answer) {
    return null;
  }

  return getExploreRuleVector(questionId, answer);
}

function blendExploreProjection(primary, secondary, primaryWeight = 0.72) {
  if (!secondary) {
    return primary;
  }

  return normalizeExploreVector({
    x: (primary.x * primaryWeight) + (secondary.x * (1 - primaryWeight)),
    y: (primary.y * primaryWeight) + (secondary.y * (1 - primaryWeight)),
  }, "blend");
}

function getExploreProfileProjection(profile, id) {
  let x = 0;
  let y = 0;
  let semanticWeight = 0;

  profile.forEach((weight, key) => {
    const semanticVector = getExploreSemanticVector(key);

    if (semanticVector) {
      x += semanticVector.x * weight;
      y += semanticVector.y * weight;
      semanticWeight += weight;
      return;
    }

    const angle = getStableUnit(`profile:${key}`) * Math.PI * 2;
    x += Math.cos(angle) * weight * 0.18;
    y += Math.sin(angle) * weight * 0.18;
  });

  if (semanticWeight > 0 || Math.hypot(x, y) > 0.001) {
    return normalizeExploreVector({ x, y }, id);
  }

  return normalizeExploreVector({ x: 0, y: 0 }, id);
}

function getExploreSimilarityEdges(nodes, neighborLimit = 5, threshold = 0.24) {
  const neighborsById = new Map(nodes.map((node) => [node.id, []]));

  for (let leftIndex = 0; leftIndex < nodes.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < nodes.length; rightIndex += 1) {
      const left = nodes[leftIndex];
      const right = nodes[rightIndex];
      const similarity = getExploreProfileSimilarity(left, right);

      if (similarity < threshold) {
        continue;
      }

      neighborsById.get(left.id).push({ node: right, similarity });
      neighborsById.get(right.id).push({ node: left, similarity });
    }
  }

  const edgeMap = new Map();
  nodes.forEach((node) => {
    const neighbors = neighborsById.get(node.id)
      .sort((left, right) => right.similarity - left.similarity)
      .slice(0, neighborLimit);

    neighbors.forEach(({ node: neighbor, similarity }) => {
      const ids = [node.id, neighbor.id].sort();
      const key = ids.join("::");
      const existing = edgeMap.get(key);

      if (!existing || similarity > existing.similarity) {
        edgeMap.set(key, {
          sourceId: ids[0],
          targetId: ids[1],
          similarity,
          color: node.kind === "specialty" ? node.color : neighbor.color,
        });
      }
    });
  });

  return [...edgeMap.values()].sort((left, right) => right.similarity - left.similarity);
}

function getExploreParentEdges(fellowshipNodes) {
  return fellowshipNodes.map((node) => ({
    sourceId: node.parentId,
    targetId: node.id,
    color: node.color,
  }));
}

function runExploreForceLayout(nodes, similarityEdges, parentEdges, width, height) {
  const nodeMap = Object.fromEntries(nodes.map((node) => [node.id, node]));
  const layoutEdges = [
    ...similarityEdges.map((edge) => ({
      ...edge,
      strength: 0.018 + (edge.similarity * 0.018),
      targetDistance: 110 + ((1 - edge.similarity) * 260),
    })),
    ...parentEdges.map((edge) => ({
      ...edge,
      strength: 0.005,
      targetDistance: 190,
    })),
  ];
  const centerX = width / 2;
  const centerY = height / 2;
  const padding = 88;

  nodes.forEach((node) => {
    node.vx = 0;
    node.vy = 0;
  });

  for (let iteration = 0; iteration < 180; iteration += 1) {
    const alpha = 1 - (iteration / 180);

    for (let leftIndex = 0; leftIndex < nodes.length; leftIndex += 1) {
      for (let rightIndex = leftIndex + 1; rightIndex < nodes.length; rightIndex += 1) {
        const left = nodes[leftIndex];
        const right = nodes[rightIndex];
        let dx = right.x - left.x;
        let dy = right.y - left.y;
        let distanceSquared = (dx * dx) + (dy * dy);

        if (distanceSquared < 0.01) {
          const angle = getStableUnit(`${left.id}:${right.id}`) * Math.PI * 2;
          dx = Math.cos(angle);
          dy = Math.sin(angle);
          distanceSquared = 1;
        }

        const distance = Math.sqrt(distanceSquared);
        const minDistance = left.radius + right.radius + 42;
        const charge = (left.kind === "specialty" || right.kind === "specialty") ? 5200 : 3900;
        const repulsion = Math.min(2.4, charge / distanceSquared) * alpha;
        const overlapPush = distance < minDistance ? (minDistance - distance) * 0.08 : 0;
        const force = repulsion + overlapPush;
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;

        left.vx -= fx;
        left.vy -= fy;
        right.vx += fx;
        right.vy += fy;
      }
    }

    layoutEdges.forEach((edge) => {
      const source = nodeMap[edge.sourceId];
      const target = nodeMap[edge.targetId];

      if (!source || !target) {
        return;
      }

      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const distance = Math.max(1, Math.hypot(dx, dy));
      const force = (distance - edge.targetDistance) * edge.strength * alpha;
      const fx = (dx / distance) * force;
      const fy = (dy / distance) * force;

      source.vx += fx;
      source.vy += fy;
      target.vx -= fx;
      target.vy -= fy;
    });

    nodes.forEach((node) => {
      node.vx += (centerX - node.x) * 0.0007 * alpha;
      node.vy += (centerY - node.y) * 0.0007 * alpha;
      node.vx += (node.anchorX - node.x) * (node.kind === "specialty" ? 0.006 : 0.0045) * alpha;
      node.vy += (node.anchorY - node.y) * (node.kind === "specialty" ? 0.006 : 0.0045) * alpha;
      node.vx *= 0.76;
      node.vy *= 0.76;
      node.x = Math.min(width - padding, Math.max(padding, node.x + node.vx));
      node.y = Math.min(height - padding, Math.max(padding, node.y + node.vy));
    });
  }

  nodes.forEach((node) => {
    delete node.vx;
    delete node.vy;
  });
}

function fitExploreNodesToCanvas(nodes, width, height) {
  if (nodes.length === 0) {
    return;
  }

  const padding = 96;
  const minX = Math.min(...nodes.map((node) => node.x));
  const maxX = Math.max(...nodes.map((node) => node.x));
  const minY = Math.min(...nodes.map((node) => node.y));
  const maxY = Math.max(...nodes.map((node) => node.y));
  const currentWidth = Math.max(1, maxX - minX);
  const currentHeight = Math.max(1, maxY - minY);
  const scale = Math.min(
    1.28,
    (width - (padding * 2)) / currentWidth,
    (height - (padding * 2)) / currentHeight
  );
  const sourceCenterX = (minX + maxX) / 2;
  const sourceCenterY = (minY + maxY) / 2;
  const targetCenterX = width / 2;
  const targetCenterY = height / 2;

  nodes.forEach((node) => {
    node.x = targetCenterX + ((node.x - sourceCenterX) * scale);
    node.y = targetCenterY + ((node.y - sourceCenterY) * scale);
  });
}

function buildExploreLayoutData(specialtyResults, fellowshipResults) {
  const width = EXPLORE_CANVAS_BASE_WIDTH;
  const height = EXPLORE_CANVAS_BASE_HEIGHT;
  const centerX = width / 2;
  const centerY = height / 2;
  const projectionScaleX = width * 0.38;
  const projectionScaleY = height * 0.36;
  const createExploreNode = (item, projection) => {
    const profile = getExploreEntityProfile(item);
    const jitterAngle = getStableUnit(`node:${item.id}`) * Math.PI * 2;
    const jitterDistance = 24 + (getStableUnit(`distance:${item.id}`) * 42);
    const anchorX = centerX + (projection.x * projectionScaleX);
    const anchorY = centerY + (projection.y * projectionScaleY);

    return {
      ...item,
      profile,
      profileNorm: getExploreProfileNorm(profile),
      projection,
      anchorX,
      anchorY,
      x: anchorX + (Math.cos(jitterAngle) * jitterDistance),
      y: anchorY + (Math.sin(jitterAngle) * jitterDistance),
      radius: item.kind === "specialty"
        ? 18 + (item.normalized * 0.06)
        : 10 + (item.normalized * 0.035),
    };
  };
  const specialtyProjectionById = {};
  const specialtyNodes = specialtyResults.map((item) => {
    const profile = getExploreEntityProfile(item);
    const projection = getExploreProfileProjection(profile, item.id);
    specialtyProjectionById[item.id] = projection;

    return createExploreNode(item, projection);
  });
  const fellowshipNodes = fellowshipResults.map((item) => {
    const profile = getExploreEntityProfile(item);
    const profileProjection = getExploreProfileProjection(profile, item.id);
    const projection = blendExploreProjection(profileProjection, specialtyProjectionById[item.parentId], 0.72);

    return createExploreNode(item, projection);
  });
  const nodes = [...specialtyNodes, ...fellowshipNodes];
  const similarityEdges = getExploreSimilarityEdges(nodes);
  const parentEdges = getExploreParentEdges(fellowshipNodes);

  runExploreForceLayout(nodes, similarityEdges, parentEdges, width, height);
  fitExploreNodesToCanvas(nodes, width, height);

  return {
    width,
    height,
    nodes,
    specialtyNodes,
    fellowshipNodes,
    similarityEdges,
    parentEdges,
    nodeMap: Object.fromEntries(nodes.map((node) => [node.id, node])),
  };
}

function getDefaultExploreSelection(specialtyResults) {
  return specialtyResults[0]?.id ?? specialties[0].id;
}

function getExploreLocationNode(specialtyResults, nodeMap) {
  if (countExplicitAnswers() === 0) {
    return null;
  }

  const currentSpecialty = specialtyResults.find((item) => item.raw > 0 && item.fitPercent > 0);

  if (!currentSpecialty) {
    return null;
  }

  return nodeMap[currentSpecialty.id] ?? null;
}

function getExploreCollections() {
  const specialtyResults = getScoreData();
  const baseFellowshipResults = getFellowshipScoreData(specialtyResults);
  const fellowshipResults = state.fellowshipDisplayMode === "separate"
    ? getIndependentFellowshipScoreData(baseFellowshipResults)
    : baseFellowshipResults;

  return {
    specialtyResults,
    fellowshipResults,
    specialtyResultMap: Object.fromEntries(specialtyResults.map((item) => [item.id, item])),
    fellowshipResultMap: Object.fromEntries(fellowshipResults.map((item) => [item.id, item])),
  };
}

function getExploreNearbyNodes(selectedEntity, nodes, limit = 5) {
  return nodes
    .filter((node) => node.id !== selectedEntity.id)
    .map((node) => ({
      node,
      similarity: getExploreProfileSimilarity(selectedEntity, node),
    }))
    .filter((match) => match.similarity > 0)
    .sort((left, right) => {
      if (right.similarity !== left.similarity) {
        return right.similarity - left.similarity;
      }

      return left.node.name.localeCompare(right.node.name);
    })
    .slice(0, limit);
}

function renderExploreInspector(selectedEntity, nodes) {
  if (!selectedEntity) {
    return;
  }

  const nearbyNodes = getExploreNearbyNodes(selectedEntity, nodes);
  const nearbyMarkup = nearbyNodes.length > 0
    ? nearbyNodes.map(({ node }) => createPathButton(node, true)).join("")
    : '<p class="explore-inspector__empty">Nearby profiles will appear once the graph has enough profile overlap to compare.</p>';
  const compareId = selectedEntity.id;

  exploreCompareButton.classList.remove("hidden");
  exploreCompareButton.dataset.compareId = compareId;

  if (selectedEntity.kind === "specialty") {
    exploreNodeType.textContent = "Specialty";
    exploreNodeTitle.textContent = selectedEntity.name;
    exploreNodeBlurb.textContent = selectedEntity.blurb;
    exploreNodeScore.textContent = `${selectedEntity.fitPercent}%`;
    exploreNodeParent.textContent = "Standalone specialty";
    exploreNodeNotes.innerHTML = (selectedEntity.reasons.length > 0
      ? selectedEntity.reasons
      : [{ explanation: "This node strengthens when your answers keep this home specialty consistently high across the prompt bank." }])
      .slice(0, 3)
      .map((reason) => `<li>${reason.explanation}</li>`)
      .join("");
    exploreNodeConnections.innerHTML = nearbyMarkup;
    return;
  }

  exploreNodeType.textContent = "Fellowship path";
  exploreNodeTitle.textContent = selectedEntity.name;
  exploreNodeBlurb.textContent = selectedEntity.blurb;
  exploreNodeScore.textContent = `${selectedEntity.fitPercent}%`;
  exploreNodeParent.textContent = selectedEntity.parentName;
  exploreNodeNotes.innerHTML = (selectedEntity.reasons.length > 0
    ? selectedEntity.reasons
    : selectedEntity.signals
        .slice(0, 3)
        .map((signal) => ({ explanation: buildFellowshipSignalLine(signal.label) })))
    .slice(0, 3)
    .map((reason) => `<li>${reason.explanation}</li>`)
    .join("");
  exploreNodeConnections.innerHTML = nearbyMarkup;
}

function buildExploreLocationMarker(node, width, height) {
  if (!node) {
    return "";
  }

  const bubbleWidth = 124;
  const bubbleHeight = 34;
  const bubbleX = clamp(node.x - (bubbleWidth / 2), 20, width - bubbleWidth - 20);
  const bubbleY = clamp(node.y - node.radius - 82, 20, height - bubbleHeight - 20);
  const bubbleCenterX = bubbleX + (bubbleWidth / 2);
  const bubbleBottomY = bubbleY + bubbleHeight;
  const ringRadius = node.radius + 13;
  const pinRadius = Math.max(5, Math.min(8, node.radius * 0.34));
  const pointerStartY = node.y - node.radius - 9;

  return `
    <g class="explore-you-are-here" aria-hidden="true">
      <circle class="explore-you-are-here__halo" cx="${node.x}" cy="${node.y}" r="${ringRadius}"></circle>
      <circle class="explore-you-are-here__pin" cx="${node.x}" cy="${node.y}" r="${pinRadius}"></circle>
      <path
        class="explore-you-are-here__leader"
        d="M ${node.x} ${pointerStartY} C ${node.x} ${pointerStartY - 18}, ${bubbleCenterX} ${bubbleBottomY + 18}, ${bubbleCenterX} ${bubbleBottomY}"
      ></path>
      <rect
        class="explore-you-are-here__label-bg"
        x="${bubbleX}"
        y="${bubbleY}"
        width="${bubbleWidth}"
        height="${bubbleHeight}"
        rx="${bubbleHeight / 2}"
      ></rect>
      <text class="explore-you-are-here__label" x="${bubbleCenterX}" y="${bubbleY + 22}">You are here</text>
    </g>
  `;
}

function renderExploreView() {
  const { specialtyResults, fellowshipResults, specialtyResultMap, fellowshipResultMap } = getExploreCollections();
  const selectedEntity = specialtyResultMap[selectedExploreId] || fellowshipResultMap[selectedExploreId];

  if (!selectedEntity) {
    selectedExploreId = getDefaultExploreSelection(specialtyResults);
  }

  const activeEntity = specialtyResultMap[selectedExploreId] || fellowshipResultMap[selectedExploreId];
  const {
    width,
    height,
    nodes,
    specialtyNodes,
    fellowshipNodes,
    similarityEdges,
    parentEdges,
    nodeMap,
  } = buildExploreLayoutData(specialtyResults, fellowshipResults);
  const activeNode = nodeMap[selectedExploreId] || activeEntity;
  const locationNode = getExploreLocationNode(specialtyResults, nodeMap);
  const selectedSimilarIds = new Set(
    similarityEdges
      .filter((edge) => edge.sourceId === selectedExploreId || edge.targetId === selectedExploreId)
      .flatMap((edge) => [edge.sourceId, edge.targetId])
  );
  const isSelected = (node) => node.id === selectedExploreId;
  const isConnected = (node) => {
    if (node.id === selectedExploreId) {
      return true;
    }

    if (selectedSimilarIds.has(node.id)) {
      return true;
    }

    const selectedFellowship = fellowshipResultMap[selectedExploreId];
    return selectedFellowship?.parentId === node.id;
  };

  const parentLinkMarkup = parentEdges.map((edge) => {
    const source = nodeMap[edge.sourceId];
    const target = nodeMap[edge.targetId];
    const selected = edge.targetId === selectedExploreId
      || (edge.sourceId === selectedExploreId && selectedSimilarIds.has(edge.targetId));

    if (!source || !target) {
      return "";
    }

    return `
      <line
        class="explore-link explore-link--parent ${selected ? "explore-link--selected" : ""}"
        x1="${source.x}"
        y1="${source.y}"
        x2="${target.x}"
        y2="${target.y}"
        style="--link-color: ${edge.color}; --link-opacity: ${selected ? 0.42 : 0.08};"
      ></line>
    `;
  }).join("");

  const similarityLinkMarkup = similarityEdges.map((edge) => {
    const source = nodeMap[edge.sourceId];
    const target = nodeMap[edge.targetId];
    const selected = edge.sourceId === selectedExploreId || edge.targetId === selectedExploreId;

    if (!source || !target) {
      return "";
    }

    return `
      <line
        class="explore-link explore-link--profile ${selected ? "explore-link--selected" : ""}"
        x1="${source.x}"
        y1="${source.y}"
        x2="${target.x}"
        y2="${target.y}"
        style="--link-color: ${edge.color}; --link-opacity: ${selected ? 0.62 : 0.13};"
      ></line>
    `;
  }).join("");

  const specialtyMarkup = specialtyNodes.map((node) => `
    <g
      class="explore-node explore-node--specialty ${isSelected(node) ? "explore-node--selected" : ""} ${isConnected(node) ? "explore-node--connected" : ""}"
      data-explore-id="${node.id}"
      tabindex="0"
      role="button"
      aria-label="${node.name}"
      style="--node-color: ${node.color}; --node-opacity: ${Math.max(0.38, node.normalized / 100)};"
    >
      <circle cx="${node.x}" cy="${node.y}" r="${node.radius}"></circle>
      ${buildExploreTextMarkup(node.shortLabel, node.x, node.y + node.radius + 18, "explore-node__label explore-node__label--specialty")}
    </g>
  `).join("");
  const fellowshipMarkup = fellowshipNodes.map((node) => `
    <g
      class="explore-node explore-node--fellowship ${isSelected(node) ? "explore-node--selected" : ""} ${isConnected(node) ? "explore-node--connected" : ""}"
      data-explore-id="${node.id}"
      tabindex="0"
      role="button"
      aria-label="${node.name}"
      style="--node-color: ${node.color}; --node-opacity: ${Math.max(0.24, node.normalized / 100)};"
    >
      <circle cx="${node.x}" cy="${node.y}" r="${node.radius}"></circle>
      ${buildExploreTextMarkup(node.shortLabel, node.x, node.y + node.radius + 16, "explore-node__label")}
    </g>
  `).join("");
  const locationMarkup = buildExploreLocationMarker(locationNode, width, height);

  exploreCanvas.setAttribute("viewBox", `0 0 ${width} ${height}`);
  exploreCanvasBaseWidth = width;
  exploreCanvasBaseHeight = height;
  exploreCanvas.innerHTML = `${parentLinkMarkup}${similarityLinkMarkup}${specialtyMarkup}${fellowshipMarkup}${locationMarkup}`;
  syncExploreZoomControls();
  renderExploreInspector(activeNode, nodes);
}

function isResultsActive() {
  return state.started && (state.resultsPreview || state.currentIndex >= questions.length);
}

function syncRankPanelVisibility() {
  const isResultsScreen = isResultsActive();
  const primaryToolActive = !compareView.classList.contains("hidden") || !exploreView.classList.contains("hidden");
  const isAvailable = state.started && !isResultsScreen && !primaryToolActive;
  const isVisible = isAvailable && !state.rankPanelCollapsed;
  rankPanel.classList.toggle("hidden", !state.started || primaryToolActive);
  rankPanel.classList.toggle("rank-panel--collapsed", state.started && !isVisible);
  appGrid.classList.toggle("app-grid--with-rank-panel", state.started && !primaryToolActive);
  appGrid.classList.toggle("app-grid--ranked", isVisible);
  rankToggleButton.classList.toggle("hidden", !isAvailable || isVisible);
  rankToggleButton.setAttribute("aria-expanded", String(isVisible));
  rankToggleButton.setAttribute("aria-label", isVisible ? "Hide specialty ranking" : "Show specialty ranking");
  rankToggleButton.setAttribute("title", isVisible ? "Hide specialty ranking" : "Show specialty ranking");
  rankPanel.setAttribute("aria-hidden", String(!isVisible));

  if ("inert" in rankPanel) {
    rankPanel.inert = !isVisible;
  }
}

function countAnswered() {
  return state.responses.filter((response) => response !== null).length;
}

function countSkipped() {
  return state.responses.filter((response) => response === "skip").length;
}

function countExplicitAnswers() {
  return state.responses.filter((response) => response === "yes" || response === "no").length;
}

function getSpecificityLabel(answeredCount) {
  if (answeredCount === 0) {
    return "Broad signal";
  }

  if (answeredCount < 6) {
    return "Early signal";
  }

  if (answeredCount < 16) {
    return "Taking shape";
  }

  if (answeredCount < 32) {
    return "More specific";
  }

  return "Highly specific";
}

function updateProgress() {
  const answered = countExplicitAnswers();
  const specificityPercent = clamp(Math.round((answered / 40) * 100), 0, 100);
  const answerNoun = answered === 1 ? "answer" : "answers";

  progressLabel.textContent = answered === 0
    ? "No answers yet"
    : `${answered} ${answerNoun} shaping the signal`;

  progressPercent.textContent = getSpecificityLabel(answered);
  progressFill.style.width = `${specificityPercent}%`;
}

function getRankingStage(answeredCount) {
  if (answeredCount === 0) {
    return {
      summary: "Answer any prompt to start forming a ranking.",
      maxItems: 0,
      showLeader: false,
      showReasons: false,
    };
  }

  if (answeredCount < 6) {
    return {
      summary: "This is a broad early signal. The order will move around as more answers come in.",
      maxItems: 4,
      showLeader: false,
      showReasons: false,
    };
  }

  if (answeredCount < 16) {
    return {
      summary: "The ranking is starting to take shape. The top group is usually more useful than any one exact position right now.",
      maxItems: 5,
      showLeader: true,
      showReasons: false,
    };
  }

  if (answeredCount < 32) {
    return {
      summary: "More answers are adding specificity. Closely related fields may still trade places.",
      maxItems: 5,
      showLeader: true,
      showReasons: true,
    };
  }

  return {
    summary: "The signal is highly specific now. Additional answers can still refine close calls and fellowship paths.",
    maxItems: 6,
    showLeader: true,
    showReasons: true,
  };
}

function createRankItem(item, index) {
  return `
    <article class="rank-item ${index === 0 ? "rank-item--top" : ""}">
      <div class="rank-item__top">
        <span class="rank-item__index">${index + 1}</span>
        <p class="rank-item__name">${item.name}</p>
        <span class="rank-item__score">${item.normalized}%</span>
      </div>
      <div class="rank-item__track" aria-hidden="true">
        <div class="rank-item__fill" style="width: ${item.normalized}%"></div>
      </div>
    </article>
  `;
}

function renderRankPanel() {
  if (!state.started) {
    syncRankPanelVisibility();
    return;
  }

  syncRankPanelVisibility();

  const answeredCount = countExplicitAnswers();
  const skippedCount = countSkipped();
  const stage = getRankingStage(answeredCount);
  const ranked = getScoreData();
  const fellowshipResults = getFellowshipScoreData(ranked);
  const positiveRanked = ranked.filter((item) => item.raw > 0);
  const displayed = stage.maxItems === 0
    ? []
    : (positiveRanked.length > 0 ? positiveRanked : ranked).slice(0, stage.maxItems);

  rankSummary.textContent = skippedCount > 0
    ? `${stage.summary} Skipped prompts stay out of the signal.`
    : stage.summary;

  if (displayed.length === 0) {
    rankList.innerHTML = '<div class="rank-panel__empty">No ranking yet. Once you answer a prompt, the list will start to take shape here.</div>';
    rankLeader.classList.add("hidden");
    rankDetail.classList.add("hidden");
    rankPathDetail.classList.add("hidden");
    return;
  }

  rankList.innerHTML = displayed.map((item, index) => createRankItem(item, index)).join("");

  if (stage.showLeader) {
    rankLeader.classList.remove("hidden");
    rankLeaderName.textContent = displayed[0].name;
    rankLeaderBlurb.textContent = displayed[0].blurb;
  } else {
    rankLeader.classList.add("hidden");
  }

  if (stage.showReasons && displayed[0].reasons.length > 0) {
    rankDetail.classList.remove("hidden");
    rankDetailLabel.textContent = answeredCount >= 24
      ? "What is shaping the current leader"
      : "What is starting to shape the current leader";
    rankReasons.innerHTML = displayed[0].reasons
      .slice(0, answeredCount >= 24 ? 3 : 2)
      .map((reason) => `<li>${reason.explanation}</li>`)
      .join("");
  } else {
    rankDetail.classList.add("hidden");
  }

  const leaderPaths = state.fellowshipDisplayMode === "separate"
    ? getIndependentFellowshipScoreData(fellowshipResults)
        .filter((path) => path.adjusted > 0 && path.matchedWeight > 0)
        .slice(0, 3)
    : getTopFellowshipsForSpecialty(displayed[0].id, 3, fellowshipResults);

  if (answeredCount >= 6 && leaderPaths.length > 0) {
    rankPathDetail.classList.remove("hidden");
    rankPathTitle.textContent = state.fellowshipDisplayMode === "separate"
      ? "Top fellowship paths"
      : "Fellowship paths nearby";
    rankPathList.innerHTML = leaderPaths.map((path) => createPathButton(path, true)).join("");
  } else {
    rankPathDetail.classList.add("hidden");
  }
}

function showStartState() {
  state.started = false;
  state.rankPanelCollapsed = true;
  state.resultsPreview = false;
  state.questionOrder = buildQuestionOrder(state.orderMode);
  startView.classList.remove("hidden");
  progressWrap.classList.add("hidden");
  questionView.classList.add("hidden");
  resultsView.classList.add("hidden");
  restartTop.classList.add("hidden");
  setSettingsModalOpen(false);
  setShareModalOpen(false);
  hideCompareView();
  hideExploreView();
  syncRankPanelVisibility();
  updateProgress();
  scrollPageToTop();
}

function startQuiz() {
  state.started = true;
  state.rankPanelCollapsed = true;
  state.resultsPreview = false;
  state.questionOrder = buildQuestionOrder(state.orderMode);
  setInfoModalOpen(false);
  setSettingsModalOpen(false);
  setShareModalOpen(false);
  hideCompareView();
  hideExploreView();
  startView.classList.add("hidden");
  progressWrap.classList.remove("hidden");
  restartTop.classList.remove("hidden");
  syncRankPanelVisibility();
  renderQuestion();
  scrollPageToTop();
}

function renderQuestion() {
  if (!state.started) {
    return;
  }

  updateProgress();

  if (state.currentIndex >= questions.length) {
    state.resultsPreview = true;
    showResults();
    return;
  }

  state.resultsPreview = false;
  const currentQuestionIndex = state.questionOrder[state.currentIndex];
  const currentQuestion = questions[currentQuestionIndex];
  const currentResponse = state.responses[currentQuestionIndex];
  questionCategory.textContent = currentQuestion.category;
  questionText.textContent = currentQuestion.text;
  questionSupport.textContent = currentQuestion.support;
  backButton.disabled = state.currentIndex === 0;
  backButton.style.opacity = state.currentIndex === 0 ? "0.5" : "1";
  syncCurrentResponseControls(currentResponse);

  startView.classList.add("hidden");
  progressWrap.classList.remove("hidden");
  hideCompareView();
  hideExploreView();
  questionView.classList.remove("hidden");
  resultsView.classList.add("hidden");
  renderRankPanel();
  scrollPageToTop();
}

function getDirectionalSpecialtySignal(question, specialtyId, response) {
  if (response !== "yes" && response !== "no") {
    return {
      selectedWeight: 0,
      oppositeWeight: 0,
      earnedWeight: 0,
      possibleWeight: 0,
    };
  }

  const oppositeResponse = response === "yes" ? "no" : "yes";
  const selectedWeight = question[response][specialtyId] || 0;
  const oppositeWeight = question[oppositeResponse][specialtyId] || 0;

  return {
    selectedWeight,
    oppositeWeight,
    earnedWeight: Math.max(0, selectedWeight - oppositeWeight),
    possibleWeight: Math.abs(selectedWeight - oppositeWeight),
  };
}

function getScoreData() {
  const explicitAnswers = countExplicitAnswers();
  const scores = Object.fromEntries(specialties.map((specialty) => [specialty.id, 0]));
  const possibleScores = Object.fromEntries(specialties.map((specialty) => [specialty.id, 0]));
  const signalCounts = Object.fromEntries(specialties.map((specialty) => [specialty.id, 0]));
  const reasons = Object.fromEntries(specialties.map((specialty) => [specialty.id, []]));

  questions.forEach((question, index) => {
    const response = state.responses[index];
    if (response !== "yes" && response !== "no") {
      return;
    }

    specialties.forEach(({ id }) => {
      const signal = getDirectionalSpecialtySignal(question, id, response);

      if (signal.possibleWeight > 0) {
        possibleScores[id] += signal.possibleWeight;
        signalCounts[id] += 1;
      }

      if (signal.earnedWeight > 0) {
        scores[id] += signal.earnedWeight;
        reasons[id].push({
          weight: signal.earnedWeight,
          explanation: buildReasonLine(question, response, signal.earnedWeight),
        });
      }
    });
  });

  const ranked = specialties
    .map((specialty) => {
      const raw = scores[specialty.id];
      const possible = possibleScores[specialty.id];
      const adjusted = possible > 0 ? raw / possible : 0;
      const reasonList = reasons[specialty.id]
        .sort((left, right) => right.weight - left.weight)
        .slice(0, 3);

      return {
        ...specialty,
        raw,
        possible,
        adjusted,
        signalCount: signalCounts[specialty.id],
        reasons: reasonList,
      };
    })
    .sort((left, right) => {
      if (right.adjusted !== left.adjusted) {
        return right.adjusted - left.adjusted;
      }

      if (right.raw !== left.raw) {
        return right.raw - left.raw;
      }

      return left.name.localeCompare(right.name);
    });

  const topAdjusted = Math.max(ranked[0]?.adjusted ?? 0, 0.0001);
  return ranked.map((specialty) => ({
    ...specialty,
    fitPercent: explicitAnswers === 0 ? 0 : Math.round(specialty.adjusted * 100),
    normalized: explicitAnswers === 0 ? 0 : Math.round((specialty.adjusted / topAdjusted) * 100),
  }));
}

function buildReasonLine(question, response, weight) {
  const direction = response === "yes" ? "You leaned toward" : "You leaned away from";
  const strength = weight >= 5 ? "strongly" : weight >= 3 ? "clearly" : "slightly";
  return `${direction} "${question.text}" and that ${strength} supports this fit.`;
}

function getConfidenceLabel(scoreGap, answeredCount) {
  if (answeredCount < 6) {
    return "Very early";
  }

  if (answeredCount < 15) {
    return scoreGap >= 14 ? "Beginning to separate" : "Still early";
  }

  if (scoreGap >= 18) {
    return "Clear separation";
  }

  if (scoreGap >= 10) {
    return "Moderate separation";
  }

  return "Close grouping";
}

function showResults() {
  state.resultsPreview = true;
  const ranked = getScoreData();
  const fellowshipResults = getFellowshipScoreData(ranked);
  const explicitAnswers = countExplicitAnswers();
  const skippedCount = countSkipped();
  const unansweredEverything = explicitAnswers === 0;
  const showSeparateFellowships = state.fellowshipDisplayMode === "separate";
  const topResults = ranked.filter((item) => item.raw > 0).slice(0, 4);
  const displayedResults = topResults.length > 0 ? topResults : ranked.slice(0, 4);
  const independentFellowshipResults = getIndependentFellowshipScoreData(fellowshipResults);
  const displayedFellowships = independentFellowshipResults
    .filter((path) => path.adjusted > 0 && path.matchedWeight > 0)
    .slice(0, 6);
  const leadItems = showSeparateFellowships && displayedFellowships.length > 0
    ? displayedFellowships
    : displayedResults;
  const leadGap = leadItems[1]
    ? leadItems[0].normalized - leadItems[1].normalized
    : leadItems[0].normalized;
  const confidence = getConfidenceLabel(leadGap, explicitAnswers);

  startView.classList.add("hidden");
  progressWrap.classList.remove("hidden");
  questionView.classList.add("hidden");
  hideCompareView();
  hideExploreView();
  resultsView.classList.remove("hidden");
  state.rankPanelCollapsed = true;
  restartTop.classList.remove("hidden");
  updateProgress();
  renderRankPanel();
  updateFellowshipDisplayControls();
  continueQuizButton.classList.toggle("hidden", state.currentIndex >= questions.length);
  scrollPageToTop();

  const summaryBits = [];
  resultsTitle.textContent = showSeparateFellowships
    ? "Fellowship paths suggested by your answers"
    : "Specialties and fellowship paths suggested by your answers";

  if (showSeparateFellowships && displayedFellowships.length > 0) {
    summaryBits.push(`${displayedFellowships[0].name} had the strongest current fellowship-path signal`);
  } else if (displayedResults.length > 0) {
    summaryBits.push(`${displayedResults[0].name} had the strongest current fit signal`);
  }
  if (showSeparateFellowships && displayedFellowships.length === 2) {
    summaryBits.push(`${displayedFellowships[1].name} was close behind`);
  } else if (!showSeparateFellowships && displayedResults.length === 2) {
    summaryBits.push(`${displayedResults[1].name} was close behind`);
  }
  if (showSeparateFellowships && displayedFellowships.length >= 3) {
    summaryBits.push(`${displayedFellowships[1].name} and ${displayedFellowships[2].name} were close behind`);
  } else if (!showSeparateFellowships && displayedResults.length >= 3) {
    summaryBits.push(`${displayedResults[1].name} and ${displayedResults[2].name} were close behind`);
  }

  const answeredPromptLabel = `${explicitAnswers} answered prompt${explicitAnswers === 1 ? "" : "s"}`;

  resultsSummaryText.textContent = unansweredEverything
    ? "There is no meaningful signal yet because no preference prompts were answered. Go back and answer one or a few prompts that produce a real reaction."
    : showSeparateFellowships && displayedFellowships.length === 0
      ? `No fellowship path has enough direct signal yet. Signal strength: ${confidence}. These results are based on ${answeredPromptLabel}, but the answered items have not separated specific fellowship branches.`
      : `${summaryBits.join(", ")}. Signal strength: ${confidence}. These results are based on ${answeredPromptLabel} about continuity, pace, procedures, uncertainty, work setting, and the kinds of subspecialty branches those answers point toward.`;

  skippedSummary.textContent = unansweredEverything
    ? "No need to go through the whole bank; a few genuine answers are enough to start."
    :
    skippedCount > 0
      ? "Skipped prompts were left out of the signal. You can answer more later if the results feel too broad."
      : "You can stop here or keep answering later if you want an even more specific read.";

  resultsList.innerHTML = unansweredEverything
    ? ""
    : showSeparateFellowships
      ? createSeparatedFellowshipResults(displayedFellowships, explicitAnswers)
      : displayedResults
          .map((result, index) => createResultCard(result, index + 1, getTopFellowshipsForSpecialty(result.id, explicitAnswers >= 14 ? 3 : 2, fellowshipResults), explicitAnswers))
          .join("");
}

function createSeparatedFellowshipResults(fellowshipMatches, answeredCount) {
  if (fellowshipMatches.length > 0) {
    return fellowshipMatches
      .map((path, index) => createFellowshipResultCard(path, index + 1))
      .join("");
  }

  if (answeredCount < 5) {
    return `
      <article class="match-card">
        <div class="match-card__left">
          <span class="match-card__score-label">Fellowship paths</span>
          <h4>More answers will sharpen this view.</h4>
          <p>Specific fellowship paths are available here once enough path-level signals have been answered.</p>
        </div>
      </article>
    `;
  }

  return `
    <article class="match-card">
      <div class="match-card__left">
        <span class="match-card__score-label">Fellowship paths</span>
        <h4>No specific branch stands out yet.</h4>
        <p>The specialty ranking still has useful signal, but no fellowship path has enough direct support from the answered prompts.</p>
      </div>
    </article>
  `;
}

function createResultCard(result, rank, fellowshipMatches, answeredCount) {
  const compareId = result.id;
  const reasonItems = result.reasons.length > 0
    ? result.reasons
        .map((reason) => `<li>${reason.explanation}</li>`)
        .join("")
    : "<li>Your non-skipped answers did not strongly separate this field from nearby options, so this appears as part of a broader fit cluster.</li>";
  const fellowshipMarkup = answeredCount < 5
    ? `
      <div class="match-card__paths">
        <span class="match-card__score-label">Fellowship paths</span>
        <p class="match-card__path-note">These sharpen after a few more answers.</p>
      </div>
    `
    : fellowshipMatches.length > 0
      ? `
        <div class="match-card__paths">
          <span class="match-card__score-label">Fellowship paths nearby</span>
          <div class="path-grid">
            ${fellowshipMatches.map((path) => createPathButton(path)).join("")}
          </div>
        </div>
      `
      : `
        <div class="match-card__paths">
          <span class="match-card__score-label">Fellowship paths</span>
          <p class="match-card__path-note">No specific fellowship branch stands out yet from your answered path-level prompts.</p>
        </div>
      `;

  return `
    <article class="match-card">
      <div class="match-card__top">
        <div class="match-card__left">
          <span class="match-card__score-label">Result ${rank}</span>
          <h4>${result.name}</h4>
          <p>${result.blurb}</p>
        </div>
        <div class="match-card__score" aria-label="Match strength for ${result.name}">
          <span class="match-card__score-label">Signal</span>
          <span class="match-card__score-value">${result.normalized}%</span>
        </div>
      </div>
      <div class="match-card__why">
        <span class="match-card__score-label">Why it was suggested</span>
        <ul>${reasonItems}</ul>
      </div>
      <div class="match-card__actions">
        ${createCompareButton(compareId)}
      </div>
      ${fellowshipMarkup}
    </article>
  `;
}

function createFellowshipResultCard(path, rank) {
  const compareId = path.id;
  const reasonItems = path.reasons.length > 0
    ? path.reasons
        .map((reason) => `<li>${reason.explanation}</li>`)
        .join("")
    : "<li>This fellowship path rose from a combination of its home specialty and nearby path-level signals.</li>";

  return `
    <article class="match-card">
      <div class="match-card__top">
        <div class="match-card__left">
          <span class="match-card__score-label">Fellowship result ${rank}</span>
          <h4>${path.name}</h4>
          <p>${path.blurb}</p>
          <p class="match-card__path-note">Home specialty: ${path.parentName}</p>
        </div>
        <div class="match-card__score" aria-label="Match strength for ${path.name}">
          <span class="match-card__score-label">Signal</span>
          <span class="match-card__score-value">${path.normalized}%</span>
        </div>
      </div>
      <div class="match-card__why">
        <span class="match-card__score-label">Why it was suggested</span>
        <ul>${reasonItems}</ul>
      </div>
      <div class="match-card__actions">
        ${createCompareButton(compareId)}
      </div>
      <div class="match-card__paths">
        ${createPathButton(path, true)}
      </div>
    </article>
  `;
}

function goToNextQuestion() {
  state.currentIndex += 1;
  renderQuestion();
}

function recordAnswer(answer) {
  const currentQuestionIndex = state.questionOrder[state.currentIndex];
  state.responses[currentQuestionIndex] = answer;
  goToNextQuestion();
}

function handleBack() {
  if (state.currentIndex === 0) {
    return;
  }

  state.currentIndex -= 1;
  renderQuestion();
}

function finishQuizEarly() {
  state.resultsPreview = true;
  showResults();
}

function continueQuiz() {
  if (!state.started || state.currentIndex >= questions.length) {
    return;
  }

  state.resultsPreview = false;
  renderQuestion();
}

function restartQuiz() {
  state.started = false;
  state.rankPanelCollapsed = true;
  state.currentIndex = 0;
  state.resultsPreview = false;
  state.questionOrder = buildQuestionOrder(state.orderMode);
  state.responses = Array(questions.length).fill(null);
  resultsList.innerHTML = "";
  setInfoModalOpen(false);
  setSettingsModalOpen(false);
  setShareModalOpen(false);
  hideCompareView();
  hideExploreView();
  showStartState();
}

function toggleRankPanel() {
  state.rankPanelCollapsed = !state.rankPanelCollapsed;
  syncRankPanelVisibility();
}

function openExplore(trigger = null, selectedId = null) {
  const defaultSelection = countExplicitAnswers() > 0
    ? getDefaultExploreSelection(getScoreData())
    : specialties[0].id;
  showExploreView(trigger, selectedId ?? defaultSelection);
}

function handleExploreSelectionClick(event) {
  if (event.currentTarget === exploreCanvas && suppressExploreCanvasClick) {
    event.preventDefault();
    event.stopPropagation();
    suppressExploreCanvasClick = false;
    return;
  }

  const trigger = event.target.closest("[data-explore-id]");

  if (!trigger) {
    return;
  }

  if (!exploreView.classList.contains("hidden")) {
    selectedExploreId = trigger.dataset.exploreId;
    renderExploreView();
    return;
  }

  openExplore(trigger, trigger.dataset.exploreId);
}

answerYes.addEventListener("click", () => recordAnswer("yes"));
answerNo.addEventListener("click", () => recordAnswer("no"));
skipButton.addEventListener("click", () => recordAnswer("skip"));
backButton.addEventListener("click", handleBack);
finishQuizButton.addEventListener("click", finishQuizEarly);
startButton.addEventListener("click", startQuiz);
startExploreButton.addEventListener("click", () => {
  openExplore(startExploreButton);
});
startCompareButton.addEventListener("click", () => {
  showCompareView(startCompareButton);
});
startInfoButton.addEventListener("click", () => {
  setInfoModalOpen(true, startInfoButton);
});
startShareButton.addEventListener("click", () => {
  setShareModalOpen(true, startShareButton);
});
infoToggle.addEventListener("click", () => {
  setInfoModalOpen(true, infoToggle);
});
settingsToggle.addEventListener("click", () => {
  setSettingsModalOpen(true, settingsToggle);
});
shareToggle.addEventListener("click", () => {
  setShareModalOpen(true, shareToggle);
});
exploreToggle.addEventListener("click", () => {
  openExplore(exploreToggle);
});
resultsShareButton.addEventListener("click", () => {
  setShareModalOpen(true, resultsShareButton);
});
resultsExploreButton.addEventListener("click", () => {
  openExplore(resultsExploreButton);
});
continueQuizButton.addEventListener("click", continueQuiz);
closeInfoButton.addEventListener("click", () => setInfoModalOpen(false));
infoBackdrop.addEventListener("click", () => setInfoModalOpen(false));
closeSettingsButton.addEventListener("click", () => setSettingsModalOpen(false));
settingsBackdrop.addEventListener("click", () => setSettingsModalOpen(false));
closeShareButton.addEventListener("click", () => setShareModalOpen(false));
shareBackdrop.addEventListener("click", () => setShareModalOpen(false));
compareAboutButton.addEventListener("click", () => setCompareAboutModalOpen(true, compareAboutButton));
closeCompareAboutButton.addEventListener("click", () => setCompareAboutModalOpen(false));
compareAboutBackdrop.addEventListener("click", () => setCompareAboutModalOpen(false));
closeCompareButton.addEventListener("click", returnFromCompareView);
closeExploreButton.addEventListener("click", returnFromExploreView);
exploreZoomOutButton.addEventListener("click", () => setExploreZoom(exploreZoom - EXPLORE_ZOOM_STEP));
exploreZoomResetButton.addEventListener("click", resetExploreZoom);
exploreZoomInButton.addEventListener("click", () => setExploreZoom(exploreZoom + EXPLORE_ZOOM_STEP));
exploreCanvasShell.addEventListener("wheel", handleExploreWheel, { passive: false });
exploreCanvasShell.addEventListener("pointerdown", handleExplorePointerDown);
exploreCanvasShell.addEventListener("pointermove", handleExplorePointerMove);
exploreCanvasShell.addEventListener("pointerup", endExplorePointerDrag);
exploreCanvasShell.addEventListener("pointercancel", endExplorePointerDrag);
exploreCanvasShell.addEventListener("lostpointercapture", endExplorePointerDrag);
window.addEventListener("resize", handleExploreResize);
copySeedButton.addEventListener("click", copyCurrentSeed);
loadSeedButton.addEventListener("click", loadSeedFromInput);
compareSpecialtySelect.addEventListener("change", handleCompareSelectionChange);
compareSliderGrid.addEventListener("input", handleCompareInput);
compareView.querySelectorAll("[data-compare-check]").forEach((input) => {
  input.addEventListener("change", handleCompareInput);
});
rankToggleButton.addEventListener("click", toggleRankPanel);
rankPanelToggle.addEventListener("click", toggleRankPanel);
restartTop.addEventListener("click", restartQuiz);
retakeButton.addEventListener("click", restartQuiz);
resultsList.addEventListener("click", handleExploreSelectionClick);
resultsList.addEventListener("click", handleCompareTriggerClick);
rankPathList.addEventListener("click", handleExploreSelectionClick);
exploreNodeConnections.addEventListener("click", handleExploreSelectionClick);
exploreCompareButton.addEventListener("click", handleCompareTriggerClick);
exploreCanvas.addEventListener("click", handleExploreSelectionClick);
exploreCanvas.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  const trigger = event.target.closest("[data-explore-id]");

  if (!trigger) {
    return;
  }

  event.preventDefault();
  selectedExploreId = trigger.dataset.exploreId;
  renderExploreView();
});
questionOrderInputs.forEach((input) => {
  input.addEventListener("change", () => applyOrderMode(input.value));
});
fellowshipDisplayInputs.forEach((input) => {
  input.addEventListener("change", () => applyFellowshipDisplayMode(input.value));
});
resultsFellowshipDisplayInputs.forEach((input) => {
  input.addEventListener("change", () => applyFellowshipDisplayMode(input.value));
});

document.addEventListener("keydown", (event) => {
  if (!compareAboutModal.classList.contains("hidden")) {
    if (event.key === "Escape") {
      setCompareAboutModalOpen(false);
    }

    return;
  }

  if (!compareView.classList.contains("hidden")) {
    if (event.key === "Escape") {
      returnFromCompareView();
    }

    return;
  }

  if (!exploreView.classList.contains("hidden")) {
    if (event.key === "Escape") {
      returnFromExploreView();
    }

    return;
  }

  if (!infoModal.classList.contains("hidden")) {
    if (event.key === "Escape") {
      setInfoModalOpen(false);
    }

    return;
  }

  if (!settingsModal.classList.contains("hidden")) {
    if (event.key === "Escape") {
      setSettingsModalOpen(false);
    }

    return;
  }

  if (!shareModal.classList.contains("hidden")) {
    if (event.key === "Escape") {
      setShareModalOpen(false);
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "enter") {
      event.preventDefault();
      loadSeedFromInput();
    }

    return;
  }

  if (state.started && !questionView.classList.contains("hidden")) {
    if (event.key === "1") {
      event.preventDefault();
      answerYes.click();
      return;
    }

    if (event.key === "2") {
      event.preventDefault();
      answerNo.click();
      return;
    }

    if (event.key === "0") {
      event.preventDefault();
      skipButton.click();
      return;
    }

    if (event.key.toLowerCase() === "s") {
      event.preventDefault();
      skipButton.click();
      return;
    }

    if (event.key === "Backspace") {
      event.preventDefault();
      handleBack();
    }
  }
});

showStartState();
