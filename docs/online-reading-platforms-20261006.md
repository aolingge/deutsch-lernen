# Online-Leseplattformen 2026-10-06

本次调查的目标是给 A2–B2 阅读学习补充稳定的外部入口，并把适合听读、短文和故事的平台链接到主网站。所有新增目录项只保存原站链接和简短说明，不复制第三方文章、题目、音频或 PDF。

## 本次新增并已加入目录

| 平台 | 推荐等级 | 内容与访问 | 版权/使用边界 | 核验 |
| --- | --- | --- | --- | --- |
| [DW Kurz und leicht](https://learngerman.dw.com/de/kurz-und-leicht/s-69137519) | A2（编辑建议） | 德国之声的简短德语内容入口，适合先听后读并做练习；免费外链 | 只链接原站，不复制文章或音频 | 2026-10-06，HTTP 200 |
| [German.net Reading](https://german.net/reading/) | A1–C2（原站 CEFR） | A2、B1、B2 有免费子集；示例提供朗读、MP3、工作纸和理解题；其余可能为 Premium | 免费和 Premium 数量会变化；不抓取付费内容 | 2026-10-06，HTTP 200 |
| [Schubert A2 在线练习](https://www.schubert-verlag.de/aufgaben/uebungen_a2/a2_uebungen_index.htm) | A1–C2（原站目录） | 文本、听力和理解练习，可脱离教材独立使用；A2/B1/B2 最适合当前阅读路线 | 出版社允许注明来源的教学使用，商业复制受限；本站只外链 | 2026-10-06，HTTP 200 |
| [APOLL-Zeitung](https://schreiben.vhs-lernportal.de/wws/apoll-zeitung.php) | A2–B1（编辑估计） | vhs 的易读报纸，每期约 10–15 条政治、体育和社会短消息，提供 PDF 归档 | 页面没有 CEFR；PDF 属原站内容，只提供链接；当前归档以 2024 年内容为主 | 2026-10-06，HTTP 200 |
| [Deutsche Wikisource](https://de.wikisource.org/wiki/Hauptseite) | B1–C1（选篇编辑估计） | 公版或自由许可的德语文学、历史文献、扫描和转录；适合挑选童话和短篇进阶阅读 | 许可按作品页面确认；旧拼写和古语较多，不把整库当作统一公版 | 2026-10-06，HTTP 200 |
| [LibriVox: Winnetou I](https://librivox.org/winnetou-i-by-karl-may/) | B1–C1（选篇编辑估计） | 德语有声书，提供章节 MP3、在线文本和整书时长；用于听读配对 | LibriVox 的公版说明以美国法律为基础，其他地区要自行核查；不下载整包或重新上传 | 2026-10-06，HTTP 200 |

等级为“编辑估计”的条目不是考试认证。新闻、旧文学和有声书的难度会随文章或作品变化。

## 已有入口中的优先顺序

1. **A2 起步：** [DW Kurz und leicht](https://learngerman.dw.com/de/kurz-und-leicht/s-69137519)、German.net 的免费 A2 条目、本地阅读器的 13、11 号书。
2. **A2–B1 过渡：** [Nachrichtenleicht](https://www.nachrichtenleicht.de/)、[APOLL-Zeitung](https://schreiben.vhs-lernportal.de/wws/apoll-zeitung.php)、Schubert A2/B1 和本地阅读器的 14 号书。
3. **B1 主线：** [DW Top-Thema](https://learngerman.dw.com/de/top-thema/s-55861562)、[vhs-Lernportal](https://www.vhs-lernportal.de/wws/9.php#/wws/kursangebot-lernende.php)、German.net 免费 B1、格林童话。
4. **B1–B2 进阶：** [DW Langsam gesprochene Nachrichten](https://learngerman.dw.com/de/langsam-gesprochene-nachrichten/s-60040332)、German.net B2、Wikisource 选篇、本地阅读器 16–20 号书。
5. **长时间听读：** LibriVox 与同一作品的原文配对；[Vorleser.net](https://www.vorleser.net/) 已在目录中，但其免费录音仍受作品页和现行 AGB 限制。

## 研究中没有作为新增核心入口的平台

- [Projekt Gutenberg-DE](https://www.projekt-gutenberg.org/) 在本次自动核验中多次返回 403，因此没有把当前内容或版权状态写成已确认事实；美国 [Project Gutenberg 德语目录](https://www.gutenberg.org/browse/languages/de) 已作为已有外链保留。
- [Zeno.org 文学](http://www.zeno.org/Literatur) 的 HTTP GET 可访问，但 HTTPS 在当前网络中超时；作品许可混合且禁止批量复制，暂不加入核心卡片。
- Goethe 的测试页面返回 403，Deutsch-to-go 本次超时；保留已有入口的谨慎状态，不把自动访问失败写成资源失效。

## 版权与隐私边界

- 主网站只存外部 URL、等级说明和访问提示，不镜像第三方正文、音频、PDF 或付费内容。
- “免费”只表示调查时原站提供公开入口；注册、Premium、图书馆借阅证和地区限制仍以原站为准。
- Project Gutenberg、LibriVox 和其他公版目录按原站所在法域说明，用户在所在地复制或下载前应逐本核对版权。
- 本地阅读器的 20 本德语原文仍保留在本站；阅读器目前约 **1,162,218 词、161.4 小时（120 词/分钟估算）**，超过用户要求的 20 小时。阅读时间是词数推算，不是实际计时。

## 核验方法

使用当前网络对公开页面进行 GET 与浏览器页面核对；只记录页面可见的名称、用途、等级、访问和版权提示。自动 HTTP 200 不代表每个音频、下载或登录后功能都已播放验证，报告中的限制保持原样。

## 2026-10-06 实施与线上核验

- 当前线上 Worker 版本：`931c5dec-6099-4630-a666-f7eda2e78535`。公开 API 实际返回 **359 项资源、28 个分类**；阅读器条目显示 20 本书、1,162,218 个德语词、约 161.4 小时（按 120 词/分钟估算）。六个新增平台 ID 均已在公开 API 返回，链接状态为 `ok`。
- `release-check.mjs` 已检查全部 **359 个详情页**、站点地图和 1200×630 分享图，失败数为 0。Chromium、Firefox、WebKit 的线上跨浏览器烟测通过；阅读器的移动布局、筛选、键盘操作、已有译文和新增德语原文入口也通过定向检查。
- 本机浏览器朗读使用 Web Speech API；自动化测试用模拟语音合成验证按钮、暂停/继续、停止、速度和连续朗读流程，实际声音质量仍取决于设备安装的德语语音。第 13–20 本保持德语原文，页面会明确提示没有中文译文。
- 全量外链探测最后一次为 `279 ok / 62 restricted / 1 broken / 17 unchecked`。唯一的 `broken` 是 OBI：`https://www.obi.de/markt` 在普通浏览器请求中可以打开，但 OBI 的 CloudFront 对自动探测请求会返回 404，目录已标记为 `restricted` 并写明原因；这不是把不稳定结果伪装成通过。
- `tools/publication-check.ps1` 仍会被仓库中既有的公开资源编号、SVG 坐标、回环地址、阅读器版权联系方式和测试产物触发；本轮没有发现密钥或私有凭据，也没有为了让扫描变绿而放宽规则。Markdown 相对链接已单独检查。
- 旧的 `web/e2e/public_site.py` 仍含历史的 13 类及旧卡片数量断言，未把它误报为当前验收通过；本轮验收使用已更新的跨浏览器烟测、阅读器专项烟测和线上 `release-check.mjs`。
