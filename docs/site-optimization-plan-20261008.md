# 德语主站与阅读器优化计划（2026-10-08）

## 检查范围与交付标准

主站目录、阅读与听书精选、阅读器、现有应用资源、导出/备份、手机布局、键盘与无障碍、发布和线上回读。保留简体中文界面、德语原文、紧凑朗读入口和原站版权边界。计划保存在项目文档，网站仍以资源整合为主。

## 本轮执行

| 优先级 | 发现 / 目标 | 改动 | 验收 |
|---|---|---|---|
| P0 | 指定段落范围的 CSS 会覆盖 hidden；隐藏面板内状态不便辅助技术读取 | 修复隐藏规则，将无障碍朗读状态移到面板外，视觉继续隐藏 | 三浏览器范围切换、收起后无大块提示 |
| P0 | 阅读中的词汇无法带上下文保存、交给复习工具 | 按需打开的查词/生词本，原文选择、手写释义、段落来源、Anki TSV、JSON 备份与合并导入 | Unicode、重复词更新、备份往返、无脚本注入、存储失败反馈 |
| P0 | 模拟存储已满时，原有进度保存也抛出异常；WebKit 的对话框 Escape 行为不稳定 | 阅读设置读写失败时继续阅读、页脚提示无法保存；对话框明确处理 Escape，保留中文输入法组合输入 | 配额错误下不误报成功、不覆盖损坏记录，三浏览器关闭与焦点恢复 |
| P0 | 线上主站可访问，但 reader 的全书库阻塞脚本在当前连接超过 60 秒 | 将计划中的按书加载提前：生成小型书目索引、按需获取单本原文、加载失败可重试；保留完整 TXT 和本地文件兼容 | 20 本元数据及全文无损、首次仅请求一本、快速切书不串内容、失败重试、线上回读 |
| P1 | 精选阅读入口在手机上需要长距离浏览 | 关键词、等级和费用组合筛选，可复制筛选后的网址 | 空结果、重置、返回、320–1440 px 布局 |
| P1 | 已收录应用散在目录里，衔接能力不清楚 | 主站新增应用入口，复用现有目录数据，注明本站能交付的文件与外部应用条件 | 主站到应用页、费用与访问标注、详情链接 |
| P0 | 发布必须与实际验证结果一致 | 构建、功能、响应式、无障碍、发布后回读，聚焦本地提交 | 测试报告与线上页面核对；不推送 Git |

## 应用关联方式

| 应用 | 关联方案 | 本站边界 |
|---|---|---|
| Anki / AnkiWeb | 本地生词导出 UTF-8 TSV，桌面 Anki 导入；同步由 Anki 管理 | 不安装 AnkiConnect，不宣称已自动同步 |
| Readlang | 已有完整 TXT 下载 + 原站入口；可自行导入文本 | 不代登录、不上传个人数据 |
| LingQ | 原文复制/下载和原站导入入口 | 账号与导入额度以原站为准；不伪造上传 API |
| Lute | 原文下载 + 开源阅读器入口 | 本轮不安装本地服务；其 AnkiConnect 方案另需配置 |
| PONS 德中 / LEO 德中 / DWDS | 编辑词语后点击跳转查询 | 只有点击外链才交给词典；不抓取、不生成假释义 |
| Language Reactor | 现成字幕阅读工具入口 | 部分功能需扩展/付费；不复制字幕或绕过权限 |
| dict.cc 离线词典 / DeepL | 主站应用集合中提供已有资源链接和费用说明 | 离线能力由其应用提供；本站没有离线翻译 |

## 后续候选（未实施，不视为已交付）

| 优先级 | 候选 | 先验证什么 |
|---|---|---|
| P1 | 超长书进一步按章节加载 | 按书加载已提前到本轮；后续根据单本慢网测量决定是否按章节切分，保证正文哈希与进度迁移不变 |
| P1 | 手机选书列表默认收起，阅读内容优先 | 375 px 截图中首屏仍以 20 本书的列表为主；需同时将按像素保存的旧进度迁移到段落位置，避免改布局后跳错阅读位置 |
| P2 | EPUB 导入、章节目录与电子书设备 | 文件大小、授权、内容清洗与兼容性；TXT 已可下载 |
| P2 | 阅读位置分享、系统分享菜单 | Web Share 支持有限，需要复制链接回退和移动设备实测 |
| P2 | 云端自然语音 | 先选择服务、核实价格与德语音色；涉及付费、传输文本和凭据需要单独决定 |
| P2 | 跨设备生词/进度同步 | 本轮交付 JSON 文件备份；账号、数据库、隐私与冲突规则需先确定 |

## 研究依据与限制

