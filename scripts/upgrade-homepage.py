#!/usr/bin/env python3
from pathlib import Path
import re

path = Path("/Users/differentbreed/Desktop/Barbershop/classiccutssd.com/index.html")
html = path.read_text()
BOOK = "https://getsquire.com/discover/barbershop/classic-cuts-barbershop-san-diego"

# Business JS
if "cc-business.js" not in html:
    html = html.replace(
        '<link rel="stylesheet" type="text/css" href="assets/css/cc-home.css" />',
        '<link rel="stylesheet" type="text/css" href="assets/css/cc-home.css" />\n'
        '<script src="assets/js/cc-business.js" defer></script>',
    )
    print("added cc-business.js")

# Desktop Book CTA + demote apply
desktop_book_marker = """\t\t<li id=\"pg864599559984356909\" class=\"wsite-menu-item-wrap\">
\t\t\t<a
\t\t\t\t\t\thref=\"barber-shop-contact-269206.html\"
\t\t\t\tclass=\"wsite-menu-item\"
\t\t\t\t>
\t\t\t\tBarber Application
\t\t\t</a>
\t\t\t
\t\t</li>
</ul>
</div>
        </div><!-- end .container -->
      </div><!-- end .nav-wrap -->"""

desktop_book_repl = f"""\t\t<li id=\"pg864599559984356909\" class=\"wsite-menu-item-wrap cc-nav-apply\">
\t\t\t<a
\t\t\t\t\t\thref=\"barber-shop-contact-269206.html\"
\t\t\t\tclass=\"wsite-menu-item\"
\t\t\t\t>
\t\t\t\tBarber Application
\t\t\t</a>
\t\t\t
\t\t</li>
</ul>
</div>
          <a class=\"cc-nav-book\" href=\"{BOOK}\" target=\"_blank\" rel=\"noopener noreferrer\">Book Now</a>
        </div><!-- end .container -->
      </div><!-- end .nav-wrap -->"""

if "cc-nav-book" not in html:
    if desktop_book_marker in html:
        html = html.replace(desktop_book_marker, desktop_book_repl, 1)
        print("desktop book ok")
    else:
        print("WARN: desktop book marker missing")

# Mobile actions before closing mobile-nav ul's Barber Application — append after mobile menu
mobile_marker = """  <div class=\"nav mobile-nav\"><ul class=\"wsite-menu-default\">"""
if "cc-mobile-actions" not in html and mobile_marker in html:
    # Find end of mobile nav ul
    m_start = html.find('<div class="nav mobile-nav">')
    m_ul_end = html.find("</ul>\n</div>", m_start)
    if m_ul_end > 0:
        insert = f"""
<div class=\"cc-mobile-actions\">
  <a class=\"cc-btn cc-btn--dark\" href=\"{BOOK}\" target=\"_blank\" rel=\"noopener noreferrer\">Book Now</a>
  <a class=\"cc-btn cc-btn--ghost-dark\" href=\"tel:6196845871\">Call (619) 684-5871</a>
</div>
"""
        html = html[: m_ul_end + len("</ul>")] + insert + html[m_ul_end + len("</ul>") :]
        # demote mobile apply
        html = html.replace(
            'id="pg864599559984356909" class="wsite-menu-item-wrap"',
            'id="pg864599559984356909" class="wsite-menu-item-wrap cc-nav-apply"',
        )
        print("mobile actions ok")
    else:
        print("WARN: mobile nav end missing")

about_start = html.find(
    'class="wsite-section wsite-body-section wsite-section-bg-gradient wsite-background-75"'
)
parallax_start = html.find(
    'class="wsite-section wsite-body-section wsite-section-bg-image wsite-section-effect-parallax wsite-background-77"'
)
hours_start = html.find(
    'class="wsite-section wsite-body-section wsite-section-bg-image wsite-background-61"'
)
content_end = html.find("    </div><!-- end content-wrap -->")

if min(about_start, hours_start, content_end) < 0:
    raise SystemExit("section markers missing")

about_wrap = html.rfind('<div class="wsite-section-wrap">', 0, about_start)
hours_wrap = html.rfind('<div class="wsite-section-wrap">', 0, hours_start)
old_chunk = html[about_wrap:hours_wrap]

gallery1 = ""
m1 = re.search(
    r"<div id='543696041147500913-gallery'[\s\S]*?</div>\s*<div style=\"height: 20px; overflow: hidden;\"></div></div>",
    old_chunk,
)
if m1:
    gallery1 = (
        '<div class="cc-section" style="padding-top:0;padding-bottom:40px;'
        'background:linear-gradient(0deg,#020202 0%,#3a3a3a 100%);">'
        f'<div class="cc-section__inner">{m1.group(0)}</div></div>\n'
    )
    print("kept gallery 1")

