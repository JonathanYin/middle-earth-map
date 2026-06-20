<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Notes

- This is a Next.js App Router project on Next `16.2.9`. Check local docs under `node_modules/next/dist/docs/` before changing framework APIs or conventions.
- The interactive map is intentionally client-side only at the top interaction boundary: `app/components/middle-earth-map.tsx` is the only map component that should need `"use client"`. Prefer keeping presentational components and utilities in `app/components/map/` without client directives.
- Map data lives in `lib/map-data.ts`. Coordinates are normalized `{ x, y }` values against the `5000x4344` map image and are converted through `app/components/map/geometry.ts`.
- The base map asset is `public/map/map.webp`. It is byte-identical to the reference site's current `https://cdn.middleearthmap.app/map.webp` image. Use the raw image path for sharpness; avoid routing it through `next/image` optimization unless there is a measured reason.
- Overlay code is split by responsibility:
  - `map-stage.tsx`: base image, path SVGs, place/event markers, map-attached labels.
  - `filter-panel.tsx`: search and layer/event/place filters.
  - `path-panel.tsx`: path legend and zoom controls.
  - `detail-panel.tsx`: selected place/event/path details.
  - `filtering.ts`, `geometry.ts`, `types.ts`, `icons.tsx`, `toggle-button.tsx`: pure helpers/presentation.
- The UI follows `DESIGN.md`, inspired by Slack: aubergine/cream surfaces, pill controls, soft elevated cards, and compact overlays. Do not force all labels into all-caps.
- Run `npm run lint` and `npm run build` after code changes. For visual changes, use Playwright screenshots against the running dev server, usually `http://localhost:3000`.
