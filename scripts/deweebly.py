#!/usr/bin/env python3
"""Strip Weebly/editmysite chrome from all Classic Cuts HTML pages."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

BOOK = "https://getsquire.com/discover/barbershop/classic-cuts-barbershop-san-diego"
FORM_EMAIL = "myclassiccut@gmail.com"
CACHE = "20260813w"

NAV = [
    ("home", "index.html", "Home", None),
    (
        "barbers",
        "barber-shop.html",
        "Barbers",
        [
            ("raylopez.html", "Ray Lopez"),
            ("jayoceguera.html", "Jay Oceguera"),
            ("romero.html", "Romero Jorge"),
            ("colton.html", "Colton Ballew"),
            ("willjaimes.html", "Will Jaimes"),
            ("wellington-199912.html", "Tammy"),
            ("wellington-199912-210611.html", "Tevel"),
        ],
    ),
    ("services", "barbershopservices.html", "Services", None),
    ("gallery", "haircut-gallery.html", "Gallery", None),
    ("contact", "barber-shop-contact.html", "Contact", None),
    ("apply", "barber-shop-contact-269206.html", "Barber Application", None),
]

PAGE_META = {
    "index.html": ("cc-page-home", "home", True),
    "barber-shop.html": ("cc-page-barbers", "barbers", True),
    "barbershopservices.html": ("cc-page-services", "services", False),
    "haircut-gallery.html": ("cc-page-gallery", "gallery", False),
    "barber-shop-contact.html": ("cc-page-contact", "contact", False),
    "barber-shop-contact-269206.html": ("cc-page-apply", "apply", False),
    "raylopez.html": ("cc-page-profile", "barbers", False),
    "jayoceguera.html": ("cc-page-profile", "barbers", False),
    "romero.html": ("cc-page-profile", "barbers", False),
    "colton.html": ("cc-page-profile", "barbers", False),
    "willjaimes.html": ("cc-page-profile", "barbers", False),
    "wellington-199912.html": ("cc-page-profile", "barbers", False),
    "wellington-199912-210611.html": ("cc-page-profile", "barbers", False),
}

EXTRA_HEAD = {
    "index.html": f"""
<link rel="stylesheet" href="assets/css/cc-home.css?v={CACHE}" />
<link rel="stylesheet" href="assets/css/BounceCards.css?v={CACHE}" />
<link rel="stylesheet" href="assets/css/PixelSwap.css" />
<link rel="stylesheet" href="assets/css/cc-reviews-carousel.css" />
<link rel="stylesheet" href="assets/css/cc-services-menu.css?v={CACHE}" />
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js" defer></script>
<script src="assets/js/BounceCards.js" defer></script>
<script src="assets/js/PixelSwap.js" defer></script>
<script src="assets/js/cc-reviews-carousel.js" defer></script>
<script src="assets/js/cc-services-menu.js" defer></script>
""",
    "barber-shop.html": """
<link rel="stylesheet" href="assets/css/OptionWheel.css" />
<link rel="stylesheet" href="assets/css/cc-barbers.css" />
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&display=swap" rel="stylesheet" />
<script src="assets/js/OptionWheel.js" defer></script>
""",
}


def nav_items(active: str, mobile: bool = False) -> str:
    parts = []
    for key, href, label, children in NAV:
        cls = "is-active" if key == active else ""
        apply = " cc-nav-apply" if key == "apply" else ""
        li_cls = f' class="{cls}{apply}"'.replace(' class=" "', "")
        if cls or apply:
            li_cls = f' class="{" ".join(x for x in [cls, apply.strip()] if x)}"'
        else:
            li_cls = ""
        block = f'      <li{li_cls}>\n        <a href="{href}">{label}</a>\n'
        if children:
            sub = "\n".join(
                f'          <li><a href="{c_href}">{c_label}</a></li>'
                for c_href, c_label in children
            )
            block += f'        <ul class="cc-nav__sub">\n{sub}\n        </ul>\n'
            if mobile and key == "barbers":
                block += """        <div class="cc-mobile-actions">
          <a class="cc-btn cc-btn--dark" href="{BOOK}" target="_blank" rel="noopener noreferrer">Book Now</a>
          <a class="cc-btn cc-btn--ghost-dark" href="tel:6196845871">Call (619) 684-5871</a>
        </div>
