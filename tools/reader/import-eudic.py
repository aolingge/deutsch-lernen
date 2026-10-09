"""Import genuine Eudic bilingual exports; never guess missing translations."""
import argparse
import hashlib
import json
import re
import unicodedata
from datetime import datetime, timezone
from pathlib import Path

from bs4 import BeautifulSoup

READER = Path(__file__).resolve().parent.parent


def normalize(text):
    return re.sub(r"\s+", "", unicodedata.normalize("NFC", text).replace("\u00ad", "")).lower()


def read_books():
    text = (READER / "data/books.js").read_text(encoding="utf-8-sig")
    return json.loads(text.split("=", 1)[1].strip().rstrip(";"))


def translation_pairs(path):
    soup = BeautifulSoup(path.read_text(encoding="utf-8-sig"), "html.parser")
    for block in soup.find_all("p"):
        elements = block.find_all("eudic-translate-content-web-element")
        if not elements:
            elements = block.select(".eusoft-eudic-chrome-extension-translate-content")
        if not elements:
            continue
        targets = []
        for element in elements:
            spans = element.select("[translate-content]") or element.select(".translated-result")
            target = " ".join(span.get_text(" ", strip=True) for span in spans)
            if target:
                targets.append(target)
            element.decompose()
        source = block.get_text(" ", strip=True)
        target = " ".join(targets)
        if source and target:
            yield source, target


def main():
    global READER
    parser = argparse.ArgumentParser()
    parser.add_argument("--reader", type=Path, default=READER)
    parser.add_argument("--book", required=True)
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument("--html", type=Path)
    source.add_argument("--pairs", type=Path)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    READER = args.reader.resolve()
    books = read_books()
    book = next(b for b in books if b["id"] == args.book)
    artifact = args.html or args.pairs
    raw_pairs = translation_pairs(args.html) if args.html else (
        (p["de"], p["zh"]) for p in json.loads(args.pairs.read_text(encoding="utf-8-sig"))
        if p.get("de") and p.get("zh"))
    pairs = dict((normalize(de), (de, zh)) for de, zh in raw_pairs)
    updated = 0
    for p in book["paragraphs"]:
        pair = pairs.get(normalize(p["de"]))
        if pair and not p.get("zh"):
            p["zh"] = pair[1]
            updated += 1
    translated = sum(bool(p.get("zh")) for p in book["paragraphs"])
    book["translationStatus"] = "complete" if translated == len(book["paragraphs"]) else "partial-local"
    summary = dict(book=book["id"], exportPairs=len(pairs), added=updated,
                   translated=translated, total=len(book["paragraphs"]),
                   pending=len(book["paragraphs"]) - translated)
    if not args.dry_run:
        cache_dir = READER / "data/translations"
        cache_dir.mkdir(parents=True, exist_ok=True)
        cache_file = cache_dir / f'{book["id"]}.json'
        previous = json.loads(cache_file.read_text(encoding="utf-8")) if cache_file.exists() else {"paragraphs": []}
        cached = {normalize(p["de"]): p for p in previous["paragraphs"]}
        for de, zh in pairs.values():
            cached[normalize(de)] = {"de": de, "zh": zh}
        for p in book["paragraphs"]:
            if p.get("zh"):
                cached[normalize(p["de"])] = {"de": p["de"], "zh": p["zh"]}
        cache = {"bookId": book["id"], "engine": "德语助手当前引擎",
                 "updatedAt": datetime.now(timezone.utc).isoformat(),
                 "exportSha256": hashlib.sha256(artifact.read_bytes()).hexdigest(),
                 "paragraphs": list(cached.values())}
        cache_file.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")
        (READER / "data/books.js").write_text("window.GUTENBERG_BOOKS = " + json.dumps(books, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
        report_dir = READER / "translation-work"
        report_dir.mkdir(exist_ok=True)
        (report_dir / "coverage.json").write_text(json.dumps([
            {"id": b["id"], "title": b["title"], "total": len(b["paragraphs"]),
             "translated": sum(bool(p.get("zh")) for p in b["paragraphs"])}
            for b in books], ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False))


if __name__ == "__main__":
    main()
