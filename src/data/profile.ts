/**
 * Single source of truth for every visible string on the page.
 * Content is taken from the CV; no number here is invented.
 */

export const person = {
  name: 'Nguyen Thanh Dat',
  role: 'Backend Engineer',
  location: 'Da Nang, Vietnam',
  email: 'datnt21012001@gmail.com',
  phone: '0975 094 441',
  phoneHref: '+84975094441',
  linkedin: 'https://www.linkedin.com/in/datntdev210101/',
  linkedinLabel: 'linkedin.com/in/datntdev210101',
  cv: '/cv/Nguyen-Thanh-Dat-Backend-Engineer.pdf',
}

export const hero = {
  headline: 'Backend engineer who makes slow systems fast.',
  subtext:
    'Nearly five years of PHP and Laravel across ERP, MES, healthcare and e-commerce, from Da Nang. The ERP service I own today is NestJS and Vue, and every performance fix on this page came out of it.',
}

/** Headline figures. Every one of these is restated in context further down the page. */
export const metrics = [
  { value: '5', unit: 'yrs', label: 'PHP and Laravel, plus a year owning a NestJS service' },
  { value: '26s', unit: '→ 250ms', label: 'Slowest report query, rebuilt' },
  { value: '3M', unit: 'rows', label: 'Per CSV migration run, on Laravel' },
  { value: '4', unit: 'of 4', label: 'Fixes above that landed in the NestJS codebase' },
]

export type ImpactCase = {
  before: string
  after: string
  /** 'sm' for results that are a spec rather than a duration, so they still fit one line. */
  scale?: 'sm'
  title: string
  body: string
  context: string
  tone: 'panel' | 'accent' | 'surface'
}

/**
 * The four things worth arguing about in an interview.
 * Numbers come straight from the CV; each one names the actual technique.
 */
export const impact: ImpactCase[] = [
  {
    before: '26s',
    after: '250ms',
    title: 'A summary query reading five million rows',
    body: 'The table held one row per day and the summary read the whole of it. I added a monthly rollup table, seeded the daily rows into it, and rebuilt the composite index whose column order was wrong. Rows scanned went from five million to 380,000.',
    context: 'Client-facing ERP report, NestJS and TypeORM',
    tone: 'panel',
  },
  {
    before: '9s',
    after: '80ms',
    title: 'The multi-column filter had no index at all',
    body: 'Nothing clever here. The filter combination had nothing to land on, and finding that was the entire job - adding the index took minutes. Not every nine-second query is hiding a hard problem.',
    context: 'ERP list views, NestJS',
    tone: 'accent',
  },
  {
    before: '18.2s',
    after: '64ms',
    title: 'A LEFT JOIN across eighteen tables',
    body: 'One endpoint joined roughly eighteen tables, two of them contacts at 1M rows and contact info at 2M. I split it: the main record returns immediately, and the contract data, heavier and less urgent on first paint, loads after. The other two endpoints on that screen went 6.1s to 187ms and 8.8s to 6ms.',
    context: 'CRM read paths, NestJS',
    tone: 'surface',
  },
  {
    before: 'unbounded',
    after: '0.5 CPU / 512MB',
    scale: 'sm',
    title: 'Batch jobs starving the app server',
    body: 'Batch and app shared one container, on an inherited codebase with no monitoring. I found the contention in docker stats, then moved batch into its own worker with hard limits and a self-throttle that reads Node process CPU before picking up more work.',
    context: 'Infrastructure, Node.js',
    tone: 'surface',
  },
]

export type Job = {
  company: string
  role: string
  period: string
  meta: string
  points: string[]
}

