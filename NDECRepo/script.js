const LEVELS = [
  "Neurology Foundations",
  "Clinical Essentials",
  "Core Neurology Practice",
  "Advanced & Subspecialty"
];

const SPECIALTIES = [
  "Digital Education",
  "General Neurology",
  "Behavioral Neurology & Neuropsychiatry",
  "Epilepsy & Clinical Neurophysiology",
  "Headache Medicine",
  "Movement Disorders",
  "Multiple Sclerosis & Neuroimmunology",
  "Neuromuscular Medicine",
  "Neurocritical Care",
  "Neurohospitalist & Acute Neurology",
  "Neuro-oncology",
  "Neuro-ophthalmology",
  "Neuro-otology",
  "Sleep Neurology",
  "Vascular Neurology & Stroke",
  "Pediatric Neurology",
  "Neurogenetics",
  "Autonomic Disorders",
  "Palliative Neurology"
];

const FORMAT_LABELS = {
  video: "Video",
  infographic: "Infographic",
  module: "Online module",
  article: "Article",
  toolkit: "Toolkit",
  game: "Game",
  reference: "Reference",
  podcast: "Podcast"
};

const FORMAT_ICONS = {
  video: "▶",
  infographic: "i",
  module: "◫",
  article: "¶",
  toolkit: "+",
  game: "#",
  reference: "A–Z",
  podcast: "◉"
};

const REVIEW_LABELS = {
  ndec: "NDEC Peer Reviewed"
};

const ACCESS_LABELS = {
  free: "Free / open access",
  login: "Free login required",
  member: "AAN member login",
  paid: "Paid access",
  mixed: "Mixed access"
};

