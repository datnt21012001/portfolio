# -*- coding: utf-8 -*-
"""Apply the 2026-09-10 title + content upgrade to the canonical CV .docx.

Every change is a whole-<w:p> swap or insertion. Formatting is cloned from the
paragraph being replaced, so styles/numbering/photo parts are never touched.
"""
import sys, re, html
sys.path.insert(0, '/private/tmp/claude-501/-Users-danny-develop-me-portfolio/68275ef1-372a-4440-99bb-a69f4c469677/scratchpad')
from cvlib import load, paras, txt, save, T_RE, DOCX

R_RE = re.compile(r'<w:r\b(?:[^>]*)>.*?</w:r>', re.S)
RPR_RE = re.compile(r'<w:rPr>.*?</w:rPr>', re.S)
PPR_RE = re.compile(r'<w:pPr>.*?</w:pPr>', re.S)

_pid = [0x5A000000]
def next_pid():
    _pid[0] += 1
    return '%08X' % _pid[0]

def set_bold(rpr, on):
    rpr = re.sub(r'<w:b w:val="\d"/>', '<w:b w:val="%d"/>' % on, rpr)
    rpr = re.sub(r'<w:bCs w:val="\d"/>', '<w:bCs w:val="%d"/>' % on, rpr)
    return rpr

def rebuild(p, text):
    """Rebuild paragraph p with `text`, where **x** marks bold runs."""
    ppr_m = PPR_RE.search(p)
    ppr = ppr_m.group(0) if ppr_m else ''
    runs = [r for r in R_RE.findall(p) if T_RE.search(r)]
    assert runs, 'no text runs in template paragraph'
    base = RPR_RE.search(runs[0]).group(0)
    normal = set_bold(base, 0)
    bold = set_bold(base, 1)
    for r in runs:
        rpr = RPR_RE.search(r).group(0)
        if '<w:b w:val="1"/>' in rpr:
            bold = rpr
        elif '<w:b w:val="0"/>' in rpr:
            normal = rpr
    out = []
    for idx, chunk in enumerate(re.split(r'\*\*', text)):
        if not chunk:
            continue
        rpr = bold if idx % 2 else normal
        out.append(
            '<w:r w:rsidDel="00000000" w:rsidR="00000000" w:rsidRPr="00000000">'
            + rpr
            + '<w:t xml:space="preserve">' + html.escape(chunk, quote=False) + '</w:t></w:r>'
        )
    return ('<w:p w:rsidR="00000000" w:rsidDel="00000000" w:rsidP="00000000" '
            'w:rsidRDefault="00000000" w:rsidRPr="00000000" w14:paraId="%s">' % next_pid()
            + ppr + ''.join(out) + '</w:p>')

def title_swap(p, new_text):
    """Single-run title: swap the text, keep the run formatting exactly."""
    ts = T_RE.findall(p)
    assert len(ts) == 1, 'expected single text run, got %d' % len(ts)
    return p.replace('>' + ts[0] + '</w:t>', '>' + html.escape(new_text, quote=False) + '</w:t>')

# --------------------------------------------------------------------------
xml, _ = load(DOCX + '.orig')   # always rebuild from the pre-edit original: idempotent
ps = paras(xml)
edits = {}          # index -> {prefix, kind, text, after:[...]}

def _slot(i, prefix):
    e = edits.setdefault(i, {'prefix': prefix, 'kind': None, 'text': None, 'after': []})
    return e

def R(i, prefix, text):
    e = _slot(i, prefix)
    # Two R() calls on one paragraph used to overwrite each other silently, which
    # is how a stale MIA-POS bullet outlived its replacement. Fail loudly instead.
    assert e['kind'] is None, 'paragraph %d already has a replacement' % i
    e['kind'] = 'replace'; e['text'] = text

def T(i, prefix, text):
    e = _slot(i, prefix); e['kind'] = 'title'; e['text'] = text

def A(i, prefix, texts):
    e = _slot(i, prefix)
    if e['kind'] is None:
        e['kind'] = 'keep'
    e['after'].extend(texts)

# --- header ---------------------------------------------------------------
T(3,  'Backend Engineer', 'Backend Engineer   ·   NestJS / TypeScript   ·   PHP / Laravel')

