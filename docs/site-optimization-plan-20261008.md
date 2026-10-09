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

## 补完执行（2026-10-08）

| 优先级 | 项目 | 本轮结果与边界 |
|---|---|---|
| P1 | 长书按章节/阅读分段加载 | 20 本分成 529 个加载单元；保留完整 TXT 和整本 JSON，逐段拼接与原源数据完全一致。常规阅读不请求整本正文，导出与旧进度迁移才获取全文。正文首尾均有上一/下一分段，目录按需打开。 |
| P1 | 手机阅读优先、旧进度迁移 | 手机书库默认收起；工具栏只显示“显示、朗读、生词、书籍、同步”。译文、背景与字号按需展开。旧像素位置先在旧布局下恢复，再转换成段落 + 段内比例；横竖屏与字号变化保持段落。 |
| P2 | EPUB 导入、导出与目录 | 支持无加密文字 EPUB 的 ZIP 存储/Deflate、spine 正文顺序与本地 IndexedDB 保存。8 MB 文件、64 MB 声明解压量、4000 ZIP 条目、8 MB 正文上限，拒绝路径穿越、自定义实体、加密与损坏 CRC；只提取文字。下载生成 EPUB 3 原文、目录与来源信息，不包含中文译文。 |
| P2 | 段落分享 | 本站书籍支持稳定段落链接、用户点击系统分享；不支持时回退复制，再回退可选择链接。自导入书无公共链接。 |
| P2 | 自然朗读（免费路径已接入） | 自动/手动优先浏览器提供的德语自然或在线声音；新增纯原文视图与 Edge 官方朗读入口，并在主站应用页关联。独立云端 TTS **仍待服务与预算选择**，未启用付费服务或伪造在线音色。Edge 的专用自然声音不保证出现在网页 SpeechSynthesis 列表中。 |
| P2 | 跨设备生词与进度 | 用户主动生成同步码并手动上传/下载；浏览器 gzip + AES-GCM，加密钥匙只在本地同步码内，D1 保存密文、访问码摘要、版本与更新时间。生词并集合并、不同释义并列保留、进度采用较新时间，乐观版本冲突提示重试；自导入书及关联词汇上下文排除。JSON 备份继续保留。 |

同步为本站个人规模设计：最多 100 份同步记录、每份密文最多 700000 个 Base64 字符、每个来源每分钟最多 10 次请求；使用既有数据库，未开通付费资源。密文不自动过期，也未新增删除功能；清理浏览器前须保管同步码和 JSON。同步码具有完整访问与解密权限，仅在自己的设备之间传递。导入书保存在 IndexedDB，无法靠公共链接让另一设备读取；需自己传递原 EPUB。

独立云端 TTS 的服务/预算问题已向用户提出，尚未得到具体选择。该项保留为待决定，不能将浏览器声音测试报告为真实云端音质验证。

## 研究依据与限制

