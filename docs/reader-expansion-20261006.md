# 德语阅读库扩展

新增 8 本，保留原有 12 本。所有新增内容只提供德语原文，完整 TXT 已下载并作为公开资源保存，来源和 SHA-256 见 `web/public/reader/data/source-records.json`。

| 编号 | 作品 | 词数 | 阅读估计（120 词/分钟） |
|---|---|---:|---:|
| 13 | Märchen und Erzählungen für Anfänger. Erster Teil | 21,691 | 3.0 小时 |
| 14 | Märchen und Erzählungen für Anfänger. Zweiter Teil | 29,633 | 4.1 小时 |
| 15 | Deutsche Märchen gesammelt durch die Brüder Grimm | 88,445 | 12.3 小时 |
| 16 | Märchen-Almanach auf das Jahr 1826 | 41,424 | 5.8 小时 |
| 17 | Märchen-Almanach auf das Jahr 1827 | 33,156 | 4.6 小时 |
| 18 | Märchen-Almanach auf das Jahr 1828 | 53,281 | 7.4 小时 |
| 19 | Aus dem Leben eines Taugenichts | 31,149 | 4.3 小时 |
| 20 | Ludwig Bechsteins Märchenbuch | 106,815 | 14.8 小时 |

新增合计 405,594 词，估算 56.3 小时（120 词/分钟）或 28.2 小时（240 词/分钟）。只计算阅读正文；英文前言、英德词汇表、版权尾页未用于凑阅读时长。时长不能保证个人实际耗时，阅读速度差异、复读和查词都会影响结果。

## 来源修正

初步调研中的 Gutenberg 20050、20051、19636、21798 是有声书条目；其 TXT 是说明文件，不能作为完整读物。改用 Gutenberg 77905 的格林文字版，以及 35794、45189、6638、6639、6640、35312、63465 的全文。避免为增加数量直接加入难度很高的 Faust 或 Buddenbrooks。

书籍难度是编辑估计。建议优先阅读两册初学者故事，熟悉后再用 Grimm/Hauff/Bechstein 作为原著选读；历史文本保留旧拼写。新书不新增译文。

## 可重建与验证

```powershell
pwsh -NoProfile -File tools/reader/download-books.ps1
pwsh -NoProfile -File web/public/reader/build-reader.ps1 -ReuseExistingPdfData
node tools/reader/verify-library.mjs
cd web
npm run verify
```

来源 TXT 保留完整 Gutenberg 许可；阅读正文仅做格式清理和非故事内容排除。每本书均有具体来源和许可链接。原有前十本书的正文及译文以 Git 基线逐段比对，保留不变。
