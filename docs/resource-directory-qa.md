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
- Historical link report for the 196-record snapshot: 165 `ok`, 18 `restricted`, 0 `broken`, 13 `unchecked`. This report started before the D1 refresh and does not cover all 254 current records. Restricted and unchecked responses remain advisory and are not treated as service-quality guarantees.

## 2026-10-05 real website icons

- Replaced generated domain initials with locally cached website favicons on cards, detail pages and the provider index. 220 hosts have icons, covering 247 of 254 public records; seven records use a neutral globe. Original and indexed icon provenance is documented in `site-icons.md`.
- `npm run verify`: 38 Node tests passed, Astro check 0 errors/warnings/hints, 272 static pages built.
- Local Chromium, Firefox and WebKit checks passed existing directory/reader flows and the icon-specific suite: original image decoding, local-only image requests, grid/list sizing, 320/375/768/1440 reflow and an injected 404 revealing the neutral fallback.
- A final 320px / 200% text check found provider-index overflow from intrinsic grid sizing and long names. Zero-minimum grid tracks and wrapping fixed it; the icon suite now covers 200% text on category, source and detail views in all three browsers.
- Local accessibility smoke found no known axe violations; manual-review items for ARIA/color contrast remain incomplete and do not constitute a full screen-reader audit.
- Deployment `4cc1f9ab-ff10-4597-acda-b56179c7cb4a` completed. The live icon-specific suite passed in all three browsers. Release checks passed all 254 public detail pages, sitemap and 1200x630 share image with no failures.
- All 220 deployed PNGs were retrieved and SHA-256 compared to the local assets: no mismatches. Public API readback remains 254 resources / 25 categories with no editorial-field leaks.
- `tools/publication-check.ps1` remains red because its phone-number heuristic matches public favicon URL timestamps/asset IDs, the documented loopback address, SVG coordinates and pre-existing reader content. Findings in the changed files were manually reviewed as non-private numbers; no successful full privacy-scan result is claimed.

## 2026-10-05 everyday applications and full current-catalog audit

- Current source baseline: 407 records / 28 categories. Public live catalog: 330 resources / 28 categories; 65 records include applications. Added 76 services and postal, household and leisure categories. Full source index and findings: [everyday-resource-audit-2026-10-05.md](everyday-resource-audit-2026-10-05.md).
- Navigation separates everyday services from language resources. Application format and price are primary filters; language level remains in advanced filters. Desktop categories scroll within the viewport, mobile categories expand, and active categories remain visible when crossing the mobile breakpoint.
- `npm run verify`: 42 Node tests passed; Astro diagnostics 0 errors/warnings/hints; 348 static pages built. Aggregated facet counts are compared with the prior behavior under combined filters, favorites, unknown providers and pagination. A local 330-record microbenchmark measured median 20.10 ms before / 1.20 ms after; this is not a field performance guarantee.
- Local everyday-flow and existing regression suites passed Chromium, Firefox and WebKit, including search, app/category combinations, Back/reset, favorites/private-data preservation, reader keyboard behavior and malformed API fallback. New-category reflow passed 320px / 200% text. Icon-specific suites passed all three browsers. Axe smoke found no known violations; existing manual ARIA/contrast review items remain.
- D1 synchronization applied 76 `INSERT OR IGNORE` records and four guarded updates in eight batches, preserving audits and unrelated edits. Public readback matches the new records and fields; historical online reader descriptions and existing canonical URL differences were retained. No Git push, DNS/payment/account messaging or changes to reader content.
- Initial release `fa6492da-ec2e-4078-abde-0bfb0570867c`; final filter-performance release `dc102080-09e7-4961-a6b6-6b087ee0488f`. Live catalog contains 330/28 and no evidence/how-to fields. Full release check covers all 330 detail pages, sitemap and 1200x630 share image with no failures. All 295 deployed icon PNGs matched local SHA-256 hashes, covering 323/330 records; seven neutral fallbacks remain.
- Full 330-record live HTTP audit: 258 ok / 61 restricted / 1 broken / 10 unchecked. The one raw broken result is OBI: both plain HTTP methods return 404, but isolated Chromium returns 200 with the actual official shop and market page. OBI stays visible as restricted. UPS returns a 200 Access Denied body and is also explicitly restricted. The raw audit is retained unchanged; no claim that it passed with zero broken responses. Omio's incorrect lookalike domain was corrected to the official provider domain after content review.
- Publication checker remains red: 71 phone-like matches, with no token/private-key findings in this run. Context review found public icon asset identifiers, loopback examples, SVG geometry, existing reader timestamps/hashes and public Gutenberg license contacts. No scanner bypass or blanket allowlist was added. Markdown paths in changed documents were reviewed separately; this is not a successful full automated publication check.
- Final online Chromium laboratory sample: unthrottled cold/warm LCP 508/268 ms; 4x CPU + 1.6 Mbps + 150 ms latency cold/warm LCP 860/548 ms, CLS 0 in all samples. Throttled long-task totals dropped from 733/715 ms immediately before the facet change to 362/109 ms afterwards. These are single lab profiles, not field INP or a universal speed guarantee.

