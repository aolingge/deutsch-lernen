# Gutenberg Deutsch Reader

这是 `PDF版` 的本地网页阅读器。它把十本 Gutenberg 德语原著整理成可搜索、可切换主题、可调整字级的学习页面；原文优先，中文译文默认像参考页面一样模糊，鼠标悬停后显示清晰译文。

## 打开

双击 `index.html` 即可打开。浏览器的 `file://` 模式可以直接读取同目录的 `data/books.js`，不需要启动服务器。

## 重新生成数据

在 PowerShell 中运行：

```powershell
Set-Location 'D:\aolin\07_Study\德语学习\01_Gutenberg德语原著\PDF版\web-reader'
.\build-reader.ps1
```

脚本依赖 Poppler 的 `pdftotext`，会读取 `books-manifest.json` 中登记的 PDF，并更新 `data/books.js`。第一本书会尝试从现有的 `01 ... - 沉浸式翻译.html` 读取能精确匹配的本地译文。

## 快速迁移新书

1. 把新的 PDF 放入 `PDF版` 文件夹。
2. 在 `books-manifest.json` 追加一行元数据，填写 `id`、等级、PDF 文件名、德语书名和作者；如果有本地双语 HTML，再填写 `translation`。
3. 运行 `.\build-reader.ps1`。阅读器会自动生成段落数据并保留“译文待导入”状态，不会伪造译文。

完成后，把整个 `web-reader` 文件夹复制到其他学习资料目录即可；页面只依赖同目录的 `data/books.js`、CSS 和脚本。

## 当前边界

- 当前十本书共 20,049 个段落，已通过德语助手现有会员的默认引擎导入对应中文译文。短元数据、网址和版权尾页也会保留原文，避免伪造译文。
- 本地工具会用段落 HTML 和精确匹配导入译文；新增书籍只需登记 manifest、重建数据，再导入真实的双语 HTML。
- 若要迁移到另一份阅读器数据，可使用 `prepare-input.py --reader <reader目录> --book 01` 生成输入，再使用 `import-eudic.py --reader <reader目录> --book 01 --html <德语助手导出的双语HTML>` 导入；两步都会保留段落顺序并更新 `data/translations/` 缓存。
- 译文有三种模式：`悬停显示`、`始终显示`、`隐藏`。电脑用鼠标悬停，手机可点击模糊译文或用键盘聚焦。
- 阅读主题、字级、书籍和译文开关保存在浏览器 `localStorage`。
