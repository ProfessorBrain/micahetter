# UA Neurology Residency Anonymous Feedback

Static, mobile-first feedback intake for University of Arizona Neurology
residents. The site is designed for program-improvement feedback reviewed by an
independent ombuds or third-party reviewer, with no login, cookies, analytics,
or browser fingerprinting in the page code.

Only the feedback text box is required. Topic, rotation/site/timeframe, and
identifier/contact are optional.

## Files

- `index.html`: resident-facing form and safety routing.
- `styles.css`: responsive visual system.
- `app.js`: client-side validation and Google Apps Script submission endpoint.
- `google-apps-script.gs`: Google Apps Script receiver for Google Sheets.

## Google Sheets Setup

1. Create a new Google Sheet named `UA Neurology Residency Feedback`.
2. Share the Sheet only with the independent reviewer(s) who should see raw
   feedback.
3. In the Sheet, choose `Extensions > Apps Script`.
4. Delete the starter code and paste in the contents of
   `google-apps-script.gs`.
5. Save the Apps Script project.
6. Click `Deploy > New deployment`.
7. Select `Web app`.
8. Set `Execute as` to `Me`.
9. Set `Who has access` to `Anyone`.
10. Click `Deploy`, approve the requested permissions, and copy the deployed
    `/exec` URL.
11. Open `app.js` and paste that URL into `SHEETS_WEB_APP_URL`.
12. Submit one test entry from `index.html`.
13. Confirm a row appears in the Sheet, then delete the test row before sharing
    the site.

If you change `google-apps-script.gs` after the first deployment, update the
Apps Script project and redeploy it with `Deploy > Manage deployments > Edit >
Version > New version > Deploy`.

The site sends submissions with a `no-cors` POST because Apps Script web apps do
not provide ordinary browser CORS responses. If you see a
`script.googleusercontent.com` 403 in the console, make sure the page is using
the current `app.js`; older iframe-based test code caused that error.

Google's Apps Script docs confirm that web apps use `doGet(e)` or `doPost(e)`
and are deployed from the `Deploy` menu. The Sheet receiver appends rows with
`SpreadsheetApp` and prefixes spreadsheet-formula characters to reduce formula
injection risk.

## Publishing Checklist

- Host as a static site without analytics, ad pixels, heatmaps, or third-party
  widgets.
- Confirm the hosting platform's access logs are acceptable for the anonymity
  promise being made.
- Do not put this behind SSO if residents are being promised anonymous access.
- Restrict raw Sheet access to the independent reviewer.
- Consider publishing a brief governance note that says who reviews submissions,
  how often they are reviewed, how summaries are shared back to residents, and
  what will be excluded from resident-facing summaries.
- Recheck phone numbers, emails, and institutional links at least twice per year.

## Why The Warning Exists

Full anonymity helps residents speak honestly about culture, workflow, teaching,
scheduling, and program climate. It is a poor fit for issues where someone may
need urgent protection, formal notice, investigation, due process, mandated
reporting, accreditation action, or follow-up.

The warning and routing language is based on these official sources reviewed on
June 17, 2026:

- UA Ombuds: `https://ombuds.arizona.edu/`
- UA Office of Institutional Equity: `https://equity.arizona.edu/`
- UA OIE reporting: `https://equity.arizona.edu/reporting/submit-report`
- UA OIE law enforcement contacts:
  `https://equity.arizona.edu/reporting/contact-law-enforcement`
- UA confidential reporting resources:
  `https://equity.arizona.edu/reporting/confidential-reporting-options`
- UA Ethics and Compliance Hotline:
  `https://compliance.arizona.edu/hotline`
- ACGME report an issue:
  `https://www.acgme.org/Residents-and-Fellows/Report-an-Issue/`
- ACGME Office of the Ombudsperson:
  `https://www.acgme.org/residents-and-fellows/report-an-issue/office-of-the-ombudsperson/`
- ACGME Office of Complaints:
  `https://www.acgme.org/residents-and-fellows/report-an-issue/office-of-complaints/`
- Arizona Adult Protective Services:
  `https://des.az.gov/services/basic-needs/adult-protective-services/report-adult-abuse`
- 988 Suicide & Crisis Lifeline: `https://988lifeline.org/`

## Local Preview

No build step is required. For realistic form testing, serve the folder locally
instead of opening `index.html` directly:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.
