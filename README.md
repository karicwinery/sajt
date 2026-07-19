# Vinarija Karić

Static implementation of the Claude Design file **`Vinarija Karic.dc.html`**
(from the "Winery website redesign" design project). Plain HTML/CSS/vanilla JS —
no build step, no dependencies.

## Run

```bash
cd vinarija-karic
python3 -m http.server 8000
# open http://localhost:8000
```

Any static file server works (it must be served over HTTP, not opened as a
`file://` path, so the Google Maps embed and fonts load correctly).

## What's implemented

- **Home** — sticky header, parallax hero with intro animation, "Adria Linija"
  cards, winery story, winemaker section, contact form, footer.
- **Wine detail pages** (`?start=belo`, `?start=crveno`) — breadcrumb, spec grid
  (alkohol / šećeri / kiseline / pH), tasting notes, vinification, origin.
- **Scroll-spy** nav highlighting, **reveal-on-scroll** animations, and the
  **contact-form validation** (ime / email / poruka → "Hvala vam!") ported 1:1
  from the design's `DCLogic` component.
- **Mobile-optimized**: hamburger menu, stacked layouts, fluid type,
  16px inputs (no iOS zoom). Verified with zero horizontal overflow at
  320 / 360 / 390 / 414 px.

## Images

All images are in place (`assets/`), sourced from the design-project export and
web-optimized. Every filename is plain ASCII (no diacritics), so it references
cleanly on any filesystem / host:

| File (`assets/`) | Source (design export)     | Notes                        |
|------------------|----------------------------|------------------------------|
| `hero.jpg`       | Adria golden hour bottle   | resized 4800px → 2400px      |
| `adria-duo.jpg`  | adria-duo-square.jpg       | homepage duo shot            |
| `founder.jpg`    | stevan.jpg                 | winemaker portrait           |
| `belo.png`       | belo-nobg3.png             | transparent bottle cutout    |
| `crveno.png`     | crveno-nobg.png            | transparent bottle cutout    |
| `karic-grb.png`  | karic-grb.png              | crest logo                   |

To swap any image, replace the file in `assets/` keeping the same name — no code
change needed.

## Files

- `index.html` — markup for home + detail + footer
- `style.css` — all styling and responsive rules
- `app.js` — navigation, parallax, reveals, form logic, mobile menu
- `assets/` — images (only the logo is present; see above)