gallery2 = ""
m2 = re.search(
    r"<div id='659871477686464092-gallery'[\s\S]*?</div>\s*<div style=\"height: 20px; overflow: hidden;\"></div></div>",
    old_chunk,
)
if m2:
    gallery2 = (
        '<div class="cc-section" style="padding-top:20px;background:#111;">'
        f'<div class="cc-section__inner">{m2.group(0)}</div></div>\n'
    )
    print("kept gallery 2")

new_middle = f"""
<section class=\"cc-section cc-section--dark\" id=\"about\">
  <div class=\"cc-section__inner\">
    <p class=\"cc-eyebrow\">Mission Valley · San Diego</p>
    <h2>San Diego&rsquo;s favorite Barber Shop</h2>
    <div class=\"cc-trust\">
      <div class=\"cc-trust__rating\" aria-label=\"5.0 out of 5 from 219 reviews\">
        <span class=\"cc-trust__stars\" aria-hidden=\"true\">★★★★★</span>
        <span class=\"cc-trust__score\">5.0</span>
        <span class=\"cc-trust__meta\">219 reviews</span>
      </div>
      <div class=\"cc-hours-chip\" data-cc-hours-status>Checking hours…</div>
    </div>
    <p class=\"cc-lead\">We want to be your local barbershop. Located in the heart of Mission Valley, we specialize in modern haircuts, skin fades, tapers, straight razor shaves, and hot towel shaves — for men and kids.</p>
    <ul class=\"cc-amenities\">
      <li>Walk-ins Welcome</li>
      <li>Free Parking</li>
      <li>Complimentary Beverages</li>
      <li>Online Booking</li>
    </ul>
    <div class=\"cc-split\">
      <div>
        <iframe title=\"Classic Cuts location map\" src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3354.6922028529398!2d-117.1432662!3d32.77390079999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80d955919eadbdbd%3A0xeae59ec3a80d4acb!2s8555%20Station%20Village%20Ln%2C%20San%20Diego%2C%20CA%2092108!5e0!3m2!1sen!2sus!4v1769635162414!5m2!1sen!2sus\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\" allowfullscreen></iframe>
      </div>
      <div>
        <p class=\"cc-lead\" style=\"margin-bottom:12px\">Our environment will make you feel right at home. Book online or give us a call — see you soon.</p>
        <div class=\"cc-btn-row\">
          <a class=\"cc-btn cc-btn--light\" href=\"{BOOK}\" target=\"_blank\" rel=\"noopener noreferrer\">Book Now</a>
          <a class=\"cc-btn cc-btn--ghost-light\" href=\"tel:6196845871\">Call (619) 684-5871</a>
          <a class=\"cc-btn cc-btn--ghost-light\" href=\"https://www.google.com/maps/dir/?api=1&destination=8555+Station+Village+Way,+San+Diego,+CA+92108\" target=\"_blank\" rel=\"noopener noreferrer\">Get Directions</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class=\"cc-section\" id=\"services\">
  <div class=\"cc-section__inner\">
    <p class=\"cc-eyebrow\">Services &amp; Pricing</p>
    <h2>Sharp cuts. Fair prices.</h2>
    <p style=\"margin:0 0 8px;color:#555;font-family:Lato,sans-serif;font-weight:300;font-size:17px;line-height:1.55;max-width:36em\">From everyday fades to hot towel shaves — book the service you need, or walk in when you can.</p>
    <div class=\"cc-services-grid\">
      <article class=\"cc-service-card\">
        <h3>Haircut</h3>
        <p class=\"cc-price\">$60</p>
        <p>Modern cuts, skin fades, tapers, and classic styles finished with detail.</p>
        <a href=\"{BOOK}\" target=\"_blank\" rel=\"noopener noreferrer\">Book →</a>
      </article>
      <article class=\"cc-service-card\">
        <h3>Kid&rsquo;s Cut</h3>
        <p class=\"cc-price\">$55</p>
        <p>Patient, precise kids&rsquo; haircuts in a welcoming shop environment.</p>
        <a href=\"{BOOK}\" target=\"_blank\" rel=\"noopener noreferrer\">Book →</a>
      </article>
      <article class=\"cc-service-card\">
        <h3>Haircut &amp; Beard</h3>
        <p class=\"cc-price\">$90</p>
        <p>Full cut plus beard trim — clean lines from head to finish.</p>
        <a href=\"{BOOK}\" target=\"_blank\" rel=\"noopener noreferrer\">Book →</a>
      </article>
      <article class=\"cc-service-card\">
        <h3>Beard Trim</h3>
        <p class=\"cc-price\">$45</p>
        <p>Shape, clean up, and maintain your beard with a sharp finish.</p>
        <a href=\"{BOOK}\" target=\"_blank\" rel=\"noopener noreferrer\">Book →</a>
      </article>
      <article class=\"cc-service-card\">
        <h3>Senior Cut</h3>
        <p class=\"cc-price\">$45</p>
        <p>Classic cuts for clients 65+ — done right, every time.</p>
        <a href=\"{BOOK}\" target=\"_blank\" rel=\"noopener noreferrer\">Book →</a>
      </article>
      <article class=\"cc-service-card\">
        <h3>Hot Towel Shave</h3>
        <p class=\"cc-price\">$45</p>
        <p>Straight razor shaves and hot towel service for a true barbershop finish.</p>
        <a href=\"{BOOK}\" target=\"_blank\" rel=\"noopener noreferrer\">Book →</a>
      </article>
    </div>
    <div class=\"cc-btn-row\">
      <a class=\"cc-btn cc-btn--dark\" href=\"barbershopservices.html\">Full Services</a>
      <a class=\"cc-btn cc-btn--ghost-dark\" href=\"barber-shop.html\">Meet the Barbers</a>
    </div>
  </div>
</section>

"""

