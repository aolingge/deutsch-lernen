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