- [Readlang 官方功能](https://readlang.com/features)：简洁阅读、查词、上下文词汇与 Anki 导出。采用按需操作，避免占据正文。
- [Anki 官方文本导入](https://docs.ankiweb.net/importing/text-files.html)：UTF-8、Tab 分隔、文件头设置；使用明确定义的 Front/Back 两字段，HTML 关闭。
- [Anki 官方应用](https://apps.ankiweb.net/)：桌面版免费、AnkiWeb 免费同步、AnkiMobile iOS 另购；[Readlang 当前方案](https://readlang.com/pricing) 与 [LingQ 当前方案](https://www.lingq.com/en/signup/) 用于核对免费与订阅边界，页面不固化价格数值。
- [PONS 德中词典](https://zh.pons.com/%E7%BF%BB%E8%AF%91/%E5%BE%B7%E8%AF%AD-%E4%B8%AD%E6%96%87)：支持德中查词与发音，原站可能显示广告同意或订阅选择。德语域具体词页自动请求返回 403，不据此断言失效。
- [LingQ 官方导入说明](https://forum.lingq.com/t/intro-to-importing-into-lingq/8471)：扩展和手动文本导入；不是本站可调用的公开上传 API。
- [Lute 官方说明](https://luteorg.github.io/lute-manual/background.html) 与 [Anki 导出说明](https://luteorg.github.io/lute-manual/usage/ankiexport/index.html)：本地阅读及词汇保存；其直连 Anki 依赖桌面 Anki 和 AnkiConnect。
- [Language Reactor 官方导出](https://www.languagereactor.com/help/export)：页面依赖 JavaScript，搜索索引有导出说明，本轮不声称已验证账号导出流程。
- [MDN Web Share](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)：HTTPS、用户点击、浏览器支持限制；已实现，并提供复制回退。
- LEO、DWDS 自动浏览受 robots 限制：提供已有官方站点查询入口，不承诺词条覆盖率。

## 第一阶段验证与发布记录（历史版本）

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


## 补完研究与本地验证

- [W3C EPUB 3.3](https://www.w3.org/TR/epub-33/)：以 spine 决定正文顺序；[OCF 容器规范](https://www.w3.org/publishing/epub32/epub-ocf.html)：导出 mimetype 必须为首个未压缩条目。导出 XML/ZIP 与原文顺序实际检查，未承诺所有电子书设备兼容。
- [XHTML 1.0](https://www.w3.org/TR/xhtml1/) 的旧 DOCTYPE 与实体用于 EPUB 2 兼容；解析时移除普通 HTML/XHTML 声明，不获取外部 DTD，拒绝内部实体。
- [MDN CompressionStream](https://developer.mozilla.org/en-US/docs/Web/API/CompressionStream)、[AES-GCM 加密](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt) 与 [Cloudflare D1 限制](https://developers.cloudflare.com/d1/platform/limits/) 用于无依赖压缩、加密与有界存储设计。AES-GCM 使用随机 96 位 IV 和绑定同步标识的附加数据；同步码中的访问码与密钥均由密码学随机数生成。
- [Microsoft Edge 阅读模式](https://support.microsoft.com/en-us/edge/use-immersive-reader-in-microsoft-edge) 与 [朗读](https://www.microsoft.com/en-us/edge/features/read-aloud)：采用按需工具与纯原文视图。部分官方功能页面重定向后自动抓取失败，帮助页可直接读取；不据此声称自然声音在所有设备可用。
- [Workers AI 当前模型目录](https://developers.cloudflare.com/workers-ai/models/) 未找到对应德语的直接 TTS 模型，因此未启用 Workers AI 计费或调用未公开语音端点。
- `reader-position-migration-smoke.py`：从上一版真实 UI 的第 120 段、段内 30% 生成像素进度；在 Chromium/Firefox/WebKit、375/1440 px 共 6 种组合迁移成功，字号与宽度变化继续保留段落。
- `reader-completion-smoke.py`：三个浏览器验证跨分段朗读（API mock）、段落选择、ZIP Deflate 导入、spine 顺序、脚本/图片清洗、路径穿越拒绝、IndexedDB 重载、原文 EPUB 导出、分享回退、320–1440 px 和按需面板。Chromium 两个隔离设备配置另测真实本地 Worker + D1 加密同步、不同释义保留、错误解密钥匙拒绝和自导入上下文排除。未使用第三方账号。
- 首次书籍数据量现为书目 63162 字节 + 默认首段 2493 字节 = 65655 字节，相对原 11327326 字节全书脚本减少约 99.4%。这是未压缩数据量；不是实际延迟承诺。普通阅读会在切换分段时继续按需获取数据。

## 补完发布记录

- `npm run verify`：50 项 Node 测试通过，Astro 0 错误/警告/提示，391 页构建成功。
- `site-connections-smoke.py`：本轮最终版本在 Chromium、Firefox、WebKit 均通过，`errors=[]`。
- `reader-loading-smoke.py`、`reader-library-smoke.py`：按分段加载、失败重试、切书竞态、20 本完整数据与下载检查通过。
- `accessibility-smoke.py`：10 个页面、三种主题、键盘与 320 px 重排通过；检测未发现违规或重复 ID，仍有需要人工判断的 incomplete 项。
- 对本轮 27 个相关源码/文档文件执行凭据、私钥、私人路径和私人邮箱扫描，未发现命中；`git diff --check` 通过。仓库级历史扫描限制仍见第一阶段记录。
- 同步数据库迁移 `0006_reader_sync.sql` 已通过既有部署认证应用到线上 D1，使用既有数据库和限流绑定；未新增依赖或付费服务。
- 已发布 Worker 版本 `4fdb80c1-0041-4320-b07d-241ee804db69`；8 个页面/API 路径 HTTP 200，12 个关键文件 SHA-256 与本地构建完全一致。公开 API 仍为 371 项、28 类。
- 线上 `reader-completion-smoke.py`：Chromium 单独运行通过，Firefox/WebKit 一组运行通过，三者 `errors=[]`；EPUB、目录、跨分段朗读控制、复制回退与 320–1440 px 均验证。Chromium 两个独立浏览器配置通过真实线上 Worker/D1 加密上传、下载、合并及错误钥匙拒绝；只有合成测试数据，未上传私人资料。报告在本地 `web/output/reader-completion-qa/report-live.json` 与 `live-health.json`。
- 语音控制使用 API mock，未声称验证每台设备的真实自然音质；系统分享原生选择器未在实际手机上验收，复制回退已验证。EPUB 文字导入和导出通过，图片版式、加密书及全部电子书设备兼容不在已验证范围。
- 最终线上 `site-connections-smoke.py`：Chromium、Firefox、WebKit 在同一轮全部通过，主站应用关联、阅读筛选、生词、导出/合并与 320–1440 px 均为 `errors=[]`。
