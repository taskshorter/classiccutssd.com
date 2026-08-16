# Brand

## Positioning

Premium neighborhood barbershop: modern cuts, fades, beard work, hot towel shaves. Mission Valley / San Diego local identity. Walk-ins welcome; online booking primary CTA.

## Visual personality

- High-contrast **black / cream** on home and book; white pages for services/contact/profiles
- Display serif (Abril Fatface) for brand authority; clean sans for UI
- Photography-forward: real shop work in gallery/webp; brand logo as hero signal
- Motion is present but restrained (reveal, selective video, effect components on home)

## Brand signals on first viewport (home)

1. Fixed announce: neighborhood + phone + walk-ins  
2. Logo as dominant hero mark (not a tiny nav-only logo)  
3. Short supporting line  
4. Primary **Book Now** + secondary call CTA  
5. Full-bleed video/poster behind content  

Removing the nav should still read as Classic Cuts.

## Canonical business facts

Single source: `assets/js/cc-business.js` → `window.ClassicCuts.BUSINESS`.

Includes: display name, phone fields, address suite, maps/directions URLs, social URLs, review links, rating/reviewCount (used in JSON-LD), weekly hours map.

**When NAP or hours change:** update `cc-business.js` first, then HTML announce/footer/contact blocks that hardcode the same strings, then `llms.txt` if still used.

## Voice

Direct, confident, local. Avoid marketplace/generic SaaS copy. Prefer “Book your next cut” over product jargon.

## Do not invent

Do not invent awards, ratings, or hours that contradict `cc-business.js` / page copy.
