// CV на двух языках. Источник — страница «Личный профиль» в Notion.
// Порядок опыта — от нового к старому.

type Lang = 'ru' | 'en';
type L10n = Record<Lang, string>;

export interface Job {
  role: L10n;
  company: L10n;
  project: L10n;
  period: L10n;
  points: Record<Lang, string[]>;
}

export const headline: L10n = {
  ru: 'Senior Frontend Developer в Яндекс Пэй',
  en: 'Senior Frontend Developer at Yandex Pay',
};

export const about: Record<Lang, string[]> = {
  ru: [
    '9+ лет коммерческой разработки, 5+ лет в Яндексе. Начинала с full-stack и до сих пор не могу устоять перед тем, чтобы заглянуть под капот Node.js. Широкая экспертиза в смежных областях: CI/CD, backend, базы данных.',
    'Год была тимлидом frontend-команды (2–6 человек), затем техлидом. Запускала проекты и крупные фичи от проработки требований и кастдевов до релиза. Проводила технические и финальные собеседования.',
    'Веду телеграм-канал @startpoint_dev с разборами Node.js, V8, libuv, Next.js. Выступаю на конференциях.',
  ],
  en: [
    '9+ years of commercial development, 5+ years at Yandex. Started as a full-stack developer and still can’t resist looking under the hood of Node.js. Broad expertise in adjacent areas: CI/CD, backend, databases.',
    'Led a frontend team of 2–6 engineers for a year, then worked as a tech lead. Launched projects and large features end-to-end — from requirements and customer interviews to release. Conducted technical and final interviews.',
    'I run the Telegram channel @startpoint_dev with deep dives into Node.js, V8, libuv and Next.js, and speak at conferences.',
  ],
};

export const skills = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'NestJS',
  'HTML', 'CSS', 'MongoDB', 'CI/CD', 'V8 internals',
];

