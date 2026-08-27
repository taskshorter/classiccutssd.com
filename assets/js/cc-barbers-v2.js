(function () {
  'use strict';

  var BARBERS = [
    {
      slug: 'ray-lopez',
      name: 'Ray Lopez',
      specialty: 'Consistent craft · Owner',
      intro: 'A Classic Cuts staple — Ray delivers confident, consistent cuts with the craft that keeps clients coming back.',
      tags: ['Classic cuts', 'Fades', 'Everyday maintenance'],
      photo: 'assets/images/barbers/ray.jpg',
      profile: 'raylopez.html',
      portfolio: ['assets/images/gallery/dsc-0114-copy.jpg']
    },
    {
      slug: 'jay-oceguera',
      name: 'Jay Oceguera',
      specialty: 'Skin fades · Gentlemen’s cuts',
      intro: 'Skin fades, taper fades, gentlemen’s cuts, and hot towel shaves. Jay keeps it classic with a modern edge.',
      tags: ['Skin fades', 'Taper fades', 'Hot towel shaves'],
      photo: 'assets/images/barbers/jay.jpg',
      profile: 'jayoceguera.html',
      portfolio: ['assets/images/gallery/dsc-0477-copy.jpg', 'assets/images/gallery/dsc-0136-copy.jpg']
    },
    {
      slug: 'romero-jorge',
      name: 'Romero Jorge',
      specialty: 'Clean tapers · Bold styles',
      intro: 'From clean tapers to bold styles, Romero brings steady hands and a welcoming vibe to every appointment.',
      tags: ['Tapers', 'Bold styles', 'Lineups'],
      photo: 'assets/images/barbers/romero.png',
      profile: 'romero.html',
      portfolio: [
        'assets/images/gallery/dsc-0749-copy.jpg',
        'assets/images/gallery/dsc-0781-copy.jpg',
        'assets/images/gallery/dsc-0815-copy.jpg',
        'assets/images/gallery/img-4470.jpg'
      ]
    },
    {
      slug: 'colton-ballew',
      name: 'Colton Ballew',
      specialty: 'Clean fades · Sharp lines',
      intro: 'Clean fades, sharp lines, and a chill chair — Colton brings precision and personality to every cut.',
      tags: ['Fades', 'Sharp lines', 'Detail work'],
      photo: 'assets/images/barbers/colton.png',
      profile: 'colton.html',
      portfolio: ['assets/images/gallery/colton-05.png']
    },
    {
      slug: 'will-jaimes',
      name: 'Will Jaimes',
      specialty: 'Detail-focused fades',
      intro: 'Detail-focused and easygoing — Will dials in fades and finishes that look sharp walking out and hold up all week.',
      tags: ['Fades', 'Finishes', 'Week-ready cuts'],
      photo: 'assets/images/barbers/will.png',
      profile: 'willjaimes.html',
      portfolio: [
        'assets/images/gallery/dsc-0693-4-copy.jpg',
        'assets/images/gallery/dsc-0423-copy.jpg',
        'assets/images/gallery/dsc-0442-copy.jpg'
      ]
    },
    {
      slug: 'tammy',
      name: 'Tammy',
      specialty: 'Fresh cuts · Clean finishes',
      intro: 'Fresh cuts and clean finishes — Tammy helps you leave looking sharp and ready for the day.',
      tags: ['Fresh cuts', 'Clean finishes'],
      photo: null,
      profile: 'wellington-199912.html',
      portfolio: ['assets/images/gallery/dsc00216.jpg']
    },
    {
      slug: 'tevel',
      name: 'Tevel',
      specialty: 'Walk-ins · Bookings',
      intro: 'Fresh cuts and clean finishes — Tevel is ready when you need a sharp look, whether you book ahead or walk in.',
      tags: ['Walk-ins', 'Clean finishes'],
      photo: 'assets/images/barbers/tevel.jpg',
      profile: 'wellington-199912-210611.html',
      portfolio: ['assets/images/gallery/dsc00113.jpg']
    }
  ];

  function boot() {
    var roster = document.getElementById('cc-select-roster');
    var portraitWrap = document.getElementById('cc-select-portrait');
    var photoA = document.getElementById('cc-select-photo-a');
    var photoB = document.getElementById('cc-select-photo-b');
    var placeholder = document.getElementById('cc-select-placeholder');
    var infoPanel = document.getElementById('cc-select-info');
    var specialtyEl = document.getElementById('cc-select-specialty');
    var nameEl = document.getElementById('cc-select-name');
    var introEl = document.getElementById('cc-select-intro');
    var tagsEl = document.getElementById('cc-select-tags');
    var bookLink = document.getElementById('cc-select-book');
    var profileLink = document.getElementById('cc-select-profile');
    var portfolioStrip = document.getElementById('cc-select-portfolio-strip');

    if (!roster || !portraitWrap || !infoPanel) return;

    var tabs = Array.prototype.slice.call(roster.querySelectorAll('[role="tab"]'));
    var current = 0;
    var usingA = true;
    var infoTimer = null;

    function reducedMotion() {
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    // Preload every barber photo so swaps never show an empty frame.
    BARBERS.forEach(function (b) {
      if (b.photo) {
        var img = new Image();
        img.src = b.photo;
      }
    });

    function renderPortrait(barber) {
      if (!barber.photo) {
        photoA.classList.remove('is-active');
        photoB.classList.remove('is-active');
        placeholder.classList.add('is-active');
        return;
      }
      placeholder.classList.remove('is-active');

      var incoming = usingA ? photoB : photoA;
      var outgoing = usingA ? photoA : photoB;
      usingA = !usingA;

      incoming.alt = barber.name + ', barber at Classic Cuts';
      incoming.src = barber.photo;
      incoming.classList.add('is-active');
      outgoing.classList.remove('is-active');
    }

    function renderPortfolio(barber) {
      portfolioStrip.innerHTML = '';
      if (!barber.portfolio || !barber.portfolio.length) {
        var empty = document.createElement('p');
        empty.className = 'cc-select__portfolio-empty';
        empty.textContent = 'Portfolio photos for ' + barber.name + ' coming soon.';
        portfolioStrip.appendChild(empty);
        return;
      }
      barber.portfolio.slice(0, 4).forEach(function (src, i) {
        var fig = document.createElement('figure');
        fig.className = 'cc-select__portfolio-item';
        var tilt = (i % 2 === 0 ? -1 : 1) * (2 + (i % 3));
        fig.style.setProperty('--cc-tilt', tilt + 'deg');
        fig.style.setProperty('--cc-delay', (i * 50) + 'ms');
        var img = document.createElement('img');
        img.src = src;
        img.alt = 'Haircut example from ' + barber.name;
        img.loading = 'lazy';
        img.decoding = 'async';
        fig.appendChild(img);
        portfolioStrip.appendChild(fig);
      });
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          portfolioStrip.querySelectorAll('.cc-select__portfolio-item').forEach(function (el) {
            el.classList.add('is-in');
          });
        });
      });
    }

    function renderInfo(barber) {
      specialtyEl.textContent = barber.specialty;
      nameEl.textContent = barber.name;
      introEl.textContent = barber.intro;
      tagsEl.innerHTML = '';
      barber.tags.forEach(function (tag) {
        var li = document.createElement('li');
        li.textContent = tag;
        tagsEl.appendChild(li);
      });
      bookLink.textContent = 'Book with ' + barber.name.split(' ')[0];
      bookLink.setAttribute('aria-label', 'Book an appointment with ' + barber.name);
      profileLink.href = barber.profile;
      profileLink.setAttribute('aria-label', 'View profile for ' + barber.name);
    }

    function selectBarber(index, opts) {
      opts = opts || {};
      if (index === current && !opts.force) return;
      var barber = BARBERS[index];
      if (!barber) return;
      current = index;

      tabs.forEach(function (tab, i) {
        var selected = i === index;
        tab.setAttribute('aria-selected', selected ? 'true' : 'false');
        tab.tabIndex = selected ? 0 : -1;
      });

      if (reducedMotion() || opts.instant) {
        renderPortrait(barber);
        renderInfo(barber);
        renderPortfolio(barber);
        return;
      }

      infoPanel.classList.add('is-leaving');
      renderPortrait(barber);

      if (infoTimer) clearTimeout(infoTimer);
      infoTimer = setTimeout(function () {
        renderInfo(barber);
        renderPortfolio(barber);
        requestAnimationFrame(function () {
          infoPanel.classList.remove('is-leaving');
        });
      }, 160);
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () {
        selectBarber(i);
      });

      tab.addEventListener('keydown', function (e) {
        var lastIndex = tabs.length - 1;
        var targetIndex = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          targetIndex = i === lastIndex ? 0 : i + 1;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          targetIndex = i === 0 ? lastIndex : i - 1;
        } else if (e.key === 'Home') {
          targetIndex = 0;
        } else if (e.key === 'End') {
          targetIndex = lastIndex;
        }
        if (targetIndex !== null) {
          e.preventDefault();
          tabs[targetIndex].focus();
          selectBarber(targetIndex);
        }
      });
    });

    selectBarber(0, { instant: true, force: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
