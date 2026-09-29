export const SITE = {
  url: 'https://startpointdev.com',
  author: { ru: 'Анастасия Котова', en: 'Anastasia Kotova' },
  description: {
    ru: 'Статьи про Node.js, V8, браузеры и фронтенд. Доклады и CV.',
    en: 'Articles about Node.js, V8, browsers and frontend. Talks and CV.',
  },
  telegramChannel: '@startpoint_dev',
  links: {
    telegram: 'https://t.me/startpoint_dev',
    telegramPersonal: 'https://t.me/startpoint_forl',
    github: 'https://github.com/startpointforl',
    linkedin: 'https://www.linkedin.com/in/startpointforl/',
    email: 'startpoint.dev.kotova@gmail.com',
  },
  // Идентификатор шаблона на instantview.telegram.org (см. instant-view/README.md)
  instantViewRhash: '314c6dcb3a6af8',
};

export function instantViewUrl(url: string) {
  if (!SITE.instantViewRhash) return url;
  return `https://t.me/iv?url=${encodeURIComponent(url)}&rhash=${SITE.instantViewRhash}`;
}
