// Run: node --test tests/quizhub/
// Verifies (1) legacy-format quizzes render identically before/after the explanation patch,
// (2) the new optional features (explanation, en fallback, `code`), (3) devops-* data integrity.
const test = require("node:test");
const assert = require("node:assert");
const path = require("path");
const fs = require("fs");
const { boot, loadSubjects, byClass, click, tick, textOf, find } = require("./harness");

const ROOT = path.join(__dirname, "..", "..");
const NEW = path.join(ROOT, "docs", "js", "quizhub.js");
const LEGACY = path.join(__dirname, "fixtures", "quizhub.legacy.js");
const DATA = path.join(ROOT, "docs", "Quiz", "data");
const EXISTING = ["gis", "pyqgis", "cpp"].map((n) => path.join(DATA, n + ".js"));
const DEVOPS_IDS = ["linux", "linuxweek1", "network", "bash", "git", "nginx", "docker", "cicd", "k8s", "backup", "cheatsheet", "vim"];
const DEVOPS = DEVOPS_IDS.map((n) => path.join(DATA, "devops-" + n + ".js"));

// Drive a whole run: home -> subject -> quiz -> answer every question -> result. Returns every DOM snapshot.
async function drive(enginePath, subjects, { lang } = {}) {
  const snaps = [];
  const h = await boot(enginePath, subjects, lang ? { storage: { "gisosdoc:quizhub:v1": JSON.stringify({ lang }) } } : {});
  const snap = (label) => snaps.push(label + "\n" + h.serialize());
  snap("home");
  click(byClass(h.root, "qh-card")[0]); await tick(); snap("subject");
  click(byClass(h.root, "qh-card")[0]); await tick(); snap("quiz-start");
  for (let i = 0; i < 200; i++) {
    const opts = byClass(h.root, "qh-opt");
    if (!opts.length) break;
    click(opts[i % opts.length]); await tick(); snap("answered-" + i);
    const next = find(h.root, (e) => e.tag === "button" && e.className === "qh-btn" && !e.disabled)[0];
    if (!next) break;
    click(next); await tick();
  }
  snap("result");
  return { snaps, h };
}

test("legacy data: identical DOM old vs new engine (ka and en), full session", async () => {
  for (const file of EXISTING) {
    for (const lang of ["ka", "en"]) {
      const subjects = loadSubjects([file]);
      const a = await drive(LEGACY, subjects, { lang });
      const b = await drive(NEW, loadSubjects([file]), { lang });
      assert.ok(a.snaps.length > 5, "session should have run: " + path.basename(file));
      assert.strictEqual(b.snaps.length, a.snaps.length);
      a.snaps.forEach((s, i) => assert.strictEqual(b.snaps[i], s, `${path.basename(file)}/${lang} snapshot ${i}`));
    }
  }
});

test("legacy data: saved progress state has the same shape", async () => {
  const a = await drive(LEGACY, loadSubjects([EXISTING[0]]));
  const b = await drive(NEW, loadSubjects([EXISTING[0]]));
  assert.strictEqual(b.h.store.get("gisosdoc:quizhub:v1"), a.h.store.get("gisosdoc:quizhub:v1"));
});

const SYNTH = {
  id: "devops-synth", icon: "T", title: { ka: "სატესტო" }, desc: { ka: "აღწერა" },
  quizzes: [{ id: "v1", title: { ka: "ტესტი" }, questions: [
    ["რას აკეთებს `|` (pipe)?", null, ["ერთი|One", "ორი", "სამი"], 0, "ახსნა: `ss -tlnp | grep 443`."],
    ["უახსნო კითხვა", "Question without explanation", ["ა", "ბ"], 1],
    ["ორენოვანი", "Bilingual", ["ა|A", "ბ|B"], 0, { ka: "ქართული ახსნა", en: "English explanation" }],
  ] }],
};

async function openSynth(extraStorage) {
  const h = await boot(NEW, [SYNTH], { storage: Object.assign({ "gisosdoc:quizhub:v1": JSON.stringify({ shuffle: false }) }, extraStorage) });
  click(byClass(h.root, "qh-card")[0]); await tick();
  click(byClass(h.root, "qh-card")[0]); await tick();
  return h;
}

