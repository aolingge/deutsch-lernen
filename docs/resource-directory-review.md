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
