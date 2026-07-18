(function () {
  "use strict";

  const payrollPerShift = 2.4;

  const metricMeta = {
    cash: { label: "Cash on hand", short: "Cash" },
    capacity: { label: "Staffed bed availability", short: "Beds" },
    workforce: { label: "Hospital team strength", short: "Staff" },
    flow: { label: "Discharge flow", short: "Flow" },
    trust: { label: "Patient trust", short: "Trust" },
    care: { label: "Care quality", short: "Care" },
  };

  const initialMetrics = {
    cash: 18,
    capacity: 42,
    workforce: 74,
    flow: 48,
    trust: 68,
    care: 78,
  };

  const defaultAssumptions = {
    denialPressure: 115,
    safeStaffing: 105,
    uncompensatedCare: 110,
  };

  const sources = [
    {
      label: "HHS OIG — Medicare Advantage SNF denials, 2026",
      note: "The review found 12% of skilled-nursing admission requests were initially denied; nearly all appealed denials were overturned.",
      url: "https://oig.hhs.gov/reports/all/2026/medicare-advantage-organizations-overturned-nearly-all-appealed-prior-authorization-denials-for-skilled-nursing-facility-admission-raising-concerns-about-initial-denials/",
    },
    {
      label: "MedPAC — March 2026 Medicare Payment Policy",
      note: "Hospital payment adequacy, costs, margins, access, and financial pressure inform the fictional operating model.",
      url: "https://www.medpac.gov/wp-content/uploads/2026/03/Mar26_Ch9_MedPAC_Report_To_Congress_SEC.pdf",
    },
    {
      label: "CMS — Hospital Price Transparency, 2026",
      note: "Hospitals must publish gross charges, cash prices, and payer-negotiated amounts; updated enforcement began April 2026.",
      url: "https://www.cms.gov/priorities/key-initiatives/hospital-price-transparency",
    },
    {
      label: "GAO — Urban Hospital Closures, 2025",
      note: "The report examines financial and operating factors behind selected hospital closures and the resulting loss of services.",
      url: "https://files.gao.gov/reports/GAO-25-106473/index.html",
    },
    {
      label: "BLS — Occupational Employment and Wages, 2025",
      note: "National employment and wage data cover physicians, nurses, therapists, social workers, and sanitation workers.",
      url: "https://www.bls.gov/news.release/ocwage.htm",
    },
    {
      label: "GAO — Hospital Uncompensated Care",
      note: "Federal support does not always align cleanly with hospitals' actual costs of caring for uninsured and low-income patients.",
      url: "https://www.gao.gov/products/gao-16-568",
    },
    {
      label: "FTC, DOJ & HHS — Private Equity in Health Care Inquiry",
      note: "The agencies sought evidence on transactions that may enrich owners while threatening patients, workers, quality, access, and affordability.",
      url: "https://www.ftc.gov/news-events/news/press-releases/2024/03/federal-trade-commission-department-justice-department-health-human-services-launch-cross-government",
    },
  ];

  const crises = [
    {
      id: "boarding",
      docket: "ED-031",
      category: "ADMISSIONS",
      title: "The emergency department is now an inpatient floor",
      dispatch:
        "All 60 licensed beds are spoken for, twelve admitted patients are boarding in the emergency department, and North Meridian Insurance says hallway care is outside the facility contract.",
      human:
        "Charge nurse Elena Ruiz has safely rearranged three units twice. She needs staffed beds, not another throughput webinar.",
      fact:
        "Hospital access depends on staffed capacity and the ability to move patients through inpatient and post-acute care, not merely on licensed bed counts.",
      source: sources[1],
      choices: [
        {
          id: "surge-ward",
          mode: "care",
          title: "Open the dormant surge ward",
          short: "Pay nurses, physicians, sanitation, and support staff to safely staff twelve beds.",
          effects: { cash: -4.2, capacity: 18, workforce: -2, flow: 4, trust: 7, care: 8 },
          assumption: "safeStaffing",
          signal: "Beds ↑↑↑ · Care ↑ · Cash ↓↓",
          consequence:
            "The hallway clears before dawn. The clinical team makes it look routine, which guarantees finance will call it an avoidable expense.",
          quote: "Nobody practiced heroics. We had enough people to practice medicine.",
          quoteBy: "Elena Ruiz, RN",
        },
        {
          id: "transfer-fund",
          mode: "balance",
          title: "Buy regional transfer capacity",
          short: "Pay neighboring hospitals and ambulance teams to accept six stable patients.",
          effects: { cash: -2.2, capacity: 11, workforce: 2, flow: 8, trust: 3, care: 4 },
          assumption: "safeStaffing",
          signal: "Beds ↑↑ · Flow ↑ · Cash ↓",
          consequence:
            "Six patients move safely. Your insurer disputes the ambulance invoices because the ambulances successfully arrived.",
          quote: "The transfer worked because every hospital employee answered the phone.",
          quoteBy: "Dr. Amara Bell, emergency physician",
        },
        {
          id: "hallway-protocol",
          mode: "extract",
          title: "Monetize hallway medicine",
          short: "Call each gurney a flexible care pod and charge a facility premium.",
          effects: { cash: 4.8, capacity: -10, workforce: -9, flow: -5, trust: -16, care: -12 },
          assumption: "denialPressure",
          signal: "Cash ↑↑ · Trust ↓↓↓ · Care ↓↓",
          consequence:
            "Revenue rises. The physicians and nurses keep patients safe despite the plan, then document why the plan was unsafe in language legal can feel.",
          quote: "The pod is a stretcher beside a vending machine.",
          quoteBy: "Dr. Bell, refusing the rebrand",
        },
      ],
    },
    {
      id: "snf-denials",
      docket: "DC-095",
      category: "DISCHARGE",
      title: "Twenty patients are medically ready and financially trapped",
      dispatch:
        "Physicians cleared them. Therapists built safe plans. North Meridian denied every skilled-nursing placement using the phrase custodial potential.",
      human:
        "Caseworker Mina Cho has submitted 214 pages of appeals. Mr. Alvarez still cannot climb the stairs to his apartment.",
      fact:
        "A 2026 HHS OIG review found wide variation in Medicare Advantage denials for skilled-nursing admission and nearly universal overturning among appealed denials in its sample.",
      source: sources[0],
      choices: [
        {
          id: "bridge-beds",
          mode: "care",
          title: "Fund ten bridge placements",
          short: "Pay rehab and nursing facilities now; fight the insurer after patients are safe.",
          effects: { cash: -4.6, capacity: 16, workforce: 4, flow: 18, trust: 9, care: 8 },
          assumption: "denialPressure",
          signal: "Flow ↑↑↑ · Beds ↑↑ · Cash ↓↓",
          consequence:
            "Ten patients begin rehabilitation today. The payer schedules a peer-to-peer review between a surgeon and someone whose license is described as adjacent.",
          quote: "He needed gait training, not a fourth night under fluorescent lights.",
          quoteBy: "Tessa Morgan, physical therapist",
        },
        {
          id: "appeal-team",
          mode: "balance",
          title: "Back the caseworker appeal team",
          short: "Give caseworkers, PT, OT, and speech therapy paid time to overturn denials.",
          effects: { cash: -1.8, capacity: 10, workforce: 6, flow: 12, trust: 6, care: 5 },
          assumption: "denialPressure",
          signal: "Flow ↑↑ · Staff ↑ · Cash ↓",
          consequence:
            "The team wins most appeals. Their reward is a fresh batch marked missing clinical information that was attached twice.",
          quote: "We won because the care plan was excellent and the denial was nonsense.",
          quoteBy: "Mina Cho, LCSW",
        },
        {
          id: "premature-home",
          mode: "extract",
          title: "Discharge them to optimism",
          short: "Send patients home with a packet, a rideshare code, and no covered services.",
          effects: { cash: 3.9, capacity: 13, workforce: -10, flow: 7, trust: -18, care: -15 },
          assumption: "denialPressure",
          signal: "Beds ↑↑ · Cash ↑ · Care ↓↓↓",
          consequence:
            "The beds open. Several patients return within forty-eight hours. Insurance calls the readmissions new episodes and thanks you for the volume.",
          quote: "The discharge summary was flawless. The discharge was not.",
          quoteBy: "Mina Cho, documenting the objection",
        },
      ],
    },
    {
      id: "payroll",
      docket: "AP-240",
      category: "PAYROLL",
      title: "Payroll is due before the insurers feel like paying you",
      dispatch:
        "The hospital owes its physicians, nurses, sanitation workers, therapists, caseworkers, pharmacists, cooks, and technicians. Three payers have placed clean claims into extended review.",
      human:
        "Environmental services lead Darnell Price kept two isolation units operating during the surge. His team should not finance the hospital with late rent.",
      fact:
        "Hospitals depend on a large, specialized workforce. National wage data show the scale and variety of occupations required to keep clinical care operating.",
      source: sources[4],
      choices: [
        {
          id: "pay-everyone",
          mode: "care",
          title: "Clear every paycheck",
          short: "Pay the entire hospital team on time and use the emergency reserve.",
          effects: { cash: -5.2, capacity: 4, workforce: 16, flow: 4, trust: 7, care: 9 },
          assumption: "safeStaffing",
          signal: "Staff ↑↑↑ · Care ↑ · Cash ↓↓↓",
          consequence:
            "Every paycheck clears. The hospital works because thousands of skilled tasks happen on time; the reserve now contains a motivational sticky note.",
          quote: "Clean rooms are clinical infrastructure. Thank you for acting like it.",
          quoteBy: "Darnell Price, environmental services",
        },
        {
          id: "executive-haircut",
          mode: "balance",
          title: "Freeze executives, protect the floor",
          short: "Suspend bonuses, draw the credit line, and pay every care and operations worker.",
          effects: { cash: -1.1, capacity: 3, workforce: 10, flow: 3, trust: 6, care: 6 },
          assumption: "safeStaffing",
          signal: "Staff ↑↑ · Trust ↑ · Cash ↓",
          consequence:
            "The hospital team is paid. The executive compensation committee experiences a preventable adverse event.",
          quote: "The nurses stayed. The bonus can seek care elsewhere.",
          quoteBy: "Your signed payroll order",
        },
        {
          id: "outsource-cleaning",
          mode: "extract",
          title: "Outsource the invisible work",
          short: "Replace sanitation and food-service teams with the lowest compliant bid.",
          effects: { cash: 4.6, capacity: -7, workforce: -17, flow: -5, trust: -12, care: -16 },
          assumption: "safeStaffing",
          signal: "Cash ↑↑ · Staff ↓↓↓ · Care ↓↓↓",
          consequence:
            "The spreadsheet improves immediately. The experienced sanitation team leaves; infection control begins writing emails in all caps.",
          quote: "We told them exactly which corners could not be cut.",
          quoteBy: "Dr. Priya Nwosu, infection prevention",
        },
      ],
    },
    {
      id: "claims",
      docket: "REV-404",
      category: "REIMBURSEMENT",
      title: "The care happened; the payment is still hypothetical",
      dispatch:
        "North Meridian has denied $11 million in inpatient claims. The state program changed its billing manual retroactively and uploaded the notice as a scanned photograph.",
      human:
        "The physicians documented the care. Coding documented the documentation. The payer denied it for insufficient enthusiasm.",
      fact:
        "Hospital finances depend on payment rules, negotiated rates, claim status, and patient mix; reported payment adequacy can differ substantially by payer and hospital.",
      source: sources[1],
      choices: [
        {
          id: "appeal-claims",
          mode: "care",
          title: "Fight every clean denial",
          short: "Fund coders and caseworkers to appeal without changing clinical decisions.",
          effects: { cash: 1.6, capacity: 2, workforce: 5, flow: 5, trust: 4, care: 4 },
          assumption: "denialPressure",
          signal: "Cash ↔ · Staff ↑ · Trust ↑",
          consequence:
            "The hospital recovers part of what it is owed. North Meridian calls this unexpected utilization of the appeal feature.",
          quote: "The chart was correct before the insurer read it and after.",
          quoteBy: "Samir Holt, RN case manager",
        },
        {
          id: "chargemaster",
          mode: "extract",
          title: "Raise every list price",
          short: "Triple imaging, procedure, and medicine charges to create negotiating room.",
          effects: { cash: 6.3, capacity: 2, workforce: -2, flow: 1, trust: -18, care: -3 },
          assumption: "uncompensatedCare",
          signal: "Cash ↑↑↑ · Trust ↓↓↓",
          consequence:
            "Commercial contracts yield more revenue. Uninsured patients receive the same excellent care followed by numbers usually associated with space programs.",
          quote: "The CT scan found nothing. The bill found my house.",
          quoteBy: "Rae Wilson, uninsured patient",
        },
        {
          id: "observation",
          mode: "extract",
          title: "Convert admissions to observation",
          short: "Accept the payer's cheaper label and transfer more cost to patients.",
          effects: { cash: 2.8, capacity: 5, workforce: -6, flow: 6, trust: -15, care: -7 },
          assumption: "denialPressure",
          signal: "Flow ↑ · Cash ↑ · Trust ↓↓↓",
          consequence:
            "The insurer pays less. Patients owe more. Physicians spend the night explaining why a hospital bed can legally count as not being in the hospital.",
          quote: "I was observed for three days by an entire inpatient unit.",
          quoteBy: "Marlene Fox, patient",
        },
      ],
    },
    {
      id: "imaging",
      docket: "IMG-777",
      category: "SERVICE LINES",
      title: "The MRI must now subsidize the emergency department",
      dispatch:
        "Emergency psychiatry, language access, and wound care lose money. Advanced imaging earns enough to keep them alive, if the hospital raises prices again.",
      human:
        "Radiologist Dr. Theo Grant will read every scan accurately. He would also like the price of one scan to stop containing the budget for three unrelated departments.",
      fact:
        "U.S. hospital pricing includes gross charges, discounted cash prices, and payer-negotiated amounts that hospitals must publish under federal transparency rules.",
      source: sources[2],
      choices: [
        {
          id: "cross-subsidize",
          mode: "balance",
          title: "Cross-subsidize openly",
          short: "Raise negotiated imaging rates, cap cash prices, and protect essential services.",
          effects: { cash: 3.6, capacity: 4, workforce: 4, flow: 3, trust: -3, care: 7 },
          assumption: "uncompensatedCare",
          signal: "Cash ↑ · Care ↑ · Trust ↓",
          consequence:
            "The essential services survive. Insured prices rise; uninsured cash prices do not. The contract becomes 900 pages longer out of spite.",
          quote: "At least the subsidy is visible enough to argue about.",
          quoteBy: "Dr. Theo Grant, radiology",
        },
        {
          id: "near-cost",
          mode: "care",
          title: "Keep patient prices near cost",
          short: "Publish honest prices and fund the gap from dwindling reserves.",
          effects: { cash: -3.8, capacity: 1, workforce: 5, flow: 2, trust: 12, care: 6 },
          assumption: "uncompensatedCare",
          signal: "Trust ↑↑ · Care ↑ · Cash ↓↓",
          consequence:
            "Patients can understand their estimates. The government file validator rejects the semicolon on line 48,211.",
          quote: "The price finally looked like a price instead of a ransom negotiation.",
          quoteBy: "Jamie Cole, patient advocate",
        },
        {
          id: "lease-scanner",
          mode: "extract",
          title: "Lease the scanner to private equity",
          short: "Take cash now; rent back every scan at a premium forever.",
          effects: { cash: 8.2, capacity: -8, workforce: -6, flow: -10, trust: -13, care: -8 },
          assumption: "denialPressure",
          signal: "Cash ↑↑↑ · Flow ↓↓ · Trust ↓↓",
          consequence:
            "The quarter is saved. Every future scan now pays rent to a company named after a tree that does not grow locally.",
          quote: "The machine stayed in place. Access to it moved offshore spiritually.",
          quoteBy: "Dr. Grant",
        },
      ],
    },
    {
      id: "uninsured",
      docket: "UC-050",
      category: "UNCOMPENSATED CARE",
      title: "The patients cannot pay and the hospital cannot not care",
      dispatch:
        "A factory closure brings eighty newly uninsured families to your service area. Emergency treatment continues. The supplemental payment formula is two years late and based on a different county.",
      human:
        "The clinical team treats everyone in front of them. Financial counselor Aisha Reed is trying to make sure recovery does not come with eviction.",
      fact:
        "Hospitals incur uncompensated costs for uninsured and low-income patients; GAO has found that federal support has not always aligned cleanly with those costs.",
      source: sources[5],
      choices: [
        {
          id: "charity-screen",
          mode: "care",
          title: "Treat first, screen for charity",
          short: "Automate assistance and erase bills patients cannot realistically pay.",
          effects: { cash: -5.5, capacity: -7, workforce: 4, flow: -2, trust: 17, care: 10 },
          assumption: "uncompensatedCare",
          signal: "Trust ↑↑↑ · Care ↑↑ · Cash ↓↓↓",
          consequence:
            "Patients receive care without a debt ambush. The hospital records a community benefit and an extremely private panic attack.",
          quote: "My discharge plan did not include bankruptcy.",
          quoteBy: "Andre Lewis, patient",
        },
        {
          id: "navigator-grants",
          mode: "balance",
          title: "Fund enrollment and grants",
          short: "Give caseworkers authority to chase coverage and every available safety-net dollar.",
          effects: { cash: -1.7, capacity: 2, workforce: 7, flow: 5, trust: 10, care: 6 },
          assumption: "uncompensatedCare",
          signal: "Trust ↑↑ · Flow ↑ · Cash ↓",
          consequence:
            "Caseworkers find coverage for many families. The state portal times out only during business hours, a major accessibility achievement.",
          quote: "The patient qualified. The system was the ineligible party.",
          quoteBy: "Aisha Reed, financial counselor",
        },
        {
          id: "deposits",
          mode: "extract",
          title: "Require deposits at scheduling",
          short: "Collect cash before imaging and procedures whenever the law permits.",
          effects: { cash: 5.2, capacity: 5, workforce: -5, flow: 4, trust: -20, care: -10 },
          assumption: "uncompensatedCare",
          signal: "Cash ↑↑ · Trust ↓↓↓ · Care ↓↓",
          consequence:
            "Bad debt falls because many patients never enter the building. Their conditions continue operating without authorization.",
          quote: "I could schedule the biopsy or afford the biopsy, but not both.",
          quoteBy: "Nora Ellis, patient",
        },
      ],
    },
    {
      id: "supplies",
      docket: "SC-011",
      category: "SUPPLY CHAIN",
      title: "The sterile supply truck has entered arbitration",
      dispatch:
        "Gloves, IV tubing, and respiratory circuits are delayed. The government dashboard says the shortage is improving nationally, which has not produced a single glove locally.",
      human:
        "Respiratory therapist Malik Stone and the nursing team have already conserved safely. They refuse to make patients absorb the next efficiency.",
      fact:
        "Hospital care requires continuous spending on labor, drugs, devices, facilities, and supplies; disruptions can reduce usable capacity even when beds physically exist.",
      source: sources[1],
      choices: [
        {
          id: "spot-market",
          mode: "care",
          title: "Buy safe supplies at spot prices",
          short: "Pay the markup and let clinicians use what patients need.",
          effects: { cash: -4.4, capacity: 8, workforce: 8, flow: 5, trust: 7, care: 13 },
          assumption: "safeStaffing",
          signal: "Care ↑↑ · Staff ↑ · Cash ↓↓",
          consequence:
            "The supplies arrive. Clinicians deliver ordinary safe care, currently priced as a luxury import.",
          quote: "We used one glove per hand. Finance has been notified.",
          quoteBy: "Malik Stone, respiratory therapy",
        },
        {
          id: "clinical-conservation",
          mode: "balance",
          title: "Let clinicians ration the inventory",
          short: "Protect high-risk care and postpone what can safely wait.",
          effects: { cash: -1.2, capacity: 3, workforce: 6, flow: -2, trust: 4, care: 8 },
          assumption: "safeStaffing",
          signal: "Care ↑ · Staff ↑ · Flow ↓",
          consequence:
            "The team stretches inventory without compromising safety. The postponed cases become tomorrow's fully matured emergency.",
          quote: "Conservation worked because the people using the supplies made the decisions.",
          quoteBy: "Malik Stone",
        },
        {
          id: "reuse",
          mode: "extract",
          title: "Redefine single-use",
          short: "Approve the consultant's reuse matrix and book the savings.",
          effects: { cash: 4.5, capacity: -6, workforce: -12, flow: -5, trust: -14, care: -20 },
          assumption: "safeStaffing",
          signal: "Cash ↑↑ · Care ↓↓↓ · Staff ↓↓",
          consequence:
            "The consultant invoices successfully. The clinical staff quarantine the matrix before it can reach a patient.",
          quote: "We protected patients by refusing the policy. Put that in the savings report.",
          quoteBy: "Nurse Ruiz",
        },
      ],
    },
    {
      id: "home-care",
      docket: "HH-212",
      category: "POST-ACUTE CARE",
      title: "Home is the cheapest bed nobody funded",
      dispatch:
        "Twelve patients can recover at home with nursing, therapy, meals, and equipment. Their insurers approved a pamphlet and denied everything represented in the pamphlet.",
      human:
        "Occupational therapist Ben Okafor built safe home plans with patients and families. The plans need services, not inspirational typography.",
      fact:
        "Post-acute authorization delays can keep patients in hospitals after acute treatment is complete, reducing bed availability for new admissions.",
      source: sources[0],
      choices: [
        {
          id: "fund-home-care",
          mode: "care",
          title: "Fund thirty days of home care",
          short: "Pay home nurses, equipment, meals, and therapies while appeals proceed.",
          effects: { cash: -4.1, capacity: 17, workforce: 5, flow: 18, trust: 13, care: 10 },
          assumption: "denialPressure",
          signal: "Flow ↑↑↑ · Trust ↑↑ · Cash ↓↓",
          consequence:
            "Patients go home safely. The insurer requests proof that houses are an appropriate site for being at home.",
          quote: "She recovered because the discharge plan existed after discharge.",
          quoteBy: "Ben Okafor, occupational therapy",
        },
        {
          id: "discharge-command",
          mode: "balance",
          title: "Build a discharge command team",
          short: "Give PT, OT, speech therapy, nursing, pharmacy, and casework one budget.",
          effects: { cash: -2.3, capacity: 12, workforce: 9, flow: 15, trust: 9, care: 8 },
          assumption: "denialPressure",
          signal: "Flow ↑↑↑ · Staff ↑ · Cash ↓",
          consequence:
            "The team solves together what six payer portals separated. Government quality reporting later credits the new fax cover sheet.",
          quote: "The patient was always one person. We finally used one plan.",
          quoteBy: "Ben Okafor",
        },
        {
          id: "brochure-discharge",
          mode: "extract",
          title: "Substitute a discharge brochure",
          short: "Close the cases, clear the beds, and list resources with disconnected numbers.",
          effects: { cash: 3.7, capacity: 14, workforce: -11, flow: 8, trust: -19, care: -16 },
          assumption: "denialPressure",
          signal: "Beds ↑↑ · Cash ↑ · Trust ↓↓↓",
          consequence:
            "The dashboard turns green. Patients call numbers that no longer exist. The therapists keep copies of their rejected plans for the inevitable readmissions.",
          quote: "The brochure could not help me into the shower.",
          quoteBy: "Dalia Reed, patient",
        },
      ],
    },
  ];

  const endings = {
    kindest: {
      id: "kindest",
      code: "ENDING 01 / 09",
      title: "The Kindest Bankruptcy",
      kicker: "The hospital kept faith with patients until the bank stopped keeping faith with the hospital.",
      body: "You paid the people doing the work, funded safe discharges, and refused to turn illness into leverage. St. Dymphna closes with excellent care scores and no cash. The payer network removes it by noon.",
      epitaph: "Every patient was treated as a person. This was not reimbursed at scale.",
    },
    husk: {
      id: "husk",
      code: "ENDING 02 / 09",
      title: "The Profitable Husk",
      kicker: "Cash survived. The hospital did not.",
      body: "Prices rose, services were leased, labor was outsourced, and difficult patients learned not to come. The balance sheet is attractive enough to sell to a chain that will remove the emergency department.",
      epitaph: "The facility remains open for imaging, parking, and shareholder value.",
    },
    payroll: {
      id: "payroll",
      code: "ENDING 03 / 09",
      title: "Payroll Did Not Clear",
      kicker: "Goodwill is not legal tender, even in a hospital cafeteria.",
      body: "Physicians, nurses, therapists, caseworkers, sanitation, pharmacy, food service, and every other team did the work. The insurers did not send the money in time. The hospital closes before the next shift.",
      epitaph: "The final claim remains pending because the provider is no longer participating.",
    },
    hallway: {
      id: "hallway",
      code: "ENDING 04 / 09",
      title: "No Place to Send Anyone",
      kicker: "Every bed is full of someone waiting for a different bed.",
      body: "Admissions continue, discharges stop, and the emergency department becomes a permanent address. The state suspends admissions, then cites the hospital for insufficient admissions capacity.",
      epitaph: "The physicians are ready. The patients are ready. The authorization is thinking.",
    },
    staff: {
      id: "staff",
      code: "ENDING 05 / 09",
      title: "Staffed by Memory",
      kicker: "The org chart still contains everyone who left.",
      body: "The hospital optimized away the people who made rooms clean, care safe, and discharges possible. The remaining team refuses unsafe assignments. The closure notice calls this a labor disruption.",
      epitaph: "The wellness module remains mandatory through Friday.",
    },
    payer: {
      id: "payer",
      code: "ENDING 06 / 09",
      title: "The Payer Owns the Building",
      kicker: "North Meridian denied the hospital and approved the real estate.",
      body: "Cash ran low while claims and discharges waited. The insurer's investment affiliate buys the campus and leases it back as a preferred center of excellence with fewer beds and excellent parking.",
      epitaph: "Your appeal rights transferred with the deed.",
    },
    occupation: {
      id: "occupation",
      code: "ENDING 07 / 09",
      title: "Community Occupation",
      kicker: "The hospital closes. The lobby does not empty.",
      body: "Patients trust the care, the staff still trusts one another, and the money is gone. Clinicians, workers, and neighbors occupy the lobby and open a free clinic while the county argues over who is allowed to save it.",
      epitaph: "The best ending is still a bankruptcy with folding chairs.",
    },
    orderly: {
      id: "orderly",
      code: "ENDING 08 / 09",
      title: "Orderly Closure",
      kicker: "The plan succeeded at making catastrophe look scheduled.",
      body: "You moved patients, paid bills, raised prices, cut costs, and bought time. It was not enough. St. Dymphna closes in an orderly fashion, except for everyone who still needs a hospital.",
      epitaph: "The final administrator checklist includes turning off the emergency sign.",
    },
    privateEquity: {
      id: "private-equity",
      code: "ENDING 09 / 09 // YOU WIN",
      title: "The Golden Parachute",
      kicker: "Your career has never been healthier. The hospital has been pronounced an asset.",
      body: "Atrium Vulture Partners pays you an $18 million exit award, borrows against the hospital, issues itself a dividend, sells the building, cuts staffed beds, outsources the workforce, and raises every price it can locate. Patients now travel forty-seven miles. You join a panel on courageous leadership.",
      epitaph: "The physicians and hospital staff keep patients safe until their termination emails arrive.",
    },
  };

  const state = {
    phase: "playing",
    events: crises.slice(0, 5),
    round: 0,
    metrics: { ...initialMetrics },
    assumptions: { ...defaultAssumptions },
    report: null,
    log: [],
    ending: endings.orderly,
    session: "000000",
    discovered: loadDiscovered(),
  };

  const view = document.getElementById("game-view");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const modalContent = document.getElementById("modal-content");

  function loadDiscovered() {
    try {
      const value = window.localStorage.getItem("billable-hospital-endings");
      return value ? JSON.parse(value) : [];
    } catch (_error) {
      return [];
    }
  }

  function saveDiscovered() {
    try {
      window.localStorage.setItem("billable-hospital-endings", JSON.stringify(state.discovered));
    } catch (_error) {
      // Device-local history is optional.
    }
  }

  function roundMoney(value) {
    return Math.round(value * 10) / 10;
  }

  function clampMetric(key, value) {
    if (key === "cash") return Math.max(0, Math.min(30, roundMoney(value)));
    return Math.max(0, Math.min(100, Math.round(value)));
  }

  function shuffle(items) {
    const copy = items.slice();
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swap]] = [copy[swap], copy[index]];
    }
    return copy;
  }

  function formatMoney(value, signed) {
    const sign = signed && value > 0 ? "+" : value < 0 ? "−" : "";
    return `${sign}$${Math.abs(value).toFixed(1)}M`;
  }

  function openBeds() {
    return Math.max(0, Math.round((state.metrics.capacity / 100) * 60));
  }

  function qualitative(key, value) {
    if (key === "cash") {
      if (value >= 12) return "stable";
      if (value >= 7) return "strained";
      if (value >= 3) return "critical";
      return "failing";
    }
    if (value >= 70) return "stable";
    if (value >= 48) return "strained";
    if (value >= 28) return "critical";
    return "failing";
  }

  function chooseEnding() {
    const m = state.metrics;
    const extractCount = state.log.filter((item) => item.choice.mode === "extract").length;
    if (extractCount >= 3 && m.cash >= 8) return endings.husk;
    if (m.cash <= 1.5 && m.trust >= 66 && m.care >= 70) return endings.kindest;
    if (m.cash <= 6 && m.trust >= 72 && m.workforce >= 55 && m.care >= 72) return endings.occupation;
    if (m.workforce < 30) return endings.staff;
    if (m.capacity < 25 || m.flow < 25) return endings.hallway;
    if (m.trust < 28) return endings.payer;
    if (m.cash <= 3) return endings.payroll;
    if (extractCount >= 2) return endings.payer;
    return endings.orderly;
  }

  function deltaList(deltas) {
    return Object.entries(deltas)
      .map(([key, value]) => {
        const display = key === "cash" ? formatMoney(value, true) : `${value > 0 ? "+" : ""}${value}`;
        return `<span class="delta ${value >= 0 ? "positive" : "negative"}">${metricMeta[key].short} ${display}</span>`;
      })
      .join("");
  }

  function choiceCards(crisis) {
    return crisis.choices
      .map((choice) => {
        const factor = choice.assumption ? state.assumptions[choice.assumption] / 100 : 1;
        const operatingCash = choice.effects.cash < 0 ? choice.effects.cash * factor : choice.effects.cash;
        const netCash = roundMoney(operatingCash - payrollPerShift);
        return `
          <button class="choice" type="button" data-choice="${choice.id}">
            <span class="choice-cost">${formatMoney(netCash, true)} THIS SHIFT</span>
            <strong>${choice.title}</strong>
            <p>${choice.short}</p>
            <small>${choice.signal}</small>
          </button>`;
      })
      .join("");
  }

  function reportTemplate() {
    const report = state.report;
    return `
      <div class="report-card" role="status">
        <p class="eyebrow">SHIFT CLOSED // CONSEQUENCE ESTIMATE</p>
        <h1>${report.choice.title}</h1>
        <p class="consequence">${report.choice.consequence}</p>
        <div class="payroll-cleared">PAYROLL & SUPPLIES: ${formatMoney(payrollPerShift)} PAID · PHYSICIANS · NURSES · SANITATION · THERAPY · CASEWORK · OPERATIONS</div>
        <div class="delta-list" aria-label="Decision impact">${deltaList(report.deltas)}</div>
        <blockquote class="result-quote">“${report.choice.quote}”<cite>— ${report.choice.quoteBy}</cite></blockquote>
        <button class="primary-action continue" id="continue-button" type="button">
          ${state.round >= state.events.length - 1 ? "Close the books" : "Begin next shift"}<span>→</span>
        </button>
      </div>`;
  }

  function gameTemplate() {
    const crisis = state.events[state.round];
    const turnTrack = state.events
      .map((_item, index) => `<span aria-hidden="true" class="${index < state.round ? "complete" : index === state.round ? "current" : ""}"></span>`)
      .join("");

    return `
      <section class="game-screen">
        <div class="run-bar">
          <div><span>ST. DYMPHNA MEMORIAL // ${state.session}</span><strong>SHIFT ${state.round + 1} OF ${state.events.length}</strong></div>
          <div class="turn-track" aria-label="Shift ${state.round + 1} of ${state.events.length}">${turnTrack}</div>
          <div class="capital-readout"><span>CASH ON HAND</span><strong>${formatMoney(state.metrics.cash)}</strong><small>NEXT PAYROLL ${formatMoney(payrollPerShift)}</small></div>
        </div>
        <div class="compact-vitals" aria-label="Hospital operating status">
          <span>OPEN BEDS <strong>${openBeds()}/60</strong></span>
          <span>TEAM <strong>${state.metrics.workforce}</strong></span>
          <span>DISCHARGE FLOW <strong>${state.metrics.flow}</strong></span>
          <span>PATIENT TRUST <strong>${state.metrics.trust}</strong></span>
        </div>
        <button class="panic-button" id="private-equity-button" type="button">
          <span>PANIC BUTTON</span>
          <strong>SELL TO PRIVATE EQUITY</strong>
          <small>YOU WIN INSTANTLY · PATIENTS AND EMPLOYEES DO NOT</small>
        </button>
        <div class="dashboard-grid">
          <article class="crisis-card" data-docket="${crisis.docket}">
            ${state.report ? reportTemplate() : `
              <div class="crisis-meta"><span>OPERATIONS FILE ${crisis.docket}</span><span>${crisis.category}</span></div>
              <h1>${crisis.title}</h1>
              <p class="dispatch">${crisis.dispatch}</p>
              <blockquote><span>FROM THE FLOOR</span>${crisis.human}</blockquote>
              <details class="fact-drawer">
                <summary>Operational context <span>+</span></summary>
                <p>${crisis.fact}</p>
                <a href="${crisis.source.url}" target="_blank" rel="noreferrer">${crisis.source.label} ↗</a>
              </details>
              <div class="decision-heading"><span>ISSUE ADMINISTRATOR ORDER</span><small>All options include this shift's payroll and supplies.</small></div>
              <div class="choices">${choiceCards(crisis)}</div>`}
          </article>
        </div>
      </section>`;
  }

  function endingTemplate() {
    const ending = state.ending;
    const directives = state.log
      .map((item, index) => `<p><small>${String(index + 1).padStart(2, "0")}</small>${item.choice.title}</p>`)
      .join("");

    return `
      <section class="ending-screen">
        <div class="ending-main">
          <p class="eyebrow">${ending.code} // ST. DYMPHNA MEMORIAL CLOSED</p>
          <h1>${ending.title}</h1>
          <h2>${ending.kicker}</h2>
          <p>${ending.body}</p>
          <blockquote>${ending.epitaph}</blockquote>
          <div class="compact-vitals final-vitals" aria-label="Final hospital status">
            <span>CASH <strong>${formatMoney(state.metrics.cash)}</strong></span>
            <span>BEDS <strong>${openBeds()}/60</strong></span>
            <span>STAFF <strong>${state.metrics.workforce}</strong></span>
            <span>FLOW <strong>${state.metrics.flow}</strong></span>
            <span>TRUST <strong>${state.metrics.trust}</strong></span>
            <span>CARE <strong>${state.metrics.care}</strong></span>
          </div>
          <div class="ending-actions">
            <button class="primary-action" id="restart-button" type="button">Take another doomed shift <span>↻</span></button>
            <button class="text-action" type="button" data-panel="assumptions">Change the model first</button>
          </div>
          <p class="discovered-note">OUTCOMES DISCOVERED: <strong>${state.discovered.length}/9</strong> · History is stored only on this device.</p>
          <details class="audit-log compact-audit"><summary>Review your five administrator orders</summary>${directives}</details>
        </div>
      </section>`;
  }

  function render(focusHeading) {
    if (state.phase === "playing") view.innerHTML = gameTemplate();
    if (state.phase === "ending") view.innerHTML = endingTemplate();
    if (focusHeading) {
      const heading = view.querySelector("h1");
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
    }
  }

  function startGame() {
    state.events = shuffle(crises).slice(0, 5);
    state.round = 0;
    state.metrics = { ...initialMetrics };
    state.report = null;
    state.log = [];
    state.session = String(Math.floor(100000 + Math.random() * 900000));
    state.phase = "playing";
    render(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function makeDecision(choiceId) {
    if (state.report) return;
    const crisis = state.events[state.round];
    const choice = crisis.choices.find((item) => item.id === choiceId);
    if (!choice) return;
    const factor = choice.assumption ? state.assumptions[choice.assumption] / 100 : 1;
    const deltas = {};

    Object.entries(choice.effects).forEach(([key, value]) => {
      const scaled = value < 0 ? value * factor : value;
      deltas[key] = key === "cash" ? roundMoney(scaled) : Math.round(scaled);
    });
    deltas.cash = roundMoney(deltas.cash - payrollPerShift);

    Object.entries(deltas).forEach(([key, value]) => {
      state.metrics[key] = clampMetric(key, state.metrics[key] + value);
    });

    state.report = { crisis, choice, deltas };
    state.log.push(state.report);
    render(true);
  }

  function continueGame() {
    if (!state.report) return;
    if (state.round >= state.events.length - 1) {
      state.ending = chooseEnding();
      if (!state.discovered.includes(state.ending.id)) {
        state.discovered.push(state.ending.id);
        saveDiscovered();
      }
      state.report = null;
      state.phase = "ending";
      render(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    state.round += 1;
    state.report = null;
    render(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function sellToPrivateEquity() {
    const exitChoice = {
      title: "Sold St. Dymphna to Atrium Vulture Partners",
      mode: "extract",
    };
    state.log.push({ crisis: { docket: "PE-911" }, choice: exitChoice });
    state.metrics = {
      cash: 0,
      capacity: 8,
      workforce: 4,
      flow: 12,
      trust: 0,
      care: 3,
    };
    state.ending = endings.privateEquity;
    if (!state.discovered.includes(state.ending.id)) {
      state.discovered.push(state.ending.id);
      saveDiscovered();
    }
    state.report = null;
    state.phase = "ending";
    render(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function briefingPanel() {
    return `
      <button class="modal-close" type="button" data-close-modal aria-label="Dismiss how to play">CLOSE ×</button>
      <p class="eyebrow">ADMINISTRATOR ORIENTATION</p>
      <h2 id="modal-title">Run the hospital. Lose the hospital.</h2>
      <p class="modal-intro">You are the new administrator of St. Dymphna Memorial, a 60-bed nonprofit hospital. The clinicians and staff are good. The math is not.</p>
      <div class="briefing-grid">
        <div><strong>1</strong><p>Coordinate admissions, staffed beds, treatment, discharge, rehab, nursing facilities, and home care.</p></div>
        <div><strong>2</strong><p>Every shift clears ${formatMoney(payrollPerShift)} for physicians, nurses, sanitation, therapy, casework, supplies, and operations.</p></div>
        <div><strong>3</strong><p>Survive five crises—or hit the private-equity panic button to win personally and destroy the institution immediately.</p></div>
      </div>
      <button class="primary-action howto-start" type="button" data-close-modal>Start the shift <span>→</span></button>
      <div class="method-note">THE TRAP: Care costs money now. Insurers pay less later. Government pays according to a formula from somewhere else. Patients receive whatever bill is left.</div>`;
  }

  function assumptionSlider(key, title, note) {
    return `
      <label class="slider-row">
        <span><strong>${title}</strong><small>${note}</small></span>
        <input type="range" min="70" max="140" step="5" value="${state.assumptions[key]}" data-assumption="${key}" />
        <output>${state.assumptions[key]}%</output>
      </label>`;
  }

  function assumptionsPanel() {
    return `
      <button class="modal-close" type="button" data-close-modal aria-label="Close dialog">CLOSE ×</button>
      <p class="eyebrow">OPEN MODEL / BIAS CONTROL</p>
      <h2 id="modal-title">Adjust the institutional hostility.</h2>
      <p class="modal-intro">These sliders amplify authored consequences. They expose the game's assumptions; they do not predict real policy outcomes.</p>
      ${assumptionSlider("denialPressure", "Insurance denial pressure", "How strongly payer delays damage cash and patient flow.")}
      ${assumptionSlider("safeStaffing", "Cost of safe staffing", "How expensive it is to keep enough skilled people at the bedside and throughout the hospital.")}
      ${assumptionSlider("uncompensatedCare", "Uncompensated care load", "How severely gaps in coverage and public support drain the hospital.")}
      <button class="reset-button" type="button" id="reset-assumptions">Restore default dysfunction</button>
      <div class="method-note">MODEL LIMIT: Values are fictional, directional scenario rules. They are not hospital budgets, reimbursement estimates, or clinical guidance.</div>`;
  }

  function sourcesPanel() {
    const list = sources
      .map((source, index) => `
        <a href="${source.url}" target="_blank" rel="noreferrer">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <strong>${source.label}</strong>
          <small>${source.note}</small>
          <i>↗</i>
        </a>`)
      .join("");
    return `
      <button class="modal-close" type="button" data-close-modal aria-label="Close dialog">CLOSE ×</button>
      <p class="eyebrow">SOURCES / MODEL PROVENANCE</p>
      <h2 id="modal-title">Real pressure points. Fictional hospital.</h2>
      <p class="modal-intro">Public evidence grounds the operating constraints. St. Dymphna, its staff, payers, figures, choices, and outcomes are invented satire.</p>
      <div class="source-list">${list}</div>`;
  }

  function openPanel(name) {
    if (name === "briefing") modalContent.innerHTML = briefingPanel();
    if (name === "assumptions") modalContent.innerHTML = assumptionsPanel();
    if (name === "sources") modalContent.innerHTML = sourcesPanel();
    modalBackdrop.hidden = false;
    document.body.style.overflow = "hidden";
    const initialFocus = modalContent.querySelector(".howto-start") || modalContent.querySelector(".modal-close");
    if (initialFocus) initialFocus.focus();
  }

  function closePanel() {
    modalBackdrop.hidden = true;
    document.body.style.overflow = "";
  }

  document.addEventListener("click", (event) => {
    const target = event.target.closest("button");
    if (!target) return;
    if (target.id === "restart-button") startGame();
    if (target.id === "continue-button") continueGame();
    if (target.id === "private-equity-button") sellToPrivateEquity();
    if (target.dataset.choice) makeDecision(target.dataset.choice);
    if (target.dataset.panel) openPanel(target.dataset.panel);
    if (target.hasAttribute("data-close-modal")) closePanel();
    if (target.id === "reset-assumptions") {
      state.assumptions = { ...defaultAssumptions };
      modalContent.innerHTML = assumptionsPanel();
    }
  });

  document.addEventListener("input", (event) => {
    const input = event.target.closest("input[data-assumption]");
    if (!input) return;
    const key = input.dataset.assumption;
    state.assumptions[key] = Number(input.value);
    const output = input.parentElement.querySelector("output");
    if (output) output.textContent = `${input.value}%`;
  });

  document.getElementById("brand-button").addEventListener("click", () => {
    closePanel();
    startGame();
  });

  modalBackdrop.addEventListener("click", (event) => {
    if (event.target === modalBackdrop) closePanel();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modalBackdrop.hidden) closePanel();
  });

  startGame();
  openPanel("briefing");
})();
