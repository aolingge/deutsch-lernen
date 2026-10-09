# Resource Directory Next Phase Implementation Plan / 德语资源目录下一阶段优化计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ein zuverlässiges, übersichtliches und gepflegtes Verzeichnis externer Deutsch- und Deutschlandressourcen schaffen. / 将网站完善为准确、清晰、可持续维护的德语及德国相关外部资源目录。

**Architecture:** Astro, der bestehende Cloudflare Worker und D1 bleiben die Grundlage. Öffentliche Daten, Filter und Darstellungen erhalten gemeinsame Regeln; Datenkorrekturen erfolgen mit Revisionen und überprüfbaren Quellen. / 沿用 Astro、既有 Cloudflare Worker 和 D1；统一公开数据、筛选与展示规则，资料修订保留版本并附可核查来源。

**Tech Stack:** Astro, TypeScript, native CSS, Cloudflare Workers/D1, Node tests, Playwright/Chromium. Weitere Browser werden nur für die Prüfungen ergänzt. / 继续使用现有技术栈；其他浏览器仅用于补充验证。

**Spec:** Aktueller Nutzerauftrag zur umfassenden Analyse und Planung; [README](../../../README.md), [vorheriger Plan](2026-10-04-resource-directory-improvement.md) und [Umsetzungsbericht](../../resource-directory-review.md). Diese Datei ergänzt die bereits veröffentlichte Verbesserung. / 依据本轮全面分析、先列计划的要求及上述项目文档；本文件承接已经上线的优化。

## Global Constraints / 全局约束

- Reines Ressourcenverzeichnis: kurze Fakten, Filter und Links zum Original. / 纯资源整理：简短资料、筛选与原站链接。
- Chinesische Oberfläche; originale deutsche Ressourcentitel bleiben erhalten. / 界面为简体中文，保留资源原文名称。
- Bestehende Favoriten, private Aufgaben, archivierte Dokumente und Datenbankprotokolle bewahren. / 保留原有收藏、私人任务、归档文档和数据库审计记录。
- Keine neuen Konten, kostenpflichtigen Dienste oder fremden Trackingdienste für diese Optimierung. / 本轮优化不引入新账号体系、付费服务或第三方跟踪服务。
- Fremde Inhalte nur verlinken; Bilder, Logos und Schriften nur mit belegter Nutzungsberechtigung übernehmen. / 第三方内容以链接收录；图片、标志和字体须有明确使用依据。
- Diese Runde liefert ausschließlich Analyse und Plan. Umsetzung und Website-Veröffentlichung gehören zu einer späteren Ausführungsrunde; die bestehende Website-Veröffentlichungsfreigabe bleibt gültig. / 本轮只交付分析与计划；实施和网页发布属于后续执行轮次，既有网页发布授权继续有效。
- Kein Git-Push, keine DNS-, Zahlungs- oder Authentifizierungsänderung aus diesem Plan ableiten. / 本计划不包含 Git 推送、DNS、付费或认证变更。

## Review Focus / 重点复核情形

- Ein neuer Live-Datensatz muss im passenden Filter auftauchen, ohne bestehende Auswahl zu verlieren. / 线上新增条目必须进入对应筛选，已有选择不得悄然丢失。
- Eine alte URL oder ein Favorit muss trotz neuer Metadaten und Anbietergruppierung gültig bleiben. / 元数据与来源分组调整后，旧地址及收藏仍须有效。
- „Kostenlos“, „ohne Registrierung“ und „offizielles Niveau“ müssen genau zur verlinkten Funktion passen. / “免费”“免注册”“官方等级”必须对应链接实际提供的功能。
- Zeitüberschreitungen und Bot-Sperren dürfen nicht automatisch zu Löschung oder Archivierung führen. / 请求超时和自动访问限制不得自动触发删除或归档。
- Import, Rückkehr aus Details, Tastaturbedienung und Datenfehler müssen verständlich und verlustfrei behandelt werden. / 导入、详情返回、键盘操作与数据异常须有清晰反馈并避免数据损失。

## 1. Ergebnis und Prüfstand / 结论与检查基线

Die nächste Runde sollte zuerst die Verlässlichkeit der Inhalte und der Live-Filter verbessern, danach die Darstellung verfeinern und die Pflege absichern. Ein vollständiger Neuaufbau ist durch die Befunde nicht begründet. Für alle unten beschriebenen Pakete sind etwa fünf bis sechs Kalenderwochen, 22–28 konzentrierte Arbeitstage beziehungsweise 114–154 Arbeitsstunden vorgesehen. Das ist eine Aufwandsschätzung, kein bereits gestarteter Zeitplan.

下一轮应优先提高资源资料和线上筛选的可靠性，再完善视觉并补齐维护机制。现有证据不足以支持推倒重做。全部工作包预计需要五至六个自然周、22–28 个有效工作日，约 114–154 小时；这是工作量估算，不表示已开始按日程执行。

Stand: 2026-10-04, lokaler Ausgangscommit `749127b`. Die aktuelle Website wurde erneut mit einem isolierten Chromium-Browser geprüft. Für Szenarien mit neuen Katalogwerten wurde ausschließlich eine Browserantwort ersetzt; es gab keine Datenbankänderung. Die Datenstatistik stammt aus der aktuellen öffentlichen API.

检查日期为 2026-10-04，本地起点提交为 `749127b`。本轮再次通过独立 Chromium 浏览器检查线上网站；新增目录值的情形仅在浏览器内替换响应模拟，没有修改数据库。数据统计来自当前公开 API。

| Merkmal / 项目 | Aktueller Befund / 当前结果 |
| --- | --- |
| Umfang / 规模 | 130 öffentliche Ressourcen, 12 Kategorien, 110 normalisierte Hostnamen. Hostnamen sind keine eindeutige Anbieterzahl. / 130 条公开资源、12 类、110 个规范化主机名；主机名数不等于独立机构数。 |
| Kosten / 费用 | 79 kostenlos, 44 teilweise kostenlos, 7 kostenpflichtig. / 免费 79 条、部分免费 44 条、付费 7 条。 |
| Zugang / 访问 | 105 als offen, 25 als registrierungspflichtig geführt; Genauigkeit muss redaktionell geprüft werden. / 105 条标为免注册、25 条标为需注册，准确性仍需逐项编辑复核。 |
| Niveaus / 等级 | 10 offiziell, 120 redaktionell eingeordnet; redaktionell bedeutet nicht automatisch falsch. / 10 条为官方标级、120 条为编辑参考；编辑参考不等于错误。 |
| Medien / 形式 | 36 unterschiedliche Werte, teilweise Medien, teilweise Themen und Funktionen. / 36 种取值，混合了媒体、主题及功能。 |
| Gespeicherte Linkangaben / 库内链接状态 | 115 erreichbar, 12 eingeschränkt, 3 ungeprüft. / 可访问 115 条、受限 12 条、待核验 3 条。 |
| Frühere vollständige Netzwerkprobe / 上轮全量网络探测 | 117 erfolgreich, 9 eingeschränkt, 4 ungeprüft, kein bestätigter defekter Link; das ist ein früherer Prüfbericht und wurde nicht in die Katalogmetadaten geschrieben. / 上轮探测成功 117 条、受限 9 条、待核验 4 条、未确认失效链接；属于此前检查报告，未写回目录元数据。 |
| Aktuelle SEO-Stichprobe / 当前索引抽查 | Sitemap und robots liefern 200; Anki-Detail enthält direkt Titel, Inhalt und Canonical. / 站点地图及 robots 返回 200，Anki 详情直接包含标题、内容及规范链接。 |
| Layout / 布局 | Kein horizontaler Überlauf in den hier erneut geprüften Breiten 320, 375, 1440 und 1920. Einzeltreffer ist auf 1440 jedoch 1.082 px breit. / 本轮再次检查的 320、375、1440、1920 宽度未横向溢出；但 1440 宽度下单个结果卡片达到 1,082 像素。 |

Die bisherigen Verbesserungen bleiben Ausgangspunkt: Rückkehr mit Filtern und Scrollposition, Fokuswiederherstellung, bekannte Suchaliase, vollständige Detail-HTML-Seiten, kanonische URLs, Sicherheitsheader für HTML, kleinere Browserdateien und echte kompakte Listen sind bereits umgesetzt. Der vorherige Bericht dokumentiert ihre ausführliche Abnahme; sie werden hier nicht erneut als offene Fehler gezählt.

此前改进作为本轮基线保留：详情返回筛选与滚动位置、焦点恢复、常见搜索别名、完整详情 HTML、规范链接、HTML 安全响应头、浏览器文件缩减及真正的紧凑列表均已实现。此前报告记录了详细验收，本计划不把这些已修复事项重新列成问题。

## 2. Priorisierte Befunde / 问题及优先级

