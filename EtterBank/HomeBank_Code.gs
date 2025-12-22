/**
 * HomeBank (Google Apps Script)
 * - Stores Users / Requests / Transactions in a Google Sheet (three tabs).
 * - Serves UI via HtmlService (HomeBank_Index.html).
 * - Simple passphrase auth using salted SHA-256 hashes stored in Users sheet.
 *
 * SETUP:
 * 1) Create a Google Sheet. Add tabs: Users, Requests, Transactions
 * 2) Open Extensions → Apps Script. Create:
 *    - Code.gs (paste this file)
 *    - HomeBank_Index.html (paste the HTML file)
 * 3) In Code.gs, set SHEET_ID below.
 * 4) Run setupHomeBank() once from the editor (authorizes + creates headers).
 * 5) Create your first admin user by running createFirstAdmin() once.
 * 6) Deploy → New deployment → Web app → Execute as: Me → Access: Anyone with the link
 *
 * Notes:
 * - This is a family tool, not a bank. Keep passphrases simple but not guessable.
 */

const SHEET_ID = 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE'; // <-- REQUIRED
const TAB_USERS = 'Users';
const TAB_REQUESTS = 'Requests';
const TAB_TXNS = 'Transactions';

// If true, kid-entered deposits are auto-approved and posted to the ledger.
// If false, deposits become pending requests and require admin approval.
const AUTO_POST_KID_DEPOSITS = true;

// Session TTL in seconds (6 hours)
const SESSION_TTL_SECONDS = 6 * 60 * 60;

