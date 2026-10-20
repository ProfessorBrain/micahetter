const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = readFileSync(join(__dirname, "..", "script.js"), "utf8")
  .replace(/\r?\nloadLibrary\(\);\s*$/, "\n");
const DAY = 86400000;

function resource(id, format = "article", extra = {}) {
  return {
    id, format, title: `Lesson ${id}`, creator: "Example creator",
    description: "An individual learning activity.",
    level: "Core Neurology Practice", population: "both", review: null,
    access: "free", duration: "5 min", year: 2026,
    url: `https://example.org/lesson-${id}`, previewUrl: "",
    specialties: ["General Neurology"], languages: ["English"], tags: ["exam"],
    ...extra
  };
}

const mixedResources = [
  resource(1), resource(2, "toolkit"), resource(3, "module"),
  resource(4, "infographic"), resource(5, "video"), resource(6, "infographic")
];

function sheetTable(resources) {
  const fields = ["title", "creator", "description", "level", "population", "format", "reviewed", "access", "duration", "year", "language", "url", "specialties", "tags"];
  return {
    cols: fields.map(label => ({ label })),
    rows: resources.map(item => ({ c: fields.map(field => ({ v:
      field === "reviewed" ? "" : field === "language" ? item.languages.join(" | ")
        : Array.isArray(item[field]) ? item[field].join(" | ") : item[field]
    })) }))
  };
}

function app(resources = mixedResources, timestamp = Date.UTC(2026, 9, 20, 12)) {
  let now = timestamp;
  let nextTimerId = 1;
  const timers = new Map();
  const nodes = new Map();
  const documentEvents = new Map();
  const windowEvents = new Map();
  const register = events => (name, handler) => {
    if (!events.has(name)) events.set(name, []);
    events.get(name).push(handler);
  };
  const node = selector => {
    if (!nodes.has(selector)) nodes.set(selector, {
      innerHTML: "", textContent: "", value: "", hidden: false,
      classList: { toggle() {}, add() {}, remove() {}, contains() { return false; } },
      addEventListener() {}, setAttribute() {}, querySelectorAll() { return []; }
    });
    return nodes.get(selector);
  };
  class Clock extends Date {
    constructor(...args) { super(...(args.length ? args : [now])); }
    static now() { return now; }
  }
  const document = {
    querySelector: node, querySelectorAll: () => [], visibilityState: "visible",
    addEventListener: register(documentEvents)
  };
  const window = {
    addEventListener: register(windowEvents),
    setTimeout(handler, delay) {
      const id = nextTimerId++;
      timers.set(id, { handler, delay });
      return id;
    },
    clearTimeout(id) { timers.delete(id); }
  };
  const context = vm.createContext({ document, window, Date: Clock, URL, URLSearchParams,
    inputResources: resources, refreshTable: sheetTable(resources), requestCount: 0 });
  const run = code => vm.runInContext(code, context);
  run(source);
  run(`RESOURCES = inputResources;
    googleSheetTableRequest = async () => { requestCount++; return refreshTable; };`);
  return {
    run, node, timers, document, context,
    json: code => JSON.parse(run(`JSON.stringify(${code})`)),
    advance: milliseconds => { now += milliseconds; },
    emit: async (target, name) => {
      const events = target === "document" ? documentEvents : windowEvents;
      await Promise.all((events.get(name) || []).map(handler => handler()));
    },
    fireTimer: async () => {
      const [id, timer] = timers.entries().next().value;
      timers.delete(id);
      await timer.handler();
    }
  };
}

test("both cards advance daily, cover their pools before repeating, and avoid overlap", () => {
  const site = app();
  const selections = site.json("Array.from({ length: 30 }, (_, day) => selectDailyFeatures(20000 + day))");
  for (let day = 0; day < selections.length; day++) {
    const { teaching, visual } = selections[day];
    assert.notEqual(teaching.url, visual.url);
    assert.ok(["infographic", "video"].includes(visual.format));
    if (day) {
      assert.notEqual(teaching.url, selections[day - 1].teaching.url);
      assert.notEqual(visual.url, selections[day - 1].visual.url);
    }
  }
  for (const slot of ["teaching", "visual"]) {
    assert.equal(new Set(selections.slice(0, 3).map(day => day[slot].url)).size, 3);
    assert.equal(selections[0][slot].url, selections[3][slot].url);
  }
});

