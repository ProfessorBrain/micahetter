"use strict";

window.SPECIALTY_MODES = {
  neurology: {
    label: "Neurology",
    cases: [
      { id: "neuro-tn", diagnosis: "Trigeminal neuralgia", treatment: "Carbamazepine", symptom: "Triggerable electric facial pain", fact: "recurrent unilateral shock-like facial pain triggered by chewing" },
      { id: "neuro-parkinson", diagnosis: "Parkinson disease", treatment: "Carbidopa-levodopa", symptom: "Bradykinesia with resting tremor", fact: "asymmetric resting tremor, rigidity, bradykinesia, and a shuffling gait" },
      { id: "neuro-tle", diagnosis: "Temporal lobe epilepsy", treatment: "Levetiracetam", symptom: "Epigastric aura with automatisms", fact: "a rising epigastric sensation, lip smacking, and mesial temporal sclerosis" },
      { id: "neuro-rrms", diagnosis: "Relapsing-remitting multiple sclerosis", treatment: "Ocrelizumab", symptom: "Optic neuritis with INO", fact: "optic neuritis, internuclear ophthalmoplegia, Dawson fingers, and CSF oligoclonal bands" },
      { id: "neuro-mg", diagnosis: "Myasthenia gravis", treatment: "Pyridostigmine", symptom: "Fatigable ptosis and diplopia", fact: "fluctuating ocular and bulbar weakness that worsens with repeated use" }
    ]
  },
  cardiology: {
    label: "Cardiology",
    cases: [
      { id: "card-stemi", diagnosis: "ST-elevation myocardial infarction", treatment: "Primary percutaneous coronary intervention", symptom: "Crushing substernal chest pressure", fact: "persistent crushing chest pressure with regional ST elevations and reciprocal changes" },
      { id: "card-hfref", diagnosis: "Heart failure with reduced ejection fraction", treatment: "Sacubitril-valsartan", symptom: "Orthopnea and paroxysmal nocturnal dyspnea", fact: "a reduced ejection fraction, pulmonary congestion, orthopnea, and an S3" },
      { id: "card-af", diagnosis: "Atrial fibrillation", treatment: "Apixaban for stroke prevention", symptom: "Irregular palpitations", fact: "an irregularly irregular rhythm without discrete P waves and elevated embolic risk" },
      { id: "card-pericarditis", diagnosis: "Acute pericarditis", treatment: "Ibuprofen plus colchicine", symptom: "Pleuritic pain relieved by leaning forward", fact: "diffuse ST elevation, PR depression, and positional pleuritic chest pain" },
      { id: "card-svt", diagnosis: "Paroxysmal supraventricular tachycardia", treatment: "Adenosine after vagal maneuvers", symptom: "Sudden regular rapid palpitations", fact: "abrupt-onset regular narrow-complex tachycardia in a stable patient" },
      { id: "card-hcm", diagnosis: "Hypertrophic cardiomyopathy", treatment: "Nonvasodilating beta-blocker", symptom: "Exertional presyncope and dyspnea", fact: "asymmetric septal hypertrophy with dynamic outflow obstruction and a murmur that intensifies during Valsalva" },
      { id: "card-as", diagnosis: "Severe aortic stenosis", treatment: "Aortic valve replacement", symptom: "Exertional syncope with angina", fact: "a late-peaking systolic murmur radiating to the carotids with severe valvular narrowing" }
    ]
  },
  pulmonology: {
    label: "Pulmonology",
    cases: [
      { id: "pulm-asthma", diagnosis: "Persistent asthma", treatment: "Inhaled corticosteroid-formoterol", symptom: "Episodic wheeze and chest tightness", fact: "variable airflow obstruction with reversible wheeze and nocturnal cough" },
      { id: "pulm-copd", diagnosis: "Chronic obstructive pulmonary disease", treatment: "Long-acting muscarinic antagonist", symptom: "Progressive dyspnea with chronic cough", fact: "smoking exposure, persistent obstruction, hyperinflation, and chronic productive cough" },
      { id: "pulm-pe", diagnosis: "Pulmonary embolism", treatment: "Therapeutic anticoagulation", symptom: "Sudden pleuritic chest pain and dyspnea", fact: "acute dyspnea, pleuritic pain, tachycardia, and a segmental pulmonary arterial filling defect" },
      { id: "pulm-tension", diagnosis: "Tension pneumothorax", treatment: "Immediate needle decompression", symptom: "Unilateral absent breath sounds with hypotension", fact: "sudden respiratory distress, hypotension, tracheal deviation, and absent unilateral breath sounds" },
      { id: "pulm-osa", diagnosis: "Obstructive sleep apnea", treatment: "Continuous positive airway pressure", symptom: "Loud snoring with daytime somnolence", fact: "recurrent nocturnal upper-airway obstruction, witnessed apneas, and daytime sleepiness" },
      { id: "pulm-sarcoid", diagnosis: "Pulmonary sarcoidosis", treatment: "Systemic glucocorticoid therapy", symptom: "Dry cough with exertional dyspnea", fact: "bilateral hilar adenopathy with noncaseating granulomas and progressive respiratory symptoms" },
      { id: "pulm-ipf", diagnosis: "Idiopathic pulmonary fibrosis", treatment: "Nintedanib", symptom: "Progressive exertional dyspnea and dry cough", fact: "bibasilar inspiratory crackles, restrictive physiology, and peripheral basal honeycombing" }
    ]
  },
  gastroenterology: {
    label: "Gastroenterology",
    cases: [
      { id: "gi-pud", diagnosis: "Peptic ulcer disease", treatment: "Proton-pump inhibitor therapy", symptom: "Burning epigastric pain", fact: "burning epigastric pain with an endoscopically visualized gastroduodenal ulcer" },
      { id: "gi-uc", diagnosis: "Ulcerative colitis", treatment: "Mesalamine", symptom: "Bloody diarrhea with tenesmus", fact: "continuous colonic mucosal inflammation beginning at the rectum with bloody diarrhea" },
      { id: "gi-crohn", diagnosis: "Crohn disease", treatment: "Infliximab for moderate-to-severe disease", symptom: "Right-lower-quadrant pain with diarrhea", fact: "transmural skip lesions, terminal ileal inflammation, and nonbloody diarrhea" },
      { id: "gi-pancreatitis", diagnosis: "Acute pancreatitis", treatment: "Lactated Ringer resuscitation and analgesia", symptom: "Epigastric pain radiating to the back", fact: "severe epigastric pain radiating posteriorly with a markedly elevated lipase" },
      { id: "gi-he", diagnosis: "Hepatic encephalopathy", treatment: "Lactulose", symptom: "Confusion with asterixis", fact: "cirrhosis followed by altered attention, asterixis, and elevated ammonia" },
      { id: "gi-achalasia", diagnosis: "Achalasia", treatment: "Peroral endoscopic myotomy", symptom: "Dysphagia to solids and liquids", fact: "esophageal aperistalsis, impaired lower-esophageal-sphincter relaxation, and a bird-beak appearance" },
      { id: "gi-cholangitis", diagnosis: "Acute ascending cholangitis", treatment: "Urgent endoscopic biliary drainage", symptom: "Fever, jaundice, and right-upper-quadrant pain", fact: "biliary obstruction accompanied by fever, jaundice, and right-upper-quadrant tenderness" }
    ]
  },
  nephrology: {
    label: "Nephrology",
    cases: [
      { id: "renal-nephrotic", diagnosis: "Nephrotic syndrome", treatment: "ACE inhibitor for proteinuria", symptom: "Edema with frothy urine", fact: "heavy proteinuria, hypoalbuminemia, hyperlipidemia, and generalized edema" },
      { id: "renal-pyelo", diagnosis: "Acute pyelonephritis", treatment: "Ceftriaxone", symptom: "Fever with flank pain", fact: "fever, costovertebral-angle tenderness, pyuria, and white-cell casts" },
      { id: "renal-stone", diagnosis: "Ureteral nephrolithiasis", treatment: "Ketorolac and hydration", symptom: "Colicky flank pain radiating to the groin", fact: "hematuria and severe waxing-and-waning flank pain extending toward the groin" },
      { id: "renal-hyperk", diagnosis: "Severe hyperkalemia", treatment: "Intravenous calcium gluconate", symptom: "Weakness with peaked T waves", fact: "potassium elevation with muscle weakness, peaked T waves, and QRS widening" },
      { id: "renal-siad", diagnosis: "Syndrome of inappropriate ADH secretion", treatment: "Fluid restriction", symptom: "Confusion from euvolemic hyponatremia", fact: "hypotonic euvolemic hyponatremia with inappropriately concentrated urine" },
      { id: "renal-ain", diagnosis: "Acute interstitial nephritis", treatment: "Withdrawal of the culprit drug", symptom: "Acute kidney injury with fever and rash", fact: "a recent medication exposure followed by rising creatinine, sterile pyuria, and white-cell casts" },
      { id: "renal-rta1", diagnosis: "Distal renal tubular acidosis", treatment: "Potassium citrate", symptom: "Weakness with recurrent kidney stones", fact: "a normal-anion-gap metabolic acidosis with hypokalemia and urine that remains inappropriately alkaline" }
    ]
  },
  endocrinology: {
    label: "Endocrinology",
    cases: [
      { id: "endo-dka", diagnosis: "Diabetic ketoacidosis", treatment: "Intravenous fluids and insulin", symptom: "Polyuria with Kussmaul respirations", fact: "hyperglycemia, anion-gap acidosis, ketonemia, dehydration, and deep rapid breathing" },
      { id: "endo-graves", diagnosis: "Graves disease", treatment: "Methimazole", symptom: "Heat intolerance with tremor", fact: "suppressed TSH, diffuse toxic goiter, ophthalmopathy, and a fine tremor" },
      { id: "endo-addison", diagnosis: "Primary adrenal insufficiency", treatment: "Hydrocortisone replacement", symptom: "Fatigue with hyperpigmentation", fact: "hypotension, hyperkalemia, hyponatremia, low cortisol, and elevated ACTH" },
      { id: "endo-hypothyroid", diagnosis: "Primary hypothyroidism", treatment: "Levothyroxine", symptom: "Cold intolerance and constipation", fact: "elevated TSH, low free T4, bradycardia, and delayed reflex relaxation" },
      { id: "endo-hyperpara", diagnosis: "Primary hyperparathyroidism", treatment: "Parathyroidectomy when indicated", symptom: "Kidney stones and bone pain", fact: "hypercalcemia, low phosphate, and inappropriately elevated parathyroid hormone" },
      { id: "endo-acromegaly", diagnosis: "Acromegaly", treatment: "Transsphenoidal pituitary surgery", symptom: "Enlarging hands and coarse facial features", fact: "elevated IGF-1, growth hormone that fails to suppress with glucose, and a pituitary adenoma" },
      { id: "endo-pheo", diagnosis: "Pheochromocytoma", treatment: "Alpha blockade followed by adrenalectomy", symptom: "Episodic headache, sweating, and palpitations", fact: "paroxysmal hypertension with elevated metanephrines and a catecholamine-secreting adrenal mass" }
    ]
  },
  "hematology-oncology": {
    label: "Hematology & Oncology",
    cases: [
      { id: "heme-ida", diagnosis: "Iron-deficiency anemia", treatment: "Oral ferrous sulfate", symptom: "Fatigue with pica", fact: "microcytosis, low ferritin, high iron-binding capacity, fatigue, and pica" },
      { id: "heme-itp", diagnosis: "Immune thrombocytopenia", treatment: "Glucocorticoids", symptom: "Petechiae and mucosal bleeding", fact: "isolated thrombocytopenia with petechiae and otherwise normal blood-cell lines" },
      { id: "heme-sickle", diagnosis: "Sickle cell vaso-occlusive crisis", treatment: "Analgesia, hydration, and oxygen if hypoxemic", symptom: "Acute severe bone pain", fact: "sickle cell disease followed by sudden severe limb and back pain without another cause" },
      { id: "heme-aml", diagnosis: "Acute myeloid leukemia", treatment: "Cytarabine-based induction chemotherapy", symptom: "Fatigue, bruising, and recurrent infection", fact: "cytopenias, circulating myeloblasts, and Auer rods" },
      { id: "heme-myeloma", diagnosis: "Multiple myeloma", treatment: "Bortezomib-based combination therapy", symptom: "Bone pain with recurrent infections", fact: "lytic lesions, anemia, renal dysfunction, hypercalcemia, and a monoclonal protein" },
      { id: "heme-cml", diagnosis: "Chronic myeloid leukemia", treatment: "Imatinib", symptom: "Fatigue with early satiety", fact: "marked leukocytosis, basophilia, splenomegaly, and a BCR-ABL fusion from the Philadelphia chromosome" },
      { id: "heme-hodgkin", diagnosis: "Classical Hodgkin lymphoma", treatment: "ABVD chemotherapy", symptom: "Painless lymphadenopathy with night sweats", fact: "painless cervical adenopathy with CD15-positive and CD30-positive Reed-Sternberg cells" }
    ]
  },
  "infectious-disease": {
    label: "Infectious Disease",
    cases: [
      { id: "id-meningitis", diagnosis: "Acute bacterial meningitis", treatment: "Empiric ceftriaxone plus vancomycin", symptom: "Fever, headache, and neck stiffness", fact: "acute fever, meningismus, altered mental status, and neutrophilic CSF" },
      { id: "id-cap", diagnosis: "Community-acquired pneumonia", treatment: "Amoxicillin for uncomplicated outpatient disease", symptom: "Fever with productive cough", fact: "fever, focal crackles, cough, and a new lobar infiltrate" },
      { id: "id-cdiff", diagnosis: "Clostridioides difficile colitis", treatment: "Oral vancomycin", symptom: "Watery diarrhea after antibiotics", fact: "recent antibiotic exposure followed by frequent watery stools and a positive stool toxin assay" },
      { id: "id-lyme", diagnosis: "Early localized Lyme disease", treatment: "Doxycycline", symptom: "Expanding erythema migrans rash", fact: "tick exposure followed by an expanding annular rash with central clearing" },
      { id: "id-endo", diagnosis: "Infective endocarditis", treatment: "Culture-directed intravenous antibiotics", symptom: "Persistent fever with a new murmur", fact: "persistent bacteremia, fever, a new regurgitant murmur, and valvular vegetation" },
      { id: "id-syphilis", diagnosis: "Primary syphilis", treatment: "Benzathine penicillin G", symptom: "A painless genital ulcer", fact: "a clean-based painless chancre with compatible treponemal and nontreponemal serology" },
      { id: "id-tb", diagnosis: "Active pulmonary tuberculosis", treatment: "Rifampin, isoniazid, pyrazinamide, and ethambutol", symptom: "Chronic cough with night sweats and weight loss", fact: "upper-lobe cavitation with acid-fast organisms and constitutional symptoms" }
    ]
  },
  rheumatology: {
    label: "Rheumatology",
    cases: [
      { id: "rheum-ra", diagnosis: "Rheumatoid arthritis", treatment: "Methotrexate", symptom: "Symmetric small-joint morning stiffness", fact: "symmetric inflammatory MCP and PIP arthritis with prolonged morning stiffness" },
      { id: "rheum-gout", diagnosis: "Acute gout", treatment: "Colchicine", symptom: "Sudden first-MTP pain", fact: "abrupt podagra with needle-shaped negatively birefringent crystals" },
      { id: "rheum-sle", diagnosis: "Systemic lupus erythematosus", treatment: "Hydroxychloroquine", symptom: "Photosensitive malar rash with arthralgia", fact: "multisystem disease with photosensitivity, inflammatory arthritis, and characteristic autoantibodies" },
      { id: "rheum-gca", diagnosis: "Giant cell arteritis", treatment: "Immediate high-dose glucocorticoids", symptom: "New headache with jaw claudication", fact: "age over 50, elevated inflammatory markers, temporal headache, and jaw claudication" },
      { id: "rheum-as", diagnosis: "Ankylosing spondylitis", treatment: "NSAID therapy", symptom: "Inflammatory back pain improving with activity", fact: "young-adult back stiffness, sacroiliitis, and pain that improves with exercise" },
      { id: "rheum-pmr", diagnosis: "Polymyalgia rheumatica", treatment: "Low-dose glucocorticoid therapy", symptom: "Bilateral shoulder and hip morning stiffness", fact: "age over 50, elevated inflammatory markers, normal creatine kinase, and proximal girdle stiffness" },
      { id: "rheum-scleroderma", diagnosis: "Scleroderma renal crisis", treatment: "ACE inhibitor therapy", symptom: "Abrupt hypertension with acute kidney injury", fact: "diffuse systemic sclerosis followed by severe hypertension, rising creatinine, and microangiopathic hemolysis" }
    ]
  },
  dermatology: {
    label: "Dermatology",
    cases: [
      { id: "derm-atopic", diagnosis: "Atopic dermatitis", treatment: "Topical corticosteroid", symptom: "Pruritic flexural eczema", fact: "chronic relapsing pruritic inflammation involving flexural surfaces" },
      { id: "derm-psoriasis", diagnosis: "Plaque psoriasis", treatment: "Topical corticosteroid plus vitamin D analog", symptom: "Well-demarcated scaly plaques", fact: "sharply bordered extensor plaques with silvery scale" },
      { id: "derm-cellulitis", diagnosis: "Nonpurulent cellulitis", treatment: "Cephalexin", symptom: "Warm tender expanding erythema", fact: "an expanding warm tender erythematous plaque without fluctuance" },
      { id: "derm-zoster", diagnosis: "Herpes zoster", treatment: "Valacyclovir", symptom: "Painful dermatomal vesicles", fact: "burning pain followed by grouped vesicles confined to one dermatome" },
      { id: "derm-melanoma", diagnosis: "Cutaneous melanoma", treatment: "Wide local excision", symptom: "Changing asymmetric pigmented lesion", fact: "an evolving asymmetric lesion with irregular borders and color variation" },
      { id: "derm-pemphigus", diagnosis: "Pemphigus vulgaris", treatment: "Rituximab with glucocorticoids", symptom: "Painful flaccid bullae and oral erosions", fact: "fragile mucocutaneous bullae, a positive Nikolsky sign, and intraepidermal IgG deposition" },
      { id: "derm-tinea", diagnosis: "Tinea corporis", treatment: "Topical terbinafine", symptom: "Pruritic annular scaly plaque", fact: "an enlarging annular plaque with central clearing and branching hyphae on potassium-hydroxide preparation" }
    ]
  },
  psychiatry: {
    label: "Psychiatry",
    cases: [
      { id: "psych-mdd", diagnosis: "Major depressive disorder", treatment: "Cognitive behavioral therapy plus an SSRI", symptom: "Depressed mood with anhedonia", fact: "at least two weeks of depressed mood, anhedonia, sleep change, and impaired function" },
      { id: "psych-gad", diagnosis: "Generalized anxiety disorder", treatment: "Cognitive behavioral therapy with escitalopram", symptom: "Excessive difficult-to-control worry", fact: "pervasive worry across multiple domains on most days for at least six months" },
      { id: "psych-bipolar", diagnosis: "Bipolar I disorder, manic episode", treatment: "Lithium", symptom: "Decreased sleep with grandiosity", fact: "sustained elevated mood, decreased need for sleep, pressured speech, and major impairment" },
      { id: "psych-schiz", diagnosis: "Schizophrenia", treatment: "Second-generation antipsychotic", symptom: "Hallucinations and delusions", fact: "psychosis with functional decline and continuous disturbance lasting at least six months" },
      { id: "psych-panic", diagnosis: "Panic disorder", treatment: "Cognitive behavioral therapy with sertraline", symptom: "Recurrent unexpected panic attacks", fact: "sudden recurrent episodes of intense fear with autonomic symptoms and anticipatory worry" },
      { id: "psych-ocd", diagnosis: "Obsessive-compulsive disorder", treatment: "Exposure and response prevention with an SSRI", symptom: "Intrusive thoughts with repetitive rituals", fact: "time-consuming obsessions and compulsions performed to relieve distress despite preserved insight" },
      { id: "psych-ptsd", diagnosis: "Post-traumatic stress disorder", treatment: "Trauma-focused psychotherapy with sertraline", symptom: "Intrusive memories with avoidance and hypervigilance", fact: "trauma-related intrusion, avoidance, negative mood, and hyperarousal persisting longer than one month" }
    ]
  },
  "obstetrics-gynecology": {
    label: "Obstetrics & Gynecology",
    cases: [
      { id: "obgyn-ectopic", diagnosis: "Ectopic pregnancy", treatment: "Methotrexate for a stable eligible patient", symptom: "Unilateral pelvic pain with early-pregnancy bleeding", fact: "positive pregnancy testing, no intrauterine pregnancy, and unilateral adnexal pain" },
      { id: "obgyn-preeclampsia", diagnosis: "Preeclampsia with severe features", treatment: "Magnesium sulfate and delivery planning", symptom: "Hypertension with headache and visual change", fact: "new severe hypertension after 20 weeks with proteinuria or end-organ dysfunction" },
      { id: "obgyn-endometriosis", diagnosis: "Endometriosis", treatment: "Combined hormonal contraception", symptom: "Cyclic pelvic pain and dyspareunia", fact: "recurrent pain linked to menses with deep dyspareunia and infertility" },
      { id: "obgyn-pid", diagnosis: "Pelvic inflammatory disease", treatment: "Ceftriaxone, doxycycline, and metronidazole", symptom: "Pelvic pain with cervical motion tenderness", fact: "lower abdominal pain, mucopurulent discharge, and cervical motion tenderness" },
      { id: "obgyn-pph", diagnosis: "Postpartum hemorrhage from uterine atony", treatment: "Uterine massage and oxytocin", symptom: "Heavy postpartum bleeding with a boggy uterus", fact: "excessive bleeding immediately after delivery with an enlarged poorly contracted uterus" },
      { id: "obgyn-fibroid", diagnosis: "Uterine leiomyomas", treatment: "Levonorgestrel-releasing intrauterine device", symptom: "Heavy menstrual bleeding with pelvic pressure", fact: "an enlarged irregular uterus containing well-circumscribed smooth-muscle masses" },
      { id: "obgyn-torsion", diagnosis: "Ovarian torsion", treatment: "Urgent laparoscopic detorsion", symptom: "Sudden unilateral pelvic pain with nausea", fact: "an enlarged ovary with reduced venous flow and a twisted vascular pedicle" }
    ]
  },
  "general-surgery": {
    label: "General Surgery",
    cases: [
      { id: "surg-app", diagnosis: "Acute appendicitis", treatment: "Laparoscopic appendectomy", symptom: "Migratory periumbilical-to-RLQ pain", fact: "anorexia, fever, and pain migrating from the periumbilical region to McBurney point" },
      { id: "surg-chole", diagnosis: "Acute cholecystitis", treatment: "Early laparoscopic cholecystectomy", symptom: "Right-upper-quadrant pain after meals", fact: "persistent RUQ pain, fever, gallstones, and a positive sonographic Murphy sign" },
      { id: "surg-sbo", diagnosis: "Small-bowel obstruction", treatment: "Nasogastric decompression and IV fluids", symptom: "Distention with vomiting and obstipation", fact: "colicky pain, vomiting, dilated bowel loops, and multiple air-fluid levels" },
      { id: "surg-hernia", diagnosis: "Incarcerated inguinal hernia", treatment: "Urgent operative repair", symptom: "Painful nonreducible groin bulge", fact: "a tender irreducible groin mass with obstructive symptoms" },
      { id: "surg-abscess", diagnosis: "Cutaneous abscess", treatment: "Incision and drainage", symptom: "Painful fluctuant mass", fact: "a localized tender erythematous collection with fluctuance" },
      { id: "surg-mesenteric", diagnosis: "Acute mesenteric ischemia", treatment: "Urgent revascularization and anticoagulation", symptom: "Severe abdominal pain out of proportion to examination", fact: "abrupt abdominal pain with atrial fibrillation, elevated lactate, and a mesenteric arterial occlusion" },
      { id: "surg-perf-ulcer", diagnosis: "Perforated peptic ulcer", treatment: "Emergency surgical repair and antibiotics", symptom: "Sudden severe epigastric pain with a rigid abdomen", fact: "free subdiaphragmatic air with peritonitis after abrupt epigastric pain" }
    ]
  },
  orthopedics: {
    label: "Orthopedics",
    cases: [
      { id: "ortho-hip", diagnosis: "Displaced femoral neck fracture", treatment: "Operative hip repair", symptom: "Groin pain with a shortened externally rotated leg", fact: "a fall followed by inability to bear weight and a shortened externally rotated extremity" },
      { id: "ortho-acl", diagnosis: "Anterior cruciate ligament tear", treatment: "Rehabilitation with possible reconstruction", symptom: "A knee pop followed by instability", fact: "a noncontact pivot injury, immediate swelling, and a positive Lachman test" },
      { id: "ortho-septic", diagnosis: "Septic arthritis", treatment: "Urgent joint drainage and IV antibiotics", symptom: "Acutely hot swollen immobile joint", fact: "fever, severe monoarticular pain, and purulent synovial fluid with high leukocytes" },
      { id: "ortho-carpal", diagnosis: "Carpal tunnel syndrome", treatment: "Neutral-position night splint", symptom: "Nocturnal median-distribution numbness", fact: "nighttime thumb, index, and middle-finger paresthesias with positive provocative testing" },
      { id: "ortho-oa", diagnosis: "Knee osteoarthritis", treatment: "Exercise therapy and topical NSAID", symptom: "Activity-related knee pain with brief stiffness", fact: "chronic use-related pain, crepitus, and joint-space narrowing" },
      { id: "ortho-achilles", diagnosis: "Achilles tendon rupture", treatment: "Functional rehabilitation with plantar-flexion bracing", symptom: "A posterior ankle pop with push-off weakness", fact: "a sudden posterior ankle injury followed by a palpable tendon gap and positive Thompson test" },
      { id: "ortho-rotator", diagnosis: "Full-thickness rotator cuff tear", treatment: "Physical therapy with selected surgical repair", symptom: "Shoulder weakness with night pain", fact: "weak abduction and external rotation with a positive drop-arm test and a full-thickness tendon defect" }
    ]
  },
  "emergency-medicine": {
    label: "Emergency Medicine",
    cases: [
      { id: "em-anaphylaxis", diagnosis: "Anaphylaxis", treatment: "Intramuscular epinephrine", symptom: "Urticaria, wheeze, and hypotension", fact: "rapid multisystem allergic symptoms with airway or circulatory compromise" },
      { id: "em-opioid", diagnosis: "Opioid overdose", treatment: "Naloxone", symptom: "Respiratory depression with miosis", fact: "marked hypoventilation, depressed consciousness, and pinpoint pupils" },
      { id: "em-status", diagnosis: "Convulsive status epilepticus", treatment: "Intravenous lorazepam", symptom: "A prolonged generalized convulsion", fact: "continuous convulsive activity lasting at least five minutes without recovery" },
      { id: "em-heat", diagnosis: "Exertional heat stroke", treatment: "Immediate whole-body cooling", symptom: "Hyperthermia with altered mental status", fact: "core hyperthermia and central nervous system dysfunction after exertion" },
      { id: "em-hypoglycemia", diagnosis: "Severe hypoglycemia", treatment: "Intravenous dextrose", symptom: "Diaphoresis, tremor, and confusion", fact: "neuroglycopenic and adrenergic symptoms with a critically low glucose" },
      { id: "em-co", diagnosis: "Carbon monoxide poisoning", treatment: "One hundred percent oxygen", symptom: "Headache, dizziness, and nausea after combustion exposure", fact: "a shared enclosed-space exposure with neurologic symptoms and elevated carboxyhemoglobin" },
      { id: "em-methem", diagnosis: "Methemoglobinemia", treatment: "Methylene blue", symptom: "Cyanosis unresponsive to supplemental oxygen", fact: "oxidant exposure followed by chocolate-colored blood and a persistent saturation gap" }
    ]
  },
  ophthalmology: {
    label: "Ophthalmology",
    cases: [
      { id: "oph-angle", diagnosis: "Acute angle-closure glaucoma", treatment: "Acetazolamide followed by laser iridotomy", symptom: "Painful red eye with halos and nausea", fact: "abrupt ocular pain, a fixed mid-dilated pupil, cloudy cornea, and markedly elevated pressure" },
      { id: "oph-detach", diagnosis: "Retinal detachment", treatment: "Urgent retinal repair", symptom: "Flashes, floaters, and a curtain over vision", fact: "painless monocular visual-field loss preceded by photopsias and new floaters" },
      { id: "oph-conj", diagnosis: "Bacterial conjunctivitis", treatment: "Topical antibiotic drops", symptom: "Purulent ocular discharge", fact: "conjunctival injection with thick discharge and eyelids matted on waking" },
      { id: "oph-glaucoma", diagnosis: "Primary open-angle glaucoma", treatment: "Prostaglandin analog eye drops", symptom: "Gradual peripheral visual-field loss", fact: "painless progressive optic-nerve cupping and peripheral field loss" },
      { id: "oph-uveitis", diagnosis: "Anterior uveitis", treatment: "Topical glucocorticoid and cycloplegic drops", symptom: "Photophobia with ciliary flush", fact: "ocular pain, consensual photophobia, and inflammatory cells in the anterior chamber" },
      { id: "oph-diabetic", diagnosis: "Diabetic macular edema", treatment: "Intravitreal anti-VEGF therapy", symptom: "Painless central blurring and distortion", fact: "diabetes with retinal thickening and fluid involving the macular center" },
      { id: "oph-cataract", diagnosis: "Age-related cataract", treatment: "Phacoemulsification with intraocular lens placement", symptom: "Progressive painless blurring with glare", fact: "lens opacity, diminished red reflex, and worsening night-driving glare" }
    ]
  },
  otolaryngology: {
    label: "Otolaryngology",
    cases: [
      { id: "ent-strep", diagnosis: "Streptococcal pharyngitis", treatment: "Penicillin V", symptom: "Sore throat with fever and tender anterior nodes", fact: "acute fever, tonsillar exudates, tender anterior cervical nodes, and no cough" },
      { id: "ent-sinus", diagnosis: "Acute bacterial rhinosinusitis", treatment: "Amoxicillin-clavulanate", symptom: "Purulent nasal drainage with facial pressure", fact: "persistent or double-worsening nasal symptoms with focal facial pain" },
      { id: "ent-bppv", diagnosis: "Benign paroxysmal positional vertigo", treatment: "Epley canalith-repositioning maneuver", symptom: "Brief vertigo triggered by head movement", fact: "seconds-long positional vertigo with a characteristic Dix-Hallpike response" },
      { id: "ent-epistaxis", diagnosis: "Anterior epistaxis", treatment: "Direct pressure and topical vasoconstrictor", symptom: "Unilateral anterior nosebleed", fact: "visible anterior septal bleeding without hemodynamic instability" },
      { id: "ent-pta", diagnosis: "Peritonsillar abscess", treatment: "Drainage plus antibiotics", symptom: "Hot-potato voice with uvular deviation", fact: "unilateral tonsillar swelling, trismus, muffled voice, and contralateral uvular deviation" },
      { id: "ent-meniere", diagnosis: "Ménière disease", treatment: "Sodium restriction with thiazide therapy", symptom: "Episodic vertigo with tinnitus and fluctuating hearing loss", fact: "recurrent spontaneous vertigo accompanied by aural fullness and fluctuating sensorineural hearing loss" },
      { id: "ent-otitis-externa", diagnosis: "Acute otitis externa", treatment: "Topical ciprofloxacin drops", symptom: "Ear pain worsened by tragus movement", fact: "a swollen debris-filled ear canal with pain on manipulation of the pinna" }
    ]
  },
  urology: {
    label: "Urology",
    cases: [
      { id: "uro-bph", diagnosis: "Benign prostatic hyperplasia", treatment: "Tamsulosin", symptom: "Hesitancy with a weak urinary stream", fact: "progressive lower urinary-tract symptoms with a smooth enlarged prostate" },
      { id: "uro-prostatitis", diagnosis: "Acute bacterial prostatitis", treatment: "Fluoroquinolone therapy", symptom: "Fever, dysuria, and pelvic pain", fact: "systemic illness, urinary symptoms, and a tender boggy prostate" },
      { id: "uro-torsion", diagnosis: "Testicular torsion", treatment: "Immediate surgical detorsion", symptom: "Sudden severe unilateral scrotal pain", fact: "acute scrotal pain, a high-riding testis, and an absent cremasteric reflex" },
      { id: "uro-bladder", diagnosis: "Urothelial bladder carcinoma", treatment: "Transurethral resection of bladder tumor", symptom: "Painless gross hematuria", fact: "intermittent painless visible hematuria in a patient with smoking exposure" },
      { id: "uro-ed", diagnosis: "Erectile dysfunction", treatment: "Phosphodiesterase-5 inhibitor", symptom: "Difficulty attaining or maintaining erection", fact: "persistent inability to achieve adequate erection despite intact sexual desire" },
      { id: "uro-rcc", diagnosis: "Renal cell carcinoma", treatment: "Partial or radical nephrectomy", symptom: "Painless hematuria with flank discomfort", fact: "an enhancing solid renal mass with hematuria and no urothelial source" },
      { id: "uro-oab", diagnosis: "Overactive bladder", treatment: "Mirabegron", symptom: "Urinary urgency with frequency and urge incontinence", fact: "urgency and frequent small voids without infection, obstruction, or substantial retention" }
    ]
  },
  anesthesiology: {
    label: "Anesthesiology",
    cases: [
      { id: "anes-mh", diagnosis: "Malignant hyperthermia", treatment: "Dantrolene", symptom: "Rigidity, hypercarbia, and hyperthermia", fact: "volatile anesthetic exposure followed by rapidly rising carbon dioxide, rigidity, acidosis, and fever" },
      { id: "anes-last", diagnosis: "Local anesthetic systemic toxicity", treatment: "Intravenous lipid emulsion", symptom: "Tinnitus followed by seizures and arrhythmia", fact: "local anesthetic exposure followed by circumoral numbness, seizure, and cardiovascular instability" },
      { id: "anes-ponv", diagnosis: "Postoperative nausea and vomiting", treatment: "Ondansetron", symptom: "Nausea and emesis after anesthesia", fact: "otherwise unexplained nausea and vomiting in the immediate postoperative period" },
      { id: "anes-pdph", diagnosis: "Post-dural-puncture headache", treatment: "Epidural blood patch", symptom: "Postural headache relieved when supine", fact: "severe headache after neuraxial puncture that worsens upright and improves lying flat" },
      { id: "anes-laryngospasm", diagnosis: "Perioperative laryngospasm", treatment: "Positive-pressure ventilation and succinylcholine if persistent", symptom: "Acute stridor with absent airflow", fact: "sudden glottic closure during emergence with inspiratory effort but little air movement" },
      { id: "anes-spinal-hypotension", diagnosis: "Neuraxial anesthesia-induced hypotension", treatment: "Phenylephrine", symptom: "Nausea and dizziness after spinal anesthesia", fact: "an abrupt blood-pressure decline after neuraxial sympathetic blockade with a preserved heart rhythm" },
      { id: "anes-residual-block", diagnosis: "Residual neuromuscular blockade", treatment: "Sugammadex", symptom: "Postoperative weakness and hypoventilation", fact: "incomplete recovery after rocuronium with inadequate train-of-four responses and impaired ventilation" }
    ]
  },
  "allergy-immunology": {
    label: "Allergy & Immunology",
    cases: [
      { id: "allergy-rhinitis", diagnosis: "Allergic rhinitis", treatment: "Intranasal corticosteroid", symptom: "Sneezing with itchy watery eyes", fact: "seasonal sneezing, clear rhinorrhea, pale boggy turbinates, and ocular itching" },
      { id: "allergy-urticaria", diagnosis: "Acute urticaria", treatment: "Second-generation H1 antihistamine", symptom: "Transient pruritic wheals", fact: "migratory itchy raised lesions that resolve within 24 hours at each site" },
      { id: "allergy-hae", diagnosis: "Hereditary angioedema", treatment: "C1 esterase inhibitor concentrate", symptom: "Nonpruritic swelling without urticaria", fact: "recurrent bradykinin-mediated swelling with low complement C4 and no hives" },
      { id: "allergy-food", diagnosis: "IgE-mediated food allergy", treatment: "Epinephrine autoinjector for systemic reactions", symptom: "Immediate oral itching and hives after food", fact: "reproducible rapid-onset cutaneous or respiratory symptoms after a specific food" },
      { id: "allergy-cvid", diagnosis: "Common variable immunodeficiency", treatment: "Immunoglobulin replacement", symptom: "Recurrent sinopulmonary infections", fact: "low immunoglobulin levels, poor vaccine responses, and recurrent bacterial respiratory infections" },
      { id: "allergy-contact", diagnosis: "Allergic contact dermatitis", treatment: "Topical corticosteroid", symptom: "Pruritic eczematous rash after skin exposure", fact: "a delayed sharply patterned eruption after nickel or plant exposure consistent with type IV hypersensitivity" },
      { id: "allergy-serum", diagnosis: "Serum sickness", treatment: "Trigger withdrawal with anti-inflammatory therapy", symptom: "Fever, rash, and arthralgias after a medication", fact: "a delayed immune-complex illness with low complement after exposure to a foreign protein or medication" }
    ]
  },
  radiology: {
    label: "Radiology",
    cases: [
      { id: "rad-pe", diagnosis: "Acute pulmonary embolism on CT angiography", treatment: "Therapeutic anticoagulation after imaging confirmation", symptom: "Pleuritic chest pain with abrupt dyspnea", fact: "a contrast-filling defect in a pulmonary artery with acute pleuritic symptoms" },
      { id: "rad-epidural", diagnosis: "Traumatic epidural hematoma", treatment: "Emergency neurosurgical evacuation", symptom: "A lucid interval followed by rapid decline", fact: "a biconvex hyperdense extra-axial collection that does not cross cranial sutures" },
      { id: "rad-dissection", diagnosis: "Acute aortic dissection on CT angiography", treatment: "Intravenous beta blockade and urgent surgical assessment", symptom: "Tearing chest pain radiating to the back", fact: "an intimal flap dividing true and false aortic lumens" },
      { id: "rad-volvulus", diagnosis: "Sigmoid volvulus", treatment: "Endoscopic detorsion followed by definitive surgery", symptom: "Marked distention with obstipation", fact: "a coffee-bean configuration of a massively dilated sigmoid colon" },
      { id: "rad-vertebral", diagnosis: "Vertebral osteomyelitis on MRI", treatment: "Culture-directed antibiotics with debridement when indicated", symptom: "Persistent focal back pain with fever", fact: "adjacent vertebral endplate and disc enhancement with surrounding marrow edema" },
      { id: "rad-hcc", diagnosis: "Intermediate-stage hepatocellular carcinoma on multiphasic CT", treatment: "Transarterial chemoembolization", symptom: "Right-upper-quadrant discomfort with weight loss", fact: "a cirrhotic liver containing multifocal disease with arterial enhancement, delayed washout, and no vascular invasion" },
      { id: "rad-osteoid", diagnosis: "Osteoid osteoma on CT", treatment: "Radiofrequency ablation", symptom: "Nocturnal focal bone pain relieved by NSAIDs", fact: "a small lucent cortical nidus surrounded by reactive sclerosis" }
    ]
  },
  pathology: {
    label: "Pathology",
    cases: [
      { id: "path-apl", diagnosis: "Acute promyelocytic leukemia", treatment: "Immediate all-trans retinoic acid", symptom: "Bleeding with pancytopenia", fact: "abnormal promyelocytes, Auer rods, coagulopathy, and a PML-RARA fusion" },
      { id: "path-gpa", diagnosis: "Granulomatosis with polyangiitis", treatment: "Rituximab plus glucocorticoids", symptom: "Sinus disease, hematuria, and lung nodules", fact: "necrotizing granulomatous inflammation with pauci-immune crescentic glomerulonephritis" },
      { id: "path-dlbcl", diagnosis: "Diffuse large B-cell lymphoma", treatment: "R-CHOP chemoimmunotherapy", symptom: "A rapidly enlarging painless lymph node", fact: "sheets of large atypical CD20-positive lymphoid cells with high proliferation" },
      { id: "path-hsil", diagnosis: "High-grade squamous intraepithelial cervical lesion", treatment: "Excisional cervical procedure", symptom: "Usually detected by abnormal screening", fact: "full-thickness squamous atypia linked to high-risk human papillomavirus" },
      { id: "path-barrett", diagnosis: "Barrett esophagus with high-grade dysplasia", treatment: "Endoscopic eradication therapy", symptom: "Chronic reflux with a premalignant biopsy", fact: "intestinal metaplasia of distal esophageal mucosa with marked cytologic atypia" },
      { id: "path-colon", diagnosis: "Colorectal adenocarcinoma", treatment: "Oncologic colectomy", symptom: "Iron-deficiency anemia with altered bowel habits", fact: "invasive malignant glands with desmoplasia arising in colonic mucosa" },
      { id: "path-papillary", diagnosis: "Papillary thyroid carcinoma", treatment: "Risk-adapted thyroidectomy", symptom: "A painless thyroid nodule", fact: "papillary architecture with nuclear grooves, inclusions, clearing, and psammoma bodies" }
    ]
  },
  "physical-medicine-rehabilitation": {
    label: "Physical Medicine & Rehabilitation",
    cases: [
      { id: "pmr-cervical", diagnosis: "Cervical radiculopathy", treatment: "Activity modification and targeted physical therapy", symptom: "Neck pain radiating into one arm", fact: "dermatomal arm pain and paresthesia with a corresponding depressed reflex" },
      { id: "pmr-stenosis", diagnosis: "Lumbar spinal stenosis", treatment: "Flexion-based therapy and graded conditioning", symptom: "Leg discomfort relieved by sitting", fact: "neurogenic claudication triggered by standing or extension and relieved by flexion" },
      { id: "pmr-spasticity", diagnosis: "Post-stroke focal spasticity", treatment: "Botulinum toxin injection with therapy", symptom: "Velocity-dependent limb stiffness", fact: "a focal upper-motor-neuron pattern that limits hygiene or function after stroke" },
      { id: "pmr-phantom", diagnosis: "Phantom limb pain", treatment: "Mirror therapy with neuropathic pain medication", symptom: "Pain perceived in an amputated limb", fact: "burning or cramping pain localized to a limb that is no longer present" },
      { id: "pmr-myofascial", diagnosis: "Myofascial pain syndrome", treatment: "Stretching, exercise, and trigger-point therapy", symptom: "Regional aching with reproducible trigger points", fact: "localized muscle pain reproduced by palpation of taut bands without neurologic deficit" },
      { id: "pmr-dequervain", diagnosis: "De Quervain tenosynovitis", treatment: "Thumb-spica splinting with corticosteroid injection", symptom: "Radial wrist pain during thumb movement", fact: "first dorsal-compartment tenderness with pain reproduced by the Finkelstein maneuver" },
      { id: "pmr-epicondylitis", diagnosis: "Lateral epicondylitis", treatment: "Activity modification and eccentric rehabilitation", symptom: "Lateral elbow pain with gripping", fact: "tenderness at the common extensor origin with pain during resisted wrist extension" }
    ]
  },
  geriatrics: {
    label: "Geriatrics",
    cases: [
      { id: "geri-delirium", diagnosis: "Acute delirium", treatment: "Treat the cause and use nonpharmacologic reorientation", symptom: "Fluctuating inattention and altered awareness", fact: "an acute fluctuating change in attention and cognition during an intercurrent illness" },
      { id: "geri-polypharmacy", diagnosis: "Medication-related orthostatic hypotension", treatment: "Deprescribe contributing medications and hydrate", symptom: "Lightheadedness after standing", fact: "a reproducible blood-pressure drop on standing after several hypotensive medicines were added" },
      { id: "geri-frailty", diagnosis: "Geriatric frailty syndrome", treatment: "Progressive resistance exercise and nutrition support", symptom: "Weakness, slowness, and low activity", fact: "unintentional weight loss, exhaustion, weakness, slow gait, and diminished activity" },
      { id: "geri-falls", diagnosis: "Multifactorial fall risk", treatment: "Exercise, medication review, and home-hazard reduction", symptom: "Recurrent falls without syncope", fact: "gait impairment combined with unsafe medications and environmental hazards" },
      { id: "geri-pressure", diagnosis: "Stage 2 pressure injury", treatment: "Pressure off-loading and moisture-balanced wound care", symptom: "A shallow painful sacral ulcer", fact: "partial-thickness skin loss over a pressure point without exposed fat or deeper tissue" },
      { id: "geri-osteoporosis", diagnosis: "Osteoporosis", treatment: "Alendronate", symptom: "A low-trauma fragility fracture", fact: "a hip or vertebral fragility fracture with markedly reduced bone-mineral density" },
      { id: "geri-dlb", diagnosis: "Dementia with Lewy bodies", treatment: "Rivastigmine", symptom: "Fluctuating cognition with visual hallucinations", fact: "progressive cognitive decline accompanied by visual hallucinations, parkinsonism, and marked fluctuations" }
    ]
  },
  neurosurgery: {
    label: "Neurosurgery",
    cases: [
      { id: "ns-cauda", diagnosis: "Cauda equina syndrome", treatment: "Emergency lumbar decompression", symptom: "Saddle anesthesia with urinary retention", fact: "acute bilateral radicular deficits, perineal sensory loss, and new bladder dysfunction" },
      { id: "ns-sdh", diagnosis: "Chronic subdural hematoma", treatment: "Burr-hole drainage", symptom: "Progressive headache and confusion after a fall", fact: "a crescentic extra-axial collection with gradual cognitive or focal decline" },
      { id: "ns-nph", diagnosis: "Normal-pressure hydrocephalus", treatment: "Ventriculoperitoneal shunt", symptom: "Gait impairment with cognitive and urinary change", fact: "ventriculomegaly with a magnetic gait, cognitive decline, and urinary urgency" },
      { id: "ns-pituitary", diagnosis: "Pituitary macroadenoma with chiasmal compression", treatment: "Transsphenoidal resection", symptom: "Bitemporal visual-field loss", fact: "a sellar mass compressing the optic chiasm with progressive peripheral vision loss" },
      { id: "ns-cervical", diagnosis: "Degenerative cervical myelopathy", treatment: "Cervical decompression and fusion", symptom: "Hand clumsiness with a spastic gait", fact: "cord compression causing upper-motor-neuron leg signs and impaired hand dexterity" },
      { id: "ns-gbm", diagnosis: "Glioblastoma", treatment: "Maximal safe resection with radiotherapy and temozolomide", symptom: "Progressive headache with seizure or focal deficit", fact: "an irregular necrotic ring-enhancing mass that infiltrates across the corpus callosum" },
      { id: "ns-sah", diagnosis: "Aneurysmal subarachnoid hemorrhage", treatment: "Endovascular coiling with nimodipine", symptom: "Sudden thunderclap headache with meningismus", fact: "basal-cistern subarachnoid blood arising from a ruptured intracranial aneurysm" }
    ]
  },
  "critical-care": {
    label: "Critical Care",
    cases: [
      { id: "cc-septic", diagnosis: "Septic shock", treatment: "Broad-spectrum antibiotics, crystalloid, and norepinephrine", symptom: "Hypotension with organ dysfunction during infection", fact: "suspected infection, elevated lactate, and persistent hypotension requiring vasopressor support" },
      { id: "cc-ards", diagnosis: "Acute respiratory distress syndrome", treatment: "Low-tidal-volume ventilation with appropriate PEEP", symptom: "Severe hypoxemia with bilateral opacities", fact: "acute noncardiogenic pulmonary edema with impaired oxygenation after a major insult" },
      { id: "cc-dka", diagnosis: "Severe diabetic ketoacidosis with shock", treatment: "Intravenous fluids, insulin, and potassium-guided replacement", symptom: "Kussmaul breathing with abdominal pain", fact: "hyperglycemia, ketonemia, high-anion-gap acidosis, and circulatory collapse" },
      { id: "cc-cardiogenic", diagnosis: "Cardiogenic shock after myocardial infarction", treatment: "Urgent revascularization with hemodynamic support", symptom: "Cold extremities, pulmonary edema, and hypotension", fact: "low cardiac output and tissue hypoperfusion following an acute coronary occlusion" },
      { id: "cc-status", diagnosis: "Refractory status epilepticus", treatment: "Continuous anesthetic infusion with EEG monitoring", symptom: "Seizures continuing after first- and second-line therapy", fact: "ongoing electrographic or convulsive seizures despite a benzodiazepine and an antiseizure loading dose" },
      { id: "cc-myxedema", diagnosis: "Myxedema coma", treatment: "Intravenous levothyroxine with stress-dose hydrocortisone", symptom: "Hypothermia, bradycardia, and altered mental status", fact: "severe biochemical hypothyroidism with hypoventilation, hypothermia, and depressed consciousness" },
      { id: "cc-alf", diagnosis: "Acetaminophen-induced acute liver failure", treatment: "N-acetylcysteine", symptom: "Nausea followed by jaundice and encephalopathy", fact: "a toxic exposure followed by extreme aminotransferase elevation, coagulopathy, and hepatic encephalopathy" }
    ]
  },
  "family-medicine": {
    label: "Family Medicine",
    cases: [
      { id: "fm-htn", diagnosis: "Primary hypertension", treatment: "Thiazide-like diuretic", symptom: "Usually asymptomatic elevated blood pressure", fact: "repeated elevated office and out-of-office blood pressure without a secondary cause" },
      { id: "fm-t2dm", diagnosis: "Type 2 diabetes mellitus", treatment: "Metformin", symptom: "Polyuria and polydipsia", fact: "persistent hyperglycemia with insulin resistance and no ketoacidosis" },
      { id: "fm-hld", diagnosis: "Hyperlipidemia", treatment: "High-intensity statin", symptom: "Typically no symptoms", fact: "markedly elevated atherogenic cholesterol in a patient with high cardiovascular risk" },
      { id: "fm-tobacco", diagnosis: "Tobacco use disorder", treatment: "Varenicline with behavioral support", symptom: "Nicotine cravings and withdrawal", fact: "compulsive cigarette use despite harm with withdrawal during quit attempts" },
      { id: "fm-migraine", diagnosis: "Migraine without aura", treatment: "Sumatriptan for acute attacks", symptom: "Unilateral pulsatile headache with nausea", fact: "recurrent disabling unilateral throbbing headache with photophobia and nausea" },
      { id: "fm-gerd", diagnosis: "Gastroesophageal reflux disease", treatment: "Proton-pump inhibitor therapy", symptom: "Heartburn with acid regurgitation", fact: "typical postprandial burning and regurgitation without dysphagia, bleeding, or weight loss" },
      { id: "fm-cystitis", diagnosis: "Acute uncomplicated cystitis", treatment: "Nitrofurantoin", symptom: "Dysuria with urinary frequency and urgency", fact: "lower urinary symptoms with pyuria and nitrites but no fever or flank pain" }
    ]
  }
};

