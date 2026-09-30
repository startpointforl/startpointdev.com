#!/usr/bin/env python3
"""Конвертер статьи из Телеграфа в Markdown для сайта.

Использование:
  python3 scripts/telegraph_to_md.py <telegraph-path> --slug <slug> --date YYYY-MM-DD \
      [--series <id> --part N] [--description "..."] [--refresh]

Берёт JSON страницы из .migration/raw/page-<path>.json (или скачивает через API Телеграфа
при --refresh), создаёт src/content/articles/<slug>/index.md и скачивает картинки рядом.
Ссылки на статьи Телеграфа, которые уже перенесены на сайт, заменяются на ссылки сайта.
"""
import argparse
import json
import time
import re
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / '.migration' / 'raw'
INVENTORY = ROOT / '.migration' / 'telegraph-inventory.json'
ARTICLES = ROOT / 'src' / 'content' / 'articles'
UA = {'User-Agent': 'Mozilla/5.0 (startpointdev migration)'}


def load_page(path: str, refresh: bool) -> dict:
    cached = RAW / f'page-{path[:80]}.json'
    if cached.exists() and not refresh:
        return json.loads(cached.read_text())
    url = 'https://api.telegra.ph/getPage/' + urllib.parse.quote(path) + '?return_content=true'
    data = json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30))
    page = data['result']
    RAW.mkdir(parents=True, exist_ok=True)
    cached.write_text(json.dumps(page, ensure_ascii=False))
    return page


def migrated_links() -> dict:
    """telegra.ph/<path> -> /blog/<slug>/ для уже перенесённых статей"""
    mapping = {}
    for md in ARTICLES.glob('*/index.md'):
        text = md.read_text()
        m = re.search(r'^telegraph: (\S+)$', text, re.M)
        s = re.search(r'^slug: (\S+)$', text, re.M)
        if m and s:
            mapping[m.group(1).split('telegra.ph/')[-1]] = f'/blog/{s.group(1)}/'
    return mapping


MD_ESCAPE = re.compile(r'([\\`*_\[\]<>])')


def esc(text: str) -> str:
    return MD_ESCAPE.sub(r'\\\1', text)


def detect_lang(code: str) -> str:
    c = code.strip()
    if re.search(r'#include|std::|\bNapi::|\bv8::|\buv_[a-z_]+\(|\bnapi_[a-z_]+\(', c):
        return 'cpp'
    js = re.search(r'\bimport .+ from |\brequire\(|^\s*(const|let|var|function|class|async function|export (default |const |function |class ))'
                   r'|=>|console\.\w+\(|\.forEach\(|\buse(State|Effect|LayoutEffect|Ref|Memo)\b', c, re.M)
    ts = re.search(r'\binterface \w+|\btype \w+ =|\w\??:\s*(string|number|boolean|void|any|unknown)\b|\bas const\b', c)
    jsx = re.search(r'return \(?\s*<[A-Za-z]|<[A-Z]\w*[\s/>]|</\w+>', c)
    if js or ts:
        if ts:
            return 'tsx' if jsx else 'ts'
        return 'jsx' if jsx else 'js'
    if re.search(r'^\s*(\$ |npm |npx |pnpm |yarn |node |cd |curl |brew |git |sudo |export [A-Z_]+=|ls\b|cat |mkdir |docker )', c, re.M):
        return 'bash'
    if re.match(r'^[\[{]', c) and re.search(r'"\s*:', c):
        return 'json'
    if re.match(r'^<(!doctype|html|div|body|head|script|template|span|p)\b', c, re.I):
        return 'html'
    if re.search(r'^\s*[.#]?[a-z-]+\s*\{[^}]*:[^}]*;', c, re.M | re.I):
        return 'css'
    return ''


