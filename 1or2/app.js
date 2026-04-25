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
    id: "orthopedic-surgery",
    name: "Orthopedic Surgery",
    blurb: "Musculoskeletal surgery with strong mechanical reasoning, procedures, recovery-focused follow-up, and operative intensity.",
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
    name: "Radiology",
    blurb: "Image-driven diagnostics with high pattern recognition, technology use, and less direct continuity.",
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
  "emergency-medicine": { shortLabel: "Emergency", color: "#d96c58" },
  "general-surgery": { shortLabel: "Gen Surgery", color: "#9a5a46" },
  "orthopedic-surgery": { shortLabel: "Orthopedics", color: "#b66a4f" },
  anesthesiology: { shortLabel: "Anesthesia", color: "#5d6bb0" },
  psychiatry: { shortLabel: "Psychiatry", color: "#7d5b8d" },
  radiology: { shortLabel: "Radiology", color: "#4d78bc" },
  neurology: { shortLabel: "Neurology", color: "#5e6fd1" },
  obgyn: { shortLabel: "OB/GYN", color: "#c7648d" },
  dermatology: { shortLabel: "Dermatology", color: "#b88738" },
  ophthalmology: { shortLabel: "Ophthalmology", color: "#2f8fa0" },
  otolaryngology: { shortLabel: "ENT", color: "#aa7540" },
  urology: { shortLabel: "Urology", color: "#3d8777" },
  "physical-medicine-rehab": { shortLabel: "PM&R", color: "#5a9f8d" },
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
    name: "Cardiology",
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
    name: "Pulmonary & Critical Care",
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
    name: "Geriatrics",
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
    name: "Neonatology",
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
    name: "Child & Adolescent Psychiatry",
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
    "Hematology & Oncology",
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
    "Endocrinology",
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
    "Hospice & Palliative Medicine",
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
    "Pediatric Critical Care",
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
    "Developmental-Behavioral Pediatrics",
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
    "Pediatric Hematology-Oncology",
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
    "Colorectal Surgery",
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
    "Visually precise imaging with outpatient workflows, subtle pattern recognition, and a focused women’s-health domain.",
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
    "Reproductive Endocrinology & Infertility",
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
    "Female Pelvic Medicine & Reconstructive Surgery",
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
    "Allergy & Immunology",
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
    "Hospice & Palliative Medicine",
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
];

const specialtyById = Object.fromEntries(specialties.map((specialty) => [specialty.id, specialty]));
const fellowshipPathsBySpecialtyId = fellowshipPaths.reduce((grouped, path) => {
  if (!grouped[path.parentId]) {
    grouped[path.parentId] = [];
  }

  grouped[path.parentId].push(path);
  return grouped;
}, {});

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

const questionIndexById = Object.fromEntries(questions.map((question, index) => [question.id, index]));
const QUESTION_ORDER_STORAGE_KEY = "1or2-question-order-mode";
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

function encodeResponseSequence(responses) {
  return responses.map((response) => RESPONSE_TO_CODE[String(response)] ?? RESPONSE_TO_CODE.null).join("");
}

function decodeResponseSequence(encodedResponses) {
  if (encodedResponses.length !== questions.length) {
    throw new Error("The seed response list does not match this question set.");
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
    throw new Error("The seed question order does not match this question set.");
  }

  const decoded = [];

  for (let index = 0; index < encodedOrder.length; index += 2) {
    const value = Number.parseInt(encodedOrder.slice(index, index + 2), 36);

    if (!Number.isInteger(value) || value < 0 || value >= questions.length) {
      throw new Error("The seed contains an invalid question order.");
    }

    decoded.push(value);
  }

  if (new Set(decoded).size !== questions.length) {
    throw new Error("The seed question order is incomplete or duplicated.");
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
    throw new Error("This seed contains an invalid progress marker.");
  }

  return {
    orderMode: modeCode === "r" ? "random" : "sequential",
    currentIndex,
    responses: decodeResponseSequence(responseSequence),
    questionOrder: decodeQuestionOrder(questionOrderSequence),
  };
}

