"use strict";

window.SPECIALTY_MODES = {
  neurology: {
    label: "Neurology",
    cases: [
      { id: "neuro-tn", diagnosis: "Trigeminal neuralgia", treatment: "Carbamazepine", symptom: "Triggerable electric facial pain", fact: "recurrent unilateral shock-like facial pain triggered by chewing" },
      { id: "neuro-cae", diagnosis: "Childhood absence epilepsy", treatment: "Ethosuximide", symptom: "Brief staring spells", fact: "hyperventilation-provoked staring with generalized 3-Hz spike-and-wave" },
      { id: "neuro-tle", diagnosis: "Temporal lobe epilepsy", treatment: "Levetiracetam", symptom: "Epigastric aura with automatisms", fact: "a rising epigastric sensation, lip smacking, and mesial temporal sclerosis" },
      { id: "neuro-rrms", diagnosis: "Relapsing-remitting multiple sclerosis", treatment: "Ocrelizumab", symptom: "Optic neuritis with INO", fact: "optic neuritis, internuclear ophthalmoplegia, Dawson fingers, and CSF oligoclonal bands" },
      { id: "neuro-jme", diagnosis: "Juvenile myoclonic epilepsy", treatment: "Valproate", symptom: "Morning myoclonic jerks", fact: "morning jerks after sleep deprivation with generalized polyspike-and-wave" }
    ]
  },
  cardiology: {
    label: "Cardiology",
    cases: [
      { id: "card-stemi", diagnosis: "ST-elevation myocardial infarction", treatment: "Primary percutaneous coronary intervention", symptom: "Crushing substernal chest pressure", fact: "persistent crushing chest pressure with regional ST elevations and reciprocal changes" },
      { id: "card-hfref", diagnosis: "Heart failure with reduced ejection fraction", treatment: "Sacubitril-valsartan", symptom: "Orthopnea and paroxysmal nocturnal dyspnea", fact: "a reduced ejection fraction, pulmonary congestion, orthopnea, and an S3" },
      { id: "card-af", diagnosis: "Atrial fibrillation", treatment: "Apixaban for stroke prevention", symptom: "Irregular palpitations", fact: "an irregularly irregular rhythm without discrete P waves and elevated embolic risk" },
      { id: "card-pericarditis", diagnosis: "Acute pericarditis", treatment: "Ibuprofen plus colchicine", symptom: "Pleuritic pain relieved by leaning forward", fact: "diffuse ST elevation, PR depression, and positional pleuritic chest pain" },
      { id: "card-svt", diagnosis: "Paroxysmal supraventricular tachycardia", treatment: "Adenosine after vagal maneuvers", symptom: "Sudden regular rapid palpitations", fact: "abrupt-onset regular narrow-complex tachycardia in a stable patient" }
    ]
  },
  pulmonology: {
    label: "Pulmonology",
    cases: [
      { id: "pulm-asthma", diagnosis: "Persistent asthma", treatment: "Inhaled corticosteroid-formoterol", symptom: "Episodic wheeze and chest tightness", fact: "variable airflow obstruction with reversible wheeze and nocturnal cough" },
      { id: "pulm-copd", diagnosis: "Chronic obstructive pulmonary disease", treatment: "Long-acting muscarinic antagonist", symptom: "Progressive dyspnea with chronic cough", fact: "smoking exposure, persistent obstruction, hyperinflation, and chronic productive cough" },
      { id: "pulm-pe", diagnosis: "Pulmonary embolism", treatment: "Therapeutic anticoagulation", symptom: "Sudden pleuritic chest pain and dyspnea", fact: "acute dyspnea, pleuritic pain, tachycardia, and a segmental pulmonary arterial filling defect" },
      { id: "pulm-tension", diagnosis: "Tension pneumothorax", treatment: "Immediate needle decompression", symptom: "Unilateral absent breath sounds with hypotension", fact: "sudden respiratory distress, hypotension, tracheal deviation, and absent unilateral breath sounds" },
      { id: "pulm-osa", diagnosis: "Obstructive sleep apnea", treatment: "Continuous positive airway pressure", symptom: "Loud snoring with daytime somnolence", fact: "recurrent nocturnal upper-airway obstruction, witnessed apneas, and daytime sleepiness" }
    ]
  },
  gastroenterology: {
    label: "Gastroenterology",
    cases: [
      { id: "gi-pud", diagnosis: "Peptic ulcer disease", treatment: "Proton-pump inhibitor therapy", symptom: "Burning epigastric pain", fact: "burning epigastric pain with an endoscopically visualized gastroduodenal ulcer" },
      { id: "gi-uc", diagnosis: "Ulcerative colitis", treatment: "Mesalamine", symptom: "Bloody diarrhea with tenesmus", fact: "continuous colonic mucosal inflammation beginning at the rectum with bloody diarrhea" },
      { id: "gi-crohn", diagnosis: "Crohn disease", treatment: "Infliximab for moderate-to-severe disease", symptom: "Right-lower-quadrant pain with diarrhea", fact: "transmural skip lesions, terminal ileal inflammation, and nonbloody diarrhea" },
      { id: "gi-pancreatitis", diagnosis: "Acute pancreatitis", treatment: "Lactated Ringer resuscitation and analgesia", symptom: "Epigastric pain radiating to the back", fact: "severe epigastric pain radiating posteriorly with a markedly elevated lipase" },
      { id: "gi-he", diagnosis: "Hepatic encephalopathy", treatment: "Lactulose", symptom: "Confusion with asterixis", fact: "cirrhosis followed by altered attention, asterixis, and elevated ammonia" }
    ]
  },
  nephrology: {
    label: "Nephrology",
    cases: [
      { id: "renal-nephrotic", diagnosis: "Nephrotic syndrome", treatment: "ACE inhibitor for proteinuria", symptom: "Edema with frothy urine", fact: "heavy proteinuria, hypoalbuminemia, hyperlipidemia, and generalized edema" },
      { id: "renal-pyelo", diagnosis: "Acute pyelonephritis", treatment: "Ceftriaxone", symptom: "Fever with flank pain", fact: "fever, costovertebral-angle tenderness, pyuria, and white-cell casts" },
      { id: "renal-stone", diagnosis: "Ureteral nephrolithiasis", treatment: "Ketorolac and hydration", symptom: "Colicky flank pain radiating to the groin", fact: "hematuria and severe waxing-and-waning flank pain extending toward the groin" },
      { id: "renal-hyperk", diagnosis: "Severe hyperkalemia", treatment: "Intravenous calcium gluconate", symptom: "Weakness with peaked T waves", fact: "potassium elevation with muscle weakness, peaked T waves, and QRS widening" },
      { id: "renal-siad", diagnosis: "Syndrome of inappropriate ADH secretion", treatment: "Fluid restriction", symptom: "Confusion from euvolemic hyponatremia", fact: "hypotonic euvolemic hyponatremia with inappropriately concentrated urine" }
    ]
  },
  endocrinology: {
    label: "Endocrinology",
    cases: [
      { id: "endo-dka", diagnosis: "Diabetic ketoacidosis", treatment: "Intravenous fluids and insulin", symptom: "Polyuria with Kussmaul respirations", fact: "hyperglycemia, anion-gap acidosis, ketonemia, dehydration, and deep rapid breathing" },
      { id: "endo-graves", diagnosis: "Graves disease", treatment: "Methimazole", symptom: "Heat intolerance with tremor", fact: "suppressed TSH, diffuse toxic goiter, ophthalmopathy, and a fine tremor" },
      { id: "endo-addison", diagnosis: "Primary adrenal insufficiency", treatment: "Hydrocortisone replacement", symptom: "Fatigue with hyperpigmentation", fact: "hypotension, hyperkalemia, hyponatremia, low cortisol, and elevated ACTH" },
      { id: "endo-hypothyroid", diagnosis: "Primary hypothyroidism", treatment: "Levothyroxine", symptom: "Cold intolerance and constipation", fact: "elevated TSH, low free T4, bradycardia, and delayed reflex relaxation" },
      { id: "endo-hyperpara", diagnosis: "Primary hyperparathyroidism", treatment: "Parathyroidectomy when indicated", symptom: "Kidney stones and bone pain", fact: "hypercalcemia, low phosphate, and inappropriately elevated parathyroid hormone" }
    ]
  },
  "hematology-oncology": {
    label: "Hematology & Oncology",
    cases: [
      { id: "heme-ida", diagnosis: "Iron-deficiency anemia", treatment: "Oral ferrous sulfate", symptom: "Fatigue with pica", fact: "microcytosis, low ferritin, high iron-binding capacity, fatigue, and pica" },
      { id: "heme-itp", diagnosis: "Immune thrombocytopenia", treatment: "Glucocorticoids", symptom: "Petechiae and mucosal bleeding", fact: "isolated thrombocytopenia with petechiae and otherwise normal blood-cell lines" },
      { id: "heme-sickle", diagnosis: "Sickle cell vaso-occlusive crisis", treatment: "Analgesia, hydration, and oxygen if hypoxemic", symptom: "Acute severe bone pain", fact: "sickle cell disease followed by sudden severe limb and back pain without another cause" },
      { id: "heme-aml", diagnosis: "Acute myeloid leukemia", treatment: "Cytarabine-based induction chemotherapy", symptom: "Fatigue, bruising, and recurrent infection", fact: "cytopenias, circulating myeloblasts, and Auer rods" },
      { id: "heme-myeloma", diagnosis: "Multiple myeloma", treatment: "Bortezomib-based combination therapy", symptom: "Bone pain with recurrent infections", fact: "lytic lesions, anemia, renal dysfunction, hypercalcemia, and a monoclonal protein" }
    ]
  },
  "infectious-disease": {
    label: "Infectious Disease",
    cases: [
      { id: "id-meningitis", diagnosis: "Acute bacterial meningitis", treatment: "Empiric ceftriaxone plus vancomycin", symptom: "Fever, headache, and neck stiffness", fact: "acute fever, meningismus, altered mental status, and neutrophilic CSF" },
      { id: "id-cap", diagnosis: "Community-acquired pneumonia", treatment: "Amoxicillin for uncomplicated outpatient disease", symptom: "Fever with productive cough", fact: "fever, focal crackles, cough, and a new lobar infiltrate" },
      { id: "id-cdiff", diagnosis: "Clostridioides difficile colitis", treatment: "Oral vancomycin", symptom: "Watery diarrhea after antibiotics", fact: "recent antibiotic exposure followed by frequent watery stools and a positive stool toxin assay" },
      { id: "id-lyme", diagnosis: "Early localized Lyme disease", treatment: "Doxycycline", symptom: "Expanding erythema migrans rash", fact: "tick exposure followed by an expanding annular rash with central clearing" },
      { id: "id-endo", diagnosis: "Infective endocarditis", treatment: "Culture-directed intravenous antibiotics", symptom: "Persistent fever with a new murmur", fact: "persistent bacteremia, fever, a new regurgitant murmur, and valvular vegetation" }
    ]
  },
  rheumatology: {
    label: "Rheumatology",
    cases: [
      { id: "rheum-ra", diagnosis: "Rheumatoid arthritis", treatment: "Methotrexate", symptom: "Symmetric small-joint morning stiffness", fact: "symmetric inflammatory MCP and PIP arthritis with prolonged morning stiffness" },
      { id: "rheum-gout", diagnosis: "Acute gout", treatment: "Colchicine", symptom: "Sudden first-MTP pain", fact: "abrupt podagra with needle-shaped negatively birefringent crystals" },
      { id: "rheum-sle", diagnosis: "Systemic lupus erythematosus", treatment: "Hydroxychloroquine", symptom: "Photosensitive malar rash with arthralgia", fact: "multisystem disease with photosensitivity, inflammatory arthritis, and characteristic autoantibodies" },
      { id: "rheum-gca", diagnosis: "Giant cell arteritis", treatment: "Immediate high-dose glucocorticoids", symptom: "New headache with jaw claudication", fact: "age over 50, elevated inflammatory markers, temporal headache, and jaw claudication" },
      { id: "rheum-as", diagnosis: "Ankylosing spondylitis", treatment: "NSAID therapy", symptom: "Inflammatory back pain improving with activity", fact: "young-adult back stiffness, sacroiliitis, and pain that improves with exercise" }
    ]
  },
  dermatology: {
    label: "Dermatology",
    cases: [
      { id: "derm-atopic", diagnosis: "Atopic dermatitis", treatment: "Topical corticosteroid", symptom: "Pruritic flexural eczema", fact: "chronic relapsing pruritic inflammation involving flexural surfaces" },
      { id: "derm-psoriasis", diagnosis: "Plaque psoriasis", treatment: "Topical corticosteroid plus vitamin D analog", symptom: "Well-demarcated scaly plaques", fact: "sharply bordered extensor plaques with silvery scale" },
      { id: "derm-cellulitis", diagnosis: "Nonpurulent cellulitis", treatment: "Cephalexin", symptom: "Warm tender expanding erythema", fact: "an expanding warm tender erythematous plaque without fluctuance" },
      { id: "derm-zoster", diagnosis: "Herpes zoster", treatment: "Valacyclovir", symptom: "Painful dermatomal vesicles", fact: "burning pain followed by grouped vesicles confined to one dermatome" },
      { id: "derm-melanoma", diagnosis: "Cutaneous melanoma", treatment: "Wide local excision", symptom: "Changing asymmetric pigmented lesion", fact: "an evolving asymmetric lesion with irregular borders and color variation" }
    ]
  },
  psychiatry: {
    label: "Psychiatry",
    cases: [
      { id: "psych-mdd", diagnosis: "Major depressive disorder", treatment: "Cognitive behavioral therapy plus an SSRI", symptom: "Depressed mood with anhedonia", fact: "at least two weeks of depressed mood, anhedonia, sleep change, and impaired function" },
      { id: "psych-gad", diagnosis: "Generalized anxiety disorder", treatment: "Cognitive behavioral therapy with escitalopram", symptom: "Excessive difficult-to-control worry", fact: "pervasive worry across multiple domains on most days for at least six months" },
      { id: "psych-bipolar", diagnosis: "Bipolar I disorder, manic episode", treatment: "Lithium", symptom: "Decreased sleep with grandiosity", fact: "sustained elevated mood, decreased need for sleep, pressured speech, and major impairment" },
      { id: "psych-schiz", diagnosis: "Schizophrenia", treatment: "Second-generation antipsychotic", symptom: "Hallucinations and delusions", fact: "psychosis with functional decline and continuous disturbance lasting at least six months" },
      { id: "psych-panic", diagnosis: "Panic disorder", treatment: "Cognitive behavioral therapy with sertraline", symptom: "Recurrent unexpected panic attacks", fact: "sudden recurrent episodes of intense fear with autonomic symptoms and anticipatory worry" }
    ]
  },
  pediatrics: {
    label: "Pediatrics",
    cases: [
      { id: "peds-croup", diagnosis: "Viral croup", treatment: "Dexamethasone", symptom: "Barking cough with inspiratory stridor", fact: "a young child with hoarseness, barking cough, and inspiratory stridor" },
      { id: "peds-bronch", diagnosis: "Viral bronchiolitis", treatment: "Supportive hydration and oxygen when needed", symptom: "Infant wheeze after coryza", fact: "an infant with rhinorrhea followed by diffuse wheeze, crackles, and increased work of breathing" },
      { id: "peds-aom", diagnosis: "Acute otitis media", treatment: "High-dose amoxicillin", symptom: "Ear pain with a bulging tympanic membrane", fact: "acute ear pain, middle-ear effusion, and a bulging erythematous tympanic membrane" },
      { id: "peds-kawasaki", diagnosis: "Kawasaki disease", treatment: "Intravenous immunoglobulin plus aspirin", symptom: "Prolonged fever with mucocutaneous inflammation", fact: "five days of fever with conjunctivitis, oral change, rash, extremity change, and cervical adenopathy" },
      { id: "peds-intuss", diagnosis: "Intussusception", treatment: "Air enema reduction", symptom: "Intermittent colicky pain with currant-jelly stool", fact: "episodic severe abdominal pain, a sausage-shaped mass, and bloody mucus stool" }
    ]
  },
  "obstetrics-gynecology": {
    label: "Obstetrics & Gynecology",
    cases: [
      { id: "obgyn-ectopic", diagnosis: "Ectopic pregnancy", treatment: "Methotrexate for a stable eligible patient", symptom: "Unilateral pelvic pain with early-pregnancy bleeding", fact: "positive pregnancy testing, no intrauterine pregnancy, and unilateral adnexal pain" },
      { id: "obgyn-preeclampsia", diagnosis: "Preeclampsia with severe features", treatment: "Magnesium sulfate and delivery planning", symptom: "Hypertension with headache and visual change", fact: "new severe hypertension after 20 weeks with proteinuria or end-organ dysfunction" },
      { id: "obgyn-endometriosis", diagnosis: "Endometriosis", treatment: "Combined hormonal contraception", symptom: "Cyclic pelvic pain and dyspareunia", fact: "recurrent pain linked to menses with deep dyspareunia and infertility" },
      { id: "obgyn-pid", diagnosis: "Pelvic inflammatory disease", treatment: "Ceftriaxone, doxycycline, and metronidazole", symptom: "Pelvic pain with cervical motion tenderness", fact: "lower abdominal pain, mucopurulent discharge, and cervical motion tenderness" },
      { id: "obgyn-pph", diagnosis: "Postpartum hemorrhage from uterine atony", treatment: "Uterine massage and oxytocin", symptom: "Heavy postpartum bleeding with a boggy uterus", fact: "excessive bleeding immediately after delivery with an enlarged poorly contracted uterus" }
    ]
  },
  "general-surgery": {
    label: "General Surgery",
    cases: [
      { id: "surg-app", diagnosis: "Acute appendicitis", treatment: "Laparoscopic appendectomy", symptom: "Migratory periumbilical-to-RLQ pain", fact: "anorexia, fever, and pain migrating from the periumbilical region to McBurney point" },
      { id: "surg-chole", diagnosis: "Acute cholecystitis", treatment: "Early laparoscopic cholecystectomy", symptom: "Right-upper-quadrant pain after meals", fact: "persistent RUQ pain, fever, gallstones, and a positive sonographic Murphy sign" },
      { id: "surg-sbo", diagnosis: "Small-bowel obstruction", treatment: "Nasogastric decompression and IV fluids", symptom: "Distention with vomiting and obstipation", fact: "colicky pain, vomiting, dilated bowel loops, and multiple air-fluid levels" },
      { id: "surg-hernia", diagnosis: "Incarcerated inguinal hernia", treatment: "Urgent operative repair", symptom: "Painful nonreducible groin bulge", fact: "a tender irreducible groin mass with obstructive symptoms" },
      { id: "surg-abscess", diagnosis: "Cutaneous abscess", treatment: "Incision and drainage", symptom: "Painful fluctuant mass", fact: "a localized tender erythematous collection with fluctuance" }
    ]
  },
  orthopedics: {
    label: "Orthopedics",
    cases: [
      { id: "ortho-hip", diagnosis: "Displaced femoral neck fracture", treatment: "Operative hip repair", symptom: "Groin pain with a shortened externally rotated leg", fact: "a fall followed by inability to bear weight and a shortened externally rotated extremity" },
      { id: "ortho-acl", diagnosis: "Anterior cruciate ligament tear", treatment: "Rehabilitation with possible reconstruction", symptom: "A knee pop followed by instability", fact: "a noncontact pivot injury, immediate swelling, and a positive Lachman test" },
      { id: "ortho-septic", diagnosis: "Septic arthritis", treatment: "Urgent joint drainage and IV antibiotics", symptom: "Acutely hot swollen immobile joint", fact: "fever, severe monoarticular pain, and purulent synovial fluid with high leukocytes" },
      { id: "ortho-carpal", diagnosis: "Carpal tunnel syndrome", treatment: "Neutral-position night splint", symptom: "Nocturnal median-distribution numbness", fact: "nighttime thumb, index, and middle-finger paresthesias with positive provocative testing" },
      { id: "ortho-oa", diagnosis: "Knee osteoarthritis", treatment: "Exercise therapy and topical NSAID", symptom: "Activity-related knee pain with brief stiffness", fact: "chronic use-related pain, crepitus, and joint-space narrowing" }
    ]
  },
  "emergency-medicine": {
    label: "Emergency Medicine",
    cases: [
      { id: "em-anaphylaxis", diagnosis: "Anaphylaxis", treatment: "Intramuscular epinephrine", symptom: "Urticaria, wheeze, and hypotension", fact: "rapid multisystem allergic symptoms with airway or circulatory compromise" },
      { id: "em-opioid", diagnosis: "Opioid overdose", treatment: "Naloxone", symptom: "Respiratory depression with miosis", fact: "marked hypoventilation, depressed consciousness, and pinpoint pupils" },
      { id: "em-status", diagnosis: "Convulsive status epilepticus", treatment: "Intravenous lorazepam", symptom: "A prolonged generalized convulsion", fact: "continuous convulsive activity lasting at least five minutes without recovery" },
      { id: "em-heat", diagnosis: "Exertional heat stroke", treatment: "Immediate whole-body cooling", symptom: "Hyperthermia with altered mental status", fact: "core hyperthermia and central nervous system dysfunction after exertion" },
      { id: "em-hypoglycemia", diagnosis: "Severe hypoglycemia", treatment: "Intravenous dextrose", symptom: "Diaphoresis, tremor, and confusion", fact: "neuroglycopenic and adrenergic symptoms with a critically low glucose" }
    ]
  },
  ophthalmology: {
    label: "Ophthalmology",
    cases: [
      { id: "oph-angle", diagnosis: "Acute angle-closure glaucoma", treatment: "Acetazolamide followed by laser iridotomy", symptom: "Painful red eye with halos and nausea", fact: "abrupt ocular pain, a fixed mid-dilated pupil, cloudy cornea, and markedly elevated pressure" },
      { id: "oph-detach", diagnosis: "Retinal detachment", treatment: "Urgent retinal repair", symptom: "Flashes, floaters, and a curtain over vision", fact: "painless monocular visual-field loss preceded by photopsias and new floaters" },
      { id: "oph-conj", diagnosis: "Bacterial conjunctivitis", treatment: "Topical antibiotic drops", symptom: "Purulent ocular discharge", fact: "conjunctival injection with thick discharge and eyelids matted on waking" },
      { id: "oph-glaucoma", diagnosis: "Primary open-angle glaucoma", treatment: "Prostaglandin analog eye drops", symptom: "Gradual peripheral visual-field loss", fact: "painless progressive optic-nerve cupping and peripheral field loss" },
      { id: "oph-uveitis", diagnosis: "Anterior uveitis", treatment: "Topical glucocorticoid and cycloplegic drops", symptom: "Photophobia with ciliary flush", fact: "ocular pain, consensual photophobia, and inflammatory cells in the anterior chamber" }
    ]
  },
  otolaryngology: {
    label: "Otolaryngology",
    cases: [
      { id: "ent-strep", diagnosis: "Streptococcal pharyngitis", treatment: "Penicillin V", symptom: "Sore throat with fever and tender anterior nodes", fact: "acute fever, tonsillar exudates, tender anterior cervical nodes, and no cough" },
      { id: "ent-sinus", diagnosis: "Acute bacterial rhinosinusitis", treatment: "Amoxicillin-clavulanate", symptom: "Purulent nasal drainage with facial pressure", fact: "persistent or double-worsening nasal symptoms with focal facial pain" },
      { id: "ent-bppv", diagnosis: "Benign paroxysmal positional vertigo", treatment: "Epley canalith-repositioning maneuver", symptom: "Brief vertigo triggered by head movement", fact: "seconds-long positional vertigo with a characteristic Dix-Hallpike response" },
      { id: "ent-epistaxis", diagnosis: "Anterior epistaxis", treatment: "Direct pressure and topical vasoconstrictor", symptom: "Unilateral anterior nosebleed", fact: "visible anterior septal bleeding without hemodynamic instability" },
      { id: "ent-pta", diagnosis: "Peritonsillar abscess", treatment: "Drainage plus antibiotics", symptom: "Hot-potato voice with uvular deviation", fact: "unilateral tonsillar swelling, trismus, muffled voice, and contralateral uvular deviation" }
    ]
  },
  urology: {
    label: "Urology",
    cases: [
      { id: "uro-bph", diagnosis: "Benign prostatic hyperplasia", treatment: "Tamsulosin", symptom: "Hesitancy with a weak urinary stream", fact: "progressive lower urinary-tract symptoms with a smooth enlarged prostate" },
      { id: "uro-prostatitis", diagnosis: "Acute bacterial prostatitis", treatment: "Fluoroquinolone therapy", symptom: "Fever, dysuria, and pelvic pain", fact: "systemic illness, urinary symptoms, and a tender boggy prostate" },
      { id: "uro-torsion", diagnosis: "Testicular torsion", treatment: "Immediate surgical detorsion", symptom: "Sudden severe unilateral scrotal pain", fact: "acute scrotal pain, a high-riding testis, and an absent cremasteric reflex" },
      { id: "uro-bladder", diagnosis: "Urothelial bladder carcinoma", treatment: "Transurethral resection of bladder tumor", symptom: "Painless gross hematuria", fact: "intermittent painless visible hematuria in a patient with smoking exposure" },
      { id: "uro-ed", diagnosis: "Erectile dysfunction", treatment: "Phosphodiesterase-5 inhibitor", symptom: "Difficulty attaining or maintaining erection", fact: "persistent inability to achieve adequate erection despite intact sexual desire" }
    ]
  },
  anesthesiology: {
    label: "Anesthesiology",
    cases: [
      { id: "anes-mh", diagnosis: "Malignant hyperthermia", treatment: "Dantrolene", symptom: "Rigidity, hypercarbia, and hyperthermia", fact: "volatile anesthetic exposure followed by rapidly rising carbon dioxide, rigidity, acidosis, and fever" },
      { id: "anes-last", diagnosis: "Local anesthetic systemic toxicity", treatment: "Intravenous lipid emulsion", symptom: "Tinnitus followed by seizures and arrhythmia", fact: "local anesthetic exposure followed by circumoral numbness, seizure, and cardiovascular instability" },
      { id: "anes-ponv", diagnosis: "Postoperative nausea and vomiting", treatment: "Ondansetron", symptom: "Nausea and emesis after anesthesia", fact: "otherwise unexplained nausea and vomiting in the immediate postoperative period" },
      { id: "anes-pdph", diagnosis: "Post-dural-puncture headache", treatment: "Epidural blood patch", symptom: "Postural headache relieved when supine", fact: "severe headache after neuraxial puncture that worsens upright and improves lying flat" },
      { id: "anes-laryngospasm", diagnosis: "Perioperative laryngospasm", treatment: "Positive-pressure ventilation and succinylcholine if persistent", symptom: "Acute stridor with absent airflow", fact: "sudden glottic closure during emergence with inspiratory effort but little air movement" }
    ]
  },
  "allergy-immunology": {
    label: "Allergy & Immunology",
    cases: [
      { id: "allergy-rhinitis", diagnosis: "Allergic rhinitis", treatment: "Intranasal corticosteroid", symptom: "Sneezing with itchy watery eyes", fact: "seasonal sneezing, clear rhinorrhea, pale boggy turbinates, and ocular itching" },
      { id: "allergy-urticaria", diagnosis: "Acute urticaria", treatment: "Second-generation H1 antihistamine", symptom: "Transient pruritic wheals", fact: "migratory itchy raised lesions that resolve within 24 hours at each site" },
      { id: "allergy-hae", diagnosis: "Hereditary angioedema", treatment: "C1 esterase inhibitor concentrate", symptom: "Nonpruritic swelling without urticaria", fact: "recurrent bradykinin-mediated swelling with low complement C4 and no hives" },
      { id: "allergy-food", diagnosis: "IgE-mediated food allergy", treatment: "Epinephrine autoinjector for systemic reactions", symptom: "Immediate oral itching and hives after food", fact: "reproducible rapid-onset cutaneous or respiratory symptoms after a specific food" },
      { id: "allergy-cvid", diagnosis: "Common variable immunodeficiency", treatment: "Immunoglobulin replacement", symptom: "Recurrent sinopulmonary infections", fact: "low immunoglobulin levels, poor vaccine responses, and recurrent bacterial respiratory infections" }
    ]
  },
  radiology: {
    label: "Radiology",
    cases: [
      { id: "rad-pe", diagnosis: "Acute pulmonary embolism on CT angiography", treatment: "Therapeutic anticoagulation after imaging confirmation", symptom: "Pleuritic chest pain with abrupt dyspnea", fact: "a contrast-filling defect in a pulmonary artery with acute pleuritic symptoms" },
      { id: "rad-epidural", diagnosis: "Traumatic epidural hematoma", treatment: "Emergency neurosurgical evacuation", symptom: "A lucid interval followed by rapid decline", fact: "a biconvex hyperdense extra-axial collection that does not cross cranial sutures" },
      { id: "rad-dissection", diagnosis: "Acute aortic dissection on CT angiography", treatment: "Intravenous beta blockade and urgent surgical assessment", symptom: "Tearing chest pain radiating to the back", fact: "an intimal flap dividing true and false aortic lumens" },
      { id: "rad-volvulus", diagnosis: "Sigmoid volvulus", treatment: "Endoscopic detorsion followed by definitive surgery", symptom: "Marked distention with obstipation", fact: "a coffee-bean configuration of a massively dilated sigmoid colon" },
      { id: "rad-brodie", diagnosis: "Subacute osteomyelitis with Brodie abscess", treatment: "Culture-directed antibiotics with debridement when indicated", symptom: "Persistent focal bone pain", fact: "a well-defined metaphyseal lytic lesion with a rim of sclerosis and surrounding marrow edema" }
    ]
  },
  pathology: {
    label: "Pathology",
    cases: [
      { id: "path-apl", diagnosis: "Acute promyelocytic leukemia", treatment: "Immediate all-trans retinoic acid", symptom: "Bleeding with pancytopenia", fact: "abnormal promyelocytes, Auer rods, coagulopathy, and a PML-RARA fusion" },
      { id: "path-gpa", diagnosis: "Granulomatosis with polyangiitis", treatment: "Rituximab plus glucocorticoids", symptom: "Sinus disease, hematuria, and lung nodules", fact: "necrotizing granulomatous inflammation with pauci-immune crescentic glomerulonephritis" },
      { id: "path-dlbcl", diagnosis: "Diffuse large B-cell lymphoma", treatment: "R-CHOP chemoimmunotherapy", symptom: "A rapidly enlarging painless lymph node", fact: "sheets of large atypical CD20-positive lymphoid cells with high proliferation" },
      { id: "path-hsil", diagnosis: "High-grade squamous intraepithelial cervical lesion", treatment: "Excisional cervical procedure", symptom: "Usually detected by abnormal screening", fact: "full-thickness squamous atypia associated with high-risk human papillomavirus" },
      { id: "path-barrett", diagnosis: "Barrett esophagus with high-grade dysplasia", treatment: "Endoscopic eradication therapy", symptom: "Chronic reflux with a premalignant biopsy", fact: "intestinal metaplasia of distal esophageal mucosa with marked cytologic atypia" }
    ]
  },
  "physical-medicine-rehabilitation": {
    label: "Physical Medicine & Rehabilitation",
    cases: [
      { id: "pmr-cervical", diagnosis: "Cervical radiculopathy", treatment: "Activity modification and targeted physical therapy", symptom: "Neck pain radiating into one arm", fact: "dermatomal arm pain and paresthesia with a corresponding depressed reflex" },
      { id: "pmr-stenosis", diagnosis: "Lumbar spinal stenosis", treatment: "Flexion-based therapy and graded conditioning", symptom: "Leg discomfort relieved by sitting", fact: "neurogenic claudication triggered by standing or extension and relieved by flexion" },
      { id: "pmr-spasticity", diagnosis: "Post-stroke focal spasticity", treatment: "Botulinum toxin injection with therapy", symptom: "Velocity-dependent limb stiffness", fact: "a focal upper-motor-neuron pattern that limits hygiene or function after stroke" },
      { id: "pmr-phantom", diagnosis: "Phantom limb pain", treatment: "Mirror therapy with neuropathic pain medication", symptom: "Pain perceived in an amputated limb", fact: "burning or cramping pain localized to a limb that is no longer present" },
      { id: "pmr-myofascial", diagnosis: "Myofascial pain syndrome", treatment: "Stretching, exercise, and trigger-point therapy", symptom: "Regional aching with reproducible trigger points", fact: "localized muscle pain reproduced by palpation of taut bands without neurologic deficit" }
    ]
  },
  geriatrics: {
    label: "Geriatrics",
    cases: [
      { id: "geri-delirium", diagnosis: "Acute delirium", treatment: "Treat the cause and use nonpharmacologic reorientation", symptom: "Fluctuating inattention and altered awareness", fact: "an acute fluctuating change in attention and cognition during an intercurrent illness" },
      { id: "geri-polypharmacy", diagnosis: "Medication-related orthostatic hypotension", treatment: "Deprescribe contributing medications and hydrate", symptom: "Lightheadedness after standing", fact: "a reproducible blood-pressure drop on standing after several hypotensive medicines were added" },
      { id: "geri-frailty", diagnosis: "Geriatric frailty syndrome", treatment: "Progressive resistance exercise and nutrition support", symptom: "Weakness, slowness, and low activity", fact: "unintentional weight loss, exhaustion, weakness, slow gait, and diminished activity" },
      { id: "geri-falls", diagnosis: "Multifactorial fall risk", treatment: "Exercise, medication review, and home-hazard reduction", symptom: "Recurrent falls without syncope", fact: "gait impairment combined with unsafe medications and environmental hazards" },
      { id: "geri-pressure", diagnosis: "Stage 2 pressure injury", treatment: "Pressure off-loading and moisture-balanced wound care", symptom: "A shallow painful sacral ulcer", fact: "partial-thickness skin loss over a pressure point without exposed fat or deeper tissue" }
    ]
  },
  neurosurgery: {
    label: "Neurosurgery",
    cases: [
      { id: "ns-cauda", diagnosis: "Cauda equina syndrome", treatment: "Emergency lumbar decompression", symptom: "Saddle anesthesia with urinary retention", fact: "acute bilateral radicular deficits, perineal sensory loss, and new bladder dysfunction" },
      { id: "ns-sdh", diagnosis: "Chronic subdural hematoma", treatment: "Burr-hole drainage", symptom: "Progressive headache and confusion after a fall", fact: "a crescentic extra-axial collection with gradual cognitive or focal decline" },
      { id: "ns-nph", diagnosis: "Normal-pressure hydrocephalus", treatment: "Ventriculoperitoneal shunt", symptom: "Gait impairment with cognitive and urinary change", fact: "ventriculomegaly with a magnetic gait, cognitive decline, and urinary urgency" },
      { id: "ns-pituitary", diagnosis: "Pituitary macroadenoma with chiasmal compression", treatment: "Transsphenoidal resection", symptom: "Bitemporal visual-field loss", fact: "a sellar mass compressing the optic chiasm with progressive peripheral vision loss" },
      { id: "ns-cervical", diagnosis: "Degenerative cervical myelopathy", treatment: "Cervical decompression and fusion", symptom: "Hand clumsiness with a spastic gait", fact: "cord compression causing upper-motor-neuron leg signs and impaired hand dexterity" }
    ]
  },
  "critical-care": {
    label: "Critical Care",
    cases: [
      { id: "cc-septic", diagnosis: "Septic shock", treatment: "Broad-spectrum antibiotics, crystalloid, and norepinephrine", symptom: "Hypotension with organ dysfunction during infection", fact: "suspected infection, elevated lactate, and persistent hypotension requiring vasopressor support" },
      { id: "cc-ards", diagnosis: "Acute respiratory distress syndrome", treatment: "Low-tidal-volume ventilation with appropriate PEEP", symptom: "Severe hypoxemia with bilateral opacities", fact: "acute noncardiogenic pulmonary edema with impaired oxygenation after a major insult" },
      { id: "cc-dka", diagnosis: "Severe diabetic ketoacidosis with shock", treatment: "Intravenous fluids, insulin, and potassium-guided replacement", symptom: "Kussmaul breathing with abdominal pain", fact: "hyperglycemia, ketonemia, high-anion-gap acidosis, and circulatory collapse" },
      { id: "cc-cardiogenic", diagnosis: "Cardiogenic shock after myocardial infarction", treatment: "Urgent revascularization with hemodynamic support", symptom: "Cold extremities, pulmonary edema, and hypotension", fact: "low cardiac output and tissue hypoperfusion following an acute coronary occlusion" },
      { id: "cc-status", diagnosis: "Refractory status epilepticus", treatment: "Continuous anesthetic infusion with EEG monitoring", symptom: "Seizures continuing after first- and second-line therapy", fact: "ongoing electrographic or convulsive seizures despite a benzodiazepine and an antiseizure loading dose" }
    ]
  },
  "family-medicine": {
    label: "Family Medicine",
    cases: [
      { id: "fm-htn", diagnosis: "Primary hypertension", treatment: "Thiazide-like diuretic", symptom: "Usually asymptomatic elevated blood pressure", fact: "repeated elevated office and out-of-office blood pressure without a secondary cause" },
      { id: "fm-t2dm", diagnosis: "Type 2 diabetes mellitus", treatment: "Metformin", symptom: "Polyuria and polydipsia", fact: "persistent hyperglycemia with insulin resistance and no ketoacidosis" },
      { id: "fm-hld", diagnosis: "Hyperlipidemia", treatment: "High-intensity statin", symptom: "Typically no symptoms", fact: "markedly elevated atherogenic cholesterol in a patient with high cardiovascular risk" },
      { id: "fm-tobacco", diagnosis: "Tobacco use disorder", treatment: "Varenicline with behavioral support", symptom: "Nicotine cravings and withdrawal", fact: "compulsive cigarette use despite harm with withdrawal during quit attempts" },
      { id: "fm-migraine", diagnosis: "Migraine without aura", treatment: "Sumatriptan for acute attacks", symptom: "Unilateral pulsatile headache with nausea", fact: "recurrent disabling unilateral throbbing headache with photophobia and nausea" }
    ]
  }
};

