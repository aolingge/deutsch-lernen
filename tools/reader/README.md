# Gutenberg reader translation tools

这些工具用于把新书按原段落导入德语助手，导出双语 HTML 后再精确匹配回 `data/books.js`。

```powershell
python prepare-input.py --reader <reader目录> --book 01 --pending-only
python import-eudic.py --reader <reader目录> --book 01 --html <德语助手双语HTML>
```

`import-eudic.py` 只导入真实导出的译文，不做猜测或模糊匹配；`data/translations/` 会保存可重建的缓存。桌面自动化脚本依赖本机德语助手版本和现有登录状态，不能在公开网站服务器上运行。
