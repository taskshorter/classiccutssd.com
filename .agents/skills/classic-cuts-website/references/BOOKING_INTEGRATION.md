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
3. Custom element: `<booklocal-booking publishable-key … primary-color background-color radius font-family>`  
4. Inline script sets `publishable-key` and `api-base` from `CC_BOOKLOCAL`  
5. Loading status: `#cc-book-widget-loading`  
6. Failure: `#cc-book-widget-fallback` (phone CTA) on script `onerror` or ~12s timeout if custom element never registers  

## Branding passthrough

Embed themed to site: ink primary, white background, Lato, ~10px radius — keeps checkout visually related to Classic Cuts.

## Responsive

Booking stage CSS (`cc-book.css`) wraps the widget; aside collapses on narrow viewports. Validate embed does not overflow horizontally.

## Ownership checklist

| Change | Where |
|--------|-------|
| Book CTA copy/placement | This site |
| Embed colors / shell layout | This site |
| Services available to book / payments | BookLocal |
| Publishable key / API origin | `book.html` config (coordinate with BookLocal deploy) |

## Demo note

`book.html` may show “Demo experience · Test payments enabled” while using test publishable keys — do not remove without confirming production key cutover.