# --- professional summary -------------------------------------------------
R(7,  'Nearly 5 years',
  'Nearly 5 years of backend engineering across ERP, MES, healthcare, warehouse and e-commerce systems, '
  'mostly for Japanese clients — **PHP/Laravel for four of them**, including a **Python/Django to Laravel '
  're-platform**, and for the past year sole owner of a **NestJS/TypeScript** ERP service end to end.')
R(10, 'Architecture and ownership',
  '**Leading and owning:** as **Team Leader** I set the architecture, database design and technology stack '
  'for a **5-person backend team** from inception, and stepped into delivery management on a project that '
  'had lost three PMs in three months. Today I am the sole developer responsible for one production ERP '
  'service, which aggregates the B2B and MES systems beside it.')

# --- technical skills -----------------------------------------------------
R(14, 'Architecture',
  '**Architecture & Async:** Modular Architecture · RESTful API Design · **Legacy System Migration '
  '(Django → Laravel)** · Queue-Based / Async Processing (RabbitMQ, AWS SQS) · Scheduled Batch Jobs · '
  'Cross-System Data Sync · OAuth2 / JWT (Passport) · SSO (Keycloak)')
R(17, 'Integrations',
  '**Integrations:** Stripe API · OpenAI API · Firebase Cloud Messaging · Pusher · Laravel Reverb · '
  'Google Maps API · SNS Login · Fax API · PDF Generation & Export')
R(15, 'Infrastructure',
  '**Infrastructure & Deployment:** Docker · Nginx · Container Resource Isolation · Linux · AWS S3 · '
  '**SSL/TLS (Let’s Encrypt, certbot)** · GitHub Actions (CI/CD) · Cloudflare Pages · '
  '**Staging Environment Setup** · **System Monitoring & Logging** · Git · GitHub · GitLab')

A(17, 'Integrations', [
  '**Leadership & Process:** Technical Leadership (5-person backend team) · System & Database Design · '
  'Git Flow & Release Management · Sprint Planning & Scheduling · Code Review Process · AI-Assisted PR '
  'Review · Mentoring · Scrum · Jira · Redmine · Backlog · Trello'])

# --- Bear Acer ------------------------------------------------------------
T(20, 'BEAR ACER', 'BEAR ACER COMPANY — Senior Backend Developer')
R(22, 'Sole developer',
  'Sole developer on the ERP service — **NestJS with TypeORM** on the server and **Vue 3 with TypeScript** '
  'on the client, both mine. Inherited it and now own it end to end: architecture, features, frontend, '
  'performance and releases. It aggregates the B2B and MES PHP systems for daily/monthly reporting, support '
  'and email.')

R(31, 'Tech Stack',
  '**Tech Stack:** NestJS, TypeORM, Vue 3, TypeScript, Tailwind, MySQL, PostgreSQL, RabbitMQ, Redis, '
  'Laravel Reverb, Laravel Telescope, Docker, Nginx, certbot, Vitest, Laravel, S3, Linux')
R(30, 'Implemented real-time',
  'Implemented real-time inventory updates with Redis, S3 and Laravel Reverb; wrote unit and feature tests '
  'for new work; ran Laravel Telescope on B2B/MES.')
R(38, 'Tech Stack',
  '**Tech Stack:** Lumen, Laravel, MySQL, Redis, Laravel Reverb, Docker, Nginx, S3, OAuth2/Laravel '
  'Passport, Firebase Cloud Messaging, Swagger, Linux')
R(18, 'Working knowledge',
  '**Working knowledge (side project):** Go (Gin) · FastAPI · Bun')
R(93, 'Self-directed and self-funded',
  'Self-funded POS / online-store platform split by language behind **Nginx**, with certbot issuing the TLS '
  'certificates: Laravel for auth, admin and payments; **Go with Gin** for stores, inventory and the log '
  'worker; Python with **FastAPI** for the AI features; three **Vue 3** TypeScript apps in a Bun workspace.')
R(94, 'The services still share',
  'The services still share one database — a modular monolith, a deliberate trade-off at this stage. CI/CD '
  'on GitHub Actions.')
R(95, 'Tech Stack',
  '**Tech Stack:** Laravel, Go, Gin, FastAPI, PostgreSQL, PgBouncer, Redis, RabbitMQ, Soketi, Vue 3, '
  'TypeScript, Tailwind, Bun, Nginx, certbot, Cloudflare Pages, GitHub Actions')

