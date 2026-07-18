(function () {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const gameView = $("#game-view");
  const modalBackdrop = $("#modal-backdrop");
  const modalContent = $("#modal-content");
  const endingStorageKey = "hellthcare-continuous-endings";

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
      role: "North Meridian payer liaison",
      theme: "antagonist",
    },
    state: {
      initials: "SL",
      name: "Automated State Liaison",
      role: "Department of reimbursement recovery",
      theme: "antagonist",
    },
  };

  const periods = [
    {
      date: "JAN–JUN 2026",
      year: "YEAR 1 · FIRST HALF",
      status: "INHERITED STABILITY",
      title: "Nothing is on fire.",
      situation: "St. Dymphna Memorial is full, respected, and unusually liquid. The physicians, nurses, therapists, caseworkers, sanitation crews, and support teams know exactly what they are doing.",
      pressure: "Commercial claims arrive on time. Discharges move. Even the ice machine has stopped making that noise.",
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
          quote: "Nobody had to be heroic. That is what a good six months looks like.",
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
          quote: "A normal quarter. I checked twice. It appears to be legal.",
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
          quote: "You monetized peace. The board is aroused and concerned.",
        },
      ],
    },
    {
      date: "JUL–DEC 2026",
      year: "YEAR 1 · SECOND HALF",
      status: "ORDINARY FRICTION",
      title: "Still a hospital. Mostly.",
      situation: "Volume rises gently. Two insurers slow payment, but the revenue team knows the dance. Staff cover the gaps without missing care.",
      pressure: "The new state billing manual is 612 pages, including 48 pages explaining that it is simpler.",
      baseRevenue: 29.8,
      baseExpense: 28.7,
      decay: { workforce: 2, care: 1, trust: 1, flow: 2 },
      ticker: "NORTH MERIDIAN: 97% OF CLEAN CLAIMS EVENTUALLY RESEMBLE PAYMENT",
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
          quote: "The units are busy, not unsafe. Please remember the distinction.",
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
          quote: "We spent cash to wait for money we already earned. A classic.",
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
          quote: "The doctor helped me. Then the building sent its own invoice.",
        },
      ],
    },
    {
      date: "JAN–JUN 2027",
      year: "YEAR 2 · FIRST HALF",
      status: "PAYMENT WEATHER",
      title: "The care happened. Payment did not.",
      situation: "North Meridian places $8.6 million in clean claims under ‘extended review.’ The patients have been treated. The staff have been paid. The insurer is thinking.",
      pressure: "A payer representative recommends reducing reliance on reimbursement by providing less reimbursable care.",
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
          quote: "The chart was correct before the insurer read it and after.",
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
          quote: "The bank paid us because the insurer did not. Both sent fees.",
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
          quote: "The CT found nothing. The bill found my house.",
        },
      ],
    },
    {
      date: "JUL–DEC 2027",
      year: "YEAR 2 · SECOND HALF",
      status: "POST-ACUTE GRIDLOCK",
      title: "Everyone is ready to leave. Nobody can.",
      situation: "Twenty patients are medically ready for rehab or skilled nursing. North Meridian denies every placement. The state has closed two nursing facilities after underfunding them for years.",
      pressure: "The emergency department boards admissions in hallways while safe discharge plans wait for authorization.",
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
          quote: "We won most appeals. Their reward is another appeal.",
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
          quote: "The discharge summary was flawless. The discharge was not.",
        },
      ],
    },
    {
      date: "JAN–JUN 2028",
      year: "YEAR 3 · FIRST HALF",
      status: "LABOR REALITY",
      title: "Payroll has discovered inflation.",
      situation: "Nurses, physicians, therapists, sanitation workers, caseworkers, technicians, pharmacists, and food-service teams all cost more because they are people who require housing.",
      pressure: "Payers offer a 1.8% rate increase and a webinar about shared sacrifice.",
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
          quote: "The nurses stayed. The bonus can seek care elsewhere.",
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
      title: "The state would like its money back.",
      situation: "A state payment bulletin changes last year's interpretation and recoups $7.2 million. The notice is a scanned photograph embedded in a portal that only accepts Internet Explorer.",
      pressure: "The legislature calls the recoupment fiscal stewardship. It spent the savings before sending the letter.",
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
          quote: "You kept the services our patients actually need. I wish that were financeable.",
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
          quote: "The MRI is now financially responsible for psychiatry and two elevators.",
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
      title: "The interest is now a department.",
      situation: "The hospital pays more to borrow, waits longer for reimbursement, and treats more uninsured patients who cannot pay. Demand rises as community clinics close.",
      pressure: "The bank requires a turnaround plan. The insurer requires gratitude. The patients require care, which is considered inflexible.",
      baseRevenue: 26.1,
      baseExpense: 40.7,
      decay: { workforce: 13, care: 11, trust: 9, flow: 13 },
      ticker: "BOND DESK: ST. DYMPHNA DOWNGRADED FROM CONCERNING TO CONTENT OPPORTUNITY",
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
          quote: "The hospital is still a hospital. That should not sound like a eulogy.",
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
          quote: "We have converted the roof into liquidity. Please avoid weather.",
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
      title: "There is no good line left.",
      situation: "The hospital is clinically indispensable and financially nonviable. Every staffed bed loses money under one contract and earns money under another, but only after a denial, an appeal, and a fiscal year.",
      pressure: "The board asks for a sustainable plan by Friday. It has scheduled the closure vote for Thursday.",
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
          quote: "The plan works if nothing else happens. Something else has happened.",
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
          quote: "Congratulations. Utilization has fallen among people who can no longer reach care.",
        },
      ],
    },
  ];

  const endings = {
    parachute: {
      code: "ENDING 06 / 06 // YOU WIN",
      title: "The Golden Parachute",
      kicker: "YOUR CAREER HAS NEVER BEEN HEALTHIER. THE HOSPITAL HAS BEEN PRONOUNCED AN ASSET.",
      body: "Atrium Vulture Partners pays you an $18 million exit award, borrows against the hospital, sells the building, cuts staffed beds, outsources the workforce, and raises every price it can locate. Patients now travel forty-seven miles. You join a panel on courageous leadership.",
      epitaph: "The physicians and hospital staff did everything they could. The transaction did exactly what it was designed to do.",
    },
    beloved: {
      code: "ENDING 01 / 06 // CLOSED",
      title: "Beloved & Bankrupt",
      kicker: "THE PATIENTS TRUSTED YOU. THE BONDHOLDERS DID NOT.",
      body: "You protected staff, safe discharges, and necessary services until the arithmetic exhausted the building. The hospital closes with every patient transferred and every final paycheck cleared. The community holds a candlelight vigil outside an urgent-care franchise.",
      epitaph: "You did not fail to run a hospital. The system failed to finance one.",
    },
    efficient: {
      code: "ENDING 02 / 06 // TECHNICALLY OPEN",
      title: "The Efficient Ruin",
      kicker: "MARGIN IMPROVED. THE HOSPITAL DISAPPEARED.",
      body: "You cut services, raised prices, reduced staffed beds, and preserved a cash balance long enough to leave behind a profitable imaging center with an emergency-department-shaped legal obligation attached.",
      epitaph: "The spreadsheet survived the people it was meant to describe.",
    },
    payroll: {
      code: "ENDING 03 / 06 // INSOLVENT",
      title: "The Last Payroll",
      kicker: "THE MONEY ARRIVED AFTER THE HOSPITAL LEFT.",
      body: "Cash reaches the basement before the final winter. Three insurers eventually release payment on the claims, addressing the checks to an institution that no longer exists.",
      epitaph: "Care was delivered on time. Payment was a retrospective concept.",
    },
    abandoned: {
      code: "ENDING 04 / 06 // EMPTY",
      title: "The Empty Lobby",
      kicker: "THE DOORS ARE OPEN. NOBODY BELIEVES YOU.",
      body: "The hospital remains nominally alive after pricing and cuts push trust and care below recoverable levels. Patients avoid it, staff leave it, and North Meridian praises the decline in unnecessary utilization.",
      epitaph: "A hospital without trust is a building with billing privileges.",
    },
    managed: {
      code: "ENDING 05 / 06 // CLOSED AS PLANNED",
      title: "Managed Decline",
      kicker: "EVERY COMPROMISE BOUGHT TIME. TIME SENT AN INVOICE.",
      body: "You balanced, borrowed, appealed, cross-subsidized, and cut around the edges. St. Dymphna lasts four years before a carefully managed closure removes the last full-service hospital from the neighborhood.",
      epitaph: "No single decision killed it. That was the elegance of the arrangement.",
    },
  };

  function freshState() {
    return {
      period: 0,
      cash: 26,
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

  function clamp(value, min = 0, max = 100) {
    return Math.max(min, Math.min(max, value));
  }

  function metricClass(value) {
    if (value >= 68) return "stable";
    if (value >= 45) return "strained";
    if (value >= 24) return "critical";
    return "failing";
  }

  function priceLabel() {
    if (state.priceIndex < 110) return "near baseline";
    if (state.priceIndex < 140) return "elevated";
    if (state.priceIndex < 180) return "severe";
    return "astronomical";
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
    return `MONTHS ${index * 6}–${(index + 1) * 6}`;
  }

  function renderVitals(final = false) {
    const metricItems = Object.entries(metricMeta)
      .map(([key, meta]) => `<span>${meta.short}<strong>${Math.round(state.metrics[key])}</strong></span>`)
      .join("");
    return `<div class="compact-vitals ${final ? "final-vitals" : ""}">
      ${metricItems}
      <span>Patient debt<strong>${money(state.patientDebt)}</strong></span>
      <span>Price index<strong>${Math.round(state.priceIndex)}</strong></span>
    </div>`;
  }

  function renderSideVitals() {
    const metricItems = Object.entries(metricMeta)
      .map(([key, meta]) => `<div class="side-metric">
        <span>${meta.label}</span>
        <strong>${Math.round(state.metrics[key])}</strong>
        <i><b class="${metricClass(state.metrics[key])}" style="width:${state.metrics[key]}%"></b></i>
      </div>`)
      .join("");
    return `<section class="side-section side-vitals">
      <div class="side-heading">Hospital status</div>
      ${metricItems}
      <div class="side-metric debt"><span>Patient debt</span><strong>${money(state.patientDebt)}</strong></div>
    </section>`;
  }

  function renderLedger(period) {
    const latest = state.history[state.history.length - 1];
    const projectedRevenue = period.baseRevenue;
    const projectedExpense = period.baseExpense;
    return `<section class="side-section side-ledger" aria-label="Six-month financial report">
      <div class="side-heading">Finances</div>
      <div><span>Revenue</span><strong>${latest ? money(latest.revenue) : "—"}</strong></div>
      <div><span>Expenses</span><strong>${latest ? money(latest.expense) : "—"}</strong></div>
      <div><span>Net</span><strong class="${latest && latest.net < 0 ? "bad" : "good"}">${latest ? money(latest.net, true) : "—"}</strong></div>
      <div><span>Next forecast</span><strong class="${projectedRevenue - projectedExpense < 0 ? "bad" : "good"}">${money(projectedRevenue - projectedExpense, true)}</strong></div>
    </section>`;
  }

  function renderChoices(period) {
    return period.choices
      .map((choice, index) => {
        const projectedRevenue = period.baseRevenue + choice.revenue;
        const projectedExpense = period.baseExpense + choice.expense;
        const net = projectedRevenue - projectedExpense;
        return `<button class="choice policy-choice ${choice.mode}" type="button" data-choice="${index}">
          <span class="choice-cost">PRICES +${choice.price}% · NET ${money(net, true)}</span>
          <strong>${choice.title}</strong>
          <p>${choice.text}</p>
          <small>REVENUE ${money(projectedRevenue)} · EXPENSES ${money(projectedExpense)}</small>
        </button>`;
      })
      .join("");
  }

  function renderHistory() {
    if (!state.history.length) {
      return `<div class="timeline-empty">No completed periods yet.</div>`;
    }
    return state.history
      .slice(-4)
      .reverse()
      .map((item) => `<div class="timeline-row">
        <span>${item.date}</span>
        <strong>${item.title}</strong>
        <small>${money(item.net, true)} · PRICES ${item.priceIndex} · TRUST ${item.trust}</small>
      </div>`)
      .join("");
  }

  function renderGame() {
    if (state.ending) {
      renderEnding();
      return;
    }

    const period = periods[Math.min(state.period, periods.length - 1)];
    gameView.innerHTML = `<section class="game-screen streamlined-game">
      <div class="streamlined-layout">
        <aside class="status-sidebar" aria-label="Hospital data">
          ${renderSideVitals()}
          ${renderLedger(period)}
          <section class="side-section local-press">
            <div class="side-heading">Local paper</div>
            <p>${period.ticker.replace(/^[^:]+:\s*/, "")}</p>
          </section>
          <details class="side-section side-history">
            <summary>Previous reports <span>${state.history.length}</span></summary>
            <div>${renderHistory()}</div>
          </details>
        </aside>

        <main class="policy-stage">
          <header class="policy-topline">
            <div class="month-label"><span>CURRENT PERIOD</span><strong>${periodLabel(state.period)}</strong></div>
            <div class="primary-readouts">
              <div><span>Cash on hand</span><strong>${money(state.cash)}</strong><small>${state.cash < 5 ? "PAYROLL AT RISK" : "AVAILABLE RESERVE"}</small></div>
              <div><span>Hospital price index</span><strong>${Math.round(state.priceIndex)}</strong><small>${priceLabel()}</small></div>
            </div>
          </header>

          <div class="hospital-update">
            <p>${period.situation}</p>
            <p>${period.pressure}</p>
          </div>

          <div class="decision-heading"><span>SET POLICY FOR THE NEXT SIX MONTHS</span></div>
          <div class="choices streamlined-choices">${renderChoices(period)}</div>
        </main>
      </div>

      <div class="panic-dock">
        <button class="panic-button" id="panic-button" type="button" aria-label="Panic button: sell to private equity. You win instantly; patients and employees do not.">
          <span>PANIC BUTTON</span>
          <strong>SELL TO PRIVATE EQUITY</strong>
          <small>YOU WIN · THE HOSPITAL DOES NOT</small>
        </button>
      </div>
    </section>`;
  }

  function applyChoice(index) {
    const period = periods[state.period];
    const choice = period.choices[index];
    if (!choice) return;

    const revenue = period.baseRevenue + choice.revenue;
    const expense = period.baseExpense + choice.expense;
    const net = revenue - expense;

    state.cash = Number((state.cash + net).toFixed(1));
    state.priceIndex = clamp(state.priceIndex + choice.price, 80, 300);
    state.patientDebt = Math.max(0, Number((state.patientDebt + choice.debt).toFixed(1)));
    state.modes[choice.mode] += 1;

    Object.keys(metricMeta).forEach((key) => {
      state.metrics[key] = clamp(state.metrics[key] - period.decay[key] + (choice.effects[key] || 0));
    });

    const report = {
      date: periodLabel(state.period),
      title: choice.title,
      mode: choice.mode,
      revenue,
      expense,
      net,
      priceIndex: Math.round(state.priceIndex),
      patientDebt: state.patientDebt,
      trust: Math.round(state.metrics.trust),
      quote: choice.quote,
      adviser: advisers[choice.adviser],
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
    const continueLabel = finalPeriod || collapsed ? "Open the final audit →" : "Advance six months →";
    const notice = report.mode === "care"
      ? "Patients and staff felt the benefit. The balance sheet has filed an objection."
      : report.mode === "balance"
        ? "You purchased time at the customary rate of more time later."
        : "Cash improved by moving the cost somewhere less visible.";

    openModal(`<div class="adviser-report ${report.adviser.theme}">
      <div class="adviser-person">
        <div class="adviser-portrait" aria-hidden="true"><span>${report.adviser.initials}</span></div>
        <div><p>${report.date} REPORT</p><strong>${report.adviser.name}</strong><small>${report.adviser.role}</small></div>
      </div>
      <div class="speech-card">
        <p class="adviser-quote">“${report.quote}”</p>
        <p>${notice}</p>
      </div>
      <div class="popup-ledger">
        <div><span>Money in</span><strong>${money(report.revenue)}</strong></div>
        <div><span>Money out</span><strong>${money(report.expense)}</strong></div>
        <div><span>Net change</span><strong class="${report.net < 0 ? "bad" : "good"}">${money(report.net, true)}</strong></div>
        <div><span>Cash left</span><strong>${money(state.cash)}</strong></div>
      </div>
      <div class="popup-impact">
        <span>PRICE INDEX <strong>${report.priceIndex}</strong></span>
        <span>PATIENT DEBT <strong>${money(report.patientDebt)}</strong></span>
        <span>TRUST <strong>${report.trust}</strong></span>
        <span>NEXT: <strong>${report.nextPressure}</strong></span>
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
    const totalRevenue = state.history.reduce((sum, item) => sum + item.revenue, 0);
    const totalExpense = state.history.reduce((sum, item) => sum + item.expense, 0);
    gameView.innerHTML = `<section class="ending-screen">
      <div class="ending-main">
        <p class="eyebrow">${ending.code} // ST. DYMPHNA MEMORIAL</p>
        <h1>${ending.title}</h1>
        <h2>${ending.kicker}</h2>
        <p>${ending.body}</p>
        <blockquote>${ending.epitaph}</blockquote>
        ${renderVitals(true)}
        <details class="compact-audit">
          <summary>Open final four-year audit</summary>
          <div class="ending-ledger">
            <span>Total money in <strong>${money(totalRevenue)}</strong></span>
            <span>Total money out <strong>${money(totalExpense)}</strong></span>
            <span>Final cash <strong>${money(state.cash)}</strong></span>
            <span>Final patient debt <strong>${money(state.patientDebt)}</strong></span>
          </div>
        </details>
        <p class="discovered-note">ENDING ${discoveredCount()} OF ${Object.keys(endings).length} DISCOVERED ON THIS DEVICE</p>
        <button class="primary-action" id="restart-button" type="button">Inherit it again ↻<span>↻</span></button>
      </div>
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
        <p class="modal-intro">You are in charge of St. Dymphna Memorial. On each turn, review the hospital, choose a policy, and see what happens over the next six months.</p>
        <div class="briefing-grid continuous-briefing">
          <div><strong>1</strong><p>Check cash, prices, staffing, patient flow, care, trust, and the six-month financial forecast.</p></div>
          <div><strong>2</strong><p>Choose one policy for the hospital to follow during the next six months.</p></div>
          <div><strong>3</strong><p>Read the hospital representative's report, then continue to the next period.</p></div>
        </div>
        <button class="primary-action howto-start" type="button" data-close-panel>Start the first six months →<span>›</span></button>`);
      return;
    }

    if (panel === "assumptions") {
      openModal(`<p class="eyebrow">OPERATING MODEL</p>
        <h2 id="modal-title">The spiral is structural.</h2>
        <p class="modal-intro">This is satire, not a forecast. Each period combines a fictional hospital ledger with real policy pressure points.</p>
        <div class="model-grid">
          <div><span>TIME</span><strong>8 half-years</strong><p>One continuous four-year playthrough designed for roughly 3–5 minutes.</p></div>
          <div><span>PEOPLE</span><strong>Clinicians are the good guys</strong><p>Staff absorb pressure and preserve care. Insurers and government payment systems intensify it.</p></div>
          <div><span>MONEY</span><strong>Revenue is not cash</strong><p>Payment delays, fixed payroll, post-acute bottlenecks, price increases, debt, and borrowing compound.</p></div>
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