class Converter:
    def __init__(self, slug: str, out_dir: Path, links: dict):
        self.slug = slug
        self.out_dir = out_dir
        self.links = links
        self.images = 0
        self.issues = []

    # --- inline ---
    def inline(self, nodes) -> str:
        out = []
        for n in nodes or []:
            if isinstance(n, str):
                # остатки нераспознанного Markdown в оригинале («****», «**текст»)
                out.append(esc(re.sub(r'\*{2,}', '', n)))
                continue
            tag, ch = n.get('tag'), n.get('children')
            if tag in ('strong', 'b', 'em', 'i'):
                mark = '**' if tag in ('strong', 'b') else '*'
                raw = self.inline(ch)
                inner = raw.strip()
                # пробелы по краям выносим за маркеры, иначе «*текст *» не распознаётся как выделение
                lead = raw[:len(raw) - len(raw.lstrip())]
                trail = raw[len(raw.rstrip()):]
                out.append(f'{lead}{mark}{inner}{mark}{trail}' if inner else raw)
            elif tag == 'code':
                raw = self.text(ch)
                fence = '``' if '`' in raw else '`'
                pad = ' ' if raw.startswith('`') or raw.endswith('`') else ''
                out.append(f'{fence}{pad}{raw}{pad}{fence}')
            elif tag == 'a':
                href = (n.get('attrs') or {}).get('href', '')
                href = self.fix_link(href)
                out.append(f'[{self.inline(ch)}]({href})')
            elif tag == 'br':
                out.append('\\\n')
            elif tag in ('s', 'del'):
                out.append(f'~~{self.inline(ch)}~~')
            elif tag == 'u':
                out.append(self.inline(ch))
            else:
                self.issues.append(f'inline <{tag}> как текст')
                out.append(self.inline(ch))
        return ''.join(out)

    def text(self, nodes) -> str:
        return ''.join(n if isinstance(n, str) else ('\n' if n.get('tag') == 'br' else self.text(n.get('children'))) for n in nodes or [])

    def fix_link(self, href: str) -> str:
        # Телеграф хранит ссылки на свои страницы относительными: /Some-Page-01-01
        if href.startswith('/') and not href.startswith('//'):
            href = 'https://telegra.ph' + href
        m = re.match(r'https?://telegra\.ph/([^?#]+)', href)
        if m and urllib.parse.unquote(m.group(1)) in self.links:
            return self.links[urllib.parse.unquote(m.group(1))]
        return href

    # --- blocks ---
    def blocks(self, nodes, depth=0) -> list:
        out = []
        buf = []  # подряд идущие inline-узлы на верхнем уровне

        def flush():
            if buf:
                t = re.sub(r'^(\\\n|\\)+|(\\\n|\\)+$', '', self.inline(buf).strip()).strip()
                if t:
                    out.append(t)
                buf.clear()

        for n in nodes or []:
            if isinstance(n, str) or n.get('tag') in ('strong', 'b', 'em', 'i', 'code', 'a', 'br', 's', 'u'):
                buf.append(n)
                continue
            flush()
            tag, ch = n['tag'], n.get('children')
            if tag == 'p':
                t = self.inline(ch).strip()
                # переносы строк по краям абзаца и «пустые» абзацы из одного <br> не нужны
                t = re.sub(r'^(\\\n|\\)+|(\\\n|\\)+$', '', t).strip()
                # Абзац, похожий на Markdown-разметку, не должен стать заголовком/цитатой/списком
                t = re.sub(r'^(#|>|[-+] )', r'\\\1', t)
                if t:
                    out.append(t)
            elif tag in ('h3', 'h4'):
                t = self.inline(ch).strip()
                t = re.sub(r'^\*\*(.*)\*\*$', r'\1', t)
                out.append(('## ' if tag == 'h3' else '### ') + t)
            elif tag in ('blockquote', 'aside'):
                inner = '\n\n'.join(self.blocks(ch, depth))
                out.append('\n'.join('> ' + line if line else '>' for line in inner.split('\n')))
            elif tag == 'pre':
                code = self.text(ch).rstrip('\n')
                lang = detect_lang(code)
                fence = '````' if '```' in code else '```'
                out.append(f'{fence}{lang}\n{code}\n{fence}')
            elif tag in ('ul', 'ol'):
                out.append(self.list(n, depth))
            elif tag == 'hr':
                out.append('---')
            elif tag == 'figure':
                out.append(self.figure(ch))
            elif tag == 'img':
                out.append(self.figure([n]))
            else:
                self.issues.append(f'блок <{tag}> пропущен')
        flush()
        return out

    def list(self, node, depth) -> str:
        ordered = node['tag'] == 'ol'
        lines = []
        for i, li in enumerate([x for x in node.get('children') or [] if isinstance(x, dict) and x.get('tag') == 'li'], 1):
            marker = f'{i}.' if ordered else '-'
            indent = ' ' * (len(marker) + 1)
            parts = self.blocks(li.get('children'), depth + 1)
            body = '\n\n'.join(parts) if parts else ''
            body_lines = body.split('\n')
            first = f'{marker} {body_lines[0]}'
            rest = [indent + l if l else '' for l in body_lines[1:]]
            lines.append('\n'.join([first] + rest))
        return '\n'.join(lines)

    def figure(self, children) -> str:
        src, caption = None, ''
        for c in children or []:
            if isinstance(c, dict) and c.get('tag') == 'img':
                src = (c.get('attrs') or {}).get('src')
            elif isinstance(c, dict) and c.get('tag') == 'figcaption':
                caption = self.inline(c.get('children')).strip()
            elif isinstance(c, dict) and c.get('tag') in ('iframe', 'video'):
                self.issues.append(f'встроенное видео/iframe: {(c.get("attrs") or {}).get("src")}')
        if not src:
            return ''
        file = self.download(src)
        alt = re.sub(r'[\\*_`\[\]]', '', caption) or 'Иллюстрация'
        md = f'![{alt}](./{file})'
        return md + (f'\n\n*{caption}*' if caption else '')

    def download(self, src: str) -> str:
        url = src if src.startswith('http') else 'https://telegra.ph' + src
        self.images += 1
        req = urllib.request.Request(url, headers=UA)
        for attempt in range(5):
            try:
                with urllib.request.urlopen(req, timeout=60) as r:
                    data = r.read()
                    ctype = r.headers.get('Content-Type', '')
                break
            except Exception as e:  # хостинги картинок иногда отвечают 5xx
                if attempt == 4:
                    raise
                print(f'  … {url}: {e}, повтор через {2 ** (attempt + 1)} с')
                time.sleep(2 ** (attempt + 1))
        ext = {'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif', 'image/webp': 'webp'}.get(ctype.split(';')[0])
        if not ext:
            ext = Path(urllib.parse.urlparse(url).path).suffix.lstrip('.').lower() or 'jpg'
        if ext == 'jpeg':
            ext = 'jpg'
        name = f'img-{self.images:02d}.{ext}'
        (self.out_dir / name).write_bytes(data)
        return name