# --- Sotatek --------------------------------------------------------------
T(32, 'SOTATEK', 'SOTATEK COMPANY — Team Leader (Backend)')
R(34, 'Joined a hospital',
  '**Team Leader for the 5-person backend team** on a hospital management system built from inception: '
  'I owned the system architecture, the database design and the technical solutions, and ran the team’s '
  'Git flow.')
A(34, 'Joined a hospital', [
  '**The project had run through three project managers in three months** and was slipping. Without holding '
  'the title I stepped in on delivery — planning, timelines and release schedules for dev and QC — and '
  'focused on what was actually causing the issues.'])
R(35, "Redesigned the team",
  '**Rebuilt the release process on a project carrying real delivery risk:** ad-hoc “dev-environment” '
  'releases became feature branches cut from main with sprint-scoped planning, so QC could plan test cases '
  'per sprint and nothing reached production without clearing QC first — avoidable issues fell and releases '
  'held their schedule.')
A(35, "Redesigned the team", [
  '**Built the staging server that the new process needed** — the old flow had nowhere to verify a release '
  'before it shipped — and added **system monitoring and logging** so an issue could be investigated from '
  'evidence instead of guessed at.',
  'Raised scope risk before it became a bug: when a ticket the client wanted was likely to cause problems, '
  'the trade-off was explained and confirmed with them before it entered a sprint.'])
R(36, 'Introduced a peer-review',
  'Introduced a peer-review checklist, then **built an AI-assisted PR review step** once pull-request volume '
  'outgrew what one reviewer could cover, so review capacity stopped being the ceiling on quality. '
  'Mentored two developers through their onboarding.')

# --- new work he described on 2026-09-10 -----------------------------------
R(12, 'Languages',
  '**Languages & Frameworks:** PHP/Laravel (4 yrs) · TypeScript (2 yrs) · JavaScript (2 yrs) · '
  'NestJS (1 yr) · Vue 3 (2 yrs) · Tailwind · Lumen')
A(25, 'A multi-column filter', [
  '**The API was fast and the screen was still slow.** One report page painted 100 rows against roughly 100 '
  'columns — twelve months by eight figures each, plus totals and the yearly average — into a vxe-table, so '
  'the browser was the bottleneck once the query returned. Capped what the front end pulls per page and '
  'moved the columns onto horizontal lazy loading.'])
A(29, 'Designed and built the MES Billing', [
  'Built an **AI email-drafting feature**: it composes emails in the voice of the user sending them, '
  'matching their tone and writing style.'])
R(43, 'Cut the read-path cost',
  'Cut the read-path cost of the inventory list, which the client had raised as a complaint: eager-loaded '
  'the relations it had been resolving one row at a time (a textbook **N+1**), moved the list off '
  'paginate() so it stopped paying for a COUNT over the whole table on every request, and **re-indexed it** '
  '— the driving table held **1–2M rows and joined several others of the same order**, with nothing matching '
  'how the screen actually filtered. Afterwards the list opened straight away.')

# --- Kozocom --------------------------------------------------------------
R(41, 'Built and maintained',
  '**Re-platformed a legacy Python/Django system onto Laravel and PostgreSQL** with a 16-member Scrum team '
  '— one product combining sales with warehouse and inventory management — under clean-code and '
  'clean-architecture practices.')
R(42, 'Legacy-to-new-system',
  'Carried the data across: **CSV import of ~2–3 million records per run, and export at comparable volume**, '
  'written as chunked insert() batches of 50 rows per worker rather than one model create per row. At that '
  'volume the risk is not speed but PHP running out of memory before the job finishes.')
A(42, 'Legacy-to-new-system', [
  'Where the legacy behaviour was ambiguous I read the original Django implementation and **confirmed the '
  'intended business rule with the client** rather than guessing, so the rewrite followed how they actually '
  'run the business.'])
R(44, 'Designed the database schemas',
  'Designed the schemas and business logic along the customer’s operating flow: **goods-in, invoicing, '
  'shipping against a customer order, remaining-stock recalculation and business reporting**. The platform '
  'sells as well as stores — each sale’s data flows back into the warehouse, where the warehouse costs are '
  'calculated from it.')
