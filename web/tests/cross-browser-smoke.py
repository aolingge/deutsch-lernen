import json
import os
from playwright.sync_api import sync_playwright


def main():
    base = os.environ.get("RESOURCE_HUB_BASE", "http://127.0.0.1:4321")
    report = []
    with sync_playwright() as p:
        for name in ("chromium", "firefox", "webkit"):
            browser_type = getattr(p, name)
            try:
                browser = browser_type.launch(headless=True)
            except Exception as error:
                report.append({"browser": name, "status": "unavailable", "reason": str(error)[:240]})
                continue
            page = browser.new_page(viewport={"width": 1280, "height": 900})
            errors = []
            page.on("pageerror", lambda error: errors.append(str(error)))
            page.goto(f"{base}/resources/", wait_until="domcontentloaded", timeout=60000)
            page.locator("[data-catalog-grid]").wait_for(timeout=15000)
            page.locator('input[name="q"]').fill("worterbuch")
            page.wait_for_timeout(300)
            assert page.locator("[data-result-count]").inner_text() != "0 个资源"
            page.keyboard.press("/")
            assert page.locator('input[name="q"]').evaluate("el => document.activeElement === el")
            page.locator("summary").filter(has_text="更多筛选").click()
            page.locator('select[name="provider"]').select_option(index=1)
            assert page.locator("[data-active-filters]").inner_text()
            page.goto(f"{base}/favorites/", wait_until="domcontentloaded", timeout=60000)
            page.locator("[data-catalog-grid]").wait_for(timeout=15000)
            assert page.locator("[data-export-favorites]").count() == 1
            assert page.locator("[data-import-favorites]").count() == 1
            page.set_viewport_size({"width": 320, "height": 900})
            assert page.locator("body").evaluate("el => el.scrollWidth <= window.innerWidth")
            report.append({"browser": name, "status": "passed", "errors": errors})
            browser.close()
    print(json.dumps(report, ensure_ascii=False))
    assert any(item["status"] == "passed" for item in report)


if __name__ == "__main__":
    main()
