# Gutenberg 阅读路线与扩展清单

## 当前书库路线

| 顺序 | 等级 | 篇幅 | 书目 | 用法 |
| --- | --- | --- | --- | --- |
| 1 | A2 | 短篇 | `Der Struwwelpeter` | 每天一个故事，先读德语，再悬停看译文 |
| 2 | A2–B1 | 短篇 | `Max und Moritz` | 每天一个故事，注意韵文和动词 |
| 3 | A2 | 长篇 | `Peterchens Mondfahrt`、`Die Biene Maja` | 每天一章，读完用中文或德语复述 |
| 4 | B1 | 中篇/长篇 | `Alice's Abenteuer im Wunderland`、`Heidi` | 记录固定表达和叙事连接词 |
| 5 | B1+ | 长篇 | `Die Schatzinsel`、`Nils Holgersson`、`Der Trotzkopf`、`Robinson Crusoe` | 每天一章，减少译文依赖 |
| 6 | B2 | 长篇 | `Oliver Twist` | 最后挑战，先做段落主旨再核对译文 |

## 新书筛选规则

新增作品只接受 Project Gutenberg 或其他明确开放许可来源，并在 manifest 中保存 `sourceUrl`、`licenseUrl`、`difficulty`、`length`、`genre` 和 `chapterCount`。版权状态不明确的现代分级读物只列为外部推荐，不复制到本站。

已加入的两个短篇来自 Project Gutenberg：

- [Max und Moritz，ebook 17161](https://www.gutenberg.org/ebooks/17161)
- [Der Struwwelpeter，ebook 24571](https://www.gutenberg.org/ebooks/24571)
- [Project Gutenberg license policy](https://www.gutenberg.org/policy/license.html)

后续可优先考察 `Der Sandmann`、`Die Verwandlung`、Grimm 童话和短篇传说；在确认对应德语文本的版权和稳定下载地址后再导入。它们更适合作为 B2 及以上挑战，不应默认标为 B1。

## 新书迁移

1. 把 Gutenberg 的 UTF-8 Plain Text 放入 `web/public/reader/data/sources/`。
2. 在 `web/public/reader/books-manifest.json` 增加一条 `sourceFile` 记录。
3. 运行 `powershell -File web/public/reader/build-reader.ps1` 生成段落数据。
4. 运行 `python tools/reader/prepare-input.py --reader web/public/reader --book <id> --pending-only`。
5. 在德语助手中打开生成的 HTML，使用现有批量翻译与导出流程，再运行 `python tools/reader/import-eudic.py --reader web/public/reader --book <id> --html <导出的双语HTML>`。
6. 运行 `npm run verify`，再做桌面和移动端浏览器检查。

译文仍然只接受真实的德语助手导出；缺失段落会显示为原文，不会自动填入猜测译文。
