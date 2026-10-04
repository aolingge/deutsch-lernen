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

## 2026-10-05 comprehensive life-resource expansion

- Source catalog now contains 331 resources across 25 categories. The expansion adds communication/social media, media/entertainment, food/delivery, shopping, finance and car-rental/trading entries while preserving the existing study, housing, jobs, government, health, mobility and travel records.
- Deployment `bad98e88-709d-4b2b-b5a3-a9caa4920eb6` passed `release-check.mjs`: 196 public detail pages, sitemap and 1200x630 share image returned valid responses before the D1 refresh.
- Remote D1 was then updated with 58 guarded `INSERT OR IGNORE` rows plus one guarded OBI canonical URL correction. Live public API now returns 254 resources across 25 categories: communication 14, media 9 and food 6.
- Live readback: home, resources, all three new category filters, WhatsApp and OBI detail pages, sitemap and robots returned 200. Public catalog contains no editorial evidence or historical instruction fields.
- Live link check after D1 refresh: 165 `ok`, 18 `restricted`, 0 `broken`, 13 `unchecked`. Restricted and unchecked responses remain advisory and are not treated as service-quality guarantees.
