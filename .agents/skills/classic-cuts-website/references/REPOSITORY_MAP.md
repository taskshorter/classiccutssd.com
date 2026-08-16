# Repository map

## Root

| Path | Purpose |
|------|---------|
| `index.html` | Home |
| `barber-shop.html` | Barbers index → `/barbers` |
| `raylopez.html`, `jayoceguera.html`, `romero.html`, `colton.html`, `willjaimes.html`, `wellington-199912.html`, `wellington-199912-210611.html` | Barber profiles |
| `barbershopservices.html` | Services → `/services` |
| `haircut-gallery.html` | Gallery → `/gallery` |
| `barber-shop-contact.html` | Contact → `/contact` |
| `barber-shop-contact-269206.html` | Apply → `/apply` |
| `book.html` | Booking shell → `/book` |
| `vercel.json` | Redirects, rewrites, asset cache headers |
| `robots.txt` | Allow all; references sitemap URL |
| `llms.txt` | LLM-oriented site summary (verify NAP vs `cc-business.js`) |
| `favicon.ico` | Favicon |
| `scripts/` | One-off migration/upgrade Python helpers (not runtime) |
| `.deweebly-backup/` | Weebly migration backup (gitignored) |

## Assets

```text
assets/
  css/     cc-base, cc-chrome, cc-nav, cc-home*, cc-book, page CSS, effect CSS
  js/      cc-* site scripts + effect components
  fonts/   Self-hosted woff2 (Abril Fatface, Lato, Montserrat, …)
  images/
    brand/      logo, posters, favicons, social icons
    barbers/    portraits
    gallery/    work photos (mostly webp)
  videos/  hero.mp4 (+ poster stills); services media
```

## Public routes (`vercel.json`)

| Public path | File |
|-------------|------|
| `/` | `index.html` |
| `/barbers` | `barber-shop.html` |
| `/barbers/ray-lopez` … `/barbers/tevel` | profile HTML files |
| `/services` | `barbershopservices.html` |
| `/gallery` | `haircut-gallery.html` |
| `/contact` | `barber-shop-contact.html` |
| `/apply` | `barber-shop-contact-269206.html` |
| `/book` | `book.html` |

Legacy `*.html` paths 301 to the clean paths above.

## Config / env

- No app env required for static serving
- Local `.env*` / `.vercel` are gitignored — do not document values in Skills
- Book embed origin + publishable key configured in `book.html` (`window.CC_BOOKLOCAL`)

## Not present

- `package.json`, Node build, React/Next, Tailwind
- Automated test suite
- Checked-in `sitemap.xml` (robots references one — gap)
