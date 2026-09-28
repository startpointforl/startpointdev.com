import { getCollection } from 'astro:content';

export async function getArticles() {
  const all = await getCollection('articles', ({ data }) => import.meta.env.DEV || !data.draft);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getTalks() {
  const all = await getCollection('talks');
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