reviews = f"""
<section class=\"cc-section cc-section--reviews\" id=\"reviews\">
  <div class=\"cc-section__inner\">
    <p class=\"cc-eyebrow\">Client Love</p>
    <h2>Loved by San Diego</h2>
    <div class=\"cc-trust\" style=\"margin-bottom:8px\">
      <div class=\"cc-trust__rating\">
        <span class=\"cc-trust__stars\" aria-hidden=\"true\">★★★★★</span>
        <span class=\"cc-trust__score\">5.0</span>
        <span class=\"cc-trust__meta\">219 reviews on Squire</span>
      </div>
    </div>
    <div class=\"cc-reviews-grid\">
      <a class=\"cc-review-card\" href=\"https://www.yelp.com/biz/classic-cuts-barber-shop-san-diego-3?hrid=A4ddugWmeb1TJgc3AUKceg\" target=\"_blank\" rel=\"noopener noreferrer\">
        <div class=\"cc-stars\" aria-hidden=\"true\">★★★★★</div>
        <strong>Ricardo H.</strong>
        <span>Read Ricardo&rsquo;s 5-star Yelp review of Classic Cuts Barber Shop.</span>
      </a>
      <a class=\"cc-review-card\" href=\"https://www.yelp.com/biz/classic-cuts-barber-shop-san-diego-3?hrid=0Ery63arwwom9uxni2oVhw\" target=\"_blank\" rel=\"noopener noreferrer\">
        <div class=\"cc-stars\" aria-hidden=\"true\">★★★★★</div>
        <strong>Jayme H.</strong>
        <span>Read Jayme&rsquo;s 5-star Yelp review of Classic Cuts Barber Shop.</span>
      </a>
      <a class=\"cc-review-card\" href=\"https://www.yelp.com/biz/classic-cuts-barber-shop-san-diego-3?hrid=n3moB4sSA3pWPjTpNkG66g\" target=\"_blank\" rel=\"noopener noreferrer\">
        <div class=\"cc-stars\" aria-hidden=\"true\">★★★★★</div>
        <strong>J M.</strong>
        <span>Read J M.&rsquo;s 5-star Yelp review of Classic Cuts Barber Shop.</span>
      </a>
    </div>
    <div class=\"cc-btn-row\">
      <a class=\"cc-btn cc-btn--light\" href=\"https://g.page/r/CdxL_zOjv48rEAE/review\" target=\"_blank\" rel=\"noopener noreferrer\">Leave a Google Review</a>
      <a class=\"cc-btn cc-btn--ghost-light\" href=\"https://www.yelp.com/biz/classic-cuts-barber-shop-san-diego-3\" target=\"_blank\" rel=\"noopener noreferrer\">See Yelp Reviews</a>
    </div>
  </div>
</section>
"""

