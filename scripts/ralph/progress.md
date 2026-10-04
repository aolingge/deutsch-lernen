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
| W08 link maintenance | pending | repo-only checker |
| W09 administration | complete for this release | editor exposes optional historical text and new metadata; live protected write workflow intentionally not exercised without an admin session |
| W10 favorites | pending | local export/import absent |
| W11 metadata/performance | pending | OG image/CSP/lab measurements |
| W12 regression/deploy | complete | local verify, local and live browser smoke, API/D1 consistency, headers, sitemap/robots and live detail checks passed |

## Checkpoints

- Execution started with no unrelated tracked changes.
- Focused local implementation is currently uncommitted; no push or external repository sync performed.
- `npm run verify` passes: catalog validation, Astro check, 23 Node tests, and static build (148 pages).
- Browser smoke passes on local Astro server at 320, 375 and 1440 px; screenshots saved as `web/browser-{320,375,1440}.png`.
- Worker deployment succeeded at version `f4121223-dd40-49e0-8979-dd98afc5a85f`; live API contains 130 resources and 12 categories.
- Remote D1 metadata refresh used guarded `catalog-seed` revision updates; five edited rows now have audit revisions and live API reflects the verified metadata.
- Live Playwright smoke uses `domcontentloaded` plus DOM readiness because network-idle is not a stable Worker completion condition; it passed at 320, 375 and 1440 px.
- Remaining limit: no Firefox/WebKit or real Cloudflare Access admin write flow was exercised; no claim is made for those paths.
