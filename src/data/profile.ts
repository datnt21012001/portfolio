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
  cv: '/cv/CV_Nguyen_Thanh_Dat_Backend_Engineer.pdf',
}

export const hero = {
  headline: 'Backend engineer who makes slow systems fast.',
  subtext:
    'Four years of PHP and Laravel across ERP, MES, healthcare, warehouse and e-commerce, from Da Nang. The ERP service I own today is NestJS and Vue, and every performance fix on this page came out of it.',
}

/** Headline figures. Every one of these is restated in context further down the page. */
export const metrics = [
  { value: '4', unit: 'yrs', label: 'PHP and Laravel, plus a year owning a NestJS service' },
  { value: '26s', unit: '→ 250ms', label: 'Slowest report query, rebuilt' },
  { value: '3M', unit: 'rows', label: 'Per CSV migration run, on Laravel' },
  { value: '5', unit: 'of 5', label: 'Fixes above, all inside the one ERP service I own' },
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
 * The five things worth arguing about in an interview.
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
    body: 'One endpoint joined roughly eighteen tables, two of them contacts at 1M rows and contact info at 2M. I split it: the main record returns immediately, and the contract data, heavier and less urgent on first paint, loads after. The other two endpoints on that screen went 6.1s to 187ms and 8.8s to 60ms.',
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
  {
    before: '~10,000 cells',
    after: 'lazy-loaded',
    scale: 'sm',
    title: 'The API was fast and the screen was still slow',
    body: 'One report page painted a hundred rows against roughly a hundred columns - twelve months by eight figures each, plus totals and the yearly average - into a vxe-table. The query had already returned; the browser was what the user was waiting on. I capped what the front end pulls per page and moved the columns onto horizontal lazy loading, so the grid paints what is on screen instead of all of it.',
    context: 'ERP reporting screen, Vue 3',
    tone: 'accent',
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
    role: 'Senior Backend Developer',
    period: 'Aug 2025 - now',
    meta: 'Sole developer on the ERP service',
    points: [
      'Sole developer on the ERP service - NestJS with TypeORM on the server, Vue 3 with TypeScript on the client, both mine - aggregating B2B and MES data into daily and monthly reporting.',
      'Fixed all five performance problems above inside that ERP codebase, which I inherited with a structure that was not good when it reached me. The last of them was in the Vue front end, not the query.',
      'Added slow-query alerting to a service that had none: anything slower than a second is logged and posted to the team Discord channel, so a regression reaches me before it reaches the client.',
      'Wired the two stacks together: B2B writes each day into a sync Postgres, then twelve scheduled ERP batch jobs and three RabbitMQ consumers pull it across and recompute the summaries in MySQL.',
      'Built the MES billing module: multi-case calculation, PDF invoice generation, multi-recipient email, role-based permissions. B2B and MES are the PHP side, and I support those too.',
      'Built an AI email-drafting feature into the ERP: it composes emails in the voice of the user sending them, matching their tone and writing style.',
    ],
  },
  {
    company: 'Sotatek',
    role: 'Team Leader (Backend)',
    period: 'Mar 2025 - Aug 2025',
    meta: '16-member team, 5 on backend',
    points: [
      'Team Leader for the five-person backend team on a hospital management system built from inception: I owned the system architecture, the database design and the technical solutions, and ran the team\'s Git flow.',
      'The project had run through three project managers in three months and was slipping. Without holding the title I stepped in on delivery - planning, timelines and release schedules for the development and QC teams - and focused on what was actually causing the issues.',
      'Rebuilt the release process on a project carrying real delivery risk: ad-hoc dev-environment releases became sprint-scoped feature branches off main, so QC could plan test cases per sprint and nothing reached production without clearing QC first. Avoidable issues fell and releases held their schedule.',
      'Built the staging server the new process needed - the old flow had nowhere to verify a release before it shipped - and added system monitoring and logging, so an issue could be investigated from evidence instead of guessed at.',
      'Raised scope risk before it became a bug: when a ticket the client wanted was likely to cause problems, the trade-off was explained and confirmed with them before it entered a sprint.',
      'Introduced a peer-review checklist, then built an AI-assisted PR review step once pull-request volume outgrew what one reviewer could cover. I also mentored two developers through their onboarding onto the project.',
      'Found the slow path in appointment booking: the availability lookup across doctor schedules, shifts and existing appointments had no composite index to land on. I indexed it and restructured the query around how the screen actually loads its data, rather than leaving it as one join.',
    ],
  },
  {
    company: 'Kozocom',
    role: 'Backend Developer, middle level',
    period: 'Feb 2024 - Mar 2025',
    meta: '16-member team',
    points: [
      'Re-platformed a legacy Python and Django system onto Laravel and PostgreSQL with a sixteen-member Scrum team: one product combining sales with warehouse and inventory management. It sells as well as stores - each sale feeds back into the warehouse, where the warehouse costs are calculated from it.',
      'Carried the data across: CSV imports of roughly 2 to 3 million records per run, and exports at comparable volume, written as chunked batch inserts of fifty rows per worker rather than one model create per row. At that volume the difference is not speed, it is whether the job finishes at all before PHP runs out of memory.',
      'Where the legacy behaviour was ambiguous I read the original Django implementation and confirmed the intended business rule with the client rather than guessing, so the rewrite followed how they actually run the business.',
      'Designed the schemas and business logic along the whole operating flow: goods received into the warehouse, invoicing, shipping against a customer order, remaining-stock recalculation, and the business reporting on top.',
      'Fixed the read paths behind it too, on a screen the client had complained about: eager-loaded the relations the inventory list had been resolving one row at a time - a textbook N+1 - moved the list off paginate() so it stopped paying for a COUNT over the whole table on every request, and re-indexed it. The driving table held one to two million rows and joined several others of the same order, with nothing matching how the screen actually filtered. Afterwards it opened straight away.',
      'Owned every PDF feature across both codebases, inventory and e-commerce, from invoice and document generation through to export, with invoice delivery by fax through a third-party API.',
      'An AWS SQS queue carried the batched data sync across the platform. Added feature and unit tests to the backend workflow, wrote the module documentation, and reviewed code and supported junior developers.',
    ],
  },
  {
    company: 'Flydino Technology',
    role: 'Junior Full-Stack Developer',
    period: 'Apr 2023 - Feb 2024',
    meta: 'Multiple client projects',
    points: [
      'Full-stack on three client platforms - AI skin analysis, driver booking, and project management with recruitment: Laravel on the backend for all three, and the frontend on two of them in Vue 3 with TypeScript and Tailwind, designing the database structures for the new features.',
      'Integrated ChatGPT-4 into a skin-analysis flow: an uploaded facial photo comes back as a skin-condition assessment that feeds a product-recommendation step.',
      'On the project-management and recruitment platform (18-member team): project, task and contract tracking in the shape of Backlog or Asana, wired to a hiring flow so a project short of people can source candidates - onsite, remote or freelance - without leaving the system. Integrated Keycloak SSO, SNS login and S3 or FTP storage, and re-indexed the slow list queries behind the project and task screens.',
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
      'Moved on to three platforms for the same client: two online-retail systems and a product-review platform, with product, order and order-item management throughout. Stripe on the two retail systems: I built the Laravel side and the queued processing that let the endpoint answer immediately, working alongside a senior who took me through signature verification, idempotent handling of retried events, and the refund, failure and reconciliation paths.',
    ],
  },
]

