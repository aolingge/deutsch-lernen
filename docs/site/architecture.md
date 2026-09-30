# 德语学习导航网站

网站源代码位于 `web/`，面向中文学习者公开整理德语课程、考试、新闻和工具入口。

## 本地运行

```powershell
Set-Location web
npm ci --ignore-scripts
npm run dev
```

打开 `http://localhost:4321/`。生产检查使用 `npm run verify`，它会依次执行目录校验、Node 测试和 Astro 构建。

## 内容规则

- `data/categories.json` 是中文主分类。
- `data/resources.json` 是首批可公开资源目录。
- 每个条目必须有中文用途、原始链接、来源、等级依据和核验状态。
- 同一 canonical URL 不能重复收录；同一来源的不同使用方式应在说明中表达，不能靠复制条目增加数量。
- `restricted` 表示自动检查受限，不等于失效。

## 线上边界

- 公开目录由静态页面和 `GET /api/public-catalog` 提供。
- `web/migrations/0001_catalog.sql` 到 `0003_stats.sql` 为 D1 资源、新闻、访问量迁移。
- `POST /api/visit` 在 D1 配置后才统计服务端浏览量；未配置时返回 503，不展示伪造数字。
- 管理 API 在 Access 验证完成前默认返回 403。不要把 `admin-auth-not-configured` 改成匿名写入。
- `wrangler.jsonc` 中的 D1 ID 仍是占位符，正式部署前必须用实际目标数据库 ID 生成生产配置，不能提交凭据。
