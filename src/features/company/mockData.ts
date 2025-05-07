// Расширяем стандартный интерфейс Review для передачи в компонент
export interface IReview {
  title: string;
  body: string;
  rating: number;
  author: string;
  date?: string;
  helpfulCount?: number;
  notHelpfulCount?: number;
  comments?: number;
}

export interface IInterview {
  id: string;
  position: string;
  difficulty: number;
  experience: "Положительный" | "Нейтральный" | "Негативный";
  outcome: "Offer" | "No offer" | "In progress";
  date: string;
  location: string;
  application: string;
  details: string;
  interviewQuestions: {
    question: string;
    answer: string;
  }[];
}

export interface ISalary {
  id: string;
  position: string;
  amount: string;
  min: number;
  max: number;
  median: number;
  additionalPay: number;
  currency: string;
  experienceLevel: string;
}

export interface ICompany {
  id: string;
  name: string;
  logoUrl: string;
  bannerImg: string;
  rating: number;
  location: string;
  industries: string[];
  size: string;
  description: string;
  overallInfo: {
    founded: string;
    revenue: string;
    mission: string;
    competitors: string[];
  };
  benefits: { title: string; description: string }[];
  interviews: IInterview[];
  salaries: ISalary[];
  reviews: IReview[];
  recommended: { id: string; name: string; logoUrl: string; rating: number }[];
  topCompanies: { id: string; name: string; rating: number }[];
}