P1 betrifft zuverlässige Auswahl und richtige Ressourcenangaben; P2 verbessert Orientierung, Gestaltung und Pflege; P3 ist optional. „Browser“ bedeutet reproduziert, „Code“ einen geprüften Ausführungspfad, „Quelle“ eine überprüfte Originalquelle. Ein offener Prüfpunkt ist keine bestätigte Fehlfunktion.

P1 影响可靠筛选和资源资料准确性；P2 改善查找、视觉与维护；P3 为可选。标注“浏览器”表示已复现，“代码”表示已检查实现路径，“原站”表示已核查一手来源。待测事项不代表已经确认故障。

| ID / 编号 | Priorität und Beleg / 优先级及证据 | Problem und Folge / 问题与影响 | Geplante Behandlung / 计划处理 |
| --- | --- | --- | --- |
| N01 | P1 · Browser/Code / 浏览器及代码 | Neue Live-Skills/Formate fehlen in statisch erzeugten Dropdowns; nach Gebührenwechsel verschwindet die Skill-Auswahl. / 线上新增技能、形式未进入静态下拉框；切换费用后技能条件丢失。 | Optionen aus denselben aktuellen Daten wie die Karten bilden; unbekannte URL-Werte erhalten und erklären. / 用与卡片相同的当前数据生成选项，保留并解释未知地址条件。 |
| N02 | P2 · Browser-Simulation / 浏览器模拟 | Bei einem zusätzlichen Anbieter zeigt „收录说明“ 131 Ressourcen, aber weiterhin 110 Websites statt 111. / 模拟新增来源后，收录说明显示 131 条资源，却仍为 110 个网站，实际应为 111。 | Sämtliche Statistiken aus derselben Datenversion aktualisieren. / 所有统计统一读取同一版数据。 |
| N03 | P1 · Originalquelle / 原站 | Goethe-Aussprachetrainer: aktuell als offen und offiziell A1–B2 markiert; Original nennt Registrierung und alle Niveaus. / 歌德发音训练当前标为免注册、官方 A1–B2；原站说明需注册、适用所有等级。 | Zugang zum Training vom frei lesbaren Infotext trennen; Niveau/Skill korrigieren. / 区分介绍页与训练入口，修正访问、等级及发音技能。 |
| N04 | P2 · Originalquelle / 原站 | „Duden Mentor“ ist noch der einzige Name; aktuelle FAQ nennt „Duden-Schreibassistent“ und den früheren Namen. / 目录仅使用 Duden Mentor，当前官方 FAQ 使用 Duden-Schreibassistent 并注明旧名。 | Aktuellen Titel ergänzen, alten Namen als Suchalias und alte ID behalten. / 更新显示名称，保留旧名搜索及旧 ID。 |
| N05 | P1 · Stichprobe / 抽查 | Teilweise kostenlose Angebote haben keine knappe Angabe, welcher Teil kostenlos ist; Anki unterscheidet Plattformkosten. / 部分免费缺乏具体范围说明，例如 Anki 不同平台费用不同。 | Kurzes Kosten-/Plattformfeld mit Quellenbeleg; keine wechselnden Preise aus dem Gedächtnis. / 增加简短免费范围及平台说明，附来源，不凭记忆写易变价格。 |
| N06 | P1 · API/Modell / 数据及模型 | 120 redaktionelle Niveaus; „Deutschlandleben + A1“ ergibt null, obwohl Such- und Informationsdienste keine Sprachzulassung darstellen. / 120 条编辑参考等级；德国生活加 A1 为零，但查询及信息服务不应被当成语言准入条件。 | Lernniveau, Leseschwierigkeit und niveauneutrale Dienste unterscheiden. / 区分学习等级、阅读难度及不分等级的服务。 |
| N07 | P2 · API/Modell / 数据及模型 | 36 Formate mischen PDF, Audio, Nachrichten, Jobs, Lehrer und Reisen. / 36 种形式混合 PDF、音频、新闻、求职、教师和出行。 | Medienart kontrollieren, Themen/Funktionen getrennt speichern; Altfelder kompatibel lesen. / 规范媒体类型，主题及功能分开存，兼容旧字段。 |
| N08 | P2 · Code/API / 代码及数据 | Karten zeigen die ersten zwei Formate; bei Goethe B1 fehlt dadurch PDF trotz PDF-Material. / 卡片只取前两个形式，歌德 B1 因此未显示实际提供的 PDF。 | Bedeutungsvolle Medien nach einer stabilen Regel auswählen, alle Fakten im Detail behalten. / 按固定规则选最有意义的媒体，详情保留完整资料。 |
| N09 | P2 · Quellenstichprobe / 原站抽查 | Deutsch.info wird als mehrsprachig beschrieben, das Sprachfeld enthält nur Deutsch; „Sprache“ ist nicht als Inhalt oder Oberfläche definiert. / Deutsch.info 描述为多语，语言字段仅有德语，且尚未区分内容语言与界面语言。 | Begriffe definieren und unterstützte Oberflächensprachen gezielt prüfen. / 定义两类语言并核验实际支持情况。 |
| N10 | P2 · Code / 代码 | Linkstatus und redaktionelles Datum werden gemeinsam als „核验记录“ ausgegeben; ein eigener Netzwerkzeitpunkt fehlt im Schema. / 链接状态和编辑日期合为核验记录，模型缺少独立网络检查时间。 | Redaktionelle Faktenprüfung und technische Linkprobe getrennt anzeigen. / 分开展示资料核验与链接探测时间。 |
| N11 | P2 · Browser / 浏览器 | „德福“ findet 2, „德福考试“ 0; „Wörterbuch“ 12, „worterbuch“ 0. / 德福有 2 条，德福考试为零；Wörterbuch 有 12 条，worterbuch 为零。 | Begrenzte, überprüfbare Normalisierung und zusammengesetzte Aliase. / 增加有限、可验证的字符规范化及组合别名。 |
| N12 | P2 · Browser/Vertrag / 浏览器及搜索范围 | „免费听力“ ergibt null; Gebühren sind bisher Filter, kein Suchmerkmal. / 免费听力为零，费用目前属于筛选字段而非搜索词。 | Entweder wenige eindeutige Kostenbegriffe unterstützen oder leere Ergebnisse mit passenden Filtern erklären. / 支持少量明确费用词，或空结果时提供对应筛选入口。 |
| N13 | P2 · Browser/Gestaltung / 浏览器及视觉 | Einzelkarte 1.082 px, zwei Karten je 532 px; die Lesebreite schwankt stark. / 单卡宽 1,082 像素、两卡各 532 像素，阅读宽度变化过大。 | Grid-Breite bei wenigen Treffern begrenzen; Listenansicht darf breiter bleiben. / 少量结果时限制网格卡片宽度，列表可保留宽行。 |
| N14 | P2 · Browser/Gestaltung / 浏览器及视觉 | Erste Karte bei 320 px erst auf y=601; bei 375 px y=516. / 320 宽度首卡位于约 601 像素，375 宽度约 516 像素。 | Schmalen Filterblock und Kopfabstände gezielt reduzieren, ohne Text oder Auswahl zu verstecken. / 针对窄屏压缩筛选块和顶部间距，保留文字及操作。 |
| N15 | P2 · Code/Gestaltung / 代码及视觉 | Automatische Anbieterzeichen sind nicht immer aussagekräftig: APS erhält „ORG“. / 自动来源字母并非总能辨识，例如 APS 得到 ORG。 | Stabile Anbieter-ID mit bewusst gepflegtem Kürzel; lokale berechtigte Assets optional. / 使用稳定来源 ID 和人工维护简称，可选有使用依据的本地素材。 |
| N16 | P2 · Produktprüfung / 产品检查 | „收录说明“ erläutert Regeln, bietet aber keinen tatsächlichen Anbieterindex oder Anbieterfilter. / 收录说明解释规则，但没有来源机构目录及筛选。 | Kleine Anbieterübersicht mit Anzahl und vorhandenen unabhängigen Einstiegen. / 增加轻量来源目录、资源数及不同用途入口。 |
| N17 | P1 · Code / 代码 | Admin verlangt weiter „怎么使用“, obwohl das Schema dieses historische Feld optional erlaubt. / 管理界面仍强制填写怎么使用，但模型已经允许历史字段缺省。 | Bei neuen Ressourcen aus der Pflichtmaske entfernen; alte Inhalte erhalten. / 新条目不再强制填写，旧内容保留。 |
| N18 | P1 · Lokaler Aufruf / 本地调用 | Validator akzeptiert unmöglichen Kalendertag, reine Leerzeichen als Skill und doppelte Formate. / 校验接受不存在的日期、纯空格技能及重复形式。 | Kalender prüfen, Werte trimmen, leer zurückweisen, Duplikate normieren; Fehler lesbar machen. / 校验真实日期、清理空格、拒绝空值、规范重复，并提供明确错误。 |
| N19 | P2 · Code / 代码 | „导出公开目录“ exportiert bewusst nur veröffentlichte Einträge, keine vollständige Datenbank mit Revisionen/Audit. / 导出公开目录按设计只含公开条目，不含完整数据库版本和审计。 | Öffentlichen Austausch und geschützte vollständige Sicherung getrennt dokumentieren. / 区分公开交换文件与受保护的完整备份。 |
| N20 | P2 · Code / 代码 | Import setzt alles auf Entwurf, begrenzt auf 200 und stoppt bei Konflikten; keine Wiederherstellungsfunktion. / 导入全部转草稿、最多 200 条、冲突后停止，不是恢复机制。 | Duplikate, Revisionen und Teilfortschritt vorab zeigen; explizite Wiederaufnahme statt blindem Überschreiben. / 预先展示重复、版本及进度，支持明确续导，不盲目覆盖。 |
| N21 | P1/P2 · Code / 代码 | Linkchecker liest Repository-JSON; neue D1-Einträge können fehlen. Bericht verliert konkrete Fehlerursache und wird nicht als CI-Artefakt aufbewahrt. / 链接检查读取仓库 JSON，可能漏掉新 D1 条目；缺少具体错误原因及 CI 报告留存。 | Öffentlichen Live-Katalog optional zusätzlich prüfen, sicheren Prüfer beibehalten, Bericht mit Ursache/versionieren. / 可补查公开实时目录，保留安全检查，并记录原因和数据版本。 |
| N22 | P2 · Projektstand / 项目状态 | Neue JSON-/Typprüfungen existieren lokal; remote aktivierte Ausführung wurde nicht nachgewiesen. Browserprüfung fehlt im Workflow. / JSON 与类型检查已配置本地，尚无远端运行证据；工作流缺浏览器检查。 | Vorbereitete CI-Prüfung und Artefakte ergänzen; Aktivierung getrennt vom Website-Deploy behandeln. / 补齐 CI 和报告；远端启用与网页发布分开记录。 |
| N23 | P2 · Code / 代码 | Favoriten sind nur im Browser; keine Export-/Importmöglichkeit. / 收藏仅存当前浏览器，缺少导出导入。 | Kleine lokale Sicherung, zusammenführender Import; alte Aufgaben unverändert erhalten. / 提供轻量本地备份及合并导入，保留旧任务。 |
| N24 | P2 · Produktprüfung / 产品检查 | Rückmeldungen sind nur über den allgemeinen GitHub-Link zugänglich. / 反馈主要通过通用 GitHub 链接。 | Pro Ressource vorbereiteten Link mit ID/URL anbieten; kein privater Suchtext im Bericht. / 按资源预填 ID 和链接，不附私人搜索内容。 |
| N25 | P2/P3 · Browser/Code / 浏览器及代码 | OG-Titel vorhanden, kein OG-Bild oder JSON-LD; kein belegtes Indexierungsproblem. / 已有分享标题，暂无分享图及 JSON-LD，但没有确认索引故障。 | Eigenes leichtes Vorschaubild; wahrheitsgetreue Breadcrumbs/CollectionPage optional, ohne Rankingversprechen. / 自制轻量分享图，可选真实面包屑或目录标记，不承诺排名。 |
| N26 | P2 · Offener Prüfpunkt / 待测 | Andere Browser, echte Screenreader und vollständiger Zoomlauf sind noch nicht geprüft; Axe ist keine vollständige Konformitätsprüfung. / 其他浏览器、真实读屏及完整浏览器缩放待测，Axe 不等于完整合规验收。 | Chromium/Firefox/WebKit plus manuelle kritische Abläufe und 400-Prozent-Reflow. / 三类引擎及关键人工流程，补查四倍缩放重排。 |
| N27 | P2 · Offener Prüfpunkt / 待测 | Keine aktuelle gedrosselte Messreihe oder Felddaten für INP; reduzierte Bytes belegen keine reale Geschwindigkeit. / 尚无当前限速测量或现场 INP，文件缩减不直接证明实际速度。 | Wiederholbare kalte/warme Labormessungen; Felddaten nur bei vorhandener belastbarer Basis. / 固定条件冷、热缓存测量，有可靠现场数据再作判断。 |
| N28 | P2/P3 · Architektur / 架构 | Offline-/No-JS-Liste nutzt Buildsnapshot, Details liefern aktuelle D1-Daten; Inhalte können zwischen Veröffentlichungen auseinanderlaufen. / 离线或无 JS 列表来自构建快照，详情来自当前 D1，发布间隔内可能不同步。 | Snapshotversion/Datum offenlegen und Abgleich; Live-HTML-Liste nur bei nachgewiesenem Bedarf und Budget. / 显示快照版本日期并比对；有明确需求和成本依据再做实时列表 HTML。 |

