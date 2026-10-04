"""UI regression with simulated API responses; not a real Access login/write test."""
import json
import os
from playwright.sync_api import sync_playwright
from browser_support import ROOT, ready


def main():
    base=os.environ.get('RESOURCE_HUB_BASE','http://127.0.0.1:4321')
    fixture=next(r for r in json.loads((ROOT/'data/resources.json').read_text(encoding='utf-8')) if r['id']=='anki')
    fixture.update({'revision':7,'aliases':['old-name'],'interfaceLanguages':['中文'],'providerType':'independent',
        'evidence':[{'url':fixture['url'],'fields':['name'],'checkedAt':'2026-10-04'}]})
    records={fixture['id']:fixture}
    attempts=[]
    fail_once=True
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True)
        page=browser.new_page()
        def api(route):
            nonlocal fail_once
            request=route.request
            status=200
            if request.method=='GET':
                body={'resources':list(records.values())}
            else:
                payload=request.post_data_json
                attempts.append(payload['id'])
                if payload['id']=='import-two' and fail_once:
                    fail_once=False
                    status=503
                    body={'message':'模拟服务暂不可用'}
                else:
                    payload['revision']=records.get(payload['id'],{}).get('revision',0)+1
                    records[payload['id']]=payload
                    body={'revision':payload['revision'],'id':payload['id']}
            route.fulfill(status=status,json=body)
        page.route('**/api/admin/**',api)
        ready(page,base,'/admin/')
        page.locator('#admin-editor').wait_for(state='visible')
        page.locator('#resource-picker').select_option('anki')
        page.locator('[name=titleZh]').fill('Anki 测试名称')
        page.locator('button[type=submit]').click()
        page.wait_for_function("document.querySelector('#admin-status').textContent.includes('保存成功')")
        for key in ('aliases','interfaceLanguages','providerType','evidence'):
            assert records['anki'][key]==fixture[key], key
        assert records['anki']['revision']==8
        page.locator('details summary').click()
        def upload(rows):
            page.locator('#catalog-file').set_input_files({'name':'resources.json','mimeType':'application/json','buffer':json.dumps(rows).encode()})
        upload([fixture])
        page.wait_for_function("document.querySelector('#admin-status').textContent.includes('重复')")
        assert page.locator('#save-import').is_disabled()
        drafts=[{**fixture,'id':identifier,'slug':identifier,'url':f'https://example.invalid/{identifier}',
            'canonicalUrl':f'https://example.invalid/{identifier}'} for identifier in ('import-one','import-two','import-three')]
        upload(drafts)
        page.wait_for_function("document.querySelector('#admin-status').textContent.includes('预览通过')")
        page.locator('#save-import').click()
        page.wait_for_function("document.querySelector('#admin-status').textContent.includes('其余 2 条')")
        assert 'import-one' not in page.locator('#import-preview').inner_text()
        page.locator('#save-import').click()
        page.wait_for_function("document.querySelector('#admin-status').textContent.includes('已保存 2 条草稿')")
        assert attempts.count('import-one')==1 and attempts.count('import-two')==2 and attempts.count('import-three')==1
        assert page.locator('#save-import').is_disabled()
        assert all(records[r['id']]['status']=='draft' for r in drafts)
        browser.close()
    print(json.dumps({'api':'simulated','metadataPreserved':True,'duplicatesBlocked':True,'partialResume':True}))


if __name__=='__main__':
    main()
