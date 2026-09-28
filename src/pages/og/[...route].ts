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
    bgGradient: [[242, 238, 229]],
    border: { color: [36, 51, 232], width: 24, side: 'block-start' },
    padding: 80,
    font: {
      title: { families: ['PT Serif'], weight: 'Bold', size: 68, lineHeight: 1.1, color: [20, 19, 18] },
      description: { families: ['PT Serif'], weight: 'Normal', size: 32, lineHeight: 1.4, color: [91, 86, 77] },
    },
    fonts: ['./src/assets/fonts/PTSerif-Bold.ttf', './src/assets/fonts/PTSerif-Italic.ttf'],
  }),
});