## 3. Quellenvergleich und Gestaltungsrichtung / 参考网站与设计方向

Die Referenzen liefern Muster, keine Vorlage zum vollständigen Kopieren. Die aktuelle ruhige grüne Gestaltung und die kurze Einleitung passen zum Verzeichnis. Die nächste Verbesserung konzentriert sich auf verlässliche Angaben, Lesebreite, konsistente Typografie und schnelle Auswahl.

参考网站提供的是设计方法，不是整站照搬模板。当前克制的绿色视觉及简短介绍适合资源目录；下一步重点是资料可信、阅读宽度、字体一致和快速筛选。

| Referenz / 参考 | Übernahme für diese Website / 适合采用的做法 | Grenze / 使用边界 |
| --- | --- | --- |
| [TOOOLS.design](https://www.toools.design/) | Klar gegliederte Kategorien, kompakte Beschreibungen, sichtbare Kostenarten. / 清晰类别、短描述、明确费用标签。 | Eigene Texte und Struktur; kommerzielle Platzierungen werden nicht übernommen. / 自己编写内容结构，不照搬商业推广排序。 |
| [Minimal Gallery](https://minimal.gallery/) | Zurückhaltende Flächen, konsistente Abstände und leicht erkennbare Auswahl. / 克制底色、一致间距、清楚的筛选状态。 | Ressourcen brauchen lesbare Fakten; große Bildkacheln nur bei echtem Informationswert. / 本站需要可读资料，大图须有实际信息价值。 |
| [All Language Resources](https://www.alllanguageresources.com/all-german-resources/) | Sprachressourcen nach Eigenschaften finden und Preise einordnen. / 按资源属性检索，并解释费用。 | Keine übernommenen Sterne, Ranglisten oder Werbeaussagen. / 不搬运评分、排行榜或宣传说法。 |
| [NN/g: Filter anwenden](https://www.nngroup.com/articles/applying-filters/) | Direktfilter bei schneller Antwort erhalten, Kontext und aktive Auswahl verständlich machen. / 快速响应时保留即时筛选，清楚展示上下文及已选条件。 | Verhalten hängt von Aufgabe und Antwortzeit ab; kein pauschaler zusätzlicher Bestätigungsknopf. / 根据任务及响应速度决定，不机械新增确认按钮。 |
| [GOV.UK: Summary list](https://design-system.service.gov.uk/components/summary-list/) | Detailfakten als verständliche Schlüssel-Wert-Liste strukturieren. / 详情采用清晰的属性与取值列表。 | Die Website behält eigene Farben und Seitendichte. / 保留本站配色及信息密度。 |
| [GOV.UK: Type scale](https://design-system.service.gov.uk/styles/type-scale/) | Relative Schriftgrößen und abgestimmte Zeilen-/Abstandsregeln. / 相对字号与一致的行距、间距规则。 | Größen nicht ohne Prüfung auf dichte Karten übertragen. / 不直接把参考字号套用到密集卡片。 |

### Konkreter Entwurf / 具体界面方案

| Bereich / 区域 | Zielbild / 设计目标 | Abnahme / 验收方式 |
| --- | --- | --- |
| Kopf / 页头 | Marke, Navigation und eine kurze Beschreibung; Statistik optisch nachgeordnet. / 品牌、导航及一句说明，统计视觉弱化。 | Auf 320/375 px bleibt die erste Ergebnisregion früher sichtbar; Hauptaktionen sind vollständig lesbar. / 窄屏更早看到结果，主要操作完整可读。 |
| Suche / 搜索 | Suchfeld als stärkste Aktion; häufige Filter daneben, übrige kontrolliert aufklappbar. / 搜索为主要入口，常用条件紧邻，其余可展开。 | Kein verlorener Wert nach API-Refresh, Zurück oder geändertem Preis. / 刷新、返回及切换费用均不丢值。 |
| Karten / 卡片 | Desktop drei gut lesbare Spalten; wenige Treffer behalten ähnliche Breite und stehen links. / 桌面以三个易读列为基准，少量结果保持相近宽度并靠左。 | Bei 1440 px liegen einzelne Grid-Karten ungefähr bei 320–400 px statt 1.082 px; übrige Breiten separat prüfen. / 1440 宽度单张网格卡约 320–400 像素，其他宽度分别核验。 |
| Karteninhalt / 卡片信息 | Anbieter → Titel → kurze Beschreibung → höchstens zwei sinnvolle Medien → Kosten/Zugang. / 来源、标题、短描述、最多两个有效媒体、费用及访问条件。 | Titel ungekürzt; kostenpflichtige/registrierungspflichtige Funktionen verständlich. / 标题不截断，收费与注册范围清楚。 |
| Niveaus / 等级 | Kompakt „A1–B2“ nur bei lückenloser Folge; Tooltip und Detail behalten genaue Werte/Basis. / 连续等级可写 A1–B2，提示和详情保留精确值及依据。 | Nicht zusammenhängende Werte werden nicht als zusammenhängender Bereich ausgegeben. / 不把不连续等级误写成区间。 |
| Herkunft / 来源 | Ein stabiles Kürzel und lesbarer Anbietername; offizielle Herkunft nur mit Beleg. / 稳定简称和可读来源，官方属性有依据。 | APS und Unterdomains werden richtig gruppiert; verschiedene Angebote bleiben einzeln. / APS 及子域分组正确，不同资源入口仍保留。 |
| Details / 详情 | Kurze Originalinformation, Kostenumfang, Zugang, Medien und zwei getrennte Prüfzeitpunkte. / 简短资源信息、免费范围、访问、媒体及两个独立核验时间。 | Wichtige Fakten direkt sichtbar, auch ohne JS; keine längere Anleitung. / 核心资料直接可见，无 JS 可读，无长篇教程。 |
| Leerzustand / 空结果 | Zeigt verbleibende Bedingungen und gezieltes Entfernen einzelner Filter. / 展示造成空结果的条件，并支持逐项移除。 | Nulltreffer werden nicht automatisch durch andere Ergebnisse ersetzt. / 不擅自用其他结果代替空筛选。 |
| Anbieter / 来源目录 | Alphabetische Übersicht mit Ressourcenanzahl und direktem Filterlink. / 字母序来源列表、资源数和直接筛选入口。 | Keine zusätzliche hohe Einstiegshürde; vom Hauptverzeichnis erreichbar. / 主目录可直接到达，不增加使用门槛。 |

Für Touch-Bedienung sind ungefähr 44 px ein Komfortziel; die WCAG-2.2-AA-Mindestregel von 24 px und ihre Ausnahmen werden getrennt bewertet. Kleine Symbole allein begründen keinen Verstoß. [W3C: Zielgröße](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)

触屏约 44 像素作为舒适目标；WCAG 2.2 AA 的 24 像素最低规则及例外另行核验，不能仅凭图标小就认定不合格。[W3C 点击目标说明](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)

## 4. Ressourcenredaktion und Vollständigkeit / 资料编辑与完整性

„Vollständig“ bedeutet hier: Alle bestehenden Einträge sind überprüft, die zwölf Kategorien besitzen eine nachvollziehbare Abdeckung und Lücken sind dokumentiert. Eine Garantie, sämtliche Ressourcen des Internets zu erfassen, wäre nicht prüfbar. Die Zahl 130 ist Ausgangsbestand, keine Zielvorgabe zum künstlichen Vergrößern.

此处的完整意味着：现有条目全部经过复核，十二个类别的覆盖有明确依据，缺口有记录。无法验证“收录互联网全部资源”的承诺。130 条只是当前基线，不是靠凑数量扩充的目标。

| Prüfbereich / 复核项 | Vorgehen / 方法 | Ergebnis pro Eintrag / 每条产物 |
| --- | --- | --- |
| Original und Zweck / 原站与用途 | Landingpage und tatsächlich verlinkte Funktion unterscheiden; Anbieter prüfen. / 区分介绍页与实际功能，核实发布方。 | Ein Satz mit konkretem Inhalt, belegte Anbieter-ID. / 一句具体内容说明及有依据的来源 ID。 |
| Zugang / 访问 | Infoseite, Lesen, Download, aktive Übungen und Synchronisation getrennt betrachten. / 区分介绍、阅读、下载、训练及同步。 | Passender Zugang und knappe Ausnahme. / 准确访问标签及简短例外。 |
| Kosten / 费用 | Gratisumfang, Plattformunterschiede, Probephase und Abonnement trennen. / 区分免费范围、平台差异、试用及订阅。 | Kurzer Hinweis; unbekannte Details offen kennzeichnen. / 简短费用说明，不明处标待核验。 |
| Niveau / 等级 | Offizielle Angaben belegen; neutrale Dienste nicht künstlich sprachlich einschränken. / 官方标级附证据，不人为限制等级中立的服务。 | Niveau, Basis und gegebenenfalls Leseschwierigkeit. / 等级、依据及必要的阅读难度。 |
| Medien / 媒体 | PDF, Audio, Video, Webseite, App, RSS und Buch nach eindeutigen Regeln. / 按明确规则区分 PDF、音频、视频、网页、应用、RSS 及图书。 | Kontrollierte Medienwerte plus getrennte Themen/Funktionen. / 规范媒体及独立主题、功能。 |
| Sprache / 语言 | Lerninhalt und Übersetzungs-/Oberflächensprache separat definieren. / 分开定义学习内容及翻译、界面语言。 | Nur tatsächlich überprüfte Sprachangaben. / 只写已核实语言。 |
| Aktualität / 时效 | Quellenadresse und Prüfdatum speichern; Botstatus getrennt behandeln. / 留存来源及复核日期，自动访问状态另记。 | Redaktioneller Nachweis und technischer Prüfzeitpunkt. / 内容核验依据与技术探测时间。 |
| Dubletten / 重复 | Identische kanonische URLs prüfen, unabhängige Funktionen desselben Anbieters behalten. / 查规范地址重复，保留同机构不同功能。 | Keine verlorene ID, URL oder bestehender Favorit. / 原 ID、地址及收藏不丢失。 |

### Bereits belegte Beispiele / 已有依据的例子

| Ressource / 资源 | Änderungsvorschlag und Quelle / 建议及来源 |
| --- | --- |
| Goethe-Aussprachetrainer | Training braucht Registrierung; alle Niveaus werden genannt. Skill „发音“ ergänzen und die bisherige offizielle A1–B2-Einschränkung berichtigen. / 训练需注册，官网说明适用所有等级；补发音技能并修正现有官方 A1–B2 限定。[Original](https://www.goethe.de/de/spr/ueb/ast.html) |
| Duden Mentor | Neuer Anzeigename „Duden-Schreibassistent“, früherer Name bleibt Alias; kein Hinweis auf Einstellung des Dienstes. / 更新为当前名称，保留旧名搜索，不将改名误写为停服。[FAQ](https://www.duden.de/haeufige-fragen-zum-duden-schreibassistent) |
| Anki | Bestehendes „部分免费“ mit Desktop/Android kostenlos, offizieller iOS-App kostenpflichtig präzisieren. / 保留部分免费，补充桌面及 Android 免费、官方 iOS 应用付费。[Original](https://apps.ankiweb.net/) |
| Deutsch.info | Offizielle Kursniveaus A1–B2 sind belegt; Medien- und Oberflächensprachen genauer erfassen. / A1–B2 课程有官方依据，进一步核验媒体及界面语言。[Original](https://deutsch.info/?hl=de) |
| Goethe B1 | PDF, Audio und digitales Angebot sichtbar unterscheiden; kostenlose Übungen sind nicht kostenlose Prüfungsanmeldung. / 区分 PDF、音频和数字练习，免费练习不等于免费报名。[Original](https://www.goethe.de/de/spr/prf/ueb/pb1.html) |
| Nachrichtenleicht | Einfachsprachige Nachrichten, Audio/Podcast und RSS als getrennte Eigenschaften; Referenzniveau bleibt editorisch. / 简明新闻、音频播客及 RSS 分开记属性，等级仍为编辑参考。[Original](https://www.nachrichtenleicht.de/erklaerung-100.html) |
| Hochschulkompass | Studiengangsuche als Informationsdienst kategorisieren; Leseschwierigkeit nicht als Zugangsvoraussetzung zeigen. / 专业查询按信息服务分类，不把阅读难度写成使用资格。[Original](https://www.hochschulkompass.de/studium/studiengangsuche.html) |

Diese Stichproben ersetzen nicht die 130-Einträge-Prüfung. DeutschPodcast, Tandem, HelloTalk und Hochschulkompass waren im letzten Netzwerkbericht ungeprüft; eine lesbare Informationsseite in der Recherche beweist nicht, dass jede verlinkte Funktion überall erreichbar ist.

这些抽查不能替代 130 条完整审核。DeutschPodcast、Tandem、HelloTalk、Hochschulkompass 在此前探测报告中未完成核验；研究时能读到介绍页，也不证明全部功能在所有地区均能使用。

### Lückensuche nach Bedarf / 按需要查找缺口

| Bereich / 方向 | Zu untersuchende Lücke / 待查缺口 | Aufnahmebedingung / 收录条件 |
| --- | --- | --- |
| Schreiben / 写作 | Sechs Einträge sind weniger als in anderen Hauptkategorien; konkrete Textprüfung, Referenz und Korpussuche prüfen. / 写作仅六条，少于其他主类；核查文本检查、参考及语料查询覆盖。 | Ein zusätzlicher klarer Nutzen, keine bloße Zählkorrektur. / 有独立价值，不为凑数量。 |
| Aussprache / 发音 | Nur drei Einträge tragen ausdrücklich das Skill-Merkmal; bestehende Angebote zuerst richtig taggen. / 仅三条带发音技能；先修正已有资源标签。 | Offizielle oder nachvollziehbar betreute Quelle; Zugang geklärt. / 官方或来源可追溯，访问条件明确。 |
| Prüfungen / 考试 | Aktuelle offizielle Muster, Medien und Varianten nach Prüfungssystem prüfen. / 核查各考试体系当前官方样题、媒体及版本。 | Richtiger Prüfungstyp und Materialumfang; kein fremder Lernplan. / 标明体系及资料范围，不扩写学习路线。 |
| Lesematerial / 阅读 | Einfache Sprache, freie Bücher, Bibliothekszugang und Nachrichten unterscheiden. / 区分简明语言、免费书籍、图书馆及新闻。 | Lizenz/Zugang und echte Kosten geklärt. / 权利、访问及费用明确。 |
| Deutschlanddienste / 德国服务 | Studium, Arbeit, Verwaltung und Alltag als Themen; mehrsprachige offizielle Angebote priorisieren. / 留学、工作、行政及生活按主题组织，优先官方多语入口。 | Informationsverzeichnis, keine eigene rechtliche Beratung. / 整理信息入口，不自行提供法律结论。 |

## 5. Zeit- und Lieferplan / 时间与交付计划

Die Reihenfolge gilt ab einem späteren Ausführungsbeginn. Fachliche Prüfung kann Wartezeiten auf externe Seiten verursachen; unklare Einträge bleiben ausdrücklich ungeprüft. Jede Woche endet mit einem überprüfbaren Zwischenstand, nicht mit der Behauptung „perfekt“.

以下顺序从后续开始执行时计算。外部网站可能造成核验等待，无法确认的条目明确保留待核验状态。每周交付可验收阶段成果，不以“完美”代替证据。

| Zeitraum / 时间 | Pakete / 工作包 | Aufwand / 工作量 | Liefergegenstand / 交付 | Messbare Abnahme / 可测验收 |
| --- | --- | --- | --- | --- |
| Woche 1 / 第 1 周 | W01 Basis, W02 Live-Filter, W03 Modell / 基线、实时筛选及模型 | 22–32 h / 小时 | Datenvertrag, Filterfix, kompatible Felder / 数据规范、筛选修复、兼容字段 | Neue Werte auswählbar, Auswahl stabil, Schemafälle geprüft / 新值可选、条件稳定、模型边界通过 |
| Woche 2 / 第 2 周 | W04 Redaktion, W05 Entwurfsvergleich / 资源复核与设计比较 | Teil der 34–46 h / 共 34–46 小时的一部分 | Priorisierte Faktenkorrekturen, erste zwei Layoutvarianten / 高优先资料修正、两种布局方案 | Quellen für Kosten/Zugang/Niveau, Einzelkarten begrenzt / 费用、访问、等级有依据，单卡不横向撑满 |
| Woche 3 / 第 3 周 | W04/W05 Abschluss / 完成编辑及视觉 | Rest der 34–46 h / 共 34–46 小时的剩余部分 | Alle 130 geprüft oder mit offenem Grund; konsistente Karte/Details/Mobilseite / 130 条均有复核结果或明确未确认原因，统一卡片、详情及移动界面 | Keine unbelegten offiziellen Angaben, sechs Bildschirmbreiten / 无无依据官方标注，六种宽度核验 |
| Woche 4 / 第 4 周 | W06 Anbieter, W07 Suche, W08 Linkpflege / 来源、搜索、链接维护 | 18–24 h / 小时 | Anbieterindex, definierte Suche, versionierter Prüfreport / 来源目录、明确搜索规则、带版本探测报告 | Counts stimmen, Suchbeispiele passen, D1-Zugänge erfasst / 统计一致、搜索例子正确、D1 新入口纳入 |
| Woche 5 / 第 5 周 | W09 Verwaltung, W10 Favoriten, W11 Auffindbarkeit/Leistung / 管理、收藏、索引及性能 | 18–26 h / 小时 | Sicherungsablauf, lokale Favoritendatei, Metadaten und Laborbericht / 备份流程、本地收藏文件、元数据及性能报告 | Keine private Datenveröffentlichung, kein stilles Überschreiben, wiederholbare Messung / 无隐私公开、无悄然覆盖、测量可重复 |
| Woche 6 / 第 6 周 | W12 Abnahme und Puffer / 综合验收及缓冲 | 12–16 h plus Kalenderpuffer / 小时及日历缓冲 | Browser-/Screenreaderabnahme, aktualisierte Dokumentation, später geprüfte Veröffentlichung / 多浏览器与读屏验收、文档、后续验证后发布 | Kriterien unten erfüllt, verbleibende Grenzen genannt / 满足下述指标，说明剩余局限 |

Gesamt: 114–154 Stunden. Anbieterübersicht, Favoritensicherung und zusätzliche Share-Metadaten sind eigenständige Pakete und können bei höherem Redaktionsaufwand nach hinten rücken. Die erste sinnvolle Veröffentlichung nach Umsetzung enthält bereits W02, die Kernteile von W03/W04 und W05; die gesamte Wartungsrunde muss nicht vorher abgeschlossen sein.

总计 114–154 小时。来源目录、收藏备份及额外分享元数据为独立工作包，若资源核验耗时增加，可相应后移。后续实施时，W02、W03/W04 核心部分及 W05 完成即可形成有价值的首批发布，不必等全部维护工作结束。

## 6. Konkrete Arbeitspakete / 具体工作包

### W01 · Ausgangslage und Regeln / 基线与规则 · 4–6 h

**Files:** `docs/resource-directory-review.md`, `docs/resource-editorial-policy.md` (neu / 新建), `web/data/resources.json` (nur Analyse / 只分析).

- [ ] Aktuelle öffentliche Daten gegen Buildsnapshot nach ID und Inhalt vergleichen, nicht nur Anzahl. / 按 ID 和内容比对当前公开数据与快照，不只比较条数。
- [ ] Medien, Niveau, Zugang, Quellenbeleg und Prüfdatum knapp definieren. / 定义媒体、等级、访问、依据和核验时间。
- [ ] Alle offenen N-Befunde mit verantwortlichem W-Paket und Prüfschritt verknüpfen. / 每个 N 编号关联工作包及验收步骤。
- [ ] Historischen Bericht ergänzen; alte Resultate erhalten und klar datieren. / 增补历史记录，保留旧结果并标明日期。

**Acceptance:** Eine unabhängige Person kann Kosten, Zugang und Niveau gleich interpretieren; keine Produktionsänderung in diesem Paket. / 第三方可一致理解费用、访问及等级，本包不改生产。

### W02 · Live-Filter und konsistente Zähler / 实时筛选及统计 · 8–12 h

**Files:** `web/src/client/catalog.ts`, `web/src/components/ResourceFilters.astro`, `web/src/pages/sources.astro`, `web/src/lib/catalog-facets.mjs` (nur falls sinnvoll / 有必要再新建), `web/tests/directory.test.mjs`, `web/e2e/public_site.py`. **Dependency:** W01.

- [ ] Reproduktionsfall mit neuem Skill/Format in einer abgefangenen API-Antwort als Browserprüfung festhalten. / 用拦截 API 响应的新技能、形式固定复现用例。
- [ ] Dropdowns nach erfolgreichem Refresh aus den aktuellen Einträgen bilden, aktuelle Auswahl und Fokus erhalten. / 成功刷新后用当前条目生成选项，保留值和焦点。
- [ ] Nicht mehr verfügbare URL-Werte sichtbar kennzeichnen, nicht beim nächsten Wechsel verwerfen. / 对已不存在的地址条件明确提示，不在后续操作中丢弃。
- [ ] Abhängige Trefferzahlen mit „andere Filter gelten, eigener Filter wird ausgeklammert“ berechnen; Nullwerte verständlich behandeln. / 计算各选项数量时保留其他条件、排除自身条件；清楚处理零值。
- [ ] Ressourcen-, Kategorie- und Websitezahlen aus derselben Datenrevision aktualisieren. / 同一数据版更新资源、分类和网站统计。

**Acceptance:** Der simulierte neue Skill bleibt nach Preiswechsel erhalten; neue Formate sind auswählbar; der Quellenzähler zeigt bei 131/111 auch 131/111. Filterrückkehr und manuelles Zuklappen bleiben korrekt. / 新技能在换费用后保留，新形式可选，131 条及 111 站统计一致，详情返回及人工折叠不回退。

### W03 · Kompatibles Datenmodell / 兼容数据模型 · 10–14 h

**Files:** `web/src/lib/catalog-schema.mjs`, `web/src/types.ts`, `web/scripts/validate-catalog.mjs`, `web/scripts/prepare-public-snapshot.mjs`, `web/src/client/admin.ts`, `web/tests/schema.test.mjs`. JSON-/D1-Inhalte erst in W04 ändern. / JSON 和 D1 内容留到 W04 修订。 **Dependency:** W01.

- [ ] Kleinste nötige optionale Felder definieren: Anbieter-ID, Medien, Kostenumfang, Zugangshinweis, Netzwerkdatum und Quellenbelege. / 定义必要的可选字段：来源 ID、媒体、费用范围、访问说明、链接探测日期及依据。
- [ ] `levels` für Lernniveau erhalten; niveauunabhängige Dienste und redaktionelle Leseschwierigkeit eindeutig ausdrücken. / 保留学习等级，明确表达等级中立服务及编辑阅读难度。
- [ ] Inhaltssprache und Hilfs-/Oberflächensprache trennen; vorerst nur geprüfte Werte aufnehmen. / 分开内容语言及辅助、界面语言，只收已核实值。
- [ ] Ungültige Kalendertage und Leerwerte zurückweisen; Wiederholungen normieren, Altdatenfehler in einer Liste melden. / 拒绝不存在的日期和空值，规范重复，集中报告旧数据问题。
- [ ] Öffentliches DTO vom Verwaltungs-/Nachweisumfang unterscheiden, damit der kleine Browserfallback klein bleibt. / 公开传输对象与管理依据分开，保持浏览器回退文件精简。

**Acceptance:** Alte 207 Datensätze bleiben lesbar oder besitzen eine konkrete reversible Migration; alte IDs, URLs und Auditdaten bleiben erhalten. Keine allgemeine Schema-/Framework-Neuentwicklung. / 原 207 条数据保持可读，或有明确可逆迁移；保留 ID、地址及审计，不重造通用模型框架。

### W04 · Vollständige Redaktion / 全量编辑复核 · 24–32 h

**Files:** `web/data/resources.json`, `docs/resource-editorial-policy.md`, `web/scripts/prepare-directory-update.mjs`, `web/tests/directory-update.test.mjs`, `docs/resource-directory-review.md`. Quellenmatrix als versionierter Bericht ohne private Daten. / 来源矩阵作为带版本的公开安全报告。 **Dependency:** W03.

- [ ] Zuerst N03/N05/N06/N09 prüfen; kostenlose Funktion und zugängliche Landingpage unterscheiden. / 先查 N03/N05/N06/N09，区分免费功能与可读介绍。
- [ ] Alle 130 öffentlichen Einträge einzeln bearbeiten und Beleg, Ergebnis, offene Einschränkung protokollieren. / 逐条复核 130 条，记录依据、结果和未确认限制。
- [ ] Altnamen als Alias bewahren; Medien und Themen kontrolliert überführen, ohne unabhängige Eingangspunkte zu löschen. / 旧名保留为别名，规范媒体主题，不删除独立入口。
- [ ] Offizielle Niveaukennzeichnung ohne offiziellen Beleg entfernen oder berichtigen; neutrale Dienste sinnvoll auffindbar halten. / 无官方依据的标级纠正或改为参考，中立服务可合理查找。
- [ ] Änderungen mit aktueller D1-Revision abgleichen und Konflikte sichtbar melden; keine Neuinitialisierung des Katalogs. / 按当前 D1 版本更新，明确冲突，不重置资源库。
- [ ] Abdeckung der zwölf Kategorien prüfen; Kandidaten mit unabhängigem Mehrwert als eigene kleine Ergänzung behandeln. / 核查十二类覆盖，独立有价值的候选作为单独小批补充。

**Acceptance:** 130 Prüfresultate, jeder neue Fakt mit Originalquelle; ungeklärte Fälle bleiben kenntlich. Neue Einträge haben gültige ID, Quelle, Zugang, Kosten und mindestens eine konkrete Medienart. / 130 条都有检查结果，新事实有原站来源；未明处明确标注；新增条目具备有效 ID、来源、访问、费用及具体媒体。

### W05 · Visuelle Konsistenz und Mobilansicht / 视觉一致及移动界面 · 10–14 h

**Files:** `web/public/directory.css`, `web/src/lib/resource-directory.mjs`, `web/src/components/ResourceCard.astro`, `web/src/components/ResourceDirectory.astro`, `web/src/layouts/BaseLayout.astro`. **Dependency:** Regeln aus W01/W03, abschließende Daten aus W04. / 依赖 W01/W03 规范及 W04 最终数据。

- [ ] Zwei leichte Varianten anhand derselben langen/kurzen Quellen- und Titelbeispiele vergleichen. / 用同一组长短来源及标题比较两种轻量布局。
- [ ] Grid mit 0/1/2/3/24 Ergebnissen prüfen; wenige Karten begrenzen, vollständige Titel und Fußzeilen erhalten. / 检查零、一、二、三、二十四结果，限制少卡宽度，保留标题和底栏。
- [ ] 320-px-Kopf/Filterblock kompakter setzen; Favorit, Preis und Zugang dürfen nicht verschwinden. / 紧凑化 320 窄屏页头及筛选，不隐藏收藏、费用及访问。
- [ ] Einheitliche Schrift-, Abstands-, Fokus- und Hoverregeln nutzen; Bewegung bei reduzierter Animation begrenzen. / 统一字号、间距、焦点和悬停，尊重减少动画设置。
- [ ] Medienanzeige nach Bedeutung auswählen; keine dekorative Gleichhöhe durch Abschneiden wichtiger Angaben. / 按信息意义展示媒体，不为等高裁掉关键资料。
- [ ] Ressourcenbezogenen Feedbacklink mit öffentlicher ID/URL vorbereiten; private Suchbedingungen nicht anhängen. / 准备按资源的反馈链接，只带公开 ID 和地址，不附私人筛选。

**Acceptance:** Screenshots mit 320/375/768/1024/1440/1920 px, keine Seitenüberläufe, Einzelkarte ohne extreme Dehnung. 320-px-Erstkarte möglichst unter y=550, sofern Lesbarkeit/Zoom erhalten bleibt; dieser Gestaltungswert ist kein WCAG-Grenzwert. / 六种宽度截图无页面溢出，单卡不极度拉伸；在不损害可读和缩放前提下争取窄屏首卡早于 550 像素，此项为设计目标而非 WCAG 标准。

### W06 · Anbieterübersicht / 来源机构目录 · 6–8 h

**Files:** `web/src/pages/providers.astro` (neu / 新建), `web/src/pages/sources.astro`, `web/src/lib/resource-directory.mjs`, `web/src/client/catalog.ts`, `web/src/components/ResourceFilters.astro`, `web/worker/index.ts` (Sitemap / 站点地图). **Dependency:** W02/W03/W04.

- [ ] Anbieter-ID und Anzeigezeichen pflegen; Mehrfachhosts nicht mit pauschalem Domainabschneiden gruppieren. / 维护来源 ID 和简称，不用简单截域名合并多主机。
- [ ] Alphabetische Übersicht mit Anzahl und Filterlink bauen; vorhandene Kurs-/Prüfungsentrances als einzelne Ressourcen erhalten. / 来源按字母排序，附数量及筛选，保留不同课程和考试入口。
- [ ] Quellenfilter, aktive Bedingung, Rückkehrlink und Statistik einheitlich einbinden. / 统一来源筛选、已选条件、返回链接及统计。

**Acceptance:** APS korrekt erkennbar; Goethe/DW-Eingänge unter nachvollziehbarem Anbieter gruppiert; unbekannter Anbieter hat lesbare Textfallbacks. / APS 正确辨识，歌德及 DW 入口合理归组，未知来源有可读文字回退。

### W07 · Suche und leere Ergebnisse / 搜索及空结果 · 4–6 h

**Files:** `web/src/lib/resource-directory.mjs`, `web/src/client/catalog.ts`, `web/tests/directory.test.mjs`, `web/e2e/public_site.py`. **Dependency:** W02/W03.

- [ ] Kleinen realistischen Suchkorpus mit Namen, alten Namen, Umlauten und chinesischen Kombinationen erstellen. / 建立资源名、旧名、变音字符及中文组合的真实搜索样本。
- [ ] Deutsche Normalisierung bewusst festlegen: `ö`/`oe` und häufige `o`-Eingaben prüfen; Mehrdeutigkeiten begrenzen. / 明确定义德语字符映射，兼顾常见输入并避免过度匹配。
- [ ] „德福考试“ und Kostenbegriffe gezielt behandeln; keine allgemeine KI- oder Fuzzy-Suche einführen. / 定向处理德福考试及费用词，不引入通用 AI 或模糊搜索。
- [ ] Im Leerzustand passenden Filterabbau anbieten, Query und Tastaturfokus erhalten. / 空结果提供对应条件移除，保留搜索词和焦点。

**Acceptance:** Bestehende Treffer für 德福/字典/播客 erhalten; neue vereinbarte Beispiele liefern passende Ressourcen. Keine erfundenen Beliebtheits- oder Qualitätsränge. / 保留德福、字典、播客原有结果，新约定例子正确；不虚构热度和评分。

### W08 · Dauerhafte Linkpflege / 可持续链接维护 · 8–10 h

**Files:** `web/scripts/check-resource-links.mjs`, `web/tests/link-check.test.mjs`, `.github/workflows/link-check.yml`, `docs/resource-editorial-policy.md`. **Dependency:** W03.

- [ ] Optionalen Live-Katalogmodus mit Schema-/Größenprüfung ergänzen; Repositorymodus behalten und Divergenz melden. / 可增加实时目录模式并校验格式和体积，保留仓库模式并提示差异。
- [ ] Fehlergründe und endgültigen Redirect nachvollziehbar speichern; private Zieladressen und unsichere Redirects weiterhin sperren. / 记录失败原因及最终跳转，继续阻止私人地址及危险跳转。
- [ ] Wiederholung nur für temporäre Fehler begrenzen; 429/403 als Einschränkung behandeln und Quellseiten schonend prüfen. / 对临时错误有限重试，429/403 标受限，控制请求频率。
- [ ] Bericht und Zusammenfassung als CI-Artefakt behalten, nachvollziehbares Daten-/Prüfdatum eintragen. / CI 留存报告和摘要，记录数据版及检查时间。
- [ ] Korrekturen aus Berichten einzeln redaktionell prüfen; kein automatisches Archivieren und kein Überschreiben des Inhaltsprüfdatums. / 报告修订逐项编辑核实，不自动归档，不覆盖内容核验日期。

**Acceptance:** Ein nur in Live-D1 vorhandener öffentlicher Eintrag wird geprüft; Timeout, Sperre und 404 bleiben unterscheidbar. Remote-Ausführung erst als aktiv bezeichnen, wenn ein tatsächlicher Lauf nachgewiesen ist. / 仅存在实时 D1 的公开条目也被检查，超时、限制和 404 可区分；有真实运行证据才称远端已启用。

### W09 · Verwaltung, Import und Sicherung / 管理、导入及备份 · 8–12 h

**Files:** `web/src/pages/admin.astro`, `web/src/client/admin.ts`, `web/worker/index.ts`, `web/tests/worker.test.mjs`, `docs/operations.md` (neu / 新建). **Dependency:** W03.

- [ ] Historisches Tutorialfeld aus neuer Pflichtmaske nehmen; bestehende Werte beim Bearbeiten nicht leeren. / 新条目不再必填教程，编辑旧条目不清空原值。
- [ ] Kontrollierte Medien und Hinweise im Formular verständlich darstellen; Servervalidierung bleibt maßgeblich. / 表单使用明确媒体及说明，服务器校验为最终依据。
- [ ] Importvorschau um ID-/URL-Konflikte, betroffene Revisionen und bereits gespeicherten Fortschritt ergänzen. / 导入预览展示 ID、链接冲突、受影响版本及已保存进度。
- [ ] Öffentlichen Export klar als Austausch kennzeichnen; vollständigen geschützten Export mit Revisionen/Audit getrennt planen. / 公开导出标为交换文件，完整版本审计备份另行受保护处理。
- [ ] Vorhandene D1-Recovery-Möglichkeiten prüfen und Wiederherstellung ausschließlich in lokaler Testdatenbank üben. / 核查 D1 恢复能力，只在本地测试库演练。

**Acceptance:** Historische Daten unverändert, Konfliktimport ohne stilles Überschreiben, sichere Backup-Datei nicht im öffentlichen Repo oder API. Vorhandene Access-Sperre bleibt erhalten; kein Admin-Login/DNS-Umbau. / 历史数据保留，冲突不悄然覆盖，完整备份不进公开仓库和接口，保留既有访问保护，不改登录与 DNS。

Cloudflare dokumentiert Time Travel und Datenexport; verfügbare Aufbewahrung hängt vom Plan und Datenbanktyp ab. Für dieses Projekt wird kein konkreter Wiederherstellungszeitraum behauptet, bevor die Konfiguration geprüft ist. [Time Travel](https://developers.cloudflare.com/d1/reference/time-travel/), [Export](https://developers.cloudflare.com/d1/best-practices/import-export-data/)

Cloudflare 提供 Time Travel 和数据导出说明，保留时间取决于套餐及数据库类型。本项目尚未核查对应配置，不预先宣称具体恢复期限。[时间恢复](https://developers.cloudflare.com/d1/reference/time-travel/)、[数据导出](https://developers.cloudflare.com/d1/best-practices/import-export-data/)

### W10 · Lokale Favoritensicherung / 本地收藏备份 · 4–6 h

**Files:** `web/src/client/favorites.ts`, `web/src/pages/favorites.astro`, `web/src/pages/privacy.astro`, `web/tests/favorites.test.mjs` (neu / 新建). **Dependency:** W03; unabhängig vom Admin. / 与后台独立。

- [ ] Versionsformat für Favoriten-ID-Datei definieren; private Aufgaben und Ziele nicht standardmäßig exportieren. / 定义带版本收藏 ID 文件，默认不导出私人任务和目标。
- [ ] Export und Import mit Vorschau, Größenprüfung und Zusammenführung ergänzen. / 增加导出、预览、体积校验及合并导入。
- [ ] Unbekannte/archivierte IDs in der Vorschau erhalten und erklären; bestehenden Browserdatensatz nicht resetten. / 对未知和归档 ID 明确说明，不重置浏览器原记录。
- [ ] Speicherfehler klar melden und keine erfolgreiche Speicherung vortäuschen. / 存储错误明确反馈，不假报保存成功。

**Acceptance:** Export/Import erhält dieselben gültigen Favoriten, verändert alte Ziele/Aufgaben nicht und benötigt keinen Server oder Account. / 往返导出导入保留有效收藏，旧目标及任务不变，无需账号或服务器。

### W11 · Auffindbarkeit und gemessene Leistung / 索引、分享及实测性能 · 6–8 h

**Files:** `web/src/layouts/BaseLayout.astro`, `web/src/lib/detail-document.mjs`, `web/public/robots.txt`, `web/worker/index.ts`, `web/public/_headers`, `web/public/og-directory.png` (neu, eigenes Bild / 新建自制图片), `web/e2e/public_site.py`. **Dependency:** W04/W05; Anbieterpfade aus W06 falls umgesetzt. / 如做来源目录则接 W06。

- [ ] Sitemap, Canonical, Titel und sichtbare Detailinhalte nach Datenkorrekturen erneut vergleichen. / 资料修正后再次比对站点地图、规范地址、标题和实际详情。
- [ ] Eigenes passendes Share-Bild erstellen; keine fremden Logos als unbelegte Kopie. / 制作合适分享图，不无依据复制外部标志。
- [ ] Kleine korrekte strukturierte Daten nur dort ergänzen, wo sichtbarer Inhalt und Schema passen. / 可见内容和模式符合时再加少量结构化数据。
- [ ] Buildsnapshot mit Version/Datum kennzeichnen und API-Abweichungen prüfen; Live-Listen-HTML erst nach begründeter Architekturentscheidung ergänzen. / 快照注明版本日期并检查接口差异，有明确架构依据再补实时列表 HTML。
- [ ] Kalte/warme Messungen mit dokumentierter Netzwerk-/CPU-Drosselung mehrfach durchführen; nachweisbare Engpässe priorisieren. / 固定网络及 CPU 限速，重复冷、热缓存测量，按真实瓶颈优化。
- [ ] CSP zunächst anhand aller vorhandenen Ressourcen prüfen; report-only lokal/Preview erproben, bevor eine Policy durchgesetzt wird. / 按现有资源评估 CSP，先在本地或预览用报告模式验证，再考虑强制。

**Acceptance:** Kein Metadatenwiderspruch, keine blockierten notwendigen Skripte, Browserfehlerfreiheit; Laborbericht benennt Messbedingungen und Verteilung statt nur Bestwert. / 元数据一致、必要脚本未被阻断、无浏览器错误；性能报告写条件及分布，不只写最好成绩。

Feldziele sind LCP ≤ 2,5 s, INP ≤ 200 ms und CLS ≤ 0,1 am 75. Perzentil. Diese Ziele stammen aus web.dev; Laborwerte und Dateigrößen erfüllen allein keinen Feldnachweis. [Web Vitals](https://web.dev/articles/vitals)

真实用户目标为第 75 百分位 LCP 不超过 2.5 秒、INP 不超过 200 毫秒、CLS 不超过 0.1。指标依据 web.dev；实验测量及文件大小不能单独证明真实用户达标。[核心体验指标](https://web.dev/articles/vitals)

### W12 · Gesamtprüfung und spätere Veröffentlichung / 综合验收及后续发布 · 12–16 h

**Files:** `web/e2e/public_site.py`, `.github/workflows/web-check.yml`, `docs/resource-directory-review.md`, `README.md`; zusätzliche Browserprüfung nur mit minimal nötiger Umgebung. / 补充浏览器测试只增必要环境。 **Dependency:** Alle tatsächlich umgesetzten Pakete. / 所有实际实施的工作包。

- [ ] `npm run verify` und Publikationsprüfung durchführen; dokumentierte bestehende Tests erhalten. / 运行项目验证及发布检查，保留已有测试。
- [ ] Chromium, Firefox und WebKit auf Such-, Filter-, Favoriten-, Detail- und Rückkehrabläufen prüfen; nicht verfügbare Engine offen nennen. / 三类引擎检查搜索、筛选、收藏、详情及返回，缺失引擎如实说明。
- [ ] Tastatur und Screenreader für Ergebnisstatus, Fokus, Filterentfernen und letzte Favoritenkarte testen. / 键盘及读屏核验结果播报、焦点、移除筛选和最后收藏。
- [ ] 200-Prozent-Text sowie echte Browservergrößerung bis 400 Prozent/320-CSS-px-Reflow getrennt prüfen. / 分开检查两倍字号和真实浏览器四倍缩放、320 CSS 像素重排。
- [ ] Fehlerfälle: API offline/langsam, beschädigte Favoriten, unbekannte URL-Filter, verschwundene Ressource, Admin-Konflikt, eingeschränkter Quelllink. / 检查接口离线、缓慢、收藏损坏、未知筛选、资源不再公开、编辑冲突及源站受限。
- [ ] Website nach erfolgreicher Abnahme über bestehenden Deploy veröffentlichen und live zurücklesen; Remote-CI-Git-Synchronisierung bleibt eigener Vorgang. / 验收通过后按既有部署发布并线上回读，远端 CI 的 Git 同步单独处理。

**Acceptance:** Ausführungsbericht nennt genau umgesetzte Pakete, Liveversion, Datenänderungen, Prüfungen und offene Grenzen. Die Planungskästchen werden erst nach tatsächlicher Prüfung abgehakt. / 实施记录明确完成包、线上版本、数据变化、验证及剩余限制，只在实际验证后勾选任务。

## 7. Abschlusskriterien / 完成标准

| Bereich / 项目 | Prüffähiger Zielzustand / 可验证目标 |
| --- | --- |
| Daten / 资料 | 130 aktuelle Prüfresultate; Preis/Zugang/Niveau quellenbasiert oder als ungeklärt markiert. / 130 条有当前复核结果，费用、访问、等级有依据或明确待核验。 |
| Filter / 筛选 | Neue API-Werte sichtbar, aktive Auswahl stabil, abhängige Counts richtig. / 新 API 值可选，已选条件稳定，条件数量正确。 |
| Oberfläche / 界面 | 0/1/2/24 Treffer und sechs Breiten geprüft; Titel/Quellen nicht unlesbar gekürzt. / 验证多种结果数与六种宽度，标题及来源不被裁成不可读。 |
| Mobil / 移动 | Kompakte Liste, zugängliche Kategorieauswahl, vollständige Aktionen bei Textvergrößerung. / 紧凑列表、可用分类、文字放大后操作完整。 |
| Favoriten / 收藏 | Bestehende private Felder erhalten, lokale Sicherung nachvollziehbar, Fehlermeldungen ehrlich. / 保留旧私人字段，备份清晰，错误反馈真实。 |
| Pflege / 维护 | Repo-/Live-Abweichung erkennbar, Prüfgrund und Datum getrennt, keine Auto-Löschung. / 仓库与实时差异可见，原因及时间独立，无自动删除。 |
| Index / 索引 | Aktuelle kanonische öffentliche URLs, korrekte 404, direkte Detailinformationen. / 当前公开规范地址、正确 404、详情直接可读。 |
| Sicherheit / 安全 | Admin weiter geschützt, Exporte ohne unbeabsichtigte Öffentlichkeit, keine Secrets/privaten Pfade. / 后台继续受保护，备份不误公开，无密钥及私人路径。 |
| Prüfqualität / 验证质量 | Automatisierung plus dokumentierte manuelle Prüfungen; keine pauschale WCAG-/Performancegarantie. / 自动加人工验证，无无依据的合规和性能保证。 |

## 8. Zurückgestellte Ideen / 暂后事项

- Dunkelmodus nur bei erkennbarem Bedarf; Farben und Kontrast würden einen eigenen Prüfaufwand benötigen. / 深色模式有明确需求再做，须单独核验色彩及对比。
- Keine große Bildhero-Fläche, kein Karussell und kein endloses Scrollen als Standard. Die Such- und Ressourcenfläche hat Vorrang. / 搜索和资源优先，不默认加大图首屏、轮播或无限滚动。
- Keine neuen Bewertungen oder „beliebtesten“ Ressourcen ohne nachvollziehbare Datenbasis. / 无依据不加评分及热门排行。
- Keine Account-Synchronisierung, Chatbot-Beratung oder Lernpläne; lokale Favoritensicherung deckt den derzeitigen Bedarf. / 不新增账号同步、聊天建议和学习计划，本地收藏备份满足当前需求。
- Keine externe Favicon-Abfrage pro Karte. Anbieterzeichen bleiben lokal und robust. / 不为每张卡片外发图标请求，来源标识使用稳定本地内容。

## 9. Ergänzende Fachquellen und Grenzen / 专业来源及局限

| Quelle / 来源 | Anwendung / 用途 |
| --- | --- |
| [Google: JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) | Direktes HTML und korrekte Statuswerte erhalten. / 保留直接 HTML 和正确响应状态。 |
| [Google: Strukturierte Daten](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) | Nur echte sichtbare Fakten markieren; keine Garantie auf besondere Suchdarstellung. / 只标实际可见事实，不保证特殊搜索展示。 |
| [W3C: Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) | 400-Prozent-Zoom und 320-CSS-px-Breite nicht mit bloßem Screenshot verwechseln. / 不将单纯截图等同真实四倍缩放和重排验收。 |
| [W3C: Statusmeldungen](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) | Neue Treffer- und Favoritenstatus verständlich ankündigen. / 新结果及收藏状态可读屏识别。 |
| [MDN: CSP](https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/CSP) | Sicherheitsrichtlinie mit bestehenden Skripten abgleichen. / 对照现有脚本评估安全策略。 |
| [Cloudflare: Header](https://developers.cloudflare.com/workers/static-assets/headers/) | Statische und Worker-Antworten getrennt prüfen. / 静态及 Worker 响应分别核验。 |
| [Goethe: GER](https://www.goethe.de/ins/de/de/uun/dln/ger.html) | Sprachkompetenzniveau als Sprachangabe verwenden; die Einordnung von Diensten ist eine eigene redaktionelle Entscheidung. / 语言等级用来表达语言能力，服务如何归类属于另行编辑决定。 |

Aktuell wurde kein vollständiger neuer Browser-/Axe-/Leistungslauf durchgeführt, da diese Runde Planung ist. Die genannten neuen Fehler wurden gezielt reproduziert; alle externen 130 Quellen wurden noch nicht einzeln neu gelesen. Regionale Nutzbarkeit, aktuelle vollständige Preise, echte Screenreader-Erfahrung und öffentliche Suchindexierung bleiben gesonderte Prüfaufgaben. Bestätigte Befunde und vorgeschlagene Gestaltung sind im Plan ausdrücklich unterschieden.

本轮为规划，没有重新做完整浏览器、Axe 和性能回归。列出的新问题已定向复现，但未重新逐项阅读全文核验全部 130 个原站。地区可用性、完整实时价格、真实读屏体验和搜索引擎实际收录仍需单独检查。计划明确区分已确认问题与设计建议。

**Delivery status:** Analyse und neuer Plan fertig; Produktionscode, öffentliche Katalogdaten und Live-Website wurden in dieser Runde nicht geändert. / 分析及新计划已完成，本轮未改生产代码、公开目录数据和线上网站。
