/**
 * Classic Cuts — shared business config + homepage helpers
 */
(function (window, document) {
  'use strict';

  var BOOK_URL =
    'https://getsquire.com/discover/barbershop/classic-cuts-barbershop-san-diego';
  var BUSINESS = {
    name: 'Classic Cuts Barbershop',
    phone: '6196845871',
    phoneDisplay: '(619) 684-5871',
    phoneHref: 'tel:6196845871',
    address1: '8555 Station Village Way',
    suite: '#D',
    city: 'San Diego',
    state: 'CA',
    zip: '92108',
    neighborhood: 'Mission Valley',
    fullAddress: '8555 Station Village Way #D, San Diego, CA 92108',
    mapsUrl:
      'https://maps.google.com/?q=8555+Station+Village+Way,+San+Diego,+CA+92108',
    directionsUrl:
      'https://www.google.com/maps/dir/?api=1&destination=8555+Station+Village+Way,+San+Diego,+CA+92108',
    instagramUrl: 'https://www.instagram.com/myclassiccut/',
    facebookUrl: 'https://www.facebook.com/myclassiccut/',
    bookUrl: BOOK_URL,
    googleReviewUrl: 'https://g.page/r/CdxL_zOjv48rEAE/review',
    yelpUrl: 'https://www.yelp.com/biz/classic-cuts-barber-shop-san-diego-3',
    rating: '5.0',
    reviewCount: '219',
    // 0=Sun … 6=Sat; open/close in decimal hours
    hours: {
      0: null,
      1: { open: 10, close: 20, label: '10 AM – 8 PM' },
      2: { open: 10, close: 20, label: '10 AM – 8 PM' },
      3: { open: 10, close: 20, label: '10 AM – 8 PM' },
      4: { open: 10, close: 20, label: '10 AM – 8 PM' },
      5: { open: 10, close: 20, label: '10 AM – 8 PM' },
      6: { open: 10, close: 18, label: '10 AM – 6 PM' },
    },
    dayNames: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
  };

  function formatHour(h) {
    var hour = Math.floor(h);
    var suffix = hour >= 12 ? 'PM' : 'AM';
    var display = hour % 12;
    if (display === 0) display = 12;
    return display + ':00 ' + suffix;
  }

  function getOpenStatus(now) {
    now = now || new Date();
    var day = now.getDay();
    var current = now.getHours() + now.getMinutes() / 60;
    var today = BUSINESS.hours[day];

    if (today && current >= today.open && current < today.close) {
      return {
        isOpen: true,
        text: 'Open Now · Closes at ' + formatHour(today.close),
      };
    }

    for (var offset = 1; offset <= 7; offset++) {
      var next = new Date(now);
      next.setDate(now.getDate() + offset);
      var nextHours = BUSINESS.hours[next.getDay()];
      if (!nextHours) continue;
      var when = offset === 1 ? 'tomorrow' : BUSINESS.dayNames[next.getDay()];
      return {
        isOpen: false,
        text: 'Closed · Opens ' + when + ' at ' + formatHour(nextHours.open),
      };
    }

    return { isOpen: false, text: 'Closed · Call to book' };
  }

  function injectJsonLd() {
    var existing = document.getElementById('cc-local-business-jsonld');
    if (existing) existing.remove();

    var data = {
      '@context': 'https://schema.org',
      '@type': 'BarberShop',
      name: BUSINESS.name,
      telephone: BUSINESS.phone,
      image: 'assets/images/brand/logo.png',
      address: {
        '@type': 'PostalAddress',
        streetAddress: BUSINESS.address1 + ' ' + BUSINESS.suite,
        addressLocality: BUSINESS.city,
        addressRegion: BUSINESS.state,
        postalCode: BUSINESS.zip,
        addressCountry: 'US',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 32.7739008,
        longitude: -117.1432662,
      },
      url: window.location.origin + window.location.pathname.replace(/[^/]*$/, ''),
      sameAs: [BUSINESS.instagramUrl, BUSINESS.facebookUrl, BUSINESS.yelpUrl],
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '10:00',
          closes: '20:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Saturday',
          opens: '10:00',
          closes: '18:00',
        },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: BUSINESS.rating,
        reviewCount: BUSINESS.reviewCount,
      },
      areaServed: BUSINESS.neighborhood + ', ' + BUSINESS.city,
    };

    var script = document.createElement('script');
    script.id = 'cc-local-business-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  function updateHoursNodes() {
    var status = getOpenStatus();
    var nodes = document.querySelectorAll('[data-cc-hours-status]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      el.textContent = status.text;
      el.classList.toggle('is-open', status.isOpen);
      el.classList.toggle('is-closed', !status.isOpen);
      el.setAttribute('data-open', status.isOpen ? 'true' : 'false');
    }
  }

  function setupScrollTop() {
    var btn = document.querySelector('[data-cc-scroll-top]');
    if (!btn) return;

    function onScroll() {
      if (window.scrollY > 600) btn.classList.add('is-visible');
      else btn.classList.remove('is-visible');
    }

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /** Keep nav/hero offsets in sync with the real announce bar height */
  function syncAnnounceHeight() {
    var announce = document.querySelector('.cc-announce');
    if (!announce) return;

    function measure() {
      var h = Math.round(announce.getBoundingClientRect().height);
      if (h > 0) {
        document.documentElement.style.setProperty('--cc-announce-h', h + 'px');
      }
    }

    measure();
    window.addEventListener('resize', measure, { passive: true });
    if (typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(measure);
      ro.observe(announce);
    }
  }

  /** Hero video dissolves into black as the page scrolls into About */
  function setupHeroScrollFade() {
    var hero = document.querySelector('.cc-hero');
    if (!hero) return;

    var reduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      hero.style.setProperty('--cc-hero-fade', '0');
      return;
    }

    var ticking = false;

    function update() {
      ticking = false;
      var rect = hero.getBoundingClientRect();
      var h = rect.height || 1;
      // 0 while hero fills the viewport; 1 once it's mostly scrolled away
      var progress = Math.min(1, Math.max(0, -rect.top / (h * 0.85)));
      // Ease-in so the dissolve accelerates toward black
      var faded = progress * progress * (3 - 2 * progress); // smoothstep
      hero.style.setProperty('--cc-hero-fade', faded.toFixed(4));
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  function init() {
    injectJsonLd();
    updateHoursNodes();
    syncAnnounceHeight();
    setupScrollTop();
    setupHeroScrollFade();
    window.setInterval(updateHoursNodes, 60000);
  }

  window.ClassicCuts = {
    BUSINESS: BUSINESS,
    getOpenStatus: getOpenStatus,
    BOOK_URL: BOOK_URL,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window, document);
