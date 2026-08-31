/**
 * Single source of truth for every visible string on the page.
 * Content is taken from the CV; no number here is invented.
 */

export const person = {
  name: 'Nguyen Thanh Dat',
  role: 'Backend Engineer',
  focus: 'Node.js / NestJS and PHP / Laravel',
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
    'Nearly five years building ERP, MES and healthcare backends from Da Nang. Laravel is the longer half; the ERP service I own today is NestJS and Vue, and every performance fix on this page came out of it.',
}

/** Headline figures. Every one of these is restated in context further down the page. */
export const metrics = [
  { value: '5', unit: 'yrs', label: 'Backend since 2021, nearly five years' },
  { value: '26s', unit: '→ 250ms', label: 'Slowest report query, rebuilt' },
  { value: '3M', unit: 'rows', label: 'Per CSV migration run' },
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
    context: 'ERP reporting, NestJS and TypeORM',
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
      'Fixed all four performance problems above inside that NestJS codebase, which I inherited: 112 entities, 124 migrations and a structure that was not good when it reached me.',
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
      'Introduced a peer-review checklist, then an AI-assisted PR review step to cut review overhead.',
    ],
  },
  {
    company: 'Kozocom',
    role: 'Backend Developer, middle level',
    period: 'Feb 2024 - Mar 2025',
    meta: '16-member team',
    points: [
      'Warehouse and inventory platform on Laravel and PostgreSQL, inside a Scrum team, with a Redis queue carrying data sync across the platform.',
      'Built the legacy-to-new-system migration: CSV imports of roughly 2 to 3 million records per run.',
      'Added feature and unit tests to the backend workflow, and reviewed junior developers work.',
    ],
  },
  {
    company: 'Flydino Technology',
    role: 'Junior Backend Developer',
    period: 'Apr 2023 - Feb 2024',
    meta: 'Multiple client projects',
    points: [
      'Shipped backend on Laravel and frontend on Vue 3 with TypeScript across a project-management platform and a booking app.',
      'Integrated Keycloak SSO, SNS login and S3 or FTP storage on an 18-member recruitment platform.',
    ],
  },
  {
    company: 'Nine Plus Software',
    role: 'Fresher Backend Developer',
    period: 'Oct 2021 - Apr 2023',
    meta: 'Where it started',
    points: [
      'Learned Laravel and REST API design by shipping features on an HR management system for a Japanese client.',
      'Moved on to an e-commerce platform with Stripe payments, designing schemas and business logic.',
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
    'Three Vue 3 apps in one Bun workspace, Bun as package manager and bundler, plus CI/CD on GitHub Actions.',
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
    period: '2025 - now',
    client: 'Japanese client, ERP service is mine alone',
    body: 'Enterprise ERP and MES covering accounting, CRM, HR, billing, orders, shipping and inventory. I own the ERP service; the B2B and MES systems it aggregates from are PHP, and I support those.',
    stack: ['NestJS', 'TypeORM', 'Vue 3', 'MySQL', 'RabbitMQ'],
  },
  {
    name: 'Hospital management system',
    period: '2025',
    client: 'Japanese client, 16-member team',
    body: 'Appointment booking, course, shift and contract management, with OAuth via Laravel Passport and push notifications.',
    stack: ['Lumen', 'Laravel', 'MySQL', 'Redis', 'FCM'],
  },
  {
    name: 'Warehouse and inventory platform',
    period: '2024 - 2025',
    client: 'Japanese client, 16-member team',
    body: 'Purchasing, selling and store management, plus the CSV migration that carried the legacy data across.',
    stack: ['Laravel', 'PostgreSQL', 'Swagger', 'Pusher'],
  },
  {
    name: 'AI skin analysis and booking',
    period: '2023 - 2024',
    client: 'Japanese client, 8-member team',
    body: 'ChatGPT-4 reads an uploaded facial photo, returns a skin-condition assessment, and feeds a product recommendation flow.',
    stack: ['Laravel', 'MySQL', 'OpenAI API'],
  },
  {
    name: 'Project management and recruitment',
    period: '2023',
    client: 'Japanese client, 18-member team',
    body: 'Contract, project and task modules with role-based authorization, Keycloak SSO, and storage across S3 and FTP.',
    stack: ['Laravel', 'Vue 3', 'TypeScript', 'MySQL', 'Keycloak'],
  },
  {
    name: 'E-commerce and payments',
    period: '2022 - 2025',
    client: 'Japanese and Vietnamese clients, 3 platforms',
    body: 'Multi-seller storefronts, order and shipping workflows, a covid test-kit sales platform, and a company-management platform. Stripe on all three, with Redis caching the catalog reads.',
    stack: ['Laravel', 'MySQL', 'Stripe', 'Redis', 'Docker'],
  },
  {
    name: 'Driver booking platform',
    period: '2023',
    client: 'Vietnamese client, 8-member team',
    body: 'Distance and fare calculation between pickup and destination, driver booking, ratings and management.',
    stack: ['Laravel', 'Vue 3', 'TypeScript', 'Google Maps API'],
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
  'On the Node side: TypeORM, class-validator, RabbitMQ over @nestjs/microservices, @nestjs/schedule, Passport JWT, Vitest, Winston. On the PHP side: Lumen, Laravel Passport, Laravel Telescope, Laravel Reverb. Plus AWS S3, Firebase Cloud Messaging, Stripe, Keycloak, Pusher, Google Maps API.'

/**
 * The language question, answered before a recruiter has to ask it. Every claim
 * here restates something already on the page. The load-bearing fact is that all
 * four results in the impact grid came out of the NestJS service, not the PHP one.
 */
export const runtimes = {
  headline: 'The Node work is the current work',
  intro:
    'Laravel is the longer half of my CV and the roles I am applying for are Node. Rather than leave you to work the ratio out from a stack list, here it is - along with the part that usually gets lost in it.',
  points: [
    {
      title: 'All four results above came out of the NestJS codebase',
      body: 'The ERP service is NestJS with TypeORM over MySQL, plus a second Postgres datasource for synced data. The rollup table, the index rebuild, the endpoint split and the batch worker limits were written in TypeScript, not PHP. Node is not a language I am hoping to move into.',
    },
    {
      title: 'I own that service end to end, and I inherited it',
      body: 'I am the only developer on it: NestJS on the server, Vue on the client. 112 entities, 124 migrations, and a structure that was not good when it reached me. Reading someone else\'s TypeScript under load and deciding what to change has been most of the actual work.',
    },
    {
      title: 'The two stacks meet at a boundary I maintain',
      body: 'B2B and MES are PHP and I support them as well. Each day B2B writes its business data into a sync Postgres; twelve scheduled jobs and three RabbitMQ consumers then pull it across and recompute the summaries on the ERP side. That seam is the part I would want to be asked about.',
    },
    {
      title: 'Laravel is still the depth, and I am not hiding it',
      body: 'PHP and Laravel is where I learned schema design, queue work, review discipline and how to read a slow query. Nearly five years of it, against two years of TypeScript and one on NestJS. I would rather you know that now than find it out in the interview.',
    },
  ],
}

export const howIWork = [
  {
    title: 'Measure first, then touch the code',
    body: 'The CPU contention on the ERP app server was found in docker stats, not guessed at. The 26-second report was read in Telescope before anything was rewritten. A fix you cannot measure is a fix you cannot defend.',
  },
  {
    title: 'The release process is part of the system',
    body: 'At Sotatek the backend team was releasing from a shared dev environment, so nothing was reliably testable. Moving to sprint-scoped feature branches off main gave QC something to plan against, and production bugs dropped sharply.',
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
