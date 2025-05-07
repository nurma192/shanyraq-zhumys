Проект построен на Next.js с использованием TypeScript и SCSS. Ниже указано назначение основных папок и файлов фронтенда:

• .next и node_modules: служебные директории, автоматически создаются при сборке и установке зависимостей.
• public: статические файлы (шрифты, изображения, иконки).
• src/app: маршруты и страницы приложения.
– auth: страницы логина и регистрации.
– companies/[companyId]: страница компании с вложенными маршрутами (benefits, interviews, reviews, salaries).
– create: страницы для создания данных (benefit, interview, review, salary).
– profile: личный кабинет и связанные страницы (account-settings, contributions).
– search: страница поиска.
– layout.tsx: общий layout для приложения.
– page.tsx: корневая страница.
• src/components: переиспользуемые компоненты, сгруппированные по функционалу.
• src/features: хранилище и логика (Redux slice, API, типы) для различных сущностей (auth, company, review).
• src/hooks: пользовательские React-хуки (например, useAuth).
• src/services: общие сервисы (apiClient, reactQueryClient).
• src/store: конфигурация Redux store.
• src/styles: глобальные стили, переменные, миксины SCSS.
• src/utils: вспомогательные утилиты и функции.
• globals.css и globals.scss: глобальные стили.
• next.config.ts, tailwind.config.ts, postcss.config.mjs: конфигурационные файлы для Next.js, Tailwind, PostCSS.
• tsconfig.json: настройки TypeScript.
• package.json: список зависимостей и скриптов проекта.


my-glassdoor-clone/
├── .next/
├── node_modules/
├── public/
│   ├── fonts/
│   └── images/
│       ├── file.svg
│       ├── globe.svg
│       ├── next.svg
│       ├── vercel.svg
│       └── window.svg
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   ├── LoginPage.module.scss
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       ├── RegisterPage.module.scss
│   │   │       └── page.tsx
│   │   ├── companies/
│   │   │   ├── [companyId]/
│   │   │   │   ├── benefits/
│   │   │   │   │   ├── CompanyBenefitsPage.module.scss
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── interviews/
│   │   │   │   │   ├── CompanyInterviewsPage.module.scss
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── reviews/
│   │   │   │   │   ├── CompanyReviewsPage.module.scss
│   │   │   │   │   └── page.tsx
│   │   │   │   └── salaries/
│   │   │   │       ├── CompanySalariesPage.module.scss
│   │   │   │       └── page.tsx
│   │   │   ├── CompaniesPage.module.scss
│   │   │   └── page.tsx
│   │   ├── create/
│   │   │   ├── benefit/
│   │   │   │   ├── Benefit.module.scss
│   │   │   │   └── page.tsx
│   │   │   ├── interview/
│   │   │   │   ├── CreateInterviewPage.module.scss
│   │   │   │   └── page.tsx
│   │   │   ├── review/
│   │   │   │   ├── CreateReviewPage.module.scss
│   │   │   │   └── page.tsx
│   │   │   └── salary/
│   │   │       ├── CreateSalaryPage.module.scss
│   │   │       └── page.tsx
│   │   ├── profile/
│   │   │   ├── account-settings/
│   │   │   │   ├── ProfileAccountSettingsPage.module.scss
│   │   │   │   └── page.tsx
│   │   │   ├── contributions/
│   │   │   │   ├── ProfileContributionsPage.module.scss
│   │   │   │   └── page.tsx
│   │   │   ├── ProfilePage.module.scss
│   │   │   └── page.tsx
│   │   ├── search/
│   │   │   ├── SearchPage.module.scss
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── globals.scss
│   │   ├── layout.tsx
│   │   ├── middleware.ts
│   │   └── page.tsx
│   ├── components/
│   │   ├── auth/
│   │   ├── common/
│   │   ├── company/
│   │   ├── layout/
│   │   └── ui/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── authAPI.ts
│   │   │   ├── authSlice.ts
│   │   │   └── types.ts
│   │   ├── company/
│   │   │   ├── companyAPI.ts
│   │   │   ├── companySlice.ts
│   │   │   └── types.ts
│   │   └── review/
│   │       ├── reviewAPI.ts
│   │       ├── reviewSlice.ts
│   │       └── types.ts
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── services/
│   │   ├── apiClient.ts
│   │   └── reactQueryClient.ts
│   ├── store/
│   │   └── index.ts
│   ├── styles/
│   │   ├── components/
│   │   ├── globals.scss
│   │   ├── mixins.scss
│   │   └── variables.scss
│   └── utils/
│       └── helpers.ts
├── .gitignore
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json
