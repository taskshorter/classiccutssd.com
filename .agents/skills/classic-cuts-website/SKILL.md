---
name: classic-cuts-website
description: >
  Project-specific architecture, design system, responsive behavior,
  BookLocal booking embed, performance, SEO, components, Vercel deployment,
  and engineering conventions for the Classic Cuts custom marketing website.
  Use when modifying, debugging, reviewing, or extending classiccutssd.com.
---

# Classic Cuts Website

Version-controlled knowledge for the **Classic Cuts** custom marketing site (`classiccutssd.com`). **Current source files win** over this Skill if they disagree — fix the Skill, not correct production markup/CSS/JS.

## What this project is

A **static multi-page marketing website** (HTML + CSS + vanilla JS) for Classic Cuts Barbershop in Mission Valley, San Diego.

- Presentation, brand, SEO, and conversion UX live **here**
- Online booking / payments / POS live in **BookLocal** (external), embedded on `/book`
- Migrated off Weebly; clean URLs via Vercel rewrites

**Not** BookLocal. Do not add booking backend, Stripe secrets, tenant DB logic, or POS flows to this repo.

## Source-of-truth order

1. Current HTML / CSS / JS in this repo  
2. `vercel.json` (routes, cache headers)  
3. Git history (architecture decisions; ignore abandoned experiments)  
4. This Skill  
5. Cursor chat history (secondary)  
6. Comments / inference  

## Before editing

1. Confirm identity: remote `classiccutssd.com`, static HTML pages — not MultiTenantBookingSystem.  
2. Open [references/REPOSITORY_MAP.md](references/REPOSITORY_MAP.md).  
3. Load only the references needed for the task (table below).  
4. Check [references/IMPLEMENTED_VS_PLANNED.md](references/IMPLEMENTED_VS_PLANNED.md) — do not ship planned items as if done.  
5. Prefer shared config in `assets/js/cc-business.js`, `cc-services.js`, `cc-barbers-data.js` over copy-pasting NAP/hours/menu.

## Progressive loading

| Task | Read first | Then |
|------|------------|------|
| Routes / pages / assets | [REPOSITORY_MAP.md](references/REPOSITORY_MAP.md) | [ARCHITECTURE.md](references/ARCHITECTURE.md) |
| Colors / type / buttons | [DESIGN_SYSTEM.md](references/DESIGN_SYSTEM.md) | [BRAND.md](references/BRAND.md) |
| Layout / breakpoints | [LAYOUT_RESPONSIVE.md](references/LAYOUT_RESPONSIVE.md) | [NAVIGATION.md](references/NAVIGATION.md) |
| Hero / CTAs | [HERO_AND_CTA.md](references/HERO_AND_CTA.md) | [BOOKING_INTEGRATION.md](references/BOOKING_INTEGRATION.md) |
| BookLocal embed | [BOOKING_INTEGRATION.md](references/BOOKING_INTEGRATION.md) | [FAILURE_MODES.md](references/FAILURE_MODES.md) |
| Images / video | [IMAGERY_MEDIA.md](references/IMAGERY_MEDIA.md) | [PERFORMANCE.md](references/PERFORMANCE.md) |
| Motion | [ANIMATION.md](references/ANIMATION.md) | [ACCESSIBILITY.md](references/ACCESSIBILITY.md) |
| SEO / structured data | [SEO.md](references/SEO.md) | — |
| Deploy / cache | [DEPLOYMENT.md](references/DEPLOYMENT.md) | — |
| Why we chose X | [ARCHITECTURAL_DECISIONS.md](references/ARCHITECTURAL_DECISIONS.md) | — |
| Manual QA | [TESTING_QA.md](references/TESTING_QA.md) | — |

## Non-negotiable invariants

1. **Marketing site ≠ booking system** — BookLocal owns booking/payment; this site shells and embeds.  
2. **Canonical NAP/hours** — edit `assets/js/cc-business.js` first; keep HTML footers/announce bars consistent.  
3. **Published service menu** — `assets/js/cc-services.js` is the shop menu for the site; BookLocal catalog may differ (demo).  
4. **Primary book CTA → `/book`** — not a marketplace redirect; phone remains a first-class fallback.  
5. **Clean public paths** — `/barbers`, `/services`, `/gallery`, `/contact`, `/apply`, `/book` via `vercel.json`; keep `.html` files as rewrite targets.  
6. **Do not commit secrets** — no Stripe secret keys, env values, or `.env*` in git. Publishable embed config may appear in `book.html` (document location, do not invent new keys in Skill text).  
7. **Respect `prefers-reduced-motion`** for hero video and scroll reveals.  
8. **Mobile breakpoint `767px`** is the primary nav/hero/video split; do not break hamburger/touch targets.

## Validation

No `package.json` / npm scripts. Before calling a change done:

- Spot-check affected pages locally or via preview  
- Confirm `/book` embed loads + phone fallback still present  
- Confirm no horizontal overflow at ~375px and ~1280px  
- See [TESTING_QA.md](references/TESTING_QA.md)

## Related Skills (load only if relevant)

| Skill | When |
|-------|------|
| `project-bootstrap` | Opening unfamiliar repos / choosing Skills |
| `custom-business-websites` | Generalizing a lesson for other client sites |
| `production-saas-patterns` | Only at the BookLocal **system** boundary — never to redesign this static site |
| `booklocal-platform` | Inside the BookLocal repo only |

## Maintenance

After durable architecture changes, update this Skill per `.cursor/rules/classic-cuts-skill-maintenance.mdc`.