const RESOURCES = [
  {
    id: 1,
    title: "NDEC Technology Toolkit",
    creator: "Neurology Digital Education Collaborative",
    description: "A curated guide to digital tools for education, clinical care, research, advocacy, productivity, graphics, AI, and digital scholarship.",
    level: "Neurology Foundations",
    specialties: ["Digital Education"],
    population: "both",
    format: "toolkit",
    review: null,
    access: "free",
    duration: "Self-paced",
    year: 2026,
    featured: 100,
    url: "https://ndec.institute/ndec-toolkit",
    tags: ["technology", "teaching tools", "AI", "graphics", "productivity", "digital scholarship"]
  },
  {
    id: 2,
    title: "Digital Education and Game Development: Neurdle",
    creator: "Ali Christy and NDEC",
    description: "A practical reflection on using games to make neurology learning approachable, memorable, and easy to share in digital communities.",
    level: "Clinical Essentials",
    specialties: ["Digital Education", "General Neurology", "Pediatric Neurology"],
    population: "both",
    format: "article",
    review: null,
    access: "free",
    duration: "6 min read",
    year: 2023,
    featured: 78,
    url: "https://ndec.institute/blog/wvh9i28g63k54nx5djiskkvkomnuxy",
    tags: ["gamification", "game design", "teaching", "digital scholarship"]
  },
  {
    id: 3,
    title: "Putting Social Media on Your CV",
    creator: "Ali Christy and NDEC",
    description: "Suggestions for documenting digital education, podcasts, social media portfolios, and online scholarly impact for promotion and career development.",
    level: "Clinical Essentials",
    specialties: ["Digital Education"],
    population: "both",
    format: "article",
    review: null,
    access: "free",
    duration: "7 min read",
    year: 2023,
    featured: 64,
    url: "https://ndec.institute/blog/godtxmk3o34ue52kskygz06wkwgjrx",
    tags: ["career", "social media", "portfolio", "promotion", "digital scholarship"]
  },
  {
    id: 4,
    title: "Neurdle: A Daily Neurology Word Game",
    creator: "Zachary London and Ali Christy",
    description: "A free daily word puzzle built around neurologic terms, names, and abbreviations, with a short learning point after each game.",
    level: "Neurology Foundations",
    specialties: ["Digital Education", "General Neurology", "Neurogenetics"],
    population: "both",
    format: "game",
    review: null,
    access: "free",
    duration: "3–5 min",
    year: 2026,
    featured: 82,
    url: "https://neurdle.com/",
    tags: ["gamification", "vocabulary", "daily learning", "microlearning"]
  },
  {
    id: 5,
    title: "NeuroBytes® Free Educational Videos",
    creator: "American Academy of Neurology",
    description: "A growing catalog of three-to-six-minute videos covering hot topics and emerging trends across neurology subspecialties.",
    level: "Clinical Essentials",
    specialties: ["General Neurology", "Vascular Neurology & Stroke", "Epilepsy & Clinical Neurophysiology", "Movement Disorders", "Headache Medicine", "Multiple Sclerosis & Neuroimmunology", "Neuromuscular Medicine", "Neuro-oncology", "Sleep Neurology"],
    population: "both",
    format: "video",
    review: null,
    access: "member",
    duration: "3–6 min each",
    year: 2026,
    featured: 98,
    url: "https://www.aan.com/education/neurobytes",
    tags: ["microlearning", "bite-sized", "AAN", "clinical update", "subspecialty"]
  },
  {
    id: 6,
    title: "NeuroBytes® Medical Student Series",
    creator: "American Academy of Neurology",
    description: "Short neurology videos designed by medical students for medical students, spanning foundational concepts and common clinical topics.",
    level: "Neurology Foundations",
    specialties: ["General Neurology", "Vascular Neurology & Stroke", "Epilepsy & Clinical Neurophysiology", "Movement Disorders", "Headache Medicine", "Pediatric Neurology"],
    population: "both",
    format: "video",
    review: null,
    access: "member",
    duration: "3–6 min each",
    year: 2026,
    featured: 94,
    url: "https://www.aan.com/education/neurobytes",
    tags: ["medical students", "clerkship", "microlearning", "AAN"]
  },
  {
    id: 7,
    title: "Medical Student Neurology Educational Resources",
    creator: "American Academy of Neurology",
    description: "An AAN starting point for clerkship resources, subspecialty introductions, NeuroBytes, webinars, and career exploration.",
    level: "Neurology Foundations",
    specialties: ["General Neurology", "Behavioral Neurology & Neuropsychiatry", "Epilepsy & Clinical Neurophysiology", "Movement Disorders", "Neuro-oncology", "Pediatric Neurology", "Vascular Neurology & Stroke"],
    population: "both",
    format: "toolkit",
    review: null,
    access: "mixed",
    duration: "Self-paced",
    year: 2026,
    featured: 89,
    url: "https://www.aan.com/tools-resources/medical-student-educational-resources",
    tags: ["medical students", "clerkship", "career", "AAN", "webinars"]
  },
  {
    id: 8,
    title: "Neurology Residency Education Offerings",
    creator: "American Academy of Neurology",
    description: "A central guide to AAN residency resources including the RITE exam, Residents & Fellows Section, teaching cases, images, and career materials.",
    level: "Core Neurology Practice",
    specialties: ["General Neurology", "Digital Education", "Vascular Neurology & Stroke", "Epilepsy & Clinical Neurophysiology", "Movement Disorders", "Neuromuscular Medicine"],
    population: "both",
    format: "toolkit",
    review: null,
    access: "mixed",
    duration: "Self-paced",
    year: 2026,
    featured: 87,
    url: "https://www.aan.com/education/resident-education-offerings",
    tags: ["residents", "RITE", "board review", "AAN", "career"]
  },
  {
    id: 9,
    title: "Neurology Education",
    creator: "American Academy of Neurology / Neurology Journals",
    description: "An open-access, peer-reviewed journal devoted to neurologic and neuroscience education, with research, curriculum innovations, and teaching aids.",
    level: "Advanced & Subspecialty",
    specialties: ["Digital Education", "General Neurology"],
    population: "both",
    format: "article",
    review: null,
    access: "free",
    duration: "Collection",
    year: 2026,
    featured: 96,
    url: "https://www.neurology.org/journal/ne9",
    tags: ["medical education", "peer reviewed", "curriculum", "education research", "open access"]
  },
  {
    id: 10,
    title: "Teaching NeuroVisuals",
    creator: "Neurology Education",
    description: "A peer-reviewed collection of infographics and teaching aids on EEG, brain death, stroke localization, vestibular examination, and other clinical topics.",
    level: "Core Neurology Practice",
    specialties: ["Digital Education", "Epilepsy & Clinical Neurophysiology", "Neurocritical Care", "Vascular Neurology & Stroke", "Neuro-otology", "Movement Disorders", "Neuromuscular Medicine"],
    population: "adult",
    format: "infographic",
    review: null,
    access: "free",
    duration: "Collection",
    year: 2026,
    featured: 99,
    url: "https://www.neurology.org/ne9/teaching-neurovisuals",
    tags: ["teaching aid", "EEG", "brain death", "HINTS", "stroke localization", "visual learning"]
  },
  {
    id: 11,
    title: "Resident & Fellow Teaching Video Collection",
    creator: "Neurology Journals",
    description: "A topic-based collection of peer-reviewed teaching videos featuring clinical signs, imaging findings, movement disorders, seizures, and pediatric cases.",
    level: "Core Neurology Practice",
    specialties: ["General Neurology", "Vascular Neurology & Stroke", "Epilepsy & Clinical Neurophysiology", "Movement Disorders", "Neuromuscular Medicine", "Neuro-ophthalmology", "Pediatric Neurology"],
    population: "both",
    format: "video",
    review: null,
    access: "free",
    duration: "Collection",
    year: 2026,
    featured: 97,
    url: "https://www.neurology.org/resident-fellow/collection/teaching-videos",
    tags: ["clinical signs", "teaching video", "resident", "fellow", "video neuroimage", "peer reviewed"]
  },
  {
    id: 12,
    title: "NeuDrawLogy: Original Neurology Infographics",
    creator: "Gabriela Figueiredo Pucci, MD",
    description: "A searchable visual collection that simplifies neurologic syndromes, clinical reasoning, vascular neurology, neuro-ophthalmology, headache, and neuromuscular topics.",
    level: "Clinical Essentials",
    specialties: ["General Neurology", "Neuro-ophthalmology", "Vascular Neurology & Stroke", "Neuromuscular Medicine", "Headache Medicine", "Neurocritical Care", "Neurohospitalist & Acute Neurology"],
    population: "adult",
    format: "infographic",
    review: null,
    access: "free",
    duration: "Collection",
    year: 2026,
    featured: 95,
    url: "https://www.neudrawlogy.com/",
    tags: ["visual learning", "clinical reasoning", "localization", "syndromes", "infographics"]
  },
  {
    id: 13,
    title: "Parinaud’s Syndrome",
    creator: "Gabriela Figueiredo Pucci, MD / NeuDrawLogy",
    description: "A visual overview of the signs, dorsal midbrain localization, and major causes of Parinaud’s syndrome.",
    level: "Clinical Essentials",
    specialties: ["Neuro-ophthalmology", "Neuro-oncology", "Multiple Sclerosis & Neuroimmunology", "Vascular Neurology & Stroke"],
    population: "both",
    format: "infographic",
    review: null,
    access: "free",
    duration: "5 min",
    year: 2026,
    featured: 83,
    url: "https://www.neudrawlogy.com/parinauds-syndrome",
    tags: ["Parinaud syndrome", "dorsal midbrain", "vertical gaze", "localization", "pupils"]
  },
  {
    id: 14,
    title: "Basic Neurology Videos and Questions",
    creator: "Yale School of Medicine",
    description: "Introductory mini-lectures with case-based questions and immediate feedback for medical students and new neurology residents.",
    level: "Neurology Foundations",
    specialties: ["General Neurology", "Behavioral Neurology & Neuropsychiatry", "Vascular Neurology & Stroke", "Epilepsy & Clinical Neurophysiology", "Headache Medicine", "Movement Disorders", "Multiple Sclerosis & Neuroimmunology", "Neuro-oncology", "Neuromuscular Medicine"],
    population: "adult",
    format: "module",
    review: null,
    access: "free",
    duration: "≤10 min each",
    year: 2024,
    featured: 93,
    url: "https://campuspress.yale.edu/eegmodules/basic-neurology-videos-and-questions/",
    tags: ["medical student", "new resident", "case questions", "mini lecture", "fundamentals"]
  },
  {
    id: 15,
    title: "EEG Modules for Residents, Fellows, and Technologists",
    creator: "Yale School of Medicine",
    description: "An eleven-part video curriculum covering the fundamentals of EEG interpretation, supported by introductory neurology content and questions.",
    level: "Core Neurology Practice",
    specialties: ["Epilepsy & Clinical Neurophysiology", "Neurocritical Care", "Sleep Neurology", "Pediatric Neurology"],
    population: "both",
    format: "module",
    review: null,
    access: "free",
    duration: "11-part series",
    year: 2024,
    featured: 91,
    url: "https://campuspress.yale.edu/eegmodules/",
    tags: ["EEG", "electroencephalography", "seizure", "clinical neurophysiology"]
  },
  {
    id: 16,
    title: "Interactive Movement Disorders Curriculum",
    creator: "Yale School of Medicine",
    description: "An interactive, patient-video-based curriculum in movement disorders designed for neurology residents at any postgraduate year.",
    level: "Core Neurology Practice",
    specialties: ["Movement Disorders", "Neurogenetics", "Behavioral Neurology & Neuropsychiatry"],
    population: "adult",
    format: "module",
    review: null,
    access: "free",
    duration: "Self-paced",
    year: 2024,
    featured: 86,
    url: "https://movementmodules.yale.edu/",
    tags: ["patient video", "movement phenomenology", "resident curriculum", "Parkinson disease"]
  },
  {
    id: 17,
    title: "Spot the Brain Cell",
    creator: "University of Calgary Department of Clinical Neurosciences",
    description: "Resident-created presentations on high-yield topics for medical students and off-service rotators, including stroke, seizure, headache, dementia, MS, vertigo, and movement disorders.",
    level: "Clinical Essentials",
    specialties: ["General Neurology", "Vascular Neurology & Stroke", "Epilepsy & Clinical Neurophysiology", "Headache Medicine", "Movement Disorders", "Multiple Sclerosis & Neuroimmunology", "Behavioral Neurology & Neuropsychiatry", "Neuro-otology", "Neuromuscular Medicine", "Neurohospitalist & Acute Neurology"],
    population: "adult",
    format: "video",
    review: null,
    access: "free",
    duration: "Topic series",
    year: 2026,
    featured: 92,
    url: "https://cumming.ucalgary.ca/departments/dcns/education/residency/neurology/spotthebraincell",
    tags: ["rotation", "high yield", "first seizure", "acute stroke", "vertigo", "MS basics"]
  },
  {
    id: 18,
    title: "Stanford Medicine 25: Neurology Examinations",
    creator: "Stanford Medicine",
    description: "Step-by-step guides and video demonstrations for bedside examination, including reflexes, cerebellar testing, gait, tremor, and Parkinson disease.",
    level: "Neurology Foundations",
    specialties: ["General Neurology", "Movement Disorders", "Neuromuscular Medicine", "Pediatric Neurology"],
    population: "both",
    format: "video",
    review: null,
    access: "free",
    duration: "Topic series",
    year: 2026,
    featured: 90,
    url: "https://med.stanford.edu/stanfordmedicine25/exam-guides-.html",
    tags: ["neurologic exam", "bedside", "reflexes", "gait", "cerebellar", "Parkinson examination"]
  },
  {
    id: 19,
    title: "ILAE Education and Epileptology Curriculum",
    creator: "International League Against Epilepsy",
    description: "A competency-based learning pathway with entry, proficiency, and advanced content in seizure diagnosis, EEG, neuroimaging, treatment, and emergencies.",
    level: "Advanced & Subspecialty",
    specialties: ["Epilepsy & Clinical Neurophysiology", "Pediatric Neurology", "Neurogenetics", "Sleep Neurology"],
    population: "both",
    format: "module",
    review: null,
    access: "mixed",
    duration: "Curriculum",
    year: 2026,
    featured: 88,
    url: "https://www.ilae.org/education",
    tags: ["epileptology", "seizure", "EEG", "MRI", "ILAE curriculum", "competency"]
  },
  {
    id: 20,
    title: "Neuro-Ophthalmology Virtual Education Library (NOVEL)",
    creator: "University of Utah and North American Neuro-Ophthalmology Society",
    description: "A large open-access repository of neuro-ophthalmology lectures, examinations, cases, images, and tiered learning materials.",
    level: "Core Neurology Practice",
    specialties: ["Neuro-ophthalmology", "Neuro-oncology", "Multiple Sclerosis & Neuroimmunology", "Vascular Neurology & Stroke"],
    population: "both",
    format: "toolkit",
    review: null,
    access: "free",
    duration: "Collection",
    year: 2024,
    featured: 84,
    url: "https://novel.utah.edu/",
    tags: ["neuro-ophthalmology", "eye movements", "pupils", "visual fields", "cases"]
  },
  {
    id: 21,
    title: "International Classification of Headache Disorders, 3rd Edition",
    creator: "International Headache Society",
    description: "The official ICHD-3 diagnostic classification and criteria for migraine, tension-type headache, trigeminal autonomic cephalalgias, and secondary headaches.",
    level: "Core Neurology Practice",
    specialties: ["Headache Medicine", "Pediatric Neurology", "Neurohospitalist & Acute Neurology"],
    population: "both",
    format: "reference",
    review: null,
    access: "free",
    duration: "Reference",
    year: 2018,
    featured: 85,
    url: "https://ichd-3.org/",
    tags: ["ICHD-3", "migraine", "headache criteria", "secondary headache", "classification"]
  },
  {
    id: 22,
    title: "Movement Disorders Fundamentals E-Learning Series",
    creator: "International Parkinson and Movement Disorder Society",
    description: "Expert video presentations covering the classification, evaluation, and management of common movement disorders from phenomenology through treatment.",
    level: "Clinical Essentials",
    specialties: ["Movement Disorders", "Pediatric Neurology", "Neurogenetics", "Autonomic Disorders", "Palliative Neurology"],
    population: "both",
    format: "module",
    review: null,
    access: "login",
    duration: "Multi-module series",
    year: 2026,
    featured: 88,
    url: "https://www.movementdisorders.org/MDS/WFN-MDS.htm",
    tags: ["movement phenomenology", "Parkinson disease", "tremor", "dystonia", "chorea", "ataxia"]
  },
  {
    id: 23,
    title: "Emergency Neurological Life Support® (ENLS)",
    creator: "Neurocritical Care Society",
    description: "A structured course for the critical first hours of neurologic emergencies, organized around practical protocols and high-stakes decision making.",
    level: "Advanced & Subspecialty",
    specialties: ["Neurocritical Care", "Neurohospitalist & Acute Neurology", "Vascular Neurology & Stroke", "Epilepsy & Clinical Neurophysiology"],
    population: "both",
    format: "module",
    review: null,
    access: "paid",
    duration: "Course",
    year: 2026,
    featured: 79,
    url: "https://www.neurocriticalcare.org/NCS-Learning-Center/ENLS/home",
    tags: ["neurologic emergency", "neurocritical care", "protocol", "acute neurology", "certification"]
  },
  {
    id: 24,
    title: "UBC Neurology Learner Resources",
    creator: "University of British Columbia Neurology",
    description: "A practical hub for residents and medical students with rotation resources, a handbook, lectures, stroke tools, neuroanatomy, examination videos, and specialty links.",
    level: "Clinical Essentials",
    specialties: ["General Neurology", "Vascular Neurology & Stroke", "Epilepsy & Clinical Neurophysiology", "Movement Disorders", "Neuro-ophthalmology", "Neuro-otology", "Neuromuscular Medicine"],
    population: "adult",
    format: "toolkit",
    review: null,
    access: "mixed",
    duration: "Collection",
    year: 2026,
    featured: 81,
    url: "https://www.ubcneuro.com/resources",
    tags: ["rotation", "handbook", "ward resources", "NIHSS", "neuroanatomy", "examination"]
  },
  {
    id: 25,
    title: "Guided Worksheets for Core Neurology Teaching",
    creator: "Clare McGarvey Lambert, MD and Jeffrey Dewey, MD",
    description: "Open-access guided worksheets for ischemic stroke basics, intracranial hemorrhage, reading brain MRI, and seizures, developed for efficient bedside teaching.",
    level: "Clinical Essentials",
    specialties: ["Digital Education", "Vascular Neurology & Stroke", "Epilepsy & Clinical Neurophysiology", "Neurohospitalist & Acute Neurology", "Pediatric Neurology"],
    population: "both",
    format: "article",
    review: null,
    access: "free",
    duration: "4 worksheets",
    year: 2026,
    featured: 86,
    url: "https://www.neurology.org/doi/10.1212/NE9.0000000000200311",
    tags: ["worksheet", "bedside teaching", "MRI", "stroke", "intracranial hemorrhage", "seizure"]
  },
  {
    id: 26,
    title: "Project Neurology Workshop Series",
    creator: "Medics.Academy and Healthcare Leadership Academy",
    description: "A free, open-access workshop series using practical, case-based sessions for medical students, neurology trainees, and early-career clinicians.",
    level: "Clinical Essentials",
    specialties: ["General Neurology", "Neurohospitalist & Acute Neurology", "Vascular Neurology & Stroke", "Epilepsy & Clinical Neurophysiology", "Headache Medicine"],
    population: "adult",
    format: "module",
    review: null,
    access: "free",
    duration: "Workshop series",
    year: 2026,
    featured: 76,
    url: "https://www.medics.academy/courses/project-neurology-workshop-series",
    tags: ["case based", "workshop", "medical students", "trainees", "clinical reasoning"]
  },
  {
    id: 27,
    title: "Understanding Multiple Sclerosis",
    creator: "Menzies Institute, MS Plus, and MS Australia",
    description: "A free online course introducing multiple sclerosis and its management for learners, health professionals, and people seeking a structured overview.",
    level: "Clinical Essentials",
    specialties: ["Multiple Sclerosis & Neuroimmunology", "Neuro-ophthalmology", "Pediatric Neurology"],
    population: "both",
    format: "module",
    review: null,
    access: "free",
    duration: "Online course",
    year: 2025,
    featured: 72,
    url: "https://www.msif.org/news/2025/08/14/a-free-course-to-learn-all-about-ms-and-how-to-manage-it/",
    tags: ["multiple sclerosis", "MS", "management", "neuroimmunology", "free course"]
  },
  {
    id: 28,
    title: "Neurology Nuts and Bolts",
    creator: "Yale School of Medicine",
    description: "A podcast about constructing a career in neurology, with conversations on clerkship success, training, mentorship, and professional development.",
    level: "Neurology Foundations",
    specialties: ["Digital Education", "General Neurology"],
    population: "both",
    format: "podcast",
    review: null,
    access: "free",
    duration: "Episode series",
    year: 2026,
    featured: 68,
    url: "https://neurologynutsandbolts.buzzsprout.com/",
    tags: ["career", "clerkship", "mentorship", "residency", "podcast"]
  },
  {
    id: 29,
    title: "AccessNeurology",
    creator: "McGraw Hill Medical",
    description: "A comprehensive subscription collection of neurology textbooks, cases, videos, review questions, and an interactive neuroanatomy atlas.",
    level: "Core Neurology Practice",
    specialties: ["General Neurology", "Behavioral Neurology & Neuropsychiatry", "Vascular Neurology & Stroke", "Epilepsy & Clinical Neurophysiology", "Movement Disorders", "Headache Medicine", "Multiple Sclerosis & Neuroimmunology", "Neuromuscular Medicine", "Neurocritical Care", "Neuro-oncology", "Neuro-ophthalmology", "Sleep Neurology", "Pediatric Neurology", "Neurogenetics", "Autonomic Disorders", "Palliative Neurology"],
    population: "both",
    format: "reference",
    review: null,
    access: "paid",
    duration: "Collection",
    year: 2026,
    featured: 70,
    url: "https://neurology.mhmedical.com/Index.aspx",
    tags: ["textbook", "case", "video", "self assessment", "neuroanatomy atlas", "board review"]
  }
];