export const experience: Job[] = [
  {
    company: 'Bear Acer',
    role: 'Backend Developer',
    period: 'Aug 2025 - now',
    meta: 'Sole developer on the ERP service',
    points: [
      'Sole developer on the ERP service - NestJS with TypeORM on the server, Vue on the client - aggregating B2B and MES data into daily and monthly reporting.',
      'Fixed all four performance problems above inside that NestJS codebase, which I inherited with a structure that was not good when it reached me.',
      'Added slow-query alerting to a service that had none: anything slower than a second is logged and posted to the team Discord channel, so a regression reaches me before it reaches the client.',
      'Wired the two stacks together: B2B writes each day into a sync Postgres, then twelve scheduled ERP batch jobs and three RabbitMQ consumers pull it across and recompute the summaries in MySQL.',
      'Built the MES billing module: multi-case calculation, PDF invoice generation, multi-recipient email, role-based permissions. B2B and MES are the PHP side, and I support those too.',
    ],
  },
  {
    company: 'Sotatek',
    role: 'Backend Developer',
    period: 'Mar 2025 - Aug 2025',
    meta: '16-member team, 5 on backend',
    points: [
      'Joined a hospital management system at inception, deciding technical solutions and the architecture and stack for the five-person backend team.',
      'Replaced ad-hoc dev-environment releases with sprint-scoped feature branches off main, so QC could plan per sprint and only verified work shipped.',
      'Introduced a peer-review checklist, then an AI-assisted PR review step to cut review overhead. I also mentored two developers through their onboarding onto the project.',
      'Found the slow path in appointment booking: the availability lookup across doctor schedules, shifts and existing appointments had no composite index to land on. I indexed it and restructured the query around how the screen actually loads its data, rather than leaving it as one join.',
    ],
  },
  {
    company: 'Kozocom',
    role: 'Backend Developer, middle level',
    period: 'Feb 2024 - Mar 2025',
    meta: '16-member team',
    points: [
      'Warehouse and inventory platform on Laravel and PostgreSQL, inside a Scrum team, with a Redis queue carrying data sync across the platform and PDF export and fax delivery through a third-party API.',
      'Built the legacy-to-new-system migration: CSV imports of roughly 2 to 3 million records per run, written as chunked batch inserts of fifty rows per worker rather than one model create per row. At that volume the difference is not speed, it is whether the job finishes at all before PHP runs out of memory.',
      'Fixed the read paths behind it too: eager-loaded the relations the inventory list had been resolving one row at a time - a textbook N+1 - and moved the list off paginate() so it stopped paying for a COUNT over the whole table on every request.',
      'Added feature and unit tests to the backend workflow, wrote the module documentation, and reviewed code and supported junior developers.',
    ],
  },
  {
    company: 'Flydino Technology',
    role: 'Junior Backend Developer',
    period: 'Apr 2023 - Feb 2024',
    meta: 'Multiple client projects',
    points: [
      'Shipped backend on Laravel across three client platforms, and the frontend on two of them in Vue 3 with TypeScript and Tailwind, designing the database structures for the new features.',
      'Integrated ChatGPT-4 into a skin-analysis flow: an uploaded facial photo comes back as a skin-condition assessment that feeds a product-recommendation step.',
      'Integrated Keycloak SSO, SNS login and S3 or FTP storage on an 18-member recruitment platform.',
    ],
  },
  {
    company: 'Nine Plus Software',
    role: 'Backend Developer, fresher to junior',
    period: 'Oct 2021 - Apr 2023',
    meta: 'Where it started',
    points: [
      'Promoted from fresher to junior over eighteen months, moving from assigned tasks to owning features end to end - schema, business logic and API - with a senior reviewing the work before it merged.',
      'Learned Laravel and REST API design by shipping features on an HR management system for a Japanese client.',
      'Moved on to an e-commerce platform on Stripe: webhooks with signature verification and idempotent handling of retried events, the processing queued so the endpoint answered immediately, plus refund and failure paths and a reconciliation job for orders left pending.',
    ],
  },
]

export const featured = {
  name: 'MIA-POS',
  tagline: 'Self-funded, in testing',
  body: 'A point-of-sale and online-store platform for cafes and small F&B businesses. It is in testing, not launched - the legal side is not done - but I pay for it, I run it, and every architectural decision in it is mine to defend.',
  points: [
    'Domain-oriented services behind a Caddy gateway: Laravel for auth, admin, users and payments; Go with Gin for stores and inventory; Python with FastAPI for the AI features.',
    'Postgres with PgBouncer, Redis and RabbitMQ, with a log worker consuming activity events into batched COPY writes.',
    'Three Vue 3 apps with Tailwind in one Bun workspace, Bun as package manager and bundler, plus CI/CD on GitHub Actions.',
    'Services still share one database. That is a modular monolith, and it is a deliberate trade-off at this size rather than an accident.',
  ],
  href: 'https://mia-store-remote.pages.dev',
  hrefLabel: 'mia-store-remote.pages.dev',
}

export type ClientProject = {
  name: string
  period: string
  client: string
  body: string
  stack: string[]
}

