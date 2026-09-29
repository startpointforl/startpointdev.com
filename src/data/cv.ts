// CV на двух языках. Источник — тексты с Тильды (Notion, «Сайт-визитка»).
// Порядок опыта — от нового к старому.

type Lang = 'ru' | 'en';
type L10n = Record<Lang, string>;

export interface Job {
  role: string;
  company: L10n;
  project: L10n;
  period: L10n;
  points: Record<Lang, string[]>;
  /** Основной стек на этом месте работы */
  stack?: string[];
}

export const headline: L10n = {
  ru: 'Senior frontend / full-stack developer в Яндекс Пэй',
  en: 'Senior frontend / full-stack developer at Yandex Pay',
};

export const location: L10n = {
  ru: 'Белград, Сербия',
  en: 'Belgrade, Serbia',
};

export const about: Record<Lang, string[]> = {
  ru: [
    'Коммерческой разработкой занимаюсь с декабря 2017 года, с программированием и вебом знакома с 2013. Сейчас — senior-разработчица в Яндексе. Выросла из full-stack’а на PHP и jQuery в эксперта по современному JavaScript и Node.js.',
    'Внутренняя кухня технологий — мой любимый фокус: люблю понимать, как всё устроено, и рассказывать об этом другим. Выступаю на конференциях, пишу статьи и веду Telegram-канал про разработку.',
    'Мне важны не только качество кода, но и качество процессов: участвовала в запуске проектов с нуля, проводила кастдевы, писала ТЗ, настраивала инфраструктуру и деплой, нанимала разработчиков.',
  ],
  en: [
    'I’ve been doing commercial development since December 2017 and have been into programming and the web since 2013. Now I’m a senior developer at Yandex. I grew from a PHP-and-jQuery full-stack developer into an expert in modern JavaScript and Node.js.',
    'The internals of technology are my favourite focus: I love understanding how things work under the hood and explaining it to others. I speak at conferences, write articles and run a Telegram channel about development.',
    'I care about the quality of processes as much as the quality of code: I’ve launched projects from scratch, run customer interviews, written specs, set up infrastructure and deployment, and hired developers.',
  ],
};

export const beyondWork: Record<Lang, { text: string; link?: { href: string; label: string } }[]> = {
  ru: [
    {
      text: 'читала лекцию «Инфраструктура» (часть 2) в Школе разработки интерфейсов Яндекса, 2026;',
      link: { href: 'https://www.youtube.com/watch?v=oUQauacFpBY', label: 'видео' },
    },
    { text: 'преподавала школьникам основы программирования;' },
    { text: 'вместе с коллегой запустила авторский мини-курс по React и фронтенду;' },
    { text: 'подготовила и провела 4 из 8 лекций курса и практические задания к ним.' },
  ],
  en: [
    {
      text: 'gave the “Infrastructure” lecture (part 2) at the Yandex School of Interface Development, 2026;',
      link: { href: 'https://www.youtube.com/watch?v=oUQauacFpBY', label: 'video, in Russian' },
    },
    { text: 'taught programming basics to school students;' },
    { text: 'co-launched a short course on React and frontend development;' },
    { text: 'prepared and delivered 4 of its 8 lectures along with the practical assignments.' },
  ],
};

export const education: L10n = {
  ru: 'Санкт-Петербургский политехнический университет Петра Великого, «Прикладная информатика», бакалавриат (2015–2019)',
  en: 'Peter the Great St. Petersburg Polytechnic University, BSc in Applied Computer Science (2015–2019)',
};

