"use client";

import { useEffect, useMemo, useState } from "react";

type MetricKey =
  | "health"
  | "access"
  | "workforce"
  | "treasury"
  | "trust"
  | "industry";

type Metrics = Record<MetricKey, number>;
type AssumptionKey = "friction" | "safetyNet" | "marketPower";
type Assumptions = Record<AssumptionKey, number>;
type Panel = "assumptions" | "sources" | "briefing" | null;

type Choice = {
  id: string;
  title: string;
  short: string;
  cost: number;
  effects: Partial<Metrics>;
  assumption?: AssumptionKey;
  signal: string;
  consequence: string;
  quote: string;
  quoteBy: string;
};

type Crisis = {
  id: string;
  docket: string;
  category: string;
  title: string;
  dispatch: string;
  human: string;
  fact: string;
  sourceLabel: string;
  sourceUrl: string;
  choices: Choice[];
};

type Report = {
  crisis: Crisis;
  choice: Choice;
  deltas: Partial<Metrics>;
};

type Ending = {
  id: string;
  code: string;
  title: string;
  kicker: string;
  body: string;
  epitaph: string;
};

const METRIC_META: Record<MetricKey, { label: string; short: string }> = {
  health: { label: "Population health", short: "Health" },
  access: { label: "Care access", short: "Access" },
  workforce: { label: "Workforce capacity", short: "Staff" },
  treasury: { label: "Federal balance", short: "Balance" },
  trust: { label: "Public trust", short: "Trust" },
  industry: { label: "Board confidence", short: "Boards" },
};

const INITIAL_METRICS: Metrics = {
  health: 48,
  access: 43,
  workforce: 46,
  treasury: 58,
  trust: 34,
  industry: 71,
};

const DEFAULT_ASSUMPTIONS: Assumptions = {
  friction: 110,
  safetyNet: 100,
  marketPower: 115,
};

const SOURCES = [
  {
    label: "CMS — National Health Expenditure Fact Sheet (2024 data)",
    note: "$5.3T total spending; $15,474 per person; 18% of GDP.",
    url: "https://www.cms.gov/data-research/statistics-trends-and-reports/national-health-expenditure-data/nhe-fact-sheet",
  },
  {
    label: "CDC/NCHS — Health Insurance Coverage, 2024",
    note: "27.2M people uninsured; 11.6% of working-age adults uninsured.",
    url: "https://www.cdc.gov/nchs/pressroom/releases/20250624.html",
  },
  {
    label: "HHS OIG — Medicare Advantage SNF denials, 2026",
    note: "95% of appealed denials in the review were overturned.",
    url: "https://oig.hhs.gov/reports/all/2026/medicare-advantage-organizations-overturned-nearly-all-appealed-prior-authorization-denials-for-skilled-nursing-facility-admission-raising-concerns-about-initial-denials/",
  },
  {
    label: "CFPB — Medical collections on credit records, 2024",
    note: "15M people and more than $49B in outstanding medical bills.",
    url: "https://www.consumerfinance.gov/archive/newsroom/cfpb-finds-15-million-americans-have-medical-bills-on-their-credit-reports/",
  },
  {
    label: "GAO — Health Care Consolidation, 2025",
    note: "At least 47% of physicians were hospital-affiliated in 2024; price effects are documented.",
    url: "https://files.gao.gov/reports/GAO-25-107450/index.html",
  },
  {
    label: "AMA — Physician burnout, 2026",
    note: "41.9% reported at least one burnout symptom in 2025.",
    url: "https://www.ama-assn.org/press-center/ama-press-releases/ama-physician-burnout-rates-are-falling-specialty-gaps-remain",
  },
];

