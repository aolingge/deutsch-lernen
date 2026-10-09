# Resource Directory Operations

## Public catalog checks

Run the repository catalog check from `web/`:

```powershell
npm run validate:catalog
npm run links:live
```

The link checker is report-only. `ok`, `restricted`, `broken` and `unchecked` remain distinct; no result archives or edits a resource automatically. The live mode validates the public API schema, limits the response to 5 MiB/500 resources while streaming, pins the validated public DNS address, and keeps a timeout through body completion. Redirects are checked separately. The report records the source, timestamp, final URL and redirect count in `.wrangler/resource-links-live.json`.

## Catalog editing

The admin page remains protected by Cloudflare Access. Resource writes require the signed Access identity, same-origin JSON requests, server-side schema validation and the current revision for updates. A conflict returns `409`; reload the record before editing again.

The public admin export is an exchange file containing published public resources only. It is not a complete D1 backup and never contains audit rows, actor identity or revisions. Do not place a protected database export in the repository or public API.

Imports of 1–200 records are validated against current entries and within the upload before preview, then saved as drafts. Existing records are not silently overwritten; duplicate IDs, slugs and canonical URLs are also rejected by the Worker. After a partial failure, only the remaining rows are retried. A lost acknowledgement can require rereading the catalog to resolve a conflict.

Editing preserves fields that the form does not expose, including source evidence and aliases. A separately curated canonical URL remains intact unless the destination changes. Save uses the returned revision immediately. JSON body limits are enforced on streamed bytes: 32 KiB for catalog edits and 1 KiB for visit events.

## Favorites backup

The `/favorites/` page exports a versioned JSON file containing favorite IDs only. Import validates `version: 1`, file size, IDs and the combined limit of 500 favorites before asking for confirmation. Overflow is rejected without truncating existing IDs. IDs absent from the current public directory remain in the backup and the preview reports them. Goals and private tasks stay in the existing browser storage record and are not exported.

## Browser verification

From `web/`, install Playwright and its browser binaries in an existing Python environment, then set `RESOURCE_HUB_BASE` to the preview or live HTTPS URL. Run `tests/cross-browser-smoke.py`, `tests/accessibility-smoke.py` and `tests/performance-smoke.py`. The first requires Chromium, Firefox and WebKit to pass; missing engines fail the run. On Windows it can also use isolated binaries under `.wrangler/browsers/`.

Accessibility checks use the development dependency `axe-core`; it is not injected into the published site. Automated findings and manual-review flags are separate. Performance measurements use a shared cache for cold/warm visits and include an explicitly throttled profile; they are laboratory measurements, not field INP. `node scripts/release-check.mjs` checks every live public detail page, sitemap and share image. `tests/admin-smoke.py` uses simulated API responses and does not exercise a real Access session.

## Recovery boundary

Do not change D1 data, DNS, Access policy or deployment credentials as part of routine link maintenance. Cloudflare D1 recovery options depend on the account plan and database configuration; verify those settings before promising a restoration window.
