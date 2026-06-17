/*
  ED Rush!
  Browser-based emergency department time-management MVP.

  The file is intentionally organized into numbered sections so the prototype
  can grow without needing a framework or build step.
*/

/* -------------------------------------------------------------------------
   1. Constants and data
------------------------------------------------------------------------- */

const STORAGE_PREFIX = "edRush";
const STORAGE_KEY = `${STORAGE_PREFIX}.progress`;
const TICK_MS = 1000;

const SCORE_EVENTS = {
  correctManeuver: 50,
  efficientDiagnosis: 100,
  documentation: 50,
  treatment: 100,
  disposition: 150,
  roomReset: 25,
  resourceStarted: 40,
  fastBonusMin: 10,
  fastBonusMax: 50,
  deterioration: -200
};

const AMA_PENALTIES = {
  low: { score: -100, safety: 0, satisfaction: -5 },
  medium: { score: -175, safety: -5, satisfaction: -8 },
  high: { score: -300, safety: -12, satisfaction: -10 }
};

const BASE_RESOURCE_DELAYS = {
  labs: 10,
  xray: 8,
  ctTransport: 12
};

const ROOM_TEMPLATES = [
  { id: "room1", name: "Room 1", type: "standard" },
  { id: "room2", name: "Room 2", type: "standard" },
  { id: "room3", name: "Room 3", type: "standard" },
  { id: "room4", name: "Room 4", type: "standard" },
  { id: "fast1", name: "Fast Track 1", type: "fast_track" },
  { id: "fast2", name: "Fast Track 2", type: "fast_track" },
  { id: "resus", name: "Resus Bay", type: "resus" },
  { id: "psych", name: "Psych Room", type: "psych" }
];

const EXTRA_FAST_TRACK_ROOM = {
  id: "fast3",
  name: "Fast Track 3",
  type: "fast_track"
};

const ACTIONS = {
  rooming: {
    label: "Room patient",
    microgame: "rooming",
    failure: "Rooming delayed. Try again."
  },
  vitals: {
    label: "Vitals / initial assessment",
    microgame: "vitals",
    failure: "Vitals check delayed. Try again."
  },
  pulmonaryExam: {
    label: "Pulmonary exam",
    microgame: "pulmonaryExam",
    failure: "Auscultation delayed. Try again."
  },
  ekg: {
    label: "EKG",
    microgame: "ekg",
    failure: "EKG capture delayed. Try again."
  },
  neuroExam: {
    label: "Neuro exam",
    microgame: "neuroExam",
    failure: "Neuro check delayed. Try again."
  },
  abdominalExam: {
    label: "Abdominal exam",
    microgame: "abdominalExam",
    failure: "Abdominal exam delayed. Try again."
  },
  mskExam: {
    label: "MSK exam",
    microgame: "mskExam",
    failure: "Joint check delayed. Try again."
  },
  labs: {
    label: "Labs",
    microgame: "labs",
    resource: "lab",
    failure: "Lab draw delayed. Try again."
  },
  xray: {
    label: "X-ray",
    microgame: "xray",
    resource: "xray",
    failure: "X-ray setup delayed. Try again."
  },
  ctTransport: {
    label: "CT transport",
    microgame: "ctTransport",
    resource: "ct",
    failure: "CT transport delayed. Try again."
  },
  oxygen: {
    label: "Oxygen",
    microgame: "medication",
    failure: "Oxygen setup delayed. Try again."
  },
  antibiotics: {
    label: "Antibiotics",
    microgame: "medication",
    failure: "Antibiotics delayed. Try again."
  },
  nebulizer: {
    label: "Neb treatment",
    microgame: "medication",
    failure: "Neb treatment delayed. Try again."
  },
  steroids: {
    label: "Steroids",
    microgame: "medication",
    failure: "Steroid treatment delayed. Try again."
  },
  aspirin: {
    label: "Aspirin",
    microgame: "medication",
    failure: "Aspirin delayed. Try again."
  },
  splint: {
    label: "Splint",
    microgame: "medication",
    failure: "Splint placement delayed. Try again."
  },
  cathLab: {
    label: "Cath lab activation",
    microgame: "admit",
    failure: "Cath lab activation delayed. Try again."
  },
  strokeAlert: {
    label: "Stroke alert",
    microgame: "admit",
    failure: "Stroke alert delayed. Try again."
  },
  surgeryConsult: {
    label: "Surgery consult",
    microgame: "admit",
    failure: "Surgery handoff delayed. Try again."
  },
  reassessment: {
    label: "Reassessment",
    microgame: "reassessment",
    failure: "Reassessment delayed. Try again."
  },
  documentation: {
    label: "Documentation",
    microgame: "documentation",
    failure: "Charting delayed. Try again."
  },
  discharge: {
    label: "Discharge",
    microgame: "discharge",
    failure: "Discharge packet delayed. Try again."
  },
  admit: {
    label: "Admit",
    microgame: "admit",
    failure: "Admit handoff delayed. Try again."
  },
  transfer: {
    label: "Admit / transfer",
    microgame: "admit",
    failure: "Transfer handoff delayed. Try again."
  },
  cleanRoom: {
    label: "Room reset",
    microgame: "cleanRoom",
    failure: "Room reset delayed. Try again."
  }
};

const PATIENT_NAMES = [
  "Alex Morgan",
  "Sam Rivera",
  "Jamie Patel",
  "Mrs. Rivera",
  "Mr. Brooks",
  "Taylor Chen",
  "Jordan Lewis",
  "Riley Garcia",
  "Morgan Reed",
  "Casey Nguyen",
  "Drew Johnson",
  "Avery Campbell"
];

const FINDING_LABELS = {
  pain: "pain",
  swelling: "swelling",
  fever: "fever",
  tachycardia: "tachycardia",
  low_o2: "low oxygen",
  chest_pressure: "chest pressure",
  neuro_symptoms: "neuro symptoms",
  belly_pain: "belly pain",
  ankle_tenderness_normal_pulse: "ankle tenderness, normal pulse",
  focal_crackles: "focal crackles",
  diffuse_wheezing: "diffuse wheezing",
  st_elevation: "ST elevation",
  facial_droop: "facial droop",
  arm_drift: "arm drift",
  aphasia: "aphasia",
  gaze_preference: "gaze preference",
  rlq_tenderness: "RLQ tenderness",
  xray_complete: "X-ray resulted",
  labs_complete: "labs resulted",
  ct_complete: "CT completed",
  improved_air_movement: "improved air movement"
};

/* -------------------------------------------------------------------------
   2. Persistent progress / localStorage
------------------------------------------------------------------------- */

function createDefaultProgress() {
  const upgradeLevels = {};
  UPGRADE_DEFINITIONS.forEach((upgrade) => {
    upgradeLevels[upgrade.id] = 0;
  });

  return {
    money: 0,
    satisfactionTokens: 0,
    unlockedRounds: [1],
    completedRounds: {},
    bestScores: {},
    upgradeLevels,
    tutorialCompleted: false
  };
}

function loadProgress() {
  const defaults = createDefaultProgress();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaults;
    }

    const parsed = JSON.parse(raw);
    return {
      ...defaults,
      ...parsed,
      unlockedRounds: Array.isArray(parsed.unlockedRounds) ? parsed.unlockedRounds : defaults.unlockedRounds,
      completedRounds: { ...defaults.completedRounds, ...(parsed.completedRounds || {}) },
      bestScores: { ...defaults.bestScores, ...(parsed.bestScores || {}) },
      upgradeLevels: { ...defaults.upgradeLevels, ...(parsed.upgradeLevels || {}) }
    };
  } catch (error) {
    console.warn("Could not load ED Rush! progress.", error);
    return defaults;
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
  progress = createDefaultProgress();
  renderRoundSelection();
  renderUpgradeScreen();
}

/* -------------------------------------------------------------------------
   3. Round definitions
------------------------------------------------------------------------- */

const ROUND_DEFINITIONS = [
  {
    id: 1,
    name: "Fast Track Basics",
    newlyIntroducedPathology: "Ankle Sprain",
    difficulty: "Tutorial",
    shiftSeconds: 240,
    spawnInterval: 28,
    maxPatients: 5,
    allowedPathologies: ["ankleSprain"],
    requiredSuccessfulDispositions: 3,
    targetScore: 700,
    maxAma: 2,
    maxDeteriorations: 0,
    minSafety: 70,
    minSatisfaction: 65,
    rewards: { money: 45, satisfactionTokens: 8 }
  },
  {
    id: 2,
    name: "Cough, Fever, Flow",
    newlyIntroducedPathology: "Pneumonia",
    difficulty: "Easy",
    shiftSeconds: 280,
    spawnInterval: 26,
    maxPatients: 6,
    allowedPathologies: ["ankleSprain", "pneumonia"],
    requiredSuccessfulDispositions: 4,
    targetScore: 1000,
    maxAma: 2,
    maxDeteriorations: 1,
    minSafety: 68,
    minSatisfaction: 62,
    rewards: { money: 65, satisfactionTokens: 10 }
  },
  {
    id: 3,
    name: "Wheeze Rush",
    newlyIntroducedPathology: "Asthma Exacerbation",
    difficulty: "Medium",
    shiftSeconds: 300,
    spawnInterval: 24,
    maxPatients: 7,
    allowedPathologies: ["ankleSprain", "pneumonia", "asthma"],
    requiredSuccessfulDispositions: 5,
    targetScore: 1250,
    maxAma: 2,
    maxDeteriorations: 1,
    minSafety: 66,
    minSatisfaction: 60,
    rewards: { money: 80, satisfactionTokens: 12 }
  },
  {
    id: 4,
    name: "Chest Pain Panic",
    newlyIntroducedPathology: "Chest Pain / STEMI",
    difficulty: "Hard",
    shiftSeconds: 320,
    spawnInterval: 23,
    maxPatients: 8,
    allowedPathologies: ["ankleSprain", "pneumonia", "asthma", "stemi"],
    requiredSuccessfulDispositions: 5,
    targetScore: 1450,
    maxAma: 2,
    maxDeteriorations: 1,
    minSafety: 64,
    minSatisfaction: 58,
    rewards: { money: 95, satisfactionTokens: 14 }
  },
  {
    id: 5,
    name: "Belly Pain Bottleneck",
    newlyIntroducedPathology: "Appendicitis",
    difficulty: "Hard",
    shiftSeconds: 340,
    spawnInterval: 22,
    maxPatients: 8,
    allowedPathologies: ["ankleSprain", "pneumonia", "asthma", "stemi", "appendicitis"],
    requiredSuccessfulDispositions: 6,
    targetScore: 1650,
    maxAma: 2,
    maxDeteriorations: 1,
    minSafety: 62,
    minSatisfaction: 56,
    rewards: { money: 110, satisfactionTokens: 16 }
  },
  {
    id: 6,
    name: "Stroke Surge",
    newlyIntroducedPathology: "Stroke Symptoms",
    difficulty: "Severe",
    shiftSeconds: 360,
    spawnInterval: 20,
    maxPatients: 9,
    allowedPathologies: ["pneumonia", "asthma", "stemi", "appendicitis", "stroke"],
    requiredSuccessfulDispositions: 6,
    targetScore: 1850,
    maxAma: 2,
    maxDeteriorations: 1,
    minSafety: 60,
    minSatisfaction: 54,
    rewards: { money: 130, satisfactionTokens: 18 }
  },
  {
    id: 7,
    name: "Mixed Surge Round",
    newlyIntroducedPathology: "Mixed surge flow",
    difficulty: "Extreme",
    shiftSeconds: 380,
    spawnInterval: 18,
    maxPatients: 11,
    allowedPathologies: ["ankleSprain", "pneumonia", "asthma", "stemi", "appendicitis", "stroke"],
    requiredSuccessfulDispositions: 7,
    targetScore: 2150,
    maxAma: 2,
    maxDeteriorations: 1,
    minSafety: 58,
    minSatisfaction: 52,
    rewards: { money: 150, satisfactionTokens: 20 }
  }
];

