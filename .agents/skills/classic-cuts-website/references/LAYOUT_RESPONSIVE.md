# Layout & responsive

## Primary breakpoints

| Width | Behavior |
|-------|----------|
| `≤560px` | Tighter announce typography |
| `≤767px` | Mobile nav (hamburger), stacked legacy columns, hero mobile treatment, **no hero video autoplay** |
| `≥768px` | Desktop mega menu hover/focus |
| `≤900px` | Additional home section stacking (see `cc-home.css`) |
| `≥981px` | Apply page sticky pitch behavior (`cc-apply.js`) |

Treat **767px** as the main mobile/desktop split for chrome and hero media.

## Chrome

- Fixed announce + fixed header; content offset via `--cc-chrome-h`
- `cc-business.js` syncs `--cc-announce-h` via ResizeObserver so nav offset stays accurate when announce wraps

## Mobile content principles (as implemented)

- Hamburger 44×44 touch target  
- Mobile drawer: full IA + nested barber links + Book / Call actions  
- Hero fills remaining viewport (`100svh` / `100dvh` minus chrome); min-heights prevent collapse  
- Buttons wrap; CTAs keep ≥44px height  
- `overflow-x: hidden` to prevent Weebly leftover horizontal scroll  

## Tablet

Often inherits desktop nav (≥768) with tightened section grids. Verify mega menu and two-column book layout at ~768–1024.

## Book page

- Desktop: aside + booking panel two-column stage  
- Narrow: stacks so booking panel remains usable; embed must not force page overflow  

## Anti-patterns to avoid

- Desktop-only mega menu without mobile equivalents  
- Hero video on mobile (bandwidth + reduced-motion)  
- Hardcoding announce height without measuring wrap  