window.TREATMENT_MECHANISMS = {
  "neuro-tn": "stabilizes the inactivated state of voltage-gated sodium channels, reducing high-frequency neuronal firing",
  "neuro-parkinson": "replaces striatal dopamine while peripheral decarboxylase inhibition increases central availability and limits peripheral effects",
  "neuro-tle": "binds synaptic vesicle protein SV2A and modulates neurotransmitter release",
  "neuro-rrms": "targets CD20-positive B cells and depletes a population that contributes to inflammatory demyelination",
  "neuro-mg": "reversibly inhibits acetylcholinesterase and increases acetylcholine at the neuromuscular junction",

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
  "rad-vertebral": "eradicates the cultured organism while debridement removes devitalized infected tissue when necessary",

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
  "fm-migraine": "agonizes serotonin 5-HT1B and 5-HT1D receptors, constricting cranial vessels and reducing trigeminal neuropeptide release",

  // Expanded non-neurology library.
  "card-hcm": "blocks cardiac beta-adrenergic receptors, slowing the heart and reducing contractility to improve diastolic filling and lessen dynamic outflow obstruction",
  "card-as": "replaces the stenotic aortic valve with a prosthesis and restores forward systolic flow",
  "pulm-sarcoid": "activates glucocorticoid receptors and suppresses inflammatory gene transcription",
  "pulm-ipf": "inhibits VEGF, FGF, and PDGF receptor tyrosine kinases and reduces profibrotic signaling",
  "gi-achalasia": "divides lower-esophageal-sphincter muscle fibers and reduces resistance to esophageal emptying",
  "gi-cholangitis": "decompresses the infected obstructed biliary tree through endoscopic drainage",
  "renal-ain": "removes the antigenic medication trigger so interstitial inflammation can resolve",
  "renal-rta1": "provides citrate that is metabolized to bicarbonate while replenishing potassium and reducing urinary stone formation",
  "endo-acromegaly": "removes the growth-hormone-secreting pituitary adenoma through a transsphenoidal approach",
  "endo-pheo": "blocks alpha-adrenergic vasoconstriction before the catecholamine-secreting tumor is removed",
  "heme-cml": "inhibits the BCR-ABL tyrosine kinase that drives myeloid proliferation",
  "heme-hodgkin": "combines DNA damage, topoisomerase inhibition, microtubule disruption, and free-radical injury to kill lymphoma cells",
  "id-syphilis": "binds penicillin-binding proteins and blocks bacterial cell-wall cross-linking",
  "id-tb": "combines agents that inhibit mycolic-acid synthesis, RNA polymerase, arabinogalactan assembly, and intracellular bacillary metabolism",
  "rheum-pmr": "activates glucocorticoid receptors and suppresses inflammatory cytokine transcription",
  "rheum-scleroderma": "blocks angiotensin-converting enzyme, reducing angiotensin II generation and aldosterone signaling",
  "derm-pemphigus": "depletes CD20-positive B cells while glucocorticoids suppress pathogenic inflammation",
  "derm-tinea": "inhibits fungal squalene epoxidase, depleting ergosterol and accumulating toxic squalene",
  "psych-ocd": "combines exposure without ritual completion with serotonin-transporter blockade to weaken reinforced compulsive responses",
  "psych-ptsd": "uses trauma-focused learning while blocking serotonin reuptake to reduce persistent trauma symptoms",
  "obgyn-fibroid": "releases a progestin locally, causing endometrial decidualization and atrophy that reduce menstrual bleeding",
  "obgyn-torsion": "untwists the adnexal vascular pedicle and restores ovarian blood flow",
  "surg-mesenteric": "restores mesenteric arterial perfusion while potentiating antithrombin to prevent further clot propagation",
  "surg-perf-ulcer": "closes the perforation and controls bacterial and chemical contamination of the peritoneum",
  "ortho-achilles": "protects the tendon in plantar flexion before progressive loading restores tendon continuity and function",
  "ortho-rotator": "progressively restores shoulder mechanics while repair can reattach a selected torn tendon to bone",
  "em-co": "displaces carbon monoxide from hemoglobin and cytochrome oxidase while shortening the carboxyhemoglobin half-life",
  "em-methem": "accepts electrons from NADPH-dependent pathways and reduces ferric heme iron back to its oxygen-carrying ferrous state",
  "oph-diabetic": "neutralizes vascular endothelial growth factor and reduces retinal vascular leakage and edema",
  "oph-cataract": "removes the cloudy crystalline lens and replaces it with a transparent intraocular lens",
  "ent-meniere": "reduces sodium retention and is used with dietary sodium restriction to limit endolymphatic fluid pressure",
  "ent-otitis-externa": "inhibits bacterial DNA gyrase and topoisomerase IV directly within the infected ear canal",
  "uro-rcc": "removes the localized renal tumor while preserving uninvolved kidney tissue when feasible",
  "uro-oab": "stimulates beta-3 adrenergic receptors and relaxes detrusor muscle during bladder filling",
  "anes-spinal-hypotension": "stimulates vascular alpha-1 receptors and restores systemic vascular tone after sympathetic blockade",
  "anes-residual-block": "encapsulates rocuronium molecules and rapidly removes them from the neuromuscular junction",
  "allergy-contact": "activates cutaneous glucocorticoid receptors and suppresses delayed T-cell-mediated inflammation",
  "allergy-serum": "removes the immune-complex trigger while anti-inflammatory therapy reduces histamine- and prostaglandin-mediated symptoms",
  "rad-hcc": "delivers chemotherapy through the tumor-feeding artery and then embolizes its arterial blood supply",
  "rad-osteoid": "uses focused thermal energy to destroy the painful prostaglandin-producing nidus",
  "path-colon": "removes the colonic tumor together with its regional lymphatic drainage",
  "path-papillary": "removes malignant thyroid tissue in an operation tailored to tumor extent and recurrence risk",
  "pmr-dequervain": "unloads the inflamed first dorsal tendon compartment while local glucocorticoid suppresses inflammation",
  "pmr-epicondylitis": "reduces repetitive extensor loading before progressive eccentric exercise improves tendon capacity",
  "geri-osteoporosis": "binds bone mineral and inhibits farnesyl pyrophosphate synthase in active osteoclasts",
  "geri-dlb": "reversibly inhibits acetylcholinesterase and increases cortical acetylcholine signaling",
  "ns-gbm": "combines cytoreduction with radiation-induced DNA damage and alkylation of tumor-cell DNA",
  "ns-sah": "excludes the ruptured aneurysm from circulation while calcium-channel blockade reduces delayed cerebral ischemia",
  "cc-myxedema": "replaces thyroid hormone for nuclear-receptor signaling while stress-dose glucocorticoid covers possible adrenal insufficiency",
  "cc-alf": "replenishes hepatic glutathione and increases detoxification of the reactive acetaminophen metabolite NAPQI",
  "fm-gerd": "irreversibly inhibits the gastric parietal-cell hydrogen-potassium ATPase",
  "fm-cystitis": "forms reactive bacterial intermediates that damage DNA and ribosomal proteins within the urinary tract"
};

