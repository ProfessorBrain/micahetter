/**
 * Google Apps Script backend for https://micahetter.me/ask/index.html
 *
 * Create this script from Extensions > Apps Script in the destination Sheet.
 * Deploy it as a Web App with Execute as: Me and Who has access: Anyone.
 * Copy the Web App URL ending in /exec into Index.html.
 */

const SHEET_NAME = 'Submissions';
const MAX_LENGTH = 3000;
const RECEIPT_TTL_SECONDS = 600;

/**
 * Run this function ONCE from the Apps Script editor using your own account.
 * It checks that the project is attached to a Sheet, creates the Submissions
 * header if necessary, and prompts for Google Sheets authorization.
 * It does not create a test submission row.
 *
 * If this works but the public /exec URL still returns 403, the problem is
 * with web app deployment/access, not the spreadsheet-writing code.
 */
function testSetup() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    throw new Error('No attached spreadsheet. Open Extensions > Apps Script from the destination Google Sheet.');
  }

  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Text']);
    sheet.setFrozenRows(1);
  }

  SpreadsheetApp.flush();
  console.log('SETUP OK: Google Sheets access authorized; destination spreadsheet is "' + spreadsheet.getName() + '".');
  console.log('Now deploy a NEW VERSION of the existing web app and test /exec in an incognito window.');
}

function doPost(e) {
  const text = e && e.parameter && e.parameter.text;
  const submissionId = e && e.parameter && e.parameter.submissionId;

  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('Text is required.');
  }
  if (text.trim().length > MAX_LENGTH) {
    throw new Error('Text exceeds 3,000 characters.');
  }
  if (!validSubmissionId_(submissionId)) {
    throw new Error('Invalid submission ID.');
  }

  const cache = CacheService.getScriptCache();
  const receiptKey = 'receipt_' + submissionId;
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);

  try {
    // Prevent duplicate writes if the same request is replayed soon afterward.
    if (cache.get(receiptKey) !== 'saved') {
      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      if (!spreadsheet) {
        throw new Error('Create this script from the destination Google Sheet.');
      }

      let sheet = spreadsheet.getSheetByName(SHEET_NAME);
      if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(['Timestamp', 'Text']);
        sheet.setFrozenRows(1);
      }

      let value = text.trim();
      // Prevent spreadsheet formula injection in submitted text.
      if (/^[=+\-@]/.test(value)) value = "'" + value;

      sheet.appendRow([new Date(), value]);
      SpreadsheetApp.flush();
      cache.put(receiptKey, 'saved', RECEIPT_TTL_SECONDS);
    }
  } finally {
    lock.releaseLock();
  }

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Read-only receipt endpoint. JSONP enables confirmation from micahetter.me
 * without asking Google Apps Script to expose CORS headers it cannot set.
 * No spreadsheet content is returned.
 */
function doGet(e) {
  const params = (e && e.parameter) || {};
  if (params.action !== 'status') {
    return ContentService.createTextOutput('Submission endpoint is running.')
      .setMimeType(ContentService.MimeType.TEXT);
  }

  const callback = params.callback;
  if (!/^[A-Za-z_$][A-Za-z0-9_$]{0,100}$/.test(callback || '')) {
    return ContentService.createTextOutput('Invalid callback.')
      .setMimeType(ContentService.MimeType.TEXT);
  }

  const saved = validSubmissionId_(params.submissionId) &&
    CacheService.getScriptCache().get('receipt_' + params.submissionId) === 'saved';

  // Callback is validated as a single JS identifier, not arbitrary code.
  return ContentService.createTextOutput(callback + '(' + JSON.stringify({ saved }) + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function validSubmissionId_(value) {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(value);
}
