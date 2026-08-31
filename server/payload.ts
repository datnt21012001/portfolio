/**
 * The trust boundary. Both endpoints are unauthenticated, so nothing from the
 * browser reaches Discord unless it survives this file: identifiers are matched
 * against a pattern, numbers are clamped, click targets come from a closed set,
 * and the three free-text fields are truncated here and fenced at render time.
 */

export const CLICK_TARGETS = ['cv', 'email', 'phone', 'linkedin'] as const
export type ClickTarget = (typeof CLICK_TARGETS)[number]

const UTM_KEYS = ['source', 'medium', 'campaign', 'term', 'content'] as const
export type UtmKey = (typeof UTM_KEYS)[number]

/** Long enough for a real referrer, short enough that no embed field overflows. */
const TEXT_MAX = 200
const SIX_HOURS_MS = 6 * 60 * 60 * 1000

export type VisitPayload = {
  visitId: string
  path: string
  referrer: string | null
  utm: Partial<Record<UtmKey, string>>
}

export type EventPayload = {
  visitId: string
  dwellMs: number
  clicks: ClickTarget[]
}

function record(raw: unknown): Record<string, unknown> | null {
  return typeof raw === 'object' && raw !== null && !Array.isArray(raw)
    ? (raw as Record<string, unknown>)
    : null
}

function text(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  // Control characters would let a value break out of the code span it renders in.
  const clean = raw.replace(/[\u0000-\u001F\u007F]/g, '').trim()
  return clean ? clean.slice(0, TEXT_MAX) : null
}

export function isVisitId(raw: unknown): raw is string {
  return typeof raw === 'string' && /^[0-9a-f]{6}$/.test(raw)
}

export function parseVisit(raw: unknown): VisitPayload | null {
  const body = record(raw)
  if (!body || !isVisitId(body.visitId)) return null

  const utm: Partial<Record<UtmKey, string>> = {}
  const given = record(body.utm)
  if (given) {
    for (const key of UTM_KEYS) {
      const value = text(given[key])
      if (value) utm[key] = value
    }
  }

  return {
    visitId: body.visitId,
    path: text(body.path) ?? '/',
    referrer: text(body.referrer),
    utm,
  }
}

export function parseEvent(raw: unknown): EventPayload | null {
  const body = record(raw)
  if (!body || !isVisitId(body.visitId)) return null

  const given = typeof body.dwellMs === 'number' && Number.isFinite(body.dwellMs) ? body.dwellMs : 0
  const dwellMs = Math.min(Math.max(given, 0), SIX_HOURS_MS)

  const clicks: ClickTarget[] = []
  for (const item of Array.isArray(body.clicks) ? body.clicks : []) {
    const target = item as ClickTarget
    if (CLICK_TARGETS.includes(target) && !clicks.includes(target)) clicks.push(target)
  }

  return { visitId: body.visitId, dwellMs, clicks }
}

/** `2m 14s`, `45s`, `1h 3m`. Rendered by the server so the client never
 *  supplies display text. */
export function formatDwell(ms: number): string {
  const total = Math.round(ms / 1000)
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60

  if (hours) return `${hours}h ${minutes}m`
  if (minutes) return `${minutes}m ${seconds}s`
  return `${seconds}s`
}
