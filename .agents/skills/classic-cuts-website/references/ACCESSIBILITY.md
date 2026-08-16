# Accessibility

## Strengths observed in code

- Landmark structure and aria labels on primary/mobile nav  
- Hamburger `aria-expanded` / `aria-controls`  
- Mobile nav `aria-hidden` + `inert` (with tabindex fallback)  
- Escape closes mega + mobile  
- `:focus-visible` outlines (page-aware colors)  
- `.cc-sr-only` utility  
- Form controls inherit font; apply photo remove buttons labeled  
- Booking loading `role="status"`; fallback exposes phone link  
- `prefers-reduced-motion` respected for reveals and hero video  
- Touch-friendly control sizes (~44px) on key CTAs/hamburger  

## Gaps / unverified

- No automated axe/WCAG audit claimed in repo  
- Mega menu is hover/focus driven — keyboard path exists via focusin but not a full disclosure button pattern  
- Some decorative images use empty alt (OK); audit new images  
- Contrast on cream-on-black is intentional; mid-reveal opacity avoided by design  
- Duplicated chrome can drift (inconsistent labels across pages)  
- Third-party embed accessibility depends on BookLocal  

## Rules when changing UI

1. Prefer buttons for actions, links for navigation  
2. Do not remove focus styles  
3. Keep reduced-motion paths  
4. Do not claim WCAG conformance without a fresh audit  
