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

2. Закоммить в `main` → GitHub Action соберёт и задеплоит сайт (~1 мин).
3. На странице статьи нажми «Скопировать ссылку для Telegram».

Картинки для статей — в `public/images/`, ссылки вида `/images/pic.png`.

## Где что лежит

| Что | Файл |
| --- | --- |
| Статьи | `src/content/articles/*.md` |
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
