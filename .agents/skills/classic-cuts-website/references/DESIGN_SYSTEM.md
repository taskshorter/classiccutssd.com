# Design system

Derived from `cc-base.css`, `cc-chrome.css`, `cc-home.css`, and button patterns.

## Tokens (semantic)

| Token | Typical value | Use |
|-------|---------------|-----|
| `--cc-ink` | `#0a0a0a` | Announce bar, dark surfaces |
| `--cc-cream` | `#f5ebeb` | Text on dark / home accent |
| Body text | `#2a2a2a` | Light pages |
| Heading | `#111111` | Light pages |
| Light surface | `#ffffff` | Default body / nav bar |
| Dark surface | `#000` / `#0a0a0a` | Home, book, some heroes |
| Open status | `#3dba7a` | Hours “open” |
| Closed / alert | `#c45c5c` | Hours “closed” |

Chrome height:

- `--cc-announce-h` (~36px desktop; taller on small screens)
- `--cc-nav-h` (~48px)
- `--cc-chrome-h` = announce + nav (site padding-top)

## Typography

| Role | Family | Notes |
|------|--------|-------|
| Display / headings | Abril Fatface (+ Quattrocento fallback) | Weight 400 |
| Body | Lato (+ Quattrocento Sans) | 16px / 1.55 base |
| UI / labels / buttons | Montserrat | Uppercase tracking common |
| Buttons | Montserrat 600, ~12px, letter-spacing ~0.08em | |

Fonts are **self-hosted** woff2 under `assets/fonts/` with `font-display: swap`. Homepage inlines critical `@font-face` for LCP.

## Layout

- Content container: `.cc-container` max-width **1100px**, horizontal padding 20px
- Legacy Weebly blocks: `.cc-legacy` max-width 960px
- Overflow-x hidden on `html`/`body`

## Buttons (`.cc-btn`)

Hierarchy:

| Class | Role |
|-------|------|
| `--light` | Primary on dark backgrounds |
| `--dark` | Primary on light backgrounds |
| `--ghost-light` / `--ghost-dark` | Secondary outline |
| `--quiet` | Tertiary |

Hero uses `.cc-hero-btn` / `--primary` / `--ghost` (pill, min-height 44px).

Mobile drawer actions: `.cc-mobile-actions` full-width stacked buttons.

## Radius / motion defaults

- Buttons often **pill** (`border-radius: 999px`) or ~8px (legacy Weebly buttons)
- Link/button color transitions ~200ms
- Scroll reveals: transform only (see ANIMATION.md)

## Cards

Used for interactive or scannable collections (team cards, look cards, value cards, gallery items) — not as a default for every section. Prefer section rhythm over card chrome when content is editorial.