export const jobs: Job[] = [
  {
    // TODO: уточнить дату перехода в Яндекс Пэй и описание задач
    role: { ru: 'Старшая frontend-разработчица', en: 'Senior Frontend Developer' },
    company: { ru: 'Яндекс', en: 'Yandex' },
    project: { ru: 'Яндекс Пэй', en: 'Yandex Pay' },
    period: { ru: '2025 — сейчас', en: '2025 — present' },
    points: { ru: [], en: [] },
  },
  {
    role: { ru: 'Техлид', en: 'Technical Lead' },
    company: { ru: 'Яндекс', en: 'Yandex' },
    project: { ru: 'Летние школы, Яндекс Контест', en: 'Summer Schools, Yandex Contest' },
    period: { ru: 'май 2024 — 2025', en: 'May 2024 — 2025' },
    points: {
      ru: [
        'За пару месяцев обновила LMS Летних школ (ШРИ, ШБР, ШМЯ и др.): визуальный редизайн и технические доработки, улучшение UX для менторов и студентов.',
        'В Яндекс Контесте — интерфейсы для администраторов и участников, бесшовный переезд с Webpack 4 на Vite, работа с легаси (i-bem), CI/CD, скриншотные тесты.',
      ],
      en: [
        'Revamped the Summer Schools LMS within a couple of months: visual redesign and technical improvements, better UX for mentors and students.',
        'At Yandex Contest: admin and participant interfaces, seamless migration from Webpack 4 to Vite, legacy (i-bem) maintenance, CI/CD, screenshot testing.',
      ],
    },
  },
  {
    role: { ru: 'Техлид', en: 'Technical Lead' },
    company: { ru: 'Яндекс', en: 'Yandex' },
    project: { ru: 'Проекты найма', en: 'Hiring products' },
    period: { ru: 'январь 2023 — апрель 2024', en: 'Jan 2023 — Apr 2024' },
    points: {
      ru: [
        'Вела проект по развитию внутренней карьеры сотрудников (поиск вакансий, грейдовое развитие), затем обновляла Яндекс Интервью.',
        'Фича-лидство и функции продакт-менеджера: защита фич, презентации, аналитика.',
        'Full-stack на Next.js + NestJS + MongoDB: миграции, бизнес-логика, cron-задачи, CI/CD.',
      ],
      en: [
        'Led an internal career-growth product (job search, grade development), then modernized Yandex Interview.',
        'Feature leadership with product-manager duties: pitching features, presentations, analytics.',
        'Full-stack with Next.js + NestJS + MongoDB: migrations, business logic, cron jobs, CI/CD.',
      ],
    },
  },
  {
    role: { ru: 'Тимлид', en: 'Team Lead' },
    company: { ru: 'Яндекс', en: 'Yandex' },
    project: { ru: 'Проекты найма', en: 'Hiring products' },
    period: { ru: 'январь 2022 — январь 2023', en: 'Jan 2022 — Jan 2023' },
    points: {
      ru: [
        'Тимлид frontend-команды (2–6 человек): сайт вакансий Яндекса, CRM для рекрутеров, платформа Яндекс Интервью.',
        'Выстроила команду и процессы, вела фичи, снижающие нагрузку на найм и усиливающие HR-бренд.',
        'Запустила миграцию CRM с i-bem на React. Наняла 4 разработчиков.',
      ],
      en: [
        'Led a frontend team of 2–6: Yandex careers site, recruiter CRM, Yandex Interview platform.',
        'Built the team and processes; drove features that reduced hiring workload and strengthened the employer brand.',
        'Kicked off the CRM migration from i-bem to React. Hired 4 engineers.',
      ],
    },
  },
  {
    role: { ru: 'Frontend-разработчик', en: 'Frontend Developer' },
    company: { ru: 'Яндекс', en: 'Yandex' },
    project: { ru: 'Яндекс Контест, проекты найма', en: 'Yandex Contest, hiring' },
    period: { ru: 'август 2021 — январь 2022', en: 'Aug 2021 — Jan 2022' },
    points: {
      ru: ['Интерфейсы One Day Offer и Weekend Offer на Яндекс Контесте: регистрация, отправка и проверка решений. Фича-лидство, настройка CI/CD-пайплайнов.'],
      en: ['Built One Day Offer and Weekend Offer flows on Yandex Contest: registration, submissions, grading. Feature leadership, CI/CD pipelines.'],
    },
  },
  {
    role: { ru: 'Frontend / Full-stack-разработчик', en: 'Frontend / Full-stack Developer' },
    company: { ru: 'First Line Software', en: 'First Line Software' },
    project: { ru: 'Маркетплейс строительной техники', en: 'Construction equipment marketplace' },
    period: { ru: 'август 2020 — июль 2021', en: 'Aug 2020 — Jul 2021' },
    points: {
      ru: [
        'Подняла frontend с нуля: Next.js, TypeScript, Styled Components, GraphQL (Apollo). Позже — full-stack на Node.js, Strapi, MongoDB, CI/CD на AWS.',
        'Спроектировала и реализовала реалтайм-аукцион с live-обновлениями.',
      ],
      en: [
        'Built the frontend from scratch: Next.js, TypeScript, Styled Components, GraphQL (Apollo). Later went full-stack with Node.js, Strapi, MongoDB, CI/CD on AWS.',
        'Designed and implemented an eBay-style real-time auction with live updates.',
      ],
    },
  },
  {
    role: { ru: 'Junior / Middle frontend-разработчик', en: 'Junior / Middle Frontend Developer' },
    company: { ru: 'First Line Software', en: 'First Line Software' },
    project: { ru: 'Гипермаркеты «Лента»', en: 'Lenta hypermarkets' },
    period: { ru: 'август 2018 — июль 2020', en: 'Aug 2018 — Jul 2020' },
    points: {
      ru: ['Сайт крупного ритейлера: каталог, фильтры, карточка товара, корзина. Выросла до старшего разработчика на проекте, курировала новичков, мигрировала проект на Preact с хуками.'],
      en: ['E-commerce site of a major retailer: catalog, filters, product page, cart. Grew to senior on the project, mentored juniors, migrated to Preact with hooks.'],
    },
  },
  {
    role: { ru: 'Junior full-stack-разработчик', en: 'Junior Full-stack Developer' },
    company: { ru: 'Пешкарики', en: 'Peshkariki' },
    project: { ru: 'Служба краудсорсинговой доставки', en: 'Crowdsourced delivery service' },
    period: { ru: 'декабрь 2017 — июль 2018', en: 'Dec 2017 — Jul 2018' },
    points: {
      ru: ['PHP (Yii) и jQuery, затем редизайн личного кабинета на Vue.js 2 — от макетов до реализации.'],
      en: ['PHP (Yii) and jQuery, then redesigned the user dashboard with Vue.js 2 — from mockups to implementation.'],
    },
  },
];