""".replace("{BOOK}", BOOK)
        block += "      </li>\n"
        parts.append(block)
    return "".join(parts)


def announce() -> str:
    return """  <div class="cc-announce" role="banner">
    <span>Mission Valley</span>
    <span class="cc-announce__sep" aria-hidden="true">·</span>
    <a href="tel:6196845871">(619) 684-5871</a>
    <span class="cc-announce__sep" aria-hidden="true">·</span>
    <span>Walk-ins Welcome</span>
  </div>
"""


def header(active: str) -> str:
    return f"""  <header class="cc-header">
    <div class="cc-header__bar">
      <button class="cc-hamburger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="cc-mobile-nav">
        <span></span>
      </button>
    </div>
    <nav class="cc-header__nav" aria-label="Primary">
      <div class="cc-container">
        <ul class="cc-nav">
{nav_items(active)}
        </ul>
      </div>
    </nav>
  </header>
  <nav class="cc-mobile-nav" id="cc-mobile-nav" aria-label="Mobile" aria-hidden="true">
    <ul class="cc-nav">
{nav_items(active, mobile=True)}
    </ul>
  </nav>
"""


def footer() -> str:
    return f"""  <footer class="footer-wrap cc-footer">
    <div class="cc-footer__inner">
      <div>
        <h4>Classic Cuts</h4>
        <p>8555 Station Village Way #D<br>San Diego, CA 92108<br>Mission Valley</p>
        <p><a href="tel:6196845871">(619) 684-5871</a></p>
      </div>
      <div>
        <h4>Explore</h4>
        <p>
          <a href="index.html">Home</a><br>
          <a href="barbershopservices.html">Services</a><br>
          <a href="barber-shop.html">Barbers</a><br>
          <a href="haircut-gallery.html">Gallery</a><br>
          <a href="barber-shop-contact.html">Contact</a>
        </p>
      </div>
      <div>
        <h4>Book &amp; Follow</h4>
        <p>
          <a href="{BOOK}" target="_blank" rel="noopener noreferrer">Book Now</a><br>
          <a href="https://www.instagram.com/myclassiccut/" target="_blank" rel="noopener noreferrer">Instagram @myclassiccut</a><br>
          <a href="https://www.facebook.com/myclassiccut/" target="_blank" rel="noopener noreferrer">Facebook</a><br>
          <a href="barber-shop-contact-269206.html">Barber Application</a>
        </p>
      </div>
      <p class="cc-footer__copy">© 2026 Classic Cuts Barbershop. All rights reserved.</p>
    </div>
  </footer>
