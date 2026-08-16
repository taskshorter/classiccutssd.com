# Implemented vs planned

Status reflects **current repo source** (not chat plans).

## IMPLEMENTED

- Static multi-page marketing site with shared visual system  
- Clean URL rewrites/redirects on Vercel  
- Home hero with logo-led composition, poster + desktop video  
- Announce bar + fixed nav + mega + mobile drawer  
- Barbers index + individual profile pages  
- Services page + `cc-services.js` menu data  
- Gallery page with webp assets  
- Contact page  
- Apply / barber application UI (`cc-apply.js` photo handling)  
- `/book` BookLocal embed shell with loading + phone fallback  
- JSON-LD LocalBusiness injection  
- Per-page titles, descriptions, canonicals, OG tags  
- Self-hosted fonts + critical CSS path on home  
- Scroll reveals + reduced-motion support  
- Asset cache headers  
- `robots.txt`, `llms.txt`  
- Open-now hours status via `data-cc-hours-status`  

## PARTIAL

- Sitemap: referenced in `robots.txt`, file not present in repo  
- Third-party booking: BookLocal primary; legacy Squire still interaction-loaded  
- NAP consistency: code vs `llms.txt` historically drifted  
- OG images: multiple tags; some extensions may not match files on disk  
- Shared chrome: duplicated markup (no template/build pipeline)  
- BookLocal production key cutover: page may still note demo/test payments  

## PLANNED / NOT IMPLEMENTED (do not document as done)

- Node/React/Next rebuild  
- Automated unit/e2e test suite  
- Shared HTML partials / SSG  
- Removing Squire completely (until code deletes `cc-third-party.js` + dns-prefetch)  
- Checked-in sitemap generator  
- Deep-link barber preselect in embed (CTAs say “Book with X” but href `/book`)  
- Package scripts (`lint`/`test`/`build`)  

When a PLANNED item ships, move it to IMPLEMENTED in the same docs commit.