visit = f"""
<section class=\"cc-section\" id=\"visit\">
  <div class=\"cc-section__inner\">
    <p class=\"cc-eyebrow\">Hours &amp; Location</p>
    <h2>Visit the shop</h2>
    <div class=\"cc-hours-chip\" data-cc-hours-status style=\"margin: 8px 0 0; border-color:#ddd; color:#111;\">Checking hours…</div>
    <div class=\"cc-visit-grid\">
      <div class=\"cc-visit-card\">
        <h3>Hours</h3>
        <ul class=\"cc-hours-list\">
          <li><span>Monday – Friday</span><span>10 AM – 8 PM</span></li>
          <li><span>Saturday</span><span>10 AM – 6 PM</span></li>
          <li><span>Sunday</span><span>Closed</span></li>
        </ul>
      </div>
      <div class=\"cc-visit-card\">
        <h3>Location</h3>
        <p>8555 Station Village Way #D<br>San Diego, CA 92108</p>
        <p style=\"margin-top:12px\">Heart of Mission Valley · Steps from the Rio Vista Trolley (Green Line).</p>
        <div class=\"cc-btn-row\">
          <a class=\"cc-btn cc-btn--dark\" href=\"tel:6196845871\">Call (619) 684-5871</a>
          <a class=\"cc-btn cc-btn--ghost-dark\" href=\"https://www.google.com/maps/dir/?api=1&destination=8555+Station+Village+Way,+San+Diego,+CA+92108\" target=\"_blank\" rel=\"noopener noreferrer\">Directions</a>
          <a class=\"cc-btn cc-btn--ghost-dark\" href=\"https://www.instagram.com/myclassiccut/\" target=\"_blank\" rel=\"noopener noreferrer\">@myclassiccut</a>
        </div>
      </div>
    </div>
    <div class=\"cc-btn-row\" style=\"margin-top:28px\">
      <a class=\"cc-btn cc-btn--dark\" href=\"{BOOK}\" target=\"_blank\" rel=\"noopener noreferrer\">Book an Appointment</a>
      <a class=\"cc-btn cc-btn--ghost-dark\" href=\"barber-shop-contact.html\">Contact</a>
    </div>
    <div class=\"cc-apply-note\">
      <p>Barbers interested in joining the team can apply here.</p>
      <a class=\"cc-btn cc-btn--quiet\" href=\"barber-shop-contact-269206.html\">Barber Application</a>
    </div>
  </div>
</section>
"""

replacement = new_middle + gallery1 + gallery2 + reviews + visit
html = html[:about_wrap] + replacement + html[content_end:]
print("replaced mid-page sections")

# Footer replace
footer_old_start = html.find('<div class="footer-wrap">')
footer_old_end = html.find("</div><!-- end footer-wrap -->")
if footer_old_start > 0 and footer_old_end > 0:
    new_footer = f"""
    <div class=\"footer-wrap cc-footer\">
      <div class=\"cc-footer__inner\">
        <div>
          <h4>Classic Cuts</h4>
          <p>8555 Station Village Way #D<br>San Diego, CA 92108<br>Mission Valley</p>
          <p><a href=\"tel:6196845871\">(619) 684-5871</a></p>
        </div>
        <div>
          <h4>Explore</h4>
          <p>
            <a href=\"index.html\">Home</a><br>
            <a href=\"barbershopservices.html\">Services</a><br>
            <a href=\"barber-shop.html\">Barbers</a><br>
            <a href=\"haircut-gallery.html\">Gallery</a><br>
            <a href=\"barber-shop-contact.html\">Contact</a>
          </p>
        </div>
        <div>
          <h4>Book &amp; Follow</h4>
          <p>
            <a href=\"{BOOK}\" target=\"_blank\" rel=\"noopener noreferrer\">Book Now</a><br>
            <a href=\"https://www.instagram.com/myclassiccut/\" target=\"_blank\" rel=\"noopener noreferrer\">Instagram @myclassiccut</a><br>
            <a href=\"https://www.facebook.com/myclassiccut/\" target=\"_blank\" rel=\"noopener noreferrer\">Facebook</a><br>
            <a href=\"barber-shop-contact-269206.html\">Barber Application</a>
          </p>
        </div>
        <p class=\"cc-footer__copy\">© {__import__('datetime').datetime.now().year} Classic Cuts Barbershop. All rights reserved.</p>
      </div>
    </div><!-- end footer-wrap -->
"""
    html = html[:footer_old_start] + new_footer + html[footer_old_end + len("</div><!-- end footer-wrap -->") :]
    print("footer ok")
else:
    print("WARN footer missing")

# Scroll top button before </body>
if "data-cc-scroll-top" not in html:
    html = html.replace(
        "</body>",
        '  <button type="button" class="cc-scroll-top" data-cc-scroll-top aria-label="Back to top">↑</button>\n</body>',
        1,
    )
    print("scroll top ok")

# Title/meta polish
html = html.replace(
    "<title>Your Local Barbershop in Mission Valley, San Diego </title>",
    "<title>Classic Cuts Barbershop | Mission Valley San Diego</title>",
    1,
)
html = html.replace(
    'content="Classic Cuts Barbershop, Your Local Barbershop,Located In The Heart of Mission Valley, San Diego, CA."',
    'content="Classic Cuts Barbershop in Mission Valley, San Diego. Modern haircuts, skin fades, beard trims &amp; hot towel shaves. Walk-ins welcome. Book online or call (619) 684-5871."',
)

path.write_text(html)
print("DONE", path.stat().st_size)
