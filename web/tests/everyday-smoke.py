"""Everyday navigation and app-filter regression checks without desktop input."""
import os
import json
from playwright.sync_api import sync_playwright
from browser_support import ROOT, launch_browser, ready

base = os.environ.get('RESOURCE_HUB_BASE', 'http://127.0.0.1:8794')
report = []
with sync_playwright() as p:
    for name in ('chromium', 'firefox', 'webkit'):
        browser = launch_browser(p, name)
        page = browser.new_page(viewport={'width': 1280, 'height': 900})
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        ready(page, base, '/resources/')
        assert page.locator('.category-group-label').all_text_contents() == ['德国生活与应用', '德语学习与媒体']
        assert page.locator('a[data-category]').count() == 29
        page.locator('select[name="format"]').select_option('应用')
        assert 'format=' in page.url
        page.locator('a[data-category="postal"]').click()
        assert page.locator('.resource-card').count() == 5
        assert 'DHL' in page.locator('[data-catalog-grid]').inner_text()
        page.go_back(wait_until='domcontentloaded')
        assert page.locator('input[name="category"]').input_value() == ''
        assert page.locator('select[name="format"]').input_value() == '应用'
        page.locator('[data-reset]').click()
        page.locator('input[name="q"]').fill('报税')
        page.wait_for_function("document.querySelector('[data-active-filters]').textContent.includes('报税')")
        assert 'Taxfix' in page.locator('[data-catalog-grid]').inner_text()
        for category in ('postal', 'household', 'leisure'):
            ready(page, base, '/resources/?category=' + category)
            assert page.locator('.resource-card').count() >= 5
            page.set_viewport_size({'width': 320, 'height': 900})
            page.evaluate("document.documentElement.style.fontSize='200%'")
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), category
            page.evaluate("document.documentElement.style.fontSize=''")
            button = page.locator('[data-category-expand]')
            button.click()
            assert button.get_attribute('aria-expanded') == 'true'
            assert page.locator('a[data-category="courses"]').is_visible()
            page.set_viewport_size({'width': 1280, 'height': 900})
        assert not errors, errors
        if name == 'chromium':
            ready(page, base, '/resources/?category=postal')
            page.screenshot(path=str(ROOT / '.wrangler/everyday-desktop.png'), full_page=True)
            page.set_viewport_size({'width': 375, 'height': 900})
            page.wait_for_function("document.querySelector('a.category-link[aria-current]').getBoundingClientRect().left >= 0 && document.querySelector('a.category-link[aria-current]').getBoundingClientRect().right <= innerWidth")
            page.screenshot(path=str(ROOT / '.wrangler/everyday-mobile.png'), full_page=True)
        report.append({'browser': name, 'status': 'passed', 'flows': ['app filter/back/reset', 'tax search', 'new categories', 'mobile expand', '320px/200% text']})
        browser.close()
print(json.dumps(report))