A(44, 'Designed the database schemas', [
  '**Owned every PDF feature across both codebases**, inventory and e-commerce, from generation through to '
  'export.'])
R(45, 'An AWS SQS queue',
  'An **AWS SQS** queue handled batched data sync platform-wide, with invoice delivery by **fax through a '
  'third-party API**. Added feature and unit tests, wrote the module documentation, reviewed code and '
  'supported junior developers.')
R(46, 'Tech Stack',
  '**Tech Stack:** Laravel, PostgreSQL, AWS SQS, Swagger, Redis, Pusher, Fax API, PDF Export, Nginx, Linux, '
  'Python/Django (legacy source)')

R(37, 'Found the slow path',
  'Found the slow path in appointment booking: the availability lookup across doctor schedules, shifts and '
  'existing appointments had no composite index to land on. Added one and restructured the query around how '
  'the screen actually loads its data. Also implemented OAuth via Laravel Passport.')
R(24, 'Three CRM endpoints',
  '**Three CRM endpoints: 18.2s → 64ms, 8.8s → 60ms, 6.1s → 187ms.** The worst was a LEFT JOIN across ~18 '
  'tables (contacts 1M, contact info 2M rows); I split it into a fast main-record call plus a deferred '
  'contract call for the heavier data.')

# --- Flydino --------------------------------------------------------------
T(47, 'FLYDINO', 'FLYDINO TECHNOLOGY COMPANY — Junior Full-Stack Developer')
R(49, 'Independently delivered',
  '**Full-stack on three client platforms** — AI skin analysis, driver booking, and project management with '
  'recruitment: Laravel on the backend for all three, and the frontend on two of them in **Vue 3 with '
  'TypeScript** and Tailwind, designing the database structures for the new features.')
R(51, 'Integrated Keycloak',
  'On the project-management and recruitment platform (18-member team): project, task and contract tracking '
  'in the shape of Backlog or Asana, **wired to a hiring flow so a project short of people can source '
  'candidates — onsite, remote or freelance — without leaving the system**. Integrated Keycloak SSO, SNS '
  'login and S3/FTP storage, and **re-indexed the slow list queries** behind the project and task screens.')

# --- Nine Plus ------------------------------------------------------------
R(56, 'Implemented features',
  'Implemented features for an HR management system — schemas and business logic for the recruitment and HR '
  'modules — then across three platforms: two online-retail systems and **a product-review platform**. '
  'Product, order and order-item management throughout, plus **Stripe** on the two retail systems: I built '
  'the Laravel side and the queued processing that let the endpoint answer immediately, **working with a '
  'senior** who guided me through signature verification, idempotent handling of retried events, and the '
  'refund, failure and reconciliation paths.')

T(54, 'Oct 2021', 'Oct 2021 – Apr 2023  |  Japanese client  |  12–20 member teams')

# --- Selected projects ----------------------------------------------------
R(65, 'Appointment booking',
  'Appointment booking against doctor schedules and shifts, plus course, shift and contract management, '
  'OAuth via Laravel Passport and push notifications. **As Team Leader I owned the architecture, database '
  'design and stack for the 5-person backend team**.')
T(67, 'Warehouse', 'Sales, Warehouse & Inventory Platform')
R(69, 'Sales and warehouse',
  '**A legacy Python/Django system re-platformed onto Laravel and PostgreSQL**, combining sales and '
  'warehouse in one product: purchasing, selling and store management, goods-in, invoicing, shipping '
  'against customer orders, remaining-stock recalculation and business reporting, with each sale feeding '
  'back into the warehouse costing. PDF documents and export, fax delivery through a third-party API, and '
  'an AWS SQS queue carrying batched data sync platform-wide.')
R(70, 'Tech Stack',
  '**Tech Stack:** Laravel, PostgreSQL, AWS SQS, Redis, Swagger, Pusher, Fax API, PDF Export, Nginx, Linux, '
  'Python/Django (legacy source)')
R(77, 'Contract, project and task',
  'Project, task and contract modules with role-based authorization, in the shape of Backlog or Asana — '
  '**wired to a recruitment flow so a project short of people can source candidates for onsite, remote or '
  'freelance engagement inside the same system**. Keycloak SSO, SNS authentication, and storage across S3 '
  'and FTP.')