function doGet() {
  return HtmlService.createHtmlOutputFromFile('HomeBank_Index')
    .setTitle('HomeBank')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** One-time sheet header setup */
function setupHomeBank() {
  const ss = SpreadsheetApp.openById(SHEET_ID);

  const users = ensureTab_(ss, TAB_USERS, [
    'userId','displayName','role','salt','passHash','isActive','createdAt'
  ]);

  const reqs = ensureTab_(ss, TAB_REQUESTS, [
    'requestId','createdAt','userId','kind','amount','purpose','link','notes',
    'status','decidedAt','decidedBy','fulfilledAmount','receiptUrl','adminNote'
  ]);

  const txns = ensureTab_(ss, TAB_TXNS, [
    'txnId','createdAt','userId','type','amount','status','memo','requestId','receiptUrl','enteredBy'
  ]);

  // Optionally freeze header row
  users.setFrozenRows(1); reqs.setFrozenRows(1); txns.setFrozenRows(1);
}

/** Run once to create initial admin (then use UI "Add user" later). */
function createFirstAdmin() {
  const displayName = 'Parent';
  const passphrase = 'change-me';
  const userId = Utilities.getUuid();
  const salt = Utilities.getUuid();
  const passHash = sha256Base64_(salt + '|' + passphrase);

  const sheet = getSheet_(TAB_USERS);
  sheet.appendRow([userId, displayName, 'admin', salt, passHash, true, new Date()]);
  Logger.log('Created admin userId: ' + userId);
}

/** Public: list users for the login dropdown (active only). */
function apiListUsersPublic() {
  const users = listUsers_().filter(u => u.isActive);
  return {
    ok: true,
    users: users.map(u => ({ userId: u.userId, displayName: u.displayName, role: u.role }))
  };
}

/** Login: validates passphrase; returns session token. */
function apiLogin(args) {
  const userId = (args && args.userId) ? String(args.userId) : '';
  const passphrase = (args && args.passphrase) ? String(args.passphrase) : '';

  if (!userId || !passphrase) return { ok:false, error:'Missing login fields.' };

  const user = getUserById_(userId);
  if (!user || !user.isActive) return { ok:false, error:'Unknown or inactive user.' };

  const expected = user.passHash;
  const actual = sha256Base64_(user.salt + '|' + passphrase);
  if (expected !== actual) return { ok:false, error:'Incorrect passphrase.' };

  const token = Utilities.getUuid();
  const payload = {
    token,
    userId: user.userId,
    displayName: user.displayName,
    role: user.role,
    issuedAt: Date.now()
  };

  CacheService.getScriptCache().put('sess_' + token, JSON.stringify(payload), SESSION_TTL_SECONDS);

  return { ok:true, session: payload };
}

function apiLogout(args){
  const token = args && args.token ? String(args.token) : '';
  if (token){
    CacheService.getScriptCache().remove('sess_' + token);
  }
  return { ok:true };
}

/** Kid dashboard */
function apiGetKidDashboard(args){
  const sess = requireSession_(args);
  if (!sess.ok) return sess;

  if (sess.session.role !== 'kid'){
    return { ok:false, error:'Not a kid session.' };
  }

  const userId = sess.session.userId;
  const balance = computeBalance_(userId);
  const pending = listPendingRequestsForUser_(userId);
  const recent = listRecentTransactions_(userId, 10);

  return { ok:true, balance, pendingRequests: pending, recentTransactions: recent };
}

/** Admin dashboard */
function apiGetAdminDashboard(args){
  const sess = requireSession_(args);
  if (!sess.ok) return sess;

  if (sess.session.role !== 'admin'){
    return { ok:false, error:'Not an admin session.' };
  }

  const pending = listPendingRequestsAll_();
  const balances = listKidBalances_();
  const houseTotal = balances.reduce((a, b) => a + (Number(b.balance)||0), 0);

  return { ok:true, pendingRequests: pending, balances, houseTotal };
}

/** Kid creates withdrawal or deposit request */
function apiCreateRequest(args){
  const sess = requireSession_(args);
  if (!sess.ok) return sess;

  const kind = String(args.kind || '').toLowerCase(); // 'withdrawal' or 'deposit'
  const amount = Number(args.amount || 0);
  const purpose = String(args.purpose || '').trim();
  const link = String(args.link || '').trim();
  const notes = String(args.notes || '').trim();

  if (!['withdrawal','deposit'].includes(kind)) return { ok:false, error:'Invalid kind.' };
  if (!(amount > 0)) return { ok:false, error:'Amount must be > 0.' };
  if (!purpose) return { ok:false, error:'Purpose required.' };

  const requestId = Utilities.getUuid();
  const createdAt = new Date();
  const userId = sess.session.userId;

  const sheet = getSheet_(TAB_REQUESTS);
  sheet.appendRow([
    requestId, createdAt, userId, kind, amount, purpose, link, notes,
    'pending', '', '', '', '', ''
  ]);

  // Optional auto-post kid deposits
  if (kind === 'deposit' && sess.session.role === 'kid' && AUTO_POST_KID_DEPOSITS){
    // Approve and post immediately
    adminApproveAndPostInternal_(requestId, amount, '', 'auto-post kid deposit', 'SYSTEM');
  }

  return { ok:true, requestId };
}

/** Admin: approve+post a request */
function apiAdminApproveAndPost(args){
  const sess = requireSession_(args);
  if (!sess.ok) return sess;
  if (sess.session.role !== 'admin') return { ok:false, error:'Not an admin session.' };

  const requestId = String(args.requestId || '');
  const fulfilledAmount = Number(args.fulfilledAmount || 0);
  const receiptUrl = String(args.receiptUrl || '').trim();
  const adminNote = String(args.adminNote || '').trim();

  if (!requestId) return { ok:false, error:'Missing requestId.' };
  if (!(fulfilledAmount > 0)) return { ok:false, error:'Fulfilled amount must be > 0.' };

  adminApproveAndPostInternal_(requestId, fulfilledAmount, receiptUrl, adminNote, sess.session.displayName);
  return { ok:true };
}

/** Admin: deny a request */
function apiAdminDeny(args){
  const sess = requireSession_(args);
  if (!sess.ok) return sess;
  if (sess.session.role !== 'admin') return { ok:false, error:'Not an admin session.' };

  const requestId = String(args.requestId || '');
  if (!requestId) return { ok:false, error:'Missing requestId.' };

  const reqRow = findRequestRow_(requestId);
  if (!reqRow) return { ok:false, error:'Request not found.' };
  if (String(reqRow.status).toLowerCase() !== 'pending') return { ok:false, error:'Request is not pending.' };

  updateRequestById_(requestId, {
    status: 'denied',
    decidedAt: new Date(),
    decidedBy: sess.session.displayName,
    adminNote: 'Denied by admin'
  });

  return { ok:true };
}

/** Admin: post a direct transaction (not via request) */
function apiAdminPostTransaction(args){
  const sess = requireSession_(args);
  if (!sess.ok) return sess;
  if (sess.session.role !== 'admin') return { ok:false, error:'Not an admin session.' };

  const userId = String(args.userId || '');
  const type = String(args.type || '').toLowerCase(); // deposit/withdrawal/adjustment
  const amount = Number(args.amount || 0);
  const memo = String(args.memo || '').trim();
  const receiptUrl = String(args.receiptUrl || '').trim();
  const status = String(args.status || 'posted').toLowerCase(); // posted/pending

  if (!userId) return { ok:false, error:'Missing kid userId.' };
  if (!['deposit','withdrawal','adjustment'].includes(type)) return { ok:false, error:'Invalid transaction type.' };
  if (!(amount > 0)) return { ok:false, error:'Amount must be > 0.' };
  if (!memo) return { ok:false, error:'Memo required.' };
  if (!['posted','pending'].includes(status)) return { ok:false, error:'Invalid status.' };

  const signedAmount = (type === 'withdrawal') ? -Math.abs(amount) : Math.abs(amount);

  const sheet = getSheet_(TAB_TXNS);
  sheet.appendRow([
    Utilities.getUuid(),
    new Date(),
    userId,
    type,
    signedAmount,
    status,
    memo,
    '',
    receiptUrl,
    sess.session.displayName
  ]);

  return { ok:true };
}

/** Admin: create user (kid or admin) */
function apiAdminCreateUser(args){
  const sess = requireSession_(args);
  if (!sess.ok) return sess;
  if (sess.session.role !== 'admin') return { ok:false, error:'Not an admin session.' };

  const displayName = String(args.displayName || '').trim();
  const role = String(args.role || '').toLowerCase();
  const passphrase = String(args.passphrase || '');

  if (!displayName) return { ok:false, error:'Display name required.' };
  if (!['kid','admin'].includes(role)) return { ok:false, error:'Role must be kid or admin.' };
  if (passphrase.length < 2) return { ok:false, error:'Passphrase too short.' };

  const userId = Utilities.getUuid();
  const salt = Utilities.getUuid();
  const passHash = sha256Base64_(salt + '|' + passphrase);

  const sheet = getSheet_(TAB_USERS);
  sheet.appendRow([userId, displayName, role, salt, passHash, true, new Date()]);

  return { ok:true, userId };
}

/* ---------------------------
   Internal helpers
---------------------------- */

function ensureTab_(ss, tabName, headers){
  let sh = ss.getSheetByName(tabName);
  if (!sh) sh = ss.insertSheet(tabName);

  const lastRow = sh.getLastRow();
  if (lastRow === 0){
    sh.appendRow(headers);
  } else {
    const current = sh.getRange(1,1,1,headers.length).getValues()[0];
    const matches = headers.every((h,i) => String(current[i]||'') === h);
    if (!matches){
      sh.getRange(1,1,1,headers.length).setValues([headers]);
    }
  }
  return sh;
}

function getSheet_(name){
  return SpreadsheetApp.openById(SHEET_ID).getSheetByName(name);
}

function sha256Base64_(str){
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, str, Utilities.Charset.UTF_8);
  return Utilities.base64Encode(bytes);
}

