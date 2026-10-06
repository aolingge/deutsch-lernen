# German Resource Directory

[简体中文](README.md) | English

A Chinese-language directory of German language and Germany study/life resources. Resource titles open original websites directly. The current source catalog contains **436 source records across 28 categories**; the live public API currently exposes 359 entries across 28 categories after excluding owned/archive and unpublished records and hiding internal editorial fields.

[Open the website](https://deutsch-lernen-resource-hub.pirostonelsonrx688.workers.dev/)

Search multiple keywords and combine category, level, skill, exam, cost, access and format filters. The directory supports pagination, original-title/date sorting, card/list views and browser-local favorites. Filter URLs are shareable. Third-party content is linked rather than mirrored.

The public interface focuses on resources. Previous authored study guides remain in the [historical documentation](docs/README.md) and archived data, outside the public directory. Existing private browser goals, tasks and saved IDs are preserved.

## Development

Requires Node.js 22 or newer.

```powershell
cd web
npm ci --ignore-scripts
npm run dev
npm run verify
```

Open `http://localhost:4321/`. For the Worker/D1 preview, deployment preparation, research and verification details, see the [directory review](docs/resource-directory-review.md).

```powershell
pwsh -File tools/publication-check.ps1 .
```

## Contributions and licensing

Resource suggestions should include original URLs, short descriptions, cost/access conditions and source-backed metadata. Official and editorial level labels are distinguished. Automated access restrictions are not described as confirmed broken links.

[Contributing](CONTRIBUTING.md) · [Privacy](PRIVACY.md) · [Security](SECURITY.md)

Original documentation: [CC BY 4.0](LICENSE-CONTENT.md). Code: [MIT](LICENSE-CODE.md). Third-party material retains its original rights.
