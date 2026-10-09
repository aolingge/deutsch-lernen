# Resource directory next phase — execution ledger

Plan: `docs/superpowers/plans/2026-10-04-resource-directory-next-phase.md`
Baseline: `7c0488e` (application baseline `749127b`).
Authorization: execute all twelve packages, verify and deploy the configured website without reconfirmation. No Git push, DNS, payment, account or destructive recovery operation.

## Rulings

- Execution supersedes the plan's planning-only status. Reuse the clean existing feature checkout and deployment tools.
- Hindsight tool metadata was searched; no callable Hindsight tool is exposed. Do not claim memory retrieval or fabricate a call.
- The executing-plans skill's referenced test-driven-development package is not present at its stated path. Use existing Node tests for behavioral contracts; avoid implementation-mirroring tests for simple CSS/doc changes.
- Do not launch a separate unattended Ralph runner while this active session owns the edits and deployment. This ledger provides continuation state.
- W02 and W03 share filter fields; establish optional metadata first and use one facet implementation for initial and refreshed data.
- W04 public resources may be updated; all archived owned guides and historical tutorial text remain preserved.
- W08 CI preparation is in scope; pushing the repository is not implied by website deployment authorization.

## Packages

| Package | Status | Evidence |
| --- | --- | --- |
| W01 rules/baseline | complete | baseline, plan, editorial policy and execution ledger recorded |
| W02 live facets | complete | dynamic facet options/counts, provider filter, unavailable value preservation; tests pass |
| W03 compatible model | complete | optional metadata, date/list/evidence validation and public snapshot exclusions; `npm run check` passes |
| W04 all resources | complete for this release | high-priority Goethe, Anki, Duden and information-level corrections applied; 130 public rows remain eligible for later source-by-source editorial refresh |
| W05 visuals | complete | single-result grid capped at 760px; responsive black-box checks at 320/375/1440 pass |
| W06 providers | complete | stable provider facet and source index with counts/links |
| W07 search | complete | TestDaF, Wörterbuch transliteration, price aliases and resource aliases covered by regression tests |
| W08 link maintenance | complete | repository and live-D1 link checker modes; final live run 115 ok, 11 restricted, 0 broken, 4 unchecked; CI uploads both reports and never auto-archives |
| W09 administration | complete for this release | editor exposes optional historical text and new metadata; live protected write workflow intentionally not exercised without an admin session |
| W10 favorites | complete | versioned local JSON export/import with size/schema validation, merge confirmation, dedicated contract tests; private goals/tasks remain untouched |
| W11 metadata/performance | complete for current scope | canonical/OG image/JSON-LD/sitemap/robots and CSP Report-Only verified live; repeatable Chromium lab samples recorded, no field INP claim |
| W12 regression/deploy | complete | local verify, live link check, accessibility/keyboard/reflow smoke, Chromium/Firefox/WebKit cross-browser smoke, performance samples, API/D1 consistency, headers and live detail checks passed; current deployment is recorded below |

## Checkpoints

- Execution started with no unrelated tracked changes.
- Focused implementation is committed locally; no Git push or external repository sync performed.
- `npm run verify` passes: catalog validation, Astro check, 23 Node tests, and static build (148 pages).
- Browser smoke passes on local Astro server at 320, 375 and 1440 px; screenshots saved as `web/browser-{320,375,1440}.png`.
- Worker deployment succeeded at version `f4121223-dd40-49e0-8979-dd98afc5a85f`; live API contains 130 resources and 12 categories.
- Remote D1 metadata refresh used guarded `catalog-seed` revision updates; five edited rows now have audit revisions and live API reflects the verified metadata.
- Live Playwright smoke uses `domcontentloaded` plus DOM readiness because network-idle is not a stable Worker completion condition; it passed at 320, 375 and 1440 px.
- Final link report: `.wrangler/resource-links-final.json` with 114 ok, 11 restricted, 0 broken and 5 unchecked.
- Live link report: `.wrangler/resource-links-live.json` with 115 ok, 11 restricted, 0 broken and 4 unchecked; catalog source is the public D1 API.
- QA artifacts: `tests/accessibility-smoke.py`, `tests/cross-browser-smoke.py`, `tests/performance-smoke.py`; Chromium, Firefox, WebKit and keyboard/reflow passed in the final run.
- OG image, JSON-LD and CSP Report-Only were verified on a live detail response; `/og-directory.png` returned 200.
- Favorites backup controls were deployed and verified at `/favorites/`; import merges valid IDs and does not overwrite private goals/tasks.
- Final deployment version: `d20faad7-d7ce-4d31-a7e4-b76dee160324`; live reader readback confirms translation coverage and the machine-translation note, while the public API remains 130 resources / 12 categories with zero editorial-field leaks. Live endpoints and key detail pages returned 200. Import checks version 1 and asks for a merge preview before writing.
- Remaining limit: no real Cloudflare Access admin write flow was exercised; no claim is made for that path.

## 2026-10-04 comprehensive audit closeout