export const featured = {
  name: 'MIA-POS',
  tagline: 'Self-funded, in testing',
  body: 'A point-of-sale and online-store platform for cafes and small F&B businesses. It is in testing, not launched - the legal side is not done - but I pay for it, I run it, and every architectural decision in it is mine to defend.',
  points: [
    'Domain-oriented services behind Nginx, with certbot issuing the TLS certificates: Laravel for auth, admin, users and payments; Go with Gin for stores and inventory; Python with FastAPI for the AI features.',
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
    body: 'Enterprise ERP and MES covering accounting, CRM, HR, billing, orders, shipping and inventory, with an AI feature that drafts emails in the voice of the user sending them. I own the ERP service; the B2B and MES systems it aggregates from are PHP, and I support those.',
    stack: ['NestJS', 'TypeORM', 'Vue 3', 'MySQL', 'RabbitMQ'],
  },
  {
    name: 'Hospital management system',
    period: 'Mar - Aug 2025',
    client: 'Japanese client, 16-member team',
    body: 'Appointment booking, course, shift and contract management, with OAuth via Laravel Passport and push notifications. As Team Leader I owned the architecture, the database design and the stack for the five-person backend team from the start of the project.',
    stack: ['Lumen', 'Laravel', 'MySQL', 'Redis', 'FCM'],
  },
  {
    name: 'Sales, warehouse and inventory platform',
    period: 'Feb 2024 - Mar 2025',
    client: 'Japanese client, 16-member team',
    body: 'A legacy Python and Django system re-platformed onto Laravel and PostgreSQL, combining sales and warehouse in one product: purchasing, selling and store management, goods received into the warehouse, invoicing, shipping against customer orders, stock recalculation and business reporting. Each sale feeds back into the warehouse, where the warehouse costs are calculated from it. PDF generation and export across both this and the e-commerce codebase, plus fax delivery through a third-party API.',
    stack: ['Laravel', 'PostgreSQL', 'Django (legacy)', 'AWS SQS', 'Fax API'],
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
    body: 'Project, task and contract modules with role-based authorization, in the shape of Backlog or Asana, wired to a recruitment flow so a project short of people can source candidates for onsite, remote or freelance engagement inside the same system. Keycloak SSO, and storage across S3 and FTP.',
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
    name: 'E-commerce, payments and reviews',
    period: 'Mar 2022 - Jan 2023',
    client: 'Japanese clients, 3 platforms',
    body: 'A covid test-kit sales platform - product, order and order-item management, CSV import and export, online payment. A product review platform - a publishing platform for reviewers, with review posts, moderation, search and filtering, and ratings. And multi-seller storefronts - seller registration, orders, store management, payment and shipping. Stripe on two of the three, with Redis caching the catalog reads.',
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
      { name: "Let's Encrypt", slug: 'letsencrypt' },
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
  'On the Node side: TypeORM, class-validator, RabbitMQ over @nestjs/microservices, @nestjs/schedule, Passport JWT, Vitest. On the PHP side: Lumen, Eloquent, Laravel Passport, Laravel Telescope, Laravel Reverb. Plus AWS S3, AWS SQS, TLS certificates with Let\'s Encrypt and certbot, Firebase Cloud Messaging, Stripe, Keycloak, Pusher, Google Maps API, and Cloudflare Pages.'

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
    'PHP and Laravel is the depth: four years and nine production systems. NestJS is what I own now, and every measured result above came out of the service I own. Both are current work, and the boundary where they meet is the part I would most want to be asked about.',
  points: [
    {
      title: 'Laravel is the depth, and it is four years deep',
      body: 'Nine production systems since 2021 - HR, three e-commerce, payments and review platforms, driver booking, project management and recruitment, AI skin analysis, warehouse and inventory, and a hospital platform - in teams of seven to twenty, mostly for Japanese clients. Schema design, queue work, review discipline and how to read a slow query are all things I learned in PHP before I wrote any TypeScript. It is not the half of my CV I am moving away from; it is the half that taught me the rest.',
    },
    {
      title: 'I have owned a NestJS service for over a year',
      body: 'I am the only developer on it: NestJS with TypeORM on the server, Vue on the client, inherited with a structure that was not good when it reached me. Reading someone else\'s TypeScript under load and deciding what to change has been most of the actual work.',
    },
    {
      title: 'All five results above came out of the ERP I own',
      body: 'The ERP service is NestJS with TypeORM over MySQL, plus a second Postgres datasource for synced data. The rollup table, the index rebuild, the endpoint split and the batch worker limits were written in TypeScript, not PHP, and the grid fix in its Vue front end. Node is not a language I am hoping to move into.',
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
    body: 'At Sotatek I led the backend team, and it was releasing from a shared dev environment, so nothing was reliably testable. Moving to sprint-scoped feature branches off main gave QC something to plan against, I built the staging server for them to verify on, and nothing reached production without clearing QC first.',
  },
  {
    title: 'Reviews should cost the reviewer less',
    body: 'I introduced a peer-review checklist so reviews stopped being a matter of taste, then an AI-assisted first pass to catch out-of-scope changes before a human reads the diff.',
  },
]

export const contact = {
  headline: 'Open to senior Laravel and Node.js backend roles.',
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
  impactIntro: 'Five problems from the last year, with the numbers that came out the other side.',
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