export const skills: { title: L10n; items: Record<Lang, string[]> }[] = [
  {
    title: { ru: 'Языки и технологии', en: 'Languages' },
    items: {
      ru: ['JavaScript', 'TypeScript', 'Node.js', 'HTML', 'CSS', 'Python, Go, PHP и Kotlin — базово'],
      en: ['JavaScript', 'TypeScript', 'Node.js', 'HTML', 'CSS', 'Python, Go, PHP and Kotlin (basic)'],
    },
  },
  {
    title: { ru: 'Фреймворки и библиотеки', en: 'Frameworks & libraries' },
    items: {
      ru: ['React', 'Preact', 'Next.js', 'NestJS', 'Effector', 'GraphQL', 'Apollo', 'Styled Components', 'CSS Modules'],
      en: ['React', 'Preact', 'Next.js', 'NestJS', 'Effector', 'GraphQL', 'Apollo', 'Styled Components', 'CSS Modules'],
    },
  },
  {
    title: { ru: 'Инфраструктура', en: 'Infrastructure' },
    items: {
      ru: ['CI/CD (внутренние инструменты Яндекса, AWS)', 'Docker', 'Terraform', 'балансировщики и деплой', 'PostgreSQL', 'MongoDB', 'Redis', 'Strapi', 'работа с легаси'],
      en: ['CI/CD (Yandex internal tools, AWS)', 'Docker', 'Terraform', 'load balancers and deployment', 'PostgreSQL', 'MongoDB', 'Redis', 'Strapi', 'legacy code'],
    },
  },
  {
    title: { ru: 'Тестирование', en: 'Testing' },
    items: {
      ru: ['unit', 'e2e', 'скриншотные и интеграционные тесты', 'Playwright', 'Testplane (Hermione)', 'Jest'],
      en: ['unit', 'e2e', 'screenshot and integration tests', 'Playwright', 'Testplane (Hermione)', 'Jest'],
    },
  },
  {
    title: { ru: 'Прочее', en: 'Other' },
    items: {
      ru: ['фича-лидство и тимлидство', 'проведение интервью', 'ТЗ и техническая аналитика', 'макеты в Figma', 'выступления и преподавание', 'AI-инструменты в разработке'],
      en: ['feature and team leadership', 'technical interviewing', 'specs and technical analysis', 'Figma mockups', 'public speaking and teaching', 'AI tooling for development'],
    },
  },
];