/* -------------------------------------------------------------------------
   4. Upgrade definitions
------------------------------------------------------------------------- */

const UPGRADE_DEFINITIONS = [
  {
    id: "largerTargets",
    name: "Larger Targets",
    description: "Increases clickable target size across microgames.",
    maxLevel: 4,
    baseCostMoney: 45,
    baseCostSatisfactionTokens: 0,
    costScale: 1.45,
    effect: "Microgame targets grow by 12 percent per level.",
    affectedSystems: ["all microgames"]
  },
  {
    id: "extraSeconds",
    name: "Extra Seconds",
    description: "Adds time to all microgames.",
    maxLevel: 4,
    baseCostMoney: 55,
    baseCostSatisfactionTokens: 4,
    costScale: 1.5,
    effect: "Adds 1.5 seconds to every microgame per level.",
    affectedSystems: ["all microgames"]
  },
  {
    id: "betterLobbyCommunication",
    name: "Better Lobby Communication",
    description: "Slows AMA/LBTC decay for all active patients.",
    maxLevel: 3,
    baseCostMoney: 0,
    baseCostSatisfactionTokens: 8,
    costScale: 1.55,
    effect: "Patients lose patience 8 percent slower per level.",
    affectedSystems: ["AMA/LBTC timers"]
  },
  {
    id: "smartPhrases",
    name: "Smart Phrases",
    description: "Makes documentation easier and faster.",
    maxLevel: 3,
    baseCostMoney: 45,
    baseCostSatisfactionTokens: 5,
    costScale: 1.5,
    effect: "Adds 2 seconds to Chart Sprint per level.",
    affectedSystems: ["documentation"]
  },
  {
    id: "improvedRoomTurnover",
    name: "Improved Room Turnover",
    description: "Makes Room Reset easier.",
    maxLevel: 3,
    baseCostMoney: 50,
    baseCostSatisfactionTokens: 0,
    costScale: 1.45,
    effect: "Adds 2 seconds to Room Reset per level.",
    affectedSystems: ["room reset"]
  },
  {
    id: "extraFastTrackChair",
    name: "Extra Fast Track Chair",
    description: "Adds an additional fast-track room to future shifts.",
    maxLevel: 1,
    baseCostMoney: 140,
    baseCostSatisfactionTokens: 0,
    costScale: 1,
    effect: "Adds Fast Track 3.",
    affectedSystems: ["room capacity"]
  },
  {
    id: "betterStethoscope",
    name: "Better Stethoscope",
    description: "Pulmonary exams are more forgiving.",
    maxLevel: 2,
    baseCostMoney: 60,
    baseCostSatisfactionTokens: 0,
    costScale: 1.4,
    effect: "Adds time to Auscultation.",
    affectedSystems: ["pulmonary exam"]
  },
  {
    id: "ekgTemplates",
    name: "EKG Templates",
    description: "EKG Capture gives more time for chest pain patients.",
    maxLevel: 2,
    baseCostMoney: 70,
    baseCostSatisfactionTokens: 4,
    costScale: 1.45,
    effect: "Adds time to EKG Capture.",
    affectedSystems: ["EKG"]
  },
  {
    id: "neuroChecklist",
    name: "Neuro Checklist",
    description: "FAST / Neuro Check gives more time.",
    maxLevel: 2,
    baseCostMoney: 65,
    baseCostSatisfactionTokens: 5,
    costScale: 1.45,
    effect: "Adds time to Neuro Check.",
    affectedSystems: ["neuro exam"]
  },
  {
    id: "abdominalExamGuide",
    name: "Abdominal Exam Guide",
    description: "Abdominal Palpation gives more time.",
    maxLevel: 2,
    baseCostMoney: 65,
    baseCostSatisfactionTokens: 4,
    costScale: 1.45,
    effect: "Adds time to Abdominal Palpation.",
    affectedSystems: ["abdominal exam"]
  },
  {
    id: "medicationCart",
    name: "Medication Cart",
    description: "Treatment microgames are smoother.",
    maxLevel: 3,
    baseCostMoney: 75,
    baseCostSatisfactionTokens: 0,
    costScale: 1.45,
    effect: "Adds time to Med Pass.",
    affectedSystems: ["treatments"]
  },
  {
    id: "comfortMeasures",
    name: "Comfort Measures",
    description: "Patient satisfaction and patience decay more slowly.",
    maxLevel: 3,
    baseCostMoney: 30,
    baseCostSatisfactionTokens: 8,
    costScale: 1.5,
    effect: "Further slows AMA/LBTC decay.",
    affectedSystems: ["satisfaction", "AMA/LBTC"]
  },
  {
    id: "criticalAlertSystem",
    name: "Critical Alert System",
    description: "Deterioration warnings appear earlier and more clearly.",
    maxLevel: 2,
    baseCostMoney: 80,
    baseCostSatisfactionTokens: 4,
    costScale: 1.45,
    effect: "Raises visual warning thresholds for critical patients.",
    affectedSystems: ["deterioration warnings"]
  },
  {
    id: "statusBoard",
    name: "Status Board",
    description: "Rooms needing action are easier to spot.",
    maxLevel: 2,
    baseCostMoney: 60,
    baseCostSatisfactionTokens: 0,
    costScale: 1.4,
    effect: "Adds stronger urgent styling to room states.",
    affectedSystems: ["ED floor visibility"]
  },
  {
    id: "comboBuffer",
    name: "Combo Buffer",
    description: "Slow or failed microgames hurt flow a bit less.",
    maxLevel: 3,
    baseCostMoney: 50,
    baseCostSatisfactionTokens: 5,
    costScale: 1.5,
    effect: "Reduces microgame failure penalties.",
    affectedSystems: ["flow", "satisfaction"]
  }
];

/* -------------------------------------------------------------------------
   5. Pathology definitions
------------------------------------------------------------------------- */

const PATHOLOGIES = {
  ankleSprain: {
    id: "ankleSprain",
    label: "Ankle Sprain",
    system: "MSK",
    complaint: "Ankle pain after a twisting injury",
    acuity: "low",
    vitals: { temp: "36.9", hr: 84, spo2: 99, bp: "124/78" },
    initialFindings: ["pain", "swelling"],
    requiredManeuvers: ["mskExam"],
    diagnosticUnlock: { findings: ["ankle_tenderness_normal_pulse"] },
    documentationRequired: ["vitals reviewed", "exam finding documented", "working diagnosis", "plan and return precautions"],
    treatments: ["xray", "splint"],
    dispositionOptions: ["discharge"],
    dispositionAction: "discharge",
    deteriorationTime: null,
    amaTime: 300,
    idealRoomTypes: ["fast_track", "standard"],
    unsafeRoomTypes: ["psych"],
    workflowSteps: ["rooming", "vitals", "mskExam", "documentation", "xray", "splint", "discharge", "cleanRoom"],
    introducedRound: 1,
    microgameDifficulty: 1,
    diagnosisLabel: "Ankle sprain",
    findingsByManeuver: { mskExam: ["ankle_tenderness_normal_pulse"] },
    requiredBeforeDisposition: ["xray", "splint"],
    stabilizingActions: []
  },
  pneumonia: {
    id: "pneumonia",
    label: "Pneumonia",
    system: "Pulmonary",
    complaint: "Cough, fever, and shortness of breath",
    acuity: "high",
    vitals: { temp: "39.1", hr: 118, spo2: 89, bp: "104/62" },
    initialFindings: ["fever", "tachycardia", "low_o2"],
    requiredManeuvers: ["pulmonaryExam"],
    diagnosticUnlock: { findings: ["fever", "low_o2", "focal_crackles"] },
    documentationRequired: ["vitals reviewed", "exam finding documented", "working diagnosis", "admit rationale"],
    treatments: ["oxygen", "antibiotics"],
    dispositionOptions: ["admit"],
    dispositionAction: "admit",
    deteriorationTime: 165,
    amaTime: 245,
    idealRoomTypes: ["standard", "resus"],
    unsafeRoomTypes: ["fast_track", "psych"],
    workflowSteps: ["rooming", "vitals", "pulmonaryExam", "documentation", "oxygen", "antibiotics", "admit", "cleanRoom"],
    introducedRound: 2,
    microgameDifficulty: 2,
    diagnosisLabel: "Pneumonia",
    findingsByManeuver: { pulmonaryExam: ["focal_crackles"] },
    requiredBeforeDisposition: ["oxygen", "antibiotics"],
    stabilizingActions: ["oxygen"]
  },
  asthma: {
    id: "asthma",
    label: "Asthma Exacerbation",
    system: "Pulmonary",
    complaint: "Wheezing and chest tightness",
    acuity: "high",
    vitals: { temp: "37.0", hr: 126, spo2: 91, bp: "132/78" },
    initialFindings: ["tachycardia", "low_o2"],
    requiredManeuvers: ["pulmonaryExam"],
    diagnosticUnlock: { findings: ["diffuse_wheezing"] },
    documentationRequired: ["vitals reviewed", "exam finding documented", "working diagnosis", "response plan"],
    treatments: ["nebulizer", "steroids"],
    dispositionOptions: ["discharge"],
    dispositionAction: "discharge",
    deteriorationTime: 150,
    amaTime: 235,
    idealRoomTypes: ["standard", "resus"],
    unsafeRoomTypes: ["psych"],
    workflowSteps: ["rooming", "vitals", "pulmonaryExam", "documentation", "nebulizer", "steroids", "reassessment", "discharge", "cleanRoom"],
    introducedRound: 3,
    microgameDifficulty: 2,
    diagnosisLabel: "Asthma exacerbation",
    findingsByManeuver: { pulmonaryExam: ["diffuse_wheezing"] },
    requiredBeforeDisposition: ["nebulizer", "steroids", "reassessment"],
    reassessmentRequired: true,
    stabilizingActions: ["nebulizer"]
  },
  stemi: {
    id: "stemi",
    label: "Chest Pain / STEMI",
    system: "Cardiac",
    complaint: "Crushing chest pressure",
    acuity: "high",
    vitals: { temp: "36.8", hr: 104, spo2: 96, bp: "156/94" },
    initialFindings: ["chest_pressure", "tachycardia"],
    requiredManeuvers: ["ekg"],
    diagnosticUnlock: { findings: ["st_elevation"] },
    documentationRequired: ["vitals reviewed", "EKG finding documented", "working diagnosis", "transfer rationale"],
    treatments: ["aspirin", "cathLab"],
    dispositionOptions: ["transfer"],
    dispositionAction: "transfer",
    deteriorationTime: 125,
    amaTime: 220,
    idealRoomTypes: ["resus", "standard"],
    unsafeRoomTypes: ["fast_track", "psych"],
    workflowSteps: ["rooming", "vitals", "ekg", "documentation", "aspirin", "cathLab", "transfer", "cleanRoom"],
    introducedRound: 4,
    microgameDifficulty: 3,
    diagnosisLabel: "STEMI",
    findingsByManeuver: { ekg: ["st_elevation"] },
    requiredBeforeDisposition: ["aspirin", "cathLab"],
    stabilizingActions: ["aspirin", "cathLab"]
  },
  appendicitis: {
    id: "appendicitis",
    label: "Appendicitis",
    system: "Abdominal",
    complaint: "Right lower belly pain",
    acuity: "medium",
    vitals: { temp: "38.2", hr: 110, spo2: 98, bp: "118/72" },
    initialFindings: ["fever", "tachycardia", "belly_pain"],
    requiredManeuvers: ["abdominalExam"],
    diagnosticUnlock: { findings: ["rlq_tenderness"] },
    documentationRequired: ["vitals reviewed", "exam finding documented", "working diagnosis", "surgery plan"],
    treatments: ["labs", "ctTransport", "surgeryConsult"],
    dispositionOptions: ["admit"],
    dispositionAction: "admit",
    deteriorationTime: null,
    amaTime: 260,
    idealRoomTypes: ["standard"],
    unsafeRoomTypes: ["fast_track", "psych"],
    workflowSteps: ["rooming", "vitals", "abdominalExam", "documentation", "labs", "ctTransport", "surgeryConsult", "admit", "cleanRoom"],
    introducedRound: 5,
    microgameDifficulty: 3,
    diagnosisLabel: "Appendicitis",
    findingsByManeuver: { abdominalExam: ["rlq_tenderness"] },
    requiredBeforeDisposition: ["labs", "ctTransport", "surgeryConsult"],
    stabilizingActions: []
  },
  stroke: {
    id: "stroke",
    label: "Stroke Symptoms",
    system: "Neuro",
    complaint: "Facial droop and speech difficulty",
    acuity: "high",
    vitals: { temp: "36.7", hr: 96, spo2: 97, bp: "184/102" },
    initialFindings: ["neuro_symptoms"],
    requiredManeuvers: ["neuroExam"],
    diagnosticUnlock: { findings: ["facial_droop", "arm_drift", "aphasia"] },
    documentationRequired: ["vitals reviewed", "neuro finding documented", "working diagnosis", "stroke destination"],
    treatments: ["ctTransport", "strokeAlert"],
    dispositionOptions: ["transfer"],
    dispositionAction: "transfer",
    deteriorationTime: 110,
    amaTime: 210,
    idealRoomTypes: ["resus", "standard"],
    unsafeRoomTypes: ["fast_track", "psych"],
    workflowSteps: ["rooming", "vitals", "neuroExam", "documentation", "ctTransport", "strokeAlert", "transfer", "cleanRoom"],
    introducedRound: 6,
    microgameDifficulty: 4,
    diagnosisLabel: "Stroke symptoms",
    findingsByManeuver: { neuroExam: ["facial_droop", "arm_drift", "aphasia", "gaze_preference"] },
    requiredBeforeDisposition: ["ctTransport", "strokeAlert"],
    stabilizingActions: ["strokeAlert"]
  }
};

