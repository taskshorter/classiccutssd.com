/**
 * Classic Cuts — mega menu + mobile nav
 */
(function () {
  "use strict";

  var BOOK = "/book";

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var header = document.querySelector(".cc-header");
    var backdrop = document.querySelector(".cc-nav-backdrop");
    var toggle = document.querySelector(".cc-hamburger");
    var mobile = document.querySelector(".cc-mobile-nav");
    var triggers = document.querySelectorAll(".cc-nav > li.has-mega");
    var panels = document.querySelectorAll(".cc-mega");
    var openKey = null;
    var closeTimer = null;

    function setMobileOpen(open) {
      document.body.classList.toggle("nav-open", !!open);
      if (toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (!mobile) return;
      mobile.setAttribute("aria-hidden", open ? "false" : "true");
      if ("inert" in mobile) {
        mobile.inert = !open;
      } else {
        mobile.querySelectorAll("a, button").forEach(function (el) {
          if (open) el.removeAttribute("tabindex");
          else el.setAttribute("tabindex", "-1");
        });
      }
    }

    // Start closed
    setMobileOpen(false);

    function setTriggerExpanded(key) {
      triggers.forEach(function (li) {
        var a = li.getAttribute("data-mega") ? li.querySelector(":scope > a") : null;
        if (a) {
          a.setAttribute(
            "aria-expanded",
            key && li.getAttribute("data-mega") === key ? "true" : "false"
          );
        }
      });
    }

    function closeMega() {
      openKey = null;
      setTriggerExpanded(null);
      if (header) header.classList.remove("is-mega-open");
      triggers.forEach(function (li) {
        li.classList.remove("is-open");
      });
      panels.forEach(function (p) {
        p.classList.remove("is-open");
        p.hidden = true;
      });
      if (backdrop) {
        backdrop.classList.remove("is-open");
        backdrop.hidden = true;
      }
    }

    function openMega(key) {
      if (!key) return;
      openKey = key;
      setTriggerExpanded(key);
      if (header) header.classList.add("is-mega-open");
      triggers.forEach(function (li) {
        var match = li.getAttribute("data-mega") === key;
        li.classList.toggle("is-open", match);
      });
      panels.forEach(function (p) {
        var match = p.getAttribute("data-mega") === key;
        p.classList.toggle("is-open", match);
        p.hidden = !match;
      });
      if (backdrop) {
        backdrop.hidden = false;
        backdrop.classList.add("is-open");
      }
    }

    // The dropdown's headshots are lazy (they sit in a hidden panel, so they
    // would not otherwise load until the menu is open). The first time the
    // pointer or keyboard reaches the nav bar, start loading them so they are
    // ready by the time "Barbers" is hovered — without costing every page load.
    var warmed = false;
    function warmMegaImages() {
      if (warmed) return;
      warmed = true;
      document.querySelectorAll('.cc-mega img[loading="lazy"]').forEach(function (img) {
        img.loading = "eager";
      });
    }
    var navBar = document.querySelector(".cc-header__nav");
    if (navBar) {
      navBar.addEventListener("pointerenter", warmMegaImages, { once: true });
      navBar.addEventListener("focusin", warmMegaImages, { once: true });
    }

    // The mobile drawer's headshots are lazy inside a collapsed panel too.
    // Start them loading as soon as the menu button is touched / focused so
    // they are ready by the time the drawer has finished sliding open.
    var warmedMobile = false;
    function warmMobileImages() {
      if (warmedMobile) return;
      warmedMobile = true;
      document.querySelectorAll('.cc-mobile-nav img[loading="lazy"]').forEach(function (img) {
        img.loading = "eager";
      });
    }
    if (toggle) {
      toggle.addEventListener("pointerdown", warmMobileImages, { once: true, passive: true });
      toggle.addEventListener("touchstart", warmMobileImages, { once: true, passive: true });
      toggle.addEventListener("focus", warmMobileImages, { once: true });
    }

    // Touch fallback (≥768px). Touch tablets/laptops have no hover, and browsers
    // that emulate hover on tap would otherwise fire mouseenter + click for the
    // same tap. Remember when the last touch happened: while it is recent, the
    // emulated mouse/focus events are ignored and the click is the single
    // source of truth (tap toggles the panel). Real mouse hover and keyboard
    // focus are unaffected because they never set the touch timestamp.
    var touchAt = 0;
    function noteTouch(e) {
      if (!e.pointerType || e.pointerType === "touch" || e.pointerType === "pen") {
        touchAt = Date.now();
      }
    }
    function recentTouch() {
      return Date.now() - touchAt < 800;
    }
    document.addEventListener("pointerdown", noteTouch, { passive: true, capture: true });
    document.addEventListener("pointerup", noteTouch, { passive: true, capture: true });
    document.addEventListener(
      "touchstart",
      function () {
        touchAt = Date.now();
      },
      { passive: true, capture: true }
    );

    function scheduleClose() {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(closeMega, 140);
    }

    function cancelClose() {
      clearTimeout(closeTimer);
    }

    if (window.matchMedia("(min-width: 768px)").matches || true) {
      triggers.forEach(function (li) {
        var key = li.getAttribute("data-mega");
        // The drawer's own "Barbers" item has no data-mega: leave it alone.
        var link = key ? li.querySelector(":scope > a") : null;
        if (link) link.setAttribute("aria-haspopup", "true");
        li.addEventListener("mouseenter", function () {
          if (window.innerWidth < 768 || recentTouch()) return;
          cancelClose();
          openMega(key);
        });
        li.addEventListener("focusin", function () {
          if (window.innerWidth < 768 || recentTouch()) return;
          cancelClose();
          openMega(key);
        });
        if (link) {
          // Touch tap toggles the dropdown instead of navigating; a mouse click
          // or keyboard Enter still follows the link to /barbers.
          link.addEventListener("click", function (e) {
            if (window.innerWidth < 768 || !recentTouch()) return;
            e.preventDefault();
            cancelClose();
            if (openKey === key) closeMega();
            else openMega(key);
          });
        }
      });

      panels.forEach(function (p) {
        p.addEventListener("mouseenter", cancelClose);
        p.addEventListener("mouseleave", function () {
          if (window.innerWidth < 768) return;
          scheduleClose();
        });
      });

      if (header) {
        header.addEventListener("mouseleave", function () {
          if (window.innerWidth < 768) return;
          scheduleClose();
        });
      }

      document.querySelectorAll(".cc-nav > li:not(.has-mega)").forEach(function (li) {
        li.addEventListener("mouseenter", function () {
          if (window.innerWidth < 768) return;
          scheduleClose();
        });
      });
    }

    if (backdrop) {
      backdrop.addEventListener("click", closeMega);
    }

    // Press/tap anywhere outside the header closes the dropdown (≥768px).
    document.addEventListener(
      "pointerdown",
      function (e) {
        if (!openKey || window.innerWidth < 768) return;
        if (header && header.contains(e.target)) return;
        closeMega();
      },
      { passive: true }
    );

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeMega();
        setMobileOpen(false);
      }
    });

    if (toggle) {
      toggle.addEventListener("click", function (e) {
        e.preventDefault();
        closeMega();
        setMobileOpen(!document.body.classList.contains("nav-open"));
      });
    }

    if (mobile) {
      mobile.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
          if (window.innerWidth >= 768) return;
          setMobileOpen(false);
        });
      });
    }

    var book = document.querySelector(".cc-header__book");
    if (book && !book.getAttribute("href")) book.setAttribute("href", BOOK);
  });
})();