R(86, 'Store product showcase',
  '**Product review platform** — a publishing platform for reviewers: review posts on products, moderation, '
  'search and filtering, and ratings. Aug – Oct 2022, 7 members.')
R(88, 'Integrated Stripe checkout',
  'Integrated Stripe checkout on the storefronts and the online-retail platform, SNS login on the '
  'storefronts and the review platform, and Redis caching the catalog reads.')


# --- length trims on paragraphs that duplicate content stated elsewhere ---
R(27, 'Found CPU/RAM contention',
  'Batch jobs and the app server shared one container on an inherited codebase with no monitoring — '
  'docker stats showed the CPU/RAM contention after users reported slowdowns. Split batch into a dedicated '
  'worker container with hard limits (0.5 CPU / 512MB) and Node.js CPU self-throttling, stabilising the app '
  'server.')
R(28, 'Built the cross-system sync',
  'Built the cross-system sync between the PHP estate and the ERP — a shared sync database, 12 scheduled '
  'batch jobs and 3 RabbitMQ consumers recomputing the summaries.')
R(61, 'Enterprise ERP and MES',
  'Enterprise ERP and MES covering accounting, CRM, HR, billing, orders, shipping and inventory. The ERP '
  'service is mine end to end; the B2B and MES systems it aggregates from are PHP, and I contribute there '
  'too.')

R(52, 'Tech Stack',
  '**Tech Stack:** Laravel, Vue 3, TypeScript, Tailwind, MySQL, Swagger, S3, Keycloak, Pusher, '
  'Google Maps API, Nginx')
R(78, 'Tech Stack',
  '**Tech Stack:** Laravel (RESTful API), Vue 3, TypeScript, Tailwind, MySQL, Swagger, S3, Keycloak, '
  'Pusher, Nginx')

# ---------------------------------------------------------------------------

applied = 0
for i in sorted(edits):
    e = edits[i]
    src = ps[i]
    got = txt(src)
    assert got.replace('&amp;', '&').startswith(e['prefix']), \
        'paragraph %d does not start with %r (got %r)' % (i, e['prefix'], got[:80])
    assert xml.count(src) == 1, 'paragraph %d XML occurs %d times' % (i, xml.count(src))
    if e['kind'] == 'title':
        new = title_swap(src, e['text'])
    elif e['kind'] == 'replace':
        new = rebuild(src, e['text'])
    else:
        new = src
    new += ''.join(rebuild(src, t) for t in e['after'])
    xml = xml.replace(src, new, 1)
    applied += 1 + len(e['after'])


# Reclaim vertical space so the additions still land on 3 pages. Values only;
# keepNext is deliberately untouched (adding it to date lines costs a page).
head, body = xml[:xml.find('</w:tbl>')], xml[xml.find('</w:tbl>'):]
for old, new in (
    ('<w:spacing w:after="40" w:before="0" w:line="240"', '<w:spacing w:after="4" w:before="0" w:line="234"'),  # bullets: gap + 2.5% line height
    ('<w:spacing w:after="30" w:before="115"', '<w:spacing w:after="16" w:before="46"'),   # project titles
    ('<w:spacing w:after="80" w:before="190"', '<w:spacing w:after="34" w:before="70"'),   # section headings
    ('<w:spacing w:after="40" w:before="185"', '<w:spacing w:after="22" w:before="80"'),   # job headings
):
    print('  spacing %-40s x%d' % (old.split('"')[1] + '/' + old.split('"')[3], body.count(old)))
    body = body.replace(old, new)
xml = head + body

print('edits applied:', applied)
import zipfile, os
core = zipfile.ZipFile(DOCX + '.orig').read('docProps/core.xml').decode('utf-8')
if '<dc:title>' not in core:
    core = core.replace('<dcterms:created',
        '<dc:title>Nguyen Thanh Dat - Senior Backend Engineer</dc:title><dcterms:created')

tmp = DOCX + '.tmp'
zin = zipfile.ZipFile(DOCX + '.orig')
zout = zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED)
for item in zin.infolist():
    data = zin.read(item.filename)
    if item.filename == 'word/document.xml':
        data = xml.encode('utf-8')
    elif item.filename == 'docProps/core.xml':
        data = core.encode('utf-8')
    zout.writestr(item, data)
zout.close(); zin.close()
os.replace(tmp, DOCX)
print('written:', DOCX)
