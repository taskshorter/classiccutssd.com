/* Load below-the-fold homepage scripts after LCP-friendly delay */
(function () {
  "use strict";

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[src="' + src + '"]');
      if (existing) {
        resolve();
        return;
      }
      var s = document.createElement("script");
      s.src = src;
      s.defer = true;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function whenIdle(fn) {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(fn, { timeout: 4000 });
    } else {
      setTimeout(fn, 2000);
    }
  }

  function afterFirstPaint(fn) {
    // Let FCP/LCP settle before competing for bandwidth/CPU
    window.addEventListener(
      "load",
      function () {
        setTimeout(fn, 600);
      },
      { once: true }
    );
  }

  function near(el, margin) {
    if (!el) return Promise.resolve(false);
    return new Promise(function (resolve) {
      if (!("IntersectionObserver" in window)) {
        whenIdle(function () {
          resolve(true);
        });
        return;
      }
      var io = new IntersectionObserver(
        function (entries) {
          if (!entries.some(function (e) { return e.isIntersecting; })) return;
          io.disconnect();
          resolve(true);
        },
        { rootMargin: margin || "0px 0px" }
      );
      io.observe(el);
    });
  }

  function boot() {
    var bounce = document.getElementById("cc-bounce-cards");
    var mission = document.getElementById("cc-mission-swap");

    afterFirstPaint(function () {
      // PixelSwap has no GSAP dependency — load only when mission is actually visible
      near(mission, "80px 0px").then(function () {
        return loadScript("assets/js/PixelSwap.js?v=20260814z");
      });

      // BounceCards: GSAP loads on every device so the intended fan/spin motion
      // plays on mobile too. If the GSAP CDN request itself fails (network
      // error, blocked, offline), BounceCards.js still loads and mounts a
      // static, fully visible gallery instead of leaving the section blank.
      near(bounce, "80px 0px").then(function () {
        var bounceSrc = "assets/js/BounceCards.js?v=20260826b";
        return loadScript("https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js")
          .catch(function () {
            // Swallow the failure — BounceCards.js's own hasGsap check
            // falls back to a static, visible gallery when gsap is undefined.
          })
          .then(function () {
            return loadScript(bounceSrc);
          });
      });

      var reviews = document.getElementById("reviews");
      near(reviews, "120px 0px").then(function () {
        return loadScript("assets/js/cc-reviews-carousel.js?v=20260814x");
      });

      whenIdle(function () {
        loadScript("assets/js/cc-services-menu.js");
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