const CRISES: Crisis[] = [
  {
    id: "appeal-window",
    docket: "PA-95",
    category: "UTILIZATION MANAGEMENT",
    title: "The appeal window is also a load-bearing wall",
    dispatch:
      "Halcyon Benefit Systems has deployed an authorization engine that denies post-acute care before the request finishes uploading. Appeals are technically available between 2:11 and 2:19 a.m.",
    human:
      "Maribel, 72, is waiting in a hospital hallway while her daughter refreshes a portal that says: HUMAN REVIEW COMPLETE (0.04 seconds).",
    fact:
      "A 2026 HHS OIG review found Medicare Advantage plans overturned 95% of appealed skilled-nursing-facility denials in favor of the enrollee.",
    sourceLabel: "HHS OIG, 2026",
    sourceUrl:
      "https://oig.hhs.gov/reports/all/2026/medicare-advantage-organizations-overturned-nearly-all-appealed-prior-authorization-denials-for-skilled-nursing-facility-admission-raising-concerns-about-initial-denials/",
    choices: [
      {
        id: "auto-approve",
        title: "Auto-approve after 48 hours",
        short: "Require human review and make silence mean yes.",
        cost: 2,
        effects: { health: 8, access: 9, workforce: 6, treasury: -5, trust: 8, industry: -8 },
        assumption: "friction",
        signal: "Access ↑↑  Staff ↑  Balance ↓  Boards ↓",
        consequence:
          "The denial queue collapses. So does Halcyon's quarterly guidance. Thousands of patients discover that a clock can be a civil right.",
        quote: "We strongly support timely care, once timeliness has been appropriately authorized.",
        quoteBy: "Halcyon Benefits, urgent press release",
      },
      {
        id: "suspend-algorithm",
        title: "Suspend automated denials",
        short: "Auditable criteria, licensed reviewers, public error reports.",
        cost: 3,
        effects: { health: 12, access: 11, workforce: 7, treasury: -9, trust: 11, industry: -15 },
        assumption: "friction",
        signal: "Health ↑↑  Trust ↑↑  Balance ↓↓  Boards ↓↓↓",
        consequence:
          "The algorithm is unplugged. Its lobbyist remains operational and books every available table in Washington.",
        quote: "My mother got a room before I learned the fax number by heart.",
        quoteBy: "Dani Ortiz, family caregiver",
      },
      {
        id: "denial-chatbot",
        title: "Launch a denial chatbot",
        short: "Give every no a friendlier font and a first name.",
        cost: 1,
        effects: { health: -6, access: -6, workforce: -4, treasury: 5, trust: -9, industry: 11 },
        assumption: "marketPower",
        signal: "Balance ↑  Boards ↑↑  Health ↓  Trust ↓↓",
        consequence:
          "Patients now receive denials in eight languages. The chatbot apologizes with industry-leading empathy before closing the ticket.",
        quote: "Hi! I'm Cora. It looks like your claim and your hope have both expired.",
        quoteBy: "Cora™, compassionate resolution agent",
      },
    ],
  },
  {
    id: "medical-debt",
    docket: "AR-49B",
    category: "HOUSEHOLD SOLVENCY",
    title: "The debt is considered a vital sign",
    dispatch:
      "Mercy Ledger Services has begun placing QR codes on discharge papers so families can crowdfund before reaching the parking garage. Investors call the product 'bedside liquidity.'",
    human:
      "Eli finished chemotherapy in March. In July, he is still deciding which bill is real and which collector merely sounds real.",
    fact:
      "CFPB research found 15 million Americans had medical bills on their credit reports in 2023, totaling more than $49 billion in collections.",
    sourceLabel: "CFPB, 2024",
    sourceUrl:
      "https://www.consumerfinance.gov/archive/newsroom/cfpb-finds-15-million-americans-have-medical-bills-on-their-credit-reports/",
    choices: [
      {
        id: "debt-firewall",
        title: "Build a medical-debt firewall",
        short: "Ban credit reporting; automate charity-care screening.",
        cost: 3,
        effects: { health: 8, access: 10, treasury: -8, trust: 12, industry: -13 },
        assumption: "safetyNet",
        signal: "Access ↑↑  Trust ↑↑  Balance ↓  Boards ↓↓",
        consequence:
          "Millions of balances vanish from credit files. The economy survives the shocking discovery that illness is not a character reference.",
        quote: "I can apply for an apartment again. Apparently remission was not enough.",
        quoteBy: "Eli Ward, leukemia survivor",
      },
      {
        id: "billing-standard",
        title: "Standardize every bill",
        short: "One format, one appeal path, interest capped at zero.",
        cost: 2,
        effects: { health: 3, access: 5, workforce: 2, treasury: -3, trust: 7, industry: -5 },
        assumption: "friction",
        signal: "Trust ↑  Access ↑  Balance ↓  Boards ↓",
        consequence:
          "The new bill fits on one page. Hospital revenue-cycle departments declare the page dangerously legible.",
        quote: "Our 411-field statement was an important form of patient engagement.",
        quoteBy: "Mercy Ledger Association",
      },
      {
        id: "gratitude-bonds",
        title: "Issue Patient Gratitude Bonds",
        short: "Securitize unpaid bills and rename them resilience.",
        cost: 1,
        effects: { health: -4, access: -5, treasury: 7, trust: -10, industry: 13 },
        assumption: "marketPower",
        signal: "Balance ↑  Boards ↑↑  Access ↓  Trust ↓↓",
        consequence:
          "The bonds are oversubscribed. Families receive commemorative certificates suitable for framing or use as court evidence.",
        quote: "Every diagnosis is an asset class if you believe in innovation.",
        quoteBy: "Beacon Orchard Capital",
      },
    ],
  },
  {
    id: "rural-closure",
    docket: "R-ER-17",
    category: "RURAL ACCESS",
    title: "The county has one ambulance and it is networking",
    dispatch:
      "Northstar Community Hospital has twelve days of cash. The nearest emergency department is 83 miles away, or 117 when the bridge is emotionally unavailable.",
    human:
      "Nurse Kay Redfeather has worked thirty-six hours. She is also the hospital's respiratory therapist until Tuesday.",
    fact:
      "Rural hospital analyses consistently document closures, financial instability, and longer travel for essential emergency and inpatient care.",
    sourceLabel: "Center for Healthcare Quality & Payment Reform, 2026",
    sourceUrl: "https://ruralhospitals.chqpr.org/downloads/Rural_Hospitals_at_Risk_of_Closing.pdf",
    choices: [
      {
        id: "public-utility",
        title: "Fund care as a public utility",
        short: "Global operating budgets for essential rural facilities.",
        cost: 3,
        effects: { health: 10, access: 14, workforce: 9, treasury: -12, trust: 9, industry: -8 },
        assumption: "safetyNet",
        signal: "Access ↑↑↑  Staff ↑↑  Balance ↓↓  Boards ↓",
        consequence:
          "Northstar stays open. For the first time, its budget rewards readiness instead of profitable appendixes.",
        quote: "We had a quiet night. Under the old model, that counted as failure.",
        quoteBy: "Kay Redfeather, RN and everything else",
      },
      {
        id: "regional-compact",
        title: "Create a regional compact",
        short: "Shared staff, transport, telehealth, and stabilization funds.",
        cost: 2,
        effects: { health: 6, access: 8, workforce: 5, treasury: -6, trust: 5, industry: -2 },
        assumption: "safetyNet",
        signal: "Access ↑↑  Staff ↑  Balance ↓",
        consequence:
          "Four counties share specialists and an air ambulance. Everyone dislikes the compromise, which is how the press knows it may be functional.",
        quote: "It is not enough. It is also not nothing. We have become policy experts in that distance.",
        quoteBy: "Mayor Lena Moss, Northstar County",
      },
      {
        id: "kiosk",
        title: "Install an AI care kiosk",
        short: "Replace the night shift with a ring light and terms of service.",
        cost: 1,
        effects: { health: -8, access: -10, workforce: -7, treasury: 8, trust: -9, industry: 12 },
        assumption: "marketPower",
        signal: "Balance ↑↑  Boards ↑↑  Health ↓↓  Access ↓↓",
        consequence:
          "The hospital closes. The kiosk remains, advising chest-pain patients to consider breathing exercises and a premium subscription.",
        quote: "Please stand within the diagnostic rectangle.",
        quoteBy: "Northstar CarePoint Mini™",
      },
    ],
  },
  {
    id: "workforce",
    docket: "HR-419",
    category: "CLINICAL WORKFORCE",
    title: "The clinicians have been optimized past the human limit",
    dispatch:
      "Caduceus Meridian Network has reduced bedside staffing while adding twelve mandatory resilience modules. Completion of the module on sleep is due by 4 a.m.",
    human:
      "Dr. Noor Patel has 1,126 unsigned inbox items and a patient waiting. The inbox is winning.",
    fact:
      "AMA data released in 2026 found 41.9% of surveyed physicians reported at least one burnout symptom in 2025.",
    sourceLabel: "American Medical Association, 2026",
    sourceUrl:
      "https://www.ama-assn.org/press-center/ama-press-releases/ama-physician-burnout-rates-are-falling-specialty-gaps-remain",
    choices: [
      {
        id: "admin-floor",
        title: "Set staffing and admin floors",
        short: "Minimum staffing; paid documentation time; fewer prior auths.",
        cost: 3,
        effects: { health: 9, access: 5, workforce: 15, treasury: -10, trust: 8, industry: -11 },
        assumption: "friction",
        signal: "Staff ↑↑↑  Health ↑↑  Balance ↓↓  Boards ↓↓",
        consequence:
          "Clinicians spend more time with patients. Productivity falls to the radical level where people can use the restroom.",
        quote: "I remembered why I went to medical school. Then I closed the inbox.",
        quoteBy: "Dr. Noor Patel",
      },
      {
        id: "paperwork-budget",
        title: "Give every form a budget",
        short: "One new requirement means one old requirement must die.",
        cost: 2,
        effects: { health: 5, access: 4, workforce: 10, treasury: -3, trust: 6, industry: -4 },
        assumption: "friction",
        signal: "Staff ↑↑  Trust ↑  Balance ↓",
        consequence:
          "Nine million checkboxes are retired with honors. A consulting firm offers to rebuild them as a blockchain.",
        quote: "The patient's chart is now shorter than the patient.",
        quoteBy: "Leah Song, primary-care physician assistant",
      },
      {
        id: "wellness-webinar",
        title: "Mandate a wellness webinar",
        short: "Attendance required. Camera on. Lunch not provided.",
        cost: 1,
        effects: { health: -5, access: -4, workforce: -11, treasury: 5, trust: -7, industry: 9 },
        assumption: "marketPower",
        signal: "Balance ↑  Boards ↑  Staff ↓↓  Trust ↓",
        consequence:
          "The webinar explains that burnout is a personal relationship with calendars. Three nurses resign during breakout rooms.",
        quote: "Have you tried setting a boundary with the emergency department?",
        quoteBy: "Caduceus Meridian Chief Joy Officer",
      },
    ],
  },
  {
    id: "consolidation",
    docket: "M&A-47",
    category: "MARKET STRUCTURE",
    title: "Your independent doctor has been acquired by a logo",
    dispatch:
      "Pinnacle Seraph Health proposes buying the last independent practices in six states. It promises synergy, coordinated care, and a facility fee for thinking about the building.",
    human:
      "Dr. Sam Chen's clinic is profitable. The acquisition deck still describes it as 'distressed but strategically harvestable.'",
    fact:
      "GAO reported that at least 47% of physicians were employed by or affiliated with hospital systems in 2024; reviewed studies linked consolidation to higher spending and prices.",
    sourceLabel: "U.S. Government Accountability Office, 2025",
    sourceUrl: "https://files.gao.gov/reports/GAO-25-107450/index.html",
    choices: [
      {
        id: "block-deal",
        title: "Block the acquisition",
        short: "Fund independent practices and enforce site-neutral payment.",
        cost: 3,
        effects: { health: 5, access: 7, workforce: 7, treasury: 4, trust: 9, industry: -16 },
        assumption: "marketPower",
        signal: "Access ↑  Balance ↑  Trust ↑↑  Boards ↓↓↓",
        consequence:
          "The deal dies. Pinnacle Seraph files a 900-page objection and briefly experiences an out-of-network feeling.",
        quote: "My clinic will remain medically necessary and financially unbranded.",
        quoteBy: "Dr. Sam Chen",
      },
      {
        id: "public-option-clinics",
        title: "Offer a public clinic option",
        short: "Buy threatened practices into locally governed networks.",
        cost: 3,
        effects: { health: 9, access: 11, workforce: 8, treasury: -11, trust: 8, industry: -13 },
        assumption: "safetyNet",
        signal: "Health ↑↑  Access ↑↑  Balance ↓↓  Boards ↓↓",
        consequence:
          "Communities gain clinics with public budgets and public meetings. The meetings are unbearable. The clinics remain open.",
        quote: "I can complain to a board whose names are not redacted.",
        quoteBy: "Mei Lawson, diabetes patient",
      },
      {
        id: "community-pdf",
        title: "Approve with a benefit plan",
        short: "Require a glossy PDF containing the word community 47 times.",
        cost: 1,
        effects: { health: -3, access: -5, workforce: -6, treasury: 3, trust: -7, industry: 14 },
        assumption: "marketPower",
        signal: "Boards ↑↑↑  Balance ↑  Staff ↓  Trust ↓",
        consequence:
          "The merger closes. Prices rise, quality remains 'transformational,' and the community receives a branded walking trail.",
        quote: "Consolidation creates choice by making all choices ours.",
        quoteBy: "Pinnacle Seraph Health",
      },
    ],
  },
  {
    id: "coverage-cliff",
    docket: "ENR-272",
    category: "COVERAGE",
    title: "Twenty-seven million people failed the eligibility captcha",
    dispatch:
      "The annual coverage reconciliation has removed millions of people for address mismatches, income fluctuations, and failure to identify every square containing a traffic light.",
    human:
      "Tasha moved apartments and lost coverage. Her asthma, despite repeated notices, did not update its mailing address.",
    fact:
      "CDC estimated 27.2 million people were uninsured in 2024; working-age adults in non-expansion states were almost twice as likely to be uninsured as those in expansion states.",
    sourceLabel: "CDC National Center for Health Statistics, 2025",
    sourceUrl: "https://www.cdc.gov/nchs/pressroom/releases/20250624.html",
    choices: [
      {
        id: "auto-enroll",
        title: "Auto-enroll the uninsured",
        short: "A national public plan with income-based premiums.",
        cost: 3,
        effects: { health: 13, access: 16, workforce: -3, treasury: -15, trust: 12, industry: -17 },
        assumption: "safetyNet",
        signal: "Access ↑↑↑  Health ↑↑  Balance ↓↓↓  Boards ↓↓↓",
        consequence:
          "Coverage cards arrive before invoices. The provider network strains, then expands. Insurance executives discover plein-air painting.",
        quote: "I used my inhaler without doing the copay math first.",
        quoteBy: "Tasha Green, newly boring insurance case",
      },
      {
        id: "subsidy-bridge",
        title: "Build a subsidy bridge",
        short: "Continuous eligibility and automatic renewals.",
        cost: 2,
        effects: { health: 7, access: 10, workforce: -1, treasury: -8, trust: 7, industry: -4 },
        assumption: "safetyNet",
        signal: "Access ↑↑  Health ↑  Balance ↓  Boards ↓",
        consequence:
          "Fewer people churn out of coverage. The phrase continuous eligibility tests poorly with people who prefer discontinuous humanity.",
        quote: "We reduced the form to six pages. Four are ceremonial.",
        quoteBy: "Office of Enrollment Simplification",
      },
      {
        id: "concierge",
        title: "Hire coverage concierges",
        short: "A premium hotline that routes callers to another hotline.",
        cost: 1,
        effects: { health: -3, access: -6, treasury: 4, trust: -8, industry: 9 },
        assumption: "friction",
        signal: "Balance ↑  Boards ↑  Access ↓  Trust ↓↓",
        consequence:
          "Average hold music improves by 18%. Coverage does not. The program wins a customer-experience award.",
        quote: "Your estimated wait is longer than your qualifying life event.",
        quoteBy: "National Coverage Concierge",
      },
    ],
  },
  {
    id: "pharmacy",
    docket: "RX-5.3T",
    category: "DRUGS & BENEFITS",
    title: "The formulary has entered its villain era",
    dispatch:
      "Orchid Meridian Pharmacy Services has moved essential drugs to a new tier called 'available in spirit.' Rebates are up. Adherence is down. The spreadsheet is immaculate.",
    human:
      "Luis cuts one tablet into thirds. His plan calls this shared decision-making.",
    fact:
      "CMS reports U.S. prescription drug spending reached $467 billion in 2024, within $5.3 trillion in national health expenditures.",
    sourceLabel: "Centers for Medicare & Medicaid Services, 2026",
    sourceUrl:
      "https://www.cms.gov/data-research/statistics-trends-and-reports/national-health-expenditure-data/nhe-fact-sheet",
    choices: [
      {
        id: "negotiate",
        title: "Negotiate and audit the middlemen",
        short: "Public negotiation, pass-through pricing, rebate disclosure.",
        cost: 3,
        effects: { health: 11, access: 10, treasury: 9, trust: 8, industry: -15 },
        assumption: "marketPower",
        signal: "Health ↑↑  Balance ↑↑  Trust ↑  Boards ↓↓↓",
        consequence:
          "Net prices fall. The rebate ecosystem is last seen entering a conference room with three attorneys and no witnesses.",
        quote: "My pill is one piece again.",
        quoteBy: "Luis Alvarez, retired machinist",
      },
      {
        id: "essential-list",
        title: "Guarantee essential medicines",
        short: "Public manufacturing backstop and zero-cost essentials.",
        cost: 3,
        effects: { health: 14, access: 12, treasury: -10, trust: 10, industry: -12 },
        assumption: "safetyNet",
        signal: "Health ↑↑↑  Access ↑↑  Balance ↓↓  Boards ↓↓",
        consequence:
          "Shortages ease. A government factory produces insulin without first creating a lifestyle brand.",
        quote: "We regret that the molecule has become political.",
        quoteBy: "Orchid Meridian Pharmacy Services",
      },
      {
        id: "naming-rights",
        title: "Auction medicine naming rights",
        short: "This epinephrine auto-injector brought to you by sports betting.",
        cost: 1,
        effects: { health: -5, access: -4, treasury: 10, trust: -9, industry: 13 },
        assumption: "marketPower",
        signal: "Balance ↑↑  Boards ↑↑  Health ↓  Trust ↓↓",
        consequence:
          "The budget improves. Children with allergies receive a bonus code valid on same-game parlays.",
        quote: "Ask your doctor if Brand Integration is right for you.",
        quoteBy: "Federal Office of Innovative Revenue",
      },
    ],
  },
  {
    id: "care-guarantee",
    docket: "EQ-2026",
    category: "ESSENTIAL CARE",
    title: "A ZIP code is practicing medicine without a license",
    dispatch:
      "A patchwork of state restrictions, network exclusions, and parity loopholes has made reproductive, maternal, and mental health care depend on geography and a claims adjuster's mood ring.",
    human:
      "Imani has called sixteen therapists. Four are taking patients. Zero take her insurance. The directory lists one who died in 2021.",
    fact:
      "Coverage is not the same as access: networks, workforce supply, geography, benefit design, and administrative barriers all shape whether care is actually available.",
    sourceLabel: "Model synthesis; see methodology",
    sourceUrl: "https://www.cdc.gov/nchs/fastats/health-insurance.htm",
    choices: [
      {
        id: "care-floor",
        title: "Set a national care floor",
        short: "Enforce parity and access for reproductive, maternal, and mental health care.",
        cost: 3,
        effects: { health: 14, access: 14, workforce: -4, treasury: -12, trust: 10, industry: -12 },
        assumption: "safetyNet",
        signal: "Health ↑↑↑  Access ↑↑↑  Balance ↓↓  Boards ↓↓",
        consequence:
          "Access expands and waiting lists expose the workforce shortage. At least the shortage can no longer hide behind an inaccurate directory.",
        quote: "I got an appointment with a living person. This is apparently a landmark outcome.",
        quoteBy: "Imani Brooks",
      },
      {
        id: "workforce-corps",
        title: "Build a national care corps",
        short: "Training, loan relief, community clinics, and interstate practice.",
        cost: 2,
        effects: { health: 9, access: 10, workforce: 12, treasury: -10, trust: 8, industry: -5 },
        assumption: "safetyNet",
        signal: "Staff ↑↑  Access ↑↑  Balance ↓↓  Trust ↑",
        consequence:
          "New clinicians arrive slowly, which is how training works outside campaign speeches. Communities begin to plan beyond next Tuesday.",
        quote: "The program took years. My patient needed it years ago. Both things are true.",
        quoteBy: "Dr. Mina Okafor, rural psychiatrist",
      },
      {
        id: "crisis-app",
        title: "Commission a crisis app",
        short: "Breathing animations, push notifications, no clinicians.",
        cost: 1,
        effects: { health: -6, access: -7, workforce: -3, treasury: 5, trust: -10, industry: 10 },
        assumption: "friction",
        signal: "Balance ↑  Boards ↑↑  Health ↓  Trust ↓↓",
        consequence:
          "Downloads soar after the app becomes mandatory. It asks users in crisis to rate their experience before revealing the phone number.",
        quote: "Your distress is important to us. Enable notifications?",
        quoteBy: "StillPoint Behavioral Solutions",
      },
    ],
  },
];