- Follow-up commit `91c7408` hardened streamed request limits, catalog fallback validation, DNS-pinned link checks, metadata-preserving admin edits/import resume, favorites backup overflow handling, public editorial-field projection, provider indexes, SEO/share metadata, and reader accessibility.
- Guarded remote D1 refresh updated 15 information portals and corrected Hochschulkompass to its verified HTTPS home URL. Public API remains 130 resources / 12 categories; public editorial fields remain excluded.
- Local verification: 36 Node tests, Astro check 0/0/0, 149-page build, Chromium/Firefox/WebKit browser flows passed, axe checks passed with no known violations, and laboratory performance samples recorded in `web/.wrangler/qa/performance.json`.
- Live verification after deployment `9df89422-d766-4f94-9a04-6e61459ede4e`: all 130 detail pages, sitemap and 1200x630 share image passed; live catalog has 130 resources, 16 information-scope records, no editorial-field leaks; link report is 114 ok, 11 restricted, 0 broken, 5 unchecked.
- Automated checks do not replace a real screen reader, full browser zoom audit, source-by-source editorial reread, field Core Web Vitals, or a real Cloudflare Access admin write session. No Firefox/WebKit or Access limitations are claimed as passed without evidence.

## 2026-10-04 Germany resource portal expansion

- Expanded the public directory from the historical 130 resources / 12 categories to 273 resources / 22 categories, adding a Germany-wide set of entries for social communities, housing, jobs, second-hand and rental marketplaces, mobility, government, finance, health, shopping and travel.
- Unified visible metadata around the Germany-wide resource portal brand, refreshed the share card, added search aliases for the new life-resource categories, and added restrained category accent colors.
- Existing favorites, private tasks, reader content, audit history and hand-edited D1 records remain preserved. No Git push, DNS change, payment, account messaging or Cloudflare Access admin write was performed.
- Link checks remain advisory: restricted, unchecked and login/region-gated sites are retained and labelled rather than treated as confirmed broken links.
- Final deployment `c16f3142-546f-4da0-ad69-635ebe471be3` passed live readback: 196 public resources, 22 categories, zero evidence leaks, 174 ok / 17 restricted / 0 broken / 5 unchecked links, and all 196 detail pages plus sitemap/share image passed release checks.

## 2026-10-05 comprehensive life-resource expansion

- Source catalog now contains 331 resources across 25 categories, including communication/social media, media/entertainment, food/delivery, shopping, finance and car-rental/trading entries.
- Local verification passed: catalog validation 331/25, Astro check 0/0/0, 36 Node tests, and a 272-page static build.
- Deployment `bad98e88-709d-4b2b-b5a3-a9caa4920eb6` completed successfully. Remote D1 received 58 guarded inserts and one guarded OBI URL update in six small batches to avoid transient upload failures.
- Live public API now contains 254 resources across 25 categories; communication 14, media 9 and food 6. WhatsApp, OBI, Wolt, Netflix and N26 records are present, and representative detail/category pages returned 200.
- Historical 196-record link report `.wrangler/resource-links-live.json`: 165 ok, 18 restricted, 0 broken, 13 unchecked. The checks started before the D1 refresh; this is not a complete audit of the subsequent 254-record catalog. Release check passed 196 public details at that point.
- Remaining limitation: third-party login, regional access, anti-bot behavior and the 13 unchecked links require periodic re-checks; these are retained as advisory states.

## 2026-10-05 real website icons

- Cached 220 website icons as decoded PNGs, covering 247/254 public records. Seven unavailable icons use a neutral globe. Cards, details and provider rows share the same icon resolver; browser loading errors reveal the fallback. No runtime external logo-service requests.
- Verified 38 Node tests, Astro diagnostics 0/0/0 and 272-page build. Icon checks and existing flows passed Chromium/Firefox/WebKit; local axe reported no known violations, with existing manual-review items retained.
- Deployment `4cc1f9ab-ff10-4597-acda-b56179c7cb4a` is live. Icon checks passed all three browsers against the live site; release checks now cover all 254 detail pages plus sitemap/share image with no failures.
- Project instructions now explicitly permit focused local commits after verification without reconfirmation. No remote Git push or D1 data update was needed for this presentation change.
- All 220 live PNGs match local SHA-256 hashes; live catalog remains 254/25 with zero editorial leaks. Publication heuristic still reports non-private numeric matches in new provenance URLs/SVG geometry and existing reader data; task-file findings were reviewed manually, without changing the scanner or unrelated reader files.
- Final mobile text-enlargement check found and fixed provider-index overflow at 320px / 200% text. The expanded icon smoke suite passes the category, sources and detail views in all three browsers after wrapping/grid-track corrections.

## 2026-10-05 comprehensive everyday-directory audit and expansion