/** Client names are abbreviated the same way they are on the CV, for the same reason. */
export const clientWork: ClientProject[] = [
  {
    name: 'B2B ERP and MES platform',
    period: 'Aug 2025 - now',
    client: 'Japanese client, ERP service is mine alone',
    body: 'Enterprise ERP and MES covering accounting, CRM, HR, billing, orders, shipping and inventory. I own the ERP service; the B2B and MES systems it aggregates from are PHP, and I support those.',
    stack: ['NestJS', 'TypeORM', 'Vue 3', 'MySQL', 'RabbitMQ'],
  },
  {
    name: 'Hospital management system',
    period: 'Mar - Aug 2025',
    client: 'Japanese client, 16-member team',
    body: 'Appointment booking, course, shift and contract management, with OAuth via Laravel Passport and push notifications.',
    stack: ['Lumen', 'Laravel', 'MySQL', 'Redis', 'FCM'],
  },
  {
    name: 'Warehouse and inventory platform',
    period: 'Feb 2024 - Mar 2025',
    client: 'Japanese client, 16-member team',
    body: 'Purchasing, selling and store management, plus the CSV migration that carried the legacy data across, PDF export and fax delivery through a third-party API.',
    stack: ['Laravel', 'PostgreSQL', 'Swagger', 'Pusher', 'Fax API'],
  },
  {
    name: 'AI skin analysis and booking',
    period: 'Dec 2023 - Feb 2024',
    client: 'Japanese client, 8-member team',
    body: 'ChatGPT-4 reads an uploaded facial photo, returns a skin-condition assessment, and feeds a product recommendation flow.',
    stack: ['Laravel', 'MySQL', 'OpenAI API'],
  },
  {
    name: 'Project management and recruitment',
    period: 'Jun - Dec 2023',
    client: 'Japanese client, 18-member team',
    body: 'Contract, project and task modules with role-based authorization, Keycloak SSO, and storage across S3 and FTP.',
    stack: ['Laravel', 'Vue 3', 'TypeScript', 'MySQL', 'Keycloak'],
  },
  {
    name: 'Driver booking platform',
    period: 'Apr - Jun 2023',
    client: 'Vietnamese client, 8-member team',
    body: 'Distance and fare calculation between pickup and destination, driver booking, ratings and management.',
    stack: ['Laravel', 'Vue 3', 'TypeScript', 'Google Maps API'],
  },
  {
    name: 'E-commerce, payments and Q&A',
    period: 'Mar 2022 - Jan 2023',
    client: 'Japanese clients, 3 platforms',
    body: 'A covid test-kit sales platform - product, order and order-item management, CSV import and export, online payment. A question-and-answer platform - posting and answering, moderation, search and filtering, answer ratings. And multi-seller storefronts - seller registration, orders, store management, payment and shipping. Stripe on two of the three, with Redis caching the catalog reads.',
    stack: ['Laravel', 'MySQL', 'Stripe', 'Redis', 'Docker'],
  },
]

export type StackGroup = { label: string; items: { name: string; slug: string }[] }

/** slug maps to a real simple-icons brand mark. */
export const stack: StackGroup[] = [
  {
    label: 'Backend',
    items: [
      { name: 'Node.js', slug: 'nodedotjs' },
      { name: 'NestJS', slug: 'nestjs' },
      { name: 'TypeScript', slug: 'typescript' },
      { name: 'PHP', slug: 'php' },
      { name: 'Laravel', slug: 'laravel' },
      { name: 'Go', slug: 'go' },
    ],
  },
  {
    label: 'Data',
    items: [
      { name: 'PostgreSQL', slug: 'postgresql' },
      { name: 'MySQL', slug: 'mysql' },
      { name: 'Redis', slug: 'redis' },
      { name: 'RabbitMQ', slug: 'rabbitmq' },
    ],
  },
  {
    label: 'Infrastructure',
    items: [
      { name: 'Docker', slug: 'docker' },
      { name: 'Nginx', slug: 'nginx' },
      { name: 'Linux', slug: 'linux' },
      { name: 'GitHub Actions', slug: 'githubactions' },
      { name: 'Caddy', slug: 'caddy' },
    ],
  },
  {
    label: 'Product side',
    items: [
      { name: 'Vue', slug: 'vuedotjs' },
      { name: 'Bun', slug: 'bun' },
      { name: 'Tailwind', slug: 'tailwindcss' },
      { name: 'Swagger', slug: 'swagger' },
    ],
  },
]

/** Named in the CV but without a brand mark worth showing as a logo. */
export const alsoUse =
  'On the Node side: TypeORM, class-validator, RabbitMQ over @nestjs/microservices, @nestjs/schedule, Passport JWT, Vitest. On the PHP side: Lumen, Eloquent, Laravel Passport, Laravel Telescope, Laravel Reverb. Plus AWS S3, Firebase Cloud Messaging, Stripe, Keycloak, Pusher, Google Maps API, and Cloudflare Pages.'

/**
 * The stack question, answered before a recruiter has to ask it. Two different
 * readers land here: one hiring for Laravel, one hiring for Node. Neither is
 * being sold a pivot - the depth and the current ownership are both real and
 * both current, and the seam between them is the thing neither stack alone
 * explains. Every claim restates something already on the page.
 */
