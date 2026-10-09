import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright


def main():
    base = os.environ.get("RESOURCE_HUB_BASE", "http://127.0.0.1:4321")
    samples = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for throttled in (False, True):
            # Both visits share the same HTTP cache; never label a fresh context warm.
            context = browser.new_context(viewport={"width": 375, "height": 900})
            page = context.new_page()
            page.add_init_script("""window.__metrics={lcp:null,cls:0,longTasks:0};
              new PerformanceObserver(list=>{for(const e of list.getEntries())window.__metrics.lcp=e.startTime;})
                .observe({type:'largest-contentful-paint',buffered:true});
              new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__metrics.cls+=e.value;})
                .observe({type:'layout-shift',buffered:true});
              new PerformanceObserver(list=>{for(const e of list.getEntries())window.__metrics.longTasks+=Math.max(0,e.duration-50);})
                .observe({type:'longtask',buffered:true});""")
            cdp=context.new_cdp_session(page)
            cdp.send('Network.enable')
            cdp.send('Network.clearBrowserCache')
            cdp.send('Network.setCacheDisabled', {'cacheDisabled':False})
            if throttled:
                cdp.send('Emulation.setCPUThrottlingRate', {'rate':4})
                cdp.send('Network.emulateNetworkConditions', {'offline':False,'latency':150,
                    'downloadThroughput':1_600_000/8,'uploadThroughput':750_000/8})
            for cache_mode in ('cold','warm'):
                page.goto(f"{base}/resources/", wait_until="load", timeout=60000)
                page.wait_for_function("document.documentElement.dataset.catalogReady==='true'", timeout=20000)
                page.wait_for_timeout(1200)
                metrics=page.evaluate("""() => {
                  const n=performance.getEntriesByType('navigation')[0];
                  const assets=performance.getEntriesByType('resource').filter(e=>e.name.includes(location.origin));
                  return {...window.__metrics,ttfb:n.responseStart,domContentLoaded:n.domContentLoadedEventEnd,
                    documentBytes:n.transferSize,totalBytes:n.transferSize+assets.reduce((s,e)=>s+e.transferSize,0),
                    cachedAssets:assets.filter(e=>e.transferSize===0 && e.decodedBodySize>0).length};
                }""")
                samples.append({'profile':'cpu4x-1.6Mbps-150ms' if throttled else 'unthrottled',
                    'cache':cache_mode,**metrics})
            context.close()
        browser.close()
    report = {"base": base, "measurement":"Chromium laboratory; no field INP", "samples": samples}
    destination=Path('.wrangler/qa/performance.json')
    destination.parent.mkdir(parents=True,exist_ok=True)
    destination.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(report, ensure_ascii=False))


if __name__ == "__main__":
    main()
