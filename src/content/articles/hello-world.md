---
title: Как устроен этот сайт
description: Статьи в Markdown, GitHub Actions, Astro и превью для Telegram — коротко о том, как публикуются заметки на startpointdev.com.
date: 2026-09-28
slug: how-this-site-works
tags: [astro, meta]
draft: false
---

Это пример статьи. Удали его (или поставь `draft: true`), когда появится первая настоящая.

## Как опубликовать статью

1. Создай файл `src/content/articles/<что-угодно>.md`.
2. Заполни frontmatter: `title`, `description`, `date` и желательно `slug` — он станет адресом страницы.
3. Закоммить в `main`. Через минуту статья будет на `https://startpointdev.com/blog/<slug>/`.

## Что поддерживается

Обычный Markdown: **жирный**, *курсив*, `инлайн-код`, [ссылки](https://startpointdev.com), цитаты, таблицы и картинки.

> Цитаты тоже выглядят нормально.

```js
// Подсветка кода работает в обеих темах
const answer = await Promise.resolve(42);
console.log(answer);
```

| Что | Где |
| --- | --- |
| Статьи | `src/content/articles/` |
| Доклады | `src/data/talks.yaml` |
| CV | `src/data/cv.ts` |

Картинки кладём в `public/images/` и вставляем так: `![подпись](/images/pic.png)`.
