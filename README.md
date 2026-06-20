# Middle-earth Map

An interactive Next.js map for exploring places, events, battles, and paths from
*The Hobbit* and *The Lord of the Rings*.

The app renders a high-resolution Middle-earth map with pan/zoom controls,
filterable markers, route overlays, collapsible side panels, and selected item
details.

## Getting Started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful Commands

```bash
npm run lint
npm run build
```

For visual checks, run the dev server and capture a screenshot:

```bash
npx playwright screenshot --viewport-size=1440,1000 http://localhost:3000 /tmp/middle-earth-map.png
```

## Project Structure

- `app/page.tsx`: route entrypoint.
- `app/components/middle-earth-map.tsx`: the only map component with `"use client"`; owns pan/zoom/filter state and browser events.
- `app/components/map/`: presentational components and pure helpers for the map UI.
- `lib/map-data.ts`: typed places, events, and paths.
- `public/map/map.webp`: base map image.
- `DESIGN.md`: Slack-inspired UI reference used for overlay styling.

## Map Data

Marker coordinates in `lib/map-data.ts` are normalized `{ x, y }` values against
the `5000x4344` map image. Conversion to pixel coordinates happens in
`app/components/map/geometry.ts`.

## Notes

- The base map file is served directly as a raw image for sharpness.
- The reference site currently uses the same `5000x4344` WebP asset as a single image overlay.
- Keep interactive browser logic inside `middle-earth-map.tsx` when possible; avoid adding `"use client"` to pure presentation modules.
- See `AGENTS.md` for additional guidance for coding agents working in this repo.
