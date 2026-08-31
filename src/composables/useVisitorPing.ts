/**
 * Reports a visit to /api/visit on arrival, and dwell time plus clicks to
 * /api/event on the way out. The endpoints hold the Discord webhook; this file
 * holds no secret and sends no display text, only an id, a path, a referrer and
 * a fixed set of click names.
 *
 * Clicks are captured by one delegated listener on the document rather than by
 * handlers on each link, so no section component knows this exists.
 */

import { onMounted, onUnmounted } from 'vue'

const STORE_KEY = 'ntd:visit'

/** A reload inside this window reuses the visit id instead of announcing a new
 *  arrival, so refreshing does not fill the channel. */
const VISIT_TTL_MS = 30 * 60 * 1000

/**
 * Below this, a departure is a bounce or a reload and is not worth a message.
 *
 * The cost of one departure per visit: a reload past this threshold sends the
 * departure early, and the time spent after it is not reported. One accurate
 * pair was judged better than two messages whose numbers have to be added up.
 */
const MIN_DWELL_MS = 5000

type ClickTarget = 'cv' | 'email' | 'phone' | 'linkedin'

type VisitRecord = {
  id: string
  at: number
  clicks: ClickTarget[]
  /** Set once the departure beacon has gone. Kept in storage rather than in a
   *  local flag so a second tab, and a reload, both see that it already went:
   *  one visit is one arrival and one departure, however many tabs it spans. */
  departed?: boolean
}

function newVisitId(): string {
  const bytes = new Uint8Array(3)
  crypto.getRandomValues(bytes)
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
}

/** localStorage rather than sessionStorage so a second tab joins the same
 *  visit. Every access is guarded: Safari's private mode throws on write. */
function loadRecord(): VisitRecord | null {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as VisitRecord
    if (typeof parsed?.id !== 'string' || typeof parsed?.at !== 'number') return null
    if (Date.now() - parsed.at > VISIT_TTL_MS) return null

    return {
      id: parsed.id,
      at: parsed.at,
      clicks: Array.isArray(parsed.clicks) ? parsed.clicks : [],
      departed: parsed.departed === true,
    }
  } catch {
    return null
  }
}

function saveRecord(record: VisitRecord): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(record))
  } catch {
    // Private mode, or storage full. The visit still reports; it just will not
    // survive a reload, which costs one duplicate message at worst.
  }
}

function utmParams(): Record<string, string> {
  const utm: Record<string, string> = {}
  const params = new URLSearchParams(location.search)

  for (const key of ['source', 'medium', 'campaign', 'term', 'content']) {
    const value = params.get(`utm_${key}`)
    if (value) utm[key] = value
  }

  return utm
}

/** Maps a clicked anchor to one of the four targets, or null for the rest. The
 *  server would reject anything else anyway; this keeps the noise off the wire. */
export function targetOf(href: string): ClickTarget | null {
  if (href.startsWith('mailto:')) return 'email'
  if (href.startsWith('tel:')) return 'phone'

  try {
    const url = new URL(href, location.origin)
    if (url.hostname.endsWith('linkedin.com')) return 'linkedin'
    if (url.pathname.toLowerCase().endsWith('.pdf')) return 'cv'
  } catch {
    return null
  }

  return null
}

export function useVisitorPing(): void {
  // Never in `bun run dev`: vite does not run the functions, and the channel
  // does not need a message every time a component hot-reloads.
  if (!import.meta.env.PROD) return

  const openedAt = performance.now()
  let record: VisitRecord | null = null
  let departed = false

  function onClick(event: MouseEvent): void {
    const anchor = (event.target as Element | null)?.closest?.('a')
    if (!anchor) return

    const target = targetOf(anchor.getAttribute('href') ?? '')
    if (!target || !record || record.clicks.includes(target)) return

    record.clicks.push(target)
    saveRecord(record)
  }

  /**
   * `pagehide` is the correct event, but iOS Safari does not reliably fire it,
   * so a hidden tab counts as leaving too. Whichever lands first wins; the
   * guard makes the second one a no-op.
   */
  function onDepart(): void {
    if (departed || !record) return

    const dwellMs = performance.now() - openedAt
    if (dwellMs < MIN_DWELL_MS) return

    departed = true

    // Re-read at the last moment. Another tab on the same visit may already have
    // sent the departure, and may have recorded clicks this tab never saw.
    const stored = loadRecord()
    const shared = stored?.id === record.id ? stored : null
    if (shared?.departed) return

    // A visit longer than the TTL reads back as null, and still deserves its
    // departure: absence of a record is not evidence that one was already sent.
    const clicks = shared?.clicks ?? record.clicks
    saveRecord({ ...record, clicks, departed: true })

    const body = JSON.stringify({ visitId: record.id, dwellMs, clicks })
    // sendBeacon survives the unload that would abort a fetch.
    navigator.sendBeacon('/api/event', new Blob([body], { type: 'application/json' }))
  }

  function onVisibility(): void {
    if (document.visibilityState === 'hidden') onDepart()
  }

  onMounted(() => {
    const existing = loadRecord()
    record = existing ?? { id: newVisitId(), at: Date.now(), clicks: [] }
    saveRecord(record)

    if (!existing) {
      void fetch('/api/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitId: record.id,
          path: location.pathname + location.search,
          referrer: document.referrer || null,
          utm: utmParams(),
        }),
        // The page must not wait on this, and it must not block unload.
        keepalive: true,
      }).catch(() => {
        // A blocked or failed ping is not the visitor's problem.
      })
    }

    addEventListener('pagehide', onDepart)
    document.addEventListener('visibilitychange', onVisibility)
    document.addEventListener('click', onClick, true)
  })

  onUnmounted(() => {
    removeEventListener('pagehide', onDepart)
    document.removeEventListener('visibilitychange', onVisibility)
    document.removeEventListener('click', onClick, true)
  })
}
