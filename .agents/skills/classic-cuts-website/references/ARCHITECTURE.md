# Architecture

## System shape

```text
Browser
  → classiccutssd.com (static HTML/CSS/JS on Vercel)
       → marketing pages (home, barbers, services, gallery, contact, apply, profiles)
       → /book shell embeds BookLocal <booklocal-booking>
            → booking.fpdesigner.com /embed.js + API (external)
```

Classic Cuts owns brand, navigation, SEO, and conversion framing. BookLocal owns availability, checkout, and payment.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | None — multi-page static HTML |
| Styles | Hand-authored CSS (`assets/css/cc-*.css` + effect CSS) |
| Scripts | IIFE vanilla JS (`assets/js/cc-*.js` + effect modules) |
| Package manager | None (no `package.json`) |
| Host | Vercel static |
| Routing | File HTML + `vercel.json` redirects/rewrites |

## Page model

Each public URL maps to one HTML file. Clean paths are rewrites; legacy Weebly filenames redirect permanently.

Shared chrome (announce bar, header, mega nav, mobile nav, footer) is **duplicated per HTML file** — not a shared layout engine. When changing nav links, update every page (or introduce a build step later; not implemented).

## Shared runtime modules

| Module | Role |
|--------|------|
| `cc-business.js` | NAP, hours, open-status, JSON-LD, announce height, hero fade, scroll-top |
| `cc-nav.js` | Mega menu + mobile drawer |
| `cc-services.js` | Canonical service menu data |
| `cc-barbers-data.js` | Barber roster data for listings |
| `cc-motion.js` | Scroll reveal (transform-only) |
| `cc-hero-video.js` | Desktop-only autoplay; mobile/reduced-motion = poster |
| `cc-third-party.js` | Legacy Squire widget — deferred until user interaction |
| `cc-home-defer.js` | Homepage deferred enhancements |
| `cc-apply.js` | Apply form photo dropzone UX |
| Effect scripts | BounceCards, PixelSwap, GradientWaves, OptionWheel, reviews carousel |

## Ownership boundary (critical)

| Concern | Owner |
|---------|-------|
| Visual brand, copy, SEO, gallery | This website |
| Booking UX shell around embed | This website (`book.html`, `cc-book.css`) |
| Slot selection, payment, confirmation | BookLocal |
| Staff POS / inventory / gift cards | BookLocal (not this repo) |

Do not duplicate BookLocal business logic here.
