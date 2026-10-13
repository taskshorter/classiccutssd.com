/**
 * Classic Cuts — smooth scroll motion (transform-first, no blank gaps).
 */
(function () {
  "use strict";

  var SELECTOR = [
    ".cc-main .cc-lookbook__intro",
    ".cc-main .cc-value-card",
    ".cc-main .cc-look-card",
    ".cc-main .cc-bounce-gallery__intro",
    ".cc-main .cc-btn-row",
    ".cc-main .cc-trust",
    ".cc-main .cc-visit-panel",
    ".cc-main .cc-team-hero",
    ".cc-main .cc-team-card",
    ".cc-main .cc-team-foot",
    ".cc-main .cc-gallery-hero",
    ".cc-main .cc-gallery-cta",
    ".cc-main .cc-book-hero",
    ".cc-main .cc-book-aside",
    ".cc-main .cc-book-panel",
    ".cc-main .cc-book-context article",
    ".cc-main .cc-apply__pitch",
    ".cc-main .cc-apply__shell",
    ".cc-main .cc-profile-hero",
    ".cc-main .cc-work-grid",
    ".cc-main .cc-profile-book",
    ".cc-main .cc-services-menu > li",
    ".cc-main .cc-services-specials",
    ".cc-main .cc-mission-stage",
    ".cc-main .cc-value-grid",
    ".cc-footer .cc-footer__inner > div",
    "[data-reveal]",
  ].join(",");

  var SKIP =
    ".cc-hero, .cc-announce, .cc-header, .cc-mobile-nav, booklocal-booking, [data-reveal='off'], .cc-gallery__grid, .cc-gallery__item";

  function reducedMotion() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  /** Only skip what's actually visible in the first screen. */
  function inFirstScreen(el) {
    var rect = el.getBoundingClientRect();
    var vh = window.innerHeight || 800;
    return rect.top < vh * 0.88 && rect.bottom > 40;
  }

  function shouldSkip(el) {
    if (!el || el.nodeType !== 1) return true;
    if (el.closest(SKIP)) return true;
    if (el.hasAttribute("data-reveal-ready")) return true;
    return false;
  }

  function init() {
    if (reducedMotion() || !("IntersectionObserver" in window)) return;

    var nodes = Array.prototype.slice.call(document.querySelectorAll(SELECTOR));
    var targets = [];

    nodes.forEach(function (el) {
      if (shouldSkip(el)) return;
      if (inFirstScreen(el)) {
        el.setAttribute("data-reveal-ready", "1");
        return;
      }
      targets.push(el);
    });

    if (!targets.length) return;

    var groups = new Map();
    targets.forEach(function (el) {
      var key = el.parentElement || document.body;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(el);
    });

    groups.forEach(function (list) {
      var stagger =
        list.length > 1 &&
        list.length <= 8 &&
        list.every(function (el) {
          return (
            el.classList.contains("cc-value-card") ||
            el.classList.contains("cc-look-card") ||
            el.classList.contains("cc-team-card") ||
            (el.parentElement &&
              el.parentElement.classList.contains("cc-services-menu"))
          );
        });

      list.forEach(function (el, i) {
        el.classList.add("cc-reveal");
        el.setAttribute("data-reveal-ready", "1");
        if (stagger && i > 0) {
          el.style.setProperty(
            "--cc-reveal-delay",
            Math.min(i * 50, 300) + "ms"
          );
        }
      });
    });

    // Force layout, then observe — ensures starting transform is painted first.
    void document.body.offsetHeight;

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          el.classList.add("is-inview");
          io.unobserve(el);

          var done = function (e) {
            if (e && e.propertyName && e.propertyName !== "transform") return;
            el.classList.add("cc-reveal--done");
            el.removeEventListener("transitionend", done);
          };
          el.addEventListener("transitionend", done);
          // Fallback if transitionend doesn't fire
          window.setTimeout(done, 900);
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -6% 0px",
        threshold: 0.08,
      }
    );

    targets.forEach(function (el) {
      io.observe(el);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