/* -------------------------------------------------------------------------
   6. Game state
------------------------------------------------------------------------- */

let progress = loadProgress();

let game = null;

const elements = {};

function createRoomsForShift() {
  const templates = [...ROOM_TEMPLATES];
  if (getUpgradeLevel("extraFastTrackChair") > 0) {
    templates.splice(6, 0, EXTRA_FAST_TRACK_ROOM);
  }

  return templates.map((room) => ({
    ...room,
    patientId: null,
    dirty: false
  }));
}

function createEmptyGameState(round) {
  return {
    active: true,
    round,
    roundTimeRemaining: round.shiftSeconds,
    spawnCountdown: 1,
    patientsSpawned: 0,
    patients: [],
    rooms: createRoomsForShift(),
    selectedPatientId: null,
    selectedRoomId: null,
    score: 0,
    safety: 100,
    flow: 100,
    satisfaction: 100,
    roundMoney: 0,
    roundTokens: 0,
    eventLog: [],
    microgame: null,
    timerId: null,
    result: null,
    stats: {
      patientsSeen: 0,
      discharged: 0,
      admitted: 0,
      transferred: 0,
      successfulDispositions: 0,
      amaCount: 0,
      deteriorations: 0,
      roomsReset: 0,
      microgameFailures: 0,
      unsafePlacements: 0,
      resourceDelays: 0
    }
  };
}

/* -------------------------------------------------------------------------
   7. Initialization
------------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", init);

function init() {
  cacheElements();
  bindStaticEvents();
  renderRoundSelection();
  renderUpgradeScreen();
  showScreen("titleScreen");
}

function cacheElements() {
  [
    "titleScreen",
    "roundScreen",
    "gameScreen",
    "debriefScreen",
    "upgradeScreen",
    "startButton",
    "resetProgressButton",
    "roundCards",
    "roundMoneyValue",
    "roundTokensValue",
    "hudRound",
    "hudTimer",
    "hudScore",
    "hudSafety",
    "hudFlow",
    "hudSatisfaction",
    "hudMoney",
    "hudTokens",
    "hudWaiting",
    "hudAma",
    "abandonRoundButton",
    "lobbyCount",
    "lobbyList",
    "roomGrid",
    "detailsPanel",
    "eventLog",
    "debriefContent",
    "upgradeMoneyValue",
    "upgradeTokensValue",
    "rewardSummary",
    "upgradeList",
    "nextRoundButton",
    "replayRoundButton",
    "roundSelectButton",
    "microgameOverlay",
    "microgameActionLabel",
    "microgameTitle",
    "microgameInstructions",
    "microgameTimer",
    "microgameTimeBar",
    "microgameScene",
    "microgameFeedback"
  ].forEach((id) => {
    elements[id] = document.getElementById(id);
  });
}

function bindStaticEvents() {
  elements.startButton.addEventListener("click", () => {
    renderRoundSelection();
    showScreen("roundScreen");
  });

  elements.resetProgressButton.addEventListener("click", () => {
    if (window.confirm("Reset all ED Rush! progress?")) {
      resetProgress();
      logToConsoleOnly("Progress reset.");
    }
  });

  elements.roundCards.addEventListener("click", (event) => {
    const button = event.target.closest("[data-round-id]");
    if (!button || button.disabled) return;
    startRound(Number(button.dataset.roundId));
  });

  elements.roomGrid.addEventListener("click", (event) => {
    const roomButton = event.target.closest("[data-room-id]");
    if (!roomButton) return;
    handleRoomClick(roomButton.dataset.roomId);
  });

  elements.lobbyList.addEventListener("click", (event) => {
    const patientButton = event.target.closest("[data-patient-id]");
    if (!patientButton) return;
    selectLobbyPatient(patientButton.dataset.patientId);
  });

  elements.detailsPanel.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-action-id]");
    if (!actionButton || actionButton.disabled) return;
    startActionMicrogame(
      actionButton.dataset.actionId,
      actionButton.dataset.patientId || null,
      actionButton.dataset.roomId || null
    );
  });

  elements.microgameScene.addEventListener("click", (event) => {
    const target = event.target.closest("[data-micro-target]");
    if (!target) return;
    handleMicrogameTarget(target.dataset.microTarget);
  });

  elements.abandonRoundButton.addEventListener("click", () => {
    if (game && game.active && window.confirm("End this ED Rush! shift now?")) {
      endRound("shift ended early");
    }
  });

  elements.nextRoundButton.addEventListener("click", () => {
    if (!game || !game.result) return;
    const nextRound = getRoundById(game.result.roundId + 1);
    if (nextRound && isRoundUnlocked(nextRound.id)) {
      startRound(nextRound.id);
    } else {
      renderRoundSelection();
      showScreen("roundScreen");
    }
  });

  elements.replayRoundButton.addEventListener("click", () => {
    if (game && game.result) {
      startRound(game.result.roundId);
    }
  });

  elements.roundSelectButton.addEventListener("click", () => {
    renderRoundSelection();
    showScreen("roundScreen");
  });

  elements.upgradeList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-upgrade-id]");
    if (!button || button.disabled) return;
    purchaseUpgrade(button.dataset.upgradeId);
  });
}

function logToConsoleOnly(message) {
  console.info(`ED Rush!: ${message}`);
}

/* -------------------------------------------------------------------------
   8. Screen navigation
------------------------------------------------------------------------- */

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.toggle("active", screen.id === screenId);
  });
}

function startRound(roundId) {
  const round = getRoundById(roundId);
  if (!round || !isRoundUnlocked(roundId)) return;

  stopRoundTimer();
  game = createEmptyGameState(round);
  showScreen("gameScreen");
  addEvent(`Round ${round.id}: ${round.name} started.`, "info");
  addEvent(`${round.newlyIntroducedPathology} is in the case mix.`, "info");
  renderAll();

  game.timerId = window.setInterval(gameTick, TICK_MS);
}

function stopRoundTimer() {
  if (game && game.timerId) {
    window.clearInterval(game.timerId);
    game.timerId = null;
  }
}

/* -------------------------------------------------------------------------
   9. Rendering
------------------------------------------------------------------------- */

function renderAll() {
  if (!game) return;
  renderHud();
  renderLobby();
  renderRooms();
  renderDetails();
  renderEventLog();
  renderMicrogame();
}

function renderRoundSelection() {
  elements.roundMoneyValue.textContent = formatMoney(progress.money);
  elements.roundTokensValue.textContent = progress.satisfactionTokens;
  elements.roundCards.innerHTML = ROUND_DEFINITIONS.map((round) => {
    const unlocked = isRoundUnlocked(round.id);
    const completed = Boolean(progress.completedRounds[round.id]);
    const bestScore = progress.bestScores[round.id] || 0;
    const buttonText = !unlocked ? "Locked" : completed ? "Replay" : "Play";

    return `
      <article class="round-card ${unlocked ? "" : "locked"}">
        <p class="eyebrow">Round ${round.id}</p>
        <h2>${round.name}</h2>
        <dl>
          <dt>Introduces</dt><dd>${round.newlyIntroducedPathology}</dd>
          <dt>Difficulty</dt><dd>${round.difficulty}</dd>
          <dt>Status</dt><dd>${completed ? "Completed" : unlocked ? "Unlocked" : "Locked"}</dd>
          <dt>Best score</dt><dd>${bestScore}</dd>
          <dt>Goal</dt><dd>${round.requiredSuccessfulDispositions} dispositions</dd>
          <dt>Reward</dt><dd>${formatMoney(round.rewards.money)} + ${round.rewards.satisfactionTokens} tokens</dd>
        </dl>
        <button class="${unlocked ? "primary-button" : "ghost-button"}" data-round-id="${round.id}" ${unlocked ? "" : "disabled"}>
          ${buttonText}
        </button>
      </article>
    `;
  }).join("");
}

function renderHud() {
  const waitingCount = game.patients.filter((patient) => patient.location === "waiting" && !patient.hasLeftAma).length;

  elements.hudRound.textContent = `Round ${game.round.id}: ${game.round.name}`;
  elements.hudTimer.textContent = formatTime(game.roundTimeRemaining);
  elements.hudScore.textContent = Math.round(game.score);
  elements.hudSafety.textContent = Math.round(game.safety);
  elements.hudFlow.textContent = Math.round(game.flow);
  elements.hudSatisfaction.textContent = Math.round(game.satisfaction);
  elements.hudMoney.textContent = `${formatMoney(progress.money)} + ${formatMoney(game.roundMoney)}`;
  elements.hudTokens.textContent = `${progress.satisfactionTokens} + ${game.roundTokens}`;
  elements.hudWaiting.textContent = waitingCount;
  elements.hudAma.textContent = game.stats.amaCount;
  elements.lobbyCount.textContent = `${waitingCount} waiting`;
}

function renderLobby() {
  const waitingPatients = game.patients.filter((patient) => patient.location === "waiting" && !patient.hasLeftAma);

  if (waitingPatients.length === 0) {
    elements.lobbyList.innerHTML = `<div class="detail-block">No patients in the lobby right now.</div>`;
    return;
  }

  elements.lobbyList.innerHTML = waitingPatients.map((patient) => {
    const pathology = PATHOLOGIES[patient.pathology];
    const patiencePercent = getTimerPercent(patient.amaTimer, patient.amaTimerMax);
    const urgent = patiencePercent <= 25 || isDeteriorationWarning(patient);

    return `
      <button class="patient-card acuity-${patient.acuity} ${game.selectedPatientId === patient.id ? "selected" : ""} ${urgent ? "urgent" : ""}" data-patient-id="${patient.id}">
        <span class="patient-name">
          <span>${patient.name}</span>
          <span>${patient.age}${patient.sex}</span>
        </span>
        <span class="patient-meta">${pathology.complaint}</span>
        <span class="patient-meta">Acuity: ${capitalize(patient.acuity)}</span>
        <span class="bar-shell" aria-label="AMA/LBTC timer">
          <span class="bar-fill ${patiencePercent <= 10 ? "danger" : patiencePercent <= 25 ? "warn" : ""}" style="width:${patiencePercent}%"></span>
        </span>
        ${isDeteriorationWarning(patient) ? `<span class="patient-meta">Deterioration risk</span>` : ""}
        ${patiencePercent <= 10 ? `<span class="patient-meta">Leaving soon</span>` : ""}
      </button>
    `;
  }).join("");
}

