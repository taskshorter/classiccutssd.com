# Navigation

## Structure

Primary IA (desktop + mobile):

Home · Barbers (mega) · Services · Gallery · Contact · Apply

Conversion shortcuts:

- Announce: `tel:` phone  
- Mega “Book & Visit”: `/book`, call, directions, Instagram  
- Mobile actions: Book Now + Call  

## Implementation

| Piece | Files |
|-------|-------|
| Markup | Duplicated in each HTML page |
| Behavior | `assets/js/cc-nav.js` |
| Styles | `assets/css/cc-nav.css` (+ chrome); compact Barbers dropdown in `assets/css/cc-mega-barbers.css` (loaded after cc-nav.css on every page; non-blocking on the homepage, whose bundle is `cc-home-app.css`) |

## Desktop mega

- `.has-mega` + `.cc-mega[data-mega="barbers"]`  
- Open on mouseenter/focusin ≥768px; delayed close; Escape closes  
- Backdrop click closes  
- Barbers panel is a compact white sheet: headshot + name per barber (4 across, 2 rows), "View all barbers" link, hairline-separated "Book & Visit" column. Headshots are the existing `assets/images/barbers/*` files; a barber without a unique approved photo (Tammy) shows an initial. Images are lazy and warmed on first pointer/focus entry to the nav bar

## Mobile drawer

- `.cc-hamburger` toggles `body.nav-open`  
- `aria-expanded`, `aria-controls`, `aria-hidden` / `inert` when supported  
- Nested `.cc-mega-mobile` for barbers  
- Link click closes drawer on narrow viewports  

## Consistency rule

Nav link changes require updating **all** HTML files that include the chrome. There is no shared template engine yet.

## Active states

Body page classes (e.g. `cc-page-home`, `cc-page-book`) drive focus color and page-specific CSS — keep class accurate when copying chrome between pages.
