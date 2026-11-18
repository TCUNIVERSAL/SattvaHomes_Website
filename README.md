# Sattva Homes — Engineering Documentation

A high-performance, responsive React web application built for **Sattva Homes**, a premier Queensland residential home builder based in Willawong, QLD. 

This repository contains the complete frontend client, interactive home finder, searchable 128-home design catalogue, interactive multi-storey floor plan viewer, side-by-side home comparison engine, 3D virtual model showcase, and media processing pipelines.

---

## Table of Contents

1. [Architecture & Tech Stack](#architecture--tech-stack)
2. [Key Capabilities & Features](#key-capabilities--features)
3. [Project Structure](#project-structure)
4. [Routing & Navigation Strategy](#routing--navigation-strategy)
5. [State Management & Stores](#state-management--stores)
6. [Data Models & Schema](#data-models--schema)
7. [Design System & Styling](#design-system--styling)
8. [Build Scripts & Media Pipelines](#build-scripts--media-pipelines)
9. [Local Development Setup](#local-development-setup)
10. [Deployment & Infrastructure](#deployment--infrastructure)
11. [Developer Conventions & Contribution Rules](#developer-conventions--contribution-rules)

---

## Architecture & Tech Stack

The application is engineered as an ultra-fast, zero-overhead Single Page Application (SPA) with no heavy runtime dependencies, no external database requirements, and instant static-edge delivery.

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Runtime / Library** | **React** | `^19.3.0` | Core UI engine utilizing React 19 compiler features and hooks |
| **Language** | **TypeScript** | `^7.0.2` | Strict end-to-end type safety across data schemas and components |
| **Bundler / Dev Server** | **Vite** | `^8.3.4` | Lightning-fast HMR and optimized production Rollup bundling |
| **Styling** | **Tailwind CSS v4** | `^4.3.3` | Next-gen `@tailwindcss/vite` plugin with custom CSS `@theme` variables |
| **Smooth Scrolling** | **Lenis** | `^1.3.26` | Inertia-based luxury scroll physics across landing and catalogue |
| **Typography** | **Fontsource Variable** | `^5.3.0` | Self-hosted *Newsreader* (serif) and *Manrope* (sans-serif) variable fonts |
| **Hosting & CDN** | **Vercel** | — | Edge-cached static distribution with customized cache & security headers |
| **Media Processing** | **Python 3 / Node.js** | — | Offline PDF extraction, WebP generation, and SVG path choreographing |

---

## Key Capabilities & Features

### 1. Interactive Hero Home Finder (`HomeFinder.tsx`)
- Immediate entry point allowing home seekers to query:
  - **Storeys:** Segmented toggle pill buttons (*All*, *Single storey*, *Double storey*).
  - **Bedrooms & Bathrooms:** Minimum thresholds (`3+`, `4+`, `5+`).
  - **Home Size:** Dual-range slider (`136 m²` – `716 m²`).
- **Live Match Count:** Updates in real-time as filters adjust (`Show X homes →`), navigating seamlessly into the filtered catalogue.

### 2. Full 128-Design Catalogue (`DesignsPage.tsx`)
- Real-time multi-facet filtering across:
  - Series (*Essence*, *Horizon*, *Meadowline*)
  - Storeys (1 or 2 storeys)
  - Minimum Bedrooms, Bathrooms, and Car Spaces
  - Block frontage width in metres (e.g., 10m, 12.5m, 14m, 16m, 18m)
  - Home area range slider with dynamic step calculations
- **Sort Options:** Recommended, Size (Smallest first / Largest first), Narrowest block first, Alphabetical (A to Z).
- **Intelligent Fallback:** When a filter combination returns zero matches, the UI analyzes which single filter modification will recover results and offers a one-click chip with the match count.

### 3. Detailed Design Page & Floor Plan Viewer (`DesignPage.tsx`, `FloorPlan.tsx`)
- Detailed design specifications (length, width, total area, frontage suitability, rooms).
- **Interactive Multi-Storey Floor Plan Viewer:**
  - Dynamic tabs for single storey (*Floor plan*) and double storey (*Ground floor*, *First floor*).
  - Aspect-ratio locked high-resolution WebP floor plan viewer with click-to-expand lightbox view.
  - Direct brochure PDF download integration.
  - Related home recommendations matching the current series and room specifications.

### 4. Side-by-Side Home Comparison Engine (`ComparePage.tsx`, `CompareTray.tsx`)
- Allows users to compare up to 3 homes simultaneously.
- Floating persistence bar (`CompareTray`) waking up as homes are added from design cards.
- Comprehensive comparison matrix:
  - Interactive floor plans aligned side-by-side.
  - Dimension comparisons (area, length, width, lot frontage).
  - Accommodation specs (bedrooms, bathrooms, parking spaces, living zones).
  - Direct action links to download brochures or remove homes.

### 5. Interactive 3D Home Models Portal (`ModelsPage.tsx`, `HouseModel.tsx`)
- Dedicated virtual walkthrough portal (`#/models`) linking to WebGL/Matterport 3D models:
  - **Whitewood Avenue** (with dedicated high-res facade cover photo).
  - **68 Boundary Road — Camp Hill**
  - **70 Boundary Road — Camp Hill**
- Video preview player with autoplay, loop, and playback controls on the home page.

### 6. Architectural Brand Animations & Media
- **Pre-app Logo Intro Animation (`index.html`):** Hand-crafted SVG sequence assembling the Sattva Homes house artwork piece-by-piece (foundation, walls, roof, window panes, crew, and lettering) with zero layout flash or delay.
- **Aerial Drone Showcase (`AerialFilm.tsx`):** Custom 4K cinematic video player with sound toggle, custom controls, and fullscreen capability.

---

## Project Structure

```
SatvaHomes/
├── .github/                     # CI/CD workflows (if configured)
├── public/                      # Static assets copied directly to build root
│   ├── favicon.webp             # Site favicon
│   ├── floorplans/              # High-resolution WebP floor plans (<slug>-<floor>.webp)
│   └── video/                   # Production videos
│       ├── useme.mp4            # "Why Sattva" cinematic film
│       └── final3dvideo.mp4     # 3D House Model preview video
├── scripts/                     # Build verification & asset generation pipelines
│   ├── check-media.mjs          # Node script verifying MP4 video integrity before build
│   ├── make-artifact.mjs        # Compiles standalone self-contained offline HTML artifact
│   ├── make-floorplans.py       # Extracts & converts PDF brochure floor plans to WebP
│   └── make-logo.py             # Parses vector logo into choreographed animation SVG
├── src/
│   ├── assets/                  # Bundled assets (processed by Vite)
│   │   ├── brand/               # Brand logos and vector graphics
│   │   ├── images/              # Optimized WebP/JPEG photos for hero, family, & showcases
│   │   └── Model_cover_photos/  # Cover photos for 3D virtual models
│   ├── components/              # Modular UI components
│   │   ├── AerialFilm.tsx       # Drone video section with custom controls
│   │   ├── Brand.tsx            # Animated logo and brand mark
│   │   ├── Collections.tsx      # Tabbed showcase of Essence, Horizon, Meadowline
│   │   ├── CompareTray.tsx      # Persistent bottom drawer showing compared homes
│   │   ├── Contact.tsx          # Display home location, hours, and contact form CTA
│   │   ├── FamilyMoments.tsx    # Customer story polaroids gallery
│   │   ├── FloorPlan.tsx        # High-res floor plan viewer with floor tabs & modal
│   │   ├── Footer.tsx           # Site footer & mobile sticky navigation bar
│   │   ├── Header.tsx           # Glassmorphic header with navigation links
│   │   ├── Hero.tsx             # Responsive hero with landscape photo & mist overlays
│   │   ├── HomeCard.tsx         # Reusable card component for design listings
│   │   ├── HomeFinder.tsx       # Hero interactive search form & filters
│   │   ├── HouseModel.tsx       # 3D model teaser card & video player
│   │   ├── Icons.tsx            # Lightweight SVG icon collection
│   │   ├── PageShell.tsx        # Breadcrumb and page framing wrapper
│   │   ├── PromiseBar.tsx       # Core builder commitments
│   │   ├── Questions.tsx        # FAQ accordion section
│   │   └── Stats.tsx            # Animated counter metrics on scroll
│   ├── data/                    # Static domain data & catalogue content
│   │   ├── content.ts           # Copy, collection definitions, FAQs, and contact info
│   │   ├── designs.ts           # Master dataset of all 128 home designs
│   │   └── floorplans.ts        # Aspect ratios & pixel dimensions for all floor plans
│   ├── hooks/
│   │   └── useSmoothScroll.ts   # Lenis smooth-scroll setup and jump helpers
│   ├── lib/                     # Business logic, routing, and stores
│   │   ├── compare.ts           # LocalStorage-backed comparison store
│   │   ├── filters.ts           # Filter normalization, matching logic, and URL serialization
│   │   └── router.ts            # Lightweight hash router and query parameter helpers
│   ├── pages/                   # Top-level view containers
│   │   ├── ComparePage.tsx      # Side-by-side comparison screen
│   │   ├── DesignPage.tsx       # Individual home detail page
│   │   ├── DesignsPage.tsx      # Catalogue with multi-facet filter sidebar
│   │   ├── HomePage.tsx         # Primary marketing landing page
│   │   ├── ModelsPage.tsx       # 3D interactive models gallery
│   │   └── NotFound.tsx         # 404 handler
│   ├── App.tsx                  # Top-level view router and scroll restoration
│   ├── index.css                # Tailwind v4 theme, typography, glassmorphism, & motion
│   └── main.tsx                 # React DOM root entry point
├── index.html                   # HTML entry point containing pre-app logo animation
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript compilation config
├── vercel.json                  # Production Vercel headers, caching, and rewrites
├── vite.config.ts               # Standard production Vite configuration
└── vite.artifact.config.ts      # Single-file bundled artifact configuration
```

---

## Routing & Navigation Strategy

The application uses a **custom hash router** (`src/lib/router.ts`) rather than HTML5 History API pushState routing:

```
#/                          → Landing Page
#difference                 → Smooth scroll to '#difference' on Landing Page
#/designs                   → All Home Designs Catalogue
#/designs?series=essence    → Filtered Catalogue (shareable URL)
#/designs/meadowlark        → Design Detail Page for 'meadowlark'
#/compare?homes=a,b,c       → Comparison Matrix for specific home slugs
#/models                    → 3D Home Models Gallery
```

### Why Hash Routing?
1. **Zero-Config Hosting:** Functions immediately on static web hosts (Vercel, GitHub Pages, Netlify, Amazon S3, Apache/Nginx) without requiring server-side fallback rewrites (`/* -> /index.html`).
2. **Offline & Artifact Compatibility:** Allows the built site to run directly from local disk folders or inside a packed single-file HTML artifact (`dist-artifact/artifact.html`).
3. **Shareable Deep Links:** Filter parameters (`bed`, `bath`, `storeys`, `areaMin`, `areaMax`, `sort`) live directly in the hash query string (`#/designs?storeys=2&bed=4`), allowing users to bookmark or share exact search criteria.

### Scroll Restoration System
Browser native scroll restoration is disabled (`history.scrollRestoration = 'manual'`) in favor of a custom memory map (`scrollMemory` in `App.tsx`):
- When navigating from the catalogue into a design detail page and clicking **Back**, the router restores the exact scroll position down the 128-home grid.
- When navigating to a new page, focus automatically jumps to the page's `<h1>` heading for screen reader and keyboard accessibility.

---

## State Management & Stores

The application deliberately avoids external state libraries (Redux, Zustand, MobX), achieving high performance through clean React 19 primitives:

### 1. Comparison Store (`src/lib/compare.ts`)
- Implemented with **`useSyncExternalStore`**.
- Persists selected home slugs (up to 3) in `localStorage['sattva-compare']`.
- Listens to native `window.addEventListener('storage')`, automatically synchronizing comparison states across multiple open browser tabs.
- Provides unified API:
  - `compare.toggle(slug)`
  - `compare.add(slug)`
  - `compare.remove(slug)`
  - `compare.clear()`

### 2. Catalogue Filter Engine (`src/lib/filters.ts`)
- Normalizes and parses URL search parameters into a structured `Filters` object:
  ```ts
  export type Filters = {
    series: SeriesKey | ''
    storeys: string
    bed: number
    bath: number
    car: number
    block: number
    areaMin: number
    areaMax: number
    sort: string
  }
  ```
- **Matching Function (`matches(design, filters)`):** Evaluates whether a home satisfies all selected criteria (with bedrooms, bathrooms, and cars treated as minimums, e.g., "4+").
- **Filter Count Optimization:** Efficiently computes live counts for hero buttons and filter chips without re-rendering the whole page.

---

## Data Models & Schema

### Master Design Model (`src/data/designs.ts`)
Every home in the 128-design catalogue is strictly typed:

```typescript
export type SeriesKey = 'essence' | 'horizon' | 'meadowline'

export type Design = {
  slug: string          // URL slug (e.g. 'meadowlark')
  name: string          // Display title (e.g. 'Meadowlark')
  series: SeriesKey     // Collection tier
  storeys: 1 | 2        // Number of levels
  bedrooms: number      // Bedroom count
  bathrooms: number     // Bathroom count
  cars: number | null   // Garage spaces
  living: number | null // Living zones
  area: number          // Total floor area in square metres (m²)
  length: number        // Home length in metres
  width: number         // Home width in metres
  suits: string         // Original lot description (e.g. "14m x 32m block")
  frontage: number      // Minimum required lot frontage width in metres
  image: string         // Facade photography URL
  brochure: string      // PDF brochure download URL
}
```

### Floor Plan Dataset (`src/data/floorplans.ts`)
Maps each design slug to an array of pixel dimensions for each floor:
```typescript
export const floorplanSizes: Record<string, [number, number][]> = {
  'birchfield': [[1511, 1800], [1286, 1800]], // [Ground Floor, First Floor]
  'amberwood':  [[949, 1800]],                 // Single level
}
```
Images are served from `/floorplans/<slug>-<floor>.webp`.

---

## Design System & Styling

The site uses a custom luxury aesthetic reflecting Queensland architectural quality: warm light, soft mist, deep Sattva navy, and natural bronze.

### Color Tokens (`src/index.css`)
```css
@theme {
  --color-paper: #f5f7fa;       /* Canvas background */
  --color-mist: #eaf0f6;        /* Subtle secondary surface */
  --color-ink: #1f2b42;         /* Sattva navy: headings, primary buttons */
  --color-ink-soft: #4a5872;    /* Secondary text */
  --color-bronze: #aa8455;      /* Accent buttons, brand highlights */
  --color-bronze-deep: #86663f; /* Small typography accents on light surfaces */
  --color-bronze-light: #d6b88f;
  --color-sand: #ecdcc2;
}
```

### Typography Hierarchy
- **Serif (`Newsreader Variable`):** Applied to headlines, editorial quotes, and section markers (`h1`, `h2`, `h3`, `em`).
- **Sans-Serif (`Manrope Variable`):** Applied to body text, filter controls, specification badges, metrics, and data tables.

### Frosted Glass Utilities (`.glass`, `.glass-strong`)
Custom layered backdrop filters combining white linear gradients with high-blur saturation:
```css
@utility glass {
  background: linear-gradient(145deg, rgb(255 255 255 / 0.74), rgb(255 255 255 / 0.44));
  border: 1px solid rgb(255 255 255 / 0.85);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.95), 0 24px 60px -30px rgb(31 43 66 / 0.18);
  backdrop-filter: blur(24px) saturate(180%);
}
```

### Mobile-Responsive Background Framing
To prevent wide landscape hero photos from zooming excessively on portrait mobile displays, the hero photo container employs constrained viewport heights on small screens (`h-[100svh] max-h-[750px] md:h-full`) with focal anchoring (`object-[center_28%] md:object-center`), ensuring the home facade and roofline remain perfectly proportioned across all screen sizes.

---

## Build Scripts & Media Pipelines

### `scripts/check-media.mjs`
A mandatory pre-build verification step executed before `tsc` and `vite build`. Inspects `public/video/useme.mp4` and `public/video/final3dvideo.mp4`:
- Reads initial byte buffers to confirm standard `ftyp` MP4 container markers.
- Halts the build with an error if files are missing or contain Git LFS text pointers instead of true binary data.

### `scripts/make-artifact.mjs`
Builds a standalone, single-file HTML distribution (`dist-artifact/artifact.html`):
- Bundles fonts, styles, and images inline via data-URIs (`assetsInlineLimit: 100_000_000`).
- Generates a zip archive (`SattvaHomes_website_artifact.zip`) suitable for offline client presentations or archiving.

### `scripts/make-floorplans.py`
A Python utility using PyMuPDF / pdf2image that processes the source PDF brochures in `content_to_use/brochures/`:
- Isolates floor plan vector artwork.
- Crops margins and scales to high-fidelity WebP format.
- Generates `src/data/floorplans.ts` containing exact pixel aspect ratios.

### `scripts/make-logo.py`
Parses the original master logo vector artwork into individual SVG path groups with customized CSS delays, enabling the construction-themed intro animation in `index.html`.

---

## Local Development Setup

### Prerequisites
- **Node.js:** `24.x` (or latest LTS)
- **Package Manager:** `npm` (uses locked `package-lock.json`)
- **Python (Optional):** Only required if running `scripts/make-floorplans.py` or `scripts/make-logo.py`.

### Installation & Execution

```bash
# 1. Clone repository
git clone https://github.com/TCUNIVERSAL/SattvaHomes_Website.git
cd SattvaHomes_Website

# 2. Clean install dependencies
npm ci

# 3. Start local development server
npm run dev
```

The application will be live at `http://localhost:5173`.

### Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts local Vite development server with Hot Module Replacement |
| `npm run build` | Validates videos (`check-media.mjs`), checks types (`tsc`), and compiles `dist/` |
| `npm run preview` | Starts a local web server to preview production build in `dist/` |
| `npm run typecheck` | Runs TypeScript compiler checks without emitting files |
| `npm run check:media` | Runs standalone MP4 video integrity checks |
| `npm run build:artifact` | Compiles the self-contained offline single-file HTML distribution |

---

## Deployment & Infrastructure

The project is pre-configured for zero-friction continuous deployment on **Vercel**.

### Configuration (`vercel.json`)
The committed `vercel.json` defines optimal cache control policies and enterprise HTTP security headers:

- **Immutable Assets (`/assets/*`):** `Cache-Control: public, max-age=31536000, immutable` (hashed bundle filenames).
- **Floor Plans (`/floorplans/*`):** `Cache-Control: public, max-age=2592000, stale-while-revalidate=86400`.
- **Videos (`/video/*`):** `Cache-Control: public, max-age=0, must-revalidate` (allows byte-range requests for video scrubbing while ensuring instant updates on deployment).
- **Security Headers:**
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### Vercel Deployment Steps:
1. Connect the GitHub repository `TCUNIVERSAL/SattvaHomes_Website` to Vercel.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build` (auto-detected).
4. Output Directory: `dist` (auto-detected).
5. Install Command: `npm ci` (auto-detected).
6. **No environment variables or databases are required.**

---

## Developer Conventions & Contribution Rules

1. **Hash Routing Integrity:** When creating internal links, always use `#/<route>` or the `to(path, params)` helper in `src/lib/router.ts`. Never use standard relative paths like `/designs`, as they bypass hash routing and break offline distributions.
2. **Video Commits:** The two MP4 files in `public/video/` must remain normal Git tracked files. Do not convert them to Git LFS unless the deployment server supports LFS checkout directly.
3. **Responsive Breakpoint Guard:** Always verify changes on both mobile screens (`360px` – `414px`) and desktop viewports (`1440px`+). Avoid applying unrestricted vertical sizing to image containers inside the hero.
4. **Catalogue Data Changes:** `src/data/designs.ts` represents the verified source of truth for all 128 Sattva Homes designs. Area and frontage figures should be cross-verified against official brochures before modification.
5. **Clean Builds:** Ensure `npm run typecheck` and `npm run build` exit with code `0` before committing changes.