function renderRooms() {
  elements.roomGrid.innerHTML = game.rooms.map((room) => {
    const patient = getPatientById(room.patientId);
    const status = patient ? derivePatientStatus(patient) : room.dirty ? "dirty - needs room reset" : "empty";
    const critical = patient && patient.deteriorated;
    const urgent = patient && (getTimerPercent(patient.amaTimer, patient.amaTimerMax) <= 25 || isDeteriorationWarning(patient));
    const selected = game.selectedRoomId === room.id;

    return `
      <button class="room room-${room.type} ${room.dirty ? "dirty" : ""} ${selected ? "selected" : ""} ${urgent ? "urgent" : ""} ${critical ? "critical" : ""}" data-room-id="${room.id}">
        <div class="room-label">
          <span>${room.name}</span>
          <span class="room-type">${formatRoomType(room.type)}</span>
        </div>
        <div class="room-status">
          ${patient ? renderRoomPatient(patient) : status}
        </div>
        ${patient ? renderRoomBars(patient) : ""}
        ${patient ? renderTaskChips(patient) : room.dirty ? `<div class="task-icons"><span>Reset</span><span>Clean</span></div>` : ""}
      </button>
    `;
  }).join("");
}

function renderRoomPatient(patient) {
  const pathology = PATHOLOGIES[patient.pathology];
  return `
    <div class="room-patient-row">
      <span class="patient-sprite patient-${patient.acuity} ${patient.pathology}"></span>
      <span>
        <strong>${patient.name}</strong><br>
        ${pathology.label}<br>
        ${derivePatientStatus(patient)}
      </span>
    </div>
  `;
}

function renderRoomBars(patient) {
  const patiencePercent = getTimerPercent(patient.amaTimer, patient.amaTimerMax);
  const deteriorationPercent = patient.deteriorationTimerMax
    ? getTimerPercent(patient.deteriorationTimer, patient.deteriorationTimerMax)
    : null;

  return `
    <div class="bar-shell" title="AMA/LBTC tolerance">
      <div class="bar-fill ${patiencePercent <= 10 ? "danger" : patiencePercent <= 25 ? "warn" : ""}" style="width:${patiencePercent}%"></div>
    </div>
    ${deteriorationPercent !== null ? `
      <div class="bar-shell" title="Deterioration timer">
        <div class="bar-fill ${deteriorationPercent <= 25 ? "danger" : deteriorationPercent <= 45 ? "warn" : ""}" style="width:${deteriorationPercent}%"></div>
      </div>
    ` : ""}
  `;
}

function renderTaskChips(patient) {
  const chips = [];
  if (!patient.vitalsRevealed) chips.push("Vitals");
  if (patient.vitalsRevealed && !allRequiredManeuversComplete(patient)) chips.push("Dx");
  if (patient.diagnosisUnlocked && !patient.documentationComplete) chips.push("Chart");
  if (patient.documentationComplete && !allTreatmentsComplete(patient)) chips.push("Treat");
  if (isReadyForDisposition(patient)) chips.push("Disposition");
  if (patient.deteriorated) chips.push("Critical");
  if (Object.keys(patient.pendingResults).length > 0) chips.push("Delay");

  return `<div class="task-icons">${chips.map((chip) => `<span>${chip}</span>`).join("")}</div>`;
}

function renderDetails() {
  const room = getRoomById(game.selectedRoomId);
  const selectedPatient = getPatientById(game.selectedPatientId);

  if (!room && selectedPatient && selectedPatient.location === "waiting") {
    elements.detailsPanel.innerHTML = renderWaitingPatientDetails(selectedPatient);
    return;
  }

  if (!room) {
    elements.detailsPanel.innerHTML = renderNoSelectionDetails();
    return;
  }

  const patient = getPatientById(room.patientId);

  if (!patient) {
    elements.detailsPanel.innerHTML = renderEmptyRoomDetails(room);
    return;
  }

  elements.detailsPanel.innerHTML = renderPatientRoomDetails(room, patient);
}

function renderNoSelectionDetails() {
  return `
    <div class="detail-block">
      <h3>Round goals</h3>
      ${renderRoundGoals()}
    </div>
    <div class="detail-block">
      <h3>Resources</h3>
      ${renderResourceStatus()}
    </div>
    <div class="detail-block">
      Select a waiting patient, then click an empty room to start the rooming microgame.
    </div>
  `;
}

function renderWaitingPatientDetails(patient) {
  const pathology = PATHOLOGIES[patient.pathology];
  return `
    <div class="detail-block">
      <h3>${patient.name}</h3>
      <ul class="detail-list">
        <li>${patient.age}${patient.sex} - ${pathology.complaint}</li>
        <li>Acuity: ${capitalize(patient.acuity)}</li>
        <li>AMA/LBTC tolerance: ${Math.ceil(patient.amaTimer)}s</li>
        <li>${patient.deteriorationTimer ? `Deterioration timer: ${Math.ceil(patient.deteriorationTimer)}s` : "No active deterioration timer"}</li>
      </ul>
    </div>
    <div class="detail-block">
      <h3>Rooming</h3>
      <p>Click an empty room to start Route to Room. Patients are not safe just because they are selected.</p>
    </div>
    <div class="detail-block">
      <h3>Round goals</h3>
      ${renderRoundGoals()}
    </div>
    <div class="detail-block">
      <h3>Resources</h3>
      ${renderResourceStatus()}
    </div>
  `;
}

function renderEmptyRoomDetails(room) {
  if (room.dirty) {
    return `
      <div class="detail-block">
        <h3>${room.name}</h3>
        <ul class="detail-list">
          <li>Type: ${formatRoomType(room.type)}</li>
          <li>Status: dirty</li>
        </ul>
      </div>
      <div class="detail-block">
        <h3>Available actions</h3>
        <div class="action-list">
          ${renderActionButton({ id: "cleanRoom", label: ACTIONS.cleanRoom.label, locked: false }, null, room)}
        </div>
      </div>
      <div class="detail-block">
        <h3>Resources</h3>
        ${renderResourceStatus()}
      </div>
    `;
  }

  return `
    <div class="detail-block">
      <h3>${room.name}</h3>
      <ul class="detail-list">
        <li>Type: ${formatRoomType(room.type)}</li>
        <li>Status: available</li>
      </ul>
    </div>
    <div class="detail-block">
      ${game.selectedPatientId ? "Click this room again to route the selected lobby patient here." : "Select a lobby patient, then click this room to start rooming."}
    </div>
    <div class="detail-block">
      <h3>Round goals</h3>
      ${renderRoundGoals()}
    </div>
  `;
}

function renderPatientRoomDetails(room, patient) {
  const pathology = PATHOLOGIES[patient.pathology];
  const actionItems = getActionItems(patient, room);

  return `
    <div class="detail-block">
      <h3>${room.name} - ${formatRoomType(room.type)}</h3>
      <ul class="detail-list">
        <li>${patient.name}, ${patient.age}${patient.sex}</li>
        <li>${pathology.complaint}</li>
        <li>Status: ${derivePatientStatus(patient)}</li>
        <li>AMA/LBTC timer: ${Math.max(0, Math.ceil(patient.amaTimer))}s</li>
        <li>${patient.deteriorationTimerMax ? `Deterioration timer: ${Math.max(0, Math.ceil(patient.deteriorationTimer))}s` : "No active deterioration timer"}</li>
      </ul>
    </div>
    <div class="detail-block">
      <h3>Vitals</h3>
      ${patient.vitalsRevealed ? renderVitals(patient.vitals) : `<ul class="detail-list"><li>Not obtained yet</li></ul>`}
    </div>
    <div class="detail-block">
      <h3>Findings and diagnosis</h3>
      <ul class="detail-list">
        <li>Known findings: ${patient.knownFindings.length ? patient.knownFindings.map(formatFinding).join(", ") : "none yet"}</li>
        <li>Completed maneuvers: ${patient.completedManeuvers.length ? patient.completedManeuvers.map(formatActionLabel).join(", ") : "none"}</li>
        <li>Diagnosis: ${patient.diagnosisUnlocked ? patient.diagnosisLabel : "locked"}</li>
        <li>Documentation: ${patient.documentationComplete ? "complete" : "incomplete"}</li>
        <li>Completed actions: ${patient.completedActions.length ? patient.completedActions.map(formatActionLabel).join(", ") : "none"}</li>
        <li>Pending resources: ${formatPendingResults(patient)}</li>
      </ul>
    </div>
    <div class="detail-block">
      <h3>Available actions</h3>
      <div class="action-list">
        ${actionItems.map((item) => renderActionButton(item, patient, room)).join("")}
      </div>
    </div>
    <div class="detail-block">
      <h3>Round goals</h3>
      ${renderRoundGoals()}
    </div>
    <div class="detail-block">
      <h3>Resources</h3>
      ${renderResourceStatus()}
    </div>
    <div class="detail-block">
      <h3>Upgrade reminder</h3>
      <ul class="detail-list">
        <li>Larger Targets, Extra Seconds, and Smart Phrases reduce microgame pressure.</li>
        <li>Better Lobby Communication and Comfort Measures slow AMA/LBTC risk.</li>
      </ul>
    </div>
  `;
}

function renderActionButton(item, patient, room) {
  const action = ACTIONS[item.id] || { label: item.label || item.id };
  return `
    <button
      class="action-button ${item.locked ? "locked" : ""}"
      data-action-id="${item.id}"
      data-patient-id="${patient ? patient.id : ""}"
      data-room-id="${room ? room.id : ""}"
      ${item.locked ? "disabled" : ""}
    >
      ${item.label || action.label}
      ${item.locked ? `<span class="action-reason">${item.reason}</span>` : ""}
    </button>
  `;
}

function renderRoundGoals() {
  const round = game.round;
  return `
    <ul class="detail-list">
      <li>Successful dispositions: ${game.stats.successfulDispositions}/${round.requiredSuccessfulDispositions}</li>
      <li>Max AMA/LBTC: ${game.stats.amaCount}/${round.maxAma}</li>
      <li>Max deteriorations: ${game.stats.deteriorations}/${round.maxDeteriorations}</li>
      <li>Minimum safety: ${round.minSafety}</li>
      <li>Minimum satisfaction: ${round.minSatisfaction}</li>
    </ul>
  `;
}

function renderResourceStatus() {
  const resourceStatus = getResourceStatus();
  return `
    <ul class="detail-list">
      <li>CT queue/delay: ${resourceStatus.ct}</li>
      <li>X-ray queue/delay: ${resourceStatus.xray}</li>
      <li>Lab delay: ${resourceStatus.lab}</li>
    </ul>
  `;
}

function renderVitals(vitals) {
  return `
    <ul class="detail-list">
      <li>Temp: ${vitals.temp}</li>
      <li>HR: ${vitals.hr}</li>
      <li>SpO2: ${vitals.spo2}</li>
      <li>BP: ${vitals.bp}</li>
    </ul>
  `;
}

function renderEventLog() {
  elements.eventLog.innerHTML = game.eventLog.slice(-10).reverse().map((entry) => {
    return `<div class="event-entry ${entry.level}">${entry.message}</div>`;
  }).join("");
}

