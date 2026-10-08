// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeFigures from './src/lib/rehype-figures.mjs';
import { readdirSync, readFileSync } from 'node:fs';

// Адреса запланированных статей (дата в будущем) — их не должно быть в карте сайта до даты публикации.
// Конфиг не видит коллекции Astro, поэтому даты читаем прямо из frontmatter.
const scheduledPaths = new Set(
  readdirSync('src/content/articles', { recursive: true })
    .filter((file) => String(file).endsWith('.md'))
    .map((file) => readFileSync(`src/content/articles/${file}`, 'utf8'))
    .map((text) => ({
      slug: text.match(/^slug:\s*["']?([\w-]+)/m)?.[1],
      date: new Date(text.match(/^date:\s*["']?([^"'\n]+)/m)?.[1] ?? 0),
    }))
    .filter(({ slug, date }) => slug && date > new Date())
    .map(({ slug }) => `/blog/${slug}/`),
);

const fontsource = fontProviders.fontsource();

export default defineConfig({
  site: 'https://startpointdev.com',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/404/') && !scheduledPaths.has(new URL(page).pathname),
      // Связывает RU- и EN-версии страниц (главная, CV, доклады)
      i18n: { defaultLocale: 'ru', locales: { ru: 'ru-RU', en: 'en-US' } },
    }),
  ],
  // Шрифты Fontsource: скачиваются при сборке и раздаются с нашего домена, только кириллица и латиница.
  // Пока PT-шрифты грузятся, текст показывается системным шрифтом с подогнанными метриками, поэтому
  // ничего не «прыгает». Кроме того, страница показывается (с анимацией) только когда шрифты
  // загрузились — см. скрипт в конце Base.astro; swap нужен на случай, если шрифт не успел за секунду.
  fonts: [
    { provider: fontsource, name: 'PT Mono', cssVariable: '--font-mono', weights: [400], styles: ['normal'], subsets: ['cyrillic', 'latin'], fallbacks: ['monospace'], display: 'swap' },
    { provider: fontsource, name: 'PT Sans', cssVariable: '--font-sans', weights: [400, 700], styles: ['normal'], subsets: ['cyrillic', 'latin'], fallbacks: ['PT Sans Fallback', 'sans-serif'], optimizedFallbacks: false, display: 'swap' },
    { provider: fontsource, name: 'PT Serif', cssVariable: '--font-serif', weights: [400, 700], styles: ['normal', 'italic'], subsets: ['cyrillic', 'latin'], fallbacks: ['PT Serif Fallback', 'serif'], optimizedFallbacks: false, display: 'swap' },
  ],
  i18n: {
    locales: ['ru', 'en'],
    defaultLocale: 'ru',
    routing: { prefixDefaultLocale: false },
  },
  // Картинки в статьях: WebP, набор размеров под экраны (srcset), ширина не больше колонки текста
  image: { layout: 'constrained' },
  markdown: {
    // Внешние ссылки в статьях открываются в новой вкладке
    rehypePlugins: [rehypeFigures, [rehypeExternalLinks, { target: '_blank', rel: ['noopener'] }]],
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
});