- Added 76 original-service entry points; source 407/28, live public 330/28, applications 65. New categories postal/household/leisure; daily-life and language navigation groups, primary application filter, Chinese/German aliases, bounded desktop category navigation and mobile breakpoint positioning.
- Corrected Omio's unrelated .de lookalike to official .com, removed the wrong icon, and confirmed OBI's raw 404 is browser-dependent (isolated browser 200). UPS 200 Access Denied is restricted. No deletion or fabricated zero-error link report.
- 42 Node tests, Astro 0/0/0, 348-page build passed. Three-browser everyday and existing flows passed; 320px/200% text and icon checks passed. Facet aggregation avoids repeated per-provider scans and duplicate form calculations; median microbenchmark 20.10 -> 1.20 ms.
- D1 applied 76 guarded additions + four seed-only updates in eight batches, retaining audit/history and unrelated online edits. Final deployment dc102080-09e7-4961-a6b6-6b087ee0488f. Public readback 330/28, zero editorial leaks. Release 330 details/sitemap/share image and all 295 PNG hashes passed.
- Full live link report 258 ok /61 restricted /1 raw broken (OBI browser 200) /10 unchecked. Seven icon fallbacks remain. Publication heuristic still red on 71 non-private numeric contexts, including unchanged reader data; all findings were context-reviewed without modifying unrelated content or the scanner.
- Evidence: docs/everyday-resource-audit-2026-10-05.md and docs/resource-directory-qa.md. No Git push, DNS, payment or real-account messages.

## 2026-10-05 regional applications, libraries and detail-query follow-up

- Source 430/28; live 353/28; effective application filter 106 (mediaTypes with formats fallback). Added 23 official entries for regional transit, parking, bicycles, digital libraries, browser/email, office/notes/meetings and hotels. Nine existing application tags verified; Swapfiets deduplicated.
- Link audit for 32 changed records: 30 ok /1 restricted (REWE 403) /1 unchecked (VVS timeout; independent strict TLS failure). Eligibility and region/cost notes remain explicit. 317 local real favicons cover 346/353; seven neutral fallbacks.
- Vertical desktop category visibility and Chinese/German aliases improved. Local existing, everyday and icon flows passed Chromium/Firefox/WebKit, 320px/200% text; live everyday flows passed all three. Axe no known violations, existing manual items retained.
- 44 Node tests, Astro 0/0/0, 371 static pages passed. D1 inserted 23 and updated nine untouched seed rows in four guarded batches; all 32 changes matched live readback. Existing authentication loaded through established shell profile, no credential changes.
- Initial deployment 7eb62a01-b6d4-42da-8132-895b6a087953. All 317 published icons matched local SHA-256. Full release checks initially had 25 then 14 detail failures; second run identified HTTP503 and a sitemap failure. Raw reports preserved.
- Detail route now fetches only the current published row via existing unique slug index, with draft/corrupt/evidence/database-failure regressions; no cache/schema change. Release diagnostics report actual HTTP status and mark sitemap/image checks successful only after validation. Index SEARCH verified with EXPLAIN QUERY PLAN.
- Final deployment 795773b9-4efc-499f-85bb-912f6732eb0a passed all 353 details, full sitemap, 1200x630 PNG and public-field privacy at unchanged four-request concurrency. Exact earlier 503 cause remains unproven; no universal uptime claim.
- Publication checker still red on 73 phone-like matches, no other finding types. New public favicon asset IDs context-reviewed; unchanged reader/loopback/SVG/public identifier contexts retained. No scanner bypass or unrelated reader changes, Git push, DNS/payment or account messaging.
- Evidence: docs/regional-and-tools-audit-2026-10-05.md and docs/resource-directory-qa.md.

## 2026-10-08 reader plan completion and live verification

- Reader: 20 original books, 529 bounded segments; compact display/speech menus, collapsed mobile library, paragraph anchors and real old-layout migration. Local EPUB import/export, paragraph sharing and free browser/Edge natural-reading path delivered. Independent cloud TTS remains pending provider/budget selection.
- Optional manual sync: gzip + AES-GCM in browser, capability hash/ciphertext/revision in existing D1, bounded record count/body/rate, merge and conflict handling. Imported books and linked vocabulary contexts excluded. Migration 0006 applied remotely through established deployment authentication. No new paid resource or credentials.
- Verification: 50 Node tests, Astro 0/0/0, 391 pages; loading/library/completion/migration/accessibility/connections flows passed locally in three browsers where applicable. Actual old pixel migration checked at 375/1440 in all three engines.
- Live version 4fdb80c1-0041-4320-b07d-241ee804db69: eight routes HTTP 200, twelve asset hashes match dist, public catalog 371/28 unchanged. Completion and connections flows passed Chromium/Firefox/WebKit; Chromium two isolated profiles validated real remote encrypted sync, merge, wrong key rejection and local-book exclusion.
- Voice controls use API mocks; device voice quality and native mobile share chooser remain unverified. No universal EPUB-device compatibility claim. Repository publication heuristic remains red on historical research/cache/numeric contexts; changed-file private-data scan and diff checks passed. No Git push or DNS/payment/account-message actions.
- Evidence and boundaries: docs/site-optimization-plan-20261008.md; local reports under web/output/reader-completion-qa and web/output/site-connections-qa (not committed).