function renderDebrief() {
  const result = game.result;
  const successLabel = result.success ? "Success" : "Failed";
  const feedback = getDebriefFeedback(result);

  elements.debriefContent.innerHTML = `
    <h2>${successLabel}: Round ${result.roundId} - ${result.roundName}</h2>
    <p>${feedback}</p>
    <div class="debrief-grid">
      ${renderDebriefStat("Final score", result.score)}
      ${renderDebriefStat("Safety", result.safety)}
      ${renderDebriefStat("Flow", result.flow)}
      ${renderDebriefStat("Satisfaction", result.satisfaction)}
      ${renderDebriefStat("Patients seen", result.stats.patientsSeen)}
      ${renderDebriefStat("Discharged", result.stats.discharged)}
      ${renderDebriefStat("Admitted/transferred", result.stats.admitted + result.stats.transferred)}
      ${renderDebriefStat("Left before complete", result.stats.amaCount)}
      ${renderDebriefStat("Preventable deteriorations", result.stats.deteriorations)}
      ${renderDebriefStat("Rooms reset", result.stats.roomsReset)}
      ${renderDebriefStat("Money earned", formatMoney(result.moneyEarned))}
      ${renderDebriefStat("Tokens earned", result.tokensEarned)}
    </div>
    <div class="detail-block">
      <h3>Main bottleneck</h3>
      <p>${result.bottleneck}</p>
    </div>
    <div class="debrief-actions">
      <button id="debriefUpgradeButton" class="primary-button">Go to upgrades</button>
      <button id="debriefRetryButton" class="secondary-button">Retry round</button>
      <button id="debriefRoundSelectButton" class="ghost-button">Round select</button>
    </div>
  `;

  document.getElementById("debriefUpgradeButton").addEventListener("click", () => {
    renderUpgradeScreen();
    showScreen("upgradeScreen");
  });
  document.getElementById("debriefRetryButton").addEventListener("click", () => startRound(result.roundId));
  document.getElementById("debriefRoundSelectButton").addEventListener("click", () => {
    renderRoundSelection();
    showScreen("roundScreen");
  });
}

function renderDebriefStat(label, value) {
  return `
    <div class="debrief-stat">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `;
}

function renderUpgradeScreen() {
  elements.upgradeMoneyValue.textContent = formatMoney(progress.money);
  elements.upgradeTokensValue.textContent = progress.satisfactionTokens;

  const result = game && game.result;
  elements.rewardSummary.innerHTML = result
    ? `
      <h2>Last round rewards</h2>
      <p>Round ${result.roundId}: ${result.roundName} - ${result.success ? "success" : "failed"}</p>
      <p>Earned ${formatMoney(result.moneyEarned)} and ${result.tokensEarned} Patient Satisfaction Tokens.</p>
    `
    : `
      <h2>Upgrade bay</h2>
      <p>Replay rounds to earn money and Patient Satisfaction Tokens for upgrades.</p>
    `;

  elements.upgradeList.innerHTML = UPGRADE_DEFINITIONS.map((upgrade) => renderUpgradeCard(upgrade)).join("");

  if (result) {
    const nextRound = getRoundById(result.roundId + 1);
    elements.nextRoundButton.disabled = !(nextRound && isRoundUnlocked(nextRound.id));
    elements.nextRoundButton.textContent = nextRound && isRoundUnlocked(nextRound.id) ? `Next: Round ${nextRound.id}` : "Next round locked";
    elements.replayRoundButton.disabled = false;
  } else {
    elements.nextRoundButton.disabled = true;
    elements.replayRoundButton.disabled = true;
  }
}

function renderUpgradeCard(upgrade) {
  const level = getUpgradeLevel(upgrade.id);
  const maxed = level >= upgrade.maxLevel;
  const cost = getUpgradeCost(upgrade);
  const canAfford = !maxed && progress.money >= cost.money && progress.satisfactionTokens >= cost.satisfactionTokens;

  return `
    <article class="upgrade-card">
      <h2>${upgrade.name}</h2>
      <p>${upgrade.description}</p>
      <dl>
        <dt>Level</dt><dd>${level}/${upgrade.maxLevel}</dd>
        <dt>Next cost</dt><dd>${maxed ? "Maxed" : `${formatMoney(cost.money)} + ${cost.satisfactionTokens} tokens`}</dd>
        <dt>Effect</dt><dd>${upgrade.effect}</dd>
        <dt>Affects</dt><dd>${upgrade.affectedSystems.join(", ")}</dd>
      </dl>
      <button class="${canAfford ? "primary-button" : "ghost-button"}" data-upgrade-id="${upgrade.id}" ${canAfford ? "" : "disabled"}>
        ${maxed ? "Max level" : canAfford ? "Purchase" : "Need resources"}
      </button>
    </article>
  `;
}

/* -------------------------------------------------------------------------
   10. Event handlers
------------------------------------------------------------------------- */

function selectLobbyPatient(patientId) {
  const patient = getPatientById(patientId);
  if (!patient || patient.location !== "waiting") return;

  game.selectedPatientId = patientId;
  game.selectedRoomId = null;
  renderAll();
}

function handleRoomClick(roomId) {
  const room = getRoomById(roomId);
  if (!room) return;

  const selectedPatient = getPatientById(game.selectedPatientId);
  const canRoomSelectedPatient = selectedPatient
    && selectedPatient.location === "waiting"
    && !room.patientId
    && !room.dirty;

  game.selectedRoomId = roomId;

  if (room.patientId) {
    game.selectedPatientId = room.patientId;
    renderAll();
    return;
  }

  if (canRoomSelectedPatient) {
    startActionMicrogame("rooming", selectedPatient.id, room.id);
    return;
  }

  renderAll();
}

/* -------------------------------------------------------------------------
   11. Patient spawning
------------------------------------------------------------------------- */

function gameTick() {
  if (!game || !game.active) return;

  game.roundTimeRemaining = Math.max(0, game.roundTimeRemaining - 1);

  processPatientSpawning();
  processPendingResults();
  processPatientTimers();
  processMicrogameTimer();
  checkRoundEnd();
  renderAll();
}

function processPatientSpawning() {
  if (game.patientsSpawned >= game.round.maxPatients) return;

  game.spawnCountdown -= 1;
  if (game.spawnCountdown > 0) return;

  spawnPatient();

  const jitter = Math.floor(Math.random() * 7) - 3;
  game.spawnCountdown = Math.max(8, game.round.spawnInterval + jitter);
}

function spawnPatient() {
  const pathologyId = choosePathologyForRound(game.round);
  const pathology = PATHOLOGIES[pathologyId];
  const patient = createPatient(pathology);

  game.patients.push(patient);
  game.patientsSpawned += 1;
  addEvent(`${patient.name} arrived: ${pathology.complaint}.`, pathology.acuity === "high" ? "alert" : "info");
}

function createPatient(pathology) {
  const sex = Math.random() > 0.5 ? "F" : "M";
  const age = getAgeForPathology(pathology.id);
  const amaMultiplier = getRoundTimerMultiplier();
  const amaTime = Math.round(pathology.amaTime * amaMultiplier);
  const deteriorationTime = pathology.deteriorationTime
    ? Math.round(pathology.deteriorationTime * getDeteriorationMultiplier())
    : null;

  return {
    id: `p${Date.now()}${Math.floor(Math.random() * 10000)}`,
    name: PATIENT_NAMES[Math.floor(Math.random() * PATIENT_NAMES.length)],
    age,
    sex,
    complaint: pathology.complaint,
    pathology: pathology.id,
    acuity: pathology.acuity,
    location: "waiting",
    roomId: null,
    vitals: { ...pathology.vitals },
    vitalsRevealed: false,
    knownFindings: [],
    completedManeuvers: [],
    documentation: [],
    completedActions: [],
    unlockedActions: [],
    pendingResults: {},
    waitTimer: 0,
    deteriorationTimer: deteriorationTime,
    deteriorationTimerMax: deteriorationTime,
    amaTimer: amaTime,
    amaTimerMax: amaTime,
    warnedPatienceLow: false,
    warnedPatienceCritical: false,
    warnedDeterioration: false,
    hasLeftAma: false,
    currentTask: null,
    status: "waiting",
    diagnosisUnlocked: false,
    diagnosisLabel: null,
    documentationComplete: false,
    readyForDisposition: false,
    dispositioned: false,
    deteriorated: false,
    stabilized: false,
    reassessed: false
  };
}

function choosePathologyForRound(round) {
  const pool = [];
  round.allowedPathologies.forEach((pathologyId) => {
    const pathology = PATHOLOGIES[pathologyId];
    const baseWeight = pathology.acuity === "high" ? 2 : pathology.acuity === "medium" ? 3 : 4;
    const introducedBonus = pathology.introducedRound === round.id ? 3 : 0;
    const weight = Math.max(1, baseWeight + introducedBonus);
    for (let index = 0; index < weight; index += 1) {
      pool.push(pathologyId);
    }
  });

  return pool[Math.floor(Math.random() * pool.length)];
}

/* -------------------------------------------------------------------------
   12. Room assignment
------------------------------------------------------------------------- */

function assignPatientToRoom(patient, room, result) {
  const pathology = PATHOLOGIES[patient.pathology];

  patient.location = "room";
  patient.roomId = room.id;
  patient.status = "occupied: needs initial assessment";
  room.patientId = patient.id;
  game.selectedPatientId = patient.id;
  game.selectedRoomId = room.id;
  game.stats.patientsSeen += 1;

  const unsafePlacement = pathology.unsafeRoomTypes.includes(room.type)
    || (patient.acuity === "high" && room.type === "fast_track");

  if (unsafePlacement) {
    game.stats.unsafePlacements += 1;
    changeScore(-75);
    changeSafety(-8);
    addEvent(`${patient.name} was placed in a risky room type.`, "alert");
  } else {
    changeScore(40 + getFastBonus(result.quality));
    changeFlow(2);
  }

  addEvent(`${patient.name} roomed in ${room.name}.`, "info");
}

/* -------------------------------------------------------------------------
   13. Action system
------------------------------------------------------------------------- */

function getActionItems(patient, room) {
  if (!patient || patient.hasLeftAma || patient.dispositioned) return [];

  const pathology = PATHOLOGIES[patient.pathology];
  const items = [];

  if (!patient.vitalsRevealed) {
    items.push({ id: "vitals", locked: false });
  }

  pathology.requiredManeuvers.forEach((actionId) => {
    if (patient.completedManeuvers.includes(actionId)) return;
    items.push({
      id: actionId,
      locked: !patient.vitalsRevealed,
      reason: "Complete vitals / initial assessment first."
    });
  });

  if (!patient.documentationComplete) {
    items.push({
      id: "documentation",
      locked: !patient.diagnosisUnlocked,
      reason: "Unlock the likely diagnosis first."
    });
  }

  pathology.treatments.forEach((actionId) => {
    if (patient.completedActions.includes(actionId)) return;
    const pendingSeconds = patient.pendingResults[actionId];
    items.push({
      id: actionId,
      locked: !patient.documentationComplete || pendingSeconds > 0,
      reason: !patient.documentationComplete
        ? "Complete documentation first."
        : pendingSeconds > 0
          ? `Resource pending: ${Math.ceil(pendingSeconds)}s.`
          : ""
    });
  });

  if (pathology.reassessmentRequired && !patient.reassessed) {
    const requiredTreatmentsDone = pathology.treatments.every((actionId) => patient.completedActions.includes(actionId));
    items.push({
      id: "reassessment",
      locked: !patient.documentationComplete || !requiredTreatmentsDone,
      reason: !patient.documentationComplete
        ? "Complete documentation first."
        : "Complete treatment before reassessment."
    });
  }

  if (!patient.dispositioned) {
    const dispositionAction = pathology.dispositionAction;
    const dispositionReady = isReadyForDisposition(patient);
    items.push({
      id: dispositionAction,
      locked: !dispositionReady,
      reason: getDispositionLockReason(patient)
    });
  }

  if (items.length === 0) {
    items.push({
      id: pathology.dispositionAction,
      locked: true,
      reason: "No action is currently available."
    });
  }

  return items;
}

function startActionMicrogame(actionId, patientId, roomId) {
  if (!game || !game.active || game.microgame) return;

  const room = getRoomById(roomId);
  const patient = getPatientById(patientId);
  const action = ACTIONS[actionId];
  if (!action) return;

  const validation = validateActionAvailability(actionId, patient, room);
  if (!validation.ok) {
    addEvent(validation.reason, "alert");
    renderAll();
    return;
  }

  const registry = MICROGAMES[action.microgame];
  const timeLimit = getMicrogameTimeLimit(registry, actionId, patient);
  const targets = buildMicrogameTargets(registry, actionId, patient, room);

  game.microgame = {
    actionId,
    patientId: patient ? patient.id : null,
    roomId: room ? room.id : null,
    microgameId: action.microgame,
    registry,
    targets,
    currentIndex: 0,
    errors: 0,
    timeLimit,
    timeRemaining: timeLimit,
    startedAt: performance.now(),
    lastWrongTarget: null
  };

  renderMicrogame();
}

