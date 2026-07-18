(function () {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const gameView = $("#game-view");
  const modalBackdrop = $("#modal-backdrop");
  const modalContent = $("#modal-content");
  const endingStorageKey = "hellthcare-continuous-endings";
  const hospitalName = "Community Hospital Medical Center";
  const localPaperName = "The Community Chronicle";
  const startingCash = 20;

  const metricMeta = {
    workforce: { label: "Hospital team", short: "Staff" },
    care: { label: "Care quality", short: "Care" },
    trust: { label: "Patient trust", short: "Trust" },
    flow: { label: "Patient flow", short: "Flow" },
  };

  const sources = [
    {
      label: "HHS OIG — Medicare Advantage SNF denials, 2026",
      note: "A federal review found wide variation in skilled-nursing admission denials and that nearly all appealed denials in its sample were overturned.",
      url: "https://oig.hhs.gov/reports/all/2026/medicare-advantage-organizations-overturned-nearly-all-appealed-prior-authorization-denials-for-skilled-nursing-facility-admission-raising-concerns-about-initial-denials/",
    },
    {
      label: "MedPAC — March 2026 Medicare Payment Policy",
      note: "Hospital costs, margins, access, payment adequacy, and payer mix inform the fictional operating model.",
      url: "https://www.medpac.gov/wp-content/uploads/2026/03/Mar26_Ch9_MedPAC_Report_To_Congress_SEC.pdf",
    },
    {
      label: "CMS — Hospital Price Transparency",
      note: "Hospitals publish gross charges, discounted cash prices, and payer-negotiated amounts under federal transparency rules.",
      url: "https://www.cms.gov/priorities/key-initiatives/hospital-price-transparency",
    },
    {
      label: "GAO — Urban Hospital Closures, 2025",
      note: "The report examines financial and operating factors behind selected closures and the resulting loss of services.",
      url: "https://files.gao.gov/reports/GAO-25-106473/index.html",
    },
    {
      label: "BLS — Occupational Employment and Wages",
      note: "National data describe the large, specialized workforce required to operate a hospital.",
      url: "https://www.bls.gov/news.release/ocwage.htm",
    },
    {
      label: "FTC, DOJ & HHS — Private Equity in Health Care Inquiry",
      note: "The agencies sought evidence about transactions that may enrich owners while threatening quality, access, workers, and affordability.",
      url: "https://www.ftc.gov/news-events/news/press-releases/2024/03/federal-trade-commission-department-justice-department-health-human-services-launch-cross-government",
    },
  ];

  const advisers = {
    finance: {
      initials: "GV",
      name: "Gideon Vale",
      role: "Chief financial officer",
      theme: "finance",
    },
    nurse: {
      initials: "ER",
      name: "Elena Ruiz, RN",
      role: "Chief nursing officer",
      theme: "care",
    },
    advocate: {
      initials: "NB",
      name: "Nia Brooks",
      role: "Patient & family advocate",
      theme: "human",
    },
    insurer: {
      initials: "BH",
      name: "Bret Hallow",
      role: "AmazingCare payer liaison",
      theme: "antagonist",
    },
    casework: {
      initials: "MC",
      name: "Mina Cho, LCSW",
      role: "Director of case management",
      theme: "care",
    },
    services: {
      initials: "DP",
      name: "Darnell Price",
      role: "Director of environmental services",
      theme: "care",
    },
    state: {
      initials: "RC",
      name: "Rhea Caldwell",
      role: "State Medicaid program liaison",
      theme: "antagonist",
    },
    physician: {
      initials: "AB",
      name: "Dr. Amara Bell",
      role: "Emergency physician & medical staff chair",
      theme: "care",
    },
  };

  const periods = [
    {
      date: "JAN–JUN 2026",
      year: "YEAR 1 · FIRST HALF",
      status: "INHERITED STABILITY",
      adviser: "nurse",
      title: "Nothing is on fire.",
      situation: `You take over with all 60 beds open, a veteran group of department leaders, and $${startingCash} million in unrestricted cash. Vacancies are low, the operating-room schedule is full, and the case management team can usually find a safe discharge placement before noon.`,
      pressure: "For now, the hospital collects most commercial claims within 45 days and makes payroll without borrowing. Department heads have submitted a modest wish list: more weekend therapy coverage, two additional environmental services positions, and replacement monitors for the step-down unit.",
      briefingQuote: "You have a good team and enough room to make it better. Give me weekend therapy coverage, two more people in environmental services, and those replacement monitors, and we can keep ordinary problems ordinary.",
      baseRevenue: 29.4,
      baseExpense: 27.1,
      decay: { workforce: 1, care: 1, trust: 0, flow: 1 },
      ticker: "LOCAL PAPER: COMMUNITY HOSPITAL ENTERS 2026 WITH ‘BORINGLY SOLID’ BALANCE SHEET",
      choices: [
        {
          mode: "care",
          title: "Add staff and weekend coverage",
          text: "Hire nurses and add sanitation, therapy, and casework hours.",
          price: 0,
          revenue: 0.2,
          expense: 2.4,
          debt: -0.2,
          effects: { workforce: 7, care: 6, trust: 4, flow: 5 },
          adviser: "nurse",
          quote: "Nobody had to be heroic. That is what a good quarter looks like.",
        },
        {
          mode: "balance",
          title: "Keep current staffing and prices",
          text: "Pay the full staff and put the remaining income into reserves.",
          price: 1,
          revenue: 0.8,
          expense: 0.4,
          debt: 0.1,
          effects: { workforce: 3, care: 2, trust: 2, flow: 2 },
          adviser: "finance",
          quote: "Staffing held, patients moved, and nobody was asked to cover two jobs at once. I can work with that.",
        },
        {
          mode: "extract",
          title: "Raise imaging and drug prices",
          text: "Increase charges for scans, medicines, and procedures.",
          price: 12,
          revenue: 3.3,
          expense: -0.3,
          debt: 1.6,
          effects: { workforce: -2, care: -1, trust: -8, flow: 0 },
          adviser: "finance",
          quote: "The units are still safe because the staff absorbed the change. The higher bills did not make their work easier.",
        },
      ],
    },
    {
      date: "JUL–DEC 2026",
      year: "YEAR 1 · SECOND HALF",
      status: "ORDINARY FRICTION",
      adviser: "finance",
      title: "Still a hospital. Mostly.",
      situation: "Admissions finish the quarter six percent above forecast. The additional volume is manageable, but nurses are picking up more overtime and weekend therapy coverage is thin enough to delay a few Monday discharges.",
      pressure: "Two commercial insurers have quietly extended the time they take to pay clean claims. The state has also issued a 612-page billing manual with new documentation rules, so the revenue team is moving experienced staff away from collections to review charts and resubmit forms.",
      briefingQuote: "The extra admissions are not the problem yet. The problem is that two insurers have decided a clean claim can spend another month sightseeing. I can move more people into billing review, but then nobody is left to collect the money they already owe us.",
      baseRevenue: 29.8,
      baseExpense: 28.7,
      decay: { workforce: 2, care: 1, trust: 1, flow: 2 },
      ticker: "AMAZINGCARE: 97% OF CLEAN CLAIMS EVENTUALLY RESEMBLE PAYMENT",
      choices: [
        {
          mode: "care",
          title: "Maintain full staffing",
          text: "Keep current nursing, environmental services, and weekend therapy coverage.",
          price: 2,
          revenue: 0.5,
          expense: 2.8,
          debt: 0,
          effects: { workforce: 7, care: 6, trust: 4, flow: 5 },
          adviser: "nurse",
          quote: "The staffing expense is real, but so is the overtime it prevented. This quarter cost more and ran better.",
        },
        {
          mode: "balance",
          title: "Use reserves while claims process",
          text: "Pay staff from reserves while the hospital appeals delayed claims.",
          price: 5,
          revenue: 1.4,
          expense: 0.9,
          debt: 0.4,
          effects: { workforce: 2, care: 2, trust: 0, flow: 2 },
          adviser: "finance",
          quote: "We used reserves to bridge claims that should already have been paid. The books balance, provided nobody asks when.",
        },
        {
          mode: "extract",
          title: "Add facility fees",
          text: "Add a hospital facility charge to outpatient visits.",
          price: 14,
          revenue: 4.1,
          expense: -0.5,
          debt: 2.1,
          effects: { workforce: -2, care: -2, trust: -10, flow: -1 },
          adviser: "advocate",
          quote: "Facility fees improved collections quickly. They also gave every outpatient a second bill to dispute.",
        },
      ],
    },
    {
      date: "JAN–JUN 2027",
      year: "YEAR 2 · FIRST HALF",
      status: "PAYMENT WEATHER",
      adviser: "insurer",
      title: "The care happened. Payment did not.",
      situation: "AmazingCare has placed $8.6 million in inpatient claims under extended review. The care was authorized, delivered, documented, and billed; the payer is now requesting records that were included with the original claims.",
      pressure: "The hospital has already paid the physicians, nurses, technicians, and suppliers involved in those stays. Collections are falling behind payroll, and AmazingCare's account representative says the hospital should expect another 60 to 90 days before the reviews are complete.",
      briefingQuote: "Before you ask, yes, the stays were authorized. Extended review is not a denial; it is a careful process that allows AmazingCare another 60 to 90 days to request the same records. You may want to arrange your payroll accordingly.",
      baseRevenue: 27.1,
      baseExpense: 29.6,
      decay: { workforce: 4, care: 3, trust: 2, flow: 4 },
      ticker: "PAYER UPDATE: PROMPT PAYMENT REQUIREMENTS REMAIN ASPIRATIONAL IN SPIRIT",
      choices: [
        {
          mode: "care",
          title: "Appeal every denied claim",
          text: "Add casework, clinical review, and coding hours for appeals.",
          price: 3,
          revenue: 2.4,
          expense: 2.5,
          debt: 0.3,
          effects: { workforce: 4, care: 5, trust: 5, flow: 4 },
          adviser: "nurse",
          quote: "Your appeal team recovered more claims than expected. AmazingCare will review whether the appeal process is being used too successfully.",
        },
        {
          mode: "balance",
          title: "Borrow to cover payroll",
          text: "Use the credit line while insurance payments are delayed.",
          price: 9,
          revenue: 2.8,
          expense: 1.9,
          debt: 1.2,
          effects: { workforce: 1, care: 1, trust: -2, flow: 1 },
          adviser: "finance",
          quote: "Borrowing is a hospital financing decision. AmazingCare remains committed to reviewing payment when review is complete.",
        },
        {
          mode: "extract",
          title: "Raise all listed prices",
          text: "Increase medicine, procedure, and imaging charges.",
          price: 28,
          revenue: 6.2,
          expense: -0.6,
          debt: 4.8,
          effects: { workforce: -4, care: -4, trust: -16, flow: -3 },
          adviser: "advocate",
          quote: "Higher list prices strengthen your negotiating position. They also allow us to describe the hospital as the cause of rising costs.",
        },
      ],
    },
    {
      date: "JUL–DEC 2027",
      year: "YEAR 2 · SECOND HALF",
      status: "POST-ACUTE GRIDLOCK",
      adviser: "casework",
      title: "Everyone is ready to leave. Nobody can.",
      situation: "Twenty inpatients no longer need acute hospital care. Therapy and case management recommend skilled nursing for fourteen of them and inpatient rehabilitation for six. AmazingCare denied every placement, including several facilities it had already identified as in-network.",
      pressure: "Those patients remain in staffed hospital beds while appeals are filed. Eleven admitted patients are waiting in the emergency department, three on hallway stretchers, and two nearby nursing facilities have stopped accepting referrals after cuts to the state's payment rates.",
      briefingQuote: "I can move these patients out of acute beds if somebody will approve somewhere safe for them to go. We can discharge them home on paper today, but paper does not provide wound care, a wheelchair ramp, or a daughter who can lift two hundred pounds.",
      baseRevenue: 26.4,
      baseExpense: 31.3,
      decay: { workforce: 7, care: 6, trust: 5, flow: 12 },
      ticker: "BED STATUS: 60 LICENSED · 57 STAFFED · 73 PHYSICALLY PRESENT · PLEASE ADVISE",
      choices: [
        {
          mode: "care",
          title: "Pay for post-acute beds",
          text: "Pay rehabilitation and nursing facilities before insurance approves them.",
          price: 5,
          revenue: 0.8,
          expense: 5.1,
          debt: 0.5,
          effects: { workforce: 6, care: 8, trust: 8, flow: 16 },
          adviser: "nurse",
          quote: "Mr. Alvarez is doing gait training, not occupying a revenue unit.",
        },
        {
          mode: "balance",
          title: "Expand the appeals team",
          text: "Add casework and therapy hours to challenge placement denials.",
          price: 11,
          revenue: 2.6,
          expense: 2.3,
          debt: 1.8,
          effects: { workforce: 3, care: 3, trust: 1, flow: 9 },
          adviser: "finance",
          quote: "The team overturned most of the denials, but every appeal took hours we should have spent arranging care.",
        },
        {
          mode: "extract",
          title: "Discharge patients home",
          text: "Send medically stable patients home without covered support services.",
          price: 21,
          revenue: 5.3,
          expense: -1.2,
          debt: 5.9,
          effects: { workforce: -8, care: -14, trust: -18, flow: 10 },
          adviser: "advocate",
          quote: "We completed the paperwork. We did not make those apartments safe, and several patients will be back.",
        },
      ],
    },
    {
      date: "JAN–JUN 2028",
      year: "YEAR 3 · FIRST HALF",
      status: "LABOR REALITY",
      adviser: "services",
      title: "Payroll has discovered inflation.",
      situation: "The annual wage review shows the hospital is falling behind the local market for nurses, imaging technicians, therapists, pharmacists, and environmental services staff. Open positions are taking longer to fill, and agency shifts now cost almost twice as much as regular staff hours.",
      pressure: "Keeping the current workforce will raise labor costs by roughly eleven percent. Commercial insurers are offering an average rate increase of 1.8 percent, and the state program has not changed its hospital rates at all.",
      briefingQuote: "You can call sanitation a support service if you want. Infection control calls it the reason we can open a room again. My crew can keep doing this work, but not for last year's wages while every agency in town offers more.",
      baseRevenue: 27.6,
      baseExpense: 34.8,
      decay: { workforce: 10, care: 8, trust: 5, flow: 8 },
      ticker: "WORKFORCE ALERT: RESILIENCE MODULE 14 CANNOT COVER THE NIGHT SHIFT",
      choices: [
        {
          mode: "care",
          title: "Increase wages hospital-wide",
          text: "Raise pay for every clinical, technical, and operating team.",
          price: 8,
          revenue: 1.2,
          expense: 6.3,
          debt: 0.9,
          effects: { workforce: 15, care: 10, trust: 7, flow: 7 },
          adviser: "nurse",
          quote: "Clean rooms and safe staffing are not administrative luxuries.",
        },
        {
          mode: "balance",
          title: "Freeze executive pay",
          text: "Suspend bonuses, reduce management costs, and protect bedside payroll.",
          price: 15,
          revenue: 2.9,
          expense: 1.6,
          debt: 2.4,
          effects: { workforce: 7, care: 5, trust: 4, flow: 3 },
          adviser: "finance",
          quote: "The frontline teams stayed and the checks cleared. Nobody on my crew is mourning the bonus pool.",
        },
        {
          mode: "extract",
          title: "Outsource sanitation and food",
          text: "Replace hospital-employed teams with the lowest outside bid.",
          price: 26,
          revenue: 4.6,
          expense: -3.1,
          debt: 6.4,
          effects: { workforce: -16, care: -15, trust: -12, flow: -8 },
          adviser: "nurse",
          quote: "We told you exactly which corners could not be cut.",
        },
      ],
    },
    {
      date: "JUL–DEC 2028",
      year: "YEAR 3 · SECOND HALF",
      status: "RETROACTIVE GOVERNMENT",
      adviser: "state",
      title: "The state would like its money back.",
      situation: "The state Medicaid program has reprocessed last year's claims under a new interpretation of its payment rules and removed $7.2 million from the hospital's current remittance. The notice arrived as a scanned attachment in the provider portal, without a patient-level claim list.",
      pressure: "Finance has 30 days to identify the affected claims and file an appeal. The state budget already counts the recoupment as savings, so even a successful appeal may not return the cash before the next two payroll dates.",
      briefingQuote: "You have 30 days to appeal the recoupment. I cannot provide the patient-level claim list, and the portal cannot accept a file larger than ten megabytes. A successful appeal may restore the funds after the state has finished using them as savings.",
      baseRevenue: 25.2,
      baseExpense: 36.9,
      decay: { workforce: 10, care: 9, trust: 7, flow: 10 },
      ticker: "STATE PORTAL: YOUR SESSION HAS EXPIRED · YOUR OBLIGATION HAS NOT",
      choices: [
        {
          mode: "care",
          title: "Keep all services open",
          text: "Use reserves for obstetrics, psychiatry, wound care, and language access.",
          price: 10,
          revenue: 0.6,
          expense: 6.8,
          debt: 1.1,
          effects: { workforce: 10, care: 12, trust: 10, flow: 5 },
          adviser: "advocate",
          quote: "The hospital kept every service open. The state appreciates that commitment but cannot recognize it as an allowable budget variance.",
        },
        {
          mode: "balance",
          title: "Raise imaging contract rates",
          text: "Charge insurers more for imaging while limiting cash prices.",
          price: 19,
          revenue: 5.4,
          expense: 2.5,
          debt: 2.2,
          effects: { workforce: 4, care: 7, trust: -3, flow: 3 },
          adviser: "finance",
          quote: "Your imaging revenue may cover the gap temporarily. Future rate adjustments may account for the hospital's improved revenue.",
        },
        {
          mode: "extract",
          title: "Close unprofitable services",
          text: "Keep imaging and surgery; close obstetrics, psychiatry, and charity clinics.",
          price: 31,
          revenue: 7.8,
          expense: -4.8,
          debt: 7.6,
          effects: { workforce: -19, care: -18, trust: -22, flow: -10 },
          adviser: "state",
          quote: "Access targets remain met when measured outside the affected area.",
        },
      ],
    },
    {
      date: "JAN–JUN 2029",
      year: "YEAR 4 · FIRST HALF",
      status: "DEBT SPIRAL",
      adviser: "advocate",
      title: "The interest is now a department.",
      situation: `The bank has renewed the hospital's credit line at a higher interest rate and added monthly cash-balance requirements. At the same time, two community clinics have closed, sending more uninsured and underinsured patients to ${hospitalName}'s emergency department.`,
      pressure: "Patient volume is up, but a larger share of that care will never be fully paid. The hospital is borrowing to cover ordinary operations, and the bank wants a turnaround plan that reduces expenses before it will release the next portion of the credit line.",
      briefingQuote: "More people are coming here because the clinics they used are gone. If you put the hospital's full charges on them, you will collect a fraction of the bill and ruin families for the balance. The bank will still call that a collection strategy.",
      baseRevenue: 26.1,
      baseExpense: 40.7,
      decay: { workforce: 13, care: 11, trust: 9, flow: 13 },
      ticker: `BOND DESK: ${hospitalName.toUpperCase()} DOWNGRADED FROM CONCERNING TO CONTENT OPPORTUNITY`,
      choices: [
        {
          mode: "care",
          title: "Use the remaining reserves",
          text: "Maintain staffing, beds, charity care, and safe discharge support.",
          price: 12,
          revenue: 0.9,
          expense: 8.2,
          debt: 1.4,
          effects: { workforce: 13, care: 14, trust: 12, flow: 9 },
          adviser: "nurse",
          quote: "People can still get care without losing the services they depend on. The reserve is almost gone, but the hospital still means something.",
        },
        {
          mode: "balance",
          title: "Refinance the hospital property",
          text: "Borrow against the building and maintain core staffing.",
          price: 23,
          revenue: 5.1,
          expense: 2.7,
          debt: 5.8,
          effects: { workforce: 3, care: 3, trust: -5, flow: 2 },
          adviser: "finance",
          quote: "The doors stay open, but the building now belongs to the loan. Patients will not see that debt until it changes their care.",
        },
        {
          mode: "extract",
          title: "Increase uninsured collections",
          text: "Apply listed prices, collection notices, and bedside payment plans.",
          price: 38,
          revenue: 9.4,
          expense: -2.8,
          debt: 10.8,
          effects: { workforce: -10, care: -12, trust: -27, flow: -7 },
          adviser: "advocate",
          quote: "The care saved his life. The bill took the rest of it.",
        },
      ],
    },
    {
      date: "JUL–DEC 2029",
      year: "YEAR 4 · SECOND HALF",
      status: "TERMINAL OPERATIONS",
      adviser: "physician",
      title: "There is no good line left.",
      situation: "The latest forecast shows fewer than twenty days of cash on hand. The hospital still provides the area's only emergency department, inpatient psychiatric service, and obstetric unit, and the clinical teams continue to meet their quality targets despite months of vacancies and discharge delays.",
      pressure: "The board wants a plan that can keep the doors open without violating the bank's loan terms. Every remaining option involves closing services, reducing staffed beds, taking on more debt, or preparing an orderly shutdown; a closure vote has been added to the same meeting agenda.",
      briefingQuote: "The staff can keep patients safe through a smaller operation or an orderly shutdown. What they cannot do is discover after every finance meeting that another unit vanished. I need you to decide what this hospital will still promise people tomorrow morning.",
      baseRevenue: 25.4,
      baseExpense: 44.9,
      decay: { workforce: 16, care: 14, trust: 11, flow: 16 },
      ticker: "BOARD CALENDAR: CELEBRATION OF SERVICE · ASSET DISPOSITION · LIGHT REFRESHMENTS",
      choices: [
        {
          mode: "care",
          title: "Fund a safe shutdown",
          text: "Pay staff and transfer every patient before closing services.",
          price: 10,
          revenue: -0.4,
          expense: 9.6,
          debt: 0,
          effects: { workforce: 14, care: 16, trust: 15, flow: 13 },
          adviser: "nurse",
          quote: "Every patient got somewhere safe. We were the last people paid.",
        },
        {
          mode: "balance",
          title: "Reduce beds and refinance",
          text: "Cut staffed beds and borrow again to keep fewer services open.",
          price: 28,
          revenue: 5.8,
          expense: -1.2,
          debt: 7.1,
          effects: { workforce: -4, care: -3, trust: -8, flow: -6 },
          adviser: "finance",
          quote: "We can run a smaller hospital safely, but not if 'smaller' keeps changing after every finance meeting.",
        },
        {
          mode: "extract",
          title: "Limit care to profitable services",
          text: "Keep profitable procedures and reduce the rest of the hospital.",
          price: 45,
          revenue: 11.2,
          expense: -6.4,
          debt: 13.2,
          effects: { workforce: -22, care: -25, trust: -30, flow: -17 },
          adviser: "insurer",
          quote: "The profitable procedures remain. The emergency department is left to receive everyone the rest of the plan excludes.",
        },
      ],
    },
  ];

  const endings = {
    parachute: {
      code: "ENDING 06 / 06 // YOU WIN",
      verdict: "PRIVATE EQUITY VICTORY",
      headline: "HOSPITAL SOLD; EXECUTIVE DECLARES SUCCESS FROM AIRPORT LOUNGE",
      title: "The Golden Parachute",
      kicker: "YOUR CAREER HAS NEVER BEEN HEALTHIER. THE HOSPITAL HAS BEEN PRONOUNCED AN ASSET.",
      body: "Atrium Vulture Partners pays you an $18 million exit award, borrows against the hospital, sells the building, cuts staffed beds, outsources the workforce, and raises every price it can locate. Patients now travel forty-seven miles. You join a panel on courageous leadership.",
      epitaph: "The physicians and hospital staff did everything they could. The transaction did exactly what it was designed to do.",
    },
    beloved: {
      code: "ENDING 01 / 06 // CLOSED",
      verdict: "CLOSED WITH CARE INTACT",
      headline: "COMMUNITY MOURNS HOSPITAL THAT COULD NOT BILL ITS WAY OUT",
      title: "Beloved & Bankrupt",
      kicker: "THE PATIENTS TRUSTED YOU. THE BONDHOLDERS DID NOT.",
      body: "You protected staff, safe discharges, and necessary services until the arithmetic exhausted the building. The hospital closes with every patient transferred and every final paycheck cleared. The community holds a candlelight vigil outside an urgent-care franchise.",
      epitaph: "You did not fail to run a hospital. The system failed to finance one.",
    },
    efficient: {
      code: "ENDING 02 / 06 // TECHNICALLY OPEN",
      verdict: "PROFITABLE ON PAPER",
      headline: "FULL-SERVICE HOSPITAL REOPENS AS IMAGING CENTER WITH AMBULANCE BAY",
      title: "The Efficient Ruin",
      kicker: "MARGIN IMPROVED. THE HOSPITAL DISAPPEARED.",
      body: "You cut services, raised prices, reduced staffed beds, and preserved a cash balance long enough to leave behind a profitable imaging center with an emergency-department-shaped legal obligation attached.",
      epitaph: "The spreadsheet survived the people it was meant to describe.",
    },
    payroll: {
      code: "ENDING 03 / 06 // INSOLVENT",
      verdict: "CASH FAILURE",
      headline: "INSURERS RELEASE PAYMENT TO HOSPITAL THAT CLOSED LAST MONTH",
      title: "The Last Payroll",
      kicker: "THE MONEY ARRIVED AFTER THE HOSPITAL LEFT.",
      body: "Cash reaches the basement before the final winter. Three insurers eventually release payment on the claims, addressing the checks to an institution that no longer exists.",
      epitaph: "Care was delivered on time. Payment was a retrospective concept.",
    },
    abandoned: {
      code: "ENDING 04 / 06 // EMPTY",
      verdict: "TRUST FAILURE",
      headline: "HOSPITAL REMAINS OPEN; COMMUNITY CONTINUES GOING ELSEWHERE",
      title: "The Empty Lobby",
      kicker: "THE DOORS ARE OPEN. NOBODY BELIEVES YOU.",
      body: "The hospital remains nominally alive after pricing and cuts push trust and care below recoverable levels. Patients avoid it, staff leave it, and AmazingCare praises the decline in unnecessary utilization.",
      epitaph: "A hospital without trust is a building with billing privileges.",
    },
    managed: {
      code: "ENDING 05 / 06 // CLOSED AS PLANNED",
      verdict: "ORDERLY FAILURE",
      headline: "BOARD APPROVES ORDERLY CLOSURE; NEIGHBORHOOD ADVISED TO PLAN AROUND IT",
      title: "Managed Decline",
      kicker: "EVERY COMPROMISE BOUGHT TIME. TIME SENT AN INVOICE.",
      body: `You balanced, borrowed, appealed, cross-subsidized, and cut around the edges. ${hospitalName} lasts two years before a carefully managed closure removes the last full-service hospital from the neighborhood.`,
      epitaph: "No single decision killed it. That was the elegance of the arrangement.",
    },
  };

  function freshState() {
    return {
      period: 0,
      cash: startingCash,
      priceIndex: 100,
      patientDebt: 3.2,
      metrics: { workforce: 84, care: 88, trust: 79, flow: 76 },
      history: [],
      modes: { care: 0, balance: 0, extract: 0 },
      ending: null,
      modalDismissable: true,
    };
  }

  let state = freshState();

  function money(value, signed = false) {
    const sign = value < 0 ? "−" : signed && value > 0 ? "+" : "";
    return `${sign}$${Math.abs(value).toFixed(1)}M`;
  }

  function roundOne(value) {
    return Number(value.toFixed(1));
  }

  function patientDebtCollected(openingBalance, newPatientDebt = 0) {
    const collectibleBalance = Math.max(0, openingBalance + newPatientDebt);
    if (collectibleBalance === 0) return 0;
    return Math.min(collectibleBalance, roundOne(collectibleBalance * 0.08));
  }

  function projectChoice(period, choice, currentState = state) {
    const patientCollections = patientDebtCollected(currentState.patientDebt, choice.debt);
    const revenue = roundOne(period.baseRevenue + choice.revenue + patientCollections);
    const expense = roundOne(period.baseExpense + choice.expense);
    const net = roundOne(revenue - expense);
    const metrics = {};
    Object.keys(metricMeta).forEach((key) => {
      metrics[key] = clamp(
        currentState.metrics[key] - period.decay[key] + (choice.effects[key] || 0),
      );
    });
    return {
      revenue,
      expense,
      net,
      patientCollections,
      cash: roundOne(currentState.cash + net),
      priceIndex: clamp(currentState.priceIndex + choice.price, 80, 300),
      patientDebt: Math.max(0, roundOne(currentState.patientDebt + choice.debt - patientCollections)),
      metrics,
    };
  }

  function policyImpact(label, value, positiveWord, negativeWord, options = {}) {
    const {
      neutralWord = "no change",
      positiveTone = "positive",
      negativeTone = "negative",
      format = (amount) => `${amount}`,
    } = options;
    const direction = value > 0 ? "▲" : value < 0 ? "▼" : "—";
    return {
      label,
      value: `${direction} ${format(Math.abs(value))}`,
      word: value > 0 ? positiveWord : value < 0 ? negativeWord : neutralWord,
      tone: value > 0 ? positiveTone : value < 0 ? negativeTone : "neutral",
    };
  }

  function clamp(value, min = 0, max = 100) {
    return Math.max(min, Math.min(max, value));
  }

  function statusGrade(value) {
    if (value >= 95) return { label: "A+", className: "grade-a", note: "exceptional", rank: 0 };
    if (value >= 90) return { label: "A", className: "grade-a", note: "excellent", rank: 1 };
    if (value >= 85) return { label: "A−", className: "grade-a", note: "very good", rank: 2 };
    if (value >= 82) return { label: "B+", className: "grade-b", note: "strong", rank: 3 };
    if (value >= 78) return { label: "B", className: "grade-b", note: "good", rank: 4 };
    if (value >= 75) return { label: "B−", className: "grade-b", note: "mostly stable", rank: 5 };
    if (value >= 72) return { label: "C+", className: "grade-c", note: "under pressure", rank: 6 };
    if (value >= 68) return { label: "C", className: "grade-c", note: "strained", rank: 7 };
    if (value >= 65) return { label: "C−", className: "grade-c", note: "visibly strained", rank: 8 };
    if (value >= 60) return { label: "D+", className: "grade-d", note: "poor", rank: 9 };
    if (value >= 55) return { label: "D", className: "grade-d", note: "seriously poor", rank: 10 };
    if (value >= 50) return { label: "D−", className: "grade-d", note: "near failure", rank: 11 };
    if (value >= 45) return { label: "F+", className: "grade-f", note: "failing", rank: 12 };
    if (value >= 40) return { label: "F", className: "grade-f", note: "deep failure", rank: 13 };
    if (value >= 35) return { label: "F−", className: "grade-f", note: "barely functioning", rank: 14 };
    return { label: "💀", className: "grade-skull", note: "catastrophic", rank: 15 };
  }

  function policyGradeImpact(label, beforeValue, afterValue) {
    const beforeGrade = statusGrade(beforeValue);
    const afterGrade = statusGrade(afterValue);
    const change = afterValue - beforeValue;
    const gradeChanged = beforeGrade.label !== afterGrade.label;
    return {
      label,
      value: `${beforeGrade.label} → ${afterGrade.label}`,
      word: change > 0
        ? gradeChanged ? "grade improves" : "improves within grade"
        : change < 0
          ? gradeChanged ? "grade falls" : "worsens within grade"
          : "no change",
      tone: change > 0 ? "positive" : change < 0 ? "negative" : "neutral",
    };
  }

  function hospitalGrade(value = state.priceIndex) {
    if (value <= 95) return { label: "A+", className: "grade-a", note: "exceptional" };
    if (value <= 100) return { label: "A", className: "grade-a", note: "excellent" };
    if (value <= 105) return { label: "A−", className: "grade-a", note: "very good" };
    if (value <= 110) return { label: "B+", className: "grade-b", note: "good" };
    if (value <= 115) return { label: "B", className: "grade-b", note: "mostly reasonable" };
    if (value <= 120) return { label: "B−", className: "grade-b", note: "creeping upward" };
    if (value <= 128) return { label: "C+", className: "grade-c", note: "under pressure" };
    if (value <= 137) return { label: "C", className: "grade-c", note: "strained" };
    if (value <= 145) return { label: "C−", className: "grade-c", note: "visibly strained" };
    if (value <= 155) return { label: "D+", className: "grade-d", note: "poor" };
    if (value <= 165) return { label: "D", className: "grade-d", note: "seriously poor" };
    if (value <= 175) return { label: "D−", className: "grade-d", note: "near failure" };
    if (value <= 185) return { label: "F+", className: "grade-f", note: "failing" };
    if (value <= 195) return { label: "F", className: "grade-f", note: "deep failure" };
    if (value <= 205) return { label: "F−", className: "grade-f", note: "barely defensible" };
    return { label: "💀", className: "grade-skull", note: "catastrophic" };
  }

  function privateEquityAvailable() {
    return (
      state.period >= 5 ||
      state.cash <= 5 ||
      state.metrics.workforce <= 30 ||
      state.metrics.care <= 25 ||
      state.metrics.trust <= 20 ||
      state.metrics.flow <= 20
    );
  }

  function discoveredCount() {
    try {
      return JSON.parse(localStorage.getItem(endingStorageKey) || "[]").length;
    } catch (_error) {
      return 0;
    }
  }

  function rememberEnding(id) {
    try {
      const found = new Set(JSON.parse(localStorage.getItem(endingStorageKey) || "[]"));
      found.add(id);
      localStorage.setItem(endingStorageKey, JSON.stringify([...found]));
    } catch (_error) {
      // The game remains playable when browser storage is unavailable.
    }
  }

  function periodLabel(index) {
    return `QUARTER ${index + 1}`;
  }

  function renderVitals(final = false) {
    const grade = hospitalGrade();
    const metricItems = Object.entries(metricMeta)
      .map(([key, meta]) => {
        const metricGrade = statusGrade(state.metrics[key]);
        return `<span>${meta.short}<strong class="hospital-grade ${metricGrade.className}" title="${metricGrade.note}">${metricGrade.label}</strong></span>`;
      })
      .join("");
    return `<div class="compact-vitals ${final ? "final-vitals" : ""}">
      ${metricItems}
      <span>Hospital grade<strong class="hospital-grade ${grade.className}">${grade.label}</strong></span>
    </div>`;
  }

  function renderSideVitals() {
    const metricItems = Object.entries(metricMeta)
      .map(([key, meta]) => {
        const grade = statusGrade(state.metrics[key]);
        return `<div class="side-metric">
          <span>${meta.label}</span>
          <strong class="hospital-grade side-grade ${grade.className}" title="${grade.note}">${grade.label}</strong>
        </div>`;
      })
      .join("");
    return `<section class="side-section side-vitals">
      <div class="side-heading">Hospital status</div>
      ${metricItems}
    </section>`;
  }

  function renderLedger(period) {
    const latest = state.history[state.history.length - 1];
    const baselineCollections = patientDebtCollected(state.patientDebt);
    const baselineNet = roundOne(period.baseRevenue + baselineCollections - period.baseExpense);
    return `<section class="side-section side-ledger" aria-label="Quarterly financial report">
      <div class="side-heading">Finances</div>
      <div><span>Last quarter in</span><strong>${latest ? money(latest.revenue) : "—"}</strong></div>
      <div><span>Patient debt collected (8%)</span><strong>${latest ? money(latest.patientCollections) : "—"}</strong></div>
      <div><span>Patient balances owed</span><strong>${money(state.patientDebt)}</strong></div>
      <div><span>Last quarter out</span><strong>${latest ? money(latest.expense) : "—"}</strong></div>
      <div><span>Last quarter net</span><strong class="${latest ? (latest.net < 0 ? "bad" : "good") : ""}">${latest ? money(latest.net, true) : "—"}</strong></div>
      <div><span>Before-policy net</span><strong class="${baselineNet < 0 ? "bad" : "good"}">${money(baselineNet, true)}</strong></div>
    </section>`;
  }

  function renderChoices(period) {
    return period.choices
      .map((choice, index) => {
        const projection = projectChoice(period, choice);
        const impacts = [
          policyImpact("Prices", projection.priceIndex - state.priceIndex, "increase", "decrease", {
            positiveTone: choice.price >= 20 ? "negative" : "warning",
            format: (amount) => `${amount}%`,
          }),
          policyGradeImpact("Team", state.metrics.workforce, projection.metrics.workforce),
          policyGradeImpact("Care", state.metrics.care, projection.metrics.care),
          policyImpact("Cash", projection.net, "adds cash", "uses cash", {
            neutralWord: "break-even",
            format: (amount) => money(amount),
          }),
          policyGradeImpact("Flow", state.metrics.flow, projection.metrics.flow),
          policyGradeImpact("Trust", state.metrics.trust, projection.metrics.trust),
        ];
        const impactForecast = impacts
          .map((impact) => `<span class="policy-impact ${impact.tone}" aria-label="${impact.label}: ${impact.word}, ${impact.value}">
            <small>${impact.label}</small>
            <b>${impact.value}</b>
            <em>${impact.word}</em>
          </span>`)
          .join("");
        return `<button class="choice policy-choice ${choice.mode}" type="button" data-choice="${index}">
          <strong>${choice.title}</strong>
          <p>${choice.text}</p>
          <span class="policy-forecast-label">Expected quarter impact</span>
          <span class="policy-forecast">${impactForecast}</span>
        </button>`;
      })
      .join("");
  }

  function renderHistory() {
    if (!state.history.length) {
      return `<div class="timeline-empty">No completed periods yet.</div>`;
    }
    return state.history
      .slice()
      .reverse()
      .map((item) => {
        const grade = hospitalGrade(item.priceIndex);
        const trustGrade = statusGrade(item.trust);
        return `<div class="timeline-row">
          <span>${item.date}</span>
          <strong>${item.title}</strong>
          <small>${money(item.net, true)} · GRADE ${grade.label} · TRUST ${trustGrade.label}</small>
        </div>`;
      })
      .join("");
  }

  function renderGame() {
    if (state.ending) {
      renderEnding();
      return;
    }

    const period = periods[Math.min(state.period, periods.length - 1)];
    const grade = hospitalGrade();
    const briefingAdviser = advisers[period.adviser];
    const briefingSeverity = state.period === 0
      ? { className: "update-advisory", label: "Planning note" }
      : state.period === 1
        ? { className: "update-caution", label: "Watch item" }
        : { className: "update-bad-news", label: "Operational risk" };
    gameView.innerHTML = `<section class="game-screen streamlined-game">
      <div class="streamlined-layout">
        <aside class="status-sidebar" aria-label="Hospital data">
          ${renderSideVitals()}
          ${renderLedger(period)}
          <section class="side-section local-press" aria-label="Local newspaper">
            <div class="newspaper-masthead">${localPaperName}</div>
            <div class="newspaper-dateline"><span>Community edition &middot; ${periodLabel(state.period)}</span><span>25&cent;</span></div>
            <p class="newspaper-headline">${period.ticker.replace(/^[^:]+:\s*/, "")}</p>
            <div class="newspaper-footer"><span>Local desk</span><span>Page A1</span></div>
          </section>
          <details class="side-section side-history" open>
            <summary>Previous reports <span>${state.history.length}</span></summary>
            <div>${renderHistory()}</div>
          </details>
        </aside>

        <main class="policy-stage">
          <header class="policy-topline">
            <div class="month-label"><span>CURRENT QUARTER</span><strong>${periodLabel(state.period)}</strong></div>
            <div class="primary-readouts">
              <div><span>Cash on hand</span><strong>${money(state.cash)}</strong><small>${state.cash < 5 ? "PAYROLL AT RISK" : "AVAILABLE RESERVE"}</small></div>
              <div><span>Hospital grade</span><strong class="hospital-grade ${grade.className}">${grade.label}</strong><small>${grade.note}</small></div>
            </div>
          </header>

          <div class="hospital-update">
            <div class="update-copy">
              <div class="update-message update-system-message">
                <p><strong>Hospital status:</strong> ${period.situation}</p>
              </div>
              <div class="character-quote-row">
                <div class="adviser-portrait update-portrait ${briefingAdviser.theme} character-${period.adviser}" aria-hidden="true"><span>${briefingAdviser.initials}</span></div>
                <div class="character-quote-content">
                  <p class="quote-speaker"><strong>${briefingAdviser.name}</strong><br>${briefingAdviser.role}</p>
                  <blockquote class="update-message update-character-message update-risk ${briefingSeverity.className}">
                    <p><strong>${briefingSeverity.label}:</strong> &ldquo;${period.briefingQuote}&rdquo;</p>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>

          <div class="decision-heading"><span>SET POLICY FOR THIS QUARTER</span></div>
          <div class="choices streamlined-choices">${renderChoices(period)}</div>
        </main>
      </div>

      ${privateEquityAvailable() ? `<div class="panic-dock">
        <button class="panic-button" id="panic-button" type="button" aria-label="Panic button: sell to private equity. You win instantly; patients and employees do not.">
          <span>PANIC BUTTON</span>
          <strong>SELL TO PRIVATE EQUITY</strong>
          <small>YOU WIN · THE HOSPITAL DOES NOT</small>
        </button>
      </div>` : ""}
    </section>`;
  }

  function applyChoice(index) {
    const period = periods[state.period];
    const choice = period.choices[index];
    if (!choice) return;

    const before = {
      cash: state.cash,
      priceIndex: state.priceIndex,
      patientDebt: state.patientDebt,
      metrics: { ...state.metrics },
    };
    const projection = projectChoice(period, choice, state);

    state.cash = projection.cash;
    state.priceIndex = projection.priceIndex;
    state.patientDebt = projection.patientDebt;
    state.metrics = { ...projection.metrics };
    state.modes[choice.mode] += 1;

    const report = {
      date: periodLabel(state.period),
      title: choice.title,
      mode: choice.mode,
      revenue: projection.revenue,
      expense: projection.expense,
      net: projection.net,
      patientCollections: projection.patientCollections,
      priceIndex: Math.round(state.priceIndex),
      patientDebt: state.patientDebt,
      trust: Math.round(state.metrics.trust),
      quote: choice.quote,
      adviser: advisers[period.adviser],
      adviserKey: period.adviser,
      before,
      after: {
        cash: state.cash,
        priceIndex: state.priceIndex,
        patientDebt: state.patientDebt,
        metrics: { ...state.metrics },
      },
      nextPressure: state.period + 1 < periods.length ? periodLabel(state.period + 1) : "BOARD VOTE",
    };

    state.history.push(report);
    state.period += 1;
    renderGame();
    showReport(report);
  }

  function showReport(report) {
    const finalPeriod = state.period >= periods.length;
    const collapsed = state.cash <= -8 || state.metrics.care <= 8 || state.metrics.workforce <= 8;
    const continueLabel = finalPeriod || collapsed ? "Open the final audit →" : "Advance to next quarter →";
    const comparisonTone = (change, inverse = false) => {
      if (Math.abs(change) < 0.05) return "same";
      const improved = inverse ? change < 0 : change > 0;
      return improved ? "good" : "bad";
    };
    const numberChange = (change, suffix = "") => {
      if (Math.abs(change) < 0.05) return "— no change";
      const sign = change > 0 ? "+" : "−";
      const arrow = change > 0 ? "▲" : "▼";
      return `${arrow} ${sign}${Math.abs(Math.round(change))}${suffix}`;
    };
    const moneyChange = (change) => Math.abs(change) < 0.05
      ? "— no change"
      : `${change > 0 ? "▲" : "▼"} ${money(change, true)}`;
    const gradeMarkup = (value) => {
      const grade = statusGrade(value);
      return `<span class="hospital-grade ${grade.className}" title="${grade.note}">${grade.label}</span>`;
    };
    const gradeChange = (before, after) => {
      const beforeGrade = statusGrade(before);
      const afterGrade = statusGrade(after);
      const distance = Math.abs(afterGrade.rank - beforeGrade.rank);
      if (distance === 0) return "— same grade";
      return afterGrade.rank < beforeGrade.rank
        ? `▲ up ${distance} step${distance === 1 ? "" : "s"}`
        : `▼ down ${distance} step${distance === 1 ? "" : "s"}`;
    };
    const priceAndGrade = (value) => {
      const priceChange = Math.round(value - 100);
      const priceLabel = priceChange === 0
        ? "BASE"
        : `${priceChange > 0 ? "+" : "−"}${Math.abs(priceChange)}%`;
      return `${priceLabel} · ${hospitalGrade(value).label}`;
    };
    const comparisonRows = [
      {
        label: "Prices / grade",
        before: priceAndGrade(report.before.priceIndex),
        after: priceAndGrade(report.after.priceIndex),
        change: numberChange(report.after.priceIndex - report.before.priceIndex, "%"),
        tone: comparisonTone(report.after.priceIndex - report.before.priceIndex, true),
      },
      {
        label: "Cash on hand",
        before: money(report.before.cash),
        after: money(report.after.cash),
        change: moneyChange(report.after.cash - report.before.cash),
        tone: comparisonTone(report.after.cash - report.before.cash),
      },
      {
        label: "Team",
        before: gradeMarkup(report.before.metrics.workforce),
        after: gradeMarkup(report.after.metrics.workforce),
        change: gradeChange(report.before.metrics.workforce, report.after.metrics.workforce),
        tone: comparisonTone(report.after.metrics.workforce - report.before.metrics.workforce),
      },
      {
        label: "Care",
        before: gradeMarkup(report.before.metrics.care),
        after: gradeMarkup(report.after.metrics.care),
        change: gradeChange(report.before.metrics.care, report.after.metrics.care),
        tone: comparisonTone(report.after.metrics.care - report.before.metrics.care),
      },
      {
        label: "Patient flow",
        before: gradeMarkup(report.before.metrics.flow),
        after: gradeMarkup(report.after.metrics.flow),
        change: gradeChange(report.before.metrics.flow, report.after.metrics.flow),
        tone: comparisonTone(report.after.metrics.flow - report.before.metrics.flow),
      },
      {
        label: "Trust",
        before: gradeMarkup(report.before.metrics.trust),
        after: gradeMarkup(report.after.metrics.trust),
        change: gradeChange(report.before.metrics.trust, report.after.metrics.trust),
        tone: comparisonTone(report.after.metrics.trust - report.before.metrics.trust),
      },
      {
        label: "Patient balances",
        before: money(report.before.patientDebt),
        after: money(report.after.patientDebt),
        change: moneyChange(report.after.patientDebt - report.before.patientDebt),
        tone: comparisonTone(report.after.patientDebt - report.before.patientDebt, true),
      },
    ];
    const comparisonMarkup = comparisonRows
      .map((item) => `<div class="report-comparison-row">
        <span class="comparison-measure">${item.label}</span>
        <span class="comparison-value"><small>Before</small><strong>${item.before}</strong></span>
        <span class="comparison-arrow" aria-hidden="true">→</span>
        <span class="comparison-value"><small>After</small><strong>${item.after}</strong></span>
        <span class="comparison-change ${item.tone}">${item.change}</span>
      </div>`)
      .join("");
    openModal(`<div class="adviser-report ${report.adviser.theme}">
      <div class="adviser-person">
        <div class="adviser-portrait character-${report.adviserKey}" aria-hidden="true"><span>${report.adviser.initials}</span></div>
        <div><p>${report.date} REPORT</p><strong>${report.adviser.name}</strong><small>${report.adviser.role}</small></div>
      </div>
      <div class="speech-card">
        <p class="adviser-quote">“${report.quote}”</p>
      </div>
      <div class="report-comparison">
        <div class="report-comparison-heading"><strong>Hospital before and after</strong><small>NEXT: ${report.nextPressure}</small></div>
        <div class="report-comparison-body">${comparisonMarkup}</div>
      </div>
      <button class="primary-action adviser-continue" type="button" data-advance="${finalPeriod || collapsed ? "ending" : "continue"}">${continueLabel}<span>›</span></button>
    </div>`, false);
  }

  function chooseEnding() {
    if (state.cash <= -8) return "payroll";
    if (state.metrics.care <= 18 || state.metrics.trust <= 14 || state.metrics.workforce <= 16) return "abandoned";
    if (state.modes.care >= 5) return "beloved";
    if (state.modes.extract >= 5) return "efficient";
    return "managed";
  }

  function finishGame(forcedEnding) {
    closeModal(true);
    const id = forcedEnding || chooseEnding();
    state.ending = { id, ...endings[id] };
    rememberEnding(id);
    renderEnding();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderEnding() {
    const ending = state.ending;
    const totalRevenue = roundOne(state.history.reduce((sum, item) => sum + item.revenue, 0));
    const totalExpense = roundOne(state.history.reduce((sum, item) => sum + item.expense, 0));
    const totalNet = roundOne(totalRevenue - totalExpense);
    gameView.innerHTML = `<section class="ending-screen ending-${ending.id}">
      <header class="ending-titlebar">
        <span>${hospitalName.toUpperCase()} // FINAL BOARD REPORT</span>
        <strong>FILE CLOSED</strong>
      </header>

      <div class="ending-layout">
        <article class="ending-main ending-report">
          <div class="ending-code-row">
            <span>${ending.code}</span>
            <strong>${ending.verdict}</strong>
          </div>
          <p class="ending-overline">Hospital disposition</p>
          <h1>${ending.title}</h1>
          <p class="ending-kicker">${ending.kicker}</p>

          <section class="ending-narrative">
            <span>What happened</span>
            <p>${ending.body}</p>
          </section>

          <blockquote class="ending-final-note">
            <span>Final note from the floor</span>
            <p>${ending.epitaph}</p>
          </blockquote>
        </article>

        <aside class="ending-rail" aria-label="Final hospital audit">
          <section class="ending-newspaper local-press" aria-label="Final local newspaper">
            <div class="newspaper-masthead">${localPaperName}</div>
            <div class="newspaper-dateline"><span>Final edition</span><span>25&cent;</span></div>
            <p class="newspaper-headline">${ending.headline}</p>
            <div class="newspaper-footer"><span>Local desk</span><span>Page A1</span></div>
          </section>

          <section class="ending-stat-panel">
            <div class="panel-heading">Hospital at disposition</div>
            ${renderVitals(true)}
          </section>

          <details class="compact-audit ending-audit">
            <summary>Open final ledger</summary>
            <div class="ending-ledger">
              <span>Quarters operated <strong>${state.history.length}</strong></span>
              <span>Total money in <strong>${money(totalRevenue)}</strong></span>
              <span>Total money out <strong>${money(totalExpense)}</strong></span>
              <span>Operating change <strong class="${totalNet < 0 ? "bad" : "good"}">${money(totalNet, true)}</strong></span>
              <span>Final cash <strong>${money(state.cash)}</strong></span>
              <span>Patient debt <strong>${money(state.patientDebt)}</strong></span>
            </div>
          </details>
        </aside>
      </div>

      <footer class="ending-footer">
        <p class="discovered-note">ENDING ${discoveredCount()} OF ${Object.keys(endings).length} DISCOVERED ON THIS DEVICE</p>
        <button class="primary-action ending-restart" id="restart-button" type="button">Run the hospital again <span>&orarr;</span></button>
      </footer>
    </section>`;
  }

  function openModal(html, dismissable = true) {
    state.modalDismissable = dismissable;
    modalContent.innerHTML = `${dismissable ? '<button class="modal-close" type="button" aria-label="Close dialog">CLOSE ×</button>' : ""}${html}`;
    modalBackdrop.hidden = false;
    document.body.classList.add("modal-open");
    setTimeout(() => $("button", modalContent)?.focus(), 0);
  }

  function closeModal(force = false) {
    if (!force && !state.modalDismissable) return;
    modalBackdrop.hidden = true;
    modalContent.innerHTML = "";
    document.body.classList.remove("modal-open");
  }

  function showPanel(panel) {
    if (panel === "briefing") {
      openModal(`<p class="eyebrow">HOW TO PLAY</p>
        <h2 class="plain-modal-title" id="modal-title">How to play</h2>
        <p class="modal-intro">You are in charge of ${hospitalName}. On each turn, review the hospital, choose a policy, and see what happens during the quarter.</p>
        <div class="briefing-grid continuous-briefing">
          <div><strong>1</strong><p>Check cash, prices, staffing, patient flow, care, trust, and the quarterly financial forecast.</p></div>
          <div><strong>2</strong><p>Choose one policy for the hospital to follow during the quarter.</p></div>
          <div><strong>3</strong><p>Read the hospital representative's report, then continue to the next period.</p></div>
        </div>
        <button class="primary-action howto-start" type="button" data-close-panel>Start quarter 1 →<span>›</span></button>`);
      return;
    }

    if (panel === "assumptions") {
      openModal(`<p class="eyebrow">OPERATING MODEL</p>
        <h2 id="modal-title">The spiral is structural.</h2>
        <p class="modal-intro">This is satire, not a forecast. Each period combines a fictional hospital ledger with real policy pressure points.</p>
        <div class="model-grid">
          <div><span>TIME</span><strong>8 quarters</strong><p>One continuous two-year playthrough designed for roughly 3–5 minutes.</p></div>
          <div><span>PEOPLE</span><strong>Clinicians are the good guys</strong><p>Staff absorb pressure and preserve care. Insurers and government payment systems intensify it.</p></div>
          <div><span>MONEY</span><strong>Revenue is not cash</strong><p>The model collects 8% of patient balances each quarter. The rest remains owed while payment delays, payroll, bottlenecks, and borrowing compound.</p></div>
          <div><span>ENDING</span><strong>Doom is scheduled</strong><p>Choices determine who is protected, who pays, and what remains when the hospital closes.</p></div>
        </div>
        <p class="method-note">All organizations, characters, dollar amounts, and incidents are fictional. Policy concepts are simplified for play.</p>`);
      return;
    }

    if (panel === "sources") {
      openModal(`<p class="eyebrow">BACKGROUND READING</p>
        <h2 id="modal-title">Real pressure points. Fictional catastrophe.</h2>
        <p class="modal-intro">These public sources inform the themes. They do not validate the game's invented figures or guarantee its outcomes.</p>
        <div class="source-list">${sources.map((source, index) => `<a href="${source.url}" target="_blank" rel="noreferrer"><span>0${index + 1}</span><strong>${source.label}</strong><small>${source.note}</small><i>↗</i></a>`).join("")}</div>`);
    }
  }

  function restart() {
    closeModal(true);
    state = freshState();
    renderGame();
    showPanel("briefing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.addEventListener("click", (event) => {
    const panelButton = event.target.closest("[data-panel]");
    if (panelButton) showPanel(panelButton.dataset.panel);

    const choiceButton = event.target.closest("[data-choice]");
    if (choiceButton) applyChoice(Number(choiceButton.dataset.choice));

    if (event.target.closest("#panic-button")) finishGame("parachute");
    if (event.target.closest("#restart-button") || event.target.closest("#brand-button")) restart();
    if (event.target.closest(".modal-close") || event.target.closest("[data-close-panel]")) closeModal();

    const advance = event.target.closest("[data-advance]");
    if (advance) {
      if (advance.dataset.advance === "ending") finishGame();
      else {
        closeModal(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  });

  modalBackdrop.addEventListener("click", (event) => {
    if (event.target === modalBackdrop) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });

  renderGame();
  showPanel("briefing");
})();