export const jobs: Job[] = [
  {
    role: 'Senior Full-stack Developer',
    company: { ru: 'Яндекс Пэй', en: 'Yandex Pay' },
    project: { ru: 'Платформа для бизнеса в финтехе', en: 'Business platform in fintech' },
    period: { ru: 'февраль 2026 — сейчас', en: 'Feb 2026 — present' },
    points: {
      ru: [
        'Full-stack-разработка в B2B-платформе Яндекс Пэй: продуктовые фичи в нескольких бэкенд-микросервисах, во фронтенд-приложениях и в модулях для CMS (Битрикс, Тильда, WordPress).',
        'Внедряю и развиваю AI-инструменты в команде из 20+ человек и улучшаю свой AI-харнесс. Это ускоряет доставку фич и расширяет число сервисов, в которые может коммитить каждый разработчик.',
        'Платформа позволяет малому и среднему бизнесу подключать оплаты через Яндекс Пэй на своих сайтах и привлекать клиентов через интеграции с другими продуктами Яндекса: Директом, Доставкой, Поиском.',
      ],
      en: [
        'Full-stack development on the Yandex Pay B2B platform: product features across several backend microservices, frontend apps and CMS modules (Bitrix, Tilda, WordPress).',
        'Rolling out and evolving AI tooling in a team of 20+ engineers and refining my own AI harness. This speeds up feature delivery and widens the set of services each engineer can contribute to.',
        'The platform lets small and medium businesses accept Yandex Pay payments on their websites and attract customers through integrations with other Yandex products such as Direct, Delivery and Search.',
      ],
    },
    stack: ['Python', 'Go', 'PostgreSQL', 'Terraform', 'TypeScript', 'React', 'Next.js', 'NestJS', 'Effector'],
  },
  {
    role: 'Senior Frontend Developer',
    company: { ru: 'Яндекс', en: 'Yandex' },
    project: { ru: 'Летние школы, Яндекс Контест', en: 'Summer Schools, Yandex Contest' },
    period: { ru: 'май 2024 — январь 2026', en: 'May 2024 — Jan 2026' },
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
    role: 'Middle / Senior Frontend Developer',
    company: { ru: 'Яндекс', en: 'Yandex' },
    project: { ru: 'Проекты найма', en: 'Hiring products' },
    period: { ru: 'январь 2023 — апрель 2024', en: 'Jan 2023 — Apr 2024' },
    points: {
      ru: [
        'Как техлид вела проект по развитию внутренней карьеры сотрудников (поиск вакансий, грейдовое развитие), затем обновляла Яндекс Интервью.',
        'Фича-лидство и функции продакт-менеджера: защита фич, презентации, внутренняя аналитика.',
        'Full-stack на Next.js + NestJS + MongoDB: миграции, бизнес-логика, cron-задачи, CI/CD.',
      ],
      en: [
        'As tech lead, drove an internal career-growth product (job search, grade development), then modernized Yandex Interview.',
        'Feature leadership with product-manager duties: pitching features, presentations, internal analytics.',
        'Full-stack with Next.js + NestJS + MongoDB: migrations, business logic, cron jobs, CI/CD.',
      ],
    },
  },
  {
    role: 'Team Lead',
    company: { ru: 'Яндекс', en: 'Yandex' },
    project: { ru: 'Проекты найма', en: 'Hiring products' },
    period: { ru: 'январь 2022 — январь 2023', en: 'Jan 2022 — Jan 2023' },
    points: {
      ru: [
        'Тимлид frontend-команды (2–6 человек): сайт вакансий Яндекса, CRM для рекрутеров и нанимающих менеджеров, платформа Яндекс Интервью.',
        'Выстроила команду и процессы, вела крупные фичи, снижающие нагрузку на найм и усиливающие HR-бренд. Запустила миграцию CRM с i-bem на React.',
        'Проводила технические и финальные собеседования, наняла 4 разработчиков — все проработали в компании больше трёх лет.',
      ],
      en: [
        'Led a frontend team of 2–6: the Yandex careers site, a CRM for recruiters and hiring managers, the Yandex Interview platform.',
        'Built the team and processes; drove large features that reduced hiring workload and strengthened the employer brand. Kicked off the CRM migration from i-bem to React.',
        'Ran technical and final interviews and hired 4 engineers, all of whom stayed with the company for 3+ years.',
      ],
    },
  },
  {
    role: 'Frontend Developer',
    company: { ru: 'Яндекс', en: 'Yandex' },
    project: { ru: 'Яндекс Контест, проекты найма', en: 'Yandex Contest, hiring' },
    period: { ru: 'август 2021 — январь 2022', en: 'Aug 2021 — Jan 2022' },
    points: {
      ru: ['Интерфейсы One Day Offer и Weekend Offer на Яндекс Контесте: регистрация, отправка и проверка решений. Фича-лидство, настройка CI/CD-пайплайнов, работа с легаси (i-bem, fist).'],
      en: ['Built One Day Offer and Weekend Offer flows on Yandex Contest: registration, submissions, grading. Feature leadership, CI/CD pipelines, legacy code (i-bem, fist).'],
    },
  },
  {
    role: 'Frontend Developer',
    company: { ru: 'First Line Software', en: 'First Line Software' },
    project: { ru: 'Маркетплейс строительной техники', en: 'Construction equipment marketplace' },
    period: { ru: 'август 2020 — июль 2021', en: 'Aug 2020 — Jul 2021' },
    points: {
      ru: [
        'Подняла frontend с нуля: Next.js, TypeScript, Styled Components, GraphQL (Apollo). Позже — full-stack на Node.js, Strapi, MongoDB, CI/CD на AWS.',
        'Спроектировала и реализовала реалтайм-аукцион по аналогии с eBay: ТЗ со статусами, таймерами и логикой переходов, frontend с live-обновлениями.',
      ],
      en: [
        'Built the frontend from scratch: Next.js, TypeScript, Styled Components, GraphQL (Apollo). Later went full-stack with Node.js, Strapi, MongoDB, CI/CD on AWS.',
        'Designed and built an eBay-style real-time auction: a spec with statuses, timers and transitions, and a frontend with live updates.',
      ],
    },
  },
  {
    role: 'Junior / Middle Frontend Developer',
    company: { ru: 'First Line Software', en: 'First Line Software' },
    project: { ru: 'Гипермаркеты «Лента»', en: 'Lenta hypermarkets' },
    period: { ru: 'август 2018 — июль 2020', en: 'Aug 2018 — Jul 2020' },
    points: {
      ru: ['Сайт крупного ритейлера: каталог, фильтры, карточка товара, корзина (с поддержкой IE11). Выросла до старшего разработчика на проекте, курировала новичков и проводила code review, мигрировала проект на Preact с хуками.'],
      en: ['E-commerce site of a major retailer: catalog, filters, product page, cart (with IE11 support). Grew to senior on the project, mentored juniors and did code review, migrated to Preact with hooks.'],
    },
  },
  {
    role: 'Junior Full-stack Developer',
    company: { ru: 'Пешкарики', en: 'Peshkariki' },
    project: { ru: 'Служба краудсорсинговой доставки', en: 'Crowdsourced delivery service' },
    period: { ru: 'декабрь 2017 — июль 2018', en: 'Dec 2017 — Jul 2018' },
    points: {
      ru: ['PHP (Yii 1) и jQuery, затем редизайн личного кабинета на Vue.js 2 и Bootstrap 4 — от макетов до реализации.'],
      en: ['PHP (Yii 1) and jQuery, then redesigned the user dashboard with Vue.js 2 and Bootstrap 4 — from mockups to implementation.'],
    },
  },
];