function validateActionAvailability(actionId, patient, room) {
  if (actionId === "cleanRoom") {
    if (!room || !room.dirty || room.patientId) {
      return { ok: false, reason: "That room is not ready for reset." };
    }
    return { ok: true };
  }

  if (actionId === "rooming") {
    if (!patient || !room) {
      return { ok: false, reason: "Select a waiting patient and an empty room first." };
    }
    if (patient.location !== "waiting") {
      return { ok: false, reason: "That patient is no longer waiting." };
    }
    if (room.patientId || room.dirty) {
      return { ok: false, reason: "That room is not available." };
    }
    return { ok: true };
  }

  if (!patient || !room || room.patientId !== patient.id) {
    return { ok: false, reason: "Select an occupied room first." };
  }

  const item = getActionItems(patient, room).find((candidate) => candidate.id === actionId);
  if (!item) {
    return { ok: false, reason: "That action is not part of the current workflow." };
  }
  if (item.locked) {
    return { ok: false, reason: item.reason || "That action is locked." };
  }

  return { ok: true };
}

function applyActionSuccess(actionId, patient, room, result) {
  if (actionId === "rooming") {
    if (!patient || patient.hasLeftAma || patient.location !== "waiting") {
      addEvent("Rooming could not be completed because the patient is no longer waiting.", "alert");
      return;
    }
    assignPatientToRoom(patient, room, result);
    return;
  }

  if (actionId === "cleanRoom") {
    room.dirty = false;
    game.stats.roomsReset += 1;
    changeScore(SCORE_EVENTS.roomReset + getFastBonus(result.quality));
    changeFlow(4);
    addEvent(`${room.name} reset and available.`, "info");
    return;
  }

  if (!patient || patient.hasLeftAma || patient.dispositioned) return;

  if (actionId === "vitals") {
    patient.vitalsRevealed = true;
    addFindings(patient, PATHOLOGIES[patient.pathology].initialFindings);
    addCompletedManeuver(patient, "vitals");
    changeScore(SCORE_EVENTS.correctManeuver + getFastBonus(result.quality));
    changeFlow(2);
    addEvent(`${patient.name}: vitals obtained.`, "info");
    checkDiagnosisUnlock(patient);
    return;
  }

  const pathology = PATHOLOGIES[patient.pathology];

  if (pathology.requiredManeuvers.includes(actionId)) {
    addCompletedManeuver(patient, actionId);
    addFindings(patient, pathology.findingsByManeuver[actionId] || []);
    changeScore(SCORE_EVENTS.correctManeuver + getFastBonus(result.quality));
    changeFlow(3);
    addEvent(`${patient.name}: ${ACTIONS[actionId].label} completed.`, "info");
    checkDiagnosisUnlock(patient);
    return;
  }

  if (actionId === "documentation") {
    patient.documentationComplete = true;
    patient.documentation = [...pathology.documentationRequired];
    changeScore(SCORE_EVENTS.documentation + getFastBonus(result.quality));
    changeFlow(2);
    addEvent(`${patient.name}: documentation complete. Treatment and disposition actions unlocked.`, "info");
    return;
  }

  if (["discharge", "admit", "transfer"].includes(actionId)) {
    dispositionPatient(patient, room, actionId, result);
    return;
  }

  if (actionId === "reassessment") {
    patient.reassessed = true;
    addFindings(patient, ["improved_air_movement"]);
    addCompletedAction(patient, actionId);
    changeScore(SCORE_EVENTS.treatment + getFastBonus(result.quality));
    changeFlow(3);
    addEvent(`${patient.name}: reassessment complete.`, "info");
    return;
  }

  if (ACTIONS[actionId] && ACTIONS[actionId].resource) {
    startResourceDelay(patient, actionId, result);
    return;
  }

  addCompletedAction(patient, actionId);
  changeScore(SCORE_EVENTS.treatment + getFastBonus(result.quality));
  changeFlow(3);
  addEvent(`${patient.name}: ${ACTIONS[actionId].label} completed.`, "info");
}

function applyActionFailure(actionId, patient, room) {
  const penaltyBuffer = getUpgradeLevel("comboBuffer") * 0.2;
  const flowPenalty = Math.max(1, Math.round(5 * (1 - penaltyBuffer)));
  const satisfactionPenalty = Math.max(0, Math.round(2 * (1 - penaltyBuffer)));

  game.stats.microgameFailures += 1;
  changeScore(-25);
  changeFlow(-flowPenalty);
  changeSatisfaction(-satisfactionPenalty);

  const action = ACTIONS[actionId];
  addEvent(action ? action.failure : "Action delayed. Try again.", "alert");

  if (patient && patient.acuity === "high") {
    changeSafety(-1);
  }
}

function dispositionPatient(patient, room, actionId, result) {
  patient.dispositioned = true;
  patient.readyForDisposition = false;
  patient.status = "dispositioned";
  patient.location = "complete";
  patient.roomId = null;

  if (actionId === "discharge") {
    game.stats.discharged += 1;
    game.roundMoney += 10;
    game.roundTokens += 1;
  } else if (actionId === "admit") {
    game.stats.admitted += 1;
    game.roundMoney += 15;
  } else {
    game.stats.transferred += 1;
    game.roundMoney += 15;
  }

  game.stats.successfulDispositions += 1;
  room.patientId = null;
  room.dirty = true;
  changeScore(SCORE_EVENTS.disposition + getFastBonus(result.quality));
  changeFlow(5);
  changeSatisfaction(2);
  addEvent(`${patient.name} disposition complete. ${room.name} is dirty.`, "info");

  if (game.selectedPatientId === patient.id) {
    game.selectedPatientId = null;
  }
}

/* -------------------------------------------------------------------------
   14. Microgame registry
------------------------------------------------------------------------- */

const MICROGAMES = {
  rooming: {
    title: "Route to Room",
    instructions: "Click the route steps in order before the timer runs out.",
    type: "sequence",
    timeLimit: 7,
    targets: ["Lobby", "Hallway", "Room Door"]
  },
  vitals: {
    title: "Vitals Check",
    instructions: "Click each assessment tool in order.",
    type: "sequence",
    timeLimit: 8,
    targets: ["BP cuff", "Pulse ox", "Thermometer", "Heart rate"]
  },
  pulmonaryExam: {
    title: "Auscultation",
    instructions: "Listen to all lung fields in order.",
    type: "sequence",
    timeLimit: 9,
    targets: ["Left upper", "Right upper", "Left middle", "Right middle", "Left lower", "Right lower"]
  },
  ekg: {
    title: "EKG Capture",
    instructions: "Choose the key EKG finding.",
    type: "choice",
    timeLimit: 7,
    choices: ["Normal", "ST elevation", "Irregular rhythm"],
    correctChoice: "ST elevation"
  },
  neuroExam: {
    title: "FAST / Neuro Check",
    instructions: "Click the neuro checks in order.",
    type: "sequence",
    timeLimit: 8,
    targets: ["Face", "Arm", "Speech", "Gaze"]
  },
  abdominalExam: {
    title: "Abdominal Palpation",
    instructions: "Click all quadrants, then focus RLQ.",
    type: "sequence",
    timeLimit: 8,
    targets: ["RUQ", "LUQ", "LLQ", "RLQ"]
  },
  mskExam: {
    title: "Joint Check",
    instructions: "Check ankle landmarks and circulation.",
    type: "sequence",
    timeLimit: 8,
    targets: ["Lateral malleolus", "Medial malleolus", "Pulse", "Weight-bearing"]
  },
  labs: {
    title: "Tube Sort",
    instructions: "Click the tubes in order for the tray.",
    type: "sequence",
    timeLimit: 8,
    targets: ["Blue tube", "Purple tube", "Green tube", "Gold tube"]
  },
  xray: {
    title: "Position the Film",
    instructions: "Set up the patient, plate, and capture.",
    type: "sequence",
    timeLimit: 8,
    targets: ["Position patient", "Place plate", "Shield", "Capture"]
  },
  ctTransport: {
    title: "Transport Route",
    instructions: "Move from room to CT in the right order.",
    type: "sequence",
    timeLimit: 8,
    targets: ["Room door", "Hallway", "Elevator", "CT scanner"]
  },
  medication: {
    title: "Med Pass",
    instructions: "Match the treatment card and complete the pass.",
    type: "sequence",
    timeLimit: 7,
    targets: ["Verify patient", "Select treatment", "Complete action"]
  },
  documentation: {
    title: "Chart Sprint",
    instructions: "Click the required charting elements.",
    type: "sequence",
    timeLimit: 9,
    targets: ["Vitals reviewed", "Exam finding", "Working diagnosis", "Plan rationale"]
  },
  discharge: {
    title: "Discharge Packet",
    instructions: "Assemble the packet in order.",
    type: "sequence",
    timeLimit: 8,
    targets: ["Diagnosis", "Medication", "Return precautions", "Follow-up"]
  },
  admit: {
    title: "Handoff",
    instructions: "Give a concise handoff in order.",
    type: "sequence",
    timeLimit: 8,
    targets: ["Diagnosis", "Acuity", "Key finding", "Destination"]
  },
  reassessment: {
    title: "Response Check",
    instructions: "Confirm the treatment response.",
    type: "sequence",
    timeLimit: 7,
    targets: ["Work of breathing", "Repeat SpO2", "Lung sounds", "Disposition check"]
  },
  cleanRoom: {
    title: "Room Reset",
    instructions: "Reset the room so the next patient can be placed.",
    type: "sequence",
    timeLimit: 7,
    targets: ["Trash", "Linen", "Surfaces", "Restock"]
  }
};

/* -------------------------------------------------------------------------
   15. Microgame rendering and completion
------------------------------------------------------------------------- */

function renderMicrogame() {
  if (!game || !game.microgame) {
    elements.microgameOverlay.classList.add("hidden");
    return;
  }

  const microgame = game.microgame;
  const action = ACTIONS[microgame.actionId];
  const timePercent = getTimerPercent(microgame.timeRemaining, microgame.timeLimit);
  const targetSize = 68 * (1 + getUpgradeLevel("largerTargets") * 0.12);

  elements.microgameOverlay.classList.remove("hidden");
  elements.microgameActionLabel.textContent = action ? action.label : "Action";
  elements.microgameTitle.textContent = microgame.registry.title;
  elements.microgameInstructions.textContent = microgame.registry.instructions;
  elements.microgameTimer.textContent = Math.ceil(microgame.timeRemaining);
  elements.microgameTimeBar.style.width = `${timePercent}%`;
  elements.microgameTimeBar.className = timePercent <= 25 ? "danger" : "";
  elements.microgameScene.style.setProperty("--target-size", `${targetSize}px`);
  elements.microgameScene.innerHTML = renderMicrogameTargets(microgame);
  elements.microgameFeedback.textContent = getMicrogameFeedback(microgame);
}

function renderMicrogameTargets(microgame) {
  if (microgame.registry.type === "choice") {
    return microgame.targets.map((target) => {
      const wrong = microgame.lastWrongTarget === target.value;
      return `
        <button class="micro-target ${wrong ? "wrong" : ""}" data-micro-target="${target.value}">
          ${target.label}
        </button>
      `;
    }).join("");
  }

  return microgame.targets.map((target, index) => {
    const done = index < microgame.currentIndex;
    const next = index === microgame.currentIndex;
    const wrong = microgame.lastWrongTarget === String(index);
    return `
      <button class="micro-target ${done ? "done" : ""} ${next ? "next" : ""} ${wrong ? "wrong" : ""}" data-micro-target="${index}" ${done ? "disabled" : ""}>
        ${target.label}
      </button>
    `;
  }).join("");
}

