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

    function closeMega() {
      openKey = null;
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
        li.addEventListener("mouseenter", function () {
          if (window.innerWidth < 768) return;
          cancelClose();
          openMega(key);
        });
        li.addEventListener("focusin", function () {
          if (window.innerWidth < 768) return;
          cancelClose();
          openMega(key);
        });
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
