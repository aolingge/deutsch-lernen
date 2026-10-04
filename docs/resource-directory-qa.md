# Resource Directory QA Record

Run date: 2026-10-04

## Automated checks

- `npm run verify`: passed; 26 Node tests, Astro check with 0 errors/warnings/hints, 148 static pages built.
- `npm run links:live`: passed; live API source, 115 `ok`, 11 `restricted`, 0 `broken`, 4 `unchecked`.
- `python tests/cross-browser-smoke.py`: Chromium passed search, provider filtering, favorites controls and 320px reflow; Firefox and WebKit are reported unavailable when their local binaries are missing.
- `python tests/accessibility-smoke.py`: keyboard search/filter flow, 200% text at 320 CSS pixels and six landmarks passed.
- `python tests/performance-smoke.py`: three online Chromium samples; LCP `1316/1176/1196 ms`, median navigation `1271.2 ms`, transfer size `17764` bytes in the current run.

## Live endpoints

The deployed site returned 200 for the home page, resources, favorites, sources, representative detail pages, public catalog API, sitemap and robots. The public API returned 130 resources and 12 categories. No Cloudflare Access admin write was attempted without an admin session.

## Limits

The performance numbers are repeatable lab samples without CPU/network throttling and do not prove field Core Web Vitals. Firefox/WebKit binaries, a real screen reader, a full 400% browser zoom audit and source-by-source editorial reread of all 130 records remain external follow-up checks.

## 2026-10-04 Germany resource portal expansion

- The catalog now contains 273 public resources across 22 categories. The new entries cover social communities, housing, jobs, classifieds and rentals, mobility, government services, finance, health, shopping and travel.
- The earlier 130-resource / 12-category figures above are historical evidence from the prior release; current verification must use the 273 / 22 baseline.
- Third-party sites may require login, region access or anti-bot clearance. Link checks classify those responses as `restricted` or `unchecked`; a passing link check does not guarantee service quality or continued availability.
- Final live deployment `c16f3142-546f-4da0-ad69-635ebe471be3`: the public API returned 196 resources and 22 categories with zero editorial-field leaks; `release-check.mjs` passed all 196 detail pages, sitemap and 1200x630 share image.
- Final live link check: 174 `ok`, 17 `restricted`, 0 `broken`, 5 `unchecked`. The three stale official URLs found during the first post-deploy check were corrected in D1 with audited `catalog-maintenance` revisions before this final run.
