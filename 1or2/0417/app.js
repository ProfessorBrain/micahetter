const specialties = [
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
    text: "Are reproductive health and care across pregnancy a meaningful draw for you?",
    support: "This is not meant to force a choice, only to detect a clear pull toward OB/GYN-style work.",
    yes: {
      obgyn: 6,
      "family-medicine": 1,
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
  makeQuestion("adult-and-children", "Population fit", "Does caring for both children and adults sound appealing?", "This helps separate combined or broader age-range interests from narrower population preferences.", mergeWeights(p.medpedsY, p.broadY), mergeWeights(p.narrowY)),
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
  makeQuestion("pregnancy-and-repro", "Clinical interests", "Are pregnancy, birth, and reproductive health especially interesting to you?", "Choose yes if this content stands out to you more than other areas.", mergeWeights(p.womenY, p.acuteY), mergeWeights(p.broadY)),
  makeQuestion("conversation-based-care", "Clinical interests", "Would you be content spending a large part of the day in conversation-based care?", "This helps identify fields where communication is the main tool.", mergeWeights(p.mentalY, p.commY), mergeWeights(p.procY)),
  makeQuestion("recovery-over-stabilization", "Clinical interests", "Does recovery after injury or illness interest you more than acute stabilization?", "This distinguishes rehabilitation-oriented work from acute care.", mergeWeights(p.rehabY, p.lifeY), mergeWeights(p.acuteY)),
  makeQuestion("function-over-diagnosis", "Clinical interests", "Would helping patients improve function matter more to you than chasing a single diagnosis?", "Choose yes if day-to-day function feels especially meaningful.", mergeWeights(p.rehabY, p.contY), mergeWeights(p.diagY)),
  makeQuestion("musculoskeletal-interest", "Clinical interests", "Are bones, joints, muscles, and movement especially interesting to you?", "This can point toward musculoskeletal and rehab-oriented fields.", mergeWeights(p.orthoY, p.rehabY), mergeWeights(p.behindY)),
  makeQuestion("sensory-systems", "Clinical interests", "Do vision, hearing, voice, or other sensory systems especially interest you?", "Choose yes if these systems stand out to you more than others.", mergeWeights(p.ophthoY, p.entY), mergeWeights(p.broadY)),
  makeQuestion("head-and-neck-interest", "Clinical interests", "Does head and neck anatomy feel more interesting than most other regions of the body?", "This can point toward focused anatomy-heavy specialties.", mergeWeights(p.entY), mergeWeights(p.broadY))
);

questions.push(
  makeQuestion("genitourinary-interest", "Clinical interests", "Are urinary and male reproductive problems more interesting to you than most other clinical areas?", "Choose yes if this feels like a meaningful draw, not just something you could tolerate.", mergeWeights(p.uroY), mergeWeights(p.broadY)),
  makeQuestion("complex-hospitalized-adults", "Population fit", "Would you enjoy caring for medically complex hospitalized adults?", "This points toward adult inpatient medicine and consultant-heavy roles.", mergeWeights(p.inpatientY, p.chronicY, p.adultY), mergeWeights(p.lifeY)),
  makeQuestion("disability-and-qol", "Clinical interests", "Are disability, adaptation, and quality of life central issues you would want to work with?", "This helps identify rehabilitation-oriented interests.", mergeWeights(p.rehabY, p.commY), mergeWeights(p.acuteY)),
  makeQuestion("sports-and-return", "Clinical interests", "Do sports injuries and return-to-activity questions sound especially appealing?", "Choose yes if function, mechanics, and recovery stand out to you.", mergeWeights(p.orthoY, p.rehabY), mergeWeights(p.behindY)),
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
  makeQuestion("ent-content", "Clinical interests", "Do ear, sinus, airway, and voice problems sound especially interesting?", "Choose yes if that content stands out to you more than other areas.", mergeWeights(p.entY), mergeWeights(p.broadY)),
  makeQuestion("urologic-problems", "Clinical interests", "Do stones, obstruction, and other urologic problems sound especially interesting?", "This can point toward urology more than other procedural fields.", mergeWeights(p.uroY), mergeWeights(p.broadY)),
  makeQuestion("large-operations", "Procedural identity", "Would large operations appeal to you more than smaller procedures?", "Choose yes if bigger operative work sounds more appealing than fine or office-based procedures.", mergeWeights(p.orY, p.orthoY), mergeWeights(p.outprocY, p.ophthoY)),
  makeQuestion("focused-outpatient-procedures", "Workflow", "Would a mostly outpatient specialty with focused procedures suit you well?", "This points toward specialties with a tighter scope and more clinic-based procedures.", mergeWeights(p.outprocY, p.lifeY, p.narrowY), mergeWeights(p.inpatientY, p.shiftY)),
  makeQuestion("body-region-expert", "Scope", "Would you enjoy becoming deeply expert in one body region?", "Choose yes if narrow anatomic mastery feels appealing.", mergeWeights(p.narrowY, p.ophthoY, p.entY, p.uroY, p.orthoY), mergeWeights(p.broadY)),
  makeQuestion("function-over-operation", "Clinical interests", "Does restoring movement or independence appeal more than removing disease or operating?", "This helps separate rehabilitation-oriented interests from operative ones.", mergeWeights(p.rehabY, p.contY), mergeWeights(p.orY, p.procY))
);

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
    return localStorage.getItem(QUESTION_ORDER_STORAGE_KEY) === "random" ? "random" : "sequential";
  } catch {
    return "sequential";
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

function syncModalBodyLock() {
  const modalOpen =
    !infoModal.classList.contains("hidden") ||
    !settingsModal.classList.contains("hidden") ||
    !shareModal.classList.contains("hidden");
  document.body.classList.toggle("modal-open", modalOpen);
}

function setInfoModalOpen(isOpen, trigger = null) {
  if (isOpen) {
    settingsModal.classList.add("hidden");
    settingsModal.setAttribute("aria-hidden", "true");
    shareModal.classList.add("hidden");
    shareModal.setAttribute("aria-hidden", "true");
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
      const bestAvailableWeight = Math.max(question.yes[id] || 0, question.no[id] || 0);

      if (bestAvailableWeight > 0) {
        possibleScores[id] += bestAvailableWeight;
        signalCounts[id] += 1;
      }
    });

    const weights = question[response];
    Object.entries(weights).forEach(([specialtyId, value]) => {
      scores[specialtyId] += value;
      reasons[specialtyId].push({
        weight: value,
        explanation: buildReasonLine(question, response, value),
      });
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
    ? "You skipped every question, so there is no meaningful signal yet. Answer at least a few questions to generate real specialty recommendations."
    : `${summaryBits.join(", ")}. Signal strength: ${confidence}. These results are based on ${explicitAnswers} answered questions about continuity, pace, procedures, uncertainty, and work setting.`;

  skippedSummary.textContent = unansweredEverything
    ? "Retake the quiz and answer the questions that produce the strongest reaction. Even a partial set of real answers is more useful than skipping everything."
    :
    skippedCount > 0
      ? `You skipped ${skippedCount} question${skippedCount === 1 ? "" : "s"}, so consider retaking later if the results feel too broad.`
      : "You answered every question, which gives the result set a more stable signal.";

  resultsList.innerHTML = unansweredEverything
    ? ""
    : displayedResults
        .map((result, index) => createResultCard(result, index + 1))
        .join("");
}

function createResultCard(result, rank) {
  const reasonItems = result.reasons.length > 0
    ? result.reasons
        .map((reason) => `<li>${reason.explanation}</li>`)
        .join("")
    : "<li>Your non-skipped answers did not strongly separate this field from nearby options, so this appears as part of a broader fit cluster.</li>";

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
  showStartState();
}

function toggleRankPanel() {
  state.rankPanelCollapsed = !state.rankPanelCollapsed;
  syncRankPanelVisibility();
}

answerYes.addEventListener("click", () => recordAnswer("yes"));
answerNo.addEventListener("click", () => recordAnswer("no"));
skipButton.addEventListener("click", () => recordAnswer("skip"));
backButton.addEventListener("click", handleBack);
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
resultsShareButton.addEventListener("click", () => {
  setShareModalOpen(true, resultsShareButton);
});
closeInfoButton.addEventListener("click", () => setInfoModalOpen(false));
infoBackdrop.addEventListener("click", () => setInfoModalOpen(false));
closeSettingsButton.addEventListener("click", () => setSettingsModalOpen(false));
settingsBackdrop.addEventListener("click", () => setSettingsModalOpen(false));
closeShareButton.addEventListener("click", () => setShareModalOpen(false));
shareBackdrop.addEventListener("click", () => setShareModalOpen(false));
copySeedButton.addEventListener("click", copyCurrentSeed);
loadSeedButton.addEventListener("click", loadSeedFromInput);
rankToggleButton.addEventListener("click", toggleRankPanel);
rankPanelToggle.addEventListener("click", toggleRankPanel);
restartTop.addEventListener("click", restartQuiz);
retakeButton.addEventListener("click", restartQuiz);
questionOrderInputs.forEach((input) => {
  input.addEventListener("change", () => applyOrderMode(input.value));
});

document.addEventListener("keydown", (event) => {
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
