// Minimal DOM + runner so quizhub.js can be exercised under plain Node (no browser, no deps).
const fs = require("fs");
const vm = require("vm");
const path = require("path");

class Node_ {}
class Text extends Node_ {
  constructor(t) { super(); this.text = String(t); }
}
class Element extends Node_ {
  constructor(tag) {
    super();
    this.tag = tag; this.attrs = {}; this.children = []; this.listeners = {}; this.parent = null;
    this.className = ""; this.checked = false; this.dataset = {};
  }
  setAttribute(k, v) { this.attrs[k] = String(v); if (k.indexOf("data-") === 0) this.dataset[k.slice(5)] = String(v); }
  addEventListener(t, fn) { (this.listeners[t] = this.listeners[t] || []).push(fn); }
  _adopt(c) { if (c.parent) c.remove(); c.parent = this; this.children.push(c); }
  append(...cs) { cs.forEach((c) => this._adopt(c instanceof Node_ ? c : new Text(c))); }
  replaceChildren(...cs) { this.children.forEach((c) => { c.parent = null; }); this.children = []; this.append(...cs); }
  remove() { if (this.parent) { this.parent.children = this.parent.children.filter((c) => c !== this); this.parent = null; } }
  scrollIntoView() {}
  get disabled() { return "disabled" in this.attrs; }
}

function serialize(n) {
  if (n instanceof Text) return n.text;
  const a = Object.assign({}, n.attrs);
  if (n.className) a.class = n.className;
  const attrs = Object.keys(a).sort().map((k) => ` ${k}="${a[k]}"`).join("");
  return `<${n.tag}${attrs}>${n.children.map(serialize).join("")}</${n.tag}>`;
}
function textOf(n) { return n instanceof Text ? n.text : n.children.map(textOf).join(""); }
function find(n, pred, out = []) { if (n instanceof Element) { if (pred(n)) out.push(n); n.children.forEach((c) => find(c, pred, out)); } return out; }
const byClass = (root, cls) => find(root, (e) => (" " + e.className + " ").includes(" " + cls + " "));
function click(el) { (el.listeners.click || []).forEach((f) => f({ target: el })); }
const tick = () => new Promise((r) => setImmediate(r));

function makeRandom(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

/**
 * Boot a quizhub engine file against given subjects (array of subject objects).
 * Returns { root, window, storage, ... } with helpers bound to this instance.
 */
async function boot(enginePath, subjects, opts = {}) {
  const root = new Element("div"); root.setAttribute("id", "quizhub");
  root.setAttribute("data-subjects", subjects.map((s) => s.id).join(","));
  const body = new Element("body"); body.append(root);
  const store = new Map(Object.entries(opts.storage || {}));
  const document = {
    readyState: "complete", body,
    getElementById: (id) => (id === "quizhub" ? root : null),
    createElement: (t) => new Element(t), createTextNode: (t) => new Text(t),
    addEventListener() {}, head: new Element("head"),
  };
  body.contains = (n) => { for (let c = n; c; c = c.parent) if (c === body) return true; return false; };
  const window = { QUIZ_SUBJECTS: subjects.slice() };
  const ctx = vm.createContext({
    window, document, Node: Node_, URL, Promise, console,
    location: { href: "http://localhost/Quiz/" }, setTimeout: () => 0, confirm: () => true,
    localStorage: { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)) },
  });
  vm.runInContext(`Math.random = (${makeRandom.toString()})(${opts.seed || 12345});`, ctx);
  vm.runInContext(fs.readFileSync(enginePath, "utf8"), ctx, { filename: path.basename(enginePath) });
  await tick();
  return { root, window, store, serialize: () => serialize(root), text: () => textOf(root) };
}

function loadSubjects(files) {
  const w = { QUIZ_SUBJECTS: [] };
  const ctx = vm.createContext({ window: w });
  files.forEach((f) => vm.runInContext(fs.readFileSync(f, "utf8"), ctx, { filename: f }));
  return w.QUIZ_SUBJECTS;
}

module.exports = { boot, loadSubjects, serialize, textOf, find, byClass, click, tick, Element, Text };
