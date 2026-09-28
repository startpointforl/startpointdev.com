export type Lang = 'ru' | 'en';

export const ui = {
  ru: {
    'nav.blog': 'Статьи',
    'nav.talks': 'Выступления',
    'nav.cv': 'CV',
    'theme.toggle': 'Переключить тему',
    'lang.switch': 'EN',
    'blog.title': 'Статьи',
    'blog.all': 'Все статьи',
    'blog.recent': 'Свежие статьи',
    'talks.title': 'Выступления',
    'talks.recent': 'Последние выступления',
    'talks.all': 'Все выступления',
    'talks.video': 'Видео',
    'talks.slides': 'Слайды',
    'talks.page': 'Страница доклада',
    'talks.upcoming': 'скоро',
    'talks.online': 'онлайн',
    'talks.hybrid': 'офлайн + онлайн',
    'cv.title': 'CV',
    'cv.about': 'Обо мне',
    'cv.experience': 'Опыт',
    'cv.skills': 'Навыки',
    'cv.talks': 'Выступления',
    'cv.contacts': 'Контакты',
    'share.telegram': 'Скопировать ссылку для Telegram',
    'share.copied': 'Скопировано',
  },
  en: {
    'nav.blog': 'Articles',
    'nav.talks': 'Talks',
    'nav.cv': 'CV',
    'theme.toggle': 'Toggle theme',
    'lang.switch': 'RU',
    'blog.title': 'Articles',
    'blog.all': 'All articles (in Russian)',
    'blog.recent': 'Recent articles (in Russian)',
    'talks.title': 'Talks',
    'talks.recent': 'Recent talks',
    'talks.all': 'All talks',
    'talks.video': 'Video',
    'talks.slides': 'Slides',
    'talks.page': 'Talk page',
    'talks.upcoming': 'upcoming',
    'talks.online': 'online',
    'talks.hybrid': 'offline + online',
    'cv.title': 'CV',
    'cv.about': 'About',
    'cv.experience': 'Experience',
    'cv.skills': 'Skills',
    'cv.talks': 'Talks',
    'cv.contacts': 'Contacts',
    'share.telegram': 'Copy link for Telegram',
    'share.copied': 'Copied',
  },
} as const;

export function t(lang: Lang) {
  return (key: keyof (typeof ui)['ru']) => ui[lang][key];
}

export function formatDate(date: Date, lang: Lang, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }) {
  return date.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-GB', { ...opts, timeZone: 'UTC' });
}

// Пары страниц для переключателя языка
export const altPaths: Record<string, string> = {
  '/': '/en/',
  '/en/': '/',
  '/cv/': '/en/cv/',
  '/en/cv/': '/cv/',
  '/talks/': '/en/talks/',
  '/en/talks/': '/talks/',
};