const ENDINGS: Record<string, Ending> = {
  humanException: {
    id: "humanException",
    code: "ENDING 01 / 08",
    title: "The Human Exception",
    kicker: "Care became easier to receive than permission.",
    body:
      "Health and access rose without hollowing out the people delivering care. The budget has opinions. The boards have lawyers. For now, the system recognizes a patient before it recognizes a claim.",
    epitaph: "You did not fix health care. You made it less interested in defeating people.",
  },
  excellentSpreadsheet: {
    id: "excellentSpreadsheet",
    code: "ENDING 02 / 08",
    title: "The Excellent Spreadsheet",
    kicker: "Every cell is green. Several counties are not.",
    body:
      "Federal balance and board confidence are historic. Health and access are also historic, according to a dashboard whose missing-data policy is itself classified.",
    epitaph: "The system is solvent. Please do not ask who the system is.",
  },
  noProviders: {
    id: "noProviders",
    code: "ENDING 03 / 08",
    title: "No Providers Found",
    kicker: "The network directory is now technically a memorial.",
    body:
      "The workforce broke before the model admitted it was a finite resource. Every plan promises access. There is simply no one left to provide it before lunch.",
    epitaph: "The wellness webinar remains available on demand.",
  },
  portal: {
    id: "portal",
    code: "ENDING 04 / 08",
    title: "You Were Replaced by a Portal",
    kicker: "Public trust completed an unexpected logout.",
    body:
      "Your administration announces a seamless leadership transition. The new Secretary is a responsive web form that does not accept punctuation in the name field.",
    epitaph: "Your appeal must be filed within 30 seconds of this notice.",
  },
  appropriation: {
    id: "appropriation",
    code: "ENDING 05 / 08",
    title: "Universal, Pending Appropriations",
    kicker: "Everyone has a card. Congress has the invoice.",
    body:
      "Access expanded rapidly and the federal balance did not. The next administration must decide whether the program is a foundation or a beautifully designed hostage note.",
    epitaph: "The care is real. So is the continuing resolution.",
  },
  lobbyists: {
    id: "lobbyists",
    code: "ENDING 06 / 08",
    title: "The Lobbyists Remember Your Name",
    kicker: "Industry confidence has achieved negative numbers spiritually.",
    body:
      "You broke several profitable arrangements and created several unprofitable enemies. Health improved. Your calendar is now fully booked by people who would like to discuss consequences.",
    epitaph: "A dark sedan is idling beside the revolving door.",
  },
  almostSystem: {
    id: "almostSystem",
    code: "ENDING 07 / 08",
    title: "A System, Almost",
    kicker: "The parts have begun acknowledging one another.",
    body:
      "No miracle occurred. Access improved, clinicians remained upright, and fewer families learned claims terminology during emergencies. It is mundane progress, the rarest American medical procedure.",
    epitaph: "The next crisis is already in the waiting room.",
  },
  managedContinuity: {
    id: "managedContinuity",
    code: "ENDING 08 / 08",
    title: "Managed Continuity",
    kicker: "The machine remains operational and morally inconclusive.",
    body:
      "You moved suffering, money, time, and power between columns. Some people got care. Some got explanations. The system thanks you for preserving its preferred state: too complicated to blame on anyone.",
    epitaph: "Your term has ended. Your deductible resets January 1.",
  },
};

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}

