# Booking integration

## Principle

Classic Cuts website = **marketing shell**. BookLocal = **booking system**.

Do not implement availability, payments, customer auth, or POS inside this repository.

## Where booking is surfaced

| Surface | Behavior |
|---------|----------|
| `/book` (`book.html`) | BookLocal custom element embed |
| Sitewide CTAs | Link to `/book` |
| Phone | Always available fallback |
| Legacy Squire | `cc-third-party.js` loads GetSquire widget only after first user interaction; homepage still dns-prefetches Squire hosts |

**Primary path:** `/book` → BookLocal. Treat Squire as legacy third-party residue until fully removed.

## Embed loading (`book.html`)

1. `window.CC_BOOKLOCAL = { origin, publishableKey }` (values live in page source — do not copy secrets into Skills; rotate via page config).  
2. Async script: `{origin}/embed.js`  
3. Custom element: `<booklocal-booking publishable-key … primary-color background-color radius font-family staff-label="Barber">` (`staff-label` is what this merchant calls staff; the widget defaults to "Staff")  
4. Inline script sets `publishable-key` and `api-base` from `CC_BOOKLOCAL`  
5. Loading status: `#cc-book-widget-loading`  
6. Failure: `#cc-book-widget-fallback` (phone CTA) on script `onerror` or ~12s timeout if custom element never registers  

## Branding passthrough

Embed themed to site: ink primary, white background, Lato, ~10px radius — keeps checkout visually related to Classic Cuts.

## Card photos & subtitles (`assets/js/cc-book-media.js`)

BookLocal's widget renders a service/barber image only when the host supplies one, keyed by the **stable BookLocal catalog id** (`el.media = { services: { [id]: url }, staff: { [id]: { src, subtitle } } }`). This site's join file maps those ids → the site's own entries in `cc-services.js` / `cc-barbers-data.js` and reads the image path (and barber `specialty` as subtitle) from there — **no image paths are repeated, no new assets**.

- Unmapped / failed-to-load images fall back to the widget's initials tile (e.g. Carlos has no roster entry; Tammy is deliberately photo-less because the Barbers page reuses Tevel's picture as a stand-in).
- The ids are the Classic Cuts tenant's catalog ids. If the BookLocal catalog is rebuilt (go-live cutover), re-copy them from `GET {origin}/api/public/catalog?publishableKey=…`; until then cards just show initials.
- Never put Classic Cuts image URLs in BookLocal code; that repo stays merchant-agnostic.

## Booking page layout (`/book`)

The widget is a **five-stage flow** (Service → Barber → Time → Details → Payment) with its own functional stepper, Back/Next footer and calendar. The page must **not** render a second step list or booking heading — `book.html` has only the branding aside (it carries the H1 + lead, so the title shares the photo's width) and the card.

- **Desktop (>900px):** two columns (≈38/62, max 1280px) — branding aside (`.cc-book-aside`: H1, lead, large photo, shop info, all one width, same height as the card) + card (`.cc-book-panel`). Card height comes from `--cc-book-card-h` (≈ one viewport below the fixed chrome, clamped 520–820px). The widget is `height: 100%` inside it; its stage area scrolls internally while stepper/footer stay pinned (the Service grid and the times list are their own inner scrollers). Do not make the page scroll through the form.
- **≤900px:** single column, aside collapses to an identity strip, card is `height: auto` and the page scrolls. The widget footer is `position: sticky`, so `.cc-book-panel` must keep `overflow: visible` there and `body.cc-page-book` uses `overflow-x: clip` (a hidden/auto `body` would defeat sticky).
- Host contract with the widget: `booklocal-booking { height:100%; --booklocal-max-width: none }`, theme via `--booklocal-*` tokens. Everything inside the Shadow DOM (cards, calendar, stages) is **BookLocal**, not this repo.
- Calendar availability comes from BookLocal (`GET /api/public/{slug}/availability`, month counts from the same engine as `/slots`). If that call fails the widget degrades to "pick a date, see its real times".

Validate embed does not overflow horizontally at 375px and that Back/Next stay reachable.

## Ownership checklist

| Change | Where |
|--------|-------|
| Book CTA copy/placement | This site |
| Embed colors / shell layout | This site |
| Services / barbers / availability / payments / stage UI inside the card | BookLocal (`packages/embed`) |
| Publishable key / API origin | `book.html` config (coordinate with BookLocal deploy) |

## Demo note

`book.html` may show “Demo experience · Test payments enabled” while using test publishable keys — do not remove without confirming production key cutover.