window.TREATMENT_MECHANISMS = {
  "neuro-tn": "stabilizes the inactivated state of voltage-gated sodium channels, reducing high-frequency neuronal firing",
  "neuro-cae": "blocks thalamic T-type calcium channels and suppresses the oscillations that produce absence seizures",
  "neuro-tle": "binds synaptic vesicle protein SV2A and modulates neurotransmitter release",
  "neuro-rrms": "targets CD20-positive B cells and depletes a population that contributes to inflammatory demyelination",
  "neuro-jme": "increases inhibitory GABA signaling while also limiting voltage-gated sodium and T-type calcium currents",

  "card-stemi": "mechanically reopens the occluded coronary artery and restores myocardial perfusion",
  "card-hfref": "combines neprilysin inhibition with angiotensin II receptor blockade",
  "card-af": "directly inhibits factor Xa and reduces thrombin generation",
  "card-pericarditis": "combines cyclooxygenase inhibition with microtubule disruption to reduce pericardial inflammation",
  "card-svt": "briefly activates A1 receptors in the AV node, increasing potassium efflux and interrupting nodal reentry",

  "pulm-asthma": "pairs glucocorticoid-receptor anti-inflammatory activity with long-acting beta-2 bronchodilation",
  "pulm-copd": "blocks airway M3 muscarinic receptors and reduces vagally mediated bronchoconstriction",
  "pulm-pe": "inhibits coagulation-factor activity to prevent further clot propagation while endogenous fibrinolysis proceeds",
  "pulm-tension": "rapidly vents trapped pleural air, lowering intrathoracic pressure and restoring venous return",
  "pulm-osa": "uses positive pressure to splint the collapsible upper airway open during sleep",

  "gi-pud": "irreversibly inhibits the gastric parietal-cell hydrogen-potassium ATPase",
  "gi-uc": "acts locally in the colonic mucosa to reduce inflammatory mediator production",
  "gi-crohn": "neutralizes tumor necrosis factor alpha and suppresses downstream inflammation",
  "gi-pancreatitis": "restores intravascular volume while analgesia reduces the severe inflammatory pain",
  "gi-he": "acidifies the colon and traps ammonia as poorly absorbed ammonium while increasing its elimination",

  "renal-nephrotic": "reduces angiotensin II signaling, lowers intraglomerular pressure, and decreases protein filtration",
  "renal-pyelo": "binds penicillin-binding proteins and blocks bacterial cell-wall cross-linking",
  "renal-stone": "inhibits cyclooxygenase-mediated prostaglandin production to reduce ureteral pain and inflammation",
  "renal-hyperk": "raises the cardiac myocyte threshold potential and stabilizes the excitable membrane without lowering serum potassium",

  "endo-dka": "activates insulin receptors, suppressing ketogenesis and shifting glucose and potassium into cells",
  "endo-graves": "inhibits thyroid peroxidase and blocks thyroid-hormone organification and coupling",
  "endo-addison": "activates intracellular glucocorticoid receptors to replace deficient cortisol signaling",
  "endo-hypothyroid": "replaces circulating thyroxine that is converted to active triiodothyronine at target tissues",

  "heme-ida": "replenishes elemental iron needed for heme synthesis and erythropoiesis",
  "heme-itp": "activates glucocorticoid receptors to reduce immune-mediated platelet destruction",
  "heme-sickle": "restores volume and oxygen delivery while analgesia interrupts the physiologic stress of vaso-occlusion",
  "heme-aml": "uses a cytidine analog that inhibits DNA polymerase after incorporation into replicating DNA",
  "heme-myeloma": "inhibits the proteasome, causing toxic protein accumulation in antibody-producing plasma cells",

  "id-meningitis": "combines beta-lactam blockade of cell-wall synthesis with binding of D-alanyl-D-alanine cell-wall precursors",
  "id-cap": "binds bacterial penicillin-binding proteins and prevents peptidoglycan cross-linking",
  "id-cdiff": "binds D-alanyl-D-alanine termini and blocks bacterial cell-wall synthesis within the intestinal lumen",
  "id-lyme": "binds the 30S ribosomal subunit and prevents aminoacyl-tRNA attachment",

  "rheum-ra": "increases extracellular adenosine signaling and suppresses inflammatory immune activity at low weekly doses",
  "rheum-gout": "binds tubulin, disrupts microtubules, and limits neutrophil migration toward urate crystals",
  "rheum-sle": "accumulates in lysosomes, alters antigen processing, and reduces endosomal toll-like receptor signaling",
  "rheum-gca": "activates glucocorticoid receptors and rapidly suppresses cytokine transcription",
  "rheum-as": "inhibits cyclooxygenase enzymes and decreases inflammatory prostaglandin production",

  "derm-atopic": "activates cutaneous glucocorticoid receptors and reduces local inflammatory gene transcription",
  "derm-psoriasis": "combines glucocorticoid anti-inflammatory effects with vitamin-D-receptor regulation of keratinocyte growth",
  "derm-cellulitis": "binds penicillin-binding proteins and interrupts bacterial peptidoglycan cross-linking",
  "derm-zoster": "is converted to an active guanosine analog that inhibits viral DNA polymerase",

  "psych-mdd": "blocks serotonin reuptake at the presynaptic transporter while psychotherapy modifies maladaptive cognitive patterns",
  "psych-gad": "selectively inhibits the serotonin transporter while psychotherapy reduces reinforced anxiety responses",
  "psych-bipolar": "alters intracellular second-messenger signaling, including inositol pathways and glycogen synthase kinase 3",
  "psych-schiz": "antagonizes dopamine D2 and serotonin 5-HT2A receptors",
  "psych-panic": "inhibits the serotonin transporter while exposure-based therapy reduces fear conditioning",

  "peds-croup": "activates glucocorticoid receptors and reduces inflammatory subglottic edema",
  "peds-aom": "binds bacterial penicillin-binding proteins and inhibits cell-wall cross-linking",
  "peds-kawasaki": "combines broad immunomodulation with cyclooxygenase inhibition and antiplatelet activity",

  "obgyn-ectopic": "inhibits dihydrofolate reductase and stops DNA synthesis in rapidly dividing trophoblastic tissue",
  "obgyn-preeclampsia": "reduces central neuromuscular excitability to prevent seizures while delivery removes the disease-driving placenta",
  "obgyn-endometriosis": "suppresses gonadotropin-driven ovulation and stabilizes hormonally responsive endometrial tissue",
  "obgyn-pid": "combines cell-wall inhibition, 30S ribosomal inhibition, and anaerobic DNA damage for broad pelvic-pathogen coverage",
  "obgyn-pph": "activates uterine oxytocin receptors, increasing intracellular calcium and myometrial contraction",

  "ortho-septic": "removes the infected joint fluid while antimicrobial therapy inhibits or kills the causative organism",
  "ortho-oa": "reduces prostaglandin synthesis locally while exercise improves joint load tolerance and function",

  "em-anaphylaxis": "stimulates alpha-1, beta-1, and beta-2 receptors to restore vascular tone, support cardiac output, and bronchodilate",
  "em-opioid": "competitively antagonizes opioid receptors, especially the mu receptor, and reverses respiratory depression",
  "em-status": "positively modulates GABA-A receptors and increases the frequency of chloride-channel opening",
  "em-hypoglycemia": "provides an immediately usable glucose substrate to reverse neuroglycopenia",

  "oph-angle": "inhibits carbonic anhydrase to reduce aqueous production before an iridotomy restores aqueous outflow",
  "oph-conj": "delivers antimicrobial activity directly to the ocular surface",
  "oph-glaucoma": "increases uveoscleral aqueous outflow through prostaglandin-F receptor signaling",
  "oph-uveitis": "suppresses ocular inflammation while muscarinic blockade dilates the pupil and reduces ciliary spasm",

  "ent-strep": "binds penicillin-binding proteins and prevents bacterial cell-wall cross-linking",
  "ent-sinus": "combines penicillin-binding-protein inhibition with irreversible beta-lactamase inhibition",
  "ent-epistaxis": "stimulates local alpha-adrenergic receptors to constrict nasal mucosal vessels",

  "uro-bph": "selectively blocks alpha-1A receptors and relaxes smooth muscle in the prostate and bladder neck",
  "uro-prostatitis": "inhibits bacterial DNA gyrase and topoisomerase IV",
  "uro-ed": "inhibits phosphodiesterase type 5, preserving cGMP-mediated cavernosal smooth-muscle relaxation",

  "anes-mh": "inhibits skeletal-muscle ryanodine receptor 1 and reduces pathologic calcium release from the sarcoplasmic reticulum",
  "anes-last": "creates an intravascular lipid phase that sequesters lipophilic local anesthetic and supports cardiac metabolism",
  "anes-ponv": "antagonizes serotonin 5-HT3 receptors in vagal afferents and the chemoreceptor trigger zone",
  "anes-laryngospasm": "uses positive pressure to reopen the glottis and, if needed, depolarizing neuromuscular blockade to relax it",

  "allergy-rhinitis": "activates local glucocorticoid receptors and suppresses nasal inflammatory gene expression",
  "allergy-urticaria": "selectively blocks peripheral histamine H1 receptors",
  "allergy-hae": "replaces the deficient inhibitor that restrains kallikrein and bradykinin production",
  "allergy-food": "stimulates alpha and beta adrenergic receptors to reverse vasodilation, edema, and bronchoconstriction",
  "allergy-cvid": "supplies pooled functional antibodies for passive protection against infection",

  "rad-pe": "inhibits the coagulation cascade to prevent clot extension after the embolus is identified",
  "rad-dissection": "reduces heart rate and contractility, lowering aortic shear stress while definitive repair is arranged",
  "rad-brodie": "eradicates the cultured organism while debridement removes devitalized infected bone when necessary",

  "path-apl": "binds the abnormal retinoic-acid receptor fusion protein and permits malignant promyelocytes to differentiate",
  "path-gpa": "depletes CD20-positive B cells while glucocorticoids rapidly suppress inflammatory transcription",
  "path-dlbcl": "combines CD20-directed immune killing with agents that damage DNA, inhibit topoisomerase, disrupt microtubules, and suppress lymphocytes",

  "pmr-spasticity": "cleaves SNAP-25 at the neuromuscular junction and prevents acetylcholine vesicle release",

  "cc-septic": "treats the pathogen, restores circulating volume, and stimulates vascular alpha-1 receptors to raise perfusion pressure",
  "cc-dka": "activates insulin receptors to halt ketogenesis and correct hyperglycemia while guided replacement prevents potassium depletion",

  "fm-htn": "blocks the sodium-chloride cotransporter in the distal convoluted tubule and promotes natriuresis",
  "fm-t2dm": "reduces hepatic gluconeogenesis and improves insulin sensitivity without directly stimulating insulin release",
  "fm-hld": "competitively inhibits HMG-CoA reductase and increases hepatic LDL-receptor expression",
  "fm-tobacco": "partially stimulates alpha-4-beta-2 nicotinic receptors, reducing withdrawal while blocking nicotine reinforcement",
  "fm-migraine": "agonizes serotonin 5-HT1B and 5-HT1D receptors, constricting cranial vessels and reducing trigeminal neuropeptide release"
};