## 2026-10-05 regional transport, libraries and digital tools

- Current baseline: 430 source records / 28 categories; live public API 353 resources / 28 categories. The effective application filter returns 106 entries (mediaTypes takes precedence, with formats as fallback). Added 23 resources and verified application metadata for nine existing platforms without duplicating Swapfiets. Evidence index: [regional-and-tools-audit-2026-10-05.md](regional-and-tools-audit-2026-10-05.md).
- Regional transport covers hvv, VRR, RMV, VBB and VVS; parking and bicycles include EasyPark, Parkster, Donkey Republic and Call a Bike. Digital libraries explicitly require a participating library account and retain unknown membership costs. Added browser, email, office, note and meeting tools with original-service links.
- Desktop navigation now scrolls the category list vertically to reveal the active item, without scrolling the document. Library, parking, bicycle, meeting and browser aliases are searchable in Chinese and German.
- Verification: 44 Node tests; Astro diagnostics 0/0/0; 371 static pages. Chromium, Firefox and WebKit passed local existing flows, application/library search, desktop active-category visibility, mobile expansion, icons and 320px / 200% text. The everyday suite also passed against the live website in all three browsers. Axe smoke found no known violations; existing ARIA/contrast manual review remains incomplete.
- Incremental 32-record original-link audit: 30 ok / 1 restricted (REWE 403) / 1 unchecked (VVS timeout). A separate VVS request failed TLS verification; verification was not disabled. This is an incremental audit, not a new full 353-link external audit. Prior OBI/UPS access limits remain documented in the historical report.
- D1 applied 23 guarded inserts and nine seed-only updates in four batches. Live readback matches all 32 changed records and exposes no internal evidence/how-to fields. Deployment 7eb62a01-b6d4-42da-8132-895b6a087953 is live. An initial command missed the existing authentication profile; using the established shell profile restored deployment without changing authentication.
- All 317 deployed PNGs matched local SHA-256 hashes, covering 346/353 records; seven neutral fallbacks remain. Icons include 269 direct-origin downloads and 48 indexed downloads, served locally to visitors. The new 23 resource marks were visually reviewed.
- Publication checker remains red on 73 phone-like findings, with no other finding types. New icon findings are public filmfriend asset identifiers; remaining contexts include previously reviewed public icon IDs, deployment IDs, loopback examples, SVG geometry and unchanged reader data. Changed-document links passed a separate check. No scanner bypass, unrelated reader edits, Git push, DNS/payment or real-account messaging.

- Initial full-release checks passed 328/353 and then 339/353 detail pages; the second report identified HTTP 503 responses and a failed sitemap request. Reports are preserved rather than described as successful. The detail route now queries one current published record via the existing unique slug index instead of loading the entire catalog. Regression coverage rejects drafts/corrupt records, strips internal evidence and retains 503 when the database fails. Release diagnostics now report actual HTTP status and do not treat an unavailable sitemap as hundreds of missing URLs.

- Final deployment 795773b9-4efc-499f-85bb-912f6732eb0a: all 353 public detail pages passed, sitemap covered every resource, share image was valid 1200x630 PNG, and no internal editorial fields were exposed. The same four-request concurrency was retained. Local EXPLAIN QUERY PLAN confirms SEARCH via sqlite_autoindex_catalog_entries_2 for slug lookup. This successful run does not establish the exact cause of the earlier 503 responses or guarantee future availability.
