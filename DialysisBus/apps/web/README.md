# Web application

This directory contains the responsive Phase 1 explorer shell. It uses the
Next.js App Router surface compiled by vinext for Sites-compatible deployment,
Google Maps JavaScript API for the configured basemap, and deck.gl for future
WebGL facility and stop layers.

Run locally:

```text
npm ci
npm run dev
```

Optional local environment values belong in `.env.local`; see `.env.example`.
Without a Google Maps browser key and vector map ID, the application renders an
explicitly labeled interface preview and never presents illustrative symbols as
source data.

Validation:

```text
npm run lint
npm run test
npm run build
npm run test:rendered
```
