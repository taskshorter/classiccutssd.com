# Failure modes (Classic Cuts)

| Failure | Why it happens | Prevention | Validation |
|---------|----------------|------------|------------|
| Booking embed blank | `embed.js` blocked, wrong origin, key mismatch | Keep loading + phone fallback; timeout shows fallback | Load `/book` throttled / offline; confirm call CTA |
| Embed overflows mobile | Absolute widths inside widget or shell | Constrain `.cc-book-widget-shell`; test 375px | Horizontal scroll check |
| CTA points at dead booking | Legacy Squire vs `/book` drift | Primary CTAs → `/book` only | Grep CTAs for external book URLs |
| NAP inconsistency | Hardcoded HTML + `llms.txt` diverge from `cc-business.js` | Edit business JS first; sync HTML | Diff phone/address strings |
| Mega nav broken after copy | Chrome duplicated per page | Update all pages or introduce shared include later | Click Barbers on 3+ routes |
| Hero video tanks mobile | Autoplay ignored constraints | Keep `cc-hero-video.js` mobile/reduced-motion gates | Throttle 3G + phone UA |
| CLS from fonts/images | Missing sizes / late fonts | Preload logo/font; width/height on imgs | Lighthouse CLS |
| Announce covers content | `--cc-announce-h` stale | Keep ResizeObserver sync | Wrap announce text on narrow |
| Motion hurts vestibular users | Reveals ignore preference | `prefers-reduced-motion` short-circuit | OS reduce-motion on |
| SEO soft-404 paths | Rewrite/redirect mismatch | Keep `vercel.json` pairs in sync | Request clean + legacy URLs |
| Heavy asset shipped | Original video linked | `.vercelignore` + never reference `.orig` | Network panel on home |
| Agent “fixes” BookLocal here | Boundary confusion | Refuse backend/booking logic in this repo | Code review |

Global reusable versions of these patterns live in `custom-business-websites` — keep Classic Cuts specifics here.
