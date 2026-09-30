import json, os, pathlib, sys
from playwright.sync_api import sync_playwright, expect
base=os.environ.get('E2E_BASE_URL','http://127.0.0.1:8791')
out=pathlib.Path('.wrangler/qa'); out.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
    browser=p.chromium.launch(channel=os.environ.get('E2E_BROWSER_CHANNEL','msedge'),headless=True)
    context=browser.new_context(viewport={'width':1440,'height':1000})
    page=context.new_page()
    errors=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    def go(route):
        page.goto(base+route,wait_until='domcontentloaded')
        page.wait_for_function("document.documentElement.dataset.catalogReady === 'true'")
    go('/')
    expect(page.locator('main h1')).to_be_visible()
    expect(page.locator('[data-resource-count]')).to_have_text('128')
    assert page.locator('.category-tile').count()==12
    assert page.locator('.study-loop li').count()==5
    assert page.locator('.level-stop').count()==5
    page.screenshot(path=str(out/'desktop-home.png'))
    go('/study/')
    assert page.locator('.level-row').count()==5
    assert page.locator('.skill-item').count()==4
    expect(page.locator('.review-clock')).to_contain_text('间隔单位：天')
    go('/study/b1-week/')
    assert page.locator('.day-row').count()==7
    expect(page.locator('.week-facts')).to_contain_text('3 小时 55 分钟')
    assert page.locator('.day-output strong').count()==7
    go('/resources/?category=grammar&level=B1')
    assert page.locator('.live-card').count()>0
    assert all('语法与练习' in value for value in page.locator('.live-card .card-top').all_text_contents())
    page.locator('input[name=q]').fill('DW B1')
    page.locator('select[name=category]').select_option('')
    page.get_by_role('button',name='应用筛选').click()
    expect(page.locator('.live-card')).to_have_count(2)
    expect(page.locator('.live-card h3').filter(has_text='Nicos')).to_have_count(1)
    page.reload(wait_until='domcontentloaded')
    expect(page.locator('input[name=q]')).to_have_value('DW B1')
    go('/resources/?q=NONEXISTENT12345')
    expect(page.get_by_role('status').filter(has_text='没有匹配资源')).to_be_visible()
    go('/resources/')
    expect(page.locator('.live-card')).to_have_count(24)
    page.locator('.catalog-pager a',has_text='2').click()
    assert 'page=2' in page.url
    assert page.locator('.live-card').count()==24
    go('/resource/anki/')
    expect(page.locator('main h1')).to_contain_text('Anki')
    page.get_by_role('button',name='收藏资源').click()
    page.get_by_role('button',name='加入本周计划').click()
    go('/my-study/')
    expect(page.locator('#favorite-count')).to_have_text('1 个')
    expect(page.locator('#task-count')).to_have_text('0 / 1 完成')
    page.locator('#task-list input[type=checkbox]').check()
    expect(page.locator('#task-count')).to_have_text('1 / 1 完成')
    page.locator('#goal-level').select_option('B1')
    page.locator('#goal-hours').fill('5')
    page.get_by_role('button',name='保存目标').click()
    page.reload(wait_until='domcontentloaded')
    expect(page.locator('#goal-level')).to_have_value('B1')
    before=page.evaluate("localStorage.getItem('deutsch-hub.study.v1')")
    page.locator('#import-plan').set_input_files({'name':'invalid.json','mimeType':'application/json','buffer':json.dumps({'favorites':[],'tasks':[{'id':'x','title':'x','minutes':30,'done':'yes'}]}).encode()})
    expect(page.locator('#plan-note')).to_contain_text('原计划未改变')
    assert page.evaluate("localStorage.getItem('deutsch-hub.study.v1')")==before
    with page.expect_download() as download_info:page.get_by_role('button',name='导出学习计划').click()
    exported=download_info.value
    exported.save_as(str(out/'study-plan.json'))
    assert json.loads((out/'study-plan.json').read_text(encoding='utf-8'))['tasks'][0]['done'] is True
    go('/admin/')
    expect(page.locator('#admin-status')).to_contain_text('管理员验证未通过')
    expect(page.locator('#admin-editor')).not_to_be_visible()
    for route in ['/','/study/','/study/b1-week/','/resources/','/resource/anki/','/my-study/','/news/','/exams/','/levels/b1/']:
        for width,height in [(390,844),(768,1024),(1440,1000)]:
            page.set_viewport_size({'width':width,'height':height})
            go(route)
            assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth'),route+' horizontal overflow at '+str(width)
    page.screenshot(path=str(out/'mobile-b1.png'),full_page=True)
    assert not errors,errors
    browser.close()
print(json.dumps({'passed':True,'flows':['首页学习闭环图','A1-C1 学习路线图','四技能入口','主动回忆与间隔复习说明','B1 七日计划和成果标准','组合筛选','刷新保持','空结果','分页','收藏','计划','打卡','目标保存','错误导入保留原数据','备份导出','管理员拒绝','9页手机/平板/桌面无横向溢出'],'pageErrors':errors},ensure_ascii=False))

