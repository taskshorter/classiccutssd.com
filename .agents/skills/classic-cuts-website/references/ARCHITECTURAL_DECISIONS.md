# Architectural decisions

## ADR-001 — Custom marketing site separate from BookLocal

| | |
|--|--|
| **Decision** | Keep Classic Cuts as its own static website repository |
| **Reason** | Brand presentation and SEO iterate independently from booking/POS platform |
| **Invariant** | No BookLocal backend, schema, or Stripe secrets in this repo |
| **Files** | Entire site; contrast MultiTenantBookingSystem |

## ADR-002 — Embed booking on `/book` rather than marketplace redirect

| | |
|--|--|
| **Decision** | Shell page embeds `<booklocal-booking>` with branded chrome |
| **Reason** | Customer stays in Classic Cuts experience; phone fallback if embed fails |
| **Invariant** | Primary CTAs point to `/book` |
| **Files** | `book.html`, `assets/css/cc-book.css` |

## ADR-003 — Static HTML + Vercel rewrites (post-Weebly)

| | |
|--|--|
| **Decision** | Multi-page HTML with clean URL rewrites; no SPA framework |
| **Reason** | Preserve SEO content pages; simple deploy; migrate off Weebly paths |
| **Invariant** | `vercel.json` redirect/rewrite pairs stay synchronized |
| **Files** | `vercel.json`, `*.html`, `scripts/deweebly.py` (historical) |

## ADR-004 — Self-hosted fonts + critical CSS on home

| | |
|--|--|
| **Decision** | Host woff2 locally; inline critical chrome/hero CSS on home |
| **Reason** | Reduce third-party font latency; protect LCP |
| **Invariant** | Do not switch LCP fonts to render-blocking CDN without measuring |
| **Files** | `index.html` critical block, `assets/css/cc-fonts.css`, `assets/fonts/` |

## ADR-005 — Poster-first hero video

| | |
|--|--|
| **Decision** | Poster is default experience; video only capable desktop without reduced motion |
| **Reason** | Mobile bandwidth, autoplay policies, LCP |
| **Invariant** | `cc-hero-video.js` gates remain |
| **Files** | `assets/js/cc-hero-video.js`, `assets/videos/hero.mp4` |

## ADR-006 — Canonical business + services JS modules

| | |
|--|--|
| **Decision** | Centralize NAP/hours/JSON-LD and service menu in JS modules |
| **Reason** | Reduce drift across duplicated HTML |
| **Invariant** | Update modules before one-off HTML edits when possible |
| **Files** | `cc-business.js`, `cc-services.js`, `cc-barbers-data.js` |
