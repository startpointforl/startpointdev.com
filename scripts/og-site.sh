#!/bin/sh
# Пересобрать картинки превью сайта: public/og-site.png (RU) и public/og-site-en.png (EN).
# Нужен Google Chrome. Запуск: sh scripts/og-site.sh
set -e
cd "$(dirname "$0")/.."
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
render() {
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files \
    --force-device-scale-factor=1 --window-size=1200,630 --virtual-time-budget=2000 \
    --screenshot="$2" "file://$PWD/scripts/og-site.html$1" >/dev/null 2>&1
  echo "→ $2"
}
render "" public/og-site.png
render "?lang=en" public/og-site-en.png
# PNG → JPEG: превью в 4–5 раз легче
for f in public/og-site public/og-site-en; do
  node -e "require('sharp')('$f.png').jpeg({ quality: 88, mozjpeg: true }).toFile('$f.jpg').then(() => require('fs').unlinkSync('$f.png'))"
done