"""


def extract_head_meta(html: str) -> str:
    m = re.search(r"<head[^>]*>(.*?)</head>", html, re.I | re.S)
    if not m:
        return "<title>Classic Cuts Barbershop</title>"
    head = m.group(1)
    keep = []
    for tag in re.finditer(
        r"<(?:title|meta)[^>]*>.*?</title>|<(?:title|meta)[^>]*/?>",
        head,
        re.I | re.S,
    ):
        chunk = tag.group(0)
        if re.search(r"editmysite|weebly|wsite|viewport|Content-Type|charset", chunk, re.I):
            if re.search(r"viewport|Content-Type|charset|name=\"description\"|name=\"keywords\"|property=\"og:|name=\"robots\"|<title", chunk, re.I):
                if "editmysite" in chunk.lower() or "weebly" in chunk.lower():
                    continue
                keep.append(chunk)
            continue
        keep.append(chunk)
    # dedupe viewport
    out = []
    seen_viewport = False
    for k in keep:
        if "viewport" in k.lower():
            if seen_viewport:
                continue
            seen_viewport = True
        out.append(k)
    if not any("viewport" in x.lower() for x in out):
        out.insert(0, '<meta name="viewport" content="width=device-width, initial-scale=1.0"/>')
    if not any("<title" in x.lower() for x in out):
        out.insert(0, "<title>Classic Cuts Barbershop</title>")
    return "\n".join(out)


def extract_squire(html: str) -> str:
    m = re.search(
        r'<script type="text/javascript">\s*!function\(e,t\).*?getsquire\.com.*?</script>',
        html,
        re.I | re.S,
    )
    return m.group(0) if m else (
        '<script type="text/javascript"> !function(e,t){var i=e.createElement("script"),sa="setAttribute";'
        'i.src="https://widget.getsquire.com/widget.js?"+Date.now(),i[sa]("defer",""),i[sa]("type","text/javascript"),'
        'i[sa]("brand",t.brand),i[sa]("x-squire-inline-enabled",t.inline||!1),e.head.appendChild(i)}'
        '(document,{brand:"20b0c665-7cde-4084-a62e-25c3fd3f95d2",inline:true}); </script>'
    )


def extract_main(html: str) -> str:
    # Prefer wsite-content inner HTML
    m = re.search(
        r'<div[^>]*id="wsite-content"[^>]*>(.*?)</div>\s*</div>\s*<!-- end content-wrap -->|'
        r'<div[^>]*id="wsite-content"[^>]*>(.*?)<div class="footer-wrap|'
        r'<main[^>]*id="wsite-content"[^>]*>(.*?)</main>|'
        r'<div[^>]*id="cc-content"[^>]*>(.*?)</div>\s*</div>',
        html,
        re.I | re.S,
    )
    if m:
        for g in m.groups():
            if g is not None:
                content = g
                break
        else:
            content = ""
        # If we matched footer-wrap path, content already stops before footer
        if "footer-wrap" in html[m.start():m.start()+80]:
            pass
        return content.strip()

    # Fallback: content-wrap
    m = re.search(
        r'<div class="content-wrap"[^>]*>(.*?)</div>\s*(?:<!-- end content-wrap -->|</div>\s*<div class="footer-wrap|<div class="nav mobile-nav|<footer)',
        html,
        re.I | re.S,
    )
    if m:
        inner = m.group(1)
        inner = re.sub(
            r'^[\s\S]*?<div[^>]*id="wsite-content"[^>]*>', "", inner, count=1, flags=re.I
        )
        return inner.strip()

    raise RuntimeError("Could not extract main content")


def extract_ga(html: str) -> str:
    # Keep Google Analytics only (not Weebly snowday)
    parts = []
    gtag = re.search(
        r"<!-- Global site tag \(gtag\.js\).*?</script>\s*<script>\s*window\.dataLayer[\s\S]*?gtag\('config'[^;]*;\s*</script>",
        html,
        re.I,
    )
    if gtag:
        parts.append(gtag.group(0))
    return "\n".join(parts)


CONTACT_FORM = f"""
<form class="cc-form" action="https://formsubmit.co/{FORM_EMAIL}" method="POST">
  <input type="hidden" name="_subject" value="Classic Cuts — Contact form" />
  <input type="hidden" name="_captcha" value="false" />
  <input type="text" name="_honey" style="display:none" tabindex="-1" autocomplete="off" />
  <div class="cc-form__row cc-form__row--2">
    <div>
      <label for="cc-first">First name *</label>
      <input id="cc-first" name="first_name" type="text" required />
    </div>
    <div>
      <label for="cc-last">Last name *</label>
      <input id="cc-last" name="last_name" type="text" required />
    </div>
  </div>
  <div>
    <label for="cc-phone">Phone *</label>
    <input id="cc-phone" name="phone" type="tel" required />
  </div>
  <div>
    <label for="cc-email">Email *</label>
    <input id="cc-email" name="email" type="email" required />
  </div>
  <div>
    <label for="cc-comment">Comment *</label>
    <textarea id="cc-comment" name="comment" required></textarea>
  </div>
  <button class="cc-form__submit" type="submit">Submit</button>
  <p class="cc-form__note">Sends to {FORM_EMAIL}. You’ll get a confirmation email on first use via FormSubmit.</p>
</form>
"""

APPLY_FORM = f"""
<form class="cc-form" action="https://formsubmit.co/{FORM_EMAIL}" method="POST">
  <input type="hidden" name="_subject" value="Classic Cuts — Barber Application" />
  <input type="hidden" name="_captcha" value="false" />
  <input type="text" name="_honey" style="display:none" tabindex="-1" autocomplete="off" />
  <div class="cc-form__row cc-form__row--2">
    <div>
      <label for="cc-a-first">First name *</label>
      <input id="cc-a-first" name="first_name" type="text" required />
    </div>
    <div>
      <label for="cc-a-last">Last name *</label>
      <input id="cc-a-last" name="last_name" type="text" required />
    </div>
  </div>
  <div>
    <label for="cc-a-phone">Phone *</label>
    <input id="cc-a-phone" name="phone" type="tel" required />
  </div>
  <div>
    <label for="cc-a-email">Email *</label>
    <input id="cc-a-email" name="email" type="email" required />
  </div>
  <div>
    <label for="cc-a-exp">Experience / notes *</label>
    <textarea id="cc-a-exp" name="experience" required></textarea>
  </div>
  <button class="cc-form__submit" type="submit">Submit Application</button>
  <p class="cc-form__note">Sends to {FORM_EMAIL} via FormSubmit (confirm the email on first submission).</p>