SERIES_NAV = re.compile(r'(следующ|предыдущ|други|все|остальн)\w*\s+(част|стат)|част\w*\s+цикла|весь цикл|оглавление', re.I)


def plain(node) -> str:
    if isinstance(node, str):
        return node
    return ''.join(plain(c) for c in node.get('children') or [])


def is_link_only(node) -> bool:
    """Абзац или список, состоящий только из ссылок на Телеграф"""
    if isinstance(node, str):
        return not node.strip()
    tag = node.get('tag')
    kids = [c for c in node.get('children') or [] if not (isinstance(c, str) and not c.strip())]
    if tag == 'a':
        href = (node.get('attrs') or {}).get('href', '')
        return href.startswith('/') or 'telegra.ph/' in href
    if tag in ('p', 'li', 'ul', 'ol', 'strong', 'em') and kids:
        return all(is_link_only(c) for c in kids)
    if tag == 'br':
        return True
    return False


def strip_series_nav(content: list, removed: list) -> list:
    """Убирает ручные блоки «Следующие части» — на сайте навигация по циклу своя"""
    out = list(content)
    i = 0
    while i < len(out):
        node = out[i]
        if isinstance(node, dict) and node.get('tag') in ('h3', 'h4', 'p') and SERIES_NAV.search(plain(node)) \
                and len(plain(node)) < 80:
            j = i + 1
            while j < len(out) and is_link_only(out[j]):
                j += 1
            if j > i + 1:
                is_hr = lambda k: 0 <= k < len(out) and isinstance(out[k], dict) and out[k].get('tag') == 'hr'
                start = i - 1 if is_hr(i - 1) else i
                # навигация в самом начале статьи: разделитель стоит после неё
                if start == 0 and is_hr(j):
                    j += 1
                removed.append(' | '.join(plain(n).strip() for n in out[start:j] if plain(n).strip()))
                del out[start:j]
                i = start
                continue
        i += 1
    return out


def yaml_str(s: str) -> str:
    return '"' + s.replace('\\', '\\\\').replace('"', '\\"') + '"'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('path')
    ap.add_argument('--slug', required=True)
    ap.add_argument('--date', required=True)
    ap.add_argument('--series')
    ap.add_argument('--part', type=int)
    ap.add_argument('--description')
    ap.add_argument('--refresh', action='store_true')
    a = ap.parse_args()

    page = load_page(a.path, a.refresh)
    out_dir = ARTICLES / a.slug
    out_dir.mkdir(parents=True, exist_ok=True)
    for old in out_dir.glob('img-*'):
        old.unlink()

    conv = Converter(a.slug, out_dir, migrated_links())
    removed = []
    content = strip_series_nav(page['content'], removed)
    body = '\n\n'.join(b for b in conv.blocks(content) if b) + '\n'

    description = a.description or re.sub(r'\s+', ' ', page.get('description', '')).strip()
    fm = ['---', f'title: {yaml_str(page["title"])}', f'description: {yaml_str(description)}',
          f'date: {a.date}', f'slug: {a.slug}']
    if a.series:
        fm += [f'series: {a.series}', f'part: {a.part}']
    fm += [f'telegraph: {page["url"]}', '---', '']
    (out_dir / 'index.md').write_text('\n'.join(fm) + '\n' + body)

    print(f'OK {a.slug}: {len(body)} символов, картинок: {conv.images}')
    for r in removed:
        print('  - удалён блок навигации:', r[:160])
    for issue in sorted(set(conv.issues)):
        print('  !', issue)


if __name__ == '__main__':
    main()