const initialOrderMode = loadOrderMode();

const state = {
  started: false,
  rankPanelCollapsed: true,
  orderMode: initialOrderMode,
  questionOrder: buildQuestionOrder(initialOrderMode),
  currentIndex: 0,
  responses: Array(questions.length).fill(null),
};

let lastTrigger = null;
let selectedExploreId = specialties[0].id;

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
const shareModal = document.getElementById("shareModal");
const shareBackdrop = document.getElementById("shareBackdrop");
const shareToggle = document.getElementById("shareToggle");
const startShareButton = document.getElementById("startShareButton");
const resultsShareButton = document.getElementById("resultsShareButton");
const closeShareButton = document.getElementById("closeShareButton");
const shareExportSection = document.getElementById("shareExportSection");
const shareSummary = document.getElementById("shareSummary");
const shareSeedOutput = document.getElementById("shareSeedOutput");
const copySeedButton = document.getElementById("copySeedButton");
const shareCopyStatus = document.getElementById("shareCopyStatus");
const shareSeedInput = document.getElementById("shareSeedInput");
const loadSeedButton = document.getElementById("loadSeedButton");
const shareImportStatus = document.getElementById("shareImportStatus");
const exploreModal = document.getElementById("exploreModal");
const exploreBackdrop = document.getElementById("exploreBackdrop");
const exploreToggle = document.getElementById("exploreToggle");
const resultsExploreButton = document.getElementById("resultsExploreButton");
const closeExploreButton = document.getElementById("closeExploreButton");
const exploreCanvas = document.getElementById("exploreCanvas");
const exploreNodeType = document.getElementById("exploreNodeType");
const exploreNodeTitle = document.getElementById("exploreNodeTitle");
const exploreNodeBlurb = document.getElementById("exploreNodeBlurb");
const exploreNodeScore = document.getElementById("exploreNodeScore");
const exploreNodeParent = document.getElementById("exploreNodeParent");
const exploreNodeNotes = document.getElementById("exploreNodeNotes");
const exploreNodeConnections = document.getElementById("exploreNodeConnections");
const rankToggleButton = document.getElementById("rankToggleButton");
const appGrid = document.getElementById("appGrid");
const startView = document.getElementById("startView");
const startButton = document.getElementById("startButton");
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
const rankPathList = document.getElementById("rankPathList");

function syncModalBodyLock() {
  const modalOpen =
    !infoModal.classList.contains("hidden") ||
    !settingsModal.classList.contains("hidden") ||
    !shareModal.classList.contains("hidden") ||
    !exploreModal.classList.contains("hidden");
  document.body.classList.toggle("modal-open", modalOpen);
}

