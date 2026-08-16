# SEO

## Implemented

| Capability | Where |
|------------|-------|
| Unique `<title>` + meta description | Per HTML page |
| Canonical URLs | Absolute `https://classiccutssd.com/...` on key pages |
| Open Graph | `og:title`, `og:description`, `og:image`(s), `og:url`, `og:site_name` |
| LocalBusiness JSON-LD | Injected by `cc-business.js` (`@type: BarberShop`) |
| Clean URLs | `vercel.json` rewrites + 301 from Weebly filenames |
| `robots.txt` | `Allow: /` + Sitemap directive |
| `llms.txt` | Machine-readable summary (verify NAP consistency) |
| Semantic landmarks | `header`, `nav`, `main`, `footer`, section labels |

## Structured data fields

From `BUSINESS`: name, phone, postal address, geo, hours, aggregateRating, sameAs socials, areaServed.

Image URL in JSON-LD points at `/assets/images/brand/logo.png`.

## Gaps / risks (do not claim fixed)

- **No checked-in `sitemap.xml`** despite robots Sitemap line — PARTIAL  
- Multiple `og:image` tags on home (some paths may 404 if jpg variants missing)  
- Meta keywords still present (legacy; low value)  
- Address string drift risk: `llms.txt` historically differed from `cc-business.js` (“Ln” vs “Way”)  
- Service/menu prices on site vs BookLocal demo catalog may diverge by design  

## Local SEO practices in use

- Neighborhood in titles/descriptions (Mission Valley, San Diego)  
- NAP in announce, footer, contact, book aside  
- Directions + maps links  
- Review rating surfaced in JSON-LD (keep numbers honest with source)  

## When editing pages

Keep title/description/canonical/og:url aligned with the **public** rewrite path (`/book` not `/book.html`).