test("same-day selection is stable across reloads, filters, sorting, and sheet row reordering", () => {
  const site = app();
  const original = site.json("selectDailyFeatures(20500)");
  site.run("RESOURCES.reverse(); state.query = 'nothing'; state.formats.add('podcast'); state.sort = 'title';");
  assert.deepEqual(site.json("selectDailyFeatures(20500)"), original);
});

test("duplicate URLs and collection rows do not occupy extra rotation slots", () => {
  const site = app([...mixedResources,
    resource(7, "article", { url: mixedResources[0].url + "/#intro" }),
    resource(8, "video", { duration: "Collection" }),
    resource(9, "infographic", { title: "Infographic Library" })
  ]);
  assert.equal(site.run("dailyResourcePools().teaching.length"), 3);
  assert.equal(site.run("dailyResourcePools().visual.length"), 3);
});

test("an all-visual library rotates both cards with different items", () => {
  const site = app([resource(1, "video"), resource(2, "infographic"), resource(3, "video")]);
  const days = site.json("Array.from({ length: 9 }, (_, day) => selectDailyFeatures(day))");
  days.forEach(({ teaching, visual }, day) => {
    assert.notEqual(teaching.url, visual.url);
    if (day) {
      assert.notEqual(teaching.url, days[day - 1].teaching.url);
      assert.notEqual(visual.url, days[day - 1].visual.url);
    }
  });
});

test("a missing visual pool leaves the teaching aid visible", () => {
  const site = app([resource(1)]);
  site.run("renderDailyFeatures()");
  const html = site.node("#daily-features").innerHTML;
  assert.ok(html.includes("Lesson 1"));
  assert.ok(html.includes("No individual infographic or video is currently available."));
});

test("a single visual is handled honestly and never replaces an available teaching aid", () => {
  const site = app([resource(1), resource(2, "video")]);
  for (const day of [0, 1, 2]) {
    const selected = site.json(`selectDailyFeatures(${day})`);
    assert.equal(selected.teaching.id, 1);
    assert.equal(selected.visual.id, 2);
  }
  assert.deepEqual(app([]).json("selectDailyFeatures()"), { teaching: null, visual: null });
});

test("the midnight timer reloads the live sheet and schedules just one new timer", async () => {
  const site = app(mixedResources, Date.UTC(2026, 9, 20, 23, 59, 59));
  site.run("setLibraryStatus('ready')");
  assert.equal([...site.timers.values()][0].delay, 2000);
  const previous = site.json("selectDailyFeatures()");
  site.advance(2000);
  await site.fireTimer();
  assert.equal(site.run("requestCount"), 1);
  assert.equal(site.run("dailyFeatureDay === utcDayNumber()"), true);
  assert.equal(site.timers.size, 1);
  const current = site.json("selectDailyFeatures()");
  assert.notEqual(current.teaching.url, previous.teaching.url);
  assert.notEqual(current.visual.url, previous.visual.url);
});

for (const [target, event] of [["window", "focus"], ["window", "pageshow"], ["document", "visibilitychange"]]) {
  test(`${event} refreshes after sleep and does not refetch repeatedly on the same day`, async () => {
    const site = app();
    site.run("setLibraryStatus('ready'); state.languages.add('english');");
    await site.emit(target, event);
    assert.equal(site.run("requestCount"), 0);
    site.advance(2 * DAY);
    await site.emit(target, event);
    assert.equal(site.run("requestCount"), 1);
    assert.equal(site.run("dailyFeatureDay === utcDayNumber()"), true);
    assert.equal(site.run("state.languages.has('english')"), true);
    await site.emit(target, event);
    assert.equal(site.run("requestCount"), 1);
    assert.equal(site.timers.size, 1);
  });
}

test("a new day incorporates newly added sheet rows", async () => {
  const site = app();
  site.context.refreshTable = sheetTable([...mixedResources, resource(10, "video")]);
  site.run("setLibraryStatus('ready')");
  site.advance(DAY);
  await site.emit("window", "focus");
  assert.equal(site.run("dailyResourcePools().visual.length"), 4);
});

test("failed day refresh reports the sheet error and does not substitute a local library", async () => {
  const site = app();
  site.run("setLibraryStatus('ready'); googleSheetTableRequest = async () => { throw new Error('Sheet unavailable'); };");
  site.advance(DAY);
  await site.emit("window", "focus");
  assert.equal(site.run("libraryState"), "error");
  assert.equal(site.run("RESOURCES.length"), 0);
  assert.equal(site.timers.size, 0);
  assert.ok(site.node("#daily-features").innerHTML.includes("unavailable"));
});
