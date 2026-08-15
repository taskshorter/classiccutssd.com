/**
 * PixelSwap — vanilla port of React Bits PixelSwap
 * Hover/click pixel-grid reveal between two content layers.
 */
(function (global) {
  "use strict";

  var MAX_PIXELS = 64;
  var KEYFRAME_STEPS = 10;

  var PATTERNS = {
    random: function () {
      return null;
    },
    center: function (x, y) {
      return Math.hypot(x - 0.5, y - 0.5) / Math.SQRT1_2;
    },
    edges: function (x, y) {
      return Math.min(x, 1 - x, y, 1 - y) * 2;
    },
    "left-to-right": function (x) {
      return x;
    },
    "right-to-left": function (x) {
      return 1 - x;
    },
    "top-to-bottom": function (_x, y) {
      return y;
    },
    "bottom-to-top": function (_x, y) {
      return 1 - y;
    },
    diagonal: function (x, y) {
      return (x + y) / 2;
    },
    spiral: function (x, y) {
      var angle = (Math.atan2(y - 0.5, x - 0.5) + Math.PI) / (Math.PI * 2);
      var radius = Math.hypot(x - 0.5, y - 0.5) / Math.SQRT1_2;
      return (angle + radius) % 1;
    },
  };

  var EASINGS = {
    linear: [0, 0, 1, 1],
    ease: [0.25, 0.1, 0.25, 1],
    "ease-in": [0.42, 0, 1, 1],
    "ease-out": [0, 0, 0.58, 1],
    "ease-in-out": [0.42, 0, 0.58, 1],
  };

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function noise(seed) {
    var value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
    return value - Math.floor(value);
  }

  function makeEasing(value) {
    var match = /cubic-bezier\(([^)]+)\)/.exec(value);
    var points = match
      ? match[1].split(",").map(Number)
      : EASINGS[value];
    if (!points || points.length !== 4 || points.some(Number.isNaN)) {
      return makeEasing("ease");
    }

    var x1 = points[0];
    var y1 = points[1];
    var x2 = points[2];
    var y2 = points[3];
    if (x1 === y1 && x2 === y2) {
      return function (progress) {
        return progress;
      };
    }

    var cx = 3 * x1;
    var bx = 3 * (x2 - x1) - cx;
    var ax = 1 - cx - bx;
    var cy = 3 * y1;
    var by = 3 * (y2 - y1) - cy;
    var ay = 1 - cy - by;

    return function (progress) {
      var t = progress;
      for (var i = 0; i < 5; i += 1) {
        var slope = (3 * ax * t + 2 * bx) * t + cx;
        if (!slope) break;
        t -= (((ax * t + bx) * t + cx) * t - progress) / slope;
      }
      t = clamp(t, 0, 1);
      return ((ay * t + by) * t + cy) * t;
    };
  }

  function coverScale(size, gap, radius) {
    var p = clamp(radius, 0, 50) / 100;
    var corner = Math.SQRT1_2 / (Math.SQRT2 * (0.5 - p) + p);
    return ((size + gap) / size) * Math.max(1, corner);
  }

  function buildGrid(opts) {
    var width = opts.width;
    var height = opts.height;
    var pixelSize = opts.pixelSize;
    var gap = opts.gap;
    var pattern = opts.pattern;
    var randomness = opts.randomness;

    var size = pixelSize;
    var columns = Math.max(1, Math.ceil((width + gap) / (size + gap)));
    var rows = Math.max(1, Math.ceil((height + gap) / (size + gap)));

    if (columns * rows > MAX_PIXELS) {
      size = Math.ceil(size * Math.sqrt((columns * rows) / MAX_PIXELS));
      columns = Math.max(1, Math.ceil((width + gap) / (size + gap)));
      rows = Math.max(1, Math.ceil((height + gap) / (size + gap)));
    }

    var stride = size + gap;
    var originX = (width - (columns * stride - gap)) / 2;
    var originY = (height - (rows * stride - gap)) / 2;
    var order = PATTERNS[pattern] || PATTERNS.random;
    var mix = clamp(randomness, 0, 1);
    var pixels = [];

    for (var row = 0; row < rows; row += 1) {
      for (var column = 0; column < columns; column += 1) {
        var index = row * columns + column;
        var x = columns <= 1 ? 0.5 : column / (columns - 1);
        var y = rows <= 1 ? 0.5 : row / (rows - 1);
        var base = order(x, y);
        var random = noise(index + 1);
        pixels.push({
          id: index,
          left: originX + column * stride,
          top: originY + row * stride,
          offset: base === null ? random : base * (1 - mix) + random * mix,
        });
      }
    }

    return { pixels: pixels, size: size, gap: gap, width: width, height: height };
  }

  function buildKeyframes(opts) {
    var ease = opts.ease;
    var startScale = opts.startScale;
    var endScale = opts.endScale;
    var spin = opts.spin;
    var fade = opts.fade;
    var windowKf = [];
    var contentKf = [];

    for (var step = 0; step <= KEYFRAME_STEPS; step += 1) {
      var progress = step / KEYFRAME_STEPS;
      var eased = ease(progress);
      var scale = startScale + (endScale - startScale) * eased;
      var angle = spin * (1 - eased);

      windowKf.push({
        offset: progress,
        opacity: fade ? Math.min(1, eased * 1.6) : 1,
        transform: "rotate(" + angle + "deg) scale(" + scale + ")",
      });
      contentKf.push({
        offset: progress,
        transform: "scale(" + 1 / scale + ") rotate(" + -angle + "deg)",
      });
    }

    return { window: windowKf, content: contentKf };
  }

  function resolveContent(input) {
    if (!input) return document.createElement("div");
    if (typeof input === "string") {
      var wrap = document.createElement("div");
      wrap.innerHTML = input;
      if (wrap.childElementCount === 1) return wrap.firstElementChild;
      return wrap;
    }
    if (input.nodeType === 1) return input;
    if (input.content && input.nodeType === 11) {
      // DocumentFragment-like template content
      return input;
    }
    if (input.tagName === "TEMPLATE") {
      return input.content.cloneNode(true);
    }
    return input;
  }

  function appendContent(layer, content) {
    layer.innerHTML = "";
    var resolved = resolveContent(content);
    if (resolved.nodeType === 11) {
      layer.appendChild(resolved);
    } else if (resolved.parentNode) {
      layer.appendChild(resolved.cloneNode(true));
    } else {
      layer.appendChild(resolved);
    }
  }

  function PixelSwap(container, options) {
    if (!container) throw new Error("PixelSwap: container required");
    options = options || {};

    var pixelSize = options.pixelSize != null ? options.pixelSize : 64;
    var gap = options.gap != null ? options.gap : 0;
    var pixelRadius = options.pixelRadius != null ? options.pixelRadius : 0;
    var pixelSpin = options.pixelSpin != null ? options.pixelSpin : 0;
    var pixelScale = options.pixelScale != null ? options.pixelScale : 0.35;
    var fade = options.fade !== false;
    var duration = options.duration != null ? options.duration : 1400;
    var pixelDuration = options.pixelDuration != null ? options.pixelDuration : 450;
    var pattern = options.pattern || "random";
    var randomness = options.randomness != null ? options.randomness : 0;
    var easing = options.easing || "cubic-bezier(0.22, 1, 0.36, 1)";
    var trigger = options.trigger || "hover";
    var initialActive = !!options.initialActive;
    var aspectRatio = options.aspectRatio;
    var className = options.className || "";
    var onActiveChange = options.onActiveChange;
    var onComplete = options.onComplete;

    var controlledActive = Object.prototype.hasOwnProperty.call(options, "active")
      ? options.active
      : undefined;

    var root = document.createElement("div");
    root.className = ("pixel-swap " + className).trim();
    if (aspectRatio && aspectRatio !== "auto") {
      root.style.aspectRatio = aspectRatio;
    }
    if (options.style) {
      Object.keys(options.style).forEach(function (key) {
        root.style[key] = options.style[key];
      });
    }

    var layer0 = document.createElement("div");
    layer0.className = "pixel-swap__layer";
    var layer1 = document.createElement("div");
    layer1.className = "pixel-swap__layer";
    root.appendChild(layer0);
    root.appendChild(layer1);

    appendContent(layer0, options.firstContent);
    appendContent(layer1, options.secondContent);

    container.innerHTML = "";
    container.appendChild(root);

    var layerRefs = [layer0, layer1];
    var pixelRefs = [];
    var animations = [];
    var timerId = 0;
    var box = { width: 0, height: 0 };
    var internalActive = initialActive;
    var shownActive = controlledActive !== undefined ? controlledActive : initialActive;
    var transition = null;
    var gridSnapshot = null;

    function desiredActive() {
      return controlledActive !== undefined ? controlledActive : internalActive;
    }

    function stopAnimations() {
      animations.forEach(function (animation) {
        try {
          animation.cancel();
        } catch (e) {}
      });
      animations = [];
      pixelRefs.forEach(function (pixel) {
        if (pixel) pixel.replaceChildren();
      });
      if (timerId) window.clearTimeout(timerId);
      timerId = 0;
    }

    function setLayerVisibility() {
      var incomingIndex = transition && transition.to ? 1 : 0;
      layerRefs.forEach(function (layer, index) {
        var isShown = index === (shownActive ? 1 : 0);
        var hideForIncoming = !!(transition && index === incomingIndex);
        layer.setAttribute("data-visible", isShown && !hideForIncoming ? "true" : "false");
        layer.style.zIndex = isShown ? "2" : "1";
        layer.setAttribute("aria-hidden", isShown ? "false" : "true");
      });
      root.setAttribute("data-active", shownActive ? "true" : "false");
      root.setAttribute("data-transitioning", transition ? "true" : "false");
    }

    function currentGrid() {
      return buildGrid({
        width: box.width,
        height: box.height,
        pixelSize: Math.max(8, Math.round(pixelSize)),
        gap: Math.max(0, Math.round(gap)),
        pattern: pattern,
        randomness: randomness,
      });
    }

    var leaveTimer = 0;

    function finishTransition(to) {
      stopAnimations();
      var gridEl = root.querySelector(".pixel-swap__grid");
      if (gridEl) gridEl.remove();
      shownActive = to;
      transition = null;
      setLayerVisibility();
      if (typeof onComplete === "function") onComplete(to);
      maybeStartTransition();
    }

    function clearTransitionArtifacts() {
      stopAnimations();
      var gridEl = root.querySelector(".pixel-swap__grid");
      if (gridEl) gridEl.remove();
      transition = null;
      setLayerVisibility();
    }

    // Heavy cards (SVG meters, bar charts) glitch if cloned into every pixel
    // with CSS animations still live. Build one cleaned template, then clone that.
    function buildPixelSource(source) {
      var clean = source.cloneNode(true);
      clean.dataset.visible = "true";
      clean.style.visibility = "visible";
      clean.style.opacity = "1";
      clean.removeAttribute("aria-hidden");
      clean.classList.add("pixel-swap__clone-layer");

      var svgs = clean.querySelectorAll("svg");
      for (var s = 0; s < svgs.length; s++) {
        var svg = svgs[s];
        var ph = document.createElement("div");
        ph.className = "pixel-swap__meter-ph";
        ph.setAttribute("aria-hidden", "true");
        if (svg.parentNode) svg.parentNode.replaceChild(ph, svg);
      }

      return clean;
    }

    function runTransition() {
      if (!transition) return;
      var to = transition.to;

      var reduced =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      var source = layerRefs[to ? 1 : 0];
      if (!source || reduced) {
        finishTransition(to);
        return;
      }

      measure();
      var frozenGrid = currentGrid();
      transition.grid = frozenGrid;
      if (!frozenGrid.pixels.length) {
        finishTransition(to);
        return;
      }

      var total = Math.max(200, duration);
      var pixelMs = clamp(pixelDuration, 60, total);
      var spread = Math.max(0, total - pixelMs);
      var endScale = coverScale(frozenGrid.size, frozenGrid.gap, pixelRadius);
      var keyframes = buildKeyframes({
        ease: makeEasing(easing),
        startScale: clamp(pixelScale, 0.05, 1) * endScale,
        endScale: endScale,
        spin: pixelSpin,
        fade: fade,
      });

      var pixelSource = buildPixelSource(source);

      var gridEl = document.createElement("div");
      gridEl.className = "pixel-swap__grid";
      gridEl.setAttribute("aria-hidden", "true");
      pixelRefs = [];

      frozenGrid.pixels.forEach(function (pixel) {
        var pixelElement = document.createElement("div");
        pixelElement.className = "pixel-swap__pixel";
        pixelElement.style.left = pixel.left + "px";
        pixelElement.style.top = pixel.top + "px";
        pixelElement.style.width = frozenGrid.size + "px";
        pixelElement.style.height = frozenGrid.size + "px";
        pixelElement.style.borderRadius = clamp(pixelRadius, 0, 50) + "%";
        gridEl.appendChild(pixelElement);
        pixelRefs.push(pixelElement);
      });

      root.appendChild(gridEl);
      setLayerVisibility();

      frozenGrid.pixels.forEach(function (pixel, index) {
        var pixelElement = pixelRefs[index];
        if (!pixelElement) return;

        var content = document.createElement("div");
        content.className = "pixel-swap__pixel-content";
        content.style.left = -pixel.left + "px";
        content.style.top = -pixel.top + "px";
        content.style.width = frozenGrid.width + "px";
        content.style.height = frozenGrid.height + "px";
        var originX = pixel.left + frozenGrid.size / 2;
        var originY = pixel.top + frozenGrid.size / 2;
        content.style.transformOrigin = originX + "px " + originY + "px";

        content.appendChild(pixelSource.cloneNode(true));
        pixelElement.replaceChildren(content);

        var timing = {
          duration: pixelMs,
          delay: pixel.offset * spread,
          easing: "linear",
          fill: "both",
        };
        if (typeof pixelElement.animate === "function") {
          animations.push(pixelElement.animate(keyframes.window, timing));
          animations.push(content.animate(keyframes.content, timing));
        }
      });

      timerId = window.setTimeout(function () {
        finishTransition(to);
      }, total);
    }

    function maybeStartTransition() {
      if (transition) return;
      var next = desiredActive();
      if (next === shownActive) return;
      if (!box.width || !box.height) measure();
      transition = { to: next, grid: currentGrid() };
      runTransition();
    }

    function requestActive(next) {
      if (controlledActive === undefined) {
        if (internalActive === next && (!transition || transition.to === next)) {
          return;
        }
        internalActive = next;
      }
      if (typeof onActiveChange === "function") onActiveChange(next);

      if (transition) {
        if (transition.to === next) return;
        clearTransitionArtifacts();
      }
      maybeStartTransition();
    }

    root.setActive = function (next) {
      controlledActive = next;
      if (transition && transition.to !== next) clearTransitionArtifacts();
      maybeStartTransition();
    };

    if (trigger === "hover") {
      root.addEventListener("pointerenter", function (e) {
        if (e.pointerType === "touch") return;
        if (leaveTimer) {
          window.clearTimeout(leaveTimer);
          leaveTimer = 0;
        }
        requestActive(true);
      });
      root.addEventListener("pointerleave", function (e) {
        if (e.pointerType === "touch") return;
        // Debounce leave so the edge near Craft/Comfort/Local doesn't thrash
        if (leaveTimer) window.clearTimeout(leaveTimer);
        leaveTimer = window.setTimeout(function () {
          leaveTimer = 0;
          requestActive(false);
        }, 140);
      });
      root.addEventListener(
        "click",
        function () {
          if (window.matchMedia && window.matchMedia("(hover: hover)").matches) return;
          requestActive(!desiredActive());
        },
        { passive: true }
      );
      root.setAttribute("role", "button");
      root.setAttribute(
        "aria-label",
        root.getAttribute("data-aria-label") || "Reveal shop highlights"
      );
      root.tabIndex = 0;
    } else if (trigger === "click") {
      root.setAttribute("role", "button");
      root.setAttribute(
        "aria-label",
        root.getAttribute("data-aria-label") || "Reveal shop highlights"
      );
      root.tabIndex = 0;
      root.addEventListener("click", function () {
        requestActive(!desiredActive());
      });
      root.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          requestActive(!desiredActive());
        }
      });
    }

    function measure() {
      var width = root.clientWidth;
      var height = root.clientHeight;
      if (!width || !height) return;
      if (box.width === width && box.height === height) return;
      box = { width: width, height: height };
      gridSnapshot = currentGrid();
    }

    measure();
    setLayerVisibility();

    var ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(function () {
            measure();
          })
        : null;
    if (ro) ro.observe(root);
    window.addEventListener("resize", measure, { passive: true });

    return {
      root: root,
      setActive: root.setActive,
      destroy: function () {
        stopAnimations();
        if (ro) ro.disconnect();
        window.removeEventListener("resize", measure);
        if (root.parentNode) root.parentNode.removeChild(root);
      },
    };
  }

  function initMissionPixelSwap() {
    var mount = document.getElementById("cc-mission-swap");
    if (!mount || typeof PixelSwap !== "function") return;
    if (mount.getAttribute("data-pixel-ready") === "true") return;

    var first = mount.querySelector("[data-pixel-first]");
    var second = mount.querySelector("[data-pixel-second]");
    if (!first || !second) return;

    first.removeAttribute("hidden");
    second.removeAttribute("hidden");
    var firstNode = first;
    var secondNode = second;
    first.parentNode && first.parentNode.removeChild(first);
    second.parentNode && second.parentNode.removeChild(second);

    PixelSwap(mount, {
      firstContent: firstNode,
      secondContent: secondNode,
      pixelSize: 96,
      gap: 0,
      pixelRadius: 0,
      pixelSpin: 0,
      pixelScale: 0.28,
      duration: 750,
      pixelDuration: 320,
      pattern: "random",
      randomness: 0.18,
      fade: true,
      trigger: "hover",
      aspectRatio: "auto",
      className: "cc-mission-swap",
    });
    mount.setAttribute("data-pixel-ready", "true");

    if (window.ClassicCuts && typeof window.ClassicCuts.getOpenStatus === "function") {
      var status = window.ClassicCuts.getOpenStatus();
      var nodes = mount.querySelectorAll("[data-cc-hours-status]");
      for (var i = 0; i < nodes.length; i++) {
        nodes[i].textContent = status.text;
        nodes[i].classList.toggle("is-open", status.isOpen);
        nodes[i].classList.toggle("is-closed", !status.isOpen);
        nodes[i].setAttribute("data-open", status.isOpen ? "true" : "false");
      }
    }
  }

  global.PixelSwap = PixelSwap;
  global.ClassicCutsPixelSwap = { init: initMissionPixelSwap };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMissionPixelSwap);
  } else {
    initMissionPixelSwap();
  }
  // Late pass in case another script rewrites the about block
  window.setTimeout(initMissionPixelSwap, 0);
  window.addEventListener("load", initMissionPixelSwap);
})(typeof window !== "undefined" ? window : this);
