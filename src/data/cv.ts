// CV на двух языках. Русский текст опыта — дословно с Тильды (Notion, «Сайт-визитка»), не сокращать.
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
    { text: 'читала лекцию «Инфраструктура» (часть 2) в Школе разработки интерфейсов Яндекса в 2026 году;' },
    { text: 'преподавала школьникам основы программирования;' },
    { text: 'совместно с коллегой запустила авторский мини-курс по React и фронтенду;' },
    { text: 'в рамках него самостоятельно подготовила и провела 4 из 8 лекций, а также практические задания.' },
  ],
  en: [
    { text: 'gave the “Infrastructure” lecture (part 2) at the Yandex School of Interface Development in 2026;' },
    { text: 'taught programming basics to school students;' },
    { text: 'together with a colleague, launched my own short course on React and frontend;' },
    { text: 'as part of it, prepared and delivered 4 of the 8 lectures on my own, along with the practical assignments.' },
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
      ru: ['JavaScript', 'TypeScript', 'Node.js', 'HTML', 'CSS', 'Python, Go, PHP, Java и Kotlin — базово'],
      en: ['JavaScript', 'TypeScript', 'Node.js', 'HTML', 'CSS', 'Python, Go, PHP, Java and Kotlin (basic)'],
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
        'В настоящее время занимаюсь full-stack разработкой в платформе для бизнеса Яндекс Пэй. Реализую продуктовые фичи в нескольких микросервисах на бэкенде и во фронтенд-приложениях, а также в различных модулях для CMS (Битрикс, Тильда, WordPress).',
        'Активно внедряю и развиваю AI-инструменты в команде из 20+ человек, а также улучшаю свой личный AI-харнесс. Вклад в использование ИИ в команде позволяет увеличить скорость доставки фич, а также расширить количество сервисов, в которые может коммитить каждый разработчик.',
        'B2B-платформа — это сервис, который позволяет малому и среднему бизнесу подключать и настраивать оплаты на своих сайтах через Яндекс Пэй, а также работать над привлечением клиентов, интегрируясь с другими продуктами Яндекса (например, Яндекс Директ, Яндекс Доставка или Яндекс Поиск).',
      ],
      en: [
        'I currently do full-stack development on the Yandex Pay business platform. I build product features across several backend microservices and frontend applications, as well as in various CMS modules (Bitrix, Tilda, WordPress).',
        'I actively roll out and evolve AI tooling in a team of 20+ people and keep improving my personal AI harness. Bringing AI into the team’s work increases feature delivery speed and expands the number of services each developer can commit to.',
        'The B2B platform is a service that lets small and medium businesses connect and configure Yandex Pay payments on their websites and attract customers by integrating with other Yandex products (for example, Yandex Direct, Yandex Delivery or Yandex Search).',
      ],
    },
    stack: ['Python', 'Go', 'PostgreSQL', 'Terraform', 'TypeScript', 'React', 'Next.js', 'NestJS', 'Effector'],
  },
  {
    role: 'Senior Frontend Developer',
    company: { ru: 'Яндекс', en: 'Yandex' },
    project: { ru: 'Летние школы Яндекса, Яндекс Контест', en: 'Yandex Summer Schools, Yandex Contest' },
    period: { ru: 'май 2024 — январь 2026', en: 'May 2024 — Jan 2026' },
    points: {
      ru: [
        'Обновила интерфейс LMS для Летних школ (ШРИ, ШБР, ШМЯ и др.): визуальный редизайн и технические доработки за пару месяцев, как итог — улучшение UX для менторов и студентов, что повышает лояльность потенциальных кандидатов к Яндексу.',
        'После — переход в Яндекс Контест: работа над интерфейсами для администраторов и участников, технический апгрейд, в том числе: бесшовный переезд с Webpack 4 на Vite, работа с легаси (i-bem), поддержка CI/CD, покрытие фич скриншотными тестами.',
        'Сейчас Яндекс Контест является одной из важнейших площадок в образовательной деятельности Яндекса, а также участвует в части процессов, связанных с наймом (Летние школы, One Day Offer и т. д.).',
      ],
      en: [
        'Updated the LMS interface for the Summer Schools (School of Interface Development, School of Backend Development, School of Mobile Development and others): a visual redesign and technical improvements within a couple of months, resulting in better UX for mentors and students and higher loyalty of potential candidates to Yandex.',
        'Then moved to Yandex Contest: interfaces for administrators and participants and a technical upgrade, including a seamless migration from Webpack 4 to Vite, work with legacy code (i-bem), CI/CD support and screenshot test coverage for features.',
        'Yandex Contest is one of the key platforms of Yandex’s educational activities and is also part of hiring processes (Summer Schools, One Day Offer, etc.).',
      ],
    },
    stack: ['TypeScript', 'React', 'Redux Toolkit', 'Vite', 'pnpm', 'Testplane', 'i-bem', 'Java', 'Kotlin'],
  },
  {
    role: 'Middle / Senior Frontend Developer',
    company: { ru: 'Яндекс', en: 'Yandex' },
    project: { ru: 'Проекты найма', en: 'Hiring products' },
    period: { ru: 'январь 2023 — апрель 2024', en: 'Jan 2023 — Apr 2024' },
    points: {
      ru: [
        'Вела как техлид проект по развитию внутренней карьеры сотрудников (поиск вакансий, грейдовое развитие).',
        'Затем обновляла Яндекс Интервью — проект с высокой чувствительностью к качеству интерфейса и стабильности.',
        'Занималась фича-лидством, принимала на себя функции product manager: защита фичей, презентации, внутренняя аналитика.',
        'Разработка full-stack: Next.js + NestJS + MongoDB. Реализовывала простые миграции в БД, бизнес-логику, добавила cron-таски, настраивала и улучшала CI/CD.',
      ],
      en: [
        'Led, as tech lead, a project for employees’ internal career growth (job search, grade development).',
        'Then updated Yandex Interview — a project highly sensitive to interface quality and stability.',
        'Did feature leadership and took on product manager duties: defending features, presentations, internal analytics.',
        'Full-stack development: Next.js + NestJS + MongoDB. Implemented simple database migrations and business logic, added cron tasks, set up and improved CI/CD.',
      ],
    },
    stack: ['TypeScript', 'React', 'Next.js', 'NestJS', 'MongoDB', 'Effector', 'i-bem', 'Testplane'],
  },
  {
    role: 'Team Lead',
    company: { ru: 'Яндекс', en: 'Yandex' },
    project: { ru: 'Проекты найма', en: 'Hiring products' },
    period: { ru: 'январь 2022 — январь 2023', en: 'Jan 2022 — Jan 2023' },
    points: {
      ru: [
        'Тимлид frontend-команды (от 2 до 6 человек) в проектах по найму: сайт вакансий Яндекса, внутренняя CRM для рекрутеров и нанимающих менеджеров, платформа Яндекс Интервью.',
        'Формировала команду и процессы. Вела большие фичи, сокращающие нагрузку на найм (в т. ч. постановку AA-собеседований), и улучшающие HR-бренд.',
        'Стартовали технический рефакторинг CRM — миграция с i-bem на React.',
        'Проводила собеседования (технические и финальные), наняла 4 разработчиков, которые более 3 лет проработали в компании.',
        'Работала с CI, покрывала код автотестами (e2e, скриншотные).',
      ],
      en: [
        'Team lead of a frontend team (2 to 6 people) in hiring products: the Yandex careers site, an internal CRM for recruiters and hiring managers, and the Yandex Interview platform.',
        'Built the team and processes. Led large features that reduced the hiring workload (including scheduling of AA interviews) and improved the employer brand.',
        'Kicked off a technical refactoring of the CRM — a migration from i-bem to React.',
        'Conducted interviews (technical and final) and hired 4 developers, all of whom worked at the company for more than 3 years.',
        'Worked with CI and covered code with automated tests (e2e, screenshot).',
      ],
    },
    stack: ['TypeScript', 'React', 'Next.js', 'NestJS', 'MongoDB', 'Effector', 'i-bem', 'Testplane'],
  },
  {
    role: 'Frontend Developer',
    company: { ru: 'Яндекс', en: 'Yandex' },
    project: { ru: 'Яндекс Контест, проекты найма', en: 'Yandex Contest, hiring products' },
    period: { ru: 'август 2021 — январь 2022', en: 'Aug 2021 — Jan 2022' },
    points: {
      ru: [
        'Разработка интерфейса для мероприятий One Day Offer и Weekend Offer на платформе Яндекс Контест (регистрация, отправка решений, проверка).',
        'Фича-лидство. Работала с экосистемой внутренних CI/CD-инструментов Яндекса и участвовала в настройке пайплайнов.',
        'Также работала с легаси (i-bem, fist), несмотря на отсутствие экспертизы в команде.',
      ],
      en: [
        'Developed the interface for One Day Offer and Weekend Offer events on the Yandex Contest platform (registration, solution submission, grading).',
        'Feature leadership. Worked with the ecosystem of Yandex’s internal CI/CD tools and helped set up pipelines.',
        'Also worked with legacy code (i-bem, fist) despite the lack of expertise in the team.',
      ],
    },
    stack: ['TypeScript', 'React', 'Next.js', 'Effector', 'NestJS', 'Express', 'Docker', 'i-bem', 'fist'],
  },
  {
    role: 'Frontend Developer',
    company: { ru: 'First Line Software', en: 'First Line Software' },
    project: { ru: 'Маркетплейс строительной техники', en: 'Construction equipment marketplace' },
    period: { ru: 'август 2020 — июль 2021', en: 'Aug 2020 — Jul 2021' },
    points: {
      ru: [
        'Создавали маркетплейс строительной техники для зарубежного заказчика.',
        'Поднимала и разрабатывала frontend с нуля с использованием Next.js, TypeScript, Styled Components, GraphQL (Apollo).',
        'Позже перешла в full-stack (Node.js + Strapi + MongoDB): настраивала окружения, CI/CD на AWS, деплой на тест и прод.',
        'Реализовала карточки техники, каталог с фильтрами, лендинг и дашборды для админов (оптимизация MongoDB-запросов).',
        'Одной из ключевых фич стал реалтайм-аукцион (по аналогии с eBay). Разработала детальное техническое задание со статусами, таймерами и логикой переходов. Реализовала frontend-часть с live-обновлениями и взаимодействием с бэкендом.',
      ],
      en: [
        'We built a construction equipment marketplace for a foreign client.',
        'Set up and developed the frontend from scratch with Next.js, TypeScript, Styled Components and GraphQL (Apollo).',
        'Later moved to full-stack (Node.js + Strapi + MongoDB): set up environments, CI/CD on AWS, deployments to test and production.',
        'Implemented equipment cards, a catalog with filters, a landing page and admin dashboards (optimizing MongoDB queries).',
        'One of the key features was a real-time auction (similar to eBay). I wrote a detailed technical specification with statuses, timers and transition logic, and implemented the frontend with live updates and backend interaction.',
      ],
    },
    stack: ['TypeScript', 'React', 'Next.js', 'Styled Components', 'Apollo GraphQL', 'Node.js', 'Strapi', 'MongoDB', 'Stripe', 'Elasticsearch', 'AWS'],
  },
  {
    role: 'Junior / Middle Frontend Developer',
    company: { ru: 'First Line Software', en: 'First Line Software' },
    project: { ru: 'Сеть гипермаркетов «Лента»', en: 'Lenta hypermarket chain' },
    period: { ru: 'август 2018 — июль 2020', en: 'Aug 2018 — Jul 2020' },
    points: {
      ru: [
        'Работала над сайтом крупного ритейлера. Выросла с junior до старшего разработчика на проекте.',
        'Курировала начинающих фронтендеров, проводила code review. Мигрировала проект на новую версию Preact с поддержкой хуков.',
        'Основной фокус — frontend: каталог, фильтры, карточка товара, списки, корзина (поддержка IE11).',
        'Работала в полной продуктовой команде (PM, QA, backend, дизайн).',
      ],
      en: [
        'Worked on the website of a major retailer. Grew from junior to senior developer on the project.',
        'Mentored junior frontend developers and did code review. Migrated the project to a new version of Preact with hooks support.',
        'Main focus — frontend: catalog, filters, product page, lists, cart (IE11 support).',
        'Worked in a full product team (PM, QA, backend, design).',
      ],
    },
    stack: ['Preact', 'Stylus', 'Razor (C#)', 'GTM'],
  },
  {
    role: 'Junior Full-stack Developer',
    company: { ru: 'Пешкарики', en: 'Peshkariki' },
    project: { ru: 'Служба краудсорсинговой доставки', en: 'Crowdsourced delivery service' },
    period: { ru: 'декабрь 2017 — июль 2018', en: 'Dec 2017 — Jul 2018' },
    points: {
      ru: [
        'Начала работать во второй половине 3 курса. Проект был реализован на PHP (Yii 1) и jQuery. Сначала занималась исправлением ошибок и добавлением функциональности, позже — редизайном личного кабинета: подготовила макеты, затем реализовала их с использованием Vue.js 2 и Bootstrap 4.',
        'В процессе окончательно перешла с full-stack на frontend.',
      ],
      en: [
        'Started working in the second half of my third year at university. The project was built with PHP (Yii 1) and jQuery. At first I fixed bugs and added functionality, later redesigned the user dashboard: prepared the mockups and then implemented them with Vue.js 2 and Bootstrap 4.',
        'Along the way I fully switched from full-stack to frontend.',
      ],
    },
    stack: ['PHP (Yii 1)', 'jQuery', 'Vue.js 2', 'Bootstrap 4'],
  },
];
