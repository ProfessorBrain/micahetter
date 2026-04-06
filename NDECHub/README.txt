NDEC Hub — Open Neuro Education Library (v1)

Files:
- index.html (Library — dynamic resource browser)
- about.html (Static page)
- contribute.html (Static page)
- assets/styles.css
- assets/app.js (library logic + filtering)
- assets/page.js (static page drawer + search redirect)
- assets/favicon.svg

How it works:
- The library loads dynamically from a public Google Sheet (CSV). The Sheet ID is set in assets/app.js.
- Host as a static site over HTTP(S) (Netlify / GitHub Pages / Cloudflare Pages / etc.).
- Filters persist in the URL (query string), so you can share filtered views with colleagues.
