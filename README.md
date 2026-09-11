# pdxtraffic.com

Every ODOT traffic camera in Oregon on one map. Deployed to
[pdxtraffic.com](https://pdxtraffic.com) from GitHub Pages.

## Running it

Requires Node 22 (see `.nvmrc`).

```bash
nvm use
npm install
cp .env.example .env.local   # then paste a Mapbox pk. token
npm run dev
```

| Script              | What it does                                            |
| ------------------- | ------------------------------------------------------- |
| `npm run dev`       | Vite dev server                                         |
| `npm run build`     | Typecheck, build to `dist/`, copy the 404 SPA fallback  |
| `npm run preview`   | Serve the production build                              |
| `npm run typecheck` | Typecheck only                                          |

## Mapbox token

Set `VITE_MAPBOX_TOKEN` in `.env.local` (see `.env.example`). CI reads the same
name from a repository variable. Without it, the map will not load.

## Layout

```
src/
  components/
    layout/    header, footer, page shell
    ui/        sticker cards, buttons, marquee, rain, dividers
    map/       MapCanvas wrapper + the camera map and its controls
    landing/   homepage sections
  pages/       Home, Cams, 404
  lib/         Mapbox config, camera data loading, helpers
public/
  data/        ODOT camera JSON and assorted GeoJSON
attic/         large imagery nothing references, kept out of the build
```

## Deploying

Pushing to `main` triggers
[.github/workflows/deploy.yml](.github/workflows/deploy.yml), which builds and
publishes to GitHub Pages. The repository's Pages source must be set to
**GitHub Actions** (Settings → Pages), not the old `gh-pages` branch.

Camera imagery comes from ODOT TripCheck. Maps and routing come from Mapbox.
This site is affiliated with neither.
