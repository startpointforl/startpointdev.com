# startpointdev.com

Личный сайт: статьи, выступления, CV (RU/EN). [Astro](https://astro.build), деплой на GitHub Pages.

## Опубликовать статью

1. Создай `src/content/articles/<имя>.md` (можно прямо в веб-интерфейсе GitHub):

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

2. Закоммить в `main` → GitHub Action соберёт и задеплоит сайт (~1 мин).
3. На странице статьи нажми «Скопировать ссылку для Telegram».

Картинки для статей — в `public/images/`, ссылки вида `/images/pic.png`.

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

## Локально

```sh
npm install
npm run dev      # http://localhost:4321
npm run build
```

## Первичная настройка хостинга

1. Создать репозиторий на GitHub и запушить.
2. Settings → Pages → Source: **GitHub Actions**.
3. Settings → Pages → Custom domain: `startpointdev.com`, включить **Enforce HTTPS**.
4. DNS у регистратора:
   - `A` для `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` для `www`: `<github-username>.github.io`
5. Instant View — см. [`instant-view/README.md`](instant-view/README.md).