function shuffled<T>(items: T[]) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

function chooseEnding(metrics: Metrics): Ending {
  if (
    metrics.health >= 64 &&
    metrics.access >= 64 &&
    metrics.workforce >= 43 &&
    metrics.trust >= 43
  ) {
    return ENDINGS.humanException;
  }
  if (metrics.workforce < 29) return ENDINGS.noProviders;
  if (metrics.trust < 25) return ENDINGS.portal;
  if (metrics.industry >= 76 && (metrics.health < 44 || metrics.access < 42)) {
    return ENDINGS.excellentSpreadsheet;
  }
  if (metrics.treasury < 27 && metrics.access >= 62) return ENDINGS.appropriation;
  if (metrics.industry < 30 && metrics.health >= 58) return ENDINGS.lobbyists;
  if (
    metrics.health >= 57 &&
    metrics.access >= 57 &&
    metrics.workforce >= 38 &&
    metrics.treasury >= 34
  ) {
    return ENDINGS.almostSystem;
  }
  return ENDINGS.managedContinuity;
}

function qualitative(value: number) {
  if (value >= 72) return "stable";
  if (value >= 48) return "strained";
  if (value >= 28) return "critical";
  return "failing";
}

function DeltaList({ deltas }: { deltas: Partial<Metrics> }) {
  return (
    <div className="delta-list" aria-label="Decision impact">
      {(Object.entries(deltas) as [MetricKey, number][]).map(([key, value]) => (
        <span key={key} className={value >= 0 ? "delta positive" : "delta negative"}>
          {METRIC_META[key].short} {value > 0 ? "+" : ""}
          {value}
        </span>
      ))}
    </div>
  );
}