test("new format: explanation appears after answering, with <code> and pipes intact", async () => {
  const h = await openSynth();
  assert.strictEqual(byClass(h.root, "qh-exp").length, 0, "no explanation before answering");
  click(byClass(h.root, "qh-opt")[1]); await tick();
  const exp = byClass(h.root, "qh-exp");
  assert.strictEqual(exp.length, 1);
  const code = find(exp[0], (e) => e.tag === "code");
  assert.strictEqual(code.length, 1);
  assert.strictEqual(textOf(code[0]), "ss -tlnp | grep 443");
  const q = byClass(h.root, "qh-q")[0];
  assert.strictEqual(find(q, (e) => e.tag === "code").length, 1);
  assert.strictEqual(textOf(find(q, (e) => e.tag === "code")[0]), "|");
});

test("new format: question without explanation shows no explanation block", async () => {
  const h = await openSynth();
  click(byClass(h.root, "qh-opt")[0]); await tick();
  click(find(h.root, (e) => e.tag === "button" && e.className === "qh-btn" && !e.disabled)[0]); await tick();
  click(byClass(h.root, "qh-opt")[1]); await tick();
  assert.strictEqual(byClass(h.root, "qh-exp").length, 0);
});

test("new format: option strings still split on ka|en; English falls back to Georgian when missing", async () => {
  const h = await openSynth({ "gisosdoc:quizhub:v1": JSON.stringify({ shuffle: false, lang: "en" }) });
  const q = textOf(byClass(h.root, "qh-q")[0]);
  assert.ok(q.includes("რას აკეთებს"), "en null -> Georgian question, not blank: " + q);
  const optTexts = byClass(h.root, "qh-opt").map((o) => textOf(o));
  assert.ok(optTexts[0].endsWith("One"), "ka|en option resolved to English: " + optTexts[0]);
  assert.ok(optTexts[1].endsWith("ორი"), "single-string option shown as is");
  click(byClass(h.root, "qh-opt")[0]); await tick();
  assert.ok(textOf(byClass(h.root, "qh-exp")[0]).includes("ss -tlnp | grep 443"));
});

test("new format: {ka,en} explanation follows the language", async () => {
  for (const [lang, expected] of [["ka", "ქართული ახსნა"], ["en", "English explanation"]]) {
    const h = await openSynth({ "gisosdoc:quizhub:v1": JSON.stringify({ shuffle: false, lang }) });
    for (let i = 0; i < 2; i++) { // skip to the third (bilingual) question
      click(byClass(h.root, "qh-opt")[0]); await tick();
      click(find(h.root, (e) => e.tag === "button" && e.className === "qh-btn" && !e.disabled)[0]); await tick();
    }
    click(byClass(h.root, "qh-opt")[0]); await tick();
    assert.ok(textOf(byClass(h.root, "qh-exp")[0]).includes(expected), lang);
  }
});

test("new format: explanations are listed on the result screen", async () => {
  const h = await openSynth();
  for (let i = 0; i < 3; i++) {
    click(byClass(h.root, "qh-opt")[0]); await tick();
    click(find(h.root, (e) => e.tag === "button" && e.className === "qh-btn" && !e.disabled)[0]); await tick();
  }
  assert.ok(byClass(h.root, "qh-review").length === 1);
  assert.strictEqual(byClass(h.root, "qh-exp").length, 2, "2 of 3 questions have explanations");
});

test("devops data: 12 subjects, 180 questions, 86 explanations, bilingual, structural invariants", () => {
  const subjects = loadSubjects(DEVOPS);
  assert.strictEqual(subjects.length, 12);
  let q = 0, e = 0;
  const existingIds = loadSubjects(EXISTING).map((s) => s.id);
  for (const s of subjects) {
    assert.ok(/^devops-[a-z0-9]+$/.test(s.id), s.id);
    assert.ok(!existingIds.includes(s.id));
    assert.ok(s.title.ka && s.desc.ka && s.icon);
    assert.ok(s.title.en && s.desc.en, "English title/desc: " + s.id);
    for (const quiz of s.quizzes) for (const x of quiz.questions) {
      q++; assert.strictEqual(typeof x[0], "string");
      assert.ok(typeof x[1] === "string" && x[1].length > 0, "English question: " + x[0]);
      assert.ok(Array.isArray(x[2]) && x[2].length >= 2);
      assert.ok(Number.isInteger(x[3]) && x[3] >= 0 && x[3] < x[2].length);
      x[2].forEach((o) => assert.ok(String(o).split("|").length <= 2, "option has at most one ka|en separator: " + o));
      if (x[4] !== undefined) { e++; assert.ok(x[4].ka && x[4].en, "bilingual explanation: " + x[0]); }
    }
  }
  assert.strictEqual(new Set(subjects.map((s) => s.id)).size, 12);
  assert.strictEqual(q, 180);
  assert.strictEqual(e, 86);
});

