"""Render the native SVG with browser font fallback instead of raster font guessing."""
from pathlib import Path
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[1]
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1200, "height": 630}, device_scale_factor=1)
    page.set_content('<style>body{margin:0}</style>' + (root / 'public/og-directory.svg').read_text(encoding='utf-8'))
    page.evaluate('document.fonts.ready')
    page.screenshot(path=str(root / 'public/og-directory.png'))
    browser.close()
