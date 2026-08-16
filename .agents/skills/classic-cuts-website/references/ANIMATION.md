# Animation

## Intentional motions (shipped)

1. **Scroll reveal** (`cc-motion.js` + `cc-motion.css`) — translateY in; opacity stays 1 (contrast-safe)  
2. **Hero scroll fade** — `--cc-hero-fade` darkens hero on scroll (`cc-business.js`)  
3. **Home effects** — BounceCards, PixelSwap, reviews carousel, services menu interactions (deferred CSS via `media="print" onload`)  

## Constraints

- Skip reveals for hero, chrome, gallery grid, and `booklocal-booking`  
- Skip elements already in first screen  
- Honor `prefers-reduced-motion: reduce` (no reveals; no hero video)  
- Clear `will-change` after reveal completes  

## Guidance for new motion

- Prefer transform/opacity over layout-affecting animation  
- Do not animate the booking embed internals  
- Do not block first paint on effect CSS/JS  
- If motion does not clarify hierarchy or delight a section’s purpose, omit it  
