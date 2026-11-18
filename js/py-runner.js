/* ============================================================
   ინტერაქტიული Python უჯრა (Pyodide-ით, სრულად ბრაუზერში)
   გამოყენება Markdown-ში:

     <div class="py-editor">
     <script type="text/x-python">
     print("Hello, World!")
     </script>
     </div>

   Pyodide იტვირთება მხოლოდ მაშინ, როცა მომხმარებელი პირველად
   დააჭერს "გაშვებას" (lazy-load). ერთი ინსტანცია ზიარდება გვერდზე.
   ============================================================ */
(function () {
  "use strict";

  var PYODIDE_VERSION = "0.26.4";
  var PYODIDE_INDEX =
    "https://cdn.jsdelivr.net/pyodide/v" + PYODIDE_VERSION + "/full/";
  var pyodideReady = null; // Promise<Pyodide> — ერთხელ იქმნება

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = function () {
        reject(new Error("ვერ ჩაიტვირთა: " + src));
      };
      document.head.appendChild(s);
    });
  }

  // Python-ის input()-ის override — ხსნის ბრაუზერის დიალოგს და
  // ტერმინალივით ბეჭდავს prompt-ს + შეყვანილ მნიშვნელობას output-ში.
  var INPUT_SETUP = [
    "import builtins as _b, sys as _sys",
    "from js import window as _win",
    "def _gis_input(prompt=''):",
    "    p = str(prompt)",
    "    res = _win.__gisPyPrompt(p)",
    "    if res is None:",
    "        raise EOFError('input გაუქმდა')",
    "    _sys.stdout.write(p + str(res) + '\\n')",
    "    _sys.stdout.flush()",
    "    return str(res)",
    "_b.input = _gis_input",
  ].join("\n");

  function getPyodide() {
    if (!pyodideReady) {
      window.__gisPyPrompt = function (p) {
        var label =
          p && String(p).trim() ? String(p) : "⌨️ შეიყვანე მონაცემი:";
        return window.prompt(label);
      };
      pyodideReady = loadScript(PYODIDE_INDEX + "pyodide.js")
        .then(function () {
          return window.loadPyodide({ indexURL: PYODIDE_INDEX });
        })
        .then(function (pyodide) {
          pyodide.runPython(INPUT_SETUP);
          return pyodide;
        });
    }
    return pyodideReady;
  }

  function initEditor(container) {
    if (container.dataset.pyReady === "1") return;
    container.dataset.pyReady = "1";

    var script = container.querySelector('script[type="text/x-python"]');
    var initial = script
      ? script.textContent.replace(/^\n/, "").replace(/\s+$/, "")
      : "";

    container.innerHTML = "";

    var textarea = document.createElement("textarea");
    textarea.className = "py-editor__code";
    textarea.spellcheck = false;
    textarea.setAttribute("aria-label", "Python კოდის რედაქტორი");
    textarea.value = initial;
    textarea.rows = Math.max(3, initial.split("\n").length);

    var toolbar = document.createElement("div");
    toolbar.className = "py-editor__toolbar";

    var runBtn = document.createElement("button");
    runBtn.type = "button";
    runBtn.className = "py-editor__run";
    runBtn.textContent = "▶ გაშვება";

    var resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.className = "py-editor__reset";
    resetBtn.textContent = "↺ თავიდან";

    var status = document.createElement("span");
    status.className = "py-editor__status";

    toolbar.appendChild(runBtn);
    toolbar.appendChild(resetBtn);
    toolbar.appendChild(status);

    var output = document.createElement("pre");
    output.className = "py-editor__output";
    output.setAttribute("aria-live", "polite");

    container.appendChild(textarea);
    container.appendChild(toolbar);
    container.appendChild(output);

    // Tab → 4 ჰარი (რედაქტორიდან არ გავარდეს ფოკუსი)
    textarea.addEventListener("keydown", function (e) {
      if (e.key === "Tab") {
        e.preventDefault();
        var start = this.selectionStart;
        var end = this.selectionEnd;
        this.value =
          this.value.substring(0, start) + "    " + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 4;
      }
    });

    resetBtn.addEventListener("click", function () {
      textarea.value = initial;
      textarea.rows = Math.max(3, initial.split("\n").length);
      output.textContent = "";
      output.classList.remove(
        "py-editor__output--error",
        "py-editor__output--visible"
      );
      status.textContent = "";
    });

    runBtn.addEventListener("click", function () {
      runBtn.disabled = true;
      output.classList.add("py-editor__output--visible");
      output.classList.remove("py-editor__output--error");
      output.textContent = "";
      status.textContent = pyodideReady
        ? "⏳ მუშავდება..."
        : "⏳ Python იტვირთება (პირველ ჯერზე ~რამდენიმე წამი)...";

      var buffer = "";
      getPyodide()
        .then(function (pyodide) {
          pyodide.setStdout({
            batched: function (s) {
              buffer += s + "\n";
              output.textContent = buffer;
            },
          });
          pyodide.setStderr({
            batched: function (s) {
              buffer += s + "\n";
              output.textContent = buffer;
            },
          });
          status.textContent = "⏳ მუშავდება...";
          return pyodide.runPythonAsync(textarea.value);
        })
        .then(function () {
          if (!buffer) output.textContent = "(პროგრამამ არაფერი დაბეჭდა)";
          status.textContent = "✅ დასრულდა";
        })
        .catch(function (err) {
          output.classList.add("py-editor__output--error");
          output.textContent =
            (buffer ? buffer + "\n" : "") + String(err.message || err);
          status.textContent = "⚠️ შეცდომა";
        })
        .then(function () {
          runBtn.disabled = false;
        });
    });
  }

  function initAll() {
    var editors = document.querySelectorAll(".py-editor");
    Array.prototype.forEach.call(editors, initEditor);
  }

  // Material-ის instant navigation-თან თავსებადობა:
  // document$ ყოველ გვერდის ჩატვირთვაზე ასრულებს emit-ს.
  if (typeof document$ !== "undefined" && document$.subscribe) {
    document$.subscribe(initAll);
  } else if (document.readyState !== "loading") {
    initAll();
  } else {
    document.addEventListener("DOMContentLoaded", initAll);
  }
})();
