# 德语资源导航

为中文用户整理的德语与德国生活资源目录。按分类、等级、技能、考试、费用、访问条件和内容形式查找，点击资源名称直接打开原站。

[线上网站](https://deutsch-lernen-resource-hub.pirostonelsonrx688.workers.dev/) · [English](README.en.md) · [贡献指南](CONTRIBUTING.md)

当前源码保留 **448 项记录，分为 28 类**：学习、德国生活、社交社区、住房、工作、二手与租借、交通、政府、金融、健康、购物、旅行、通讯社交、媒体娱乐、餐饮配送、邮政快递、能源家庭服务和休闲运动。线上公开目录排除原创归档及未发布记录，并隐藏内部编辑字段，当前公开 API 为 371 项资源、28 类；线上版本以实际发布内容为准。

支持组合筛选、多关键词搜索、分页、原文名称排序、核验日期排序、卡片与列表视图，以及保存在当前浏览器中的收藏。筛选条件可通过链接分享；第三方内容不在本站镜像。

[阅读与听书资源](https://deutsch-lernen-resource-hub.pirostonelsonrx688.workers.dev/reading/) 整合 24 个精选入口，涵盖短故事、真人录音、分级小说、数字借阅和阅读工具，标注费用、访问条件及等级依据。调查依据见 [扩展记录](docs/reading-resource-expansion-20261007.md)。

本站以资源整合为核心，不展示学习路线、训练计划或使用教程。以前的原创指南保留在 [历史文档目录](docs/README.md) 与归档数据中，不计入公开资源数。旧版浏览器中的目标、任务与收藏数据保留。

## 内容与维护

资源字段位于 [resources.json](web/data/resources.json)，分类位于 [categories.json](web/data/categories.json)。每项附简短中文介绍、来源、参考等级、费用、访问条件、内容形式和链接检查记录。编辑参考等级与官方标级明确区分；自动访问受限不等于资源失效。

收录边界与本次核验见 [目录改版记录](docs/resource-directory-review.md)。欢迎提供原站链接、错链修正和元数据更新；不要提交付费教材正文、私人资料或凭据。

## 本地预览与验证

需要 Node.js 22 或更高版本。

```powershell
cd web
npm ci --ignore-scripts
npm run dev
npm run verify
```

静态预览打开 `http://localhost:4321/`。包含 Worker/API 与本地数据库的预览方法见 [目录改版记录](docs/resource-directory-review.md)。

仓库公开内容检查：

```powershell
pwsh -File tools/publication-check.ps1 .
```

## 许可

原创文档：[CC BY 4.0](LICENSE-CONTENT.md)。代码：[MIT](LICENSE-CODE.md)。第三方资源以原站版权、费用和访问规则为准。

[隐私规则](PRIVACY.md) · [安全报告](SECURITY.md)
