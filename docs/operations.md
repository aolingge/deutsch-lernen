# Resource Directory Operations

## Public catalog checks

Run the repository catalog check from `web/`:

```powershell
npm run validate:catalog
npm run links:live
```

The link checker is report-only. `ok`, `restricted`, `broken` and `unchecked` remain distinct; no result archives or edits a resource automatically. The live mode validates the public API schema, limits the response to 5 MiB/500 resources, checks DNS addresses, and records the catalog source and check timestamp in `.wrangler/resource-links-live.json`.

## Catalog editing

The admin page remains protected by Cloudflare Access. Resource writes require the signed Access identity, same-origin JSON requests, server-side schema validation and the current revision for updates. A conflict returns `409`; reload the record before editing again.

The public admin export is an exchange file containing published public resources only. It is not a complete D1 backup and never contains audit rows, actor identity or revisions. Do not place a protected database export in the repository or public API.

Imports are previewed in the admin page and saved as drafts. Existing records are not silently overwritten; duplicate IDs, slugs and canonical URLs are rejected by the Worker.

## Favorites backup

The `/favorites/` page exports a versioned JSON file containing favorite IDs only. Import validates `version: 1`, file size and IDs, then asks for a merge confirmation. Goals and private tasks stay in the existing browser storage record and are not exported.

## Recovery boundary

Do not change D1 data, DNS, Access policy or deployment credentials as part of routine link maintenance. Cloudflare D1 recovery options depend on the account plan and database configuration; verify those settings before promising a restoration window.
