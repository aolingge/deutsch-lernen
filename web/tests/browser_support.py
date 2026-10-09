from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def launch_browser(playwright, name):
    engine = getattr(playwright, name)
    try:
        return engine.launch(headless=True)
    except Exception:
        # Optional isolated Windows installs avoid the shared browser-cache lock.
        candidates = sorted((ROOT / '.wrangler/browsers').glob(f'{name}-*'), reverse=True)
        for folder in candidates:
            executable = folder / ('firefox/firefox.exe' if name == 'firefox' else 'Playwright.exe')
            if executable.is_file():
                return engine.launch(headless=True, executable_path=str(executable))
        raise


def ready(page, base, path):
    response = page.goto(base.rstrip('/') + path, wait_until='domcontentloaded', timeout=60000)
    assert response and response.status in (200,304), f'{path}: HTTP {response.status if response else None}'
    page.wait_for_function("document.documentElement.dataset.catalogReady==='true'", timeout=20000)


def duplicate_ids(page):
    return page.evaluate("""() => {
      const ids=Array.from(document.querySelectorAll('[id]'),n=>n.id);
      return ids.filter((id,i)=>ids.indexOf(id)!==i);
    }""")
