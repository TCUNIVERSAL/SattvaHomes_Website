# Sattva Homes

A static React website for Sattva Homes, built with Vite, TypeScript and Tailwind CSS. It includes the home finder, all 128 home designs, floor plans, home comparison and two video previews.

## Local development

Use Node.js 24 and the committed npm lockfile:

```bash
npm ci
npm run dev
```

The development server runs at `http://localhost:5173`.

```bash
npm run typecheck       # Check the application and both Vite configurations
npm run check:media     # Check that both MP4 files contain actual video data
npm run build          # Validate media, type-check and build dist/
npm run preview        # Preview the production build
npm run build:artifact # Build dist-artifact/artifact.html with inline images, fonts, CSS and JavaScript
```

## Deploy to a new Vercel project

1. Import `TCUNIVERSAL/SattvaHomes_Website` into Vercel as a new project.
2. Choose the `main` branch and leave the Root Directory at the repository root.
3. Keep the Vite framework preset. The committed `vercel.json` sets installation to `npm ci`, building to `npm run build`, and the output directory to `dist`.
4. Deploy. No environment variables, database or API keys are required.

Node.js 24 is selected through `package.json`. This repository does not contain an old Vercel project ID or account link, so it can be imported after the previous project has been deleted.

Navigation uses hash URLs such as `/#/designs` and `/#house-model`; it does not need a catch-all rewrite. Missing images and videos return a real 404 rather than the home page. Vercel serves byte-range requests for the MP4 files automatically.

Both videos must remain committed as normal Git files:

- `public/video/useme.mp4`: the Why Sattva film.
- `public/video/final3dvideo.mp4`: the 3D house model preview.

The build stops if either video is missing or contains a Git LFS pointer instead of MP4 data. Video URLs receive a new version on every build, and video responses require cache revalidation so an older failed download does not persist after deployment.

For a downloadable artifact, keep the entire `dist-artifact` directory together, including `video/` and `floorplans/`. Its HTML references those folders. Vercel deploys `dist/` instead.

## Source layout

| Path | Purpose |
| --- | --- |
| `src/components/` | Shared components and home page sections, including `HouseModel` |
| `src/pages/` | Home, catalogue, design details, compare and not-found pages |
| `src/data/` | Home catalogue, copy and floor-plan dimensions |
| `src/lib/` | Routing, filters and compare state |
| `src/index.css` | Fonts, colour tokens, glass styles and motion |
| `public/floorplans/` | Floor-plan images served with the site |
| `public/video/` | The two production videos |
| `scripts/check-media.mjs` | Video validation run before every production build |
| `scripts/make-artifact.mjs` | Packages the optional shareable HTML artifact |
| `scripts/make-floorplans.py` | Regenerates local floor-plan images from the brochure source PDFs |
| `scripts/make-logo.py` | Regenerates the SVG logo and intro animation from the original logo artwork |

The asset-generation scripts use `content_to_use/brochures/` and `content_to_use/logo/`. These source inputs are excluded from Vercel uploads by `.vercelignore`.

## Content dependencies

Most catalogue photos and brochure downloads are hosted at `sattva.com.au/wp-content/uploads/`; the three featured home photos and all floor-plan images are local. Keep the original uploads available or migrate those catalogue URLs before changing their host.

The Mapleview and Oakridge source brochures contain inconsistent area and dimension figures; confirm these with the business before changing the catalogue data.
