# Component patterns

Not a React component library — **CSS class + small JS modules**.

## Site chrome

| Pattern | Classes / module |
|---------|------------------|
| Announce | `.cc-announce` |
| Header / nav | `.cc-header`, `.cc-nav`, `.cc-mega`, `.cc-mobile-nav` |
| Footer | `.cc-footer` / `.footer-wrap` |
| Buttons | `.cc-btn` variants; `.cc-hero-btn` on home |

## Content blocks (home / marketing)

| Pattern | Notes |
|---------|-------|
| `.cc-hero` | Full-bleed media + centered brand stack |
| `.cc-lookbook` / `.cc-look-card` | Editorial looks |
| `.cc-value-card` / `.cc-value-grid` | Value props |
| `.cc-trust` | Social proof / ratings strip |
| `.cc-visit-panel` | Location / hours / visit |
| `.cc-team-*` | Team listing |
| BounceCards / PixelSwap mounts | Progressive enhancement |

## Booking

| Pattern | Notes |
|---------|-------|
| `.cc-book-aside__intro` | Booking H1 + one-line lead, inside the left branding column |
| `.cc-book-stage` / `.cc-book-aside` / `.cc-book-panel` | Two-column booking shell: branding aside + fixed-height embed card |
| `booklocal-booking` | External custom element |

## Data-driven UI

- Services rendered/enhanced from `ClassicCuts` services data (`cc-services.js`)  
- Barbers data module for roster consistency  
- Hours via `[data-cc-hours-status]`  

## Conventions

- Prefix site classes with `cc-`  
- Page body class `cc-page-*` for theme overrides  
- Prefer progressive enhancement; core content should work if effect JS fails  