const state = {
  query: "",
  audience: "all",
  creator: "",
  levels: new Set(),
  specialties: new Set(),
  formats: new Set(),
  reviews: new Set(),
  access: new Set(),
  sort: "featured",
  view: "list"
};

const elements = {
  searchForm: document.querySelector("#repository-search-form"),
  searchInput: document.querySelector("#search-input"),
  aboutButton: document.querySelector("#about-button"),
  aboutDialog: document.querySelector("#about-dialog"),
  audienceFilter: document.querySelector("#audience-filter"),
  creatorFilter: document.querySelector("#creator-filter"),
  levelOptions: document.querySelector("#level-options"),
  specialtyOptions: document.querySelector("#specialty-options"),
  formatOptions: document.querySelector("#format-options"),
  reviewOptions: document.querySelector("#review-options"),
  accessOptions: document.querySelector("#access-options"),
  clearFilters: document.querySelector("#clear-filters"),
  activeFilters: document.querySelector("#active-filters"),
  sortSelect: document.querySelector("#sort-select"),
  resourceList: document.querySelector("#resource-list"),
  emptyState: document.querySelector("#empty-state"),
  emptyReset: document.querySelector("#empty-reset"),
  filterPanel: document.querySelector("#filter-panel"),
  filterClose: document.querySelector("#filter-close"),
  filterBackdrop: document.querySelector("#filter-backdrop"),
  mobileFilterButton: document.querySelector("#mobile-filter-button"),
  mobileFilterCount: document.querySelector("#mobile-filter-count")
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalize(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function makeCountMap(values, getter) {
  return values.reduce((map, value) => {
    map[value] = RESOURCES.filter((resource) => getter(resource).includes(value)).length;
    return map;
  }, {});
}

function renderCheckboxGroup(container, values, groupName, selectedSet, labels = {}) {
  const fieldNames = {
    levels: "level",
    formats: "format",
    reviews: "review",
    access: "access"
  };
  const counts = makeCountMap(values, (resource) => {
    if (groupName === "specialties") return resource.specialties;
    return [resource[fieldNames[groupName]]];
  });

  container.innerHTML = values.map((value) => {
    const label = labels[value] || value;
    return `
      <label class="filter-option">
        <input type="checkbox" data-group="${escapeHtml(groupName)}" value="${escapeHtml(value)}" ${selectedSet.has(value) ? "checked" : ""}>
        <span class="filter-box" aria-hidden="true"></span>
        <span>${escapeHtml(label)}</span>
        <span class="filter-count">${counts[value]}</span>
      </label>`;
  }).join("");
}

function initializeFilters() {
  const creators = [...new Set(RESOURCES.map((resource) => resource.creator))].sort((a, b) => a.localeCompare(b));
  elements.creatorFilter.insertAdjacentHTML("beforeend", creators.map((creator) => `<option value="${escapeHtml(creator)}">${escapeHtml(creator)}</option>`).join(""));

  renderCheckboxGroup(elements.levelOptions, LEVELS, "levels", state.levels);
  renderCheckboxGroup(elements.specialtyOptions, SPECIALTIES, "specialties", state.specialties);
  renderCheckboxGroup(elements.formatOptions, Object.keys(FORMAT_LABELS), "formats", state.formats, FORMAT_LABELS);
  renderCheckboxGroup(elements.reviewOptions, Object.keys(REVIEW_LABELS), "reviews", state.reviews, REVIEW_LABELS);
  renderCheckboxGroup(elements.accessOptions, Object.keys(ACCESS_LABELS), "access", state.access, ACCESS_LABELS);
}

function audienceMatches(resource) {
  if (state.audience === "all") return true;
  if (state.audience === "both") return resource.population === "both";
  return resource.population === state.audience || resource.population === "both";
}

function setMatches(set, values) {
  if (!set.size) return true;
  return values.some((value) => set.has(value));
}

function getFilteredResources() {
  const query = normalize(state.query);
  const filtered = RESOURCES.filter((resource) => {
    const haystack = normalize([
      resource.title,
      resource.creator,
      resource.description,
      resource.level,
      resource.specialties.join(" "),
      FORMAT_LABELS[resource.format],
      resource.tags.join(" ")
    ].join(" "));

    return (!query || haystack.includes(query))
      && audienceMatches(resource)
      && (!state.creator || resource.creator === state.creator)
      && setMatches(state.levels, [resource.level])
      && setMatches(state.specialties, resource.specialties)
      && setMatches(state.formats, [resource.format])
      && setMatches(state.reviews, [resource.review])
      && setMatches(state.access, [resource.access]);
  });

  return filtered.sort((a, b) => {
    if (state.sort === "title") return a.title.localeCompare(b.title);
    if (state.sort === "level") return LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level) || a.title.localeCompare(b.title);
    if (state.sort === "newest") return b.year - a.year || b.featured - a.featured;
    return b.featured - a.featured || a.title.localeCompare(b.title);
  });
}

function reviewBadge(resource) {
  if (resource.review !== "ndec") return "";
  return `<span class="badge badge-ndec">${escapeHtml(REVIEW_LABELS.ndec)}</span>`;
}

function populationLabel(population) {
  if (population === "both") return "Adult & pediatric";
  return population === "adult" ? "Adult" : "Pediatric";
}

function specialtyLabel(resource) {
  const primary = resource.specialties[0];
  const additional = resource.specialties.length - 1;
  return additional > 0 ? `${primary} +${additional}` : primary;
}

function renderResourceCard(resource) {
  return `
    <article class="resource-card format-${escapeHtml(resource.format)}">
      <div class="resource-format-icon" aria-hidden="true">
        <b>${escapeHtml(FORMAT_ICONS[resource.format])}</b>
        <small>${escapeHtml(FORMAT_LABELS[resource.format])}</small>
      </div>
      <div class="resource-body">
        <div class="resource-topline">
          ${reviewBadge(resource)}
          <span class="badge">${escapeHtml(FORMAT_LABELS[resource.format])}</span>
        </div>
        <h3><a href="${escapeHtml(resource.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(resource.title)}</a></h3>
        <p class="resource-description">${escapeHtml(resource.description)}</p>
        <div class="resource-meta">
          <span>${escapeHtml(resource.creator)}</span>
          <span>${escapeHtml(resource.level)}</span>
          <span title="${escapeHtml(resource.specialties.join(", "))}">${escapeHtml(specialtyLabel(resource))}</span>
          <span>${escapeHtml(populationLabel(resource.population))}</span>
          <span>${escapeHtml(ACCESS_LABELS[resource.access])}</span>
          <span>${escapeHtml(resource.duration)}</span>
        </div>
      </div>
      <a class="resource-open" href="${escapeHtml(resource.url)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeHtml(resource.title)} in a new tab">↗</a>
    </article>`;
}

function activeFilterCount() {
  return (state.audience === "all" ? 0 : 1)
    + (state.creator ? 1 : 0)
    + state.levels.size
    + state.specialties.size
    + state.formats.size
    + state.reviews.size
    + state.access.size;
}

function allFilterCount() {
  return activeFilterCount() + (state.query ? 1 : 0);
}

function chip(label, type, value = "") {
  return `<button class="active-filter" type="button" data-remove-type="${escapeHtml(type)}" data-remove-value="${escapeHtml(value)}">${escapeHtml(label)} <span aria-hidden="true">×</span></button>`;
}

function renderActiveFilters() {
  const chips = [];
  if (state.query) chips.push(chip(`Search: ${state.query}`, "query"));
  if (state.audience !== "all") chips.push(chip(`Population: ${populationLabel(state.audience)}`, "audience"));
  if (state.creator) chips.push(chip(`Creator: ${state.creator}`, "creator"));
  state.levels.forEach((value) => chips.push(chip(value, "levels", value)));
  state.specialties.forEach((value) => chips.push(chip(value, "specialties", value)));
  state.formats.forEach((value) => chips.push(chip(FORMAT_LABELS[value], "formats", value)));
  state.reviews.forEach((value) => chips.push(chip(REVIEW_LABELS[value], "reviews", value)));
  state.access.forEach((value) => chips.push(chip(ACCESS_LABELS[value], "access", value)));
  elements.activeFilters.innerHTML = chips.length ? chips.join("") : '<span class="filter-placeholder">No filters applied</span>';
}

function syncControls() {
  elements.searchInput.value = state.query;
  elements.creatorFilter.value = state.creator;
  elements.sortSelect.value = state.sort;

  elements.audienceFilter.querySelectorAll("button").forEach((button) => {
    const active = button.dataset.audience === state.audience;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  document.querySelectorAll("[data-group]").forEach((checkbox) => {
    checkbox.checked = state[checkbox.dataset.group].has(checkbox.value);
  });

  document.querySelectorAll("[data-view]").forEach((button) => {
    const active = button.dataset.view === state.view;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  elements.clearFilters.disabled = allFilterCount() === 0;
  elements.mobileFilterCount.textContent = activeFilterCount();
}

function render() {
  const resources = getFilteredResources();
  elements.resourceList.innerHTML = resources.map(renderResourceCard).join("");
  elements.resourceList.classList.toggle("grid-view", state.view === "grid");
  elements.emptyState.hidden = resources.length !== 0;
  elements.resourceList.hidden = resources.length === 0;

  renderActiveFilters();
  syncControls();
}

function clearAllFilters() {
  state.query = "";
  state.audience = "all";
  state.creator = "";
  state.levels.clear();
  state.specialties.clear();
  state.formats.clear();
  state.reviews.clear();
  state.access.clear();
  render();
}

function scrollToBrowse() {
  document.querySelector("#browse").scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeFilters() {
  document.body.classList.remove("filter-open");
  elements.mobileFilterButton.setAttribute("aria-expanded", "false");
}

function openFilters() {
  document.body.classList.add("filter-open");
  elements.mobileFilterButton.setAttribute("aria-expanded", "true");
  window.setTimeout(() => elements.filterClose.focus(), 230);
}

elements.searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  state.query = elements.searchInput.value.trim();
  render();
  scrollToBrowse();
});

let searchTimer;
elements.searchInput.addEventListener("input", () => {
  window.clearTimeout(searchTimer);
  searchTimer = window.setTimeout(() => {
    state.query = elements.searchInput.value.trim();
    render();
  }, 180);
});

document.querySelectorAll("[data-query]").forEach((button) => {
  button.addEventListener("click", () => {
    state.query = button.dataset.query;
    render();
    scrollToBrowse();
  });
});

elements.audienceFilter.addEventListener("click", (event) => {
  const button = event.target.closest("[data-audience]");
  if (!button) return;
  state.audience = button.dataset.audience;
  render();
});

elements.filterPanel.addEventListener("change", (event) => {
  const checkbox = event.target.closest("[data-group]");
  if (checkbox) {
    const set = state[checkbox.dataset.group];
    checkbox.checked ? set.add(checkbox.value) : set.delete(checkbox.value);
    render();
  }
});

elements.creatorFilter.addEventListener("change", () => {
  state.creator = elements.creatorFilter.value;
  render();
});

elements.sortSelect.addEventListener("change", () => {
  state.sort = elements.sortSelect.value;
  render();
});

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => {
    state.view = button.dataset.view;
    render();
  });
});

elements.activeFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-type]");
  if (!button) return;
  const type = button.dataset.removeType;
  const value = button.dataset.removeValue;

  if (type === "query") state.query = "";
  else if (type === "audience") state.audience = "all";
  else if (type === "creator") state.creator = "";
  else state[type].delete(value);
  render();
});

elements.clearFilters.addEventListener("click", clearAllFilters);
elements.emptyReset.addEventListener("click", clearAllFilters);
elements.mobileFilterButton.addEventListener("click", openFilters);
elements.filterClose.addEventListener("click", closeFilters);
elements.filterBackdrop.addEventListener("click", closeFilters);

elements.aboutButton.addEventListener("click", () => {
  if (typeof elements.aboutDialog.showModal === "function") {
    elements.aboutDialog.showModal();
  } else {
    elements.aboutDialog.setAttribute("open", "");
  }
});

elements.aboutDialog.addEventListener("click", (event) => {
  if (event.target === elements.aboutDialog) elements.aboutDialog.close();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.body.classList.contains("filter-open")) {
    closeFilters();
    elements.mobileFilterButton.focus();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 820) closeFilters();
});

initializeFilters();
render();
