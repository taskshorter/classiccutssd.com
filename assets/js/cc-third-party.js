/* Classic Cuts — load Squire only after real user interaction */
(function () {
  "use strict";

  var BRAND = "20b0c665-7cde-4084-a62e-25c3fd3f95d2";
  var loaded = false;

  function loadSquire() {
    if (loaded) return;
    loaded = true;
    window.removeEventListener("pointerdown", onInteract, true);
    window.removeEventListener("keydown", onInteract, true);
    window.removeEventListener("touchstart", onInteract, true);
    var s = document.createElement("script");
    s.src = "https://widget.getsquire.com/widget.js?" + Date.now();
    s.defer = true;
    s.setAttribute("brand", BRAND);
    s.setAttribute("x-squire-inline-enabled", "true");
    document.head.appendChild(s);
  }

  function onInteract() {
    loadSquire();
  }

  // Booking still works via plain links; widget loads on first interaction.
  window.addEventListener("pointerdown", onInteract, true);
  window.addEventListener("keydown", onInteract, true);
  window.addEventListener("touchstart", onInteract, { once: true, passive: true, capture: true });
})();
