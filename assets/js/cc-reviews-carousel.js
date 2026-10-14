/**
 * Classic Cuts — endless dual-row reviews carousel
 * Pixel-based marquee (avoids % transform quirks after layout changes).
 */
(function () {
  "use strict";

  var YELP = "https://www.yelp.com/biz/classic-cuts-barber-shop-san-diego-3";

  var REVIEWS = [
    {
      author: "Ricardo H.",
      body: "Sharp fade, clean finish, and a chill vibe. Classic Cuts is my go-to in Mission Valley.",
      href: YELP + "?hrid=A4ddugWmeb1TJgc3AUKceg",
    },
    {
      author: "Jayme H.",
      body: "Walked in and walked out looking fresh. Skilled barbers who actually listen to what you want.",
      href: YELP + "?hrid=0Ery63arwwom9uxni2oVhw",
    },
    {
      author: "J M.",
      body: "Consistent every time. Great shop energy and they know how to cut for your face, not just a trend.",
      href: YELP + "?hrid=n3moB4sSA3pWPjTpNkG66g",
    },
    {
      author: "Marcus T.",
      body: "Best skin fade I've gotten in San Diego. Easy booking and the chair time feels worth every dollar.",
      href: YELP,
    },
    {
      author: "Diego R.",
      body: "Clean shop, sharp lineups, and friendly crew. Instant regular after one cut.",
      href: YELP,
    },
    {
      author: "Andre P.",
      body: "Hot towel shave was next level. Classic Cuts brings that old-school craft with a modern finish.",
      href: YELP,
    },
  ];

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function cardHtml(review) {
    return (
      '<a class="cc-review-slide" href="' +
      escapeHtml(review.href) +
      '" target="_blank" rel="noopener noreferrer">' +
      '<div class="cc-stars" aria-hidden="true">★★★★★</div>' +
      '<p class="cc-review-slide__quote">&ldquo;' +
      escapeHtml(review.body) +
      '&rdquo;</p>' +
      '<div class="cc-review-slide__author">' +
      escapeHtml(review.author) +
      "</div>" +
      "</a>"
    );
  }

  function buildPairs(list) {
    var pairs = [];
    var n = list.length;
    for (var i = 0; i < n; i++) {
      pairs.push({
        top: list[i],
        bottom: list[(i + Math.floor(n / 2)) % n],
      });
    }
    return pairs;
  }

  function setHtml(pairs) {
    var html = '<div class="cc-review-carousel__set">';
    for (var i = 0; i < pairs.length; i++) {
      html +=
        '<div class="cc-review-carousel__col">' +
        cardHtml(pairs[i].top) +
        cardHtml(pairs[i].bottom) +
        "</div>";
    }
    html += "</div>";
    return html;
  }

  function init() {
    var track = document.getElementById("cc-review-track");
    var carousel = track && track.closest(".cc-review-carousel");
    if (!track || !carousel) return;

    var viewport = carousel.querySelector(".cc-review-carousel__viewport");
    var pairs = buildPairs(REVIEWS);

    var reduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Touch / coarse-pointer devices (and reduced motion) get no autoplay:
    // the strip is a plain horizontally scrollable row with every card
    // reachable, so the user's swipe never fights a moving marquee.
    var touchLike =
      window.matchMedia &&
      window.matchMedia("(hover: none), (pointer: coarse), (any-pointer: coarse)").matches;

    if (reduced || touchLike) {
      track.innerHTML = setHtml(pairs);
      if (viewport) viewport.classList.add("is-manual");
      return;
    }

    track.innerHTML = setHtml(pairs) + setHtml(pairs);

    var offset = 0;
    var last = performance.now();
    var speed = 36; // px per second
    var paused = false;
    var loopWidth = 0;
    var first = track.querySelector(".cc-review-carousel__set");

    function applyWidth(w) {
      if (w > 0) loopWidth = w;
    }

    // Prefer ResizeObserver (no forced layout read after DOM write)
    if (first && typeof ResizeObserver !== "undefined") {
      var ro = new ResizeObserver(function (entries) {
        var entry = entries[0];
        if (!entry) return;
        var w = 0;
        if (entry.borderBoxSize && entry.borderBoxSize[0]) {
          w = entry.borderBoxSize[0].inlineSize;
        } else {
          w = entry.contentRect.width;
        }
        applyWidth(w);
      });
      ro.observe(first);
    } else if (first) {
      window.requestAnimationFrame(function () {
        applyWidth(first.offsetWidth);
      });
      window.addEventListener(
        "resize",
        function () {
          window.requestAnimationFrame(function () {
            applyWidth(first.offsetWidth);
          });
        },
        { passive: true }
      );
    }

    var hoverPaused = false;
    var focusPaused = false;
    function syncPaused() {
      paused = hoverPaused || focusPaused;
    }
    carousel.addEventListener("mouseenter", function () {
      hoverPaused = true;
      syncPaused();
    });
    carousel.addEventListener("mouseleave", function () {
      hoverPaused = false;
      syncPaused();
    });
    // Keyboard users tabbing into a review also pause the marquee.
    carousel.addEventListener("focusin", function () {
      focusPaused = true;
      syncPaused();
    });
    carousel.addEventListener("focusout", function () {
      focusPaused = false;
      syncPaused();
      if (viewport) viewport.scrollLeft = 0;
    });

    function tick(now) {
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!paused && loopWidth > 0) {
        offset += speed * dt;
        if (offset >= loopWidth) offset -= loopWidth;
        track.style.transform = "translate3d(" + -offset.toFixed(2) + "px,0,0)";
      }
      window.requestAnimationFrame(tick);
    }

    window.requestAnimationFrame(tick);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
