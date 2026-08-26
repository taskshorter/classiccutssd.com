/**
 * BounceCards — React Bits component ported to vanilla JS + GSAP
 * for the Classic Cuts static homepage.
 *
 * Slow continuous fan drift; pauses on hover for expand/push animation.
 */
(function (window, document) {
  'use strict';

  function getNoRotationTransform(transformStr) {
    var hasRotate = /rotate\([\s\S]*?\)/.test(transformStr);
    if (hasRotate) {
      return transformStr.replace(/rotate\([\s\S]*?\)/, 'rotate(0deg)');
    }
    if (transformStr === 'none') return 'rotate(0deg)';
    return transformStr + ' rotate(0deg)';
  }

  function getPushedTransform(baseTransform, offsetX) {
    var translateRegex = /translate\(([-0-9.]+)px\)/;
    var match = baseTransform.match(translateRegex);
    if (match) {
      var currentX = parseFloat(match[1]);
      var newX = currentX + offsetX;
      return baseTransform.replace(translateRegex, 'translate(' + newX + 'px)');
    }
    return baseTransform === 'none'
      ? 'translate(' + offsetX + 'px)'
      : baseTransform + ' translate(' + offsetX + 'px)';
  }

  function isMobile() {
    return window.matchMedia && window.matchMedia('(max-width: 640px)').matches;
  }

  function prefersReducedMotion() {
    return (
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  function fanMetrics(count) {
    var mobile = isMobile();
    var step = mobile ? 52 : 72;
    var rotations = mobile
      ? [10, -7, 5, -9, 3, -6, 8, -4, 7, -8, 4, -5, 9]
      : [12, -8, 6, -10, 4, -7, 9, -5, 8, -11, 3, -6, 10, -4, 7, -9, 5, -8];
    return { step: step, rotations: rotations, half: ((count - 1) * step) / 2 };
  }

  function wrapX(x, half, step, count) {
    var span = count * step;
    var max = half + step;
    var min = -half - step;
    while (x > max) x -= span;
    while (x < min) x += span;
    return x;
  }

  function transformAt(x, rot) {
    return 'rotate(' + rot + 'deg) translate(' + Math.round(x) + 'px)';
  }

  function mountBounceCards(root, options) {
    if (!root) return;

    var images = options.images || [];
    var count = images.length;
    var enableHover = options.enableHover !== false;
    var animationDelay = options.animationDelay != null ? options.animationDelay : 0.5;
    var animationStagger = options.animationStagger != null ? options.animationStagger : 0.06;
    var easeType = options.easeType || 'elastic.out(1, 0.8)';
    var className = options.className || '';
    var spinPaused = false;
    var spinOffset = 0;
    var hoverIdx = -1;
    var tickerFn = null;
    var hasGsap = typeof gsap !== 'undefined';
    // Slow drift: ~one card-width every ~2.2s
    var spinSpeed = isMobile() ? 18 : 26;

    function size() {
      var vw = Math.max(window.innerWidth || 1200, 320);
      if (isMobile()) {
        return { width: vw, height: 280 };
      }
      return {
        width: options.containerWidth || vw,
        height: options.containerHeight || 380,
      };
    }

    function cardTransform(i, offset) {
      var m = fanMetrics(count);
      var baseX = -m.half + i * m.step;
      var x = wrapX(baseX + offset, m.half, m.step, count);
      var rot = m.rotations[i % m.rotations.length];
      return transformAt(x, rot);
    }

    function snapshotTransforms() {
      var list = [];
      for (var i = 0; i < count; i++) {
        list.push(cardTransform(i, spinOffset));
      }
      return list;
    }

    function paintSpin() {
      if (hoverIdx >= 0) return;
      for (var i = 0; i < count; i++) {
        var el = root.querySelector('.card-' + i);
        if (el) el.style.transform = cardTransform(i, spinOffset);
      }
    }

    function onTick(time, delta) {
      if (spinPaused || prefersReducedMotion()) return;
      // delta is ms; convert to px
      var dt = Math.min(delta || 16, 48) / 1000;
      spinOffset += spinSpeed * dt;
      paintSpin();
    }

    function startSpin() {
      if (prefersReducedMotion()) return;
      if (tickerFn) return;
      tickerFn = onTick;
      gsap.ticker.add(tickerFn);
    }

    function pauseSpin() {
      spinPaused = true;
    }

    function resumeSpin() {
      spinPaused = false;
      hoverIdx = -1;
    }

    function pushSiblings(hoveredIdx) {
      if (!enableHover || !hasGsap) return;
      pauseSpin();
      hoverIdx = hoveredIdx;

      var base = snapshotTransforms();
      var push = isMobile() ? 70 : 110;
      var grow = isMobile() ? 1.18 : 1.28;

      images.forEach(function (_, i) {
        var target = root.querySelector('.card-' + i);
        if (!target) return;
        gsap.killTweensOf(target);
        var baseTransform = base[i] || 'none';

        if (i === hoveredIdx) {
          target.classList.add('is-hovered');
          gsap.to(target, {
            transform: getNoRotationTransform(baseTransform) + ' scale(' + grow + ')',
            zIndex: 80,
            duration: 0.4,
            ease: 'back.out(1.4)',
            overwrite: 'auto',
          });
        } else {
          target.classList.remove('is-hovered');
          var offsetX = i < hoveredIdx ? -push : push;
          var delay = Math.abs(hoveredIdx - i) * 0.035;
          gsap.to(target, {
            transform: getPushedTransform(baseTransform, offsetX),
            zIndex: i + 1,
            duration: 0.4,
            ease: 'back.out(1.4)',
            delay: delay,
            overwrite: 'auto',
          });
        }
      });
    }

    function resetSiblings(shouldResume) {
      if (!enableHover || !hasGsap) {
        if (shouldResume) resumeSpin();
        return;
      }
      var base = snapshotTransforms();
      var pending = count;

      images.forEach(function (_, i) {
        var target = root.querySelector('.card-' + i);
        if (!target) {
          pending -= 1;
          return;
        }
        target.classList.remove('is-hovered');
        gsap.killTweensOf(target);
        gsap.to(target, {
          transform: base[i] || 'none',
          zIndex: i + 1,
          duration: 0.4,
          ease: 'back.out(1.4)',
          overwrite: 'auto',
          onComplete: function () {
            pending -= 1;
            if (pending <= 0 && shouldResume) resumeSpin();
          },
        });
      });

      if (count === 0 && shouldResume) resumeSpin();
    }

    function render() {
      var dims = size();
      spinSpeed = isMobile() ? 18 : 26;

      root.className = ('bounceCardsContainer ' + className).trim();
      root.style.position = 'relative';
      root.style.width = dims.width + 'px';
      root.style.height = dims.height + 'px';
      root.setAttribute('role', 'list');
      root.setAttribute('aria-label', 'Haircut gallery');

      root.innerHTML = images
        .map(function (src, idx) {
          return (
            '<div class="card card-' +
            idx +
            '" role="listitem" style="transform:' +
            cardTransform(idx, 0) +
            ';z-index:' +
            (idx + 1) +
            '" data-idx="' +
            idx +
            '">' +
            '<img class="image" src="' +
            src +
            '" alt="Classic Cuts gallery photo ' +
            (idx + 1) +
            '" loading="lazy" />' +
            '</div>'
          );
        })
        .join('');

      var cards = root.querySelectorAll('.card');

      if (hasGsap && !prefersReducedMotion()) {
        gsap.fromTo(
          cards,
          { scale: 0 },
          {
            scale: 1,
            stagger: animationStagger,
            ease: easeType,
            delay: animationDelay,
            onComplete: startSpin,
          }
        );
      } else {
        root.classList.add('is-static-ready');
      }

      Array.prototype.forEach.call(cards, function (card) {
        var idx = parseInt(card.getAttribute('data-idx'), 10);
        card.addEventListener('mouseenter', function () {
          pushSiblings(idx);
        });
        card.addEventListener('mouseleave', function (e) {
          var next = e.relatedTarget;
          if (next && root.contains(next) && next.closest && next.closest('.card')) {
            return; // moving onto another card — keep paused
          }
        });
        card.addEventListener(
          'focus',
          function () {
            pushSiblings(idx);
          },
          true
        );
        card.addEventListener(
          'blur',
          function (e) {
            var next = e.relatedTarget;
            if (next && root.contains(next)) return;
            resetSiblings(true);
          },
          true
        );
        card.setAttribute('tabindex', '0');
      });

      root.addEventListener('mouseleave', function () {
        resetSiblings(true);
      });
    }

    render();

    var resizeTimer;
    window.addEventListener(
      'resize',
      function () {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(function () {
          var dims = size();
          spinSpeed = isMobile() ? 18 : 26;
          root.style.width = dims.width + 'px';
          root.style.height = dims.height + 'px';
          if (hoverIdx < 0) paintSpin();
        }, 150);
      },
      { passive: true }
    );
  }

  function initHomepageBounceGallery() {
    var root = document.getElementById('cc-bounce-cards');
    if (!root) return;
    if (root.getAttribute('data-bounce-ready') === 'true') return;

    function start() {
      if (root.getAttribute('data-bounce-ready') === 'true') return;
      root.setAttribute('data-bounce-ready', 'true');
      var base = '/assets/images/gallery/';
      var width = Math.max(root.clientWidth || 0, 320);
      mountBounceCards(root, {
        className: 'custom-bounceCards',
        images: [
          base + 'dsc-0378.webp',
          base + 'dsc-0308.webp',
          base + 'dsc-0811.webp',
          base + 'dsc-0423-copy.webp',
          base + 'dsc-0651.webp',
          base + 'dsc-0745-2.webp',
          base + 'dsc-0097-copy.webp',
          base + 'dsc-0211.webp',
          base + 'dsc-1008-copy.webp',
          base + 'dsc-0781-copy.webp',
          base + 'img-1047.webp',
          base + 'dsc-0136-copy.webp',
          base + 'dsc-0220.webp',
          base + 'dsc-0375.webp',
          base + 'dsc-0391.webp',
          base + 'dsc-0445.webp',
          base + 'dsc-0629.webp',
          base + 'dsc-0678.webp',
          base + 'dsc-0682.webp',
          base + 'dsc-0808.webp',
          base + 'dsc-0840.webp',
          base + 'dsc-0093.webp',
        ],
        containerWidth: width,
        containerHeight: 380,
        animationDelay: 0.2,
        animationStagger: 0.04,
        easeType: 'elastic.out(1, 0.5)',
        enableHover: true,
      });
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(
        function (entries) {
          if (!entries.some(function (e) { return e.isIntersecting; })) return;
          io.disconnect();
          requestAnimationFrame(start);
        },
        { rootMargin: '200px 0px' }
      );
      io.observe(root);
    } else {
      window.addEventListener('load', function () {
        requestAnimationFrame(start);
      });
    }
  }

  window.ClassicCutsBounceCards = {
    mount: mountBounceCards,
    init: initHomepageBounceGallery,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomepageBounceGallery);
  } else {
    initHomepageBounceGallery();
  }
})(window, document);
