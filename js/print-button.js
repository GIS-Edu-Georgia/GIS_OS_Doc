/* თითო გვერდის ბეჭდვის ღილაკი — იძახებს window.print()-ს.
   print.css ბეჭდვისას მალავს მენიუს/ჰედერს/ფუთერს და თავად ღილაკს. */
(function () {
  "use strict";

  // გვერდები, სადაც ბეჭდვის ღილაკი არ გამოჩნდეს (მაგ. მთავარი გვერდი).
  function isExcluded() {
    var path = location.pathname.replace(/index\.html$/, "");
    return path === "/" || path === "";
  }

  function addButton() {
    if (isExcluded()) return;
    var inner = document.querySelector(".md-content__inner");
    if (!inner || inner.querySelector(".print-page-btn")) return;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "print-page-btn";
    btn.title = "ამ გვერდის ბეჭდვა";
    btn.setAttribute("aria-label", "ამ გვერდის ბეჭდვა");
    btn.innerHTML = "🖨️ ბეჭდვა";
    btn.addEventListener("click", function () {
      window.print();
    });

    inner.insertBefore(btn, inner.firstChild);
  }

  if (typeof document$ !== "undefined" && document$.subscribe) {
    document$.subscribe(addButton);
  } else if (document.readyState !== "loading") {
    addButton();
  } else {
    document.addEventListener("DOMContentLoaded", addButton);
  }
})();
