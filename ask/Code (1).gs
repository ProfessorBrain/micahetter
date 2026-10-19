/**
 * Backend for https://micahetter.me/ask/index.html (version 3.0)
 * Bind this project to the DESTINATION Google Sheet.
 * 1. Run testSetup() once, granting authorization.
 * 2. Run testWrite() once to create a visible test row.
 * 3. Deploy the new script version as a web app: Execute as Me, access Anyone.
 */
const ASK_SHEET_NAME = 'Submissions';
const ASK_SHEET_ID_PROPERTY = 'ASK_DESTINATION_SPREADSHEET_ID';
const ASK_MAX_LENGTH = 3000;
const ASK_RECEIPT_TTL_SECONDS = 1800;

function testSetup() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    throw new Error('Open the destination Google Sheet, then Extensions > Apps Script.');
  }
  // Store the ID so the published web app does not depend on an "active" Sheet.
  PropertiesService.getScriptProperties().setProperty(ASK_SHEET_ID_PROPERTY, spreadsheet.getId());
  getOrCreateSheet_(spreadsheet);
  SpreadsheetApp.flush();
  console.log('SETUP OK. Spreadsheet: ' + spreadsheet.getName());
  console.log('Destination spreadsheet ID stored for the deployed web app.');
}

// Run manually once to prove this script can write to the correct spreadsheet.
function testWrite() {
  const message = 'ASK FORM TEST — ' + new Date().toISOString();
  const id = Utilities.getUuid();
  saveSubmission_(message, id);
  console.log('TEST WRITE OK: ' + message + ' in the Submissions sheet.');
}

function doPost(e) {
  try {
    const params = (e && e.parameter) || {};
    const text = params.text;
    const id = params.submissionId;
    saveSubmission_(text, id);
    console.log('doPost: saved submission ' + id);
    return ContentService.createTextOutput(JSON.stringify({ saved: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error('doPost FAILED: ' + (error && error.stack || error));
    return ContentService.createTextOutput(JSON.stringify({ saved: false, error: String(error) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  const params = (e && e.parameter) || {};
  if (params.action !== 'status') {
    return ContentService.createTextOutput('ASK BACKEND v3 READY')
      .setMimeType(ContentService.MimeType.TEXT);
  }
  const callback = params.callback || '';
  if (!/^[_$A-Za-z][_$A-Za-z0-9]{0,100}$/.test(callback)) {
    return ContentService.createTextOutput('Invalid callback');
  }
  const id = params.submissionId;
  const saved = validId_(id) && CacheService.getScriptCache().get('receipt_' + id) === 'saved';
  return ContentService.createTextOutput(callback + '(' + JSON.stringify({ saved: Boolean(saved) }) + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function saveSubmission_(text, id) {
  if (typeof text !== 'string' || !text.trim() || text.trim().length > ASK_MAX_LENGTH) {
    throw new Error('Expected text between 1 and 3,000 characters.');
  }
  if (!validId_(id)) throw new Error('Missing or invalid submission ID.');

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const cache = CacheService.getScriptCache();
    const receiptKey = 'receipt_' + id;
    if (cache.get(receiptKey) === 'saved') return;

    const spreadsheetId = PropertiesService.getScriptProperties().getProperty(ASK_SHEET_ID_PROPERTY);
    if (!spreadsheetId) throw new Error('Run testSetup() in Apps Script before deploying.');
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = getOrCreateSheet_(spreadsheet);
    let cleaned = text.trim();
    // Prevent user text from becoming a spreadsheet formula.
    if (/^[=+\-@]/.test(cleaned)) cleaned = "'" + cleaned;
    sheet.appendRow([new Date(), cleaned]);
    SpreadsheetApp.flush();
    cache.put(receiptKey, 'saved', ASK_RECEIPT_TTL_SECONDS);
  } finally {
    lock.releaseLock();
  }
}

function getOrCreateSheet_(spreadsheet) {
  let sheet = spreadsheet.getSheetByName(ASK_SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(ASK_SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Text']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function validId_(id) {
  return typeof id === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}