// Adult age ranges and sex-linked constraints used when pairing cases with patients.
// Cases not listed here use the adult default of 18–85 years and either sex.
window.CASE_DEMOGRAPHICS = {
  "neuro-tn": { minAge: 40 },
  "neuro-parkinson": { minAge: 50 },
  "neuro-rrms": { maxAge: 60 },
  "neuro-mg": { maxAge: 75 },
  "card-stemi": { minAge: 35 },
  "card-hfref": { minAge: 35 },
  "card-af": { minAge: 45 },
  "pulm-copd": { minAge: 40 },
  "pulm-osa": { minAge: 30 },
  "gi-he": { minAge: 30 },
  "renal-hyperk": { minAge: 30 },
  "endo-hyperpara": { minAge: 35 },
  "heme-aml": { minAge: 30 },
  "heme-myeloma": { minAge: 50 },
  "id-cdiff": { minAge: 30 },
  "id-endo": { minAge: 25 },
  "rheum-gout": { minAge: 30 },
  "rheum-gca": { minAge: 50 },
  "rheum-as": { maxAge: 50 },
  "derm-zoster": { minAge: 50 },
  "derm-melanoma": { minAge: 25 },
  "psych-schiz": { maxAge: 50 },
  "obgyn-ectopic": { minAge: 18, maxAge: 45, sex: "female" },
  "obgyn-preeclampsia": { minAge: 18, maxAge: 45, sex: "female" },
  "obgyn-endometriosis": { minAge: 18, maxAge: 50, sex: "female" },
  "obgyn-pid": { minAge: 18, maxAge: 50, sex: "female" },
  "obgyn-pph": { minAge: 18, maxAge: 45, sex: "female" },
  "ortho-hip": { minAge: 65 },
  "ortho-acl": { minAge: 18, maxAge: 45 },
  "ortho-carpal": { minAge: 30 },
  "ortho-oa": { minAge: 45 },
  "oph-angle": { minAge: 40 },
  "oph-detach": { minAge: 40 },
  "oph-glaucoma": { minAge: 40 },
  "ent-bppv": { minAge: 40 },
  "uro-bph": { minAge: 50, sex: "male" },
  "uro-prostatitis": { minAge: 18, maxAge: 70, sex: "male" },
  "uro-torsion": { minAge: 18, maxAge: 40, sex: "male" },
  "uro-ed": { minAge: 30, sex: "male" },
  "rad-dissection": { minAge: 40 },
  "rad-volvulus": { minAge: 50 },
  "rad-vertebral": { minAge: 40 },
  "path-dlbcl": { minAge: 40 },
  "path-hsil": { minAge: 21, maxAge: 65, sex: "female" },
  "path-barrett": { minAge: 40 },
  "pmr-cervical": { minAge: 30 },
  "pmr-stenosis": { minAge: 50 },
  "geri-delirium": { minAge: 65 },
  "geri-polypharmacy": { minAge: 65 },
  "geri-frailty": { minAge: 65 },
  "geri-falls": { minAge: 65 },
  "geri-pressure": { minAge: 65 },
  "ns-sdh": { minAge: 60 },
  "ns-nph": { minAge: 65 },
  "ns-cervical": { minAge: 50 },
  "cc-cardiogenic": { minAge: 40 },
  "fm-htn": { minAge: 30 },
  "fm-t2dm": { minAge: 30 },
  "fm-hld": { minAge: 35 },
  "fm-migraine": { maxAge: 55 },
  "card-hcm": { minAge: 18, maxAge: 70 },
  "card-as": { minAge: 60, maxAge: 85 },
  "pulm-sarcoid": { minAge: 18, maxAge: 60 },
  "pulm-ipf": { minAge: 50, maxAge: 85 },
  "gi-achalasia": { minAge: 18, maxAge: 80 },
  "gi-cholangitis": { minAge: 30, maxAge: 85 },
  "renal-ain": { minAge: 18, maxAge: 85 },
  "renal-rta1": { minAge: 18, maxAge: 70 },
  "endo-acromegaly": { minAge: 20, maxAge: 70 },
  "endo-pheo": { minAge: 18, maxAge: 70 },
  "heme-cml": { minAge: 30, maxAge: 85 },
  "heme-hodgkin": { minAge: 18, maxAge: 65 },
  "id-syphilis": { minAge: 18, maxAge: 70 },
  "id-tb": { minAge: 18, maxAge: 85 },
  "rheum-pmr": { minAge: 50, maxAge: 85 },
  "rheum-scleroderma": { minAge: 20, maxAge: 70 },
  "derm-pemphigus": { minAge: 40, maxAge: 85 },
  "derm-tinea": { minAge: 18, maxAge: 85 },
  "psych-ocd": { minAge: 18, maxAge: 70 },
  "psych-ptsd": { minAge: 18, maxAge: 70 },
  "obgyn-fibroid": { minAge: 18, maxAge: 55, sex: "female" },
  "obgyn-torsion": { minAge: 18, maxAge: 50, sex: "female" },
  "surg-mesenteric": { minAge: 50, maxAge: 85 },
  "surg-perf-ulcer": { minAge: 18, maxAge: 85 },
  "ortho-achilles": { minAge: 18, maxAge: 60 },
  "ortho-rotator": { minAge: 30, maxAge: 80 },
  "em-co": { minAge: 18, maxAge: 85 },
  "em-methem": { minAge: 18, maxAge: 85 },
  "oph-diabetic": { minAge: 30, maxAge: 85 },
  "oph-cataract": { minAge: 55, maxAge: 85 },
  "ent-meniere": { minAge: 20, maxAge: 75 },
  "ent-otitis-externa": { minAge: 18, maxAge: 85 },
  "uro-rcc": { minAge: 40, maxAge: 85 },
  "uro-oab": { minAge: 18, maxAge: 85 },
  "anes-spinal-hypotension": { minAge: 18, maxAge: 85 },
  "anes-residual-block": { minAge: 18, maxAge: 85 },
  "allergy-contact": { minAge: 18, maxAge: 85 },
  "allergy-serum": { minAge: 18, maxAge: 85 },
  "rad-hcc": { minAge: 40, maxAge: 85 },
  "rad-osteoid": { minAge: 18, maxAge: 35 },
  "path-colon": { minAge: 40, maxAge: 85 },
  "path-papillary": { minAge: 18, maxAge: 65 },
  "pmr-dequervain": { minAge: 18, maxAge: 65 },
  "pmr-epicondylitis": { minAge: 25, maxAge: 70 },
  "geri-osteoporosis": { minAge: 65, maxAge: 85 },
  "geri-dlb": { minAge: 60, maxAge: 85 },
  "ns-gbm": { minAge: 40, maxAge: 85 },
  "ns-sah": { minAge: 35, maxAge: 75 },
  "cc-myxedema": { minAge: 50, maxAge: 85 },
  "cc-alf": { minAge: 18, maxAge: 70 },
  "fm-gerd": { minAge: 18, maxAge: 85 },
  "fm-cystitis": { minAge: 18, maxAge: 65, sex: "female" }
};