function handleMicrogameTarget(value) {
  if (!game || !game.microgame) return;

  const microgame = game.microgame;
  microgame.lastWrongTarget = null;

  if (microgame.registry.type === "choice") {
    if (value === microgame.registry.correctChoice) {
      completeMicrogame(true);
      return;
    }

    microgame.errors += 1;
    microgame.timeRemaining = Math.max(0, microgame.timeRemaining - 1.5);
    microgame.lastWrongTarget = value;
    if (microgame.errors >= 2 || microgame.timeRemaining <= 0) {
      completeMicrogame(false);
      return;
    }
    renderMicrogame();
    return;
  }

  const targetIndex = Number(value);
  if (targetIndex === microgame.currentIndex) {
    microgame.currentIndex += 1;
    if (microgame.currentIndex >= microgame.targets.length) {
      completeMicrogame(true);
      return;
    }
  } else {
    microgame.errors += 1;
    microgame.timeRemaining = Math.max(0, microgame.timeRemaining - 1);
    microgame.lastWrongTarget = value;
    if (microgame.timeRemaining <= 0) {
      completeMicrogame(false);
      return;
    }
  }

  renderMicrogame();
}

function processMicrogameTimer() {
  if (!game || !game.microgame) return;

  game.microgame.timeRemaining = Math.max(0, game.microgame.timeRemaining - 1);
  if (game.microgame.timeRemaining <= 0) {
    completeMicrogame(false);
  }
}

function completeMicrogame(success) {
  if (!game || !game.microgame) return;

  const microgame = game.microgame;
  const patient = getPatientById(microgame.patientId);
  const room = getRoomById(microgame.roomId);
  const timeUsed = Math.max(0, microgame.timeLimit - microgame.timeRemaining);
  const qualityBase = microgame.timeRemaining / microgame.timeLimit;
  const quality = success ? clamp(0.35, 1, 0.45 + qualityBase - microgame.errors * 0.12) : 0;
  const result = {
    success,
    quality,
    timeUsed,
    delayPenalty: Math.max(0, microgame.errors * 2 + (quality < 0.55 ? 3 : 0)),
    findingsAdded: []
  };

  game.microgame = null;
  elements.microgameOverlay.classList.add("hidden");

  if (success) {
    applyActionSuccess(microgame.actionId, patient, room, result);
  } else {
    applyActionFailure(microgame.actionId, patient, room);
  }

  renderAll();
}

function getMicrogameFeedback(microgame) {
  if (microgame.registry.type === "choice") {
    return microgame.errors ? "Wrong read. Recheck the strip." : "Choose the correct finding.";
  }

  const nextTarget = microgame.targets[microgame.currentIndex];
  if (!nextTarget) return "Complete.";
  if (microgame.errors) return `Recover and click: ${nextTarget.label}`;
  return `Next: ${nextTarget.label}`;
}

function buildMicrogameTargets(registry, actionId, patient, room) {
  if (registry.type === "choice") {
    return registry.choices.map((choice) => ({ label: choice, value: choice }));
  }

  return registry.targets.map((target) => {
    if (target === "Select treatment") {
      return { label: ACTIONS[actionId] ? ACTIONS[actionId].label : target };
    }
    if (target === "Room Door" && room) {
      return { label: room.name };
    }
    if (target === "Diagnosis" && patient) {
      return { label: patient.diagnosisLabel || "Diagnosis" };
    }
    return { label: target };
  });
}

/* -------------------------------------------------------------------------
   16. Unlock logic
------------------------------------------------------------------------- */

function checkDiagnosisUnlock(patient) {
  if (patient.diagnosisUnlocked) return;

  const pathology = PATHOLOGIES[patient.pathology];
  const hasFindings = pathology.diagnosticUnlock.findings.every((finding) => patient.knownFindings.includes(finding));
  const hasManeuvers = pathology.requiredManeuvers.every((actionId) => patient.completedManeuvers.includes(actionId));

  if (hasFindings && hasManeuvers) {
    patient.diagnosisUnlocked = true;
    patient.diagnosisLabel = pathology.diagnosisLabel;
    patient.status = "diagnosis unlocked";
    changeScore(SCORE_EVENTS.efficientDiagnosis);
    addEvent(`${patient.name}: diagnosis unlocked - ${pathology.diagnosisLabel}.`, "info");
  }
}

function allRequiredManeuversComplete(patient) {
  const pathology = PATHOLOGIES[patient.pathology];
  return pathology.requiredManeuvers.every((actionId) => patient.completedManeuvers.includes(actionId));
}

function allTreatmentsComplete(patient) {
  const pathology = PATHOLOGIES[patient.pathology];
  return pathology.treatments.every((actionId) => patient.completedActions.includes(actionId));
}

function isReadyForDisposition(patient) {
  const pathology = PATHOLOGIES[patient.pathology];
  const requiredActionsDone = pathology.requiredBeforeDisposition.every((actionId) => patient.completedActions.includes(actionId));
  const noPendingResults = Object.keys(patient.pendingResults).length === 0;
  const reassessmentDone = !pathology.reassessmentRequired || patient.reassessed;

  return patient.documentationComplete && requiredActionsDone && noPendingResults && reassessmentDone;
}

function getDispositionLockReason(patient) {
  const pathology = PATHOLOGIES[patient.pathology];

  if (!patient.documentationComplete) return "Complete documentation first.";

  const pendingAction = Object.keys(patient.pendingResults)[0];
  if (pendingAction) return `${formatActionLabel(pendingAction)} result pending.`;

  const missingAction = pathology.requiredBeforeDisposition.find((actionId) => !patient.completedActions.includes(actionId));
  if (missingAction) return `Complete ${formatActionLabel(missingAction)} first.`;

  if (pathology.reassessmentRequired && !patient.reassessed) return "Complete reassessment first.";

  return "";
}

/* -------------------------------------------------------------------------
   17. AMA/LBTC logic
------------------------------------------------------------------------- */

function processPatientTimers() {
  game.patients.forEach((patient) => {
    if (patient.hasLeftAma || patient.dispositioned) return;

    patient.waitTimer += 1;
    patient.amaTimer = Math.max(0, patient.amaTimer - getAmaDecayPerSecond(patient));

    const patiencePercent = getTimerPercent(patient.amaTimer, patient.amaTimerMax);
    if (patiencePercent <= 25 && !patient.warnedPatienceLow) {
      patient.warnedPatienceLow = true;
      addEvent(`${patient.name} is close to leaving before treatment is complete.`, "alert");
    }
    if (patiencePercent <= 10 && !patient.warnedPatienceCritical) {
      patient.warnedPatienceCritical = true;
      addEvent(`${patient.name} may leave before treatment is complete.`, "danger");
    }
    if (patient.amaTimer <= 0) {
      handlePatientLeaves(patient);
      return;
    }

    processDeteriorationTimer(patient);
  });
}

function handlePatientLeaves(patient) {
  const penalty = AMA_PENALTIES[patient.acuity];
  const room = getRoomById(patient.roomId);

  patient.hasLeftAma = true;
  patient.location = "left";
  patient.status = "left before treatment complete";
  patient.roomId = null;
  game.stats.amaCount += 1;

  if (room) {
    room.patientId = null;
    room.dirty = true;
  }

  changeScore(penalty.score);
  changeSafety(penalty.safety);
  changeSatisfaction(penalty.satisfaction);

  if (game.selectedPatientId === patient.id) {
    game.selectedPatientId = null;
  }

  addEvent(`${patient.name} left before treatment was complete.`, "danger");
}

function getAmaDecayPerSecond(patient) {
  const communicationSlowdown = getUpgradeLevel("betterLobbyCommunication") * 0.08;
  const comfortSlowdown = getUpgradeLevel("comfortMeasures") * 0.05;
  const highAcuityPressure = patient.acuity === "high" && patient.location === "waiting" ? 0.12 : 0;
  return clamp(0.45, 1.35, 1 + highAcuityPressure - communicationSlowdown - comfortSlowdown);
}

/* -------------------------------------------------------------------------
   18. Deterioration logic
------------------------------------------------------------------------- */

function processDeteriorationTimer(patient) {
  if (!patient.deteriorationTimerMax || patient.deteriorated || patient.stabilized) return;

  patient.deteriorationTimer = Math.max(0, patient.deteriorationTimer - 1);
  const warningThreshold = getUpgradeLevel("criticalAlertSystem") > 0 ? 45 : 25;
  const deteriorationPercent = getTimerPercent(patient.deteriorationTimer, patient.deteriorationTimerMax);

  if (deteriorationPercent <= warningThreshold && !patient.warnedDeterioration) {
    patient.warnedDeterioration = true;
    addEvent(`${patient.name} is at risk of deterioration.`, "alert");
  }

  if (patient.deteriorationTimer <= 0) {
    handleDeterioration(patient);
  }
}

function handleDeterioration(patient) {
  patient.deteriorated = true;
  patient.status = "critical/deteriorating";
  game.stats.deteriorations += 1;
  changeScore(SCORE_EVENTS.deterioration);
  changeSafety(-15);
  changeSatisfaction(-4);
  addEvent(`${patient.name} deteriorated. Stabilize and disposition quickly.`, "danger");
}

function applyTreatmentEffects(patient, actionId) {
  const pathology = PATHOLOGIES[patient.pathology];
  if (pathology.stabilizingActions.includes(actionId)) {
    patient.stabilized = true;
    patient.deteriorationTimer = patient.deteriorationTimerMax || patient.deteriorationTimer;
    addEvent(`${patient.name} stabilized after ${ACTIONS[actionId].label}.`, "info");
  }
}

/* -------------------------------------------------------------------------
   19. Scoring and timers
------------------------------------------------------------------------- */

function changeScore(amount) {
  game.score = Math.max(0, game.score + amount);
}

function changeSafety(amount) {
  game.safety = clamp(0, 100, game.safety + amount);
}

function changeFlow(amount) {
  game.flow = clamp(0, 100, game.flow + amount);
}

function changeSatisfaction(amount) {
  game.satisfaction = clamp(0, 100, game.satisfaction + amount);
}

function getFastBonus(quality) {
  if (quality < 0.6) return 0;
  const bonusRange = SCORE_EVENTS.fastBonusMax - SCORE_EVENTS.fastBonusMin;
  return Math.round(SCORE_EVENTS.fastBonusMin + bonusRange * quality);
}

function getRoundTimerMultiplier() {
  const roundPenalty = Math.max(0, game.round.id - 1) * 0.035;
  return clamp(0.72, 1, 1 - roundPenalty);
}

function getDeteriorationMultiplier() {
  const roundPenalty = Math.max(0, game.round.id - 1) * 0.04;
  return clamp(0.65, 1, 1 - roundPenalty);
}

function getMicrogameTimeLimit(registry, actionId, patient) {
  let seconds = registry.timeLimit;
  const pathology = patient ? PATHOLOGIES[patient.pathology] : null;
  const difficultyPenalty = pathology ? Math.max(0, pathology.microgameDifficulty - 1) * 0.45 : 0;

  seconds -= difficultyPenalty;
  seconds += getUpgradeLevel("extraSeconds") * 1.5;

  if (actionId === "documentation") seconds += getUpgradeLevel("smartPhrases") * 2;
  if (actionId === "cleanRoom") seconds += getUpgradeLevel("improvedRoomTurnover") * 2;
  if (registry === MICROGAMES.pulmonaryExam) seconds += getUpgradeLevel("betterStethoscope") * 1.5;
  if (registry === MICROGAMES.ekg) seconds += getUpgradeLevel("ekgTemplates") * 1.5;
  if (registry === MICROGAMES.neuroExam) seconds += getUpgradeLevel("neuroChecklist") * 1.5;
  if (registry === MICROGAMES.abdominalExam) seconds += getUpgradeLevel("abdominalExamGuide") * 1.5;
  if (registry === MICROGAMES.medication) seconds += getUpgradeLevel("medicationCart") * 1.25;

  return Math.max(4, Math.round(seconds));
}

function addEvent(message, level = "info") {
  if (!game) return;
  game.eventLog.push({ message, level, at: Date.now() });
  if (game.eventLog.length > 40) {
    game.eventLog.shift();
  }
}

