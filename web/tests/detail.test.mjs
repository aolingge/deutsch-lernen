import test from 'node:test';
import assert from 'node:assert/strict';
import { renderDetailDocument } from '../src/lib/detail-document.mjs';
import catalog from '../data/resources.json' with { type: 'json' };
import categories from '../data/categories.json' with { type: 'json' };

test('current public details replace the loading shell, escape labels and exclude filter parameters from metadata', () => {
  const resource = { ...catalog.find((r) => r.id === 'anki'), titleZh: '新标题 <script>bad</script>', descriptionZh: 'A "quoted" & B' };
  const shell = '<head><title>资源信息</title><meta name="description" content="旧描述"><meta property="og:title" content="旧"><meta property="og:description" content="旧"><meta property="og:url" content="旧"><meta property="og:image" content="旧"><meta name="twitter:image" content="旧"><script type="application/ld+json">{"url":"旧"}</script><link rel="canonical" href="旧"></head><section class="live-detail" data-detail><h1>资源信息</h1><p>正在读取资源…</p></section>';
  const html = renderDetailDocument(shell, resource, categories, new URL('https://hub.example.invalid/resource/anki/?from=%2F%3Flevel%3DB1'));
  assert.ok(html.includes('<h1>新标题 &lt;script&gt;bad&lt;/script&gt;</h1>'));
  assert.ok(html.includes('href="/?level=B1"'));
  assert.ok(html.includes('content="A &quot;quoted&quot; &amp; B"'));
  assert.ok(html.includes('rel="canonical" href="https://hub.example.invalid/resource/anki/"'));
  assert.ok(html.includes('property="og:image" content="https://hub.example.invalid/og-directory.png"'));
  assert.ok(html.includes('"url":"https://hub.example.invalid/resource/anki/"'));
  assert.ok(html.includes('data-server-rendered="true"'));
  assert.ok(!html.includes('正在读取资源'));
  assert.ok(!html.includes('<script>bad'));
});