function setInfoModalOpen(isOpen, trigger = null) {
  if (isOpen) {
    settingsModal.classList.add("hidden");
    settingsModal.setAttribute("aria-hidden", "true");
    shareModal.classList.add("hidden");
    shareModal.setAttribute("aria-hidden", "true");
    exploreModal.classList.add("hidden");
    exploreModal.setAttribute("aria-hidden", "true");
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

  if (!state.started) {
    settingsStatus.textContent = "This will be used the next time you begin the quiz.";
    return;
  }

  settingsStatus.textContent = countAnswered() === 0
    ? "This can take effect immediately because you have not answered a question yet."
    : "Changes to question order will be used the next time you restart the quiz.";
}

function setSettingsModalOpen(isOpen, trigger = null) {
  if (isOpen) {
    infoModal.classList.add("hidden");
    infoModal.setAttribute("aria-hidden", "true");
    shareModal.classList.add("hidden");
    shareModal.setAttribute("aria-hidden", "true");
    exploreModal.classList.add("hidden");
    exploreModal.setAttribute("aria-hidden", "true");
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

  if (state.currentIndex >= questions.length) {
    return `Complete session: ${answered} answered and ${skipped} skipped. Loading this seed opens the final results with the same answers.`;
  }

  return `Current progress: ${answered} answered and ${skipped} skipped. The next prompt is question ${Math.min(state.currentIndex + 1, questions.length)} of ${questions.length}.`;
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
    exploreModal.classList.add("hidden");
    exploreModal.setAttribute("aria-hidden", "true");
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

function setExploreModalOpen(isOpen, trigger = null, selectedId = null) {
  if (isOpen) {
    infoModal.classList.add("hidden");
    infoModal.setAttribute("aria-hidden", "true");
    settingsModal.classList.add("hidden");
    settingsModal.setAttribute("aria-hidden", "true");
    shareModal.classList.add("hidden");
    shareModal.setAttribute("aria-hidden", "true");
  }

  if (selectedId) {
    selectedExploreId = selectedId;
  }

  exploreModal.classList.toggle("hidden", !isOpen);
  exploreModal.setAttribute("aria-hidden", String(!isOpen));
  syncModalBodyLock();

  if (isOpen) {
    lastTrigger = trigger ?? document.activeElement;
    renderExploreModal();
    closeExploreButton.focus();
    return;
  }

  if (lastTrigger instanceof HTMLElement) {
    lastTrigger.focus();
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

function syncCurrentResponseControls(response) {
  answerYes.classList.toggle("answer-button--selected", response === "yes");
  answerNo.classList.toggle("answer-button--selected", response === "no");
  skipButton.classList.toggle("ghost-button--selected", response === "skip");

  answerYes.setAttribute("aria-pressed", String(response === "yes"));
  answerNo.setAttribute("aria-pressed", String(response === "no"));
  skipButton.setAttribute("aria-pressed", String(response === "skip"));
  skipButton.textContent = response === "skip" ? "Skipped" : "Skip this question";
}

function applyImportedSession(seedPayload) {
  state.started = true;
  state.rankPanelCollapsed = true;
  state.orderMode = seedPayload.orderMode;
  state.questionOrder = [...seedPayload.questionOrder];
  state.currentIndex = seedPayload.currentIndex;
  state.responses = [...seedPayload.responses];
  resultsList.innerHTML = "";
  restartTop.classList.remove("hidden");
  updateSettingsUI();
  setInfoModalOpen(false);
  setSettingsModalOpen(false);
  setShareModalOpen(false);
  setExploreModalOpen(false);
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
            weight: signal.weight,
            explanation: buildFellowshipSignalLine(signal.label),
          });
        }
      });

      const signalRatio = answeredSignalWeight > 0 ? matchedWeight / answeredSignalWeight : 0;
      const coverageRatio = totalSignalWeight > 0 ? answeredSignalWeight / totalSignalWeight : 0;
      const parentAdjusted = parent?.adjusted ?? 0;
      const adjusted = answeredCount === 0 || answeredSignalWeight === 0
        ? 0
        : Math.min(1, parentAdjusted * signalRatio * (0.55 + coverageRatio * 0.45));

      const reasons = [];

      if (parent && parent.raw > 0) {
        reasons.push({
          weight: Math.max(1, Math.round(parent.normalized / 18)),
          explanation: `${parent.name} is one of your stronger home specialties, which is where this path usually starts.`,
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

function buildExploreLayoutData(specialtyResults, fellowshipResults) {
  const maxChildren = Math.max(
    0,
    ...specialtyResults.map((item) => fellowshipResults.filter((path) => path.parentId === item.id).length)
  );
  const specialtyRing = 300;
  const fellowshipRing = 500 + (Math.max(0, maxChildren - 4) * 16);
  const width = Math.max(1560, (fellowshipRing * 2) + 340);
  const height = Math.max(1160, (fellowshipRing * 2) + 260);
  const centerX = width / 2;
  const centerY = height / 2;
  const specialtyNodes = specialtyResults.map((item, index) => {
    const angle = (-Math.PI / 2) + ((Math.PI * 2 * index) / specialtyResults.length);
    return {
      ...item,
      angle,
      x: centerX + Math.cos(angle) * specialtyRing,
      y: centerY + Math.sin(angle) * specialtyRing,
      radius: 22 + (item.normalized * 0.05),
    };
  });
  const specialtyPositionMap = Object.fromEntries(specialtyNodes.map((node) => [node.id, node]));
  const fellowshipNodes = specialtyNodes.flatMap((specialtyNode) => {
    const children = fellowshipResults.filter((path) => path.parentId === specialtyNode.id);
    const spread = children.length <= 1 ? 0 : Math.min(0.68, (0.08 * children.length) + 0.04);
    const step = children.length <= 1 ? 0 : (spread * 2) / (children.length - 1);

    return children.map((path, index) => {
      const angle = specialtyNode.angle - spread + (step * index);
      const staggerAmount = children.length >= 5 ? 32 : 18;
      const staggerOffset = children.length <= 2
        ? 0
        : (index % 2 === 0 ? -staggerAmount : staggerAmount);
      const ring = fellowshipRing + staggerOffset;

      return {
        ...path,
        angle,
        x: centerX + Math.cos(angle) * ring,
        y: centerY + Math.sin(angle) * ring,
        radius: 12 + (path.normalized * 0.03),
      };
    });
  });

  return {
    width,
    height,
    centerX,
    centerY,
    specialtyRing,
    fellowshipRing,
    specialtyNodes,
    fellowshipNodes,
    specialtyPositionMap,
  };
}

function getDefaultExploreSelection(specialtyResults) {
  return specialtyResults[0]?.id ?? specialties[0].id;
}

function getExploreCollections() {
  const specialtyResults = getScoreData();
  const fellowshipResults = getFellowshipScoreData(specialtyResults);
  return {
    specialtyResults,
    fellowshipResults,
    specialtyResultMap: Object.fromEntries(specialtyResults.map((item) => [item.id, item])),
    fellowshipResultMap: Object.fromEntries(fellowshipResults.map((item) => [item.id, item])),
  };
}

function renderExploreInspector(selectedEntity, specialtyResults, fellowshipResults) {
  if (!selectedEntity) {
    return;
  }

  const specialtyResultMap = Object.fromEntries(specialtyResults.map((item) => [item.id, item]));

  if (selectedEntity.kind === "specialty") {
    const childPaths = getTopFellowshipsForSpecialty(selectedEntity.id, 6, fellowshipResults);
    exploreNodeType.textContent = "Specialty";
    exploreNodeTitle.textContent = selectedEntity.name;
    exploreNodeBlurb.textContent = selectedEntity.blurb;
    exploreNodeScore.textContent = `${selectedEntity.fitPercent}%`;
    exploreNodeParent.textContent = "Standalone specialty";
    exploreNodeNotes.innerHTML = (selectedEntity.reasons.length > 0
      ? selectedEntity.reasons
      : [{ explanation: "This node strengthens when your answers keep this home specialty consistently high across the question bank." }])
      .slice(0, 3)
      .map((reason) => `<li>${reason.explanation}</li>`)
      .join("");
    exploreNodeConnections.innerHTML = childPaths.length > 0
      ? childPaths.map((path) => createPathButton(path, true)).join("")
      : '<p class="explore-inspector__empty">Fellowship paths sharpen after a few more answers.</p>';
    return;
  }

  const siblingPaths = fellowshipResults
    .filter((path) => path.parentId === selectedEntity.parentId && path.id !== selectedEntity.id)
    .slice(0, 4);
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
  exploreNodeConnections.innerHTML = [
    createPathButton(specialtyResultMap[selectedEntity.parentId], true),
    ...siblingPaths.map((path) => createPathButton(path, true)),
  ].join("");
}

function renderExploreModal() {
  const { specialtyResults, fellowshipResults, specialtyResultMap, fellowshipResultMap } = getExploreCollections();
  const selectedEntity = specialtyResultMap[selectedExploreId] || fellowshipResultMap[selectedExploreId];

  if (!selectedEntity) {
    selectedExploreId = getDefaultExploreSelection(specialtyResults);
  }

  const activeEntity = specialtyResultMap[selectedExploreId] || fellowshipResultMap[selectedExploreId];
  const {
    width,
    height,
    centerX,
    centerY,
    specialtyRing,
    fellowshipRing,
    specialtyNodes,
    fellowshipNodes,
    specialtyPositionMap,
  } = buildExploreLayoutData(specialtyResults, fellowshipResults);
  const isSelected = (node) => node.id === selectedExploreId;
  const isConnected = (node) => {
    if (node.id === selectedExploreId) {
      return true;
    }

    if (node.kind === "fellowship") {
      return node.parentId === selectedExploreId;
    }

    const selectedFellowship = fellowshipResultMap[selectedExploreId];
    return selectedFellowship?.parentId === node.id;
  };

  const backgroundMarkup = `
    <circle class="explore-ring" cx="${centerX}" cy="${centerY}" r="${specialtyRing}"></circle>
    <circle class="explore-ring explore-ring--outer" cx="${centerX}" cy="${centerY}" r="${fellowshipRing}"></circle>
  `;
  const linkMarkup = fellowshipNodes.map((node) => {
    const parentNode = specialtyPositionMap[node.parentId];
    const selected = isSelected(node) || node.parentId === selectedExploreId || fellowshipResultMap[selectedExploreId]?.parentId === node.parentId;
    return `
      <line
        class="explore-link ${selected ? "explore-link--selected" : ""}"
        x1="${parentNode.x}"
        y1="${parentNode.y}"
        x2="${node.x}"
        y2="${node.y}"
        style="--link-color: ${node.color};"
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

  exploreCanvas.setAttribute("viewBox", `0 0 ${width} ${height}`);
  exploreCanvas.innerHTML = `${backgroundMarkup}${linkMarkup}${specialtyMarkup}${fellowshipMarkup}`;
  renderExploreInspector(activeEntity, specialtyResults, fellowshipResults);
}

function syncRankPanelVisibility() {
  const isResultsScreen = state.started && state.currentIndex >= questions.length;
  const isAvailable = state.started && !isResultsScreen;
  const isVisible = isAvailable && !state.rankPanelCollapsed;
  rankPanel.classList.toggle("hidden", !state.started);
  rankPanel.classList.toggle("rank-panel--collapsed", state.started && !isVisible);
  appGrid.classList.toggle("app-grid--with-rank-panel", state.started);
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

function updateProgress() {
  const answered = countAnswered();
  const percent = Math.round((answered / questions.length) * 100);
  const displayIndex = Math.min(state.currentIndex + 1, questions.length);

  progressLabel.textContent = answered === questions.length
    ? "All questions complete"
    : `Question ${displayIndex} of ${questions.length}`;

  progressPercent.textContent = `${percent}% complete`;
  progressFill.style.width = `${percent}%`;
}

function getRankingStage(answeredCount) {
  const answerRatio = answeredCount / questions.length;

  if (answeredCount === 0) {
    return {
      summary: "Answer the first few questions to start forming a ranking.",
      maxItems: 0,
      showLeader: false,
      showReasons: false,
    };
  }

  if (answeredCount < 6) {
    return {
      summary: "This is still very early. The order will move around quite a bit as more answers come in.",
      maxItems: 4,
      showLeader: false,
      showReasons: false,
    };
  }

  if (answerRatio < 0.2) {
    return {
      summary: "The ranking is starting to take shape. The top group is usually more useful than any one exact position at this stage.",
      maxItems: 5,
      showLeader: true,
      showReasons: false,
    };
  }

  if (answerRatio < 0.5) {
    return {
      summary: "This is becoming more stable. Additional answers will mostly help separate closely related fields.",
      maxItems: 5,
      showLeader: true,
      showReasons: true,
    };
  }

  return {
    summary: "The ranking is fairly stable now. Remaining answers mostly refine the order and explanation.",
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
    ? `${stage.summary} ${skippedCount} question${skippedCount === 1 ? "" : "s"} skipped so far.`
    : stage.summary;

  if (displayed.length === 0) {
    rankList.innerHTML = '<div class="rank-panel__empty">No ranking yet. Once you answer a question, the list will start to take shape here.</div>';
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
    rankDetailLabel.textContent = answeredCount >= Math.round(questions.length * 0.5)
      ? "What is shaping the current leader"
      : "What is starting to shape the current leader";
    rankReasons.innerHTML = displayed[0].reasons
      .slice(0, answeredCount >= Math.round(questions.length * 0.5) ? 3 : 2)
      .map((reason) => `<li>${reason.explanation}</li>`)
      .join("");
  } else {
    rankDetail.classList.add("hidden");
  }

  const leaderPaths = getTopFellowshipsForSpecialty(displayed[0].id, 3, fellowshipResults);

  if (answeredCount >= 6 && leaderPaths.length > 0) {
    rankPathDetail.classList.remove("hidden");
    rankPathList.innerHTML = leaderPaths.map((path) => createPathButton(path, true)).join("");
  } else {
    rankPathDetail.classList.add("hidden");
  }
}

function showStartState() {
  state.started = false;
  state.rankPanelCollapsed = true;
  state.questionOrder = buildQuestionOrder(state.orderMode);
  startView.classList.remove("hidden");
  progressWrap.classList.add("hidden");
  questionView.classList.add("hidden");
  resultsView.classList.add("hidden");
  restartTop.classList.add("hidden");
  setSettingsModalOpen(false);
  setShareModalOpen(false);
  setExploreModalOpen(false);
  syncRankPanelVisibility();
  updateProgress();
}

function startQuiz() {
  state.started = true;
  state.rankPanelCollapsed = true;
  state.questionOrder = buildQuestionOrder(state.orderMode);
  setInfoModalOpen(false);
  setSettingsModalOpen(false);
  setShareModalOpen(false);
  setExploreModalOpen(false);
  startView.classList.add("hidden");
  progressWrap.classList.remove("hidden");
  restartTop.classList.remove("hidden");
  syncRankPanelVisibility();
  renderQuestion();
}

function renderQuestion() {
  if (!state.started) {
    return;
  }

  updateProgress();

  if (state.currentIndex >= questions.length) {
    showResults();
    return;
  }

  const currentQuestionIndex = state.questionOrder[state.currentIndex];
  const currentQuestion = questions[currentQuestionIndex];
  const currentResponse = state.responses[currentQuestionIndex];
  questionCategory.textContent = currentQuestion.category;
  questionText.textContent = currentQuestion.text;
  questionSupport.textContent = currentQuestion.support;
  backButton.disabled = state.currentIndex === 0;
  backButton.style.opacity = state.currentIndex === 0 ? "0.5" : "1";
  syncCurrentResponseControls(currentResponse);

  questionView.classList.remove("hidden");
  resultsView.classList.add("hidden");
  renderRankPanel();
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
  const ranked = getScoreData();
  const fellowshipResults = getFellowshipScoreData(ranked);
  const explicitAnswers = countExplicitAnswers();
  const skippedCount = countSkipped();
  const unansweredEverything = explicitAnswers === 0;
  const topResults = ranked.filter((item) => item.raw > 0).slice(0, 4);
  const displayedResults = topResults.length > 0 ? topResults : ranked.slice(0, 4);
  const leadGap = displayedResults[1]
    ? displayedResults[0].normalized - displayedResults[1].normalized
    : displayedResults[0].normalized;
  const confidence = getConfidenceLabel(leadGap, explicitAnswers);

  startView.classList.add("hidden");
  progressWrap.classList.remove("hidden");
  questionView.classList.add("hidden");
  resultsView.classList.remove("hidden");
  state.rankPanelCollapsed = true;
  restartTop.classList.remove("hidden");
  updateProgress();
  renderRankPanel();

  const summaryBits = [];
  if (displayedResults.length > 0) {
    summaryBits.push(`${displayedResults[0].name} had the strongest current fit signal`);
  }
  if (displayedResults.length === 2) {
    summaryBits.push(`${displayedResults[1].name} was close behind`);
  }
  if (displayedResults.length >= 3) {
    summaryBits.push(`${displayedResults[1].name} and ${displayedResults[2].name} were close behind`);
  }

  resultsSummaryText.textContent = unansweredEverything
    ? "You skipped every question, so there is no meaningful signal yet. Answer at least a few questions to generate real specialty and fellowship-path recommendations."
    : `${summaryBits.join(", ")}. Signal strength: ${confidence}. These results are based on ${explicitAnswers} answered questions about continuity, pace, procedures, uncertainty, work setting, and the kinds of subspecialty branches those answers point toward.`;

  skippedSummary.textContent = unansweredEverything
    ? "Retake the quiz and answer the questions that produce the strongest reaction. Even a partial set of real answers is more useful than skipping everything."
    :
    skippedCount > 0
      ? `You skipped ${skippedCount} question${skippedCount === 1 ? "" : "s"}, so consider retaking later if the results feel too broad.`
      : "You answered every question, which gives the result set a more stable signal.";

  resultsList.innerHTML = unansweredEverything
    ? ""
    : displayedResults
        .map((result, index) => createResultCard(result, index + 1, getTopFellowshipsForSpecialty(result.id, explicitAnswers >= 14 ? 3 : 2, fellowshipResults), explicitAnswers))
        .join("");
}

function createResultCard(result, rank, fellowshipMatches, answeredCount) {
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
          <p class="match-card__path-note">No specific fellowship branch stands out yet from your answered path-level questions.</p>
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
      ${fellowshipMarkup}
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
  state.responses = state.responses.map((response) => (response === null ? "skip" : response));
  state.currentIndex = questions.length;
  renderQuestion();
}

function restartQuiz() {
  state.started = false;
  state.rankPanelCollapsed = true;
  state.currentIndex = 0;
  state.questionOrder = buildQuestionOrder(state.orderMode);
  state.responses = Array(questions.length).fill(null);
  resultsList.innerHTML = "";
  setInfoModalOpen(false);
  setSettingsModalOpen(false);
  setShareModalOpen(false);
  setExploreModalOpen(false);
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
  setExploreModalOpen(true, trigger, selectedId ?? defaultSelection);
}

function handleExploreSelectionClick(event) {
  const trigger = event.target.closest("[data-explore-id]");

  if (!trigger) {
    return;
  }

  if (!exploreModal.classList.contains("hidden")) {
    selectedExploreId = trigger.dataset.exploreId;
    renderExploreModal();
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
closeInfoButton.addEventListener("click", () => setInfoModalOpen(false));
infoBackdrop.addEventListener("click", () => setInfoModalOpen(false));
closeSettingsButton.addEventListener("click", () => setSettingsModalOpen(false));
settingsBackdrop.addEventListener("click", () => setSettingsModalOpen(false));
closeShareButton.addEventListener("click", () => setShareModalOpen(false));
shareBackdrop.addEventListener("click", () => setShareModalOpen(false));
closeExploreButton.addEventListener("click", () => setExploreModalOpen(false));
exploreBackdrop.addEventListener("click", () => setExploreModalOpen(false));
copySeedButton.addEventListener("click", copyCurrentSeed);
loadSeedButton.addEventListener("click", loadSeedFromInput);
rankToggleButton.addEventListener("click", toggleRankPanel);
rankPanelToggle.addEventListener("click", toggleRankPanel);
restartTop.addEventListener("click", restartQuiz);
retakeButton.addEventListener("click", restartQuiz);
resultsList.addEventListener("click", handleExploreSelectionClick);
rankPathList.addEventListener("click", handleExploreSelectionClick);
exploreNodeConnections.addEventListener("click", handleExploreSelectionClick);
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
  renderExploreModal();
});
questionOrderInputs.forEach((input) => {
  input.addEventListener("change", () => applyOrderMode(input.value));
});

document.addEventListener("keydown", (event) => {
  if (!exploreModal.classList.contains("hidden")) {
    if (event.key === "Escape") {
      setExploreModalOpen(false);
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
