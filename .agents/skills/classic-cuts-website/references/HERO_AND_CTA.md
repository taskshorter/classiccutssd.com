# Hero & CTA

## Home hero (first viewport)

Composition (implemented):

1. Brand logo (dominant)  
2. One short supporting line  
3. CTA pair: **Book Now** (`/book`) + Call (`tel:`)  
4. Full-bleed poster/video background  

Critical CSS inlined in `index.html` for announce/header/hero/logo/CTAs so first paint does not wait on full home CSS.

## CTA hierarchy sitewide

| Priority | Action | Pattern |
|----------|--------|---------|
| 1 | Book online | `/book` — primary buttons |
| 2 | Call | `tel:` — secondary / announce / fallback |
| 3 | Visit / directions | Maps links |
| 4 | Social | Instagram / Facebook |

Do not invent a third competing primary on the same viewport.

## Section CTAs

Repeated Book Now rows after lookbook, trust, visit, and team sections — intentional conversion reinforcement, not orphan buttons.

## Book page hero

Separate dark hero: eyebrow (location), H1 “Book Your Next Cut”, lead, then trust strip (Choose / Pick / Book), then embed stage. Phone fallback below/aside if embed fails.

## Profile pages

“Book with {Name}” CTAs still route to `/book` (site-level booking), not deep-linked barber params unless BookLocal embed supports them later.

## Anti-patterns

- Multiple equal-weight primaries  
- Booking CTA that leaves the brand shell for a generic marketplace  
- Hero clutter (stats, hours blocks, address cards) in the first viewport — hours/trust live below the fold on home  