function listUsers_(){
  const sh = getSheet_(TAB_USERS);
  const values = sh.getDataRange().getValues();
  if (values.length < 2) return [];
  const header = values[0].map(String);
  const idx = indexMap_(header);

  const out = [];
  for (let i=1;i<values.length;i++){
    const row = values[i];
    out.push({
      userId: String(row[idx.userId] || ''),
      displayName: String(row[idx.displayName] || ''),
      role: String(row[idx.role] || ''),
      salt: String(row[idx.salt] || ''),
      passHash: String(row[idx.passHash] || ''),
      isActive: String(row[idx.isActive]).toLowerCase() === 'true',
      createdAt: row[idx.createdAt]
    });
  }
  return out.filter(u => u.userId);
}

function getUserById_(userId){
  const users = listUsers_();
  return users.find(u => u.userId === userId) || null;
}

function requireSession_(args){
  const token = args && args.token ? String(args.token) : '';
  if (!token) return { ok:false, error:'Missing session token.' };

  const raw = CacheService.getScriptCache().get('sess_' + token);
  if (!raw) return { ok:false, error:'Session expired. Please log in again.' };

  try{
    const session = JSON.parse(raw);
    return { ok:true, session };
  }catch(e){
    return { ok:false, error:'Session error.' };
  }
}

