# BRAINSTEM player feedback

`feedback.html` contains the form. `feedback-apps-script.gs` contains the Google Sheets receiver.

Status: files are ready and locally tested. The Apps Script web app has not been deployed or authorized, so live collection is not active. No existing Google Sheet cells or responses were changed during development.

The six question statements match the existing pilot survey. The first five use 1 = Strongly disagree through 5 = Strongly agree. Difficulty uses 1 = Much too easy, 2 = Somewhat too easy, 3 = About right, 4 = Somewhat too difficult, and 5 = Much too difficult. No rating is preselected.

## Activate the form once

1. Open the [existing feedback spreadsheet](https://docs.google.com/spreadsheets/d/1TPn7Jko_Ma1VbiYMupMWjarZeAiDDJ3luEGDm0efYcg/edit).
2. Choose **Extensions > Apps Script**. If there is existing code, preserve it and use a separate project rather than overwriting it.
3. Name the project **BRAINSTEM Feedback**. Paste `feedback-apps-script.gs` into a script file such as `Code.gs`.
4. Add an **HTML** file named exactly **feedback** and paste the complete contents of `feedback.html` into it. Leave `WEB_APP_URL` blank for this hosted version.
5. Save the project. Select and run **checkConnection** once, and complete Google's authorization as the spreadsheet owner. This verifies the sheet and headers without adding a response.
6. Choose **Deploy > New deployment > Web app**. Set **Execute as: Me** and **Who has access: Anyone** so players can submit without a Google login. Review the requested authorization before accepting it. If your organization does not permit anonymous web apps, use its permitted access setting and tell participants about the login requirement.
7. Deploy and copy the **Web app URL** ending in `/exec`. Share that URL with players; it serves the HTML form and saves responses to the existing spreadsheet. The editor/test URL ending in `/dev` is not the participant link.

The submit button remains disabled until connected. A spreadsheet sharing URL is not a submission endpoint. Google Apps Script must be deployed and authorized before real responses can be saved.

## If you want to host the HTML alongside the game

After deployment, paste the `/exec` URL into the `WEB_APP_URL` constant near the bottom of `feedback.html`. You can then host that file with the other HTML game files or open it directly. Submitting it performs a regular form POST and shows a confirmation from the server. No secret, Google password, or API token belongs in the HTML.

The same HTML works when hosted by Apps Script: it uses `google.script.run` to save without leaving the page. The success screen appears only after the server confirms the write. **Next player** clears the form and starts a new submission.

## Where responses go

The receiver is fixed to spreadsheet `1TPn7Jko_Ma1VbiYMupMWjarZeAiDDJ3luEGDm0efYcg`, tab `Sheet1`.

| Column | Value |
| --- | --- |
| A | Submission date/time, generated on the server |
| B | `Anonymous` (the form does not collect a player code or name) |
| C | Enjoyment (1-5) |
| D | Usability (1-5) |
| E | Perceived spatial learning (1-5) |
| F | Perceived clinical relevance (1-5) |
| G | Replay interest (1-5) |
| H | Difficulty (1-5; 3 = about right) |
| I | Optional comments |
| J | Submission ID, used to prevent duplicate rows on retries |

The two header rows and existing responses are preserved. Column J is initialized only if its header is blank; the receiver refuses to overwrite an unrelated column. Numeric scores are stored as numbers. Free text is protected from being interpreted as a spreadsheet formula. The receiver checks all six scores and uses a lock to coordinate simultaneous submissions.

The spreadsheet was readable by anyone with its link when inspected. The form does not collect a player code or name and advises against sensitive comments. Its receiver does not expose stored responses. Existing spreadsheet sharing settings are not changed.

## Verify before collecting responses

Open the deployed link in a signed-out/private browser. Verify that the form loads without a participant authorization prompt. Submit a clearly labeled test response and check that exactly one row is appended in A:J with the correct column mapping. Keep any test response clearly marked and exclude it from analysis. No test rows have been added by the local test suite.

Local verification completed: eight receiver tests passed, and the browser checks covered required ratings, exact submitted values, confirmed success, next-player reset, failure/retry behavior, and a phone-width layout without horizontal overflow. The browser submission checks used a clearly labeled local simulation, not Google Sheets. The receiver tests can be rerun with `node --test tests/feedback-server.test.cjs`.

When updating a published form or receiver, save the project and use **Deploy > Manage deployments > Edit > New version > Deploy** to update the existing participant URL.

Google references: [Deploy an Apps Script web app](https://developers.google.com/apps-script/guides/web) and [HTML-to-server communication](https://developers.google.com/apps-script/guides/html/communication).
