#!/usr/bin/env python3
"""Переносит отдельные статьи: python3 scripts/migrate_standalone.py <telegraph-path>=<slug> ..."""
import glob
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'scripts'))
from migrate_series import first_sentences  # noqa: E402

inv = {x['path']: x for x in json.load(open(ROOT / '.migration' / 'telegraph-inventory.json'))}
for arg in sys.argv[1:]:
    path, slug = arg.rsplit('=', 1)
    it = inv[path]
    page = json.load(open(glob.glob(str(ROOT / '.migration' / 'raw' / f'page-{path[:80]}.json'))[0]))
    subprocess.run(['python3', str(ROOT / 'scripts' / 'telegraph_to_md.py'), path, '--slug', slug,
                    '--date', it['date'], '--description', first_sentences(page)], check=True)
