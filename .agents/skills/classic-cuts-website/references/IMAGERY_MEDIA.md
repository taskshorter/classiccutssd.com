# Imagery & media

## Layout

```text
assets/images/brand/     logo (png + webp sizes), posters, favicons
assets/images/barbers/   portraits (jpg/png)
assets/images/gallery/   work photos — prefer .webp
assets/videos/           hero.mp4, posters; services media
```

## Formats

- Gallery and logos: **webp** preferred for delivery; some jpg/png remain  
- Hero poster: webp + jpg fallbacks under brand/  
- Hero video: compressed `hero.mp4` (~0.8MB); `hero.orig.mp4` is a large source — do not ship as LCP  

## Loading strategy

| Asset | Strategy |
|-------|----------|
| Home logo | `preload` + `fetchpriority="high"` (480.webp) |
| Hero poster | Visible LCP still; video fades in on capable desktop |
| Hero video | Autoplay muted playsinline desktop only; disabled ≤767px and reduced-motion (`cc-hero-video.js`) |
| Below-fold images | `loading="lazy"` + `decoding="async"` where applied |
| Book aside / backgrounds | Lazy webp |

## Dimensions

Provide `width`/`height` on important `<img>` tags to reduce CLS (book page and many gallery items do).

## Alt text

Descriptive alts on service/gallery content; decorative backgrounds may use empty alt. Prefer accurate shop/work descriptions over keyword stuffing.

## When adding media

1. Compress and prefer webp  
2. Place under the correct `assets/images/...` folder  
3. Avoid Weebly-style deep upload paths  
4. Keep hero video small; poster remains the mobile experience  