function indexMap_(header){
  const m = {};
  header.forEach((h,i) => { m[h] = i; });
  return m;
}

function listPendingRequestsForUser_(userId){
  return listRequests_(r => r.userId === userId && r.status === 'pending');
}
function listPendingRequestsAll_(){
  return listRequests_(r => r.status === 'pending');
}

function listRequests_(predicate){
  const sh = getSheet_(TAB_REQUESTS);
  const values = sh.getDataRange().getValues();
  if (values.length < 2) return [];
  const header = values[0].map(String);
  const idx = indexMap_(header);

  const users = listUsers_();
  const nameById = {};
  users.forEach(u => nameById[u.userId] = u.displayName);

  const out = [];
  for (let i=1;i<values.length;i++){
    const row = values[i];
    const r = {
      requestId: String(row[idx.requestId] || ''),
      createdAt: row[idx.createdAt],
      userId: String(row[idx.userId] || ''),
      kind: String(row[idx.kind] || '').toLowerCase(),
      amount: Number(row[idx.amount] || 0),
      purpose: String(row[idx.purpose] || ''),
      link: String(row[idx.link] || ''),
      notes: String(row[idx.notes] || ''),
      status: String(row[idx.status] || '').toLowerCase(),
      kidName: nameById[String(row[idx.userId] || '')] || 'Unknown'
    };
    if (r.requestId && predicate(r)){
      out.push({
        requestId: r.requestId,
        date: formatDate_(r.createdAt),
        userId: r.userId,
        kidName: r.kidName,
        kind: r.kind,
        amount: r.amount,
        purpose: r.purpose,
        link: r.link,
        notes: r.notes,
        status: r.status
      });
    }
  }

  // newest first
  out.sort((a,b) => String(b.date).localeCompare(String(a.date)));
  return out;
}

function findRequestRow_(requestId){
  const sh = getSheet_(TAB_REQUESTS);
  const values = sh.getDataRange().getValues();
  if (values.length < 2) return null;
  const header = values[0].map(String);
  const idx = indexMap_(header);

  for (let i=1;i<values.length;i++){
    const row = values[i];
    if (String(row[idx.requestId] || '') === requestId){
      return {
        rowIndex: i+1,
        idx,
        raw: row,
        requestId: requestId,
        userId: String(row[idx.userId] || ''),
        kind: String(row[idx.kind] || '').toLowerCase(),
        amount: Number(row[idx.amount] || 0),
        status: String(row[idx.status] || '').toLowerCase()
      };
    }
  }
  return null;
}