export const mockCompanies: ICompany[] = [
  {
    id: "1",
    name: "IBM",
    logoUrl:
      "https://blog.logomaster.ai/hs-fs/hubfs/ibm-logo-1947.jpg?width=1344&height=908&name=ibm-logo-1947.jpg",
    bannerImg:
      "https://libg.s3.us-east-2.amazonaws.com/download/IBM-Headquarters.jpg",
    rating: 4.0,
    location: "Нью-Йорк, США",
    industries: ["Технологии", "Исследования"],
    size: "10000+",
    description: "IBM — одна из крупнейших в мире технологических корпораций.",
    overallInfo: {
      founded: "1911",
      revenue: ">$50 млрд",
      mission: "Создавать инновации для прогресса и развития бизнеса.",
      competitors: ["Microsoft", "Amazon", "Google"],
    },
    benefits: [
      {
        title: "Медицинская страховка",
        description: "Полный пакет для сотрудников.",
      },
      { title: "Гибкий график", description: "Возможность работать удалённо." },
      {
        title: "Оплачиваемый отпуск",
        description: "Стандартный отпуск 28 дней + больничные.",
      },
    ],
    interviews: [
      {
        id: "ibm-i1",
        position: "Software Engineer",
        difficulty: 3.2,
        experience: "Положительный",
        outcome: "No offer",
        date: "2025-02-25",
        location: "Bangalore Rural",
        application: "I interviewed at IBM (Bangalore Rural)",
        details:
          "2 раунда: технический и управленческий. Вопросы по ABAP, odata, cds view.",
        interviewQuestions: [
          {
            question: "What is code push down?",
            answer:
              "Перенос части логики в базу данных для оптимизации производительности.",
          },
        ],
      },
      {
        id: "ibm-i2",
        position: "Data Scientist",
        difficulty: 3.5,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-01-10",
        location: "Online",
        application: "I interviewed at IBM (Remote)",
        details:
          "Три собеседования: скрининг, алгоритмы, общение с менеджером. Спрашивали про ML и Python.",
        interviewQuestions: [
          {
            question: "Explain overfitting?",
            answer:
              "Overfitting — когда модель слишком точно подстраивается под обучающую выборку...",
          },
          {
            question: "Python vs R?",
            answer: "Обсудил преимущества Python для production.",
          },
        ],
      },
      {
        id: "ibm-i3",
        position: "DevOps Engineer",
        difficulty: 3.8,
        experience: "Нейтральный",
        outcome: "No offer",
        date: "2025-01-28",
        location: "New York",
        application: "I interviewed at IBM",
        details:
          "Основной упор был на CI/CD, Jenkins, Kubernetes. Два этапа: тех и HR.",
        interviewQuestions: [
          {
            question: "Опишите процедуру деплоя в Kubernetes",
            answer: "Helm чарты, манифесты YAML, пайплайн Jenkins.",
          },
        ],
      },
      {
        id: "ibm-i4",
        position: "Project Manager",
        difficulty: 3.0,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-02-05",
        location: "Remote",
        application: "HeadHunter/LinkedIn",
        details:
          "HR-скрининг, затем собеседование с руководителем, обсуждали Agile, работу с рисками.",
        interviewQuestions: [
          {
            question: "Расскажите про конфликт в команде и как вы его решали?",
            answer:
              "Привёл пример разрешения конфликтов с помощью ретроспективы.",
          },
        ],
      },
      {
        id: "ibm-i5",
        position: "Business Analyst",
        difficulty: 2.8,
        experience: "Негативный",
        outcome: "No offer",
        date: "2025-03-01",
        location: "New York",
        application: "Напрямую через сайт IBM",
        details:
          "Собеседование длилось 30 минут, казалось, что интервьюеру неинтересно. Вопросы поверхностные.",
        interviewQuestions: [
          {
            question: "Как анализировать требования стейкхолдеров?",
            answer:
              "Общий ответ без особых подробностей, собеседующий не уточнял.",
          },
        ],
      },
      {
        id: "ibm-i6",
        position: "SAP Consultant",
        difficulty: 3.2,
        experience: "Положительный",
        outcome: "In progress",
        date: "2025-03-02",
        location: "Bangalore",
        application: "Referral",
        details:
          "2 раунда: функционал SAP, ABAP, вопросы про модули FI/CO. Жду финального ответа.",
        interviewQuestions: [
          {
            question: "Что такое BAPI в SAP?",
            answer: "BAPI — это интерфейс доступа к бизнес-объектам SAP.",
          },
        ],
      },
      {
        id: "ibm-i7",
        position: "UX Designer",
        difficulty: 3.5,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-01-15",
        location: "Remote",
        application: "I interviewed at IBM",
        details:
          "Портфолио, тестовое задание, финал с арт-директором. Вопросы про user flows, wireframes.",
        interviewQuestions: [
          {
            question: "Опишите метод Design Thinking",
            answer:
              "Прояснение проблемы, эмпатия к пользователю, прототипирование, тестирование...",
          },
        ],
      },
      {
        id: "ibm-i8",
        position: "HR Specialist",
        difficulty: 2.5,
        experience: "Нейтральный",
        outcome: "No offer",
        date: "2025-02-12",
        location: "New York",
        application: "По рекомендации",
        details:
          "Пара общих вопросов об опыте, методах подбора, оценке кандидатов. Без технических деталей.",
        interviewQuestions: [
          {
            question: "Как проводите телефонный скрининг?",
            answer: "Рассказываю, что важно узнать мотивацию и базовые навыки.",
          },
        ],
      },
      {
        id: "ibm-i9",
        position: "QA Engineer",
        difficulty: 3.7,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-03-05",
        location: "Online",
        application: "Через рекрутера",
        details:
          "Основная часть — тестовое на тест-дизайн и работу с API. Пару вопросов про автоматизацию.",
        interviewQuestions: [
          {
            question: "Что такое Smoke-тест?",
            answer: "Быстрая проверка критической функциональности.",
          },
        ],
      },
      {
        id: "ibm-i10",
        position: "Intern",
        difficulty: 2.0,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-02-20",
        location: "Remote",
        application: "Университетская ярмарка вакансий",
        details:
          "Простые вопросы про учебные проекты и знание основ CS. HR сразу предложил стажировку.",
        interviewQuestions: [
          {
            question: "Какие проекты делали в универе?",
            answer: "Система управления библиотекой, сайт на React.",
          },
        ],
      },
    ],
    salaries: [
      {
        id: "ibm-s1",
        position: "Software Engineer",
        amount: "4000 USD/мес",
        min: 3500,
        max: 5000,
        median: 4300,
        additionalPay: 3000,
        currency: "USD",
        experienceLevel: "Entry-Mid",
      },
      {
        id: "ibm-s2",
        position: "Data Scientist",
        amount: "4500 USD/мес",
        min: 4000,
        max: 5500,
        median: 4600,
        additionalPay: 4500,
        currency: "USD",
        experienceLevel: "Mid",
      },
      {
        id: "ibm-s3",
        position: "Senior Consultant",
        amount: "5000 USD/мес",
        min: 4500,
        max: 6000,
        median: 5200,
        additionalPay: 4000,
        currency: "USD",
        experienceLevel: "Senior",
      },
      {
        id: "ibm-s4",
        position: "DevOps Engineer",
        amount: "4700 USD/мес",
        min: 4000,
        max: 5500,
        median: 4800,
        additionalPay: 3500,
        currency: "USD",
        experienceLevel: "Mid-Senior",
      },
      {
        id: "ibm-s5",
        position: "Project Manager",
        amount: "5300 USD/мес",
        min: 4800,
        max: 6500,
        median: 5400,
        additionalPay: 5000,
        currency: "USD",
        experienceLevel: "Senior",
      },
      {
        id: "ibm-s6",
        position: "Business Analyst",
        amount: "3800 USD/мес",
        min: 3500,
        max: 4500,
        median: 4000,
        additionalPay: 2000,
        currency: "USD",
        experienceLevel: "Entry-Mid",
      },
      {
        id: "ibm-s7",
        position: "SAP Consultant",
        amount: "5000 USD/мес",
        min: 4200,
        max: 6000,
        median: 5100,
        additionalPay: 3000,
        currency: "USD",
        experienceLevel: "Mid-Senior",
      },
      {
        id: "ibm-s8",
        position: "UX Designer",
        amount: "4500 USD/мес",
        min: 4000,
        max: 5200,
        median: 4600,
        additionalPay: 2500,
        currency: "USD",
        experienceLevel: "Mid",
      },
      {
        id: "ibm-s9",
        position: "HR Specialist",
        amount: "3500 USD/мес",
        min: 3000,
        max: 4200,
        median: 3500,
        additionalPay: 1000,
        currency: "USD",
        experienceLevel: "Entry",
      },
      {
        id: "ibm-s10",
        position: "QA Engineer",
        amount: "4100 USD/мес",
        min: 3500,
        max: 4800,
        median: 4000,
        additionalPay: 1500,
        currency: "USD",
        experienceLevel: "Mid",
      },
      {
        id: "ibm-s11",
        position: "Intern",
        amount: "2000 USD/мес",
        min: 1800,
        max: 2200,
        median: 2000,
        additionalPay: 0,
        currency: "USD",
        experienceLevel: "Intern",
      },
      {
        id: "ibm-s12",
        position: "Technical Sales",
        amount: "4200 USD/мес",
        min: 3500,
        max: 5000,
        median: 4200,
        additionalPay: 3000,
        currency: "USD",
        experienceLevel: "Mid",
      },
      {
        id: "ibm-s13",
        position: "Security Engineer",
        amount: "4800 USD/мес",
        min: 4200,
        max: 5500,
        median: 4700,
        additionalPay: 3500,
        currency: "USD",
        experienceLevel: "Mid-Senior",
      },
      {
        id: "ibm-s14",
        position: "Systems Architect",
        amount: "6000 USD/мес",
        min: 5500,
        max: 7000,
        median: 6000,
        additionalPay: 4000,
        currency: "USD",
        experienceLevel: "Senior",
      },
      {
        id: "ibm-s15",
        position: "Database Administrator",
        amount: "4200 USD/мес",
        min: 3700,
        max: 5000,
        median: 4300,
        additionalPay: 2000,
        currency: "USD",
        experienceLevel: "Mid",
      },
    ],
    reviews: [
      {
        title: "Отличное место",
        body: "Большие возможности для карьерного роста.",
        rating: 5,
        author: "Инженер",
      },
      {
        title: "Старая школа",
        body: "Много бюрократии, но в целом стабильная компания.",
        rating: 4,
        author: "Сотрудник",
      },
      {
        title: "Высокая конкуренция",
        body: "Система оценок сотрудников строгая, многие попадают в средние.",
        rating: 3,
        author: "DevOps",
      },
    ],
    recommended: [
      { id: "2", name: "Google", logoUrl: "/images/google.png", rating: 4.3 },
      {
        id: "3",
        name: "Microsoft",
        logoUrl: "/images/microsoft.png",
        rating: 4.2,
      },
    ],
    topCompanies: [
      { id: "14", name: "Bosch Mobility", rating: 3.8 },
      { id: "15", name: "Honeywell Int", rating: 3.9 },
    ],
  },
  {
    id: "2",
    name: "Google",
    logoUrl: "https://www.logo.wine/a/logo/Google/Google-Logo.wine.svg",
    bannerImg:
      "https://tweenui.com/blog/wp-content/uploads/2019/02/google-1024x523@2x.jpg",
    rating: 4.3,
    location: "Маунтин-Вью, США",
    industries: ["Интернет", "Реклама", "ПО"],
    size: "10000+",
    description: "Google — мировой лидер в сфере интернет-технологий.",
    overallInfo: {
      founded: "1998",
      revenue: ">$200 млрд",
      mission: "Упорядочить мировую информацию и сделать её доступной.",
      competitors: ["Microsoft", "Amazon", "Meta"],
    },
    benefits: [
      {
        title: "Бесплатное питание",
        description: "Разнообразные кафе на кампусе.",
      },
      {
        title: "Спортзал",
        description: "Тренажёрные залы и бассейн на территории.",
      },
      {
        title: "Стажировки",
        description: "Программы для студентов и выпускников.",
      },
    ],
    interviews: [
      {
        id: "google-i1",
        position: "Software Engineer",
        difficulty: 3.9,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-02-05",
        location: "Маунтин-Вью, США",
        application: "Applied via Google Careers",
        details:
          "Техническое собеседование по алгоритмам, структурам данных и системному дизайну.",
        interviewQuestions: [
          {
            question: "How do you optimize a binary search tree?",
            answer:
              "Обсудили самобалансирующиеся деревья, такие как AVL или Red-Black.",
          },
        ],
      },
      {
        id: "google-i2",
        position: "Data Scientist",
        difficulty: 3.7,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-01-20",
        location: "Remote",
        application: "Applied via online portal",
        details:
          "Вопросы по статистике, машинному обучению и Python. Всего 3 раунда.",
        interviewQuestions: [
          {
            question: "What is overfitting and how to prevent it?",
            answer:
              "Объяснил методы регуляризации, кросс-валидацию и использование dropout.",
          },
        ],
      },
      {
        id: "google-i3",
        position: "Product Manager",
        difficulty: 3.5,
        experience: "Нейтральный",
        outcome: "No offer",
        date: "2025-03-01",
        location: "Маунтин-Вью, США",
        application: "Referred by employee",
        details:
          "Обсуждение стратегии продукта, приоритезация фич и анализ рынка.",
        interviewQuestions: [
          {
            question: "How do you prioritize product features?",
            answer:
              "Привёл пример использования RICE и анализа бизнес-ценности.",
          },
        ],
      },
      {
        id: "google-i4",
        position: "UX Designer",
        difficulty: 3.4,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-02-10",
        location: "Remote",
        application: "Portfolio review",
        details:
          "Оценка портфолио, тестовое задание по редизайну интерфейса для мобильных приложений.",
        interviewQuestions: [
          {
            question: "What is your design process?",
            answer:
              "Объяснил этапы исследований, создания wireframe, прототипирования и тестирования.",
          },
        ],
      },
      {
        id: "google-i5",
        position: "DevOps Engineer",
        difficulty: 4.1,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-01-28",
        location: "Маунтин-Вью, США",
        application: "Applied via employee referral",
        details:
          "Собеседование по CI/CD, Docker, Kubernetes и оптимизации пайплайнов.",
        interviewQuestions: [
          {
            question: "How do you implement zero-downtime deployments?",
            answer:
              "Обсудили blue-green deployment и canary releases для минимизации простоя.",
          },
        ],
      },
      {
        id: "google-i6",
        position: "Security Engineer",
        difficulty: 4.3,
        experience: "Нейтральный",
        outcome: "No offer",
        date: "2025-02-15",
        location: "Remote",
        application: "Applied via Google Careers",
        details:
          "Вопросы по кибербезопасности, шифрованию, оценке уязвимостей и безопасности API.",
        interviewQuestions: [
          {
            question: "What is SSL and how does it work?",
            answer:
              "Объяснил процесс SSL handshake, использование сертификатов и шифрование данных.",
          },
        ],
      },
      {
        id: "google-i7",
        position: "Technical Program Manager",
        difficulty: 3.6,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-03-03",
        location: "Маунтин-Вью, США",
        application: "Referral",
        details:
          "Обсуждались вопросы управления проектами, координация команд и agile-подходы.",
        interviewQuestions: [
          {
            question: "How do you manage cross-functional teams?",
            answer:
              "Рассказывал о важности прозрачной коммуникации и регулярных стендапах.",
          },
        ],
      },
      {
        id: "google-i8",
        position: "Business Analyst",
        difficulty: 3.2,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-02-20",
        location: "Маунтин-Вью, США",
        application: "Applied via online application",
        details:
          "Вопросы по анализу данных, построению отчетности и оптимизации бизнес-процессов.",
        interviewQuestions: [
          {
            question: "How do you gather requirements from stakeholders?",
            answer:
              "Объяснил методы интервью, анкетирования и наблюдения за рабочими процессами.",
          },
        ],
      },
      {
        id: "google-i9",
        position: "Site Reliability Engineer",
        difficulty: 4.0,
        experience: "Нейтральный",
        outcome: "No offer",
        date: "2025-01-30",
        location: "Remote",
        application: "Applied via company website",
        details:
          "Сосредоточено на мониторинге, отказоустойчивости и управлении инцидентами.",
        interviewQuestions: [
          {
            question: "What are SLIs and SLOs?",
            answer:
              "Определил показатели уровня сервиса и цели, которых необходимо достигать.",
          },
        ],
      },
      {
        id: "google-i10",
        position: "Intern",
        difficulty: 2.0,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-03-05",
        location: "Remote",
        application: "University job fair",
        details:
          "Обсудили академические проекты, навыки программирования и базовые принципы разработки.",
        interviewQuestions: [
          {
            question: "What projects have you worked on?",
            answer:
              "Рассказывал о нескольких учебных проектах, включая веб-приложения на JavaScript.",
          },
        ],
      },
    ],
    salaries: [
      {
        id: "google-s1",
        position: "Software Engineer",
        amount: "6000 USD/мес",
        min: 5500,
        max: 7000,
        median: 6200,
        additionalPay: 4000,
        currency: "USD",
        experienceLevel: "Mid-Senior",
      },
      {
        id: "google-s2",
        position: "Data Scientist",
        amount: "5800 USD/мес",
        min: 5300,
        max: 6800,
        median: 5600,
        additionalPay: 3500,
        currency: "USD",
        experienceLevel: "Mid-Senior",
      },
      {
        id: "google-s3",
        position: "Product Manager",
        amount: "6500 USD/мес",
        min: 6000,
        max: 7500,
        median: 6300,
        additionalPay: 5000,
        currency: "USD",
        experienceLevel: "Senior",
      },
      {
        id: "google-s4",
        position: "UX Designer",
        amount: "5500 USD/мес",
        min: 5000,
        max: 6200,
        median: 5600,
        additionalPay: 3000,
        currency: "USD",
        experienceLevel: "Mid",
      },
      {
        id: "google-s5",
        position: "DevOps Engineer",
        amount: "6200 USD/мес",
        min: 5800,
        max: 7000,
        median: 6300,
        additionalPay: 4500,
        currency: "USD",
        experienceLevel: "Mid-Senior",
      },
      {
        id: "google-s6",
        position: "Security Engineer",
        amount: "6400 USD/мес",
        min: 6000,
        max: 7200,
        median: 6500,
        additionalPay: 4000,
        currency: "USD",
        experienceLevel: "Senior",
      },
      {
        id: "google-s7",
        position: "Technical Program Manager",
        amount: "7000 USD/мес",
        min: 6500,
        max: 8000,
        median: 6800,
        additionalPay: 5500,
        currency: "USD",
        experienceLevel: "Senior",
      },
      {
        id: "google-s8",
        position: "Business Analyst",
        amount: "5800 USD/мес",
        min: 5400,
        max: 6300,
        median: 5700,
        additionalPay: 3000,
        currency: "USD",
        experienceLevel: "Mid",
      },
      {
        id: "google-s9",
        position: "Site Reliability Engineer",
        amount: "6600 USD/мес",
        min: 6200,
        max: 7500,
        median: 6400,
        additionalPay: 5000,
        currency: "USD",
        experienceLevel: "Senior",
      },
      {
        id: "google-s10",
        position: "Intern",
        amount: "3000 USD/мес",
        min: 2800,
        max: 3200,
        median: 3000,
        additionalPay: 0,
        currency: "USD",
        experienceLevel: "Intern",
      },
      {
        id: "google-s11",
        position: "Sales Engineer",
        amount: "6300 USD/мес",
        min: 6000,
        max: 7200,
        median: 6400,
        additionalPay: 4500,
        currency: "USD",
        experienceLevel: "Mid-Senior",
      },
      {
        id: "google-s12",
        position: "Customer Success Manager",
        amount: "6000 USD/мес",
        min: 5500,
        max: 6800,
        median: 6100,
        additionalPay: 4000,
        currency: "USD",
        experienceLevel: "Mid",
      },
      {
        id: "google-s13",
        position: "Marketing Specialist",
        amount: "5700 USD/мес",
        min: 5300,
        max: 6300,
        median: 5600,
        additionalPay: 3500,
        currency: "USD",
        experienceLevel: "Mid",
      },
      {
        id: "google-s14",
        position: "Operations Manager",
        amount: "6800 USD/мес",
        min: 6300,
        max: 7500,
        median: 6600,
        additionalPay: 5000,
        currency: "USD",
        experienceLevel: "Senior",
      },
      {
        id: "google-s15",
        position: "Security Consultant",
        amount: "6500 USD/мес",
        min: 6000,
        max: 7200,
        median: 6400,
        additionalPay: 4000,
        currency: "USD",
        experienceLevel: "Senior",
      },
    ],
    reviews: [
      {
        title: "Инновации и культура",
        body: "Отличный коллектив, быстро меняющаяся среда.",
        rating: 4,
        author: "Менеджер",
      },
      {
        title: "Высокие ожидания",
        body: "Давление велико, но условия и компенсации отличные.",
        rating: 5,
        author: "Разработчик",
      },
    ],
    recommended: [
      { id: "1", name: "IBM", logoUrl: "/images/ibm.png", rating: 4.0 },
      {
        id: "3",
        name: "Microsoft",
        logoUrl: "/images/microsoft.png",
        rating: 4.2,
      },
    ],
    topCompanies: [
      { id: "14", name: "Bosch Mobility", rating: 3.8 },
      { id: "15", name: "Honeywell Int", rating: 3.9 },
    ],
  },

  {
    id: "3",
    name: "Microsoft",
    logoUrl:
      "https://pub-f8c0307ce82b4885975558b04e13a858.r2.dev/2012/08/8867.Microsoft_5F00_Logo_2D00_for_2D00_screen.jpg",
    bannerImg:
      "https://www.keysys.com/wp-content/uploads/2015/12/Microsoft-Banner.png",
    rating: 4.2,
    location: "Редмонд, США",
    industries: ["ПО", "Облачные решения"],
    size: "10000+",
    description:
      "Microsoft — глобальная корпорация, создающая ПО и облачные сервисы.",
    overallInfo: {
      founded: "1975",
      revenue: ">$150 млрд",
      mission: "Раскрыть потенциал каждого человека и каждой организации.",
      competitors: ["Google", "Amazon", "Apple"],
    },
    benefits: [
      {
        title: "Оплата обучения",
        description: "Компенсация курсов и сертификаций.",
      },
      {
        title: "ДМС",
        description: "Расширенная мед.страховка для сотрудника и семьи.",
      },
      {
        title: "Акции компании",
        description: "ESPP и RSU программы для сотрудников.",
      },
    ],
    interviews: [
      {
        id: "ms-i1",
        position: "Software Engineer",
        difficulty: 4.0,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-02-07",
        location: "Редмонд, США",
        application: "Applied via Microsoft Careers",
        details:
          "Техническое собеседование по алгоритмам, системному дизайну и C#.",
        interviewQuestions: [
          {
            question: "What are SOLID principles?",
            answer:
              "Объяснил принципы единственной ответственности, открытости/закрытости и т.д.",
          },
        ],
      },
      {
        id: "ms-i2",
        position: "Cloud Solutions Architect",
        difficulty: 4.2,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-02-15",
        location: "Редмонд, США",
        application: "Referred by employee",
        details:
          "Вопросы по архитектуре облачных решений, Azure и масштабируемости.",
        interviewQuestions: [
          {
            question: "How do you design a scalable cloud architecture?",
            answer:
              "Использовал микросервисную архитектуру с авто-масштабированием и load balancer.",
          },
        ],
      },
      {
        id: "ms-i3",
        position: "Data Analyst",
        difficulty: 3.7,
        experience: "Нейтральный",
        outcome: "No offer",
        date: "2025-01-25",
        location: "Редмонд, США",
        application: "Applied via online portal",
        details:
          "Вопросы по SQL, Power BI, анализу данных и визуализации отчетов.",
        interviewQuestions: [
          {
            question: "How do you optimize SQL queries?",
            answer:
              "Обсудил важность индексов, оптимизацию запросов и анализ execution plan.",
          },
        ],
      },
      {
        id: "ms-i4",
        position: "Product Manager",
        difficulty: 3.5,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-03-02",
        location: "Редмонд, США",
        application: "Referral",
        details:
          "Обсуждал опыт управления продуктами, составление roadmaps и agile-подходы.",
        interviewQuestions: [
          {
            question: "How do you balance technical and business requirements?",
            answer:
              "Подчеркнул важность приоритизации и тесного взаимодействия с командами разработки.",
          },
        ],
      },
      {
        id: "ms-i5",
        position: "DevOps Engineer",
        difficulty: 3.9,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-02-20",
        location: "Редмонд, США",
        application: "Applied via LinkedIn",
        details:
          "Собеседование по CI/CD, Docker, Kubernetes и автоматизации процессов.",
        interviewQuestions: [
          {
            question: "What is blue-green deployment?",
            answer:
              "Объяснил концепцию, позволяющую минимизировать downtime при релизе.",
          },
        ],
      },
      {
        id: "ms-i6",
        position: "QA Engineer",
        difficulty: 3.3,
        experience: "Нейтральный",
        outcome: "No offer",
        date: "2025-01-30",
        location: "Редмонд, США",
        application: "Applied via Microsoft Careers",
        details:
          "Вопросы по автоматизации тестирования, написанию тестовых сценариев и ручному тестированию.",
        interviewQuestions: [
          {
            question:
              "What is the difference between regression and smoke testing?",
            answer:
              "Разъяснил цели и особенности каждого вида тестирования с примерами.",
          },
        ],
      },
      {
        id: "ms-i7",
        position: "Technical Support Engineer",
        difficulty: 3.5,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-02-10",
        location: "Редмонд, США",
        application: "Internal referral",
        details:
          "Сосредоточено на диагностике проблем, поддержке клиентов и решении инцидентов.",
        interviewQuestions: [
          {
            question: "How do you troubleshoot system errors?",
            answer:
              "Рассказывал о системном подходе к диагностике и использовании логов.",
          },
        ],
      },
      {
        id: "ms-i8",
        position: "Security Engineer",
        difficulty: 4.1,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-03-04",
        location: "Редмонд, США",
        application: "Applied via Microsoft Careers",
        details:
          "Фокус на кибербезопасности, шифровании и методах защиты инфраструктуры.",
        interviewQuestions: [
          {
            question: "What is multi-factor authentication?",
            answer:
              "Объяснил принцип добавления второго уровня проверки, помимо пароля.",
          },
        ],
      },
      {
        id: "ms-i9",
        position: "Intern",
        difficulty: 2.0,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-03-06",
        location: "Редмонд, США",
        application: "University career fair",
        details:
          "Обсудили базовые навыки программирования, академические проекты и корпоративную культуру.",
        interviewQuestions: [
          {
            question: "What programming projects have you completed?",
            answer:
              "Поделился опытом разработки небольших веб-приложений и учебных проектов.",
          },
        ],
      },
      {
        id: "ms-i10",
        position: "Solutions Consultant",
        difficulty: 3.8,
        experience: "Нейтральный",
        outcome: "No offer",
        date: "2025-02-25",
        location: "Редмонд, США",
        application: "Applied via referral",
        details:
          "Обсуждались интеграционные решения, клиентские кейсы и консультативные услуги.",
        interviewQuestions: [
          {
            question: "How do you handle client requirements?",
            answer:
              "Опишу процесс сбора требований, анализа и разработки решения с учетом обратной связи.",
          },
        ],
      },
    ],
    salaries: [
      {
        id: "ms-s1",
        position: "Software Engineer",
        amount: "6200 USD/мес",
        min: 5800,
        max: 7000,
        median: 6300,
        additionalPay: 4500,
        currency: "USD",
        experienceLevel: "Mid-Senior",
      },
      {
        id: "ms-s2",
        position: "Cloud Solutions Architect",
        amount: "7500 USD/мес",
        min: 7000,
        max: 8500,
        median: 7300,
        additionalPay: 5000,
        currency: "USD",
        experienceLevel: "Senior",
      },
      {
        id: "ms-s3",
        position: "Data Analyst",
        amount: "6000 USD/мес",
        min: 5500,
        max: 6800,
        median: 6100,
        additionalPay: 4000,
        currency: "USD",
        experienceLevel: "Mid",
      },
      {
        id: "ms-s4",
        position: "Product Manager",
        amount: "6800 USD/мес",
        min: 6300,
        max: 7600,
        median: 6500,
        additionalPay: 5500,
        currency: "USD",
        experienceLevel: "Senior",
      },
      {
        id: "ms-s5",
        position: "DevOps Engineer",
        amount: "6400 USD/мес",
        min: 6000,
        max: 7200,
        median: 6500,
        additionalPay: 5000,
        currency: "USD",
        experienceLevel: "Mid-Senior",
      },
      {
        id: "ms-s6",
        position: "QA Engineer",
        amount: "5800 USD/мес",
        min: 5400,
        max: 6300,
        median: 5700,
        additionalPay: 3500,
        currency: "USD",
        experienceLevel: "Mid",
      },
      {
        id: "ms-s7",
        position: "Technical Support Engineer",
        amount: "6000 USD/мес",
        min: 5600,
        max: 6800,
        median: 6100,
        additionalPay: 4000,
        currency: "USD",
        experienceLevel: "Mid",
      },
      {
        id: "ms-s8",
        position: "Security Engineer",
        amount: "6800 USD/мес",
        min: 6300,
        max: 7200,
        median: 6500,
        additionalPay: 4500,
        currency: "USD",
        experienceLevel: "Senior",
      },
      {
        id: "ms-s9",
        position: "Intern",
        amount: "3200 USD/мес",
        min: 3000,
        max: 3500,
        median: 3200,
        additionalPay: 0,
        currency: "USD",
        experienceLevel: "Intern",
      },
      {
        id: "ms-s10",
        position: "Solutions Consultant",
        amount: "7000 USD/мес",
        min: 6500,
        max: 8000,
        median: 6800,
        additionalPay: 5000,
        currency: "USD",
        experienceLevel: "Senior",
      },
      {
        id: "ms-s11",
        position: "Cloud Engineer",
        amount: "6600 USD/мес",
        min: 6200,
        max: 7300,
        median: 6400,
        additionalPay: 4500,
        currency: "USD",
        experienceLevel: "Mid-Senior",
      },
      {
        id: "ms-s12",
        position: "Business Analyst",
        amount: "6000 USD/мес",
        min: 5500,
        max: 6700,
        median: 6100,
        additionalPay: 4000,
        currency: "USD",
        experienceLevel: "Mid",
      },
      {
        id: "ms-s13",
        position: "Marketing Specialist",
        amount: "5900 USD/мес",
        min: 5500,
        max: 6300,
        median: 5700,
        additionalPay: 3500,
        currency: "USD",
        experienceLevel: "Mid",
      },
      {
        id: "ms-s14",
        position: "Operations Manager",
        amount: "6800 USD/мес",
        min: 6300,
        max: 7500,
        median: 6600,
        additionalPay: 5000,
        currency: "USD",
        experienceLevel: "Senior",
      },
      {
        id: "ms-s15",
        position: "Security Consultant",
        amount: "6500 USD/мес",
        min: 6000,
        max: 7200,
        median: 6400,
        additionalPay: 4000,
        currency: "USD",
        experienceLevel: "Senior",
      },
    ],
    reviews: [
      {
        title: "Корпоративная культура",
        body: "Хорошие возможности обучения, но процесс может быть бюрократичным.",
        rating: 4,
        author: "Аналитик",
      },
      {
        title: "Отличная команда",
        body: "Работать интересно, продукты мирового уровня.",
        rating: 5,
        author: "Разработчик",
      },
    ],
    recommended: [
      { id: "2", name: "Google", logoUrl: "/images/google.png", rating: 4.3 },
      { id: "4", name: "Apple", logoUrl: "/images/apple.png", rating: 4.1 },
    ],
    topCompanies: [
      { id: "14", name: "Bosch Mobility", rating: 3.8 },
      { id: "15", name: "Honeywell Int", rating: 3.9 },
    ],
  },
  {
    id: "4",
    name: "Apple",
    logoUrl:
      "https://graphicsprings.com/wp-content/uploads/2023/07/image-58-1024x512.png.webp",
    bannerImg:
      "https://connect-assets.prosple.com/cdn/ff/O2IMzWy_ZQkq0aW_tm81Ra48iSWtGl2yKJzEepiUDf8/1654605318/public/styles/scale_and_crop_center_890x320/public/2022-06/banner-apple-india-1786x642-2022.jpg?itok=MnVgguSR",
    rating: 4.1,
    location: "Купертино, США",
    industries: ["ПО", "Аппаратное обеспечение"],
    size: "10000+",
    description: "Apple — компания, меняющая подход к технологиям и дизайну.",
    overallInfo: {
      founded: "1976",
      revenue: ">$200 млрд",
      mission: "Создавать лучшие устройства и ПО для улучшения жизни людей.",
      competitors: ["Samsung", "Microsoft", "Google"],
    },
    benefits: [
      {
        title: "Скидки на продукцию",
        description: "Специальные цены для сотрудников.",
      },
      { title: "Пакет здоровья", description: "Страховка, спорт, отдых." },
      { title: "ESPP", description: "Программа покупки акций со скидкой." },
    ],
    interviews: [
      {
        id: "apple-i1",
        position: "UI/UX Designer",
        difficulty: 3.7,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-02-01",
        location: "Купертино, США",
        application: "Applied via Apple Careers",
        details: "Тестовое задание и оценка портфолио.",
        interviewQuestions: [
          {
            question: "Какие принципы лежат в основе вашего дизайна?",
            answer:
              "Использую простоту, удобство и соответствие фирменному стилю Apple.",
          },
        ],
      },
      {
        id: "apple-i2",
        position: "Hardware Engineer",
        difficulty: 4.0,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-02-03",
        location: "Купертино, США",
        application: "Referral",
        details: "Глубокие вопросы по схемотехнике и системному дизайну.",
        interviewQuestions: [
          {
            question: "Как вы подходите к оптимизации схемотехники?",
            answer:
              "Использую симуляции и оптимизирую компоненты для снижения энергопотребления.",
          },
        ],
      },
      {
        id: "apple-i3",
        position: "Software Engineer",
        difficulty: 4.2,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-02-05",
        location: "Купертино, США",
        application: "Applied via Apple Careers",
        details:
          "Техническое собеседование по алгоритмам, OOP и системному дизайну.",
        interviewQuestions: [
          {
            question: "Расскажите о вашем опыте оптимизации алгоритмов.",
            answer:
              "Привёл пример оптимизации поиска с использованием хэш-таблиц.",
          },
        ],
      },
      {
        id: "apple-i4",
        position: "Project Manager",
        difficulty: 3.5,
        experience: "Нейтральный",
        outcome: "No offer",
        date: "2025-02-07",
        location: "Купертино, США",
        application: "Online application",
        details: "HR-интервью, вопросы по agile и управлению проектами.",
        interviewQuestions: [
          {
            question: "Как вы мотивируете команду в условиях дедлайна?",
            answer:
              "Использую четкое планирование и регулярную обратную связь.",
          },
        ],
      },
      {
        id: "apple-i5",
        position: "Data Scientist",
        difficulty: 3.8,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-02-10",
        location: "Купертино, США",
        application: "Referred by employee",
        details: "Вопросы по статистике, машинному обучению и Python.",
        interviewQuestions: [
          {
            question: "Что такое overfitting и как его избежать?",
            answer: "Применяю регуляризацию, кросс-валидацию и dropout.",
          },
        ],
      },
      {
        id: "apple-i6",
        position: "DevOps Engineer",
        difficulty: 3.9,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-02-12",
        location: "Купертино, США",
        application: "Applied via referral",
        details:
          "Вопросы по CI/CD, Docker, Kubernetes и оптимизации пайплайнов.",
        interviewQuestions: [
          {
            question: "Как настроить zero-downtime deployment?",
            answer: "Использую blue-green deployment и canary releases.",
          },
        ],
      },
      {
        id: "apple-i7",
        position: "Security Engineer",
        difficulty: 4.1,
        experience: "Нейтральный",
        outcome: "No offer",
        date: "2025-02-14",
        location: "Купертино, США",
        application: "Online application",
        details:
          "Собеседование по вопросам безопасности, шифрования и защиты данных.",
        interviewQuestions: [
          {
            question: "Что такое secure enclave?",
            answer:
              "Аппаратно изолированная область для хранения конфиденциальных данных.",
          },
        ],
      },
      {
        id: "apple-i8",
        position: "Intern",
        difficulty: 2.5,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-02-16",
        location: "Купертино, США",
        application: "University job fair",
        details:
          "Обсудили академические проекты и базовые навыки программирования.",
        interviewQuestions: [
          {
            question: "Какие проекты вы реализовывали в университете?",
            answer: "Разрабатывал небольшие веб-приложения на React и Node.js.",
          },
        ],
      },
      {
        id: "apple-i9",
        position: "Technical Writer",
        difficulty: 3.0,
        experience: "Нейтральный",
        outcome: "No offer",
        date: "2025-02-18",
        location: "Купертино, США",
        application: "Applied via Apple Careers",
        details:
          "Вопросы по написанию технической документации и описанию продуктов.",
        interviewQuestions: [
          {
            question: "Как вы структурируете техническую документацию?",
            answer:
              "Использую четкую структуру, разделяя введение, описание и примеры.",
          },
        ],
      },
      {
        id: "apple-i10",
        position: "Customer Support Specialist",
        difficulty: 2.8,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-02-20",
        location: "Купертино, США",
        application: "Referral",
        details:
          "Собеседование по коммуникационным навыкам и решению клиентских проблем.",
        interviewQuestions: [
          {
            question:
              "Как вы справляетесь с конфликтными ситуациями с клиентами?",
            answer:
              "Стараюсь сохранять спокойствие, выслушивать и искать компромисс.",
          },
        ],
      },
    ],
    reviews: [
      {
        title: "Стремление к совершенству",
        body: "Высокие требования, но и большие награды.",
        rating: 5,
        author: "Дизайнер",
      },
      {
        title: "Много работы",
        body: "Иногда переработки, но проекты всемирно известны.",
        rating: 4,
        author: "Инженер",
      },
    ],
    salaries: [
      {
        id: "apple-s1",
        position: "UI/UX Designer",
        amount: "4500 USD/мес",
        min: 4000,
        max: 5000,
        median: 4500,
        additionalPay: 2000,
        currency: "USD",
        experienceLevel: "Mid",
      },
      {
        id: "apple-s2",
        position: "Hardware Engineer",
        amount: "5500 USD/мес",
        min: 5000,
        max: 6000,
        median: 5500,
        additionalPay: 2500,
        currency: "USD",
        experienceLevel: "Mid-Senior",
      },
      {
        id: "apple-s3",
        position: "Software Engineer",
        amount: "6000 USD/мес",
        min: 5500,
        max: 6500,
        median: 6000,
        additionalPay: 3000,
        currency: "USD",
        experienceLevel: "Mid-Senior",
      },
      {
        id: "apple-s4",
        position: "Project Manager",
        amount: "6500 USD/мес",
        min: 6000,
        max: 7000,
        median: 6500,
        additionalPay: 3500,
        currency: "USD",
        experienceLevel: "Senior",
      },
      {
        id: "apple-s5",
        position: "Data Scientist",
        amount: "6200 USD/мес",
        min: 5800,
        max: 6800,
        median: 6200,
        additionalPay: 3200,
        currency: "USD",
        experienceLevel: "Mid-Senior",
      },
      {
        id: "apple-s6",
        position: "DevOps Engineer",
        amount: "6300 USD/мес",
        min: 5900,
        max: 6800,
        median: 6300,
        additionalPay: 3300,
        currency: "USD",
        experienceLevel: "Mid-Senior",
      },
      {
        id: "apple-s7",
        position: "Security Engineer",
        amount: "6400 USD/мес",
        min: 6000,
        max: 6900,
        median: 6400,
        additionalPay: 3400,
        currency: "USD",
        experienceLevel: "Senior",
      },
      {
        id: "apple-s8",
        position: "Intern",
        amount: "3000 USD/мес",
        min: 2800,
        max: 3200,
        median: 3000,
        additionalPay: 0,
        currency: "USD",
        experienceLevel: "Intern",
      },
      {
        id: "apple-s9",
        position: "Technical Writer",
        amount: "4200 USD/мес",
        min: 4000,
        max: 4500,
        median: 4200,
        additionalPay: 1500,
        currency: "USD",
        experienceLevel: "Entry-Mid",
      },
      {
        id: "apple-s10",
        position: "Customer Support Specialist",
        amount: "4000 USD/мес",
        min: 3800,
        max: 4200,
        median: 4000,
        additionalPay: 1000,
        currency: "USD",
        experienceLevel: "Entry",
      },
      {
        id: "apple-s11",
        position: "Marketing Specialist",
        amount: "5500 USD/мес",
        min: 5200,
        max: 6000,
        median: 5500,
        additionalPay: 2500,
        currency: "USD",
        experienceLevel: "Mid",
      },
      {
        id: "apple-s12",
        position: "Operations Manager",
        amount: "7000 USD/мес",
        min: 6500,
        max: 7500,
        median: 7000,
        additionalPay: 4000,
        currency: "USD",
        experienceLevel: "Senior",
      },
      {
        id: "apple-s13",
        position: "Product Manager",
        amount: "6800 USD/мес",
        min: 6400,
        max: 7200,
        median: 6800,
        additionalPay: 3500,
        currency: "USD",
        experienceLevel: "Senior",
      },
      {
        id: "apple-s14",
        position: "Cloud Engineer",
        amount: "6600 USD/мес",
        min: 6200,
        max: 7000,
        median: 6600,
        additionalPay: 3000,
        currency: "USD",
        experienceLevel: "Mid-Senior",
      },
      {
        id: "apple-s15",
        position: "Business Analyst",
        amount: "6000 USD/мес",
        min: 5600,
        max: 6400,
        median: 6000,
        additionalPay: 2800,
        currency: "USD",
        experienceLevel: "Mid",
      },
    ],
    recommended: [
      {
        id: "3",
        name: "Microsoft",
        logoUrl: "/images/microsoft.png",
        rating: 4.2,
      },
      {
        id: "5",
        name: "JPMorganChase",
        logoUrl: "/images/jpmc.png",
        rating: 4.0,
      },
    ],
    topCompanies: [
      { id: "14", name: "Bosch Mobility", rating: 3.8 },
      { id: "15", name: "Honeywell Int", rating: 3.9 },
    ],
  },
  {
    id: "28",
    name: "EY",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c2/EY_logo.svg",
    bannerImg:
      "https://www.ey.com/content/dam/ey-sites/ey-com/en_us/topics/diversity/ey-diversity-inclusion-belonging-hero-image.jpg",
    rating: 3.8,
    location: "Лондон, Великобритания",
    industries: ["Аудит", "Консалтинг"],
    size: "10000+",
    description:
      "EY — одна из крупнейших аудиторско-консультационных фирм в мире.",
    overallInfo: {
      founded: "1989",
      revenue: ">$35 млрд",
      mission: "Создавать качественные услуги и строить доверие к бизнесу.",
      competitors: ["Deloitte", "PwC", "KPMG"],
    },
    benefits: [
      {
        title: "Обучение и сертификации",
        description: "Поддержка ACCA, CPA и др.",
      },
      {
        title: "Премии за привлечение клиентов",
        description: "Финансовые бонусы при расширении бизнеса.",
      },
    ],
    interviews: [
      {
        id: "ey-i1",
        position: "Tax Consultant",
        difficulty: 3.3,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-02-10",
        location: "Лондон, Великобритания",
        application: "Applied via EY Careers",
        details:
          "Обсуждение налогового законодательства, кейс на внимательность и знание международного налогообложения.",
        interviewQuestions: [
          {
            question: "Какие налоговые режимы вам знакомы?",
            answer:
              "Расскажу о налоговых вычетах, льготах и международном налогообложении в разных юрисдикциях.",
          },
        ],
      },
      {
        id: "ey-i2",
        position: "Audit Associate",
        difficulty: 3.4,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-02-12",
        location: "Лондон, Великобритания",
        application: "Applied via онлайн-портал",
        details:
          "Собеседование по технике аудита, оценке рисков и проверке финансовой отчетности.",
        interviewQuestions: [
          {
            question: "Как вы проводите аудит финансовой отчетности?",
            answer:
              "Следую международным стандартам аудита, детально анализирую документы и сопоставляю показатели с отраслевыми нормами.",
          },
        ],
      },
      {
        id: "ey-i3",
        position: "Consultant",
        difficulty: 3.6,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-02-15",
        location: "Лондон, Великобритания",
        application: "Referred by employee",
        details:
          "Вопросы по стратегии бизнеса, оптимизации процессов и консультированию клиентов в крупных проектах.",
        interviewQuestions: [
          {
            question: "Как вы решаете сложные бизнес-задачи?",
            answer:
              "Применяю аналитический подход, структурированный анализ и рекомендации, основанные на данных.",
          },
        ],
      },
      {
        id: "ey-i4",
        position: "Risk Manager",
        difficulty: 3.8,
        experience: "Нейтральный",
        outcome: "Offer",
        date: "2025-02-18",
        location: "Лондон, Великобритания",
        application: "Applied via EY Careers",
        details:
          "Обсуждение методов оценки и минимизации корпоративных рисков с использованием качественных и количественных методов.",
        interviewQuestions: [
          {
            question: "Как вы оцениваете риски в организации?",
            answer:
              "Использую SWOT-анализ, количественные модели и экспертную оценку для определения приоритетов рисков.",
          },
        ],
      },
      {
        id: "ey-i5",
        position: "Internal Auditor",
        difficulty: 3.5,
        experience: "Положительный",
        outcome: "No offer",
        date: "2025-02-20",
        location: "Лондон, Великобритания",
        application: "Applied via онлайн-портал",
        details:
          "Вопросы по аудиту внутренних процессов, выявлению несоответствий и оптимизации процедур.",
        interviewQuestions: [
          {
            question:
              "Какие шаги вы предпринимаете для проведения внутреннего аудита?",
            answer:
              "Провожу предварительный анализ, разрабатываю план аудита и тщательно проверяю документацию.",
          },
        ],
      },
      {
        id: "ey-i6",
        position: "Forensic Accountant",
        difficulty: 4.0,
        experience: "Нейтральный",
        outcome: "In progress",
        date: "2025-02-22",
        location: "Лондон, Великобритания",
        application: "Applied via EY Careers",
        details:
          "Кейс на выявление финансовых нарушений, анализ документов и поиск аномалий в отчетности.",
        interviewQuestions: [
          {
            question: "Как выявить признаки мошенничества в отчетности?",
            answer:
              "Использую сравнительный анализ, статистические методы и детальную проверку транзакций.",
          },
        ],
      },
      {
        id: "ey-i7",
        position: "Business Analyst",
        difficulty: 3.6,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-02-25",
        location: "Лондон, Великобритания",
        application: "Applied via EY Careers",
        details:
          "Обсуждение методов анализа бизнес-процессов, сбора требований и построения отчетности.",
        interviewQuestions: [
          {
            question: "Какие инструменты вы используете для анализа данных?",
            answer:
              "Работаю с Excel, Power BI и специализированными аналитическими программами.",
          },
        ],
      },
      {
        id: "ey-i8",
        position: "Senior Auditor",
        difficulty: 3.9,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-02-27",
        location: "Лондон, Великобритания",
        application: "Applied via EY Careers",
        details:
          "Сложное собеседование по аудиторским стандартам, внутреннему контролю и управлению процессами.",
        interviewQuestions: [
          {
            question: "Как улучшить эффективность аудита?",
            answer:
              "Рекомендую автоматизировать процессы, использовать IT-решения и регулярно повышать квалификацию команды.",
          },
        ],
      },
      {
        id: "ey-i9",
        position: "Financial Analyst",
        difficulty: 3.7,
        experience: "Нейтральный",
        outcome: "Offer",
        date: "2025-03-01",
        location: "Лондон, Великобритания",
        application: "Applied via онлайн-портал",
        details:
          "Обсуждение методов прогнозирования, анализа финансовых данных и оценки инвестиционных проектов.",
        interviewQuestions: [
          {
            question: "Как вы прогнозируете финансовые показатели?",
            answer:
              "Использую исторические данные, трендовый анализ и финансовые модели для точного прогнозирования.",
          },
        ],
      },
      {
        id: "ey-i10",
        position: "Management Consultant",
        difficulty: 3.8,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-03-03",
        location: "Лондон, Великобритания",
        application: "Applied via EY Careers",
        details:
          "Кейс по стратегии, анализу рыночных трендов и разработке рекомендаций для клиента.",
        interviewQuestions: [
          {
            question:
              "Как вы разрабатываете стратегические рекомендации для клиента?",
            answer:
              "Провожу детальный анализ рынка, использую SWOT-анализ и строю модели для определения оптимальной стратегии.",
          },
        ],
      },
    ],
    salaries: [
      {
        id: "ey-s1",
        position: "Tax Consultant",
        amount: "3400 USD/мес",
        min: 3100,
        max: 3700,
        median: 3400,
        additionalPay: 1200,
        currency: "USD",
        experienceLevel: "Entry-Mid",
      },
      {
        id: "ey-s2",
        position: "Audit Associate",
        amount: "3600 USD/мес",
        min: 3300,
        max: 3900,
        median: 3600,
        additionalPay: 1300,
        currency: "USD",
        experienceLevel: "Entry-Mid",
      },
      {
        id: "ey-s3",
        position: "Consultant",
        amount: "4000 USD/мес",
        min: 3700,
        max: 4300,
        median: 4000,
        additionalPay: 1500,
        currency: "USD",
        experienceLevel: "Mid",
      },
      {
        id: "ey-s4",
        position: "Risk Manager",
        amount: "4200 USD/мес",
        min: 3900,
        max: 4500,
        median: 4200,
        additionalPay: 1600,
        currency: "USD",
        experienceLevel: "Mid-Senior",
      },
      {
        id: "ey-s5",
        position: "Forensic Accountant",
        amount: "4400 USD/мес",
        min: 4100,
        max: 4700,
        median: 4400,
        additionalPay: 1700,
        currency: "USD",
        experienceLevel: "Mid-Senior",
      },
      {
        id: "ey-s6",
        position: "Business Analyst",
        amount: "4000 USD/мес",
        min: 3700,
        max: 4300,
        median: 4000,
        additionalPay: 1500,
        currency: "USD",
        experienceLevel: "Mid",
      },
      {
        id: "ey-s7",
        position: "Senior Auditor",
        amount: "4600 USD/мес",
        min: 4300,
        max: 4900,
        median: 4600,
        additionalPay: 2000,
        currency: "USD",
        experienceLevel: "Senior",
      },
      {
        id: "ey-s8",
        position: "Internal Auditor",
        amount: "4200 USD/мес",
        min: 3900,
        max: 4500,
        median: 4200,
        additionalPay: 1800,
        currency: "USD",
        experienceLevel: "Mid",
      },
      {
        id: "ey-s9",
        position: "Financial Analyst",
        amount: "4400 USD/мес",
        min: 4100,
        max: 4700,
        median: 4400,
        additionalPay: 1900,
        currency: "USD",
        experienceLevel: "Mid-Senior",
      },
      {
        id: "ey-s10",
        position: "Audit Manager",
        amount: "4800 USD/мес",
        min: 4500,
        max: 5100,
        median: 4800,
        additionalPay: 2100,
        currency: "USD",
        experienceLevel: "Senior",
      },
      {
        id: "ey-s11",
        position: "Tax Manager",
        amount: "5000 USD/мес",
        min: 4700,
        max: 5300,
        median: 5000,
        additionalPay: 2200,
        currency: "USD",
        experienceLevel: "Senior",
      },
      {
        id: "ey-s12",
        position: "Consulting Manager",
        amount: "5200 USD/мес",
        min: 4900,
        max: 5500,
        median: 5200,
        additionalPay: 2300,
        currency: "USD",
        experienceLevel: "Senior",
      },
      {
        id: "ey-s13",
        position: "Risk Director",
        amount: "5500 USD/мес",
        min: 5200,
        max: 5800,
        median: 5500,
        additionalPay: 2500,
        currency: "USD",
        experienceLevel: "Senior",
      },
      {
        id: "ey-s14",
        position: "Financial Director",
        amount: "5700 USD/мес",
        min: 5400,
        max: 6000,
        median: 5700,
        additionalPay: 2600,
        currency: "USD",
        experienceLevel: "Senior",
      },
      {
        id: "ey-s15",
        position: "Management Consultant",
        amount: "6000 USD/мес",
        min: 5700,
        max: 6300,
        median: 6000,
        additionalPay: 2800,
        currency: "USD",
        experienceLevel: "Senior",
      },
    ],
    reviews: [
      {
        title: "Большой бренд",
        body: "Хорошо смотрится в резюме, но темп высок, возможен стресс.",
        rating: 4,
        author: "Tax Specialist",
      },
    ],
    recommended: [
      { id: "27", name: "KPMG", logoUrl: "/images/kpmg.png", rating: 3.7 },
      { id: "29", name: "PwC", logoUrl: "/images/pwc.png", rating: 3.9 },
    ],
    topCompanies: [
      { id: "26", name: "Deloitte", rating: 3.8 },
      { id: "2", name: "Google", rating: 4.3 },
    ],
  },
  
  {
    id: "29",
    name: "PwC",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/05/PricewaterhouseCoopers_Logo.svg",
    bannerImg:
      "https://www.pwc.com/content/dam/pwc/us/en/library/crisis-management/crisis-center-hero.jpg",
    rating: 3.9,
    location: "Лондон, Великобритания",
    industries: ["Аудит", "Консалтинг"],
    size: "10000+",
    description:
      "PwC — глобальная сеть фирм, предоставляющих профессиональные аудиторские, налоговые и консультационные услуги.",
    overallInfo: {
      founded: "1998",
      revenue: ">$40 млрд",
      mission: "Создавать доверие к бизнесу и решать важные проблемы общества.",
      competitors: ["Deloitte", "KPMG", "EY"],
    },
    benefits: [
      {
        title: "Career development",
        description: "Ротация между департаментами, тренинги.",
      },
      {
        title: "Мобильность",
        description: "Возможность командировок за рубеж.",
      },
    ],
    interviews: [
      {
        id: "pwc-i1",
        position: "Advisory Associate",
        difficulty: 3.5,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-02-10",
        location: "Лондон, Великобритания",
        application: "Applied via PwC Careers",
        details:
          "Собеседование включало кейс-стади на критическое мышление и бизнес-анализ.",
        interviewQuestions: [
          {
            question: "Как вы оцениваете бизнес-показатели компании?",
            answer:
              "Использую комбинацию финансового анализа и сравнительного анализа для оценки эффективности.",
          },
        ],
      },
      {
        id: "pwc-i2",
        position: "Audit Associate",
        difficulty: 3.2,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-02-12",
        location: "Лондон, Великобритания",
        application: "Applied via PwC Careers",
        details:
          "Фокус на технические вопросы аудита, оценку рисков и контроль за финансовой отчетностью.",
        interviewQuestions: [
          {
            question: "Как вы проводите аудит финансовой отчетности?",
            answer:
              "Следую стандартам аудита, провожу детальный анализ документов и сопоставляю с отраслевыми показателями.",
          },
        ],
      },
      {
        id: "pwc-i3",
        position: "Tax Consultant",
        difficulty: 3.8,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-02-15",
        location: "Лондон, Великобритания",
        application: "Referred by employee",
        details:
          "Вопросы по налоговому законодательству, оптимизации налоговой нагрузки и стратегическому планированию.",
        interviewQuestions: [
          {
            question:
              "Какие налоговые стратегии вы бы предложили крупной корпорации?",
            answer:
              "Обсудил оптимизацию налоговых обязательств через льготные режимы и структурирование бизнеса.",
          },
        ],
      },
      {
        id: "pwc-i4",
        position: "Consultant",
        difficulty: 3.6,
        experience: "Нейтральный",
        outcome: "No offer",
        date: "2025-02-18",
        location: "Лондон, Великобритания",
        application: "Applied via online portal",
        details:
          "Собеседование включало кейс-стади по оптимизации бизнес-процессов и внедрению изменений.",
        interviewQuestions: [
          {
            question: "Как вы внедряете изменения в крупных организациях?",
            answer:
              "Использую структурированный подход с акцентом на коммуникацию и управление изменениями.",
          },
        ],
      },
      {
        id: "pwc-i5",
        position: "Risk Manager",
        difficulty: 4.0,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-02-20",
        location: "Лондон, Великобритания",
        application: "Applied via PwC Careers",
        details:
          "Обсуждались методы оценки и минимизации корпоративных рисков, разработка стратегий по снижению воздействия.",
        interviewQuestions: [
          {
            question: "Как вы оцениваете и управляете корпоративными рисками?",
            answer:
              "Провожу анализ вероятности и воздействия рисков, разрабатываю планы по их смягчению.",
          },
        ],
      },
      {
        id: "pwc-i6",
        position: "Forensic Accountant",
        difficulty: 4.2,
        experience: "Нейтральный",
        outcome: "In progress",
        date: "2025-02-22",
        location: "Лондон, Великобритания",
        application: "Applied via referral",
        details:
          "Тестирование аналитических способностей, выявление финансовых аномалий и анализ документов.",
        interviewQuestions: [
          {
            question: "Как выявить признаки мошенничества в отчетности?",
            answer:
              "Использую сравнительный анализ, статистические методы и экспертную оценку.",
          },
        ],
      },
      {
        id: "pwc-i7",
        position: "Business Analyst",
        difficulty: 3.4,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-02-25",
        location: "Лондон, Великобритания",
        application: "Applied via PwC Careers",
        details:
          "Фокус на сборе требований, анализе бизнес-процессов и построении аналитических отчетов.",
        interviewQuestions: [
          {
            question: "Какие методы вы используете для сбора требований?",
            answer:
              "Провожу интервью, анкеты и наблюдения для детального понимания процессов.",
          },
        ],
      },
      {
        id: "pwc-i8",
        position: "Senior Auditor",
        difficulty: 3.9,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-02-27",
        location: "Лондон, Великобритания",
        application: "Referred by employee",
        details:
          "Сложное собеседование по аудиторским стандартам, внутреннему контролю и оценке эффективности процессов.",
        interviewQuestions: [
          {
            question: "Как улучшить внутренний контроль в организации?",
            answer:
              "Рекомендую автоматизировать процессы и проводить регулярные внутренние аудиты.",
          },
        ],
      },
      {
        id: "pwc-i9",
        position: "Internal Auditor",
        difficulty: 3.3,
        experience: "Нейтральный",
        outcome: "No offer",
        date: "2025-03-01",
        location: "Лондон, Великобритания",
        application: "Applied via online portal",
        details:
          "Вопросы по аудиту внутренних процессов, выявлению нарушений и оптимизации процедур.",
        interviewQuestions: [
          {
            question:
              "Что является ключевым фактором успешного внутреннего аудита?",
            answer:
              "Объективность, системность и тщательный анализ всех бизнес-процессов.",
          },
        ],
      },
      {
        id: "pwc-i10",
        position: "Financial Analyst",
        difficulty: 3.7,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-03-03",
        location: "Лондон, Великобритания",
        application: "Applied via PwC Careers",
        details:
          "Обсуждались методы анализа финансовых данных, прогнозирование и оценка эффективности инвестиций.",
        interviewQuestions: [
          {
            question: "Как вы прогнозируете финансовые результаты компании?",
            answer:
              "Использую исторические данные, трендовый анализ и финансовые модели для точного прогнозирования.",
          },
        ],
      },
    ],
    salaries: [
      {
        id: "pwc-s1",
        position: "Advisory Associate",
        amount: "3500 USD/мес",
        min: 3200,
        max: 3800,
        median: 3500,
        additionalPay: 1500,
        currency: "USD",
        experienceLevel: "Entry-Mid",
      },
      {
        id: "pwc-s2",
        position: "Audit Associate",
        amount: "3800 USD/мес",
        min: 3500,
        max: 4100,
        median: 3800,
        additionalPay: 1600,
        currency: "USD",
        experienceLevel: "Entry-Mid",
      },
      {
        id: "pwc-s3",
        position: "Tax Consultant",
        amount: "4200 USD/мес",
        min: 3900,
        max: 4500,
        median: 4200,
        additionalPay: 1800,
        currency: "USD",
        experienceLevel: "Mid",
      },
      {
        id: "pwc-s4",
        position: "Consultant",
        amount: "4500 USD/мес",
        min: 4200,
        max: 4800,
        median: 4500,
        additionalPay: 2000,
        currency: "USD",
        experienceLevel: "Mid",
      },
      {
        id: "pwc-s5",
        position: "Risk Manager",
        amount: "5000 USD/мес",
        min: 4600,
        max: 5400,
        median: 5000,
        additionalPay: 2200,
        currency: "USD",
        experienceLevel: "Mid-Senior",
      },
      {
        id: "pwc-s6",
        position: "Forensic Accountant",
        amount: "5200 USD/мес",
        min: 4800,
        max: 5600,
        median: 5200,
        additionalPay: 2300,
        currency: "USD",
        experienceLevel: "Mid-Senior",
      },
      {
        id: "pwc-s7",
        position: "Business Analyst",
        amount: "4800 USD/мес",
        min: 4400,
        max: 5200,
        median: 4800,
        additionalPay: 2000,
        currency: "USD",
        experienceLevel: "Mid",
      },
      {
        id: "pwc-s8",
        position: "Senior Auditor",
        amount: "5500 USD/мес",
        min: 5100,
        max: 5900,
        median: 5500,
        additionalPay: 2500,
        currency: "USD",
        experienceLevel: "Senior",
      },
      {
        id: "pwc-s9",
        position: "Internal Auditor",
        amount: "5000 USD/мес",
        min: 4600,
        max: 5400,
        median: 5000,
        additionalPay: 2200,
        currency: "USD",
        experienceLevel: "Mid",
      },
      {
        id: "pwc-s10",
        position: "Financial Analyst",
        amount: "5300 USD/мес",
        min: 4900,
        max: 5700,
        median: 5300,
        additionalPay: 2400,
        currency: "USD",
        experienceLevel: "Mid-Senior",
      },
      {
        id: "pwc-s11",
        position: "Audit Manager",
        amount: "6000 USD/мес",
        min: 5600,
        max: 6400,
        median: 6000,
        additionalPay: 3000,
        currency: "USD",
        experienceLevel: "Senior",
      },
      {
        id: "pwc-s12",
        position: "Tax Manager",
        amount: "6200 USD/мес",
        min: 5800,
        max: 6600,
        median: 6200,
        additionalPay: 3200,
        currency: "USD",
        experienceLevel: "Senior",
      },
      {
        id: "pwc-s13",
        position: "Consulting Manager",
        amount: "6500 USD/мес",
        min: 6100,
        max: 6900,
        median: 6500,
        additionalPay: 3500,
        currency: "USD",
        experienceLevel: "Senior",
      },
      {
        id: "pwc-s14",
        position: "Risk Director",
        amount: "7000 USD/мес",
        min: 6600,
        max: 7400,
        median: 7000,
        additionalPay: 4000,
        currency: "USD",
        experienceLevel: "Senior",
      },
      {
        id: "pwc-s15",
        position: "Financial Director",
        amount: "7200 USD/мес",
        min: 6800,
        max: 7600,
        median: 7200,
        additionalPay: 4200,
        currency: "USD",
        experienceLevel: "Senior",
      },
    ],
    reviews: [
      {
        title: "Сильный бренд",
        body: "Работы много, но опыт масштабный и ценный.",
        rating: 4,
        author: "Advisory",
      },
    ],
    recommended: [
      { id: "28", name: "EY", logoUrl: "/images/ey.png", rating: 3.8 },
      {
        id: "26",
        name: "Deloitte",
        logoUrl: "/images/deloitte.png",
        rating: 3.8,
      },
    ],
    topCompanies: [
      { id: "2", name: "Google", rating: 4.3 },
      { id: "3", name: "Microsoft", rating: 4.2 },
    ],
  },
  {
    id: "30",
    name: "Epic Games",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/31/Epic_Games_logo.svg",
    bannerImg:
      "https://cdn2.unrealengine.com/unreal-engine-5-1-features-for-fortnite-chapter-4-header-1920x1080-2e96ba9a1999.jpg",
    rating: 4.0,
    location: "Кэри, США",
    industries: ["Геймдев", "Движки"],
    size: "1001-5000",
    description:
      "Epic Games — разработчик игр (Fortnite) и создатель движка Unreal Engine.",
    overallInfo: {
      founded: "1991",
      revenue: ">$5 млрд",
      mission: "Создавать захватывающие игры и инструменты для разработчиков.",
      competitors: ["Unity", "Valve", "EA"],
    },
    benefits: [
      {
        title: "Epic Bonus",
        description: "Бонусы за релизы и успешные проекты.",
      },
      {
        title: "Гибкий график",
        description: "Можно работать в разное время суток.",
      },
    ],
    interviews: [
      {
        id: "epic-i1",
        position: "Gameplay Programmer",
        difficulty: 4.0,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-03-01",
        location: "Кэри, США",
        application: "Applied via Epic Games Careers",
        details:
          "C++ тест, задачи по оптимизации рендера, вопросы по игровым механикам.",
        interviewQuestions: [
          {
            question: "How do you optimize game rendering performance?",
            answer:
              "Использовал профилирование и оптимизацию шейдеров для снижения задержек.",
          },
        ],
      },
      {
        id: "epic-i2",
        position: "Engine Developer",
        difficulty: 4.2,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-03-03",
        location: "Кэри, США",
        application: "Referred by employee",
        details:
          "Вопросы по архитектуре игрового движка, оптимизации памяти и CPU.",
        interviewQuestions: [
          {
            question: "Опишите основные компоненты игрового движка.",
            answer:
              "Рендеринг, физика, аудио, скрипты и оптимизация потоков данных.",
          },
        ],
      },
      {
        id: "epic-i3",
        position: "Graphics Programmer",
        difficulty: 4.1,
        experience: "Нейтральный",
        outcome: "No offer",
        date: "2025-03-05",
        location: "Кэри, США",
        application: "Applied via website",
        details:
          "Техническое собеседование по оптимизации графики и работе с GPU.",
        interviewQuestions: [
          {
            question: "Как вы оптимизируете использование GPU?",
            answer:
              "Применяю техники batch rendering и оптимизацию draw calls для повышения эффективности.",
          },
        ],
      },
      {
        id: "epic-i4",
        position: "AI Programmer",
        difficulty: 3.9,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-03-07",
        location: "Кэри, США",
        application: "Applied via referral",
        details:
          "Обсуждение алгоритмов ИИ, поведения NPC и оптимизации логики в играх.",
        interviewQuestions: [
          {
            question: "Какие алгоритмы ИИ вы использовали в играх?",
            answer:
              "Использовал A*, state machines и алгоритмы машинного обучения для адаптивного поведения.",
          },
        ],
      },
      {
        id: "epic-i5",
        position: "Technical Artist",
        difficulty: 3.8,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-03-09",
        location: "Кэри, США",
        application: "Applied via Epic Games Careers",
        details:
          "Оценка портфолио, вопросы по оптимизации визуальных эффектов и производительности.",
        interviewQuestions: [
          {
            question:
              "Как вы оптимизируете визуальные эффекты для мобильных игр?",
            answer:
              "Использую LOD, батчинг и оптимизированные шейдеры для снижения нагрузки на GPU.",
          },
        ],
      },
      {
        id: "epic-i6",
        position: "Level Designer",
        difficulty: 3.5,
        experience: "Нейтральный",
        outcome: "In progress",
        date: "2025-03-11",
        location: "Кэри, США",
        application: "Applied via company website",
        details:
          "Обсуждение креативных концепций, баланса сложности уровней и дизайна окружения.",
        interviewQuestions: [
          {
            question: "Как вы балансируете сложность уровней?",
            answer:
              "Использую A/B тестирование и постоянную обратную связь от игроков для корректировки дизайна.",
          },
        ],
      },
      {
        id: "epic-i7",
        position: "QA Tester",
        difficulty: 3.0,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-03-13",
        location: "Кэри, США",
        application: "Internal referral",
        details:
          "Проверка навыков автоматизации тестирования, написание сценариев и обнаружение багов.",
        interviewQuestions: [
          {
            question: "Какие инструменты тестирования вы используете?",
            answer:
              "Использую Selenium, JIRA и собственные скрипты для автоматизации тестовых кейсов.",
          },
        ],
      },
      {
        id: "epic-i8",
        position: "Network Engineer",
        difficulty: 4.0,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-03-15",
        location: "Кэри, США",
        application: "Applied via referral",
        details:
          "Вопросы по оптимизации сетевой инфраструктуры, задержкам и стабильности в онлайн играх.",
        interviewQuestions: [
          {
            question:
              "Как вы решаете проблемы с высокой задержкой в онлайн играх?",
            answer:
              "Оптимизирую протоколы, использую edge-сервера и load balancing для минимизации задержек.",
          },
        ],
      },
      {
        id: "epic-i9",
        position: "VR Developer",
        difficulty: 4.2,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-03-17",
        location: "Кэри, США",
        application: "Applied via Epic Games Careers",
        details:
          "Собеседование по разработке для VR, оптимизации производительности и созданию комфортного UX.",
        interviewQuestions: [
          {
            question: "Как вы решаете проблемы motion sickness в VR?",
            answer:
              "Оптимизирую frame rate и корректно настраиваю FOV для уменьшения дискомфорта.",
          },
        ],
      },
      {
        id: "epic-i10",
        position: "Game Designer",
        difficulty: 3.6,
        experience: "Положительный",
        outcome: "Offer",
        date: "2025-03-19",
        location: "Кэри, США",
        application: "Applied via company website",
        details:
          "Обсуждение концепций геймплея, сценариев и механик взаимодействия в играх.",
        interviewQuestions: [
          {
            question: "Как вы определяете ключевые механики игры?",
            answer:
              "Анализ рынка, тестирование прототипов и сбор обратной связи от игроков помогают определить основное направление.",
          },
        ],
      },
    ],
    salaries: [
      {
        id: "epic-s1",
        position: "Gameplay Programmer",
        amount: "4800 USD/мес",
        min: 4400,
        max: 5200,
        median: 4800,
        additionalPay: 1500,
        currency: "USD",
        experienceLevel: "Mid",
      },
      {
        id: "epic-s2",
        position: "Engine Developer",
        amount: "5200 USD/мес",
        min: 4800,
        max: 5600,
        median: 5200,
        additionalPay: 1800,
        currency: "USD",
        experienceLevel: "Mid-Senior",
      },
      {
        id: "epic-s3",
        position: "Graphics Programmer",
        amount: "5400 USD/мес",
        min: 5000,
        max: 5800,
        median: 5400,
        additionalPay: 2000,
        currency: "USD",
        experienceLevel: "Mid-Senior",
      },
      {
        id: "epic-s4",
        position: "AI Programmer",
        amount: "5000 USD/мес",
        min: 4600,
        max: 5400,
        median: 5000,
        additionalPay: 1700,
        currency: "USD",
        experienceLevel: "Mid",
      },
      {
        id: "epic-s5",
        position: "Technical Artist",
        amount: "5100 USD/мес",
        min: 4700,
        max: 5500,
        median: 5100,
        additionalPay: 1600,
        currency: "USD",
        experienceLevel: "Mid",
      },
      {
        id: "epic-s6",
        position: "Level Designer",
        amount: "4800 USD/мес",
        min: 4500,
        max: 5100,
        median: 4800,
        additionalPay: 1400,
        currency: "USD",
        experienceLevel: "Entry-Mid",
      },
      {
        id: "epic-s7",
        position: "QA Tester",
        amount: "4300 USD/мес",
        min: 4000,
        max: 4600,
        median: 4300,
        additionalPay: 1200,
        currency: "USD",
        experienceLevel: "Entry",
      },
      {
        id: "epic-s8",
        position: "Network Engineer",
        amount: "5500 USD/мес",
        min: 5100,
        max: 5900,
        median: 5500,
        additionalPay: 2000,
        currency: "USD",
        experienceLevel: "Mid-Senior",
      },
      {
        id: "epic-s9",
        position: "VR Developer",
        amount: "6000 USD/мес",
        min: 5600,
        max: 6400,
        median: 6000,
        additionalPay: 2500,
        currency: "USD",
        experienceLevel: "Senior",
      },
      {
        id: "epic-s10",
        position: "Game Designer",
        amount: "5000 USD/мес",
        min: 4600,
        max: 5400,
        median: 5000,
        additionalPay: 1500,
        currency: "USD",
        experienceLevel: "Mid",
      },
      {
        id: "epic-s11",
        position: "Technical Scripter",
        amount: "4800 USD/мес",
        min: 4400,
        max: 5200,
        median: 4800,
        additionalPay: 1300,
        currency: "USD",
        experienceLevel: "Mid",
      },
      {
        id: "epic-s12",
        position: "Audio Programmer",
        amount: "4700 USD/мес",
        min: 4300,
        max: 5100,
        median: 4700,
        additionalPay: 1200,
        currency: "USD",
        experienceLevel: "Mid",
      },
      {
        id: "epic-s13",
        position: "UI/UX Developer",
        amount: "4900 USD/мес",
        min: 4500,
        max: 5300,
        median: 4900,
        additionalPay: 1400,
        currency: "USD",
        experienceLevel: "Mid",
      },
      {
        id: "epic-s14",
        position: "Motion Capture Specialist",
        amount: "5200 USD/мес",
        min: 4800,
        max: 5600,
        median: 5200,
        additionalPay: 1500,
        currency: "USD",
        experienceLevel: "Mid-Senior",
      },
      {
        id: "epic-s15",
        position: "Technical Director",
        amount: "7000 USD/мес",
        min: 6500,
        max: 7500,
        median: 7000,
        additionalPay: 3000,
        currency: "USD",
        experienceLevel: "Senior",
      },
    ],
    reviews: [
      {
        title: "Работа мечты геймера",
        body: "Создавать игры — круто, но сроки жёсткие и релизы стрессовые.",
        rating: 4,
        author: "Программист",
      },
    ],
    recommended: [
      { id: "4", name: "Apple", logoUrl: "/images/apple.png", rating: 4.1 },
      { id: "22", name: "Tesla", logoUrl: "/images/tesla.png", rating: 4.1 },
    ],
    topCompanies: [
      { id: "1", name: "IBM", rating: 4.0 },
      { id: "2", name: "Google", rating: 4.3 },
    ],
  },
];