export default function Home() {
  const [phase, setPhase] = useState<"intro" | "playing" | "ending">("intro");
  const [panel, setPanel] = useState<Panel>(null);
  const [events, setEvents] = useState<Crisis[]>(CRISES.slice(0, 5));
  const [round, setRound] = useState(0);
  const [metrics, setMetrics] = useState<Metrics>(INITIAL_METRICS);
  const [capital, setCapital] = useState(10);
  const [assumptions, setAssumptions] = useState<Assumptions>(DEFAULT_ASSUMPTIONS);
  const [report, setReport] = useState<Report | null>(null);
  const [log, setLog] = useState<Report[]>([]);
  const [ending, setEnding] = useState<Ending>(ENDINGS.managedContinuity);
  const [discovered, setDiscovered] = useState<string[]>([]);
  const [session, setSession] = useState("000000");

  const crisis = events[round];

  const averageCare = useMemo(
    () => Math.round((metrics.health + metrics.access + metrics.workforce) / 3),
    [metrics],
  );

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("billable-endings");
      if (stored) setDiscovered(JSON.parse(stored));
    } catch {
      // Device-local history is optional.
    }
  }, []);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPanel(null);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  function startGame() {
    setEvents(shuffled(CRISES).slice(0, 5));
    setRound(0);
    setMetrics(INITIAL_METRICS);
    setCapital(10);
    setReport(null);
    setLog([]);
    setSession(String(Math.floor(100000 + Math.random() * 900000)));
    setPhase("playing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function makeDecision(choice: Choice) {
    if (capital < choice.cost || report) return;
    const factor = choice.assumption ? assumptions[choice.assumption] / 100 : 1;
    const deltas = Object.fromEntries(
      Object.entries(choice.effects).map(([key, value]) => [
        key,
        Math.round((value as number) * factor),
      ]),
    ) as Partial<Metrics>;

    const nextMetrics = { ...metrics };
    (Object.entries(deltas) as [MetricKey, number][]).forEach(([key, value]) => {
      nextMetrics[key] = clamp(nextMetrics[key] + value);
    });

    const nextReport = { crisis, choice, deltas };
    setMetrics(nextMetrics);
    setCapital((current) => Math.max(0, current - choice.cost));
    setReport(nextReport);
    setLog((current) => [...current, nextReport]);
  }

  function continueGame() {
    if (round >= events.length - 1) {
      const result = chooseEnding(metrics);
      setEnding(result);
      setDiscovered((current) => {
        const updated = current.includes(result.id) ? current : [...current, result.id];
        try {
          window.localStorage.setItem("billable-endings", JSON.stringify(updated));
        } catch {
          // The game remains playable when storage is unavailable.
        }
        return updated;
      });
      setPhase("ending");
      setReport(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setRound((current) => current + 1);
    setReport(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="site-shell">
      <div className="noise" aria-hidden="true" />

      <header className="masthead">
        <button className="brand" onClick={() => setPhase("intro")} aria-label="Return to title">
          <span className="brand-mark">B//</span>
          <span>
            <strong>BILLABLE</strong>
            <small>AMERICAN CARE CONTINUITY SIMULATION</small>
          </span>
        </button>
        <div className="header-status">
          <span className="pulse-dot" aria-hidden="true" />
          SYSTEM STATUS: LEGALLY OPERATIONAL
        </div>
        <nav aria-label="Game information">
          <button onClick={() => setPanel("briefing")}>Briefing</button>
          <button onClick={() => setPanel("assumptions")}>Assumptions</button>
          <button onClick={() => setPanel("sources")}>Sources</button>
        </nav>
      </header>

      {phase === "intro" && (
        <section className="intro-screen">
          <div className="intro-copy">
            <p className="eyebrow">WASHINGTON, D.C. // JULY 2026</p>
            <h1>You survived the system. <em>Now you run it.</em></h1>
            <p className="lede">
              Your emergency surgery was denied because a fax arrived eleven seconds late. You
              appealed, went viral, won a special election, and woke up with unilateral authority
              over American health care. This is not a normal career path.
            </p>
            <div className="intro-actions">
              <button className="primary-action" onClick={startGame}>
                Assume emergency control <span>→</span>
              </button>
              <span className="runtime">3–5 MINUTES · 5 DECISIONS · 8 ENDINGS</span>
            </div>
            <p className="model-warning">
              A directional satire built from real policy concepts and public data. It is not a
              forecast, economic model, or excuse to say “the computer made me do it.”
            </p>
          </div>

          <div className="appointment-card" aria-label="Appointment notice">
            <div className="appointment-stamp">URGENT / NONTRANSFERABLE</div>
            <p>EXECUTIVE OFFICE OF CARE CONTINUITY</p>
            <h2>NOTICE OF IMPROBABLE APPOINTMENT</h2>
            <dl>
              <div><dt>APPOINTEE</dt><dd>THE PERSON THE SYSTEM WRONGED</dd></div>
              <div><dt>AUTHORITY</dt><dd>UNCOMFORTABLY BROAD</dd></div>
              <div><dt>TERM</dt><dd>5 NATIONAL EMERGENCIES</dd></div>
              <div><dt>COMPENSATION</dt><dd>IN-NETWORK, PROBABLY</dd></div>
            </dl>
            <div className="signature-line">
              <span>X</span>
              <i>SIGN WHILE MEDICALLY COMPETENT</i>
            </div>
            <div className="case-files">
              <strong>{discovered.length}/8</strong>
              <span>ENDINGS DISCOVERED ON THIS DEVICE</span>
            </div>
          </div>

          <div className="city-strip" aria-hidden="true">
            {[46, 74, 55, 92, 61, 108, 71, 48, 99, 68, 82, 52].map((height, index) => (
              <span key={index} style={{ height }}>
                {Array.from({ length: Math.max(2, Math.floor(height / 18)) }).map((_, windowIndex) => (
                  <i key={windowIndex} />
                ))}
              </span>
            ))}
          </div>
        </section>
      )}

      {phase === "playing" && crisis && (
        <section className="game-screen">
          <div className="run-bar">
            <div>
              <span>SESSION {session}</span>
              <strong>EMERGENCY {round + 1} OF {events.length}</strong>
            </div>
            <div className="turn-track" aria-label={`Emergency ${round + 1} of ${events.length}`}>
              {events.map((item, index) => (
                <span
                  key={item.id}
                  className={index < round ? "complete" : index === round ? "current" : ""}
                />
              ))}
            </div>
            <div className="capital-readout">
              <span>POLITICAL CAPITAL</span>
              <strong>{capital}</strong>
              <small>NONREFUNDABLE</small>
            </div>
          </div>

          <div className="dashboard-grid">
            <aside className="metrics-panel" aria-label="National indicators">
              <div className="panel-heading">
                <span>NATIONAL VITALS</span>
                <small>LIVE-ISH</small>
              </div>
              {(Object.entries(metrics) as [MetricKey, number][]).map(([key, value]) => (
                <div className="metric" key={key}>
                  <div className="metric-label">
                    <span>{METRIC_META[key].label}</span>
                    <strong>{value}</strong>
                  </div>
                  <div className="metric-track">
                    <span
                      className={`metric-fill ${qualitative(value)}`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                  <small>{qualitative(value)}</small>
                </div>
              ))}
              <div className="care-index">
                <span>CARE REALITY INDEX</span>
                <strong>{averageCare}</strong>
                <small>not accepted by most insurers</small>
              </div>
            </aside>

            <article className="crisis-card">
              {!report ? (
                <>
                  <div className="crisis-meta">
                    <span>DOCKET {crisis.docket}</span>
                    <span>{crisis.category}</span>
                  </div>
                  <h1>{crisis.title}</h1>
                  <p className="dispatch">{crisis.dispatch}</p>
                  <blockquote>
                    <span>HUMAN IMPACT</span>
                    {crisis.human}
                  </blockquote>
                  <details className="fact-drawer">
                    <summary>What is this based on? <span>+</span></summary>
                    <p>{crisis.fact}</p>
                    <a href={crisis.sourceUrl} target="_blank" rel="noreferrer">
                      {crisis.sourceLabel} ↗
                    </a>
                  </details>
                  <div className="decision-heading">
                    <span>ISSUE DIRECTIVE</span>
                    <small>Consequences are directional, delayed, and impolite.</small>
                  </div>
                  <div className="choices">
                    {crisis.choices.map((choice) => {
                      const disabled = capital < choice.cost;
                      return (
                        <button
                          key={choice.id}
                          className="choice"
                          onClick={() => makeDecision(choice)}
                          disabled={disabled}
                        >
                          <span className="choice-cost">{choice.cost} PC</span>
                          <strong>{choice.title}</strong>
                          <p>{choice.short}</p>
                          <small>{choice.signal}</small>
                          {disabled && <i>INSUFFICIENT POLITICAL OXYGEN</i>}
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="report-card">
                  <p className="eyebrow">DIRECTIVE EXECUTED // CONSEQUENCE ESTIMATE</p>
                  <h1>{report.choice.title}</h1>
                  <p className="consequence">{report.choice.consequence}</p>
                  <DeltaList deltas={report.deltas} />
                  <blockquote className="result-quote">
                    “{report.choice.quote}”
                    <cite>— {report.choice.quoteBy}</cite>
                  </blockquote>
                  <div className="report-caveat">
                    MODEL NOTE: Effects are scenario rules, not empirical predictions. Adjust the
                    assumptions to expose how much the machine believes its own premise.
                  </div>
                  <button className="primary-action continue" onClick={continueGame}>
                    {round >= events.length - 1 ? "Face the national outcome" : "Advance to next emergency"}
                    <span>→</span>
                  </button>
                </div>
              )}
            </article>

            <aside className="brief-panel">
              <div className="panel-heading">
                <span>STAKEHOLDER WIRE</span>
                <small>UNSOLICITED</small>
              </div>
              <div className="wire-item alert">
                <span>MARKETS</span>
                Board confidence is {qualitative(metrics.industry)}. A person in a fleece vest has
                requested your direct number.
              </div>
              <div className="wire-item">
                <span>PUBLIC</span>
                Trust is {metrics.trust}/100. Most respondents selected “please stop calling this a
                journey.”
              </div>
              <div className="wire-item">
                <span>CLINICAL</span>
                Workforce capacity is {metrics.workforce}/100. The waiting room has begun a mutual
                aid society.
              </div>
              <div className="assumption-mini">
                <span>ACTIVE MODEL BIAS</span>
                <dl>
                  <div><dt>Admin friction</dt><dd>{assumptions.friction}%</dd></div>
                  <div><dt>Safety-net reach</dt><dd>{assumptions.safetyNet}%</dd></div>
                  <div><dt>Market power</dt><dd>{assumptions.marketPower}%</dd></div>
                </dl>
                <button onClick={() => setPanel("assumptions")}>Open the machine →</button>
              </div>
              {log.length > 0 && (
                <div className="decision-log">
                  <span>YOUR PAPER TRAIL</span>
                  {log.map((item, index) => (
                    <div key={`${item.crisis.id}-${index}`}>
                      <small>{item.crisis.docket}</small>
                      <strong>{item.choice.title}</strong>
                    </div>
                  ))}
                </div>
              )}
            </aside>
          </div>
        </section>
      )}

      {phase === "ending" && (
        <section className="ending-screen">
          <div className="ending-main">
            <p className="eyebrow">{ending.code} // SESSION {session} CLOSED</p>
            <h1>{ending.title}</h1>
            <h2>{ending.kicker}</h2>
            <p>{ending.body}</p>
            <blockquote>{ending.epitaph}</blockquote>
            <div className="ending-actions">
              <button className="primary-action" onClick={startGame}>
                Reopen the system <span>↻</span>
              </button>
              <button className="text-action" onClick={() => setPanel("assumptions")}>
                Change the model first
              </button>
            </div>
            <p className="discovered-note">
              ENDINGS DISCOVERED: <strong>{discovered.length}/8</strong> · History is stored only on
              this device.
            </p>
          </div>

          <aside className="final-audit">
            <div className="panel-heading">
              <span>FINAL NATIONAL AUDIT</span>
              <small>SUBJECT TO REVISION</small>
            </div>
            {(Object.entries(metrics) as [MetricKey, number][]).map(([key, value]) => (
              <div className="audit-row" key={key}>
                <span>{METRIC_META[key].label}</span>
                <strong>{value}</strong>
                <small>{qualitative(value)}</small>
              </div>
            ))}
            <div className="audit-log">
              <span>DIRECTIVES ISSUED</span>
              {log.map((item, index) => (
                <p key={`${item.choice.id}-${index}`}>
                  <small>{String(index + 1).padStart(2, "0")}</small>
                  {item.choice.title}
                </p>
              ))}
            </div>
          </aside>
        </section>
      )}

      <footer>
        <span>BILLABLE // A FICTIONAL SYSTEM BUILT FROM REAL PRESSURE POINTS</span>
        <span>NO PATIENT DATA · NO PREDICTIONS · NO PRIOR AUTHORIZATION</span>
      </footer>

      {panel && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setPanel(null)}>
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setPanel(null)} aria-label="Close dialog">
              CLOSE ×
            </button>

            {panel === "assumptions" && (
              <>
                <p className="eyebrow">OPEN MODEL / BIAS CONTROL</p>
                <h2 id="modal-title">Every simulation is an argument with sliders.</h2>
                <p className="modal-intro">
                  These controls amplify the directional effects of matching policies. They do not
                  make the game predictive; they make its assumptions visible.
                </p>
                <label className="slider-row">
                  <span><strong>Administrative friction</strong><small>How severely paperwork, denials, and churn damage care.</small></span>
                  <input
                    type="range"
                    min="70"
                    max="140"
                    step="5"
                    value={assumptions.friction}
                    onChange={(event) => setAssumptions({ ...assumptions, friction: Number(event.target.value) })}
                  />
                  <output>{assumptions.friction}%</output>
                </label>
                <label className="slider-row">
                  <span><strong>Safety-net reach</strong><small>How effectively public coverage and capacity translate into access.</small></span>
                  <input
                    type="range"
                    min="70"
                    max="140"
                    step="5"
                    value={assumptions.safetyNet}
                    onChange={(event) => setAssumptions({ ...assumptions, safetyNet: Number(event.target.value) })}
                  />
                  <output>{assumptions.safetyNet}%</output>
                </label>
                <label className="slider-row">
                  <span><strong>Concentrated market power</strong><small>How strongly dominant firms convert policy into prices and leverage.</small></span>
                  <input
                    type="range"
                    min="70"
                    max="140"
                    step="5"
                    value={assumptions.marketPower}
                    onChange={(event) => setAssumptions({ ...assumptions, marketPower: Number(event.target.value) })}
                  />
                  <output>{assumptions.marketPower}%</output>
                </label>
                <button className="reset-button" onClick={() => setAssumptions(DEFAULT_ASSUMPTIONS)}>
                  Restore default institutional pessimism
                </button>
                <div className="method-note">
                  MODEL LIMIT: Choices use authored, qualitative relationships. Numbers communicate
                  tradeoffs and produce endings; they are not estimates of policy impact.
                </div>
              </>
            )}

            {panel === "sources" && (
              <>
                <p className="eyebrow">SOURCES / MODEL PROVENANCE</p>
                <h2 id="modal-title">The facts are real. The organizations are not.</h2>
                <p className="modal-intro">
                  BILLABLE uses recent public evidence to ground its starting conditions and policy
                  pressure points. Fictional outcomes are deliberately exaggerated and should not be
                  read as forecasts.
                </p>
                <div className="source-list">
                  {SOURCES.map((source, index) => (
                    <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{source.label}</strong>
                      <small>{source.note}</small>
                      <i>↗</i>
                    </a>
                  ))}
                </div>
              </>
            )}

            {panel === "briefing" && (
              <>
                <p className="eyebrow">CLASSIFIED-ISH BRIEFING</p>
                <h2 id="modal-title">Your job is to move harm, money, time, and power.</h2>
                <div className="briefing-grid">
                  <div><strong>1</strong><p>Face five crises drawn from a larger national docket.</p></div>
                  <div><strong>2</strong><p>Spend political capital. Cheaper choices are often expensive elsewhere.</p></div>
                  <div><strong>3</strong><p>Watch six national indicators. No single score defines a good system.</p></div>
                  <div><strong>4</strong><p>Reach one of eight endings, then change your assumptions and try again.</p></div>
                </div>
                <div className="method-note">
                  THE ORIGINAL INSPIRATION: SimHealth (1994) used political capital, policy levers,
                  institutional dashboards, values, elections, and editable assumptions. BILLABLE
                  keeps the inspectable model and discards the idea that justice and liberty fit on
                  one tidy compass.
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
