# startpointdev.com

Личный сайт: статьи, выступления, CV (RU/EN). [Astro](https://astro.build), деплой на GitLab Pages.

Основной репозиторий — [gitlab.com/startpoint_forl/startpointdev.com](https://gitlab.com/startpoint_forl/startpointdev.com):
оттуда сайт собирается и публикуется. GitHub — зеркало: локальный `git push` отправляет в оба места,
но правки через веб-интерфейс GitHub на сайт не попадут — правь через GitLab.

## Опубликовать статью

1. Создай `src/content/articles/<имя>.md` (можно прямо в веб-интерфейсе GitLab):

   ```md
   ---
   title: Заголовок
   description: Одно-два предложения — попадут в превью в Telegram.
   date: 2026-10-01
   slug: my-article        # адрес: /blog/my-article/  (латиница, цифры, дефисы)
   tags: [v8, node.js]     # необязательно
   cover: /images/x.png    # необязательно; иначе превью сгенерируется само
   draft: false            # true — не публиковать
   ---

   Текст в Markdown…
   ```

   Для статьи из цикла добавь два поля (у отдельных статей их нет):

   ```md
   series: nextjs-inside   # имя файла цикла из src/content/series/ без .md
   part: 3                 # номер части
   ```

2. Закоммить в `main` → GitLab CI соберёт и задеплоит сайт (~2–3 мин).
3. На странице статьи нажми «Скопировать ссылку для Telegram».

Статья с картинками — это папка: `src/content/articles/<имя>/index.md`, а картинки лежат рядом
и подключаются относительным путём: `![подпись](./schema.png)`. Сайт сам сожмёт их в WebP,
сделает версии под разные экраны и проставит размеры, чтобы страница не «прыгала» при загрузке.

## Отложенная публикация

Можно выложить статью заранее — как в Телеграфе: поставь в `date` будущий день и закоммить.

- Сразу после деплоя статья открывается по прямой ссылке — её можно вставить в отложенный анонс
  в Telegram (превью и Instant View подтянутся). Но её нет в списках, на главной, в цикле,
  в поиске, RSS и карте сайта, а поисковикам сказано её не индексировать.
- Каждое утро сайт пересобирается сам, и статьи, у которых наступила дата, появляются везде.
  Расписание — в GitLab: Build → Pipeline schedules (около 6:00 по Белграду).
- Пересобрать раньше: Build → Pipeline schedules → ▶ (или Build → Pipelines → Run pipeline).

## Циклы статей

Цикл — файл `src/content/series/<id>.md`:

```md
---
title: Next.js изнутри
description: Одно предложение — показывается в карточке и на странице цикла.
---
```

Дальше всё собирается само: карточка цикла на главной, страница цикла с оглавлением,
плашка «часть N из M» и оглавление в каждой статье, ссылки «← предыдущая / следующая →».
Цикл появляется на сайте, когда в нём опубликована хотя бы одна статья.

## Где что лежит

| Что | Файл |
| --- | --- |
| Статьи | `src/content/articles/*.md` |
| Циклы | `src/content/series/*.md` |
| Выступления | `src/data/talks.yaml` |
| CV (RU + EN) | `src/data/cv.ts` |
| Контакты, rhash для Instant View | `src/data/site.ts` |
| Шаблон Instant View | `instant-view/` |
| Превью ссылок на сайт (не статьи) | `scripts/og-site.html` → `sh scripts/og-site.sh` → `public/og-site*.jpg` |

## Локально

```sh
npm install
npm run dev      # http://localhost:4321
npm run build
```

## Первичная настройка хостинга

Хостинг — GitLab Pages (сборка в [`.gitlab-ci.yml`](.gitlab-ci.yml)). До октября 2026 сайт жил на GitHub Pages,
но GitHub так и не выпустил для домена HTTPS-сертификат.

1. Публичный проект на GitLab; Settings → General → Visibility → Pages: **Everyone**.
2. Deploy → Pages → New domain: `startpointdev.com` и `www.startpointdev.com`, Let's Encrypt включён.
3. DNS у регистратора (GoDaddy):
   - `A` для `@`: `35.185.44.232`, `AAAA` для `@`: `2600:1901:0:7b8a::`
   - `CNAME` для `www`: `startpointdev.com`
   - `TXT` `_gitlab-pages-verification-code` и `_gitlab-pages-verification-code.www` — коды из настроек домена в GitLab
4. Build → Pipeline schedules: ежедневный запуск для отложенных статей.
5. Instant View — см. [`instant-view/README.md`](instant-view/README.md).
