const SHEET_NAME = "Feedback";

const HEADERS = [
  "Received at",
  "Submitted at",
  "Feedback",
  "Topic",
  "Rotation/site/timeframe",
  "Optional identifier/contact",
];

function doGet() {
  return jsonResponse_({
    ok: true,
    message: "Anonymous feedback endpoint is live.",
  });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  let hasLock = false;

  try {
    lock.waitLock(10000);
    hasLock = true;
    const payload = parsePayload_(e);

    if (!String(payload.feedback || "").trim()) {
      throw new Error("Feedback is required.");
    }

    const sheet = getSheet_();
    ensureHeaders_(sheet);

    sheet.appendRow([
      new Date(),
      sanitizeCell_(payload.submittedAt),
      sanitizeCell_(payload.feedback),
      sanitizeCell_(payload.topic),
      sanitizeCell_(payload.context),
      sanitizeCell_(payload.identifier || "Anonymous"),
    ]);

    return jsonResponse_({ ok: true });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      error: "Submission could not be recorded.",
    });
  } finally {
    if (hasLock) {
      lock.releaseLock();
    }
  }
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return {};
  }

  try {
    return JSON.parse(e.postData.contents);
  } catch (error) {
    return e.parameter || {};
  }
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function ensureHeaders_(sheet) {
  const firstRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  const hasHeaders = firstRow.some((value) => String(value).trim() !== "");

  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }
}

function sanitizeCell_(value) {
  const text = String(value || "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .slice(0, 5000);

  if (/^[=+\-@]/.test(text)) {
    return "'" + text;
  }

  return text;
}

function jsonResponse_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
