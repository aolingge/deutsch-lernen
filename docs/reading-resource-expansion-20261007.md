# 德语阅读与听书资源扩展 · 2026-10-07

## 交付范围

新增 12 个原站资源，整理为 `/reading/` 的 24 个精选入口、五个主题：短故事、分级小说、真人录音、电子书与长篇、阅读工具。主站目录和阅读器书库均提供入口。页面沿用中文界面，保留原文名称，费用与参考等级直接可见，更多访问说明按需展开。

这是资源集合；没有替用户认定德语考试等级，也没有购买、注册或复制商业作品。此前本站的 20 本德语原著和紧凑朗读面板继续保留。

## 新增资源与原站依据

2026-10-07 阅读以下官方页面，并对全部新增入口发出实时 GET。HTTP 200 仅验证入口可获取，不代表登录、付费或全部音频已经实际体验。

| 官方入口 | 已确认的用途 | 等级依据 | 费用与访问 |
| --- | --- | --- | --- |
| [The German Project](https://www.thegermanproject.com/stories) | 德语童话、母语者慢速录音、可选英文对照；已查看 [Henry Hühnchen 示例](https://www.thegermanproject.com/stories/chicken-little) | A2–B1 为编辑建议 | 公开故事免费、免注册，未确认中文翻译；HTTP 200 |
| [The Fable Cottage](https://www.thefablecottage.com/languages/german) | 德语寓言与童话，慢速音频、部分动画和英文对照 | A2–B1 为编辑建议 | 免费故事与章节、付费会员并存；不能把全库标为免费；HTTP 200 |
| [AMIRA](https://www.amira-lesen.de/index/index.html) | 简单插画故事、短句、慢速真人朗读、手机和离线版本 | A1–A2 为编辑建议；原站是三种阅读阶段 | 在线免费，纸册收费；原站语言名单不含中文；HTTP 200 |
| [Goethe Onleihe](https://www.goethe.de/de/kul/bib/onl.html) | 免费德语电子书、有声书、报刊与学习材料；PC 或 Onleihe 3 | 作品各异，不统一标级 | 注册并激活 Mein goethe.de，按馆藏借阅；官方说明可检索，但本机 GET 为 403，标记 restricted |
| [Hueber 成人读物](https://www.hueber.de/reihe/lektuere-fuer-erwachsene) | 成人故事与理解练习、配套完整 MP3 朗读 | 官方 A1、A2、B1；[官方目录](https://edit.hueber.de/media/36/Hueber_Gesamtprogramm_Lekt%C3%BCren_2024.232895.pdf)有 A2《Eine Nacht in Berlin》等示例 | 正文书籍收费，配套 MP3 免费，部分有样章；HTTP 200 |
| [Hueber Audioservice](https://legacy.hueber.de/audioservice?lehrwerk=lektueren&lehrwerk_1=leichtelit&livefilter=false&search=&sprache=daf&sprache_1=daf) | 读物朗读 ZIP 下载，按书名/ISBN 查询 | 与对应读物一致 | 公开音频免费，不等于书籍免费；个别服务可能需访问码；HTTP 200 |
| [Black Cat CIDEB](https://www.blackcat-cideb.com/en/catalogue/german/) | 德语分级故事和简写文学、配套资源入口 | 官方 A1–B2 | 完整读物收费，音频与配套资源按具体版本确认；HTTP 200 |
| [Klett B1](https://www.klett-sprachen.de/lektueren/daf-und-daz/deutsch-als-fremdsprache/b1/c-487) | B1 短篇、悬疑故事和简写小说；已查看 [Doppeltes Spiel in Bern](https://www.klett-sprachen.de/doppeltes-spiel-in-bern/t-487/9783126742153) | 此入口为官方 B1 分类 | 完整读物收费；Audio-Online、数字附件和 allango 限期授权因版本而异；HTTP 200 |
| [LearnOutLive / Dino](https://books.learnoutlive.com/) | 日常连载故事、电子书、MP3、带同步音频的 TalkingBook 和免费 Reader 预览 | A2–B1 为编辑建议；官方称初学者故事 | 完整版本收费，免费预览只涵盖部分内容；HTTP 200 |
| [German Stories](https://german-stories.com/learn-german-podcast/) | 连续剧情播客，在故事中讲解词汇和语法 | 官方课程目标 A1–A2，不承诺通过考试 | 公开播客免费；[会员页面](https://german-stories.com/german-stories-membership-account/german-stories-membership/)显示动态文稿及课程收费；HTTP 200 |
| [Readle（原 Langster）](https://readle-app.com/en/) | 德语分级新闻与故事、点词解释、逐句录音、词汇复习，Web/手机入口 | 官方产品说明 A1–C1 | 限期试用后订阅，需账号；中文界面/释义未确认，不宣传永久免费；HTTP 200 |
| [Lute](https://luteorg.github.io/lute-manual/) | 自行安装的阅读工具，词典、词形与多词短语管理；[导入手册](https://luteorg.github.io/lute-manual/usage/books/creating-books.html)支持 TXT、EPUB、网页 | 工具不限等级，由导入文本决定 | [官方仓库](https://github.com/LuteOrg/lute-v3)为 MIT 开源；本轮只整合说明链接，没有安装新服务；HTTP 200 |

## 已有资源的组合

- 短文：Lingua、German.net、DW Kurz und leicht；避免重复创建目录项。
- 听读：Slow German、Deutsch-to-go、Vorleser.net、LibriVox Winnetou I。
- 长篇：Project Gutenberg 德语目录、Wikisource；原作的难度、旧拼写与授权按作品判断。
- 工具：[Readlang](https://readlang.com/) 已重新核实点词翻译和生词卡；免费与 Premium 功能不同，优质整篇语音属于更高订阅档。[LingQ](https://www.lingq.com/en/) 已核实德语和真实内容阅读入口；使用已有部分免费/需注册标注。[DWDS](https://www.dwds.de/) 提供德语释义和例句。
- Goethe 官方目前指向 [Onleihe 3 新入口](https://goethe-institut.onleihe.de/)，不把旧 Onleihe 平台路径作为新用户入口。

## 暂未收录及核验限制

- [StoryWeaver](https://storyweaver.org.in/kok/about) 是多语种插画故事与下载平台，但未确认适合本次用途的德语馆藏，暂不作为德语入口。
- 新出现的 AI 故事生成器和小型故事站没有足够的编辑质量、费用与内容证据，未作为本次核心推荐。
- Deutsch-to-go 本轮网页抓取失败，保留已有链接和核验记录；没有把失败伪装为本次已验证。
- 第三方登录、订阅、借阅资格、实际中文解释和全部音频播放未测试。没有引入第三方 iframe、广告脚本或付费 API；只在用户点击链接时打开原站。

## 集成与发布步骤

1. 把已核实的 12 项写入现有资源字段，区分官方标级/编辑参考，保留来源、费用、访问和链接状态。
2. 新增纯资源集合 `/reading/`，主站和阅读器只增加紧凑入口。页面复用现有字体、绿色与米白配色，不占用阅读正文。
3. 验证目录、类型检查、已有测试、构建，再检查桌面/手机、键盘、无障碍与三个浏览器。
4. 通过现有脚本生成仅新增条目的幂等 SQL，更新现有 D1 目录；部署既有 Worker，检查线上 API、全部新详情页和入口。

## 线上发布与回读

- D1 使用两个小批次、`INSERT OR IGNORE` 写入 12 项；远程 SQL 返回成功，重复执行不会制造重复条目。
- Worker 已部署为版本 `e704dd2f-fdff-4d07-9630-50d71ac31e88`。
- `https://deutsch-lernen-resource-hub.pirostonelsonrx688.workers.dev/api/public-catalog` 回读 `schemaVersion=1`、公开资源 **371 项**，12 个新增 ID 全部存在。
- 线上 `/`、`/reading/`、`/reader/`、`/sitemap.xml` 均返回 HTTP 200；线上集合页包含 24 张精选卡片。
- 集合页专项检查：Chromium、Firefox、WebKit 均通过；320、375、768、1440 像素无横向溢出，键盘展开详情和内部导航通过，无页面错误。
- 本地完整 `npm run verify`：44 个测试通过、Astro 0 诊断、390 个静态页面构建完成。本轮专项覆盖阅读器新入口和朗读面板默认收起状态；线上专项脚本改为等待 `domcontentloaded` 后通过，避免远程读者数据的完整 `load` 延迟造成误报。
- `tools/publication-check.ps1` 仍会命中仓库既有的历史公开资源编号、SVG 坐标、读者版权联系方式和测试缓存；未发现本次新增的密钥或凭据，未放宽扫描规则。