test("devops data: engine renders every devops subject without error", async () => {
  const subjects = loadSubjects(DEVOPS);
  const h = await boot(NEW, subjects);
  assert.strictEqual(byClass(h.root, "qh-card").length, 12);
  for (let i = 0; i < 12; i++) {
    const hh = await boot(NEW, subjects);
    click(byClass(hh.root, "qh-card")[i]); await tick();
    click(byClass(hh.root, "qh-card")[0]); await tick();
    assert.ok(byClass(hh.root, "qh-opt").length >= 2, subjects[i].id);
  }
});

// ---- Quiz hub / DevOps page wiring ----
function subjectsAttr(mdFile) {
  const m = fs.readFileSync(mdFile, "utf8").match(/data-subjects="([^"]+)"/);
  assert.ok(m, "data-subjects not found in " + mdFile);
  return m[1].split(",").map((x) => x.trim()).filter(Boolean);
}

test("Quiz hub: original subjects unchanged and first; every referenced data file exists", () => {
  const hub = subjectsAttr(path.join(ROOT, "docs", "Quiz", "index.md"));
  assert.deepStrictEqual(hub.slice(0, 3), ["gis", "pyqgis", "cpp"]);
  assert.deepStrictEqual(hub.slice(3), DEVOPS_IDS.map((n) => "devops-" + n));
  assert.strictEqual(new Set(hub).size, hub.length, "no duplicate subject ids");
  for (const id of hub) assert.ok(fs.existsSync(path.join(DATA, id + ".js")), "missing data file for " + id);
  // the id declared inside each file matches its file name
  const files = hub.map((id) => path.join(DATA, id + ".js"));
  loadSubjects(files).forEach((s, i) => assert.strictEqual(s.id, hub[i]));
});

test("Quiz hub: the DevOps page references the same devops subjects", () => {
  const page = subjectsAttr(path.join(ROOT, "docs", "Dev_ops", "Fundamentals", "quiz.md"));
  assert.deepStrictEqual(page, DEVOPS_IDS.map((n) => "devops-" + n));
});

test("Quiz hub: all 15 subjects render as cards; existing ones keep working in the same hub", async () => {
  const all = loadSubjects([...EXISTING, ...DEVOPS]);
  const h = await boot(NEW, all);
  assert.strictEqual(byClass(h.root, "qh-card").length, 15);
  // first existing subject (gis) still plays through with the new engine inside the combined hub
  const a = await drive(NEW, loadSubjects([...EXISTING, ...DEVOPS]));
  assert.ok(a.snaps.length > 5);
});

test("Quiz hub: a pre-existing saved session/progress (old localStorage state) still loads", async () => {
  const legacy = await drive(LEGACY, loadSubjects([EXISTING[0]]));
  const saved = legacy.h.store.get("gisosdoc:quizhub:v1");
  const h = await boot(NEW, loadSubjects([...EXISTING, ...DEVOPS]), { storage: { "gisosdoc:quizhub:v1": saved } });
  const progressBadges = byClass(h.root, "qh-meta").map((m) => textOf(m));
  assert.ok(progressBadges.some((t) => /1\/\d+/.test(t)), "old progress for gis is shown: " + progressBadges[0]);
});

test("Quiz hub: English pages (/en/) list the same subjects and point data-base back to the root data folder", () => {
  const pairs = [
    [["Quiz", "index.md"], ["Quiz", "index.en.md"], "../../Quiz/data/"],
    [["Dev_ops", "Fundamentals", "quiz.md"], ["Dev_ops", "Fundamentals", "quiz.en.md"], "../../../../Quiz/data/"],
  ];
  for (const [ka, en, base] of pairs) {
    const enFile = path.join(ROOT, "docs", ...en);
    assert.deepStrictEqual(subjectsAttr(enFile), subjectsAttr(path.join(ROOT, "docs", ...ka)), en.join("/"));
    assert.ok(fs.readFileSync(enFile, "utf8").includes('data-base="' + base + '"'), "data-base in " + en.join("/"));
  }
});
