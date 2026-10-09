# Website icon maintenance

The directory renders real website favicons on resource cards, detail pages and the provider index. The Chinese source name remains the accessible label; decorative images have empty alt text. Grid, list and narrow-screen views retain fixed icon containers and contain the image without changing its aspect ratio.

On 2026-10-05, 317 of the 324 public resource hostnames have local PNG icons (346 of 353 resource records). The remaining seven hosts show a neutral globe, as do newly added hosts without a cached icon. Image loading errors also reveal the globe, without retry loops or inline event handlers.

269 icons were retrieved directly from the original websites. For 48 sites whose direct retrieval failed, a manually enabled build-time fallback retrieved the indexed website favicon through Google. Visitors load every icon from this website; their browser does not contact Google or an external logo service for these images. Provenance URLs are recorded in `web/data/site-icons.json`. Indexed favicons can lag behind a website's current branding.

Maintenance from `web/`:

```powershell
python scripts/fetch-site-icons.py
# Optional fallback for websites that block original-asset retrieval:
python scripts/fetch-site-icons.py --indexed-fallback
npm run verify
$env:RESOURCE_HUB_BASE='http://127.0.0.1:8794'
python tests/site-icons-smoke.py
```

The fetcher needs the existing Python `requests` and Pillow packages. It preserves successful cached icons, validates public HTTPS destinations and each redirect, limits downloads, and decodes supported raster formats into PNGs no larger than 96 px. It does not publish remote SVG or HTML. To refresh a particular icon, remove its manifest entry and cached PNG, then rerun the command. Review replacements visually before publishing; automated download success does not establish that a provider has kept the same brand.

Original discovery follows homepage [`rel="icon"` declarations](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel) and Apple touch icons, with conventional favicon paths as fallbacks. Brand marks identify the linked sources and remain their owners' property.
