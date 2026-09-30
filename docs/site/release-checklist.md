# 网站发布检查

- [ ] `git status --short --branch`、`git log origin/main..HEAD` 已记录，未混入无关本地提交。
- [ ] `cd web; npm ci --ignore-scripts; npm run verify` 全部通过。
- [ ] `wrangler.jsonc` 的 Worker 名称、兼容日期、D1 数据库 ID 与部署目标一致。
- [ ] D1 迁移在预览数据库执行并验证，生产数据库与预览隔离。
- [ ] 按顺序执行 `migrations/0001_catalog.sql`、`0002_news.sql`、`0003_stats.sql`；迁移前后分别读取表结构。
- [ ] 管理入口有 Cloudflare Access 保护，匿名 GET/POST 管理接口均返回 403。
- [ ] 公开页面、`/api/health`、`/api/public-catalog`、`/api/stats` 分别检查。
- [ ] 浏览事件同一 eventId 重试不会重复累计；D1 故障时页面显示不可用。
- [ ] 手机宽度 390px、桌面宽度 1440px 截图并检查无横向溢出。
- [ ] GitHub 仓库公开状态、部署 SHA 和站点内容一致。
- [ ] 发布后记录网址、版本、D1 迁移状态、回滚命令和下一次资源复核日期。
