# pdxtraffic.com

Every ODOT traffic camera in Oregon on one map — all **1,062** of them — plus
live TripCheck incidents and work zones. Built as a Vite + React app and
deployed to [pdxtraffic.com](https://pdxtraffic.com) via GitHub Pages.

Nothing here is official. Camera imagery and traveler data come from
[ODOT TripCheck](https://www.tripcheck.com/); maps come from
[Mapbox](https://www.mapbox.com/). This site is affiliated with neither.

## Stack

| Piece | Choice |
| ----- | ------ |
| App | React 19 + TypeScript + React Router |
| Build | Vite 8 (Node 22) |
| Styles | Tailwind CSS v4, custom “Portland Weird” tokens in `src/styles/theme.css` |
| Maps | `react-map-gl` + Mapbox GL JS |
| Deploy | GitHub Actions → GitHub Pages |

## Running it

Requires **Node 22** (see `.nvmrc`).

```bash
nvm use
npm install
cp .env.example .env.local   # Mapbox pk. token + TripCheck API key
npm run fetch-incidents      # refresh incidents + work-zone GeoJSON
npm run dev
```

| Script | What it does |
| ------ | ------------ |
| `npm run dev` | Vite dev server with HMR |
| `npm run fetch-incidents` | Call TripCheck Incidents + WZDx APIs → `incidents.json` + `traffic.geojson` |
| `npm run build` | Fetch traveler data (`prebuild`), typecheck, build to `dist/`, copy SPA `404.html` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Typecheck only |

### Mapbox token

Create a public token at [account.mapbox.com/access-tokens](https://account.mapbox.com/access-tokens/)
and put it in `.env.local`:

```
VITE_MAPBOX_TOKEN=pk.your_token_here
```

Without it, the camera map will not load. Vite inlines it at build time. Do not
commit `.env.local`.

For production, set `VITE_MAPBOX_TOKEN` under
**Settings → Secrets and variables → Actions** as a **Secret** or **Variable**.
Do not put it only on the `github-pages` Environment — the build job never sees
that.

### TripCheck API key

Subscribe at the [ODOT API portal](https://apiportal.odot.state.or.us/) (TripCheck
Data product) and put the subscription key in `.env.local`:

```
TRIPCHECK_API_KEY=your_subscription_key
```

This key is used **only** by `scripts/fetch-incidents.mjs` at build time. Never
prefix it with `VITE_` — that would ship it to the browser.

For production, add a repository Actions **Secret** named `TRIPCHECK_API_KEY`.
The deploy workflow fails if it is missing.

## What’s on the site

- **`/`** — Landing: hero, marquee, live-cams teaser, TripCheck incident feed, about
- **`/cams`** — Clustered cameras plus incident points and work-zone corridors;
  search/filter cameras; click for TripCheck stills or traveler-alert popups

Routes are client-side (React Router). The build copies `index.html` to
`404.html` so deep links and refreshes work on GitHub Pages.

## Project layout

```
src/
  components/
    layout/     header, footer, page shell
    ui/         sticker cards, buttons, marquee, rain, dividers
    map/        MapCanvas, cameras, traffic overlay, popups, search
    landing/    homepage sections (hero, teaser, traffic feed, about)
  pages/        Home, Cams, 404
  lib/          Mapbox config, camera + traffic loaders, helpers
  styles/       theme tokens and global CSS
public/
  data/         odot-cams.json, incidents.json, traffic.geojson
  CNAME         pdxtraffic.com
scripts/
  fetch-incidents.mjs   TripCheck Incidents + WZDx → static JSON/GeoJSON
.github/workflows/
  deploy.yml            build + publish to Pages on push to main
attic/                  large unused imagery (not part of the app bundle)
```

Legacy standalone Mapbox HTML demos may still exist under `public/directions/`,
`isochrone/`, `map-matching/`, `matrix/`, and `optimization/` on a local clone.
Those directories are **gitignored** (they contain hardcoded Mapbox tokens that
trip GitHub push protection) and are not part of the published site.

## Data

| File | Source | Used for |
| ---- | ------ | -------- |
| `public/data/odot-cams.json` | ODOT / TripCheck camera inventory | Camera map markers |
| `public/data/incidents.json` | TripCheck Incidents API via `fetch-incidents` | Homepage feed |
| `public/data/traffic.geojson` | TripCheck Incidents + WZDx via `fetch-incidents` | Cams map overlay |
| TripCheck cam JPEGs | `https://tripcheck.com/RoadCams/cams/…` | Popup stills (browser) |

`npm run build` always refreshes traveler JSON via `prebuild`. Camera inventory
is checked in as static JSON and updated manually when needed.

API endpoints used by the fetcher:

- `https://api.odot.state.or.us/tripcheck/Incidents`
- `https://api.odot.state.or.us/WZDx/v4.0/Workzones`

## Deploying

Pushing to `main` runs [.github/workflows/deploy.yml](.github/workflows/deploy.yml):

1. `npm ci` + `npm run build` (with Mapbox + TripCheck secrets)
2. Upload `dist/` as a Pages artifact
3. Deploy with `actions/deploy-pages`

**One-time repo setup**

1. Pages source → **GitHub Actions** (`Settings → Pages`), not the old `gh-pages` branch
2. Actions Secret/Variable `VITE_MAPBOX_TOKEN`
3. Actions Secret `TRIPCHECK_API_KEY`
4. Custom domain / `public/CNAME` already points at `pdxtraffic.com` if DNS is set

You can also trigger a deploy manually with **Actions → Deploy to GitHub Pages → Run workflow**.
