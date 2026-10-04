import json
import os
from playwright.sync_api import sync_playwright


def main():
    base = os.environ.get("RESOURCE_HUB_BASE", "http://127.0.0.1:4321")
    results = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1280, "height": 900})
        page.goto(f"{base}/resources/", wait_until="domcontentloaded", timeout=60000)
        page.locator("[data-catalog-grid]").wait_for(timeout=15000)
        page.locator('input[name="q"]').focus()
        page.keyboard.type("TestDaF")
        page.wait_for_timeout(300)
        assert page.locator("[data-result-count]").inner_text() != "0 个资源"
        page.locator("summary").filter(has_text="更多筛选").click()
        page.locator('select[name="provider"]').focus()
        page.keyboard.press("Home")
        page.keyboard.press("ArrowDown")
        page.keyboard.press("Enter")
        assert page.locator("[data-active-filters]").inner_text()
        page.set_viewport_size({"width": 320, "height": 900})
        page.evaluate("document.documentElement.style.fontSize='200%'")
        assert page.locator("body").evaluate("el => el.scrollWidth <= window.innerWidth")
        landmarks = page.locator("main, nav, aside, form").count()
        assert landmarks >= 4, landmarks
        results.append({"keyboard": True, "reflow320": True, "landmarks": landmarks})
        browser.close()
    print(json.dumps(results, ensure_ascii=False))


if __name__ == "__main__":
    main()
