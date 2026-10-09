# Ressourcenverzeichnis: Analyse und Verbesserungsplan
# 德语资源导航：全面分析与优化计划

Stand: 2026-10-04. Gegenstand: [öffentliche Website](https://deutsch-lernen-resource-hub.pirostonelsonrx688.workers.dev/). Ausgangsversion: `7bdc2da`.

分析日期：2026-10-04。对象：[已上线网站](https://deutsch-lernen-resource-hub.pirostonelsonrx688.workers.dev/)。审计基线版本：`7bdc2da`。

**Ziel:** Ein verlässliches, gut lesbares Verzeichnis externer Ressourcen, in dem chinesischsprachige Nutzer schnell suchen, vergleichen, speichern und die Originalquelle öffnen können.

**目标：** 做成可靠、清晰、美观的外部资源目录，让中文用户快速搜索、比较、收藏并打开原站。

**Architektur:** Astro, bestehender Cloudflare Worker und D1 bleiben die Grundlage. Erst Zustandsfehler und Datenqualität korrigieren, dann Karten und Detailseiten verbessern; keine neue Plattform oder zusätzliche Suchdienste vorsehen.

**架构：** 沿用 Astro、现有 Cloudflare Worker 和 D1。先修复状态问题、完善数据，再优化卡片和详情页；当前不引入新平台或额外搜索服务。

**Auftrag:** Diese Lieferung ist die Analyse mit einem ausführbaren Arbeitsplan. Die Produktionswebsite wird in dieser Phase nicht geändert. Die spätere Ausführung erfolgt schrittweise mit den bestehenden Werkzeugen.

**任务范围：** 本次交付为分析及可执行工作计划，本阶段不修改线上网站。后续使用现有工具逐项实施。

## 1. Grenzen und bestehende Stärken / 边界与已有优点

Die Oberfläche bleibt vereinfachtes Chinesisch; Originalnamen und deutschsprachige Materialien bleiben erhalten. Öffentliches Hauptprodukt ist das Ressourcenverzeichnis. Historische Lerntexte, persönliche Aufgaben, Favoriten und Datenbankhistorie werden bewahrt. Gleichartige Anbieter sind nicht automatisch doppelte Ressourcen.

界面继续使用简体中文，保留资源原文名称和德语材料。公开主产品是资源目录。历史学习文档、个人任务、收藏和数据库审计记录继续保留。同一机构的不同资源入口不能直接视为重复。

Die Website bietet bereits kombinierbare Filter, teilbare Filter-URLs, Seitennavigation, lokale Favoriten und direkte Originalverweise. In sechs geprüften Breiten trat kein horizontaler Seitenüberlauf auf. Ein unbekannter Ressourcenslug liefert korrekt 404; der anonyme Verwaltungszugriff liefert 403. Lokale Favoritenfehler werden mit einem Hinweis abgefangen.

网站已支持组合筛选、可分享的筛选链接、分页、本地收藏和原站直达。在六种已测宽度下均无页面横向溢出。不存在的资源返回正确的 404，匿名管理访问返回 403；本地收藏存储异常有提示。

Die ruhige grüne Gestaltung, lokale Symbole und der Verzicht auf externe Schriftdateien sind eine gute Basis. Es wurde kein akuter Ausfall mit Priorität P0 bestätigt.

克制的绿色视觉、本地图标及不依赖外部字体的方式值得保留。本次没有确认 P0 级的紧急故障。

## 2. Untersuchungsmethode und Grenzen / 分析方法与证据边界

Untersucht wurden Live-HTML, Antwortheader, öffentliche API, Quellcode, CI-Konfiguration, isolierte Chromium-Browserabläufe sowie Darstellungen bei 320, 375, 768, 1024, 1440 und 1920 CSS-Pixeln. Drei kalte Browserkontexte lieferten ergänzende Ladezeitmessungen ohne Netzwerkdrosselung.

已检查线上 HTML、响应头、公开 API、源码、CI 配置、独立 Chromium 浏览器操作，以及上述六种 CSS 像素宽度的布局。另用三个冷启动浏览器上下文补充未限速的加载测量。

Die Messungen ersetzen keine Feldmessung realer Nutzer. Firefox und WebKit waren nicht installiert; ihre Kompatibilität ist noch nicht bestätigt. Ein automatischer Accessibility-Scan ersetzt weder Fokusprüfung noch Screenreader-Tests. Die Metadaten aller Einträge wurden gezählt, aber die Inhalte aller externen Websites noch nicht vollständig manuell neu geprüft.

这些测量不能替代真实用户的现场数据。Firefox 和 WebKit 运行时未安装，其兼容性尚未确认。自动无障碍扫描不能替代焦点检查及读屏测试。本次统计了全部条目的元数据，但没有重新人工逐页核对全部外部网站内容。

Die Diagnostik unterscheidet bestätigte Fehler, sichtbare Gestaltungsprobleme, aus Code abgeleitete Risiken und noch zu prüfende redaktionelle Fragen. Ein automatisiert blockierter Drittanbieter ist nicht automatisch ein defekter Link.

分析区分已复现错误、可见设计问题、源码推导风险和待核对的编辑问题。第三方网站阻止自动访问，不等于链接已经失效。

## 3. Datenbestand / 资源现状

| Kennzahl / 指标 | Befund / 当前结果 | Bedeutung / 含义 |
| --- | --- | --- |
| Öffentliche Ressourcen / 公开资源 | 130; 12 Kategorien; 110 Domains / 130 条、12 类、110 个域名 | Live-IDs stimmen mit dem Snapshot überein. / 线上 ID 与本地公开快照一致。 |
| Kosten / 费用 | 79 kostenlos; 44 Freemium; 7 bezahlt / 免费 79、部分免费 44、付费 7 | Plattform- und Leistungsgrenzen ergänzen. / 需补充平台差异和免费范围。 |
| Zugang / 访问条件 | 105 offen; 25 Registrierung / 直接访问 105、需注册 25 | Zwei angebotene Filterwerte haben keine Einträge. / 下拉中有两种条件没有对应条目。 |
| Niveaubegründung / 等级依据 | 10 offiziell; 120 redaktionell / 官方 10、编辑参考 120 | 92,3 % sind redaktionell; keine Zertifizierung suggerieren. / 92.3% 为编辑参考，不能暗示官方认证。 |
| Formate / 内容形式 | 36 unterschiedliche Bezeichnungen / 36 种标签 | Medien, Inhalt und Zweck sind vermischt. / 媒体形式、内容主题和用途混在一起。 |
| Gespeicherter Linkstatus / 已存链接状态 | 115 OK; 12 eingeschränkt; 3 ungeprüft / 正常 115、访问受限 12、未核验 3 | Bestandswerte, keine neue vollständige Linkprüfung. / 这是已有记录，不代表本次新查完全部链接。 |
| Prüfdatum / 核验日期 | 115 am Analysetag; 7 älter; 8 ohne Datum / 115 条为分析当日、7 条较早、8 条缺日期 | Netzwerkerreichbarkeit und redaktionelle Prüfung trennen. / 需区分网络检查和内容人工核对。 |

Die Kategorien enthalten: Kurse 13, Prüfungen 11, Wortschatz 11, Grammatik 11, Hören 11, Sprechen 9, Lesen 9, Schreiben 6, Nachrichten 10, Video 9, Werkzeuge 12, Leben/Studium 18. Die kleine Schreibkategorie ist ein Rechercheanlass, kein Beweis für fehlende Qualität.

分类数量为：课程 13、考试 11、词汇 11、语法 11、听力 11、口语 9、阅读 9、写作 6、新闻 10、视频 9、工具 12、生活留学 18。写作条目较少，值得优先调研，但不能仅凭数量认定质量不足。

## 4. Problemregister / 问题清单

P1 bedeutet zuerst beheben; P2 bedeutet wesentliche Verbesserung; P3 bedeutet später nach Bedarf. Die Einstufung beschreibt den Nutzen und die Reihenfolge, nicht einen behaupteten Sicherheitsnotfall.

P1 表示优先修复；P2 表示重要完善；P3 表示后续按需求增加。优先级体现用户收益和执行顺序，不代表存在已确认的安全紧急事件。

| ID | Priorität / 优先级 | Beleg und Auswirkung / 证据及影响 | Änderung / 建议 |
| --- | --- | --- | --- |
| F01 | P1 | „德福“ und „字典“ liefern null Treffer trotz vorhandener TestDaF- und Wörterbuchressourcen. / “德福”“字典”搜不到已收录的相关资源。 | Kleine gepflegte Aliasliste; Treffer nach Titel und Quelle gewichten. / 建立小型同义词表，按标题和来源匹配程度排序。 |
| F02 | P1 | Detail-Link „返回资源目录“ führt zu `/resources/` ohne vorherige Filter. Nativer Browser-Zurückweg funktioniert im Test. / 详情的返回按钮丢筛选，浏览器原生后退在测试中正常。 | Internen Rückkehrkontext inklusive Seite und Scrollposition erhalten. / 站内返回保留筛选、分页及滚动位置。 |
| F03 | P1 | Nach Tastatur-Seitenwechsel, Chipentfernung und letzter Favoritenentfernung liegt der Fokus auf BODY. / 键盘翻页、删除筛选标签、移除最后一个收藏后焦点回到 BODY。 | Stabile Bedienelemente oder gezielte Fokuswiederherstellung. / 保持控件稳定，或恢复到合理位置。 |
| F04 | P1 | Manuell geschlossene Zusatzfilter öffnen sich nach anderer Filteränderung erneut. / 手动收起高级筛选后，改另一条件又自动展开。 | Initiale Deep-Link-Anzeige von Nutzerentscheidung trennen. / 将首次链接展开与用户主动折叠状态分开。 |
| F05 | P1 | Live-Detail-HTML hat generischen Titel und Ladehinweis; ohne JS fehlt der Ressourcentext. / 线上详情 HTML 是通用标题和加载提示，无 JS 时看不到资源内容。 | Aktuellen öffentlichen D1-Eintrag im Antwort-HTML rendern. / 将当前公开 D1 条目的详情直接写入响应 HTML。 |
| F06 | P1 | Regulärer Link-Workflow durchsucht Markdown, nicht `web/data/resources.json`. / 定期链接检查扫描 Markdown，没有覆盖真正的 JSON 资源库。 | Versionierten JSON-Linkprüfer und geschützten Wartungslauf ergänzen. / 增加纳入版本管理的资源链接检查及维护流程。 |
| F07 | P2 | 36 Formatwerte vermischen PDF/Audio mit Beruf, Information und Lehrkraft. / 36 种形式标签混入求职、信息和教师等用途。 | Medienform, Inhalt und Zweck mit kontrollierten Werten unterscheiden. / 用受控值区分媒体形式、主题和用途。 |
| F08 | P2 | Leben/Studium + A1 ergibt null Treffer; viele Einträge sind Informationsdienste. / 生活留学与 A1 组合没有结果，部分资源本是信息服务。 | Leseschwierigkeit nicht mit Nutzbarkeit oder Zulassung gleichsetzen. / 区分阅读难度、使用价值及实际资格条件。 |
| F09 | P2 | 120 Niveaueinstufungen sind redaktionell. / 120 条等级为编辑估计。 | Begründung prüfen, unnötig breite Einstufungen vermeiden. / 核对依据，减少无依据的宽泛等级。 |
| F10 | P2 | Freemium sagt wenig über konkrete Grenzen aus, z. B. unterschiedliche Anki-Plattformkosten. / 部分免费标签没有说明具体限制，例如 Anki 平台收费差异。 | Kurze Kosten-/Plattformnotiz mit Primärquelle. / 增加带官方依据的简短费用及平台说明。 |
| F11 | P2 | Karte zeigt nur das erste Format; PDF und Audio können verborgen bleiben. / 卡片只显示首个形式，PDF 和音频等重要信息可能被隐藏。 | Bis zu zwei aussagekräftige Medienkennzeichen; alle Details auf Detailseite. / 最多展示两个有价值的形式标签，详情页列全。 |
| F12 | P2 | „DE“ identifiziert 19 verschiedene Quellnamen; weitere Kürzel kollidieren. / “DE”对应 19 种来源名，其他缩写也重复。 | Stabile Anbieterkennung; lokale zulässige Logos oder typografische Marken. / 优化来源识别，使用许可明确的本地标识或文字标记。 |
| F13 | P2 | Bei 1920px sind Karten rund 258,5px breit, bei 1440px rund 350px. / 1920 宽屏卡片约 258.5px，反比 1440 屏的约 350px 更窄。 | Spaltenzahl nach verfügbarer Inhaltsbreite statt Bildschirmbreite. / 按实际内容区宽度决定列数。 |
| F14 | P2 | Beschreibung 14px; kleine Tags und Domain 11px; Quellen häufig gekürzt. / 说明为 14px，部分标签和域名 11px，来源名经常截断。 | Lesbarkeit und Informationshierarchie mit längsten Texten prüfen. / 用最长文本校验字号、层级和截断策略。 |
| F15 | P2 | Erste Karte bei 375px erst bei etwa 582px; ausgeklappte Kategorien verlängern den Einstieg. / 375 宽手机第一张资源约在 582px 处，展开分类还会增加首屏高度。 | Kurzer Kopfbereich und kompakte Filter; sichtbaren ersten Treffer anstreben. / 缩短头部、压缩筛选，让首条结果尽早可见。 |
| F16 | P2 | Mobile Listenansicht unterscheidet sich kaum von Kartenansicht. / 手机列表视图和卡片视图差别不大。 | Echte kompakte Liste mit Titel, Quelle und Kernmerkmalen. / 做成真正紧凑的标题、来源、关键属性列表。 |
| F17 | P2 | Angeboten werden Zugangsfilter ohne vorhandene Einträge; Kombinationen können leer enden. / 存在没有条目的访问筛选，组合条件可能得到空结果。 | Kontextuelle Zählung und gezielte Rücknahme einzelner Filter. / 展示上下文计数，允许只放宽一个筛选条件。 |
| F18 | P2 | `/` und `/resources/` enthalten fast denselben Katalog ohne Canonical. / 首页与全部资源页近似重复，缺少 canonical。 | Ein Verzeichnis als kanonische Basis festlegen; Filter-URL-Politik definieren. / 明确目录主地址及筛选 URL 的索引策略。 |
| F19 | P2 | `/sitemap.xml` liefert 404; robots existiert, hat aber keinen Sitemap-Verweis. / sitemap 返回 404；robots 存在但未指向站点地图。 | Nur veröffentlichte kanonische Seiten aufnehmen; Plattformsignale respektieren. / 仅收录公开规范页面，保留平台内容信号规则。 |
| F20 | P2 | Keine OpenGraph-Metadaten; generische Detailbeschreibung. / 缺少分享元数据，详情描述为通用内容。 | Individuelle Titel/Beschreibungen und lokale schlichte Vorschaugrafik. / 独立标题、描述及简洁本地分享图。 |
| F21 | P2 | Sicherheitsheader fehlen auf Start- und Detailseite trotz vorhandenem späterem Worker-Wrapper. / 首页和详情缺少代码中已有的部分响应头。 | Statische `_headers` und Worker-Antworten konsistent absichern. / 统一静态与 Worker 响应头处理。 |
| F22 | P2 | Client importiert vollständigen historischen Snapshot und lädt danach öffentliche API. / 客户端引入包含历史条目的完整快照，随后又请求公开 API。 | Öffentlichen Fallback getrennt erzeugen; historische Texte aus Client entfernen. / 单独生成公开备用快照，历史文本不进入客户端。 |
| F23 | P2 | Homepage-HTML rund 329 KB dekodiert; umfangreiche No-JS-Karten. / 首页解码 HTML 约 329KB，无 JS 备用卡片占较大篇幅。 | Wiederholte SVGs und Markup reduzieren; zugängliche Originalverweise erhalten. / 减少重复图标和标记，同时保留可访问的原站入口。 |
| F24 | P2 | Schema und Validator unterscheiden sich; `howToUseZh` bleibt Pflicht. / 数据模式和校验脚本规则不一致，教程字段仍强制填写。 | Gemeinsame Validierung; historische Felder kompatibel erhalten und optional machen. / 共用校验，将历史教程字段兼容保留并改为可选。 |
| F25 | P2, Risiko / 风险 | Ein ungültiger Datenbankeintrag kann beim Validieren den gesamten öffentlichen API-Lauf abbrechen. Kein Live-Datenfehler bestätigt. / 源码显示单条坏数据可能导致整个公开 API 失败，尚无线上坏记录实证。 | Fehlerhafte Einträge isolieren, Fehler sichtbar protokollieren, gute Einträge erhalten. / 隔离错误记录并可追查，保留其他有效条目。 |
| F26 | P2 | CI enthält keine Browserabläufe und führt `astro check` nicht aus; alte Pläne beschreiben eine Lernplattform und 128 Einträge. / CI 缺浏览器流程和类型检查，旧计划仍写学习平台及 128 条资源。 | CI am aktuellen Ziel ausrichten, alte Entwürfe kennzeichnen und Prüfzahlen aus Daten ableiten. / 补齐关键检查，旧方案标为历史，清单改为动态计数。 |
| F27 | P3 | Sortierung und Mehrwortsuche können mehr Suchabsichten abdecken; „听力 免费“ nutzt derzeit nicht alle Kostenfelder. / 多词搜索与排序尚不能覆盖部分意图，“听力 免费”没有完整检索费用字段。 | Textsuche und Attributfilter klar definieren, dann begrenzte Absichtszuordnung testen. / 先明确规则，再考虑有限意图映射。 |

## 5. Referenzen und Designrichtung / 参考方案与设计方向

Die folgenden Websites wurden als aktuelle Muster untersucht. Die Empfehlungen sind eine Übertragung auf diesen Katalog, keine Behauptung, dass deren Gestaltung für jede Aufgabe optimal ist.

已调研以下网站的现有做法。建议是结合本项目用途作出的设计判断，不表示这些网站的设计适合所有任务。

| Referenz / 参考 | Übernehmen / 可借鉴 | Anwendung / 本站落地 |
| --- | --- | --- |
| [Minimal Gallery](https://minimal.gallery/) | Ruhige Typografie, Kategorien und gespeicherte Einträge. / 克制排版、分类与收藏入口。 | Ein kompakter Kopf, klare Ergebnisfläche, konsistente Kategorien. / 紧凑头部、清晰结果区、统一分类。 |
| [TOOOLS.design](https://www.toools.design/) | Kurze Ressourcentexte und sichtbare Preisarten. / 简短资源说明与醒目的费用类型。 | Titel, Quelle, ein Satz, Kernmerkmale, Originalverweis. / 标题、来源、一句说明、关键属性和原站链接。 |
| [All Language Resources](https://www.alllanguageresources.com/all-german-resources/) | Such-/Sortierwerkzeuge, Trefferzahl und Seitennavigation. / 搜索、排序、结果计数与分页。 | Direkter Katalogzugang; transparente Erfassung statt erfundener Bewertungen. / 直接浏览目录，透明收录，不编造评分。 |
| [NN/g: Filter](https://www.nngroup.com/articles/applying-filters/) | Filteränderungen sollen die laufende Aufgabe nicht unterbrechen. / 筛选操作不应打断当前任务。 | Zustand und Fokus erhalten; schnelle lokale Filterung beibehalten. / 保持状态和焦点，继续采用快速本地筛选。 |
| [GOV.UK: Schriftgrößen](https://design-system.service.gov.uk/styles/type-scale/) | Konsistente, skalierbare Typografie. / 一致、可缩放的文字层级。 | Eigene dichte Karten testen; fremde Standardgrößen nicht blind transplantieren. / 按本站卡片密度验证，不直接套用字号。 |

**Vorgeschlagene Anordnung:** Kleiner Marken-/Navigationskopf, darunter kurze Überschrift und Suche; links auf Desktop Kategorien, rechts Filter und Ergebnisse. Auf Mobilgeräten Kategorien und Zusatzfilter als kompakte aufklappbare Bereiche. Ergebniszahl, Sortierung und aktive Filter bleiben zusammen.

**建议布局：** 顶部使用小型品牌与导航栏，下方是简短标题和搜索；桌面左侧分类、右侧筛选及结果。手机分类和高级筛选用紧凑折叠区。结果数量、排序及已选条件放在同一区域。

**Karte:** Quellenzeichen und Name, Ressourcentitel, eine präzise chinesische Beschreibung, Kostenart, relevante Niveaus und höchstens zwei Medienkennzeichen. Favorit und Detail-Link klar trennen; Titel öffnet weiterhin die Originalquelle. Warnstatus in Text und Farbe zeigen, nicht nur farblich.

**卡片：** 来源标记与名称、资源标题、精准的一句中文介绍、费用类型、适用等级及最多两个形式标签。收藏和详情入口清晰分开，标题继续直达原站。链接异常用文字和颜色共同表示。

**Visuelle Leitwerte:** Bestehende Grüntöne und helle neutrale Flächen beibehalten. Beschreibung zunächst 15–16px und Tags 12–13px testen; angemessene Zeilenhöhe und Kontrast messen. Karten sollten im Desktop-Hauptbereich möglichst mindestens 290px breit bleiben. Drei Spalten bei der bisherigen maximalen Inhaltsbreite sind plausibler als vier schmale Spalten.

**视觉建议值：** 保留现有绿色和浅中性色。先验证说明 15–16px、标签 12–13px，测量行高及对比度。桌面主区域卡片尽量不低于 290px；按当前内容最大宽度，三列通常比四列窄卡更合理。

**Mobile Abnahmeziele:** Bei 375 × 812 CSS-Pixeln sollte die erste Ressource ohne ausgeklappte Zusatzbereiche möglichst oberhalb 520px beginnen. Dieses Ziel ist ein Gestaltungsbudget, kein Accessibility-Standard. Hauptaktionen nach Möglichkeit mit etwa 44px komfortabler Trefferfläche gestalten; WCAG 2.2 AA verlangt für das Mindestkriterium grundsätzlich 24px mit Ausnahmen, nicht pauschal 44px.

**手机验收目标：** 在 375 × 812 的 CSS 像素视口下，未展开额外区域时，首条资源尽量在 520px 以内出现。这是设计目标，不是无障碍规范。主要操作尽量提供约 44px 的舒适点击范围；WCAG 2.2 AA 最小目标通常是 24px 且有例外，不能将 44px 一律当成最低要求。

## 6. Zeit- und Arbeitsplan / 时间及工作计划表

Geschätzt werden 18–20 Arbeitstage, ungefähr vier Arbeitswochen und insgesamt 88–128 Stunden. Tag eins ist der tatsächliche Umsetzungsbeginn, kein bereits festgelegter Kalendertag. Recherche, Einzelprüfung und Nacharbeit sind enthalten; es wurde keine Automation oder Terminserie angelegt.

建议安排 18–20 个工作日，约四个工作周，总计 88–128 小时。第 1 天指实际开始实施的日期，不是已经预约的日历日期。时间包含调研、逐条核对和返工；没有创建自动化或定时任务。

| Arbeitspaket / 工作包 | Fenster / 建议时段 | Aufwand / 估算 | Ergebnis und Abnahme / 交付及验收 |
| --- | --- | --- | --- |
| W01 Ziel und Designrahmen / 目标与设计基线 | Tag 1 / 第 1 天 | 4–6h | Seitenstruktur, Kartenvarianten und Messbasis; pure Ressourcennavigation. / 页面结构、卡片方案和测量基线；保持纯资源导航。 |
| W02 Zustand und Fokus / 状态与焦点 | Tag 2–3 / 第 2–3 天 | 8–12h | F02–F04; Regressionen für Rückkehr, Tastatur und Filteraufklappen. / 返回、键盘操作和筛选折叠均有回归证据。 |
| W03 Suche / 搜索完善 | Tag 4 / 第 4 天 | 6–10h | F01, F27; Synonyme, Relevanz und definierte Suchregeln. / 同义词、排序及明确的检索规则。 |
| W04 Datenprüfung / 全量数据核对 | Tag 5–8 / 第 5–8 天 | 18–24h | F07–F11, F17, F24; 130 Einträge geprüft oder Unsicherheit gekennzeichnet. / 130 条逐项核对，无法确认的明确标注。 |
| W05 HTML-Details / 详情 HTML | Tag 9 / 第 9 天 | 6–8h | F05; aktuelle öffentliche Informationen und Originalverweise ohne JS lesbar. / 无 JS 也能读取当前公开信息和原站入口。 |
| W06 Auffindbarkeit / 搜索引擎与分享 | Tag 10 / 第 10 天 | 6–10h | F18–F20; korrekte Canonicals, Sitemap und individuelle Metadaten. / canonical、站点地图及独立元数据正确。 |
| W07 Gestaltung / 视觉重整 | Tag 11–13 / 第 11–13 天 | 12–16h | F12–F16; sechs Breiten, lange Texte und kompakte Liste geprüft. / 六种宽度、长文本及紧凑列表验收。 |
| W08 Ausfallschutz und Header / 容错及响应头 | Tag 14–15 / 第 14–15 天 | 8–12h | F21, F25; ein defekter Eintrag blockiert nicht den gesamten Katalog. / 单条坏数据不导致整个目录不可用。 |
| W09 Ladeumfang / 加载体积 | Tag 16 / 第 16 天 | 4–6h | F22–F23; keine historischen Texte im Client und keine messbare Verschlechterung. / 历史文本不进入客户端，加载测量不退步。 |
| W10 Wartung und CI / 维护及 CI | Tag 17–18 / 第 17–18 天 | 8–12h | F06, F26; JSON-Linkprüfung, Typprüfung und zentrale Browserregressionen integriert. / 资源链接检查、类型检查和关键浏览器流程接入。 |
| W11 Gesamtprüfung / 完整验收 | Tag 19–20 / 第 19–20 天 | 8–12h | Browsermatrix, Datenschutz, Live-Prüfung und Rückrollnachweise. / 浏览器矩阵、隐私、线上检查和回滚证据。 |

Abhängigkeiten: W01 vor allen Gestaltungsänderungen; W04 vor endgültigen Kartenfeldern und W05; W05 vor endgültiger SEO-Abnahme; W10 nutzt die in W02/W03 bestätigten Regressionen. Einzelpakete können unabhängig überprüft werden. Es ist keine komplette Neuschreibung nötig.

依赖关系：W01 先于视觉修改；W04 先于卡片字段定稿和 W05；W05 先于最终 SEO 验收；W10 使用 W02/W03 已确认的回归用例。每个工作包都可以独立检查，无需整站重写。

## 7. Konkrete Ausführung und Abnahme / 具体执行及验收

### W01: Ziel und Dokumentation / 目标与文档

Dateien: `docs/site/redesign-plan.md`, `docs/site/release-checklist.md`, `README.md`, `README.en.md`, `docs/resource-directory-review.md`.

文件：上述现有设计方案、发布清单、双语 README 及目录改版记录。

- [ ] Den alten Lernplattformplan als historischen Entwurf kennzeichnen; aktuellen Verzeichniszweck und Quelle dieser Analyse verlinken. / 将旧学习平台方案标为历史，注明当前资源目录定位并链接本分析。
- [ ] Zwei Kartenvarianten im lokalen Vorschauzustand mit Anki, Goethe B1 und langen Quellen vergleichen; Lesbarkeit und Informationsdichte begründen. / 本地比较两种卡片方案，使用 Anki、歌德 B1 和长来源名核对阅读及密度。
- [ ] Abnahme: Keine Lernanweisungen im Hauptablauf; Kategorien, Suche, Quelle und Originalverweis sind sofort verständlich. / 验收：主流程没有教学引导，分类、搜索、来源及原站入口清楚。

### W02: Navigationszustand und Tastatur / 导航状态与键盘

Dateien: `web/src/client/catalog.ts`, `web/src/pages/resource/[slug].astro`, `web/src/lib/resource-directory.mjs`, `web/e2e/public_site.py`.

文件：目录客户端、静态详情、卡片渲染库和既有浏览器回归脚本。

- [ ] Interne Rückkehradresse nur als zulässigen lokalen Verzeichnispfad übernehmen; kein beliebiger externer Redirect. Filter, Seite und Scrollposition speichern. / 返回地址只接受允许的本站目录路径，不接受任意外部跳转；记录筛选、页码和滚动位置。
- [ ] Gezielte Fokusziele für Seitenwechsel, Chipentfernung und leere Favoriten definieren; Nutzereingabe darf beim Tippen nicht den Fokus verlieren. / 明确翻页、删除标签和收藏为空时的焦点位置；输入时焦点保持在搜索框。
- [ ] Zusatzfilter beim ersten Deep Link passend öffnen, nach manuellem Schließen die Nutzerwahl erhalten. / 首次深链接按需展开，用户手动折叠后保持选择。
- [ ] Abnahme: Kombination `category=grammar&level=B1&price=free` nach Detail-Rückkehr identisch; Tastaturfälle landen auf sinnvollem sichtbarem Element; Browser-Zurück/Vorwärts bleibt funktionsfähig. / 验收：该组合从详情返回完全保留，键盘流程落在合理可见元素，浏览器前进后退正常。

### W03: Suche / 搜索

Dateien: `web/src/lib/resource-directory.mjs`, `web/src/client/catalog.ts`, `web/tests/directory.test.mjs`, `web/e2e/public_site.py`; kleine Aliasdatei nur bei sinnvoller Trennung.

文件：目录检索库、客户端、既有目录单测及浏览器脚本；同义词需要独立维护时再增加小型数据文件。

- [ ] `德福 → TestDaF`, `字典 → 词典`, `Podcast → 播客` kontrolliert normalisieren; Originalbegriffe beibehalten. Schreibfehler wie `Nikos` optional in begrenzter Aliasliste behandeln. / 对上述中外文同义词进行受控归一化，保留原词；常见错拼可选地纳入小表。
- [ ] Suchvertrag festlegen: Titel, Quelle, Beschreibung und Tags durchsuchen; Eigenschaften bevorzugt über vorhandene Filter. Kostenwörter nur bei eindeutig definierter Zuordnung interpretieren. / 明确搜索字段；费用等属性优先用已有筛选，只有映射确定时才解释费用关键词。
- [ ] Abnahme: Aliasabfragen finden die passenden vorhandenen Ressourcen; `Goethe B1` und `歌德 B1` bleiben funktional; genaue Titeltreffer stehen vor schwachen Teiltreffern; unbekannte Wörter zeigen ehrliche Leere statt beliebiger Empfehlungen. / 验收：同义词找到现有资源，已正常的歌德搜索保持正常，精准标题优先，未知词显示真实空结果。

### W04: Metadaten und Redaktion / 数据与编辑核对

Dateien: `web/data/resources.json`, `web/src/types.ts`, `web/src/lib/catalog-schema.mjs`, `web/scripts/validate-catalog.mjs`, `web/src/client/admin.ts`, `web/tests/schema.test.mjs`, `web/tests/catalog.test.mjs`.

文件：资源 JSON、类型、统一模式、校验脚本、既有管理客户端及数据测试。

- [ ] Alle 130 veröffentlichten Einträge nach Original-URL, Zweck, Anbieter, Kostenumfang, Zugang, Sprache, Medien, Niveaugrund und Datum prüfen. Unklare Angaben als unklar kennzeichnen, nicht raten. / 逐条核对原站链接、用途、机构、费用范围、访问条件、语言、形式、等级依据和日期；未知明确标注。
- [ ] Medienformen auf kontrollierte Werte beschränken; Kurs, Podcast, Nachricht und Wörterbuch als Inhaltsart behandeln. RSS nur bei tatsächlich angebotener Feed-URL ausweisen. / 先规范媒体形式；课程、播客、新闻、词典作为内容或用途，RSS 必须确有订阅链接。
- [ ] Gebührennotizen kurz halten, beispielsweise zu den unterschiedlichen Anki-Plattformen. Prüfungsgebühr und kostenlose Musterprüfung getrennt erfassen. / 费用说明保持简短，例如该 Anki 平台差异；考试报名收费与免费资料分开记录。
- [ ] Niveaus bei Informationsdiensten nicht als Zugangsvoraussetzung präsentieren. Offizielle Einstufung und redaktionelle Schätzung unterscheiden; breite Einstufungen einzeln begründen. / 信息服务等级不作为使用资格；保留官方与编辑参考差异，核对宽泛等级依据。
- [ ] Bestehende IDs, Slugs und Historie erhalten. Das historische Feld `howToUseZh` weiterhin lesen können, aber optional machen; alte Inhalte bewahren. / 保留 ID、slug 和历史，教程字段兼容读取并允许缺省，不删除旧内容。
- [ ] Abnahme: Jeder Eintrag hat ein Prüfergebnis oder einen ausdrücklichen Unsicherheitsgrund; Gebühren und Daten sind belegt; Schreiben und Bauen verwenden dieselbe Validierung. / 验收：全量条目有核对结果或原因，日期费用真实，写入与构建校验一致。

Zusätzliche Recherche erfolgt anhand der Deckung, nicht einer Zielzahl: Schreiben/Feedback, Aussprache/Phonetik, Transkripte/Untertitel, offizielle Prüfungsmaterialien und deutschsprachige Verwaltungsinformation prüfen. Neue Einträge müssen einen eigenständigen Nutzen belegen; bestehende Nischenangebote zuerst verifizieren.

补充资源按缺口调研，不追求凑数量：重点检查写作反馈、发音音标、逐字稿字幕、官方考试资料和德国行政信息。新增资源必须具有独立价值，先验证已有细分资源。

### W05: Direkt lesbare Detailseiten / 可直接读取的详情

Dateien: `web/worker/index.ts`, `web/src/pages/resource/view.astro`, `web/src/pages/resource/[slug].astro`, `web/src/client/catalog.ts`, `web/tests/worker.test.mjs`.

文件：现有 Worker、动态详情模板、静态详情、客户端及 Worker 测试。

- [ ] Existierenden Worker so erweitern, dass aktuelle öffentliche Datensätze in HTML stehen; gegebenenfalls vorhandene Vorlage mit HTMLRewriter füllen. Ein statisches veraltetes Detail darf nicht über einen aktuell archivierten Datensatz siegen. / 在现有 Worker 输出当前公开记录，必要时用 HTMLRewriter 填模板；不能用旧静态详情重新暴露已归档条目。
- [ ] Alle dynamischen Texte und Attribute korrekt escapen; Titel, Beschreibung, Quelle und Originalverweis bei Erstantwort enthalten. Favoritenfunktion progressiv hinzufügen. / 动态文字及属性正确转义，首个响应已有标题、说明、来源及原站链接；收藏作为增强功能。
- [ ] Abnahme: `/resource/anki/` ohne JS mit tatsächlichem Inhalt; unbekannter Slug 404; archivierte oder private Einträge bleiben geschützt; D1-Fehler nicht als normale leere Seite ausgeben. / 验收：无 JS 详情完整，未知条目 404，归档或私有条目不公开，D1 异常不伪装成正常空页。

### W06: Indexierung und Teilen / 索引与分享

Dateien: `web/src/layouts/BaseLayout.astro`, `web/worker/index.ts`, `web/src/pages/index.astro`, `web/src/pages/resources/index.astro`; neue Sitemap- und robots-Dateien passend zum aktuellen Routing.

文件：基础布局、Worker、首页和目录页；按当前路由方式增加站点地图与 robots 配置。

- [ ] `/` als Hauptverzeichnisbasis wählen; `/resources/` auf dieselbe Canonical-Basis beziehen. Teilbare Filterlinks erhalten und kombinierte Suchparameter nicht als endlose Indexseiten ausgeben. / 选择首页为目录主地址，全部资源页指向同一 canonical；保留筛选链接，避免组合条件生成无限索引页。
- [ ] Individuelle Titel, Description und OpenGraph aus öffentlichen Metadaten erzeugen; Sitemap mit Hauptverzeichnis und aktuellen öffentlichen Details. `lastmod` nur bei tatsächlichen Inhaltsänderungen aktualisieren. / 用公开元数据生成独立标题、描述及分享信息；站点地图只列主目录和公开详情，lastmod 对应真实内容修改。
- [ ] Plattform-Content-Signals respektieren; private und Verwaltungsseiten aus der Sitemap ausschließen. JSON-LD nur bei Nutzen und Übereinstimmung mit sichtbaren Inhalten ergänzen. / 尊重平台内容信号，管理及私有页不进地图；结构化数据只在与可见内容一致且有价值时加入。
- [ ] Abnahme: Metadaten im ersten HTML korrekt; Sitemap liefert 200 und gültiges XML ohne archivierte URLs; Canonical enthält keine persönlichen oder beliebigen Abfrageparameter. / 验收：首响应元数据正确，站点地图有效无归档条目，canonical 不含个人或任意查询参数。

### W07: Karten und responsive Gestaltung / 卡片与响应式设计

Dateien: `web/public/directory.css`, `web/src/components/ResourceCard.astro`, `web/src/components/ResourceFilters.astro`, `web/src/components/ResourceDirectory.astro`, `web/src/lib/resource-directory.mjs`, `web/src/layouts/BaseLayout.astro`, `web/e2e/public_site.py`.

文件：现有目录 CSS、卡片、筛选、目录组件、公共渲染库、布局及浏览器脚本。

- [ ] Spaltenzahl aus tatsächlicher Hauptflächenbreite ableiten; lange Namen, zweizeilige Titel, mehrere Medien und eingeschränkte Linkzustände prüfen. / 按主区域宽度定义列数，对长名称、两行标题、多形式和受限状态逐项检查。
- [ ] Anbieter, Kosten und Original-/Detailzugang klar erkennbar gestalten; lokale Zeichen nur mit geklärten Nutzungsrechten und ohne externe Icon-Abfragen einsetzen. / 来源易识别、费用易扫读、入口一致；本地图形有明确许可，不用外部图标服务追踪访问。
- [ ] Mobile Liste durch echte Kompaktheit verkürzen, nicht durch kleinere wichtige Schrift. Hauptfilter kompakt und aktive Bedingungen sichtbar halten. / 手机列表真正节省空间，不靠缩小重要文字；主筛选紧凑，已选条件明确。
- [ ] Abnahme: Sechs Breiten ohne Überlauf; Reflow bei 200 Prozent Text- und 400 Prozent Seitenvergrößerung; sichtbarer Fokus sowie Kontrast und Statusmeldungen nach WCAG 2.2 AA prüfen. / 验收：六种宽度、放大重排、焦点遮挡、对比度及状态提示均检查。

### W08: Zuverlässigkeit und Header / 可靠性及响应头

Dateien: `web/worker/index.ts`, `web/scripts/prepare-assets.mjs`, `web/wrangler.jsonc`, `web/tests/worker.test.mjs`; `web/public/_headers` für statische Asset-Pfade.

文件：Worker、静态资产准备脚本、Wrangler 配置及测试；静态资产路径适用时增加 `_headers`。

- [ ] Gemeinsame Sicherheitsheader an statischen Seiten, dynamischen Details, 404 und API-Antworten tatsächlich messen; Quellcode allein ist kein Wirksamkeitsnachweis. / 分别实测静态、动态、404 和 API 响应，不能凭代码认定响应头已生效。
- [ ] Fehlerhafte öffentliche Datensätze in einer Testdatenbank isolieren; gültige Einträge weiterhin ausgeben und Fehler nachvollziehbar protokollieren, ohne vollständige Inhalte offenzulegen. / 测试库构造坏记录，隔离后有效记录仍可读；错误可追查，但不泄露记录正文。
- [ ] CSP an tatsächlich verwendeten Skripten ausrichten. Bei Report-only vorhandene Protokollierung nutzen und keinen zusätzlichen externen Überwachungsdienst einführen. / 按真实脚本需求评估 CSP；若先报告模式，沿用现有日志，不增加外部监控服务。
- [ ] Abnahme: Ein fehlerhafter Eintrag blockiert nicht den gültigen Katalog; Header sind in tatsächlichen Antworten korrekt; anonyme Verwaltung bleibt geschützt. / 验收：有效目录不被坏数据整体阻断，响应头实际正确，匿名管理仍受保护。

### W09: Ladeumfang und Messung / 体积及性能测量

Dateien: `web/src/client/catalog.ts`, `web/src/data.ts`, `web/src/components/ResourceDirectory.astro`, `web/src/lib/icons.mjs`, `web/scripts/prepare-assets.mjs`.

文件：客户端、数据入口、目录组件、图标及资产准备脚本。

- [ ] Öffentlichen Fallback beim Bauen auf veröffentlichte externe Ressourcen und benötigte Felder begrenzen; historische eigene Anleitungen nicht in Client-JavaScript aufnehmen. / 构建公开备用数据，只含公开外部资源及所需字段；旧原创指南及教程不进 JS。
- [ ] Wiederholte SVGs in No-JS-Karten reduzieren und Originalverweise erhalten; gehashte Assets langfristig cachen, unversionierte CSS nicht dauerhaft als immutable markieren. / 无 JS 卡片减少重复图标，保留真实名称及链接；哈希文件可长缓存，未版本化 CSS 不永久缓存。
- [ ] Baseline: Drei ungedrosselte lokale Läufe mit LCP etwa 1,10–1,25s und CLS null. JavaScript etwa 194KB dekodiert und 34KB komprimiert; API etwa 100KB dekodiert und 17KB komprimiert. / 基线为上述三次实验值；解码与压缩传输大小必须分开比较。
- [ ] Abnahme: Archivierte Anleitungen fehlen im Client. HTML möglichst um mindestens 30 Prozent reduzieren; notwendige Restgröße erklären. Drei vergleichbare Läufe ohne deutliche Verschlechterung und ergänzende mobile Drosselungsmessung. / 验收：历史文本退出打包，HTML 争取减少三成，无法达到则说明必要内容，同条件和移动限速复测。

Feldziel nach web.dev: LCP höchstens 2,5s, INP höchstens 200ms, CLS höchstens 0,1 beim 75. Perzentil realer Nutzer. Ohne Feld-INP und ausreichende Stichprobe darf die Website nicht als vollständig CWV-bestanden bezeichnet werden.

按 web.dev 的现场目标为真实用户第 75 百分位 LCP 不超过 2.5 秒、INP 不超过 200 毫秒、CLS 不超过 0.1。缺少现场 INP 和足够样本时，不能宣称所有核心网页指标已通过。

### W10: Linkpflege und CI / 链接维护及 CI

Dateien: `.github/workflows/link-check.yml`, `.github/workflows/web-check.yml`, `web/package.json`, `web/e2e/public_site.py`, `web/scripts/validate-catalog.mjs`; neue `web/scripts/check-resource-links.mjs`.

文件：现有链接及网站 CI、package 配置、浏览器脚本、目录校验；新增版本化资源链接检查脚本。

- [ ] Originalverweise aus JSON lesen; nur zulässige HTTP(S)-Ziele mit begrenzter Parallelität, Timeout und Wiederholung prüfen. Loopback, private Netze und Metadatendienste auch bei Weiterleitungen ausschließen. / 读取资源链接，限制并发、超时和重试；排除回环、内网和元数据服务地址，并校验重定向目标。
- [ ] 403, 429 und Automatisierungssperren als eingeschränkt kennzeichnen; Netzwerkfehler erneut prüfen. Einzelne Fehler archivieren keine Ressource und überschreiben kein redaktionelles Prüfdatum. / 将限制与网络失败分别记录，单次失败不自动下架，不覆盖人工核对日期。
- [ ] Maschinenprüfung und redaktionelle Kontrolle im Wartungsbericht trennen; JSON-Linkprüfung sowie Typprüfung und zentrale Browserregressionen in vorhandene Workflows aufnehmen. / 维护报告区分自动及人工检查，现有 CI 接入 JSON、类型及关键浏览器回归。
- [ ] Abnahme: Defekte Testlinks erkannt; gesperrte Anbieter nicht als 404 fehlklassifiziert; Regressionen erkennen die bestätigten Zustands- und Fokusfehler; Zählwerte entstehen aus Daten. / 验收：坏链接与受限正确区分，关键回归能发现原问题，计数动态生成。

### W11: Gesamtabnahme und spätere Veröffentlichung / 完整验收及后续发布

Dateien: `web/e2e/public_site.py`, `docs/site/release-checklist.md`; Produktionscode nur zur Behebung konkret festgestellter Defekte ändern.

文件：浏览器脚本和发布清单；只有发现具体问题时才回改生产代码。

- [ ] Chromium, Firefox und WebKit unabhängig headless prüfen. Fehlende Laufzeiten als Prüfgrenze festhalten, nicht als bestätigte Kompatibilität. / 分别验证三种浏览器；不可用时明确记录验证缺口。
- [ ] Aliassuche, kombinierte Filter, leere Ergebnisse, Seitennavigation, Teilen, Detailrückkehr, Favoriten, Speicherverweigerung, API-Ausfall, ungültige Daten, No-JS, Zoom und Tastatur-/Screenreader-Meldungen prüfen. / 搜索、筛选、返回、收藏、异常、无 JS、缩放和无障碍流程全部覆盖。
- [ ] `npm run verify`, Browserregression, `git diff --check` und `pwsh -NoProfile -File tools/publication-check.ps1 .` erfolgreich ausführen; Herkunft grafischer Assets und öffentliche Inhalte kontrollieren. / 构建、类型、单测、浏览器、差异及隐私检查通过，图形来源和公开内容明确。
- [ ] Nach späterer Umsetzung und Prüfung gemäß bestehender Autorisierung am konfigurierten Standort veröffentlichen. Vor Datenänderungen sichern und danach zurücklesen; Live-HTML, API, Details und mobile Darstellung kontrollieren sowie Rückrollnachweise erhalten. / 后续完成验收后按已有授权发布，安全认证沿用；数据备份、线上复核及回滚证据齐全。

## 8. Pflege nach der Umsetzung / 实施后的维护建议

Bestehenden Linklauf wöchentlich um JSON ergänzen; eingeschränkte Ziele monatlich manuell kontrollieren; Preise und zentrale Prüfungslinks häufiger als stabile Informationsseiten prüfen. Vierteljährlich Kategorien, Aliasliste und Niveauangaben überprüfen. Diese Intervalle sind Vorschläge für vorhandene Prozesse, keine neu eingerichteten Automationen.

建议将 JSON 检查加入既有每周链接流程；受限网站每月人工确认；价格及核心考试入口比稳定信息页更频繁核对；每季度复核分类、同义词和等级。这些是现有维护流程的建议，没有新增自动化。

Erfolg messen: Pflichtfelder mit belegten Angaben oder ausdrücklicher Unsicherheit; alle bestätigten P1-Fälle bestehen die Regression; keine zerstörten Favoriten; Links mit ehrlichem Status und separatem Prüfdatum; konsistente Darstellung. Besucherzahlen allein sind kein Qualitätsbeweis.

成果衡量：必需字段有依据或明确未知；已确认 P1 全部通过回归；收藏不被破坏；链接状态及不同核验日期真实；布局一致。访问量不能单独证明质量。

Später prüfen: Favoritenexport/-import und optionaler dunkler Modus. Für diesen Auftrag bringen Nutzerkonten, KI-Beratung, Tests, Lernpläne, soziale Funktionen, unendliches Scrollen und große dekorative Bilder keinen ausreichenden Zusatznutzen.

后续可考虑收藏导入导出及可选深色模式。当前任务中，用户账号、AI 咨询、测验、学习计划、社交、无限滚动及大型装饰图片没有足够的增量价值。

## 9. Quellen und Einordnung / 来源及用途

Die folgenden Primärquellen stützen die jeweiligen Regeln. Suchmaschinenindexierung und gute Laborwerte sind keine Garantie für Rankings oder reale Nutzerleistung.

下列一手来源支撑对应规则。搜索引擎可索引与实验测量较好，不保证排名或真实用户性能。

| Quelle / 来源 | Anwendung / 对应事项 |
| --- | --- |
| [Google: JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) | Direktes Detail-HTML und korrekte HTTP-Statuswerte. / 详情内容及响应状态。 |
| [Google: Canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) | Ähnliche Verzeichnis-URLs konsolidieren. / 规范重复目录地址。 |
| [Google: Sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) | Öffentliche kanonische Seiten auffindbar machen. / 提供公开规范页面索引。 |
| [Google: Strukturierte Daten](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) | Nur mit tatsächlichem Seiteninhalt übereinstimmende Angaben. / 结构化信息必须对应真实可见内容。 |
| [Cloudflare: Statische Header](https://developers.cloudflare.com/workers/static-assets/headers/) | Unterschied zwischen statischen und Worker-generierten Antworten. / 区分静态及 Worker 响应头处理。 |
| [Cloudflare: HTMLRewriter](https://developers.cloudflare.com/workers/runtime-apis/html-rewriter/) | Bestehende Detailvorlage mit aktuellen Daten füllen. / 复用模板输出当前详情。 |
| [web.dev: Web Vitals](https://web.dev/articles/vitals) | Labor- und Felddaten trennen, Messziele definieren. / 区分实验和现场数据，设定目标。 |
| [W3C: Zielgröße](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) | Mindestgröße korrekt von Komfortziel unterscheiden. / 区分最低点击范围与舒适目标。 |
| [W3C: Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) | Schmale Ansichten und Vergrößerung prüfen. / 窄屏及放大重排。 |
| [W3C: Fokus nicht verdecken](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) | Fokus unter festen Elementen sichtbar halten. / 焦点不被固定元素遮挡。 |
| [W3C: Statusmeldungen](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) | Ergebnis- und Favoritenänderungen ankündigen. / 结果及收藏变更读屏提示。 |
| [MDN: CSP](https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/CSP) | Richtlinie passend zu vorhandenen Skripten prüfen. / 按实际脚本验证安全策略。 |
| [Anki: Offizielle Anwendungen](https://apps.ankiweb.net/) | Unterschiedliche Plattformkosten. / 不同平台费用。 |
| [Goethe B1: Offizielle Übungen](https://www.goethe.de/de/m/spr/prf/ueb/pb1.html) | PDF/Audio und kostenlose Muster getrennt darstellen. / PDF、音频及免费样题清晰展示。 |
| [Goethe: GER](https://www.goethe.de/ins/de/de/uun/dln/ger.html) | Sprachkompetenzangaben von Servicezulassung unterscheiden. / 语言等级与服务资格区分。 |

## 10. Status der ursprünglichen Analyse / 初次分析交付状态

Analyse und Plan dokumentiert; Produktionscode, Datenbank und Live-Website sind in dieser Planungsphase unverändert. Die Arbeitskästchen beschreiben künftige Umsetzung, nicht bereits abgeschlossene Verbesserungen.

分析及计划已整理；本次规划阶段未修改生产代码、数据库和线上网站。上述复选框是后续执行步骤，不表示对应优化已经完成。

## 11. Erste Umsetzung nach dem Folgeauftrag / 后续委托后的首轮实施

Nach dem Auftrag zur weiteren Optimierung wurden die Kernänderungen umgesetzt und am konfigurierten Standort veröffentlicht. Der [Umsetzungsbericht](../../resource-directory-review.md) enthält die tatsächlichen Ergebnisse, Versionen und Grenzen. Die ursprünglichen Kästchen bleiben als vollständige Abnahmeliste erhalten; die folgende Tabelle beschreibt den aktuellen Umfang.

收到继续优化的委托后，已完成核心改动并发布到既有网站。[实施记录](../../resource-directory-review.md)包含真实结果、版本和局限。原始复选框继续作为完整验收列表保留；下表说明目前完成范围。

| Paket / 工作包 | Stand / 当前状态 |
| --- | --- |
| W01 | Historischer Plan gekennzeichnet, Checkliste und Bericht ergänzt; README-Arbeit und weitere Variantenvergleiche offen. / 旧方案已标为历史，发布清单及记录已完善，README 和进一步方案比较仍待做。 |
| W02 | Filter-, Seiten- und Scrollrückkehr, Tastaturfokus und manuelle Filterfaltung umgesetzt und live geprüft. / 筛选、分页、滚动恢复、焦点及折叠状态已实现并线上验证。 |
| W03 | Begrenzte Aliasliste und Titel-/Quellenpriorität umgesetzt und geprüft. / 同义词及标题、来源优先排序已实现并验证。 |
| W04 | Schema vereinheitlicht und historisches Tutorialfeld optional; vollständige Redaktion und Medientaxonomie offen. / 统一校验，教程字段兼容缺省；全量编辑复核及媒体分类仍待做。 |
| W05 | Aktuelles vollständiges Detail-HTML umgesetzt und ohne JS live geprüft. / 当前数据的完整详情 HTML 已上线，无 JS 已验证。 |
| W06 | Canonical, individuelle Metadaten, Sitemap und robots umgesetzt und live geprüft. / 规范链接、独立元数据、站点地图及 robots 已上线并验证。 |
| W07 | Lesbarkeit, Kartenbreiten, kompakte Liste und 200-Prozent-Text geprüft; vollständiger manueller Zoom-/Screenreaderlauf offen. / 字体、卡片宽度、紧凑列表及两倍字号已验证，完整人工缩放与读屏流程待做。 |
| W08 | Fehlerisolation und HTML-Header umgesetzt; CSP offen. / 数据异常隔离及 HTML 响应头已实现，CSP 待评估。 |
| W09 | Öffentliches Browserpaket verkleinert, HTML reduziert und Hash-Cache geprüft; vertiefte Leistungsreihen offen. / 已缩减公开浏览器包和 HTML，缓存已验证，深入性能测量待做。 |
| W10 | JSON-Linkprüfung und Typprüfung vorbereitet und lokal geprüft; Remote-CI nicht synchronisiert, Browser-CI offen. / JSON 链接与类型检查已配置并本地验证，尚未同步远端 CI，浏览器 CI 待接入。 |
| W11 | Chromium-Regression, 21 Axe-Ansichten, Veröffentlichung und Live-Rücklesen bestanden; andere Browser und manuelle Prüfungen offen. / Chromium 回归、21 个 Axe 视图、发布及线上回读通过，其他浏览器和人工项目待做。 |