</form>
"""


def replace_weebly_forms(content: str, name: str) -> str:
    if "formSubmit.php" not in content and "wsite-form" not in content:
        return content
    if name == "barber-shop-contact.html":
        content = re.sub(
            r'<form[^>]*formSubmit\.php[\s\S]*?</form>\s*<div[^>]*g-recaptcha[\s\S]*?</div>',
            CONTACT_FORM,
            content,
            count=1,
            flags=re.I,
        )
    elif name == "barber-shop-contact-269206.html":
        content = re.sub(
            r'<form[^>]*formSubmit\.php[\s\S]*?</form>\s*<div[^>]*g-recaptcha[\s\S]*?</div>',
            APPLY_FORM,
            content,
            count=1,
            flags=re.I,
        )
    # Strip remaining weebly forms if any
    content = re.sub(
        r'<form[^>]*formSubmit\.php[\s\S]*?</form>',
        "<!-- form replaced — see contact/apply pages -->",
        content,
        flags=re.I,
    )
    return content


def clean_content(content: str, name: str) -> str:
    content = replace_weebly_forms(content, name)

    # Homepage hero → clean markup
    if name == "index.html":
        content = re.sub(
            r'<div class="wsite-section-wrap">\s*<div class="wsite-section[^"]*cc-hero[^"]*"[\s\S]*?</div>\s*</div>',
            """<section class="cc-hero" aria-label="Classic Cuts intro">
  <video class="cc-hero-video" autoplay muted loop playsinline aria-hidden="true">
    <source src="assets/videos/hero.mp4" type="video/mp4" />
  </video>
  <div class="cc-hero-fade" aria-hidden="true"></div>
  <div class="cc-hero__content">
    <div class="cc-container">
      <div class="cc-hero__inner">
        <span class="cc-hero-logo">
          <img src="assets/images/brand/logo.png?250" alt="Classic Cuts Barbershop" width="920" height="320" />
        </span>
        <p class="cc-hero-line">Mission Valley&rsquo;s local barbershop for modern cuts, fades &amp; shaves.</p>
        <div class="cc-hero-ctas">
          <a class="cc-hero-btn cc-hero-btn--primary" href="{BOOK}" target="_blank" rel="noopener noreferrer">Book Now</a>
          <a class="cc-hero-btn cc-hero-btn--ghost" href="tel:6196845871">Call (619) 684-5871</a>
        </div>
      </div>
    </div>
  </div>