function startResourceDelay(patient, actionId, result) {
  const baseDelay = BASE_RESOURCE_DELAYS[actionId] || 8;
  const roundDelay = Math.max(0, game.round.id - 2);
  const delay = Math.max(3, baseDelay + roundDelay + result.delayPenalty);

  patient.pendingResults[actionId] = delay;
  game.stats.resourceDelays += delay;
  changeScore(SCORE_EVENTS.resourceStarted + getFastBonus(result.quality));
  changeFlow(result.delayPenalty ? -2 : 1);
  addEvent(`${patient.name}: ${ACTIONS[actionId].label} started. Result delay ${delay}s.`, "info");
}

function processPendingResults() {
  game.patients.forEach((patient) => {
    Object.keys(patient.pendingResults).forEach((actionId) => {
      patient.pendingResults[actionId] = Math.max(0, patient.pendingResults[actionId] - 1);
      if (patient.pendingResults[actionId] <= 0) {
        delete patient.pendingResults[actionId];
        addCompletedAction(patient, actionId);
        addResourceFinding(patient, actionId);
        changeScore(30);
        addEvent(`${patient.name}: ${ACTIONS[actionId].label} resulted.`, "info");
      }
    });
  });
}

function addResourceFinding(patient, actionId) {
  if (actionId === "xray") addFindings(patient, ["xray_complete"]);
  if (actionId === "labs") addFindings(patient, ["labs_complete"]);
  if (actionId === "ctTransport") addFindings(patient, ["ct_complete"]);
}

/* -------------------------------------------------------------------------
   20. Round success/failure logic
------------------------------------------------------------------------- */

function checkRoundEnd() {
  if (!game || !game.active) return;

  const goalsMet = game.stats.successfulDispositions >= game.round.requiredSuccessfulDispositions
    && game.stats.amaCount <= game.round.maxAma
    && game.stats.deteriorations <= game.round.maxDeteriorations
    && game.safety >= game.round.minSafety
    && game.satisfaction >= game.round.minSatisfaction;

  if (goalsMet) {
    endRound("goals met");
    return;
  }

  if (game.roundTimeRemaining <= 0) {
    endRound("shift timer ended");
    return;
  }

  if (game.safety <= 0 || game.satisfaction <= 0) {
    endRound("score threshold failed");
  }
}

function endRound(reason) {
  if (!game || !game.active) return;

  game.active = false;
  stopRoundTimer();
  game.microgame = null;
  elements.microgameOverlay.classList.add("hidden");

  const result = buildRoundResult(reason);
  game.result = result;
  awardRoundRewards(result);
  renderDebrief();
  showScreen("debriefScreen");
}

function buildRoundResult(reason) {
  const round = game.round;
  const success = game.stats.successfulDispositions >= round.requiredSuccessfulDispositions
    && game.stats.amaCount <= round.maxAma
    && game.stats.deteriorations <= round.maxDeteriorations
    && game.safety >= round.minSafety
    && game.satisfaction >= round.minSatisfaction;

  const baseRewards = calculateRoundRewards(success);

  return {
    roundId: round.id,
    roundName: round.name,
    reason,
    success,
    score: Math.round(game.score),
    safety: Math.round(game.safety),
    flow: Math.round(game.flow),
    satisfaction: Math.round(game.satisfaction),
    stats: { ...game.stats },
    moneyEarned: baseRewards.money,
    tokensEarned: baseRewards.satisfactionTokens,
    bottleneck: inferBottleneck()
  };
}

/* -------------------------------------------------------------------------
   21. Currency rewards
------------------------------------------------------------------------- */

function calculateRoundRewards(success) {
  const round = game.round;
  let money = game.roundMoney;
  let satisfactionTokens = game.roundTokens;
  const completedCare = game.stats.successfulDispositions > 0;

  if (completedCare && game.stats.amaCount === 0) satisfactionTokens += 5;
  if (completedCare && game.stats.deteriorations === 0) satisfactionTokens += 5;
  if (completedCare && game.satisfaction >= 85) satisfactionTokens += 10;
  if (completedCare && game.flow >= 85) money += 25;
  if (success) {
    money += round.rewards.money;
    satisfactionTokens += round.rewards.satisfactionTokens;
  }

  if (!success) {
    money = Math.round(money * 0.5);
    satisfactionTokens = Math.round(satisfactionTokens * 0.5);
  }

  if (progress.completedRounds[round.id]) {
    money = Math.round(money * 0.6);
    satisfactionTokens = Math.round(satisfactionTokens * 0.6);
  }

  return { money, satisfactionTokens };
}

function awardRoundRewards(result) {
  progress.money += result.moneyEarned;
  progress.satisfactionTokens += result.tokensEarned;
  progress.bestScores[result.roundId] = Math.max(progress.bestScores[result.roundId] || 0, result.score);

  if (result.success) {
    progress.completedRounds[result.roundId] = true;
    const nextRound = getRoundById(result.roundId + 1);
    if (nextRound && !progress.unlockedRounds.includes(nextRound.id)) {
      progress.unlockedRounds.push(nextRound.id);
    }
  }

  saveProgress();
}

/* -------------------------------------------------------------------------
   22. Upgrade purchasing
------------------------------------------------------------------------- */

function purchaseUpgrade(upgradeId) {
  const upgrade = UPGRADE_DEFINITIONS.find((candidate) => candidate.id === upgradeId);
  if (!upgrade) return;

  const level = getUpgradeLevel(upgradeId);
  if (level >= upgrade.maxLevel) return;

  const cost = getUpgradeCost(upgrade);
  if (progress.money < cost.money || progress.satisfactionTokens < cost.satisfactionTokens) return;

  progress.money -= cost.money;
  progress.satisfactionTokens -= cost.satisfactionTokens;
  progress.upgradeLevels[upgradeId] = level + 1;
  saveProgress();
  renderUpgradeScreen();
}

function getUpgradeLevel(upgradeId) {
  return progress.upgradeLevels[upgradeId] || 0;
}

function getUpgradeCost(upgrade) {
  const level = getUpgradeLevel(upgrade.id);
  return {
    money: Math.round(upgrade.baseCostMoney * Math.pow(upgrade.costScale, level)),
    satisfactionTokens: Math.round(upgrade.baseCostSatisfactionTokens * Math.pow(upgrade.costScale, level))
  };
}

/* -------------------------------------------------------------------------
   23. Round debrief
------------------------------------------------------------------------- */

function inferBottleneck() {
  if (game.stats.amaCount > 0) {
    return "Several patients left before treatment was complete. Complete documentation and disposition sooner.";
  }
  if (game.stats.deteriorations > 0) {
    return "High-acuity patients waited too long before stabilizing actions or diagnostic maneuvers.";
  }
  if (game.stats.microgameFailures >= 3) {
    return "Microgame delays slowed down your overall flow. Larger Targets or Extra Seconds would help.";
  }
  if (game.rooms.some((room) => room.dirty)) {
    return "Dirty rooms were a major bottleneck. Room Reset timing matters.";
  }
  if (game.flow >= 85) {
    return "Strong work keeping rooms turning over.";
  }
  return "The shift bottleneck was overall sequencing. Look for the highest-risk timer before starting the next microgame.";
}

function getDebriefFeedback(result) {
  if (result.success && result.stats.amaCount === 0 && result.stats.deteriorations === 0) {
    return "Strong work keeping patients moving without safety events.";
  }
  if (result.stats.amaCount > 0) {
    return "Several patients left before treatment was complete. Try completing documentation and disposition sooner.";
  }
  if (result.stats.deteriorations > 0) {
    return "High-acuity patients waited too long before diagnostic maneuvers or stabilizing treatment.";
  }
  if (!result.success) {
    return "Consider replaying an earlier round to earn upgrades before retrying.";
  }
  return "Solid shift. Look for room reset and resource timing opportunities.";
}

/* -------------------------------------------------------------------------
   Shared helpers
------------------------------------------------------------------------- */

function getRoundById(roundId) {
  return ROUND_DEFINITIONS.find((round) => round.id === roundId);
}

function isRoundUnlocked(roundId) {
  return progress.unlockedRounds.includes(roundId);
}

function getPatientById(patientId) {
  if (!patientId || !game) return null;
  return game.patients.find((patient) => patient.id === patientId) || null;
}

function getRoomById(roomId) {
  if (!roomId || !game) return null;
  return game.rooms.find((room) => room.id === roomId) || null;
}

function addFindings(patient, findings) {
  findings.forEach((finding) => {
    if (!patient.knownFindings.includes(finding)) {
      patient.knownFindings.push(finding);
    }
  });
}

function addCompletedManeuver(patient, actionId) {
  if (!patient.completedManeuvers.includes(actionId)) {
    patient.completedManeuvers.push(actionId);
  }
}

function addCompletedAction(patient, actionId) {
  if (!patient.completedActions.includes(actionId)) {
    patient.completedActions.push(actionId);
  }
  applyTreatmentEffects(patient, actionId);
}

function derivePatientStatus(patient) {
  if (patient.hasLeftAma) return "left before treatment complete";
  if (patient.deteriorated) return "critical/deteriorating";
  if (!patient.vitalsRevealed) return "occupied: needs initial assessment";
  if (!allRequiredManeuversComplete(patient)) return "needs diagnostic maneuver";
  if (!patient.diagnosisUnlocked) return "diagnostic maneuver completed";
  if (!patient.documentationComplete) return "needs documentation";
  if (Object.keys(patient.pendingResults).length > 0) return "treatment in progress";
  if (!allTreatmentsComplete(patient)) return "treatment unlocked";
  if (PATHOLOGIES[patient.pathology].reassessmentRequired && !patient.reassessed) return "needs reassessment";
  if (isReadyForDisposition(patient)) return "ready for disposition";
  if (patient.dispositioned) return "dispositioned";
  return "occupied";
}

function getResourceStatus() {
  const status = { ct: "ready", xray: "ready", lab: "ready" };
  const resourceTimers = { ct: [], xray: [], lab: [] };

  game.patients.forEach((patient) => {
    Object.entries(patient.pendingResults).forEach(([actionId, seconds]) => {
      const resource = ACTIONS[actionId] && ACTIONS[actionId].resource;
      if (resource && resourceTimers[resource]) {
        resourceTimers[resource].push(seconds);
      }
    });
  });

  Object.entries(resourceTimers).forEach(([resource, timers]) => {
    if (timers.length) {
      status[resource] = `${timers.length} pending, ${Math.ceil(Math.min(...timers))}s next`;
    }
  });

  return status;
}

function formatPendingResults(patient) {
  const entries = Object.entries(patient.pendingResults);
  if (!entries.length) return "none";
  return entries.map(([actionId, seconds]) => `${formatActionLabel(actionId)} ${Math.ceil(seconds)}s`).join(", ");
}

function isDeteriorationWarning(patient) {
  if (!patient.deteriorationTimerMax || patient.stabilized || patient.deteriorated) return patient.deteriorated;
  const threshold = getUpgradeLevel("criticalAlertSystem") > 0 ? 45 : 25;
  return getTimerPercent(patient.deteriorationTimer, patient.deteriorationTimerMax) <= threshold;
}

function formatActionLabel(actionId) {
  return ACTIONS[actionId] ? ACTIONS[actionId].label : actionId;
}

function formatFinding(finding) {
  return FINDING_LABELS[finding] || finding.replaceAll("_", " ");
}

function formatRoomType(type) {
  return type.replace("_", " ");
}

function formatMoney(value) {
  return `$${Math.round(value)}`;
}

function formatTime(seconds) {
  const safeSeconds = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function getTimerPercent(current, max) {
  if (!max) return 0;
  return clamp(0, 100, (current / max) * 100);
}

function getAgeForPathology(pathologyId) {
  if (pathologyId === "stroke" || pathologyId === "pneumonia") return randomInt(58, 86);
  if (pathologyId === "stemi") return randomInt(45, 78);
  if (pathologyId === "appendicitis") return randomInt(18, 48);
  if (pathologyId === "asthma") return randomInt(12, 55);
  return randomInt(16, 68);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function clamp(min, max, value) {
  return Math.min(max, Math.max(min, value));
}
