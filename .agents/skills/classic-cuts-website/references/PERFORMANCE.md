# Performance

## Strategies in production source

| Area | Approach |
|------|----------|
| Critical CSS | Inlined in `index.html` for chrome + hero |
| Fonts | Self-hosted woff2; preload key Montserrat; `font-display: swap` |
| Deferred CSS | BounceCards / PixelSwap / reviews / services-menu via `media="print" onload` |
| Scripts | `defer` on site JS; BookLocal embed `async` |
| Third-party | Squire only after interaction (`cc-third-party.js`) |
| Images | webp gallery; lazy below fold; logo preload |
| Video | Poster LCP; desktop-only autoplay; compressed mp4 |
| Caching | Vercel `Cache-Control` immutable year for `/assets/*` |
| Motion | Transform reveals; skip first-screen nodes |

## Risks

- Homepage still pulls substantial CSS (`cc-home-app.css` / home styles) after critical block  
- Effect libraries (PixelSwap) are CPU-heavy — keep deferred  
- Booking embed is a third-party critical path on `/book`  
- Large unoptimized originals (e.g. `hero.orig.mp4`) must not be linked from pages  
- Duplicate chrome markup increases HTML weight across pages  

## Validation (manual)

- Lighthouse / WebPageTest on home + `/book` after meaningful changes  
- Check LCP element is poster/logo, not full video on mobile  
- Confirm no layout shift from announce height (ResizeObserver sync)  
