#!/usr/bin/env python3
"""Переносит статьи цикла из .migration/telegraph-inventory.json.

  python3 scripts/migrate_series.py <series-id> <slug-prefix>

Слаг: <slug-prefix>-part-<N>. Описание: первые предложения статьи (дословно, до ~220 символов).
Запускать дважды подряд, чтобы перекрёстные ссылки между частями указали на сайт.
"""
import glob
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'scripts'))
from telegraph_to_md import strip_series_nav, is_link_only  # noqa: E402


def first_sentences(page, limit=220):
    for node in strip_series_nav(page['content'], []):
        if isinstance(node, dict) and node.get('tag') == 'p' and not is_link_only(node):
            text = re.sub(r'\s+', ' ', ''.join(_plain(node))).strip()
            if len(text) < 40:
                continue
            text = text.replace('“', '«').replace('”', '»')
            sentences = re.findall(r'.+?[.!?…](?:\s|$)', text + ' ')
            out = ''
            for s in sentences:
                if out and len(out) + len(s) > limit:
                    break
                out += s
            return (out or text[:limit]).strip()
    return ''


def _plain(node):
    if isinstance(node, str):
        yield node
        return
    for c in node.get('children') or []:
        yield from _plain(c)


def main():
    series, prefix = sys.argv[1], sys.argv[2]
    inv = json.load(open(ROOT / '.migration' / 'telegraph-inventory.json'))
    items = sorted([x for x in inv if x['series'] == series], key=lambda x: x['part'])
    for it in items:
        raw = glob.glob(str(ROOT / '.migration' / 'raw' / f"page-{it['path'][:80]}.json"))[0]
        page = json.load(open(raw))
        desc = first_sentences(page)
        cmd = ['python3', str(ROOT / 'scripts' / 'telegraph_to_md.py'), it['path'],
               '--slug', f"{prefix}-part-{it['part']}", '--date', it['date'],
               '--series', series, '--part', str(it['part']), '--description', desc]
        subprocess.run(cmd, check=True)


if __name__ == '__main__':
    main()
