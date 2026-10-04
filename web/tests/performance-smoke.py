import json
import os
import statistics
import time
from playwright.sync_api import sync_playwright


def main():
    base = os.environ.get("RESOURCE_HUB_BASE", "http://127.0.0.1:4321")
    samples = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for cache_mode in ("cold", "warm", "warm"):
            context = browser.new_context(viewport={"width": 1280, "height": 900})
            page = context.new_page()
            page.add_init_script("""window.__lcp = null; new PerformanceObserver((list) => {
              const entries = list.getEntries(); window.__lcp = entries[entries.length - 1]?.startTime ?? null;
            }).observe({type: 'largest-contentful-paint', buffered: true});""")
            started = time.perf_counter()
            page.goto(f"{base}/resources/", wait_until="domcontentloaded", timeout=60000)
            page.locator("[data-catalog-grid]").wait_for(timeout=15000)
            elapsed_ms = round((time.perf_counter() - started) * 1000, 1)
            metrics = page.evaluate("""() => {
              const timing = performance.getEntriesByType('navigation')[0];
              return { domContentLoaded: timing ? timing.domContentLoadedEventEnd : null,
                transferSize: timing ? timing.transferSize : null,
                lcp: window.__lcp };
            }""")
            samples.append({"cache": cache_mode, "elapsedMs": elapsed_ms, **metrics})
            context.close()
        browser.close()
    report = {"base": base, "samples": samples, "medianElapsedMs": statistics.median(item["elapsedMs"] for item in samples)}
    print(json.dumps(report, ensure_ascii=False))


if __name__ == "__main__":
    main()
