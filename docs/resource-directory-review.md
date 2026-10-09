# Ressourcenverzeichnis: veröffentlichte Verbesserungen / 资源目录：已发布改进

Stand: 2026-10-04. [Website](https://deutsch-lernen-resource-hub.pirostonelsonrx688.workers.dev/). Umsetzung nach dem [Analyseplan](superpowers/plans/2026-10-04-resource-directory-improvement.md).

记录日期：2026-10-04。[公开网站](https://deutsch-lernen-resource-hub.pirostonelsonrx688.workers.dev/)。本轮依据[优化分析计划](superpowers/plans/2026-10-04-resource-directory-improvement.md)实施。

## Ergebnis / 结果

- Die chinesische Ressourcenoberfläche behält direkte Originalverweise. Karten sind auf breiten Bildschirmen besser lesbar; auf kleinen Bildschirmen gibt es eine tatsächlich kompakte Listenansicht. Quellenkennzeichen sind lokale Schriftzeichen, keine übernommenen Logos oder extern geladenen Bilder.
  中文资源界面继续直达原站。大屏卡片更容易阅读，小屏列表真正节省空间。来源标记采用本地文字，没有复制机构徽标或加载外部图片。
- Suchaliasnamen finden TestDaF, Wörterbücher, Podcasts, Goethe und Nicos Weg. Titeltreffer erhalten Vorrang vor schwächeren Treffern in anderen Feldern. Unbekannte Suchwörter erzeugen weiterhin ehrliche leere Ergebnisse.
  同义词搜索覆盖德福、字典、播客、歌德和 Nicos Weg。标题命中优先于其他字段的弱命中。无法匹配的关键词仍显示真实空结果。
- Details behalten Filter, Seite und die beim Öffnen gespeicherte Scrollposition. Tastaturfokus bleibt nach Seitenwechsel, Filterentfernung und dem Entfernen des letzten Favoriten sinnvoll erreichbar. Manuell geschlossene Zusatzfilter bleiben geschlossen.
  详情返回保留筛选、页码及打开详情时保存的滚动位置。翻页、移除筛选及取消最后一条收藏后，键盘焦点仍落在合理位置。手动折叠的附加筛选保持折叠。
- Der Worker liefert aktuelle öffentliche D1-Ressourcen als vollständiges HTML mit individuellen Metadaten. Sitemap, Canonical und robots.txt sind ergänzt; private und Verwaltungsseiten stehen nicht in der Sitemap. Ein ungültiger Datensatz blockiert andere gültige Ressourcen nicht.
  Worker 使用当前 D1 公开资源输出完整详情 HTML 及独立元数据。已补充站点地图、规范链接和 robots.txt，个人及管理页面不进入站点地图。单条数据格式异常不会阻断其他有效资源。
- Der Browserfallback enthält ausschließlich veröffentlichte externe Ressourcen. Historische Anleitungen bleiben erhalten, werden aber nicht mehr in diesen Browserfallback gepackt. Sicherheitsheader gelten tatsächlich für statische und dynamische HTML-Antworten; Dateien mit Versionsfingerabdruck werden langfristig gecacht.
  浏览器回退快照仅包含已发布的外部资源。历史指南继续保留，但不再打包进此浏览器快照。静态及动态 HTML 的安全响应头均已实测生效，带版本指纹的文件使用长期缓存。

## Nachweise / 验证记录

| Prüfung / 检查 | Ergebnis / 结果 |
| --- | --- |
| `npm run verify` | Katalog, Typprüfung, 21 Tests und Build erfolgreich; keine Typdiagnosen. / 目录、类型、21 项测试和构建通过，无类型诊断。 |
| `web/e2e/public_site.py` lokal und live / 本地及线上 | Elf Ablaufgruppen bestanden, einschließlich API-Fallback, IME, Favoritenhistorie, Scrollrückkehr und vollständiger No-JS-Details; keine Seitenfehler. / 11 组流程通过，包含 API 回退、输入法、收藏历史、滚动恢复及完整无 JS 详情，无页面脚本错误。 |
| Responsive Darstellung / 响应式显示 | 320, 375, 768, 1024, 1440 und 1920 Pixel ohne horizontalen Seitenüberlauf. / 六种宽度无页面横向溢出。 |
| Textvergrößerung / 放大文字 | 200 Prozent Grundschrift in zwölf Ansichten auf vier Breiten ohne Seitenüberlauf. / 四种宽度共 12 个视图，两倍根字号下无页面横向溢出。 |
| Axe 4.10.3 / 自动无障碍 | 21 Ansichten, WCAG 2.2-AA-Regeln einbezogen, keine automatisch erkannten Verstöße. / 21 个视图，包含 WCAG 2.2 AA 规则，无自动检测到的违规。 |
| Erstes HTML und öffentliche API / 首响应及公开 API | Aktuelle Detaildaten ohne JS; 130 erwartete IDs; Sitemap mit 134 öffentlichen URLs; fehlender Slug 404 und anonyme Verwaltung 403. / 无 JS 详情完整，130 条 ID 与预期一致，地图包含 134 个公开地址，缺失资源 404，匿名管理 403。 |
| HTML und JavaScript, dekodierte Bytes / HTML 与 JS 解码字节 | Startseite 329000 → 103244; Browserpaket 194235 → 107397. / 首页约减少 69%，浏览器包约减少 45%。 |
| Mobile Lesbarkeit / 手机阅读 | Erstes Ergebnis bei 375 Pixeln: 582,39 → 516,39 Pixel ab Seitenbeginn. / 375 像素宽度下，第一条结果提前约 66 像素出现。 |
| Karten auf breiten Bildschirmen / 大屏卡片 | Bei 1920 Pixeln: 258,5 → 348,66 Pixel Kartenbreite. / 1920 像素宽度下，卡片宽度增加约 90 像素。 |
| Externe Linkprüfung / 外链检查 | Alle 130 versucht: 117 erreichbar, 9 automatisch eingeschränkt, 4 unklar, keine bestätigten 404/410. / 尝试检查全部 130 条：117 可访问、9 自动访问受限、4 未确定，没有确认的 404/410。 |
| Veröffentlichungsschutz / 发布检查 | `tools/publication-check.ps1` und `git diff --check` bestanden. / 隐私、文档及差异检查通过。 |

Die vier unklaren Linkergebnisse betreffen `deutschpodcast`, `tandem`, `hellotalk` und `hochschulkompass`. Automatisierte Einschränkungen beweisen keine defekte Seite. Der Prüfbericht überschreibt weder veröffentlichte Statusangaben noch redaktionelle Datumsfelder.

四条未确定的链接为上述条目。自动访问限制不能证明页面已失效。检查报告没有覆盖线上资源状态或编辑核验日期。

## Veröffentlichung / 发布信息

Die Anwendung wurde mit der bestehenden Wrangler-Authentifizierung veröffentlicht. Aktive Worker-Version: `f5af55c8-7a96-410b-a302-80b80e4789bb`. Code-Checkpoints: `e408a42`, `b95197c`, `330277a`. Die vorherige Ausgangsveröffentlichung war `97190e0c-5a17-4d4a-af2c-2525d095771b`; eine Rückkehr ist mit `npx wrangler rollback 97190e0c-5a17-4d4a-af2c-2525d095771b` möglich. Es wurden keine Produktionsdatenbankmigrationen oder Katalogschreibvorgänge ausgeführt.

应用通过现有 Wrangler 认证完成发布。当前 Worker 版本和代码检查点如上。可使用上述命令回滚到本轮开始前的版本。本轮未执行生产数据库迁移或资源目录写入。

Die Workflow-Erweiterungen und Tests sind lokal eingecheckt; Git wurde nicht gepusht. Damit sind die neuen JSON-Link- und Typprüfungen im entfernten GitHub-Workflow noch nicht aktiviert. Der vorhandene Workflow bleibt unverändert, bis die Repositoryänderungen separat synchronisiert werden.

工作流配置和测试已本地提交，未推送 Git，因此新增 JSON 链接及类型检查尚未在远端 GitHub 工作流启用。远端现有流程继续保持原状态，待仓库改动另行同步。

## Offene Arbeit / 待完成事项

Eine vollständige manuelle Prüfung aller Preise, Sprachen, Medienarten und Niveauangaben bleibt offen. Das gilt besonders für Informationsdienste, deren sprachliche Schwierigkeit keine Nutzungsvoraussetzung ist. Die historischen Tutorialfelder sind jetzt optional und weiter lesbar; Kategorien und Medien wurden nicht pauschal umgeschrieben.

全部资源的费用、语言、媒体类型及等级仍需逐条人工核对，尤其应避免把信息服务的阅读难度当作使用资格。历史教程字段现已兼容缺省并保留读取能力，尚未批量重写分类或媒体标签。

Die Browserprüfungen verwenden Chromium über Edge. Firefox, WebKit und manuelle Screenreaderläufe sind noch nicht verifiziert. Die automatische Axe-Prüfung ist kein Nachweis vollständiger WCAG-Konformität. Gemessen wurden dekodierte Dateigrößen, keine garantierte Verbesserung realer Ladezeiten oder bestandene Feld-CWV. Mobile Drosselungsmessungen, CSP und zusätzliche Browserprüfungen bleiben im Plan.

浏览器验证采用 Edge 的 Chromium。Firefox、WebKit 及人工读屏流程尚未验证，自动 Axe 检查不代表完整 WCAG 合规。本轮比较的是解码文件体积，不代表真实加载时间一定同比改善，也不代表全部现场核心网页指标通过。移动限速测量、CSP 及其他浏览器验证仍在后续计划中。


## Historische Änderungsberichte / 历史改版记录

Die früheren Berichte folgen unverändert als historische Nachweise; ihre Zählwerte und Versionen gelten für den damaligen Stand.

下方原样保留此前的改版记录作为历史证据，其数量、检查结果及版本对应当时状态。

# 资源目录改版记录

日期：2026-10-04。范围：将原网站改为纯外部资源目录，保留原有数据与管理接口。

## 参考网站与采用方式

- [Learn German Online](https://www.learngermanonline.org/)：按资源类型组织独立来源入口。
- [All Language Resources — German](https://www.alllanguageresources.com/german/)：简短资源信息和费用/媒体差异。
- [Deutsch perfekt](https://www.deutsch-perfekt.com/deutsch-ueben)：按等级与主题查找内容。

采用分类导航、搜索筛选和简短元数据。本站中文界面以原站链接为主，不复制这些网站的文案、课程正文或付费材料。

## 数据与边界

旧目录的 128 项中，51 项为外部资源、77 项为自写指南。本次增加 79 项外部资源，将 77 项指南归档，形成 130 项公开外部资源与 12 类目录。JSON 共 207 项，包括归档资料。

公开 API、静态页面和浏览器目录均排除自写指南。旧指南地址转到目录；旧等级与学习页面兼容到筛选目录，旧个人页面兼容到收藏。原浏览器存储键保留，目标与任务不被删除，旧指南收藏 ID 仍保存但不计入当前目录收藏数。

130 个链接均尝试检查。截至本次复核，115 个记录为可访问，12 个因自动请求受限记录为 restricted，3 个未完成网络/证书核验记录为 unchecked（HelloTalk、Deutsch Podcast、Hochschulkompass）。不将受限或待核验链接宣传为检查通过。费用与等级是对应内容入口的描述，最终以原站为准。部分来源包含付费服务。

## 验证

```powershell
cd web
npm run verify
python e2e/public_site.py
```

浏览器脚本使用独立的无界面 Edge 会话，默认目标 `http://localhost:8793/`；需要 Python Playwright 和 Edge。检查十二条页面路径在 375、768、1440 像素下的布局，组合筛选、搜索、分页、浏览器前后导航、收藏及旧数据保留、详情原站链接、键盘搜索、匿名管理拒绝和 API 失败回退。检查结果与截图写入忽略目录 `.wrangler/qa-directory/`。

本地 Worker/D1 预览（新隔离目录）：

```powershell
node scripts/seed-catalog.mjs
npx wrangler d1 migrations apply deutsch-lernen-resource-hub --local --persist-to .wrangler/directory-preview
npx wrangler d1 execute deutsch-lernen-resource-hub --local --persist-to .wrangler/directory-preview --file .wrangler/catalog-seed.sql
npx wrangler dev --local --port 8793 --persist-to .wrangler/directory-preview
```

`npm run dev` 可以预览静态快照；没有 Worker API 时，筛选与收藏仍可使用。

## 发布准备与人工修改保护

用户于 2026-10-04 明确授权本次上线，并将已委托网站的发布改为验证后直接执行、不重复确认。线上目录的旧数据不能只用 INSERT OR IGNORE 更新：这会保留旧描述和旧状态。

```powershell
node scripts/prepare-directory-update.mjs --baseline=8550689
```

该命令只生成忽略目录下的 `.wrangler/directory-update.sql`，不连接数据库。基线为本次改版前已检查的 Git 提交；即使改版代码已提交，也不改用新 HEAD。SQL 对新增资源使用 INSERT OR IGNORE；已有条目仅在 revision=1、actor=catalog-seed、状态及 JSON 与旧基线一致时更新并增加修订号。人工编辑、冲突和历史记录得到保留，不删除资源。末尾查询列出与目标不一致的 ID，供维护者审阅。

先用 --local 在隔离库应用并核验；获得发布与凭据使用授权后才能对线上库使用 --remote 和执行部署。受保护条目若被跳过，应人工比较后决定，不强制覆盖。安全更新测试检查管理员修改保留、指南归档、审计历史和重复执行无副作用。

新增依赖：无。账户、域名、DNS、权限配置：无变更。

## 界面优化与复用来源

继续保持纯资源目录。参考 [TOOOLS.design](https://www.toools.design/) 的分类入口和简短资源元数据、[Untools](https://www.untools.co/) 的简洁卡片，以及 [GOV.UK 字号规范](https://design-system.service.gov.uk/styles/type-scale/) 的相对字号和阅读节奏。采用更清晰的字体层级、淡绿纸面背景、统一间距、内容形式标签和手机触控尺寸。没有复制参考站的内容或品牌素材。

图标直接使用 [Lucide](https://lucide.dev/) 的开源 SVG，本地嵌入，完整许可证见 [第三方声明](../web/THIRD-PARTY-NOTICES.md)。无新增产品依赖或远程字体、图标请求。

补充检查：独立无界面浏览器对首页、详情、收藏、收录说明和隐私页，在手机与桌面尺寸执行 axe-core 4.10.3 的 WCAG A/AA 检查；检查跳过导航的真实键盘焦点。审计运行时仅用于本地检查，不进入产品构建。

## 线上发布结果

2026-10-04 已部署到 [原网站](https://deutsch-lernen-resource-hub.pirostonelsonrx688.workers.dev/)，Cloudflare Worker 版本 `5206808b-a6a3-4b09-91c8-1a37cc3b6e79`。线上 D1 更新前保存了 128 项目录快照，模拟更新无冲突；更新后 207 项 payload 与已审阅源码一致，公开资源 130 项、归档 77 项，审计记录 335 项。没有删除历史数据。

完整验证通过：目录校验、类型检查、13 项测试与 148 页构建；公开网址上的浏览器流程覆盖十二条路径的手机/平板/桌面尺寸，搜索、组合筛选、分页、历史导航、收藏保留与匿名管理拒绝、API 失败回退均通过，未出现页面脚本错误。线上截图与功能报告位于本地忽略目录 `.wrangler/qa-directory-live/`。

线上十个页面视图的 axe-core A/AA 检查未发现违规。自动化快速切换页面会中断尚未完成的访问统计请求；另一次独立稳定页面检查确认统计接口成功返回 HTTP 200；报告单独保留这些导航中断，未将其表示为资源请求失败。该检查不代表全面人工无障碍认证。

## 第二轮界面改进

参考 [Minimal Gallery](https://minimal.gallery/) 的分类条与全部分类入口、[TOOOLS.design 分类页](https://www.toools.design/ui-web-design-inspiration-websites) 的清晰资源卡片，以及 [Saaspo](https://saaspo.com/) 的筛选组织。前两者还通过独立浏览器实看界面并保存参考截图；Saaspo 的搜索结果可读，直接页面请求返回 403，不将其表述为完整视觉检查。

设计采用原有的绿色纸面风格，压缩手机首屏介绍，把等级、费用放在常用筛选行，技能、考试、访问、形式放在原生可展开的“更多筛选”中。URL 中已有的高级条件会自动展开，收起后继续生效，并显示已选数量。手机分类提供展开网格，切换分类后横向列表自动显示当前项。资源卡片增大标题与正文，统一图形、边角、费用标记与间距；详情页改为集中式信息面板。无新增产品依赖，继续使用现有 Lucide 图标及本地字体。

交互修复包括中文输入法组字期间暂停即时筛选，以及清除筛选、切换条件和历史导航时取消未完成的搜索计时器。浏览器回归增加高级筛选保存、中文输入事件、清除待执行搜索、手机全部分类展开和首屏资源位置检查。

本地完整验证通过，13 项测试、148 页构建及十二条路径的三种宽度浏览器检查通过；18 个页面状态的 axe-core WCAG A/AA 检查未发现违规或页面脚本错误。报告与截图保存于本地忽略目录 `.wrangler/qa-refinement-local/`。对 375 像素手机视口，首张资源卡片顶部由改版前实测的约 699 像素移至约 582 像素，提前约 117 像素；这是固定视口实测，不代表所有设备的统一位置。

第二轮改进已于 2026-10-04 发布到原网站，Worker 版本为 `97190e0c-5a17-4d4a-af2c-2525d095771b`。线上完整浏览器流程和 18 个状态的无障碍检查同样通过，页面脚本错误为零；实际手机首张资源卡片位置与本地一致。线上证据位于本地忽略目录 `.wrangler/qa-refinement-live/`。本轮仅部署页面与交互更新，没有更新资源数据库。
