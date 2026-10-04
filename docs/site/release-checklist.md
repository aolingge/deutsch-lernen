# Veröffentlichung prüfen / 网站发布检查

- [ ] Arbeitsstand und Ziel prüfen; nur Änderungen aus dem aktuellen Auftrag aufnehmen.
  检查当前工作区和发布目标，仅纳入本次任务的改动。
- [ ] Unter `web/` muss `npm run verify` bestehen: Verzeichnis, Typen, Tests und Build.
  在 `web/` 下执行 `npm run verify`，目录、类型、测试和构建都须通过。
- [ ] `tools/publication-check.ps1` und `git diff --check` bestehen.
  `tools/publication-check.ps1` 和 `git diff --check` 须通过。
- [ ] Worker, D1-Bindung und Website-Adresse in `wrangler.jsonc` entsprechen dem bestehenden Ziel; keine Geheimnisse in Dateien schreiben.
  `wrangler.jsonc` 的 Worker、D1 绑定和网站地址应与现有目标一致，不把凭据写入文件。
- [ ] Nur bei einer notwendigen Datenbankänderung: Backup, gezielte Migration und Rücklesen der Ergebnisse. Historie und manuelle Änderungen bewahren.
  仅在需要修改数据库时执行备份、必要迁移并回读结果，保留历史和人工修改。
- [ ] Öffentliche API-IDs stimmen mit dem erwarteten Bestand überein; archivierte Anleitungen werden nicht veröffentlicht.
  公开 API 的资源 ID 与预期目录一致，归档学习指南不公开展示。
- [ ] Browserabläufe prüfen: Suche, kombinierte Filter, Rückkehr von Details, Tastaturfokus, Favoriten und API-Ausfall.
  检查搜索、组合筛选、详情返回、键盘焦点、收藏和 API 故障时的回退流程。
- [ ] Mobile, Tablet und Desktop visuell prüfen; kein horizontaler Überlauf. Automatisierte Barrierefreiheit und manuelle Tastaturprüfung ergänzen einander.
  检查手机、平板和桌面视觉，确保无横向溢出；自动无障碍检查配合人工键盘流程检查。
- [ ] Detailinhalt ohne JavaScript, Canonical, Sitemap, robots.txt, Header und Asset-Cache prüfen. Anonymer Verwaltungszugriff bleibt 403; fehlende Ressourcen liefern 404.
  检查无 JavaScript 详情、规范链接、站点地图、robots.txt、响应头和静态缓存。匿名管理访问须为 403，缺失资源须为 404。
- [ ] Mit der bestehenden sicheren Authentifizierung veröffentlichen und dieselben öffentlichen Checks nach der Veröffentlichung wiederholen.
  使用现有安全认证发布，发布后在公开站点重复验证。
- [ ] Worker-Version, Ergebnis und Grenzen dokumentieren. Ein lokaler Commit ersetzt keinen Git-Push; Remote-Synchronisierung separat behandeln.
  记录 Worker 版本、验证结果和局限。本地提交不等于 Git 推送，远端同步单独处理。
