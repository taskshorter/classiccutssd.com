/**
 * Classic Cuts — lookbook filter tabs (Zen Den Style Lookbook pattern)
 */
(function () {
  "use strict";

  function init() {
    var section = document.getElementById("services");
    if (!section) return;

    var tabs = section.querySelectorAll(".cc-lookbook__tab");
    var cards = section.querySelectorAll(".cc-look-card");
    if (!tabs.length || !cards.length) return;

    function setFilter(filter) {
      for (var i = 0; i < cards.length; i++) {
        var cat = cards[i].getAttribute("data-category");
        var show = filter === "all" || cat === filter;
        cards[i].classList.toggle("is-hidden", !show);
        cards[i].hidden = !show;
      }
    }

    for (var t = 0; t < tabs.length; t++) {
      tabs[t].addEventListener("click", function (e) {
        var btn = e.currentTarget;
        var filter = btn.getAttribute("data-filter") || "all";
        for (var i = 0; i < tabs.length; i++) {
          var on = tabs[i] === btn;
          tabs[i].classList.toggle("is-active", on);
          tabs[i].setAttribute("aria-selected", on ? "true" : "false");
        }
        setFilter(filter);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
