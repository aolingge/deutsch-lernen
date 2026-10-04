# 德语学习导航网站

网站源代码位于 `web/`，面向中文学习者公开整理德语课程、考试、新闻和工具入口。

## 本地运行

```powershell
Set-Location web
npm ci --ignore-scripts
npm run dev
```

打开 `http://localhost:4321/`。生产检查使用 `npm run verify`，它会依次执行目录校验、Astro 类型检查、Node 测试和 Astro 构建。

## 内容规则

- `data/categories.json` 是中文主分类。
- `data/resources.json` 是首批可公开资源目录。
- 每个条目必须有中文用途、原始链接、来源、等级依据和核验状态。
- 同一 canonical URL 不能重复收录；同一来源的不同使用方式应在说明中表达，不能靠复制条目增加数量。
- `restricted` 表示自动检查受限，不等于失效。

## 线上边界

- 公开目录由静态页面和 `GET /api/public-catalog` 提供。
- `web/migrations/0001_catalog.sql` 到 `0005_live_catalog_and_atomic_visits.sql` 为 D1 资源、新闻、访问量、在线目录和审计迁移。
- `POST /api/visit` 在 D1 配置后才统计服务端浏览量；未配置时返回 503，不展示伪造数字。
- 管理 API 使用 Cloudflare Access JWT、issuer/audience/email 校验和 `ADMIN_EMAILS` 白名单；未配置或未验证身份时默认返回 403。不要把 `admin-auth-not-configured` 改成匿名写入。
- `catalog_entries` 保存在线目录草稿与发布状态，`catalog_audit` 留存版本审计；公开 API 只返回已发布条目。
- 访问量通过 D1 唯一事件与 trigger 原子汇总，并使用 `VISIT_LIMIT` 限制请求频率。
- Worker 与静态 Assets 同域提供；`/api/*`、`/resource/*` 和 `/sitemap.xml` 由 Worker 优先路由。

## Verzeichnis und Wartung / 目录与维护

Der Browser erhält einen automatisch erzeugten Fallback mit veröffentlichten externen Ressourcen. Historische Anleitungen bleiben im Originalbestand erhalten und werden nicht in dieses Browserpaket aufgenommen. `predev`, `precheck` und `prebuild` erzeugen `web/data/public-snapshot.json`; die Datei wird nicht eingecheckt.

浏览器使用自动生成的已发布外部资源快照作为回退。历史学习指南继续保留在原始资源库，但不打包进此浏览器快照。`predev`、`precheck` 和 `prebuild` 生成 `web/data/public-snapshot.json`，该文件不提交到 Git。

Die Detailseite wird vom Worker aus dem aktuellen D1-Eintrag als vollständiges HTML erzeugt. Titel, Beschreibung, Canonical-URL und Freigabestatus folgen diesem Eintrag. Ein ungültiger Datensatz wird beim Lesen ausgelassen und anhand seiner ID protokolliert; andere gültige Ressourcen bleiben verfügbar.

Worker 使用当前 D1 条目生成完整详情 HTML，标题、描述、规范链接及发布状态都以该条目为准。读取时遇到格式不合法的记录，会跳过该条并仅记录其 ID；其他有效资源仍可使用。

Statische Antworten erhalten Sicherheitsheader über `web/public/_headers`, dynamische HTML-Antworten im Worker. Nur Dateien unter dem versionierten Pfad `/_astro/` erhalten einen unveränderlichen Langzeitcache. Cloudflare beschreibt diese Trennung in der [Header-Dokumentation](https://developers.cloudflare.com/workers/static-assets/headers/).

静态响应通过 `web/public/_headers` 设置安全响应头，动态 HTML 则由 Worker 设置。只有 `/_astro/` 下带版本指纹的文件使用长期不可变缓存。此区分依据 Cloudflare 的[响应头文档](https://developers.cloudflare.com/workers/static-assets/headers/)。

`node scripts/check-resource-links.mjs` prüft die veröffentlichten externen URLs aus `web/data/resources.json`. Der bestehende wöchentliche Link-Workflow führt die Prüfung zusätzlich zu Markdown aus. Der Bericht liegt unter `.wrangler/resource-links.json`; 404/410 lassen den Check fehlschlagen, 401/403/429 werden als Automatisierungsbeschränkung getrennt erfasst. Unklare Ergebnisse erfordern Nachprüfung. Das Werkzeug verändert weder D1 noch redaktionelle Prüfdatumsfelder.

`node scripts/check-resource-links.mjs` 检查 `web/data/resources.json` 中已发布的外部链接。现有每周链接工作流在检查 Markdown 外，也执行此检查。报告位于 `.wrangler/resource-links.json`；404/410 会导致检查失败，401/403/429 单独归为自动访问受限，无法确定的结果需要复核。工具不会修改 D1 或编辑核验日期。
