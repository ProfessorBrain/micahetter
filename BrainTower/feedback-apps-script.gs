/**
 * BRAINSTEM feedback receiver. Deploy with feedback.html in Google Apps Script.
 * The spreadsheet ID and tab are fixed; visitors cannot select another target.
 */
const FEEDBACK_CONFIG = Object.freeze({
  spreadsheetId: '1TPn7Jko_Ma1VbiYMupMWjarZeAiDDJ3luEGDm0efYcg',
  sheetName: 'Sheet1',
  headers: [
    'Date/Time', 'Player', 'Enjoyment', 'Usability',
    'Perceived spatial learning', 'Perceived clinical relevance',
    'Replay interest', 'Appropriate challenge', 'Additional Comments'
  ],
  idHeader: 'Submission ID'
});

function doGet() {
  return HtmlService.createHtmlOutputFromFile('feedback')
    .setTitle('Player feedback | BRAINSTEM: Ultimate Tower of Power')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/** Run from the editor once to authorize and verify access; does not write data. */
function checkConnection() {
  feedbackSheet_();
  return { ok: true };
}

/** Called by google.script.run when the form is hosted in Apps Script. */
function saveFeedback(payload) {
  const clean = validateFeedback_(payload);
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    const sheet = feedbackSheet_();
    const idHeader = sheet.getRange(1, 10).getDisplayValue();
    if (idHeader && idHeader !== FEEDBACK_CONFIG.idHeader) {
      throw new Error('Column J is already used. Ask the organizer to review the feedback configuration.');
    }
    if (!idHeader) sheet.getRange(1, 10).setValue(FEEDBACK_CONFIG.idHeader);

    const lastRow = Math.max(2, sheet.getLastRow());
    if (lastRow > 2) {
      const receipt = sheet.getRange(3, 10, lastRow - 2, 1)
        .createTextFinder(clean.submissionId).matchEntireCell(true).findNext();
      if (receipt) return { ok: true, duplicate: true };
    }
    const nextRow = lastRow + 1;
    if (nextRow > sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(), 100);
    sheet.getRange(nextRow, 1, 1, 10).setValues([[
      new Date(), plainCell_(clean.player || 'Anonymous'),
      clean.enjoyment, clean.usability, clean.spatialLearning,
      clean.clinicalRelevance, clean.replayInterest, clean.difficulty,
      plainCell_(clean.comments), clean.submissionId
    ]]);
    sheet.getRange(nextRow, 1).setNumberFormat('yyyy-mm-dd hh:mm:ss');
    SpreadsheetApp.flush();
    return { ok: true };
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

/** A regular form POST is supported for copies hosted outside Apps Script. */
function doPost(event) {
  let saved = false;
  try {
    if (!event || !event.parameter) throw new Error('Missing form data.');
    saved = saveFeedback(event.parameter).ok === true;
  } catch (error) {
    console.error('Feedback could not be saved: ' + String(error));
  }
  const heading = saved ? 'Thank you for playing.' : 'Your feedback was not confirmed.';
  const message = saved
    ? 'Your feedback has been saved. It will help improve the next version of the game.'
    : 'Please go back to keep your answers and retry, or contact the game organizer. Retrying the same submission will not create a duplicate.';
  const link = saved
    ? '<a href="' + escapeHtml_(ScriptApp.getService().getUrl()) + '" target="_top">Next player</a>'
    : '<button type="button" onclick="history.back()">Back to my answers</button>';
  return HtmlService.createHtmlOutput(
    '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
    '<style>body{margin:0;background:#f4f3ed;color:#17252e;font:16px/1.6 system-ui,sans-serif;padding:48px 20px}main{max-width:560px;margin:auto;background:white;border:1px solid #ccd8da;border-radius:16px;padding:30px}h1{line-height:1.2;font-size:28px}small{color:#247f7c}a,button{display:inline-block;background:#123746;color:white;padding:12px 20px;border:0;border-radius:8px;font:inherit;text-decoration:none;cursor:pointer}</style>' +
    '</head><body><main><small>BRAINSTEM: Ultimate Tower of Power</small><h1>' +
    heading + '</h1><p>' + message + '</p>' + link + '</main></body></html>'
  ).setTitle(saved ? 'Feedback saved' : 'Feedback not confirmed')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function feedbackSheet_() {
  const sheet = SpreadsheetApp.openById(FEEDBACK_CONFIG.spreadsheetId)
    .getSheetByName(FEEDBACK_CONFIG.sheetName);
  if (!sheet) throw new Error('The feedback sheet could not be found.');
  const headers = sheet.getRange(1, 1, 1, 9).getDisplayValues()[0];
  if (FEEDBACK_CONFIG.headers.some((expected, i) => headers[i].trim() !== expected)) {
    throw new Error('The feedback sheet columns have changed. Ask the organizer to review the configuration.');
  }
  return sheet;
}

function validateFeedback_(payload) {
  if (!payload || typeof payload !== 'object') throw new Error('Missing feedback.');
  if (payload.website) throw new Error('Unable to accept this submission.');
  const submissionId = String(payload.submissionId || '');
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(submissionId)) {
    throw new Error('Please reload the feedback form.');
  }
  const clean = {
    submissionId: submissionId.toLowerCase(),
    player: String(payload.player || '').trim(),
    comments: String(payload.comments || '').trim()
  };
  if (clean.player.length > 60 || clean.comments.length > 2000) {
    throw new Error('Please shorten the player code or comments.');
  }
  ['enjoyment', 'usability', 'spatialLearning', 'clinicalRelevance', 'replayInterest', 'difficulty']
    .forEach(function (key) {
      if (!/^[1-5]$/.test(String(payload[key]))) throw new Error('Please answer all six ratings from 1 to 5.');
      clean[key] = Number(payload[key]);
    });
  return clean;
}

function plainCell_(value) {
  // Keep participant text literal, including strings that resemble formulas.
  return /^[\s]*[=+\-@]/.test(value) ? "'" + value : value;
}

function escapeHtml_(value) {
  return String(value || '').replace(/[&<>"']/g, function (character) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
  });
}
