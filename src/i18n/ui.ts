export type Lang = 'ru' | 'en';

export const ui = {
  ru: {
    'nav.home': 'главная',
    'nav.blog': 'статьи',
    'nav.talks': 'доклады',
    'nav.cv': 'cv',
    'theme.toggle': 'Переключить тему',
    'lang.switch': 'en',
    'home.series': 'циклы статей',
    'home.standalone': 'отдельные статьи',
    'section.all': 'все →',
    'blog.title': 'Статьи',
    'talks.title': 'Доклады',
    'talks.video': 'видео',
    'talks.slides': 'слайды',
    'talks.page': 'страница доклада',
    'talks.upcoming': 'скоро',
    'talks.online': 'онлайн',
    'talks.hybrid': 'офлайн + онлайн',
    'cv.title': 'CV',
    'cv.about': 'Обо мне',
    'cv.experience': 'Опыт',
    'cv.skills': 'Навыки',
    'cv.talks': 'Доклады',
    'cv.contacts': 'Контакты',
    'cv.education': 'Образование',
    'cv.beyond': 'Кроме работы',
    'share.telegram': 'скопировать ссылку для telegram',
    'link.newTab': 'откроется в новой вкладке',
    'share.copied': 'скопировано',
    'share.failed': 'не получилось скопировать',
  },
  en: {
    'nav.home': 'home',
    'nav.blog': 'articles',
    'nav.talks': 'talks',
    'nav.cv': 'cv',
    'theme.toggle': 'Toggle theme',
    'lang.switch': 'ru',
    'home.series': 'article series (in Russian)',
    'home.standalone': 'articles (in Russian)',
    'section.all': 'all →',
    'blog.title': 'Articles',
    'talks.title': 'Talks',
    'talks.video': 'video',
    'talks.slides': 'slides',
    'talks.page': 'talk page',
    'talks.upcoming': 'upcoming',
    'talks.online': 'online',
    'talks.hybrid': 'offline + online',
    'cv.title': 'CV',
    'cv.about': 'About',
    'cv.experience': 'Experience',
    'cv.skills': 'Skills',
    'cv.talks': 'Talks',
    'cv.contacts': 'Contacts',
    'cv.education': 'Education',
    'cv.beyond': 'Beyond work',
    'share.telegram': 'Copy link for Telegram',
    'share.copied': 'Copied',
    'share.failed': 'Could not copy',
    'link.newTab': 'opens in a new tab',
  },
} as const;

export function t(lang: Lang) {
  return (key: keyof (typeof ui)['ru']) => ui[lang][key];
}

export function formatDate(date: Date, lang: Lang, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }) {
  return date.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-GB', { ...opts, timeZone: 'UTC' });
}

export function formatIso(date: Date) {
  return date.toISOString().slice(0, 10);
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

export function partsLabel(n: number) {
  const word = n % 10 === 1 && n % 100 !== 11 ? 'часть'
    : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? 'части' : 'частей';
  return `${n} ${word}`;
}
