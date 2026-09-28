// Структурированные данные (JSON-LD) для поисковиков: https://schema.org
import { getImage } from 'astro:assets';
import { SITE } from '../data/site';
import { headline } from '../data/cv';
import type { Lang } from '../i18n/ui';

const photos = import.meta.glob<{ default: ImageMetadata }>('../assets/photo-light.{jpg,jpeg,png,webp}', { eager: true });

export async function personLd(lang: Lang) {
  const photo = Object.values(photos)[0]?.default;
  const image = photo ? new URL((await getImage({ src: photo, width: 600, format: 'jpg' })).src, SITE.url).toString() : undefined;
  return {
    '@type': 'Person',
    '@id': `${SITE.url}/#person`,
    name: SITE.author[lang],
    alternateName: SITE.author[lang === 'ru' ? 'en' : 'ru'],
    url: `${SITE.url}/`,
    image,
    jobTitle: headline[lang],
    worksFor: { '@type': 'Organization', name: lang === 'ru' ? 'Яндекс' : 'Yandex' },
    knowsAbout: ['JavaScript', 'TypeScript', 'Node.js', 'V8', 'libuv', 'Next.js', 'React', 'Frontend'],
    sameAs: [SITE.links.telegram, SITE.links.linkedin, SITE.links.github],
  };
}

export function breadcrumbsLd(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: new URL(item.path, SITE.url).toString(),
    })),
  };
}

export function graph(...nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}
