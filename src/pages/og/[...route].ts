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
    bgGradient: [[28, 27, 25]],
    border: { color: [251, 146, 60], width: 16, side: 'inline-start' },
    padding: 72,
    font: {
      title: { families: ['PT Sans'], weight: 'Bold', size: 64, lineHeight: 1.15, color: [235, 232, 227] },
      description: { families: ['PT Sans'], weight: 'Normal', size: 32, lineHeight: 1.4, color: [156, 151, 142] },
    },
    fonts: ['./src/assets/fonts/PTSans-Bold.ttf', './src/assets/fonts/PTSans-Regular.ttf'],
  }),
});
