import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

type Article = CollectionEntry<'articles'>;

export async function getArticles() {
  const all = await getCollection('articles', ({ data }) => import.meta.env.DEV || !data.draft);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getTalks() {
  const all = await getCollection('talks');
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function getStandalone(articles: Article[]) {
  return articles.filter((a) => !a.data.series);
}

/** Части цикла по порядку */
export function getParts(articles: Article[], seriesId: string) {
  return articles
    .filter((a) => a.data.series?.id === seriesId)
    .sort((a, b) => a.data.part! - b.data.part!);
}

/** Циклы, в которых есть хотя бы одна опубликованная статья; свежие сверху */
export async function getSeriesList(articles: Article[]) {
  const all = await getCollection('series');
  return all
    .map((s) => {
      const parts = getParts(articles, s.id);
      const updated = parts.reduce((max, p) => Math.max(max, p.data.date.valueOf()), 0);
      return { series: s, parts, updated: new Date(updated) };
    })
    .filter((x) => x.parts.length > 0)
    .sort((a, b) => b.updated.valueOf() - a.updated.valueOf());
}

/** Навигация по циклу для статьи: оглавление, предыдущая и следующая часть */
export async function getSeriesNav(article: Article, articles: Article[]) {
  if (!article.data.series) return null;
  const series = await getEntry(article.data.series);
  if (!series) return null;
  const parts = getParts(articles, series.id);
  const index = parts.findIndex((p) => p.id === article.id);
  return { series, parts, index, prev: parts[index - 1], next: parts[index + 1] };
}
