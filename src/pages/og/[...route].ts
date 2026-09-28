// Автогенерация картинок превью 1200×630 для статей: /og/<slug>.png
import { OGImageRoute } from 'astro-og-canvas';
import { getArticles } from '../../lib/content';
import { SITE } from '../../data/site';

const articles = await getArticles();
const pages: Record<string, { title: string; description: string }> = Object.fromEntries(
  articles.map(({ id, data }) => [id, { title: data.title, description: data.description }]),
);
pages.default = { title: SITE.author.ru, description: SITE.description.ru };

export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'route',
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    bgGradient: [[22, 22, 24]],
    border: { color: [157, 191, 143], width: 12, side: 'inline-start' },
    padding: 80,
    font: {
      title: { families: ['PT Mono'], weight: 'Normal', size: 60, lineHeight: 1.25, color: [226, 226, 229] },
      description: { families: ['PT Sans'], weight: 'Normal', size: 32, lineHeight: 1.4, color: [138, 138, 147] },
    },
    fonts: ['./src/assets/fonts/PTMono-Regular.ttf', './src/assets/fonts/PTSans-Regular.ttf'],
  }),
});