export const runtimes = {
  headline: 'Two stacks, and the seam between them',
  intro:
    'PHP and Laravel is the depth: nearly five years and nine production systems. NestJS is what I own now, and every measured result above came out of it. Both are current work, and the boundary where they meet is the part I would most want to be asked about.',
  points: [
    {
      title: 'Laravel is the depth, and it is nearly five years deep',
      body: 'Nine production systems since 2021 - HR, three e-commerce, payments and Q&A platforms, driver booking, project management and recruitment, AI skin analysis, warehouse and inventory, and a hospital platform - in teams of seven to twenty, mostly for Japanese clients. Schema design, queue work, review discipline and how to read a slow query are all things I learned in PHP before I wrote any TypeScript. It is not the half of my CV I am moving away from; it is the half that taught me the rest.',
    },
    {
      title: 'I have owned a NestJS service for over a year',
      body: 'I am the only developer on it: NestJS with TypeORM on the server, Vue on the client, inherited with a structure that was not good when it reached me. Reading someone else\'s TypeScript under load and deciding what to change has been most of the actual work.',
    },
    {
      title: 'All four results above came out of the NestJS codebase',
      body: 'The ERP service is NestJS with TypeORM over MySQL, plus a second Postgres datasource for synced data. The rollup table, the index rebuild, the endpoint split and the batch worker limits were written in TypeScript, not PHP. Node is not a language I am hoping to move into.',
    },
    {
      title: 'The two stacks meet at a boundary I maintain',
      body: 'B2B and MES are PHP and I support them as well. Each day B2B writes its business data into a sync Postgres; twelve scheduled jobs and three RabbitMQ consumers then pull it across and recompute the summaries on the ERP side. Running a Laravel estate and a NestJS service against each other in production is a narrower thing to have done than either stack on its own.',
    },
    {
      title: 'Go is the direction, and I am not going to overstate it',
      body: 'Go with Gin runs the store, inventory and log-worker services in MIA-POS, which is my own project: Postgres behind PgBouncer, RabbitMQ, and a worker batching activity events into COPY writes. That is code I wrote and run, and it is also a side project in testing rather than something carrying production traffic. Read it as where I am heading, not as a third stack I can claim years on.',
    },
  ],
}

export const howIWork = [
  {
    title: 'Measure first, then touch the code',
    body: 'The CPU contention on the ERP app server was found in docker stats, not guessed at. The 26-second report was timed against the running endpoint and read back out of the query log before a line of it was rewritten. A fix you cannot measure is a fix you cannot defend.',
  },
  {
    title: 'The release process is part of the system',
    body: 'At Sotatek the backend team was releasing from a shared dev environment, so nothing was reliably testable. Moving to sprint-scoped feature branches off main gave QC something to plan against, and nothing reached production without clearing QC first.',
  },
  {
    title: 'Reviews should cost the reviewer less',
    body: 'I introduced a peer-review checklist so reviews stopped being a matter of taste, then an AI-assisted first pass to catch out-of-scope changes before a human reads the diff.',
  },
]

export const contact = {
  headline: 'Open to Node.js and Laravel backend roles.',
  body: 'Remote, hybrid or on-site in Da Nang. If you have a Node service that got slow and nobody is sure why, that is the conversation I want.',
}

export const nav = [
  { label: 'Impact', href: '#impact' },
  { label: 'Runtimes', href: '#runtimes' },
  { label: 'Experience', href: '#experience' },
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
]

/**
 * Chrome: headings and button labels that belong to the page rather than to the
 * CV. They live here for the same reason everything else does - so the
 * translation has one place to answer, and so nothing visible is stranded in a
 * component where the other language cannot reach it.
 */
export const ui = {
  skipToContent: 'Skip to content',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  scrollPrev: 'Previous projects',
  scrollNext: 'More projects',
  downloadCv: 'Download CV',
  getInTouch: 'Get in touch',
  impactHeading: 'What I actually changed',
  impactIntro: 'Four problems from the last year, with the numbers that came out the other side.',
  experienceHeading: 'Five years, five teams',
  workHeading: 'Work shipped under other names',
  workIntro:
    'Most of it sits behind an NDA, so the clients stay unnamed and the systems speak instead.',
  stackHeading: 'What I reach for',
  alsoInUse: 'Also in regular use.',
  howIWorkHeading: 'How I work',
  credits:
    'Portrait and product screenshot are mine. Building photograph by Vinayak Sharma on Unsplash.',
  portraitAlt: 'Nguyen Thanh Dat',
  featuredAlt: 'The MIA-POS store landing page running in production',
  structureAlt: 'Two office towers seen from street level, one clad in glass and one in stone',
}
