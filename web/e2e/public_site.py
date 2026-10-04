import json, os, pathlib
from playwright.sync_api import sync_playwright, expect
base = os.environ.get('E2E_BASE_URL', 'http://127.0.0.1:8793')
out = pathlib.Path(os.environ.get('E2E_OUTPUT_DIR', '.wrangler/qa-directory')); out.mkdir(parents=True, exist_ok=True)
rows = json.loads(pathlib.Path('data/resources.json').read_text(encoding='utf-8'))
public = [r for r in rows if r['status'] == 'published' and r['rights'] != 'owned']
by_id = {r['id']: r for r in public}
errors = []; flows = []
with sync_playwright() as p:
    browser = p.chromium.launch(channel=os.environ.get('E2E_BROWSER_CHANNEL', 'msedge'), headless=True)
    context = browser.new_context(viewport={'width': 1440, 'height': 1000})
    page = context.new_page()
    page.on('pageerror', lambda error: errors.append(str(error)))
    def go(route):
        page.goto(base + route, wait_until='domcontentloaded')
        page.wait_for_function("document.documentElement.dataset.catalogReady === 'true'")
    go('/')
    page.keyboard.press('Tab')
    expect(page.get_by_role('link', name='跳到主要内容')).to_be_focused()
    page.keyboard.press('Enter')
    expect(page.locator('#main-content')).to_be_focused()
    assert page.evaluate("getComputedStyle(document.querySelector('.directory-workspace')).display === 'grid'"), 'directory stylesheet missing'
    expect(page.locator('[data-resource-count]')).to_have_text(str(len(public)))
    assert page.locator('.category-link').count() == 13
    assert page.locator('.study-loop,.level-stop,.week-board,.catalog-guide').count() == 0
    expect(page.locator('.live-card')).to_have_count(24)
    for href in page.locator('.live-card h3 a').evaluate_all('(nodes)=>nodes.map(n=>n.href)'):
        assert href.startswith('https://') and not href.startswith(base)
    page.screenshot(path=str(out/'desktop-home.png'), full_page=True)
    flows.append('resource-first homepage with original links')
    page.locator('.category-link[data-category=grammar]').click()
    assert 'category=grammar' in page.url
    assert page.locator('.live-card').count() > 0
    assert all(v == 'grammar' for v in page.locator('.live-card').evaluate_all('(nodes)=>nodes.map(n=>n.dataset.category)'))
    page.locator('select[name=level]').select_option('B1')
    page.locator('select[name=price]').select_option('free')
    for node in page.locator('.live-card').all():
        expect(node.locator('.chips')).to_contain_text('B1')
        expect(node.locator('.price')).to_have_text('免费')
    page.reload(wait_until='domcontentloaded')
    expect(page.locator('select[name=level]')).to_have_value('B1')
    expect(page.locator('select[name=price]')).to_have_value('free')
    page.locator('[data-reset]').first.click()
    expect(page.locator('.live-card')).to_have_count(24)
    page.locator('input[name=q]').fill('DW B1')
    page.wait_for_timeout(300)
    assert page.locator('.live-card').count() >= 1
    expect(page.locator('.live-card h3').filter(has_text='Nicos')).to_have_count(1)
    page.locator('input[name=q]').fill('NONEXISTENT12345')
    expect(page.locator('.directory-empty')).to_contain_text('没有匹配资源')
    page.locator('[data-reset]').first.click()
    expect(page.locator('.live-card')).to_have_count(24)
    page.locator('[data-page="2"]').click()
    assert 'page=2' in page.url
    assert page.locator('.live-card').count() == 24
    page.go_back()
    expect(page.locator('input[name=q]')).to_have_value('')
    page.get_by_role('button', name='列表视图', exact=True).click()
    expect(page.locator('[data-catalog-grid]')).to_have_attribute('data-view', 'list')
    page.reload(wait_until='domcontentloaded')
    expect(page.locator('[data-catalog-grid]')).to_have_attribute('data-view', 'list')
    page.get_by_role('button', name='卡片视图', exact=True).click()
    flows.append('categories, combined filters, search, reset, paging, history, persistent display')
    go('/?skill=听力&access=open')
    expect(page.locator('[data-advanced-filters]')).to_have_attribute('open', '')
    expect(page.locator('select[name=skill]')).to_have_value('听力')
    expect(page.locator('[data-advanced-count]')).to_have_text('2')
    page.locator('[data-advanced-filters] summary').click()
    page.locator('select[name=price]').select_option('free')
    assert not page.locator('[data-advanced-filters]').evaluate('(node)=>node.open'), 'manually closed filters reopened'
    assert 'skill=' in page.url and 'access=open' in page.url
    expect(page.locator('select[name=skill]')).to_have_value('听力')
    page.locator('[data-reset]').first.click()
    page.locator('input[name=q]').dispatch_event('compositionstart')
    page.locator('input[name=q]').fill('DW B1')
    page.wait_for_timeout(300)
    assert 'q=' not in page.url, 'search interrupted text composition'
    page.locator('input[name=q]').dispatch_event('compositionend')
    expect(page.locator('.live-card h3').filter(has_text='Nicos')).to_have_count(1)
    page.locator('input[name=q]').fill('pending-search')
    page.locator('[data-reset]').first.click()
    page.wait_for_timeout(300)
    expect(page.locator('input[name=q]')).to_have_value('')
    expect(page.locator('.live-card')).to_have_count(24)
    flows.append('advanced filters survive disclosure and URLs; IME composition and pending-search reset')
    for query, name in [('德福', 'TestDaF'), ('字典', '词典')]:
        go('/?q=' + query)
        assert page.locator('.live-card').count() > 0, 'missing alias ' + query
    go('/?category=grammar&level=B1&price=free')
    original_url = page.url
    page.locator('.detail-link').first.click()
    page.wait_for_function("document.documentElement.dataset.catalogReady === 'true'")
    page.locator('.detail-back').click()
    page.wait_for_function("document.documentElement.dataset.catalogReady === 'true'")
    assert page.url == original_url, 'detail return lost filter context'
    go('/')
    page.locator('[data-page="2"]').focus()
    page.keyboard.press('Enter')
    expect(page.locator('[data-page="2"]')).to_be_focused()
    go('/?category=grammar&level=B1')
    page.locator('[data-remove-filter="level"]').focus()
    page.keyboard.press('Enter')
    expect(page.locator('[data-remove-filter="category"]')).to_be_focused()
    flows.append('search aliases, detail return context, pagination and filter keyboard focus')
    old = {'goal': {'level': 'B1', 'exam': 'Goethe', 'hours': '5'}, 'tasks': [{'id': 'anki', 'title': 'old task', 'minutes': 30, 'done': False}], 'favorites': [next(r['id'] for r in rows if r['rights'] == 'owned')]}
    page.evaluate('(v)=>localStorage.setItem("deutsch-hub.study.v1",JSON.stringify(v))', old)
    go('/resource/anki/')
    expect(page.locator('main h1')).to_contain_text('Anki')
    assert page.get_by_text('怎么使用', exact=True).count() == 0
    assert page.get_by_role('button', name='加入本周计划').count() == 0
    page.get_by_role('button', name='收藏资源').click()
    stored = page.evaluate('JSON.parse(localStorage.getItem("deutsch-hub.study.v1"))')
    assert stored['tasks'] == old['tasks'] and stored['goal'] == old['goal']
    assert old['favorites'][0] in stored['favorites']
    go('/favorites/')
    expect(page.locator('.live-card')).to_have_count(1)
    expect(page.locator('.live-card h3')).to_contain_text('Anki')
    page.locator('[data-save=anki]').click()
    expect(page.locator('.directory-empty')).to_contain_text('还没有收藏资源')
    expect(page.locator('[data-directory-heading]')).to_be_focused()
    go('/my-study/')
    expect(page.locator('main h1')).to_have_text('我的收藏.')
    flows.append('favorites preserved across pages; old private tasks and goals retained')
    go('/exams/')
    assert all(v == 'exams' for v in page.locator('.live-card').evaluate_all('(nodes)=>nodes.map(n=>n.dataset.category)'))
    go('/levels/b1/')
    assert all('B1' in v for v in page.locator('.chips').all_text_contents())
    go('/admin/')
    expect(page.locator('#admin-status')).to_contain_text('管理员验证未通过')
    expect(page.locator('#admin-editor')).not_to_be_visible()
    flows.append('exam and level compatibility routes; admin access denied')
    for route in ['/', '/resources/', '/exams/', '/news/', '/favorites/', '/resource/anki/', '/sources/', '/privacy/', '/levels/b1/', '/study/', '/study/b1-week/', '/my-study/']:
        for width, height in [(375, 812), (768, 1024), (1440, 1000)]:
            page.set_viewport_size({'width': width, 'height': height})
            go(route)
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), route + ' overflow ' + str(width)
    page.set_viewport_size({'width': 375, 'height': 812}); go('/')
    assert page.locator('.live-card').first.bounding_box()['y'] < 520, 'mobile controls bury the resources'
    page.get_by_role('button', name='展开全部分类').click()
    expect(page.get_by_role('button', name='收起全部分类')).to_have_attribute('aria-expanded', 'true')
    assert page.locator('.category-link[data-category=life]').bounding_box()['x'] < 375
    page.get_by_role('button', name='收起全部分类').click()
    page.screenshot(path=str(out/'mobile-preview.png'))
    page.screenshot(path=str(out/'mobile-home.png'), full_page=True)
    page.locator('.category-link[data-category=life]').scroll_into_view_if_needed()
    page.locator('.category-link[data-category=life]').click()
    assert page.locator('.live-card').count() > 0
    flows.append('12 routes at mobile, tablet and desktop; mobile category scrolling')
    page.set_viewport_size({'width': 1440, 'height': 1000}); go('/')
    page.screenshot(path=str(out/'desktop-preview.png'))
    page.keyboard.press('/')
    expect(page.locator('input[name=q]')).to_be_focused()
    flows.append('keyboard search shortcut')
    # Simulate real API failure: the bundled directory must remain interactive.
    context.route('**/api/public-catalog', lambda route: route.fulfill(status=503, body='{}'))
    go('/?category=tools&price=free')
    assert page.locator('.live-card').count() > 0
    expect(page.locator('#directory-note')).to_contain_text('实时更新暂不可用')
    flows.append('interactive catalog fallback on API failure')
    no_js = browser.new_context(java_script_enabled=False)
    detail_page = no_js.new_page()
    detail_page.goto(base + '/resource/anki/', wait_until='domcontentloaded')
    expect(detail_page.locator('main h1')).to_contain_text('Anki')
    expect(detail_page.locator('.detail-facts')).to_contain_text('来源')
    assert 'Anki' in detail_page.title(), 'detail title is a loading placeholder'
    no_js.close()
    flows.append('complete current resource details without JavaScript')
    assert not errors, errors
    browser.close()
report = {'baseUrl': base, 'passed': True, 'publicResources': len(public), 'flows': flows, 'pageErrors': errors}
(out/'report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(report, ensure_ascii=False))