function updateRequestById_(requestId, patch){
  const found = findRequestRow_(requestId);
  if (!found) throw new Error('Request not found');

  const sh = getSheet_(TAB_REQUESTS);
  const idx = found.idx;

  const row = sh.getRange(found.rowIndex, 1, 1, sh.getLastColumn()).getValues()[0];

  if (patch.status !== undefined) row[idx.status] = patch.status;
  if (patch.decidedAt !== undefined) row[idx.decidedAt] = patch.decidedAt;
  if (patch.decidedBy !== undefined) row[idx.decidedBy] = patch.decidedBy;
  if (patch.fulfilledAmount !== undefined) row[idx.fulfilledAmount] = patch.fulfilledAmount;
  if (patch.receiptUrl !== undefined) row[idx.receiptUrl] = patch.receiptUrl;
  if (patch.adminNote !== undefined) row[idx.adminNote] = patch.adminNote;

  sh.getRange(found.rowIndex, 1, 1, row.length).setValues([row]);
}

function adminApproveAndPostInternal_(requestId, fulfilledAmount, receiptUrl, adminNote, decidedBy){
  const found = findRequestRow_(requestId);
  if (!found) throw new Error('Request not found');
  if (found.status !== 'pending') throw new Error('Request is not pending');

  // Update request
  updateRequestById_(requestId, {
    status: 'fulfilled',
    decidedAt: new Date(),
    decidedBy: decidedBy,
    fulfilledAmount: fulfilledAmount,
    receiptUrl: receiptUrl,
    adminNote: adminNote
  });

  // Post transaction
  const type = (found.kind === 'withdrawal') ? 'withdrawal' : 'deposit';
  const signedAmount = (type === 'withdrawal') ? -Math.abs(fulfilledAmount) : Math.abs(fulfilledAmount);

  const txns = getSheet_(TAB_TXNS);
  txns.appendRow([
    Utilities.getUuid(),
    new Date(),
    found.userId,
    type,
    signedAmount,
    'posted',
    (type === 'withdrawal' ? 'Purchase' : 'Deposit') + ' (via request)',
    requestId,
    receiptUrl,
    decidedBy
  ]);
}

function listRecentTransactions_(userId, limit){
  const sh = getSheet_(TAB_TXNS);
  const values = sh.getDataRange().getValues();
  if (values.length < 2) return [];
  const header = values[0].map(String);
  const idx = indexMap_(header);

  const out = [];
  for (let i=1;i<values.length;i++){
    const row = values[i];
    const uid = String(row[idx.userId] || '');
    const status = String(row[idx.status] || '').toLowerCase();
    if (uid !== userId) continue;
    if (status !== 'posted') continue;

    out.push({
      date: formatDate_(row[idx.createdAt]),
      memo: String(row[idx.memo] || ''),
      type: String(row[idx.type] || ''),
      amount: Number(row[idx.amount] || 0)
    });
  }

  out.sort((a,b) => String(b.date).localeCompare(String(a.date)));
  return out.slice(0, limit || 10);
}

function computeBalance_(userId){
  const sh = getSheet_(TAB_TXNS);
  const values = sh.getDataRange().getValues();
  if (values.length < 2) return 0;
  const header = values[0].map(String);
  const idx = indexMap_(header);

  let sum = 0;
  for (let i=1;i<values.length;i++){
    const row = values[i];
    if (String(row[idx.userId] || '') !== userId) continue;
    if (String(row[idx.status] || '').toLowerCase() !== 'posted') continue;
    sum += Number(row[idx.amount] || 0);
  }
  return round2_(sum);
}

function listKidBalances_(){
  const users = listUsers_().filter(u => u.role === 'kid' && u.isActive);
  return users.map(u => ({
    userId: u.userId,
    displayName: u.displayName,
    balance: computeBalance_(u.userId)
  })).sort((a,b) => a.displayName.localeCompare(b.displayName));
}

function formatDate_(d){
  if (!d) return '';
  try{
    return Utilities.formatDate(new Date(d), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }catch(e){
    return '';
  }
}

function round2_(n){
  return Math.round((Number(n)||0) * 100) / 100;
}
