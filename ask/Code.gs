/**
 * Bound Google Apps Script: create from Extensions > Apps Script
 * inside the Google Sheet that should receive submissions.
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Text Submission');
}

function submitText(text) {
  if (typeof text !== 'string') {
    throw new Error('Please enter some text.');
  }

  let value = text.trim();
  if (!value) {
    throw new Error('Please enter some text.');
  }
  if (value.length > 3000) {
    throw new Error('Text must be 3,000 characters or fewer.');
  }

  // Prevent a submission from being interpreted as a spreadsheet formula.
  if (/^[=+\-@]/.test(value)) {
    value = "'" + value;
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) {
      throw new Error('Open this script from the destination Google Sheet.');
    }

    let sheet = spreadsheet.getSheetByName('Submissions');
    if (!sheet) {
      sheet = spreadsheet.insertSheet('Submissions');
    }
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Text']);
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([new Date(), value]);
    return true;
  } finally {
    lock.releaseLock();
  }
}
