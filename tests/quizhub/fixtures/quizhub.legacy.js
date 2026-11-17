/* ============================================================
   QuizHub — ორენოვანი (KA/EN) სასწავლო ქვიზი MkDocs Material-ისთვის
   გამოყენება: docs/Quiz/index.md-ში
     <div id="quizhub" data-base="data/" data-subjects="gis"></div>
   საგნის მონაცემები: docs/Quiz/data/<id>.js  (იხ. gis.js)
   თემა (მუქი/ღია) — საიტის Material palette-ს მიჰყვება.
   პროგრესი ინახება localStorage-ში; ქეშირებას არსებული service-worker აკეთებს.
   ============================================================ */
(function () {
  "use strict";
  var KEY = "gisosdoc:quizhub:v1";

  var I18N = {
    ka: {
      title: "ქვიზები", subtitle: "აირჩიე საგანი და დაიწყე სწავლა", questions: "კითხვა", best: "საუკეთესო",
      resume: "გაგრძელება", next: "შემდეგი", finish: "დასრულება", prev: "წინა", result: "შედეგი",
      correct: "სწორი", wrong: "არასწორი", yourAnswer: "შენი პასუხი", rightAnswer: "სწორი პასუხი",
      skipped: "გამოტოვებული", retry: "თავიდან", retryWrong: "მხოლოდ შეცდომების გამეორება",
      reset: "პასუხების განულება", resetAll: "მთელი პროგრესის წაშლა", confirmReset: "დარწმუნებული ხარ? პროგრესი წაიშლება.",
      shuffle: "პასუხების არევა", mix: "შერეული (ყველა ნაწილიდან)", mixDesc: "შემთხვევითი 20 კითხვა", back: "უკან",
      attempts: "ცდა", done: "შესრულებულია", cleared: "განულებულია", subjects: "საგნები",
      kbd: "კლავიშები: 1–3 არჩევა, Enter — შემდეგი, ← წინა", exam: "გამოცდის რეჟიმი (პასუხი ბოლოს ჩანს)",
      loadErr: "მონაცემები ვერ ჩაიტვირთა",
    },
    en: {
      title: "Quizzes", subtitle: "Pick a subject and start studying", questions: "questions", best: "Best",
      resume: "Resume", next: "Next", finish: "Finish", prev: "Previous", result: "Result",
      correct: "Correct", wrong: "Wrong", yourAnswer: "Your answer", rightAnswer: "Correct answer",
      skipped: "Skipped", retry: "Retry", retryWrong: "Retry mistakes only",
      reset: "Reset answers", resetAll: "Clear all progress", confirmReset: "Are you sure? Progress will be erased.",
      shuffle: "Shuffle answers", mix: "Mixed (all parts)", mixDesc: "20 random questions", back: "Back",
      attempts: "attempts", done: "Completed", cleared: "Reset", subjects: "Subjects",
      kbd: "Keys: 1–3 choose, Enter — next, ← previous", exam: "Exam mode (answers shown at the end)",
      loadErr: "Could not load data",
    },
  };

  var S, root, SUBJECTS, view;

  function loadState() {
    var d = { lang: "ka", shuffle: true, exam: false, progress: {}, session: null };
    try { return Object.assign(d, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { return d; }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function t(k) { return I18N[S.lang][k]; }
  function L(x) { return x && typeof x === "object" ? x[S.lang] || x.en : x; }
  function opt(s) { var p = String(s).split("|"); return p.length > 1 ? { ka: p[0], en: p[1] } : { ka: s, en: s }; }

  function el(tag, attrs) {
    var n = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (k === "class") n.className = v;
      else if (k.indexOf("on") === 0) n.addEventListener(k.slice(2), v);
      else if (v !== false && v != null) n.setAttribute(k, v === true ? "" : v);
    });
    Array.prototype.slice.call(arguments, 2).forEach(function add(c) {
      if (Array.isArray(c)) return c.forEach(add);
      if (c === false || c == null) return;
      n.append(c instanceof Node ? c : document.createTextNode(c));
    });
    return n;
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; }
    return a;
  }
  function toast(msg) { var n = el("div", { class: "qh-toast" }, msg); document.body.append(n); setTimeout(function () { n.remove(); }, 1600); }

  // ---------- data ----------
  function subj(id) { return SUBJECTS.filter(function (s) { return s.id === id; })[0]; }
  function flatQs(s, quizId) {
    var out = [];
    s.quizzes.forEach(function (q) {
      if (quizId !== "mix" && q.id !== quizId) return;
      q.questions.forEach(function (x, i) { out.push({ id: s.id + "." + q.id + "." + i, ka: x[0], en: x[1], opts: x[2].map(opt), a: x[3] }); });
    });
    return out;
  }
  function prog(sid, qid) { return S.progress[sid + "." + qid] || { best: null, attempts: 0, wrong: [], total: 0 }; }

  function subj0(id) { return window.QUIZ_SUBJECTS.filter(function (s) { return s.id === id; })[0]; }

  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = rej; document.head.append(s);
    });
  }

  // ---------- views ----------
  function render() {
    if (!root || !document.body.contains(root)) return;
    root.replaceChildren(topbar(), body());
  }
  function topbar() {
    return el("div", { class: "qh-bar-top" },
      el("button", { class: "qh-link", onclick: function () { view = { v: "home" }; render(); } }, "🎓 " + t("title")),
      el("span", { class: "qh-spacer" }),
      el("button", { class: "qh-chip", "aria-label": "Language", onclick: function () { S.lang = S.lang === "ka" ? "en" : "ka"; save(); render(); } }, S.lang === "ka" ? "KA → EN" : "EN → KA"));
  }
  function body() {
    if (view.v === "subject") return viewSubject(subj(view.sid));
    if (view.v === "quiz") return viewQuiz(subj(view.sid), view.qid);
    return viewHome();
  }

  function viewHome() {
    return el("div", {},
      el("p", { class: "qh-muted" }, t("subtitle")),
      el("div", { class: "qh-grid" }, SUBJECTS.map(function (s) {
        var n = s.quizzes.reduce(function (a, q) { return a + q.questions.length; }, 0);
        var done = s.quizzes.filter(function (q) { return prog(s.id, q.id).best != null; }).length;
        return el("button", { class: "qh-card", onclick: function () { view = { v: "subject", sid: s.id }; render(); } },
          el("div", { class: "qh-icon" }, s.icon), el("h3", {}, L(s.title)), el("div", { class: "qh-muted" }, L(s.desc)),
          el("div", { class: "qh-prog" }, el("i", { style: "width:" + (done / s.quizzes.length) * 100 + "%" })),
          el("div", { class: "qh-meta" }, el("span", {}, n + " " + t("questions")), el("span", {}, done + "/" + s.quizzes.length + " " + t("done"))));
      })),
      el("div", { class: "qh-actions" }, el("button", { class: "qh-btn danger", onclick: function () {
        if (confirm(t("confirmReset"))) { S.progress = {}; S.session = null; save(); toast(t("cleared")); render(); }
      } }, t("resetAll"))));
  }

  function viewSubject(s) {
    function card(qid, title, desc, total) {
      var p = prog(s.id, qid);
      var resume = S.session && S.session.sid === s.id && S.session.qid === qid && !S.session.finished;
      var tot = p.total || total;
      return el("button", { class: "qh-card", onclick: function () { openQuiz(s, qid); } },
        el("h3", {}, title), el("div", { class: "qh-muted" }, desc),
        el("div", { class: "qh-prog" }, el("i", { style: "width:" + (p.best != null ? (p.best / tot) * 100 : 0) + "%" })),
        el("div", { class: "qh-meta" },
          el("span", {}, p.best != null ? t("best") + ": " + p.best + "/" + tot : total + " " + t("questions")),
          el("span", {}, resume ? "▶ " + t("resume") : p.attempts ? p.attempts + " " + t("attempts") : "")));
    }
    return el("div", {},
      el("button", { class: "qh-link", onclick: function () { view = { v: "home" }; render(); } }, "← " + t("subjects")),
      el("h2", {}, s.icon + " " + L(s.title)), el("p", { class: "qh-muted" }, L(s.desc)),
      el("div", { class: "qh-grid" },
        s.quizzes.map(function (q) { return card(q.id, L(q.title), q.questions.length + " " + t("questions"), q.questions.length); }),
        card("mix", "🔀 " + t("mix"), t("mixDesc"), 20)));
  }

  function openQuiz(s, qid) {
    var ses = S.session;
    if (!ses || ses.sid !== s.id || ses.qid !== qid || ses.finished) startSession(s, qid);
    view = { v: "quiz", sid: s.id, qid: qid };
    render();
    root.scrollIntoView({ block: "start" });
  }

  function startSession(s, qid, onlyIds) {
    var qs = flatQs(s, qid);
    if (onlyIds) qs = qs.filter(function (q) { return onlyIds.indexOf(q.id) >= 0; });
    if (qid === "mix" && !onlyIds) qs = shuffle(qs).slice(0, 20);
    S.session = {
      sid: s.id, qid: qid, idx: 0, answers: {}, finished: false, exam: S.exam, partial: !!onlyIds,
      qs: qs.map(function (q) {
        var order = q.opts.map(function (_, i) { return i; });
        return { id: q.id, order: S.shuffle ? shuffle(order) : order, a: q.a };
      }),
    };
    save();
  }

  function allQs(s) { var m = {}; flatQs(s, "mix").forEach(function (q) { m[q.id] = q; }); return m; }

  function viewQuiz(s, qid) {
    var ses = S.session;
    if (!ses || ses.sid !== s.id || ses.qid !== qid) startSession(s, qid), ses = S.session;
    if (ses.finished) return viewResult(s);
    var q = allQs(s)[ses.qs[ses.idx].id], meta = ses.qs[ses.idx];
    var answered = ses.answers[meta.id] !== undefined, reveal = answered && !ses.exam;

    var opts = meta.order.map(function (oi, pos) {
      var picked = ses.answers[meta.id] === oi, cls = "qh-opt";
      if (reveal) { if (oi === q.a) cls += " ok"; else if (picked) cls += " bad"; } else if (picked) cls += " picked";
      return el("button", { class: cls, disabled: reveal, onclick: function () { choose(s, meta.id, oi); } },
        el("span", { class: "k" }, String(pos + 1)), el("span", {}, L(q.opts[oi])));
    });

    var exam = el("input", { type: "checkbox", id: "qh-exam", onchange: function (e) { S.exam = e.target.checked; ses.exam = S.exam; save(); render(); } });
    exam.checked = !!ses.exam;
    var shuf = el("input", { type: "checkbox", id: "qh-shuf", onchange: function (e) { S.shuffle = e.target.checked; save(); } });
    shuf.checked = !!S.shuffle;

    return el("div", {},
      el("button", { class: "qh-link", onclick: function () { view = { v: "subject", sid: s.id }; render(); } }, "← " + L(s.title)),
      el("div", { class: "qh-panel" },
        el("div", { class: "qh-qnum" }, el("span", {}, (ses.idx + 1) + " / " + ses.qs.length)),
        el("div", { class: "qh-prog" }, el("i", { style: "width:" + (ses.idx / ses.qs.length) * 100 + "%" })),
        el("div", { class: "qh-q" }, L(q)),
        el("div", { class: "qh-opts" }, opts),
        el("div", { class: "qh-actions" },
          el("button", { class: "qh-btn ghost", disabled: ses.idx === 0, onclick: function () { go(s, -1); } }, "← " + t("prev")),
          el("button", { class: "qh-btn", disabled: !answered, onclick: function () { go(s, 1); } }, ses.idx === ses.qs.length - 1 ? t("finish") : t("next") + " →"),
          el("span", { class: "qh-spacer" }),
          el("button", { class: "qh-btn danger", onclick: function () {
            startSession(s, ses.qid, ses.partial ? ses.qs.map(function (m) { return m.id; }) : null); toast(t("cleared")); render();
          } }, t("reset"))),
        el("div", { class: "qh-toggle" }, exam, el("label", { for: "qh-exam" }, t("exam"))),
        el("div", { class: "qh-toggle" }, shuf, el("label", { for: "qh-shuf" }, t("shuffle"))),
        el("div", { class: "qh-hint qh-kbd" }, t("kbd"))));
  }

  function choose(s, id, oi) {
    var ses = S.session;
    if (ses.answers[id] !== undefined && !ses.exam) return;
    ses.answers[id] = oi; save(); render();
  }
  function go(s, d) {
    var ses = S.session;
    if (d > 0 && ses.idx === ses.qs.length - 1) return finish(s);
    ses.idx = Math.max(0, Math.min(ses.qs.length - 1, ses.idx + d)); save(); render();
  }
  function finish(s) {
    var ses = S.session; ses.finished = true;
    var wrong = ses.qs.filter(function (m) { return ses.answers[m.id] !== m.a; }).map(function (m) { return m.id; });
    var score = ses.qs.length - wrong.length;
    if (!ses.partial) {
      var p = prog(s.id, ses.qid);
      S.progress[s.id + "." + ses.qid] = { best: Math.max(p.best || 0, score), attempts: p.attempts + 1, wrong: wrong, total: ses.qs.length };
    }
    save(); render();
  }

  function viewResult(s) {
    var ses = S.session, all = allQs(s);
    var wrongIds = ses.qs.filter(function (m) { return ses.answers[m.id] !== m.a; }).map(function (m) { return m.id; });
    var score = ses.qs.length - wrongIds.length;
    var items = ses.qs.map(function (m) {
      var q = all[m.id], ans = ses.answers[m.id], ok = ans === m.a;
      return el("div", { class: "qh-item " + (ok ? "ok" : "bad") },
        el("div", { class: "qh-tag " + (ok ? "ok" : "bad") }, ok ? "✓ " + t("correct") : "✗ " + t("wrong")),
        el("div", {}, el("b", {}, L(q))),
        !ok && el("div", { class: "qh-muted" }, t("yourAnswer") + ": " + (ans === undefined ? t("skipped") : L(q.opts[ans]))),
        el("div", {}, t("rightAnswer") + ": " + L(q.opts[q.a])));
    });
    return el("div", {},
      el("button", { class: "qh-link", onclick: function () { view = { v: "subject", sid: s.id }; render(); } }, "← " + L(s.title)),
      el("div", { class: "qh-panel" },
        el("h3", {}, t("result")),
        el("div", { class: "qh-score" }, score + " / " + ses.qs.length),
        el("div", { class: "qh-prog" }, el("i", { style: "width:" + (score / ses.qs.length) * 100 + "%" })),
        el("div", { class: "qh-actions" },
          el("button", { class: "qh-btn", onclick: function () { startSession(s, ses.qid); render(); } }, t("retry")),
          wrongIds.length > 0 && el("button", { class: "qh-btn ghost", onclick: function () { startSession(s, ses.qid, wrongIds); render(); } }, t("retryWrong") + " (" + wrongIds.length + ")"),
          el("button", { class: "qh-btn ghost", onclick: function () { view = { v: "subject", sid: s.id }; render(); } }, t("back")))),
      el("div", { class: "qh-review" }, items));
  }

  // ---------- keyboard (bound once) ----------
  document.addEventListener("keydown", function (e) {
    var ses = S && S.session;
    if (!root || !document.body.contains(root) || !view || view.v !== "quiz" || !ses || ses.finished) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.ctrlKey || e.metaKey || e.altKey) return;
    var s = subj(ses.sid); if (!s) return;
    var n = parseInt(e.key, 10), m = ses.qs[ses.idx];
    if (n >= 1 && n <= m.order.length) choose(s, m.id, m.order[n - 1]);
    else if (e.key === "Enter" && ses.answers[m.id] !== undefined) go(s, 1);
    else if (e.key === "ArrowLeft") go(s, -1);
  });

  // ---------- boot (also on Material instant navigation) ----------
  function init() {
    root = document.getElementById("quizhub");
    if (!root) return;
    S = S || loadState();
    view = { v: "home" };
    var names = (root.dataset.subjects || "").split(",").map(function (x) { return x.trim(); }).filter(Boolean);
    var base = new URL(root.dataset.base || "data/", location.href).href;
    window.QUIZ_SUBJECTS = window.QUIZ_SUBJECTS || [];
    Promise.all(names.filter(function (n) { return !window.QUIZ_SUBJECTS.some(function (s) { return s.id === n; }); })
      .map(function (n) { return loadScript(base + n + ".js"); }))
      .then(function () {
        SUBJECTS = names.map(function (n) { return subj0(n); }).filter(Boolean);
        render();
      })
      .catch(function () { root.replaceChildren(el("p", {}, I18N[S.lang].loadErr)); });
  }

  if (window.document$ && window.document$.subscribe) window.document$.subscribe(init);
  else if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
