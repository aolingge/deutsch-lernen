# Gutenberg Deutsch Reader

这是包含 20 本德语读物的网页阅读器，支持搜索、等级/篇幅筛选、主题、字级和阅读进度。新增 8 本只提供德语原文，页面包含原文来源、许可链接和完整 TXT 下载；已有中文为机器参考译文，可按需显示。现代浏览器还可以用本机 Web Speech API 朗读当前段或选中文本，支持德语声音、速度、暂停/继续、停止和连续读。

建议先读 `13` 初学者童话与故事第一册，再进入 `14` 第二册，之后按兴趣选择格林、豪夫、贝希施泰因或旅行小说。每次读 10–20 分钟，查 3–5 个影响理解的词，最后用 2–4 句德语复述。历史读本含旧拼写，原著等级是编辑估计，不是官方 CEFR 认证；韵文和文学原著可能比标签更难。直达指定书籍可使用 `/reader/?book=13`。

朗读时先滚动到目标段落，点击“朗读当前段”；也可以先选中一小段文字再点击同一按钮。建议从 `0.9–1.0×` 开始，眼睛跟着德语原文走；“连续读”适合通读，不适合查词。声音由操作系统提供，网站不会上传文字或录音；如果设备没有德语声音，页面会提示并尝试使用系统默认声音。

## 阅读量

新增正文合计 **405,594 词**：按每分钟 120 词估计 **56.3 小时**，按每分钟 240 词仍约 **28.2 小时**。整个书库有 1,162,218 词，按 120 词/分钟约 161.4 小时。时长是原文词数推算，不是实际学习计时；查词、复读未计入。

`data/reading-stats.json` 记录逐本词数与两个阅读速度；`data/source-records.json` 记录下载来源、时间与 SHA-256。新增正文排除英文前言、词汇表、印刷说明和许可尾页；完整原文件与许可仍保存在下载 TXT 中。

## 打开

双击 `index.html` 即可打开。浏览器的 `file://` 模式可以直接读取同目录的 `data/books.js`，不需要启动服务器。

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

完成后，把整个 `web-reader` 文件夹复制到其他学习资料目录即可；页面只依赖同目录的 `data/books.js`、CSS 和脚本。

## 当前边界

- 当前 20 本读物；前 10 本包含已有机器译文，第 11–20 本只有德语原文。
- 本地工具会用段落 HTML 和精确匹配导入译文；新增书籍只需登记 manifest、重建数据，再导入真实的双语 HTML。
- 若要迁移到另一份阅读器数据，可使用 `prepare-input.py --reader <reader目录> --book 01` 生成输入，再使用 `import-eudic.py --reader <reader目录> --book 01 --html <德语助手导出的双语HTML>` 导入；两步都会保留段落顺序并更新 `data/translations/` 缓存。
- 译文有三种模式：`悬停显示`、`始终显示`、`隐藏`。电脑用鼠标悬停，手机可点击模糊译文或用键盘聚焦。
- 阅读主题、字级、书籍和译文开关保存在浏览器 `localStorage`。