- [Readlang 官方功能](https://readlang.com/features)：简洁阅读、查词、上下文词汇与 Anki 导出。采用按需操作，避免占据正文。
- [Anki 官方文本导入](https://docs.ankiweb.net/importing/text-files.html)：UTF-8、Tab 分隔、文件头设置；使用明确定义的 Front/Back 两字段，HTML 关闭。
- [Anki 官方应用](https://apps.ankiweb.net/)：桌面版免费、AnkiWeb 免费同步、AnkiMobile iOS 另购；[Readlang 当前方案](https://readlang.com/pricing) 与 [LingQ 当前方案](https://www.lingq.com/en/signup/) 用于核对免费与订阅边界，页面不固化价格数值。
- [PONS 德中词典](https://zh.pons.com/%E7%BF%BB%E8%AF%91/%E5%BE%B7%E8%AF%AD-%E4%B8%AD%E6%96%87)：支持德中查词与发音，原站可能显示广告同意或订阅选择。德语域具体词页自动请求返回 403，不据此断言失效。
- [LingQ 官方导入说明](https://forum.lingq.com/t/intro-to-importing-into-lingq/8471)：扩展和手动文本导入；不是本站可调用的公开上传 API。
- [Lute 官方说明](https://luteorg.github.io/lute-manual/background.html) 与 [Anki 导出说明](https://luteorg.github.io/lute-manual/usage/ankiexport/index.html)：本地阅读及词汇保存；其直连 Anki 依赖桌面 Anki 和 AnkiConnect。
- [Language Reactor 官方导出](https://www.languagereactor.com/help/export)：页面依赖 JavaScript，搜索索引有导出说明，本轮不声称已验证账号导出流程。
- [MDN Web Share](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)：HTTPS、用户点击、浏览器支持限制；列为后续候选。
- LEO、DWDS 自动浏览受 robots 限制：提供已有官方站点查询入口，不承诺词条覆盖率。

## 验证与发布记录

- `npm run verify`：45 项 Node 测试通过、Astro 0 错误/警告/提示、391 页构建成功。
- `python tests/site-connections-smoke.py`：Chromium、Firefox、WebKit 验证应用入口、URL 筛选、原文选词、Unicode/引号 TSV、JSON 合并、非法数据保护、配额错误反馈和 320/375/768/1440 px 无横向溢出；Chromium 另测独立浏览器恢复备份、损坏存储不覆盖、段落返回及三处 axe 检查。截图/报告在本地 `web/output/site-connections-qa/`，不提交测试词汇文件。
- `python tests/reader-library-smoke.py --base http://127.0.0.1:4360`：20 本书、8 本新增书的下载哈希、朗读范围与控制、响应式均通过。语音使用浏览器 API mock，仅证明控制逻辑，不证明设备真实音质。
- `python tests/reader-loading-smoke.py`：20 本生成 JSON 与构建源逐本完全一致；三浏览器首次只请求选定书籍，延迟响应不覆盖后来选中的书，失败可重试，失败期间保留旧阅读位置。
- 原全书脚本未压缩为 11,327,326 字节；新书目索引 11,584 字节，默认第 01 本正文 305,594 字节，合计 317,178 字节，首次书籍数据减少 97.2%。这是未压缩数据量比较，不代表实际网络延迟同比下降。第 13 本正文 145,727 字节；其余书籍按需请求，原全文来源与下载文件保留。
- Chromium `file://` 检查通过：直接打开原始阅读器目录，可读取 20 本完整数据并显示默认书的 2,652 段，保留无服务器使用方式。
- `RESOURCE_HUB_BASE=http://127.0.0.1:4360` 下 `cross-browser-smoke.py`、`reading-resources-smoke.py`、`accessibility-smoke.py`：旧目录功能、24 项精选、三种主题和键盘回归通过；axe 未发现违规，仍有需要人工判断的 incomplete 项，不等同无障碍认证。
- `performance-smoke.py`：本地主站目录 Chromium 实验室，冷缓存 LCP 332 ms、CLS 0；4 倍 CPU/1.6 Mbps 配置冷缓存 LCP 1508 ms、CLS 0。是本地实验结果，不是线上真实用户指标或 INP，未证明大书库在慢网下的性能。
- 代码/内容检查：新增数据仅为应用关系说明；目录原始记录与数据库不变，不上传个人生词，不新增依赖、账户或服务。确认相关差异无凭据，`git diff --check` 通过。第三方查询命中和真实 Anki 客户端导入仍由设备/原站决定，已检查导出格式与浏览器文件往返。
- 仓库级 `publication-check.ps1` 未通过：其全目录隐私扫描也读取既有研究日志、浏览器缓存、书籍/译文中的公开数字及图标坐标，出现大量候选命中；未将此检查报告为通过，也未删除这些既有文件或放宽扫描规则。对本轮 24 个相关文件另做凭据、私钥与私人路径扫描，通过；生成正文逐本与既有源数据相同。
- 本轮首次发布版本 `e3b05690-d0a9-4954-9eca-e45529712ac1`；线上主站与筛选检查可运行，但旧阅读器全书脚本在当前网络超过 60 秒，因而没有报告阅读器完成。随后按书加载改动重新构建并发布，最终版本 `a83732af-4345-49bf-b075-5347448beaf4`。
- 最终版本线上回读：主站、精选阅读、应用、阅读器、隐私、站点地图和公开 API 共 7 个路径均 HTTP 200；公开 API 仍为 371 项、28 类。8 个关键脚本/样式/数据文件的线上 SHA-256 与本地构建一致，20 本 JSON 的 HEAD 检查全部 HTTP 200；应用页已包含在 Sitemap。实际报告位于本地 `web/output/site-connections-qa/live-health.json`。
- 线上交互：以 `RESOURCE_HUB_BASE=https://deutsch-lernen-resource-hub.pirostonelsonrx688.workers.dev` 运行 `python tests/site-connections-smoke.py`，Chromium 和 Firefox 流程通过；WebKit 一次在主站 HTTPS 建连时出现 SSL 错误。设置 `RESOURCE_HUB_BROWSERS=webkit` 单独重试同一脚本通过，`errors=[]`，未关闭 TLS 校验或修改系统代理。三浏览器均实际检查应用入口、筛选、生词/导出/备份与 320–1440 px 布局，不能将发生 SSL 错误的整轮命令误报为一次全部通过。
