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
- Final deployment version before the reader status follow-up: `9df89422-d766-4f94-9a04-6e61459ede4e`; the reader status follow-up is deployed after the final commit below. Live endpoints and key detail pages returned 200. Import checks version 1 and asks for a merge preview before writing.
- Remaining limit: no real Cloudflare Access admin write flow was exercised; no claim is made for that path.

## 2026-10-04 comprehensive audit closeout

- Follow-up commit `91c7408` hardened streamed request limits, catalog fallback validation, DNS-pinned link checks, metadata-preserving admin edits/import resume, favorites backup overflow handling, public editorial-field projection, provider indexes, SEO/share metadata, and reader accessibility.
- Guarded remote D1 refresh updated 15 information portals and corrected Hochschulkompass to its verified HTTPS home URL. Public API remains 130 resources / 12 categories; public editorial fields remain excluded.
- Local verification: 36 Node tests, Astro check 0/0/0, 149-page build, Chromium/Firefox/WebKit browser flows passed, axe checks passed with no known violations, and laboratory performance samples recorded in `web/.wrangler/qa/performance.json`.
- Live verification after deployment `9df89422-d766-4f94-9a04-6e61459ede4e`: all 130 detail pages, sitemap and 1200x630 share image passed; live catalog has 130 resources, 16 information-scope records, no editorial-field leaks; link report is 114 ok, 11 restricted, 0 broken, 5 unchecked.
- Automated checks do not replace a real screen reader, full browser zoom audit, source-by-source editorial reread, field Core Web Vitals, or a real Cloudflare Access admin write session. No Firefox/WebKit or Access limitations are claimed as passed without evidence.
