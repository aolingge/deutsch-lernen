# Gutenberg Deutsch Reader

这是包含 20 本德语读物的网页阅读器，支持搜索、等级/篇幅筛选、主题、字级和阅读进度。新增 8 本只提供德语原文，页面包含原文来源、许可链接和完整 TXT 下载；已有中文为机器参考译文，可按需显示。现代浏览器还可以用本机 Web Speech API 朗读当前段或选中文本，支持德语声音、速度、暂停/继续、停止和连续读。

建议先读 `13` 初学者童话与故事第一册，再进入 `14` 第二册，之后按兴趣选择格林、豪夫、贝希施泰因或旅行小说。每次读 10–20 分钟，查 3–5 个影响理解的词，最后用 2–4 句德语复述。历史读本含旧拼写，原著等级是编辑估计，不是官方 CEFR 认证；韵文和文学原著可能比标签更难。直达指定书籍可使用 `/reader/?book=13`。

点击紧凑的“朗读”入口后可选择段落、选中文本或指定段落范围；倍速 `0.50–1.80×`、步长 `0.05×`，提供声音试听、连续读和跟随朗读。声音由浏览器/系统提供；本站没有语音上传接口，但选择“在线声音”时浏览器的语音提供方可能处理朗读文本。音质取决于设备可用声音；没有德语声音时会尝试浏览器默认声音。

“查词 · 生词本”默认关闭，点击后打开对话框。支持选中同一德语段落里的词或短语，手写中文释义，保存原文上下文和段落链接；可直接输入词语。词典只在点击 PONS 德中、LEO 德中或 DWDS 链接时打开，不抓取词条或自动生成释义。

生词保存在 `localStorage`，最多 2000 条。JSON 备份可合并到另一浏览器；重复词保留当前笔记。Anki TSV 使用 UTF-8、Tab 分隔、Front/Back 两字段、关闭 HTML，桌面 Anki 导入后自行选择牌组；这不等于自动同步 AnkiWeb。清理浏览器数据前请先备份。生词上下文与备注可能包含个人内容，应自行保管下载文件。

## 阅读量

新增正文合计 **405,594 词**：按每分钟 120 词估计 **56.3 小时**，按每分钟 240 词仍约 **28.2 小时**。整个书库有 1,162,218 词，按 120 词/分钟约 161.4 小时。时长是原文词数推算，不是实际学习计时；查词、复读未计入。

`data/reading-stats.json` 记录逐本词数与两个阅读速度；`data/source-records.json` 记录下载来源、时间与 SHA-256。新增正文排除英文前言、词汇表、印刷说明和许可尾页；完整原文件与许可仍保存在下载 TXT 中。

## 打开

双击 `index.html` 即可打开。浏览器的 `file://` 模式可以直接读取同目录的 `data/books.js`，不需要启动服务器。

网站模式使用约 12 KB 的 `data/catalog.js` 书目索引，选择书籍时再请求 `data/books/编号.json`，避免首次下载整个 11.3 MB 的书库。加载失败可重试，书目来源和完整 TXT 仍可使用。网站构建会自动生成这些文件，生成物不提交到 Git；20 本原文与已有译文仍以 `data/books.js` 为构建来源。

## 重新生成数据

在 PowerShell 中运行：

```powershell
Set-Location 'web/public/reader'
.\build-reader.ps1
```

脚本依赖 Poppler 的 `pdftotext`，会读取 `books-manifest.json` 中登记的 PDF，并更新 `data/books.js`。第一本书会尝试从现有的 `01 ... - 沉浸式翻译.html` 读取能精确匹配的本地译文。

无需原 PDF 的增量构建（保留已有 PDF 书的正文与译文）：

```powershell
pwsh -NoProfile -File tools/reader/download-books.ps1
pwsh -NoProfile -File web/public/reader/build-reader.ps1 -ReuseExistingPdfData
node tools/reader/verify-library.mjs
```

以上命令从仓库根目录运行。下载器只接受有 Gutenberg 开始标记、德语声明和足够正文的文件，排除 HTML 错误页及有声书说明文件；验证器检查来源哈希、无伪造译文、原文词数及新增量在 240 词/分钟下不少于 20 小时。

## 快速迁移新书

1. 把新的 PDF 放入 `PDF版` 文件夹。
2. 在 `books-manifest.json` 追加一行元数据，填写 `id`、等级、PDF 文件名、德语书名和作者；如果有本地双语 HTML，再填写 `translation`。
3. 运行 `.\build-reader.ps1`。阅读器会自动生成段落数据并保留“译文待导入”状态，不会伪造译文。

完成后，把整个阅读器文件夹复制到其他学习资料目录即可；本地文件模式依赖同目录的 `data/books.js`、CSS 和脚本。部署到 HTTP 服务器前，在仓库 `web` 目录执行 `npm run build`（也可单独运行 `node scripts/prepare-public-snapshot.mjs`）生成书目索引与单本 JSON；部署使用构建后的 `web/dist/reader/`。

## 当前边界

- 当前 20 本读物；前 10 本包含已有机器译文，第 11–20 本只有德语原文。
- 本地工具会用段落 HTML 和精确匹配导入译文；新增书籍只需登记 manifest、重建数据，再导入真实的双语 HTML。
- 若要迁移到另一份阅读器数据，可使用 `prepare-input.py --reader <reader目录> --book 01` 生成输入，再使用 `import-eudic.py --reader <reader目录> --book 01 --html <德语助手导出的双语HTML>` 导入；两步都会保留段落顺序并更新 `data/translations/` 缓存。
- 译文有三种模式：`悬停显示`、`始终显示`、`隐藏`。电脑用鼠标悬停，手机可点击模糊译文或用键盘聚焦。
- 阅读主题、字级、书籍和译文开关保存在浏览器 `localStorage`。
