import os
from playwright.sync_api import sync_playwright


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        base = os.environ.get("RESOURCE_HUB_BASE", "http://127.0.0.1:4321")
        for width in (320, 375, 1440):
            page = browser.new_page(viewport={"width": width, "height": 900})
            errors = []
            page.on("pageerror", lambda error: errors.append(str(error)))
            page.goto(f"{base}/resources/", wait_until="domcontentloaded", timeout=60000)
            page.locator("[data-catalog-grid]").wait_for(timeout=15000)
            if os.environ.get("RESOURCE_HUB_SCREENSHOTS") == "1":
                page.screenshot(path=f"browser-{width}.png", full_page=True, timeout=0)
            assert page.locator("[data-catalog-grid] .resource-card").count() > 0
            assert page.locator("body").evaluate("el => el.scrollWidth <= window.innerWidth")
            if width == 1440:
                card_width = page.locator("[data-catalog-grid] .resource-card").first.bounding_box()["width"]
                assert card_width <= 760, card_width
            if errors:
                raise AssertionError(errors)
            page.close()
        page = browser.new_page(viewport={"width": 1280, "height": 900})
        page.goto(f"{base}/resources/", wait_until="domcontentloaded", timeout=60000)
        page.locator("[data-catalog-grid]").wait_for(timeout=15000)
        search = page.locator('input[name="q"]')
        search.fill("worterbuch")
        page.wait_for_timeout(250)
        assert page.locator("[data-result-count]").inner_text() != "0 个资源"
        page.locator("summary").filter(has_text="更多筛选").click()
        page.locator('select[name="provider"]').select_option(index=1)
        assert page.locator("[data-active-filters]").inner_text()
        page.goto(f"{base}/sources/", wait_until="domcontentloaded", timeout=60000)
        assert page.locator(".provider-index li").count() > 0
        browser.close()


if __name__ == "__main__":
    main()
