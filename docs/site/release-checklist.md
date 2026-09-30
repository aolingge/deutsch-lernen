# 网站发布检查

- [ ] `git status --short --branch`、`git log origin/main..HEAD` 已记录，未混入无关本地提交。
- [ ] `cd web; npm ci --ignore-scripts; npm run verify` 全部通过。
- [ ] `wrangler.jsonc` 的 Worker 名称、兼容日期、D1 数据库 ID 与部署目标一致。
- [ ] D1 迁移在目标数据库执行并回读状态；部署目录变更前备份数据库。
- [ ] 按顺序应用 `migrations/0001_catalog.sql` 到 `0005_live_catalog_and_atomic_visits.sql`；迁移后用 seed 脚本补齐公开目录。
- [ ] 管理入口有 Cloudflare Access 保护，匿名 GET/POST 管理接口均返回 403。
- [ ] 公开页面、`/api/health`、`/api/public-catalog`、`/api/stats` 分别检查。
- [ ] 浏览事件同一 eventId 重试不会重复累计；D1 故障时页面显示不可用。
- [ ] `npm run verify`、目录 128 条校验、Playwright 公共流程和手机宽度 390px/桌面宽度 1440px 检查通过。
- [ ] GitHub 仓库公开状态、部署 SHA 和站点内容一致。
- [ ] 发布后记录网址、版本、D1 迁移状态、回滚命令和下一次资源复核日期。