</section>""".replace("{BOOK}", BOOK),
            content,
            count=1,
            flags=re.I,
        )

    # Cloudflare email protection → plain mailto
    content = re.sub(
        r'<a[^>]*cdn-cgi/l/email-protection[^>]*>.*?</a>',
        f'<a href="mailto:{FORM_EMAIL}">{FORM_EMAIL}</a>',
        content,
        flags=re.I | re.S,
    )
    content = re.sub(
        r'<a[^>]*class="__cf_email__"[^>]*>.*?</a>',
        f'<a href="mailto:{FORM_EMAIL}">{FORM_EMAIL}</a>',
        content,
        flags=re.I | re.S,
    )
    content = content.replace("[email&#160;protected]", FORM_EMAIL)
    content = content.replace("[email protected]", FORM_EMAIL)

    # Broken social hrefs like index.html'/facebook
    content = re.sub(
        r"href='index\.html'/facebook\.com/myclassiccut'",
        "href='https://www.facebook.com/myclassiccut'",
        content,
    )
    content = re.sub(
        r"href='index\.html'/instagram\.com/myclassiccut'",
        "href='https://www.instagram.com/myclassiccut'",
        content,
    )
    content = re.sub(
        r'href="//facebook\.com/myclassiccut"',
        'href="https://www.facebook.com/myclassiccut"',
        content,
    )
    content = re.sub(
        r'href="//instagram\.com/myclassiccut"',
        'href="https://www.instagram.com/myclassiccut"',
        content,
    )

    # Drop zotabox if embedded in content (usually head)
    content = re.sub(
        r'<script[^>]*>\(function\(d,s,id\)\{var z=d\.createElement\(s\);[\s\S]*?zotabox[\s\S]*?</script>',
        "",
        content,
        flags=re.I,
    )

    return content.strip()


def build_page(path: Path) -> None:
    name = path.name
    if name not in PAGE_META:
        print("skip", name)
        return
    body_class, active, has_custom_footer = PAGE_META[name]
    html = path.read_text(encoding="utf-8", errors="replace")
    meta = extract_head_meta(html)
    squire = extract_squire(html)
    ga = extract_ga(html)
    try:
        main = extract_main(html)
    except RuntimeError as e:
        print("FAIL", name, e)
        return
    main = clean_content(main, name)
    extra = EXTRA_HEAD.get(name, "")

    # Detect page-specific already-linked custom assets for non-index pages
    page_css = []
    if name == "haircut-gallery.html":
        page_css.append(f'<link rel="stylesheet" href="assets/css/cc-home.css?v={CACHE}" />')
    if "GradientWaves" in html:
        page_css.append('<link rel="stylesheet" href="assets/css/GradientWaves.css" />')
        page_css.append('<script src="assets/js/GradientWaves.js" defer></script>')
    if "cc-barbers" in html and name != "barber-shop.html":
        pass
    # barber-shop script file may be inline in html - check
    if name == "barber-shop.html":
        # keep scripts referenced in EXTRA; also pull inline barber init if present at bottom
        inline = re.search(
            r"<script(?![^>]*src=)[^>]*>[\s\S]*?cc-barber|OptionWheel|barbers[\s\S]*?</script>",
            html,
            re.I,
        )
        # We'll append deferred files; barber-shop often has inline config at end - extract
        inline_all = re.findall(
            r"<script(?![^>]*src=)([^>]*)>([\s\S]*?)</script>",
            html,
            re.I,
        )
        keep_inline = []
        for attrs, body in inline_all:
            if any(
                k in body
                for k in (
                    "OptionWheel",
                    "cc-barber",
                    "barbers",
                    "ClassicCuts",
                    "BARBERS",
                )
            ):
                if "weebly" in body.lower() or "_W." in body or "editmysite" in body.lower():
                    continue
                keep_inline.append(f"<script>{body}</script>")
        barber_inline = "\n".join(keep_inline)
    else:
        barber_inline = ""

    # For profile/services/gallery/contact - keep legacy content class
    legacy_class = "" if name in ("index.html", "barber-shop.html") else " cc-legacy"

    foot = footer() if (has_custom_footer or "cc-footer" in html or "footer-wrap" in html) else footer()

    # Prefer existing custom footer from home content if already inside main
    if 'class="footer-wrap cc-footer"' in main or "cc-footer__inner" in main:
        # footer accidentally in main — strip
        main = re.sub(
            r'<div class="footer-wrap cc-footer"[\s\S]*$</div>\s*',
            "",
            main,
            flags=re.I,
        )

    new_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
{meta}
<meta charset="utf-8" />
{squire}
<link rel="stylesheet" href="assets/css/cc-base.css?v={CACHE}" />
<link rel="stylesheet" href="assets/css/cc-chrome.css?v={CACHE}" />
{extra}
{chr(10).join(page_css)}
<script src="assets/js/cc-business.js?v={CACHE}" defer></script>
<script src="assets/js/cc-nav.js?v={CACHE}" defer></script>
</head>
<body class="{body_class}">
{announce()}
<div class="cc-site">
{header(active)}
  <main id="cc-content" class="cc-main{legacy_class}">
{main}
  </main>
{foot}
</div>
{barber_inline}
{ga}
</body>
</html>
"""
    # tidy multiple blank lines
    new_html = re.sub(r"\n{3,}", "\n\n", new_html)
    path.write_text(new_html, encoding="utf-8")
    print("ok", name, "bytes", path.stat().st_size)


def main() -> None:
    for path in sorted(ROOT.glob("*.html")):
        build_page(path)


if __name__ == "__main__":
    main()
