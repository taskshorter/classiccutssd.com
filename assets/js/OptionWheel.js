/**
 * OptionWheel — vanilla port of React Bits OptionWheel
 * https://reactbits.dev
 */
(function (global) {
  "use strict";

  var DEFAULT_ITEMS = [
    "Ambient",
    "House",
    "Techno",
    "Jazz",
    "Lo-Fi",
    "Synthwave",
    "Trance",
    "Funk",
    "Disco",
    "Hip-Hop",
    "Chillwave",
    "Drum & Bass"
  ];

  function merge(opts) {
    return {
      items: opts.items || DEFAULT_ITEMS,
      defaultSelected: opts.defaultSelected != null ? opts.defaultSelected : 3,
      onChange: opts.onChange || null,
      textColor: opts.textColor || "#a6a6a6",
      activeColor: opts.activeColor || "#ffffff",
      side: opts.side || "left",
      fontSize: opts.fontSize != null ? opts.fontSize : 3,
      spacing: opts.spacing != null ? opts.spacing : 1.4,
      curve: opts.curve != null ? opts.curve : 1,
      tilt: opts.tilt != null ? opts.tilt : 6,
      blur: opts.blur != null ? opts.blur : 2,
      fade: opts.fade != null ? opts.fade : 0.25,
      minOpacity: opts.minOpacity != null ? opts.minOpacity : 0.05,
      smoothing: opts.smoothing != null ? opts.smoothing : 200,
      inset: opts.inset != null ? opts.inset : 80,
      loop: !!opts.loop,
      draggable: opts.draggable !== false,
      soundUrl: opts.soundUrl || "",
      soundVolume: opts.soundVolume != null ? opts.soundVolume : 0.5,
      className: opts.className || ""
    };
  }

  function OptionWheel(container, options) {
    if (!container) throw new Error("OptionWheel: container required");
    var cfg = merge(options || {});
    var remPx =
      typeof window !== "undefined"
        ? parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
        : 16;

    var root = document.createElement("div");
    root.setAttribute("role", "listbox");
    root.tabIndex = 0;
    root.setAttribute("aria-label", "Option wheel");
    root.className =
      "option-wheel" +
      (cfg.side === "right" ? " option-wheel--right" : "") +
      (cfg.className ? " " + cfg.className : "");
    root.style.setProperty("--ow-text-color", cfg.textColor);
    root.style.setProperty("--ow-active-color", cfg.activeColor);
    root.style.setProperty("--ow-font-size", cfg.fontSize + "rem");
    root.style.setProperty("--ow-inset", cfg.inset + "px");

    var itemEls = [];
    cfg.items.forEach(function (label, index) {
      var el = document.createElement("div");
      el.setAttribute("role", "option");
      el.className = "option-wheel__item";
      el.textContent = label;
      el.addEventListener("click", function () {
        handleItemClick(index);
      });
      root.appendChild(el);
      itemEls.push(el);
    });

    container.appendChild(root);

    var pos = cfg.defaultSelected;
    var target = cfg.defaultSelected;
    var selected = cfg.defaultSelected;
    var rafId = null;
    var lastTs = 0;
    var wheelTimer = null;
    var drag = null;
    var dragMoved = false;
    var audio = null;
    var audioUrl = "";
    var lastTick = 0;

    function liveCfg() {
      return {
        count: cfg.items.length,
        items: cfg.items,
        rowH: Math.max(cfg.fontSize * cfg.spacing * remPx, 1),
        curve: cfg.curve,
        tilt: cfg.tilt,
        blur: cfg.blur,
        fade: cfg.fade,
        minOpacity: cfg.minOpacity,
        side: cfg.side,
        loop: cfg.loop,
        smoothing: cfg.smoothing,
        draggable: cfg.draggable,
        soundUrl: cfg.soundUrl,
        soundVolume: cfg.soundVolume
      };
    }

    function playTick() {
      var c = liveCfg();
      if (!c.soundUrl) return;
      var now = performance.now();
      if (now - lastTick < 70) return;
      lastTick = now;
      if (!audio || audioUrl !== c.soundUrl) {
        audio = new Audio(c.soundUrl);
        audio.preload = "auto";
        audioUrl = c.soundUrl;
      }
      audio.volume = Math.min(Math.max(c.soundVolume, 0), 1);
      audio.currentTime = 0;
      var p = audio.play();
      if (p && p.catch) p.catch(function () {});
    }

    function runFrame(now) {
      var dt = Math.min((now - lastTs) / 1000, 0.05);
      lastTs = now;
      var c = liveCfg();
      var tau = Math.max(c.smoothing, 1) / 1000;
      var k = 1 - Math.exp(-dt / tau);

      var next = pos + (target - pos) * k;
      var settled = Math.abs(target - next) < 0.001;
      if (settled) next = target;
      pos = next;

      var n = c.count;
      var mirror = c.side === "right" ? -1 : 1;
      var tiltRad = (c.tilt * Math.PI) / 180;
      var R = tiltRad > 0.0005 ? c.rowH / tiltRad : 0;

      for (var i = 0; i < n; i++) {
        var el = itemEls[i];
        if (!el) continue;
        var d = i - next;
        if (c.loop && n > 1) {
          d = ((d % n) + n) % n;
          if (d > n / 2) d -= n;
        }
        var dist = Math.abs(d);
        var x = 0;
        var y = d * c.rowH;
        var rot = 0;
        if (R > 0) {
          var ang = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, d * tiltRad));
          y = R * Math.sin(ang);
          x = -mirror * R * (1 - Math.cos(ang)) * c.curve;
          rot = (mirror * ang * 180) / Math.PI;
        }
        el.style.transform =
          "translate(" +
          x.toFixed(2) +
          "px, calc(" +
          y.toFixed(2) +
          "px - 50%)) rotate(" +
          rot.toFixed(3) +
          "deg)";
        el.style.opacity = String(Math.max(c.minOpacity, 1 - dist * c.fade));
        el.style.filter = c.blur > 0 ? "blur(" + (dist * c.blur).toFixed(2) + "px)" : "none";
        el.style.setProperty("--ow-p", Math.max(0, 1 - Math.min(dist, 1)).toFixed(4));
      }

      rafId = settled ? null : requestAnimationFrame(runFrame);
    }

    function startLoop() {
      if (rafId != null) cancelAnimationFrame(rafId);
      lastTs = performance.now();
      rafId = requestAnimationFrame(runFrame);
    }

    function applyTarget(value, snap) {
      var c = liveCfg();
      var v = value;
      if (!c.loop) v = Math.min(Math.max(v, 0), Math.max(c.count - 1, 0));
      if (snap) v = Math.round(v);
      target = v;
      var idx = ((Math.round(v) % c.count) + c.count) % c.count;
      if (idx !== selected) {
        selected = idx;
        itemEls.forEach(function (el, i) {
          el.setAttribute("aria-selected", i === idx ? "true" : "false");
          el.classList.toggle("option-wheel__item--selected", i === idx);
        });
        if (typeof cfg.onChange === "function") cfg.onChange(idx, c.items[idx]);
        playTick();
      }
      startLoop();
    }

    function handleItemClick(index) {
      if (dragMoved) return;
      var c = liveCfg();
      var cur = target;
      var d = index - (((cur % c.count) + c.count) % c.count);
      if (c.loop && c.count > 1) {
        if (d > c.count / 2) d -= c.count;
        else if (d < -c.count / 2) d += c.count;
      }
      applyTarget(cur + d, true);
    }

    function onWheel(e) {
      e.preventDefault();
      var c = liveCfg();
      var delta = e.deltaMode === 1 ? e.deltaY * 24 : e.deltaY;
      var step = Math.max(-1, Math.min(1, delta / c.rowH));
      applyTarget(target + step, false);
      if (wheelTimer) clearTimeout(wheelTimer);
      wheelTimer = setTimeout(function () {
        applyTarget(target, true);
      }, 140);
    }

    function onPointerDown(e) {
      if (!liveCfg().draggable) return;
      drag = { y: e.clientY, start: target, id: e.pointerId };
      dragMoved = false;
      root.classList.add("option-wheel--dragging");
    }

    function onPointerMove(e) {
      if (!drag) return;
      var dy = e.clientY - drag.y;
      if (!dragMoved && Math.abs(dy) > 4) {
        dragMoved = true;
        try {
          root.setPointerCapture(drag.id);
        } catch (err) {}
      }
      if (dragMoved) applyTarget(drag.start - dy / liveCfg().rowH, false);
    }

    function onPointerEnd() {
      if (!drag) return;
      drag = null;
      root.classList.remove("option-wheel--dragging");
      if (dragMoved) applyTarget(target, true);
    }

    function onKeyDown(e) {
      var delta = null;
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") delta = -1;
      else if (e.key === "ArrowDown" || e.key === "ArrowRight") delta = 1;
      if (delta == null) return;
      e.preventDefault();
      applyTarget(Math.round(target) + delta, true);
    }

    root.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerup", onPointerEnd);
    root.addEventListener("pointercancel", onPointerEnd);
    root.addEventListener("keydown", onKeyDown);

    // Initial layout + selection
    itemEls.forEach(function (el, i) {
      el.setAttribute("aria-selected", i === selected ? "true" : "false");
      el.classList.toggle("option-wheel__item--selected", i === selected);
    });
    applyTarget(cfg.defaultSelected, true);

    return {
      destroy: function () {
        if (rafId != null) cancelAnimationFrame(rafId);
        if (wheelTimer) clearTimeout(wheelTimer);
        if (audio) audio.pause();
        root.removeEventListener("wheel", onWheel);
        root.removeEventListener("pointerdown", onPointerDown);
        root.removeEventListener("pointermove", onPointerMove);
        root.removeEventListener("pointerup", onPointerEnd);
        root.removeEventListener("pointercancel", onPointerEnd);
        root.removeEventListener("keydown", onKeyDown);
        if (root.parentNode) root.parentNode.removeChild(root);
      },
      setSelected: function (index) {
        applyTarget(index, true);
      }
    };
  }

  global.OptionWheel = OptionWheel;
})(typeof window !== "undefined" ? window : this);
