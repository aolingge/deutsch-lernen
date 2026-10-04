"""Create paragraph-preserving HTML input for the Eudic document reader."""
import argparse
from html import escape
from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path

here = Path(__file__).resolve().parent
spec = spec_from_file_location("import_eudic", here / "import-eudic.py")
module = module_from_spec(spec)
spec.loader.exec_module(module)
parser = argparse.ArgumentParser()
parser.add_argument("--book", required=True)
parser.add_argument("--pending-only", action="store_true")
parser.add_argument("--reader", type=Path, default=here.parent)
parser.add_argument("--output", type=Path, default=here / "input")
args = parser.parse_args()
module.READER = args.reader.resolve()
book = next(b for b in module.read_books() if b["id"] == args.book)
blocks = [f'<p data-reader-book="{book["id"]}" data-reader-index="{i}">{escape(p["de"])}</p>'
          for i, p in enumerate(book["paragraphs"]) if not args.pending_only or not p.get("zh")]
dest = args.output.resolve() / (book["id"] + ".html")
dest.parent.mkdir(exist_ok=True)
dest.write_text('<!doctype html><html lang="de"><head><meta charset="utf-8">'
                f'<title>{escape(book["germanTitle"])}</title>'
                '<style>body{max-width:50em;margin:2em auto;font:18px/1.8 Georgia}p{margin:0 0 1.2em}</style>'
                '</head><body>' + '\n'.join(blocks) + '</body></html>', encoding="utf-8")
print(f'{book["id"]}: {len(blocks)} paragraphs -> {dest.name}')
