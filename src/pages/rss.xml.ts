import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getArticles } from '../lib/content';
import { SITE } from '../data/site';

export async function GET(context: APIContext) {
  const articles = await getArticles();
  return rss({
    title: `${SITE.author.ru} — статьи`,
    description: SITE.description.ru,
    site: context.site!,
    items: articles.map((a) => ({
      title: a.data.title,
      description: a.data.description,
      pubDate: a.data.date,
      link: `/blog/${a.id}/`,
    })),
    customData: '<language>ru</language>',
  });
}
