/**
 * EtterBank — Google Sheets + Apps Script web app (writable)
 *
 * Spreadsheet tabs expected:
 *  - Accounts (required): columns A–E
 *      A: username
 *      B: primary_balance
 *      C: goal_balance
 *      D: target_purchase
 *      E: target_amount
 *
 *  - Ledger (optional; auto-created): append-only log
 *
 * Users (hardcoded):
 *  - SecretAgentSid / password
 *  - Hensonbot / password
 *
 * Match rule:
 *  - Any deposit or transfer INTO goal is matched dollar-for-dollar:
 *      goal += 2 * amount
 *  - Transfers also reduce primary:
 *      primary -= amount
 */

// If you create this as a container-bound script (Extensions > Apps Script from the Sheet),
// you can leave SHEET_ID empty and it will use the bound spreadsheet.
const SHEET_ID = ""; // Optional: paste your Sheet ID here if using a standalone script project.

const USERS = {
  "SecretAgentSid": { pass: "password" },
  "Hensonbot": { pass: "password" },
};

const SHEET_ACCOUNTS = "Accounts";
const SHEET_LEDGER = "Ledger";

function doGet() {
  // Serves the UI from Index.html
  return HtmlService.createHtmlOutputFromFile("Index")
    .setTitle("EtterBank")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getSnapshot(username, pass) {
  username = (username || "").toString().trim();
  pass = (pass || "").toString();

  requireAuth_(username, pass);

  const ss = getSpreadsheet_();
  const acctSheet = ss.getSheetByName(SHEET_ACCOUNTS);
  if (!acctSheet) throw new Error(`Missing sheet tab: ${SHEET_ACCOUNTS}`);

  const row = findAccountRow_(acctSheet, username);
  if (!row) throw new Error("User not found in Accounts sheet.");

  const rec = readAccountRow_(acctSheet, row);
  return {
    ok: true,
    username,
    primary: rec.primary,
    goal: rec.goal,
    target_purchase: rec.target_purchase,
    target_amount: rec.target_amount,
    updated_at: new Date().toISOString(),
  };
}

function applyGoalAction(username, pass, action, amount) {
  username = (username || "").toString().trim();
  pass = (pass || "").toString();
  action = (action || "").toString().trim().toLowerCase();

  requireAuth_(username, pass);

  let amt = Number(amount);
  if (!isFinite(amt) || amt <= 0) throw new Error("Invalid amount.");
  // currency-like rounding
  amt = Math.round(amt * 100) / 100;

  if (action !== "deposit" && action !== "transfer") {
    throw new Error("Invalid action.");
  }

  const ss = getSpreadsheet_();
  const acctSheet = ss.getSheetByName(SHEET_ACCOUNTS);
  if (!acctSheet) throw new Error(`Missing sheet tab: ${SHEET_ACCOUNTS}`);

  const ledgerSheet = ensureLedger_(ss);

  const row = findAccountRow_(acctSheet, username);
  if (!row) throw new Error("User not found in Accounts sheet.");

  const rec = readAccountRow_(acctSheet, row);

  if (action === "transfer") {
    if (rec.primary + 1e-9 < amt) throw new Error("Transfer exceeds available primary balance.");
    rec.primary = Math.round((rec.primary - amt) * 100) / 100;
  }

  // Match always applies to goal contributions:
  const match = amt;
  const creditedToGoal = Math.round((amt + match) * 100) / 100;
  rec.goal = Math.round((rec.goal + creditedToGoal) * 100) / 100;

  // Write back:
  acctSheet.getRange(row, 2).setValue(rec.primary); // B
  acctSheet.getRange(row, 3).setValue(rec.goal);    // C
  SpreadsheetApp.flush();

  // Append ledger:
  ledgerSheet.appendRow([
    new Date(),
    username,
    action,
    amt,
    match,
    creditedToGoal,
    rec.primary,
    rec.goal,
  ]);

  return getSnapshot(username, pass);
}

function requireAuth_(username, pass) {
  const u = USERS[username];
  if (!u || u.pass !== pass) throw new Error("Auth failed.");
}

function getSpreadsheet_() {
  if (SHEET_ID && SHEET_ID.trim()) {
    return SpreadsheetApp.openById(SHEET_ID.trim());
  }
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error("No active spreadsheet. If using a standalone project, set SHEET_ID.");
  return ss;
}

function findAccountRow_(sheet, username) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  // Expect header row at 1
  const values = sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat();
  for (let i = 0; i < values.length; i++) {
    const v = (values[i] || "").toString().trim();
    if (v.toLowerCase() === username.toLowerCase()) return i + 2;
  }
  return null;
}

function readAccountRow_(sheet, row) {
  // A–E
  const vals = sheet.getRange(row, 1, 1, 5).getValues()[0];
  return {
    username: (vals[0] || "").toString().trim(),
    primary: toMoney_(vals[1]),
    goal: toMoney_(vals[2]),
    target_purchase: (vals[3] || "").toString().trim(),
    target_amount: toMoney_(vals[4]),
  };
}

function toMoney_(v) {
  if (v === null || v === undefined || v === "") return 0;
  const n = Number(v);
  return isFinite(n) ? Math.round(n * 100) / 100 : 0;
}

function ensureLedger_(ss) {
  let sh = ss.getSheetByName(SHEET_LEDGER);
  if (!sh) {
    sh = ss.insertSheet(SHEET_LEDGER);
    sh.appendRow([
      "timestamp",
      "username",
      "action",
      "amount_user",
      "match_bank",
      "credited_to_goal",
      "primary_after",
      "goal_after",
    ]);
  } else if (sh.getLastRow() === 0) {
    sh.appendRow([
      "timestamp",
      "username",
      "action",
      "amount_user",
      "match_bank",
      "credited_to_goal",
      "primary_after",
      "goal_after",
    ]);
  }
  return sh;
}
