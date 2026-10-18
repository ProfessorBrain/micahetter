import { schedule, ratingIntervals, localDay } from './scheduler.js';
import { renderCard, plainText } from './renderer.js';
import { freshProfile, studyCounts, selectNext, interleaveDecks, validateBackup, available, isDue } from './study.js';
import { openStorage, mutateProfile, readProfile } from './storage.js';
import deckData from './data/deck.json' with { type: 'json' };

const $ = selector => document.querySelector(selector);
const main = $('#main');
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number = value => value.toLocaleString();
let deck, profile, cardsById, decksById, studyCards, searchIndex;
let view = 'today', session = null, busy = false, toastTimer;
let browse = {query:'',topic:'all',status:'all',page:0,selected:null,revealed:false};
// Some browsers restrict cross-tab channels for local files. Saving progress
// still works without the optional live-update channel.
const channel = (()=>{try{return 'BroadcastChannel' in window ? new BroadcastChannel('neuranki-progress') : null;}catch{return null;}})();

function toast(message) {
  clearTimeout(toastTimer); $('#toast').textContent = message; $('#toast').hidden = false;
  toastTimer = setTimeout(()=>$('#toast').hidden=true, 5000);
}
function deckName(id) { return (decksById[id]?.name || 'NeurAnki').split('::').at(-1); }
function topicCards(topic, source=studyCards) { return topic === 'all' ? source : source.filter(c=>c.deckId===topic); }
function stateLabel(card) {
  if (card.issue) return 'Source issue';
  if (profile.suspended[card.id]) return 'Suspended';
  const state = profile.cards[card.id];
  return !state ? 'New' : state.stage === 'review' ? (isDue(state,Date.now()) ? 'Due' : 'Review') : 'Learning';
}
function cardHtml(card,revealed) {
  const note = deck.notes[card.noteId];
  return renderCard(note,deck.models[note.modelId],card.ordinal,revealed);
}
function prepareCardMedia() {
  document.querySelectorAll('.card-body img').forEach(img=>{
    if(!img.closest('.io-overlay')){
      img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label','Enlarge '+(img.alt || 'card illustration'));
      img.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();zoomImage(img);}});
    }
    img.addEventListener('error',()=>{
      if(img.closest('.io-wrapper'))return;
      if(img.nextElementSibling?.classList.contains('media-error'))return;
      const notice=document.createElement('span');notice.className='media-error notice';notice.textContent='This source image could not load.';img.after(notice);
    },{once:true});
  });
  document.querySelectorAll('.card-body .io-wrapper').forEach(wrapper=>{
    const images=[...wrapper.querySelectorAll('img')];
    const check=()=>{
      if(images.length>=2 && images.every(img=>img.complete && img.naturalWidth>0)){wrapper.classList.add('is-ready');wrapper.classList.remove('media-failed');}
      else if(images.some(img=>img.complete && !img.naturalWidth))wrapper.classList.add('media-failed');
    };
    images.forEach(img=>{img.loading='eager';img.addEventListener('load',check);img.addEventListener('error',check);});check();
  });
}
function badge(card) {
  const label=stateLabel(card);
  return `<span class="badge ${label==='Learning'?'learning':['Due','Review'].includes(label)?'review':card.issue?'issue':''}">${label}</span>`;
}
function dateTime(time) { return new Date(time).toLocaleString(undefined,{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}); }
async function save(update) {
  try {
    profile = await mutateProfile(update);
    $('#save-status').textContent = 'Progress saved locally';
    channel?.postMessage({revision:profile.revision});
    return true;
  } catch(error) {
    $('#save-status').textContent = 'Could not save';
    toast(error.message || 'Progress could not be saved. Please export a backup before continuing.');
    return false;
  }
}
function navigate() {
  const route=location.hash.slice(1);
  view=['today','browse','settings'].includes(route)?route:'today';
  if (view!=='study') session=null;
  render();
}
function render() {
  document.querySelectorAll('[data-nav]').forEach(link=>{
    const active=link.dataset.nav===(view==='study'?'today':view);
    link.classList.toggle('active',active);
    if(active)link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
  });
  if(view==='today') renderToday();
  else if(view==='study') renderStudy();
  else if(view==='browse') renderBrowse();
  else renderSettings();
}
function renderToday() {
  const now=Date.now(), counts=studyCounts(studyCards,profile,now), today=profile.daily[localDay(now)] || {reviews:0,newCards:0};
  const learned=Object.keys(profile.cards).length, percent=learned/studyCards.length*100;
  const allReviews=Object.values(profile.daily).reduce((n,d)=>n+d.reviews,0);
  const week=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);return {day:d.toLocaleDateString(undefined,{weekday:'narrow'}),value:profile.daily[localDay(d.getTime())]?.reviews || 0,label:d.toLocaleDateString()};});
  const max=Math.max(1,...week.map(d=>d.value));
  const ready=counts.due+counts.learning+counts.newToday;
  main.innerHTML=`<div class="page-heading"><div><div class="eyebrow">A LITTLE, EVERY DAY</div><h1>Your daily review.</h1><p>Make room for a few good questions.</p></div><span class="date-label">${escape(new Date().toLocaleDateString(undefined,{weekday:'long',month:'short',day:'numeric'}))}</span></div>
    <div class="dashboard-grid"><div><section class="daily-panel" aria-label="Today's review"><div><div class="eyebrow">YOUR NEXT SESSION</div><h2>${ready?'Ready when you are.':today.reviews?'You’re up to date.':'Your deck is ready.'}</h2><p>${ready?'Pick up your reviews, then meet something new.':counts.waiting?'A few learning cards will be ready again soon.':'Come back for your next reviews, or explore the deck.'}</p></div><button class="primary" data-action="start" data-topic="all">${ready?'Study now':'Check reviews'}</button><div class="daily-counts"><div class="due"><strong>${number(counts.due)}</strong><span>Due for review</span></div><div class="learning"><strong>${number(counts.learning)}</strong><span>Learning now</span></div><div class="new"><strong>${number(counts.newToday)}</strong><span>New today</span></div></div></section>
    <section class="topics"><div class="section-heading"><h2>Study by topic</h2><span class="muted small">${deck.decks.length} topics</span></div><div class="panel"><div class="table-head"><span>Deck</span><span class="count">New</span><span class="count">Due</span><span></span></div>${deck.decks.map(d=>{
      const list=topicCards(d.id), c=studyCounts(list,profile,now);
      return `<button class="topic-row" data-action="start" data-topic="${escape(d.id)}" aria-label="Study ${escape(deckName(d.id))}, ${c.due+c.learning} due"><span><span class="topic-title">${escape(deckName(d.id))}</span><span class="topic-total">${number(list.length)} study cards</span></span><span class="count new ${c.newToday?'':'zero'}">${c.newToday}</span><span class="count due ${c.due+c.learning?'':'zero'}">${c.due+c.learning}</span><span class="topic-open" aria-hidden="true">›</span></button>`;
    }).join('')}</div><p class="small muted" style="margin-top:13px">Your ${profile.settings.newPerDay}-card daily new limit is shared across all topics.</p></section></div>
    <aside class="panel progress-panel"><div class="eyebrow">BUILDING YOUR KNOWLEDGE</div><h2>Your progress</h2><svg class="progress-ring" viewBox="0 0 160 160" role="img" aria-label="${learned} of ${studyCards.length} cards started"><circle cx="80" cy="80" r="66" fill="none" stroke="#eaf0f2" stroke-width="9"/><circle cx="80" cy="80" r="66" fill="none" stroke="#118776" stroke-width="9" stroke-linecap="round" stroke-dasharray="${percent*4.147} 414.7" transform="rotate(-90 80 80)"/><text x="80" y="78" text-anchor="middle" class="ring-number">${percent<1 && learned?'<1':Math.round(percent)}%</text><text x="80" y="99" text-anchor="middle" class="ring-label">OF DECK STARTED</text></svg><div class="progress-stat"><span>Reviews today</span><strong>${number(today.reviews)}</strong></div><div class="progress-stat"><span>Cards started</span><strong>${number(learned)} / ${number(studyCards.length)}</strong></div><div class="progress-stat"><span>Total reviews</span><strong>${number(allReviews)}</strong></div><div class="week-chart" aria-label="Reviews over the last seven days">${week.map(d=>`<div class="week-day" title="${escape(d.label)}: ${d.value} reviews"><div class="bar" style="height:${Math.max(5,d.value/max*65)}px"></div><span>${escape(d.day)}</span></div>`).join('')}</div></aside></div>`;
}
function startSession(topic) {
  session={topic,card:null,revealed:false,answered:0,expected:null};view='study'; nextCard();render();main.focus({preventScroll:true});window.scrollTo(0,0);
}
function nextCard() {
  session.card=selectNext(topicCards(session.topic),profile);
  session.revealed=false;
  session.expected=session.card?JSON.stringify(profile.cards[session.card.id] || null):null;
}
function renderStudy() {
  const card=session.card, title=session.topic==='all'?'All topics':deckName(session.topic);
  const c=studyCounts(topicCards(session.topic),profile);
  const heading=`<div class="study-header"><button data-action="exit-study" class="text-button">‹ Back to today</button><div class="study-heading"><strong>${escape(title)}</strong><span class="muted">${session.answered} answered this session · ${c.due+c.learning} due · ${c.newToday} new available</span></div><div class="study-toolbar"><button data-action="undo" ${profile.undo?'':'disabled'} title="Undo last rating (Z)">Undo</button>${card?`<button data-action="suspend" data-id="${card.id}">Suspend</button>`:''}</div></div>`;
  if(!card) {
    const waiting=topicCards(session.topic).filter(c=>available(c,profile,Date.now()) && profile.cards[c.id] && !isDue(profile.cards[c.id],Date.now()));
    const next=Math.min(...waiting.map(c=>profile.cards[c.id].due));
    main.innerHTML=heading+`<section class="panel empty-state"><div class="eyebrow">A GOOD PLACE TO PAUSE</div><h2>You’re caught up for now.</h2><p>${Number.isFinite(next)?`Next scheduled card: ${escape(dateTime(next))}.`:'No cards are due in this selection.'} ${c.fresh && !c.newToday?'You’ve reached your daily new-card limit.':''}</p><div class="button-row" style="justify-content:center"><button class="primary" data-action="check-due">Check for due cards</button><button data-action="browse-topic" data-topic="${escape(session.topic)}">Browse this topic</button></div></section>`;return;
  }
  const note=deck.notes[card.noteId], intervals=ratingIntervals(profile.cards[card.id] || null);
  main.innerHTML=heading+`<article class="study-card"><div class="card-meta"><span>${escape(deckName(card.deckId))}</span><span>${badge(card)} <span class="small">${deck.models[note.modelId].type==='occlusion'?'Image occlusion':`Cloze ${card.ordinal+1}`}</span></span></div><div class="card-body">${cardHtml(card,session.revealed)}</div>${session.revealed && deck.models[note.modelId].type==='occlusion'?'<div class="preview-controls"><button data-action="toggle-mask">Toggle answer mask</button><span class="small muted">Click the image to enlarge</span></div>':''}${session.revealed?tagsHtml(note):''}</article><div class="study-actions">${!session.revealed?'<button class="primary show-answer" data-action="reveal">Show answer</button><p class="keyboard-hint"><kbd>Space</kbd> to reveal · Click an image to enlarge</p>':`<div class="rating-row">${['again','hard','good','easy'].map((r,i)=>`<button data-action="rate" data-rating="${r}" aria-label="${r}, ${intervals[r]}"><strong>${r[0].toUpperCase()+r.slice(1)}</strong><span>${intervals[r]} <span class="sr-only">shortcut ${i+1}</span></span></button>`).join('')}</div><p class="keyboard-hint"><kbd>1</kbd> Again <kbd>2</kbd> Hard <kbd>3</kbd> Good <kbd>4</kbd> Easy · <kbd>Z</kbd> Undo</p>`}</div>`;
  prepareCardMedia();
}
function tagsHtml(note) {
  return note.tags?.length?`<details class="tags"><summary>Original tags</summary><p>${note.tags.map(escape).join('<br>')}</p></details>`:'';
}
async function grade(rating) {
  if(busy || !session?.card || !session.revealed)return;
  if($('.card-body .io-wrapper:not(.is-ready)')){toast('Wait for the image and mask to load before rating.');return;}
  busy=true;const activeSession=session,card=session.card,expected=session.expected,now=Date.now(),day=localDay(now);
  const success=await save(p=>{
    if(JSON.stringify(p.cards[card.id] || null)!==expected || !available(card,p,now)) throw new Error('This card changed in another tab. Return to Today to refresh.');
    const previous=p.cards[card.id] || null, oldDay=p.daily[day] || null, oldBury=p.buried[card.noteId] || null;
    if(!previous && (oldDay?.newCards || 0)>=p.settings.newPerDay)throw new Error('Your daily new-card limit has been reached. Return to Today to refresh.');
    const next=schedule(previous,rating,now);
    p.cards[card.id]=next;
    p.daily[day]={reviews:(oldDay?.reviews || 0)+1,newCards:(oldDay?.newCards || 0)+(previous?0:1)};
    if(p.settings.burySiblings !== false)p.buried[card.noteId]={day,cardId:card.id};
    else delete p.buried[card.noteId];
    p.undo={cardId:card.id,noteId:card.noteId,previous,oldDay,oldBury,day,after:JSON.stringify(next)};
    for(const [nid,bury] of Object.entries(p.buried)) if(bury.day!==day)delete p.buried[nid];
  });
  if(success){if(session===activeSession){session.answered++;nextCard();renderStudy();window.scrollTo(0,0);}else render();}
  busy=false;
}
async function undo() {
  if(busy || !profile.undo)return;
  busy=true;let restored;
  const success=await save(p=>{
    const u=p.undo;if(!u)throw new Error('There is no rating to undo.');
    if(JSON.stringify(p.cards[u.cardId])!==u.after)throw new Error('This card has changed since its last rating.');
    restored=cardsById[u.cardId];
    if(u.previous)p.cards[u.cardId]=u.previous;else delete p.cards[u.cardId];
    if(u.oldDay)p.daily[u.day]=u.oldDay;else delete p.daily[u.day];
    if(p.settings.burySiblings !== false && u.oldBury)p.buried[u.noteId]=u.oldBury;else delete p.buried[u.noteId];
    p.undo=null;
  });
  if(success){
    if(view==='study'){
      if(session.topic!=='all' && restored.deckId!==session.topic)session.topic='all';
      session.card=restored;session.revealed=false;session.expected=JSON.stringify(profile.cards[restored.id]||null);session.answered=Math.max(0,session.answered-1);
    }
    render();toast('Last rating undone.');
  }
  busy=false;
}
function topicOptions(current) {return `<option value="all">All topics</option>${deck.decks.map(d=>`<option value="${d.id}" ${current===d.id?'selected':''}>${escape(deckName(d.id))}</option>`).join('')}`;}
function browseMatches(card) {
  if(browse.topic!=='all' && card.deckId!==browse.topic)return false;
  const status=stateLabel(card);
  if(browse.status==='new' && status!=='New')return false;
  if(browse.status==='due' && !['Due','Learning'].includes(status))return false;
  if(browse.status==='suspended' && status!=='Suspended')return false;
  if(browse.status==='issues' && !card.issue)return false;
  const words=browse.query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return words.every(word=>searchIndex[card.id].includes(word));
}
function renderBrowse() {
  main.innerHTML=`<div class="page-heading"><div><div class="eyebrow">THE COMPLETE DECK</div><h1>Follow your curiosity.</h1><p>Find a concept, revisit an image, or explore a topic.</p></div><span class="date-label">${number(deck.cards.length)} cards</span></div><div class="browse-controls"><label class="sr-only" for="search">Search cards, tags, and card codes</label><input id="search" type="search" placeholder="Search cards, tags, or card codes…" value="${escape(browse.query)}" autocomplete="off"><label class="sr-only" for="browse-topic">Topic</label><select id="browse-topic">${topicOptions(browse.topic)}</select><label class="sr-only" for="browse-status">Card status</label><select id="browse-status">${[['all','All cards'],['new','New'],['due','Due / learning'],['suspended','Suspended'],['issues','Source issues']].map(([value,label])=>`<option value="${value}" ${browse.status===value?'selected':''}>${label}</option>`).join('')}</select></div><div id="browse-content"></div>`;
  renderBrowseContent();
}
function renderBrowseContent() {
  const matches=deck.cards.filter(browseMatches), pageSize=40;
  browse.page=Math.max(0,Math.min(browse.page,Math.ceil(matches.length/pageSize)-1));
  const visible=matches.slice(browse.page*pageSize,(browse.page+1)*pageSize);
  if(!visible.some(c=>c.id===browse.selected)){browse.selected=visible[0]?.id; browse.revealed=false;}
  const selected=cardsById[browse.selected];
  $('#browse-content').innerHTML=`<div class="browse-layout"><div class="panel results-panel"><div class="results-meta">${number(matches.length)} ${matches.length===1?'card':'cards'} found</div><div class="results-list">${visible.length?visible.map(c=>`<button class="result-row ${c.id===browse.selected?'active':''}" data-action="select-card" data-id="${c.id}" ${c.id===browse.selected?'aria-current="true"':''}><small>${escape(deckName(c.deckId))} · ${stateLabel(c)}${deck.models[deck.notes[c.noteId].modelId].type==='cloze'?` · C${c.ordinal+1}`:''}</small><span class="result-snippet">${escape(searchSnippet(c))}</span></button>`).join(''):'<div class="empty-state"><p>No matching cards. Try a different search or topic.</p></div>'}</div><div class="pagination"><button data-action="page" data-direction="-1" ${browse.page===0?'disabled':''}>Previous</button><span>${matches.length?browse.page+1:0} / ${Math.ceil(matches.length/pageSize)}</span><button data-action="page" data-direction="1" ${(browse.page+1)*pageSize>=matches.length?'disabled':''}>Next</button></div></div><div class="browse-preview"><p class="preview-label">Preview · Browsing does not change your review schedule.</p>${selected?`<article class="panel"><div class="card-meta"><span>${escape(deckName(selected.deckId))}</span>${badge(selected)}</div>${selected.issue?`<div class="notice" style="margin:16px">${escape(selected.issue)} This source card is kept here but excluded from daily reviews.</div>`:''}<div class="card-body">${cardHtml(selected,browse.revealed)}</div><div class="preview-controls"><button class="primary" data-action="preview-reveal">${browse.revealed?'Show question':'Show answer'}</button><button data-action="suspend" data-id="${selected.id}" ${selected.issue?'disabled':''}>${profile.suspended[selected.id]?'Resume card':'Suspend card'}</button></div>${browse.revealed?tagsHtml(deck.notes[selected.noteId]):''}</article>`:'<div class="panel empty-state"><h2>Room to explore.</h2><p>Choose a card to preview it here.</p></div>'}</div></div>`;
  prepareCardMedia();
}
function searchSnippet(card) {
  const note=deck.notes[card.noteId], model=deck.models[note.modelId];
  if(model.type==='occlusion')return plainText(note.fields[model.fields.indexOf('Header')]) || 'Image occlusion · identify the covered structure';
  return plainText(note.fields[0]).replace(/\{\{c\d+::/gi,'').replace(/\}\}/g,'').slice(0,230);
}
function renderSettings() {
  const issues=deck.cards.filter(c=>c.issue).length;
  main.innerHTML=`<div class="page-heading"><div><div class="eyebrow">MAKE IT YOURS</div><h1>A sustainable study habit.</h1><p>Set your pace and keep your progress safe.</p></div></div><div class="settings-layout"><section class="panel settings-panel"><h2>Your daily pace</h2><p>Due reviews come first. New cards are introduced after reviews, up to your daily limit.</p><form id="settings-form"><div class="setting-row"><label for="new-limit"><strong>New cards per day</strong><p>Shared across all topics. Set to 0 to focus on reviews.</p></label><input id="new-limit" type="number" min="0" max="500" step="1" required value="${profile.settings.newPerDay}"></div><div class="setting-row"><label for="sibling-burial"><strong>Related cards get a little space</strong><p>After a rating, other clozes from the same note wait until tomorrow. Learning steps for the current card remain available.</p></label><input id="sibling-burial" class="switch" type="checkbox" role="switch" ${profile.settings.burySiblings !== false?'checked':''}></div><div class="button-row"><button type="submit" class="primary">Save settings</button></div></form></section><section class="panel settings-panel"><h2>Your progress belongs to you</h2><p>Reviews are saved automatically in this browser on this device. Clearing site data removes that history. Export a backup to keep a copy or transfer to another browser.</p><div class="button-row"><button class="primary" data-action="export">Export progress</button><button data-action="import">Import a backup</button><input id="backup-file" type="file" accept="application/json,.json" hidden></div><p class="small muted" style="margin:18px 0 0">${profile.lastBackup?`Last exported ${escape(dateTime(profile.lastBackup))}.`:'No backup exported yet.'}</p></section><section class="panel settings-panel"><h2>About this deck</h2><div class="deck-facts"><div><strong>${number(deck.cards.length)}</strong><span>Original cards</span></div><div><strong>${deck.decks.length}</strong><span>Neurology topics</span></div><div><strong>${deck.mediaCount}</strong><span>Original media files</span></div></div><p>Adapted from <em>NeurAnki – Made for Neurology Resident Education</em>. Original wording, images, explanations, and references are preserved. Source tags and card codes are available in card previews.</p><p>This site uses an Anki-like SM-2 review schedule with Again, Hard, Good, and Easy. Progress is separate from Anki and does not sync with AnkiWeb. Daily limits reset at local midnight.</p>${issues?`<div class="notice"><strong>${issues} source cards need attention.</strong> Their saved cloze numbers or markers do not produce a valid question. All original content is retained; ${number(studyCards.length)} cards are available for daily study. <button class="text-button" data-action="show-issues">View source issues</button></div>`:''}<p class="small">For education. This is an independent deck viewer and is not affiliated with ABPN or Anki.</p></section><section class="panel settings-panel"><h2>Start over</h2><p>Reset all review history, suspended cards, and daily settings in this browser. Your deck stays available.</p><button class="danger" data-action="reset">Reset study progress</button></section></div>`;
}
async function confirmAction(title,message,label) {
  const dialog=$('#confirm-dialog');$('#confirm-title').textContent=title;$('#confirm-text').textContent=message;$('#confirm-submit').textContent=label;
  dialog.returnValue='cancel';dialog.showModal();
  return new Promise(resolve=>dialog.addEventListener('close',()=>resolve(dialog.returnValue==='confirm'),{once:true}));
}
async function suspend(id) {
  if(busy)return;busy=true;let resumed;
  const success=await save(p=>{
    resumed=!!p.suspended[id];if(resumed)delete p.suspended[id];else p.suspended[id]=true;p.undo=null;
  });
  if(success){if(view==='study')nextCard();render();toast(resumed?'Card returned to your study queue.':'Card suspended. Resume it from Browse cards.');}busy=false;
}
async function exportBackup() {
  if(busy)return;busy=true;
  try {
    profile=await readProfile();
    const now=Date.now();const backup={...profile,lastBackup:now,undo:null};
    const blob=new Blob([JSON.stringify(backup,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob), link=document.createElement('a');link.href=url;link.download=`neuranki-progress-${localDay(now)}.json`;link.hidden=true;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
    await save(p=>{p.lastBackup=now;});renderSettings();toast('Progress backup exported.');
  }catch(error){toast(`Backup failed: ${error.message}`);}finally{busy=false;}
}
async function importBackup(file) {
  if(!file || busy)return;
  try {
    if(file.size>15*1024*1024)throw new Error('This file is too large to be a progress backup.');
    const imported=validateBackup(JSON.parse(await file.text()),new Set(deck.cards.map(c=>c.id)),new Set(Object.keys(deck.notes)),new Map(deck.cards.map(c=>[c.id,c.noteId])));
    if(!await confirmAction('Restore this progress?',`This backup contains ${number(Object.keys(imported.cards).length)} started cards. It will replace the current progress in this browser. Export your current progress first if you want to keep it.`,'Restore backup'))return;
    busy=true;if(await save(()=>imported)){renderSettings();toast('Progress restored.');}
  }catch(error){toast(`Could not import: ${error.message}`);}finally{busy=false;const input=$('#backup-file');if(input)input.value='';}
}
function zoomImage(img) {
  if(img.closest('.io-wrapper:not(.is-ready)')){toast('Wait for the image and mask to load.');return;}
  const source=img.closest('.io-wrapper') || img;const clone=source.cloneNode(true);
  clone.querySelectorAll?.('[id]').forEach(el=>el.removeAttribute('id'));clone.removeAttribute('id');
  [clone,...clone.querySelectorAll('img')].forEach(el=>{el.removeAttribute('tabindex');el.removeAttribute('role');el.removeAttribute('aria-label');});
  $('#image-content').replaceChildren(clone);$('#image-dialog').showModal();
}
document.addEventListener('click',async event=>{
  const localLink=event.target.closest('a[href^="#"]');
  if(localLink){
    if(localLink.hash==='#main'){event.preventDefault();main.focus();return;}
    if(localLink.hash===location.hash && ['#today','#browse','#settings'].includes(localLink.hash)){event.preventDefault();navigate();window.scrollTo(0,0);return;}
  }
  const image=event.target.closest('.card-body img');if(image){event.preventDefault();zoomImage(image);return;}
  const button=event.target.closest('[data-action]');if(!button || button.disabled)return;
  const action=button.dataset.action;
  if(action==='close-image'){$('#image-dialog').close();return;}
  if(busy)return;
  if(action==='start')startSession(button.dataset.topic);
  if(action==='exit-study'){view='today';session=null;render();}
  if(action==='reveal'){session.revealed=true;renderStudy();}
  if(action==='rate')await grade(button.dataset.rating);
  if(action==='undo')await undo();
  if(action==='suspend')await suspend(button.dataset.id);
  if(action==='check-due'){profile=await readProfile();nextCard();renderStudy();}
  if(action==='browse-topic'){browse.topic=button.dataset.topic;browse.query='';browse.page=0;location.hash='browse';}
  if(action==='select-card'){browse.selected=button.dataset.id;browse.revealed=false;renderBrowseContent();}
  if(action==='preview-reveal'){browse.revealed=!browse.revealed;renderBrowseContent();}
  if(action==='page'){browse.page+=Number(button.dataset.direction);browse.selected=null;renderBrowseContent();}
  if(action==='toggle-mask'){const mask=$('.card-body .io-overlay');if(mask)mask.hidden=!mask.hidden;}
  if(action==='export')await exportBackup();
  if(action==='import')$('#backup-file').click();
  if(action==='show-issues'){browse.status='issues';browse.topic='all';browse.query='';browse.page=0;location.hash='browse';}
  if(action==='reset' && await confirmAction('Reset all study progress?','This permanently removes the reviews saved in this browser. Export a progress backup first if you may want to restore them.','Reset progress')){busy=true;if(await save(()=>freshProfile())){renderSettings();toast('Study progress reset.');}busy=false;}
});
document.addEventListener('input',event=>{
  if(event.target.id==='search'){browse.query=event.target.value;browse.page=0;renderBrowseContent();}
});
document.addEventListener('change',event=>{
  if(event.target.id==='browse-topic'){browse.topic=event.target.value;browse.page=0;renderBrowseContent();}
  if(event.target.id==='browse-status'){browse.status=event.target.value;browse.page=0;renderBrowseContent();}
  if(event.target.id==='backup-file')importBackup(event.target.files[0]);
});
document.addEventListener('submit',async event=>{
  if(event.target.id!=='settings-form')return;event.preventDefault();if(busy)return;
  const limit=Number($('#new-limit').value);if(!Number.isInteger(limit) || limit<0 || limit>500)return;
  const burySiblings=$('#sibling-burial').checked;
  busy=true;if(await save(p=>{p.settings.newPerDay=limit;p.settings.burySiblings=burySiblings;if(!burySiblings)p.buried={};})){renderSettings();toast('Study settings saved.');}busy=false;
});
document.addEventListener('keydown',event=>{
  if(event.ctrlKey || event.metaKey || event.altKey || event.repeat || event.target.closest('input,select,textarea,button,a,summary,[contenteditable]') || document.querySelector('dialog[open]'))return;
  if(view!=='study' || busy)return;
  if(event.code==='Space' && session?.card && !session.revealed){event.preventDefault();session.revealed=true;renderStudy();}
  if(['1','2','3','4'].includes(event.key) && session?.revealed){event.preventDefault();grade(['again','hard','good','easy'][Number(event.key)-1]);}
  if(event.key.toLowerCase()==='z'){event.preventDefault();undo();}
});
window.addEventListener('hashchange',()=>{if(deck){navigate();window.scrollTo(0,0);}});
if(channel)channel.onmessage=async()=>{
  if(!profile || busy)return;
  profile=await readProfile();
  if(view!=='study')render();else if(!session?.card){nextCard();renderStudy();}
};
document.addEventListener('visibilitychange',async()=>{
  if(document.visibilityState==='visible' && profile && !busy){profile=await readProfile();if(view!=='study')render();}
});
setInterval(()=>{if(view==='study' && session && !session.card && !busy){const next=selectNext(topicCards(session.topic),profile);if(next){nextCard();renderStudy();}}},15000);

async function init() {
  try {
    const data=deckData,saved=await openStorage();
    deck=data;profile=saved;cardsById=Object.fromEntries(deck.cards.map(c=>[c.id,c]));decksById=Object.fromEntries(deck.decks.map(d=>[d.id,d]));
    studyCards=interleaveDecks(deck.cards.filter(c=>!c.issue));
    const noteSearch=Object.fromEntries(Object.values(deck.notes).map(n=>[n.id,plainText(n.fields.join(' '))+' '+n.tags.join(' ')]));
    searchIndex=Object.fromEntries(deck.cards.map(c=>[c.id,`${noteSearch[c.noteId]} ${deckName(c.deckId)} ${c.id}`.toLocaleLowerCase()]));
    $('#save-status').textContent='Progress saved locally';navigate();
  }catch(error){
    $('#save-status').textContent='Unable to open study space';
    main.innerHTML=`<section class="panel empty-state"><h1>We couldn’t open your study space.</h1><p>${escape(error.message)} Please allow this browser to save site data, then try again.</p><button class="primary" id="retry">Try again</button></section>`;$('#retry').onclick=()=>location.reload();
  }
}
init();
