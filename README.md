# Sattva Homes — glass redesign

New landing page for Sattva Homes. Wording, home finder, collections, FAQ and contact details are carried over unchanged from the current site; the visual layer is a light glassmorphism redesign (white frosted glass, navy type, no dark overlays) built around the daytime hero photograph.

## Stack

- **Vite 8** + **React 19** + **TypeScript**
- **Tailwind CSS v4** (design tokens in `src/index.css` → `@theme`)
- **Lenis** smooth scrolling (switched off for reduced-motion users)
- Native **View Transitions** (collection switch) and **CSS scroll-driven animations** (hero fade, section reveals), both progressive enhancements
- Self-hosted variable fonts: Newsreader (headings) and Manrope (UI)

## Commands

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-checks, then outputs the static site to dist/
npm run preview   # serves dist/ locally
```

`dist/` is plain static files with relative paths, so it can be uploaded to any host or sub-folder.

## Where things live

| Path | What |
| --- | --- |
| `src/data/content.ts` | Every piece of copy, link, phone/email, finder option and example-home spec |
| `src/data/designs.ts` | All 128 home designs from the current catalogue (specs, block size, photo and brochure links) |
| `src/lib/router.ts` | Hash routes: `#/designs` (filters in the query string), `#/designs/<slug>`, `#/compare?homes=a,b,c`; anything else is the landing page |
| `src/lib/filters.ts`, `src/lib/compare.ts` | Shared filter logic (hero finder + catalogue) and the compare list (up to 3 homes, kept in localStorage) |
| `scripts/make-floorplans.py` | Downloads each design's brochure PDF (into `content_to_use/brochures/`) and renders its sheet to `public/floorplans/<slug>.webp`; also writes `src/data/floorplans.ts` (image sizes). Needs `pip install pypdfium2 pillow`; re-runnable |
| `scripts/make-logo.py` | Traces `content_to_use/logo/sattva-homes-logo.png` into vector pieces: writes `src/assets/brand/sattva-logo.svg` (header, footer) and the animated intro logo in `index.html` (between the `logo:start`/`logo:end` markers). Needs `pip install potracer opencv-python-headless pillow`; re-runnable |
| `src/pages/` | `HomePage` (landing sections), `DesignsPage` (catalogue), `DesignPage` (one home), `ComparePage`, `NotFound` |
| `src/components/` | One file per section: `Header`, `Hero` (+ `HomeFinder`), `PromiseBar`, `Collections`, `AerialFilm` (Why Sattva video), `FamilyMoments`, `Journey`, `Questions`, `Contact`, `Footer` |
| `src/index.css` | Tokens, glass utilities, finder controls, motion |
| `index.html` | SEO meta, JSON-LD business data, and the once-per-visit logo intro (the logo builds piece by piece, then fades; Skip button, and any click, key, scroll or touch skips it) |
| `public/images/hero-day.webp` | Hero photograph (preloaded for fast first paint) |
| `public/video/aerial-1080.mp4`, `aerial-720.mp4` | Why Sattva drone loop (desktop / mobile), cut from `content_to_use/drone_content`. Kept out of `src` so the inlined artifact build stays small |
| `original-artifact/` | Untouched copy of the previous site, for reference |
| `_backup-dark-version/` | Snapshot of the earlier dark design (`src`, `public`, `index.html`); safe to delete |

## Notes before going live

- Floor plans are local (`public/floorplans/`). Home-design photos and the "Download PDF" links (except the three example homes' photos) still load from `sattva.com.au/wp-content/uploads/`. Copy them into the project before the old site is switched off.
- Mapleview and Oakridge are published with area, length and width that don't add up (e.g. 156 m² over 46 m × 34 m); confirm the real figures.

- `birchfield.jpg` (377 px wide) and `sunnydale.jpg` (340 px) are low resolution and look soft on large screens. Swap in 1600 px+ photos with the same file names in `src/assets/images/`.
- The hero and contact photos are concept images; the hero is labelled "Concept image" on the page.
