# Student Athletes of Israel — Website

> *Train. Study. Champion.*

Static site for Student Athletes of Israel (SAI) — Israel's first structured framework supporting elite Olympic and Paralympic athletes pursuing higher education at Bar-Ilan University.

## Stack

Pure static — HTML, CSS, JavaScript. No build step. No framework.

- Shared styles in `assets/sai.css`
- Shared scripts in `assets/sai.js` (mobile nav, footer year, WhatsApp bubble)
- SVG icon sprite in `assets/icons.html`
- Photography in WebP with PNG fallback via `<picture>`

## Pages

| Page | Purpose |
|---|---|
| `index.html` | Homepage — hero rotator, mission, two paths, timeline, athletes, partners, testimonials, contact |
| `athletes.html` | Cohort 1 trading cards + apply CTA |
| `apply.html` | Athlete application — benefits explainer + Tally form |
| `donate.html` | Donor page — animated stadium hero, impact calculator, tier cards |
| `press.html` | Press coverage, media kit, downloadable announcement |
| `faq.html` | Filterable FAQ accordion (FAQPage schema for rich results) |

## Local development

Just open `index.html` in a browser. No server needed.

If you want to test relative paths the way GitHub Pages will serve them, run a simple local server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000/`.

## Deployment

Hosted on GitHub Pages. Push to `main`, Pages auto-publishes. Custom domain: `studentathletesofisrael.org` (when DNS is pointed).

## Configuration

- WhatsApp number is set per-page via `data-whatsapp` attribute on `<body>` (digits only, country code first)
- EmailJS public key is in `index.html` and `donate.html` — lock the EmailJS dashboard to this domain only
- Tally form lives at `apply.html` → embedded iframe to `tally.so/embed/jaLJEE`

## Brand system

Tokens (color, type, motion) follow the `sai-design` spec — navy `#0a0e1a`, gold `#c9a84c`, off-white `#f5f3ee`. Barlow Condensed for headlines, Barlow Light for body, Playfair Display Italic for the single italic gold word per headline.
